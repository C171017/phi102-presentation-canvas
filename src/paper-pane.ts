import { slides } from './slide-content';
import { attachCollapsiblePaneResizer } from './collapsible-pane-resizer';
import type { createPaperHighlights } from './dev-paper-highlights';
import { createPaperNotes, type PaperAnchor } from './paper-notes';
import { createPaperGlossary } from './paper-glossary';
import type { SegmentIndex } from './paper-focus';
import './paper-pane.css';

// The paper scrolls independently. The passage cue offers a manual jump to
// the current slide's passage.

const ASSETS = `${import.meta.env.BASE_URL}readings/greco-2017/`;
const PREFS_KEY = 'phi102-dev-paper-v1';
const EDGE = 14; // gap between the pane and the window edge, matching the CSS
const MIN_WIDTH = 320;
const READING_LINE = 0.18; // where in the pane a slide's passage is placed, from the top
// Keys the canvas uses for slides, panning and zoom. Inside the pane they scroll the paper instead.
const CANVAS_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'PageUp', 'PageDown', 'Home', '+', '=', '-', '_', '0', 'f', 'F']);

type Page = { file: string; width: number; height: number; printed: string };
type Anchor = PaperAnchor;
type Manifest = { title: string; pages: Page[]; anchors: Record<string, Anchor> };
type Prefs = { open: boolean; width: number | null };
type PaperSectionLink = { number: string; title: string; anchor: string; children?: PaperSectionLink[] };

const PAPER_SECTION_LINKS: PaperSectionLink[] = [
  { number: '1', title: 'Regresses and foundations', anchor: 'regress-problem' },
  {
    number: '2', title: 'Routes to flexible foundationalism', anchor: 'paper-routes',
    children: [
      { number: '2.1', title: 'Social dimensions of justification', anchor: 'route-social-heading' },
      { number: '2.2', title: 'Hinges', anchor: 'route-hinges-heading' },
      { number: '2.3', title: 'Knowledge, belief, and flexible foundationalism', anchor: 'route-knowledge-heading' },
    ],
  },
  { number: '3', title: 'Relations to recent debates', anchor: 'versions-map-heading' },
  {
    number: '4', title: 'An application', anchor: 'paper-application',
    children: [
      { number: '4.1', title: 'Access and foundationalism', anchor: 'access-heading' },
      { number: '4.2', title: 'Access and flexible foundationalism', anchor: 'mobile-heading' },
    ],
  },
  { number: '5', title: 'Conclusion', anchor: 'conclusion-heading' },
];

type PaperPaneOptions = {
  initiallyOpen: boolean;
  rolePicker?: HTMLElement;
  lastReadingPage?: string;
  createHighlights?: typeof createPaperHighlights;
};

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
    const parsed: Anchor = { page: anchor.page, y: anchor.y };
    const split = anchor.split;
    if (isRecord(split) && typeof split.x === 'number' && split.x > 0 && split.x < 1 &&
        typeof split.bottom === 'number' && split.bottom > anchor.y && split.bottom <= 1) {
      parsed.split = { x: split.x, bottom: split.bottom };
    }
    anchors[id] = parsed;
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

