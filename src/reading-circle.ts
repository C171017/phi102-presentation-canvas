import circle from './assets/reading-circle/circle.webp';
import first from './assets/reading-circle/reader-1.webp';
import second from './assets/reading-circle/reader-2.webp';
import third from './assets/reading-circle/reader-3.webp';
import fourth from './assets/reading-circle/reader-4.webp';
import fifth from './assets/reading-circle/reader-5.webp';
import seal from './assets/reading-circle/seal.webp';
import './reading-circle.css';

const PLAYBACK_SPEED = 1.5;
const READER_INTERVAL = 560 / PLAYBACK_SPEED;

// Cropped opaque renders register with the translucent figures in the base render.
const readers = [
  [first, 92.5, 184.5, 48.5, 103.5],
  [second, 165, 144, 53.5, 103],
  [third, 265, 138, 54.5, 70.5],
  [fourth, 364.5, 155, 50, 103.5],
  [fifth, 417, 200.5, 45, 104],
] as const;

const bubbleOutline = 'M -15 -35 L 20 -33 Q 25 -33 25 -28 L 23 -14 Q 22 -10 17 -10 L 8 -11 L 0 0 L 0 -11 L -16 -12 Q -20 -12 -19 -17 L -18 -31 Q -18 -35 -15 -35 Z';

export function mountReadingCircle(host: HTMLElement) {
  host.insertAdjacentHTML('afterbegin', `<svg class="scene-art reading-circle" width="560" height="450" viewBox="0 0 560 450" role="img" tabindex="0" aria-label="Five translucent readers around an open book. Hover, focus, or tap to see each reader signal agreement before the group reaches a justified claim." style="--reading-circle-speed: ${PLAYBACK_SPEED}; --reading-circle-interval: ${READER_INTERVAL}ms">
    <image href="${circle}" width="560" height="450" />
    ${readers.map(([url, x, y, width, height]) => `<g class="circle-participant">
      <image class="circle-reader" href="${url}" x="${x}" y="${y}" width="${width}" height="${height}" />
      <g transform="translate(${x + width / 2} ${y - 7})" aria-hidden="true">
        <g class="circle-bubble">
          <path d="${bubbleOutline}" fill="#6b523a" opacity=".18" transform="translate(4 5)" />
          <path d="${bubbleOutline}" fill="#b38755" transform="translate(2 3)" />
          <path d="${bubbleOutline}" fill="#f8ecc9" stroke="#a57b4c" stroke-width=".9" />
          <path d="M -15 -33 L 20 -31" stroke="#fff9e5" stroke-width="1.5" stroke-linecap="round" />
          <path d="M -6 -23 L -1 -18 L 11 -27" fill="none" stroke="#356951" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" />
        </g>
      </g>
    </g>`).join('')}
    <image class="circle-seal" href="${seal}" x="215" y="177" width="56.5" height="55.5" />
  </svg>`);
  const art = host.querySelector<SVGSVGElement>('.reading-circle')!;
  const figures = Array.from(art.querySelectorAll('.circle-participant'));
  let timer: number | undefined;
  let speaking: Element | undefined;
  let waiting = figures.slice();
  let complete = false;

  function stop() {
    window.clearTimeout(timer);
    timer = undefined;
  }

  function advance() {
    if (!art.isConnected || document.hidden) { stop(); return; }
    speaking?.classList.remove('circle-speaking');
    if (!waiting.length) {
      art.classList.add('circle-complete');
      complete = true;
      stop();
      return;
    }
    const [reader] = waiting.splice(Math.floor(Math.random() * waiting.length), 1);
    speaking = reader;
    reader.classList.add('circle-solid', 'circle-speaking');
    timer = window.setTimeout(advance, READER_INTERVAL);
  }

  function play() {
    if (timer !== undefined) return;
    if (complete) {
      complete = false;
      waiting = figures.slice();
      art.classList.remove('circle-complete');
      figures.forEach(reader => reader.classList.remove('circle-solid'));
      timer = window.setTimeout(advance, 360 / PLAYBACK_SPEED);
    } else {
      advance();
    }
  }

  art.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') play(); });
  art.addEventListener('pointerleave', event => { if (event.pointerType !== 'touch') stop(); });
  art.addEventListener('pointerup', event => { if (event.pointerType === 'touch') play(); });
  art.addEventListener('focus', () => { if (art.matches(':focus-visible')) play(); });
  art.addEventListener('blur', stop);
  art.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); play(); }
  });
}
