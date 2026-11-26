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
export const sharedSlideEntries = slides.map(({ members: [id], title, description }, index) => {
  const note = notes[id];
  const classroom = id === 'contemporary-heading';
  const label = `${index + 1}. ${classroom ? 'Classroom · Opening explanation' : title}`;
  let initial: SlideCopy;
  if (note && !classroom) {
    initial = { sections: [
      { kind: 'header', title: '', source: note.source },
      { kind: 'heading', text: note.title },
      { kind: 'text', text: note.claim },
      { kind: 'bullets', items: [...note.points] },
    ] };
  } else {
    initial = { title, claim: note?.claim ?? description, points: [...(note?.points ?? [])], bridge: '', source: note?.source ?? '' };
  }
  // The Trial uses its own dialogue player and has no left panel.
  return { key: id, slideId: id, label, panel: Boolean(note) && id !== 'P1', initial };
});

export const sharedSlideByKey = new Map(sharedSlideEntries.map(entry => [entry.key as string, entry]));

export const originalSharedSnapshot: SharedSnapshot = {
  revision: 0, savedAt: null, summary: 'Original website', document: { layout: null, copy: {} },
};

export function isRevision(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}
