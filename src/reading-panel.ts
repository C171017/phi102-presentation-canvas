import { slides } from './slide-content';
import { slideReadings } from './slide-readings';
import { attachCollapsiblePaneResizer } from './collapsible-pane-resizer';
import './reading-panel.css';

const PREFS_KEY = 'phi102-slide-notes-v1';
type Prefs = { open: boolean; x: number | null; y: number | null };

function loadPrefs(): Prefs {
  const prefs: Prefs = { open: true, x: null, y: null };
  try {
    const stored: Partial<Prefs> | null = JSON.parse(localStorage.getItem(PREFS_KEY) ?? 'null');
    if (typeof stored?.open === 'boolean') prefs.open = stored.open;
    for (const axis of ['x', 'y'] as const) {
      const size = stored?.[axis];
      if (typeof size === 'number' && Number.isFinite(size)) prefs[axis] = size;
    }
  } catch { /* The notes also work without storage. */ }
  return prefs;
}

export function createReadingPanel() {
  const panel = document.querySelector<HTMLElement>('#reading-panel')!;
  const shell = panel.parentElement!;
  const stacked = matchMedia('(max-width: 640px)');
  const axis = () => stacked.matches ? 'y' : 'x';
  const prefs = loadPrefs();
  const handle = document.createElement('div');
  handle.className = 'reading-resizer';
  handle.tabIndex = 0;
  const tabLabel = document.createElement('span');
  tabLabel.textContent = 'Notes';
  handle.append(tabLabel);
  const article = document.createElement('article');
  article.id = 'reading-content';
  article.className = 'reading-content';
  article.tabIndex = 0;
  article.setAttribute('aria-labelledby', 'reading-description');
  handle.setAttribute('aria-controls', article.id);
  panel.append(handle, article);

  function sizeLimits() {
    const dimension = stacked.matches ? shell.clientHeight : shell.clientWidth;
    const initial = stacked.matches ? dimension * .44 : dimension / 3;
    return {
      min: Math.round(Math.min(stacked.matches ? 200 : 320, initial)),
      max: Math.round(Math.min(1100, dimension * .7)),
    };
  }

  function applySize() {
    if (!prefs.open) return;
    const property = stacked.matches ? '--reading-resized-height' : '--reading-resized-width';
    const preferred = prefs[axis()];
    const { min, max } = sizeLimits();
    if (preferred === null) shell.style.removeProperty(property);
    else shell.style.setProperty(property, `${Math.round(Math.max(min, Math.min(max, preferred)))}px`);
    handle.setAttribute('aria-orientation', stacked.matches ? 'horizontal' : 'vertical');
    handle.setAttribute('aria-valuemin', String(min));
    handle.setAttribute('aria-valuemax', String(max));
    handle.setAttribute('aria-valuenow', String(Math.round(stacked.matches ? panel.offsetHeight : panel.offsetWidth)));
  }

  function renderOpen() {
    shell.classList.toggle('is-reading-collapsed', !prefs.open);
    article.hidden = !prefs.open;
    tabLabel.hidden = prefs.open;
    handle.setAttribute('role', prefs.open ? 'separator' : 'button');
    handle.setAttribute('aria-label', prefs.open ? 'Resize the slide notes' : 'Show the slide notes');
    handle.title = prefs.open ? 'Drag to resize. Drag past the minimum to collapse.' : 'Drag toward the canvas or click to show slide notes';
    if (prefs.open) {
      handle.removeAttribute('aria-expanded');
      applySize();
    } else {
      handle.setAttribute('aria-expanded', 'false');
      for (const attribute of ['aria-orientation', 'aria-valuemin', 'aria-valuemax', 'aria-valuenow']) handle.removeAttribute(attribute);
    }
  }

  let scrollTop = 0;
  function setOpen(open: boolean) {
    if (prefs.open === open) return;
    if (!open) {
      scrollTop = article.scrollTop;
      if (article.contains(document.activeElement)) handle.focus({ preventScroll: true });
    }
    prefs.open = open;
    renderOpen();
    if (open) article.scrollTop = scrollTop;
  }

  attachCollapsiblePaneResizer(panel, handle, {
    inward: 1,
    getAxis: axis,
    getSize: () => ({
      open: prefs.open,
      size: stacked.matches ? panel.offsetHeight : panel.offsetWidth,
      min: sizeLimits().min,
      preferred: prefs[axis()],
    }),
    setOpen,
    setSize: size => {
      const { min, max } = sizeLimits();
      prefs[axis()] = Math.round(Math.max(min, Math.min(max, size)));
      applySize();
    },
    save: (axis, previousSize) => {
      if (previousSize !== undefined) prefs[axis] = previousSize;
      try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch { /* Storage is optional. */ }
    },
  });
  window.addEventListener('resize', applySize);
  renderOpen();

  let current = -1;
  function update(index: number) {
    const slide = slides[index];
    if (!slide || index === current) return;
    current = index;
    const reading = slideReadings[slide.members[0]];
    article.innerHTML = `
      <div class="reading-page">
        <header>
          <p class="reading-section">${reading.section}</p>
          <p id="reading-description" class="reading-description">${slide.description}</p>
        </header>
        ${reading.body}
      </div>`;
    scrollTop = 0;
    article.scrollTop = 0;
  }

  update(0);
  return { update };
}
