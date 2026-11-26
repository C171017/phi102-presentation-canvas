import { NOTES_END_ID, OBJECTION_ROLE, PAPER_NOTES, type PaperCard, type PaperNote } from './paper-notes-data';
import { createPaperFocus, type SegmentIndex } from './paper-focus';
import './paper-notes.css';

// Colour-coded margin notes for the original paper.
//
// Each passage gets a tint and a matching bar at the page edge. The tint can
// change between two sentences on one printed line. Several margin notes can
// point to the same passage. Notes stick beside it while it is on screen.
// `N` hides them.
//
// Like the pane, this is an overlay: it never touches the canvas, the camera or
// the saved layout.

export type PaperAnchor = { page: number; y: number; split?: { x: number; bottom: number } };
type Anchor = PaperAnchor;
type Hue = { ink: string; tint: string };
export type PaperSection = { note: PaperNote; hue: Hue; start: Anchor; end: Anchor };
type Card = { text: PaperCard; sectionIndex: number };
type Link = { group: SVGGElement; line: SVGPathElement; head: SVGPathElement };

// The order separates nearby hues, including where the rotation wraps.
const HUES: Hue[] = [
  { ink: '#2f5f99', tint: '#dceafc' }, // blue
  { ink: '#8f6a08', tint: '#f8edc3' }, // gold
  { ink: '#17736d', tint: '#ceebe5' }, // teal
  { ink: '#6c4aa0', tint: '#e9dff8' }, // violet
  { ink: '#3d7a36', tint: '#dcefd1' }, // green
];
const OBJECTION_HUE: Hue = { ink: '#b2412e', tint: '#f8d9d1' };

const VISIBLE_KEY = 'phi102-dev-paper-notes-v1';
const SVG_NS = 'http://www.w3.org/2000/svg';
const EDGE = 14; // keep clear of the window edge, like the pane
const LINK_ROOM = 30; // horizontal space for the arrow between a note and the pane
const LINK_OVERLAP = 7; // how far the arrow reaches into the pane, onto the section bar
const NOTE_MIN_WIDTH = 176;
const NOTE_MAX_WIDTH = 236;
const VIEW_PAD = 10;
const STACK_GAP = 8;
const READING_LINE = 0.18; // match paper-pane.ts: where a jumped-to passage lands

const before = (a: Anchor, b: Anchor) => a.page - b.page || a.y - b.y || (a.split?.x ?? 0) - (b.split?.x ?? 0);
const marginY = (anchor: Anchor) => anchor.split?.bottom ?? anchor.y;
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max));

function paperSections(anchors: Record<string, Anchor>, pageCount: number) {
  const located = PAPER_NOTES.flatMap(note => {
    const start = anchors[note.id];
    if (!start) console.warn(`No paper passage is mapped for "${note.id}". Add it to scripts/paper-anchors.json and run npm run paper:pages.`);
    return start && start.page < pageCount ? [{ note, start }] : [];
  }).sort((a, b) => before(a.start, b.start));
  const endAnchor = anchors[NOTES_END_ID];
  const end = endAnchor && endAnchor.page < pageCount ? endAnchor : { page: pageCount - 1, y: 1 };

  let rotation = 0;
  let previous: Hue | undefined;
  const sections: PaperSection[] = located.map(({ note, start }, index) => {
    const isObjection = note.role === OBJECTION_ROLE;
    const hue = isObjection && previous !== OBJECTION_HUE ? OBJECTION_HUE : HUES[rotation++ % HUES.length];
    previous = hue;
    return {
      note,
      hue,
      start: index === 0 ? { page: 0, y: 0 } : start, // the first section also covers the chapter title above it
      end: located[index + 1]?.start ?? end,
    };
  });
  return sections;
}

function loadVisible() {
  try { return localStorage.getItem(VISIBLE_KEY) !== 'hidden'; } catch { return true; }
}

function saveVisible(visible: boolean) {
  try { localStorage.setItem(VISIBLE_KEY, visible ? 'shown' : 'hidden'); } catch { /* Still toggles for this visit. */ }
}

function svg<K extends keyof SVGElementTagNameMap>(tag: K, className: string) {
  const node = document.createElementNS(SVG_NS, tag);
  node.setAttribute('class', className);
  return node;
}

function span(className: string, text: string) {
  const node = document.createElement('span');
  node.className = className;
  node.textContent = text;
  return node;
}

