import { sharedSlideByKey } from './shared-slide-data';
import { renderPaperLink, slidePaperLinks } from './paper-slide-links';
import { slideSections, type SlideCopy, type SlideSection } from './slide-sections';
import './paper-mini-slide.css';

function field(tag: string, value: string, name: string, className?: string) {
  const node = document.createElement(tag);
  node.textContent = value;
  node.dataset.slideField = name;
  if (className) node.className = className;
  return node;
}

export function renderSectionBullet(value: string, index: number) {
  return field('li', value, 'bullet-' + index);
}

export function renderMiniSlideSection(section: SlideSection, index: number) {
  let node: HTMLElement;
  switch (section.kind) {
    case 'header':
      node = document.createElement('header');
      node.append(field('span', section.title, 'title', 'mini-slide-section'), field('cite', section.source, 'source'));
      break;
    case 'bullets':
      node = document.createElement('ul');
      node.append(...section.items.map(renderSectionBullet));
      break;
    case 'heading':
      node = field('h2', section.text, 'text');
      break;
    default:
      node = field('p', section.text, 'text', 'mini-slide-text');
  }
  node.dataset.slideSection = String(index);
  return node;
}

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
  let activeKey: string | undefined;
  let activeCopy: SlideCopy | undefined;
  let sections: SlideSection[] = [];

  function show(key: string, force = false) {
    const copy = sharedCopy?.(key) ?? sharedSlideByKey.get(key)?.initial;
    if (!copy || (!force && activeKey === key && activeCopy === copy)) return;
    activeKey = key;
    activeCopy = copy;
    sections = slideSections(copy);
    element.replaceChildren(...sections.map(renderMiniSlideSection));
    const links = slidePaperLinks[key];
    if (links) {
      const fields = Array.from(element.querySelectorAll<HTMLElement>('[data-slide-field]:not(cite)'));
      const title = fields.find(field => field.matches('.mini-slide-section') && field.textContent?.trim())
        ?? fields.find(field => field.matches('h2'));
      title?.append(renderPaperLink(links.title, true));
      for (const { after, reference } of links.inline ?? []) {
        const field = fields.find(node => node.textContent?.toLowerCase().includes(after));
        if (field) field.append(renderPaperLink(reference));
      }
    }
    element.scrollTop = 0;
  }

  return {
    element, show,
    get key() { return activeKey; },
    get inlineFields() { return activeKey ? { key: activeKey, element, sections } : undefined; },
    refresh(force = false) { if (activeKey) show(activeKey, force); },
  };
}
