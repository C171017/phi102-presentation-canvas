import { randomUUID } from 'node:crypto';
import { readFile, rename, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';
import { applySharedSlideChange, mergeSlideEdits } from '../src/shared-slide-changes';
import { originalSharedSnapshot, sharedSlidesPath, type SharedSnapshot } from '../src/shared-slide-data';

async function readSnapshot(file: string) {
  try {
    return JSON.parse(await readFile(file, 'utf8')) as SharedSnapshot;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return originalSharedSnapshot;
    throw error;
  }
}

export function localSharedSlides(isLoopback: (address?: string) => boolean): Plugin {
  const file = fileURLToPath(new URL('../shared-slides.json', import.meta.url));
  const legacyFile = fileURLToPath(new URL('../shared-slides.local.json', import.meta.url));
  let pending = Promise.resolve();
  return {
    name: 'canvas-local-slide-edits',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.split('?')[0] !== sharedSlidesPath) return next();
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-store');
        const reply = (status: number, data: unknown) => {
          res.statusCode = status;
          res.end(JSON.stringify(data));
        };
        const host = req.headers.host ?? '';
        const editable = isLoopback(req.socket.remoteAddress) && /^(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/.test(host);
        async function snapshots() {
          const [tracked, legacy] = await Promise.all([readSnapshot(file), readSnapshot(legacyFile)]);
          return { tracked, current: { ...tracked, editable,
            document: mergeSlideEdits({ ...legacy.document, layout: null }, originalSharedSnapshot.document, tracked.document) } };
        }
        try {
          if (req.method === 'GET') {
            await pending;
            return reply(200, (await snapshots()).current);
          }
          if (req.method !== 'PUT') return reply(405, { error: 'Method not allowed.' });
          if (!editable || req.headers.origin !== `http://${host}`) return reply(403, { error: 'Open the local Editor on this computer to save changes.' });
          if (!req.headers['content-type']?.startsWith('application/json')) return reply(415, { error: 'JSON required.' });
          let body = '';
          for await (const chunk of req) {
            body += chunk;
            if (Buffer.byteLength(body) > 128 * 1024) return reply(413, { error: 'This edit is too large to save.' });
          }
          let change;
          try { change = JSON.parse(body); }
          catch { return reply(400, { error: 'Invalid save request.' }); }
          if (!change || typeof change !== 'object' || Array.isArray(change)) return reply(400, { error: 'Invalid save request.' });

          const operation = pending.then(async () => {
            const { tracked, current } = await snapshots();
            if (change.revision !== current.revision) return reply(409, { error: 'Someone saved a newer version. Load it before saving again.' });
            const proposed = applySharedSlideChange(change, current.document, false);
            if (!proposed.document) return reply(400, { error: proposed.error });
            const { document, summary } = proposed;
            const saved = { revision: current.revision + 1, savedAt: new Date().toISOString(), summary,
              document: mergeSlideEdits(tracked.document, current.document, document) };
            const encoded = JSON.stringify(saved, null, 2) + '\n';
            if (Buffer.byteLength(encoded) > 1_500_000) return reply(413, { error: 'This presentation is too large to save.' });
            const temporary = `${file}.${randomUUID()}.tmp`;
            try {
              await writeFile(temporary, encoded);
              await rename(temporary, file);
            } finally {
              await rm(temporary, { force: true });
            }
            reply(200, { ...saved, document, editable });
          });
          pending = operation.catch(() => {});
          await operation;
        } catch {
          reply(500, { error: 'Could not read or save shared-slides.json.' });
        }
      });
    },
  };
}
