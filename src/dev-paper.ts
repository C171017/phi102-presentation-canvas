import { slides } from './slide-content';
import './dev-paper.css';

// "Original paper" pane: local development only.
//
// main.ts imports this module from its `import.meta.env.DEV` branch, so a
// production build neither bundles nor references it. The page images come from
// `local-reading/` (git-ignored, outside `public/`), made by `npm run paper:pages`.
//
// It is a floating overlay. It never resizes the canvas, moves the camera, or
// touches the saved layout: it only reads which slide is current and scrolls
// its own pages to that slide's passage.

const ASSETS = '/local-reading/greco-2017/';
const PREFS_KEY = 'phi102-dev-paper-v1';
const EDGE = 14; // gap between the pane and the window edge, matching the CSS
const MIN_WIDTH = 320;
const READING_LINE = 0.18; // where in the pane a slide's passage is placed, from the top
// Keys the canvas uses for slides, panning and zoom. Inside the pane they scroll the paper instead.
const CANVAS_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'PageUp', 'PageDown', 'Home', '+', '=', '-', '_', '0', 'f', 'F']);

type Page = { file: string; width: number; height: number; printed: string };
type Anchor = { page: number; y: number };
type Manifest = { title: string; pages: Page[]; anchors: Record<string, Anchor> };
type Prefs = { open: boolean; follow: boolean; width: number | null };

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

