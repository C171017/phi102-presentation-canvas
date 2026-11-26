export type CameraView = { x: number; y: number; zoom: number };
export type ItemLayout = { x: number; y: number; scale: number };
export type Layout = { version: 1; savedAt: string; view: CameraView; items: Record<string, ItemLayout> };

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
