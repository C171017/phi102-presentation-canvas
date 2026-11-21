import poses from './assets/regress/sowatt-poses.webp';
import './regress-animations.css';

// Each crop is one complete, single-tailed voice from the approved A3 sheet.
// Keep the crop and its position in the drawing independent so each voice can act.
type Cutout = [atlasX: number, atlasY: number, x: number, y: number, width: number, height: number];
type Pose = { description: string; frame: string; voices: Cutout[]; stone?: Cutout };
const posesByView = {
  skepticism: {
    description: 'YYY Sowatt passes a question down the chain. The last voice peers into empty space and the others draw back.',
    frame: '72 10 600 540',
    voices: [
      [2, 2, 99, 28, 143, 155], [149, 2, 238, 135, 118, 123],
      [271, 2, 348, 213, 113, 128], [388, 2, 452, 300, 108, 120],
      [500, 2, 554, 376, 93, 148],
    ],
  },
  coherentism: {
    description: 'YYY Sowatt’s five voices lean toward their neighbors, passing the question across a web of mutual support.',
    frame: '803 23 555 457',
    voices: [
      [597, 2, 830, 60, 178, 194], [779, 2, 992, 164, 177, 161],
      [172, 200, 1143, 242, 150, 202], [2, 200, 1160, 62, 166, 192],
      [326, 200, 832, 266, 188, 169],
    ],
  },
  infinitism: {
    description: 'YYY Sowatt hands each question to a smaller voice. The procession spirals inward for as long as you hover.',
    frame: '64 552 580 502',
    voices: [
      [518, 200, 86, 576, 250, 220], [772, 200, 331, 626, 143, 143],
      [2, 424, 466, 720, 112, 121], [118, 424, 488, 840, 127, 119],
      [249, 424, 375, 936, 117, 90],
    ],
  },
  foundationalism: {
    description: 'YYY Sowatt’s smallest voice settles on the foundation stone. Each voice above it comes to rest in turn.',
    frame: '907 541 334 552',
    voices: [
      [587, 424, 1027, 582, 112, 120], [703, 424, 1036, 689, 91, 97],
      [798, 424, 1038, 775, 81, 88], [883, 424, 1035, 852, 77, 86],
      [2, 549, 1036, 929, 77, 97],
    ],
    stone: [83, 549, 956, 1010, 238, 63],
  },
} satisfies Record<string, Pose>;
type View = keyof typeof posesByView;

function artwork([sx, sy, x, y, width, height]: Cutout) {
  return `<svg x="${x}" y="${y}" width="${width}" height="${height}" viewBox="${sx} ${sy} ${width} ${height}" overflow="hidden"><image href="${poses}" width="1024" height="648"/></svg>`;
}

const spiralStep = 36;
const spiralRatio = 0.84;
function spiral() {
  const pieces = [];
  // One rotation and shrink step lands each little voice exactly in its neighbor's place.
  for (let i = 0; i < 26; i++) {
    const angle = i * spiralStep;
    const scale = spiralRatio ** i;
    pieces.push(`<g transform="rotate(${angle}) scale(${scale}) translate(-10 106) rotate(100)">${artwork([370, 424, -23, -24, 46, 49])}</g>`);
  }
  return `<g transform="translate(350 895)"><g class="sowatt-spiral" style="--step:${spiralStep}deg;--ratio:${spiralRatio}">${pieces.join('')}</g></g>`;
}

export function initializeRegressAnimations() {
  const controller = new AbortController();
  const options = { signal: controller.signal };
  for (const view of Object.keys(posesByView) as View[]) {
    const host = document.getElementById('regress-' + view);
    if (!host) continue;
    const pose: Pose = posesByView[view];
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', pose.frame);
    svg.setAttribute('class', 'regress-animation');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', pose.description);
    const voices = pose.voices.map((cutout, index) => {
      const beat = view === 'foundationalism' ? pose.voices.length - 1 - index : index;
      return `<g class="sowatt-voice" style="--delay:${beat * 140}ms;--tilt:${index % 2 ? -9 : 9}deg">${artwork(cutout)}</g>`;
    });
    svg.innerHTML = (pose.stone ? artwork(pose.stone) : '') + voices.join('') + (view === 'infinitism' ? spiral() : '');
    host.append(svg);

    function replay() {
      svg.classList.remove('is-speaking');
      void svg.getBoundingClientRect();
      svg.classList.add('is-speaking');
    }
    host.addEventListener('pointerenter', replay, options);
    host.addEventListener('focus', replay, options);
    host.addEventListener('keydown', event => {
      if (event.target === host && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        replay();
      }
    }, options);
    host.addEventListener('click', event => {
      if (!(event.target instanceof Element && event.target.closest('.resize-handle'))) replay();
    }, options);
    controller.signal.addEventListener('abort', () => svg.remove(), { once: true });
  }
  return () => controller.abort();
}
