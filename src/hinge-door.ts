import hingePoses from './assets/hinge-door/hinge-poses.webp';
import './hinge-door.css';

const WIDTH = 640;
const HEIGHT = 600;
const COLUMNS = 6;
const LAST_POSE = 29;
const FRAME_INTERVAL = 1000 / 30;

export const HINGE_DOOR_LABEL = 'What colour do you see? Hover or focus to lift the door and reveal six colours. The hinge is labeled “Understand English,” the fixed assumption.';

export function mountHingeDoor(host: HTMLElement) {
  const model = document.createElement('canvas');
  model.className = 'hinge-door-model';
  model.width = WIDTH;
  model.height = HEIGHT;
  model.setAttribute('role', 'img');
  model.setAttribute('aria-label', HINGE_DOOR_LABEL);
  const context = model.getContext('2d');
  host.prepend(model);
  if (!context) return;

  const atlas = new Image();
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let ready = false;
  let hovered = false;
  let focused = false;
  let pose = 0;
  let target = 0;
  let frame: number | undefined;
  let nextPoseAt = 0;

  const paint = () => {
    const x = (pose % COLUMNS) * WIDTH;
    const y = Math.floor(pose / COLUMNS) * HEIGHT;
    context.clearRect(0, 0, WIDTH, HEIGHT);
    context.drawImage(atlas, x, y, WIDTH, HEIGHT, 0, 0, WIDTH, HEIGHT);
  };

  function advance(now: number) {
    frame = undefined;
    if (!model.isConnected || pose === target) return;
    if (reducedMotion.matches || now >= nextPoseAt) {
      pose = reducedMotion.matches ? target : pose + Math.sign(target - pose);
      paint();
      nextPoseAt = Math.max(now, nextPoseAt + FRAME_INTERVAL);
    }
    if (pose !== target) frame = requestAnimationFrame(advance);
  }

  function play() {
    target = hovered || focused ? LAST_POSE : 0;
    if (!ready || pose === target || frame !== undefined) return;
    if (reducedMotion.matches) {
      pose = target;
      paint();
      return;
    }
    nextPoseAt = performance.now();
    frame = requestAnimationFrame(advance);
  }

  atlas.addEventListener('load', () => {
    ready = true;
    paint();
    play();
  }, { once: true });
  atlas.src = hingePoses;

  host.addEventListener('pointerenter', event => {
    if (event.pointerType === 'touch') return;
    hovered = true;
    play();
  });
  host.addEventListener('pointerleave', () => {
    hovered = false;
    play();
  });
  host.addEventListener('focus', () => {
    focused = host.matches(':focus-visible');
    play();
  });
  host.addEventListener('blur', () => {
    focused = false;
    play();
  });
}
