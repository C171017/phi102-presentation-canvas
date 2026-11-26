import { isDialogueText, isSlideCopy, sharedSlideByKey, type DialogueChange, type SharedSlides, type SlideCopy } from './shared-slide-data';

type PanelFields = {
  key: string; title: HTMLElement; claim: HTMLElement; points: HTMLUListElement; bridge: HTMLElement; source: HTMLElement;
};
type EditableLine = { key: string; element: HTMLElement };

export type InlineDialogueTarget = {
  scene: string;
  root: HTMLElement;
  panel?: PanelFields;
  lines: EditableLine[];
  start: () => void;
  stop: () => void;
};

const fieldNames = { title: 'Slide title', claim: 'Main text', bridge: 'Scene cue', source: 'Reference' };
const textFields = ['title', 'claim', 'bridge', 'source'] as const;
const text = (element: HTMLElement) => element.innerText.trim();

export function editInlineDialogue(target: InlineDialogueTarget, selection: EventTarget | null) {
  const fields = new Map<HTMLElement, string>();
  const panel = target.panel;
  const panelFields = panel && {
    title: panel.title, claim: panel.claim, bridge: panel.bridge, source: panel.source,
  };

  function allowText(element: HTMLElement, label: string) {
    fields.set(element, text(element));
    element.contentEditable = 'plaintext-only';
    element.setAttribute('role', 'textbox');
    element.setAttribute('aria-label', label);
    element.setAttribute('aria-multiline', 'true');
    element.dataset.inlineLabel = label;
  }

  target.start();
  if (panel && panelFields) {
    for (const name of textFields) allowText(panelFields[name], fieldNames[name]);
    panel.bridge.hidden = panel.points.hidden = false;
    for (const item of Array.from(panel.points.querySelectorAll('li'))) allowText(item, 'Bullet point');
  }
  for (const line of target.lines) allowText(line.element, 'Dialogue line');
  const initialPoints = panel ? Array.from(panel.points.children, item => text(item as HTMLElement)) : [];
  const add = document.createElement('button');
  if (panel) {
    add.type = 'button';
    add.className = 'inline-add-point';
    add.textContent = 'Add bullet';
    add.disabled = initialPoints.length >= 12;
    panel.points.after(add);
    add.addEventListener('click', () => {
      const item = document.createElement('li');
      allowText(item, 'Bullet point');
      panel.points.append(item);
      add.disabled = panel.points.children.length >= 12;
      item.focus();
    });
  }

  const selected = selection instanceof HTMLElement ? selection.closest<HTMLElement>('[data-inline-label]') : null;
  const focus = selected && fields.has(selected) ? selected : fields.keys().next().value;
  focus?.focus({ preventScroll: true });

  function changes(latest: SharedSlides): DialogueChange | null {
    const lines: Record<string, string> = {};
    for (const { key, element } of target.lines) {
      const next = text(element);
      if (next === fields.get(element)) continue;
      if (!isDialogueText(next)) throw new Error('A dialogue line needs text and can contain up to 3,000 characters.');
      lines[key] = next;
    }
    let copy: DialogueChange['copy'];
    if (panel && panelFields) {
      const edits: Partial<SlideCopy> = {};
      for (const name of textFields) {
        const next = text(panelFields[name]);
        if (next !== fields.get(panelFields[name])) edits[name] = next;
      }
      const points = Array.from(panel.points.children, item => text(item as HTMLElement)).filter(Boolean);
      if (points.length !== initialPoints.length || points.some((point, index) => point !== initialPoints[index])) edits.points = points;
      if (Object.keys(edits).length) {
        const base = latest.copy[panel.key] ?? sharedSlideByKey.get(panel.key)!.initial;
        const next = { ...base, ...edits };
        if (!isSlideCopy(next)) throw new Error('Keep a title and main text. Each bullet can contain up to 500 characters.');
        copy = { key: panel.key, copy: next };
      }
    }
    return copy || Object.keys(lines).length ? { type: 'dialogue', scene: target.scene, copy, lines } : null;
  }

  return {
    changes,
    setBusy(busy: boolean) {
      for (const element of fields.keys()) element.contentEditable = busy ? 'false' : 'plaintext-only';
      if (panel) add.disabled = busy || panel.points.children.length >= 12;
    },
    close() {
      for (const element of fields.keys()) {
        for (const attribute of ['contenteditable', 'role', 'aria-label', 'aria-multiline', 'data-inline-label']) element.removeAttribute(attribute);
      }
      add.remove();
      target.stop();
    },
  };
}
