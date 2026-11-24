import { defineConfig, normalizePath, searchForWorkspaceRoot, type Plugin, type WebSocketClient } from 'vite';
import { existsSync } from 'node:fs';
import { readFile, writeFile, rename, copyFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { parseLayout } from './src/layout';
import { firstPresentationCue, isCue, isSlide, slideCount, type RoomSnapshot } from './src/live-protocol';
import { storyTextStorage } from './scripts/story-text-storage';
import { applyTheoryAction, ballotSlide, resolveBallot, voteView, type TheoryBallot } from './src/theory-vote';
import { localQuizVotes } from './scripts/local-quiz-votes';
import { countSchools, isSchoolVote, type SchoolVote } from './src/school-vote';
import { storyTextEndpoint } from './src/story-text';
import openingMedia from './src/opening-media.json';

const layoutFile = fileURLToPath(new URL('./canvas-layout.json', import.meta.url));
const openingDrafts = [
  'flexible-foundationalism-op-v5.mp4',
  'flexible-foundationalism-op-v4.mp4',
  'flexible-foundationalism-op-v3.mp4',
  'dead-ink-op-codex-v2.mp4',
];
const openingFile = openingDrafts
  .map(name => fileURLToPath(new URL(`../op/drafts/${name}`, import.meta.url)))
  .find(path => existsSync(path));

function isLoopback(address?: string) {
  return address === '127.0.0.1' || address === '::1' || address === '::ffff:127.0.0.1';
}

function localOnlyEditor(): Plugin {
  return {
    name: 'canvas-local-only-editor',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (isLoopback(req.socket.remoteAddress)) return next();
        let pathname: string;
        try { pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname); }
        catch { res.writeHead(400).end(); return; }
        const writesLocalFiles = req.method !== 'GET' && req.method !== 'HEAD' &&
          (pathname === '/__canvas/layout' || pathname === storyTextEndpoint);
        if (writesLocalFiles || openingDrafts.some(name => pathname.toLowerCase().includes(name))) {
          res.writeHead(403).end();
          return;
        }
        next();
      });
    },
  };
}

let writes = Promise.resolve();
function layoutStorage(): Plugin {
  const install = (server: { middlewares: { use: (handler: any) => void } }) => {
    server.middlewares.use(async (req: any, res: any, next: () => void) => {
      if (req.url?.split('?')[0] !== '/__canvas/layout') return next();
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-store');
      const reply = (status: number, body: unknown) => { res.statusCode = status; res.end(JSON.stringify(body)); };
      try {
        if (req.headers.origin && req.headers.origin !== `http://${req.headers.host}`) return reply(403, { error: 'Different origin' });
        if (req.method === 'GET') {
          await writes;
          try { return reply(200, JSON.parse(await readFile(layoutFile, 'utf8'))); }
          catch (error: any) { if (error.code === 'ENOENT') return reply(200, null); throw error; }
        }
        if (req.method !== 'PUT') return reply(405, { error: 'Method not allowed' });
        if (!req.headers['content-type']?.startsWith('application/json')) return reply(415, { error: 'JSON required' });
        let body = '';
        for await (const chunk of req) {
          body += chunk;
          if (Buffer.byteLength(body) > 60000) return reply(413, { error: 'Layout too large' });
        }
        const layout = parseLayout(body);
        if (!layout || !Number.isFinite(Date.parse(layout.savedAt)) || Object.keys(layout.items).length > 1000) return reply(400, { error: 'Invalid layout' });
        const clientId = req.headers['x-canvas-client'];
        const baseRevision = req.headers['x-canvas-revision'] ?? '';
        if (typeof clientId !== 'string' || !/^[a-zA-Z0-9-]{8,80}$/.test(clientId)) return reply(400, { error: 'Missing canvas client' });
        const operation = writes.then(async () => {
          try {
            const record = JSON.parse(await readFile(layoutFile, 'utf8'));
            const old = parseLayout(JSON.stringify(record));
            if (old && baseRevision !== old.savedAt && record.writer !== clientId) {
              const conflict = new Error('Layout changed in another tab');
              Object.assign(conflict, { status: 409 });
              throw conflict;
            }
            // A delayed unload request must not overwrite a newer layout.
            if (old && Date.parse(old.savedAt) > Date.parse(layout.savedAt)) return old.savedAt;
            await copyFile(layoutFile, `${layoutFile}.previous`);
          } catch (error: any) { if (error.code !== 'ENOENT') throw error; }
          const temp = `${layoutFile}.tmp`;
          await writeFile(temp, JSON.stringify({ ...layout, writer: clientId }, null, 2) + '\n');
          await rename(temp, layoutFile);
          return layout.savedAt;
        });
        writes = operation.then(() => {}, () => {});
        const revision = await operation;
        reply(200, { saved: true, file: 'canvas-layout.json', revision });
      } catch (error: any) { reply(error.status === 409 ? 409 : 500, { error: error.status === 409 ? 'Layout changed in another tab' : 'Could not read or write the layout file' }); }
    });
  };
  return {
    name: 'canvas-layout-file',
    configureServer: install,
    configurePreviewServer: install,
    async generateBundle() {
      try { this.emitFile({ type: 'asset', fileName: 'canvas-layout.json', source: await readFile(layoutFile, 'utf8') }); }
      catch (error: any) { if (error.code !== 'ENOENT') throw error; }
    },
  };
}

