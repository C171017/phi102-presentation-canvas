// Text of the margin notes beside the local-only "Original paper" pane (drawn by dev-paper-notes.ts).
//
// Each passage starts at an anchor from scripts/paper-anchors.json and runs
// until the next anchor in this list. Multiple cards can point to one passage
// when Greco names several pairings together.
//
// `role` is the move the passage makes in the argument. Objections share one
// color so pushback is recognisable at a glance. Section 3’s pairings use
// related hues for the two versions. The other notes follow the color rotation.

export type PaperCard = { role: string; title: string; idea: string };
export type PaperNote = PaperCard & { id: string; hue?: { ink: string; tint: string }; also?: PaperCard[] };

export const OBJECTION_ROLE = 'Objection';

export const PAPER_NOTES: PaperNote[] = [
  {
    id: 'contemporary-heading', role: 'Setup', title: 'Not the “knows” debate',
    idea: 'Today “contextualism” means that words like “knows” change meaning with context. Greco revives an older idea that once shared the name.',
  },
  {
    id: 'flexible-heading', role: 'Key idea', title: 'Flexible foundationalism',
    idea: 'Our beliefs do rest on foundations, but which beliefs serve as foundations depends on context.',
  },
  {
    id: 'paper-roadmap', role: 'Roadmap', title: 'Three jobs for the chapter',
    idea: '① Why the view is attractive. ② The different forms it can take. ③ What it is good for.',
  },
  {
    id: 'regress-problem', role: 'Puzzle', title: 'The regress puzzle',
    idea: 'A chain of reasons is impossible, endless, circular, or it stops. All four look bad, yet most philosophers bet on “it stops”.',
  },
  {
    id: 'paper-regress-dilemma', role: 'Motive', title: 'Descartes: stop at what you can’t doubt',
    idea: 'A reason you doubt can’t settle a doubt. So only claims beyond doubt seem fit to end the chain.',
  },
  {
    id: 'paper-relaxed-foundations', role: 'Dilemma', title: 'Too strict, or arbitrary',
    idea: 'Demand certainty and almost nothing qualifies: skepticism. Relax it to “perception will do” and the stopping point looks ad hoc.',
  },
  {
    id: 'undoubted-heading', role: 'Key move', title: 'Undoubted, not undoubtable',
    idea: 'Keep Descartes’ insight, but locally: a foundation must be free from doubt here, in this context, not beyond all possible doubt.',
  },
  {
    id: 'paper-routes', role: 'Route 1', title: 'Justifying is something we do',
    idea: 'We give reasons until our audience stops objecting. Audiences differ, so what counts as foundational differs (Annis).',
  },
  {
    id: 'paper-social-objection', role: OBJECTION_ROLE, title: 'Too subjective?',
    idea: 'If nobody around you objects, a claim counts as foundational. But a whole community can wrongly take something for granted.',
  },
  {
    id: 'route-hinges-heading', role: 'Route 2', title: 'Hinges (Wittgenstein)',
    idea: 'To question one thing, you must hold other things fixed. Every inquiry needs hinges, but not always the same ones.',
  },
  {
    id: 'route-knowledge-heading', role: 'Route 3', title: 'Flexible without trying',
    idea: 'Make knowledge the foundation (E = K), add a context-sensitive view of knowledge, and flexible foundations follow.',
  },
  {
    id: 'paper-flexible-knowledge', role: 'Named in §2.3', title: 'Knowledge at the base × Contextualism',
    idea: 'With E = K, the speaker’s context can change what counts as evidence by changing what a knowledge attribution says.',
    also: [
      {
        role: 'Named in §2.3', title: 'Knowledge at the base × Sensitive invariantism',
        idea: 'With E = K, the believer’s situation can affect what she knows and hence what evidence she has.',
      },
      {
        role: 'Named in §2.3', title: 'Knowledge at the base × Relativism',
        idea: 'With E = K, if what counts as knowledge varies with the context of assessment, so can what counts as evidence.',
      },
    ],
    hue: { ink: '#4d5e98', tint: '#e9eaf9' },
  },
  {
    id: 'paper-belief-at-the-base', role: '§2.3 · Belief', title: 'Belief at the base × Sensitivism about belief',
    idea: 'For Harman, every belief is foundational. If Clarke is right that the task can affect what someone believes, it can also affect which foundations they have.',
  },
  {
    id: 'versions-map-heading', role: '§3 · Opening', title: 'What can vary with context?',
    idea: 'Practical stakes and conversational context can affect whether someone knows a claim. Greco applies the same idea to whether someone has foundational justification.',
  },
  {
    id: 'si-heading', role: 'Believer’s community', title: 'Social norms × Sensitive invariantism',
    idea: 'Speakers make the same claim about a belief’s foundational status. Whether that claim is true depends partly on the norms of the believer’s community.',
    hue: { ink: '#227167', tint: '#e1f1e9' },
  },
  {
    id: 'hinges-si-heading', role: 'Believer’s inquiry', title: 'Hinges × Sensitive invariantism',
    idea: 'Whether a belief is foundational depends in part on what the believer must take for granted to pursue her inquiry.',
    hue: { ink: '#286954', tint: '#d2ebdd' },
  },
  {
    id: 'ctx-heading', role: 'Speaker’s community', title: 'Social norms × Contextualism',
    idea: 'Two speakers can use the same words about the same belief. Their communities’ standards can make them express different claims about what counts as a foundation.',
    hue: { ink: '#8c5233', tint: '#faecd9' },
  },
  {
    id: 'hinges-ctx-heading', role: 'Speaker’s inquiry', title: 'Hinges × Contextualism',
    idea: 'Calling a belief foundational can express different claims depending on which question the speaker is investigating.',
    hue: { ink: '#944c37', tint: '#f8e0d4' },
  },
  {
    id: 'paper-contextual-evidence', role: 'Shared linguistic evidence', title: 'How speech reveals foundations',
    idea: '“It must be cold outside” suggests an inference. Brushing off a demand for evidence of your own toothache suggests you take it as a starting point. Both examples can inform either contextualist version.',
    hue: { ink: '#865234', tint: '#f7e6ce' },
  },
  {
    id: 'paper-alternative-views', role: OBJECTION_ROLE, title: 'Social norms × Sensitive invariantism',
    idea: 'A whole community might accept astrology without objection. Could its standards for what counts as foundational still be wrong?',
  },
  {
    id: 'paper-contextualist-reply', role: 'Speaker-commitment variant', title: 'Social norms × Contextualism',
    idea: 'Greco modifies the social route. Calling a belief foundational reports my own willingness to accept it without further reasons. That lets me criticize my community’s acceptance of astrology.',
  },
  {
    id: 'disagree-heading', role: OBJECTION_ROLE, title: 'Social norms × Contextualism',
    idea: 'If we each report our own commitments, both reports can be true. Yet when you accept astrology as a starting point and I challenge it, we seem to disagree. This motivates two alternatives.',
  },
  {
    id: 'paper-disagreement-responses', role: 'Response to disagreement', title: 'Relativism',
    idea: 'Speakers can disagree about the same claim, whose truth can depend on the assessor’s context. If knowledge supplies the foundations, relativism about knowledge can carry over to foundational justification.',
    also: [{
      role: 'Response to disagreement', title: 'Expressivism',
      idea: 'A speaker can express a commitment to accepting a belief as a foundation. Someone who rejects that commitment can genuinely disagree.',
    }],
  },
  {
    id: 'paper-application', role: 'Payoff', title: 'Descartes’ appeal without the baggage',
    idea: 'Flexible foundations can rescue a strong internalist principle that otherwise looks hopelessly Cartesian.',
  },
  {
    id: 'paper-access-principle', role: 'Motive', title: '(Access): you can tell where you stand',
    idea: 'If you are justified in believing P, you are justified in believing that you are. Otherwise you would lean on P while doubting it.',
  },
  {
    id: 'paper-access-objection', role: OBJECTION_ROLE, title: 'Too good to be true?',
    idea: 'Evidence about the weather can mislead. Why would evidence about our own justification never mislead?',
  },
  {
    id: 'paper-cognitive-home', role: 'The price', title: 'A fixed “cognitive home”',
    idea: 'Smithies grounds justification in mental states we can always introspect. That explanation of (Access) requires a Cartesian cognitive home, and Greco doubts we have one.',
  },
  {
    id: 'paper-mobile-home', role: 'Key move', title: 'A cognitive home that moves',
    idea: 'In each context, the subject counts as able to know the facts that ground her justification. When doubts about that access are taken seriously, a different set of facts can take over.',
  },
  {
    id: 'mobile-heading', role: 'Strategy', title: 'Local, not global',
    idea: 'Each context picks the facts that settle what you are justified in believing, and only facts you can know are allowed.',
  },
  {
    id: 'paper-party-example', role: 'Example', title: 'What time is the party?',
    idea: 'If we take for granted that Justine heard Peter, her justification follows what he said, and she knows what he said.',
  },
  {
    id: 'paper-context-shift', role: 'Example', title: 'Raise a doubt, the base shifts',
    idea: 'If Peter might have mumbled, switch to facts she can know: past parties, his email, her best guess.',
  },
  {
    id: 'paper-access-general', role: 'Takeaway', title: 'Always some home',
    idea: 'In every context you have a cognitive home; which facts make it up changes from context to context.',
  },
  {
    id: 'conclusion-heading', role: 'Wrap-up', title: 'Conclusion',
    idea: 'Foundationalism answers the regress, but the foundations depend on context, and that buys access internalism without Descartes.',
  },
];

// Where the notes and bibliography begin. It ends the last note's section and gets no note of its own.
export const NOTES_END_ID = 'paper-notes';
