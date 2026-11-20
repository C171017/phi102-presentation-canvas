import { slides } from './slide-content';
import { createPaperGlossary } from './paper-glossary';
import './paper-pane.css';

// It is a floating overlay. It never resizes the canvas, moves the camera, or
// touches the saved layout: it only reads which slide is current and scrolls
// its own pages to that slide's passage.

const ASSETS = `${import.meta.env.BASE_URL}readings/greco-2017/`;
const PREFS_KEY = 'phi102-dev-paper-v1';
const EDGE = 14; // gap between the pane and the window edge, matching the CSS
const MIN_WIDTH = 320;
const READING_LINE = 0.18; // where in the pane a slide's passage is placed, from the top
// Keys the canvas uses for slides, panning and zoom. Inside the pane they scroll the paper instead.
const CANVAS_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'PageUp', 'PageDown', 'Home', '+', '=', '-', '_', '0', 'f', 'F']);

type Page = { file: string; width: number; height: number; printed: string };
type Anchor = { page: number; y: number };
type Manifest = { title: string; pages: Page[]; anchors: Record<string, Anchor> };
type Prefs = { open: boolean; width: number | null };
type PaperPaneOptions = { initiallyOpen: boolean; rolePicker?: HTMLElement };

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

function parseManifest(value: unknown): Manifest | null {
  if (!isRecord(value) || typeof value.title !== 'string' || !Array.isArray(value.pages) || !isRecord(value.anchors)) return null;
  const pages: Page[] = [];
  for (const page of value.pages) {
    if (!isRecord(page) || typeof page.file !== 'string' || !/^[\w.-]+$/.test(page.file) || typeof page.printed !== 'string' ||
        typeof page.width !== 'number' || typeof page.height !== 'number' || !(page.width > 0) || !(page.height > 0)) return null;
    pages.push({ file: page.file, width: page.width, height: page.height, printed: page.printed });
  }
  if (!pages.length) return null;
  const anchors: Record<string, Anchor> = {};
  for (const [id, anchor] of Object.entries(value.anchors)) {
    if (!isRecord(anchor) || typeof anchor.page !== 'number' || !Number.isInteger(anchor.page) ||
        anchor.page < 0 || anchor.page >= pages.length || typeof anchor.y !== 'number' || !(anchor.y >= 0 && anchor.y <= 1)) return null;
    anchors[id] = { page: anchor.page, y: anchor.y };
  }
  return { title: value.title, pages, anchors };
}

function loadPrefs(initiallyOpen: boolean): Prefs {
  const prefs: Prefs = { open: initiallyOpen, width: null };
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(PREFS_KEY) ?? 'null');
    if (isRecord(stored)) {
      if (typeof stored.open === 'boolean') prefs.open = stored.open;
      if (typeof stored.width === 'number' && Number.isFinite(stored.width)) prefs.width = stored.width;
    }
  } catch { /* Storage can be unavailable; the defaults are fine. */ }
  return prefs;
}

function savePrefs(prefs: Prefs) {
  try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch { /* The pane still works without it. */ }
}

function element<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function button(label: string, className: string, title?: string) {
  const node = element('button', className, label);
  node.type = 'button';
  if (title) node.title = title;
  return node;
}

