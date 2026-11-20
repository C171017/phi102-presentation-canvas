import { mountApplicationBase, mountApplicationHome, mountOrder } from './application-map';
import { P, line, poly, rect, rrect, ell, ground, block, stone, txt, lines, tag, bubble, person, arrow, check, cross, star, plate, st, ring } from './sketch';
import './scenes.css';
import { dilemmaCrystal, mountUndoubtedCrystal } from './dilemma-crystals';
import { mountReadingCircle } from './reading-circle';
import { mountSignalHarbor } from './signal-harbor';
import { hingeDoor } from './hinge-door';

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
const slateFaces = { face: P.slate, top: P.slateTop, side: P.slateSide, edge: P.slateSide };
const paperFaces = { face: P.paper, top: '#ffffff', side: P.dull, edge: P.ink };
const dullFaces = { face: P.dull, top: P.dullTop, side: P.dullSide, edge: P.dullEdge };
const coat = { clay: '#b7793f', sage: '#829b94', dusk: '#5f6f86', plum: '#7d6079' };
const small = { size: 15, italic: true, fill: P.soft };
/** A name with a quieter second line: the kit's two-level label. */
const named = (x: number, y: number, name: string, sub: string, c = P.ink, anchor: 'start' | 'middle' | 'end' = 'middle', size = 19) =>
  txt(x, y, name, { size, weight: 600, fill: c, anchor }) + txt(x, y + size * 1.2, sub, { size: 15, fill: P.soft, anchor });
