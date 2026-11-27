import { slides } from './slide-content';
import { slideProgressIcon } from './slide-progress-icons';
import unitransPreview from './assets/section-previews/unitrans.webp';
import lawOfInkPreview from './assets/section-previews/law-of-ink.webp';
import trialPreview from './assets/section-previews/trial.webp';
import accessPreview from './assets/section-previews/access.webp';
import './slide-progress.css';

const sectionStarts = [
  ['unitrans-arrival', 'Before OP', unitransPreview],
  ['L0', 'Introduction', lawOfInkPreview],
  ['P1', 'Routes & Versions', trialPreview],
  ['access-heading', 'Application', accessPreview],
] as const;

const hoverCloseDelayMs = 1000;

export function createSlideProgress(rail: HTMLElement, open: (index: number) => void) {
  const sections = sectionStarts.map(([, title, preview], index) => {
    const group = document.createElement('div');
    group.className = 'slide-progress-section';
    const heading = document.createElement('button');
    heading.className = 'slide-progress-heading';
    heading.type = 'button';
    heading.id = `slide-progress-heading-${index}`;
    const image = document.createElement('img');
    image.className = 'slide-progress-preview';
    image.src = preview;
    image.alt = '';
    image.decoding = 'async';
    const label = document.createElement('span');
    label.className = 'slide-progress-label';
    label.textContent = title;
    heading.append(image, label);

    const flyout = document.createElement('div');
    flyout.className = 'slide-progress-flyout';
    flyout.hidden = true;
    const list = document.createElement('div');
    list.className = 'slide-progress-children';
    list.id = `slide-progress-children-${index}`;
    list.setAttribute('role', 'group');
    list.setAttribute('aria-labelledby', heading.id);
    heading.setAttribute('aria-controls', list.id);
    heading.setAttribute('aria-expanded', 'false');
    flyout.append(list);
    group.append(heading, flyout);
    rail.append(group);
    return { group, heading, flyout, list };
  });

  type ProgressSection = typeof sections[number];
  let expanded: ProgressSection | undefined;
  let hovered: ProgressSection | undefined;
  let closeTimer: number | undefined;

  function fitFlyout() {
    if (!expanded) return;
    const available = rail.getBoundingClientRect();
    const heading = expanded.heading.getBoundingClientRect();
    const center = heading.top + heading.height / 2;
    const halfHeight = Math.min(center - available.top, available.bottom - center) - 8;
    expanded.flyout.style.setProperty('--slide-flyout-space', `${Math.max(0, 2 * halfHeight)}px`);
  }

  const resizeObserver = new ResizeObserver(fitFlyout);
  resizeObserver.observe(rail);

  function expand(next?: ProgressSection) {
    window.clearTimeout(closeTimer);
    closeTimer = undefined;
    if (next === expanded) return;
    if (expanded) {
      if (expanded.list.contains(document.activeElement)) expanded.heading.focus({ preventScroll: true });
      expanded.heading.setAttribute('aria-expanded', 'false');
      expanded.flyout.hidden = true;
    }
    expanded = next;
    if (next) {
      next.heading.setAttribute('aria-expanded', 'true');
      next.flyout.hidden = false;
      fitFlyout();
      const current = next.list.querySelector<HTMLElement>('[aria-current]');
      if (current) next.list.scrollTop = current.offsetTop - (next.list.clientHeight - current.offsetHeight) / 2;
      else next.list.scrollTop = 0;
    }
  }

  let sectionIndex = 0;
  const buttons = slides.map(({ title, members }, index) => {
    if (members[0] === sectionStarts[sectionIndex + 1]?.[0]) sectionIndex++;
    const section = sections[sectionIndex];
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'slide-progress-page';
    button.dataset.slide = members[0];
    button.setAttribute('aria-label', `Slide ${index + 1} of ${slides.length}: ${title}`);
    const label = document.createElement('span');
    label.className = 'slide-progress-label';
    label.textContent = title;
    button.append(slideProgressIcon(members[0]), label);
    button.addEventListener('click', () => open(index));
    section.list.append(button);
    return { button, section };
  });

  for (const section of sections) {
    const { group, heading } = section;
    group.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'mouse') return;
      hovered = section;
      expand(section);
    });
    group.addEventListener('pointerleave', event => {
      if (event.pointerType !== 'mouse' || hovered !== section) return;
      hovered = undefined;
      if (expanded !== section || group.querySelector(':focus-visible')) return;
      closeTimer = window.setTimeout(() => {
        closeTimer = undefined;
        if (expanded === section && !hovered && !group.querySelector(':focus-visible')) expand();
      }, hoverCloseDelayMs);
    });
    group.addEventListener('focusout', event => {
      if (expanded === section && hovered !== section && !group.contains(event.relatedTarget as Node | null)) expand();
    });
    heading.addEventListener('click', event => {
      if (event.detail > 0 && hovered === section && expanded === section) return;
      expand(expanded === section ? undefined : section);
    });
  }

  rail.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !expanded) return;
    event.preventDefault();
    expanded.heading.focus({ preventScroll: true });
    expand();
  });
  rail.addEventListener('wheel', event => event.stopPropagation(), { passive: true });
  document.addEventListener('pointerdown', event => {
    if (event.button === 0 && expanded && !rail.contains(event.target as Node)) expand();
  });

  function showCurrent(index: number) {
    const current = buttons[index];
    for (const [position, { button }] of buttons.entries()) {
      if (position === index) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    }
    for (const section of sections) {
      const active = section === current.section;
      section.heading.classList.toggle('is-current-section', active);
      if (active) section.heading.setAttribute('aria-description', current.button.getAttribute('aria-label') ?? '');
      else section.heading.removeAttribute('aria-description');
    }
  }

  return { showCurrent };
}
