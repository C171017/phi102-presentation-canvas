const STORAGE_KEY = 'phi102-paper-highlights-greco-2017-v1';
const PAGE_UNITS = 10000;
const SVG_NS = 'http://www.w3.org/2000/svg';

type Box = [left: number, top: number, right: number, bottom: number];
type Word = Box[];
type Selection = { start: number; end: number };
type PaperPage = { image: HTMLImageElement; words: Word[]; offset: number; saved: SVGPathElement; preview: SVGPathElement };
type Drag = { id: number; word: number; startX: number; startY: number; x: number; y: number; moved: boolean };

function readWords(value: unknown): Word[] {
  if (!Array.isArray(value)) return [];
  return value.filter((word): word is Word => Array.isArray(word) && word.length > 0 && word.every(box =>
    Array.isArray(box) && box.length === 4 && box.every(Number.isFinite) && box[0] < box[2] && box[1] < box[3]));
}

function layerFor(image: HTMLImageElement) {
  const layer = document.createElementNS(SVG_NS, 'svg');
  layer.classList.add('paper-highlight-layer');
  layer.setAttribute('viewBox', `0 0 ${PAGE_UNITS} ${PAGE_UNITS}`);
  layer.setAttribute('preserveAspectRatio', 'none');
  layer.setAttribute('aria-hidden', 'true');
  const saved = document.createElementNS(SVG_NS, 'path');
  const preview = document.createElementNS(SVG_NS, 'path');
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

export function createPaperHighlights(pane: HTMLElement, scroll: HTMLElement) {
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
  pane.append(status);

  function drawMarks() {
    for (const page of pages) page.saved.setAttribute('d', marks.map(range => pathFor(page, range)).join(''));
  }

  function restore(raw: string | null) {
    try {
      const saved: unknown = JSON.parse(raw ?? '[]');
      if (Array.isArray(saved)) marks = saved.filter((range): range is Selection =>
        range && Number.isInteger(range.start) && Number.isInteger(range.end) &&
        range.start >= 0 && range.start <= range.end && range.end < wordCount);
    } catch { /* An unreadable cache does not affect the paper. */ }
    drawMarks();
  }

  function save() {
    drawMarks();
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(marks)); } catch { /* Keep the highlights for this session. */ }
  }

  async function load(url: string, images: HTMLImageElement[], files: string[]) {
    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok || !response.headers.get('content-type')?.includes('json')) throw Error('Word coordinates are unavailable');
      const index = await response.json() as Record<string, unknown>;
      for (const [i, image] of images.entries()) {
        const words = readWords(index[files[i]]);
        if (!words.length) continue;
        pages.push({ image, words, offset: wordCount, ...layerFor(image) });
        wordCount += words.length;
      }
      if (!wordCount) throw Error('No words were indexed');
      scroll.setAttribute('aria-keyshortcuts', 'Meta+B');
      try { restore(localStorage.getItem(STORAGE_KEY)); } catch { /* Word selection still works without storage. */ }
    } catch (error) {
      console.warn('Paper highlighting is unavailable. Run npm run paper:pages.', error);
    }
  }

  window.addEventListener('storage', event => {
    if (wordCount && event.key === STORAGE_KEY) restore(event.newValue);
  });

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

  function stopDrag() {
    if (!drag) return;
    const { id } = drag;
    drag = undefined;
    cancelAnimationFrame(frame);
    frame = 0;
    showDraft();
    if (scroll.hasPointerCapture(id)) scroll.releasePointerCapture(id);
  }

  scroll.addEventListener('pointerdown', event => {
    if (!active || drag || event.button !== 0 || event.pointerType === 'touch') return;
    const { clientX: x, clientY: y, pointerId: id } = event;
    const word = wordAt(x, y, true);
    if (word === undefined) return;
    event.preventDefault();
    drag = { id, word, x, y, startX: x, startY: y, moved: false };
    scroll.setPointerCapture(id);
    scroll.focus({ preventScroll: true });
  });

  function move(event: PointerEvent) {
    if (drag?.id !== event.pointerId) return;
    drag.x = event.clientX;
    drag.y = event.clientY;
    drag.moved ||= Math.hypot(drag.x - drag.startX, drag.y - drag.startY) >= 3;
    refreshDrag();
  }

  scroll.addEventListener('pointermove', event => {
    move(event);
    if (drag?.id === event.pointerId && drag.moved && !frame) frame = requestAnimationFrame(autoScroll);
  });
  scroll.addEventListener('scroll', refreshDrag, { passive: true });
  scroll.addEventListener('pointerup', event => {
    if (drag?.id !== event.pointerId) return;
    move(event);
    if (draft) {
      marks.push(draft);
      save();
    }
    stopDrag();
  });
  for (const event of ['pointercancel', 'lostpointercapture'] as const) {
    scroll.addEventListener(event, pointer => { if (drag?.id === pointer.pointerId) stopDrag(); });
  }
  window.addEventListener('blur', stopDrag);

  return {
    load,
    get ready() { return wordCount > 0; },
    get active() { return active; },
    setActive(value: boolean) {
      active = value;
      if (!active) stopDrag();
      pane.classList.toggle('is-highlighting', active);
      status.textContent = active ? 'Highlight mode · ⌘B' : '';
    },
    undo() {
      if (drag) stopDrag();
      else if (marks.pop()) save();
    },
  };
}
