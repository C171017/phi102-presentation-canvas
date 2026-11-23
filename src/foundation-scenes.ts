import { drawCairn } from './foundation-cairn';
import brickArt from './assets/foundations/brick.webp';
import townArt from './assets/foundations/town.webp';
import { lines, txt } from './sketch';
import './foundation-scenes.css';

/** Both schools face the same question. Their ink responds differently. */
export function mountDilemma(host: HTMLElement, strict: boolean) {
  const name = strict ? 'Cartesian foundationalism' : 'Moderate foundationalism';
  const subject = strict ? 'brick' : 'town';
  const rule = strict ? 'Dry only what cannot be doubted.' : 'Dry whatever seems true.';
  const caption = strict
    ? ['Ten thousand Cartesians. Three hundred years.', 'One indubitable brick.']
    : ['A whole town in one afternoon.', 'Its foundations are only half dry.'];
  const result = strict ? 'The brick holds. One brick cannot support a world.'
    : 'The half-dry town wobbles and slumps into a puddle.';
  const artwork = strict
    ? `<image class="ink-brick" href="${brickArt}" x="107" y="156" width="216" height="120"/>`
    : `<image class="ink-town" href="${townArt}" x="42" y="114" width="346" height="194"/>`;
  host.insertAdjacentHTML('afterbegin', `<svg class="scene-art ink-dilemma ink-dilemma-${subject}"
    viewBox="0 0 430 450" width="430" height="450" role="img" aria-label="${name}. ${rule} ${result}">
    ${txt(215, 49, name, { size: 25, weight: 600 })}
    ${txt(215, 81, rule, { size: 15, italic: true, fill: '#63594d' })}
    <g class="ink-puddle" aria-hidden="true">
      <path fill="#171a2b" d="M53 311c3-8 29-9 57-11 24-2 19-7 54-6 28 1 32 4 65 2 41-3 53 0 75 5 20 4 77 1 74 10-3 9-65 8-103 9-36 1-47 6-86 4-31-1-45-5-77-5-35 0-64-2-59-8Z"/>
      <path fill="none" stroke="#c6a772" stroke-linecap="round" stroke-width="2" d="M82 310q26-4 47-4m153 9q44 2 66-3"/>
    </g>
    ${artwork}
    <g class="ink-question" aria-hidden="true">
      <path fill="#202635" d="M333 94c-15 0-26 9-26 22 0 9 5 15 14 19l-6 13 16-11c16 0 28-8 28-22 0-13-11-21-26-21Z"/>
      ${txt(333, 125, '?', { size: 26, weight: 600, fill: '#f8e3ab' })}
    </g>
    ${lines(215, 354, caption, { size: 17, lh: 24 })}
  </svg>
  <span class="ink-result" role="status"></span>`);
  const svg = host.querySelector<SVGSVGElement>('.ink-dilemma')!;
  const status = host.querySelector<HTMLElement>('.ink-result')!;
  const replay = () => {
    svg.classList.remove('ink-questioned');
    void svg.getBoundingClientRect();
    svg.classList.add('ink-questioned');
    status.textContent = result;
  };
  host.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') replay(); });
  host.addEventListener('focus', () => { if (host.matches(':focus-visible')) replay(); });
  svg.addEventListener('click', replay);
}

export function mountUndoubtedCairn(host: HTMLElement) {
  host.insertAdjacentHTML('afterbegin', `<svg class="scene-art inquiry-cairn" width="580" height="415"
    viewBox="0 0 580 415" role="button" tabindex="0"
    aria-label="Four foundations support a belief. Hover, tap or press Enter to see the front stone split and its mist buckle and snap in two.">
    <g transform="translate(80 0) scale(1.5)">${drawCairn('undoubted-cairn')}</g>
  </svg>`);
  const art = host.querySelector<SVGSVGElement>('.inquiry-cairn')!;
  const front = art.querySelector('[data-foundation-corner="lower-right"]')!;
  const mist = front.querySelector<SVGPathElement>('.cairn-full-mist')!;
  // The two closed ribbons share the same edge until the instant of rupture.
  const ribbons = [
    {
      intact: 'M182 145 C161 120 136 108 149 68 C127 103 144 127 164 148Z',
      bent:   'M208 148 C186 136 126 122 149 68 C116 121 170 142 196 153Z',
      torn:   'M185 120 C202 140 120 129 149 68 C112 127 197 151 185 120Z',
    },
    {
      intact: 'M173 210 C168 187 203 170 182 145 L164 148 C184 169 163 191 167 210Z',
      bent:   'M173 210 C171 185 215 159 208 148 L196 153 C206 157 163 188 167 210Z',
      torn:   'M173 210 C171 186 226 185 208 158 L202 165 C211 181 157 186 167 210Z',
    },
  ];
  mist.insertAdjacentHTML('beforebegin', ribbons.map(({ intact }) =>
    `<path class="inquiry-ribbon" fill="url(#undoubted-cairn-mist)" d="${intact}"/>`).join(''));
  mist.remove();
  const ribbonPaths = Array.from(front.querySelectorAll<SVGPathElement>('.inquiry-ribbon'));

  const seam = 'M-13 -46 L-6 -30 -10 -23 2 -18 -2 -11 10 -4 8 6';
  const stone = front.querySelector('use.cairn-active')!;
  stone.insertAdjacentHTML('beforebegin', `
    <defs>
      <clipPath id="fracture-left"><path d="${seam}H-36V-46Z"/></clipPath>
      <clipPath id="fracture-right"><path d="${seam}H36V-46Z"/></clipPath>
    </defs>
    <use href="#undoubted-cairn-stone" clip-path="url(#fracture-left)"/>
    <g class="fracture-shard"><use href="#undoubted-cairn-stone" clip-path="url(#fracture-right)"/></g>
    <path class="fracture-branch" d="M-10 -23l-8 3-4 6" fill="none" stroke="#403a35" stroke-width="1.4" pathLength="1"/>`);
  stone.remove();
  const shard = front.querySelector('.fracture-shard')!;
  const branch = front.querySelector('.fracture-branch')!;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  function replay() {
    const duration = reducedMotion.matches ? 0 : 1250;
    for (const animation of art.getAnimations({ subtree: true })) animation.cancel();
    ribbons.forEach(({ intact, bent, torn }, i) => {
      ribbonPaths[i].animate([
        { d: `path("${intact}")`, easing: 'ease-in-out' },
        { d: `path("${bent}")`, offset: .6, easing: 'cubic-bezier(.13,.85,.25,1)' },
        { d: `path("${torn}")` },
      ], { duration, fill: 'both' });
    });
    branch.animate([{ strokeDashoffset: '1' }, { strokeDashoffset: '0' }], {
      delay: duration * .32, duration: duration * .28, fill: 'both',
    });
    shard.animate([{ transform: 'none' }, { transform: 'translate(8px, 1px) rotate(8deg)' }], {
      delay: duration * .52, duration: duration * .48, easing: 'ease-out', fill: 'both',
    });
  }

  art.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') replay(); });
  art.addEventListener('focus', () => { if (art.matches(':focus-visible')) replay(); });
  art.addEventListener('click', replay);
  art.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      replay();
    }
  });
}
