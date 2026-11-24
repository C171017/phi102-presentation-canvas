/// <reference types="vite/client" />
import { createCanvasGrid } from './canvas-grid';
import { constrainCanvasView, measureCanvasContent } from './canvas-pan';
import { createLayoutController } from './layout';
import initialLayout from './initial-layout';
import { initializeIllustrations } from './illustrations';
import { initializePaperSlides } from './paper-slides';
import { initializeVersionPairings } from './version-pairing-cards';
import { createConnections } from './connections';
import { createSlideNavigation } from './slides';
import { createPageExit } from './page-exit';
import { legendById, slides } from './slide-content';
import { addLegendAnchors } from './ink-ocean-entries';
import { createClassroomDialogue } from './classroom-dialogue';
import { createOpeningVideo } from './opening-video';
import openingMedia from './opening-media.json';
import type { PresentationCues } from './live-protocol';
import { createLocalQuizVotes } from './local-quiz-votes';
import { initializeRegressAnimations } from './regress-animations';
import { connectPresentation, liveMode } from './live-presentation';
import type { ThreeLayer } from './three-layer';
import './style.css';
import './layout.css';

type View = { x: number; y: number; zoom: number };
type Stop = View & { duration?: number };
const viewport = document.querySelector<HTMLElement>('#viewport')!;
const backdrop = document.querySelector<HTMLElement>('#presentation-shell')!;
const renderGrid = createCanvasGrid(backdrop);
let canvasBounds = viewport.getBoundingClientRect();
let canvasContent: ReturnType<typeof measureCanvasContent>;
const world = document.querySelector<HTMLElement>('#world')!;
initializeIllustrations();
initializePaperSlides(world);
addLegendAnchors(world);
initializeVersionPairings(world);
const updateConnections = createConnections(world);
const disposeRegressAnimations = initializeRegressAnimations();
const view: View = { x: 0, y: 0, zoom: 1 };
const target: View = { ...view };
let reportSlide: ((index: number) => void) | undefined;
let paperPane: { update: (index: number) => void } | undefined;
const localDev = import.meta.env.DEV && Boolean(import.meta.hot) && !liveMode;
const onHostMac = ['127.0.0.1', 'localhost', '[::1]'].includes(location.hostname);
const requestedRole = localDev ? new URLSearchParams(location.search).get('role') : null;
const previewRole = localDev && !onHostMac ? 'audience'
  : requestedRole === 'audience' || requestedRole === 'presenter' ? requestedRole : null;
const hostedPresenter = liveMode && new URLSearchParams(location.hash.slice(1)).has('presenter');
const hostedRoom = liveMode && (hostedPresenter || import.meta.env.VITE_PRESENTATION_DAY === '1');
const localLivePreview = localDev && onHostMac && requestedRole === 'live-preview';
const publicPreview = localLivePreview || (liveMode && !hostedRoom);
const readOnly = liveMode || localLivePreview || previewRole !== null;
const role = hostedPresenter ? 'presenter' : hostedRoom ? 'audience'
  : localLivePreview ? 'live-preview' : previewRole ?? 'editor';
const quizEnabled = role !== 'presenter';
const openScene = (id: string) => {
  slideNavigation.open(slides.findIndex(slide => slide.members[0] === id));
};
const openingVideo = liveMode || localLivePreview || (localDev && (role === 'editor' || role === 'presenter'))
  ? createOpeningVideo(backdrop, openingMedia.path, () => openScene('L0'), {
    viewerControls: publicPreview || role === 'audience',
    showSkip: role === 'editor' || publicPreview || role === 'audience',
    reportPlayback: localDev && role === 'presenter'
      ? playing => import.meta.hot!.send('phi102:preview:opening', playing) : undefined,
  })
  : undefined;
