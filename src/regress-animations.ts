import './regress-animations.css';

type Kind = 'foundationalism' | 'coherentism' | 'infinitism' | 'skepticism';
type Point = { x: number; z: number; h: number };
type Material = { dark: string; body: string; light: string; cap: string };
const materials: Record<Kind, Material> = {
  foundationalism: { dark: '#68411f', body: '#a76a2f', light: '#eab77a', cap: '#f5dbaa' },
  coherentism: { dark: '#174c44', body: '#257d69', light: '#8fc7ad', cap: '#c6dfc8' },
  infinitism: { dark: '#233e6d', body: '#376caf', light: '#9fc5e5', cap: '#d3e3ef' },
  skepticism: { dark: '#652b3e', body: '#a4465a', light: '#df98a3', cap: '#efd1cf' },
};
const descriptions: Record<Kind, string> = {
  foundationalism:
    'Six paths trace out from a central belief, through intermediate beliefs, to two staggered courses of foundation stones.',
  coherentism: 'Eight belief nodes become a web as two-way supporting links form between them.',
  infinitism:
    'A chain of progressively smaller beliefs winds inward. Every visible step leads to a further reason.',
  skepticism: 'A clockwise chain of beliefs approaches its starting point and ends at a skull.',
};
const tau = Math.PI * 2;
const n = (value: number) => +value.toFixed(3);
const point = (x: number, z: number, h = 0): Point => ({ x, z, h });
const polar = (angle: number, radius: number, h = 0) =>
  point(radius * Math.cos(angle), radius * Math.sin(angle), h);
// One orthographic viewpoint for the whole set, looking down 52° with a slight turn to the right.
const elevation = (52 * Math.PI) / 180,
  yaw = (7 * Math.PI) / 180;
function project(p: Point) {
  const depth = p.z * Math.cos(yaw) - p.x * Math.sin(yaw);
  return {
    x: 100 + p.x * Math.cos(yaw) + p.z * Math.sin(yaw),
    y: 104 + depth * Math.sin(elevation) - p.h * Math.cos(elevation),
  };
}
const xy = (p: Point) => {
  const q = project(p);
  return n(q.x) + ' ' + n(q.y);
};
const path = (points: Point[], close = false) => 'M' + points.map(xy).join('L') + (close ? 'Z' : '');
const interpolate = (a: Point, b: Point, t: number) =>
  point(a.x + (b.x - a.x) * t, a.z + (b.z - a.z) * t, a.h + (b.h - a.h) * t);
