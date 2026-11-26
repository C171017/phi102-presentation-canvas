import { DurableObject } from 'cloudflare:workers';
import { sharedSlidesPath } from '../src/shared-slide-data';
import type { SharedSlidesEnv } from './shared-slides';
export { SharedSlideHistory } from './shared-slides';
import { serveVideo } from './video-assets';
import openingMedia from '../src/opening-media.json';
import { slides } from '../src/slide-content';
import { newOpeningQuiz, openingQuizWindowMs, recordOpeningVote, type OpeningQuizRound } from '../src/opening-quiz';
import { countSchools, isSchoolVote, type SchoolVote } from '../src/school-vote';
import { inkPassageStarts, customCueOffset } from '../src/classroom-cues';
import { establishingCueOffset, firstPresentationCue, isCue, isSlide, slideCount, presenterKeyPattern, type RoomSnapshot } from '../src/live-protocol';

import { foundationalismScene } from '../src/regress-responses';

interface Env extends SharedSlidesEnv {
  ASSETS: Fetcher;
  ROOMS: DurableObjectNamespace<PresentationRoom>;
  PRESENTER_KEY?: string;
}

type Member = { presenter: boolean; slide: number | null; schoolVote?: SchoolVote };
const protocol = 'phi102';
const connectionLimit = 500;
const error = (message: string, status: number) => new Response(message, { status });

export default {
  fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === sharedSlidesPath || url.pathname.startsWith(`${sharedSlidesPath}/`)) {
      return env.SHARED_SLIDES.getByName('presentation').fetch(request);
    }
    if (url.pathname === '/api/opening-quiz') {
      if (request.method !== 'GET' && request.headers.get('Origin') !== url.origin) return error('Origin not allowed', 403);
      return env.ROOMS.getByName('phi102').fetch(request);
    }
    if (url.pathname === '/api/live') {
      if (request.headers.get('Origin') !== url.origin) return error('Origin not allowed', 403);
      if (request.headers.get('Upgrade')?.toLowerCase() !== 'websocket') return error('WebSocket required', 426);
      return env.ROOMS.getByName('phi102').fetch(request);
    }
    if (url.pathname.startsWith('/api/')) return error('Not found', 404);
    if (url.pathname === openingMedia.path) return serveVideo(request, env.ASSETS, openingMedia.bytes);
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

