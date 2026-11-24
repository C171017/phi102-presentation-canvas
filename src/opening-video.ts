import './opening-video.css';

export function createOpeningVideo(shell: HTMLElement, source: string, continueToStory: () => void,
  { viewerControls, showSkip, reportPlayback }: {
    viewerControls: boolean; showSkip: boolean; reportPlayback?: (playing: boolean) => void;
  }) {
  const dialog = document.createElement('dialog');
  dialog.className = 'opening-video';
  dialog.setAttribute('aria-label', 'Flexible Foundationalism opening');
  dialog.innerHTML = `
    <div class="opening-screen">
      <video aria-label="Flexible Foundationalism opening video" playsinline preload="metadata" ${viewerControls ? 'controls' : ''}></video>
      ${showSkip ? `
        <button type="button" class="opening-skip" data-skip aria-keyshortcuts="PageDown">
          ${viewerControls ? '' : '<kbd aria-hidden="true">PgDn</kbd>'} Skip opening
        </button>` : ''}
      <footer hidden>
        <p role="status"></p>
        <button type="button" data-play>Play opening</button>
        ${showSkip ? '' : '<button type="button" data-skip>Skip opening</button>'}
      </footer>
    </div>`;
  const screen = dialog.querySelector<HTMLElement>('.opening-screen')!;
  const video = dialog.querySelector('video')!;
  const recovery = dialog.querySelector('footer')!;
  const status = dialog.querySelector('p')!;
  const playButton = dialog.querySelector<HTMLButtonElement>('[data-play]')!;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let finishing = false;
  let ink: HTMLElement | undefined;
  shell.append(dialog);

  function clearInk() {
    ink?.getAnimations({ subtree: true }).forEach(animation => animation.cancel());
    ink?.remove();
    ink = undefined;
  }

  function close() {
    if (!dialog.open) return;
    if (ink?.parentElement === screen) clearInk();
    video.pause();
    const fullscreen = document.fullscreenElement;
    const exit = fullscreen === screen || fullscreen === video
      ? document.exitFullscreen().catch(() => {}) : undefined;
    dialog.close();
    reportPlayback?.(false);
    return exit;
  }

  async function wipeToStory() {
    const overlay = document.createElement('div');
    overlay.className = 'opening-ink';
    overlay.setAttribute('aria-hidden', 'true');
    const sheet = document.createElement('div');
    sheet.className = 'opening-ink-sheet';
    overlay.append(sheet);
    ink = overlay;
    screen.append(overlay);

    // Native video fullscreen hides sibling elements. Start with the ink
    // already covering the page as the browser returns to the presentation.
    if (document.fullscreenElement !== video) {
      const cover = sheet.animate(
        [{ transform: 'translateX(-100%)' }, { transform: 'none' }],
        { duration: 370, easing: 'cubic-bezier(.5, 0, .26, 1)' },
      );
      await cover.finished.catch(() => {});
      if (ink !== overlay) return;
    }

    shell.append(overlay);
    const exit = close();
    continueToStory();
    await exit;
    if (ink !== overlay) return;

    const reveal = sheet.animate(
      [{ transform: 'none' }, { transform: 'translateX(100%)' }],
      { duration: 540, easing: 'cubic-bezier(.44, .04, .38, 1)', fill: 'forwards' },
    );
    await reveal.finished.catch(() => {});
    if (ink === overlay) clearInk();
  }

  function finish(naturalEnd = false) {
    if (!dialog.open || finishing) return;
    finishing = true;
    video.pause();
    screen.classList.add('is-finishing');
    recovery.hidden = true;
    if (naturalEnd && !reducedMotion.matches) {
      void wipeToStory();
    } else {
      close();
      continueToStory();
    }
  }
  function showRecovery(message: string, canPlay: boolean) {
    status.textContent = message;
    playButton.hidden = !canPlay;
    recovery.hidden = false;
  }
  function startPlayback() {
    preload();
    showRecovery('Loading opening…', false);
    void video.play().catch(() => {
      if (dialog.open && !finishing && !video.error && video.paused) {
        showRecovery('Press Play to start the opening.', true);
      }
    });
  }
  playButton.addEventListener('click', startPlayback);
  dialog.querySelectorAll('[data-skip]').forEach(button => button.addEventListener('click', () => finish()));
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'PageDown' || event.repeat) return;
    event.preventDefault();
    finish();
  });
  screen.addEventListener('fullscreenchange', event => {
    // The native video control bubbles its own fullscreen changes through the player.
    if (event.target === screen && document.fullscreenElement !== screen && !finishing) close();
  });
  video.addEventListener('ended', () => finish(true));
  video.addEventListener('playing', () => { recovery.hidden = true; });
  video.addEventListener('error', () => {
    if (dialog.open) showRecovery('The opening video could not load. Try playing it again.', true);
  });

  function preload() {
    if (!video.hasAttribute('src') || video.error) video.src = source;
  }

  function play() {
    if (dialog.open) return;
    clearInk();
    finishing = false;
    screen.classList.remove('is-finishing');
    recovery.hidden = true;
    preload();
    video.currentTime = 0;
    dialog.showModal();
    reportPlayback?.(true);
    startPlayback();
    if (!viewerControls && !document.fullscreenElement) void screen.requestFullscreen?.().catch(() => {});
  }

  return { preload, play, close, isOpen: () => dialog.open };
}
