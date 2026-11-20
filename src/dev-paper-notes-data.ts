// Text of the margin notes beside the local-only "Original paper" pane (drawn by dev-paper-notes.ts).
//
// Each note starts a section of the paper at an anchor from
// scripts/paper-anchors.json and runs until the next note's anchor. A note says
// what that stretch of the paper is *for*: the point Greco is making there, in
// one plain sentence or two, not a summary of every line.
//
// `role` is the move the passage makes in the argument. Objections share one
// color so pushback is recognisable at a glance; every other section takes the
// next color in the rotation, so neighbouring sections never match.

export type PaperNote = { id: string; role: string; title: string; idea: string };

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
    id: 'aim-motivations', role: 'Roadmap', title: 'Three jobs for the chapter',
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
    id: 'paper-belief-at-the-base', role: 'Route 3, again', title: 'Same trick with belief',
    idea: 'Make every belief foundational (Harman) and let belief depend on context (Clarke): flexible again, from premises that aren’t outlandish.',
  },
  {
    id: 'versions-map-heading', role: 'Version', title: 'Easiest build: sensitive invariantism',
    idea: 'What is foundational depends on extra facts about the believer: her community’s norms (Annis) or the inquiry she is in (hinges).',
  },
  {
    id: 'ctx-heading', role: 'Version', title: 'Contextualist build: trickier',
    idea: '“Foundationally justified” is jargon, so ordinary usage can’t test it directly. Everyday talk (“Oh, come on”) still shows what we treat as foundational.',
  },
  {
    id: 'paper-alternative-views', role: OBJECTION_ROLE, title: 'What if the community is wrong?',
    idea: 'Like “right means what my society approves”, Annis’s view can’t call a community that accepts astrology mistaken.',
  },
  {
    id: 'paper-contextualist-reply', role: 'Reply', title: 'Speak from your own standards',
    idea: 'Calling a belief foundational states my own commitment, so I can say: “They treat it as foundational, but they’re wrong.”',
  },
  {
    id: 'disagree-heading', role: OBJECTION_ROLE, title: 'Then nobody really disagrees',
    idea: 'If each of us only reports our own norms, “it is” and “it isn’t” can both be true, as with “I’m hungry”. Greco leaves this fight to the knowledge debate.',
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
    idea: 'Smithies: justification rests on mental states we can always introspect, a realm where nothing is hidden. That is Descartes again.',
  },
  {
    id: 'home-heading', role: 'Key move', title: 'No fixed home, a mobile one',
    idea: 'No realm is always transparent. But each context treats some facts as knowable; raise a doubt and the home moves.',
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
