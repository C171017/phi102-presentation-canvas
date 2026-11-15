import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { test } from 'node:test';

// Execute the actual production functions with instrumented geometry/style
// boundaries, so regressions in read/write ordering and invalidation are visible.
const source = ts.createSourceFile('main.ts', readFileSync(new URL('../src/main.ts', import.meta.url), 'utf8'), ts.ScriptTarget.Latest, true);
function runFunctions(names, context) {
  const code = source.statements.filter(node => ts.isFunctionDeclaration(node) && names.includes(node.name?.text)).map(node => node.getText(source)).join('\n');
  const sandbox = vm.createContext(context);
  vm.runInContext(ts.transpile(code, { target: ts.ScriptTarget.ES2022 }), sandbox);
  return sandbox;
}
function geometryFixture() {
  const trace = [];
  const view = { x: 23, y: -42, zoom: 1.7 };
  const positions = { source: { x: 0, y: 0, width: 240, height: 80 }, destination: { x: 600, y: -150, width: 360, height: 180 } };
  const element = name => ({ getBoundingClientRect() {
    trace.push(`read:${name}`);
    const p = positions[name];
    return { left: 820 + (p.x - p.width / 2 - view.x) * view.zoom, right: 820 + (p.x + p.width / 2 - view.x) * view.zoom,
      top: 430 + (p.y - p.height / 2 - view.y) * view.zoom, bottom: 430 + (p.y + p.height / 2 - view.y) * view.zoom };
  } });
  const paths = Array.from({ length: 3 }, () => ({ dataset: { target: 'destination' }, d: '', getAttribute() { return this.d; }, setAttribute(_, d) { trace.push('write:path'); this.d = d; } }));
  return { trace, view, positions, paths, document: {
    getElementById: id => {
      if (id === 'flexible-heading') return element('source');
      return id === 'destination' ? element('destination') : null;
    },
    querySelectorAll: selector => selector === '#connections > path' ? paths : [],
  } };
}

test('connection endpoints keep the original geometry, with all reads before writes', () => {
  const f = geometryFixture();
  const ctx = runFunctions(['updateConnections'], { ...f, viewport: { clientWidth: 1000, clientHeight: 800 }, canvasBounds: { left: 320, top: 30 } });
  ctx.updateConnections();
  const firstWrite = f.trace.indexOf('write:path');
  assert.ok(firstWrite > 0);
  assert.ok(f.trace.slice(firstWrite).every(action => action === 'write:path'), 'all geometry reads precede writes');
  const numbers = f.paths[0].d.match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/g).map(Number);
  const expected = [128, 0, 254.9, 0, 283.1, -150, 410, -150];
  numbers.forEach((n, i) => assert.ok(Math.abs(n - expected[i]) < 1e-9));
  f.trace.length = 0;
  ctx.updateConnections();
  assert.ok(f.trace.every(action => action.startsWith('read:')), 'unchanged paths are not rewritten');
});

test('group movement batches position reads and schedules one save and connection update', () => {
  const trace = [];
  const items = Array.from({ length: 7 }, (_, i) => ({
    get offsetLeft() { trace.push('read'); return i * 10; },
    get offsetTop() { trace.push('read'); return i * 20; },
    style: new Proxy({}, { set(target, key, value) { trace.push('write'); target[key] = value; return true; } }),
  }));
  let saves = 0, invalidations = 0;
  const ctx = runFunctions(['moveSelection'], { selectedItems: new Set(items), layout: { schedule: () => saves++ }, invalidateConnections: () => invalidations++ });
  ctx.moveSelection(items[0], 3.5, -2);
  assert.deepEqual(trace, [...Array(14).fill('read'), ...Array(14).fill('write')]);
  items.forEach((item, i) => assert.deepEqual(item.style, { left: `${i * 10 + 3.5}px`, top: `${i * 20 - 2}px` }));
  assert.equal(saves, 1);
  assert.equal(invalidations, 1);
});

test('camera-only frames reuse connections; explicit invalidation refreshes once', () => {
  let connections = 0, renders = 0;
  const view = { x: 0, y: 0, zoom: 1 };
  const ctx = runFunctions(['renderGrid', 'render', 'invalidateConnections', 'wake'], {
    view, target: view, innerWidth: 1000, innerHeight: 800, connectionsDirty: true, frame: undefined,
    canvasBounds: { left: 320, top: 30 },
    backdrop: { style: { setProperty() {} } },
    viewport: { clientWidth: 1000, clientHeight: 800, style: { setProperty() {} } }, world: { style: {} },
    updateConnections: () => connections++,
    slideNavigation: { measure() {}, update() {} },
    camera: { position: {}, updateProjectionMatrix() {} },
    renderer: { render: () => renders++ }, scene: {}, requestAnimationFrame: () => 1, tick() {},
  });
  ctx.render();
  for (let i = 0; i < 120; i++) { view.x += 10; view.zoom += 0.01; ctx.render(); }
  assert.equal(connections, 1);
  assert.equal(renders, 121, 'optional Three.js scene still renders');
  ctx.invalidateConnections(); ctx.invalidateConnections(); ctx.render();
  assert.equal(connections, 2);
});


test('a self-unsubscribing animation still refreshes its final content edit', () => {
  let updates = 0;
  const callbacks = new Set();
  callbacks.add(() => callbacks.clear());
  const ctx = runFunctions(['tick'], {
    frame: undefined, tween: undefined, animationCallbacks: callbacks, connectionsDirty: false,
    render() { if (ctx.connectionsDirty) updates++; ctx.connectionsDirty = false; }, wake() {},
  });
  ctx.tick(0); ctx.tick(16);
  assert.equal(updates, 2);
});
