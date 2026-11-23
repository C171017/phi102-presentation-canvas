import type { CameraView } from './layout';

import { slides } from './slide-content';

type FramingMode = 'classroom' | 'dialogue';

export function createSlideNavigation(world: HTMLElement, navigate: (view: CameraView, animate: boolean) => void, onChange: (index: number) => void) {
  const viewport = world.parentElement!;
  const progress = document.querySelector<HTMLElement>('#slide-progress')!;
  const transcript = document.querySelector<HTMLElement>('.transcript-panel')!;
  const groups = slides.map(({ members }) => members.map(id => document.getElementById(id)!));
  const framingGroups = slides.map((slide, index) => 'frameMembers' in slide && slide.frameMembers
    ? slide.frameMembers.map(id => document.getElementById(id)!)
    : groups[index]);
  const foregroundGroups = slides.map(({ members }, index) => members[0] === 'pairings-heading'
    ? framingGroups[index]
    : groups[index]);
  let frame: CameraView | undefined;
  let lastVisited = -1;
  let visible = -1;
  let previewingExit = false;
  let entering: number | undefined;
  let requested: { index: number } | undefined;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  const buttons = slides.map(({ title, members }, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.slide = members[0];
    button.setAttribute('aria-label', `Slide ${index + 1} of ${slides.length}: ${title}`);
    button.addEventListener('click', () => open(index));
    progress.append(button);
    return button;
  });

  groups.forEach((group, index) => {
    if (group[0].matches('#unitrans-arrival, #before-lecture, .legend-anchor')) return;
    const visuals = group.filter(item => item.matches('.canvas-media, .regress-hub, .regress-position, .pairing-card'));
    for (const item of visuals.length ? visuals : group) {
      item.dataset.slideEntry = String(index);
      item.tabIndex = 0;
    }
  });

  function entryFor(element: Element) {
    if (visible >= 0) return;
    const entry = element.closest<HTMLElement>('[data-slide-entry]')?.dataset.slideEntry;
    if (entry !== undefined) return Number(entry);
  }

  world.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) return;
    const element = event.target as Element;
    if (element.closest('.resize-handle, input, textarea, select, a, [contenteditable="true"]')) return;
    const index = entryFor(element);
    if (index === undefined) return;
    event.preventDefault();
    event.stopPropagation();
    open(index, true);
  }, { capture: true });

  world.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.isComposing || event.shiftKey || event.metaKey || event.ctrlKey || event.altKey ||
        (event.key !== 'Enter' && event.key !== ' ')) return;
    const element = event.target as HTMLElement;
    if (element.dataset.slideEntry === undefined) return;
    const index = entryFor(element);
    if (index === undefined) return;
    event.preventDefault();
    if (!event.repeat) open(index, true);
  }, { capture: true });

  function framingArea(mode?: FramingMode) {
    const bounds = viewport.getBoundingClientRect();
    const left = progress.getBoundingClientRect().right + 12;
    // The paper overlays the slide. Frame against the viewport at every pane width.
    const right = mode === 'classroom' ? left + (bounds.right - left) * .53 : bounds.right;
    let top = 0;
    let bottom = viewport.clientHeight;
    if (mode === 'classroom' || mode === 'dialogue') {
      const style = getComputedStyle(transcript);
      top = Math.min(48, bottom * .08);
      bottom -= parseFloat(style.height) + parseFloat(style.bottom);
    }
    return {
      height: bottom - top,
      width: right - left,
      offsetX: (left + right) / 2 - bounds.left - viewport.clientWidth / 2,
      offsetY: (top + bottom - viewport.clientHeight) / 2,
    };
  }

  function frameFor(group: HTMLElement[], origin: DOMRect, cameraZoom: number, area: ReturnType<typeof framingArea>) {
    const rects = group.flatMap(item => [
      item.getBoundingClientRect(),
      ...Array.from(item.querySelectorAll(':scope > .regress-animation, :scope.regress-position > div, :scope > .cast-view, :scope > .cast-name, :scope > .cast-role'))
        .map(part => part.getBoundingClientRect()),
    ]);
    const left = Math.min(...rects.map(rect => rect.left));
    const right = Math.max(...rects.map(rect => rect.right));
    const top = Math.min(...rects.map(rect => rect.top));
    const bottom = Math.max(...rects.map(rect => rect.bottom));
    const width = (right - left) / cameraZoom;
    const height = (bottom - top) / cameraZoom;
    const zoom = Math.max(0.1, Math.min(Math.max(1, area.width) * 0.84 / width, Math.max(1, area.height) * 0.84 / height, 2.35));
    return {
      x: ((left + right) / 2 - origin.left) / cameraZoom - area.offsetX / zoom,
      y: ((top + bottom) / 2 - origin.top) / cameraZoom - area.offsetY / zoom,
      zoom,
    };
  }

  function framingMode(index: number): FramingMode | undefined {
    const heading = slides[index].members[0];
    if (heading === 'contemporary-heading') return 'classroom';
    if (heading === 'flexible-heading') return 'dialogue';
  }

  function measure(cameraZoom: number) {
    const index = entering ?? visible;
    if (index < 0) return;
    frame = frameFor(framingGroups[index], world.getBoundingClientRect(), cameraZoom, framingArea(framingMode(index)));
  }

  function isAligned(view: CameraView, frame: CameraView) {
    return Math.abs(view.zoom / frame.zoom - 1) < .002 &&
      Math.hypot(view.x - frame.x, view.y - frame.y) * frame.zoom < 1;
  }

  function refit(view: CameraView) {
    if (!previewingExit && (entering !== undefined || visible >= 0) && frame && !isAligned(view, frame)) return frame;
  }

  function setVisible(next: number) {
    if (next === visible) return;
    foregroundGroups[visible]?.forEach(item => item.classList.remove('page-foreground'));
    foregroundGroups[next]?.forEach(item => item.classList.add('page-foreground'));
    visible = next;
    viewport.classList.toggle('is-page-focused', next >= 0);
    if (next >= 0 && next !== lastVisited) {
      lastVisited = next;
      buttons.forEach((button, index) => {
        button.classList.toggle('is-past', index < lastVisited);
        if (index === lastVisited) button.setAttribute('aria-current', 'step');
        else button.removeAttribute('aria-current');
      });
    }
    onChange(next);
  }

  function update(settled: boolean) {
    if (!settled || entering === undefined) return;
    const next = entering;
    entering = undefined;
    setVisible(next);
  }

  function open(index: number, fromCanvas = false) {
    if (!framingGroups[index]) return;
    const request = { index };
    requested = request;
    const showPage = () => {
      if (requested !== request) return;
      requested = undefined;
      entering = index;
      viewport.classList.toggle('from-canvas', fromCanvas);
      // Use the rendered scale, including when a new click interrupts a camera move.
      const transform = getComputedStyle(world).transform;
      measure(transform === 'none' ? 1 : new DOMMatrixReadOnly(transform).a);
      navigate(frame!, fromCanvas);
    };
    if (!fromCanvas && visible >= 0 && visible !== index && document.startViewTransition && !reducedMotion.matches) {
      document.startViewTransition(showPage);
    } else {
      showPage();
    }
  }

  function step(direction: number) {
    const from = requested?.index ?? entering ?? lastVisited;
    const index = from === -1 ? 0 : Math.max(0, Math.min(slides.length - 1, from + direction));
    open(index);
  }

  function cancelOpening() {
    requested = undefined;
    entering = undefined;
  }

  return {
    measure, refit, update, open, step, entryFor, cancelOpening, isFocused: () => visible >= 0,
    previewExit(active: boolean) { previewingExit = active; },
    leavePage() {
      cancelOpening();
      viewport.classList.remove('from-canvas');
      setVisible(-1);
    },
  };
}