function arc(a: number, b: number, r: number, h: number, count: number) {
  return Array.from({ length: count + 1 }, (_, i) => polar(a + ((b - a) * i) / count, r, h));
}
function timed(markup: string, delay: number) {
  return `<g class="relief-arrival" style="--when:${n(delay)}s">${markup}</g>`;
}
// Stacked sections of a round rod expose the underside, colored barrel and narrow highlight.
// The three strokes share the same path length, so their cut edge travels together on replay.
function rod(points: Point[], width: number, mat: Material, time?: [number, number]) {
  const style = time ? ` class="relief-trace" style="--when:${n(time[0])}s;--travel:${n(time[1])}s"` : '';
  const d = path(points);
  const stroke = (color: string, w: number, dx: number, dy: number) =>
    `<path d="${d}" pathLength="1" stroke="${color}" stroke-width="${n(w)}" transform="translate(${n(dx)} ${n(dy)})"/>`;
  return `<g${style} fill="none" stroke-linecap="round" stroke-linejoin="round">${stroke(mat.dark, width, 0, width * 0.2)}${stroke(mat.body, width * 0.85, 0, 0)}${stroke(mat.light, width * 0.18, -width * 0.1, -width * 0.2)}</g>`;
}
function socket(p: Point, radius: number, kind: Kind) {
  const m = materials[kind],
    top = project(p),
    depth = radius * 0.53,
    ry = radius * Math.sin(elevation);
  const x = n(top.x),
    y = n(top.y),
    r = n(radius),
    s = n(ry);
  return `<g transform="translate(${x} ${y})">
    <path d="M${-r} 0 a${r} ${s} 0 0 0 ${2 * r} 0 v${n(depth)} a${r} ${s} 0 0 1 ${-2 * r} 0Z" fill="${m.dark}"/>
    <ellipse rx="${r}" ry="${s}" fill="url(#rim-${kind})" stroke="${m.dark}" stroke-width="${n(radius * 0.09)}"/>
    <ellipse cx="0" cy="-.1" rx="${n(radius * 0.67)}" ry="${n(ry * 0.67)}" fill="url(#ivory-${kind})" stroke="${m.dark}" stroke-width="${n(radius * 0.13)}"/>
  </g>`;
}
function arrowHead(from: Point, to: Point, size: number, kind: Kind) {
  const m = materials[kind],
    dx = to.x - from.x,
    dz = to.z - from.z,
    length = Math.hypot(dx, dz);
  const ux = dx / length,
    uz = dz / length;
  const base = point(to.x - size * ux, to.z - size * uz, to.h);
  const left = point(base.x - size * 0.46 * uz, base.z + size * 0.46 * ux, base.h);
  const right = point(base.x + size * 0.46 * uz, base.z - size * 0.46 * ux, base.h);
  const ridge = point(base.x, base.z, base.h + size * 0.26);
  return `<path d="${path([left, to, right], true)}" fill="${m.dark}" transform="translate(0 .8)"/><path d="${path([left, to, ridge], true)}" fill="${m.light}"/><path d="${path([ridge, to, right], true)}" fill="${m.body}"/>`;
}
function brick(a: number, b: number, inner: number, outer: number, level: number) {
  const samples = 5,
    bottom = 1.2,
    bevel = 0.75;
  const inn = arc(a, b, inner, level, samples),
    out = arc(a, b, outer, level, samples);
  const body = [...out, ...inn.slice().reverse()];
  const sides = body
    .map((p, i) => {
      const q = body[(i + 1) % body.length];
      const normalAngle = Math.atan2(q.z - p.z, q.x - p.x) - Math.PI / 2;
      // Back-facing walls are occluded by the top or by another wall.
      if (Math.sin(normalAngle) * Math.cos(yaw) - Math.cos(normalAngle) * Math.sin(yaw) < 0) return '';
      const light = (Math.cos(normalAngle + 2.45) + 1) / 2;
      const side = `rgb(${Math.round(135 + 52 * light)} ${Math.round(89 + 46 * light)} ${Math.round(49 + 40 * light)})`;
      return `<path d="${path([p, q, { ...q, h: bottom }, { ...p, h: bottom }], true)}" fill="${side}" stroke="${side}" stroke-width=".22"/>`;
    })
    .join('');
  const cap = [
    ...arc(a + 0.006, b - 0.006, outer - bevel, level + bevel, samples),
    ...arc(b - 0.006, a + 0.006, inner + bevel, level + bevel, samples),
  ];
  return (
    sides +
    `<path d="${path(body, true)}" fill="#c49a68" stroke="#986333" stroke-width=".48"/><path d="${path(cap, true)}" fill="#ecd0a4" stroke="#f9e6c7" stroke-width=".36"/>`
  );
}
function foundation() {
  const kind = 'foundationalism',
    m = materials[kind];
  const bricks: { depth: number; markup: string }[] = [];
  for (const [inside, outside, offset, level] of [
    [65, 76, 0, 9],
    [77.3, 89, tau / 24, 14],
  ]) {
    for (let i = 0; i < 12; i++) {
      const a = (i * tau) / 12 + offset + 0.012,
        b = ((i + 1) * tau) / 12 + offset - 0.012;
      bricks.push({
        depth: project(polar((a + b) / 2, (inside + outside) / 2)).y,
        markup: brick(a, b, inside, outside, level),
      });
    }
  }
  const masonry = bricks
    .sort((a, b) => a.depth - b.depth)
    .map((b) => b.markup)
    .join('');
  let spokes = '';
  for (let i = 0; i < 6; i++) {
    const a = -Math.PI / 2 + (i * tau) / 6,
      origin = polar(a, 7, 7),
      stop = polar(a, 64.8, 8);
    const start = i * 0.09,
      travel = 0.95;
    spokes +=
      rod([origin, stop], 2.3, m, [start, travel]) +
      timed(arrowHead(origin, stop, 7, kind), start + travel - 0.05) +
      socket(polar(a, 37, 8.3), 4.35, kind);
  }
  return masonry + spokes + socket(point(0, 0, 9), 7.9, kind);
}
function network() {
  const kind = 'coherentism',
    m = materials[kind];
  const posts = Array.from({ length: 8 }, (_, i) => polar(-Math.PI / 2 + (i * tau) / 8, 67, 8.2));
  const pairs = [...posts.map((_, i) => [i, (i + 3) % 8]), [0, 4], [2, 6]];
  const strands = pairs
    .map(([a, b], i) => {
      const from = posts[a],
        to = posts[b],
        inset = 5.1 / Math.hypot(to.x - from.x, to.z - from.z);
      const start = interpolate(from, to, inset),
        end = interpolate(from, to, 1 - inset);
      // Small differences in height make the crossings read as separate links.
      const middle = interpolate(start, end, 0.5);
      middle.h += (i % 3) * 2.2;
      const delay = i * 0.12,
        travel = 0.45;
      return (
        rod([start, middle, end], 2.65, m, [delay, travel]) +
        timed(arrowHead(middle, end, 7, kind) + arrowHead(middle, start, 7, kind), delay + travel - 0.04)
      );
    })
    .join('');
  return strands + posts.map((p) => socket(p, 5.75, kind)).join('');
}
function infiniteSpiral() {
  const kind = 'infinitism',
    m = materials[kind];
  const at = (a: number) => {
    const scale = Math.exp(-0.11 * a);
    return polar(-Math.PI / 2 + a, 82 * scale, 1.3 + 9.6 * scale);
  };
  const segments: string[] = [],
    nodes: string[] = [];
  // Work inward until the remaining turns are below a hundredth of a viewBox unit.
  for (let a = 0; a < 82; a += 0.5) {
    const s = Math.exp(-0.11 * a),
      pts = Array.from({ length: 7 }, (_, i) => at(a + (0.5 * i) / 6));
    segments.push(rod(pts, 2.5 * s, m, [a / 8, 0.5 / 8]));
    nodes.push(timed(socket(at(a), 4.7 * s, kind), a / 8));
  }
  return segments.join('') + nodes.join('');
}
function skull(p: Point) {
  const q = project(p);
  return `<g transform="translate(${n(q.x)} ${n(q.y)}) rotate(-4)">
    <path d="M-6 3 Q-11 -1 -8 -7 Q-4 -13 3 -11 Q10 -9 10 -2 Q10 3 6 6 L6 10 L-3 10 L-6 7Z" fill="#78374a"/>
    <path d="M-6 2 Q-11 -2 -8 -8 Q-4 -13 3 -11 Q9 -9 9 -4 Q9 1 5 4 L5 7 Q0 9 -5 6Z" fill="url(#ivory-skepticism)" stroke="#963e51" stroke-width="1"/>
    <ellipse cx="-4" cy="-3" rx="2.6" ry="2.8" fill="#743146"/><ellipse cx="3" cy="-3.5" rx="2.7" ry="2.8" fill="#743146"/>
    <path d="M-1 2 L.2 -.5 L1.8 2.4Z M-2.3 4.5V7 M1.3 4.8V7.6" stroke="#81384a" fill="#81384a" stroke-width="1.05"/>
  </g>`;
}
function skeptic() {
  const kind = 'skepticism',
    m = materials[kind];
  const at = (t: number) => polar(-Math.PI / 2 + t * tau * 0.92, 66, 6);
  const ring = rod(
    Array.from({ length: 145 }, (_, i) => at(i / 144)),
    3,
    m,
    [0, 1],
  );
  const nodes = Array.from({ length: 13 }, (_, i) => timed(socket(at(i / 13), 4.5, kind), i / 13)).join('');
  const end = at(1),
    tangent = tau * 0.92;
  const marker = point(end.x + Math.cos(tangent) * 13, end.z + Math.sin(tangent) * 13, 9);
  return ring + nodes + timed(skull(marker), 1);
}
const models: Record<Kind, () => string> = {
  foundationalism: foundation,
  coherentism: network,
  infinitism: infiniteSpiral,
  skepticism: skeptic,
};

