import { readFile } from 'node:fs/promises';
import { parseEnv } from 'node:util';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import type { Plugin } from 'vite';
import { createPaperExplainer } from '../server/paper-explainer';
import { paperExplanationPath } from '../src/paper-explainer-protocol';

const paperFile = new URL('../server/greco-2017.txt', import.meta.url);
const indexFile = new URL('../server/greco-2017-index.json', import.meta.url);
const varsFile = new URL('../.dev.vars', import.meta.url);

export function localPaperExplainer(isLoopback: (address?: string) => boolean): Plugin {
  let explain: Promise<ReturnType<typeof createPaperExplainer>> | undefined;
  return {
    name: 'canvas-local-paper-explainer',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.split('?')[0] !== paperExplanationPath) return next();
        const host = req.headers.host ?? '';
        if (!isLoopback(req.socket.remoteAddress) || !/^(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/.test(host)) {
          res.writeHead(403, { 'Content-Type': 'application/json' }).end(JSON.stringify({ message: 'Open the local editor on this computer.' }));
          return;
        }
        const abort = new AbortController();
        res.once('close', () => { if (!res.writableEnded) abort.abort(); });
        try {
          explain ??= Promise.all([readFile(paperFile, 'utf8'), readFile(indexFile, 'utf8')])
            .then(([paper, index]) => createPaperExplainer(paper, JSON.parse(index)))
            .catch(error => { explain = undefined; throw error; });
          const vars = process.env.PAPER_OPENAI_API_KEY ?? await readFile(varsFile, 'utf8')
            .then(text => parseEnv(text).PAPER_OPENAI_API_KEY)
            .catch(error => { if (error.code !== 'ENOENT') throw error; return undefined; });
          const headers = new Headers();
          for (const name of ['origin', 'content-type']) {
            const value = req.headers[name];
            if (typeof value === 'string') headers.set(name, value);
          }
          const body = req.method === 'POST' ? Readable.toWeb(req) as ReadableStream<Uint8Array> : undefined;
          const request = new Request(`http://${host}${paperExplanationPath}`, {
            method: req.method, headers, body, signal: abort.signal, duplex: 'half',
          } as RequestInit);
          const reply = await (await explain)(request, { apiKey: vars?.trim() });
          res.writeHead(reply.status, Object.fromEntries(reply.headers));
          if (reply.body) await pipeline(Readable.fromWeb(reply.body), res);
          else res.end();
        } catch {
          if (!res.headersSent && !res.destroyed) {
            res.writeHead(503, { 'Content-Type': 'application/json' }).end(JSON.stringify({ message: 'The paper explainer is unavailable right now.' }));
          }
        }
      });
    },
  };
}
