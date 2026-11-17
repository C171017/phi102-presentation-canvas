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
    ['versions-map-heading', 'si-heading'], ['si-heading', 'ctx-heading'], ['ctx-heading', 'disagree-heading'],
  ],
  applications: [
    ['flexible-heading', 'aim-applications'], ['aim-applications', 'access-heading'],
    ['access-heading', 'home-heading'], ['home-heading', 'mobile-heading'], ['mobile-heading', 'conclusion-heading'],
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
  tip: SVGPathElement;
};

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
    const line = document.createElementNS(svgNS, 'path');
    const flow = document.createElementNS(svgNS, 'path');
    const tip = document.createElementNS(svgNS, 'path');
    line.classList.add('link-line');
    flow.classList.add('link-flow');
    tip.classList.add('link-tip');
    group.append(line, flow, tip);
    layer.append(group);
    links.push({ source, target, preferRow: target.classList.contains('slide-title'), group, line, flow, tip });
  }
  const aims = world.querySelector<SVGSVGElement>('#connections')!;
  const regress = world.querySelector<SVGSVGElement>('#regress-connections')!;
  for (const [family, pairs] of Object.entries(aimLinks)) {
    for (const pair of pairs) add(aims, `link-${family}`, pair);
  }
  for (const route of regressRoutes) add(regress, `route-${route}`, ['regress-problem', `regress-${route}`]);

  return (zoom: number) => updateConnections(links, world.getBoundingClientRect(), zoom);
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
  const tipBase: Point = [...b];
  tipBase[axis] -= side * tipLength;
  const radius = Math.min(96, Math.abs(shift) / 2, Math.abs(turn - a[axis]), Math.abs(tipBase[axis] - turn));
  const point = (along: number, across: number): Point => axis === 0 ? [along, across] : [across, along];
  const at = (along: number, across: number) => vector(point(along, across));
  const bend = Math.sign(shift) * radius;
  const d = Math.abs(shift) < 0.5 ? `M${vector(a)}L${vector(tipBase)}` :
    `M${vector(a)}L${at(turn - side * radius, a[cross])}` +
    `Q${at(turn, a[cross])} ${at(turn, a[cross] + bend)}` +
    `L${at(turn, b[cross] - bend)}Q${at(turn, b[cross])} ${at(turn + side * radius, b[cross])}L${vector(tipBase)}`;

  // A narrow wedge continues the track rather than placing an arrowhead on top of it.
  const base = tipBase[axis] - side * 0.3;
  const tip = `M${at(base, b[cross] - 2.5)}L${vector(b)}L${at(base, b[cross] + 2.5)}Z`;
  const period = Math.min(310, Math.max(30, span + Math.abs(shift) - radius - tipLength));
  return { d, tip, period };
}

function updateConnections(links: Link[], origin: Pick<DOMRect, 'left' | 'top'>, zoom: number) {
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

  routes.forEach(({ link, from, to, gap }, i) => {
    if (!from || !to || gap === undefined) {
      for (const path of [link.line, link.flow, link.tip]) if (path.hasAttribute('d')) path.removeAttribute('d');
      return;
    }
    const { d, tip, period } = roundedRoute(from, to, gap);
    if (link.tip.getAttribute('d') !== tip) link.tip.setAttribute('d', tip);
    if (link.line.getAttribute('d') === d) return;
    link.line.setAttribute('d', d);
    link.flow.setAttribute('d', d);
    link.group.style.setProperty('--flow-period', `${period}px`);
    link.group.style.setProperty('--flow-duration', `${period / 125}s`);
    link.group.style.setProperty('--flow-delay', `${-(i % 7) * 0.23}s`);
  });
}
