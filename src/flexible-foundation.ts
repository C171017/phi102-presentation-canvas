import './flexible-foundation.css';

export function initializeFlexibleFoundation() {
  const illustration = document.querySelector<HTMLElement>('.crystal-foundations')!;
  const button = illustration.querySelector('button')!;
  const corners = ['upper-right', 'lower-right', 'lower-left', 'upper-left'];
  let corner = 0;
  let timer: number | undefined;
  let hovering = matchMedia('(any-hover: hover)').matches && illustration.matches(':hover');
  let pinned = false;

  function advance() {
    corner = (corner + 1) % corners.length;
    illustration.dataset.translucentCorner = corners[corner];
  }

  function update() {
    if (!document.hidden && (hovering || pinned)) {
      if (timer === undefined) {
        advance();
        timer = window.setInterval(advance, 760);
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
