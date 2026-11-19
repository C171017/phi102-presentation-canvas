// SVG shapes and oblique faces for the canvas illustrations.

export const P = {
  ink: '#322a20', soft: '#62584b', faint: '#94816a', line: '#a58a67',
  paper: '#fffdf8', bg: '#faf9f6', skin: '#f3e3cf',
  slate: '#334c4c', slateSide: '#263a3a', slateTop: '#4a6563', sage: '#829b94', mist: '#e3ebe5',
  stone: '#ead0ad', stoneTop: '#f5e6cf', stoneSide: '#d3ac7c', stoneEdge: '#b7793f',
  dull: '#ece7de', dullTop: '#f5f1ea', dullSide: '#d6cfc2', dullEdge: '#b5ada0',
  red: '#9d3b4b', blue: '#285c9d', green: '#206c58', ochre: '#8a571c', gold: '#eab638',
  ctx: '#a25b45', subj: '#457c71', view: '#4c729a', expr: '#89688e',
  shadow: 'rgba(50,42,32,.15)',
};
export type Pt = [number, number];

const n = (value: number) => +value.toFixed(1);

type Pen = { c?: string; w?: number; o?: number; dash?: string };
const pen = ({ c = P.ink, w = 2.1, o = 1, dash = '' }: Pen = {}) =>
  `class="sk" stroke="${c}" stroke-width="${w}"${o < 1 ? ` stroke-opacity="${o}"` : ''}${dash ? ` stroke-dasharray="${dash}"` : ''}`;

export function line(x1: number, y1: number, x2: number, y2: number, options: Pen = {}) {
  return `<path d="M${n(x1)} ${n(y1)}L${n(x2)} ${n(y2)}" ${pen(options)}/>`;
}
const closed = (points: Pt[]) => `M${points.map(p => `${n(p[0])} ${n(p[1])}`).join('L')}Z`;

type Fill = Pen & { shadow?: boolean | Pt; fo?: number };
const drop = (d: string, shadow: Fill['shadow']) => {
  if (!shadow) return '';
  const [dx, dy] = shadow === true ? [6, 7] : shadow;
  return `<path d="${d}" transform="translate(${dx} ${dy})" fill="${P.shadow}"/>`;
};
const shape = (d: string, fill: string, options: Fill = {}) =>
  `${drop(d, options.shadow)}<path d="${d}" fill="${fill}"${options.fo !== undefined ? ` fill-opacity="${options.fo}"` : ''} ${pen(options)}/>`;

export function poly(points: Pt[], fill: string, options: Fill = {}) {
  return shape(closed(points), fill, options);
}
export const rect = (x: number, y: number, w: number, h: number, fill: string, options: Fill = {}) =>
  poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], fill, options);

export function rrect(x: number, y: number, w: number, h: number, r: number, fill: string, options: Fill = {}) {
  const d = `M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`;
  return shape(d, fill, options);
}
export function ell(cx: number, cy: number, rx: number, ry: number, fill: string, options: Fill = {}) {
  const d = `M${cx - rx} ${cy}A${rx} ${ry} 0 1 1 ${cx + rx} ${cy}A${rx} ${ry} 0 1 1 ${cx - rx} ${cy}Z`;
  return shape(d, fill, options);
}
/** A soft contact shadow that sits a figure or block on the page. */
export const ground = (cx: number, cy: number, rx: number, ry = rx * 0.22) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${n(ry)}" fill="${P.shadow}"/>`;

type Faces = { face?: string; top?: string; side?: string; edge?: string; w?: number; shadow?: boolean };
/** An oblique box: front face at (x, y), receding up and to the right by `d`. */
export function block(x: number, y: number, w: number, h: number, d: number, f: Faces = {}) {
  const { face = P.stone, top = P.stoneTop, side = P.stoneSide, edge = P.stoneEdge, shadow = true } = f;
  const dx = d, dy = -d * 0.55, o = { c: edge, w: f.w ?? 2 };
  const floor = shadow ? `<path d="${closed([[x + 5, y + h], [x + w, y + h], [x + w + dx + 9, y + h + dy + 5], [x + w + dx + 9, y + h + 7], [x + 12, y + h + 9]])}" fill="${P.shadow}"/>` : '';
  return floor
    + poly([[x, y], [x + dx, y + dy], [x + w + dx, y + dy], [x + w, y]], top, o)
    + poly([[x + w, y], [x + w + dx, y + dy], [x + w + dx, y + h + dy], [x + w, y + h]], side, o)
    + poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], face, o);
}
/** A foundation stone: the canvas's brick motif, given a top and a side. */
export function stone(x: number, y: number, w: number, h: number, d = 16, active = true, f: Faces = {}) {
  const colors: Faces = active ? {} : { face: P.dull, top: P.dullTop, side: P.dullSide, edge: P.dullEdge };
  const edge = f.edge ?? colors.edge ?? P.stoneEdge, o = { c: edge, w: 1.2, o: 0.6 };
  return block(x, y, w, h, d, { ...colors, ...f })
    + line(x + 2, y + h / 2, x + w - 2, y + h / 2, o)
    + line(x + w / 2, y + 2, x + w / 2, y + h / 2, o)
    + line(x + w / 4, y + h / 2, x + w / 4, y + h - 2, o) + line(x + w * 0.75, y + h / 2, x + w * 0.75, y + h - 2, o);
}

