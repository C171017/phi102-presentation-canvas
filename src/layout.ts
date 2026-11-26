import { parseLayout, type CameraView, type Layout } from './layout-data';
export { parseLayout, type CameraView, type ItemLayout, type Layout } from './layout-data';
export const LAYOUT_KEY = 'phi102-presentation-layout-v1';

export function createHostedLayout(world: HTMLElement, getView: () => CameraView, setView: (view: CameraView) => void,
    fallback: Layout, initial: Layout | null) {
  const defaults = captureLayout(world, fallback, fallback.view);
  let baseline = fallback;
  let previous = fallback;
  function restore(layout: Layout | null) {
    previous = layout ?? baseline;
    applyLayout(world, { ...previous, items: { ...defaults.items, ...baseline.items, ...previous.items } }, setView);
  }
  const ready = (async () => {
    try {
      const response = await fetch('/canvas-layout.json');
      if (response.ok) baseline = parseLayout(await response.text()) ?? fallback;
    } catch { /* The bundled layout remains available. */ }
    restore(initial);
  })();
  return { ready, restore, capture: () => captureLayout(world, previous, getView()), save: async () => false, schedule() {} };
}

export function createLayoutController(world: HTMLElement, getView: () => CameraView, setView: (view: CameraView) => void, fallback: Layout, readOnly = false, isEditingSlide = () => false) {
  if (readOnly) {
    const ready = (async () => {
      const response = await fetch('/canvas-layout.json');
      const layout = response.ok && parseLayout(await response.text());
      const published = layout || fallback;
      applyLayout(world, published, setView);
    })().catch(() => applyLayout(world, fallback, setView));
    return { ready, save: async () => false, schedule() {} };
  }
  let pending: ReturnType<typeof setTimeout> | undefined;
  let previous = fallback;
  let storageAvailable = true;
  let raw: string | null = null;
  try { raw = localStorage.getItem(LAYOUT_KEY); } catch { storageAvailable = false; }
  const stored = parseLayout(raw);
  let pendingLocal = false;
  try { pendingLocal = JSON.parse(raw ?? '{}').filePending === true; } catch { /* invalid cache */ }
  const invalidSavedLayout = raw !== null && stored === null;
  previous = stored ?? fallback;
  function restore(layout: Layout) {
    previous = layout;
    applyLayout(world, layout, setView);
  }
  restore(previous);

  const notice = document.createElement('div');
  notice.id = 'layout-save-status';
  notice.setAttribute('role', 'status');
  notice.setAttribute('aria-live', 'polite');
  notice.hidden = true;
  (world.closest('#presentation-shell') ?? document.body).append(notice);
  let noticeFade: Animation | undefined;
  function announce(message: string, error = false) {
    noticeFade?.cancel();
    noticeFade = undefined;
    notice.textContent = message;
    notice.hidden = false;
    notice.classList.toggle('save-error', error);
    if (error) return;

    const fade = notice.animate([{ opacity: 1 }, { opacity: 0 }], {
      delay: 1200,
      duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 450,
      easing: 'ease-out',
      fill: 'forwards',
    });
    noticeFade = fade;
    fade.onfinish = () => {
      if (noticeFade !== fade) return;
      notice.hidden = true;
      fade.cancel();
      noticeFade = undefined;
    };
  }
  const capture = () => captureLayout(world, previous, getView());
  let initialized = false;
  let changedBeforeReady = false;
  const clientId = crypto.randomUUID();
  let diskRevision = '';
  let lastDiskContent = '';
  const contentKey = (layout: Layout) => JSON.stringify({ view: layout.view, items: Object.entries(layout.items).sort(([a], [b]) => a.localeCompare(b)) });
  let writeQueue: Promise<boolean> = Promise.resolve(true);
  let ready: Promise<void>;
  function cache(snapshot: Layout, filePending = false) {
    try {
      if (!storageAvailable) return;
      if (invalidSavedLayout && localStorage.getItem(`${LAYOUT_KEY}-recovery`) === null) localStorage.setItem(`${LAYOUT_KEY}-recovery`, raw!);
      localStorage.setItem(LAYOUT_KEY, JSON.stringify({ ...snapshot, filePending }));
    } catch { storageAvailable = false; }
  }
  async function persist(snapshot: Layout, showStatus: boolean): Promise<boolean> {
    try {
      if (contentKey(snapshot) === lastDiskContent) {
        cache(snapshot, false);
        if (showStatus) announce('Saved to canvas-layout.json');
        return true;
      }
      const response = await fetch('/__canvas/layout', {
        method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-Canvas-Client': clientId, 'X-Canvas-Revision': diskRevision },
        body: JSON.stringify(snapshot), keepalive: true,
      });
      if (response.status === 409) {
        announce('The layout file changed in another tab. This tab has not overwritten it. Its changes remain in this browser.', true);
        return false;
      }
      const result = await response.json();
      if (!response.ok || !result.saved) throw Error('Disk save failed');
      if (typeof result.revision === 'string' && (!diskRevision || result.revision >= diskRevision)) diskRevision = result.revision;
      if (result.revision === snapshot.savedAt) lastDiskContent = contentKey(snapshot);
      if (snapshot.savedAt === previous.savedAt) cache(snapshot, false);
      if (showStatus) announce('Saved to canvas-layout.json');
      return true;
    } catch {
      announce(storageAvailable ? 'Saved in this browser only — could not write canvas-layout.json. Keep the local canvas server running.' : 'Could not save the layout. Keep this tab open.', true);
      return false;
    }
  }
  function save(showStatus = false, urgent = false): Promise<boolean> {
    clearTimeout(pending);
    const snapshot = capture();
    cache(snapshot, true);
    previous = snapshot;
    if (!initialized) {
      if (showStatus) changedBeforeReady = true;
      return ready.then(() => changedBeforeReady ? save(showStatus, urgent) : true);
    }
    if (urgent) return persist(snapshot, showStatus);
    const operation = writeQueue.then(() => persist(snapshot, showStatus));
    writeQueue = operation;
    return operation;
  }
  function schedule() { changedBeforeReady = true; clearTimeout(pending); pending = setTimeout(() => save(), 250); }
  window.addEventListener('keydown', event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's' && !event.altKey && !isEditingSlide()) {
      event.preventDefault(); save(true);
    }
  }, { capture: true });
  window.addEventListener('pagehide', () => { void save(false, true); });
  window.addEventListener('beforeunload', () => { void save(false, true); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });
  ready = (async () => {
    try {
      let response = await fetch('/__canvas/layout', { cache: 'no-store' });
      if (!response.ok) response = await fetch('/canvas-layout.json', { cache: 'no-store' });
      if (response.ok) {
        const disk = parseLayout(await response.text());
        if (disk) {
          diskRevision = disk.savedAt;
          lastDiskContent = contentKey(disk);
          const recoverPending = stored && pendingLocal && Date.parse(stored.savedAt) > Date.parse(disk.savedAt);
          if (!changedBeforeReady && !recoverPending) restore(disk);
        }
      }
    } catch { /* Browser cache remains available during a server interruption. */ }
    initialized = true;
    const snapshot = capture();
    previous = snapshot;
    cache(snapshot, true);
    await persist(snapshot, false);
  })();
  return { save, schedule, capture, ready };
}

