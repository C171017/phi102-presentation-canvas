import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../src/page-backgrounds.ts', import.meta.url), 'utf8')
  .replace(/^import .*;$/gm, '').replace(/^export /gm, '');
function fixture(headings = ['contemporary-heading', 'flexible-heading']) {
  const makeElement = () => {
    const classes = new Set();
    return {
      children: [], dataset: {},
      classList: {
        add: name => classes.add(name), remove: name => classes.delete(name), contains: name => classes.has(name),
        toggle(name, force) { force ? classes.add(name) : classes.delete(name); },
      },
      setAttribute() {}, append(child) { this.children.push(child); },
      prepend(child) { this.children.unshift(child); }, remove() {},
    };
  };
  const pending = new Map();
  const viewport = makeElement();
  const members = headings.map(makeElement);
  const sandbox = vm.createContext({
    document: { createElement: makeElement, getElementById: id => members[headings.indexOf(id)] },
    slides: headings.map(id => ({ members: [id] })),
    Image: class {
      constructor() { Object.assign(this, makeElement()); }
      decode() { return new Promise((resolve, reject) => pending.set(this.src, { resolve, reject })); }
    },
    console: { warn() {} },
  });
  vm.runInContext(ts.transpile(source, { target: ts.ScriptTarget.ES2022 }), sandbox);
  const controller = sandbox.createPageBackgrounds(viewport);
  const finish = async (name, fail = false) => {
    const entry = [...pending].find(([key]) => key.includes(name));
    assert.ok(entry, `pending decode exists for ${name}`);
    entry[1][fail ? 'reject' : 'resolve'](new Error('test decode failure'));
    await new Promise(resolve => setImmediate(resolve));
  };
  return { controller, viewport, members, stage: viewport.children[0], finish };
}

test('a late image cannot reappear after leaving a page', async () => {
  const f = fixture();
  f.controller.update(0);
  f.controller.update(-1);
  await f.finish('01-context');
  assert.equal(f.viewport.classList.contains('in-page-view'), false);
  assert.equal(f.stage.dataset.slide, undefined);
  assert.ok(f.members.every(member => !member.classList.contains('page-foreground')));
});

test('rapid page changes retain the newest image even if the old image finishes last', async () => {
  const f = fixture();
  f.controller.update(0);
  f.controller.update(1);
  await f.finish('02-foundations');
  await f.finish('01-context');
  assert.equal(f.stage.dataset.slide, '2');
  assert.equal(f.viewport.classList.contains('in-page-view'), true);
  const visible = f.stage.children.filter(layer => layer.classList.contains('is-visible'));
  assert.equal(visible.length, 1);
  assert.match(visible[0].src, /02-foundations/);
});

test('a failed page image falls back to the plain canvas instead of displaying the previous page', async () => {
  const f = fixture();
  f.controller.update(0);
  await f.finish('01-context');
  f.controller.update(1);
  await f.finish('02-foundations', true);
  assert.equal(f.viewport.classList.contains('in-page-view'), false);
  assert.equal(f.stage.dataset.slide, undefined);
});

test('an inserted pairing shares its version’s artwork without shifting the next slide’s background', async () => {
  const f = fixture(['pairing-social-simone', 'pairing-hinges-simone', 'access-heading']);
  f.controller.update(0);
  f.controller.update(1);
  await f.finish('13-subject');
  assert.equal(f.stage.dataset.slide, '2');
  assert.match(f.stage.children.find(layer => layer.classList.contains('is-visible')).src, /13-subject/);
  f.controller.update(2);
  await f.finish('16-access');
  assert.match(f.stage.children.find(layer => layer.classList.contains('is-visible')).src, /16-access/);
});

test('active and archived backgrounds are packaged with their generation prompts', () => {
  const manifest = JSON.parse(readFileSync(new URL('../docs/background-prompts.json', import.meta.url), 'utf8'));
  assert.equal(manifest.images.length, 19);
  assert.equal(new Set(manifest.images.map(image => image.name)).size, 19);
  for (const image of manifest.images) {
    assert.ok(existsSync(new URL(`../public/generated/backgrounds/abstract-v1/${image.name}.webp`, import.meta.url)));
    assert.ok(image.prompt.includes('No text'));
    assert.equal(source.includes(`'${image.name}'`), image.name !== '19-takeaways', image.name);
  }
});
