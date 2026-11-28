import type { SlideSection } from './slide-sections';

export type SlideNotes = {
  title: string;
  claim: string;
  points: readonly string[];
  source: string;
};

export const airportComparison: Extract<SlideSection, { kind: 'comparison' }> = {
  kind: 'comparison',
  quote: '“Smith knows the flight stops in Chicago.”',
  rows: [
    {
      context: 'Routine question',
      condition: 'The flight stops in Chicago, and Smith’s evidence (needs to) meet the ordinary standard. The printed schedule is enough.',
    },
    {
      context: 'Important meeting in Chicago',
      condition: 'The flight stops in Chicago, and Smith’s evidence (needs to) meet a higher standard. He needs enough evidence to confirm that the printed schedule is still current.',
    },
  ],
};

export const openingNotes: Record<string, SlideNotes> = {
  'contemporary-heading': {
    title: 'Contemporary Contextualism',
    claim: 'What “I know” claims can depend on the conversation.',
    points: [
      'A proposition is the claim a sentence expresses.',
    ],
    source: 'Greco · Introduction, p. 425',
  },
  L0: {
    title: 'Flexible foundationalism',
    claim: 'Which beliefs can serve as foundations depends on the context.',
    points: [
      'A basic belief can give us a reason to believe something else.',
      'A belief that serves as a starting point in one inquiry can itself come into question in another.',
    ],
    source: 'Greco · Introduction, p. 425 and §1, p. 427',
  },
  'regress-problem-birth': {
    title: 'Inferential justification',
    claim: 'Giving a reason for a belief raises a question about the reason itself.',
    points: [
      'Suppose I believe a claim because a witness reported it.',
      'If I have reason to doubt the witness, I still need grounds for accepting the report.',
    ],
    source: 'Greco · §1, p. 426',
  },
  L2: {
    title: 'The regress problem',
    claim: 'If every belief needs support from another belief, where can justification begin?',
    points: [
      'If a forecast gives me a reason to expect rain, what reason do I have to trust the forecast?',
      'If each answer requires another justified belief, the original question leads to a regress.',
    ],
    source: 'Greco · §1, p. 426',
  },
  L3: {
    title: 'Doubt about a premise',
    claim: 'A premise I doubt cannot settle my doubt about a conclusion.',
    points: [
      'I can grant that Q would be a good reason for P while still doubting Q.',
      'If a prediction depends on past observations, doubting those observations leaves the prediction in doubt.',
    ],
    source: 'Greco · §1, p. 426',
  },
  'L3-continued': {
    title: 'Cartesian doubt',
    claim: 'What could I still justifiably believe if my senses were deceiving me?',
    points: [
      'An experience might seem exactly the same whether it is accurate or misleading.',
      'Descartes looks for a starting point that survives even this kind of doubt.',
    ],
    source: 'Greco · §1, p. 426',
  },
  L4: {
    title: 'Three responses to the regress',
    claim: 'What happens when every reason calls for a further reason?',
    points: [
      'Skepticism holds that the regress leaves no belief justified.',
      'Infinitism accepts an endless chain of distinct reasons.',
      'Coherentism finds justification in a system of mutually supporting beliefs.',
    ],
    source: 'Greco · §1, p. 426',
  },
  'regress-skepticism': {
    title: 'Skepticism about justification',
    claim: 'The skeptic’s answer is that no belief is justified.',
    points: [
      'If every proposed reason lacks justification, appealing to it leaves the original belief unsupported.',
      'Greco objects that at least some of our ordinary beliefs seem justified.',
    ],
    source: 'Greco · §1, p. 426',
  },
  'regress-infinitism': {
    title: 'Infinitism',
    claim: 'Every reason has a further, distinct reason in its support.',
    points: [
      'The chain has no final premise, and no reason repeats.',
      'Greco raises a practical objection. A person defending a belief has only a finite time to give reasons.',
    ],
    source: 'Greco · §§1, 2.1, pp. 426–427',
  },
  'regress-coherentism': {
    title: 'Coherentism',
    claim: 'A belief draws support from its place in a system of beliefs.',
    points: [
      'In Greco’s simplified model, following the reasons eventually brings us back to an earlier belief.',
      'This raises a challenge for the coherentist. How can mutual support justify a belief if arguing in a circle is unconvincing?',
    ],
    source: 'Greco · §1, p. 426 and note 1',
  },
  'regress-foundationalism': {
    title: 'Foundationalism',
    claim: 'A chain of reasons can end at a justified basic belief.',
    points: [
      'A basic belief can support other beliefs without depending on a further belief for its own justification.',
      'Descartes looked for foundations that could withstand every possible doubt.',
    ],
    source: 'Greco · §1, pp. 426–427',
  },
  L7: {
    title: 'Locally undoubted foundations',
    claim: 'A belief can settle a doubt when it is itself undoubted in that inquiry.',
    points: [
      'A premise can support a conclusion even if we could question the premise on another occasion.',
      'This gives the foundationalist a reason to stop without requiring absolute certainty.',
    ],
    source: 'Greco · §1, p. 427',
  },
  P1: {
    title: 'Community standards and justification',
    claim: 'On Annis’s account, an appropriate audience helps determine which beliefs are basic.',
    points: [
      'A belief can serve as a foundation if the relevant group would raise no objection to it.',
      'Greco asks whether a whole community could be mistaken about what it is entitled to take for granted.',
    ],
    source: 'Greco · §2.1, pp. 427–428 and §3, p. 430',
  },
  'P2-1': {
    title: 'Hinge propositions',
    claim: 'To investigate an open question, we have to treat some other questions as settled.',
    points: [
      'Wittgenstein calls the propositions we hold fixed “hinges.”',
      'A hinge supplies a starting point for answering the question at hand.',
    ],
    source: 'Greco · §2.2, p. 428 · On Certainty §341',
  },
  'P2-2a': {
    title: 'Justification as a social activity × Contextualism',
    claim: 'A whole epistemic community can be wrong about what needs no further reasons.',
    points: [
      'Sensitive invariantism. On Annis’s social account, the believer’s community helps determine which beliefs need no further reasons.',
      'A community could accept astrology without objection and still be wrong to treat it as a foundation.',
      'Contextualism. The speaker’s epistemic community helps determine which claim the speaker expresses. A speaker can ask for reasons the believer’s community would never demand.',
    ],
    source: 'Greco · §3, pp. 429–431',
  },
  'P2-2b': {
    title: 'Taking a proposition for granted',
    claim: 'A hinge can guide an inquiry even when nobody states it.',
    points: [
      'I can look up a date without first checking whether I remember how to read a calendar.',
      'My ability to read it is one of the things I take for granted in using it as evidence.',
    ],
    source: 'Greco · §2.2, p. 428',
  },
  'P2-2c': {
    title: 'Perception as evidence',
    claim: 'What we can learn from an experience depends on the question we ask.',
    points: [
      'To identify a color by sight, I ordinarily take the viewing conditions for granted.',
      'If I ask whether the lighting distorts the color, those conditions become part of what I need to check.',
    ],
    source: 'Greco · §2.2, p. 428',
  },
  'P2-3': {
    title: 'Memory as a hinge',
    claim: 'The same memory can serve as evidence or become the object of inquiry.',
    points: [
      'I might rely on my memory of a word to interpret what someone says.',
      'If I start to doubt my recollection, I can check it against a dictionary whose accuracy I take for granted.',
    ],
    source: 'Greco · §2.2, p. 428',
  },
  'P2-4': {
    title: 'What makes a doubt investigable?',
    claim: 'To investigate a doubt, we need a test whose result we can use.',
    points: [
      'To check an observation, I might repeat it or ask a second observer.',
      'Either test relies on something I accept for now, such as my ability to compare the two reports.',
    ],
    source: 'Greco · §2.2, p. 428 · On Certainty §341',
  },
  'P2-5': {
    title: 'The hinge argument for foundations',
    claim: 'Inquiry requires at least some propositions to stand as foundations.',
    points: [
      'If every proposed test is itself in question, we have no accepted basis for interpreting its result.',
      'Greco calls this a transcendental argument. It identifies a condition that makes inquiry possible.',
    ],
    source: 'Greco · §2.2, p. 428',
  },
  'P2-6': {
    title: 'Why hinges can vary',
    claim: 'Different inquiries can require different starting points.',
    points: [
      'A listener might take a speaker’s command of English for granted when asking about a color.',
      'In a language exam, that very ability is what the examiner wants to establish.',
    ],
    source: 'Greco · §§2.2, 3, pp. 428, 430',
  },
  'P2-7': {
    title: 'Sensitive invariantism about foundations',
    claim: 'A person’s inquiry can affect which beliefs are foundationally justified.',
    points: [
      'On Greco’s hinge version, a subject may be justified in taking a proposition for granted because their inquiry requires it.',
      'So two people with the same experiences can have different foundations if their inquiries require different hinges.',
    ],
    source: 'Greco · §3, p. 430',
  },
};
