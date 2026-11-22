import './opening-video.css';

export function createOpeningVideo(shell: HTMLElement, source: string, continueToStory: () => void,
  { showSkip, reportPlayback }: { showSkip: boolean; reportPlayback?: (playing: boolean) => void }) {
  const dialog = document.createElement('dialog');
  dialog.className = 'opening-video';
  dialog.setAttribute('aria-label', 'Dead Ink opening');
  dialog.innerHTML = `
    <div class="opening-screen">
      <video aria-label="Dead Ink opening video" playsinline preload="auto"></video>
      ${showSkip ? `
        <button type="button" class="opening-skip" data-skip aria-keyshortcuts="PageDown">
          <kbd aria-hidden="true">PgDn</kbd> Skip intro
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
  let finishing = false;
  shell.append(dialog);

  function close() {
    if (!dialog.open) return;
    video.pause();
    dialog.close();
    if (document.fullscreenElement === screen) void document.exitFullscreen().catch(() => {});
    reportPlayback?.(false);
  }
  function finish() {
    if (!dialog.open || finishing) return;
    finishing = true;
    video.pause();
    screen.classList.add('is-finishing');
    continueToStory();
  }
  function showRecovery(message: string, canPlay: boolean) {
    status.textContent = message;
    playButton.hidden = !canPlay;
    recovery.hidden = false;
  }
  function startPlayback() {
    void video.play().catch(() => {
      if (dialog.open && !finishing && !video.error && video.paused) {
        showRecovery('Press Play to start the opening.', true);
      }
    });
  }
  playButton.addEventListener('click', startPlayback);
  dialog.querySelectorAll('[data-skip]').forEach(button => button.addEventListener('click', finish));
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'PageDown' || event.repeat) return;
    event.preventDefault();
    finish();
  });
  screen.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement !== screen && !finishing) close();
  });
  video.addEventListener('ended', finish);
  video.addEventListener('playing', () => { recovery.hidden = true; });
  video.addEventListener('error', () => { showRecovery('The opening video could not load.', false); });

  function preload() {
    if (!video.hasAttribute('src') || video.error) video.src = source;
  }

  function play() {
    if (dialog.open) return;
    finishing = false;
    screen.classList.remove('is-finishing');
    recovery.hidden = true;
    preload();
    video.currentTime = 0;
    dialog.showModal();
    reportPlayback?.(true);
    startPlayback();
    if (!document.fullscreenElement) void screen.requestFullscreen?.().catch(() => {});
  }

  return { preload, play, close, isOpen: () => dialog.open };
}
