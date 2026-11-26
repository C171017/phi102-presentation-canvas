import type { CameraView } from './layout';

import { slides } from './slide-content';
import { trialArt } from './trial-art';
import { createSlideProgress } from './slide-progress';
import { inkPassages } from './ink-ocean-scenes';

type FramingMode = 'classroom' | 'dialogue';

export function createSlideNavigation(world: HTMLElement, navigate: (view: CameraView, animate: boolean) => void, onChange: (index: number) => void) {
  const viewport = world.parentElement!;
  const progress = document.querySelector<HTMLElement>('#slide-progress')!;
  const transcript = document.querySelector<HTMLElement>('.transcript-panel')!;
  const groups = slides.map(({ members }) => members.map(id => document.getElementById(id)!));
  const framingGroups = slides.map((slide, index) => 'frameMembers' in slide && slide.frameMembers
    ? slide.frameMembers.map(id => document.getElementById(id)!)
    : groups[index]);
  const foregroundGroups = slides.map(({ members }, index) => (members[0] === 'pairings-heading' || inkPassages.has(members[0]))
    ? framingGroups[index]
    : groups[index]);
  let frame: CameraView | undefined;
  let lastVisited = -1;
  let visible = -1;
  let previewingExit = false;
  let entering: number | undefined;
  let requested: { index: number } | undefined;
  let sceneTransition: HTMLElement | undefined;
  let stopDoorPlayback: (() => void) | undefined;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const doorVideo = document.createElement('video');
  doorVideo.muted = true;
  doorVideo.playsInline = true;
  doorVideo.preload = 'auto';
  const doorVideoSource = '/generated/backgrounds/ink-ocean/door-world-transition.mp4';

  const slideProgress = createSlideProgress(progress, index => open(index));

  groups.forEach((group, index) => {
    const entries = group.filter(item => !item.matches('#unitrans-arrival, #before-lecture, .legend-anchor'));
    const visuals = entries.filter(item => item.matches('.canvas-media, .regress-hub, .regress-position, .pairing-card'));
    for (const item of visuals.length ? visuals : entries) {
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
    if (slides[next]?.members[0] === 'P1' && !reducedMotion.matches && !doorVideo.hasAttribute('src')) {
      doorVideo.src = doorVideoSource;
    }
    if (next >= 0 && next !== lastVisited) {
      lastVisited = next;
      slideProgress.showCurrent(next);
    }
    onChange(next);
  }

  function update(settled: boolean) {
    if (!settled || entering === undefined) return;
    const next = entering;
    entering = undefined;
    setVisible(next);
  }

  function clearSceneTransition() {
    const overlay = sceneTransition;
    sceneTransition = undefined;
    stopDoorPlayback?.();
    stopDoorPlayback = undefined;
    overlay?.getAnimations({ subtree: true }).forEach(animation => animation.cancel());
    overlay?.remove();
  }

  async function fadeIntoTrial(showPage: () => void) {
    const overlay = document.createElement('div');
    overlay.className = 'trial-entrance-fade';
    viewport.parentElement!.append(overlay);
    sceneTransition = overlay;
    const duration = 480;
    try {
      await overlay.animate({ opacity: [0, 1] }, { duration, easing: 'ease-in', fill: 'forwards' }).finished;
      if (sceneTransition !== overlay) return;
      showPage();
      await overlay.animate({ opacity: [1, 0] }, { duration, delay: 160, easing: 'ease-out', fill: 'both' }).finished;
    } catch (error) {
      if (sceneTransition === overlay) throw error;
    } finally {
      if (sceneTransition === overlay) clearSceneTransition();
    }
  }

  function playDoorTransition(showPage: () => void) {
    const overlay = document.createElement('div');
    overlay.className = 'door-world-transition';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.style.backgroundImage = `url("${trialArt.doorTransitionStart}")`;
    overlay.append(doorVideo);
    viewport.parentElement!.append(overlay);
    viewport.setAttribute('data-door-transition', '');
    sceneTransition = overlay;

    const playback = new AbortController();
    const events = { signal: playback.signal };
    const finish = () => { if (sceneTransition === overlay) clearSceneTransition(); };
    const timeout = window.setTimeout(finish, 9000);
    stopDoorPlayback = () => {
      playback.abort();
      clearTimeout(timeout);
      doorVideo.pause();
      viewport.removeAttribute('data-door-transition');
    };
    if (!doorVideo.hasAttribute('src') || doorVideo.error) doorVideo.src = doorVideoSource;
    if (doorVideo.readyState > HTMLMediaElement.HAVE_NOTHING) doorVideo.currentTime = 0;
    doorVideo.addEventListener('playing', () => overlay.setAttribute('data-playing', ''), events);
    doorVideo.addEventListener('ended', finish, events);
    doorVideo.addEventListener('error', finish, events);
    // Paint and report the new slide under the clip so room followers start in sync.
    showPage();
    void doorVideo.play().catch(finish);
  }

  function open(index: number, fromCanvas = false, immediate = false) {
    if (!framingGroups[index]) return;
    if (sceneTransition && index === (requested?.index ?? visible)) return;
    clearSceneTransition();
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
    const from = slides[visible]?.members[0];
    const to = slides[index].members[0];
    if (immediate || fromCanvas || reducedMotion.matches) {
      showPage();
    } else if (from === 'P1' && to === 'P2-arrival' &&
        viewport.parentElement!.querySelector('.trial-screen[data-door-exit]:not([hidden])')) {
      playDoorTransition(showPage);
    } else if (from === 'L7' && to === 'P1') {
      void fadeIntoTrial(showPage);
    } else if (visible >= 0 && visible !== index && document.startViewTransition) {
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
    clearSceneTransition();
  }

  return {
    measure, refit, update, open, step, entryFor, cancelOpening,
    cutTo: (index: number) => open(index, false, true), isFocused: () => visible >= 0,
    isOnCanvas: () => visible < 0 && entering === undefined,
    previewExit(active: boolean) { previewingExit = active; },
    leavePage() {
      cancelOpening();
      viewport.classList.remove('from-canvas');
      setVisible(-1);
    },
  };
}
