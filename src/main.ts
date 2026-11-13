/// <reference types="vite/client" />
import * as THREE from 'three';
import { createLayoutController } from './layout';
import initialLayout from './initial-layout';
import './style.css';
import './layout.css';

type View = { x: number; y: number; zoom: number };
type Stop = View & { duration?: number };
const viewport = document.querySelector<HTMLElement>('#viewport')!;
const world = document.querySelector<HTMLElement>('#world')!;
const view: View = { x: 0, y: 0, zoom: 1 };
const target: View = { ...view };
const layout = createLayoutController(world, () => ({ ...target }), restored => {
  Object.assign(view, restored);
  Object.assign(target, restored);
  queueMicrotask(wake);
}, initialLayout);
function updateConnections() {
  const source = document.getElementById('flexible-heading');
  if (!source) return;
  const rect = source.getBoundingClientRect();
  const sourceX = (rect.right - innerWidth / 2) / view.zoom + view.x + 8;
  const sourceY = ((rect.top + rect.bottom) / 2 - innerHeight / 2) / view.zoom + view.y;
  document.querySelectorAll<SVGPathElement>('#connections > path').forEach(path => {
    const destination = document.getElementById(path.dataset.target!);
    if (!destination) return;
    const to = destination.getBoundingClientRect();
    const x = (to.left - innerWidth / 2) / view.zoom + view.x - 10;
    const y = ((to.top + to.bottom) / 2 - innerHeight / 2) / view.zoom + view.y;
    const bend = Math.max(55, Math.abs(x - sourceX) * 0.45);
    path.setAttribute('d', `M${sourceX} ${sourceY}C${sourceX + bend} ${sourceY} ${x - bend} ${y} ${x} ${y}`);
  });
}
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10000);
camera.position.z = 2000;
let renderer: THREE.WebGLRenderer | undefined;
try {
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.domElement.id = 'three-layer';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  viewport.prepend(renderer.domElement);
} catch (error) {
  // HTML content and navigation still work on devices without WebGL.
  console.warn('The optional 3D layer is unavailable.', error);
}