// A separate, in-memory room carried by Vite's own dev connection.
function localPresentation(): Plugin {
  return {
    name: 'canvas-local-presentation',
    apply: 'serve',
    configureServer(server) {
      const members = new Map<WebSocketClient, { role: 'presenter' | 'audience'; slide: number | null; id: string; schoolVote?: SchoolVote }>();
      const localSockets = new WeakSet<WebSocketClient['socket']>();
      server.ws.on('connection', (socket, request) => {
        if (isLoopback(request.socket.remoteAddress)) localSockets.add(socket);
      });
      let presenter: WebSocketClient | undefined;
      let presenterSlide: number | undefined;
      let presenterCue = 0;
      let openingPlaying = false;
      let ballot: TheoryBallot | null = null;
      let ballotTimer: ReturnType<typeof setTimeout> | undefined;
      server.httpServer?.once('close', () => clearTimeout(ballotTimer));
      const audience = () => [...members.values()].filter(member => member.role === 'audience').map(member => member.id);

      function broadcast() {
        const counts = Array<number>(slideCount).fill(0);
        let browsing = 0;
        for (const { role, slide } of members.values()) {
          if (role !== 'audience') continue;
          if (slide === null) browsing++;
          else counts[slide]++;
        }
        const voters = audience();
        if (ballot) {
          resolveBallot(ballot, voters);
          const destination = ballotSlide(ballot);
          if (destination !== presenterSlide) {
            presenterSlide = destination;
            presenterCue = ballot.winner ? firstPresentationCue(destination) : 0;
          }
        }
        const theory = ballot ? voteView(ballot, voters) : undefined;
        const state: RoomSnapshot = {
          type: 'state', presenterSlide: presenterSlide ?? 0, presenterCue,
          presenterOnline: Boolean(presenter), openingPlaying, counts, browsing,
          schools: countSchools(members.values()),
        };
        for (const [client, member] of members) {
          if (client.socket.readyState === 1) client.send('phi102:preview:state', {
            ...state, theory: theory && { ...theory, mine: ballot?.ballots[member.id] },
          });
        }
      }

      function leave(client: WebSocketClient) {
        if (!members.delete(client)) return;
        if (client === presenter) {
          presenter = undefined;
          openingPlaying = false;
        }
        broadcast();
      }

      server.ws.on('phi102:preview:join', (data, client) => {
        if (data?.role !== 'presenter' && data?.role !== 'audience') return;
        if (members.has(client)) return;
        if (data.role === 'presenter') {
          if (!localSockets.has(client.socket)) return;
          if (presenter) {
            const previous = presenter;
            members.delete(previous);
            if (previous.socket.readyState === 1) previous.send('phi102:preview:superseded');
          }
          presenter = client;
          openingPlaying = data.openingPlaying === true;
        }
        presenterSlide ??= isSlide(data.slide) ? data.slide : 0;
        members.set(client, { role: data.role, slide: presenterSlide, id: crypto.randomUUID() });
        client.socket.once('close', () => leave(client));
        broadcast();
      });
      server.ws.on('phi102:preview:leave', (_, client) => leave(client));
      server.ws.on('phi102:preview:opening', (playing, client) => {
        if (client !== presenter || typeof playing !== 'boolean' || openingPlaying === playing) return;
        openingPlaying = playing;
        broadcast();
      });
      server.ws.on('phi102:preview:report', (data, client) => {
        const member = members.get(client);
        if (member?.role === 'audience' && isSchoolVote(data)) {
          if (member.schoolVote?.voter === data.voter && member.schoolVote.school === data.school) return;
          member.schoolVote = data;
          broadcast();
          return;
        }
        if (member && data?.type === 'theory') {
          const isPresenter = client === presenter;
          const slide = isPresenter ? presenterSlide : member.slide;
          if (slide == null || (presenter && slide !== presenterSlide)) return;
          const previousRound = ballot?.id;
          ballot = applyTheoryAction(ballot, data, slide, isPresenter || (!presenter && data.action === 'open'), member.id, audience());
          if (ballot && ballot.id !== previousRound) {
            clearTimeout(ballotTimer);
            const round = ballot.id;
            ballotTimer = setTimeout(() => {
              if (ballot?.id === round && !ballot.winner) {
                resolveBallot(ballot, audience(), true);
                broadcast();
              }
            }, Math.max(0, ballot.closesAt - Date.now()));
          }
        } else if (member?.role === 'presenter' && data?.type === 'cue' && data.slide === presenterSlide && isCue(data.cue)) {
          if (presenterCue === data.cue) return;
          presenterCue = data.cue;
        } else if (member?.role === 'presenter' && data?.type === 'present' && isSlide(data.slide)) {
          if (presenterSlide === data.slide) return;
          presenterSlide = data.slide;
          presenterCue = isCue(data.cue) ? data.cue : firstPresentationCue(presenterSlide);
          ballot = null;
          openingPlaying = false;
        } else if (member?.role === 'audience' && data?.type === 'view' && (data.slide === null || isSlide(data.slide))) {
          if (member.slide === data.slide) return;
          member.slide = data.slide;
        } else return;
        broadcast();
      });
    },
  };
}

