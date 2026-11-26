export type SlideNotes = {
  claim: string;
  points: readonly string[];
  source: string;
};

export const openingNotes: Record<string, SlideNotes> = {
  'contemporary-heading': {
    claim: 'What “I know” claims can depend on the conversation.',
    points: [
      'A proposition is the claim a sentence expresses.',
      'Contemporary contextualism says the same sentence can express different propositions as the context changes.',
    ],
    source: 'Greco · Introduction, p. 425',
  },
  L0: {
    claim: 'In the Ink Ocean, a settled belief can bear weight.',
    points: [
      'Wet ink is a belief still being questioned. Dry ink can support another belief.',
      'A fresh challenge can put a once-settled reason back in question.',
    ],
    source: 'Greco · §1, pp. 426–427',
  },
  'regress-problem-birth': {
    claim: 'The Inkwell is about to change who gets to ask “why?”',
    points: [],
    source: 'Greco · §1, p. 426',
  },
  L2: {
    claim: 'A reason can become the next question.',
    points: [
      'The woman cites her sight as evidence that she has a hand.',
      'When Y asks why she trusts her eyes, the evidence itself needs a reason.',
    ],
    source: 'Greco · §1, p. 426',
  },
  L3: {
    claim: 'A disputed reason leaves the original doubt open.',
    points: [
      'The man generalizes from the black ravens he has seen to all ravens.',
      'The next “why?” asks what justifies that step.',
    ],
    source: 'Greco · §1, p. 426',
  },
  'L3-continued': {
    claim: 'A dream can feel like solid ground.',
    points: [
      'The prophecy asks what we could rely on if familiar appearances came into question.',
    ],
    source: 'Greco · §1, p. 426',
  },
  L4: {
    claim: 'What can happen to a chain of reasons?',
    points: [
      'Skepticism gives up justification. Infinitism keeps supplying further, distinct reasons.',
      'Coherentism draws on mutual support. Foundationalism allows a justified stopping point.',
    ],
    source: 'Greco · §1, p. 426',
  },
  'regress-skepticism': {
    claim: 'Can any belief survive the demand for reasons?',
    points: [
      'On this answer to the regress, no belief can be justified.',
      'Greco’s objection starts with ordinary life, where at least some beliefs seem justified.',
    ],
    source: 'Greco · §1, p. 426',
  },
  'regress-infinitism': {
    claim: 'Infinitism keeps the chain going.',
    points: [
      'The chain continues forever without repeating any reason.',
      'Greco flags the worry that an infinite regress is itself a defect in a justification.',
    ],
    source: 'Greco · §1, p. 426',
  },
  'regress-coherentism': {
    claim: 'Coherentism looks for support across a system of beliefs.',
    points: [
      'Greco’s simplified model lets a chain of reasons loop back on itself. Neurath pictures a wider web.',
      'A system can fit together while losing contact with experience.',
    ],
    source: 'Greco · §1, p. 426 and note 1',
  },
  L7: {
    claim: 'A foundation needs to be free from doubt here and now.',
    points: [
      'An undoubted belief can help resolve a doubt if it gives good support to the claim in question.',
      'A starting point here can be questioned in another inquiry.',
    ],
    source: 'Greco · §1, p. 427',
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
    claim: 'Every inquiry has starting points.',
    points: [
      'An inquiry starts with an open, answerable question.',
      'A hinge is a claim you hold fixed so that inquiry can proceed.',
    ],
    source: 'Greco · §2.2, p. 428',
  },
  'P2-2a': {
    claim: 'A simple question relies on several hinges.',
    points: [
      'To learn a color from someone, you take their understanding and cooperation for granted.',
      'You also rely on your memory of what the color words mean.',
    ],
    source: 'Greco · §2.2, p. 428 · On Certainty §345',
  },
  'P2-2b': {
    claim: 'A hinge can be in use before anyone says it aloud.',
    points: [
      'It supplies a starting point without first needing a reason of its own.',
      'You can rely on it while asking for reasons about something else.',
    ],
    source: 'Greco · §2.2, p. 428',
  },
  'P2-2c': {
    claim: 'One experience can prompt several inquiries.',
    points: [
      'You can ask what appears to you.',
      'You can also ask how much to trust that appearance. That question needs its own starting points.',
    ],
    source: 'Greco · §2.2, p. 428',
  },
  'P2-3': {
    claim: 'An inquiry can turn back on its own starting point.',
    points: [
      'A claim you usually take for granted can become the thing you investigate.',
      'The new inquiry needs its own starting points.',
    ],
    source: 'Greco · §2.2, p. 428',
  },
  'P2-4': {
    claim: 'Even doubt relies on settled ground.',
    points: [
      'To check a claim, you need some evidence or a test you can trust for now.',
      'What you hold fixed helps determine which questions you can investigate.',
    ],
    source: 'Greco · §2.2, p. 428 · On Certainty §341',
  },
  'P2-5': {
    claim: 'Questioning every starting point stalls the inquiry.',
    points: [
      'When every proposed reason is in doubt, each reason becomes the next question.',
      'A hinge gives you a fixed point from which to test a doubtful claim.',
    ],
    source: 'Greco · §2.2, p. 428',
  },
  'P2-6': {
    claim: 'The same claim can change roles across inquiries.',
    points: [
      'You can take your eyesight for granted in one inquiry and examine it in another.',
      'Words and memory can also provide fixed points when the inquiry depends on them.',
    ],
    source: 'Greco · §§2.2, 3, pp. 428, 430',
  },
  'P2-7': {
    claim: 'Foundational justification can vary with the inquiry.',
    points: [
      'What the subject must hold fixed matters to what she is justified in taking for granted.',
      'Greco calls this a sensitive invariantist version of flexible foundationalism.',
    ],
    source: 'Greco · §3, p. 430',
  },
};
