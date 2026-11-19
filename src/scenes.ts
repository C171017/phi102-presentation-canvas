import { P, line, poly, rect, rrect, ell, ground, block, stone, txt, lines, tag, bubble, person, arrow, check, cross, doubt, star, plate, st, ring } from './sketch';
import './scenes.css';

// Every drawing illustrates Daniel Greco, “Contextualism about Foundations” (2017).
type Scene = { w: number; h: number; beat?: number; label: string; draw: () => string };
const title = (x: number, y: number, kicker: string, name: string, c = P.soft) =>
  tag(x, y, kicker, c, { anchor: 'start' }) + txt(x, y + 30, name, { size: 23, weight: 600, anchor: 'start' });
/** The canvas's "belief": the slate speech block from the first foundation drawing. */
const belief = (x: number, y: number, w = 78, h = 44, fill = P.slate) =>
  `<path d="M${x + 9} ${y}H${x + w - 9}Q${x + w} ${y} ${x + w} ${y + 9}V${y + h - 9}Q${x + w} ${y + h} ${x + w - 9} ${y + h}H${x + w * 0.46}L${x + w * 0.34} ${y + h + 10}V${y + h}H${x + 9}Q${x} ${y + h} ${x} ${y + h - 9}V${y + 9}Q${x} ${y} ${x + 9} ${y}Z" transform="translate(4 5)" fill="${P.shadow}"/>`
  + `<path d="M${x + 9} ${y}H${x + w - 9}Q${x + w} ${y} ${x + w} ${y + 9}V${y + h - 9}Q${x + w} ${y + h} ${x + w - 9} ${y + h}H${x + w * 0.46}L${x + w * 0.34} ${y + h + 10}V${y + h}H${x + 9}Q${x} ${y + h} ${x} ${y + h - 9}V${y + 9}Q${x} ${y} ${x + 9} ${y}Z" fill="${fill}"/>`
  + `<path d="M${x + 14} ${y + (h < 40 ? h * 0.36 : 15)}H${x + w - 14}M${x + 14} ${y + (h < 40 ? h * 0.66 : 27)}H${x + w - 30}" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".5"/>`;
const strut = (x: number, y1: number, y2: number, c = P.stoneEdge, o = 1) =>
  `<path d="M${x} ${y1}V${y2}" stroke="${c}" stroke-width="11" stroke-linecap="round" opacity="${o}"/><path d="M${x - 3} ${y1}V${y2}" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="${0.25 * o}"/>`;
const beam = (x: number, y: number, w: number, d = 14) =>
  block(x, y, w, 13, d, { face: P.slate, top: P.slateTop, side: P.slateSide, edge: P.slateSide, shadow: false });
const skull = (x: number, y: number, s = 1, c = P.red) => `<g transform="translate(${x} ${y}) scale(${s})" stroke="${c}" color="${c}" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
  <path d="M-10 8L10 15M-10 15L10 8" stroke-width="3.2"/><path d="M-9 -3C-9 -14 9 -14 9 -3Q9 1.5 5 3.5V7H-5V3.5Q-9 1.5 -9 -3Z" fill="${P.paper}"/>
  <ellipse cx="-3.4" cy="-3.2" rx="2.2" ry="2.6" fill="${c}" stroke="none"/><ellipse cx="3.4" cy="-3.2" rx="2.2" ry="2.6" fill="${c}" stroke="none"/><path d="M-1.6 4V7M1.6 4V7"/></g>`;

// Shared vocabulary for the later slides.
const slateFaces = { face: P.slate, top: P.slateTop, side: P.slateSide, edge: P.slateSide };
const paperFaces = { face: P.paper, top: '#ffffff', side: P.dull, edge: P.ink };
const dullFaces = { face: P.dull, top: P.dullTop, side: P.dullSide, edge: P.dullEdge };
const glassFaces = { face: '#e6eeea', top: '#f2f6f3', side: '#cddad3', edge: P.slate };
const coat = { clay: '#b7793f', sage: '#829b94', dusk: '#5f6f86', plum: '#7d6079' };
const small = { size: 15, italic: true, fill: P.soft };
/** A name with a quieter second line: the kit's two-level label. */
const named = (x: number, y: number, name: string, sub: string, c = P.ink, anchor: 'start' | 'middle' | 'end' = 'middle', size = 19) =>
  txt(x, y, name, { size, weight: 600, fill: c, anchor }) + txt(x, y + size * 1.2, sub, { size: 15, fill: P.soft, anchor });
