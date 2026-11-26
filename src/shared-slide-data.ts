import type { Layout } from './layout-data';
import { openingNotes } from './legend-slide-notes';
import { schoolNotes } from './school-slide-notes';
import { slides } from './slide-content';

export const sharedSlidesPath = '/api/shared-slides';
export const editKeyPattern = /^[0-9a-f]{64}$/;

export type SlideCopy = { title: string; claim: string; points: string[]; bridge: string; source: string };
export type SharedSlides = { layout: Layout | null; copy: Record<string, SlideCopy>; dialogue?: Record<string, string> };
export type SlideVersion = { revision: number; savedAt: string | null; summary: string };
export type SharedSnapshot = SlideVersion & { document: SharedSlides };
export type DialogueCopy = { key: string; copy: SlideCopy };
export type DialogueChange = { type: 'dialogue'; scene: string; copy?: DialogueCopy; lines: Record<string, string> };
export type SharedChange = { type: 'copy'; key: string; copy: SlideCopy } | { type: 'layout'; layout: Layout } | DialogueChange;
export const dialogueTextLimit = 3000;

export function isDialogueText(text: unknown): text is string {
  return typeof text === 'string' && Boolean(text.trim()) && text.length <= dialogueTextLimit;
}

const notes = { ...openingNotes, ...schoolNotes };
const classroom = [
  ['contemporary-heading', 'Contemporary Contextualism', 'Classroom · Opening explanation'],
  ['contemporary-result', 'Contemporary Contextualism', 'Classroom · Quiz result'],
  ['contemporary-reveal', 'Flexible Foundationalism', 'Classroom · Closing reveal'],
] as const;

function panelEntry(key: string, slideId: string, title: string, label: string) {
  const note = notes[key];
  return {
    key, slideId, label, panel: true,
    initial: { title, claim: note.claim, points: [...note.points], bridge: note.bridge ?? '', source: note.source },
  };
}

export const sharedSlideEntries = slides.flatMap(({ members: [id], title, description }, index) => {
  const label = `${index + 1}. ${title}`;
  if (id === 'contemporary-heading') return classroom.map(([key, name, item]) => panelEntry(key, id, name, `${index + 1}. ${item}`));
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

export function isSlideCopy(value: unknown): value is SlideCopy {
  if (!value || typeof value !== 'object') return false;
  const { title, claim, points, bridge, source } = value as Partial<SlideCopy>;
  return typeof title === 'string' && Boolean(title.trim()) && title.length <= 150 &&
    typeof claim === 'string' && Boolean(claim.trim()) && claim.length <= 500 &&
    Array.isArray(points) && points.length <= 12 && points.every(point => typeof point === 'string' && Boolean(point.trim()) && point.length <= 500) &&
    typeof bridge === 'string' && bridge.length <= 500 && typeof source === 'string' && source.length <= 180;
}
