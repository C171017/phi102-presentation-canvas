import terms from './paper-glossary-data.json';
import { glossaryVisual, type GlossaryVisual } from './paper-glossary-visuals';
import type { PaperAnchor } from './paper-notes';
import './paper-glossary.css';

const PAGE_UNITS = 10_000;
const INSET = 8;
const HOVER_EXIT_DELAY = 200;
type Box = [left: number, top: number, right: number, bottom: number];
type Occurrence = { term: string; boxes: Box[] };
type Page = { file: string; sheet: HTMLElement };
type Definition = (typeof terms)[number];
export type FocusGlossaryVisual = (visual: GlossaryVisual, pane: HTMLElement) => void;

const definitions = new Map(terms.map(term => [term.id, term]));
const percent = (value: number, total: number) => `${100 * value / total}%`;

function validBox(box: unknown): box is Box {
  return Array.isArray(box) && box.length === 4 &&
    box.every(value => Number.isFinite(value) && value >= 0 && value <= PAGE_UNITS) &&
    box[0] < box[2] && box[1] < box[3];
}

function createTrigger(term: Definition, boxes: Box[], hasVisual: boolean) {
  const left = Math.min(...boxes.map(box => box[0]));
  const top = Math.min(...boxes.map(box => box[1]));
  const width = Math.max(...boxes.map(box => box[2])) - left;
  const height = Math.max(...boxes.map(box => box[3])) - top;
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'paper-term';
  trigger.setAttribute('aria-label', term.title);
  trigger.setAttribute('aria-description', term.definition + (hasVisual ? ' Activate to show the illustration.' : ''));
  trigger.toggleAttribute('data-has-visual', hasVisual);
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

export function createPaperGlossary(pane: HTMLElement, scroll: HTMLElement, focusVisual: FocusGlossaryVisual) {
  const layers: HTMLElement[] = [];
  let enabled = true;
  let active: { trigger: HTMLButtonElement; fragment: HTMLElement; pinned: boolean } | undefined;
  let hideTimer: number | undefined;

  const popup = document.createElement('div');
  popup.className = 'paper-definition';
  popup.hidden = true;
  popup.setAttribute('role', 'tooltip');

  const definition = document.createElement('p');
  const visualHint = document.createElement('p');
  visualHint.className = 'paper-definition-hint';
  visualHint.textContent = 'Click to see the illustration';
  popup.append(definition, visualHint);
  pane.append(popup);

  function visible(fragment: HTMLElement) {
    const term = fragment.getBoundingClientRect();
    const bounds = scroll.getBoundingClientRect();
    return term.width > 0 && term.height > 0 && term.bottom > bounds.top && term.top < bounds.bottom &&
      term.right > bounds.left && term.left < bounds.right;
  }

  function close() {
    window.clearTimeout(hideTimer);
    active?.trigger.removeAttribute('data-showing-definition');
    active = undefined;
    popup.hidden = true;
  }

  function leave(event: PointerEvent) {
    if (!active || active.pinned || active.trigger.matches(':focus-visible')) return;
    const next = event.relatedTarget;
    if (next instanceof Node && (popup.contains(next) || active.trigger.contains(next))) return;
    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(close, HOVER_EXIT_DELAY);
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

  function show(term: Definition, trigger: HTMLButtonElement, target: EventTarget | null, hasVisual: boolean, pinned = false) {
    const fragments = Array.from(trigger.querySelectorAll<HTMLElement>('.paper-term-fragment'));
    const fragment = fragments.find(item => item === target) ?? fragments.find(visible);
    if (!fragment) return;
    pinned ||= active?.trigger === trigger && active.pinned;
    close();
    active = { trigger, fragment, pinned };
    trigger.setAttribute('data-showing-definition', '');
    definition.textContent = term.definition;
    visualHint.hidden = !hasVisual;
    popup.hidden = false;
    place();
  }

  async function load(url: string, pages: Page[], anchors: Record<string, PaperAnchor>) {
    try {
      const response = await fetch(url, { cache: 'no-cache' });
      if (!response.ok || !response.headers.get('content-type')?.includes('json')) throw new Error('Glossary coordinates are unavailable');
      const index = await response.json() as Record<string, Occurrence[]>;
      for (const [page, { file, sheet }] of pages.entries()) {
        const occurrences = index[file];
        if (!Array.isArray(occurrences)) continue;
        const layer = document.createElement('div');
        layer.className = 'paper-term-layer';
        layer.inert = !enabled;
        for (const occurrence of occurrences) {
          const term = definitions.get(occurrence?.term);
          if (!term || !Array.isArray(occurrence.boxes) || !occurrence.boxes.length || !occurrence.boxes.every(validBox)) continue;
          const [left, top, , bottom] = occurrence.boxes[0];
          const visual = glossaryVisual(term.id, { page, x: left / PAGE_UNITS, y: (top + bottom) / (2 * PAGE_UNITS) }, anchors);
          const trigger = createTrigger(term, occurrence.boxes, Boolean(visual));
          trigger.addEventListener('pointerover', event => {
            if (event.pointerType !== 'touch') show(term, trigger, event.target, Boolean(visual));
          });
          trigger.addEventListener('pointerleave', leave);
          trigger.addEventListener('focus', () => {
            if (trigger.matches(':focus-visible')) show(term, trigger, null, Boolean(visual));
          });
          trigger.addEventListener('blur', () => { if (active?.trigger === trigger) close(); });
          trigger.addEventListener('click', event => {
            if (visual) {
              close();
              focusVisual(visual, pane);
            } else if (active?.trigger === trigger && active.pinned) {
              close();
            } else show(term, trigger, event.target, false, true);
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
  popup.addEventListener('pointerenter', () => window.clearTimeout(hideTimer));
  popup.addEventListener('pointerleave', leave);
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
