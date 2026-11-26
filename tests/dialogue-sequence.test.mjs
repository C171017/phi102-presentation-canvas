import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { buildSync } from 'esbuild';

const bundle = buildSync({
  entryPoints: [fileURLToPath(new URL('../src/classroom-cues.ts', import.meta.url))],
  bundle: true, write: false, format: 'esm',
});
const { authoredCues, buildClassroomScript, customCueNumber } =
  await import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].contents).toString('base64'));

const id = n => 'line-' + n.toString(16).padStart(12, '0') + '0'.repeat(20);
const scene = 'contemporary-heading';
const classroom = structure => buildClassroomScript(structure && { [scene]: structure }).filter(cue => cue.scene === scene);

test('inserting a line keeps the original quiz and reveal cue numbers', () => {
  const [first, question, result, bridge, reveal] = authoredCues(scene);
  const extra = { key: id(1), after: question.key, text: 'New line after the quiz.' };
  const firstExtra = { key: id(2), after: null, text: 'New introductory line.' };
  const changes = classroom({ added: [extra, firstExtra], removed: [bridge.key] });
  assert.deepEqual(changes.map(cue => cue.key), [firstExtra.key, first.key, question.key, extra.key, result.key, reveal.key]);
  assert.equal(changes.find(cue => cue.phase === 'question').number, 1);
  assert.equal(changes.find(cue => cue.phase === 'reveal').number, 4);
  assert.equal(changes.find(cue => cue.key === extra.key).number, customCueNumber(extra.key));
  assert.equal(changes.find(cue => cue.key === extra.key).speaker, question.speaker);
  assert.equal(classroom().length, 5);
});

test('newer insertions follow their anchor immediately and survive its removal', () => {
  const [first, question] = authoredCues(scene);
  const old = { key: id(1), after: first.key, text: 'Older addition.' };
  const inner = { key: id(2), after: old.key, text: 'Nested addition.' };
  const recent = { key: id(3), after: first.key, text: 'Newer addition.' };
  const changes = classroom({ added: [old, inner, recent], removed: [first.key, old.key] });
  assert.deepEqual(changes.slice(0, 3).map(cue => cue.key), [recent.key, inner.key, question.key]);
  assert.equal(changes[1].sourceNumber, first.number);
});