export default defineConfig(({ command }) => ({
  define: {
    __LOCAL_OPENING_VIDEO__: JSON.stringify(command === 'serve' && openingFile
      ? `/@fs/${encodeURI(normalizePath(openingFile))}`
      : ''),
  },
  plugins: [
    {
      name: 'canvas-check-opening-size',
      apply: 'build',
      async buildStart() {
        const file = await stat(new URL(`./public${openingMedia.path}`, import.meta.url));
        if (file.size !== openingMedia.bytes) this.error('Update the opening video byte count in src/opening-media.json.');
      },
    },
    localOnlyEditor(),
    layoutStorage(),
    localPresentation(),
    localQuizVotes(),
    storyTextStorage(fileURLToPath(new URL('./story-text.json', import.meta.url))),
  ],
  server: {
    host: '127.0.0.1',
    fs: {
      allow: [searchForWorkspaceRoot(process.cwd()), ...(openingFile ? [openingFile] : [])],
      deny: [
        '.env', '.env.*', '*.{crt,pem}', '**/.git/**',
        '.dev.vars*', '**/.wrangler/**', '**/.claude/**', '**/docs/chat-history/**',
      ],
    },
    watch: { ignored: ['**/canvas-layout.json', '**/canvas-layout.json.*', '**/story-text.json', '**/story-text.json.tmp'] },
  },
  preview: { host: '127.0.0.1' },
}));
