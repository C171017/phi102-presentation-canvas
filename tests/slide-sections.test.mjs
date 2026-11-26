import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { buildSync } from 'esbuild';

const bundle = buildSync({
  entryPoints: [fileURLToPath(new URL('../src/slide-sections.ts', import.meta.url))],
  bundle: true, write: false, format: 'esm',
});
const { cleanSlideCopy, isSlideCopy, slideSections } =
  await import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].contents).toString('base64'));

test('older snapshots show their sections in the existing order', () => {
  const saved = { title: 'Scene', claim: 'Heading', points: ['First', 'Second'], bridge: '', source: 'Greco' };
  assert.equal(isSlideCopy(saved), true);
  assert.deepEqual(slideSections(saved), [
    { kind: 'header', title: 'Scene', source: 'Greco' },
    { kind: 'heading', text: 'Heading' },
    { kind: 'bullets', items: ['First', 'Second'] },
  ]);
});

test('ordered sections persist without a title or heading, and all sections can be removed', () => {
  const saved = { sections: [
    { kind: 'text', text: 'New text' },
    { kind: 'header', title: '', source: 'Reference' },
    { kind: 'bullets', items: ['A bullet'] },
  ] };
  assert.equal(isSlideCopy(saved), true);
  assert.deepEqual(slideSections(cleanSlideCopy(saved)), saved.sections);
  assert.equal(isSlideCopy({ sections: [] }), true);
  assert.deepEqual(slideSections(cleanSlideCopy({ sections: [] })), []);
});

test('invalid section types and oversized text are rejected', () => {
  assert.equal(isSlideCopy({ sections: [{ kind: 'art', text: 'Placeholder' }] }), false);
  assert.equal(isSlideCopy({ sections: [{ kind: 'text', text: 'a'.repeat(501) }] }), false);
  assert.equal(isSlideCopy({ sections: [{ kind: 'bullets', items: [''] }] }), false);
});
