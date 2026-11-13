import { DurableObject } from 'cloudflare:workers';
import { isSlide, slideCount, presenterKeyPattern, type RoomSnapshot } from '../src/live-protocol';

interface Env {
  ASSETS: Fetcher;
  ROOMS: DurableObjectNamespace<PresentationRoom>;
  PRESENTER_KEY?: string;
}

type Member = { presenter: boolean; slide: number | null };
const protocol = 'phi102';
const connectionLimit = 500;
const error = (message: string, status: number) => new Response(message, { status });

export default {
  fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/live') {
      if (request.headers.get('Origin') !== url.origin) return error('Origin not allowed', 403);
      if (request.headers.get('Upgrade')?.toLowerCase() !== 'websocket') return error('WebSocket required', 426);
      return env.ROOMS.getByName('phi102').fetch(request);
    }
    if (url.pathname.startsWith('/api/')) return error('Not found', 404);
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

export class PresentationRoom extends DurableObject<Env> {
  private slide = 0;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    ctx.blockConcurrencyWhile(async () => {
      const saved = await ctx.storage.get<number>('slide');
      if (isSlide(saved)) this.slide = saved;
    });
    ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair('ping', 'pong'));
  }

  async fetch(request: Request) {
    const protocols = (request.headers.get('Sec-WebSocket-Protocol') ?? '').split(',').map(value => value.trim());
    if (protocols[0] !== protocol) return error('Unsupported protocol', 400);
    const candidate = protocols[1];
    const secret = this.env.PRESENTER_KEY;
    const encoder = new TextEncoder();
    const presenter = Boolean(secret && presenterKeyPattern.test(secret) && candidate &&
      presenterKeyPattern.test(candidate) &&
      crypto.subtle.timingSafeEqual(encoder.encode(secret), encoder.encode(candidate)));
    const [client, server] = Object.values(new WebSocketPair());
    this.ctx.acceptWebSocket(server);
    if ((candidate && !presenter) || (!presenter && this.ctx.getWebSockets().length > connectionLimit)) {
      server.send(JSON.stringify({ type: 'rejected', code: candidate ? 4003 : 4008 }));
      server.close(candidate ? 4003 : 4008);
    } else {
      server.serializeAttachment({ presenter, slide: this.slide } satisfies Member);
      if (presenter) {
        // Keep one authoritative presenter when the private link is reopened.
        for (const previous of this.ctx.getWebSockets()) {
          if (previous !== server && (previous.deserializeAttachment() as Member | null)?.presenter) {
            previous.serializeAttachment(null);
            previous.close(4009, 'Presenter opened in another tab');
          }
        }
      }
      this.broadcast();
    }
    return new Response(null, { status: 101, webSocket: client, headers: { 'Sec-WebSocket-Protocol': protocol } });
  }

  async webSocketMessage(socket: WebSocket, payload: string | ArrayBuffer) {
    const member = socket.deserializeAttachment() as Member | null;
    if (!member || typeof payload !== 'string' || payload.length > 128) return;
    let message: { type?: unknown; slide?: unknown } | null;
    try { message = JSON.parse(payload); } catch { return; }
    if (message?.type === 'view' && !member.presenter && (message.slide === null || isSlide(message.slide))) {
      if (member.slide === message.slide) return;
      socket.serializeAttachment({ ...member, slide: message.slide });
    } else if (message?.type === 'present' && member.presenter && isSlide(message.slide)) {
      if (this.slide === message.slide) return;
      this.slide = message.slide;
      await this.ctx.storage.put('slide', this.slide);
    } else {
      return;
    }
    this.broadcast();
  }

  webSocketClose(socket: WebSocket) { this.remove(socket); }
  webSocketError(socket: WebSocket) { this.remove(socket); }

  private remove(socket: WebSocket) {
    socket.serializeAttachment(null);
    socket.close();
    this.broadcast();
  }

  private broadcast() {
    const sockets = this.ctx.getWebSockets().filter(socket => socket.readyState === WebSocket.OPEN);
    const counts = Array<number>(slideCount).fill(0);
    let presenterOnline = false;
    let browsing = 0;
    for (const socket of sockets) {
      const member = socket.deserializeAttachment() as Member | null;
      if (!member) continue;
      if (member.presenter) presenterOnline = true;
      else if (isSlide(member.slide)) counts[member.slide]++;
      else browsing++;
    }
    const message = JSON.stringify({
      type: 'state', presenterSlide: this.slide, presenterOnline, counts, browsing,
    } satisfies RoomSnapshot);
    for (const socket of sockets) {
      try { socket.send(message); } catch { socket.close(1011, 'Reconnect'); }
    }
  }
}
