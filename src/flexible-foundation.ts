import './flexible-foundation.css';

// Three ink faces share one light source across the bridge and its traveler.
function inkBlock(x: number, y: number, width: number, height: number, depth: number) {
  const rise = depth / 2;
  return `<g transform="translate(${x} ${y})" stroke="#202233" stroke-width=".7" stroke-linejoin="round">
    <path d="M0 0l${depth} ${-rise}h${width}l${-depth} ${rise}Z" fill="#d0a56f"/>
    <path d="M0 0h${width}v${height}H0Z" fill="#4b495b"/>
    <path d="M${width} 0l${depth} ${-rise}v${height}l${-depth} ${rise}Z" fill="#252637"/>
  </g>`;
}

function drawPier(x: number, index: number) {
  const stones = Array.from({ length: 5 }, (_, row) =>
    inkBlock(-9, -11 - row * 10, 18, 10, 7)).join('');
  return `<g transform="translate(${x} 199)" data-ink-pier="${index}">
    <g class="bridge-wet">
      <path fill="#212137" d="M-24 2c-4-4 10-6 15-7 9-4 15 1 22 0 9-1 18 1 15 4-2 3-9 3-15 5-11 4-22-1-30 0-6 0-9 0-7-2Z"/>
      <path d="M-17 0q6-3 13-3m13 6 9-2" fill="none" stroke="#d8ad70" stroke-linecap="round"/>
    </g>
    <g class="bridge-dry">${inkBlock(-12,-4,23,6,8)}${stones}</g>
  </g>`;
}

function drawInkBridge() {
  const piers = [26, 88, 150, 212].map(drawPier).join('');
  const paving = Array.from({ length: 12 }, (_, i) => inkBlock(7 + i * 20, 135, 20, 14, 18)).join('');
  // The stepped figure has an open chest and a head of finely packed ink.
  const traveler = inkBlock(5, 62, 7, 7, 4) + inkBlock(26, 62, 8, 7, 4)
    + inkBlock(7, 51, 5, 11, 4) + inkBlock(28, 51, 5, 11, 4)
    + inkBlock(8, 47, 24, 5, 4) + inkBlock(9, 31, 4, 16, 4)
    + inkBlock(27, 33, 5, 14, 4) + inkBlock(9, 26, 23, 7, 5)
    + inkBlock(31, 29, 10, 4, 4) + inkBlock(39, 26, 5, 5, 3)
    + inkBlock(16, 21, 7, 6, 4) + inkBlock(12, 4, 16, 17, 6);
  return `<g aria-hidden="true">
    <path d="M8 205q15-3 34-1m4 4 35-1m83-2 21 1m11 3q27-4 51-3" fill="none" stroke="#888391" opacity=".45" stroke-linecap="round"/>
    ${piers}${paving}
    <g transform="translate(106 60)">${traveler}
      <path d="M16 4v17m4-17v17m4-17v17M12 8h16l6-3m-22 7h16l6-3m-22 8h16l6-3" fill="none" stroke="#242535" stroke-width=".65"/>
    </g>
  </g>`;
}

export function initializeFlexibleFoundation() {
  const illustration = document.querySelector<HTMLElement>('.flexible-foundations')!;
  illustration.querySelector('svg')!.innerHTML = drawInkBridge();
  const button = illustration.querySelector('button')!;
  const piers = Array.from(illustration.querySelectorAll<SVGGElement>('[data-ink-pier]'));
  let wetPier = 1;
  piers[wetPier].classList.add('is-wet');
  let timer: number | undefined;
  let hovering = matchMedia('(any-hover: hover)').matches && illustration.matches(':hover');
  let pinned = false;

  function advance() {
    piers[wetPier].classList.remove('is-wet');
    wetPier = (wetPier + 1) % piers.length;
    piers[wetPier].classList.add('is-wet');
  }

  function update() {
    if (!document.hidden && (hovering || pinned)) {
      if (timer === undefined) {
        advance();
        timer = window.setInterval(advance, 1700);
      }
    } else {
      clearInterval(timer);
      timer = undefined;
    }
  }

  function stopHover() {
    hovering = false;
    update();
  }

  illustration.addEventListener('pointerenter', event => {
    if (event.pointerType === 'touch') return;
    hovering = true;
    update();
  });
  illustration.addEventListener('pointerleave', stopHover);
  illustration.addEventListener('pointercancel', stopHover);
  button.addEventListener('click', () => {
    pinned = !pinned;
    button.setAttribute('aria-pressed', String(pinned));
    update();
  });
  document.addEventListener('visibilitychange', update);
  update();
}
