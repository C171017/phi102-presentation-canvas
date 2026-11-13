import './regress-animations.css';

type Point = { x: number; y: number };
type Kind = 'skepticism' | 'infinitism' | 'coherentism' | 'foundationalism';
const tau = Math.PI * 2;
const polar = (angle: number, radius: number): Point => ({ x: 100 + Math.cos(angle) * radius, y: 100 + Math.sin(angle) * radius });
const xy = (p: Point) => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
const circle = (p: Point, radius = 5, opacity = 1) => `<circle cx="${p.x}" cy="${p.y}" r="${radius}" opacity="${opacity}" class="belief"/>`;
const path = (points: Point[], attributes = '') => `<path d="M${points.map(xy).join('L')}" ${attributes}/>`;
function arrow(from: Point, to: Point, opacity = 1) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  const wing = (offset: number) => ({ x: to.x - 6 * Math.cos(angle + offset), y: to.y - 6 * Math.sin(angle + offset) });
  return `<g opacity="${opacity}">${path([from, to])}${path([wing(-0.5), to, wing(0.5)])}</g>`;
}
const beliefs = Array.from({ length: 8 }, (_, i) => polar(-Math.PI / 2 + i * tau / 8, 67));
const inner = Array.from({ length: 6 }, (_, i) => polar(-Math.PI / 2 + i * tau / 6, 37));
const spiral = (t: number) => polar(-Math.PI / 2 + t * tau * 0.92, 66);
const spiralPoints = Array.from({ length: 181 }, (_, i) => spiral(i / 180));
const inwardRadius = (angle: number) => 82 * Math.exp(-0.11 * angle);
const inwardPoint = (angle: number) => polar(-Math.PI / 2 + angle, inwardRadius(angle));
const inwardSpeed = 4;
const foundationLineDuration = 1.9;
const foundationLineStagger = 0.18;
const lastFoundationArrival = foundationLineDuration + (inner.length - 1) * foundationLineStagger;
const descriptions: Record<Kind, string> = {
  skepticism: 'A clockwise chain of beliefs makes one loop and ends at a skull and crossbones.',
  infinitism: 'A clockwise trail passes fixed beliefs along an inward spiral, becoming indefinitely smaller with no endpoint.',
  coherentism: 'Selected mutual-support links build into a lasting interconnected set of beliefs.',
  foundationalism: 'Paths trace outward from a central belief through a ring of beliefs to a solid outer foundation of bricks.',
};

function foundation() {
  // Use the warm stone fill and staggered mortar from the existing foundation illustration.
  const courses = [
    { inside: 65, outside: 76, offset: 0 },
    { inside: 78, outside: 89, offset: tau / 24 },
  ];
  return courses.map(course => Array.from({ length: 12 }, (_, i) => {
    const a = i * tau / 12 + course.offset + 0.014;
    const b = (i + 1) * tau / 12 + course.offset - 0.014;
    return `<path class="foundation-brick" d="M${xy(polar(a, course.inside))}L${xy(polar(a, course.outside))}A${course.outside} ${course.outside} 0 0 1 ${xy(polar(b, course.outside))}L${xy(polar(b, course.inside))}A${course.inside} ${course.inside} 0 0 0 ${xy(polar(a, course.inside))}Z"/>`;
  }).join('')).join('');
}

function staticArt(kind: Kind) {
  if (kind === 'coherentism') return beliefs.map(p => circle(p)).join('');
  if (kind === 'foundationalism') return foundation() + inner.map(p => path([{ x: 100, y: 100 }, p], 'class="guide"')).join('') + inner.map(p => circle(p, 4)).join('') + circle({ x: 100, y: 100 }, 7);
  return '';
}

