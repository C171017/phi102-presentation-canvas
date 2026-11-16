import { slides } from './slide-content';
import './page-backgrounds.css';

// The order follows the argument, not the physical positions on the canvas.
export const backgroundNames = [
  '01-context', '02-foundations', '03-reasons', '04-versions', '05-applications',
  '06-regress', '07-dilemma', '08-undoubted', '09-social', '10-hinges', '11-base',
  '12-whose-context', '13-subject', '14-speaker', '15-disagreement', '16-access',
  '17-home', '18-mobile-home', '19-takeaways',
];

export function createPageBackgrounds(viewport: HTMLElement) {
  const stage = document.createElement('div');
  stage.className = 'page-background';
  stage.setAttribute('aria-hidden', 'true');
  const layers = [new Image(), new Image()];
  for (const layer of layers) {
    layer.alt = '';
    layer.decoding = 'async';
    layer.draggable = false;
    stage.append(layer);
  }
  viewport.prepend(stage);
  const members = slides.map(slide => slide.members.map(id => document.getElementById(id)!));
  const loaded = new Map<number, Promise<string>>();
  let requested = -1;
  let activeLayer = 0;
  let revision = 0;

  function load(index: number): Promise<string> {
    const existing = loaded.get(index);
    if (existing) return existing;
    const src = `/generated/backgrounds/abstract-v1/${backgroundNames[index]}.webp`;
    const image = new Image();
    image.src = src;
    const ready = image.decode().then(() => src).catch(error => {
      loaded.delete(index);
      throw error;
    });
    loaded.set(index, ready);
    return ready;
  }

  function update(index: number) {
    if (index === requested) return;
    requested = index;
    const ticket = ++revision;
    members.forEach((group, i) => group.forEach(item => item.classList.toggle('page-foreground', i === index)));
    if (index < 0 || index >= slides.length) {
      viewport.classList.remove('in-page-view');
      delete stage.dataset.slide;
      return;
    }
    void load(index).then(src => {
      // A late decode must never resurrect artwork after zooming out or
      // overwrite a newer page during rapid navigation.
      if (ticket !== revision) return;
      const next = 1 - activeLayer;
      layers[next].src = src;
      layers[next].classList.add('is-visible');
      layers[activeLayer].classList.remove('is-visible');
      activeLayer = next;
      stage.dataset.slide = String(index + 1);
      viewport.classList.add('in-page-view');
      for (const neighbor of [index - 1, index + 1]) {
        if (neighbor >= 0 && neighbor < slides.length) void load(neighbor).catch(() => {});
      }
    }).catch(error => {
      if (ticket !== revision) return;
      viewport.classList.remove('in-page-view');
      delete stage.dataset.slide;
      console.warn(`Background unavailable for page ${index + 1}.`, error);
    });
  }

  function dispose() {
    revision++;
    stage.remove();
    viewport.classList.remove('in-page-view');
    members.flat().forEach(item => item.classList.remove('page-foreground'));
  }
  return { update, dispose };
}
