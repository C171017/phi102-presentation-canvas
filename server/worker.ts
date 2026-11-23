import { DurableObject } from 'cloudflare:workers';
import { slides } from '../src/slide-content';
import { newOpeningQuiz, openingQuizWindowMs, recordOpeningVote, type OpeningQuizRound } from '../src/opening-quiz';
import { countSchools, isSchoolVote, type SchoolVote } from '../src/school-vote';
import { firstPresentationCue, isCue, isSlide, slideCount, presenterKeyPattern, type RoomSnapshot } from '../src/live-protocol';

import { applyTheoryAction, ballotSlide, resolveBallot, theoryScene, theoryVoteWindowMs, voteView, type TheoryAction, type TheoryBallot } from '../src/theory-vote';

interface Env {
  ASSETS: Fetcher;
  ROOMS: DurableObjectNamespace<PresentationRoom>;
  PRESENTER_KEY?: string;
}

type Member = { id?: string; presenter: boolean; slide: number | null; schoolVote?: SchoolVote };
const protocol = 'phi102';
const connectionLimit = 500;
const error = (message: string, status: number) => new Response(message, { status });

export default {
  fetch(request, env) {
    const url = new URL(request.url);
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
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

export class PresentationRoom extends DurableObject<Env> {
  private slide = 0;
  private cue = 0;
  private ballot: TheoryBallot | null = null;
  private openingQuiz = newOpeningQuiz();

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    ctx.blockConcurrencyWhile(async () => {
      this.openingQuiz = await ctx.storage.get<OpeningQuizRound>('openingQuiz') ?? this.openingQuiz;
      const savedId = await ctx.storage.get<string>('slideId');
      if (savedId) {
        const removedCheck = savedId === 'L4-quiz';
        const slideId = removedCheck ? theoryScene('foundationalism') : savedId;
        const index = slides.findIndex(slide => slide.members[0] === slideId);
        if (isSlide(index)) this.slide = index;
        if (removedCheck) {
          this.cue = firstPresentationCue(this.slide);
          await ctx.storage.put({ slide: this.slide, slideId, presenterCue: this.cue });
        } else {
          const cue = await ctx.storage.get<number>('presenterCue');
          if (isCue(cue)) this.cue = cue;
        }
        this.ballot = await ctx.storage.get<TheoryBallot>('theoryBallot') ?? null;
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
          const index = slides.findIndex(slide => slide.members[0] === previousIds[previous]);
          if (isSlide(index)) this.slide = index;
        }
        await ctx.storage.put({ slideId: slides[this.slide].members[0], presenterCue: 0, theoryBallot: null });
      }
      if (this.ballot && !this.ballot.winner && !this.ballot.closesAt) {
        this.ballot.closesAt = Date.now() + theoryVoteWindowMs;
        await Promise.all([ctx.storage.put('theoryBallot', this.ballot), ctx.storage.setAlarm(this.ballot.closesAt)]);
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
    let message: { type?: unknown; slide?: unknown; cue?: unknown } | null;
    try { message = JSON.parse(payload); } catch { return; }
    if (isSchoolVote(message) && !member.presenter) {
      if (member.schoolVote?.voter === message.voter && member.schoolVote.school === message.school) return;
      socket.serializeAttachment({ ...member, schoolVote: message });
      await this.broadcast();
      return;
    }
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
    } else if (message?.type === 'cue' && member.presenter && message.slide === this.slide && isCue(message.cue)) {
      if (message.cue === this.cue) return;
      this.cue = message.cue;
      await Promise.all([this.ctx.storage.put('presenterCue', this.cue), this.beginOpeningQuiz()]);
    } else if (message?.type === 'present' && member.presenter && isSlide(message.slide)) {
      if (this.slide === message.slide) return;
      this.slide = message.slide;
      this.cue = isCue(message.cue) ? message.cue : firstPresentationCue(this.slide);
      this.ballot = null;
      await Promise.all([this.ctx.storage.put({ slide: this.slide, slideId: slides[this.slide].members[0],
        presenterCue: this.cue, theoryBallot: null }), this.beginOpeningQuiz()]);
    } else {
      return;
    }
    await this.broadcast();
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
        await this.broadcast();
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
      const destination = ballotSlide(this.ballot);
      if (destination !== this.slide) {
        this.slide = destination;
        this.cue = this.ballot.winner ? firstPresentationCue(destination) : 0;
        saveBallot = true;
      }
      saveBallot ||= previous !== this.ballot.winner;
    }
    const theory = this.ballot ? voteView(this.ballot, voters) : undefined;
    const state: RoomSnapshot = { type: 'state', presenterSlide: this.slide, presenterCue: this.cue, presenterOnline, counts, browsing,
      schools: countSchools(this.connectedMembers()), openingQuiz: {
        counts: this.openingQuiz.counts, round: this.openingQuiz.round,
        closesAt: presenterOnline && this.isOpeningQuestion() ? this.openingQuiz.closesAt : 0,
      } };
    const save = saveBallot ? this.ctx.storage.put({ slide: this.slide, slideId: slides[this.slide].members[0], presenterCue: this.cue, theoryBallot: this.ballot }) : undefined;
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