type Type = { size?: number; anchor?: 'start' | 'middle' | 'end'; weight?: number; fill?: string; italic?: boolean; sans?: boolean; caps?: boolean; o?: number };
const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;');
export function txt(x: number, y: number, value: string, t: Type = {}) {
  const { size = 18, anchor = 'middle', weight = 400, fill = P.ink } = t;
  const family = t.sans ? 'system-ui, -apple-system, sans-serif' : 'Georgia, serif';
  return `<text x="${n(x)}" y="${n(y)}" text-anchor="${anchor}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}"${t.italic ? ' font-style="italic"' : ''}${t.caps ? ` letter-spacing="${n(size * 0.09)}"` : ''}${t.o ? ` opacity="${t.o}"` : ''}>${escape(t.caps ? value.toUpperCase() : value)}</text>`;
}
export const lines = (x: number, y: number, values: string[], t: Type & { lh?: number } = {}) =>
  values.map((value, i) => txt(x, y + i * (t.lh ?? (t.size ?? 18) * 1.32), value, t)).join('');
/** Small sans capitals: the kit's quiet labelling voice. */
export const tag = (x: number, y: number, value: string, fill = P.soft, t: Type = {}) =>
  txt(x, y, value, { size: 12.5, weight: 650, sans: true, caps: true, fill, ...t });

type Tail = 'bl' | 'br' | 'tl' | 'tr' | 'none';
/** A speech bubble with a hard shadow. (x, y) is its top-left corner. */
export function bubble(x: number, y: number, w: number, h: number, words: string[], b: { fill?: string; c?: string; tail?: Tail; color?: string; size?: number; italic?: boolean; weight?: number; shadow?: boolean } = {}) {
  const { fill = P.paper, c = P.ink, tail = 'bl', size = 17, shadow = true } = b, r = Math.min(16, h / 2.4);
  const bottom = tail === 'bl' ? `H${x + 50}L${x + 22} ${y + h + 20}L${x + 30} ${y + h}` : tail === 'br' ? `H${x + w - 30}L${x + w - 22} ${y + h + 20}L${x + w - 50} ${y + h}` : '';
  const upper = tail === 'tl' ? `H${x + 30}L${x + 22} ${y - 20}L${x + 50} ${y}` : tail === 'tr' ? `H${x + w - 50}L${x + w - 22} ${y - 20}L${x + w - 30} ${y}` : '';
  const d = `M${x + r} ${y}${upper}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}${bottom}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`;
  const lh = size * 1.3, first = y + h / 2 - (words.length - 1) * lh / 2 + size * 0.34;
  return shape(d, fill, { c, w: 2, shadow: shadow && [5, 6] })
    + lines(x + w / 2, first, words, { size, lh, fill: b.color ?? (fill === P.paper ? P.ink : '#fff'), italic: b.italic, weight: b.weight });
}

type Pose = 'none' | 'point' | 'raise' | 'shrug' | 'chin' | 'hold';
/** An editorial figure. (x, y) is the point between the feet; `flip` faces it left. */
export function person(x: number, y: number, coat: string, f: { s?: number; arm?: Pose; flip?: boolean; hair?: string } = {}) {
  const { s = 1, arm = 'none', flip = false, hair = P.ink } = f, k = flip ? -1 : 1;
  const X = (v: number) => n(x + v * s * k), Y = (v: number) => n(y + v * s);
  const body = `M${X(-17)} ${Y(-76)}Q${X(0)} ${Y(-88)} ${X(17)} ${Y(-76)}L${X(24)} ${Y(-3)}Q${X(0)} ${Y(3)} ${X(-24)} ${Y(-3)}Z`;
  const arms: Record<Pose, string> = {
    none: '',
    point: `M${X(14)} ${Y(-68)}L${X(46)} ${Y(-74)}`,
    raise: `M${X(14)} ${Y(-70)}L${X(34)} ${Y(-108)}`,
    shrug: `M${X(14)} ${Y(-68)}L${X(40)} ${Y(-58)}M${X(-14)} ${Y(-68)}L${X(-40)} ${Y(-58)}`,
    chin: `M${X(13)} ${Y(-64)}L${X(26)} ${Y(-78)}L${X(10)} ${Y(-92)}`,
    hold: `M${X(14)} ${Y(-64)}L${X(34)} ${Y(-50)}`,
  };
  const stroke = `fill="none" stroke="${P.ink}" stroke-linecap="round" stroke-linejoin="round"`;
  return ground(x, y + 1 * s, 30 * s)
    + (arms[arm] ? `<path d="${arms[arm]}" ${stroke} stroke-width="${n(7 * s)}"/><path d="${arms[arm]}" fill="none" stroke="${coat}" stroke-linecap="round" stroke-linejoin="round" stroke-width="${n(3.6 * s)}"/>` : '')
    + shape(body, coat, { w: 2 })
    + `<path d="M${X(-11)} ${Y(-36)}L${X(-13)} ${Y(-8)}" fill="none" stroke="#fff" stroke-width="${n(2.2 * s)}" stroke-linecap="round" opacity=".28"/>`
    + ell(x, y - 101 * s, 14 * s, 15 * s, P.skin, { w: 2 })
    + `<path d="M${X(-14)} ${Y(-104)}Q${X(-12)} ${Y(-119)} ${X(2)} ${Y(-117)}Q${X(13)} ${Y(-116)} ${X(14)} ${Y(-105)}Q${X(4)} ${Y(-111)} ${X(-14)} ${Y(-104)}Z" fill="${hair}"/>`
    + `<circle cx="${X(5)}" cy="${Y(-99)}" r="${n(1.5 * s)}" fill="${P.ink}"/>`;
}

