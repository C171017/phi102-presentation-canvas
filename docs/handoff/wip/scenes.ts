import { P, reseed, line, poly, rect, rrect, ell, ground, block, stone, txt, lines, tag, bubble, person, arrow, check, cross, doubt, star, plate, st, ring } from './sketch';
import './scenes.css';

// Every drawing illustrates Daniel Greco, “Contextualism about Foundations” (2017).
type Scene = { w: number; h: number; seed: number; beat?: number; label: string; draw: () => string };
const title = (x: number, y: number, kicker: string, name: string, c = P.soft) =>
  tag(x, y, kicker, c, { anchor: 'start' }) + txt(x, y + 30, name, { size: 23, weight: 600, anchor: 'start' });
/** The canvas's "belief": the slate speech block from the first foundation drawing. */
const belief = (x: number, y: number, w = 78, h = 44, fill = P.slate) =>
  `<path d="M${x + 9} ${y}H${x + w - 9}Q${x + w} ${y} ${x + w} ${y + 9}V${y + h - 9}Q${x + w} ${y + h} ${x + w - 9} ${y + h}H${x + w * 0.46}L${x + w * 0.34} ${y + h + 10}V${y + h}H${x + 9}Q${x} ${y + h} ${x} ${y + h - 9}V${y + 9}Q${x} ${y} ${x + 9} ${y}Z" transform="translate(4 5)" fill="${P.shadow}"/>`
  + `<path d="M${x + 9} ${y}H${x + w - 9}Q${x + w} ${y} ${x + w} ${y + 9}V${y + h - 9}Q${x + w} ${y + h} ${x + w - 9} ${y + h}H${x + w * 0.46}L${x + w * 0.34} ${y + h + 10}V${y + h}H${x + 9}Q${x} ${y + h} ${x} ${y + h - 9}V${y + 9}Q${x} ${y} ${x + 9} ${y}Z" fill="${fill}"/>`
  + `<path d="M${x + 14} ${y + 15}H${x + w - 14}M${x + 14} ${y + 27}H${x + w - 30}" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".5"/>`;
const strut = (x: number, y1: number, y2: number, c = P.stoneEdge, o = 1) =>
  `<path d="M${x} ${y1}V${y2}" stroke="${c}" stroke-width="11" stroke-linecap="round" opacity="${o}"/><path d="M${x - 3} ${y1}V${y2}" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="${0.25 * o}"/>`;
const beam = (x: number, y: number, w: number, d = 14) =>
  block(x, y, w, 13, d, { face: P.slate, top: P.slateTop, side: P.slateSide, edge: P.slateSide, shadow: false });
const skull = (x: number, y: number, s = 1, c = P.red) => `<g transform="translate(${x} ${y}) scale(${s})" stroke="${c}" color="${c}" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
  <path d="M-10 8L10 15M-10 15L10 8" stroke-width="3.2"/><path d="M-9 -3C-9 -14 9 -14 9 -3Q9 1.5 5 3.5V7H-5V3.5Q-9 1.5 -9 -3Z" fill="${P.paper}"/>
  <ellipse cx="-3.4" cy="-3.2" rx="2.2" ry="2.6" fill="${c}" stroke="none"/><ellipse cx="3.4" cy="-3.2" rx="2.2" ry="2.6" fill="${c}" stroke="none"/><path d="M-1.6 4V7M1.6 4V7"/></g>`;

export const scenes: Record<string, Scene> = {
  'dilemma-cartesian': {
    w: 430, h: 450, seed: 11,
    label: 'Horn one: demanding indubitable foundations. Only one tiny stone qualifies, the platform tips, and the beliefs slide toward skepticism.',
    draw: () => title(22, 30, 'Horn 1 · Descartes', 'Demand the indubitable', P.red)
      + st(0, ground(215, 352, 190, 16)
        + rect(246, 318, 62, 34, 'none', { c: P.dullEdge, w: 1.6, dash: '5 6', single: true }) + doubt(277, 345, 22, P.dullEdge)
        + rect(332, 318, 62, 34, 'none', { c: P.dullEdge, w: 1.6, dash: '5 6', single: true }) + doubt(363, 345, 22, P.dullEdge)
        + stone(52, 312, 62, 40, 14) + star(83, 296, 11))
      + st(1, strut(83, 196, 300)
        + `<g transform="rotate(13 83 196)">${beam(40, 184, 268)}${belief(74, 118, 70, 40)}${belief(170, 118, 70, 40)}</g>`)
      + st(2, `<g transform="rotate(34 330 262)">${belief(296, 232, 70, 40)}</g>` + arrow(352, 300, 372, 372, { c: P.red, bend: -14 }) + skull(372, 396, 1.5))
      + st(3, plate(170, 412, 268, 50, ['Principled — but almost', 'nothing qualifies.'], { size: 16 }) + tag(372, 432, 'Skepticism', P.red)),
  },
  'dilemma-moderate': {
    w: 430, h: 450, seed: 23,
    label: 'Horn two: relaxing the standard. Plenty of stones hold the beliefs up, but each stone is open to doubt, so stopping there looks arbitrary.',
    draw: () => title(22, 30, 'Horn 2 · Moderate foundationalism', 'Relax the standard', P.ochre)
      + st(0, ground(215, 352, 190, 16) + stone(52, 312, 78, 40, 14) + stone(176, 312, 78, 40, 14) + stone(300, 312, 78, 40, 14)
        + txt(91, 384, 'perception', { size: 15, italic: true, fill: P.soft }) + txt(215, 384, 'intuition', { size: 15, italic: true, fill: P.soft }) + txt(339, 384, '…', { size: 15, fill: P.soft }))
      + st(1, strut(91, 190, 300) + strut(215, 190, 300) + strut(339, 190, 300) + beam(40, 178, 344)
        + belief(64, 112, 70, 40) + belief(176, 112, 70, 40) + belief(288, 112, 70, 40))
      + st(2, doubt(112, 292, 30) + doubt(236, 292, 30) + doubt(360, 292, 30))
      + st(3, plate(215, 424, 330, 34, ['Enough — but why stop here?'], { size: 16 })),
  },
};

export function mountScene(host: HTMLElement) {
  const scene = scenes[host.dataset.scene!];
  if (!scene) return;
  reseed(scene.seed);
  host.classList.add('canvas-media', 'scene');
  if (scene.beat) host.style.setProperty('--beat', `${scene.beat}ms`);
  host.insertAdjacentHTML('afterbegin', `<svg class="scene-art" viewBox="0 0 ${scene.w} ${scene.h}" width="${scene.w}" height="${scene.h}" role="img" aria-label="${scene.label.replace(/"/g, '&quot;')}">${scene.draw()}</svg>`);
  // Replay on each visit; leaving never hides what was drawn.
  const replay = () => {
    host.classList.remove('is-playing');
    void host.getBoundingClientRect();
    host.classList.add('is-playing');
  };
  host.addEventListener('pointerenter', replay);
  host.addEventListener('focus', () => { if (host.matches(':focus-visible') && !host.matches(':hover')) replay(); });
}
export const initializeScenes = (root: ParentNode = document) =>
  root.querySelectorAll<HTMLElement>('[data-scene]').forEach(mountScene);
