import { openingNotes, type SlideNotes } from './legend-slide-notes';
import { schoolNotes } from './school-slide-notes';
import type { SlideCopy } from './shared-slide-data';
import './paper-mini-slide.css';

const notes: Record<string, SlideNotes> = { ...openingNotes, ...schoolNotes };

export function createPaperMiniSlide(sharedCopy?: (key: string) => SlideCopy | undefined) {
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
  let activeTitle = '';
  let activeEdit: SlideCopy | undefined;

  function show(key: string, title: string, force = false) {
    const edit = sharedCopy?.(key);
    if (!force && activeKey === key && activeTitle === title && activeEdit === edit) return;
    const slide = edit ?? notes[key];
    if (!slide) return;
    activeKey = key;
    activeTitle = title;
    activeEdit = edit;
    section.textContent = edit?.title ?? title;
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
  return {
    element, show,
    get key() { return activeKey; },
    get inlineFields() { return activeKey ? { key: activeKey, title: section, claim, points, bridge, source } : undefined; },
    refresh(force = false) { if (activeKey) show(activeKey, activeTitle, force); },
  };
}
