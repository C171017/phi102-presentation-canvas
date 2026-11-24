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
  L0: {
    claim: 'A belief can support others once the question is settled.',
    points: [
      'Wet ink marks a belief still under questioning.',
      'Dry ink can support further beliefs, and renewed doubt can make it wet again.',
    ],
    source: 'Greco · §1, p. 426',
  },
  'regress-problem': {
    claim: 'A settled belief can serve as a reason for another.',
    points: [
      'The man says all ravens are black because they are made of ink.',
      'The guardian accepts the answer and the belief dries into a stick.',
    ],
    source: 'Greco · §1, p. 426',
  },
  'regress-problem-birth': {
    claim: 'A reason can become the subject of a new question.',
    points: [
      'The original guardian was satisfied with a single answer.',
      'Five voices take its place and keep asking for reasons.',
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
  'L3-continued': {
    claim: 'The prophecy warns that a dream can feel like solid ground.',
    points: [
      'When a supporting reason is also in doubt, it cannot settle the original question.',
      'As their beliefs melt, the people lose the footing they relied on to tell dream from reality.',
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
      'Peirce’s stack of turtles gives every level another one beneath it.',
    ],
    source: 'Greco · §1, p. 426',
  },
  'regress-coherentism': {
    claim: 'Coherentism locates support in a system of beliefs.',
    points: [
      'The planks support Neurath’s belief about the ship. The ship supports his belief about the planks.',
      'SOWHAT’s fairy tale shows how a coherent story can be cut off from experience.',
    ],
    source: 'Greco · §1, p. 426 and note 1',
  },
  L7: {
    claim: 'What is settled in an inquiry can serve as its foundation.',
    points: [
      'The ink dries where the Stranger steps because no one there is questioning it.',
      'A belief that serves as a starting point here can be called into question elsewhere.',
    ],
    source: 'Greco · §2, p. 427',
  },
  P1: {
    claim: 'A community can take a claim for granted and still be wrong.',
    points: [
      'The gavel’s rulings hold while the room is silent. The prosecutor and his mother each undo a ruling by objecting.',
      'The gavel settles what the courtroom accepts. Agreement alone cannot make a claim true.',
    ],
    source: 'Greco · §§2.1, 3, pp. 427, 429–430',
  },
  'P2-1': {
    claim: "To ask one question, you take other things for granted.",
    points: [
      "Cole’s question makes sense only if both of them already accept a great deal: the road, the words, each other.",
      "Wittgenstein calls the claims that stay fixed hinges.",
    ],
    source: "Greco · §2.2, p. 428",
  },
  'P2-2a': {
    claim: "Asking about the color of the sky takes other claims for granted.",
    points: [
      "Simone answers without checking that Cole understands her or that he isn’t tricking her.",
      "This is Wittgenstein’s example in On Certainty §345, which Greco quotes.",
    ],
    source: "Greco · §2.2, p. 428",
  },
  'P2-2b': {
    claim: "You can doubt a great deal while something else stays put.",
    points: [
      "Cole’s advice: start from what you already treat as settled, such as answering to your name.",
      "A hinge is held in place for the inquiry. Nobody proves it first.",
    ],
    source: "Greco · §2.2, p. 428",
  },
  'P2-2c': {
    claim: "A hinge keeps an inquiry going. It does not show that the world is real.",
    points: [
      "Through the door, Simone sees a life she would want.",
      "The dream that is hardest to leave is the one you want to be true.",
    ],
    source: "Greco · §2.2, p. 428",
  },
  'P2-3': {
    claim: "Simone treats it as settled that she knows him, and has no reason to give.",
    points: [
      "A starting point can come without a further reason behind it.",
      "Whether this Cole is real stays open.",
    ],
    source: "Greco · §2.2, p. 428",
  },
  'P2-4': {
    claim: "Our questions and doubts depend on some claims being exempt from doubt.",
    points: [
      "The thread of question marks is the regress from the legend: one “why?” after another.",
      "Nobody else looks up. The questions belong to Simone’s inquiry.",
    ],
    source: "Greco · §2.2, p. 428",
  },
  'P2-5': {
    claim: "With nothing exempt from doubt, the questions never stop.",
    points: [
      "Every question Simone asks feeds the column, because she holds nothing fixed (On Certainty §341).",
      "The Gavel does nothing. The social route needs a jury, and nobody is here.",
    ],
    source: "Greco · §2.2, p. 428",
  },
  'P2-6': {
    claim: "Each hinge Simone holds fixed becomes a plank of the door.",
    points: [
      "The chant follows Wittgenstein’s list in §345: the words mean something, memory holds, the other person isn’t deceiving you.",
      "A minute ago she doubted her eyes. For this inquiry they are a hinge. No claim has to be a hinge for every inquiry.",
    ],
    source: "Greco · §§2.2, 3, pp. 428, 430",
  },
  'P2-7': {
    claim: "Whether Simone has foundational justification depends on the inquiry she is engaged in.",
    points: [
      "“For this door alone”: to carry out this inquiry she must treat these claims as fixed points. This is the sensitive invariantist version.",
      "“If I want the door to turn, the hinges must stay put.” (On Certainty §343)",
    ],
    source: "Greco · §3, p. 430",
  },
};
