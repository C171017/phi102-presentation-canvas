import { mountScene, scenes } from './scenes';

// Slides 7–19: the rest of Daniel Greco, “Contextualism about Foundations” (2017).
// Each slide is a title above one row of drawings. `cx` and `top` are source
// defaults only: once an object has a saved position in canvas-layout.json,
// the saved position wins, so editing these never moves an object the user placed.
type PaperSlide = { id: string; cx: number; top: number; lane: string; section: string; title: string; text: string; scenes: string[] };
const GAP = 40, ROW = 152, TITLE_Y = 64;
const deck: PaperSlide[] = [
  { id: 'dilemma', cx: 3050, top: -1400, lane: '① Why accept it?', section: '§1', title: 'The foundationalist’s dilemma',
    text: 'What makes a belief fit to end a chain of reasons?', scenes: ['dilemma-cartesian', 'dilemma-moderate'] },
  { id: 'undoubted', cx: 4100, top: -1400, lane: '① Why accept it?', section: '§1', title: 'Undoubted, not undoubtable',
    text: 'Keep Descartes’s insight about doubt, but apply it locally.', scenes: ['undoubted-logic', 'undoubted-standards'] },
  { id: 'route-social', cx: 5350, top: -2920, lane: '① Route 1', section: '§2.1', title: 'Justification as a social activity',
    text: 'We justify to an audience, and audiences differ.', scenes: ['route-social-scene', 'route-social-worry'] },
  { id: 'route-hinges', cx: 5350, top: -2160, lane: '① Route 2', section: '§2.2', title: 'Hinges',
    text: 'Asking one question means holding others fixed.', scenes: ['route-hinges-door', 'route-hinges-swap'] },
  { id: 'route-knowledge', cx: 5350, top: -1400, lane: '① Route 3', section: '§2.3', title: 'Knowledge or belief at the base',
    text: 'Two familiar views turn flexible “without trying”.', scenes: ['route-knowledge-scene'] },
  { id: 'versions-map', cx: 1850, top: -560, lane: '② Different versions', section: '§3', title: 'Whose context?',
    text: 'Four ways context could matter to “foundationally justified”.', scenes: ['versions-map-scene'] },
  { id: 'si', cx: 2900, top: -560, lane: '② Different versions', section: '§3', title: 'Sensitive invariantism',
    text: 'One meaning; the subject’s situation helps settle the status.', scenes: ['si-scene', 'si-worry'] },
  { id: 'ctx', cx: 3950, top: -560, lane: '② Different versions', section: '§3', title: 'Contextualism',
    text: 'What the sentence says depends on the speaker’s context.', scenes: ['ctx-evidence', 'ctx-criticism'] },
  { id: 'disagree', cx: 5000, top: -560, lane: '② Different versions', section: '§3', title: 'The problem of disagreement',
    text: 'Is criticism from the speaker’s own standpoint enough?', scenes: ['disagree-scene', 'disagree-exits'] },
  { id: 'access', cx: 1850, top: 280, lane: '③ Applications', section: '§4.1', title: '(Access)',
    text: 'A strong internalist principle, and one reason to want it.', scenes: ['access-principle', 'access-doubt'] },
  { id: 'home', cx: 2900, top: 280, lane: '③ Applications', section: '§4.1', title: 'The catch: a cognitive home?',
    text: '(Access) seems to need facts that can never be hidden from us.', scenes: ['home-weather', 'home-cartesian'] },
  { id: 'mobile', cx: 3950, top: 280, lane: '③ Applications', section: '§4.2', title: 'A cognitive mobile home',
    text: 'Each context fixes a local base the subject counts as able to know.', scenes: ['mobile-scene'] },
  { id: 'conclusion', cx: 5000, top: 280, lane: 'Conclusion', section: '§5', title: 'Takeaways',
    text: 'One idea, a family of views, one payoff.', scenes: ['conclusion-points', 'conclusion-scope'] },
];
// Arrows run from the right edge of the first object to the left edge of the second.
const links: [string, string][] = [
  ['foundation-question', 'dilemma-heading'], ['dilemma-heading', 'undoubted-heading'],
  ['undoubted-heading', 'route-social-heading'], ['undoubted-heading', 'route-hinges-heading'], ['undoubted-heading', 'route-knowledge-heading'],
  ['aim-versions', 'versions-map-heading'], ['versions-map-heading', 'si-heading'], ['si-heading', 'ctx-heading'], ['ctx-heading', 'disagree-heading'],
  ['aim-applications', 'access-heading'], ['access-heading', 'home-heading'], ['home-heading', 'mobile-heading'], ['mobile-heading', 'conclusion-heading'],
];

function place(element: HTMLElement, x: number, y: number) {
  element.classList.add('canvas-label');
  element.tabIndex = 0;
  element.style.left = `${x}px`;
  element.style.top = `${y}px`;
}

export function initializePaperSlides(world: HTMLElement) {
  for (const slide of deck) {
    const heading = document.createElement('div');
    heading.id = `${slide.id}-heading`;
    heading.className = 'slide-title';
    heading.setAttribute('aria-describedby', 'label-instructions');
    const eyebrow = document.createElement('span');
    eyebrow.className = 'slide-eyebrow';
    eyebrow.textContent = `${slide.lane} · ${slide.section}`;
    const name = document.createElement('div');
    name.textContent = slide.title;
    const text = document.createElement('p');
    text.className = 'label-description';
    text.textContent = slide.text;
    heading.append(eyebrow, name, text);
    place(heading, slide.cx, slide.top + TITLE_Y);
    world.append(heading);

    const width = slide.scenes.reduce((sum, id) => sum + scenes[id].w, 0) + GAP * (slide.scenes.length - 1);
    let left = slide.cx - width / 2;
    for (const id of slide.scenes) {
      const scene = scenes[id];
      const host = document.createElement('div');
      host.id = id;
      host.dataset.scene = id;
      host.dataset.label = `${slide.title} illustration`;
      host.setAttribute('aria-label', `${scene.label} Hover to replay the drawing. Drag or use arrow keys to move.`);
      place(host, left + scene.w / 2, slide.top + ROW + scene.h / 2);
      mountScene(host);
      world.append(host);
      left += scene.w + GAP;
    }
  }
  const connections = document.getElementById('connections');
  if (!connections) return;
  for (const [source, target] of links) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.dataset.source = source;
    path.dataset.target = target;
    path.setAttribute('marker-end', 'url(#aim-arrow)');
    connections.append(path);
  }
  connections.setAttribute('aria-label', `${connections.getAttribute('aria-label')} Each aim then leads through its slides: the dilemma, undoubted foundations and three routes; the four versions; and the access principle, the cognitive home, the mobile home and the takeaways.`);
}
