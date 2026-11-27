import type { CanvasItemBounds } from './canvas-pan';
import './canvas-section-washes.css';

const sections = [
  { name: 'motivations', members: /^(aim-motivations$|regress-|dilemma-|undoubted-)/, color: '#c55254' },
  { name: 'versions', members: /^(aim-versions$|route-|versions-map-|pairings-heading$|pairing-|cast-)/, color: '#dfa825' },
  { name: 'applications', members: /^(aim-applications$|access-|home-|mobile-)/, color: '#487dc2' },
];

type Point = [x: number, y: number];

function convexHull(points: Point[]) {
  const sorted = points.sort(([ax, ay], [bx, by]) => ax - bx || ay - by);
  function edge(ordered: Point[]) {
    const chain: Point[] = [];
    for (const [x, y] of ordered) {
      while (chain.length >= 2) {
        const [ax, ay] = chain[chain.length - 2];
        const [bx, by] = chain[chain.length - 1];
        if ((bx - ax) * (y - ay) > (by - ay) * (x - ax)) break;
        chain.pop();
      }
      chain.push([x, y]);
    }
    return chain.slice(0, -1);
  }
  return [...edge(sorted), ...edge(sorted.reverse())];
}

const feather = 1350;
const steps = 36;

export function createSectionWashes(world: HTMLElement) {
  const layers = sections.map(section => {
    const canvas = document.createElement('canvas');
    canvas.className = 'canvas-section-wash';
    canvas.dataset.section = section.name;
    canvas.setAttribute('aria-hidden', 'true');
    canvas.hidden = true;
    world.prepend(canvas);
    return { ...section, canvas, context: canvas.getContext('2d'), shape: '' };
  });

  return (items: readonly CanvasItemBounds[]) => {
    for (const layer of layers) {
      const { canvas, context } = layer;
      if (!context) continue;
      const members = items.filter(item => layer.members.test(item.id));
      canvas.hidden = members.length === 0;
      if (canvas.hidden) continue;

      const points = convexHull(members.flatMap(({ left, right, top, bottom }): Point[] => [
        [Math.round(left), Math.round(top)], [Math.round(right), Math.round(top)],
        [Math.round(right), Math.round(bottom)], [Math.round(left), Math.round(bottom)],
      ]));
      const xs = points.map(([x]) => x), ys = points.map(([, y]) => y);
      const left = Math.min(...xs) - feather, top = Math.min(...ys) - feather;
      const width = Math.max(...xs) - left + feather, height = Math.max(...ys) - top + feather;
      const localPoints = points.map(([x, y]) => [x - left, y - top]);
      const shape = localPoints.join('|');
      canvas.style.left = `${left}px`;
      canvas.style.top = `${top}px`;
      if (shape === layer.shape) continue;
      layer.shape = shape;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      // Feathering needs only a small texture, even when the canvas is zoomed in.
      const scale = 640 / Math.max(width, height);
      canvas.width = Math.ceil(width * scale);
      canvas.height = Math.ceil(height * scale);
      context.scale(canvas.width / width, canvas.height / height);
      context.lineJoin = 'round';
      context.fillStyle = context.strokeStyle = layer.color;
      const path = new Path2D();
      localPoints.forEach(([x, y], index) => index ? path.lineTo(x, y) : path.moveTo(x, y));
      path.closePath();

      // Accumulate a smooth opacity ramp around the hull, then fill its center.
      let previous = 0;
      for (let step = 1; step < steps; step++) {
        const t = step / steps;
        const opacity = t * t * (3 - 2 * t);
        context.globalAlpha = (opacity - previous) / (1 - previous);
        context.lineWidth = 2 * feather * (1 - (step - 0.5) / steps);
        context.stroke(path);
        previous = opacity;
      }
      context.globalAlpha = 1;
      context.fill(path);
    }
  };
}