export function createPaperPane(shell: HTMLElement, { initiallyOpen, rolePicker }: PaperPaneOptions) {
  const prefs = loadPrefs(initiallyOpen);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let current = slideFromProgressBar();
  let slideAnchors: Anchor[] = [];
  let pagesRequested = false;
  const sheets: HTMLElement[] = [];
  const images: HTMLImageElement[] = [];

  const pane = element('aside');
  pane.id = 'paper-pane';
  pane.setAttribute('aria-label', 'Original paper');
  const close = button('×', 'paper-close', 'Hide the original paper (P)');
  close.setAttribute('aria-label', 'Hide the original paper');

  const resizer = element('div', 'paper-resizer');
  resizer.setAttribute('role', 'separator');
  resizer.setAttribute('aria-orientation', 'vertical');
  resizer.setAttribute('aria-label', 'Resize the paper pane');
  resizer.title = 'Drag to resize the paper pane';
  resizer.tabIndex = 0;

  const scroll = element('div', 'paper-scroll');
  scroll.tabIndex = 0;
  scroll.setAttribute('role', 'region');
  scroll.setAttribute('aria-label', 'Pages of the original paper');

  const scrollIndicator = element('div', 'paper-scroll-indicator');
  scrollIndicator.setAttribute('aria-hidden', 'true');
  const scrollThumb = element('div', 'paper-scroll-thumb');
  scrollIndicator.append(scrollThumb);
  pane.append(resizer, scroll, scrollIndicator, close);

  const tab = button('Paper', 'paper-tab', 'Show the original paper (P)');
  tab.id = 'paper-tab';
  tab.setAttribute('aria-label', 'Show the original paper');
  tab.setAttribute('aria-controls', pane.id);
  shell.append(pane, tab);
  const glossary = createPaperGlossary(pane, scroll);

  function slideFromProgressBar() {
    return Array.from(document.querySelectorAll('#slide-progress button')).findIndex(item => item.hasAttribute('aria-current'));
  }

  function minWidth() { return Math.max(0, Math.min(MIN_WIDTH, shell.clientWidth - 2 * EDGE)); }
  function maxWidth() { return Math.max(minWidth(), Math.min(1100, Math.max(380, shell.clientWidth * 0.7), shell.clientWidth - 2 * EDGE)); }
  function clampWidth(width: number) { return Math.round(Math.min(maxWidth(), Math.max(minWidth(), width))); }

  function applyWidth() {
    if (prefs.width === null) pane.style.removeProperty('--paper-width');
    else pane.style.setProperty('--paper-width', `${clampWidth(prefs.width)}px`);
    resizer.setAttribute('aria-valuemin', String(minWidth()));
    resizer.setAttribute('aria-valuemax', String(Math.round(maxWidth())));
    const paneBounds = pane.getBoundingClientRect();
    resizer.setAttribute('aria-valuenow', String(Math.round(paneBounds.width)));
    if (!rolePicker) return;
    const pickerBounds = rolePicker.getBoundingClientRect();
    // Give the paper the full height whenever it fits beside the centered controls.
    const gap = 8;
    pane.style.top = paneBounds.left < pickerBounds.right + gap
      ? `${rolePicker.offsetTop + rolePicker.offsetHeight + gap}px`
      : '';
  }

  function setWidth(width: number) {
    const anchor = readingAnchor();
    prefs.width = clampWidth(width);
    applyWidth();
    if (anchor) scroll.scrollTop = offsetOf(anchor) - scroll.clientHeight * READING_LINE;
  }

  function setOpen(open: boolean) {
    if (!open) glossary.close();
    prefs.open = open;
    savePrefs(prefs);
    renderOpen();
  }

  function renderOpen() {
    pane.hidden = !prefs.open;
    tab.hidden = prefs.open;
    if (!prefs.open) return;
    applyWidth();
    scrollToSlide(current, false);
    if (!pagesRequested) {
      pagesRequested = true;
      void load();
    }
  }

  function offsetOf(anchor: Anchor) {
    const sheet = sheets[anchor.page];
    return sheet.offsetTop + anchor.y * sheet.offsetHeight;
  }

  function scrollToSlide(index: number, smooth: boolean) {
    const anchor = slideAnchors[index];
    if (!anchor || pane.hidden) return;
    for (let page = anchor.page - 1; page <= anchor.page + 1; page++) if (images[page]) images[page].loading = 'eager';
    scroll.scrollTo({
      top: Math.max(0, offsetOf(anchor) - scroll.clientHeight * READING_LINE),
      behavior: smooth && !reducedMotion.matches ? 'smooth' : 'auto',
    });
  }

  function readingAnchor(): Anchor | undefined {
    const line = scroll.scrollTop + scroll.clientHeight * READING_LINE;
    let anchor = sheets.length ? { page: 0, y: 0 } : undefined;
    sheets.forEach((sheet, index) => {
      if (sheet.offsetTop <= line) anchor = { page: index, y: Math.min(1, (line - sheet.offsetTop) / sheet.offsetHeight) };
    });
    return anchor;
  }

  function buildPages(loaded: Manifest) {
    scroll.replaceChildren();
    loaded.pages.forEach(page => {
      const figure = element('figure', 'paper-page');
      const image = new Image(page.width, page.height);
      image.alt = `Page ${page.printed} of the paper`;
      image.decoding = 'async';
      image.loading = 'lazy';
      image.draggable = false;
      image.src = `${ASSETS}${page.file}`;
      figure.append(image);
      scroll.append(figure);
      sheets.push(figure);
      images.push(image);
    });
    void glossary.load(`${ASSETS}glossary.json`, loaded.pages.map(({ file }, index) => ({ file, sheet: sheets[index] })));
    // A slide without its own anchor continues from the previous slide's passage.
    let previous: Anchor = { page: 0, y: 0 };
    slideAnchors = slides.map(({ members }) => {
      const anchor = loaded.anchors[members[0]];
      if (!anchor) console.warn(`No paper passage is mapped for "${members[0]}". Add it to scripts/paper-anchors.json.`);
      previous = anchor ?? previous;
      return previous;
    });
    if (!pane.hidden) {
      applyWidth();
      scrollToSlide(current, false);
    }
  }

  async function load() {
    scroll.replaceChildren(element('p', 'paper-message', 'Loading the paper pages…'));
    try {
      const response = await fetch(`${ASSETS}manifest.json`, { cache: 'no-cache' });
      // Vite answers unknown paths with index.html, so check the type as well as the status.
      if (!response.ok || !response.headers.get('content-type')?.includes('json')) throw new Error('The paper manifest is unavailable');
      const loaded = parseManifest(await response.json());
      if (!loaded) throw new Error('manifest.json is not in the expected format');
      buildPages(loaded);
    } catch (error) {
      pagesRequested = false;
      console.warn('Could not load the original paper.', error);
      scroll.replaceChildren(element('p', 'paper-message', 'The paper could not be loaded. Close and reopen it to retry.'));
    }
  }

  function update(index: number) {
    if (index < 0 || index === current) return;
    const first = current < 0; // the canvas has just found its slide after a page load: jump, don't sweep
    current = index;
    glossary.close();
    if (!slideAnchors.length) return; // buildPages places everything for the slide that is current by then
    scrollToSlide(index, !first);
  }

  let hideScrollIndicator: number | undefined;
  scroll.addEventListener('scroll', () => {
    const { clientHeight, scrollHeight, scrollTop } = scroll;
    const maxScroll = scrollHeight - clientHeight;
    const indicatorHeight = scrollIndicator.clientHeight;
    if (maxScroll <= 0 || indicatorHeight <= 0) return;
    const thumbHeight = Math.min(indicatorHeight, Math.max(24, indicatorHeight * clientHeight / scrollHeight));
    const progress = Math.max(0, Math.min(1, scrollTop / maxScroll));
    scrollThumb.style.height = `${thumbHeight}px`;
    scrollThumb.style.transform = `translateY(${progress * (indicatorHeight - thumbHeight)}px)`;
    scrollIndicator.classList.add('is-visible');
    window.clearTimeout(hideScrollIndicator);
    hideScrollIndicator = window.setTimeout(() => scrollIndicator.classList.remove('is-visible'), 600);
  }, { passive: true });

  tab.addEventListener('click', () => {
    setOpen(true);
    scroll.focus({ preventScroll: true });
  });
  close.addEventListener('click', () => {
    setOpen(false);
    tab.focus({ preventScroll: true });
  });
  pane.addEventListener('keydown', event => {
    if (!event.metaKey && !event.ctrlKey && !event.altKey && CANVAS_KEYS.has(event.key)) event.stopPropagation();
  });
  // Pinching over the pane must not zoom the whole browser page.
  pane.addEventListener('wheel', event => { if (event.ctrlKey) event.preventDefault(); }, { passive: false });
  window.addEventListener('resize', () => { if (!pane.hidden) applyWidth(); });
  window.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.isComposing || event.repeat || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || event.key.toLowerCase() !== 'p') return;
    if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    event.preventDefault();
    const focusWasInPane = pane.contains(document.activeElement);
    setOpen(pane.hidden);
    if (focusWasInPane) tab.focus({ preventScroll: true });
  });

  let resizing: { pointerId: number; x: number; width: number } | undefined;
  resizer.addEventListener('pointerdown', event => {
    if (event.button !== 0 || resizing !== undefined) return;
    event.preventDefault();
    resizing = { pointerId: event.pointerId, x: event.clientX, width: pane.getBoundingClientRect().width };
    resizer.setPointerCapture(event.pointerId);
    pane.classList.add('is-resizing');
  });
  resizer.addEventListener('pointermove', event => {
    if (resizing?.pointerId !== event.pointerId) return;
    setWidth(resizing.width + resizing.x - event.clientX);
  });
  const finishResize = (event: PointerEvent) => {
    if (resizing?.pointerId !== event.pointerId) return;
    resizing = undefined;
    pane.classList.remove('is-resizing');
    savePrefs(prefs);
  };
  resizer.addEventListener('pointerup', finishResize);
  resizer.addEventListener('pointercancel', finishResize);
  resizer.addEventListener('lostpointercapture', finishResize);
  resizer.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    event.stopPropagation();
    setWidth(pane.getBoundingClientRect().width + (event.key === 'ArrowLeft' ? 1 : -1) * (event.shiftKey ? 96 : 24));
    savePrefs(prefs);
  });

  renderOpen();
  return { update };
}
