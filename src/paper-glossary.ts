import terms from './paper-glossary-data.json';
import './paper-glossary.css';

const PAGE_UNITS = 10_000;
const INSET = 8;
const POPUP_ID = 'paper-glossary-definition';
type Box = [left: number, top: number, right: number, bottom: number];
type Occurrence = { term: string; boxes: Box[] };
type Page = { file: string; sheet: HTMLElement };
type Definition = (typeof terms)[number];

const definitions = new Map(terms.map(term => [term.id, term]));
const percent = (value: number, total: number) => `${100 * value / total}%`;

function validBox(box: unknown): box is Box {
  return Array.isArray(box) && box.length === 4 &&
    box.every(value => Number.isFinite(value) && value >= 0 && value <= PAGE_UNITS) &&
    box[0] < box[2] && box[1] < box[3];
}

function createTrigger(term: Definition, boxes: Box[]) {
  const left = Math.min(...boxes.map(box => box[0]));
  const top = Math.min(...boxes.map(box => box[1]));
  const width = Math.max(...boxes.map(box => box[2])) - left;
  const height = Math.max(...boxes.map(box => box[3])) - top;
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'paper-term';
  trigger.setAttribute('aria-label', term.title);
  trigger.setAttribute('aria-description', term.definition);
  trigger.setAttribute('aria-controls', POPUP_ID);
  trigger.setAttribute('aria-expanded', 'false');
  Object.assign(trigger.style, {
    left: percent(left, PAGE_UNITS), top: percent(top, PAGE_UNITS),
    width: percent(width, PAGE_UNITS), height: percent(height, PAGE_UNITS),
  });
  for (const [x, y, right, bottom] of boxes) {
    const fragment = document.createElement('span');
    fragment.className = 'paper-term-fragment';
    fragment.setAttribute('aria-hidden', 'true');
    Object.assign(fragment.style, {
      left: percent(x - left, width), top: percent(y - top, height),
      width: percent(right - x, width), height: percent(bottom - y, height),
    });
    trigger.append(fragment);
  }
  return trigger;
}

export function createPaperGlossary(pane: HTMLElement, scroll: HTMLElement) {
  const layers: HTMLElement[] = [];
  let enabled = true;
  let active: { trigger: HTMLButtonElement; fragment: HTMLElement } | undefined;

  const popup = document.createElement('div');
  popup.id = POPUP_ID;
  popup.className = 'paper-definition';
  popup.hidden = true;

  const definition = document.createElement('p');
  popup.append(definition);
  pane.append(popup);

  function visible(fragment: HTMLElement) {
    const term = fragment.getBoundingClientRect();
    const bounds = scroll.getBoundingClientRect();
    return term.width > 0 && term.height > 0 && term.bottom > bounds.top && term.top < bounds.bottom &&
      term.right > bounds.left && term.left < bounds.right;
  }

  function close() {
    active?.trigger.setAttribute('aria-expanded', 'false');
    active = undefined;
    popup.hidden = true;
  }

  function place() {
    if (!active) return;
    const { fragment } = active;
    if (!visible(fragment)) {
      close();
      return;
    }
    const paneRect = pane.getBoundingClientRect();
    const bounds = scroll.getBoundingClientRect();
    const rect = fragment.getBoundingClientRect();
    const above = rect.top - bounds.top - 2 * INSET;
    const below = bounds.bottom - rect.bottom - 2 * INSET;
    popup.style.maxHeight = `${Math.max(0, Math.max(above, below))}px`;
    const { offsetHeight: height, offsetWidth: width } = popup;
    const placeAbove = height <= above || above >= below;
    const center = (rect.left + rect.right) / 2 - paneRect.left - pane.clientLeft;
    const x = Math.max(INSET, Math.min(pane.clientWidth - width - INSET, center - width / 2));
    const y = (placeAbove ? rect.top - height - INSET : rect.bottom + INSET) - paneRect.top - pane.clientTop;
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
  }

  function show(term: Definition, trigger: HTMLButtonElement, target: EventTarget | null) {
    const fragments = Array.from(trigger.querySelectorAll<HTMLElement>('.paper-term-fragment'));
    const fragment = fragments.find(item => item === target) ?? fragments.find(visible);
    if (!fragment) return;
    close();
    active = { trigger, fragment };
    trigger.setAttribute('aria-expanded', 'true');
    definition.textContent = term.definition;
    popup.hidden = false;
    place();
  }

  async function load(url: string, pages: Page[]) {
    try {
      const response = await fetch(url, { cache: 'no-cache' });
      if (!response.ok || !response.headers.get('content-type')?.includes('json')) throw new Error('Glossary coordinates are unavailable');
      const index = await response.json() as Record<string, Occurrence[]>;
      for (const { file, sheet } of pages) {
        const occurrences = index[file];
        if (!Array.isArray(occurrences)) continue;
        const layer = document.createElement('div');
        layer.className = 'paper-term-layer';
        layer.inert = !enabled;
        for (const occurrence of occurrences) {
          const term = definitions.get(occurrence?.term);
          if (!term || !Array.isArray(occurrence.boxes) || !occurrence.boxes.length || !occurrence.boxes.every(validBox)) continue;
          const trigger = createTrigger(term, occurrence.boxes);
          trigger.addEventListener('click', event => {
            if (active?.trigger === trigger) close();
            else show(term, trigger, event.target);
          });
          layer.append(trigger);
        }
        sheet.append(layer);
        layers.push(layer);
      }
    } catch (error) {
      console.warn('Could not load the paper glossary.', error);
    }
  }

  scroll.addEventListener('scroll', place, { passive: true });
  const observer = new ResizeObserver(place);
  observer.observe(scroll);
  document.addEventListener('pointerdown', event => {
    if (!active || !(event.target instanceof Node)) return;
    if (!popup.contains(event.target) && !active.trigger.contains(event.target)) close();
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !active) return;
    event.preventDefault();
    event.stopPropagation();
    close();
  });

  return {
    load,
    close,
    setEnabled(value: boolean) {
      enabled = value;
      for (const layer of layers) layer.inert = !enabled;
      if (!enabled) close();
    },
  };
}
