import { openingNotes, type SlideNotes } from './legend-slide-notes';
import { schoolNotes } from './school-slide-notes';
import './paper-mini-slide.css';

const notes: Record<string, SlideNotes> = { ...openingNotes, ...schoolNotes };

export function createPaperMiniSlide() {
  const element = document.createElement('section');
  element.className = 'paper-mini-slide';
  element.setAttribute('aria-label', 'Presentation notes');
  // Narrow presenter panels can scroll their notes independently of the cue.
  element.tabIndex = 0;
  element.addEventListener('wheel', event => event.stopPropagation(), { passive: true });
  element.addEventListener('keydown', event => {
    if (element.scrollHeight > element.clientHeight && ['ArrowUp','ArrowDown','PageUp','PageDown','Home','End'].includes(event.key)) {
      event.stopPropagation();
    }
  });
  const header = document.createElement('header');
  const section = document.createElement('span');
  section.className = 'mini-slide-section';
  const source = document.createElement('cite');
  header.append(section, source);
  const claim = document.createElement('h2');
  const points = document.createElement('ul');
  const bridge = document.createElement('p');
  bridge.className = 'mini-slide-bridge';
  element.append(header, claim, points, bridge);
  let activeKey: string | undefined;

  function show(key: string, title: string) {
    if (activeKey === key) return;
    activeKey = key;
    const slide = notes[key];
    section.textContent = title;
    source.textContent = slide.source;
    claim.textContent = slide.claim;
    points.hidden = slide.points.length === 0;
    points.replaceChildren(...slide.points.map(point => {
      const item = document.createElement('li');
      item.textContent = point;
      return item;
    }));
    bridge.textContent = slide.bridge ?? '';
    bridge.hidden = !slide.bridge;
    element.scrollTop = 0;
  }
  return { element, show };
}
