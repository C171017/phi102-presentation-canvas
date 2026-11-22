import { legendSlides } from './slide-content';

// The reviewed legend adds six entries beside the existing regress cluster.
export function addLegendEntries(world: HTMLElement) {
  const entries = legendSlides.filter(scene => !document.getElementById(scene.id));
  entries.forEach(({ id, title, background }, index) => {
    const slot = index + 1;
    const entry = document.createElement('div');
    entry.id = id;
    entry.className = 'canvas-label ink-ocean-entry';
    entry.style.left = `${-7150 + (slot % 4) * 315}px`;
    entry.style.top = `${-2900 + Math.floor(slot / 4) * 230}px`;
    const picture = document.createElement('img');
    picture.src = background;
    picture.alt = '';
    picture.loading = 'lazy';
    picture.draggable = false;
    const label = document.createElement('div');
    label.textContent = title;
    entry.append(picture, label);
    world.append(entry);
  });
}