function loadPrefs(): Prefs {
  const prefs: Prefs = { open: true, follow: true, width: null };
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(PREFS_KEY) ?? 'null');
    if (isRecord(stored)) {
      if (typeof stored.open === 'boolean') prefs.open = stored.open;
      if (typeof stored.follow === 'boolean') prefs.follow = stored.follow;
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

export function createPaperPane(shell: HTMLElement, openSlide: (index: number) => void) {
  const prefs = loadPrefs();
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let manifest: Manifest | undefined;
  let current = slideFromProgressBar();
  let slideAnchors: Anchor[] = [];
  let slidePositions: number[] = []; // page index + fraction down the page, one per slide
  let marker: HTMLElement | undefined;
  let frame: number | undefined;
  let keepScroll = false; // set while this pane itself moves the canvas, so it does not scroll back
  const sheets: HTMLElement[] = [];
  const images: HTMLImageElement[] = [];

  const pane = element('aside');
  pane.id = 'paper-pane';
  pane.setAttribute('aria-label', 'Original paper (local development only)');

  const resizer = element('div', 'paper-resizer');
  resizer.setAttribute('role', 'separator');
  resizer.setAttribute('aria-orientation', 'vertical');
  resizer.setAttribute('aria-label', 'Resize the paper pane. Arrow keys change its width.');
  resizer.tabIndex = 0;

  const header = element('header', 'paper-header');
  const heading = element('div', 'paper-title');
  const headingName = element('strong', undefined, 'Original paper');
  const headingSource = element('span', undefined, 'Loading…');
  heading.append(headingName, headingSource);
  const followButton = button('Follow slides', 'paper-follow', 'Scroll to each slide’s passage as the canvas moves');
  const closeButton = button('Hide', 'paper-close', 'Hide the paper (P)');
  closeButton.setAttribute('aria-label', 'Hide the paper pane');
  header.append(heading, followButton, closeButton);

  const status = element('div', 'paper-status');
  const where = element('span', 'paper-where');
  const actions = element('span', 'paper-actions');
  const backButton = button('', 'paper-back');
  const syncButton = button('', 'paper-sync');
  backButton.hidden = syncButton.hidden = true;
  actions.append(backButton, syncButton);
  status.append(where, actions);

  const scroll = element('div', 'paper-scroll');
  scroll.tabIndex = 0;
  scroll.setAttribute('role', 'region');
  scroll.setAttribute('aria-label', 'Pages of the original paper');
  scroll.append(element('p', 'paper-message', 'Loading the paper pages…'));

  pane.append(resizer, header, status, scroll);

  const tab = button('Paper', 'paper-tab', 'Show the original paper (P)');
  tab.id = 'paper-tab';
  tab.setAttribute('aria-label', 'Show the original paper');
  shell.append(pane, tab);

  function slideFromProgressBar() {
    return Array.from(document.querySelectorAll('#slide-progress button')).findIndex(item => item.hasAttribute('aria-current'));
  }

  function maxWidth() { return Math.max(MIN_WIDTH, Math.min(1100, shell.clientWidth * 0.7)); }

  function applyWidth() {
    if (prefs.width === null) pane.style.removeProperty('--paper-width');
    else pane.style.setProperty('--paper-width', `${prefs.width}px`);
    resizer.setAttribute('aria-valuemin', String(MIN_WIDTH));
    resizer.setAttribute('aria-valuemax', String(Math.round(maxWidth())));
    resizer.setAttribute('aria-valuenow', String(Math.round(pane.getBoundingClientRect().width)));
  }

  function setWidth(width: number) {
    // Page images scale with the pane, so keep the same place in the paper.
    const ratio = scroll.scrollTop / Math.max(1, scroll.scrollHeight);
    prefs.width = Math.round(Math.min(maxWidth(), Math.max(MIN_WIDTH, width)));
    applyWidth();
    scroll.scrollTop = ratio * scroll.scrollHeight;
    schedule();
  }

  function setOpen(open: boolean) {
    prefs.open = open;
    savePrefs(prefs);
    pane.hidden = !open;
    tab.hidden = open;
    if (!open) return;
    applyWidth();
    if (prefs.follow) scrollToSlide(current, false);
    refreshStatus();
  }

  function setFollow(follow: boolean) {
    prefs.follow = follow;
    savePrefs(prefs);
    followButton.setAttribute('aria-pressed', String(follow));
    if (follow) scrollToSlide(current, true);
    refreshStatus();
  }

  function offsetOf(anchor: Anchor) {
    const sheet = sheets[anchor.page];
    return sheet.offsetTop + anchor.y * sheet.offsetHeight;
  }

  function placeMarker(anchor: Anchor | undefined) {
    marker?.remove();
    marker = undefined;
    if (!anchor || !sheets[anchor.page]) return;
    marker = element('span', 'paper-marker');
    marker.setAttribute('aria-hidden', 'true');
    marker.style.top = `${anchor.y * 100}%`;
    sheets[anchor.page].append(marker);
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

  function readingPosition() {
    const line = scroll.scrollTop + scroll.clientHeight * READING_LINE;
    let position = 0;
    sheets.forEach((sheet, index) => {
      if (sheet.offsetTop <= line) position = index + Math.min(1, (line - sheet.offsetTop) / sheet.offsetHeight);
    });
    return position;
  }

  function nearestSlide(position: number) {
    let nearest = 0;
    slidePositions.forEach((slidePosition, index) => { if (slidePosition <= position + 0.02) nearest = index; });
    return nearest;
  }

  function refreshStatus() {
    frame = undefined;
    if (pane.hidden || !manifest) return;
    const slide = slides[current];
    const anchor = slideAnchors[current];
    where.textContent = slide
      ? `Slide ${current + 1} · ${slide.title}${anchor ? ` → p. ${manifest.pages[anchor.page].printed}` : ''}`
      : 'Choose a slide on the canvas to follow it';
    backButton.hidden = syncButton.hidden = true;
    if (!slide || !anchor) return;
    const position = readingPosition();
    if (Math.abs(position - slidePositions[current]) <= 0.05) return;
    backButton.textContent = `Back to slide ${current + 1}`;
    backButton.hidden = false;
    const nearest = nearestSlide(position);
    if (nearest !== current) {
      syncButton.textContent = `Go to slide ${nearest + 1}`;
      syncButton.title = `Move the canvas to “${slides[nearest].title}”, the slide for this passage`;
      syncButton.dataset.slide = String(nearest);
      syncButton.hidden = false;
    }
  }

  function schedule() { frame ??= requestAnimationFrame(refreshStatus); }

  function buildPages(loaded: Manifest) {
    manifest = loaded;
    const first = loaded.pages[0].printed, last = loaded.pages[loaded.pages.length - 1].printed;
    headingSource.textContent = `${loaded.title} · pp. ${first}–${last}`;
    headingSource.title = headingSource.textContent;
    scroll.replaceChildren();
    loaded.pages.forEach((page, index) => {
      const sheet = element('section', 'paper-sheet');
      const figure = element('figure', 'paper-page');
      figure.style.aspectRatio = `${page.width} / ${page.height}`;
      const image = new Image(page.width, page.height);
      image.alt = `Page ${page.printed} of the paper (PDF page ${index + 1} of ${loaded.pages.length})`;
      image.decoding = 'async';
      image.loading = 'lazy';
      image.draggable = false;
      image.src = `${ASSETS}${page.file}`;
      figure.append(image);
      sheet.append(figure, element('p', 'paper-folio', `p. ${page.printed} · PDF page ${index + 1} of ${loaded.pages.length}`));
      scroll.append(sheet);
      sheets.push(figure);
      images.push(image);
    });
    // A slide without its own anchor continues from the previous slide's passage.
    let previous: Anchor = { page: 0, y: 0 };
    slideAnchors = slides.map(({ members }) => {
      const anchor = loaded.anchors[members[0]];
      if (!anchor) console.warn(`No paper passage is mapped for "${members[0]}". Add it to scripts/paper-anchors.json.`);
      previous = anchor ?? previous;
      return previous;
    });
    slidePositions = slideAnchors.map(anchor => anchor.page + anchor.y);
    placeMarker(slideAnchors[current]);
    if (!pane.hidden) {
      applyWidth();
      if (prefs.follow) scrollToSlide(current, false);
      refreshStatus();
    }
  }

  function showFailure(reason: string) {
    const message = element('div', 'paper-message');
    message.append(
      element('p', undefined, 'The paper pages have not been rendered yet.'),
      element('code', undefined, 'npm run paper:pages'),
      element('p', 'paper-detail', reason),
    );
    scroll.replaceChildren(message);
    where.textContent = 'Render the pages once; they stay on this Mac only.';
    headingSource.textContent = 'Not rendered';
  }

  async function load() {
    try {
      const response = await fetch(`${ASSETS}manifest.json`, { cache: 'no-store' });
      // Vite answers unknown paths with index.html, so check the type as well as the status.
      if (!response.ok || !response.headers.get('content-type')?.includes('json')) throw new Error('local-reading/greco-2017/manifest.json was not found.');
      const loaded = parseManifest(await response.json());
      if (!loaded) throw new Error('manifest.json is not in the expected format');
      buildPages(loaded);
    } catch (error) {
      showFailure(error instanceof Error ? error.message : String(error));
    }
  }

  function update(index: number) {
    if (index < 0 || index === current) return;
    const first = current < 0; // the canvas has just found its slide after a page load: jump, don't sweep
    current = index;
    if (!manifest) return; // buildPages places everything for the slide that is current by then
    placeMarker(slideAnchors[index]);
    if (prefs.follow && !keepScroll) scrollToSlide(index, !first);
    refreshStatus();
  }

  followButton.setAttribute('aria-pressed', String(prefs.follow));
  followButton.addEventListener('click', () => setFollow(!prefs.follow));
  closeButton.addEventListener('click', () => setOpen(false));
  tab.addEventListener('click', () => setOpen(true));
  backButton.addEventListener('click', () => scrollToSlide(current, true));
  syncButton.addEventListener('click', () => {
    const index = Number(syncButton.dataset.slide);
    if (!Number.isInteger(index)) return;
    // The canvas reports the new slide synchronously; the passage being read stays put.
    keepScroll = true;
    try { openSlide(index); } finally { keepScroll = false; }
  });
  scroll.addEventListener('scroll', schedule, { passive: true });
  pane.addEventListener('keydown', event => {
    if (!event.metaKey && !event.ctrlKey && !event.altKey && CANVAS_KEYS.has(event.key)) event.stopPropagation();
  });
  // Pinching over the pane must not zoom the whole browser page.
  pane.addEventListener('wheel', event => { if (event.ctrlKey) event.preventDefault(); }, { passive: false });
  window.addEventListener('resize', () => { if (!pane.hidden) { applyWidth(); schedule(); } });
  window.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.isComposing || event.repeat || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || event.key.toLowerCase() !== 'p') return;
    if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    event.preventDefault();
    setOpen(pane.hidden);
  });

  let resizing: number | undefined;
  resizer.addEventListener('pointerdown', event => {
    if (event.button !== 0 || resizing !== undefined) return;
    event.preventDefault();
    resizing = event.pointerId;
    resizer.setPointerCapture(event.pointerId);
    pane.classList.add('is-resizing');
  });
  resizer.addEventListener('pointermove', event => {
    if (resizing !== event.pointerId) return;
    setWidth(shell.getBoundingClientRect().right - EDGE - event.clientX);
  });
  const finishResize = (event: PointerEvent) => {
    if (resizing !== event.pointerId) return;
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

  pane.hidden = !prefs.open;
  tab.hidden = prefs.open;
  applyWidth();
  void load();
  return { update };
}