let stops: Stop[] = [];
let stopIndex = -1;
let tween: { from: View; to: View; start: number; duration: number } | undefined;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const clampZoom = (zoom: number) => Math.min(8, Math.max(0.1, zoom));
function goTo(next: Partial<View>, duration = 550) {
  const to = { ...target, ...next };
  if (![to.x, to.y, to.zoom, duration].every(Number.isFinite)) return;
  to.zoom = clampZoom(to.zoom);
  Object.assign(target, to);
  tween = { from: { ...view }, to, start: performance.now(), duration: reducedMotion.matches ? 0 : Math.max(0, duration) };
  layout.schedule();
  wake();
}
function step(direction: number) {
  if (!stops.length) { goTo({ x: target.x + direction * innerWidth * 0.85 / target.zoom }); return; }
  stopIndex = Math.max(0, Math.min(stops.length - 1, stopIndex + direction));
  goTo(stops[stopIndex], stops[stopIndex].duration);
}
function render() {
  viewport.style.setProperty('--grid-size', `${24 * view.zoom}px`);
  viewport.style.setProperty('--grid-x', `${innerWidth / 2 - view.x * view.zoom}px`);
  viewport.style.setProperty('--grid-y', `${innerHeight / 2 - view.y * view.zoom}px`);
  world.style.transform = `scale(${view.zoom}) translate(${-view.x}px, ${-view.y}px)`;
  updateConnections();
  camera.position.x = view.x;
  camera.position.y = -view.y;
  camera.zoom = view.zoom;
  camera.updateProjectionMatrix();
  renderer?.render(scene, camera);
}
let frame: number | undefined;
function wake() { if (frame === undefined) frame = requestAnimationFrame(tick); }
function tick(now: number) {
  frame = undefined;
  if (tween) {
    const t = tween.duration ? Math.min(1, (now - tween.start) / tween.duration) : 1;
    const ease = t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
    for (const key of ['x', 'y', 'zoom'] as const) view[key] = tween.from[key] + (tween.to[key] - tween.from[key]) * ease;
    if (t === 1) tween = undefined;
  }
  render();
  if (tween || animationCallbacks.size) {
    for (const callback of animationCallbacks) callback(now);
    wake();
  }
}
const animationCallbacks = new Set<(time: number) => void>();
function resize() {
  camera.left = -innerWidth / 2; camera.right = innerWidth / 2;
  camera.top = innerHeight / 2; camera.bottom = -innerHeight / 2;
  renderer?.setSize(innerWidth, innerHeight);
  wake();
}
window.addEventListener('resize', resize);
window.addEventListener('keydown', (event) => {
  const element = event.target as HTMLElement;
  if (event.defaultPrevented || element.isContentEditable || element.closest('input, textarea, select, button, a') || event.metaKey || event.ctrlKey || event.altKey) return;
  const distance = (event.shiftKey ? 600 : 180) / target.zoom;
  switch (event.key) {
    case 'ArrowLeft': goTo({ x: target.x - distance }); break;
    case 'ArrowRight': goTo({ x: target.x + distance }); break;
    case 'ArrowUp': goTo({ y: target.y - distance }); break;
    case 'ArrowDown': goTo({ y: target.y + distance }); break;
    case ' ': case 'PageDown': step(event.shiftKey ? -1 : 1); break;
    case 'PageUp': step(-1); break;
    case '+': case '=': goTo({ zoom: target.zoom * 1.2 }); break;
    case '-': case '_': goTo({ zoom: target.zoom / 1.2 }); break;
    case 'Home': case '0': stopIndex = -1; goTo({ x: 0, y: 0, zoom: 1 }); break;
    case 'f': case 'F':
      void (document.fullscreenElement ? document.exitFullscreen() : viewport.requestFullscreen()).catch(console.warn); break;
    default: return;
  }
  event.preventDefault();
});
function moveLabel(label: HTMLElement, dx: number, dy: number) {
  label.style.left = `${label.offsetLeft + dx}px`;
  label.style.top = `${label.offsetTop + dy}px`;
  layout.schedule();
  updateConnections();
}
const selectedItems = new Set<HTMLElement>();
const selectionBox = document.querySelector<HTMLElement>('#selection-box')!;
function selectItems(items: Iterable<HTMLElement>) {
  selectedItems.clear();
  for (const item of items) selectedItems.add(item);
  world.querySelectorAll<HTMLElement>('.canvas-label').forEach(item => item.classList.toggle('is-selected', selectedItems.has(item)));
}
function moveSelection(label: HTMLElement, dx: number, dy: number) {
  for (const item of selectedItems.has(label) ? selectedItems : [label]) moveLabel(item, dx, dy);
}
world.querySelectorAll<HTMLElement>('.canvas-label').forEach((label) => {
  const name = label.dataset.label ?? (label.classList.contains('canvas-media') ? 'image' : label.querySelector('div')?.textContent ?? 'item');
  const handle = document.createElement('button');
  handle.type = 'button';
  handle.className = 'resize-handle';
  handle.setAttribute('aria-label', `Resize ${name}`);
  label.append(handle);
  const getScale = () => Number(label.style.getPropertyValue('--item-scale')) || 1;
  function setScale(value: number) {
    label.style.setProperty('--item-scale', String(Math.max(0.25, Math.min(4, value))));
    layout.schedule();
    updateConnections();
  }
  let resizing: { id: number; startX: number; startY: number; scale: number; width: number; height: number; zoom: number } | undefined;
  handle.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || resizing) return;
    event.stopPropagation(); event.preventDefault();
    tween = undefined; Object.assign(target, view);
    const rect = label.getBoundingClientRect();
    resizing = { id: event.pointerId, startX: event.clientX, startY: event.clientY, scale: getScale(), width: rect.width, height: rect.height, zoom: view.zoom };
    handle.setPointerCapture(event.pointerId); handle.focus({ preventScroll: true });
  });
  handle.addEventListener('pointermove', (event) => {
    if (!resizing || resizing.id !== event.pointerId) return;
    event.stopPropagation();
    const { startX, startY, scale, width, height, zoom } = resizing;
    // Project pointer movement onto the corner diagonal; center stays fixed.
    const growth = 2 * ((event.clientX - startX) * width + (event.clientY - startY) * height) / (width * width + height * height);
    setScale(scale * (1 + growth) * zoom / view.zoom);
  });
  const finishResize = (event: PointerEvent) => {
    if (resizing?.id === event.pointerId) { resizing = undefined; layout.save(); }
  };
  handle.addEventListener('pointerup', finishResize);
  handle.addEventListener('pointercancel', finishResize);
  handle.addEventListener('lostpointercapture', finishResize);
  handle.addEventListener('keydown', (event) => {
    if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(event.key)) return;
    event.preventDefault(); event.stopPropagation();
    const delta = event.shiftKey ? 0.2 : 0.05;
    setScale(getScale() + (['ArrowRight', 'ArrowDown'].includes(event.key) ? delta : -delta));
  });
  label.addEventListener('keydown', (event) => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
    const step = (event.shiftKey ? 40 : 10) / view.zoom;
    switch (event.key) {
      case 'ArrowLeft': moveSelection(label, -step, 0); break;
      case 'ArrowRight': moveSelection(label, step, 0); break;
      case 'ArrowUp': moveSelection(label, 0, -step); break;
      case 'ArrowDown': moveSelection(label, 0, step); break;
      default: return;
    }
    event.preventDefault();
  });
});

