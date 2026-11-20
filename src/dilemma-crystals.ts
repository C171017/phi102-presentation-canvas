import { lines, txt } from './sketch';
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
