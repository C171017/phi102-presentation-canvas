const musicVolume = 0.18;
const fadeInMs = 400;
const fadeOutMs = 1800;

export function createDoorClosingMusic(stage: HTMLElement) {
  const music = new Audio('/music/suzume-original.mp3');
  music.className = 'door-closing-music';
  music.preload = 'none';
  music.loop = false;
  music.hidden = true;
  music.volume = 0;
  stage.append(music);

  let inRange = false;
  let armed = false;
  let played = false;
  let starting = false;
  let frame = 0;
  let fadeDeadline = 0;

  function clearFade() {
    cancelAnimationFrame(frame);
    window.clearTimeout(fadeDeadline);
  }

  function fadeTo(volume: number, duration: number, done?: () => void) {
    clearFade();
    const from = music.volume;
    const start = performance.now();
    function step(now: number) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = progress * progress * (3 - 2 * progress);
      music.volume = from + (volume - from) * eased;
      if (progress < 1) frame = requestAnimationFrame(step);
    }
    frame = requestAnimationFrame(step);
    // Finish even if the browser suspends animation frames in a background tab.
    fadeDeadline = window.setTimeout(() => {
      cancelAnimationFrame(frame);
      music.volume = volume;
      done?.();
    }, duration);
  }

  function start() {
    if (!armed || played || starting || document.hidden) return;
    starting = true;
    void music.play().then(() => {
      starting = false;
      played = true;
      if (inRange) fadeTo(musicVolume, fadeInMs);
      else music.pause();
    }, () => {
      starting = false;
    });
  }

  // A viewer following remotely may need a gesture before the browser permits audio.
  document.addEventListener('click', start);
  document.addEventListener('keydown', start);
  document.addEventListener('visibilitychange', start);
  music.addEventListener('ended', clearFade);

  return function showScene(scene?: string) {
    const wasInRange = inRange;
    inRange = scene === 'P2-6' || scene === 'P2-7';
    if (scene === 'P2-6') armed = true;
    if (inRange) start();
    else if (wasInRange) {
      armed = false;
      if (starting) music.pause();
      else if (!music.paused && !music.ended) fadeTo(0, fadeOutMs, () => music.pause());
    }
  };
}
