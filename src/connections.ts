import './connections.css';

type Pair = [source: string, target: string];
const aimLinks: Record<string, Pair[]> = {
  motivations: [
    ['flexible-heading', 'aim-motivations'], ['aim-motivations', 'regress-problem'],
    ['regress-foundationalism', 'dilemma-heading'], ['dilemma-heading', 'undoubted-heading'],
    ['undoubted-heading', 'route-social-heading'], ['undoubted-heading', 'route-hinges-heading'],
    ['undoubted-heading', 'route-knowledge-heading'],
  ],
  versions: [
    ['flexible-heading', 'aim-versions'], ['aim-versions', 'versions-map-heading'],
    ['versions-map-heading', 'pairings-heading'],
  ],
  applications: [
    ['flexible-heading', 'aim-applications'], ['aim-applications', 'access-heading'],
  ],
};
const regressRoutes = ['skepticism', 'infinitism', 'coherentism', 'foundationalism'];
const svgNS = 'http://www.w3.org/2000/svg';

type Point = [x: number, y: number];
type Box = { center: Point; half: Point };
type Axis = 0 | 1;
type Port = { element: HTMLElement; box: Box; axis: Axis; side: number; facing: number; offset: number };
type Link = {
  source: HTMLElement;
  target: HTMLElement;
  preferRow: boolean;
  group: SVGGElement;
  line: SVGPathElement;
  flow: SVGPathElement;
  silhouette: SVGPathElement;
};

type Relation = {
  source: HTMLElement; target: HTMLElement; name: string;
  path: SVGPathElement; label: SVGTextElement;
};
function applicationRelations(layer: SVGSVGElement): Relation[] {
  const marker = document.createElementNS(svgNS, 'marker');
  marker.id = 'application-arrowhead';
  marker.setAttribute('viewBox', '0 0 12 12');
  marker.setAttribute('refX', '11');
  marker.setAttribute('refY', '6');
  marker.setAttribute('markerWidth', '5');
  marker.setAttribute('markerHeight', '5');
  marker.setAttribute('orient', 'auto');
  const tip = document.createElementNS(svgNS, 'path');
  tip.setAttribute('d', 'M1 1L11 6L1 11');
  tip.setAttribute('fill', 'none');
  tip.setAttribute('stroke', '#266f62');
  tip.setAttribute('stroke-width', '2');
  marker.append(tip);
  layer.append(marker);
  return [
    ['mobile-scene', 'home-heading', 'shifts'],
    ['home-weather', 'access-principle', 'fixes'],
    ['access-principle', 'access-doubt', 'guarantees'],
  ].map(([from, to, name]) => {
    const group = document.createElementNS(svgNS, 'g');
    group.classList.add('application-relation');
    group.dataset.relation = name;
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('marker-end', 'url(#application-arrowhead)');
    const label = document.createElementNS(svgNS, 'text');
    label.textContent = name;
    group.append(path, label);
    layer.append(group);
    const source = document.getElementById(from)!;
    const target = document.getElementById(to)!;
    return {
      source: name === 'fixes' ? source.querySelector<HTMLElement>('.application-model')! : source,
      target: name === 'fixes' ? target.querySelector<HTMLElement>('.order-claim strong')! : target,
      name, path, label,
    };
  });
}

function relationGeometry(name: string, a: Box, b: Box) {
  if (name === 'guarantees') {
    const x1 = a.center[0] - a.half[0] + 17, x2 = b.center[0] - b.half[0] + 17;
    const y1 = a.center[1], y2 = b.center[1];
    const left = Math.min(x1, x2) - 128;
    return { d: `M${x1} ${y1}C${left} ${y1 + (y2-y1)*.15},${left} ${y2 - (y2-y1)*.15},${x2} ${y2}`,
      x: (x1 + x2) / 8 + .75 * left + 14, y: (y1 + y2) / 2, anchor: 'start' };
  }
  const dx = b.center[0] - a.center[0], dy = b.center[1] - a.center[1];
  const distance = Math.hypot(dx, dy) || 1;
  const edge = (box: Box) => Math.min(box.half[0] / (Math.abs(dx) || .001), box.half[1] / (Math.abs(dy) || .001)) + 7 / distance;
  const start = edge(a), end = 1 - edge(b);
  const x1 = a.center[0] + dx * start, y1 = a.center[1] + dy * start;
  const x2 = a.center[0] + dx * end, y2 = a.center[1] + dy * end;
  return { d: end > start ? `M${x1} ${y1}L${x2} ${y2}` : '', x: (x1+x2)/2 + 12, y: (y1+y2)/2 + 30, anchor: 'start' };
}