if (openingVideo && (publicPreview || liveMode)) {
  const launch = document.createElement('button');
  launch.type = 'button';
  launch.className = 'opening-launch';
  launch.textContent = 'Play opening';
  launch.addEventListener('click', openingVideo.play);
  viewport.append(launch);
}
const openingDialogue = createClassroomDialogue(backdrop, quizEnabled, openScene,
  !publicPreview && (localDev || hostedRoom) ? createLocalQuizVotes(role === 'audience', hostedRoom) : undefined,
  readOnly && !publicPreview, role === 'presenter', openingVideo?.play);
let currentIndex = -1;
let overviewView: View = { ...view };
const previewControl = publicPreview ? document.createElement('button') : undefined;
let pendingCue: {slide: number; cue: number} | undefined;
const cues: PresentationCues = {
  read: index => index === currentIndex ? openingDialogue.getCue() : 0,
  apply(index, cue) {
    if (index === currentIndex) openingDialogue.setCue(cue);
    else pendingCue = {slide: index, cue};
  },
  subscribe: listener => openingDialogue.onCue(listener),
};
const slideNavigation = createSlideNavigation(world, showSlideFrame, index => {
  currentIndex = index;
  if (previewControl) previewControl.textContent = index < 0 ? 'Presentation' : 'Back to map';
  const slide = slides[index];
  const id = slide?.members[0];
  const legend = id && legendById.get(id);
  viewport.toggleAttribute('data-regress-flashback', Boolean(legend));
  if (!legend || !legend.background) viewport.style.removeProperty('--regress-background');
  openingDialogue.showScene(id);
  if (id === 'before-lecture' || id === 'contemporary-heading') openingVideo?.preload();
  openingVideo?.close();
  if (pendingCue?.slide === index) cues.apply(index, pendingCue.cue);
  pendingCue = undefined;
  paperPane?.update(index);
  reportSlide?.(index);
});
viewport.classList.toggle('canvas-editable', !readOnly);
viewport.classList.toggle('public-preview', publicPreview);
viewport.querySelector<HTMLButtonElement>('.before-lecture-scene')!.addEventListener('click', () => {
  viewport.focus({ preventScroll: true });
  openingDialogue.advance();
});
let connectionsDirty = true;
const layout = createLayoutController(world, () => ({ ...target }), restored => {
  if (publicPreview) overviewView = { ...restored };
  Object.assign(view, restored);
  Object.assign(target, restored);
  connectionsDirty = true;
  queueMicrotask(wake);
}, initialLayout, readOnly);
function invalidateConnections() { connectionsDirty = true; wake(); }
let threeLayer: ThreeLayer | undefined;
let loadingThree: Promise<ThreeLayer> | undefined;
function enableThree() {
  loadingThree ??= import('./three-layer').then(({ createThreeLayer }) => {
    threeLayer = createThreeLayer(viewport);
    threeLayer.resize(viewport.clientWidth, viewport.clientHeight);
    wake();
    return threeLayer;
  }).catch(error => {
    loadingThree = undefined;
    throw error;
  });
  return loadingThree;
}

