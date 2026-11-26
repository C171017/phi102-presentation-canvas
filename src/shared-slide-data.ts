import type { Layout } from './layout-data';
import { openingNotes } from './legend-slide-notes';
import { schoolNotes } from './school-slide-notes';
import { slides } from './slide-content';
import type { SlideCopy } from './slide-sections';
export { cleanSlideCopy, isSlideCopy, type SlideCopy } from './slide-sections';

export const sharedSlidesPath = '/api/shared-slides';
export const editKeyPattern = /^[0-9a-f]{64}$/;

export type AddedDialogueLine = { key: string; after: string | null; text: string };
export type DialogueStructure = { added: AddedDialogueLine[]; removed: string[]; quizAfter?: string | null };
export type SharedSlides = { layout: Layout | null; copy: Record<string, SlideCopy>; dialogue?: Record<string, string>;
  dialogueStructure?: Record<string, DialogueStructure> };
export type SlideVersion = { revision: number; savedAt: string | null; summary: string };
export type SharedSnapshot = SlideVersion & { document: SharedSlides };
export type DialogueCopy = { key: string; copy: SlideCopy };
export type DialogueChange = { type: 'dialogue'; scene: string; copy?: DialogueCopy; lines: Record<string, string>;
  added?: AddedDialogueLine[]; removed?: string[]; quizAfter?: string | null };
export type SharedChange = { type: 'copy'; key: string; copy: SlideCopy } | { type: 'layout'; layout: Layout } | DialogueChange;
export const dialogueTextLimit = 3000;

export function isDialogueText(text: unknown): text is string {
  return typeof text === 'string' && Boolean(text.trim()) && text.length <= dialogueTextLimit;
}

const notes = { ...openingNotes, ...schoolNotes };
function panelEntry(key: string, slideId: string, title: string, label: string) {
  const note = notes[key];
  return {
    key, slideId, label, panel: true,
    initial: { title, claim: note.claim, points: [...note.points], bridge: note.bridge ?? '', source: note.source },
  };
}

export const sharedSlideEntries = slides.flatMap(({ members: [id], title, description }, index) => {
  const label = `${index + 1}. ${title}`;
  if (id === 'contemporary-heading') return [panelEntry(id, id, title, `${index + 1}. Classroom · Opening explanation`)];
  // The Trial uses its own dialogue player and has no left panel.
  if (id !== 'P1' && Object.hasOwn(notes, id)) return [panelEntry(id, id, title, label)];
  return [{ key: id, slideId: id, label, panel: false, initial: { title, claim: description, points: [], bridge: '', source: '' } }];
});

export const sharedSlideByKey = new Map(sharedSlideEntries.map(entry => [entry.key as string, entry]));

export const originalSharedSnapshot: SharedSnapshot = {
  revision: 0, savedAt: null, summary: 'Original website', document: { layout: null, copy: {} },
};

export function isRevision(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}
