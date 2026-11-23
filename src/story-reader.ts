import { storyVersions } from './story-scenes';
import { savedStoryText } from './saved-story-text';
import { isStoryText, storyBodyLimit, storyTextEndpoint, storyTitleLimit, type StoryEdits } from './story-text';
import './story-reader.css';

const { scenes: storyScenes } = storyVersions[0];

function storyLineType(line: string) {
  const text = line.trimStart();
  if (/^(?:[IVXLCDM]+|\d+)\.\s/.test(text)) return 'section';
  if (/^Narrator:\s/i.test(text)) return 'narration';
  if (/^\p{Lu}[\p{L}\p{M}\p{N} ,.'’\-]{0,48}:\s/u.test(text)) return 'dialogue';
  return 'description';
}

function renderStoryParagraph(text: string) {
  const paragraph = document.createElement('p');
  for (const [index, line] of text.split('\n').entries()) {
    if (index > 0) paragraph.append('\n');
    const row = document.createElement('span');
    row.dataset.storyLine = storyLineType(line);
    for (const part of line.split(/(\[[^\[\]]+\])/g)) {
      if (!part) continue;
      if (part.startsWith('[') && part.endsWith(']')) {
        const direction = document.createElement('span');
        direction.dataset.storyLine = 'description';
        direction.textContent = part;
        row.append(direction);
      } else {
        row.append(part);
      }
    }
    paragraph.append(row);
  }
  return paragraph;
}

export function addStoryReader(shell: HTMLElement, picker?: HTMLElement, editable = false) {
  const opener = document.createElement('button');
  opener.type = 'button';
  opener.textContent = 'Story';
  opener.setAttribute('aria-haspopup', 'dialog');
  opener.setAttribute('aria-controls', 'story-reader');
  if (!picker) opener.classList.add('story-reader__launch');
  (picker ?? shell).append(opener);

  const reader = document.createElement('dialog');
  reader.id = 'story-reader';
  reader.className = 'story-reader';
  reader.setAttribute('aria-label', 'Story');
  reader.innerHTML = `
    <header class="story-reader__toolbar">
      <nav aria-label="Story scenes">
        <button type="button" data-previous aria-label="Previous scene">‹</button>
        <span class="story-reader__position" aria-hidden="true"></span>
        <button type="button" data-next aria-label="Next scene">›</button>
      </nav>
      <button type="button" class="story-reader__action" data-edit hidden disabled>Edit story</button>
      <button type="button" data-close aria-label="Close story" autofocus>×</button>
    </header>
    <article class="story-reader__scene" aria-labelledby="story-scene-title">
      <figure class="story-reader__art" hidden>
        <div class="story-reader__frame">
          <img alt="" draggable="false" />
        </div>
      </figure>
      <div class="story-reader__text">
        <h2 id="story-scene-title"></h2>
        <div class="story-reader__paragraphs"></div>
        <form class="story-reader__edit" hidden>
          <label for="story-edit-title">Scene title</label>
          <input id="story-edit-title" maxlength="${storyTitleLimit}" required />
          <label for="story-edit-body">Story text</label>
          <textarea id="story-edit-body" maxlength="${storyBodyLimit}" rows="10" required></textarea>
          <div class="story-reader__actions">
            <button type="button" class="story-reader__action" data-cancel>Cancel</button>
            <button type="submit" class="story-reader__action" data-save>Save</button>
          </div>
          <div class="story-reader__feedback" role="alert"></div>
        </form>
      </div>
    </article>
    <span class="story-reader__announcement" role="status"></span>
  `;
  shell.append(reader);

  const scene = reader.querySelector<HTMLElement>('.story-reader__scene')!;
  const art = reader.querySelector<HTMLElement>('.story-reader__art')!;
  const frame = reader.querySelector<HTMLElement>('.story-reader__frame')!;
  const image = reader.querySelector<HTMLImageElement>('img')!;
  const textPanel = reader.querySelector<HTMLElement>('.story-reader__text')!;
  const heading = reader.querySelector<HTMLElement>('#story-scene-title')!;
  const paragraphs = reader.querySelector<HTMLElement>('.story-reader__paragraphs')!;
  const position = reader.querySelector<HTMLElement>('.story-reader__position')!;
  const announcement = reader.querySelector<HTMLElement>('[role="status"]')!;
  const previous = reader.querySelector<HTMLButtonElement>('[data-previous]')!;
  const next = reader.querySelector<HTMLButtonElement>('[data-next]')!;
  const close = reader.querySelector<HTMLButtonElement>('[data-close]')!;
  const edit = reader.querySelector<HTMLButtonElement>('[data-edit]')!;
  const form = reader.querySelector<HTMLFormElement>('.story-reader__edit')!;
  const titleInput = form.querySelector<HTMLInputElement>('input')!;
  const bodyInput = form.querySelector<HTMLTextAreaElement>('textarea')!;
  const feedback = form.querySelector<HTMLElement>('[role="alert"]')!;
  const save = form.querySelector<HTMLButtonElement>('[data-save]')!;
  const cancel = form.querySelector<HTMLButtonElement>('[data-cancel]')!;
  edit.hidden = !editable;
  let index = 0;
  let edits: StoryEdits = { ...savedStoryText };
  let loadSequence = 0;

  function updateControls() {
    const editing = !form.hidden;
    previous.setAttribute('aria-disabled', String(editing || index === 0));
    next.setAttribute('aria-disabled', String(editing || index === storyScenes.length - 1));
    close.disabled = editing;
    edit.hidden = !editable || editing || storyScenes[index].illustration?.imageOnly === true;
  }

  function finishEdit() {
    heading.hidden = false;
    paragraphs.hidden = false;
    form.hidden = true;
    showScene(false);
    edit.focus();
  }

  function showScene(announce: boolean) {
    const entry = storyScenes[index];
    const { illustration } = entry;
    const { title, paragraphs: text } = edits[entry.id] ?? entry;
    const imageOnly = illustration?.imageOnly === true;
    art.hidden = !illustration;
    textPanel.hidden = imageOnly;
    scene.classList.toggle('story-reader__scene--text-only', !illustration);
    scene.classList.toggle('story-reader__scene--image-only', imageOnly);
    image.alt = illustration?.alt ?? '';
    if (illustration) image.src = illustration.src;
    else image.removeAttribute('src');
    heading.textContent = title;
    paragraphs.replaceChildren(...(imageOnly ? [] : text.map(renderStoryParagraph)));
    position.textContent = `${index + 1} / ${storyScenes.length}`;
    updateControls();
    scene.scrollTop = 0;
    if (announce) announcement.textContent = `Scene ${index + 1} of ${storyScenes.length}. ${title}`;
  }

  function step(direction: number) {
    if (!form.hidden) return;
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= storyScenes.length) return;
    index = nextIndex;
    showScene(true);
  }

  opener.addEventListener('click', async () => {
    reader.showModal();
    if (!import.meta.env.DEV) return;
    const sequence = ++loadSequence;
    edit.disabled = true;
    try {
      const response = await fetch(storyTextEndpoint, { cache: 'no-store' });
      if (!response.ok) throw new Error();
      const saved = await response.json();
      if (sequence !== loadSequence) return;
      edits = saved;
      showScene(false);
      edit.disabled = false;
    } catch {
      if (sequence !== loadSequence) return;
      edit.disabled = false;
      announcement.textContent = 'Could not load saved story edits.';
    }
  });
  edit.addEventListener('click', () => {
    const entry = storyScenes[index];
    const text = edits[entry.id] ?? entry;
    titleInput.value = text.title;
    bodyInput.value = text.paragraphs.join('\n\n');
    feedback.textContent = '';
    heading.hidden = true;
    paragraphs.hidden = true;
    form.hidden = false;
    updateControls();
    titleInput.focus();
  });
  cancel.addEventListener('click', finishEdit);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (save.disabled) return;
    const id = storyScenes[index].id;
    const text = {
      title: titleInput.value.trim(),
      paragraphs: bodyInput.value.trim().split(/\n\s*\n/).map(paragraph => paragraph.trim()),
    };
    if (!isStoryText(text)) {
      feedback.textContent = 'Enter a title and story text.';
      return;
    }
    feedback.textContent = '';
    titleInput.readOnly = bodyInput.readOnly = true;
    save.disabled = cancel.disabled = true;
    save.textContent = 'Saving…';
    try {
      const response = await fetch(storyTextEndpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, text, revision: edits[id]?.revision ?? null }),
      });
      if (response.status === 409) {
        const { latest } = await response.json();
        edits[id] = latest;
        feedback.textContent = 'This scene changed in another tab. Save again to replace that version, or cancel to read it.';
        return;
      }
      if (!response.ok) throw new Error();
      edits[id] = await response.json();
      finishEdit();
      announcement.textContent = 'Story saved.';
    } catch {
      feedback.textContent = 'Could not save the story. Your draft is still here.';
    } finally {
      titleInput.readOnly = bodyInput.readOnly = false;
      save.disabled = cancel.disabled = false;
      save.textContent = 'Save';
    }
  });
  previous.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  close.addEventListener('click', () => reader.close());
  reader.addEventListener('cancel', event => {
    if (!form.hidden) event.preventDefault();
  });
  reader.addEventListener('close', () => {
    announcement.textContent = '';
    opener.focus({ preventScroll: true });
  });
  reader.addEventListener('keydown', event => {
    event.stopPropagation();
    if (!form.hidden) return;
    if (event.isComposing || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    step(event.key === 'ArrowLeft' ? -1 : 1);
  });

  let swipe: { pointer: number; x: number; y: number } | undefined;
  scene.addEventListener('pointerdown', event => {
    if (!form.hidden || !event.isPrimary || event.button !== 0) return;
    if (event.pointerType === 'mouse' && !frame.contains(event.target as Node)) return;
    swipe = { pointer: event.pointerId, x: event.clientX, y: event.clientY };
    scene.setPointerCapture(event.pointerId);
  });
  scene.addEventListener('pointerup', event => {
    if (swipe?.pointer !== event.pointerId) return;
    const dx = event.clientX - swipe.x;
    const dy = event.clientY - swipe.y;
    swipe = undefined;
    if (Math.abs(dx) >= 44 && Math.abs(dx) > Math.abs(dy) * 1.25) step(dx < 0 ? 1 : -1);
  });
  scene.addEventListener('lostpointercapture', event => {
    if (swipe?.pointer === event.pointerId) swipe = undefined;
  });

  let lastWheel = -Infinity;
  let wheelDistance = 0;
  let wheelStepped = false;
  reader.addEventListener('wheel', event => {
    if (!form.hidden) return;
    if (event.ctrlKey || event.metaKey || Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
    event.preventDefault();
    // Count trackpad momentum as part of its originating swipe.
    if (event.timeStamp - lastWheel > 180) {
      wheelDistance = 0;
      wheelStepped = false;
    }
    lastWheel = event.timeStamp;
    if (wheelStepped) return;
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? reader.clientWidth : 1;
    wheelDistance += event.deltaX * unit;
    if (Math.abs(wheelDistance) < 44) return;
    wheelStepped = true;
    step(wheelDistance > 0 ? 1 : -1);
  }, { passive: false });

  showScene(false);
}
