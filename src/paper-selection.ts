import type { PaperPassage } from './paper-explainer-protocol';
import './paper-selection.css';

export type PaperMarks = {
  read: () => unknown;
  write: (marks: Selection[]) => void;
  subscribe: (restore: (marks: unknown) => void) => void;
};
const PAGE_UNITS = 10000;
const SVG_NS = 'http://www.w3.org/2000/svg';

type Box = [left: number, top: number, right: number, bottom: number];
type Word = Box[];
type Selection = { start: number; end: number };
type PaperPage = { file: string; image: HTMLImageElement; words: Word[]; offset: number; saved: SVGPathElement; preview: SVGPathElement };
type Drag = { id: number; word: number; startX: number; startY: number; x: number; y: number; moved: boolean };

function readWords(value: unknown): Word[] {
  if (!Array.isArray(value)) return [];
  return value.filter((word): word is Word => Array.isArray(word) && word.length > 0 && word.every(box =>
    Array.isArray(box) && box.length === 4 && box.every(Number.isFinite) && box[0] < box[2] && box[1] < box[3]));
}

function layerFor(image: HTMLImageElement) {
  const layer = document.createElementNS(SVG_NS, 'svg');
  layer.classList.add('paper-selection-layer');
  layer.setAttribute('viewBox', `0 0 ${PAGE_UNITS} ${PAGE_UNITS}`);
  layer.setAttribute('preserveAspectRatio', 'none');
  layer.setAttribute('aria-hidden', 'true');
  const saved = document.createElementNS(SVG_NS, 'path');
  const preview = document.createElementNS(SVG_NS, 'path');
  preview.classList.add('paper-selection-preview');
  layer.append(saved, preview);
  image.after(layer);
  return { saved, preview };
}

function pathFor(page: PaperPage, { start, end }: Selection) {
  const first = Math.max(0, start - page.offset);
  const last = Math.min(end - page.offset, page.words.length - 1);
  if (first > last) return '';

  // Connect adjacent selected words on the same line across their spaces.
  const lines: Box[] = [];
  for (let index = first; index <= last; index++) {
    for (const box of page.words[index]) {
      const previous = lines.at(-1);
      const [left, top, right, bottom] = box;
      if (previous && left >= previous[0] &&
          Math.min(bottom, previous[3]) - Math.max(top, previous[1]) > Math.min(bottom - top, previous[3] - previous[1]) / 2) {
        previous[1] = Math.min(previous[1], top);
        previous[2] = Math.max(previous[2], right);
        previous[3] = Math.max(previous[3], bottom);
      } else lines.push([...box]);
    }
  }
  return lines.map(([left, top, right, bottom]) => `M${left},${top}H${right}V${bottom}H${left}Z`).join('');
}

function gap(point: number, start: number, end: number) {
  return Math.max(start - point, point - end, 0);
}

type Offer = (selection: PaperPassage, getAnchor: () => { x: number; top: number; bottom: number }) => void;

