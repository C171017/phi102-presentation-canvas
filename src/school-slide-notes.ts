import type { SlideNotes } from './legend-slide-notes';

export const schoolNotes: Record<string, SlideNotes> = {
  'regress-foundationalism': {
    title: 'Foundationalism',
    claim: 'A chain of reasons can end with a basic belief.',
    points: [
      'A basic belief can justify other beliefs without borrowing its justification from another belief.',
      'The foundationalist must explain what makes this a legitimate place to stop.',
    ],
    source: 'Greco · §1, p. 426',
  },
  'L6-A': {
    title: 'Cartesian foundationalism',
    claim: 'Descartes looks for foundations that no possible doubt can undermine.',
    points: [
      'An indubitable premise can settle a doubt because its own standing is secure.',
      'Greco’s objection is that too few beliefs meet this standard to support ordinary knowledge.',
    ],
    source: 'Greco · §1, p. 426',
  },
  'L6-B': {
    title: 'Moderate foundationalism',
    claim: 'Perception can supply basic beliefs even when error is possible.',
    points: [
      'Allowing fallible foundations gives ordinary perceptual beliefs a place to start.',
      'Greco asks how a perceptual belief can resolve a doubt once that belief itself comes into question.',
    ],
    source: 'Greco · §1, p. 426',
  },
};
