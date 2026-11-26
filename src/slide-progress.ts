import { slides } from './slide-content';
import './slide-progress.css';

const sectionStarts = [
  ['unitrans-arrival', 'Before OP'],
  ['L0', 'Introduction'],
  ['P1', 'Parallel Universe'],
  ['access-heading', 'Application'],
] as const;

export function createSlideProgress(rail: HTMLElement, open: (index: number) => void) {
  const sections = sectionStarts.map(([, title], index) => {
    const group = document.createElement('div');
    group.className = 'slide-progress-section';
    const heading = document.createElement('button');
    heading.className = 'slide-progress-heading';
    heading.type = 'button';
    heading.id = `slide-progress-heading-${index}`;
    heading.textContent = title;

    const list = document.createElement('div');
    list.className = 'slide-progress-children';
    list.id = `slide-progress-children-${index}`;
    list.setAttribute('role', 'group');
    list.setAttribute('aria-labelledby', heading.id);
    heading.setAttribute('aria-controls', list.id);
    heading.setAttribute('aria-expanded', 'false');
    list.hidden = true;
    group.append(heading, list);
    rail.append(group);
    return { group, heading, list };
  });

  type ProgressSection = typeof sections[number];
  let expanded: ProgressSection | undefined;
  let hovered: ProgressSection | undefined;
  let hoverHandoff: DOMRect | undefined;

  function expand(next?: ProgressSection) {
    if (next === expanded) return;
    if (expanded) {
      if (expanded.list.contains(document.activeElement)) expanded.heading.focus({ preventScroll: true });
      expanded.heading.setAttribute('aria-expanded', 'false');
      expanded.list.hidden = true;
    }
    expanded = next;
    if (next) {
      next.heading.setAttribute('aria-expanded', 'true');
      next.list.hidden = false;
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
    button.textContent = title;
    button.addEventListener('click', () => open(index));
    section.list.append(button);
    return { button, section };
  });

  for (const section of sections) {
    const { group, heading } = section;
    group.addEventListener('focusout', event => {
      if (expanded === section && hovered !== section && !group.contains(event.relatedTarget as Node | null)) expand();
    });
    heading.addEventListener('click', event => {
      if (event.detail > 0 && hovered === section && expanded === section) return;
      expand(expanded === section ? undefined : section);
    });
  }

  function leaveHover() {
    const previous = hovered;
    hovered = undefined;
    hoverHandoff = undefined;
    if (previous && expanded === previous && !previous.group.querySelector(':focus-visible')) expand();
  }

  document.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || !(event.target instanceof Element)) return;
    const group = event.target.closest('.slide-progress-section');
    const section = group && sections.find(item => item.group === group);
    if (section) {
      if (hovered === section) return;
      const before = section.heading.getBoundingClientRect();
      hovered = section;
      expand(section);
      // A shorter list can move the destination up and out from under the pointer.
      hoverHandoff = section.group.getBoundingClientRect().bottom < event.clientY ? before : undefined;
    } else if (!hoverHandoff || event.clientX < hoverHandoff.left || event.clientX > hoverHandoff.right ||
      event.clientY > hoverHandoff.bottom || event.clientY < rail.getBoundingClientRect().top) {
      leaveHover();
    }
  }, { passive: true });
  document.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse') leaveHover();
  });

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
    const activeSection = sections.indexOf(current.section);
    for (const [position, { button }] of buttons.entries()) {
      button.classList.toggle('is-past', position < index);
      if (position === index) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    }
    for (const [position, section] of sections.entries()) {
      const active = position === activeSection;
      section.heading.classList.toggle('is-current-section', active);
      section.heading.classList.toggle('is-past', position < activeSection);
      if (active) section.heading.setAttribute('aria-description', current.button.getAttribute('aria-label') ?? '');
      else section.heading.removeAttribute('aria-description');
    }
  }

  return { showCurrent };
}
