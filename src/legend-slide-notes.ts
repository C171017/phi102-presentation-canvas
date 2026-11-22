export type SlideNotes = {
  claim: string;
  points: readonly string[];
  source: string;
};

export const openingNotes: Record<string, SlideNotes> = {
  'contemporary-heading': {
    claim: 'A sentence can express different claims in different contexts.',
    points: [
      'A proposition is the claim a speaker makes.',
      'When someone says “I know,” the conversation helps determine what they claim.',
    ],
    source: 'Greco · Introduction, p. 425',
  },
  'contemporary-result': {
    claim: 'The surrounding symbols change how we read the mark.',
    points: [
      'Across the row, it reads as B. Down the column, it reads as 13.',
      'For Greco, the context of utterance can change which proposition a sentence expresses.',
    ],
    source: 'Greco · Introduction, p. 425',
  },
  'contemporary-reveal': {
    claim: 'Which beliefs serve as foundations can change with context.',
    points: [
      'A foundation is a belief that can support others without another supporting belief.',
      'Which belief can play that role depends on what is in question.',
    ],
    source: 'Greco · Introduction, p. 425',
  },
  'regress-problem': {
    claim: 'A settled belief can serve as a reason for another.',
    points: [
      'The cook treats his mother’s verdict as a starting point.',
      'If he doubts her judgment too, it cannot settle whether he cooks well.',
    ],
    source: 'Greco · §1, p. 426',
  },
  L2: {
    claim: 'What justifies the reason you just gave?',
    points: [
      'She cites what she sees as evidence that she has a hand.',
      'Questioning her sight shifts the demand for justification to that evidence.',
    ],
    source: 'Greco · §1, p. 426',
  },
  L3: {
    claim: 'A reason you also doubt leaves the first doubt unresolved.',
    points: [
      'Wet ink spreads upward: a belief rests on another belief already in doubt.',
      'Greco’s point: citing a disputed reason cannot settle the original question.',
    ],
    source: 'Greco · §1, p. 426',
  },
  L4: {
    claim: 'Four responses to the demand for reasons',
    points: [
      'The first question is whether any belief can be justified.',
      'If justification is possible, what shape does its chain of reasons take?',
    ],
    source: 'Greco · §1, p. 426',
  },
  'regress-skepticism': {
    claim: 'In Greco’s taxonomy, skepticism denies that beliefs are justified.',
    points: [
      'Pyrrho suspends judgment when asked what he has reason to believe.',
      'Its cost is giving up beliefs we ordinarily have good reason to hold.',
    ],
    source: 'Greco · §1, p. 426',
  },
  'regress-infinitism': {
    claim: 'Infinitism allows an endless chain of distinct reasons.',
    points: [
      'Any reason you point to has a further reason supporting it.',
      'The scroll keeps growing because no earlier reason can be reused.',
    ],
    source: 'Greco · §1, p. 426',
  },
  'regress-coherentism': {
    claim: 'Coherentism locates support in a system of beliefs.',
    points: [
      'On Neurath’s raft, neighboring planks support the one under repair.',
      'In Greco’s sketch, tracing support eventually returns to an earlier belief.',
    ],
    source: 'Greco · §1, p. 426 and note 1',
  },
  'L4-quiz': {
    claim: 'Which account permits a justified stopping point?',
    points: [
      'Think back to the empty ladle, the scroll, and the raft.',
      'Can a belief support another without getting its justification from another belief?',
    ],
    source: 'Greco · §1, p. 426',
  },
};
