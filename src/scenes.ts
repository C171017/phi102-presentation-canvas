import { mountKnowledgePipeline } from './knowledge-pipeline';
import { mountApplicationBase, mountApplicationHome, mountOrder } from './application-map';
import { P, line, poly, ground, block, stone, txt, lines, tag, bubble, person, arrow, check, cross, star, plate, st, ring } from './sketch';
import './scenes.css';
import { drawDilemma, mountUndoubtedCairn } from './foundation-scenes';
import { mountReadingCircle } from './reading-circle';
import { castScenes } from './party-train';
import { HINGE_DOOR_LABEL, mountHingeDoor } from './hinge-door';

// Every drawing illustrates Daniel Greco, “Contextualism about Foundations” (2017).
type Scene = { w: number; h: number; beat?: number; label: string } & (
  { draw: () => string } | { mount: (host: HTMLElement) => void }
);
const title = (x: number, y: number, kicker: string, name: string, c = P.soft) =>
  tag(x, y, kicker, c, { anchor: 'start' }) + txt(x, y + 30, name, { size: 23, weight: 600, anchor: 'start' });
/** The canvas's "belief": the slate speech block from the first foundation drawing. */
const belief = (x: number, y: number, w = 78, h = 44, fill = P.slate) =>
  `<path d="M${x + 9} ${y}H${x + w - 9}Q${x + w} ${y} ${x + w} ${y + 9}V${y + h - 9}Q${x + w} ${y + h} ${x + w - 9} ${y + h}H${x + w * 0.46}L${x + w * 0.34} ${y + h + 10}V${y + h}H${x + 9}Q${x} ${y + h} ${x} ${y + h - 9}V${y + 9}Q${x} ${y} ${x + 9} ${y}Z" transform="translate(4 5)" fill="${P.shadow}"/>`
  + `<path d="M${x + 9} ${y}H${x + w - 9}Q${x + w} ${y} ${x + w} ${y + 9}V${y + h - 9}Q${x + w} ${y + h} ${x + w - 9} ${y + h}H${x + w * 0.46}L${x + w * 0.34} ${y + h + 10}V${y + h}H${x + 9}Q${x} ${y + h} ${x} ${y + h - 9}V${y + 9}Q${x} ${y} ${x + 9} ${y}Z" fill="${fill}"/>`
  + `<path d="M${x + 14} ${y + (h < 40 ? h * 0.36 : 15)}H${x + w - 14}M${x + 14} ${y + (h < 40 ? h * 0.66 : 27)}H${x + w - 30}" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".5"/>`;
const strut = (x: number, y1: number, y2: number, c = P.stoneEdge, o = 1) =>
  `<path d="M${x} ${y1}V${y2}" stroke="${c}" stroke-width="11" stroke-linecap="round" opacity="${o}"/><path d="M${x - 3} ${y1}V${y2}" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="${0.25 * o}"/>`;
// Shared vocabulary for the later slides.
const dullFaces = { face: P.dull, top: P.dullTop, side: P.dullSide, edge: P.dullEdge };
const coat = { clay: '#b7793f', sage: '#829b94', dusk: '#5f6f86', plum: '#7d6079' };
const small = { size: 15, italic: true, fill: P.soft };
/** A name with a quieter second line: the kit's two-level label. */
const named = (x: number, y: number, name: string, sub: string, c = P.ink, anchor: 'start' | 'middle' | 'end' = 'middle', size = 19) =>
  txt(x, y, name, { size, weight: 600, fill: c, anchor }) + txt(x, y + size * 1.2, sub, { size: 15, fill: P.soft, anchor });
const dashed = (x1: number, y: number, x2: number) => line(x1, y, x2, y, { c: P.line, w: 1.3, dash: '3 7' });
/** A signpost board pointing right. */
const board = (x: number, y: number, w: number, h: number, fill: string, words: string) =>
  poly([[x, y], [x + w, y], [x + w + 20, y + h / 2], [x + w, y + h], [x, y + h]], fill, { c: P.ink, w: 1.8, shadow: [4, 5] })
  + txt(x + w / 2 + 4, y + h / 2 + 6, words, { size: 18, weight: 600, fill: '#fff' });

export const scenes: Record<string, Scene> = {
  'dilemma-cartesian': {
    w: 430, h: 450,
    label: 'Only indubitable foundations qualify. Three foundation stones become outlines and the upper stone tips off the remaining left support and falls to the right.',
    draw: () => drawDilemma(true),
  },
  'dilemma-moderate': {
    w: 430, h: 450,
    label: 'Fallible foundations such as perception and intuition support a further belief. The four foundations dim and the upper stone wobbles in place.',
    draw: () => drawDilemma(false),
  },

  'undoubted-crystal': {
    w: 580, h: 415,
    label: 'Four beliefs taken for granted in this inquiry support a further belief. Hover to see one mist support buckle and snap in two as its stone splits while the other three continue to hold.',
    mount: mountUndoubtedCairn,
  },

  'route-social-scene': {
    w: 560, h: 450,
    label: 'Five readers gather around a book. When everyone has participated, a gold seal marks the claim as justified in this community.',
    mount: mountReadingCircle,
  },

  'route-social-consensus': {
    w: 560, h: 450,
    label: 'Five readers take one plus one equals three for granted. Everyone accepts the claim, although the sum is two.',
    mount: host => mountReadingCircle(host, 'mistaken'),
  },

  'route-hinges-door': {
    w: 540, h: 450,
    label: HINGE_DOOR_LABEL,
    mount: mountHingeDoor,
  },

  'route-knowledge-scene': {
    w: 900, h: 450,
    label: 'Evan’s invitation, with the unfinished time “8:”, passes through the E = K box.',
    mount: mountKnowledgePipeline,
  },

  ...castScenes,

  'access-principle': {
    w: 518, h: 186, label: 'First-order justification for the belief that the party starts at seven.',
    mount: host => mountOrder(host, false),
  },
  'access-doubt': {
    w: 518, h: 186, label: 'Higher-order justification for believing that this first-order belief is justified.',
    mount: host => mountOrder(host, true),
  },
  'home-weather': {
    w: 376, h: 240, label: 'The glass house holds the evidence that fixes Justine’s grounds in this context.',
    mount: mountApplicationBase,
  },
  'mobile-scene': {
    w: 500, h: 293, label: 'Compare contexts to move the cognitive home between sources of evidence.',
    mount: mountApplicationHome,
  },
};

export function mountScene(host: HTMLElement) {
  const scene = scenes[host.dataset.scene!];
  if (!scene) return;
  host.classList.add('canvas-media', 'scene');
  if ('mount' in scene) { scene.mount(host); return; }
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
