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
  L5b: {
    claim: 'An indubitable foundation can still be too small.',
    points: [
      'The grain supports “I exist” even if the whole scene is a dream.',
      'It leaves open whether she has a hand, holds a ladle, or is dreaming.',
    ],
    source: 'Greco · §1, p. 426',
  },
  L6: {
    claim: 'What makes a starting point legitimate?',
    points: [
      'The tower admits only beliefs that survive every doubt.',
      'The fleet also builds on what its lookouts see. Can those beliefs settle a doubt?',
    ],
    source: 'Greco · §1, p. 426',
  },
  'L6-A': {
    claim: 'The Cartesian standard admits too few beliefs.',
    points: [
      'The grain holds because even doubting requires thought.',
      'From “I think” alone, the tower cannot tell whether the fleet is real.',
    ],
    source: 'Greco · §1, p. 426',
  },
  'L6-B': {
    claim: 'Moderate foundationalism allows perceptual starting points.',
    points: [
      'The lookout takes “I see a solid deck” as reason to stand on it.',
      'Once she doubts her sight, why would the same view settle the question?',
    ],
    source: 'Greco · §1, p. 426',
  },
};
