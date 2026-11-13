export type CameraView = { x: number; y: number; zoom: number };
export type ItemLayout = { x: number; y: number; scale: number };
export type Layout = { version: 1; savedAt: string; view: CameraView; items: Record<string, ItemLayout> };
export const LAYOUT_KEY = 'phi102-presentation-layout-v1';

const finite = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n);
export function parseLayout(raw: string | null): Layout | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    if (data?.version !== 1 || !data.items || typeof data.items !== 'object' || Array.isArray(data.items)) return null;
    if (!finite(data.view?.x) || !finite(data.view?.y) || !finite(data.view?.zoom) || data.view.zoom < 0.1 || data.view.zoom > 8) return null;
    const items: Record<string, ItemLayout> = Object.create(null);
    for (const [id, value] of Object.entries(data.items)) {
      const item = value as ItemLayout;
      if (item && finite(item.x) && finite(item.y) && finite(item.scale) && item.scale >= 0.25 && item.scale <= 4) {
        items[id] = { x: item.x, y: item.y, scale: item.scale };
      }
    }
    return { version: 1, savedAt: typeof data.savedAt === 'string' ? data.savedAt : '', view: { x: data.view.x, y: data.view.y, zoom: data.view.zoom }, items };
  } catch { return null; }
}

export function createLayoutController(world: HTMLElement, getView: () => CameraView, setView: (view: CameraView) => void, fallback: Layout) {
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
    for (const element of Array.from(world.querySelectorAll<HTMLElement>('.canvas-label[id]'))) {
      const item = layout.items[element.id];
      if (!item) continue;
      element.style.left = `${item.x}px`;
      element.style.top = `${item.y}px`;
      element.style.setProperty('--item-scale', String(item.scale));
    }
    setView(layout.view);
  }
  restore(previous);

  const notice = document.createElement('div');
  notice.id = 'layout-save-status';
  notice.setAttribute('role', 'status');
  notice.setAttribute('aria-live', 'polite');
  notice.hidden = true;
  document.body.append(notice);
  let hideNotice: ReturnType<typeof setTimeout> | undefined;
  function announce(message: string, error = false) {
    clearTimeout(hideNotice);
    notice.textContent = message;
    notice.hidden = false;
    notice.classList.toggle('save-error', error);
    if (!error) hideNotice = setTimeout(() => { notice.hidden = true; }, 1800);
  }
  function capture(): Layout {
    const items = { ...previous.items };
    for (const element of Array.from(world.querySelectorAll<HTMLElement>('.canvas-label[id]'))) {
      const css = getComputedStyle(element);
      items[element.id] = {
        x: parseFloat(css.left), y: parseFloat(css.top),
        scale: Number(element.style.getPropertyValue('--item-scale')) || 1,
      };
    }
    return { version: 1, savedAt: new Date().toISOString(), view: getView(), items };
  }
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
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's' && !event.altKey) {
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
