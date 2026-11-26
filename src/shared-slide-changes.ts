import { parseLayout } from './layout-data';
import { authoredCues, customCueKeyPattern, customCueNumber, editableCueSequence, joinInkPassageEdits, maxAddedCues, openingClassroomScene } from './classroom-cues';
import { cleanSlideCopy, isDialogueText, isSlideCopy, sharedSlideByKey,
  type AddedDialogueLine, type DialogueCopy, type DialogueStructure, type SharedSlides } from './shared-slide-data';

function dialogueStructure(scene: string, input: Record<string, unknown>, structures?: Record<string, DialogueStructure>) {
  const previous = structures?.[scene];
  const authored = authoredCues(scene);
  const known = new Set(authored.map(cue => cue.key));
  const added = [...(previous?.added ?? [])];
  const removed = new Set(previous?.removed);
  const wire = new Set(added.map(cue => customCueNumber(cue.key)));
  const otherKeys = new Set(Object.entries(structures ?? {}).flatMap(([id, edit]) => id === scene ? [] : edit.added.map(cue => cue.key)));
  for (const cue of added) known.add(cue.key);
  const { added: inserts = [], removed: deletes = [] } = input;
  if (!Array.isArray(inserts) || !Array.isArray(deletes) || deletes.length > known.size ||
      (inserts.length > 0 && added.length + inserts.length > maxAddedCues) || ((inserts.length || deletes.length) && !editableCueSequence(scene))) return null;
  for (const item of inserts as Partial<AddedDialogueLine>[]) {
    if (!item || typeof item.key !== 'string' || !customCueKeyPattern.test(item.key) || known.has(item.key) || otherKeys.has(item.key) ||
        wire.has(customCueNumber(item.key)) || !isDialogueText(item.text) ||
        (item.after !== null && (typeof item.after !== 'string' || !known.has(item.after)))) return null;
    known.add(item.key);
    wire.add(customCueNumber(item.key));
    added.push({ key: item.key, after: item.after, text: item.text });
  }
  for (const key of deletes) {
    if (typeof key !== 'string' || !known.has(key)) return null;
    removed.add(key);
  }
  const quiz = input.quizAfter;
  if (quiz !== undefined && (scene !== openingClassroomScene ||
      (quiz !== null && (typeof quiz !== 'string' || !known.has(quiz) || removed.has(quiz))))) return null;
  const quizAfter = quiz !== undefined ? quiz : previous?.quizAfter;
  return { known, removed, added, quizAfter, changed: Boolean(inserts.length || deletes.length || quiz !== undefined) };
}

function proposedDialogue(body: Record<string, unknown>, previous: SharedSlides) {
  const { scene, lines, copy } = body;
  if (typeof scene !== 'string' || !lines || typeof lines !== 'object' || Array.isArray(lines)) return null;
  const structures = joinInkPassageEdits(previous.dialogueStructure);
  const structure = dialogueStructure(scene, body, structures);
  if (!structure) return null;
  const changes = Object.entries(lines);
  if (changes.length > 200 || changes.some(([key, text]) => !structure.known.has(key) || structure.removed.has(key) || !isDialogueText(text))) return null;
  const panel = copy as Partial<DialogueCopy> | undefined;
  const entry = panel && typeof panel.key === 'string' ? sharedSlideByKey.get(panel.key) : undefined;
  if (copy !== undefined && (!entry?.panel || entry.slideId !== scene || !isSlideCopy(panel?.copy))) return null;
  if (!changes.length && copy === undefined && !structure.changed) return null;
  let document = previous;
  if (entry && panel?.copy) {
    document = { ...document, copy: { ...document.copy, [entry.key]: cleanSlideCopy(panel.copy) } };
  }
  if (changes.length) document = { ...document, dialogue: { ...document.dialogue, ...Object.fromEntries(changes) } };
  if (structure.changed) {
    const { added, removed, quizAfter } = structure;
    document = { ...document, dialogueStructure: { ...structures, [scene]: { added, removed: [...removed], quizAfter } } };
  }
  return document;
}

