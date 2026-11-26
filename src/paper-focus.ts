import type { PaperAnchor, PaperSection } from './paper-notes';
import './paper-focus.css';

const NS = 'http://www.w3.org/2000/svg';
const UNITS = 10000;
const PAGE_PATH = `M0 0H${UNITS}V${UNITS}H0Z`;
// Extend past the sheet so feathering the cutout leaves the page edges evenly shaded.
const SHADE_PATH = `M-500 -500H${UNITS + 500}V${UNITS + 500}H-500Z`;
type Box = [number, number, number, number];
type Run = { page: number; lines: Box[] };
type Segment = { label: string; runs: Run[] };
type MoveCard = {
  item: HTMLLIElement;
  button: HTMLButtonElement;
  line: SVGPathElement;
  runs: Run[];
  visibleRun?: Run;
};
export type SegmentIndex = Record<string, Segment[]>;
export type CitationIndex = Record<string, { section: string; runs: Run[] }>;
// Reading order within a passage. The first five match the selected preview.
const MOVE_COLORS = ['#a9d8f4', '#f5d488', '#aedcba', '#cec0ee', '#f3b4a6', '#8dd8d6', '#e5bdcf', '#d3df99'];
const moveColor = (index: number) => MOVE_COLORS[index % MOVE_COLORS.length];

function node<K extends keyof SVGElementTagNameMap>(name: K) {
  return document.createElementNS(NS, name);
}

// Trace only the visible section on this sheet. A split starts at its x
// coordinate on the first row, then continues at the left edge on the next.
function sectionPath(start: PaperAnchor, end: PaperAnchor, page: number) {
  function edge(anchor: PaperAnchor, outside: number, reverse: boolean) {
    if (anchor.page !== page) return reverse ? `V${outside}H0` : `M0 ${outside}H10000`;
    const y = Math.round(anchor.y * UNITS);
    if (!anchor.split) return reverse ? `V${y}H0` : `M0 ${y}H10000`;
    const x = Math.round(anchor.split.x * UNITS);
    const bottom = Math.round(anchor.split.bottom * UNITS);
    return reverse ? `V${y}H${x}V${bottom}H0` : `M0 ${bottom}H${x}V${y}H10000`;
  }
  return edge(start, 0, false) + edge(end, UNITS, true) + 'Z';
}

function overlay(className: string) {
  const layer = node('svg');
  layer.setAttribute('class', className);
  layer.setAttribute('viewBox', '0 0 10000 10000');
  layer.setAttribute('preserveAspectRatio', 'none');
  return layer;
}

function path(d: string) {
  const p = node('path');
  p.setAttribute('d', d);
  p.setAttribute('fill-rule', 'evenodd');
  return p;
}

function paddedLine([left, top, right, bottom]: Box): Box {
  return [left - 10, top - 2, right + 10, bottom + 2];
}

function drawLines(layer: SVGElement, lines: Box[]) {
  for (const line of lines) {
    const [left, top, right, bottom] = paddedLine(line);
    const rect = node('rect');
    rect.setAttribute('x', String(left));
    rect.setAttribute('y', String(top));
    rect.setAttribute('width', String(right - left));
    rect.setAttribute('height', String(bottom - top));
    rect.setAttribute('rx', '8');
    layer.append(rect);
  }
}

