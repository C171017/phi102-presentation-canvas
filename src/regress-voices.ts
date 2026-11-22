import './regress-voices.css';

// Centers and radii follow the five voices in the 1672 × 941 illustration.
const spotlights = [
  [642, 184, 171, 165],
  [1105, 177, 158, 156],
  [884, 344, 149, 132],
  [644, 481, 144, 135],
  [1043, 504, 113, 109],
] as const;

export function createRegressVoices(viewport: HTMLElement) {
  const overlay = document.createElement('div');
  overlay.className = 'regress-voice-overlay';
  overlay.hidden = true;
  overlay.setAttribute('aria-hidden', 'true');
  const art = document.createElement('div');
  art.className = 'regress-voice-art';
  overlay.append(art);
  viewport.append(overlay);

  function highlight(index?: number) {
    const spotlight = index === undefined ? undefined : spotlights[index];
    overlay.hidden = !spotlight;
    if (!spotlight) return;
    const [x, y, rx, ry] = spotlight;
    art.style.setProperty('--focus-x', `${x / 1672 * 100}%`);
    art.style.setProperty('--focus-y', `${y / 941 * 100}%`);
    art.style.setProperty('--focus-width', `${rx / 1672 * 100}%`);
    art.style.setProperty('--focus-height', `${ry / 941 * 100}%`);
  }

  return { highlight };
}
