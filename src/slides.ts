import type { CameraView } from './layout';

import { slides } from './slide-content';

export function createSlideNavigation(world: HTMLElement, navigate: (view: CameraView) => void, onChange: (index: number) => void, onViewChange: (index: number) => void = () => {}) {
  const viewport = world.parentElement!;
  const progress = document.querySelector<HTMLElement>('#slide-progress')!;
  const groups = slides.map(({ members }) => members.map(id => document.getElementById(id)!));
  const framingGroups = slides.map((slide, index) => 'frameMembers' in slide
    ? slide.frameMembers.map(id => document.getElementById(id)!)
    : groups[index]);
  let frames: CameraView[] = [];
  let current = -1;
  let lastVisited = -1;
  let visible = -1;

  const buttons = slides.map(({ title }, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', `Slide ${index + 1} of ${slides.length}: ${title}`);
    button.addEventListener('click', () => open(index));
    progress.append(button);
    return button;
  });

  function framingArea() {
    const bounds = viewport.getBoundingClientRect();
    const left = progress.getBoundingClientRect().right + 12;
    const right = bounds.right;
    return {
      width: right - left,
      offsetX: (left + right) / 2 - bounds.left - viewport.clientWidth / 2,
    };
  }

  function frameFor(group: HTMLElement[], origin: DOMRect, cameraZoom: number, area: ReturnType<typeof framingArea>) {
    const rects = group.flatMap(item => [
      item.getBoundingClientRect(),
      ...Array.from(item.querySelectorAll(':scope > .regress-animation, :scope.regress-position > div'))
        .map(part => part.getBoundingClientRect()),
    ]);
    const left = Math.min(...rects.map(rect => rect.left));
    const right = Math.max(...rects.map(rect => rect.right));
    const top = Math.min(...rects.map(rect => rect.top));
    const bottom = Math.max(...rects.map(rect => rect.bottom));
    const width = (right - left) / cameraZoom;
    const height = (bottom - top) / cameraZoom;
    const zoom = Math.max(0.1, Math.min(Math.max(1, area.width) * 0.84 / width, viewport.clientHeight * 0.84 / height, 2.35));
    return {
      x: ((left + right) / 2 - origin.left) / cameraZoom - area.offsetX / zoom,
      y: ((top + bottom) / 2 - origin.top) / cameraZoom,
      zoom,
    };
  }

  function measure(cameraZoom: number) {
    const origin = world.getBoundingClientRect();
    const area = framingArea();
    frames = framingGroups.map(group => frameFor(group, origin, cameraZoom, area));
  }

  function showVisible(next: number) {
    if (next === visible) return;
    visible = next;
    onViewChange(next);
  }

  function locate(view: CameraView) {
    let next = -1;
    let nearest = 0.24;
    for (const [index, frame] of frames.entries()) {
      if (view.zoom < frame.zoom * 0.75) continue;
      const distance = Math.hypot(
        (view.x - frame.x) * frame.zoom / viewport.clientWidth,
        (view.y - frame.y) * frame.zoom / viewport.clientHeight,
      );
      if (distance < nearest) {
        next = index;
        nearest = distance;
      }
    }
    return next;
  }

  function updateVisible(view: CameraView, destination?: CameraView) {
    let next = locate(view);
    // Flying across another page is not entering it. Only reveal the
    // destination once the rendered camera has actually reached its vicinity.
    if (destination && next !== locate(destination)) next = -1;
    showVisible(next);
  }

  function update(view: CameraView) {
    const next = locate(view);
    if (next === current) return;
    current = next;
    if (next >= 0 && next !== lastVisited) {
      lastVisited = next;
      buttons.forEach((button, index) => {
        button.classList.toggle('is-past', index < lastVisited);
        if (index === lastVisited) button.setAttribute('aria-current', 'step');
        else button.removeAttribute('aria-current');
      });
    }
    onChange(current);
  }

  function open(index: number) {
    const frame = frames[index];
    if (!frame) return;
    navigate(frame);
    update(frame);
  }

  function step(direction: number) {
    const index = lastVisited === -1 ? 0 : Math.max(0, Math.min(slides.length - 1, lastVisited + direction));
    open(index);
  }

  return { measure, update, updateVisible, open, step };
}
