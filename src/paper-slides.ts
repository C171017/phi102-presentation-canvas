import { applicationPositions } from './application-map';
import { mountScene, scenes } from './scenes';

// The remaining slides follow Daniel Greco, “Contextualism about Foundations” (2017).
// Each slide is a title above one row of drawings. `cx` and `top` are source
// defaults only: once an object has a saved position in canvas-layout.json,
// the saved position wins, so editing these never moves an object the user placed.
type PaperSlide = { id: string; cx: number; sceneCenterX?: number; top: number; lane: string; section: string; title: string; text: string; scenes: string[] };
const GAP = 40, ROW = 152, TITLE_Y = 64;
const deck: PaperSlide[] = [
  { id: 'dilemma', cx: 3050, top: -1400, lane: '① Why accept it?', section: '§1', title: 'The foundationalist’s dilemma',
    text: 'What makes a belief fit to end a chain of reasons?', scenes: ['dilemma-cartesian', 'dilemma-moderate'] },
  { id: 'undoubted', cx: 4100, top: -1400, lane: '① Why accept it?', section: '§1', title: 'Undoubted, not undoubtable',
    text: 'Keep Descartes’s insight about doubt, but apply it locally', scenes: ['undoubted-crystal'] },
  { id: 'route-social', cx: 5350, sceneCenterX: 5480, top: -2920, lane: '① Route 1', section: '§2.1', title: 'Justification as a social activity',
    text: 'We justify to an audience, and audiences differ', scenes: ['route-social-scene', 'route-social-consensus'] },
  { id: 'route-hinges', cx: 5350, sceneCenterX: 5170, top: -2160, lane: '① Route 2', section: '§2.2', title: 'Hinges',
    text: 'Asking one question means holding others fixed', scenes: ['route-hinges-door'] },
  { id: 'route-knowledge', cx: 5350, top: -1400, lane: '① Route 3', section: '§2.3', title: 'Knowledge or belief at the base',
    text: 'Two familiar views turn flexible “without trying”', scenes: ['route-knowledge-scene'] },
  { id: 'versions-map', cx: 1850, top: -560, lane: '② Different versions', section: '§3', title: 'Routes and versions',
    text: 'How the routes from §2 connect to four views of foundational justification', scenes: ['versions-map-scene'] },
  { id: 'si', cx: 2900, top: -560, lane: '② Different versions', section: '§3', title: 'Social norms × Sensitive invariantism',
    text: 'The believer’s community helps determine which beliefs are foundational', scenes: ['si-scene', 'si-worry'] },
  { id: 'hinges-si', cx: 2080, top: -2889, lane: '② Different versions', section: '§3', title: 'Hinges × Sensitive invariantism',
    text: 'The inquiry changes which beliefs qualify as foundations', scenes: ['hinges-si-scene'] },
  { id: 'ctx', cx: 3950, top: -560, lane: '② Different versions', section: '§3', title: 'Social norms × Contextualism',
    text: 'The speaker’s community supplies the standards for what she says', scenes: ['ctx-evidence', 'ctx-criticism'] },
  { id: 'hinges-ctx', cx: 4520, top: -2889, lane: '② Different versions', section: '§3', title: 'Hinges × Contextualism',
    text: 'The inquiry the speaker is engaged in changes what the sentence says', scenes: ['hinges-ctx-scene'] },
  { id: 'disagree', cx: 5000, top: -560, lane: '② Different versions', section: '§3', title: 'The problem of disagreement',
    text: 'The community example motivates relativist and expressivist replies', scenes: ['disagree-scene', 'disagree-exits'] },
  { id: 'access', cx: 1850, top: 280, lane: '③ Applications', section: '§4.1', title: 'Access internalism',
    text: 'First-order justification guarantees higher-order justification', scenes: ['access-principle', 'access-doubt'] },
  { id: 'home', cx: 2900, top: 280, lane: '③ Applications', section: '§§4.1–4.2', title: 'Supervenience base',
    text: 'What fixes Justine’s first-order justification?', scenes: ['home-weather'] },
  { id: 'mobile', cx: 3950, top: 280, lane: '③ Applications', section: '§4.2', title: 'Flexible foundationalism',
    text: 'Which facts fix Justine’s grounds can shift with the context', scenes: ['mobile-scene'] },
  { id: 'conclusion', cx: 5000, top: 280, lane: 'Conclusion', section: '§5', title: 'Takeaways',
    text: 'One idea, a family of views, one payoff', scenes: ['conclusion-points', 'conclusion-scope'] },
];
function place(element: HTMLElement, x: number, y: number) {
  const position = applicationPositions[element.id];
  if (position) [x, y] = position;
  element.classList.add('canvas-label');
  element.style.left = `${x}px`;
  element.style.top = `${y}px`;
}

export function initializePaperSlides(world: HTMLElement) {
  for (const slide of deck) {
    const heading = document.createElement('div');
    heading.id = `${slide.id}-heading`;
    heading.className = 'slide-title';
    heading.classList.toggle('application-heading', heading.id in applicationPositions);
    const eyebrow = document.createElement('span');
    eyebrow.className = 'slide-eyebrow';
    eyebrow.textContent = `${slide.lane} · ${slide.section}`;
    const name = document.createElement('div');
    name.setAttribute('role', 'heading');
    name.setAttribute('aria-level', '1');
    name.textContent = slide.title;
    const text = document.createElement('p');
    text.className = 'label-description';
    text.textContent = slide.text;
    heading.append(eyebrow, name, text);
    place(heading, slide.cx, slide.top + TITLE_Y);
    world.append(heading);

    const width = slide.scenes.reduce((sum, id) => sum + scenes[id].w, 0) + GAP * (slide.scenes.length - 1);
    let left = (slide.sceneCenterX ?? slide.cx) - width / 2;
    for (const id of slide.scenes) {
      const scene = scenes[id];
      const host = document.createElement('div');
      host.id = id;
      host.dataset.scene = id;
      host.dataset.label = `${slide.title} illustration`;
      host.setAttribute('aria-label', 'mount' in scene ? scene.label : `${scene.label} Hover to replay the drawing.`);
      place(host, left + scene.w / 2, slide.top + ROW + scene.h / 2);
      mountScene(host);
      world.append(host);
      left += scene.w + GAP;
    }
  }
}
