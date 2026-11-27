import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { buildSync } from 'esbuild';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const paper = read('../server/greco-2017.txt');
const index = JSON.parse(read('../server/greco-2017-index.json'));
const geometry = JSON.parse(read('../public/readings/greco-2017/words.json'));
const manifest = JSON.parse(read('../public/readings/greco-2017/manifest.json'));
const { outputFiles: [bundle] } = buildSync({
  entryPoints: [fileURLToPath(new URL('../server/paper-explainer.ts', import.meta.url))],
  bundle: true, write: false, format: 'esm',
});
const { createPaperExplainer } = await import('data:text/javascript;base64,' + Buffer.from(bundle.contents).toString('base64'));
const explain = createPaperExplainer(paper, index);
const origin = 'https://example.com';
const selection = {
  start: { file: 'page-06.webp', index: 2 },
  end: { file: 'page-06.webp', index: 34 },
};
const request = (selected, from = origin) => new Request(`${origin}/api/paper/explain`, {
  method: 'POST', headers: { Origin: from, 'Content-Type': 'application/json' }, body: JSON.stringify(selected),
});

test('every rendered word maps to the corresponding printed page in the backend text', () => {
  assert.equal(Object.keys(index).length, manifest.pages.length);
  for (const { file, printed } of manifest.pages) {
    const { words } = index[file];
    assert.equal(index[file].printed, printed);
    assert.equal(words.length, geometry[file].length);
    assert.ok(paper.lastIndexOf(`[Printed page ${printed}]`, words[0][0]) >= 0);
    let previousEnd = 0;
    for (const [start, end] of words) {
      assert.ok(start >= previousEnd && end > start && end <= paper.length);
      assert.match(paper.slice(start, end), /^\S[\s\S]*\S$|^\S$/);
      previousEnd = end;
    }
  }
});

test('only indexed passages reach OpenAI and output tokens are forwarded incrementally', async t => {
  let calls = 0;
  let upstream;
  const enc = new TextEncoder();
  t.mock.method(globalThis, 'fetch', async (url, init) => {
    calls++;
    assert.equal(url, 'https://api.openai.com/v1/responses');
    const body = JSON.parse(init.body);
    assert.equal(body.model, 'gpt-6.2-sol');
    assert.equal(body.service_tier, 'fast');
    assert.equal(body.stream, true);
    assert.equal(body.store, false);
    assert.ok(body.input[1].content.endsWith(paper));
    assert.match(body.input[2].content, /p\. 430/);
    return new Response(new ReadableStream({ start(controller) { upstream = controller; } }));
  });
  const options = { apiKey: 'test-only' };
  assert.equal((await explain(request(selection, 'https://outside.example'), options)).status, 403);
  assert.equal((await explain(request({ ...selection, end: { file: 'page-07.webp', index: 9000 } }), options)).status, 400);
  assert.equal((await explain(request({ start: selection.start, end: { file: 'page-08.webp', index: 20 } }), options)).status, 400);
  assert.equal((await explain(request(selection), { ...options, allowRequest: async () => false })).status, 429);
  assert.equal(calls, 0);

  const response = await explain(request(selection), options);
  assert.equal(response.status, 200);
  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  const { value: metadata } = await reader.read();
  assert.equal(JSON.parse(metadata).pages, 'p. 430');
  const delta = enc.encode('data: {"type":"response.output_text.delta","delta":"Here’s the idea."}\r\n\r\n');
  const boundary = delta.indexOf(226) + 1; // split the UTF-8 curly apostrophe across chunks
  upstream.enqueue(delta.slice(0, boundary));
  upstream.enqueue(delta.slice(boundary));
  assert.deepEqual(JSON.parse((await reader.read()).value), { type: 'delta', text: 'Here’s the idea.' });
  upstream.enqueue(enc.encode('data: {"type":"response.completed"}\n\n'));
  upstream.close();
  assert.deepEqual(JSON.parse((await reader.read()).value), { type: 'done' });
  assert.equal((await reader.read()).done, true);
  assert.equal(calls, 1);
});
