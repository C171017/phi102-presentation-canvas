import type { SchoolCounts } from './school-vote';
import type { OpeningQuizSnapshot } from './opening-quiz';
import { legendById, slides } from './slide-content';
import { hasEstablishingShot } from './ink-ocean-scenes';
import { openingClassroomScene } from './classroom-cues';

// Preserve the existing dialogue cue numbers when sharing an image-only step.
export const establishingCueOffset = 1000;
// A presenter can finish the typewriter without turning the Trial page.
export const revealedTrialCueOffset = 2000;
// A single shared cue for the silent transcript before the first line.
export const transcriptPreviewCue = 3000;
export const presenterKeyPattern = /^[0-9a-f]{64}$/;
export const slideCount = slides.length;
export const isSlide = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0 && value < slideCount;
export const isCue = (value: unknown): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;

export function firstPresentationCue(index: number): number {
  const id = slides[index]?.members[0];
  const scene = legendById.get(id);
  return id === openingClassroomScene || (scene && hasEstablishingShot(scene, 0)) ? establishingCueOffset : 0;
}

export type PresentationCues = {
  read(slide: number): number;
  apply(slide: number, cue: number): void;
  subscribe(listener: () => void): void;
};

export type RoomSnapshot = {
  type: 'state';
  presenterSlide: number;
  presenterCue?: number;
  presenterOnline: boolean;
  openingPlaying?: boolean;
  schools?: SchoolCounts;
  openingQuiz?: OpeningQuizSnapshot;
  counts: number[];
  browsing: number;
};
