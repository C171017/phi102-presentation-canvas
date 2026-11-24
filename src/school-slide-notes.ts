import type { SlideNotes } from './legend-slide-notes';

export const schoolNotes: Record<string, SlideNotes> = {
  'regress-foundationalism': {
    claim: 'Some justified beliefs can end a chain of reasons.',
    points: [
      'A basic belief can support others without drawing its justification from another belief.',
      'Descartes looks for a basic belief that withstands every attempt to doubt it.',
    ],
    bridge: 'Watch what happens when he tries to doubt that he is thinking.',
    source: 'Greco · §1, p. 426',
  },
  'L6-A': {
    claim: 'Cartesians look for beliefs that cannot be doubted.',
    points: [
      'A belief that withstands every doubt can stop the demand for reasons.',
      'Very few beliefs meet this standard. Can they support what we ordinarily take ourselves to know?',
    ],
    bridge: 'The pebble is solid. How much can they build on it?',
    source: 'Greco · §1, p. 426',
  },
  'L6-B': {
    claim: 'Moderates let perception supply basic beliefs.',
    points: [
      'A perceptual belief can have basic justification even if someone could doubt it.',
      'Greco asks what lets it settle a doubt once its own support is challenged.',
    ],
    bridge: 'Pay attention to the question Y asks about the floor.',
    source: 'Greco · §1, p. 426',
  },
};