export function createPaperPane(shell: HTMLElement, { initiallyOpen, rolePicker, lastReadingPage, createHighlights }: PaperPaneOptions) {
  const prefs = loadPrefs(initiallyOpen);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let current = -1;
  let slideAnchors: Anchor[] = [];
  let collapsedAnchor: Anchor | undefined;
  let pagesRequested = false;
  const sheets: HTMLElement[] = [];
  const images: HTMLImageElement[] = [];

  const pane = element('aside');
  pane.id = 'paper-pane';
  pane.setAttribute('aria-label', 'Original paper');

  const resizer = element('div', 'paper-resizer');
  resizer.tabIndex = 0;
  resizer.setAttribute('aria-controls', 'paper-pages');

  const collapse = element('button', 'paper-collapse', '›');
  collapse.type = 'button';
  collapse.setAttribute('aria-label', 'Collapse the original paper');
  collapse.setAttribute('aria-controls', 'paper-pages');
  collapse.title = 'Collapse the original paper (P)';
  collapse.addEventListener('click', () => {
    setOpen(false);
    savePrefs(prefs);
  });

  const outline = element('nav', 'paper-outline');
  outline.setAttribute('aria-label', 'Paper sections');
  outline.hidden = true;

  const scroll = element('div', 'paper-scroll');
  scroll.id = 'paper-pages';
  scroll.tabIndex = 0;
  scroll.setAttribute('role', 'region');
  scroll.setAttribute('aria-label', 'Pages of the original paper');

  const scrollIndicator = element('div', 'paper-scroll-indicator');
  scrollIndicator.setAttribute('aria-hidden', 'true');
  const scrollThumb = element('div', 'paper-scroll-thumb');
  scrollIndicator.append(scrollThumb);

  const passageCue = element('button', 'paper-passage-cue');
  passageCue.type = 'button';
  passageCue.hidden = true;
  const passageArrow = element('span', undefined, '↑');
  passageArrow.setAttribute('aria-hidden', 'true');
  passageCue.append(passageArrow);
  pane.append(resizer, collapse, outline, scroll, scrollIndicator, passageCue);
  shell.append(pane);
  const highlights = createHighlights?.(pane, scroll);
  const notes = createPaperNotes(pane, scroll, shell);
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
    const leftRoom = paneBounds.left - shell.getBoundingClientRect().left;
    // Keep the entire button on screen when the paper nearly fills the window.
    collapse.classList.toggle('is-inset', leftRoom < collapse.offsetWidth + 18);
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
    if (anchor) restoreAnchor(anchor);
  }

  function renderOpenState() {
    const { open } = prefs;
    pane.classList.toggle('is-collapsed', !open);
    collapse.hidden = !open;
    resizer.setAttribute('role', open ? 'separator' : 'button');
    resizer.setAttribute('aria-label', open ? 'Resize the paper pane' : 'Show the original paper');
    resizer.title = open ? 'Drag to resize. Drag past the minimum to collapse.' : 'Drag left or click to open the original paper (P)';
    if (open) {
      resizer.removeAttribute('aria-expanded');
      resizer.setAttribute('aria-orientation', 'vertical');
      applyWidth();
    } else {
      resizer.setAttribute('aria-expanded', 'false');
      for (const attribute of ['aria-orientation', 'aria-valuemin', 'aria-valuemax', 'aria-valuenow']) resizer.removeAttribute(attribute);
      pane.style.top = '';
    }
  }

  function setOpen(open: boolean) {
    if (open === prefs.open) return;
    if (!open) {
      if (pane.contains(document.activeElement)) resizer.focus({ preventScroll: true });
      notes.clearFocus();
      glossary.close();
      highlights?.setActive(false);
      glossary.setEnabled(true);
      collapsedAnchor = readingAnchor();
    }
    prefs.open = open;
    renderOpenState();
    if (open) {
      requestPages();
      if (collapsedAnchor) restoreAnchor(collapsedAnchor);
      collapsedAnchor = undefined;
    }
    updatePassageCue();
  }

  function offsetOf(anchor: Anchor) {
    const sheet = sheets[anchor.page];
    return sheet.offsetTop + anchor.y * sheet.offsetHeight;
  }

  function restoreAnchor(anchor: Anchor) {
    scroll.scrollTop = offsetOf(anchor) - scroll.clientHeight * READING_LINE;
  }

  function updatePassageCue() {
    const anchor = slideAnchors[current];
    if (!prefs.open || !anchor || scroll.clientHeight === 0) {
      passageCue.hidden = true;
      return;
    }
    const relativeTop = offsetOf(anchor) - scroll.scrollTop;
    const direction = relativeTop < 0 ? 'up' : relativeTop >= scroll.clientHeight ? 'down' : undefined;
    passageCue.hidden = direction === undefined;
    if (direction && passageCue.dataset.direction !== direction) {
      passageCue.dataset.direction = direction;
      passageCue.setAttribute('aria-label', `Go to the current slide’s passage ${direction === 'up' ? 'above' : 'below'}`);
    }
  }

  function jumpTo(anchor: Anchor, behavior: ScrollBehavior = reducedMotion.matches ? 'auto' : 'smooth') {
    notes.clearFocus();
    glossary.close();
    for (let page = anchor.page - 1; page <= anchor.page + 1; page++) if (images[page]) images[page].loading = 'eager';
    scroll.scrollTo({
      top: Math.max(0, offsetOf(anchor) - scroll.clientHeight * READING_LINE),
      behavior,
    });
  }

  passageCue.addEventListener('click', () => {
    const anchor = slideAnchors[current];
    if (!anchor || passageCue.hidden) return;
    jumpTo(anchor);
    scroll.focus({ preventScroll: true });
  });

  function buildSectionLinks(sections: PaperSectionLink[], anchors: Manifest['anchors']): HTMLOListElement {
    const list = element('ol');
    list.setAttribute('role', 'list');
    for (const section of sections) {
      const anchor = anchors[section.anchor];
      if (!anchor || anchor.page >= sheets.length) continue;
      const item = element('li');
      const button = element('button', undefined, section.number);
      button.type = 'button';
      button.title = section.title;
      button.setAttribute('aria-label', `Section ${section.number} ${section.title}`);
      button.setAttribute('aria-controls', scroll.id);
      button.addEventListener('click', () => jumpTo(anchor, 'auto'));
      item.append(button);
      if (section.children) {
        const children = buildSectionLinks(section.children, anchors);
        if (children.childElementCount) item.append(children);
      }
      list.append(item);
    }
    return list;
  }

  function readingAnchor(): Anchor | undefined {
    if (!sheets.length) return;
    if (scroll.scrollTop <= 0) return { page: 0, y: 0 };
    const line = scroll.scrollTop + scroll.clientHeight * READING_LINE;
    let anchor = { page: 0, y: 0 };
    sheets.forEach((sheet, index) => {
      if (sheet.offsetTop <= line) anchor = { page: index, y: Math.min(1, (line - sheet.offsetTop) / sheet.offsetHeight) };
    });
    return anchor;
  }

  function buildPages(loaded: Manifest, segments: SegmentIndex) {
    const lastPage = loaded.pages.findIndex(page => page.printed === lastReadingPage);
    const visiblePages = lastPage < 0 ? loaded.pages : loaded.pages.slice(0, lastPage + 1);
    scroll.replaceChildren();
    visiblePages.forEach(page => {
      const figure = element('figure', 'paper-page');
      const image = new Image(page.width, page.height);
      image.alt = `Page ${page.printed} of the paper`;
      image.decoding = 'async';
      image.loading = 'lazy';
      image.draggable = false;
      image.src = `${ASSETS}${page.file}?render=clean`;
      figure.append(image);
      scroll.append(figure);
      sheets.push(figure);
      images.push(image);
    });
    const sectionLinks = buildSectionLinks(PAPER_SECTION_LINKS, loaded.anchors);
    outline.replaceChildren(sectionLinks);
    outline.hidden = !sectionLinks.childElementCount;
    void highlights?.load(`${ASSETS}words.json`, images, visiblePages.map(page => page.file));
    void glossary.load(`${ASSETS}glossary.json`, visiblePages.map(({ file }, index) => ({ file, sheet: sheets[index] })));
    notes.build(loaded.anchors, sheets, segments);
    // A slide without its own anchor continues from the previous slide's passage.
    let previous: Anchor = { page: 0, y: 0 };
    slideAnchors = slides.map(slide => {
      const id = ('paperAnchor' in slide ? slide.paperAnchor : undefined) ?? slide.members[0];
      const anchor = loaded.anchors[id];
      if (!anchor) console.warn(`No paper passage is mapped for "${id}". Add it to scripts/paper-anchors.json.`);
      if (anchor && anchor.page < visiblePages.length) previous = anchor;
      return previous;
    });
    if (prefs.open) applyWidth();
    updatePassageCue();
  }

  function showFailure(reason: string) {
    const message = element('div', 'paper-message');
    message.append(
      element('p', undefined, 'The paper pages have not been rendered yet.'),
      element('code', undefined, 'npm run paper:pages'),
      element('p', 'paper-detail', reason),
    );
    scroll.replaceChildren(message);
  }

  function requestPages() {
    if (pagesRequested) return;
    pagesRequested = true;
    void load();
  }

  async function load() {
    scroll.replaceChildren(element('p', 'paper-message', 'Loading the paper pages…'));
    try {
      const [response, segments] = await Promise.all([
        fetch(`${ASSETS}manifest.json`, { cache: 'no-store' }),
        fetch(`${ASSETS}segments.json`, { cache: 'no-cache' }).then(r => {
          if (!r.ok) throw new Error('No segment index');
          return r.json() as Promise<SegmentIndex>;
        }).catch(error => { console.warn('Passage focus is unavailable.', error); return {}; }),
      ]);
      // Vite answers unknown paths with index.html, so check the type as well as the status.
      if (!response.ok || !response.headers.get('content-type')?.includes('json')) throw new Error('The paper manifest is unavailable.');
      const loaded = parseManifest(await response.json());
      if (!loaded) throw new Error('manifest.json is not in the expected format');
      buildPages(loaded, segments);
    } catch (error) {
      pagesRequested = false;
      if (createHighlights) showFailure(error instanceof Error ? error.message : String(error));
      else {
        console.warn('Could not load the original paper.', error);
        scroll.replaceChildren(element('p', 'paper-message', 'The paper could not be loaded. Close and reopen it to retry.'));
      }
    }
  }

  function update(index: number) {
    if (index < 0 || index === current) return;
    current = index;
    glossary.close();
    pane.style.setProperty('--paper-slide-progress', String(index / Math.max(1, slides.length - 1)));
    updatePassageCue();
  }

  let hideScrollIndicator: number | undefined;
  let hideSectionTree: number | undefined;
  let sectionTreeHovered = false;

  function scheduleSectionTreeHide() {
    window.clearTimeout(hideSectionTree);
    if (!sectionTreeHovered) {
      hideSectionTree = window.setTimeout(() => outline.classList.remove('is-scrolling'), 5_000);
    }
  }

  outline.addEventListener('pointerenter', event => {
    if (event.pointerType === 'touch') return;
    sectionTreeHovered = true;
    outline.classList.add('is-scrolling');
    window.clearTimeout(hideSectionTree);
  });
  outline.addEventListener('pointerleave', event => {
    if (event.pointerType === 'touch') return;
    sectionTreeHovered = false;
    scheduleSectionTreeHide();
  });

  scroll.addEventListener('scroll', () => {
    updatePassageCue();
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

    outline.classList.add('is-scrolling');
    scheduleSectionTreeHide();
  }, { passive: true });
  new ResizeObserver(updatePassageCue).observe(scroll);

  pane.addEventListener('keydown', event => {
    if (!event.metaKey && !event.ctrlKey && !event.altKey && CANVAS_KEYS.has(event.key)) event.stopPropagation();
  });
  // Pinching over the pane must not zoom the whole browser page.
  pane.addEventListener('wheel', event => { if (event.ctrlKey) event.preventDefault(); }, { passive: false });
  // A sheet scales with the pane. Keep the reader on the same sentence when
  // the window switches between the margin outline and its compact header.
  let focusAnchor: Anchor | undefined;
  let lastWindowWidth = window.innerWidth;
  function rememberFocusAnchor() {
    if (window.innerWidth === lastWindowWidth && pane.classList.contains('is-paper-focused')) focusAnchor = readingAnchor();
  }
  scroll.addEventListener('scroll', rememberFocusAnchor, { passive: true });
  pane.addEventListener('focusin', rememberFocusAnchor);
  window.addEventListener('resize', () => {
    if (!prefs.open) return;
    const anchor = pane.classList.contains('is-paper-focused') ? focusAnchor : undefined;
    lastWindowWidth = window.innerWidth;
    applyWidth();
    if (anchor) requestAnimationFrame(() => restoreAnchor(anchor));
  });
  window.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.isComposing || event.ctrlKey || event.altKey || event.shiftKey) return;
    if (event.target instanceof HTMLElement && (event.target.isContentEditable || event.target.closest('input, textarea, select'))) return;
    const key = event.key.toLowerCase();
    if (event.metaKey && key === 'b' && highlights?.ready) {
      event.preventDefault();
      if (event.repeat || isResizing()) return;
      if (!prefs.open) {
        setOpen(true);
        savePrefs(prefs);
      }
      notes.clearFocus();
      highlights.setActive(!highlights.active);
      glossary.setEnabled(!highlights.active);
      if (highlights.active) scroll.focus({ preventScroll: true });
      return;
    }
    if (event.metaKey && key === 'z' && highlights?.active) {
      event.preventDefault();
      if (!event.repeat) highlights.undo();
      return;
    }
    if (event.metaKey || event.repeat || key !== 'p') return;
    event.preventDefault();
    if (isResizing()) return;
    setOpen(!prefs.open);
    savePrefs(prefs);
  });

  const isResizing = attachCollapsiblePaneResizer(pane, resizer, {
    inward: -1,
    getSize: () => ({ open: prefs.open, size: pane.getBoundingClientRect().width, min: minWidth(), preferred: prefs.width }),
    setOpen,
    setSize: setWidth,
    save: (_axis, previousSize) => {
      if (previousSize !== undefined) prefs.width = previousSize;
      savePrefs(prefs);
    },
  });

  renderOpenState();
  update(slideFromProgressBar());
  if (prefs.open || highlights) requestPages();
  return { update };
}
