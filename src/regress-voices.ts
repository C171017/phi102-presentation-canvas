import './regress-voices.css';

// Points follow the five illustrated voices in the 1672 × 941 backgrounds.
const labelPositions = {
  'regress-problem': [[644, 44], [1110, 44], [878, 225], [640, 356], [1141, 397]],
  'regress-skepticism': [[180, 36], [432, 127], [611, 220], [757, 316], [884, 393]],
  'regress-infinitism': [[233, 38], [570, 39], [881, 48], [1151, 91], [1392, 202]],
  'regress-coherentism': [[879, 31], [356, 168], [1379, 147], [407, 415], [1088, 463]],
  'regress-foundationalism': [[1111, 94], [1054, 249], [1044, 379], [1037, 482], [1072, 581]],
} as const;

const spotlights = [
  [642, 184, 171, 165],
  [1105, 177, 158, 156],
  [884, 344, 149, 132],
  [644, 481, 144, 135],
  [1043, 504, 113, 109],
] as const;

type Scene = keyof typeof labelPositions;

export function createRegressVoices(viewport: HTMLElement) {
  const overlay = document.createElement('div');
  overlay.className = 'regress-voice-overlay';
  overlay.hidden = true;
  overlay.setAttribute('aria-hidden', 'true');
  const art = document.createElement('div');
  art.className = 'regress-voice-art';
  const labels = ['Y', 'Y', 'Y', 'Y', 'SOWHAT'].map(name => {
    const label = document.createElement('span');
    label.className = 'regress-voice-label';
    label.textContent = name;
    art.append(label);
    return label;
  });
  overlay.append(art);
  viewport.append(overlay);

  function highlight(index?: number) {
    const spotlight = index === undefined ? undefined : spotlights[index];
    art.classList.toggle('has-speaker', spotlight !== undefined);
    labels.forEach((label, i) => label.classList.toggle('is-speaking', i === index));
    if (!spotlight) return;
    const [x, y, rx, ry] = spotlight;
    art.style.setProperty('--focus-x', `${x / 1672 * 100}%`);
    art.style.setProperty('--focus-y', `${y / 941 * 100}%`);
    art.style.setProperty('--focus-width', `${rx / 1672 * 100}%`);
    art.style.setProperty('--focus-height', `${ry / 941 * 100}%`);
  }

  function showScene(scene?: Scene) {
    overlay.hidden = !scene;
    highlight();
    if (!scene) return;
    labelPositions[scene].forEach(([x, y], index) => {
      labels[index].style.left = `${x / 1672 * 100}%`;
      labels[index].style.top = `${y / 941 * 100}%`;
    });
  }

  return { showScene, highlight };
}
