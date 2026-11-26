import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { buildSync } from 'esbuild';

const bundle = buildSync({
  entryPoints: [fileURLToPath(new URL('../src/regress-responses.ts', import.meta.url))],
  bundle: true, write: false, format: 'esm',
});
const { regressSceneDestination, regressDetours, operationBecauseScene, foundationalismScene } =
  await import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].contents).toString('base64'));

test('the main sequence goes directly from Operation Because to Foundationalism', () => {
  assert.equal(regressSceneDestination(operationBecauseScene, true), foundationalismScene);
  assert.equal(regressSceneDestination(foundationalismScene, false), operationBecauseScene);
  assert.equal(regressSceneDestination(operationBecauseScene, false), undefined);
  assert.equal(regressSceneDestination(foundationalismScene, true), undefined);
});

test('each optional dialogue returns to the overview in either direction', () => {
  assert.equal(regressDetours.length, 3);
  for (const { scene } of regressDetours) {
    assert.equal(regressSceneDestination(scene, true), operationBecauseScene);
    assert.equal(regressSceneDestination(scene, false), operationBecauseScene);
  }
});