export function initializeRegressAnimations() {
  const controller = new AbortController();
  for (const kind of Object.keys(models) as Kind[]) {
    const host = document.getElementById('regress-' + kind);
    if (!host) continue;
    const m = materials[kind];
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 200 200');
    svg.setAttribute('class', 'regress-animation');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', descriptions[kind]);
    svg.innerHTML = `<defs>
      <linearGradient id="rim-${kind}" x2=".8" y2="1" gradientUnits="objectBoundingBox"><stop stop-color="${m.light}"/><stop offset=".45" stop-color="${m.body}"/><stop offset="1" stop-color="${m.dark}"/></linearGradient>
      <radialGradient id="ivory-${kind}" cx=".32" cy=".23" r=".88"><stop stop-color="#fff9e9"/><stop offset=".64" stop-color="#f3ecdc"/><stop offset="1" stop-color="${m.cap}"/></radialGradient>
      <filter id="shadow-${kind}" x="-30%" y="-35%" width="170%" height="185%" color-interpolation-filters="sRGB"><feDropShadow dx="1.9" dy="4.4" stdDeviation="1.65" flood-color="#58452f" flood-opacity=".25"/></filter>
    </defs><ellipse class="relief-hit" cx="100" cy="101" rx="92" ry="81"/><g filter="url(#shadow-${kind})">${models[kind]()}</g>`;
    host.append(svg);
    const replay = () => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      svg.classList.remove('is-tracing');
      // Flush the previous animation so a second visit always starts a fresh trace.
      void svg.getBoundingClientRect();
      svg.classList.add('is-tracing');
    };
    const options = { signal: controller.signal };
    host.addEventListener('pointerenter', replay, options);
    host.addEventListener(
      'focus',
      () => {
        if (host.matches(':focus-visible') && !host.matches(':hover')) replay();
      },
      options,
    );
    controller.signal.addEventListener('abort', () => svg.remove(), { once: true });
  }
  return () => controller.abort();
}
