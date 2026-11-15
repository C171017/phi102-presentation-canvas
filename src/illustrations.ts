import foundationSource from '../public/generated/foundationalism/stone-left.svg?raw';
import contextSource from '../public/generated/contextualism/states/context-red.svg?raw';

// Keep each illustration's original artwork and animate only its changing parts.
function mount(id: string, source: string, description: string) {
  const container = document.getElementById(id)!;
  const svg = new DOMParser().parseFromString(source, 'image/svg+xml').documentElement;
  svg.removeAttribute('aria-labelledby');
  svg.querySelectorAll('title, desc').forEach(element => element.remove());
  svg.setAttribute('aria-label', description);
  svg.classList.add('animated-illustration');
  const image = container.querySelector('img')!;
  svg.setAttribute('width', image.getAttribute('width')!);
  svg.setAttribute('height', image.getAttribute('height')!);
  image.replaceWith(svg);
  container.setAttribute('aria-label', `${description} Hover to play, move away to pause.`);
  return { container, svg };
}

function playOnHover(container: HTMLElement, animations: Animation[]) {
  let hovering = false;
  const update = () => {
    for (const animation of animations) {
      if (hovering && !document.hidden) animation.play();
      else animation.pause();
    }
  };
  // Pausing immediately retains time zero, and later pauses retain the exact frame.
  update();
  container.addEventListener('pointerenter', () => { hovering = true; update(); });
  container.addEventListener('pointerleave', () => { hovering = false; update(); });
  container.addEventListener('pointercancel', () => { hovering = false; update(); });
  document.addEventListener('visibilitychange', update);
}

export function initializeIllustrations() {
  const foundation = mount('foundation-left', foundationSource,
    'The same belief supported in turn by the left two, right two, and outer two foundations.');
  const struts = Array.from(foundation.svg.querySelectorAll(':scope > path')).slice(0, 2);
  const outerStrut = struts[0].cloneNode(true) as SVGPathElement;
  outerStrut.setAttribute('d', 'M260 255L260 140');
  foundation.svg.insertBefore(outerStrut, foundation.svg.firstChild);
  struts.push(outerStrut);
  const stones = Array.from(foundation.svg.querySelectorAll(':scope > g'));
  const pairs = [[1, 1, 0], [0, 1, 1], [1, 0, 1], [1, 1, 0]];
  const offsets = [0, 1 / 6, 1 / 3, 1 / 2, 2 / 3, 5 / 6, 1];
  const transitionEasing = 'cubic-bezier(0.45, 0, 0.55, 1)';
  const stages = [0, 0, 1, 1, 2, 2, 3];
  const animations: Animation[] = [];
  struts.forEach((strut, index) => {
    animations.push(strut.animate(offsets.map((offset, frame) => ({
      offset, easing: transitionEasing, opacity: pairs[stages[frame]][index],
    })), { duration: 7200 / 2.5, iterations: Infinity, fill: 'both' }));
    const stone = stones[index];
    animations.push(stone.querySelector('rect')!.animate(offsets.map((offset, frame) => ({
      offset, easing: transitionEasing,
      fill: pairs[stages[frame]][index] ? '#ead0ad' : '#ece7de',
      stroke: pairs[stages[frame]][index] ? '#b7793f' : '#b5ada0',
    })), { duration: 7200 / 2.5, iterations: Infinity, fill: 'both' }));
    animations.push(stone.querySelector('path')!.animate(offsets.map((offset, frame) => ({
      offset, easing: transitionEasing, stroke: pairs[stages[frame]][index] ? '#b7793f' : '#b5ada0',
    })), { duration: 7200 / 2.5, iterations: Infinity, fill: 'both' }));
  });
  playOnHover(foundation.container, animations);

  const context = mount('state-red', contextSource,
    'The same sentence moves between five contexts, changing color with its context.');
  const bubble = context.svg.querySelector('g')!;
  const bubbleShape = bubble.querySelector('path')!;
  const contexts = [
    { x: 192, y: 67, color: '#BF4338' },
    { x: 311, y: 153, color: '#216BB0' },
    { x: 265, y: 292, color: '#26856D' },
    { x: 119, y: 292, color: '#BA811A' },
    { x: 73, y: 153, color: '#8056A6' },
  ];
  const movement: Keyframe[] = [];
  const colors: Keyframe[] = [];
  [...contexts, contexts[0]].forEach((state, index) => {
    const frame = { transform: `translate(${state.x}px, ${state.y}px)`, easing: transitionEasing };
    const color = { fill: state.color, stroke: state.color, easing: transitionEasing };
    movement.push({ ...frame, offset: index / 5 });
    colors.push({ ...color, offset: index / 5 });
    if (index < 5) {
      movement.push({ ...frame, offset: (index + 0.25) / 5 });
      colors.push({ ...color, offset: (index + 0.25) / 5 });
    }
  });
  const timing = { duration: 10000 / 2.5, iterations: Infinity, fill: 'both' as FillMode };
  playOnHover(context.container, [bubble.animate(movement, timing), bubbleShape.animate(colors, timing)]);
}
