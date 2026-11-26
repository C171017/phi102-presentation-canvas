import simone from './assets/full-body-cast/simone.webp';
import simoneTrial from './assets/version-portraits/simone-trial.webp';
import cole from './assets/full-body-cast/cole.webp';
import rae from './assets/full-body-cast/rae.webp';
import echo from './assets/full-body-cast/echo.webp';
import dryInk from './assets/foundations/undoubted-dry.webp';
import { gavelArtwork } from './gavel-scene';
import { hingeArtwork } from './hinge-door';
import { knowledgeLetterArtwork } from './knowledge-pipeline';
import './version-pairings.css';

import { cast, pairingView, versionPairings } from './version-pairings';

const figures = { simone, cole, rae, echo };
const routeArtwork = {
  'Social norms': gavelArtwork,
  Hinges: hingeArtwork,
  'Knowledge at the base': null,
  'Belief at the base': dryInk,
};

function illustration(src: string, className: string) {
  const img = new Image();
  img.className = className;
  img.src = src;
  img.alt = '';
  img.decoding = 'async';
  img.draggable = false;
  return img;
}

export function initializeVersionPairings(world: HTMLElement) {
  const heading = document.createElement('div');
  heading.id = 'pairings-heading';
  heading.className = 'canvas-label pairing-heading';
  heading.dataset.label = 'Routes × versions';
  heading.style.top = '-3390px';
  heading.innerHTML = '<h2>Routes × versions</h2>';
  world.append(heading);

  const start = -120;
  let left = start;
  let previousRoute = '';
  for (const pairing of versionPairings) {
    if (previousRoute && previousRoute !== pairing.route && pairing.id !== 'pairing-belief') left += 42;
    previousRoute = pairing.route;
    // Keep the original center positions for canvases without saved placements.
    const slotWidth = 365 + Math.round(pairing.words * 0.76);
    const card = document.createElement('article');
    card.id = pairing.id;
    card.className = 'canvas-label canvas-media pairing-card';
    card.dataset.label = `${pairing.route} × ${pairingView(pairing)}`;
    card.style.left = `${left + slotWidth / 2}px`;
    card.style.top = '-3060px';
    left += slotWidth + 22;

    const character = pairing.character ? cast[pairing.character] : undefined;
    card.setAttribute('aria-label', character ? `${card.dataset.label}, ${character.name}` : card.dataset.label);
    card.title = card.dataset.label;
    if (pairing.character) card.dataset.character = pairing.character;
    if (pairing.id === 'pairing-social-simone') {
      card.append(illustration(simoneTrial, 'pairing-trial-art'));
    } else {
      const route = routeArtwork[pairing.route];
      if (route) card.append(illustration(route, 'pairing-route-art'));
      else card.insertAdjacentHTML('beforeend', `
        <svg class="pairing-route-art" viewBox="328 145 307 184" aria-hidden="true">${knowledgeLetterArtwork}</svg>`);
      if (pairing.character) card.append(illustration(figures[pairing.character], 'pairing-figure'));
    }
    world.append(card);
  }
  heading.style.left = `${(start + left - 22) / 2}px`;
}
