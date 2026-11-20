import type { CameraView } from './layout';
import './canvas-grid.css';

export function createCanvasGrid(shell: HTMLElement) {
  const clip = document.createElement('div');
  clip.className = 'canvas-grid';
  clip.setAttribute('aria-hidden', 'true');
  const tiles = document.createElement('div');
  tiles.className = 'canvas-grid-tiles';
  const fineDots = document.createElement('div');
  const coarseDots = document.createElement('div');
  coarseDots.className = 'canvas-grid-coarse';
  tiles.append(fineDots, coarseDots);
  clip.append(tiles);
  shell.prepend(clip);

  let previousSpacing = 0;
  let previousTransform = '';

  // Keep the tile origin within one period on the leading side so both
  // layers cover the viewport even when their transform wraps.
  const phase = (position: number, period: number) => ((position % period) - period) % period;

  return (view: CameraView, bounds: DOMRectReadOnly) => {
    const baseSpacing = 24 * view.zoom;
    const spacing = baseSpacing * 2 ** Math.ceil(Math.log2(8 / baseSpacing));
    if (spacing !== previousSpacing) {
      const blend = Math.min(1, (spacing - 8) / 2.5);
      const fine = blend * blend * (3 - 2 * blend);
      fineDots.style.opacity = String(fine);
      coarseDots.style.opacity = String(1 - fine);
      previousSpacing = spacing;
    }

    const period = spacing * 2;
    const x = phase(bounds.left + bounds.width / 2 - view.x * view.zoom, period);
    const y = phase(bounds.top + bounds.height / 2 - view.y * view.zoom, period);
    const transform = `translate(${x}px, ${y}px) scale(${spacing / 8})`;
    if (transform !== previousTransform) {
      tiles.style.transform = transform;
      previousTransform = transform;
    }
  };
}
