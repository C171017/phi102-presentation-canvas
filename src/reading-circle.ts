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

const checkMark = '<path d="M -6 -23 L -1 -18 L 11 -27" fill="none" stroke="#356951" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" />';
const equation = '1 + 1 = 3';

export function mountReadingCircle(host: HTMLElement, variant: 'ordinary' | 'mistaken' = 'ordinary') {
  const mistaken = variant === 'mistaken';
  const interval = mistaken ? 640 : READER_INTERVAL;
  const description = mistaken
    ? 'Five readers accept the false claim that one plus one equals three. A red checkmark coin and a red glow mark their mistaken consensus. Hover, focus, or tap to replay.'
    : 'Five readers around an open book. A gold checkmark coin marks their agreement. Hover, focus, or tap to replay.';
  host.insertAdjacentHTML('afterbegin', `<svg class="scene-art reading-circle circle-complete${mistaken ? ' circle-mistaken' : ''}" width="560" height="450" viewBox="0 0 560 450" role="img" tabindex="0" aria-label="${description}" style="--reading-circle-speed: ${PLAYBACK_SPEED}; --reading-circle-interval: ${interval}ms">
    <image href="${circle}" width="560" height="450" />
    ${readers.map(([url, x, y, width, height]) => `<g class="circle-participant circle-solid">
      <image class="circle-reader" href="${url}" x="${x}" y="${y}" width="${width}" height="${height}" />
      <g transform="translate(${x + width / 2} ${y - 7})" aria-hidden="true">
        <g class="circle-bubble">
          <g transform="scale(${mistaken ? 2.05 : 1} 1)">
            <path d="${bubbleOutline}" fill="#6b523a" opacity=".18" transform="translate(4 5)" />
            <path d="${bubbleOutline}" fill="#b38755" transform="translate(2 3)" />
            <path d="${bubbleOutline}" fill="#f8ecc9" stroke="#a57b4c" stroke-width=".9" />
            <path d="M -15 -33 L 20 -31" stroke="#fff9e5" stroke-width="1.5" stroke-linecap="round" />
          </g>
          ${mistaken ? `<text x="5" y="-17" text-anchor="middle" fill="#3c3026" font-size="18" font-weight="bold">${equation}</text>` : checkMark}
        </g>
      </g>
    </g>`).join('')}
    <image class="circle-seal" href="${seal}" x="215" y="177" width="56.5" height="55.5" />
  </svg>`);
  const art = host.querySelector<SVGSVGElement>('.reading-circle')!;
  const figures = Array.from(art.querySelectorAll('.circle-participant'));
  function play() {
    if (!art.classList.contains('circle-complete')) return;
    art.classList.remove('circle-complete');
    figures.forEach(reader => reader.classList.remove('circle-solid'));
    const waiting = figures.slice();
    let speaking: Element | undefined;

    function advance() {
      speaking?.classList.remove('circle-speaking');
      if (!waiting.length || document.hidden || !art.isConnected) {
        figures.forEach(reader => reader.classList.add('circle-solid'));
        art.classList.add('circle-complete');
        return;
      }
      const [reader] = waiting.splice(Math.floor(Math.random() * waiting.length), 1);
      speaking = reader;
      reader.classList.add('circle-solid', 'circle-speaking');
      window.setTimeout(advance, interval);
    }

    window.setTimeout(advance, 360 / PLAYBACK_SPEED);
  }

  art.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') play(); });
  art.addEventListener('pointerup', event => { if (event.pointerType === 'touch') play(); });
  art.addEventListener('focus', () => { if (art.matches(':focus-visible')) play(); });
  art.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); play(); }
  });
}
