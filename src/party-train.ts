import evan from './assets/full-body-cast/evan.webp';
import cole from './assets/full-body-cast/cole.webp';
import simone from './assets/full-body-cast/simone.webp';
import rae from './assets/full-body-cast/rae.webp';
import echo from './assets/full-body-cast/echo.webp';
import sowatt from './assets/full-body-cast/quibble.webp';
import speaker from './assets/cast-lettering/speaker.webp';
import subject from './assets/cast-lettering/subject.webp';
import assessor from './assets/cast-lettering/assessor.webp';
import endorsement from './assets/cast-lettering/endorsement.webp';
import './party-train.css';

import { cast } from './version-pairings';

const figures = [
  { id: 'cast-cole', ...cast.cole, role: 'Speaker', lettering: speaker, src: cole, w: 210, h: 410, x: -335 },
  { id: 'cast-simone', ...cast.simone, role: 'Subject', lettering: subject, src: simone, w: 220, h: 410, x: -105 },
  { id: 'cast-rae', ...cast.rae, role: 'Assessor', lettering: assessor, src: rae, w: 200, h: 410, x: 125 },
  { id: 'cast-echo', ...cast.echo, role: 'Endorsement', lettering: endorsement, src: echo, w: 175, h: 175, x: 335 },
  { id: 'route-knowledge-evan', name: 'Evan', view: 'Evidence', color: '#39365c', src: evan,
    alt: 'Evan bows to sign the invitation in blue ink.', w: 112, h: 237 },
  { id: 'regress-problem', name: 'YYYY SOWATT', view: 'Regress problem', color: '#514755', src: sowatt, w: 210, h: 176 },
];

export const castScenes = Object.fromEntries(figures.map(member => [
  member.id, {
    w: member.w, h: member.h, label: member.name,
    mount(host: HTMLElement) {
      host.classList.add('train-figure');
      host.dataset.label = member.name;
      if ('x' in member) {
        host.dataset.lineupX = String(member.x);
        host.dataset.lineupY = String((410 - member.h) / 2);
      }
      host.style.width = member.w + 'px';
      host.style.height = member.h + 'px';
      host.style.setProperty('--cast-color', member.color);

      const view = document.createElement('span');
      view.className = 'cast-view';
      view.textContent = member.view;
      const image = document.createElement('img');
      image.src = member.src;
      image.alt = member.alt ?? '';
      image.draggable = false;
      const name = document.createElement('span');
      name.className = 'cast-name';
      name.textContent = member.name;
      host.append(view, image, name);
      if (!('role' in member) || !member.role) return;
      const role = new Image();
      role.src = member.lettering;
      role.alt = member.role;
      role.draggable = false;
      role.className = 'cast-role';
      host.append(role);
    },
  },
]));
