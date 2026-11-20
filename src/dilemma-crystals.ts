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

// Both halves stay anchored. Their free ends share one point until the brass snaps.
function animateInquiryStrut(corner: Element) {
  const original = document.getElementById(`foundation-rod-${corner.getAttribute('data-corner')}`) as unknown as SVGPathElement;
  const length = original.getTotalLength();
  const start = original.getPointAtLength(0);
  const end = original.getPointAtLength(length);
  const dx = end.x - start.x, dy = end.y - start.y;
  const downward = Math.sign(dx);
  const nx = -dy / length * downward, ny = dx / length * downward;
  const layers = corner.querySelectorAll<SVGPathElement>('.inquiry-strut path');
  let progress = 0;
  let frame = 0;

  function point(along: number, bend: number) {
    return `${(start.x + dx * along + nx * bend).toFixed(2)} ${(start.y + dy * along + ny * bend).toFixed(2)}`;
  }
  function draw() {
    const load = Math.min(progress / .64, 1);
    const bow = 16 * load * load * (3 - 2 * load);
    const release = Math.max(0, (progress - .64) / .36);
    // A short, damped recoil makes the instant of fracture visible.
    const recoil = 1 - Math.exp(-6 * release) * Math.cos(8 * release);
    const innerTip = bow - 23 * recoil;
    const outerTip = bow + 4 * recoil;
    const path = `M${point(0, 0)} Q${point(.26, innerTip)} ${point(.52 - .025 * recoil, innerTip)} `
      + `M${point(.52 + .025 * recoil, outerTip)} Q${point(.76, bow - 2 * recoil)} ${point(1, 0)}`;
    layers.forEach(layer => layer.setAttribute('d', path));
  }
  draw();
  return (questioned: boolean, reducedMotion: boolean) => {
    cancelAnimationFrame(frame);
    const target = questioned ? 1 : 0;
    const initial = progress;
    if (initial === target || reducedMotion) { progress = target; draw(); return; }
    const started = performance.now();
    const duration = (questioned ? 870 : 300) * Math.abs(target - initial);
    function tick(now: number) {
      const time = Math.min(1, (now - started) / duration);
      progress = initial + (target - initial) * time;
      draw();
      if (time < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
  };
}

export function mountUndoubtedCrystal(host: HTMLElement) {
  const joints = supports.map(({ rod: id, stone, x, y }) =>
    `<g class="inquiry-support" data-corner="${id}">
      <ellipse cx="${x}" cy="${y}" rx="32" ry="10" fill="#614b31" fill-opacity=".15"/>
      <g class="inquiry-stone">${stone}</g>
      <g class="inquiry-strut" fill="none" stroke-linecap="butt">
        ${['shadow', 'edge', 'body', 'highlight'].map(layer =>
          `<path class="crystal-foundations__rod-${layer}"/>`).join('')}
      </g>
    </g>`).join('');
  host.insertAdjacentHTML('afterbegin', `<svg class="scene-art inquiry-crystal" width="580" height="415"
    viewBox="0 0 580 415" role="img" tabindex="0"
    aria-label="Four undoubted beliefs support a crystal. Hover or focus to question them clockwise, or tap to step through them. The questioned stone fades as its brass strut bows, snaps and springs apart.">
    <g transform="translate(80 0) scale(1.5)">
      <ellipse cx="153" cy="164" rx="34" ry="13" fill="#614b31" opacity=".13"/>
      ${joints}
      <use href="#foundation-artwork" clip-path="url(#foundation-crystal-cut)"/>
    </g>
  </svg>`);
  const art = host.querySelector<SVGSVGElement>('.inquiry-crystal')!;
  const corners = Array.from(art.querySelectorAll('.inquiry-support'));
  const moveStruts = corners.map(animateInquiryStrut);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let current = -1;
  let timer: number | undefined;
  let hovering = false;
  let keyboardFocus = false;

  function show(index: number) {
    if (current === index) return;
    if (current >= 0) moveStruts[current](false, reducedMotion.matches);
    if (index >= 0) moveStruts[index](true, reducedMotion.matches);
    current = index;
    corners.forEach((corner, i) => corner.classList.toggle('is-questioned', i === index));
  }
  function sync() {
    clearInterval(timer);
    if (document.hidden || !(hovering || keyboardFocus)) {
      show(-1);
      return;
    }
    if (current < 0) show(0);
    if (!reducedMotion.matches) {
      timer = window.setInterval(() => show((current + 1) % corners.length), 1500);
    }
  }
  art.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'touch') { hovering = true; sync(); }
  });
  art.addEventListener('pointerleave', event => {
    if (event.pointerType !== 'touch') { hovering = false; sync(); }
  });
  art.addEventListener('focus', () => { keyboardFocus = art.matches(':focus-visible'); sync(); });
  art.addEventListener('blur', () => { keyboardFocus = false; sync(); });
  art.addEventListener('pointerup', event => {
    if (event.pointerType === 'touch') show(current + 1 === corners.length ? -1 : current + 1);
  });
  art.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      clearInterval(timer);
      show(current + 1 === corners.length ? -1 : current + 1);
    }
  });
  document.addEventListener('visibilitychange', sync);
  reducedMotion.addEventListener('change', sync);
}
