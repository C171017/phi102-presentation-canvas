import { renderMiniSlideSection, renderSectionBullet } from './paper-mini-slide';
import { maxSectionBullets, maxSlideSections, type SlideSection } from './slide-sections';

const sectionNames = {
  header: 'Title and reference',
  heading: 'Heading',
  text: 'Text',
  bullets: 'Bullet list',
};
const fieldNames: Record<string, string> = { title: 'Slide title', source: 'Reference' };

function button(label: string, action: () => void, caption = label) {
  const control = document.createElement('button');
  control.type = 'button';
  control.textContent = caption;
  control.setAttribute('aria-label', label);
  control.title = label;
  control.addEventListener('click', action);
  return control;
}

function allowText(element: HTMLElement, label: string) {
  element.contentEditable = 'plaintext-only';
  element.setAttribute('role', 'textbox');
  element.setAttribute('aria-label', label);
  element.setAttribute('aria-multiline', 'true');
  element.dataset.inlineLabel = label;
}

function readSection(node: HTMLElement, kind: SlideSection['kind']): SlideSection | undefined {
  const read = (element: HTMLElement) => element.innerText.trim();
  switch (kind) {
    case 'header': {
      const title = read(node.querySelector<HTMLElement>('[data-slide-field="title"]')!);
      const source = read(node.querySelector<HTMLElement>('[data-slide-field="source"]')!);
      if (title || source) return { kind, title, source };
      break;
    }
    case 'bullets': {
      const items = Array.from(node.querySelectorAll('li'), read).filter(Boolean);
      if (items.length) return { kind, items };
      break;
    }
    default: {
      const text = read(node);
      if (text) return { kind, text };
    }
  }
}

export function editSlideSections(container: HTMLElement, initial: SlideSection[]) {
  let nextId = 0;
  let busy = false;
  const rows = new Map<HTMLElement, {
    kind: SlideSection['kind'];
    node: HTMLElement;
    up: HTMLButtonElement;
    down: HTMLButtonElement;
    remove: HTMLButtonElement;
    addBullet?: HTMLButtonElement;
  }>();
  const addRow = document.createElement('div');
  addRow.className = 'slide-section-add';
  const kinds = document.createElement('select');
  kinds.setAttribute('aria-label', 'Section type');
  for (const [kind, name] of Object.entries(sectionNames)) kinds.add(new Option(name, kind));
  kinds.value = 'text';
  const add = button('Add section', () => {
    const kind = kinds.value as SlideSection['kind'];
    const section: SlideSection = kind === 'header' ? { kind, title: '', source: '' }
      : kind === 'bullets' ? { kind, items: [''] } : { kind, text: '' };
    firstEditable(mount(section))?.focus();
    updateControls();
  });
  addRow.append(kinds, add);
  container.dataset.sectionEditor = '';
  container.replaceChildren(addRow);

  function firstEditable(scope: HTMLElement = container) {
    return scope.querySelector<HTMLElement>('[data-inline-label]');
  }

  function updateControls() {
    for (const [row, { node, up, down, remove, addBullet }] of rows) {
      up.disabled = busy || row.previousElementSibling === addRow;
      down.disabled = busy || !row.nextElementSibling;
      remove.disabled = busy;
      if (addBullet) addBullet.disabled = busy || node.children.length >= maxSectionBullets;
    }
    kinds.disabled = add.disabled = busy || rows.size >= maxSlideSections;
  }

  function mount(section: SlideSection) {
    const row = document.createElement('div');
    row.className = 'slide-section-edit-row';
    row.setAttribute('role', 'group');
    row.setAttribute('aria-label', sectionNames[section.kind]);
    const node = renderMiniSlideSection(section, nextId++);
    const controls = document.createElement('div');
    controls.className = 'slide-section-controls';
    const up = button('Move section up', () => {
      row.previousElementSibling?.before(row);
      updateControls();
      (up.disabled ? down : up).focus();
    }, '↑');
    const down = button('Move section down', () => {
      row.nextElementSibling?.after(row);
      updateControls();
      (down.disabled ? up : down).focus();
    }, '↓');
    const remove = button('Remove section', () => {
      const neighbor = row.nextElementSibling ?? row.previousElementSibling;
      row.remove();
      rows.delete(row);
      updateControls();
      (neighbor?.querySelector<HTMLButtonElement>('[aria-label="Remove section"]') ?? add).focus();
    }, 'Remove');
    controls.append(up, down, remove);
    const content = document.createElement('div');
    content.className = 'slide-section-content';
    content.append(node);
    const fields = node.matches('[data-slide-field]') ? [node] : Array.from(node.querySelectorAll<HTMLElement>('[data-slide-field]'));
    for (const field of fields) {
      const label = section.kind === 'bullets' ? 'Bullet point' : fieldNames[field.dataset.slideField!] ?? sectionNames[section.kind];
      allowText(field, label);
    }
    let addBullet: HTMLButtonElement | undefined;
    if (section.kind === 'bullets') {
      addBullet = button('Add bullet', () => {
        const item = renderSectionBullet('', node.children.length);
        allowText(item, 'Bullet point');
        node.append(item);
        updateControls();
        item.focus();
      });
      addBullet.className = 'slide-section-add-bullet';
      content.append(addBullet);
    }
    row.append(content, controls);
    container.append(row);
    rows.set(row, { kind: section.kind, node, up, down, remove, addBullet });
    return row;
  }

  initial.forEach(mount);
  updateControls();

  return {
    read() {
      const sections: SlideSection[] = [];
      for (const row of Array.from(container.children)) {
        const entry = rows.get(row as HTMLElement);
        if (!entry) continue;
        const section = readSection(entry.node, entry.kind);
        if (section) sections.push(section);
      }
      return { sections };
    },
    findField(sectionId?: string, field?: string) {
      if (!sectionId || !field) return null;
      const section = container.querySelector<HTMLElement>(`[data-slide-section="${sectionId}"]`);
      const selector = `[data-slide-field="${field}"]`;
      return section?.matches(selector) ? section : section?.querySelector<HTMLElement>(selector);
    },
    firstEditable,
    setBusy(value: boolean) {
      busy = value;
      updateControls();
      for (const field of Array.from(container.querySelectorAll<HTMLElement>('[data-inline-label]'))) {
        field.contentEditable = busy ? 'false' : 'plaintext-only';
      }
    },
    close() { delete container.dataset.sectionEditor; },
  };
}