function proposedLayout(value: unknown) {
  const layout = parseLayout(JSON.stringify(value) ?? null);
  if (!layout) return null;
  const entries = Object.entries(layout.items);
  const input = (value as { items: object }).items;
  if (entries.length !== Object.keys(input).length || entries.length > 300 ||
      Math.abs(layout.view.x) > 1e6 || Math.abs(layout.view.y) > 1e6 ||
      entries.some(([key, item]) => !/^[a-zA-Z0-9_-]{1,120}$/.test(key) || Math.abs(item.x) > 1e6 || Math.abs(item.y) > 1e6)) return null;
  return { ...layout, savedAt: new Date().toISOString() };
}

export function applySharedSlideChange(body: Record<string, unknown>, current: SharedSlides, allowLayout = true) {
  if (body.type === 'copy' && typeof body.key === 'string' && isSlideCopy(body.copy)) {
    const entry = sharedSlideByKey.get(body.key);
    if (!entry) return { error: 'Unknown slide.' };
    const copy = cleanSlideCopy(body.copy);
    return { document: { ...current, copy: { ...current.copy, [body.key]: copy } }, summary: `Edited ${entry.label}` };
  }
  if (body.type === 'dialogue') {
    const document = proposedDialogue(body, current);
    if (!document) return { error: 'Invalid dialogue edit.' };
    const scene = typeof body.scene === 'string' ? sharedSlideByKey.get(body.scene) : undefined;
    return { document, summary: `Edited dialogue · ${scene?.label ?? body.scene}` };
  }
  if (allowLayout && body.type === 'layout') {
    const layout = proposedLayout(body.layout);
    if (!layout) return { error: 'The canvas layout is invalid.' };
    return { document: { ...current, layout }, summary: 'Edited the canvas layout' };
  }
  return { error: 'Invalid slide content.' };
}

// Apply changes between two editions while retaining edits outside the changed keys.
export function mergeSlideEdits(base: SharedSlides, previous: SharedSlides, next: SharedSlides): SharedSlides {
  const equal = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
  function merge<T>(current: Record<string, T> | undefined, before: Record<string, T> = {}, after: Record<string, T> = {},
    reconcile?: (current?: T, before?: T, after?: T) => T | undefined) {
    const result = { ...current };
    let changed = false;
    for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) {
      if (equal(before[key], after[key])) continue;
      const value = reconcile ? reconcile(result[key], before[key], after[key])
        : after[key] ?? (equal(result[key], before[key]) ? undefined : result[key]);
      if (equal(result[key], value)) continue;
      if (value === undefined) delete result[key];
      else result[key] = value;
      changed = true;
    }
    return changed ? result : current;
  }
  function mergeStructure(current?: DialogueStructure, before?: DialogueStructure, after?: DialogueStructure) {
    const additions = (edit?: DialogueStructure) => Object.fromEntries((edit?.added ?? []).map(line => [line.key, line]));
    const removals = (edit?: DialogueStructure) => Object.fromEntries((edit?.removed ?? []).map(key => [key, true]));
    const addedByKey = merge(additions(current), additions(before), additions(after))!;
    const removed = Object.keys(merge(removals(current), removals(before), removals(after))!);
    const quizAfter = before?.quizAfter === after?.quizAfter ? current?.quizAfter : after?.quizAfter;
    // A live line may still be anchored to an insertion removed by a Git revert.
    const previousLines = additions(current);
    const retainedAnchors = new Set<string>();
    for (const line of Object.values(addedByKey)) {
      let anchor = line.after;
      while (anchor && !Object.hasOwn(addedByKey, anchor) && !retainedAnchors.has(anchor) && Object.hasOwn(previousLines, anchor)) {
        retainedAnchors.add(anchor);
        anchor = previousLines[anchor].after;
      }
    }
    const added = Object.values({ ...Object.fromEntries([...retainedAnchors].map(key => [key, previousLines[key]])), ...addedByKey });
    if (!added.length && !removed.length && quizAfter === undefined) return undefined;
    return { added, removed: [...new Set([...removed, ...retainedAnchors])], quizAfter };
  }
  const copy = merge(base.copy, previous.copy, next.copy)!;
  const dialogue = merge(base.dialogue, previous.dialogue, next.dialogue);
  const dialogueStructure = merge(base.dialogueStructure, previous.dialogueStructure, next.dialogueStructure, mergeStructure);
  if (copy === base.copy && dialogue === base.dialogue && dialogueStructure === base.dialogueStructure) return base;
  return { ...base, copy, dialogue, dialogueStructure };
}
