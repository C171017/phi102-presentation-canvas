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

test('removing classroom text keeps the quiz, result and reveal as silent events', () => {
  const [first, question, result, bridge, reveal] = authoredCues(scene);
  const cues = classroom({ added: [], removed: [question.key, result.key, reveal.key] });
  assert.deepEqual(cues.filter(cue => !cue.silent).map(cue => cue.key), [first.key, bridge.key]);
  assert.deepEqual(cues.filter(cue => cue.silent).map(cue => [cue.phase, cue.number]),
    [['question', 1], ['result', 2], ['reveal', 4]]);
});

test('removing all ordinary lines leaves a silent cue on the slide', () => {
  const id = 'L0';
  const original = authoredCues(id);
  const updated = buildClassroomScript({ [id]: { added: [], removed: original.map(cue => cue.key) } })
    .filter(cue => cue.scene === id);
  assert.equal(updated.length, 1);
  assert.equal(updated[0].key, original[0].key);
  assert.equal(updated[0].silent, true);
});

test('removing wording from an artwork transition keeps its background', () => {
  const id = 'P2-1';
  const transition = authoredCues(id).find(cue => cue.background);
  assert.ok(transition);
  const updated = buildClassroomScript({ [id]: { added: [], removed: [transition.key] } })
    .find(cue => cue.key === transition.key);
  assert.equal(updated.silent, true);
  assert.equal(updated.background, transition.background);
});

test('moving the quiz preserves its wire cue and leaves the original wording in place', () => {
  const [first, question, result, bridge, reveal] = authoredCues(scene);
  const cues = classroom({ added: [], removed: [], quizAfter: bridge.key });
  assert.deepEqual(cues.map(cue => cue.key), [first.key, question.key, result.key, bridge.key, 'classroom-quiz', reveal.key]);
  assert.equal(cues[1].text, question.text);
  assert.equal(cues[1].phase, undefined);
  assert.equal(cues[4].phase, 'question');
  assert.equal(cues[4].number, 1);
  assert.equal(cues[4].silent, true);
});

test('moving a quiz with removed wording produces a single silent event', () => {
  const [, question, , , reveal] = authoredCues(scene);
  const cues = classroom({ added: [], removed: [question.key], quizAfter: reveal.key });
  assert.equal(cues.length, 5);
  assert.equal(cues.filter(cue => cue.phase === 'question').length, 1);
  assert.equal(cues.at(-1).number, 1);
  assert.equal(cues.at(-1).silent, true);
});
