import type { CameraView } from './layout';

// Travel is measured from the gesture's starting frame, so reversing a pan
// or pinch also reverses the reveal.
export function createPageExit(shell: HTMLElement, viewport: HTMLElement, view: CameraView,
  setPreview: (active: boolean) => void, paint: () => void, leave: () => void) {
  let origin: CameraView | undefined;
  let x = 0, y = 0, logZoom = 0;
  let timer = 0, animation = 0;
  const zoomThreshold = -Math.log(.75);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  function reset() {
    clearTimeout(timer);
    cancelAnimationFrame(animation);
    if (!origin) return;
    Object.assign(view, origin);
    origin = undefined;
    x = y = logZoom = 0;
    shell.classList.remove('previewing-page-exit');
    for (const name of ['--page-opacity', '--canvas-opacity', '--page-transform']) shell.style.removeProperty(name);
    setPreview(false);
  }

  function draw() {
    if (!origin) return 0;
    const progress = Math.min(1, Math.hypot(x / viewport.clientWidth, y / viewport.clientHeight) / .25 + logZoom / zoomThreshold);
    const scale = Math.exp(-logZoom);
    view.zoom = Math.max(.1, origin.zoom * scale);
    view.x = origin.x + x / origin.zoom;
    view.y = origin.y + y / origin.zoom;
    const ratio = view.zoom / origin.zoom;
    shell.style.setProperty('--page-transform', `translate(${-x * ratio}px, ${-y * ratio}px) scale(${ratio})`);
    shell.style.setProperty('--page-opacity', String(1 - progress));
    shell.style.setProperty('--canvas-opacity', String(progress));
    paint();
    return progress;
  }

  function settle() {
    const start = performance.now();
    const from = { x, y, logZoom };
    function tick(now: number) {
      const remaining = reducedMotion.matches ? 0 : Math.max(0, 1 - (now - start) / 200) ** 3;
      if (!remaining) { reset(); paint(); return; }
      x = from.x * remaining;
      y = from.y * remaining;
      logZoom = from.logZoom * remaining;
      draw();
      animation = requestAnimationFrame(tick);
    }
    animation = requestAnimationFrame(tick);
  }

  function move(dx: number, dy: number, zoomOut: number, idleMs = 150) {
    clearTimeout(timer);
    cancelAnimationFrame(animation);
    if (!origin) {
      origin = { ...view };
      setPreview(true);
      shell.classList.add('previewing-page-exit');
    }
    x += dx;
    y += dy;
    logZoom = Math.max(0, logZoom + zoomOut);
    if (draw() >= 1) {
      const destination = { ...view };
      reset();
      Object.assign(view, destination);
      leave();
    } else {
      timer = window.setTimeout(settle, idleMs);
    }
  }
  return { move, reset, active: () => Boolean(origin) };
}