/** The optional bend pushes the arrow's middle sideways. */
export function arrow(x1: number, y1: number, x2: number, y2: number, a: Pen & { bend?: number; head?: number } = {}) {
  const { bend = 0, head = 10 } = a, length = Math.hypot(x2 - x1, y2 - y1) || 1;
  const cx = (x1 + x2) / 2 - (y2 - y1) / length * bend, cy = (y1 + y2) / 2 + (x2 - x1) / length * bend;
  const angle = Math.atan2(y2 - cy, x2 - cx), wing = (turn: number) => `${n(x2 - head * Math.cos(angle + turn))} ${n(y2 - head * Math.sin(angle + turn))}`;
  return `<path d="M${n(x1)} ${n(y1)}Q${n(cx)} ${n(cy)} ${n(x2)} ${n(y2)}M${wing(-0.5)}L${n(x2)} ${n(y2)}L${wing(0.5)}" ${pen({ w: 2.2, ...a })}/>`;
}
export const check = (x: number, y: number, s = 1, c = P.green) =>
  `<path d="M${n(x - 9 * s)} ${n(y)}L${n(x - 2 * s)} ${n(y + 8 * s)}L${n(x + 11 * s)} ${n(y - 10 * s)}" ${pen({ c, w: 4 * s })}/>`;
export const cross = (x: number, y: number, s = 1, c = P.red) =>
  `<path d="M${n(x - 8 * s)} ${n(y - 8 * s)}L${n(x + 8 * s)} ${n(y + 8 * s)}M${n(x + 8 * s)} ${n(y - 8 * s)}L${n(x - 8 * s)} ${n(y + 8 * s)}" ${pen({ c, w: 4 * s })}/>`;
/** Doubt is always the same bold serif question mark. */
export const doubt = (x: number, y: number, size = 34, c = P.red, o = 1) =>
  `<text x="${n(x)}" y="${n(y)}" text-anchor="middle" font-family="Georgia, serif" font-weight="800" font-size="${size}" fill="${c}"${o < 1 ? ` opacity="${o}"` : ''}>?</text>`;
export function star(cx: number, cy: number, r = 12, fill = P.gold) {
  const points: Pt[] = Array.from({ length: 10 }, (_, i) => {
    const radius = i % 2 ? r * 0.45 : r, angle = -Math.PI / 2 + i * Math.PI / 5;
    return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius];
  });
  return `<path d="${closed(points)}" fill="${fill}" stroke="#c9952a" stroke-width="1.2" stroke-linejoin="round"/>`;
}
/** A paper label: the kit's caption plate. */
export function plate(cx: number, cy: number, w: number, h: number, words: string[], t: Type & { bg?: string; c?: string; tilt?: number; lh?: number } = {}) {
  const size = t.size ?? 16, lh = t.lh ?? size * 1.3, first = cy - (words.length - 1) * lh / 2 + size * 0.34;
  const body = rect(cx - w / 2, cy - h / 2, w, h, t.bg ?? P.paper, { c: t.c ?? P.ink, w: 1.8, shadow: [4, 5] })
    + lines(cx, first, words, { ...t, size, lh, fill: t.fill ?? P.ink });
  return t.tilt ? `<g transform="rotate(${t.tilt} ${cx} ${cy})">${body}</g>` : body;
}
/** Wraps markup so it enters on beat `i` when its scene is played. */
export const st = (i: number, ...markup: string[]) => `<g class="st" style="--i:${i}">${markup.join('')}</g>`;
/** A dashed ring: the canvas's sign for "a context". */
export const ring = (cx: number, cy: number, rx: number, ry: number, c: string, fill = c) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" fill-opacity=".1" stroke="${c}" stroke-width="2.4" stroke-dasharray="2 8" stroke-linecap="round"/>`;
