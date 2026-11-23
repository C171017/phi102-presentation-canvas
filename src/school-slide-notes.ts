import type { SlideNotes } from './legend-slide-notes';

export const schoolNotes: Record<string, SlideNotes> = {
  'regress-foundationalism': {
    claim: 'Doubting “I think” confirms it.',
    points: [
      'Even an attempt to doubt his thinking is an act of thought.',
      'That makes “I think” a foundation: it needs no further supporting belief.',
    ],
    source: 'Greco · §1, p. 426',
  },
  'L6-A': {
    claim: 'The Cartesian standard admits too few beliefs.',
    points: [
      'Ten thousand Cartesians produce one brick after three hundred years.',
      'The brick withstands every question. One brick gives them too little to build with.',
    ],
    source: 'Greco · §1, p. 426',
  },
  'L6-B': {
    claim: 'Moderate foundationalism allows perceptual starting points.',
    points: [
      'The moderates dry what seems true and build a town in an afternoon.',
      'Once Y questions the floor, the town collapses. Why would the same appearance settle that doubt?',
    ],
    source: 'Greco · §1, p. 426',
  },
};