export function applyLayout(world: HTMLElement, layout: Layout, setView: (view: CameraView) => void) {
  for (const element of Array.from(world.querySelectorAll<HTMLElement>('.canvas-label[id], .legend-anchor[id]'))) {
    let item = layout.items[element.id];
    const lineup = layout.items['versions-map-scene'];
    if (!item && lineup && element.dataset.lineupX !== undefined) {
      item = { ...lineup, x: lineup.x + Number(element.dataset.lineupX) * lineup.scale,
        y: lineup.y + Number(element.dataset.lineupY) * lineup.scale };
    }
    if (!item && element.id === 'undoubted-crystal') {
      const a = layout.items['undoubted-logic'];
      const b = layout.items['undoubted-standards'];
      item = a && b
        ? { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, scale: (a.scale + b.scale) / 2 }
        : a ?? b;
    }
    // Older layouts contain only the first circle. Place its new companion beside it.
    if (!item) continue;
    element.style.left = `${item.x}px`;
    element.style.top = `${item.y}px`;
    element.style.setProperty('--item-scale', String(item.scale));
  }
  setView(layout.view);
}

export function captureLayout(world: HTMLElement, previous: Layout, view: CameraView): Layout {
  const items = { ...previous.items };
  for (const element of Array.from(world.querySelectorAll<HTMLElement>('.canvas-label[id]'))) {
    const css = getComputedStyle(element);
    items[element.id] = {
      x: parseFloat(css.left), y: parseFloat(css.top),
      scale: Number(element.style.getPropertyValue('--item-scale')) || 1,
    };
  }
  return { version: 1, savedAt: new Date().toISOString(), view, items };
}