export function createPaperSelection(pane: HTMLElement, scroll: HTMLElement, offer: Offer,
  dismiss: () => void, persistence?: PaperMarks) {
  const pages: PaperPage[] = [];
  let wordCount = 0;
  let marks: Selection[] = [];
  let draft: Selection | undefined;
  let drag: Drag | undefined;
  let frame = 0;
  let active = false;

  const status = document.createElement('div');
  status.className = 'paper-highlight-status';
  status.setAttribute('role', 'status');
  if (persistence) pane.append(status);

  function drawMarks() {
    for (const page of pages) page.saved.setAttribute('d', marks.map(range => pathFor(page, range)).join(''));
  }

  function restore(saved: unknown) {
    if (Array.isArray(saved)) marks = saved.filter((range): range is Selection =>
      range && Number.isInteger(range.start) && Number.isInteger(range.end) &&
      range.start >= 0 && range.start <= range.end && range.end < wordCount);
    drawMarks();
  }

  function save() {
    drawMarks();
    persistence?.write(marks);
  }

  async function load(url: string, images: HTMLImageElement[], files: string[]) {
    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok || !response.headers.get('content-type')?.includes('json')) throw Error('Word coordinates are unavailable');
      const index = await response.json() as Record<string, unknown>;
      for (const [i, image] of images.entries()) {
        const words = readWords(index[files[i]]);
        if (!words.length) continue;
        pages.push({ file: files[i], image, words, offset: wordCount, ...layerFor(image) });
        wordCount += words.length;
      }
      if (!wordCount) throw Error('No words were indexed');
      if (persistence) {
        scroll.setAttribute('aria-keyshortcuts', 'Meta+B');
        restore(persistence.read());
        persistence.subscribe(restore);
      }
    } catch (error) {
      console.warn('Paper selection is unavailable. Run npm run paper:pages.', error);
    }
  }

  function wordAt(clientX: number, clientY: number, starting: boolean) {
    let closestPage: { page: PaperPage; rect: DOMRect; distance: number } | undefined;
    for (const page of pages) {
      const rect = page.image.getBoundingClientRect();
      if (!rect.width || !rect.height) continue;
      const distance = gap(clientY, rect.top, rect.bottom);
      if (!closestPage || distance < closestPage.distance) closestPage = { page, rect, distance };
      if (distance === 0) break;
    }
    if (!closestPage || (starting && closestPage.distance > 0)) return;
    const { page, rect } = closestPage;
    const x = (clientX - rect.left) * PAGE_UNITS / rect.width;
    const y = (clientY - rect.top) * PAGE_UNITS / rect.height;
    let best: { index: number; dx: number; dy: number } | undefined;
    page.words.forEach((boxes, index) => {
      for (const [left, top, right, bottom] of boxes) {
        const dx = gap(x, left, right);
        const dy = gap(y, top, bottom);
        if (!best || dy < best.dy || (dy === best.dy && dx < best.dx)) best = { index, dx, dy };
      }
    });
    if (!best || (starting && (best.dy > 0 || best.dx * rect.width / PAGE_UNITS > 4))) return;
    return page.offset + best.index;
  }

  function showDraft(selection?: Selection) {
    if (selection?.start === draft?.start && selection?.end === draft?.end) return;
    draft = selection;
    for (const page of pages) page.preview.setAttribute('d', draft ? pathFor(page, draft) : '');
  }

  function refreshDrag() {
    if (!drag?.moved) return;
    const { top, bottom } = scroll.getBoundingClientRect();
    const word = wordAt(drag.x, Math.min(bottom - 1, Math.max(top + 1, drag.y)), false);
    if (word !== undefined) showDraft({ start: Math.min(drag.word, word), end: Math.max(drag.word, word) });
  }

  function autoScroll() {
    frame = 0;
    if (!drag?.moved) return;
    const { top, bottom } = scroll.getBoundingClientRect();
    const distance = drag.y < top ? drag.y - top : Math.max(0, drag.y - bottom);
    if (!distance) return;
    const previous = scroll.scrollTop;
    scroll.scrollTop += Math.sign(distance) * Math.min(28, 2 + Math.abs(distance) / 3);
    if (scroll.scrollTop !== previous) {
      refreshDrag();
      frame = requestAnimationFrame(autoScroll);
    }
  }

  function stopDrag(keep = false) {
    if (!drag) return;
    const { id } = drag;
    drag = undefined;
    cancelAnimationFrame(frame);
    frame = 0;
    if (!keep) showDraft();
    if (scroll.hasPointerCapture(id)) scroll.releasePointerCapture(id);
  }

  function location(word: number) {
    const page = pages.find(({ offset, words }) => word >= offset && word < offset + words.length)!;
    return { page, index: word - page.offset };
  }

  function showOffer(selection: Selection, endpoint: number, pointerX: number, pointerY: number) {
    const start = location(selection.start);
    const end = location(selection.end);
    const target = endpoint === selection.start ? start : end;
    const { page, index } = target;
    const initial = page.image.getBoundingClientRect();
    const boxes = page.words[index];
    const y = (pointerY - initial.top) * PAGE_UNITS / initial.height;
    const box = boxes.reduce((best, next) => gap(y, next[1], next[3]) < gap(y, best[1], best[3]) ? next : best);
    const x = Math.min(box[2], Math.max(box[0], (pointerX - initial.left) * PAGE_UNITS / initial.width));
    offer({ start: { file: start.page.file, index: start.index }, end: { file: end.page.file, index: end.index } }, () => {
      const rect = page.image.getBoundingClientRect();
      return {
        x: rect.left + rect.width * x / PAGE_UNITS,
        top: rect.top + rect.height * box[1] / PAGE_UNITS,
        bottom: rect.top + rect.height * box[3] / PAGE_UNITS,
      };
    });
  }

  scroll.addEventListener('pointerdown', event => {
    if (drag || event.button !== 0 || event.pointerType === 'touch') return;
    dismiss();
    showDraft();
    const { clientX: x, clientY: y, pointerId: id } = event;
    const word = wordAt(x, y, true);
    if (word === undefined) return;
    drag = { id, word, x, y, startX: x, startY: y, moved: false };
    if (active) {
      event.preventDefault();
      scroll.setPointerCapture(id);
      scroll.focus({ preventScroll: true });
    }
  });

  function move(event: PointerEvent) {
    if (drag?.id !== event.pointerId) return;
    drag.x = event.clientX;
    drag.y = event.clientY;
    if (!drag.moved && Math.hypot(drag.x - drag.startX, drag.y - drag.startY) >= 3) {
      drag.moved = true;
      if (event.type === 'pointermove') scroll.setPointerCapture(event.pointerId);
    }
    refreshDrag();
  }

  window.addEventListener('pointermove', event => {
    move(event);
    if (drag?.id === event.pointerId && drag.moved && !frame) frame = requestAnimationFrame(autoScroll);
  });
  scroll.addEventListener('scroll', refreshDrag, { passive: true });
  window.addEventListener('pointerup', event => {
    if (drag?.id !== event.pointerId) return;
    move(event);
    if (draft && active) {
      marks.push(draft);
      save();
    } else if (draft) {
      const endpoint = draft.start === drag.word ? draft.end : draft.start;
      showOffer(draft, endpoint, event.clientX, event.clientY);
      stopDrag(true);
      return;
    }
    stopDrag();
  });
  for (const event of ['pointercancel', 'lostpointercapture'] as const) {
    window.addEventListener(event, pointer => { if (drag?.id === pointer.pointerId) stopDrag(); });
  }
  window.addEventListener('blur', () => stopDrag());

  return {
    load,
    clear: () => { stopDrag(); showDraft(); },
    get ready() { return wordCount > 0; },
    get active() { return active; },
    setActive(value: boolean) {
      stopDrag();
      showDraft();
      dismiss();
      active = value;
      pane.classList.toggle('is-highlighting', active);
      status.textContent = active ? 'Highlight mode · ⌘B' : '';
    },
    undo() {
      if (drag) stopDrag();
      else if (marks.pop()) save();
    },
  };
}
