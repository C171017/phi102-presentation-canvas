import type { PaperAnchor, PaperSection } from './paper-notes';
import './paper-focus.css';

const NS = 'http://www.w3.org/2000/svg';
const UNITS = 10000;
type Box = [number, number, number, number];
type Segment = { label: string; runs: { page: number; lines: Box[] }[] };
export type SegmentIndex = Record<string, Segment[]>;
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

export function createPaperFocus(pane: HTMLElement, scroll: HTMLElement) {
  let sections: PaperSection[] = [];
  let sheets: HTMLElement[] = [];
  let segments: SegmentIndex = {};
  let active = -1;
  let current = -1;
  let trigger: Element | undefined;
  const zones: SVGPathElement[][] = [];
  const drawings: SVGElement[] = [];
  const panel = document.createElement('section');
  panel.className = 'paper-focus-panel';
  panel.hidden = true;
  panel.setAttribute('aria-label', 'Focused passage');
  panel.innerHTML = `<header><span>Passage focus</span><button type="button" class="paper-focus-exit" aria-label="Exit passage focus" title="Exit passage focus (Esc)">×</button></header>
    <details><summary></summary>
    <ol aria-label="Sentence groups in reading order"></ol></details>`;
  pane.prepend(panel);
  const details = panel.querySelector('details')!;
  const summary = panel.querySelector('summary')!;
  const list = panel.querySelector('ol')!;
  const closeButton = panel.querySelector('button')!;

  function markCurrent(index: number) {
    current = index;
    for (const [i, item] of Array.from(list.children).entries()) {
      const button = item.firstElementChild!;
      if (i === current) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    }
    for (const layer of drawings) {
      layer.querySelectorAll<SVGElement>('[data-move]').forEach(mark => {
        mark.classList.toggle('is-current', Number(mark.dataset.move) === current);
      });
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
      const veil = path('M0 0H10000V10000H0Z' + sectionPath(start, end, page));
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
        for (const [left, top, right, bottom] of run.lines) {
          const rect = node('rect');
          rect.setAttribute('x', String(left - 10));
          rect.setAttribute('y', String(top - 2));
          rect.setAttribute('width', String(right - left + 20));
          rect.setAttribute('height', String(bottom - top + 4));
          rect.setAttribute('rx', '8');
          group.append(rect);
        }
        colors.append(group);
      }
      sheet.querySelector('.paper-focus-zones')!.append(colors);
      drawings.push(colors);
      sheet.append(layer);
      drawings.push(layer);
    });
    markCurrent(current);
  }

  function choose(index: number, source?: Element) {
    if (index === active || !segments[sections[index]?.note.id]) return;
    active = index;
    current = -1;
    trigger = source;
    const { note, hue, start, end } = sections[index];
    const moves = segments[note.id];
    pane.classList.add('is-paper-focused');
    sheets.forEach((sheet, i) => sheet.classList.toggle('is-outside-focus', i < start.page || i > end.page));
    zones.forEach((parts, i) => parts.forEach(part => part.setAttribute('aria-pressed', String(i === index))));
    panel.hidden = false;
    panel.style.setProperty('--focus-ink', hue.ink);

    const title = note.focusTitle ?? note.title;
    panel.setAttribute('aria-label', 'Focused passage: ' + title);
    const count = document.createElement('small');
    count.textContent = moves.length === 1 ? '1 argument move' : moves.length + ' argument moves';
    summary.replaceChildren(title, count);
    details.open = pane.classList.contains('has-focus-room');
    list.replaceChildren(...moves.map((move, i) => {
      const li = document.createElement('li');
      li.style.setProperty('--move-color', moveColor(i));
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = move.label;
      button.addEventListener('click', () => {
        markCurrent(i);
        const first = move.runs[0];
        if (!pane.classList.contains('has-focus-room')) details.open = false;
        const sheet = sheets[first.page];
        scroll.scrollTo({ top: sheet.offsetTop + first.lines[0][1] / UNITS * sheet.offsetHeight - scroll.clientHeight * .18,
          behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      });
      li.append(button);
      return li;
    }));
    draw();
    closeButton.focus({ preventScroll: true });
  }

  function clear(restore = false) {
    if (active < 0) return;
    const source = trigger;
    active = current = -1;
    trigger = undefined;
    pane.classList.remove('is-paper-focused');
    for (const sheet of sheets) sheet.classList.remove('is-outside-focus');
    for (const zone of zones.flat()) zone.setAttribute('aria-pressed', 'false');
    panel.hidden = true;
    draw();
    if (restore) {
      if (source instanceof HTMLElement || source instanceof SVGElement) source.focus({ preventScroll: true });
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

  closeButton.addEventListener('click', () => clear(true));
  window.addEventListener('keydown', e => {
    if (active >= 0 && e.key === 'Escape' && !e.defaultPrevented) { e.preventDefault(); clear(true); }
  });
  function setSideRoom(available: boolean) {
    if (pane.classList.contains('has-focus-room') === available) return;
    pane.classList.toggle('has-focus-room', available);
    if (active >= 0) details.open = available;
  }
  return { build, choose, clear, setSideRoom };
}
