import { drawCairn } from './foundation-cairn';
import { lines, txt } from './sketch';
import './foundation-scenes.css';

export function drawDilemma(strict: boolean) {
  const standard = strict ? 'cartesian' : 'moderate';
  return txt(215, 51, strict ? 'Cartesian foundationalism' : 'Moderate foundationalism', { size: 25, weight: 600 })
    + `<g transform="translate(41 65) scale(1.24)" class="dilemma-${standard}">
        ${strict ? '<ellipse class="fall-shadow" cx="247" cy="218" rx="29" ry="4.5" fill="#504a42" opacity=".15"/>' : ''}
        ${drawCairn(`${standard}-cairn`, strict)}
        ${strict ? '' : `<g class="wobble-marks" aria-hidden="true" fill="none" stroke="#736b60" stroke-linecap="round">
          <path d="M99 38q-5 8-5 17m-1-20q-4 7-5 13M188 43q5 8 5 17m2-21q4 6 5 13" stroke-width="1.7"/>
        </g>`}
      </g>`
    + lines(215, 394, strict
      ? ['Too few beliefs are indubitable', 'to support ordinary knowledge.']
      : ['Perception and intuition can be doubted.', 'Why stop the chain of reasons here?'], { size: 18, lh: 24 });
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