const dashed = (x1: number, y: number, x2: number) => line(x1, y, x2, y, { c: P.line, w: 1.3, dash: '3 7' });
/** Moves from `from` px to its drawn place on beat `i`, and stays there. */
const mv = (i: number, from: number, ...markup: string[]) => `<g class="mv" style="--i:${i};--from:${from}px">${markup.join('')}</g>`;
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
    label: 'Horn one: demanding indubitable foundations. Only one tiny stone qualifies, the platform tips, and the beliefs slide toward skepticism.',
    draw: () => title(22, 30, 'Horn 1 · Descartes', 'Demand the indubitable', P.red)
      + st(0, ground(215, 352, 190, 16)
        + rect(246, 318, 62, 34, 'none', { c: P.dullEdge, w: 1.6, dash: '5 6' }) + doubt(277, 345, 22, P.dullEdge)
        + rect(332, 318, 62, 34, 'none', { c: P.dullEdge, w: 1.6, dash: '5 6' }) + doubt(363, 345, 22, P.dullEdge)
        + stone(52, 312, 62, 40, 14) + star(83, 296, 11))
      + st(1, strut(83, 196, 300)
        + `<g transform="rotate(13 83 196)">${beam(40, 184, 268)}${belief(74, 118, 70, 40)}${belief(170, 118, 70, 40)}</g>`)
      + st(2, `<g transform="rotate(34 330 262)">${belief(296, 232, 70, 40)}</g>` + arrow(352, 300, 372, 372, { c: P.red, bend: -14 }) + skull(372, 396, 1.5))
      + st(3, plate(170, 412, 268, 50, ['Principled — but almost', 'nothing qualifies'], { size: 16 }) + tag(372, 432, 'Skepticism', P.red)),
  },
  'dilemma-moderate': {
    w: 430, h: 450,
    label: 'Horn two: relaxing the standard. Plenty of stones hold the beliefs up, but each stone is open to doubt, so stopping there looks arbitrary.',
    draw: () => title(22, 30, 'Horn 2 · Moderate foundationalism', 'Relax the standard', P.ochre)
      + st(0, ground(215, 352, 190, 16)
        + `<g class="provisional-foundations">${stone(52, 312, 78, 40, 14) + stone(176, 312, 78, 40, 14) + stone(300, 312, 78, 40, 14)}</g>`
        + txt(91, 384, 'perception', small) + txt(215, 384, 'intuition', small) + txt(339, 384, '…', { size: 15, fill: P.soft }))
      + st(1, strut(91, 190, 300) + strut(215, 190, 300) + strut(339, 190, 300) + beam(40, 178, 344)
        + belief(64, 112, 70, 40) + belief(176, 112, 70, 40) + belief(288, 112, 70, 40))
      + st(3, plate(215, 424, 330, 34, ['Enough — but why stop here?'], { size: 16 })),
  },

  'undoubted-logic': {
    w: 430, h: 450,
    label: 'A reason that is itself in doubt leaves the belief it supports in doubt. A reason that is not doubted settles it.',
    draw: () => title(22, 30, 'The Cartesian insight', 'Doubt can’t settle doubt', P.slate)
      + st(0, stone(46, 138, 84, 44, 13) + doubt(88, 124, 30) + txt(88, 214, 'reason Q', small))
      + st(1, arrow(154, 160, 234, 160) + tag(193, 146, 'supports') + belief(250, 136, 84, 46) + txt(292, 214, 'belief P', small) + doubt(368, 172, 30))
      + st(2, txt(215, 246, 'Q in doubt → P still in doubt', { size: 16.5, weight: 600, fill: P.red }))
      + dashed(40, 268, 390)
      + st(3, stone(46, 302, 84, 44, 13) + star(88, 284, 12) + txt(88, 378, 'reason Q', small))
      + st(4, arrow(154, 324, 234, 324) + tag(193, 310, 'supports') + belief(250, 300, 84, 46) + txt(292, 378, 'belief P', small) + check(368, 324, 1.15))
      + st(5, txt(215, 410, 'Q undoubted → P settled', { size: 16.5, weight: 600, fill: P.green })),
  },
  'undoubted-standards': {
    w: 430, h: 450,
    label: 'Three standards for a foundation. Descartes: undoubtable, so too few. Moderate: doubtable, so arbitrary. Flexible: undoubted in this context.',
    draw: () => {
      const column = (cx: number, who: string, c: string, name: string, verdict: string[]) =>
        tag(cx, 104, who, c) + block(cx - 46, 226, 92, 20, 13, dullFaces)
        + txt(cx, 282, name, { size: 16.5, weight: 600 }) + lines(cx, 306, verdict, { size: 15, fill: c, lh: 19 });
      return title(22, 30, 'The flexible move', 'Undoubted — in this context', P.green)
        + st(0, column(78, 'Descartes', P.red, 'undoubtable', ['too few:', 'skepticism']) + stone(54, 196, 48, 28, 10) + star(78, 180, 10))
        + st(1, column(215, 'Moderate', P.ochre, 'doubtable', ['stopping point', 'looks arbitrary']) + stone(179, 186, 72, 38, 12) + doubt(215, 174, 28))
        + st(2, ring(352, 196, 66, 62, P.green) + column(352, 'Flexible', P.green, 'undoubted here', ['free from doubt', 'where it is used']) + stone(316, 186, 72, 38, 12) + star(352, 166, 12))
        + st(3, plate(215, 396, 372, 60, ['“They needn’t be undoubtable,', 'but they must be undoubted”'], { size: 17, italic: true }));
    },
  },

  'route-social-scene': {
    w: 560, h: 450,
    label: 'A speaker gives a reason to an audience. The appropriate objector-group raises no objection, so the reason is foundational in this context. A toddler keeps asking why.',
    draw: () => title(22, 30, 'Annis 1978', 'Reasons are given to an audience')
      + st(0, person(78, 350, P.slate, { arm: 'point' }) + bubble(26, 130, 178, 54, ['“P, because Q”'], { tail: 'bl' }))
      + st(1, ring(446, 292, 108, 92, P.line) + tag(446, 186, 'objector-group')
        + person(396, 350, coat.sage, { flip: true }) + person(448, 342, coat.clay, { flip: true }) + person(500, 350, coat.dusk, { flip: true }))
      + st(2, bubble(330, 92, 176, 48, ['“No objection”'], { tail: 'br' }) + stone(238, 306, 76, 40, 13) + star(276, 288, 12)
        + lines(276, 372, ['Q passes', 'unchallenged'], { ...small, lh: 18 }))
      + st(3, person(170, 354, '#c98b6b', { s: 0.55 }) + bubble(150, 246, 80, 36, ['why?'], { tail: 'bl', size: 15, italic: true, shadow: false }))
      + st(4, plate(280, 430, 452, 32, ['Reasons stop where the audience stops objecting'], { size: 15.5 })),
  },
  'route-social-worry': {
    w: 300, h: 450,
    label: 'A worry: a whole community might wrongly take a claim for granted, and the view would still call it foundational.',
    draw: () => title(22, 30, 'Worry', 'Too subjectivist?', P.red)
      + st(0, ring(150, 218, 124, 100, P.line) + stone(114, 146, 72, 38, 12) + star(150, 128, 11)
        + person(92, 296, coat.sage, { s: 0.68 }) + person(150, 290, coat.clay, { s: 0.68 }) + person(208, 296, coat.dusk, { s: 0.68, flip: true }))
      + st(1, check(92, 196, 0.8) + check(150, 196, 0.8) + check(208, 196, 0.8))
      + st(2, doubt(268, 120, 44))
      + st(3, lines(150, 352, ['Nobody objects But could', 'they all be wrong to', 'take it for granted?'], { size: 16, lh: 21 }))
      + st(4, plate(150, 428, 236, 30, ['Returns under ② Versions'], { size: 15 })),
  },

  'route-hinges-door': {
    w: 540, h: 450,
    label: 'A door, the open question “What colour do you see?”, turns on three hinges that stay fixed: he understands English, he is not deceiving me, my memory for colour names works.',
    draw: () => {
      const hinge = (y: number, words: string[]) =>
        lines(226, y - 4, words, { size: 16, anchor: 'end', lh: 20 }) + line(234, y, 254, y, { c: P.line, w: 1.4 })
        + rrect(254, y - 13, 34, 26, 4, P.slate, { c: P.slateSide, w: 1.5, shadow: [3, 3] }) + star(271, y, 7.5);
      return title(22, 30, 'Wittgenstein · On Certainty §§341, 345', 'Questions turn on hinges')
        + st(0, block(262, 92, 14, 312, 8) + ground(384, 400, 116, 9))
        + st(1, tag(226, 110, 'exempt from doubt', P.soft, { anchor: 'end' })
          + hinge(152, ['he understands', 'English']) + hinge(246, ['he isn’t out to', 'deceive me']) + hinge(340, ['my memory for', 'colour names holds']))
        + st(2, poly([[290, 110], [484, 88], [484, 400], [290, 378]], P.paper, { shadow: [9, 8] })
          + poly([[308, 134], [466, 116], [466, 262], [308, 262]], 'none', { c: P.line, w: 1.3 })
          + ell(464, 290, 6, 7, P.gold, { c: '#c9952a', w: 1.4 })
          + tag(387, 160, 'the open question') + lines(387, 196, ['“What colour', 'do you see?”'], { size: 19, italic: true, lh: 25 }) + doubt(387, 340, 54, P.slate))
        + st(3, plate(270, 433, 430, 28, ['To ask one question, others must stay closed'], { size: 15.5 }));
    },
  },
  'route-hinges-swap': {
    w: 320, h: 450,
    label: 'The same proposition can be a fixed hinge in one inquiry and the thing tested in another. Every inquiry needs some hinges; this does not entail one fixed set for every inquiry.',
    draw: () => title(22, 30, 'Flexible, not fixed', 'Hinges can swap', P.green)
      + st(0, ring(160, 142, 132, 46, P.green) + belief(52, 121, 66, 38) + tag(196, 132, 'one inquiry', P.green) + txt(184, 158, 'a hinge', { size: 17, weight: 600 }) + star(232, 152, 9))
      + st(1, arrow(160, 194, 160, 234, { c: P.line }) + txt(172, 220, 'same proposition', { ...small, anchor: 'start' }))
      + st(2, ring(160, 288, 132, 46, P.ochre) + belief(52, 267, 66, 38) + tag(196, 278, 'another', P.ochre) + txt(190, 304, 'under test', { size: 17, weight: 600 }) + doubt(250, 308, 24, P.slate))
      + st(3, check(34, 374, 0.8) + txt(54, 380, 'Each inquiry has some hinges', { size: 15.5, anchor: 'start' }))
      + st(4, txt(34, 416, '↛', { size: 24, fill: P.ochre }) + txt(54, 416, 'One fixed set for all inquiries', { size: 15.5, anchor: 'start' })),
  },

  'route-knowledge-scene': {
    w: 900, h: 450,
    label: 'Two recipes. E equals K plus a flexible view of “knows”, or general foundations plus a sensitivist view of belief, each yield flexible foundationalism. Williamson himself rejects the flexible views.',
    draw: () => {
      const row = (y: number, big: string, sub: string, who: string, extra: string[], whom: string) =>
        block(40, y, 250, 78, 16, slateFaces) + txt(165, y + 34, big, { size: 22, weight: 600, fill: '#fff' }) + txt(165, y + 58, sub, { size: 15, fill: '#dbe5e0' })
        + tag(165, y + 106, who) + txt(326, y + 52, '+', { size: 36, fill: P.soft })
        + block(364, y, 250, 78, 16, paperFaces) + lines(489, y + 34, extra, { size: 17, lh: 23 }) + tag(489, y + 106, whom);
      return tag(165, 38, 'a familiar foundationalism', P.soft) + tag(489, 38, 'an independent, flexible view', P.soft) + tag(790, 38, 'the result', P.ochre)
        + st(0, row(66, 'E = K', 'all knowledge is foundation', 'Williamson 2000', ['a flexible view', 'of “knows”'], 'contextualism · SI · relativism'))
        + st(1, row(226, 'General foundations', 'every belief is foundational', 'Harman 2001', ['a “sensitivist” view', 'of belief'], 'Clarke 2013'))
        + st(2, arrow(648, 104, 716, 172, { bend: -16, c: P.line }) + arrow(648, 266, 716, 210, { bend: 16, c: P.line })
          + ring(796, 188, 82, 74, P.ochre) + stone(758, 182, 76, 40, 13) + star(796, 162, 13)
          + lines(796, 296, ['Flexible', 'foundationalism'], { size: 19, weight: 600, fill: P.ochre, lh: 23 }) + txt(796, 346, '“without trying”', small))
        + st(3, plate(327, 402, 540, 32, ['Caveat: Williamson himself rejects the flexible views (n 15)'], { size: 15.5 }));
    },
  },

  'versions-map-scene': {
    w: 900, h: 470,
    label: 'A subject holds a belief; a speaker says “S’s belief is foundationally justified”; an assessor judges that claim. Sensitive invariantism looks to the subject, contextualism to the speaker, relativism to the assessor, expressivism to the commitment expressed.',
    draw: () => st(0, ring(150, 262, 108, 104, P.subj) + tag(150, 146, 'Subject', P.subj) + person(128, 332, P.subj, { arm: 'hold' }) + belief(152, 196, 66, 38))
      + st(1, ring(450, 262, 108, 104, P.ctx) + tag(520, 146, 'Speaker', P.ctx) + person(450, 332, P.ctx, { arm: 'raise' })
        + bubble(330, 44, 250, 66, ['“S’s belief is', 'foundationally justified”'], { tail: 'bl', size: 16.5 })
        + arrow(352, 232, 250, 220, { c: P.line, dash: '5 6', bend: 10 }))
      + st(2, ring(750, 262, 108, 104, P.view) + tag(778, 146, 'Assessor', P.view) + person(750, 332, P.view, { arm: 'chin', flip: true })
        + arrow(690, 196, 590, 98, { c: P.view, dash: '5 6', bend: 22 }) + txt(652, 170, 'true?', { ...small, fill: P.view, anchor: 'end' }))
      + st(3, rrect(318, 32, 274, 90, 22, 'none', { c: P.expr, w: 2.4, dash: '2 8' }))
      + st(4, named(150, 412, 'Sensitive invariantism', 'the subject’s situation', P.subj) + named(450, 412, 'Contextualism', 'the speaker’s context', P.ctx)
        + named(750, 412, 'Relativism', 'the assessor’s context', P.view) + named(612, 64, 'Expressivism', 'the commitment it expresses', P.expr, 'start')),
  },

  'si-scene': {
    w: 560, h: 450,
    label: 'Sensitive invariantism: the meaning is fixed, and facts about the subject, such as stakes, community norms and current inquiries, help settle whether her belief is foundationally justified.',
    draw: () => {
      const factor = (y: number, words: string, note: string) =>
        plate(442, y, 188, 38, [words], { size: 16 }) + tag(442, y + 38, note, P.soft) + arrow(340, y, 304, 250 + (y - 250) * 0.3, { c: P.subj });
      return title(22, 30, '“The most straightforward”', 'Her situation helps decide', P.subj)
        + st(0, ring(170, 258, 136, 122, P.subj) + person(92, 352, P.subj, { arm: 'hold' }) + stone(170, 312, 84, 40, 13) + strut(212, 244, 300) + belief(176, 190, 72, 42)
          + tag(212, 172, 'foundational?', P.subj))
        + st(1, tag(442, 112, 'facts about the subject', P.subj) + factor(148, 'practical stakes', 'as with “knows”'))
        + st(2, factor(238, 'community norms', 'Annis'))
        + st(3, factor(328, 'current inquiries', 'hinges'))
        + st(4, plate(280, 428, 420, 32, ['The meaning stays fixed; the status moves'], { size: 15.5 }));
    },
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

  'ctx-evidence': {
    w: 540, h: 450,
    label: 'Ordinary talk shows judgments of foundationality. “It must be cold outside” marks an inference. “I have a toothache.” “What makes you think that?” “Oh, come on.” marks a belief that needs no support.',
    draw: () => title(22, 30, '“More tricky”', 'Listen to ordinary talk', P.ctx)
      + lines(22, 92, ['“Foundationally justified” is a technical term:', 'little everyday usage to test Look elsewhere'], { ...small, anchor: 'start', lh: 19 })
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
    w: 430, h: 450,
    label: 'Access says that if Justine has grounds to believe the party starts at seven, she also has grounds to believe she is justified in believing it starts at seven.',
    draw: () => title(22, 30, 'Strong access internalism', 'Justine has grounds to believe…', P.slate)
      + st(0, tag(53, 110, 'First-order · J(P)', P.slate, { anchor: 'start' })
        + block(52, 128, 323, 61, 11, slateFaces)
        + txt(213, 166, '“The party starts at 7.”', { size: 22, fill: '#fff' }))
      + st(1, arrow(82, 203, 82, 267, { c: P.slate, bend: 10 })
        + txt(104, 242, 'Access says this follows', { size: 19, italic: true, anchor: 'start' }))
      + st(2, tag(53, 294, 'Higher-order · J(J(P))', P.slate, { anchor: 'start' })
        + block(52, 312, 323, 86, 11, slateFaces)
        + lines(213, 348, ['“I’m justified in believing', 'the party starts at 7.”'], { size: 21, lh: 27, fill: '#fff' })),
  },
  'access-doubt': {
    w: 430, h: 450,
    label: 'A doubt about whether my evidence supports a claim leaks down into doubt about the claim itself. So without (Access), a subject could treat a claim as a regress-stopper while doubting it.',
    draw: () => title(22, 30, 'One motivation', 'Doubt leaks downward', P.red)
      + st(0, tag(70, 92, 'higher-order', P.soft, { anchor: 'start' })
        + block(70, 112, 250, 62, 15, paperFaces) + lines(195, 139, ['“Does my evidence', 'really support it?”'], { size: 15.5, italic: true, lh: 20 }))
      + st(1, doubt(356, 158, 40))
      + st(2, arrow(195, 182, 195, 232, { c: P.red }) + doubt(216, 204, 18) + doubt(176, 222, 14))
      + st(3, tag(70, 232, 'first-order', P.soft, { anchor: 'start' })
        + block(70, 252, 250, 62, 15, slateFaces) + lines(195, 279, ['“Organic food has', 'health benefits”'], { size: 15.5, italic: true, lh: 20, fill: '#fff' }))
      + st(4, doubt(356, 298, 40))
      + st(5, plate(215, 392, 384, 56, ['Without (Access): a claim treated as a', 'regress-stopper, yet doubted by its owner'], { size: 15.5 })),
  },

  'home-weather': {
    w: 430, h: 450,
    label: 'A forecaster says it will be sunny while it rains. With the weather, the truth can outrun our justification; (Access) seems to need a realm where evidence never misleads.',
    draw: () => title(22, 30, 'The catch', 'Evidence can mislead', P.view)
      + st(0, person(110, 356, P.slate, { arm: 'raise' }) + bubble(34, 130, 150, 50, ['“Sunny”'], { tail: 'bl', size: 17 }) + tag(110, 384, 'our evidence'))
      + st(1, ell(276, 168, 40, 26, '#dfe5e4', { c: P.soft, w: 1.8 }) + ell(352, 172, 38, 24, '#dfe5e4', { c: P.soft, w: 1.8 }) + ell(314, 152, 46, 32, '#dfe5e4', { c: P.soft, w: 1.8 })
        + `<ellipse cx="314" cy="176" rx="60" ry="17" fill="#dfe5e4"/>`)
      + st(2, [0, 1, 2, 3, 4].map(i => line(272 + i * 22, 210, 260 + i * 22, 250, { c: P.view, w: 2 }) + line(282 + i * 22, 268, 270 + i * 22, 308, { c: P.view, w: 2 })).join('')
        + ground(312, 348, 70, 9) + tag(312, 384, 'the facts', P.view))
      + st(3, plate(215, 420, 330, 52, ['(Access) seems to need a realm', 'where evidence never misleads'], { size: 15.5 })),
  },
  'home-cartesian': {
    w: 430, h: 450,
    label: 'A glass house in which nothing is hidden: the “cognitive home” that (Access) seems to require, which looks like Cartesian foundationalism again. If Peter mumbled, how could Justine tell what his words give her grounds to believe?',
    draw: () => title(22, 30, 'Smithies 2012 · Williamson’s phrase', 'A cognitive home?', P.red)
      + '<g transform="translate(44 -2) scale(.8)">'
      + st(0, ground(215, 346, 150, 13) + block(104, 196, 200, 148, 22, glassFaces)
        + poly([[316, 196], [338, 184], [226, 102], [204, 114]], '#dbe6e0', { c: P.slate, w: 2 })
        + poly([[92, 196], [204, 114], [316, 196]], '#f2f6f3', { c: P.slate, w: 2 })
        + line(118, 214, 142, 262, { c: '#fff', w: 3 }) + line(132, 210, 148, 242, { c: '#fff', w: 2 }))
      + st(1, person(156, 338, P.slate, { s: 0.74 }) + belief(206, 222, 58, 32) + belief(228, 272, 58, 32) + check(280, 238, 0.7) + check(302, 288, 0.7))
      + st(2, tag(204, 374, 'nothing hidden · found by introspection', P.slate))
      + '</g>'
      + st(3, plate(215, 382, 398, 110, ['Suppose Peter said “7” but mumbled.', 'If his words still fix what Justine should', 'believe, how could she tell what she', 'has grounds to believe?'], { size: 17, lh: 22 })),
  },

  'mobile-scene': {
    w: 900, h: 470, beat: 750,
    label: 'Flexible foundationalism, upper right: a change of context can shift the local supervenience base. That base fixes first-order justification. At left, Access internalism says first-order justification guarantees higher-order justification in that context. If Peter mumbled, his remembered email can take the place of his words as the accessible base.',
    draw: () => {
      const concept = { size: 26, weight: 600, anchor: 'start' } as const;
      const relation = { size: 21, italic: true };
      const example = { size: 18, anchor: 'start', fill: P.soft } as const;
      return txt(883, 50, 'Flexible foundationalism', { ...concept, anchor: 'end' })
        + arrow(640, 65, 572, 122, { c: P.green, head: 14 })
        + txt(650, 104, 'shifts', { ...relation, fill: P.green })
        + txt(362, 153, 'Supervenience base', concept)
        + txt(470, 183, 'Justine heard Peter say “7.”', example)
        + st(2, txt(470, 211, 'If he mumbled, she remembers “7” from his email.', example))
        + mv(2, -48, caravan(397, 208, .32))
        + '<g class="base-fixes-arrow">' + arrow(405, 216, 311, 261, { c: P.green, head: 13 }) + '</g>'
        + txt(390, 251, 'fixes', { ...relation, fill: P.green })
        + ell(266, 283, 68, 32, P.paper, { c: P.slate, w: 3 })
        + txt(266, 290, 'First-order', { size: 19, weight: 600 })
        + txt(363, 290, 'I have grounds to believe the party starts at 7.', example)
        + txt(21, 323, 'Access Int.', { ...concept, size: 23 })
        + arrow(155, 317, 178, 311, { c: P.slate })
        + arrow(199, 283, 199, 377, { c: P.slate, bend: 40, head: 13 })
        + txt(266, 344, 'guarantees', { ...relation, fill: P.slate })
        + ell(266, 395, 73, 41, P.paper, { c: P.slate, w: 2 })
        + lines(266, 391, ['Higher', 'order'], { size: 22, lh: 24, weight: 600 })
        + lines(363, 388, ['I have grounds to believe I’m justified', 'in believing the party starts at 7.'], { ...example, lh: 23 });
    },
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