let stops: Stop[] = [];
let stopIndex = -1;
let tween: { from: View; to: View; start: number; duration: number } | undefined;
const clickTolerance = 5;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const clampZoom = (zoom: number) => Math.min(8, Math.max(0.1, zoom));
const pageExit = createPageExit(backdrop, viewport, view, slideNavigation.previewExit, render, () => {
  slideNavigation.leavePage();
  Object.assign(target, view);
  render();
  layout.schedule();
});
function animateTo(next: Partial<View>, duration: number, onCanvas = false) {
  const to = { ...target, ...next };
  if (![to.x, to.y, to.zoom, duration].every(Number.isFinite)) return false;
  to.zoom = clampZoom(to.zoom);
  if (onCanvas) constrainCanvasView(to, canvasBounds, canvasContent);
  Object.assign(target, to);
  tween = { from: { ...view }, to, start: performance.now(), duration: reducedMotion.matches ? 0 : Math.max(0, duration) };
  wake();
  return true;
}
function goTo(next: Partial<View>, duration = 550) {
  pageExit.reset();
  if (!animateTo(next, duration, true)) return;
  slideNavigation.leavePage();
  layout.schedule();
}
function showSlideFrame(next: View, animate: boolean) {
  pageExit.reset();
  if (animate && !reducedMotion.matches && animateTo(next, 420)) {
    layout.schedule();
    return;
  }
  tween = undefined;
  Object.assign(view, next);
  Object.assign(target, next);
  render();
  layout.schedule();
}
function interruptCamera() {
  tween = undefined;
  slideNavigation.cancelOpening();
  Object.assign(target, view);
}
function panBy(x: number, y: number) {
  if (slideNavigation.isFocused()) {
    tween = undefined;
    pageExit.move(x, y, 0, 450);
    return;
  }
  goTo({ x: target.x + x / target.zoom, y: target.y + y / target.zoom });
}
function step(direction: number) {
  if (openingVideo?.isOpen()) return;
  if (!stops.length && openingDialogue.stepDialogue(direction)) return;
  if (!stops.length) { slideNavigation.step(direction); return; }
  stopIndex = Math.max(0, Math.min(stops.length - 1, stopIndex + direction));
  goTo(stops[stopIndex], stops[stopIndex].duration);
}
function positionWorld() {
  world.style.transform = `scale(${view.zoom}) translate(${-view.x}px, ${-view.y}px)`;
}
function render() {
  const settled = !tween && !drag;
  // Connections live inside the same transformed world: pan/zoom cannot
  // change their world-space geometry. Only content/layout edits invalidate it.
  if (connectionsDirty) {
    positionWorld();
    canvasContent = measureCanvasContent(world, view.zoom);
    slideNavigation.measure(view.zoom);
  }
  const onCanvas = slideNavigation.isOnCanvas();
  if (onCanvas || pageExit.active()) constrainCanvasView(view, canvasBounds, canvasContent);
  if (onCanvas) constrainCanvasView(target, canvasBounds, canvasContent);
  const fitted = settled && slideNavigation.refit(view);
  if (fitted) {
    Object.assign(view, fitted);
    Object.assign(target, fitted);
  }
  positionWorld();
  if (connectionsDirty) {
    connectionsDirty = false;
    updateConnections(view.zoom);
  }
  renderGrid(view, canvasBounds);
  slideNavigation.update(settled);
  threeLayer?.render(view);
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
  threeLayer?.resize(viewport.clientWidth, viewport.clientHeight);
  invalidateConnections();
}
window.addEventListener('resize', resize);
const canvasResizeObserver = new ResizeObserver(resize);
canvasResizeObserver.observe(viewport);
function toggleFullscreen() {
  const action = document.fullscreenElement === backdrop
    ? document.exitFullscreen()
    : backdrop.requestFullscreen();
  void action.catch(error => console.warn('Could not toggle presentation full screen.', error));
}
window.addEventListener('keydown', (event) => {
  if (openingVideo?.isOpen() || event.defaultPrevented || event.isComposing ||
      event.ctrlKey || event.altKey || event.key.toLowerCase() !== 'f' || (event.metaKey && !event.shiftKey)) return;
  const target = event.target;
  if (!event.metaKey && target instanceof HTMLElement &&
      (target.isContentEditable || target.closest('input, textarea, select'))) return;
  event.preventDefault();
  if (!event.repeat) toggleFullscreen();
}, { capture: true });

