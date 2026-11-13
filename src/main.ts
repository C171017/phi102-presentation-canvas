/// <reference types="vite/client" />
import * as THREE from 'three';
import { createLayoutController } from './layout';
import initialLayout from './initial-layout';
import { initializeIllustrations } from './illustrations';
import { createSlideNavigation } from './slides';
import { initializeRegressAnimations } from './regress-animations';
import { connectPresentation, liveMode } from './live-presentation';
import { createReadingPanel } from './reading-panel';
import './style.css';
import './layout.css';

type View = { x: number; y: number; zoom: number };
type Stop = View & { duration?: number };
const viewport = document.querySelector<HTMLElement>('#viewport')!;
let canvasBounds = viewport.getBoundingClientRect();
const world = document.querySelector<HTMLElement>('#world')!;
initializeIllustrations();
const disposeRegressAnimations = initializeRegressAnimations();
const view: View = { x: 0, y: 0, zoom: 1 };
const target: View = { ...view };
let reportSlide: ((index: number) => void) | undefined;
const readingPanel = createReadingPanel();
const slideNavigation = createSlideNavigation(world, goTo, index => { readingPanel.update(index); reportSlide?.(index); });
viewport.classList.toggle('live-mode', liveMode);
let connectionsDirty = true;
const layout = createLayoutController(world, () => ({ ...target }), restored => {
  Object.assign(view, restored);
  Object.assign(target, restored);
  connectionsDirty = true;
  queueMicrotask(wake);
}, initialLayout, liveMode);
function updateConnections() {
  const source = document.getElementById('flexible-heading');
  if (!source) return;
  const rect = source.getBoundingClientRect();
  // Read all endpoint geometry before writing paths to avoid layout thrashing.
  const updates: { path: SVGPathElement; d: string }[] = [];
  document.querySelectorAll<SVGPathElement>('#connections > path').forEach(path => {
    const destination = document.getElementById(path.dataset.target!);
    const from = path.dataset.source ? document.getElementById(path.dataset.source)?.getBoundingClientRect() : rect;
    if (!from || !destination) return;
    const sourceX = (from.right - canvasBounds.left - viewport.clientWidth / 2) / view.zoom + view.x + 8;
    const sourceY = ((from.top + from.bottom) / 2 - canvasBounds.top - viewport.clientHeight / 2) / view.zoom + view.y;
    const to = destination.getBoundingClientRect();
    const x = (to.left - canvasBounds.left - viewport.clientWidth / 2) / view.zoom + view.x - 10;
    const y = ((to.top + to.bottom) / 2 - canvasBounds.top - viewport.clientHeight / 2) / view.zoom + view.y;
    const bend = Math.max(55, Math.abs(x - sourceX) * 0.45);
    updates.push({ path, d: `M${sourceX} ${sourceY}C${sourceX + bend} ${sourceY} ${x - bend} ${y} ${x} ${y}` });
  });
  const hub = document.getElementById('regress-problem');
  if (hub) {
    const from = hub.getBoundingClientRect();
    // Anchor to the label edges, so moving/resizing either end keeps its link attached.
    const edge = (rect: DOMRect, dx: number, dy: number) => {
      const distance = Math.min((rect.width / 2 + 8 * view.zoom) / (Math.abs(dx) || Number.MIN_VALUE),
        (rect.height / 2 + 8 * view.zoom) / (Math.abs(dy) || Number.MIN_VALUE));
      return {
        x: ((rect.left + rect.right) / 2 + dx * distance - canvasBounds.left - viewport.clientWidth / 2) / view.zoom + view.x,
        y: ((rect.top + rect.bottom) / 2 + dy * distance - canvasBounds.top - viewport.clientHeight / 2) / view.zoom + view.y,
      };
    };
    document.querySelectorAll<SVGPathElement>('#regress-connections > path').forEach(path => {
      const destination = document.getElementById(path.dataset.target!);
      if (!destination) return;
      const to = destination.getBoundingClientRect();
      const dx = (to.left + to.right - from.left - from.right) / 2;
      const dy = (to.top + to.bottom - from.top - from.bottom) / 2;
      if (Math.hypot(dx, dy) < 1) { updates.push({ path, d: '' }); return; }
      const a = edge(from, dx, dy), b = edge(to, -dx, -dy);
      updates.push({ path, d: `M${a.x} ${a.y}L${b.x} ${b.y}` });
    });
  }
  for (const { path, d } of updates) {
    if (path.getAttribute('d') !== d) path.setAttribute('d', d);
  }
}
function invalidateConnections() { connectionsDirty = true; wake(); }
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
  if (!stops.length) { slideNavigation.step(direction); return; }
  stopIndex = Math.max(0, Math.min(stops.length - 1, stopIndex + direction));
  goTo(stops[stopIndex], stops[stopIndex].duration);
}
function render() {
  const backdrop = viewport.parentElement!;
  backdrop.style.setProperty('--grid-size', `${viewport.clientWidth ? 24 * view.zoom : 24}px`);
  backdrop.style.setProperty('--grid-x', `${canvasBounds.left + viewport.clientWidth / 2 - view.x * view.zoom}px`);
  backdrop.style.setProperty('--grid-y', `${canvasBounds.top + viewport.clientHeight / 2 - view.y * view.zoom}px`);
  world.style.transform = `scale(${view.zoom}) translate(${-view.x}px, ${-view.y}px)`;
  // Connections live inside the same transformed world: pan/zoom cannot
  // change their world-space geometry. Only content/layout edits invalidate it.
  if (connectionsDirty) {
    connectionsDirty = false;
    slideNavigation.measure(view.zoom);
    updateConnections();
  }
  slideNavigation.update(target);
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
  // Public animation callbacks may edit arbitrary HTML content.
  if (animationCallbacks.size) connectionsDirty = true;
  render();
  if (tween || animationCallbacks.size) {
    for (const callback of animationCallbacks) {
      callback(now);
      // Also refresh after a callback edits content and unsubscribes itself.
      connectionsDirty = true;
    }
    wake();
  }
}
const animationCallbacks = new Set<(time: number) => void>();
function resize() {
  canvasBounds = viewport.getBoundingClientRect();
  camera.left = -viewport.clientWidth / 2; camera.right = viewport.clientWidth / 2;
  camera.top = viewport.clientHeight / 2; camera.bottom = -viewport.clientHeight / 2;
  renderer?.setSize(viewport.clientWidth, viewport.clientHeight);
  invalidateConnections();
}
window.addEventListener('resize', resize);
const canvasResizeObserver = new ResizeObserver(resize);
canvasResizeObserver.observe(viewport);
window.addEventListener('keydown', (event) => {
  const element = event.target as HTMLElement;
  if (event.defaultPrevented || element.isContentEditable || element.closest('#reading-panel, input, textarea, select, a') || event.metaKey || event.ctrlKey || event.altKey) return;
  const slideButton = element.closest('#slide-progress button');
  if (element.closest('button') && (!slideButton || event.key === ' ' || event.key === 'Enter')) return;
  const distance = (event.shiftKey ? 600 : 180) / target.zoom;
  switch (event.key) {
    case 'ArrowLeft':
      if (event.shiftKey) goTo({ x: target.x - distance });
      else step(-1);
      break;
    case 'ArrowRight':
      if (event.shiftKey) goTo({ x: target.x + distance });
      else step(1);
      break;
    case 'ArrowUp': goTo({ y: target.y - distance }); break;
    case 'ArrowDown': goTo({ y: target.y + distance }); break;
    case ' ': case 'PageDown': step(event.shiftKey ? -1 : 1); break;
    case 'PageUp': step(-1); break;
    case '+': case '=': goTo({ zoom: target.zoom * 1.2 }); break;
    case '-': case '_': goTo({ zoom: target.zoom / 1.2 }); break;
    case 'Home': case '0': stopIndex = -1; goTo({ x: 0, y: 0, zoom: 1 }); break;
    case 'f': case 'F':
      void (document.fullscreenElement ? document.exitFullscreen() : document.querySelector<HTMLElement>('#presentation-shell')!.requestFullscreen()).catch(console.warn); break;
    default: return;
  }
  event.preventDefault();
});
const selectedItems = new Set<HTMLElement>();
const selectionBox = document.querySelector<HTMLElement>('#selection-box')!;
function selectItems(items: Iterable<HTMLElement>) {
  selectedItems.clear();
  for (const item of items) selectedItems.add(item);
  world.querySelectorAll<HTMLElement>('.canvas-label').forEach(item => item.classList.toggle('is-selected', selectedItems.has(item)));
}
function moveSelection(label: HTMLElement, dx: number, dy: number) {
  // Snapshot all positions first; reading offsets after each write forces layout.
  const moves = [...(selectedItems.has(label) ? selectedItems : [label])].map(item => ({
    item, x: item.offsetLeft + dx, y: item.offsetTop + dy,
  }));
  for (const { item, x, y } of moves) {
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
  }
  layout.schedule();
  invalidateConnections();
}
world.querySelectorAll<HTMLElement>('.canvas-label').forEach((label) => {
  if (liveMode) return;
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
    invalidateConnections();
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
    if (event.defaultPrevented || !event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) return;
    const step = 10 / view.zoom;
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
  if (liveMode) return;
  const element = event.target as HTMLElement;
  if (drag || event.button !== 0 || element.closest('#slide-progress, input, textarea, select, button, a, [contenteditable="true"]')) return;
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
    const hits = [...drag.retained];
    world.querySelectorAll<HTMLElement>('.canvas-label').forEach(item => {
      const rect = item.getBoundingClientRect();
      if (rect.right >= left && rect.left <= right && rect.bottom >= top && rect.top <= bottom) hits.push(item);
    });
    selectionBox.hidden = false;
    Object.assign(selectionBox.style, { left: `${left - bounds.left}px`, top: `${top - bounds.top}px`, width: `${right - left}px`, height: `${bottom - top}px` });
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
    const dx = event.clientX - canvasBounds.left - viewport.clientWidth / 2, dy = event.clientY - canvasBounds.top - viewport.clientHeight / 2;
    view.x += dx / view.zoom - dx / zoom; view.y += dy / view.zoom - dy / zoom;
    view.zoom = zoom;
  } else {
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport.clientHeight : 1;
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
  invalidate: invalidateConnections,
  animate: (callback: (time: number) => void) => { animationCallbacks.add(callback); wake(); return () => animationCallbacks.delete(callback); },
};
declare global { interface Window { presentation: typeof presentation } }
window.presentation = presentation;
const connectionObserver = new ResizeObserver(invalidateConnections);
world.querySelectorAll('.canvas-label').forEach(label => connectionObserver.observe(label));
void document.fonts.ready.then(invalidateConnections);
resize();
if (liveMode) {
  void layout.ready.then(() => {
    requestAnimationFrame(() => {
      reportSlide = connectPresentation(viewport, slideNavigation.open);
      invalidateConnections();
    });
  });
}
if (import.meta.hot) {
  import.meta.hot.dispose(disposeRegressAnimations);
  import.meta.hot.on('vite:beforeFullReload', () => { void layout.save(false, true); });
  import.meta.hot.dispose(() => { void layout.save(false, true); });
}