export class PresentationRoom extends DurableObject<Env> {
  private slide = 0;
  private cue = 0;
  private openingQuiz = newOpeningQuiz();

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    ctx.blockConcurrencyWhile(async () => {
      this.openingQuiz = await ctx.storage.get<OpeningQuizRound>('openingQuiz') ?? this.openingQuiz;
      const savedId = await ctx.storage.get<string>('slideId');
      if (savedId) {
        const passage = inkPassageStarts.get(savedId);
        const slideId = savedId === 'L4-quiz' ? foundationalismScene
          : savedId === 'L5b' ? 'L6' : passage?.scene ?? savedId;
        const index = slides.findIndex(slide => slide.members[0] === slideId);
        if (isSlide(index)) this.slide = index;
        if (slideId !== savedId) {
          if (passage) {
            const cue = await ctx.storage.get<number>('presenterCue');
            this.cue = isCue(cue) && cue >= customCueOffset * 2 ? cue
              : passage.number + (isCue(cue) && cue < establishingCueOffset ? cue : 0);
          } else {
            this.cue = firstPresentationCue(this.slide);
          }
          await ctx.storage.put({ slide: this.slide, slideId, presenterCue: this.cue });
        } else {
          const cue = await ctx.storage.get<number>('presenterCue');
          if (isCue(cue)) this.cue = cue;
        }
      } else {
        // Older rooms stored a numeric position in the pre–Ink Ocean slide rail.
        const previous = await ctx.storage.get<number>('slide');
        if (previous !== undefined) {
          const previousIds = [
            'unitrans-arrival', 'before-lecture', 'contemporary-heading', 'flexible-heading',
            'aim-motivations', 'aim-versions', 'aim-applications', 'regress-problem',
            'regress-skepticism', 'regress-infinitism', 'regress-coherentism', 'regress-foundationalism',
            'dilemma-heading', 'undoubted-heading', 'route-social-heading', 'route-hinges-heading',
            'route-knowledge-heading', 'versions-map-heading', 'pairings-heading',
            'pairing-social-simone', 'pairing-social-cole', 'pairing-hinges-simone', 'pairing-hinges-cole',
            'pairing-knowledge-simone', 'pairing-knowledge-cole', 'pairing-knowledge-rae',
            'pairing-knowledge-echo', 'pairing-belief', 'access-heading', 'home-heading', 'mobile-heading',
          ];
          const id = previousIds[previous];
          const index = slides.findIndex(slide => slide.members[0] === (inkPassageStarts.get(id)?.scene ?? id));
          if (isSlide(index)) this.slide = index;
        }
        await ctx.storage.put({ slideId: slides[this.slide].members[0], presenterCue: 0 });
      }
    });
    ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair('ping', 'pong'));
  }

  async fetch(request: Request) {
    if (new URL(request.url).pathname === '/api/opening-quiz') return this.openingQuizRequest(request);
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
    if (!member || typeof payload !== 'string' || payload.length > 256) return;
    let message: { type?: unknown; slide?: unknown; cue?: unknown } | null;
    try { message = JSON.parse(payload); } catch { return; }
    if (isSchoolVote(message) && !member.presenter) {
      if (member.schoolVote?.voter === message.voter && member.schoolVote.school === message.school) return;
      socket.serializeAttachment({ ...member, schoolVote: message });
      this.broadcast();
      return;
    }
    if (message?.type === 'view' && !member.presenter && (message.slide === null || isSlide(message.slide))) {
      if (member.slide === message.slide) return;
      socket.serializeAttachment({ ...member, slide: message.slide });
    } else if (message?.type === 'cue' && member.presenter && message.slide === this.slide && isCue(message.cue)) {
      if (message.cue === this.cue) return;
      this.cue = message.cue;
      await Promise.all([this.ctx.storage.put('presenterCue', this.cue), this.beginOpeningQuiz()]);
    } else if (message?.type === 'present' && member.presenter && isSlide(message.slide)) {
      if (this.slide === message.slide) return;
      this.slide = message.slide;
      this.cue = isCue(message.cue) ? message.cue : firstPresentationCue(this.slide);
      await Promise.all([this.ctx.storage.put({ slide: this.slide, slideId: slides[this.slide].members[0],
        presenterCue: this.cue }), this.beginOpeningQuiz()]);
    } else {
      return;
    }
    this.broadcast();
  }

  private async openingQuizRequest(request: Request) {
    if (request.method === 'PUT') {
      const voter = request.headers.get('x-quiz-voter');
      const answer = request.headers.get('x-quiz-choice');
      if (!voter || !/^[a-f0-9-]{36}$/.test(voter) || (answer !== 'B' && answer !== '13')) {
        return error('Invalid quiz ballot', 400);
      }
      const currentRound = request.headers.get('x-quiz-round');
      if (currentRound && currentRound !== this.openingQuiz.round) return error('Quiz round changed', 409);
      if (this.connectedMembers().some(member => member.presenter) &&
          (!this.isOpeningQuestion() || this.openingQuiz.closesAt <= Date.now())) {
        return error('Voting window closed', 409);
      }
      if (!this.openingQuiz.ballots[voter] && Object.keys(this.openingQuiz.ballots).length >= connectionLimit) {
        return error('Quiz is full', 429);
      }
      if (recordOpeningVote(this.openingQuiz, voter, answer)) {
        await this.ctx.storage.put('openingQuiz', this.openingQuiz);
        this.broadcast();
      }
    } else if (request.method !== 'GET') return error('Method not allowed', 405);
    return Response.json(this.openingQuiz.counts, { headers: { 'Cache-Control': 'no-store' } });
  }

  private isOpeningQuestion() {
    return slides[this.slide]?.members[0] === 'contemporary-heading' && this.cue === 1;
  }

  private beginOpeningQuiz() {
    if (!this.isOpeningQuestion()) return;
    this.openingQuiz = newOpeningQuiz(Date.now() + openingQuizWindowMs);
    return this.ctx.storage.put('openingQuiz', this.openingQuiz);
  }

  // Consume any pending alarm from a room created before the regress poll was removed.
  async alarm() {}

  webSocketClose(socket: WebSocket) { return this.remove(socket); }
  webSocketError(socket: WebSocket) { return this.remove(socket); }

  private remove(socket: WebSocket) {
    socket.serializeAttachment(null);
    socket.close();
    return this.broadcast();
  }

  private connectedMembers() {
    return this.ctx.getWebSockets().filter(s => s.readyState === WebSocket.OPEN)
      .map(s => s.deserializeAttachment() as Member | null).filter((m): m is Member => m !== null);
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
    const state: RoomSnapshot = { type: 'state', presenterSlide: this.slide, presenterCue: this.cue, presenterOnline, counts, browsing,
      schools: countSchools(this.connectedMembers()), openingQuiz: {
        counts: this.openingQuiz.counts, round: this.openingQuiz.round,
        closesAt: presenterOnline && this.isOpeningQuestion() ? this.openingQuiz.closesAt : 0,
      } };
    const message = JSON.stringify(state);
    for (const socket of sockets) {
      if (!socket.deserializeAttachment()) continue;
      try { socket.send(message); }
      catch { socket.close(1011, 'Reconnect'); }
    }
  }
}
