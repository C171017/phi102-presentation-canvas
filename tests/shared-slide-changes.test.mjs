import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { buildSync } from 'esbuild';

const bundle = buildSync({
  entryPoints: [fileURLToPath(new URL('../src/shared-slide-changes.ts', import.meta.url))],
  bundle: true, write: false, format: 'esm',
});
const { mergeSlideEdits } = await import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].contents).toString('base64'));
const empty = { layout: null, copy: {} };

test('a release publishes new Git edits and retains existing hosted content', () => {
  const layout = { savedAt: 'previous layout' };
  const live = { ...empty, layout, dialogue: { first: 'Team edit', second: 'Old value' } };
  const next = { ...empty, dialogue: { second: 'Local edit' } };
  const published = mergeSlideEdits(live, empty, next);
  assert.deepEqual(published.dialogue, { first: 'Team edit', second: 'Local edit' });
  assert.equal(published.layout, layout);

  const editedLater = { ...published, dialogue: { ...published.dialogue, second: 'New hosted edit' } };
  assert.equal(mergeSlideEdits(editedLater, next, next), editedLater);
  assert.equal(mergeSlideEdits(editedLater, next, empty), editedLater);
  assert.deepEqual(mergeSlideEdits(published, next, empty).dialogue, { first: 'Team edit' });
});

test('independent insertions in the same dialogue survive publication', () => {
  const hosted = { key: 'hosted', after: null, text: 'Team line' };
  const local = { key: 'local', after: null, text: 'Local line' };
  const live = { ...empty, dialogueStructure: { L4: { added: [hosted], removed: ['old'] } } };
  const next = { ...empty, dialogueStructure: { L4: { added: [local], removed: [] } } };
  assert.deepEqual(mergeSlideEdits(live, empty, next).dialogueStructure.L4, {
    added: [hosted, local], removed: ['old'], quizAfter: undefined,
  });
});
