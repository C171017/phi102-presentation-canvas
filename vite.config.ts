import { defineConfig, normalizePath, searchForWorkspaceRoot, type Plugin, type WebSocketClient } from 'vite';
import { existsSync } from 'node:fs';
import { readFile, writeFile, rename, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { parseLayout } from './src/layout';
import { isSlide, slideCount, type RoomSnapshot } from './src/live-protocol';
import { storyTextStorage } from './scripts/story-text-storage';
import { localQuizVotes } from './scripts/local-quiz-votes';

const layoutFile = fileURLToPath(new URL('./canvas-layout.json', import.meta.url));
const openingFile = fileURLToPath(new URL('../op/drafts/dead-ink-op-codex-v2.mp4', import.meta.url));
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
      const members = new Map<WebSocketClient, { role: 'presenter' | 'audience'; slide: number | null }>();
      let presenter: WebSocketClient | undefined;
      let presenterSlide: number | undefined;
      let openingPlaying = false;

      function broadcast() {
        const counts = Array<number>(slideCount).fill(0);
        let browsing = 0;
        for (const { role, slide } of members.values()) {
          if (role !== 'audience') continue;
          if (slide === null) browsing++;
          else counts[slide]++;
        }
        const state: RoomSnapshot = {
          type: 'state', presenterSlide: presenterSlide ?? 0,
          presenterOnline: Boolean(presenter), openingPlaying, counts, browsing,
        };
        for (const client of members.keys()) {
          if (client.socket.readyState === 1) client.send('phi102:preview:state', state);
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
          if (presenter) {
            const previous = presenter;
            members.delete(previous);
            if (previous.socket.readyState === 1) previous.send('phi102:preview:superseded');
          }
          presenter = client;
          openingPlaying = data.openingPlaying === true;
        }
        presenterSlide ??= isSlide(data.slide) ? data.slide : 0;
        members.set(client, { role: data.role, slide: presenterSlide });
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
        if (member?.role === 'presenter' && data?.type === 'present' && isSlide(data.slide)) {
          if (presenterSlide === data.slide) return;
          presenterSlide = data.slide;
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
    __LOCAL_OPENING_VIDEO__: JSON.stringify(command === 'serve' && existsSync(openingFile)
      ? `/@fs/${encodeURI(normalizePath(openingFile))}`
      : ''),
  },
  plugins: [
    layoutStorage(),
    localPresentation(),
    localQuizVotes(),
    storyTextStorage(fileURLToPath(new URL('./story-text.json', import.meta.url))),
  ],
  server: {
    host: '127.0.0.1',
    fs: { allow: [searchForWorkspaceRoot(process.cwd()), openingFile] },
    watch: { ignored: ['**/canvas-layout.json', '**/canvas-layout.json.*', '**/story-text.json', '**/story-text.json.tmp'] },
  },
  preview: { host: '127.0.0.1' },
}));
