import { randomUUID } from 'node:crypto';
import { readFile, rename, writeFile } from 'node:fs/promises';
import type { Plugin } from 'vite';
import { isStoryText, storyTextEndpoint, type StoryEdits } from '../src/story-text';
import { storyScenes } from '../src/story-scenes';

export function storyTextStorage(file: string): Plugin {
  const sceneIds = new Set(storyScenes.map(scene => scene.id));
  let writes = Promise.resolve();

  async function readEdits(): Promise<StoryEdits> {
    try {
      return JSON.parse(await readFile(file, 'utf8'));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return {};
      throw error;
    }
  }

  return {
    name: 'canvas-story-text',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url !== storyTextEndpoint) return next();
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-store');
        const reply = (status: number, data: unknown) => {
          res.statusCode = status;
          res.end(JSON.stringify(data));
        };

        try {
          if (req.headers.origin && req.headers.origin !== `http://${req.headers.host}`) {
            return reply(403, { error: 'Different origin' });
          }
          if (req.method === 'GET') {
            await writes;
            return reply(200, await readEdits());
          }
          if (req.method !== 'PUT') return reply(405, { error: 'Method not allowed' });
          if (!req.headers['content-type']?.startsWith('application/json')) return reply(415, { error: 'JSON required' });
          let body = '';
          for await (const chunk of req) {
            body += chunk;
            if (Buffer.byteLength(body) > 160000) return reply(413, { error: 'Scene text is too large.' });
          }
          let update;
          try { update = JSON.parse(body); }
          catch { return reply(400, { error: 'Invalid scene text.' }); }
          if (!update || !sceneIds.has(update.id) || !isStoryText(update.text)) {
            return reply(400, { error: 'Enter a title and story text.' });
          }
          const { id, text, revision } = update;
          const operation = writes.then(async () => {
            const edits = await readEdits();
            const latest = edits[id];
            if ((latest?.revision ?? null) !== revision) {
              return reply(409, { latest });
            }
            const saved = { title: text.title, paragraphs: text.paragraphs, revision: randomUUID() };
            edits[id] = saved;
            await writeFile(`${file}.tmp`, JSON.stringify(edits, null, 2) + '\n');
            await rename(`${file}.tmp`, file);
            reply(200, saved);
          });
          writes = operation.then(() => {}, () => {});
          await operation;
        } catch {
          reply(500, { error: 'Could not save or load story-text.json.' });
        }
      });
    },
  };
}
