import harborImage from './assets/signal-harbor/harbor.webp';
import radio from './assets/signal-harbor/radio.webp';
import launch from './assets/signal-harbor/launch.webp';
import telescope from './assets/signal-harbor/telescope.webp';
import flag from './assets/signal-harbor/flag.webp';
import './signal-harbor.css';

const views = [
  { id: 'contextualism', name: 'Contextualism', part: 'Kit’s radio', role: 'Speaker', color: '#a8543b', flag: 'Formal inquiry',
    sprite: radio, x: 442, y: 122, width: 127, height: 95, tagX: 485, tagY: 110,
    outline: 'M521 173 518 215 485 215 482 212 482 176 479 173 473 173 473 182 476 182 476 206 473 209 443 206 443 200 446 200 443 161 449 158 449 149 452 149 446 128 452 122 473 125 470 149 473 149 476 164 479 164 479 158 485 158 491 152 512 158 512 140 515 140 515 158 521 161Z',
    text: 'Kit switches from harbor chat to a formal inquiry. The same words now say that Mara meets a stricter standard. The conversation changes which proposition Kit expresses.' },
  { id: 'sensitive-invariantism', name: 'Sensitive invariantism', part: 'Mara’s launch', role: 'Subject', color: '#39796f', flag: 'Rescue underway',
    sprite: launch, x: 238, y: 130, width: 175, height: 139, tagX: 339, tagY: 139,
    outline: 'M359 209 359 206 353 206 353 173 356 170 350 170 350 164 359 155 353 137 356 137 356 131 377 131 380 140 377 140 374 155 377 155 377 167 380 167 380 203 383 206Z M326 257 248 254 239 245 239 230 248 224 266 227 266 203 269 203 269 227 278 224 278 218 275 218 278 206 311 206 311 209 320 209 320 215 317 215 320 230 362 233 362 248 350 260Z',
    text: 'Mara sees the same light, but now a rescue depends on it. Her higher stakes can change whether her belief is foundationally justified. The words keep their meaning.' },
  { id: 'relativism', name: 'Relativism', part: 'Jo’s telescope', role: 'Assessor', color: '#436f9d', flag: 'Reassessing the same report',
    sprite: telescope, x: 573, y: 131, width: 90, height: 90, tagX: 639, tagY: 127,
    outline: 'M632 149 638 137 659 140 659 155 656 155 659 203 662 203 659 218 632 218 632 185 635 185 635 179 629 179 629 173 635 170 635 149Z M578 137 578 134 593 134 599 149 605 152 605 158 614 164 614 173 608 173 608 188 611 188 611 200 614 200 617 215 611 215 608 206 602 206 599 185 596 185 587 209 578 212 578 206 596 176 596 167 572 149 572 143Z',
    text: 'Jo reassesses Kit’s original transmission. That one claim can be true by routine assessment standards and false by rescue-review standards.' },
  { id: 'expressivism', name: 'Expressivism', part: 'Kit’s signal flag', role: 'Utterance', color: '#80578d', flag: 'A rule endorsed',
    sprite: flag, x: 535, y: 35, width: 144, height: 166, tagX: 580, tagY: 44,
    outline: 'M536 44 539 35 548 38 548 44 545 44 545 92 551 92 551 95 593 95 593 113 563 119 563 122 545 122 545 197 539 197 539 44Z',
    text: 'Kit raises the flag. In calling Mara’s belief foundationally justified, Kit endorses a rule for reasoning. A clear sighting can serve as a starting point without a further reason.' },
] as const;
const overview = 'Mara sees a glow and believes the harbor lamp is lit. Kit says Mara’s belief is foundationally justified. Jo assesses Kit’s claim.';
export function mountSignalHarbor(host: HTMLElement) {
  host.classList.add('signal-harbor');
  host.setAttribute('aria-label', 'Signal Harbor. Explore four views of foundational justification.');
  // Each strip contains nine frames of just the pixels that move, including their shadows.
  const strips = views.map(({ sprite, x, y, width, height }, i) => `
    <svg class="harbor-patch" x="${x}" y="${y}" width="${width}" height="${height}" overflow="hidden">
      <image href="${sprite}" width="${width * 9}" height="${height}" style="--harbor-end:${-width * 8}px"/>
    </svg>
    <clipPath id="harbor-cut-${i}"><path clip-rule="evenodd" d="M0 0H900V338H0Z M${x} ${y}h${width}v${height}h-${width}Z"/></clipPath>`).join('');
  const targets = views.map(view => `<path class="harbor-part" d="${view.outline}"/>`).join('');
  host.innerHTML = `<div class="harbor-stage">
    <svg viewBox="0 0 900 338" role="img" aria-label="Mara beside a launch, Kit at the radio and signal flag, and Jo at the telescope. The four controls below explore the scene.">
      <image class="harbor-base" href="${harborImage}" width="900" height="338"/>
      ${strips}${targets}
    </svg><span class="harbor-tag" hidden></span>
    </div><div class="harbor-views" role="group" aria-label="Views of foundational justification"></div><p class="harbor-caption"></p>`;
  const base = host.querySelector<SVGImageElement>('.harbor-base')!;
  const patches = Array.from(host.querySelectorAll<SVGSVGElement>('.harbor-patch'));
  const targetsByView = host.querySelectorAll<SVGPathElement>('.harbor-part');
  const tag = host.querySelector<HTMLElement>('.harbor-tag')!;
  const caption = host.querySelector<HTMLElement>('.harbor-caption')!;
  const controls = host.querySelector<HTMLElement>('.harbor-views')!;
  caption.id = `${host.id}-explanation`;
  caption.textContent = overview;
  let active = -1;

  function show(index: number) {
    if (active === index) return;
    if (active >= 0) {
      patches[active].classList.remove('is-active');
      buttons[active].classList.remove('is-active');
    }
    active = index;
    const view = views[index];
    caption.textContent = view?.text ?? overview;
    tag.hidden = !view;
    if (!view) { base.removeAttribute('clip-path'); return; }
    // Cut out the resting pose so moving parts can reveal transparent sky behind them.
    base.setAttribute('clip-path', `url(#harbor-cut-${index})`);
    patches[index].classList.add('is-active');
    buttons[index].classList.add('is-active');
    tag.textContent = view.flag;
    tag.style.left = view.tagX + 'px';
    tag.style.top = view.tagY + 'px';
  }

  const buttons = views.map((view, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.style.setProperty('--role-color', view.color);
    button.setAttribute('aria-describedby', caption.id);
    const title = document.createElement('strong');
    title.textContent = view.name;
    const detail = document.createElement('span');
    detail.textContent = `${view.role} · ${view.part}`;
    button.append(title, detail);
    controls.append(button);
    for (const target of [button, targetsByView[index]] as Element[]) {
      target.addEventListener('pointerenter', () => show(index));
      target.addEventListener('pointerleave', () => show(-1));
    }
    button.addEventListener('focus', () => { if (button.matches(':focus-visible')) show(index); });
    button.addEventListener('blur', () => show(-1));
    return button;
  });
}
