import { defineConfig, type Plugin } from 'vite';
import { readFile, writeFile, rename, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { parseLayout } from './src/layout';

const layoutFile = fileURLToPath(new URL('./canvas-layout.json', import.meta.url));
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
export default defineConfig({
  plugins: [layoutStorage()],
  server: { host: '127.0.0.1', watch: { ignored: ['**/canvas-layout.json', '**/canvas-layout.json.*'] } },
  preview: { host: '127.0.0.1' },
});
