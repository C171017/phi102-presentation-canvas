import { editKeyPattern, originalSharedSnapshot, sharedSlidesPath, type SharedChange, type SharedSnapshot, type SlideVersion } from './shared-slide-data';

type WebSnapshot = SharedSnapshot & { editable: boolean };
type HistoryPage = { versions: SlideVersion[]; next: number | null };

async function editRequest<T>(path: string, key: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (key) headers.set('Authorization', `Bearer ${key}`);
  if (init.body) headers.set('Content-Type', 'application/json');
  const response = await fetch(sharedSlidesPath + path, { ...init, headers, cache: 'no-store', signal: init.signal ?? AbortSignal.timeout(12_000) });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? 'Could not reach the shared presentation. Try again.');
  }
  return response.json() as Promise<T>;
}

export async function openSharedSlides() {
  const fragment = new URLSearchParams(location.hash.slice(1));
  const candidate = fragment.get('edit') ?? '';
  const key = editKeyPattern.test(candidate) ? candidate : '';
  let snapshot: WebSnapshot = { ...originalSharedSnapshot, editable: false };
  let unavailable = false;
  try {
    snapshot = await editRequest<WebSnapshot>('', key, { signal: AbortSignal.timeout(2500) });
  } catch { unavailable = true; }
  const denied = fragment.has('edit') && !snapshot.editable;
  return {
    denied, unavailable,
    get snapshot() { return snapshot; },
    async refresh() { snapshot = await editRequest<WebSnapshot>('', key); return snapshot; },
    async save(change: SharedChange) {
      snapshot = await editRequest<WebSnapshot>('', key, { method: 'PUT', body: JSON.stringify({ ...change, revision: snapshot.revision }) });
      return snapshot;
    },
    history(before: number | null = null) {
      return editRequest<HistoryPage>(`/history${before === null ? '' : `?before=${before}`}`, key);
    },
    async restore(target: number) {
      snapshot = await editRequest<WebSnapshot>('/restore', key, { method: 'POST', body: JSON.stringify({ target, revision: snapshot.revision }) });
      return snapshot;
    },
  };
}

export type SharedSlideClient = Awaited<ReturnType<typeof openSharedSlides>>;