export function createConnections(world: HTMLElement) {
  const links: Link[] = [];
  function add(layer: SVGSVGElement, family: string, [sourceId, targetId]: Pair) {
    const source = document.getElementById(sourceId);
    const target = document.getElementById(targetId);
    if (!source || !target) return;
    const group = document.createElementNS(svgNS, 'g');
    group.classList.add('canvas-link', family);
    group.dataset.source = sourceId;
    group.dataset.target = targetId;
    const clip = document.createElementNS(svgNS, 'clipPath');
    clip.id = `link-clip-${sourceId}-${targetId}`;
    const silhouette = document.createElementNS(svgNS, 'path');
    clip.append(silhouette);
    const strokes = document.createElementNS(svgNS, 'g');
    strokes.setAttribute('clip-path', `url(#${clip.id})`);
    const line = document.createElementNS(svgNS, 'path');
    const flow = document.createElementNS(svgNS, 'path');
    line.classList.add('link-line');
    flow.classList.add('link-flow');
    strokes.append(line, flow);
    group.append(clip, strokes);
    layer.append(group);
    links.push({ source, target, preferRow: target.classList.contains('slide-title'), group, line, flow, silhouette });
  }
  const aims = world.querySelector<SVGSVGElement>('#connections')!;
  const regress = world.querySelector<SVGSVGElement>('#regress-connections')!;
  for (const [family, pairs] of Object.entries(aimLinks)) {
    for (const pair of pairs) add(aims, `link-${family}`, pair);
  }
  for (const route of regressRoutes) add(regress, `route-${route}`, ['regress-problem', `regress-${route}`]);

  const relations = applicationRelations(aims);
  return (zoom: number) => updateConnections(links, world.getBoundingClientRect(), zoom, relations);
}

const crossAxis = (axis: Axis): Axis => axis === 0 ? 1 : 0;

function portPoint(port: Port, clearance: number): Point {
  const { box, axis, side, offset } = port;
  const point: Point = [...box.center];
  point[axis] += (box.half[axis] + clearance) * side;
  point[crossAxis(axis)] += offset;
  return point;
}

const vector = ([x, y]: Point) => `${+x.toFixed(2)} ${+y.toFixed(2)}`;

function roundedRoute(from: Port, to: Port, gap: number) {
  const { axis, side } = from;
  const cross = crossAxis(axis);
  const clearance = Math.min(14, gap / 4);
  const a = portPoint(from, clearance), b = portPoint(to, clearance);
  const span = Math.abs(b[axis] - a[axis]);
  const shift = b[cross] - a[cross];
  // Peel off earlier for larger detours so neighboring branches get their own lanes.
  const turn = a[axis] + (0.5 - Math.min(0.18, Math.abs(shift) / (4 * span))) * span * side;
  const tipLength = Math.min(22, span * 0.19);
  const base = b[axis] - side * tipLength;
  const radius = Math.min(144, Math.abs(shift) / 2, Math.abs(turn - a[axis]), Math.abs(base - turn));
  const at = (along: number, across: number) => vector(axis === 0 ? [along, across] : [across, along]);
  const bend = Math.sign(shift) * radius;
  const sweep = side * shift * (axis === 0 ? 1 : -1) > 0 ? 1 : 0;
  const arc = `A${+radius.toFixed(2)} ${+radius.toFixed(2)} 0 0`;
  const straight = Math.abs(shift) < 0.5;
  const d = straight ? `M${vector(a)}L${vector(b)}` :
    `M${vector(a)}L${at(turn - side * radius, a[cross])}` +
    `${arc} ${sweep} ${at(turn, a[cross] + bend)}` +
    `L${at(turn, b[cross] - bend)}${arc} ${1 - sweep} ${at(turn + side * radius, b[cross])}L${vector(b)}`;

  // Taper both strokes together so the moving dash can sweep the entire arrowhead.
  const start = a[axis] - side * 5;
  const low = Math.min(a[cross], b[cross]) - 5;
  const high = Math.max(a[cross], b[cross]) + 5;
  const shoulder = base + side * tipLength * 0.4;
  const silhouette = `M${at(start, low)}L${at(base, low)}L${at(base, b[cross] - 2.5)}` +
    `Q${at(shoulder, b[cross] - 2.5)} ${vector(b)}` +
    `Q${at(shoulder, b[cross] + 2.5)} ${at(base, b[cross] + 2.5)}` +
    `L${at(base, high)}L${at(start, high)}Z`;
  const length = straight ? Math.hypot(span, shift) : span + Math.abs(shift) - (4 - Math.PI) * radius;
  const period = Math.min(310, Math.max(30, length));
  return { d, silhouette, period };
}

