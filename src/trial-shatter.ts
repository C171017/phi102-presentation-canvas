type Point = readonly [x: number, y: number];
type Flight = readonly [x: number, y: number, angle: number];

// The pieces tile the 4:3 painting. The smaller pieces meet near the gavel.
const shards: readonly (readonly [readonly Point[], Flight])[] = [
  [[[0, 0], [29, 0], [39, 24], [31, 42], [0, 26]], [-110, 32, -58]],
  [[[29, 0], [65, 0], [67, 27], [39, 24]], [-42, -118, -39]],
  [[[65, 0], [100, 0], [100, 38], [67, 27]], [105, -47, 55]],
  [[[67, 27], [100, 38], [100, 76], [75, 55]], [112, 45, 74]],
  [[[75, 55], [100, 76], [100, 100], [66, 100], [58, 76]], [87, 82, 48]],
  [[[58, 76], [66, 100], [25, 100], [30, 68]], [12, 114, -31]],
  [[[30, 68], [25, 100], [0, 100], [0, 61]], [-87, 95, -63]],
  [[[31, 42], [30, 68], [0, 61], [0, 26]], [-107, 70, 41]],
  [[[31, 42], [39, 24], [55, 53]], [-65, -92, -77]],
  [[[39, 24], [67, 27], [55, 53]], [27, -111, 85]],
  [[[67, 27], [75, 55], [55, 53]], [116, -18, 115]],
  [[[75, 55], [58, 76], [55, 53]], [60, 118, 96]],
  [[[58, 76], [30, 68], [55, 53]], [-33, 120, -104]],
  [[[30, 68], [31, 42], [55, 53]], [-102, 85, -88]],
];

export function scatterTrialShards(overlay: HTMLElement, background: string) {
  const frame = document.createElement('div');
  frame.className = 'trial-shatter-frame';
  overlay.append(frame);

  return shards.map(([points, [x, y, angle]], index) => {
    const left = Math.min(...points.map(point => point[0]));
    const top = Math.min(...points.map(point => point[1]));
    const width = Math.max(...points.map(point => point[0])) - left;
    const height = Math.max(...points.map(point => point[1])) - top;
    const vertices = points.map(([px, py]) => `${100 * (px - left) / width}% ${100 * (py - top) / height}%`);
    const shard = document.createElement('div');
    // Clip each piece inside its own bounds, with the original art aligned across the seams.
    Object.assign(shard.style, {
      left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%`,
      clipPath: `polygon(${vertices.join(', ')})`,
      backgroundImage: background,
      backgroundSize: `${10000 / width}% ${10000 / height}%`,
      backgroundPosition: `${100 * left / (100 - width)}% ${100 * top / (100 - height)}%`,
    });
    frame.append(shard);
    return shard.animate([
      { transform: 'translate(0, 0) rotate(0deg)', easing: 'cubic-bezier(.12, .63, .47, 1)' },
      { transform: `translate(${x * .19}vw, ${y * .09 - 6}vh) rotate(${angle * .18}deg)`, offset: .25,
        easing: 'cubic-bezier(.45, .12, .72, .65)' },
      { transform: `translate(${x}vw, ${y}vh) rotate(${angle}deg)` },
    ], { duration: 650 + index % 3 * 35, delay: 70 + index % 4 * 14, fill: 'both' });
  });
}
