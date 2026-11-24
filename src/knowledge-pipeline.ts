import evan from './assets/full-body-cast/evan.webp';
import './knowledge-pipeline.css';

const label = 'Evan writes E = K on a letter. The ink hardens into a solid ink stick.';
const nib = { x: 272, y: 279 };
const strokes = [
  ['M388 202Q386 225 382 246Q380 258 378 267', 7.5],
  ['M387 204Q408 199 430 201', 5.5],
  ['M383 235Q403 230 421 232', 5.3],
  ['M378 267Q403 261 428 263', 6],
  ['M455 225Q479 221 503 223', 5.5],
  ['M454 245Q479 241 504 243', 5.7],
  ['M542 202Q539 224 535 245Q533 257 532 266', 7.5],
  ['M579 202Q559 220 536 238', 5.4],
  ['M539 236Q559 247 581 266', 6.4],
] as const;

export const knowledgeLetterArtwork = `
  <rect x="339" y="157" width="290" height="166" rx="3" fill="#816d52" opacity=".16"/>
  <rect x="334" y="151" width="290" height="166" rx="3" fill="#fff5de" stroke="#ac8f69" stroke-width="2"/>
  <path d="M349 165h260v138H349Z" fill="none" stroke="#e1cda4"/>
  <g class="evan-equation">
    ${strokes.map(([path, width]) => `<path d="${path}" stroke-width="${width}" pathLength="1"/>`).join('')}
  </g>`;

function mount(host: HTMLElement) {
  host.insertAdjacentHTML('afterbegin', `
    <svg class="scene-art evan-letter-scene" viewBox="0 0 900 450" width="900" height="450"
      tabindex="0" role="button" aria-label="${label} Hover, tap, or press Enter to replay.">
      <g id="route-knowledge-evidence" data-link-origin="bottom-center">
        ${knowledgeLetterArtwork}
      </g>
      <path class="evan-wet-ink" d="M681 288c-14-9 14-20 48-23 23-2 44 4 63 5 30 1 44 8 31 15-13 9-39 5-55 11-27 9-72 5-87-8Z" fill="#25243d"/>
      <g class="evan-solid-ink">
        <path d="m692 251 36-25 95 9-28 28Z" fill="#46445e"/>
        <path d="m692 251 103 12v34l-103-12Z" fill="#222238"/>
        <path d="m795 263 28-28v34l-28 28Z" fill="#161726"/>
        <path d="m704 250 25-17 77 7" fill="none" stroke="#77718c" stroke-width="2"/>
      </g>
      <g class="evan-writer">
        <image href="${evan}" x="165" y="60" width="108" height="228.5"/>
      </g>
    </svg>`);
  const art = host.querySelector<SVGSVGElement>('.evan-letter-scene')!;
  const writer = art.querySelector<SVGGElement>('.evan-writer')!;
  const liquid = art.querySelector<SVGPathElement>('.evan-wet-ink')!;
  const solid = art.querySelector<SVGGElement>('.evan-solid-ink')!;
  const handwriting = Array.from(art.querySelectorAll<SVGPathElement>('.evan-equation path'));
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let sequence: Animation[] = [];

  function replay() {
    sequence.forEach(animation => animation.cancel());
    if (reducedMotion.matches) {
      sequence = [solid.animate([{ opacity: 1 }, { opacity: 1 }], { duration: 1000 })];
      return;
    }

    const writerFrames: Keyframe[] = [
      { offset: 0, transform: 'none' },
      { offset: 0.06, transform: 'translate(8px, 9px) rotate(4deg)' },
    ];
    const duration = 2750;
    let start = 440;
    sequence = handwriting.map(stroke => {
      const length = stroke.getTotalLength();
      const time = 65 + length * 1.35;
      const steps = Math.ceil(length / 12);

      for (let step = 0; step <= steps; step++) {
        const progress = step / steps;
        const point = stroke.getPointAtLength(length * progress);
        writerFrames.push({
          offset: (start + time * progress) / duration,
          transform: `translate(${point.x - nib.x}px, ${point.y - nib.y}px)`,
        });
      }

      const reveal = stroke.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], {
        duration: time, delay: start, fill: 'backwards',
      });
      start += time + 39;
      return reveal;
    });

    writerFrames.push({ offset: (start + 510) / duration, transform: 'none' }, { offset: 1, transform: 'none' });
    sequence.push(
      writer.animate(writerFrames, { duration }),
      liquid.animate([{ opacity: 0 }, { opacity: 1, offset: .35 }, { opacity: 0 }], {
        duration: 540, delay: start,
      }),
      solid.animate([
        { opacity: 0, transform: 'scaleY(.2)' },
        { opacity: 1, transform: 'scaleY(1)', offset: .26 },
        { opacity: 1, transform: 'scaleY(1)', offset: .85 },
        { opacity: 0, transform: 'scaleY(1)' },
      ], { duration: 1400, delay: start + 270, easing: 'ease-out' }),
    );
  }

  art.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') replay(); });
  art.addEventListener('pointerup', event => { if (event.pointerType === 'touch') replay(); });
  art.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    if (!event.repeat) replay();
  });
}

export const knowledgeScene = { w: 900, h: 450, label, mount };