const dashed = (x1: number, y: number, x2: number) => line(x1, y, x2, y, { c: P.line, w: 1.3, dash: '3 7' });
/** The cognitive mobile home. (x, y) is where its rear wheel meets the ground. */
const caravan = (x: number, y: number, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">`
  + ground(72, 2, 104, 9)
  + line(140, -30, 176, -22, { w: 3 }) + ell(178, -21, 4, 4, P.ink, { w: 1 })
  + block(-8, -108, 150, 84, 15)
  + rrect(4, -96, 50, 30, 5, P.mist, { c: P.slate, w: 1.6 }) + line(10, -74, 24, -90, { c: '#fff', w: 2 })
  + rrect(92, -94, 34, 66, 4, P.paper, { c: P.stoneEdge, w: 1.6 }) + ell(120, -60, 2.4, 2.4, P.stoneEdge, { w: 1 })
  + line(-6, -50, 86, -50, { c: P.stoneEdge, w: 1.3 })
  + ell(22, -14, 15, 15, P.slate, { w: 2 }) + ell(22, -14, 5, 5, P.dull, { w: 1 })
  + ell(112, -14, 15, 15, P.slate, { w: 2 }) + ell(112, -14, 5, 5, P.dull, { w: 1 })
  + '</g>';
/** A signpost board pointing right. */
const board = (x: number, y: number, w: number, h: number, fill: string, words: string) =>
  poly([[x, y], [x + w, y], [x + w + 20, y + h / 2], [x + w, y + h], [x, y + h]], fill, { c: P.ink, w: 1.8, shadow: [4, 5] })
  + txt(x + w / 2 + 4, y + h / 2 + 6, words, { size: 18, weight: 600, fill: '#fff' });
const badge = (x: number, y: number, digit: string) =>
  ell(x, y, 19, 19, P.slate, { c: P.slateSide, w: 1.6, shadow: [3, 4] }) + txt(x, y + 7, digit, { size: 20, weight: 700, fill: '#fff' });

export const scenes: Record<string, Scene> = {
  'dilemma-cartesian': {
    w: 430, h: 450,
    label: 'Only indubitable foundations qualify. Three stone supports fade and the crystal tips on the one that remains.',
    draw: () => dilemmaCrystal(true),
  },
  'dilemma-moderate': {
    w: 430, h: 450,
    label: 'Fallible foundations such as perception and intuition support the crystal. Each stone fades in turn to show that it can be doubted.',
    draw: () => dilemmaCrystal(false),
  },

  'undoubted-crystal': {
    w: 580, h: 415,
    label: 'A violet crystal rests on four beliefs taken for granted in this inquiry. Hover to see each support questioned in turn.',
    mount: mountUndoubtedCrystal,
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
    label: 'What colour do you see? Hover or focus to lift the door and reveal six colours. He understands English is the fixed assumption on the hinge.',
    draw: hingeDoor,
  },

  'route-knowledge-scene': {
    w: 900, h: 450,
    label: 'Two recipes. E = K (Evidence equals knowledge) plus a flexible view of “knows”, or general foundations plus a sensitivist view of belief, each yield flexible foundationalism. Williamson himself rejects the flexible views.',
    draw: () => {
      const row = (y: number, big: string, sub: string, who: string, extra: string[], whom: string) =>
        block(40, y, 250, 78, 16, slateFaces) + txt(165, y + 34, big, { size: 22, weight: 600, fill: '#fff' }) + txt(165, y + 58, sub, { size: 15, fill: '#dbe5e0' })
        + tag(165, y + 106, who) + txt(326, y + 52, '+', { size: 36, fill: P.soft })
        + block(364, y, 250, 78, 16, paperFaces) + lines(489, y + 34, extra, { size: 17, lh: 23 }) + tag(489, y + 106, whom);
      return tag(165, 38, 'a familiar foundationalism', P.soft) + tag(489, 38, 'an independent, flexible view', P.soft) + tag(790, 38, 'the result', P.ochre)
        + st(0, row(66, 'E = K', '(Evidence equals knowledge)', 'Williamson 2000', ['a flexible view', 'of “knows”'], 'contextualism · SI · relativism'))
        + st(1, row(226, 'General foundations', 'every belief is foundational', 'Harman 2001', ['a “sensitivist” view', 'of belief'], 'Clarke 2013'))
        + st(2, arrow(648, 104, 716, 172, { bend: -16, c: P.line }) + arrow(648, 266, 716, 210, { bend: 16, c: P.line })
          + ring(796, 188, 82, 74, P.ochre) + stone(758, 182, 76, 40, 13) + star(796, 162, 13)
          + lines(796, 296, ['Flexible', 'foundationalism'], { size: 19, weight: 600, fill: P.ochre, lh: 23 }) + txt(796, 346, '“without trying”', small))
        + st(3, plate(327, 402, 540, 32, ['Caveat: Williamson himself rejects the flexible views (n 15)'], { size: 15.5 }));
    },
  },

  'versions-map-scene': {
    w: 900, h: 470,
    label: 'Signal Harbor. Explore how the subject, speaker, assessor and utterance figure in four views of foundational justification.',
    mount: mountSignalHarbor,
  },

  'si-scene': {
    w: 560, h: 450,
    label: 'Annis read as a sensitive invariantist: the believer’s community helps determine which of her beliefs can be taken for granted. The meaning of the attribution stays fixed.',
    draw: () => title(22, 30, 'The believer’s context', 'What would her community challenge?', P.subj)
      + st(0, ring(154, 247, 116, 111, P.subj)
        + person(85, 323, P.subj, { arm: 'hold' }) + stone(146, 291, 84, 40, 13)
        + strut(188, 231, 279) + belief(152, 177, 72, 42) + tag(188, 158, 'her belief', P.subj))
      + st(1, tag(425, 195, 'her community’s norms', P.subj)
        + plate(425, 241, 220, 54, ['Would the relevant audience', 'raise an objection?'], { size: 16 })
        + arrow(305, 240, 277, 240, { c: P.subj }))
      + st(2, lines(425, 305, ['If it passes unchallenged, it', 'can end the chain of reasons.'], { ...small, lh: 21 }))
      + st(3, plate(280, 411, 460, 38, ['The claim stays fixed. Community norms affect its truth.'], { size: 16 })),
  },
  'si-worry': {
    w: 300, h: 450,
    label: 'The worry: if a community treats astrology as unobjectionable, the view counts it foundational, but that does not make it so.',
    draw: () => title(22, 30, 'Annis: a worry', 'Misguided norms', P.red)
      + st(0, ring(150, 232, 124, 92, P.line) + person(92, 304, coat.sage, { s: 0.68 }) + person(150, 298, coat.clay, { s: 0.68 }) + person(208, 304, coat.dusk, { s: 0.68, flip: true }))
      + st(1, bubble(54, 96, 192, 44, ['“Astrology? Fine”'], { tail: 'bl', size: 16 }))
      + st(2, lines(150, 352, ['Nobody here objects, so', 'it counts as foundational'], { size: 15.5, lh: 20 }))
      + st(3, txt(150, 402, '“That doesn’t make it so”', { size: 17, italic: true, weight: 600, fill: P.red }))
      + st(4, tag(150, 432, 'can we call its norms wrong?', P.soft)),
  },

  'hinges-si-scene': {
    w: 760, h: 420,
    label: 'Hinges read through sensitive invariantism. Understanding English can be taken for granted when using a witness’s color report. When the inquiry tests the witness’s English, it is the question to investigate. The same claim about foundational status can change truth as the inquiry changes.',
    draw: () => title(36, 34, 'The believer’s inquiry', 'When can the same belief serve as a hinge?', P.subj)
      + st(0, plate(380, 131, 350, 48, ['The witness understands English'], { size: 19 }))
      + st(1, arrow(293, 164, 191, 213, { c: P.subj }) + arrow(467, 164, 569, 213, { c: P.subj }))
      + st(2, named(191, 252, 'What color does she see?', 'Use the witness’s answer as evidence.', P.subj, 'middle', 23)
        + plate(191, 319, 308, 46, ['Her English is taken for granted'], { size: 17 }))
      + st(3, named(569, 252, 'Does she understand English?', 'Investigate her comprehension.', P.subj, 'middle', 23)
        + plate(569, 319, 308, 46, ['Her English is open to question'], { size: 17 }))
      + st(4, txt(380, 391, 'The inquiry changes whether the belief can serve as a foundation.', { size: 17, weight: 600, fill: P.subj })),
  },

  'ctx-evidence': {
    w: 540, h: 450,
    label: 'Ordinary talk shows judgments of foundationality. “It must be cold outside” marks an inference. “I have a toothache.” “What makes you think that?” “Oh, come on.” marks a belief that needs no support.',
    draw: () => title(22, 30, '“More tricky”', 'Listen to ordinary talk', P.ctx)
      + lines(22, 92, ['“Foundationally justified” is a technical term.', 'Ordinary remarks offer indirect evidence.'], { ...small, anchor: 'start', lh: 19 })
      + st(0, person(58, 222, P.ctx, { s: 0.7 }) + bubble(100, 138, 232, 42, ['“It must be cold outside”'], { tail: 'none', size: 16 }))
      + st(1, arrow(344, 159, 372, 159, { c: P.ochre }) + named(382, 156, 'inferred', 'not foundational', P.ochre, 'start', 17))
      + dashed(30, 240, 510)
      + st(2, person(58, 412, P.ctx, { s: 0.7 }) + bubble(100, 258, 196, 40, ['“I have a toothache”'], { tail: 'none', size: 16 }))
      + st(3, person(492, 412, coat.sage, { s: 0.7, flip: true }) + bubble(212, 310, 240, 40, ['“What makes you think that?”'], { tail: 'none', size: 16, fill: P.dull, color: P.ink }))
      + st(4, bubble(100, 362, 146, 40, ['“Oh, come on”'], { tail: 'none', size: 16 }))
      + st(5, star(270, 380, 10) + named(288, 380, 'needs no support', 'treated as foundational', P.green, 'start', 17)),
  },
  'ctx-criticism': {
    w: 320, h: 450,
    label: 'A speaker outside a community says: they think it is foundationally justified, but they are wrong. The speaker states their own commitment.',
    draw: () => title(22, 30, 'Room for criticism', '“…but they’re wrong”', P.ctx)
      + st(0, ring(206, 158, 100, 66, P.line) + tag(206, 84, 'that community') + stone(176, 112, 60, 32, 10) + star(206, 98, 9)
        + person(160, 212, coat.sage, { s: 0.55 }) + person(252, 212, coat.dusk, { s: 0.55, flip: true }))
      + st(1, person(50, 400, P.ctx, { arm: 'point' }))
      + st(2, bubble(102, 248, 208, 84, ['“They think it’s', 'foundationally justified,', 'but they’re wrong”'], { tail: 'bl', size: 15.5 }))
      + st(3, lines(206, 384, ['= I am not committed', 'to treating it that way'], { size: 15, fill: P.soft, lh: 19 }))
      + st(4, tag(160, 436, 'speaker’s own commitment', P.ctx)),
  },

  'hinges-ctx-scene': {
    w: 760, h: 420,
    label: 'A contextualist hinge view. The same speaker calls the belief that the witness understands English foundationally justified. In one inquiry the claim is about what can be taken for granted when identifying a color. In another it is about what can be taken for granted when testing the witness’s English.',
    draw: () => title(36, 34, 'The speaker’s inquiry', 'Which claim do the same words express?', P.ctx)
      + st(0, person(134, 201, P.ctx, { s: 0.65, arm: 'raise' })
        + bubble(210, 98, 416, 76, ['“My belief that she understands English', 'is foundationally justified.”'], { tail: 'bl', size: 17 }))
      + st(1, arrow(335, 187, 191, 238, { c: P.ctx }) + arrow(474, 187, 569, 238, { c: P.ctx }))
      + st(2, tag(191, 267, 'Identifying the color', P.ctx)
        + plate(191, 318, 308, 68, ['I can take her English for granted', 'when identifying the color.'], { size: 17 }))
      + st(3, tag(569, 267, 'Testing her English', P.ctx)
        + plate(569, 318, 308, 68, ['I can take her English for granted', 'when testing her English.'], { size: 17 }))
      + st(4, txt(380, 391, 'Each utterance makes a claim about a different inquiry.', { size: 17, weight: 600, fill: P.ctx })),
  },

  'disagree-scene': {
    w: 560, h: 450,
    label: '“I’m hungry” and “I’m not hungry” are both true and do not conflict. “That belief is foundationally justified” and “No, it isn’t” look like a real disagreement.',
    draw: () => title(22, 30, 'If each of us describes our own norms…', 'Both right, or really disagreeing?', P.ctx)
      + st(0, person(56, 214, coat.clay, { s: 0.7 }) + person(504, 214, coat.dusk, { s: 0.7, flip: true })
        + bubble(96, 118, 158, 42, ['“I’m hungry”'], { tail: 'none', size: 16 }) + bubble(286, 118, 180, 42, ['“I’m not hungry”'], { tail: 'none', size: 16 }))
      + st(1, check(175, 186, 0.8) + check(376, 186, 0.8) + txt(280, 222, 'both true: no conflict', { size: 16, weight: 600, fill: P.green }))
      + dashed(30, 242, 530)
      + st(2, person(56, 404, coat.clay, { s: 0.7 }) + bubble(96, 268, 214, 60, ['“That belief is', 'foundationally justified”'], { tail: 'none', size: 15.5 }))
      + st(3, person(504, 404, coat.dusk, { s: 0.7, flip: true }) + bubble(332, 276, 134, 42, ['“No, it isn’t”'], { tail: 'none', size: 16 }))
      + st(4, `<path class="sk" d="M322 338L310 358L326 356L314 378" stroke="${P.red}" stroke-width="3.4"/>`
        + txt(280, 410, 'both true?  It looks like real disagreement', { size: 16, weight: 600, fill: P.red })),
  },
  'disagree-exits': {
    w: 300, h: 450,
    label: 'A signpost with three ways out: relativism, expressivism, or the reply that the challenge is overstated. Greco leaves the choice open.',
    draw: () => title(22, 30, 'Under pressure', 'Three ways out')
      + st(0, ground(52, 374, 34, 8) + block(46, 92, 11, 282, 6))
      + st(1, board(62, 104, 176, 40, P.view, 'Relativism') + tag(66, 164, 'MacFarlane 2011', P.soft, { anchor: 'start' }))
      + st(2, board(62, 190, 176, 40, P.expr, 'Expressivism') + tag(66, 250, 'Chrisman 2007', P.soft, { anchor: 'start' }))
      + st(3, board(62, 276, 176, 40, P.faint, 'Overstated?') + tag(66, 336, 'Plunkett & Sundell 2013', P.soft, { anchor: 'start' }))
      + st(4, plate(150, 420, 256, 48, ['Greco leaves it open: the', 'same debate as for “knows”'], { size: 15 })),
  },

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

  'conclusion-points': {
    w: 600, h: 450,
    label: 'Three takeaways: keep the foundations but let them vary with context; a family of views with criticism and disagreement as pressure points; and (Access) without a Cartesian cognitive home.',
    draw: () => st(0, badge(40, 76, '1') + ring(124, 78, 50, 40, P.ochre) + stone(98, 72, 52, 28, 10) + star(124, 54, 10)
        + named(196, 72, 'Keep the foundations; let them vary', 'Undoubted here, not undoubtable everywhere', P.ink, 'start', 20))
      + st(1, dashed(30, 148, 570) + badge(40, 222, '2')
        + person(92, 250, P.subj, { s: 0.46 }) + person(114, 250, P.ctx, { s: 0.46 }) + person(136, 250, P.view, { s: 0.46 }) + person(158, 250, P.expr, { s: 0.46 })
        + named(196, 218, 'One idea, a family of views', 'Pressure points: criticism and disagreement', P.ink, 'start', 20))
      + st(2, dashed(30, 294, 570) + badge(40, 368, '3') + caravan(86, 392, 0.52)
        + named(196, 364, '(Access) without a Cartesian home', 'A cognitive home that moves with the context', P.ink, 'start', 20)),
  },
  'conclusion-scope': {
    w: 260, h: 450,
    label: 'What the chapter sets aside: which version is right, a full defence of contextualized (Access), and views that reject chains of reasons.',
    draw: () => st(0, `<g transform="rotate(-1.6 130 225)">`
        + rect(16, 44, 228, 368, P.paper, { c: P.ink, w: 1.8, shadow: [6, 7] })
        + rect(98, 30, 64, 24, '#ecd9a8', { c: '#c9a85a', w: 1, fo: 0.85 })
        + tag(130, 88, 'What the chapter', P.ochre) + tag(130, 108, 'sets aside', P.ochre) + dashed(40, 126, 220)
        + '</g>')
      + st(1, `<g transform="rotate(-1.6 130 225)">` + lines(130, 164, ['Which version is right', '(the same debate as “knows”)'], { size: 15.5, lh: 21 }) + dashed(70, 208, 190) + '</g>')
      + st(2, `<g transform="rotate(-1.6 130 225)">` + lines(130, 244, ['A full defence of', 'contextualized (Access)'], { size: 15.5, lh: 21 }) + dashed(70, 288, 190) + '</g>')
      + st(3, `<g transform="rotate(-1.6 130 225)">` + lines(130, 324, ['Views without chains', 'of reasons (n 1)'], { size: 15.5, lh: 21 }) + '</g>'),
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