function updateConnections(links: Link[], origin: Pick<DOMRect, 'left' | 'top'>, zoom: number, relations: Relation[] = []) {
  const boxes = new Map<HTMLElement, Box>();
  const ports = new Map<HTMLElement, Map<string, Port[]>>();
  function getBox(element: HTMLElement) {
    let box = boxes.get(element);
    if (box) return box;
    const { left, right, top, bottom } = element.getBoundingClientRect();
    box = {
      center: [((left + right) / 2 - origin.left) / zoom, ((top + bottom) / 2 - origin.top) / zoom],
      half: [(right - left) / (2 * zoom), (bottom - top) / (2 * zoom)],
    };
    boxes.set(element, box);
    return box;
  }
  function addPort(port: Port) {
    let sides = ports.get(port.element);
    if (!sides) ports.set(port.element, sides = new Map());
    const key = `${port.axis}:${port.side}`;
    let lane = sides.get(key);
    if (!lane) sides.set(key, lane = []);
    lane.push(port);
    return port;
  }

  // Read geometry for every endpoint before touching SVG attributes or styles.
  const routes = links.map(link => {
    const a = getBox(link.source), b = getBox(link.target);
    const dx = b.center[0] - a.center[0], dy = b.center[1] - a.center[1];
    const xGap = Math.abs(dx) - a.half[0] - b.half[0];
    const yGap = Math.abs(dy) - a.half[1] - b.half[1];
    if (xGap <= 0 && yGap <= 0) return { link };
    // Slide illustrations sit below their headings. Use the side corridor when it fits.
    const axis: Axis = xGap >= yGap || (link.preferRow && xGap >= 80) ? 0 : 1;
    const side = Math.sign(axis === 0 ? dx : dy);
    const cross = crossAxis(axis);
    const from = addPort({ element: link.source, box: a, axis, side, facing: b.center[cross], offset: 0 });
    const to = addPort({ element: link.target, box: b, axis, side: -side, facing: a.center[cross], offset: 0 });
    return { link, from, to, gap: axis === 0 ? xGap : yGap };
  });
  for (const sides of ports.values()) for (const lane of sides.values()) {
    if (lane.length < 2) continue;
    lane.sort((a, b) => a.facing - b.facing);
    const spacing = Math.min(20, lane[0].box.half[crossAxis(lane[0].axis)] / (lane.length - 1));
    lane.forEach((port, i) => { port.offset = (i - (lane.length - 1) / 2) * spacing; });
  }

  const relationRoutes = relations.map(relation => relationGeometry(relation.name, getBox(relation.source), getBox(relation.target)));
  relations.forEach(({ path, label }, index) => {
    const { d, x, y, anchor } = relationRoutes[index];
    if (path.getAttribute('d') === d) return;
    path.setAttribute('d', d);
    label.style.display = d ? '' : 'none';
    label.setAttribute('x', String(x));
    label.setAttribute('y', String(y));
    label.setAttribute('text-anchor', anchor);
  });
  routes.forEach(({ link, from, to, gap }, i) => {
    if (!from || !to || gap === undefined) {
      for (const path of [link.line, link.flow, link.silhouette]) if (path.hasAttribute('d')) path.removeAttribute('d');
      return;
    }
    const { d, silhouette, period } = roundedRoute(from, to, gap);
    if (link.silhouette.getAttribute('d') !== silhouette) link.silhouette.setAttribute('d', silhouette);
    if (link.line.getAttribute('d') === d) return;
    link.line.setAttribute('d', d);
    link.flow.setAttribute('d', d);
    link.group.style.setProperty('--flow-period', `${period}px`);
    link.group.style.setProperty('--flow-duration', `${period / 125}s`);
    link.group.style.setProperty('--flow-delay', `${-(i % 7) * 0.23}s`);
  });
}
