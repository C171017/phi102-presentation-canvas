import simone from './assets/version-portraits/simone.webp';
import cole from './assets/version-portraits/cole.webp';
import rae from './assets/version-portraits/rae.webp';
import echo from './assets/version-portraits/echo-canopy.webp';
import './version-pairings.css';

import { cast, pairingView, versionPairings } from './version-pairings';

const portraits = { simone, cole, rae, echo };

export function initializeVersionPairings(world: HTMLElement) {
  const heading = document.createElement('div');
  heading.id = 'pairings-heading';
  heading.className = 'canvas-label pairing-heading';
  heading.dataset.label = 'Routes × versions';
  heading.style.top = '-3390px';
  heading.innerHTML = '<h2>Routes × versions</h2><p>Wider cards indicate more discussion in Greco. Shared passages are divided between the relevant pairings.</p>';
  world.append(heading);

  const largest = Math.max(...versionPairings.map(pairing => pairing.words));
  const start = -120;
  let left = start;
  let previousRoute = '';
  for (const pairing of versionPairings) {
    if (previousRoute && previousRoute !== pairing.route && pairing.id !== 'pairing-belief') left += 42;
    previousRoute = pairing.route;
    const width = 365 + Math.round(pairing.words * 0.76);
    const card = document.createElement('article');
    card.id = pairing.id;
    card.className = 'canvas-label pairing-card';
    card.dataset.label = `${pairing.route} × ${pairingView(pairing)}`;
    card.style.width = `${width}px`;
    card.style.left = `${left + width / 2}px`;
    card.style.top = '-3060px';
    left += width + 22;

    const character = pairing.character ? cast[pairing.character] : undefined;
    card.style.setProperty('--pairing-ink', character?.color ?? '#775c3a');
    card.style.setProperty('--coverage', `${pairing.words / largest * 100}%`);
    const label = document.createElement('header');
    if (pairing.character) {
      const portrait = new Image(98, 98);
      portrait.src = portraits[pairing.character];
      portrait.alt = '';
      portrait.decoding = 'async';
      portrait.draggable = false;
      label.append(portrait);
    }
    const identity = document.createElement('div');
    const route = document.createElement('p');
    route.className = 'pairing-route';
    route.textContent = pairing.route;
    const title = document.createElement('h3');
    title.textContent = pairingView(pairing);
    identity.append(route, title);
    if (character) {
      const name = document.createElement('p');
      name.className = 'pairing-name';
      name.textContent = character.name;
      identity.append(name);
    }
    label.append(identity);
    const summary = document.createElement('p');
    summary.className = 'pairing-summary';
    summary.textContent = pairing.summary;
    const coverage = document.createElement('footer');
    coverage.textContent = `≈${pairing.words} words · ${pairing.pages.length === 3 ? 'p.' : 'pp.'} ${pairing.pages}`;
    card.append(label, summary, coverage);
    world.append(card);
  }
  heading.style.left = `${(start + left - 22) / 2}px`;
}
