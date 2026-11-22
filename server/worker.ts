import { DurableObject } from 'cloudflare:workers';
import { isSlide, slideCount, presenterKeyPattern, type RoomSnapshot } from '../src/live-protocol';

import { applyTheoryAction, ballotSlide, resolveBallot, theoryVoteWindowMs, voteView, type TheoryAction, type TheoryBallot } from '../src/theory-vote';

interface Env {
  ASSETS: Fetcher;
  ROOMS: DurableObjectNamespace<PresentationRoom>;
  PRESENTER_KEY?: string;
}

type Member = { id?: string; presenter: boolean; slide: number | null };
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
  private ballot: TheoryBallot | null = null;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    ctx.blockConcurrencyWhile(async () => {
      const saved = await ctx.storage.get<number>('slide');
      if (isSlide(saved)) this.slide = saved;
      this.ballot = await ctx.storage.get<TheoryBallot>('theoryBallot') ?? null;
      if (this.ballot && !this.ballot.winner && !this.ballot.closesAt) {
        this.ballot.closesAt = Date.now() + theoryVoteWindowMs;
        await Promise.all([ctx.storage.put('theoryBallot', this.ballot), ctx.storage.setAlarm(this.ballot.closesAt)]);
      }
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
      server.serializeAttachment({ id: crypto.randomUUID(), presenter, slide: this.slide } satisfies Member);
      if (presenter) {
        // Keep one authoritative presenter when the private link is reopened.
        for (const previous of this.ctx.getWebSockets()) {
          if (previous !== server && (previous.deserializeAttachment() as Member | null)?.presenter) {
            previous.serializeAttachment(null);
            previous.close(4009, 'Presenter opened in another tab');
          }
        }
      }
      await this.broadcast();
    }
    return new Response(null, { status: 101, webSocket: client, headers: { 'Sec-WebSocket-Protocol': protocol } });
  }

  async webSocketMessage(socket: WebSocket, payload: string | ArrayBuffer) {
    const member = socket.deserializeAttachment() as Member | null;
    if (!member || typeof payload !== 'string' || payload.length > 256) return;
    let message: { type?: unknown; slide?: unknown } | null;
    try { message = JSON.parse(payload); } catch { return; }
    if (message?.type === 'theory') {
      const members = this.connectedMembers();
      const voters = members.filter(m => !m.presenter).map(m => m.id!);
      const hasPresenter = members.some(m => m.presenter);
      const slide = member.presenter ? this.slide : member.slide;
      if (slide === null || (hasPresenter && slide !== this.slide)) return;
      const action = message as TheoryAction;
      const id = this.member(socket)!.id!;
      const previousRound = this.ballot?.id;
      this.ballot = applyTheoryAction(this.ballot, action, slide,
        member.presenter || (!hasPresenter && action.action === 'open'), id, voters);
      const alarm = this.ballot && this.ballot.id !== previousRound
        ? this.ctx.storage.setAlarm(this.ballot.closesAt) : undefined;
      await Promise.all([alarm, this.broadcast(true)]);
      return;
    }
    if (message?.type === 'view' && !member.presenter && (message.slide === null || isSlide(message.slide))) {
      if (member.slide === message.slide) return;
      socket.serializeAttachment({ ...member, slide: message.slide });
    } else if (message?.type === 'present' && member.presenter && isSlide(message.slide)) {
      if (this.slide === message.slide) return;
      this.slide = message.slide;
      this.ballot = null;
      await this.ctx.storage.put({ slide: this.slide, theoryBallot: null });
    } else {
      return;
    }
    await this.broadcast();
  }

  async alarm() {
    if (!this.ballot || this.ballot.winner) return;
    if (Date.now() < this.ballot.closesAt) {
      await this.ctx.storage.setAlarm(this.ballot.closesAt);
      return;
    }
    await this.broadcast();
  }

  webSocketClose(socket: WebSocket) { return this.remove(socket); }
  webSocketError(socket: WebSocket) { return this.remove(socket); }

  private remove(socket: WebSocket) {
    socket.serializeAttachment(null);
    socket.close();
    return this.broadcast();
  }

  private member(socket: WebSocket) {
    const member = socket.deserializeAttachment() as Member | null;
    if (member && !member.id) {
      member.id = crypto.randomUUID();
      socket.serializeAttachment(member);
    }
    return member;
  }

  private connectedMembers() {
    return this.ctx.getWebSockets().filter(s => s.readyState === WebSocket.OPEN)
      .map(s => this.member(s)).filter((m): m is Member => m !== null);
  }

  private async broadcast(saveBallot = false) {
    const sockets = this.ctx.getWebSockets().filter(socket => socket.readyState === WebSocket.OPEN);
    const counts = Array<number>(slideCount).fill(0);
    let presenterOnline = false;
    let browsing = 0;
    const voters: string[] = [];
    for (const socket of sockets) {
      const member = this.member(socket);
      if (!member) continue;
      if (!member.presenter) voters.push(member.id!);
      if (member.presenter) presenterOnline = true;
      else if (isSlide(member.slide)) counts[member.slide]++;
      else browsing++;
    }
    if (this.ballot) {
      const previous = this.ballot.winner;
      resolveBallot(this.ballot, voters);
      this.slide = ballotSlide(this.ballot);
      saveBallot ||= previous !== this.ballot.winner;
    }
    const theory = this.ballot ? voteView(this.ballot, voters) : undefined;
    const state: RoomSnapshot = { type: 'state', presenterSlide: this.slide, presenterOnline, counts, browsing };
    const save = saveBallot ? this.ctx.storage.put({ slide: this.slide, theoryBallot: this.ballot }) : undefined;
    for (const socket of sockets) {
      const member = this.member(socket);
      if (!member) continue;
      const mine = this.ballot?.ballots[member.id!];
      try { socket.send(JSON.stringify({ ...state, theory: theory && { ...theory, mine } })); }
      catch { socket.close(1011, 'Reconnect'); }
    }
    await save;
  }
}
