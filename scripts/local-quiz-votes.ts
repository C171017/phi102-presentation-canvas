import type { Plugin } from 'vite';

export function localQuizVotes(): Plugin {
  return {
    name: 'local-quiz-votes',
    apply: 'serve',
    configureServer(server) {
      const ballots = new Map<string, 'B' | '13'>();
      const counts = { B: 0, '13': 0 };
      server.middlewares.use((req, res, next) => {
        if (req.url !== '/__canvas/quiz-votes') return next();
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('Content-Type', 'application/json');
        if (req.method === 'PUT') {
          if (req.headers.origin && req.headers.origin !== `http://${req.headers.host}`) {
            res.writeHead(403).end(); return;
          }
          const voter = req.headers['x-quiz-voter'];
          const choice = req.headers['x-quiz-choice'];
          if (typeof voter !== 'string' || !/^[a-f0-9-]{36}$/.test(voter) || (choice !== 'B' && choice !== '13')) {
            res.writeHead(400).end(); return;
          }
          const previous = ballots.get(voter);
          if (previous !== choice) {
            if (previous) counts[previous]--;
            ballots.set(voter, choice);
            counts[choice]++;
            server.ws.send('phi102:quiz:changed', {});
          }
        } else if (req.method !== 'GET') {
          res.writeHead(405, { Allow: 'GET, PUT' }).end(); return;
        }
        res.end(JSON.stringify(counts));
      });
    },
  };
}
