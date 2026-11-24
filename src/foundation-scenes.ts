import pebbleArt from './assets/foundations/cartesian-pebble.webp';
import townArt from './assets/foundations/town.webp';
import dryInk from './assets/foundations/undoubted-dry.webp';
import wetInk from './assets/foundations/undoubted-wet.webp';
import { lines, txt } from './sketch';
import './foundation-scenes.css';

function inkQuestion(x: number, y: number, className: string) {
  return `<g class="${className}" aria-hidden="true">
    <g transform="translate(${x} ${y})">
      <path fill="#202635" d="M0 -21c-15 0-26 9-26 22 0 9 5 15 14 19l-6 13 16-11c16 0 28-8 28-22 0-13-11-21-26-21Z"/>
      ${txt(0, 10, '?', { size: 26, weight: 600, fill: '#f8e3ab' })}
    </g>
  </g>`;
}

/** Both schools face the same question. Their ink responds differently. */
export function mountDilemma(host: HTMLElement, strict: boolean) {
  const name = strict ? 'Cartesian foundationalism' : 'Moderate foundationalism';
  const subject = strict ? 'pebble' : 'town';
  const rule = strict ? 'Dry only what cannot be doubted.' : 'Dry whatever seems true.';
  const caption = strict
    ? ['Ten thousand Cartesians. Three hundred years.', 'One indubitable ink pebble.']
    : ['A whole town in one afternoon.', 'Its foundations are only half dry.'];
  const result = strict ? 'The ink pebble holds. It is too small to support a world.'
    : 'The half-dry town wobbles and slumps into a puddle.';
  const artwork = strict
    ? `<image class="ink-pebble" href="${pebbleArt}" x="107" y="156" width="216" height="120"/>`
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
    ${inkQuestion(333, 115, 'ink-question')}
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

export function mountUndoubtedInk(host: HTMLElement) {
  host.insertAdjacentHTML('afterbegin', `<svg class="scene-art local-ink" width="580" height="415"
    viewBox="0 0 580 415" role="button" tabindex="0"
    aria-label="Three dry ink sticks offer firm footing. Hover, tap, or press Enter to raise an unanswered doubt. The front stick melts back into ink while the other two stay dry.">
    <image href="${dryInk}" x="83" y="128" width="151" height="75"/>
    <image href="${dryInk}" x="351" y="109" width="146" height="72"/>
    <image class="local-ink-wet" href="${wetInk}" x="169" y="251" width="242" height="84"/>
    <image class="local-ink-dry" href="${dryInk}" x="182" y="219" width="216" height="107"/>
    ${inkQuestion(294, 178, 'local-ink-question')}
  </svg>`);
  const art = host.querySelector<SVGSVGElement>('.local-ink')!;

  function replay() {
    art.classList.remove('is-questioned');
    void art.getBoundingClientRect();
    art.classList.add('is-questioned');
  }

  art.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') replay(); });
  art.addEventListener('pointerdown', event => { if (event.pointerType === 'touch') replay(); });
  art.addEventListener('focus', () => { if (art.matches(':focus-visible')) replay(); });
  art.addEventListener('click', replay);
  art.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      replay();
    }
  });
}
