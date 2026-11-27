import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { buildSync } from 'esbuild';
import ts from 'typescript';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const notes = ts.transpile(read('../src/paper-notes-data.ts'), { module: ts.ModuleKind.ESNext });
const { PAPER_NOTES } = await import('data:text/javascript;base64,' + Buffer.from(notes).toString('base64'));
const source = JSON.parse(read('../scripts/paper-segments.json'));
const index = JSON.parse(read('../public/readings/greco-2017/segments.json'));
const citations = JSON.parse(read('../public/readings/greco-2017/citations.json'));
const citationSource = JSON.parse(read('../scripts/paper-citations.json'));

test('every colored passage exposes its authored moves in reading order', () => {
  assert.deepEqual(Object.keys(index).sort(), PAPER_NOTES.map(note => note.id).sort());
  for (const [id, moves] of Object.entries(index)) {
    assert.deepEqual(moves.map(move => move.label), source[id].map(([, label]) => label));
    for (const { runs } of moves) {
      assert.ok(runs.length && runs.every(run => run.lines.length));
      for (const { lines } of runs) {
        for (const [left, top, right, bottom] of lines) {
          assert.ok(left >= 0 && left < right && right <= 10000);
          assert.ok(top >= 0 && top < bottom && bottom <= 10000);
        }
      }
    }
  }
});

test('a shared printed line splits at the sentence, and a page break preserves the move', () => {
  const party = index['paper-party-example'];
  const question = party[1].runs[0].lines.at(-1);
  const answer = party[2].runs[0].lines[0];
  assert.equal(question[1], answer[1]);
  assert.ok(question[2] < answer[0]);

  const williamson = index['route-knowledge-heading'][1].runs;
  assert.deepEqual(williamson.map(run => run.page), [3, 4]);
  assert.ok(williamson[0].lines.at(-1)[3] < 9300, 'exclude the folio');
  assert.ok(williamson[1].lines[0][1] > 800, 'exclude the running head');
  assert.equal(index['hinges-ctx-heading'].length, 1, 'keep the single-sentence comparison intact');
});

test('slide links cover the philosophical slides and point to exact paper citations', async () => {
  const { outputFiles } = buildSync({
    stdin: {
      contents: 'export { slides } from "./slide-content"; export { slidePaperLinks } from "./paper-slide-links"; export { sharedSlideEntries } from "./shared-slide-data"; export { slideSections } from "./slide-sections";',
      resolveDir: fileURLToPath(new URL('../src/', import.meta.url)),
    },
    bundle: true, write: false, format: 'esm', loader: { '.css': 'empty' },
  });
  const { slides, slidePaperLinks, sharedSlideEntries, slideSections } = await import('data:text/javascript;base64,' + Buffer.from(outputFiles[0].contents).toString('base64'));
  const excluded = new Set(['unitrans-arrival', 'before-lecture', 'P1', 'P2-arrival']);
  assert.deepEqual(Object.keys(slidePaperLinks).sort(), slides.map(({ members }) => members[0]).filter(id => !excluded.has(id)).sort());
  const used = new Set();
  for (const [key, links] of Object.entries(slidePaperLinks)) {
    assert.ok(citations[links.title.id], `${key} needs a title citation`);
    used.add(links.title.id);
    for (const { reference } of links.inline ?? []) used.add(reference.id);
  }

  const { document } = JSON.parse(read('../shared-slides.json'));
  for (const { key, initial } of sharedSlideEntries) {
    const fields = [initial, document.copy[key]].filter(Boolean).flatMap(copy => slideSections(copy).flatMap(section => {
      if (section.kind === 'bullets') return section.items;
      return section.kind === 'header' ? [section.title] : [section.text];
    }));
    for (const { after } of slidePaperLinks[key]?.inline ?? []) {
      assert.ok(fields.some(text => text.toLowerCase().includes(after)), `${key} is missing the cited line “${after}”`);
    }
  }
  assert.deepEqual(Object.keys(citations).sort(), [...used].sort());
  assert.deepEqual(Object.keys(citations).sort(), Object.keys(citationSource).sort());
  for (const [id, { section, runs }] of Object.entries(citations)) {
    assert.equal(section, citationSource[id].section);
    assert.ok(index[section]?.length, `${id} needs a focus section`);
    assert.ok(runs.length && runs.every(run => run.lines.length), `${id} needs a highlight`);
    for (const { lines } of runs) {
      for (const [left, top, right, bottom] of lines) {
        assert.ok(left >= 0 && left < right && right <= 10000);
        assert.ok(top >= 0 && top < bottom && bottom <= 10000);
      }
    }
  }
  assert.equal(slidePaperLinks['L6-B'].title.id, 'moderate-foundationalism');
  assert.equal(slidePaperLinks.L7.title.id, 'must-be-undoubted');
  assert.equal(slidePaperLinks['undoubted-heading'].title.id, 'must-be-undoubted');
  assert.ok(slidePaperLinks['L6-A'].inline.some(({ reference }) => reference.id === 'too-few-indubitable-claims'));
});

test('the Cartesian objection highlight starts at the cited words on a shared line', () => {
  const id = 'too-few-indubitable-claims';
  assert.match(citationSource[id].start, /^indubitable claims are too few/);
  const [line] = citations[id].runs[0].lines;
  const [sentence] = index['paper-relaxed-foundations'][0].runs[0].lines;
  assert.equal(line[1], sentence[1]);
  assert.ok(line[0] > sentence[0], 'leave the preceding words on the same line unmarked');
  assert.equal(citations['indubitable-foundations'].runs[0].lines.length, 1);
});

test('the undoubted title illuminates only the operative words in Greco’s sentence', () => {
  const id = 'must-be-undoubted';
  assert.equal(citationSource[id].start, 'must be undoubted.');
  assert.equal(citations[id].section, 'undoubted-heading');
  const [run] = citations[id].runs;
  assert.equal(run.page, 2);
  assert.equal(run.lines.length, 1);
  const [left, top, right] = run.lines[0];
  const context = index['undoubted-heading'][1].runs[0].lines.find(line => line[1] === top);
  assert.ok(context && left > context[0] && right <= context[2], 'exclude the neighboring “undoubtable”');
});
