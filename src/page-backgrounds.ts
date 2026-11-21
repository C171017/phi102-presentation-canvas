import { slides } from './slide-content';
import './page-backgrounds.css';

const backgroundByHeading = {
  'contemporary-heading': '01-context',
  'flexible-heading': '02-foundations',
  'aim-motivations': '03-reasons',
  'aim-versions': '04-versions',
  'aim-applications': '05-applications',
  'regress-problem': '06-regress',
  'dilemma-heading': '07-dilemma',
  'undoubted-heading': '08-undoubted',
  'route-social-heading': '09-social',
  'route-hinges-heading': '10-hinges',
  'route-knowledge-heading': '11-base',
  'versions-map-heading': '12-whose-context',
  'si-heading': '13-subject',
  'hinges-si-heading': '13-subject',
  'ctx-heading': '14-speaker',
  'hinges-ctx-heading': '14-speaker',
  'disagree-heading': '15-disagreement',
  'access-heading': '16-access',
  'home-heading': '17-home',
  'mobile-heading': '18-mobile-home',
} satisfies Record<(typeof slides)[number]['members'][0], string>;

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
  const loaded = new Map<string, Promise<string>>();
  let requested = -1;
  let activeLayer = 0;
  let revision = 0;

  function load(index: number): Promise<string> {
    const name = backgroundByHeading[slides[index].members[0]];
    const existing = loaded.get(name);
    if (existing) return existing;
    const src = `/generated/backgrounds/abstract-v1/${name}.webp`;
    const image = new Image();
    image.src = src;
    const ready = image.decode().then(() => src).catch(error => {
      loaded.delete(name);
      throw error;
    });
    loaded.set(name, ready);
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
