import { P, line, lines, txt } from './sketch';
import './dilemma-crystals.css';

// Use the original illustration’s cut stones, crystal and brass struts.
const supports = [
  { rod: 'upper-left', stone: '<use href="#foundation-back-stone" transform="translate(58 111) scale(.91) translate(-124 -224)"/>', x: 64, y: 131 },
  { rod: 'upper-right', stone: '<use href="#foundation-back-stone" transform="translate(222 111) rotate(-8) scale(.91) translate(-124 -224)"/>', x: 228, y: 131 },
  { rod: 'lower-right', stone: '<g transform="translate(0 48)"><use href="#foundation-artwork" clip-path="url(#foundation-right-cut)"/></g>', x: 236, y: 232 },
  { rod: 'lower-left', stone: '<g transform="translate(-12 61)"><use href="#foundation-artwork" clip-path="url(#foundation-left-cut)"/></g>', x: 55, y: 232 },
] as const;

function rod(id: string) {
  return ['shadow', 'edge', 'body', 'highlight'].map(layer =>
    `<use href="#foundation-rod-${id}" class="crystal-foundations__rod-${layer}"/>`
  ).join('');
}

export function dilemmaCrystal(strict: boolean) {
  const arm = (i: number) => strict && i === 3 ? 'dilemma-pivot' : `dilemma-support support-${i}`;
  const crystal = '<use href="#foundation-artwork" clip-path="url(#foundation-crystal-cut)"/>';
  const shadows = supports.map(({ x, y }, i) =>
    `<ellipse class="${arm(i)}" cx="${x}" cy="${y}" rx="32" ry="10" fill="#614b31" fill-opacity=".15"/>`).join('');
  const rods = supports.map(({ rod: id }, i) =>
    `<g class="${arm(i)}" fill="none" stroke-linecap="round">${rod(id)}</g>`);
  const stones = supports.map(({ stone }, i) => `<g class="${arm(i)}">${stone}</g>`).join('');
  const movingCrystal = strict
    ? rods.slice(0, 3).join('') + `<g class="dilemma-frame">${rods[3]}${crystal}</g>`
    : rods.join('') + crystal;
  return txt(215, 51, strict ? 'Cartesian foundationalism' : 'Moderate foundationalism', { size: 25, weight: 600 })
    + `<g transform="translate(41 65) scale(1.24)" class="${strict ? 'dilemma-strict' : 'dilemma-fallible'}">
        ${shadows}<ellipse cx="153" cy="164" rx="34" ry="13" fill="#614b31" opacity=".13"/>
        ${movingCrystal}${stones}
      </g>`
    + lines(215, 394, strict
      ? ['Too few beliefs are indubitable', 'to support ordinary knowledge.']
      : ['Perception and intuition can be doubted.', 'Why stop the chain of reasons here?'], { size: 18, lh: 24 });
}

// Isolate one support from the dilemma so the change in its role is visible.
export function undoubtedCrystal(context: 'questioned' | 'accepted') {
  const questioned = context === 'questioned';
  const strut = (path: string) => ['edge', 'body', 'highlight'].map(layer =>
    `<path d="${path}" class="crystal-foundations__rod-${layer}"/>`
  ).join('');
  const callout = { size: 16, italic: true, fill: P.soft } as const;
  const labels = questioned
    ? txt(33, 142, '“I locked up today.”', { ...callout, anchor: 'start' })
      + line(179, 138, 253, 156, { c: P.line, w: 1 })
      + line(169, 294, 205, 294, { c: P.line, w: 1 })
      + txt(213, 299, 'Camera timestamp', { ...callout, anchor: 'start' })
    : '';
  return txt(215, 51, questioned ? 'The timestamp is in doubt' : 'The timestamp is accepted', { size: 25, weight: 600 })
    + `<g transform="translate(0 16)"><g class="undoubted-model ${questioned ? 'questioned' : 'accepted'}">
        <ellipse cx="121" cy="319" rx="50" ry="10" fill="#614b31" opacity=".15"/>
        <ellipse cx="281" cy="274" rx="46" ry="10" fill="#614b31" opacity=".10"/>
        <g fill="none" stroke-linecap="round">
          ${strut('M112 275L181 229')}
          <g class="undoubted-claim">
            ${strut('M181 229L259 177')}
            <g transform="translate(259 177) scale(1.24) translate(-139 -121)">
              <use href="#foundation-artwork" clip-path="url(#foundation-crystal-cut)"/>
            </g>
          </g>
        </g>
        <g transform="translate(112 283) scale(1.34) translate(-124 -224)">
          <use href="#foundation-back-stone"/>
        </g>
      </g>`
    + labels + '</g>'
    + '<rect class="undoubted-caption-paper" x="69" y="359" width="292" height="66" rx="6"/>'
    + lines(215, 386, questioned
      ? ['The footage shows me locking up.', 'Was it today?']
      : ['The same footage can settle', 'whether I locked up today.'], { size: 18, lh: 24 });
}
