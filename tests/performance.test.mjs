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
  const positions = { source: { x: 0, y: 0, width: 240, height: 80 }, upper: { x: 600, y: -150, width: 360, height: 180 }, lower: { x: 600, y: 150, width: 360, height: 180 } };
  const origin = { left: 820 - view.x * view.zoom, top: 430 - view.y * view.zoom };
  const element = name => ({ getBoundingClientRect() {
    trace.push(`read:${name}`);
    const p = positions[name];
    return { left: origin.left + (p.x - p.width / 2) * view.zoom, right: origin.left + (p.x + p.width / 2) * view.zoom,
      top: origin.top + (p.y - p.height / 2) * view.zoom, bottom: origin.top + (p.y + p.height / 2) * view.zoom };
  } });
  const path = () => ({ d: '', getAttribute() { return this.d; }, setAttribute(_, d) { trace.push('write:path'); this.d = d; },
    hasAttribute() { return Boolean(this.d); }, removeAttribute() { this.d = ''; } });
  const source = element('source');
  const links = ['upper', 'lower'].map(name => ({ source, target: element(name), line: path(), flow: path(), silhouette: path(),
    group: { style: { setProperty() { trace.push('write:style'); } } } }));
  return { trace, view, origin, positions, links };
}

test('connections separate branch lanes and follow moved or resized endpoints without interleaving geometry reads and writes', () => {
  const f = geometryFixture();
  const code = readFileSync(new URL('../src/connections.ts', import.meta.url), 'utf8').replace(/^import .+;\n/, '').replace('export function', 'function');
  const ctx = vm.createContext({});
  vm.runInContext(ts.transpile(code, { target: ts.ScriptTarget.ES2022 }), ctx);
  const update = () => ctx.updateConnections(f.links, f.origin, f.view.zoom);
  update();
  assert.deepEqual(f.trace.slice(0, 3), ['read:source', 'read:upper', 'read:lower']);
  assert.ok(f.trace.slice(3).every(action => action.startsWith('write:')), 'all geometry reads precede writes');
  const [upper, lower] = f.links;
  assert.match(upper.line.d, /^M134 -10L.*A.*AL?[^A]+L406 -150$/);
  assert.match(lower.line.d, /^M134 10L.*A.*L406 150$/);
  assert.match(upper.silhouette.d, /Q[^Q]+ 406 -150Q/, 'taper reaches the same tip as the stroke');
  assert.equal(upper.flow.d, upper.line.d);
  f.trace.length = 0;
  update();
  assert.ok(f.trace.every(action => action.startsWith('read:')), 'unchanged paths are not rewritten');
  Object.assign(f.positions.upper, { x: -700, y: 0, width: 200 });
  update();
  assert.equal(upper.line.d, 'M-134 0L-586 0');
  assert.equal(upper.flow.d, upper.line.d, 'the moving highlight reaches the end of the taper');
  upper.preferRow = true;
  Object.assign(f.positions.upper, { x: 600, y: -750 });
  update();
  assert.match(upper.line.d, /^M134 -10L.*A/, 'slide-to-slide links stay in the side corridor');
  Object.assign(f.positions.upper, { x: 0, y: 0 });
  update();
  assert.ok([upper.line, upper.flow, upper.silhouette].every(part => !part.d), 'overlapping endpoints do not produce a stray link');
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
    view, target: view, tween: undefined, innerWidth: 1000, innerHeight: 800, connectionsDirty: true, frame: undefined,
    canvasBounds: { left: 320, top: 30 },
    backdrop: { style: { setProperty() {} } },
    viewport: { clientWidth: 1000, clientHeight: 800, style: { setProperty() {} } }, world: { style: {} },
    updateConnections: () => connections++,
    slideNavigation: { measure() {}, update() {}, updateVisible() {} },
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
