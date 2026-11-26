import { editInlineDialogue, type InlineDialogueTarget } from './inline-dialogue';
import { isSlideCopy, sharedSlideByKey, sharedSlideEntries, type SharedSnapshot } from './shared-slide-data';
import { editSlideSections } from './slide-section-editor';
import { slideSections } from './slide-sections';
import type { SharedSlideClient } from './shared-slides';
import type { Layout } from './layout-data';

type EditorOptions = {
  activeKey: () => string | undefined;
  inlineTarget: () => InlineDialogueTarget | undefined;
  hostedLayout?: { capture: () => Layout; canSave: () => boolean };
  apply: (snapshot: SharedSnapshot, resetLayout: boolean) => void;
};

export function addSharedSlideEditor(shell: HTMLElement, client: SharedSlideClient, options: EditorOptions) {
  const toolbar = document.createElement('div');
  toolbar.className = 'shared-slide-toolbar';
  toolbar.setAttribute('aria-label', options.hostedLayout ? 'Shared editor' : 'Local slide editor');
  toolbar.innerHTML = `<div class="shared-slide-actions" data-regular-actions><button type="button" data-edit>Edit slide</button>
    <button type="button" data-layout>Save layout</button>
    <button type="button" data-history>Version history</button></div>
    <div class="shared-slide-actions" data-inline-actions hidden>
      <button type="button" data-inline-save>Save changes</button>
      <button type="button" data-inline-cancel>Cancel</button>
      <button type="button" data-inline-latest hidden>Load latest</button>
    </div>
    <span role="status"></span>`;
  const status = toolbar.querySelector<HTMLElement>('[role="status"]')!;
  const regularActions = toolbar.querySelector<HTMLElement>('[data-regular-actions]')!;
  const inlineActions = toolbar.querySelector<HTMLElement>('[data-inline-actions]')!;
  const inlineLatest = toolbar.querySelector<HTMLButtonElement>('[data-inline-latest]')!;
  const editButton = toolbar.querySelector<HTMLButtonElement>('[data-edit]')!;
  toolbar.querySelector<HTMLButtonElement>('[data-layout]')!.hidden = !options.hostedLayout;
  toolbar.querySelector<HTMLButtonElement>('[data-history]')!.hidden = !options.hostedLayout;
  shell.classList.add('has-shared-editor');
  shell.append(toolbar);

  const editor = document.createElement('dialog');
  editor.className = 'shared-slide-dialog';
  editor.setAttribute('aria-label', 'Edit slide');
  editor.innerHTML = `<form>
    <h2>Edit slide</h2>
    <label>Website section <select name="section"></select></label>
    <div class="paper-mini-slide shared-section-surface"></div>
    <p role="status"></p>
    <footer><button type="button" data-cancel>Cancel</button><button type="button" data-latest>Load latest</button>
      <button type="submit">Save slide</button></footer>
  </form>`;
  shell.append(editor);
  const form = editor.querySelector('form')!;
  const section = form.querySelector('select')!;
  const editorStatus = editor.querySelector<HTMLElement>('[role="status"]')!;
  const sectionSurface = form.querySelector<HTMLElement>('.shared-section-surface')!;
  let sectionsEditor: ReturnType<typeof editSlideSections>;
  for (const entry of sharedSlideEntries) section.add(new Option(entry.label, entry.key));
  function showCopy() {
    const copy = client.snapshot.document.copy[section.value] ?? sharedSlideByKey.get(section.value)!.initial;
    sectionsEditor = editSlideSections(sectionSurface, slideSections(copy));
    editorStatus.textContent = '';
  }

  const versions = document.createElement('dialog');
  versions.className = 'shared-slide-dialog shared-slide-history';
  versions.setAttribute('aria-label', 'Version history');
  versions.innerHTML = `<h2>Version history</h2><p role="status"></p><ol aria-label="Saved versions"></ol>
    <footer><button type="button" data-close>Close</button><button type="button" data-latest>Load latest</button>
      <button type="button" data-older hidden>Earlier versions</button></footer>`;
  shell.append(versions);
  const historyStatus = versions.querySelector<HTMLElement>('[role="status"]')!;
  const list = versions.querySelector('ol')!;
  const older = versions.querySelector<HTMLButtonElement>('[data-older]')!;
  let before: number | null = null;
  let currentRevision = client.snapshot.revision;
  let busy = false;
  let inline: ReturnType<typeof editInlineDialogue> | undefined;
  let appliedLayout = client.snapshot.document.layout?.savedAt ?? '';

  function apply(snapshot: SharedSnapshot, resetLayout: boolean) {
    if (resetLayout) appliedLayout = snapshot.document.layout?.savedAt ?? '';
    options.apply(snapshot, resetLayout);
    status.textContent = snapshot.revision ? `Version ${snapshot.revision}` : 'Original version';
  }

  async function run(message: HTMLElement, action: () => Promise<void>, pending = 'Saving…') {
    if (busy) return;
    busy = true;
    message.textContent = pending;
    const controls = Array.from(shell.querySelectorAll<HTMLButtonElement | HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      '.shared-slide-toolbar button, .shared-slide-dialog :is(button, input, select, textarea)'))
      .filter(control => !control.disabled);
    controls.forEach(control => { control.disabled = true; });
    try { await action(); }
    catch (error) { message.textContent = error instanceof Error ? error.message : 'The request failed. Try again.'; }
    finally {
      controls.forEach(control => { control.disabled = false; });
      busy = false;
    }
  }

  function addVersions(target: number | null) {
    return client.history(target).then(page => {
      if (target === null) {
        list.replaceChildren();
        currentRevision = page.versions[0]?.revision ?? 0;
      }
      for (const item of page.versions) {
        const row = document.createElement('li');
        const label = document.createElement('span');
        const heading = item.revision ? `Version ${item.revision}` : 'Original';
        label.textContent = `${heading} · ${item.summary}`;
        if (item.savedAt) {
          const date = document.createElement('time');
          date.dateTime = item.savedAt;
          date.textContent = new Date(item.savedAt).toLocaleString();
          label.append(date);
        }
        row.append(label);
        if (item.revision < currentRevision) {
          const restore = document.createElement('button');
          restore.type = 'button';
          restore.textContent = 'Restore';
          restore.setAttribute('aria-label', `Restore ${heading.toLowerCase()}`);
          restore.addEventListener('click', () => {
            if (busy || !window.confirm(`Restore ${heading.toLowerCase()} for everyone? Your current version stays in history.`)) return;
            void run(historyStatus, async () => {
              const saved = await client.restore(item.revision);
              apply(saved, true);
              await addVersions(null);
              historyStatus.textContent = `Restored as version ${saved.revision}.`;
            });
          });
          row.append(restore);
        } else if (item.revision === currentRevision) {
          const current = document.createElement('span');
          current.textContent = 'Current';
          row.append(current);
        }
        list.append(row);
      }
      before = page.next;
      older.hidden = before === null;
    });
  }

  function saveLayout() {
    const layout = options.hostedLayout;
    if (!layout) return;
    if (!layout.canSave()) {
      status.textContent = 'Return to the map to save its layout.';
      return;
    }
    if (appliedLayout !== (client.snapshot.document.layout?.savedAt ?? '')) {
      status.textContent = 'The shared layout changed. Load it in Version history before saving.';
      return;
    }
    void run(status, async () => {
      const saved = await client.save({ type: 'layout', layout: layout.capture() });
      appliedLayout = saved.document.layout?.savedAt ?? '';
      apply(saved, false);
    });
  }

  function beginInline(target: InlineDialogueTarget, selection: EventTarget | null = null) {
    inline = editInlineDialogue(target, selection);
    regularActions.hidden = true;
    inlineActions.hidden = false;
    inlineLatest.hidden = true;
    status.textContent = 'Editing dialogue';
  }

  function finishInline() {
    inline?.close();
    inline = undefined;
    inlineActions.hidden = true;
    regularActions.hidden = false;
    apply(client.snapshot, false);
    editButton.focus({ preventScroll: true });
  }

  function saveInline() {
    const session = inline;
    if (!session || busy) return;
    void run(status, async () => {
      const change = session.changes();
      session.setBusy(true);
      try {
        if (change) await client.save(change);
        finishInline();
      } catch (error) {
        inlineLatest.hidden = false;
        throw error;
      } finally {
        if (inline === session) session.setBusy(false);
      }
    });
  }

  shell.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    if (inline) {
      if (!event.target.closest('#slide-progress, .preview-presentation, .legend-paging, .classroom-character, .record-quiz, .story-reader__launch')) return;
      event.preventDefault();
      event.stopPropagation();
      status.textContent = 'Save or cancel to leave edit mode.';
      return;
    }
    if (busy || editor.open || versions.open || event.target.closest('.legend-paging') ||
        !event.target.closest('.transcript-panel, .trial-message')) return;
    const target = options.inlineTarget();
    if (!target?.root.contains(event.target)) return;
    event.preventDefault();
    event.stopPropagation();
    beginInline(target, event.target);
  }, { capture: true });

  editButton.addEventListener('click', () => {
    const target = options.inlineTarget();
    if (target) {
      beginInline(target);
      return;
    }
    const key = options.activeKey();
    if (key && sharedSlideByKey.has(key)) section.value = key;
    showCopy();
    editor.showModal();
  });
  toolbar.querySelector('[data-inline-save]')!.addEventListener('click', saveInline);
  toolbar.querySelector('[data-inline-cancel]')!.addEventListener('click', finishInline);
  inlineLatest.addEventListener('click', () => {
    void run(status, async () => {
      await client.refresh();
      inlineLatest.hidden = true;
      status.textContent = 'Latest version loaded. Your draft is still here.';
    }, 'Loading latest…');
  });
  toolbar.querySelector('[data-layout]')!.addEventListener('click', saveLayout);
  toolbar.querySelector('[data-history]')!.addEventListener('click', () => {
    versions.showModal();
    void run(historyStatus, async () => {
      await addVersions(null);
      historyStatus.textContent = currentRevision === client.snapshot.revision ? '' : 'A newer version is available. Load it before restoring.';
    }, 'Loading versions…');
  });
  document.addEventListener('keydown', event => {
    if (event.isComposing) return;
    if (inline && !busy && event.key === 'Escape') {
      event.preventDefault();
      finishInline();
      return;
    }
    if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 's' || event.altKey || editor.open || versions.open) return;
    if (!inline && !options.hostedLayout) return;
    event.preventDefault();
    if (inline) saveInline();
    else saveLayout();
  });
  section.addEventListener('change', showCopy);
  editor.querySelector('[data-cancel]')!.addEventListener('click', () => editor.close());
  form.addEventListener('submit', event => {
    event.preventDefault();
    const draft = sectionsEditor.read();
    if (!isSlideCopy(draft)) {
      editorStatus.textContent = 'Use up to 150 characters for a title, 180 for a reference, and 500 per text section or bullet.';
      return;
    }
    const key = section.value;
    void run(editorStatus, async () => {
      sectionsEditor.setBusy(true);
      try {
        apply(await client.save({ type: 'copy', key, copy: draft }), false);
        editor.close();
      } finally {
        sectionsEditor.setBusy(false);
      }
    });
  });
  editor.querySelector('[data-latest]')!.addEventListener('click', () => {
    void run(editorStatus, async () => {
      apply(await client.refresh(), false);
      editorStatus.textContent = 'Latest version loaded. Your open draft is still here.';
    }, 'Loading latest…');
  });
  older.addEventListener('click', () => {
    void run(historyStatus, async () => { await addVersions(before); historyStatus.textContent = ''; }, 'Loading versions…');
  });
  versions.querySelector('[data-close]')!.addEventListener('click', () => versions.close());
  versions.querySelector('[data-latest]')!.addEventListener('click', () => {
    void run(historyStatus, async () => {
      const latest = await client.refresh();
      const changed = appliedLayout !== (latest.document.layout?.savedAt ?? '');
      if (changed && !window.confirm('Load the latest shared layout? Unsaved moves in this tab will be discarded.')) {
        apply(latest, false);
        historyStatus.textContent = 'Latest text loaded. Your layout is still open in this tab.';
        return;
      }
      apply(latest, changed);
      await addVersions(null);
      historyStatus.textContent = 'Latest version loaded.';
    }, 'Loading latest…');
  });
  for (const dialog of [editor, versions]) dialog.addEventListener('cancel', event => { if (busy) event.preventDefault(); });
  apply(client.snapshot, false);
}
