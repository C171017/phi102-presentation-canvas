import { legendSlides } from './slide-content';

const anchorSlots: Record<string, number> = {
  L2: 1,
  L3: 2,
  L4: 3,
  L6: 6,
  L0: 7,
  'regress-problem-birth': 8,
  'L3-continued': 9,
  L7: 17,
  P1: 20,
  'L6-A': 18,
  'L6-B': 19,
};

// Story slides without a canvas illustration still need a camera target.
export function addLegendAnchors(world: HTMLElement) {
  const scenes = legendSlides.filter(scene => !document.getElementById(scene.id));
  scenes.forEach(({ id }, index) => {
    const slot = anchorSlots[id] ?? index + 10;
    const anchor = document.createElement('div');
    anchor.id = id;
    anchor.className = 'legend-anchor';
    anchor.inert = true;
    anchor.style.left = `${-7150 + (slot % 4) * 315}px`;
    anchor.style.top = `${-2900 + Math.floor(slot / 4) * 230}px`;
    world.append(anchor);
  });
}