export function createPaperNotes(pane: HTMLElement, scroll: HTMLElement, shell: HTMLElement) {
  const focus = createPaperFocus(pane, scroll);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = loadVisible();
  let sections: PaperSection[] = [];
  let cards: Card[] = [];
  let sheets: HTMLElement[] = [];
  let boxes: HTMLButtonElement[] = [];
  let links: Link[] = [];
  let marks: HTMLElement[][] = [];
  let heights: number[] = [];
  let measuredWidth = 0;
  let frame = 0;

  const layer = document.createElement('div');
  layer.className = 'paper-notes';
  layer.hidden = true;
  layer.setAttribute('role', 'group');
  layer.setAttribute('aria-label', 'Main idea of each section of the paper');
  const arrows = svg('svg', 'paper-note-links');
  arrows.setAttribute('aria-hidden', 'true');
  layer.append(arrows);
  pane.append(layer);

  function offsetOf(anchor: Anchor, y = anchor.y) {
    const sheet = sheets[anchor.page];
    return sheet.offsetTop + y * sheet.offsetHeight;
  }

  function setLinked(index: number, linked: boolean) {
    boxes[index].classList.toggle('is-linked', linked);
    links[index].group.classList.toggle('is-linked', linked);
    for (const mark of marks[cards[index].sectionIndex]) mark.classList.toggle('is-linked', linked);
  }

  function build(anchors: Record<string, Anchor>, pageSheets: HTMLElement[], segments: SegmentIndex) {
    for (const box of boxes) box.remove();
    for (const mark of marks.flat()) mark.remove();
    arrows.replaceChildren();
    sheets = pageSheets;
    sections = paperSections(anchors, sheets.length);
    focus.build(segments, sections, sheets);
    cards = sections.flatMap(({ note }, sectionIndex) => {
      const notes = [note, ...(note.also ?? [])];
      return notes.map(text => ({ text, sectionIndex }));
    });

    boxes = cards.map(({ text, sectionIndex }, index) => {
      const { hue, start } = sections[sectionIndex];
      const box = document.createElement('button');
      box.type = 'button';
      box.className = 'paper-note';
      box.style.setProperty('--note-ink', hue.ink);
      box.style.setProperty('--note-tint', hue.tint);
      box.title = 'Focus this passage and go to its start';
      box.append(span('paper-note-role', text.role), span('paper-note-title', text.title), span('paper-note-idea', text.idea));
      box.addEventListener('click', () => {
        focus.choose(sectionIndex, box);
        scroll.scrollTo({
          top: Math.max(0, offsetOf(start) - scroll.clientHeight * READING_LINE),
          behavior: reducedMotion.matches ? 'auto' : 'smooth',
        });
      });
      box.addEventListener('pointerenter', () => setLinked(index, true));
      box.addEventListener('pointerleave', () => setLinked(index, false));
      box.addEventListener('focus', () => setLinked(index, true));
      box.addEventListener('blur', () => setLinked(index, false));
      layer.append(box);
      return box;
    });

    links = cards.map(({ sectionIndex }) => {
      const { hue } = sections[sectionIndex];
      const group = svg('g', 'paper-note-link');
      group.style.setProperty('--note-ink', hue.ink);
      const line = svg('path', 'paper-note-link-line');
      const head = svg('path', 'paper-note-link-head');
      group.append(line, head);
      arrows.append(group);
      return { group, line, head };
    });

    // A bar down the page edge spanning the whole section, split at page breaks.
    marks = sections.map(({ hue, start, end }) => {
      const pieces: HTMLElement[] = [];
      for (let page = start.page; page <= end.page && page < sheets.length; page++) {
        const top = page === start.page ? marginY(start) : 0;
        const bottom = page === end.page ? marginY(end) : 1;
        if (bottom <= top) continue;
        const mark = document.createElement('div');
        mark.className = 'paper-section-mark';
        mark.style.setProperty('--note-ink', hue.ink);
        mark.style.top = `${(top * 100).toFixed(2)}%`;
        mark.style.height = `${((bottom - top) * 100).toFixed(2)}%`;
        sheets[page].append(mark);
        pieces.push(mark);
      }
      return pieces;
    });

    measuredWidth = 0;
    schedule();
  }

  function availableNoteWidth() {
    const room = pane.getBoundingClientRect().left - shell.getBoundingClientRect().left - EDGE - LINK_ROOM;
    return Math.floor(Math.min(NOTE_MAX_WIDTH, room));
  }

  function focusSection(id: string, source: HTMLButtonElement) {
    const width = availableNoteWidth();
    focus.layout(width >= NOTE_MIN_WIDTH ? width : 0);
    focus.choose(sections.findIndex(({ note }) => note.id === id), source);
  }

  function layout() {
    frame = 0;
    const width = availableNoteWidth();
    const sideRoom = width >= NOTE_MIN_WIDTH;
    focus.layout(sideRoom ? width : 0);
    const show = visible && sections.length > 0 && !pane.classList.contains('is-collapsed') && width >= NOTE_MIN_WIDTH;
    layer.hidden = !show;
    pane.classList.toggle('has-paper-notes', show);
    if (!show) return;
    if (width !== measuredWidth) {
      measuredWidth = width;
      layer.style.setProperty('--note-width', `${width}px`);
      heights = boxes.map(box => box.offsetHeight);
    }

    // Read every position first, then write, so the browser lays out once per frame.
    const viewHeight = layer.clientHeight;
    const base = scroll.offsetTop - scroll.scrollTop;
    const spans = sections.map(({ start, end }) => ({
      top: base + offsetOf(start, marginY(start)),
      bottom: base + offsetOf(end, marginY(end)),
    }));

    const lineEnd = width + LINK_ROOM + LINK_OVERLAP - 2; // the tip lands on the section bar
    let stackBottom = -Infinity;
    cards.forEach(({ sectionIndex }, index) => {
      const range = spans[sectionIndex];
      const box = boxes[index];
      const link = links[index];
      const shownTop = Math.max(range.top, 0);
      const shownBottom = Math.min(range.bottom, viewHeight);
      // A stack of cards can be taller than its passage. Once the passage has
      // scrolled away, its cards must yield their space to the next passage.
      if (shownBottom - shownTop < 2) {
        box.style.visibility = 'hidden';
        link.group.style.display = 'none';
        return;
      }
      const height = heights[index];
      // Stick beside the section while it is on screen, then leave with it.
      let top = clamp(VIEW_PAD, range.top, range.bottom - height);
      top = Math.max(top, stackBottom + STACK_GAP); // never overlap the note above
      stackBottom = top + height;

      const onScreen = top < viewHeight && top + height > 0;
      box.style.transform = `translateY(${Math.round(top)}px)`;
      box.style.visibility = onScreen ? '' : 'hidden';

      if (!onScreen) {
        link.group.style.display = 'none';
        return;
      }
      link.group.style.display = '';
      const inset = Math.min(10, (shownBottom - shownTop) / 2);
      const target = clamp(top + 24, shownTop + inset, shownBottom - inset);
      const from = clamp(target, top + 16, top + height - 16);
      const bend = LINK_ROOM * 0.6;
      link.line.setAttribute('d', `M${width} ${from}C${width + bend} ${from} ${lineEnd - bend - 6} ${target} ${lineEnd - 6} ${target}`);
      link.head.setAttribute('d', `M${lineEnd - 7} ${target - 4.5}L${lineEnd} ${target}L${lineEnd - 7} ${target + 4.5}Z`);
    });
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(layout);
  }

  scroll.addEventListener('scroll', schedule, { passive: true });
  const resized = new ResizeObserver(schedule);
  resized.observe(pane);
  resized.observe(shell);
  // The notes sit outside the scrolling pages, so scrolling over them scrolls the paper.
  layer.addEventListener('wheel', event => {
    if (event.ctrlKey) return;
    event.preventDefault();
    const unit = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16 : event.deltaMode === WheelEvent.DOM_DELTA_PAGE ? scroll.clientHeight : 1;
    scroll.scrollTop += event.deltaY * unit;
  }, { passive: false });
  window.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.isComposing || event.repeat || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    if (event.key.toLowerCase() !== 'n') return;
    if (event.target instanceof HTMLElement && (event.target.isContentEditable || event.target.closest('input, textarea, select'))) return;
    event.preventDefault();
    visible = !visible;
    saveVisible(visible);
    if (!visible) focus.clear(true);
    schedule();
  });

  return {
    build, focusSection, clearFocus: focus.clear,
    highlightCitation: focus.highlightCitation, clearCitationHighlight: focus.clearCitationHighlight,
  };
}