function movingArt(kind: Kind, seconds: number, pairs: number[][]) {
  if (kind === 'skepticism') {
    const progress = Math.min(1, seconds / 2.0);
    const count = Math.floor(progress * 180);
    const end = spiral(progress);
    const track = path([...spiralPoints.slice(0, count + 1), end]);
    const nodes = Array.from({ length: 14 }, (_, i) => (i < 13 && i / 13 <= progress ? circle(spiral(i / 13), 3.5) : '')).join('');
    const tip = arrow(spiral(Math.max(0, progress - 0.025)), end);
    const endPoint = spiral(1);
    const tangent = -Math.PI / 2 + tau * 0.92 + Math.PI / 2;
    const skullCenter = { x: endPoint.x + Math.cos(tangent) * 13, y: endPoint.y + Math.sin(tangent) * 13 };
    const skull = `<g class="skeptic-skull" transform="translate(${skullCenter.x} ${skullCenter.y})" stroke-width="1.4">
      <path d="M-9 7L9 14M-9 14L9 7" stroke-width="2.8"/>
      <path d="M-8 -3C-8 -13 8 -13 8 -3Q8 1 4.5 3V6H-4.5V3Q-8 1 -8 -3Z" fill="#faf9f6"/>
      <ellipse cx="-3" cy="-3" rx="2" ry="2.3" fill="currentColor" stroke="none"/>
      <ellipse cx="3" cy="-3" rx="2" ry="2.3" fill="currentColor" stroke="none"/>
      <path d="M-1.4 1.5L0 -.5L1.4 1.5Z" fill="currentColor" stroke="none"/>
      <path d="M-1.5 3.5V6M1.5 3.5V6"/>
    </g>`;
    return track + nodes + (progress === 1 ? skull : tip);

  }
  if (kind === 'infinitism') {
    const angle = seconds * inwardSpeed;
    // Grow a permanent chain: earlier nodes and segments are never removed.
    const count = Math.ceil(angle / 0.1);
    const trail = Array.from({ length: count }, (_, i) => {
      const a = i * 0.1;
      return path([inwardPoint(a), inwardPoint(Math.min(angle, a + 0.1))],
        `style="stroke-width:${2 * inwardRadius(a) / 82}"`);
    }).join('');
    const nodes = Array.from({ length: Math.floor(angle / 0.5) + 1 }, (_, i) => {
      const a = i * 0.5, scale = inwardRadius(a) / 82;
      return `<g style="stroke-width:${2 * scale}">${circle(inwardPoint(a), 4 * scale).replace('class="belief"', 'class="spiral-belief"')}</g>`;
    }).join('');
    return trail + nodes;
  }

  if (kind === 'coherentism') {
    return pairs.map(([start, end], i) => {
      const t = Math.max(0, Math.min(1, (seconds - i * 0.24) / 0.9));
      if (!t) return '';
      const a = beliefs[start], b = beliefs[end];
      const length = Math.hypot(b.x - a.x, b.y - a.y);
      const position = (v: number) => ({ x: a.x + (b.x - a.x) * v, y: a.y + (b.y - a.y) * v });
      const from = position(7 / length), to = position(1 - 7 / length);
      const head = { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t };
      return arrow(from, head) + (t === 1 ? arrow(position(13 / length), from) : '');
    }).join('');
  }
  const cycle = seconds;
  return inner.map((p, i) => {
    const angle = -Math.PI / 2 + i * tau / 6;
    const progress = Math.max(0, Math.min(1, (cycle - i * foundationLineStagger) / foundationLineDuration));
    const opacity = 1;
    const radius = 9 + progress * 53;
    return `<g opacity="${opacity}">${arrow(polar(angle, 9), polar(angle, radius))}${progress > 0.5 ? circle(p, 4) : ''}${progress === 1 ? path([polar(angle - 0.07, 64), polar(angle + 0.07, 64)], 'class="foundation-arrival"') : ''}</g>`;
  }).join('') + circle({ x: 100, y: 100 }, 7);
}

export function initializeRegressAnimations() {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const cleanups: (() => void)[] = [];
  for (const kind of Object.keys(descriptions) as Kind[]) {
    const host = document.getElementById(`regress-${kind}`);
    if (!host) continue;
    const question = host.querySelector('.foundation-question');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 200 200');
    svg.setAttribute('class', 'regress-animation');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', descriptions[kind]);
    svg.innerHTML = `<g class="regress-static">${staticArt(kind)}</g><g class="regress-motion"></g>`;
    host.append(svg);
    const motion = svg.querySelector('.regress-motion')!;
    let frame = 0, start = 0, started = false, running = false;
    let duration = kind === 'skepticism' ? 2 : kind === 'coherentism' ? 3.1 : lastFoundationArrival;
    // A sparse cross-linked network, including two links through the center.
    const pairs = [...beliefs.map((_, i) => [i, (i + 3) % beliefs.length]), [0, 4], [2, 6]];
    const draw = (seconds: number) => {
      motion.innerHTML = movingArt(kind, seconds, pairs);
      if (kind === 'foundationalism' && seconds >= lastFoundationArrival) host.classList.add('foundation-played');
    };
    const tick = (now: number) => {
      const seconds = Math.min(duration, (now - start) * 2 / 1000);
      draw(seconds);
      running = seconds < duration;
      if (running && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const replay = () => {
      if (question?.matches(':hover, :focus-within')) return;
      cancelAnimationFrame(frame);
      started = true;
      host.classList.add('regress-revealed');
      if (kind === 'infinitism') {
        const pixelsPerUnit = svg.getBoundingClientRect().width / 200;
        duration = Math.max(0, Math.log(82 * pixelsPerUnit / 0.2) / 0.11) / inwardSpeed;
      }
      start = performance.now();
      running = !reducedMotion.matches;
      draw(running ? 0 : duration);
      if (running && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const controller = new AbortController();
    const options = { signal: controller.signal };
    host.addEventListener('pointerenter', replay, options);
    host.addEventListener('focus', () => { if (host.matches(':focus-visible') && !host.matches(':hover')) replay(); }, options);
    // Leaving the title does not hide or interrupt the construction.
    document.addEventListener('visibilitychange', () => {
      cancelAnimationFrame(frame);
      if (!document.hidden && running) frame = requestAnimationFrame(tick);
    }, options);
    reducedMotion.addEventListener('change', () => {
      if (started && reducedMotion.matches) { cancelAnimationFrame(frame); draw(duration); running = false; }
    }, options);
    cleanups.push(() => {
      cancelAnimationFrame(frame);
      controller.abort();
      svg.remove();
      host.classList.remove('regress-playing', 'regress-revealed', 'foundation-played');
    });
  }
  return () => cleanups.forEach(cleanup => cleanup());
}