let drag: { id: number; x: number; y: number; startX: number; startY: number; label: HTMLElement | null; retained: HTMLElement[] } | undefined;
viewport.addEventListener('pointerdown', (event) => {
  const element = event.target as HTMLElement;
  if (drag || event.button !== 0 || element.closest('input, textarea, select, button, a, [contenteditable="true"]')) return;
  tween = undefined; Object.assign(target, view);
  const label = element.closest<HTMLElement>('.canvas-label');
  const additive = event.shiftKey || event.metaKey || event.ctrlKey;
  const retained = additive ? [...selectedItems] : [];
  if (label) {
    if (additive && selectedItems.has(label)) {
      selectItems([...selectedItems].filter(item => item !== label));
      return;
    }
    if (!selectedItems.has(label)) selectItems(additive ? [...selectedItems, label] : [label]);
    label.focus({ preventScroll: true });
  } else {
    selectItems(retained);
    viewport.focus({ preventScroll: true });
  }
  event.preventDefault();
  drag = { id: event.pointerId, x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY, label, retained };
  viewport.setPointerCapture(event.pointerId);
  viewport.classList.toggle('dragging', Boolean(label));
});
viewport.addEventListener('pointermove', (event) => {
  if (!drag || drag.id !== event.pointerId) return;
  const dx = (event.clientX - drag.x) / view.zoom;
  const dy = (event.clientY - drag.y) / view.zoom;
  if (drag.label) moveSelection(drag.label, dx, dy);
  else {
    const left = Math.min(drag.startX, event.clientX), top = Math.min(drag.startY, event.clientY);
    const right = Math.max(drag.startX, event.clientX), bottom = Math.max(drag.startY, event.clientY);
    const bounds = viewport.getBoundingClientRect();
    selectionBox.hidden = false;
    Object.assign(selectionBox.style, { left: `${left - bounds.left}px`, top: `${top - bounds.top}px`, width: `${right - left}px`, height: `${bottom - top}px` });
    const hits = [...drag.retained];
    world.querySelectorAll<HTMLElement>('.canvas-label').forEach(item => {
      const rect = item.getBoundingClientRect();
      if (rect.right >= left && rect.left <= right && rect.bottom >= top && rect.top <= bottom) hits.push(item);
    });
    selectItems(hits);
  }
  drag.x = event.clientX; drag.y = event.clientY;
});
function endDrag(event: PointerEvent) {
  if (drag?.id !== event.pointerId) return;
  if (drag.label) layout.save();
  drag = undefined; viewport.classList.remove('dragging'); selectionBox.hidden = true;
}
viewport.addEventListener('pointerup', endDrag);
viewport.addEventListener('pointercancel', endDrag);
viewport.addEventListener('lostpointercapture', endDrag);
viewport.addEventListener('wheel', (event) => {
  if (drag) return;
  event.preventDefault(); tween = undefined; Object.assign(target, view);
  if (event.ctrlKey || event.metaKey) {
    const zoom = clampZoom(view.zoom * Math.exp(-event.deltaY * 0.01));
    const dx = event.clientX - innerWidth / 2, dy = event.clientY - innerHeight / 2;
    view.x += dx / view.zoom - dx / zoom; view.y += dy / view.zoom - dy / zoom;
    view.zoom = zoom;
  } else {
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1;
    view.x += event.deltaX * unit / view.zoom; view.y += event.deltaY * unit / view.zoom;
  }
  Object.assign(target, view); wake();
  layout.schedule();
}, { passive: false });

// Public controls for later presentation content and automation. Coordinates
// use CSS pixels from the center, with positive y pointing down.
const presentation = {
  world, scene, camera, THREE, goTo,
  next: () => step(1), previous: () => step(-1),
  reset: () => { stopIndex = -1; goTo({ x: 0, y: 0, zoom: 1 }); },
  getView: (): View => ({ ...view }),
  saveLayout: () => layout.save(true),
  setStops: (next: Stop[]) => { stops = next.map(stop => ({ ...stop })); stopIndex = -1; },
  invalidate: wake,
  animate: (callback: (time: number) => void) => { animationCallbacks.add(callback); wake(); return () => animationCallbacks.delete(callback); },
};
declare global { interface Window { presentation: typeof presentation } }
window.presentation = presentation;
const connectionObserver = new ResizeObserver(updateConnections);
world.querySelectorAll('.canvas-label').forEach(label => connectionObserver.observe(label));
void document.fonts.ready.then(updateConnections);
resize();
void layout.ready;
if (import.meta.hot) {
  import.meta.hot.on('vite:beforeFullReload', () => { void layout.save(false, true); });
  import.meta.hot.dispose(() => { void layout.save(false, true); });
}
