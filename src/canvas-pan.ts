import type { CameraView } from './layout';

type ContentBounds = { left: number; right: number; top: number; bottom: number };
type CanvasContent = { bounds: ContentBounds; items: ContentBounds[] };

export function measureCanvasContent(world: HTMLElement, zoom: number): CanvasContent | undefined {
  const origin = world.getBoundingClientRect();
  const items: ContentBounds[] = [];
  let left = Infinity, right = -Infinity, top = Infinity, bottom = -Infinity;
  world.querySelectorAll('.canvas-label:not(#unitrans-arrival, #before-lecture)').forEach(item => {
    const rect = item.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const bounds = {
      left: (rect.left - origin.left) / zoom,
      right: (rect.right - origin.left) / zoom,
      top: (rect.top - origin.top) / zoom,
      bottom: (rect.bottom - origin.top) / zoom,
    };
    items.push(bounds);
    left = Math.min(left, bounds.left);
    right = Math.max(right, bounds.right);
    top = Math.min(top, bounds.top);
    bottom = Math.max(bottom, bounds.bottom);
  });
  if (items.length) return { bounds: { left, right, top, bottom }, items };
}

function constrainAxis(center: number, first: number, last: number, size: number) {
  // Keep 30% of the usable span on this axis, even when zoomed out past fit.
  const overlap = Math.min(size, last - first) * 0.3;
  const overscroll = size / 2 - overlap;
  return Math.max(first - overscroll, Math.min(last + overscroll, center));
}

export function constrainCanvasView(view: CameraView, viewport: { width: number; height: number }, content?: CanvasContent) {
  if (!content) return;
  const { bounds, items } = content;
  const width = viewport.width / view.zoom;
  const height = viewport.height / view.zoom;
  const x = constrainAxis(view.x, bounds.left, bounds.right, width);
  const y = constrainAxis(view.y, bounds.top, bounds.bottom, height);
  view.x = x;
  view.y = y;
  if (x >= bounds.left && x <= bounds.right && y >= bounds.top && y <= bounds.bottom) return;

  // At a sparse outer corner, the overall rectangle can overlap the viewport
  // without any item being visible. Find the nearest view with an item in it.
  let nearest = Infinity;
  for (const item of items) {
    const itemX = constrainAxis(x, item.left, item.right, width);
    const itemY = constrainAxis(y, item.top, item.bottom, height);
    const distance = (itemX - x) ** 2 + (itemY - y) ** 2;
    if (distance === 0) {
      view.x = x;
      view.y = y;
      return;
    }
    if (distance < nearest) {
      nearest = distance;
      view.x = itemX;
      view.y = itemY;
    }
  }
}
