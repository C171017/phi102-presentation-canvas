import { legendSlides } from './slide-content';
import { inkPassages } from './ink-ocean-scenes';

const anchorSlots: Record<string, number> = {
  L2: 1,
  L3: 2,
  L4: 3,
  L0: 7,
  'regress-problem-birth': 8,
  'L3-continued': 9,
  L7: 17,
  P1: 20,
  'L6-A': 18,
  'L6-B': 19,
  'P2-arrival': 21,
  'P2-1': 21,
  'P2-2a': 22,
  'P2-2b': 23,
  'P2-2c': 24,
  'P2-3': 25,
  'P2-4': 26,
  'P2-5': 27,
  'P2-6': 28,
  'P2-7': 29,
};

// Story slides without a canvas illustration still need a camera target.
export function addLegendAnchors(world: HTMLElement) {
  const sceneIds = legendSlides.flatMap(({ id }) => [id, ...(inkPassages.get(id) ?? [])]);
  const anchors = sceneIds.filter(id => !document.getElementById(id));
  anchors.forEach((id, index) => {
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
