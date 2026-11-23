import { legendSlides } from './slide-content';

// Story slides without a canvas illustration still need a camera target.
export function addLegendAnchors(world: HTMLElement) {
  const scenes = legendSlides.filter(scene => !document.getElementById(scene.id));
  scenes.forEach(({ id }, index) => {
    const slot = index + 1;
    const anchor = document.createElement('div');
    anchor.id = id;
    anchor.className = 'legend-anchor';
    anchor.inert = true;
    anchor.style.left = `${-7150 + (slot % 4) * 315}px`;
    anchor.style.top = `${-2900 + Math.floor(slot / 4) * 230}px`;
    world.append(anchor);
  });
}