window.addEventListener('keydown', (event) => {
  if (openingVideo?.isOpen()) return;
  const element = event.target as HTMLElement;
  if (event.defaultPrevented || element.isContentEditable || element.closest('input, textarea, select, a') || event.metaKey || event.ctrlKey || event.altKey) return;
  const navigationTarget = element.closest('#slide-progress button, .classroom-stage button, .before-lecture-scene');
  if (element.closest('button') && (!navigationTarget || event.key === ' ' || event.key === 'Enter')) return;
  if (!event.isComposing && !event.shiftKey && openingDialogue.handleArrow(event.key, event.repeat)) {
    event.preventDefault();
    return;
  }
  const distance = event.shiftKey ? 600 : 180;
  switch (event.key) {
    case 'ArrowLeft':
      if (event.shiftKey) panBy(-distance, 0);
      else step(-1);
      break;
    case 'ArrowRight':
      if (event.shiftKey) panBy(distance, 0);
      else step(1);
      break;
    case 'ArrowUp': panBy(0, -distance); break;
    case 'ArrowDown': panBy(0, distance); break;
    case ' ': case 'PageDown': step(event.shiftKey ? -1 : 1); break;
    case 'PageUp': step(-1); break;
    case '+': case '=':
      if (!slideNavigation.isFocused()) goTo({ zoom: target.zoom * 1.2 });
      break;
    case '-': case '_':
      if (slideNavigation.isFocused()) {
        tween = undefined;
        pageExit.move(0, 0, Math.log(1.2), 450);
      } else goTo({ zoom: target.zoom / 1.2 });
      break;
    case 'Home': case '0': stopIndex = -1; goTo({ x: 0, y: 0, zoom: 1 }); break;
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
  if (readOnly) {
    // These illustrations replay when they receive keyboard focus.
    if (label.matches('.scene, .regress-position')) label.tabIndex = 0;
    return;
  }
  label.tabIndex = 0;
  label.setAttribute('aria-describedby', 'label-instructions');
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
    interruptCamera();
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

let drag: {
  id: number; x: number; y: number; startX: number; startY: number;
  label: HTMLElement | null; retained: HTMLElement[]; slideEntry?: number;
} | undefined;
viewport.addEventListener('pointerdown', (event) => {
  if (readOnly) return;
  if (pageExit.active()) { pageExit.reset(); render(); }
  const element = event.target as HTMLElement;
  if (drag || event.button !== 0 || element.closest('#slide-progress, input, textarea, select, button, a, [contenteditable="true"]')) return;
  interruptCamera();
  const label = element.closest<HTMLElement>('.canvas-label');
  const additive = event.shiftKey || event.metaKey || event.ctrlKey;
  const slideEntry = additive || event.altKey ? undefined : slideNavigation.entryFor(element);
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
  drag = { id: event.pointerId, x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY, label, retained, slideEntry };
  viewport.setPointerCapture(event.pointerId);
  viewport.classList.toggle('dragging', Boolean(label) && slideEntry === undefined);
});
viewport.addEventListener('pointermove', (event) => {
  if (!drag || drag.id !== event.pointerId) return;
  if (drag.slideEntry !== undefined) {
    if (Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < clickTolerance) return;
    drag.slideEntry = undefined;
    viewport.classList.add('dragging');
  }
  const dx = (event.clientX - drag.x) / view.zoom;
  const dy = (event.clientY - drag.y) / view.zoom;
  if (drag.label) moveSelection(drag.label, dx, dy);
  else {
    const left = Math.min(drag.startX, event.clientX), top = Math.min(drag.startY, event.clientY);
    const right = Math.max(drag.startX, event.clientX), bottom = Math.max(drag.startY, event.clientY);
    const bounds = viewport.getBoundingClientRect();
    const hits = [...drag.retained];
    world.querySelectorAll<HTMLElement>('.canvas-label').forEach(item => {
      if (getComputedStyle(item).visibility === 'hidden') return;
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
  const { label, slideEntry, startX, startY } = drag;
  drag = undefined; viewport.classList.remove('dragging'); selectionBox.hidden = true;
  if (slideEntry !== undefined && event.type === 'pointerup' &&
      Math.hypot(event.clientX - startX, event.clientY - startY) < clickTolerance) {
    slideNavigation.open(slideEntry, true);
  } else {
    if (label && slideEntry === undefined) layout.save();
    wake();
  }
}
viewport.addEventListener('pointerup', endDrag);
viewport.addEventListener('pointercancel', endDrag);
viewport.addEventListener('lostpointercapture', endDrag);
backdrop.addEventListener('wheel', (event) => {
  if (event.defaultPrevented || drag) return;
  const zooming = event.ctrlKey || event.metaKey;
  const focused = slideNavigation.isFocused();
  const element = event.target as Element;
  if (!viewport.contains(element) && !(focused && element.closest('.classroom-stage') && (zooming || !element.closest('.transcript-panel')))) return;
  event.preventDefault();
  const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport.clientHeight : 1;
  if (focused) {
    if (!zooming || event.deltaY > 0 || pageExit.active()) {
      pageExit.move(zooming ? 0 : event.deltaX * unit, zooming ? 0 : event.deltaY * unit,
        zooming ? event.deltaY * unit * .01 : 0);
    }
    return;
  }
  interruptCamera();
  if (zooming) {
    const zoom = clampZoom(view.zoom * Math.exp(-event.deltaY * 0.01));
    const dx = event.clientX - canvasBounds.left - viewport.clientWidth / 2;
    const dy = event.clientY - canvasBounds.top - viewport.clientHeight / 2;
    view.x += dx / view.zoom - dx / zoom;
    view.y += dy / view.zoom - dy / zoom;
    view.zoom = zoom;
  } else {
    view.x += event.deltaX * unit / view.zoom; view.y += event.deltaY * unit / view.zoom;
  }
  constrainCanvasView(view, canvasBounds, canvasContent);
  Object.assign(target, view); wake();
  layout.schedule();
}, { passive: false });

// Public controls for later presentation content and automation. Coordinates
// use CSS pixels from the center, with positive y pointing down.
const presentation = {
  world, goTo, enableThree,
  get scene() { return threeLayer?.scene; },
  get camera() { return threeLayer?.camera; },
  get THREE() { return threeLayer?.THREE; },
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
if (previewControl) {
  previewControl.type = 'button';
  previewControl.className = 'preview-presentation';
  previewControl.textContent = 'Presentation';
  previewControl.disabled = true;
  viewport.querySelector('#slide-progress')!.before(previewControl);
  previewControl.addEventListener('click', () => {
    if (slideNavigation.isOnCanvas()) {
      slideNavigation.open(0);
      viewport.focus({ preventScroll: true });
    } else {
      goTo(overviewView);
    }
  });
  void layout.ready.then(() => { previewControl.disabled = false; });
}
if (hostedRoom) {
  void layout.ready.then(() => {
    requestAnimationFrame(() => {
      reportSlide = connectPresentation(viewport, slideNavigation.open, openingDialogue.theory, undefined, cues, openingDialogue.updateOpeningQuiz);
      invalidateConnections();
    });
  });
}
function mountPaperPane(rolePicker?: HTMLElement) {
  void import('./paper-pane').then(({ createPaperPane }) => {
    paperPane = createPaperPane(backdrop, { initiallyOpen: !readOnly, rolePicker });
  });
}
if (localDev) {
  void import('./dev-presentation').then(({ addDevRolePicker, connectDevPresentation }) => {
    const rolePicker = addDevRolePicker(backdrop, role, onHostMac);
    if (role === 'editor') {
      void import('./dev-paper').then(({ createPaperPane }) => {
        paperPane = createPaperPane(backdrop, rolePicker);
      });
      return;
    }
    mountPaperPane(rolePicker);
    if (!previewRole) return;
    void layout.ready.then(() => {
      requestAnimationFrame(() => {
        reportSlide = connectDevPresentation(viewport, slideNavigation.open, previewRole, openingDialogue.theory, openingVideo, undefined, cues);
      });
    });
  });
} else {
  mountPaperPane();
  if (liveMode) {
    void import('./story-reader').then(({ addStoryReader }) => addStoryReader(backdrop));
  }
}
if (import.meta.hot) {
  import.meta.hot.dispose(disposeRegressAnimations);
  import.meta.hot.on('vite:beforeFullReload', () => { void layout.save(false, true); });
  import.meta.hot.dispose(() => { void layout.save(false, true); });
}