export function createPaperFocus(pane: HTMLElement, scroll: HTMLElement) {
  let sections: PaperSection[] = [];
  let sheets: HTMLElement[] = [];
  let segments: SegmentIndex = {};
  let active = -1;
  let current = -1;
  let trigger: Element | undefined;
  let cards: MoveCard[] = [];
  const zones: SVGPathElement[][] = [];
  const drawings: SVGElement[] = [];
  const citationLayers = new Set<SVGSVGElement>();
  const panel = document.createElement('section');
  panel.className = 'paper-focus-panel';
  panel.hidden = true;
  panel.tabIndex = -1;
  panel.setAttribute('aria-label', 'Focused passage');
  const list = document.createElement('ol');
  list.setAttribute('aria-label', 'Sentence groups in reading order');
  const leaders = node('svg');
  leaders.setAttribute('class', 'paper-focus-leaders');
  leaders.setAttribute('aria-hidden', 'true');
  panel.append(list, leaders);
  pane.prepend(panel);

  function markCurrent(index: number) {
    current = index;
    for (const [i, { button }] of cards.entries()) {
      if (i === current) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    }
    for (const layer of drawings) {
      layer.querySelectorAll<SVGElement>('[data-move]').forEach(mark => {
        mark.classList.toggle('is-current', Number(mark.dataset.move) === current);
      });
    }
  }

  function layoutCards() {
    if (active < 0 || !pane.classList.contains('has-focus-room')) return;
    const viewTop = scroll.offsetTop;
    const viewBottom = viewTop + scroll.clientHeight;
    const base = viewTop - scroll.scrollTop;
    const gap = 5;
    const linkWidth = leaders.clientWidth;
    const visible = cards.flatMap(card => {
      // Use the first visible piece when a move continues across a page break.
      card.visibleRun = undefined;
      for (const run of card.runs) {
        const sheet = sheets[run.page];
        const pageTop = base + sheet.offsetTop;
        const scale = sheet.offsetHeight / UNITS;
        const top = Math.max(viewTop, pageTop + run.lines[0][1] * scale);
        const bottom = Math.min(viewBottom, pageTop + run.lines[run.lines.length - 1][3] * scale);
        if (bottom <= top) continue;
        card.visibleRun = run;
        return [{ card, anchor: (top + bottom) / 2, height: card.item.offsetHeight, top: 0 }];
      }
      return [];
    });

    // Pack cards in reading order, then move the stack up if it runs past the bottom.
    let nextTop = viewTop + gap;
    for (const row of visible) {
      row.top = Math.max(nextTop, row.anchor - row.height / 2);
      nextTop = row.top + row.height + gap;
    }
    let nextBottom = viewBottom - gap;
    for (const row of visible.slice().reverse()) {
      row.top = Math.min(row.top, nextBottom - row.height);
      nextBottom = row.top - gap;
    }

    const shift = Math.max(0, viewTop + gap - (visible[0]?.top ?? viewTop + gap));
    for (const card of cards) {
      card.item.classList.remove('is-in-view');
      card.line.removeAttribute('d');
    }
    for (const { card, anchor, top, height } of visible) {
      const y = Math.round(top + shift);
      if (y + height > viewBottom) continue;
      const center = y + height / 2;
      card.item.style.top = y + 'px';
      card.item.classList.add('is-in-view');
      const mid = linkWidth / 2;
      card.line.setAttribute('d', `M0 ${center}C${mid} ${center} ${mid} ${anchor} ${linkWidth} ${anchor}`);
    }
  }

  function draw() {
    for (const layer of drawings) layer.remove();
    drawings.length = 0;
    if (active < 0) return;
    const { start, end, note } = sections[active];
    sheets.forEach((sheet, page) => {
      if (page < start.page || page > end.page) return; // Fully dimmed in CSS.
      const layer = overlay('paper-focus-drawing');
      layer.setAttribute('aria-hidden', 'true');
      const veil = path(PAGE_PATH + sectionPath(start, end, page));
      veil.setAttribute('class', 'paper-focus-veil');
      layer.append(veil);
      // Paint behind the raster so that the ink and glossary stay legible.
      const colors = node('g');
      colors.setAttribute('aria-hidden', 'true');
      colors.setAttribute('pointer-events', 'none');
      for (const [i, move] of segments[note.id].entries()) {
        const run = move.runs.find(run => run.page === page);
        if (!run) continue;
        const group = node('g');
        group.dataset.move = String(i);
        group.classList.add('paper-focus-mark');
        group.setAttribute('fill', moveColor(i));
        drawLines(group, run.lines);
        colors.append(group);
      }
      sheet.querySelector('.paper-focus-zones')!.append(colors);
      drawings.push(colors);
      sheet.append(layer);
      drawings.push(layer);
    });
    markCurrent(current);
  }

  function clearCitationHighlight() {
    for (const layer of citationLayers) layer.remove();
    citationLayers.clear();
  }

  function highlightCitation(section: string, runs: Run[]) {
    if (sections[active]?.note.id !== section) return;
    clearCitationHighlight();
    const linesByPage = new Map(runs.map(({ page, lines }) => [page, lines]));

    function animate(layer: SVGSVGElement) {
      layer.setAttribute('aria-hidden', 'true');
      citationLayers.add(layer);
      layer.addEventListener('animationend', () => {
        citationLayers.delete(layer);
        layer.remove();
      }, { once: true });
    }

    sheets.forEach((sheet, page) => {
      const lines = linesByPage.get(page) ?? [];
      // Put the white light behind the text and the shade above the page.
      // Use the same line boxes to cut holes in the shade.
      const shade = overlay('paper-citation-shade');
      shade.classList.toggle('has-citation-cutout', lines.length > 0);
      const holes = lines.map(line => {
        const [left, top, right, bottom] = paddedLine(line);
        return `M${left} ${top}H${right}V${bottom}H${left}Z`;
      });
      shade.append(path(SHADE_PATH + holes.join('')));
      animate(shade);
      sheet.append(shade);

      if (lines.length) {
        const glow = overlay('paper-citation-glow');
        drawLines(glow, lines);
        animate(glow);
        sheet.querySelector('img')!.before(glow);
      }
    });
  }

  function choose(index: number, source?: Element) {
    if (!segments[sections[index]?.note.id]?.length) return;
    trigger = source;
    if (index === active) {
      panel.focus({ preventScroll: true });
      return;
    }
    clearCitationHighlight();
    active = index;
    current = -1;
    const { note, hue, start, end } = sections[index];
    const moves = segments[note.id];
    pane.classList.add('is-paper-focused');
    sheets.forEach((sheet, i) => sheet.classList.toggle('is-outside-focus', i < start.page || i > end.page));
    zones.forEach((parts, i) => parts.forEach(part => part.setAttribute('aria-pressed', String(i === index))));
    panel.hidden = false;
    panel.style.setProperty('--focus-ink', hue.ink);

    const title = note.focusTitle ?? note.title;
    panel.setAttribute('aria-label', 'Focused passage: ' + title);
    cards = moves.map((move, i) => {
      const item = document.createElement('li');
      const color = moveColor(i);
      item.style.setProperty('--move-color', color);
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = move.label;
      const line = node('path');
      line.style.setProperty('--move-color', color);
      const card: MoveCard = { item, button, line, runs: move.runs };
      button.addEventListener('click', () => {
        markCurrent(i);
        const marginRun = pane.classList.contains('has-focus-room') ? card.visibleRun : undefined;
        const run = marginRun ?? move.runs[0];
        const sheet = sheets[run.page];
        scroll.scrollTo({ top: sheet.offsetTop + run.lines[0][1] / UNITS * sheet.offsetHeight - scroll.clientHeight * .18,
          behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      });
      item.append(button);
      return card;
    });
    list.replaceChildren(...cards.map(card => card.item));
    leaders.replaceChildren(...cards.map(card => card.line));
    panel.scrollTop = 0;
    draw();
    layoutCards();
    panel.focus({ preventScroll: true });
  }

  function clear(restore = false) {
    if (active < 0) return;
    const source = trigger;
    clearCitationHighlight();
    active = current = -1;
    trigger = undefined;
    pane.classList.remove('is-paper-focused');
    for (const sheet of sheets) sheet.classList.remove('is-outside-focus');
    for (const zone of zones.flat()) zone.setAttribute('aria-pressed', 'false');
    panel.hidden = true;
    draw();
    if (restore) {
      if ((source instanceof HTMLElement || source instanceof SVGElement) && source.getClientRects().length) source.focus({ preventScroll: true });
      else scroll.focus({ preventScroll: true });
    }
  }

  function build(data: SegmentIndex, passages: PaperSection[], pages: HTMLElement[]) {
    clear();
    segments = data;
    sections = passages;
    sheets = pages;
    zones.length = 0;
    const layers = sheets.map(sheet => {
      sheet.querySelector('.paper-focus-zones')?.remove();
      const layer = overlay('paper-focus-zones');
      sheet.prepend(layer);
      return layer;
    });
    sections.forEach(({ note, hue, start, end }, i) => {
      zones[i] = [];
      for (let page = start.page; page <= end.page; page++) {
        const zone = path(sectionPath(start, end, page));
        zone.setAttribute('fill', hue.tint);
        layers[page].append(zone);
        if (!segments[note.id]?.length) continue;
        zone.setAttribute('class', 'paper-focus-zone');
        zone.setAttribute('role', 'button');
        zone.setAttribute('tabindex', page === start.page ? '0' : '-1');
        zone.setAttribute('aria-label', `Focus passage: ${note.focusTitle ?? note.title}`);
        zone.setAttribute('aria-pressed', 'false');
        const toggleFocus = () => {
          if (active === i) clear(true);
          else choose(i, zone);
        };
        zone.addEventListener('click', toggleFocus);
        zone.addEventListener('keydown', e => {
          if (e.key !== 'Enter' && e.key !== ' ') return;
          e.preventDefault();
          if (!e.repeat) toggleFocus();
        });
        zones[i].push(zone);
      }
    });
  }

  panel.addEventListener('wheel', event => {
    if (event.ctrlKey || !pane.classList.contains('has-focus-room')) return;
    event.preventDefault();
    const unit = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16 : event.deltaMode === WheelEvent.DOM_DELTA_PAGE ? scroll.clientHeight : 1;
    scroll.scrollTop += event.deltaY * unit;
  }, { passive: false });
  window.addEventListener('keydown', e => {
    if (active >= 0 && e.key === 'Escape' && !e.defaultPrevented) { e.preventDefault(); clear(true); }
  });
  function layout(sideWidth: number) {
    pane.classList.toggle('has-focus-room', sideWidth > 0);
    if (sideWidth > 0) pane.style.setProperty('--focus-note-width', sideWidth + 'px');
    layoutCards();
  }
  return { build, choose, clear, layout, highlightCitation, clearCitationHighlight };
}
