import { isDialogueText, isSlideCopy, sharedSlideByKey, type AddedDialogueLine, type DialogueChange, type SharedSlides, type SlideCopy } from './shared-slide-data';

type PanelFields = {
  key: string; title: HTMLElement; claim: HTMLElement; points: HTMLUListElement; bridge: HTMLElement; source: HTMLElement;
};
type EditableLine = { key: string; element: HTMLElement };

export type InlineDialogueTarget = {
  scene: string;
  root: HTMLElement;
  panel?: PanelFields;
  lines: EditableLine[];
  sequence?: HTMLElement;
  quiz?: { after: string | null };
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
  const inserted = new Map<string, AddedDialogueLine>();
  const removed = new Set<string>();
  const wrappers = new Map<string, { wrapper: HTMLElement; line: EditableLine; buttons: HTMLButtonElement[] }>();
  const first = document.createElement('button');
  const firstSlot = document.createElement('div');
  const quizMarker = document.createElement('button');
  let quizAfter = target.quiz?.after;
  let pending = false;

  function visibleLines() {
    return Array.from(target.sequence?.children ?? []).flatMap(node => {
      if (!(node instanceof HTMLElement) || node.hidden || !node.dataset.dialogueKey) return [];
      const entry = wrappers.get(node.dataset.dialogueKey);
      return entry ? [entry] : [];
    });
  }

  function placeQuizMarker() {
    if (quizAfter === undefined) return;
    const after = quizAfter === null ? firstSlot : wrappers.get(quizAfter)?.wrapper;
    (after ?? firstSlot).after(quizMarker);
  }

  function editButton(label: string, action: () => void) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.addEventListener('click', action);
    return button;
  }

  function updateLineControls() {
    for (const { buttons } of wrappers.values()) {
      buttons.forEach(button => { button.disabled = pending; });
    }
    first.disabled = quizMarker.disabled = pending;
  }

  function insertLine(anchor: EditableLine | null) {
    const node = document.createElement('div');
    node.className = 'transcript-row';
    const example = anchor?.element ?? target.lines[0]?.element;
    if (example?.dataset.speaker) node.dataset.speaker = example.dataset.speaker;
    if (example?.dataset.cueKind) node.dataset.cueKind = example.dataset.cueKind;
    const key = 'line-' + crypto.randomUUID().replaceAll('-', '');
    inserted.set(key, { key, after: anchor?.key ?? null, text: '' });
    if (anchor) wrappers.get(anchor.key)!.wrapper.after(node);
    else firstSlot.after(node);
    const line = { key, element: node };
    mountLine(line);
    if (quizAfter !== undefined && quizAfter === (anchor?.key ?? null)) {
      quizAfter = key;
      placeQuizMarker();
    }
    updateLineControls();
    node.focus();
  }

  function removeLine(line: EditableLine) {
    const entry = wrappers.get(line.key)!;
    const added = inserted.get(line.key);
    const visible = visibleLines();
    const index = visible.findIndex(item => item.line.key === line.key);
    const previous = visible[index - 1]?.line;
    const next = visible[index + 1]?.line;
    if (added) {
      for (const child of inserted.values()) if (child.after === line.key) child.after = added.after;
      inserted.delete(line.key);
      fields.delete(line.element);
      entry.wrapper.remove();
      wrappers.delete(line.key);
    } else {
      removed.add(line.key);
      entry.wrapper.hidden = true;
    }
    if (quizAfter === line.key) {
      quizAfter = previous?.key ?? null;
      placeQuizMarker();
    }
    updateLineControls();
    (next?.element ?? previous?.element ?? first).focus();
  }

  function mountLine(line: EditableLine) {
    allowText(line.element, 'Dialogue line');
    if (!target.sequence) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'inline-dialogue-line';
    wrapper.dataset.dialogueKey = line.key;
    const controls = document.createElement('div');
    controls.className = 'inline-line-controls';
    const buttons = [editButton('Add line after', () => insertLine(line)), editButton('Remove line', () => removeLine(line))];
    controls.append(...buttons);
    line.element.before(wrapper);
    wrapper.append(line.element, controls);
    wrappers.set(line.key, { wrapper, line, buttons });
  }

  for (const line of target.lines) mountLine(line);
  if (target.sequence) {
    first.type = 'button';
    first.textContent = 'Add first line';
    first.className = 'inline-add-first-line';
    first.addEventListener('click', () => insertLine(null));
    firstSlot.append(first);
    target.sequence.prepend(firstSlot);
    if (target.quiz) {
      quizMarker.type = 'button';
      quizMarker.className = 'inline-quiz-marker';
      quizMarker.textContent = 'Quiz';
      quizMarker.setAttribute('aria-label', 'Move quiz');
      quizMarker.title = 'Drag to move the quiz, or press the Up and Down arrow keys';
      placeQuizMarker();

      let drag: { pointer: number; startY: number; after: string | null; preview?: HTMLElement } | undefined;
      quizMarker.addEventListener('pointerdown', event => {
        if (pending || event.button !== 0 || !event.isPrimary) return;
        drag = { pointer: event.pointerId, startY: event.clientY, after: quizAfter ?? null };
        quizMarker.setPointerCapture(event.pointerId);
        quizMarker.classList.add('is-dragging');
      });
      quizMarker.addEventListener('pointermove', event => {
        if (drag?.pointer !== event.pointerId || (!drag.preview && Math.abs(event.clientY - drag.startY) < 4)) return;
        let after: string | null = null;
        let preview: HTMLElement = firstSlot;
        for (const { wrapper, line } of visibleLines()) {
          const rect = wrapper.getBoundingClientRect();
          if (event.clientY < rect.top + rect.height / 2) break;
          after = line.key;
          preview = wrapper;
        }
        drag.preview?.classList.remove('quiz-drop-after');
        drag.after = after;
        drag.preview = preview;
        preview.classList.add('quiz-drop-after');
      });
      function finishDrag(event: PointerEvent) {
        if (drag?.pointer !== event.pointerId) return;
        const draft = drag;
        drag = undefined;
        quizMarker.classList.remove('is-dragging');
        draft.preview?.classList.remove('quiz-drop-after');
        if (event.type === 'pointerup' && draft.preview) {
          quizAfter = draft.after;
          placeQuizMarker();
          quizMarker.focus({ preventScroll: true });
        }
      }
      quizMarker.addEventListener('pointerup', finishDrag);
      quizMarker.addEventListener('pointercancel', finishDrag);
      quizMarker.addEventListener('lostpointercapture', finishDrag);
      quizMarker.addEventListener('keydown', event => {
        if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
        event.preventDefault();
        const slots = [null, ...visibleLines().map(({ line }) => line.key)];
        const current = Math.max(0, slots.indexOf(quizAfter ?? null));
        const next = Math.max(0, Math.min(slots.length - 1, current + (event.key === 'ArrowUp' ? -1 : 1)));
        if (next === current) return;
        quizAfter = slots[next];
        placeQuizMarker();
        quizMarker.focus();
      });
    }
    updateLineControls();
  }
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
  if (target.sequence) {
    const firstRow = wrappers.values().next().value?.wrapper;
    const currentRow = focus?.closest('.inline-dialogue-line') ??
      target.sequence.querySelector('[aria-current]')?.closest('.inline-dialogue-line');
    if (!currentRow || currentRow === firstRow) target.sequence.scrollTop = 0;
    else currentRow.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  function changes(latest: SharedSlides): DialogueChange | null {
    const lines: Record<string, string> = {};
    for (const { key, element } of target.lines) {
      if (removed.has(key)) continue;
      const next = text(element);
      if (next === fields.get(element)) continue;
      if (!isDialogueText(next)) throw new Error('A dialogue line needs text and can contain up to 3,000 characters.');
      lines[key] = next;
    }
    const added = [...inserted.values()].map(item => {
      const value = text(wrappers.get(item.key)!.line.element);
      if (!isDialogueText(value)) throw new Error('Enter text for each new line or remove it before saving.');
      return { ...item, text: value };
    });
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
    const movedQuiz = quizAfter !== target.quiz?.after ? quizAfter : undefined;
    return copy || Object.keys(lines).length || added.length || removed.size || movedQuiz !== undefined
      ? { type: 'dialogue', scene: target.scene, copy, lines, added, removed: [...removed], quizAfter: movedQuiz } : null;
  }

  return {
    changes,
    setBusy(busy: boolean) {
      pending = busy;
      updateLineControls();
      for (const element of fields.keys()) element.contentEditable = busy ? 'false' : 'plaintext-only';
      if (panel) add.disabled = busy || panel.points.children.length >= 12;
    },
    close() {
      for (const element of fields.keys()) {
        for (const attribute of ['contenteditable', 'role', 'aria-label', 'aria-multiline', 'data-inline-label']) element.removeAttribute(attribute);
      }
      add.remove();
      firstSlot.remove();
      quizMarker.remove();
      for (const { wrapper, line } of wrappers.values()) {
        if (inserted.has(line.key)) wrapper.remove();
        else wrapper.replaceWith(line.element);
      }
      target.stop();
    },
  };
}
