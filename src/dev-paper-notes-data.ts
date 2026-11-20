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
export type PaperNote = { id: string; hue?: { ink: string; tint: string } } & (
  (PaperCard & { also?: PaperCard[] }) | { cards: [] }
);

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
    id: 'paper-belief-at-the-base', role: 'Route 3, again', title: 'Same trick with belief',
    idea: 'Make every belief foundational (Harman) and let belief depend on context (Clarke): flexible again, from premises that aren’t outlandish.',
  },
  { id: 'versions-map-heading', cards: [] },
  {
    id: 'si-heading', role: 'Believer’s community', title: 'Social norms × Sensitive invariantism',
    idea: 'The attribution makes a fixed claim. The believer’s community helps determine whether that claim is true.',
    hue: { ink: '#227167', tint: '#e1f1e9' },
  },
  {
    id: 'hinges-si-heading', role: 'Believer’s inquiry', title: 'Hinges × Sensitive invariantism',
    idea: 'Whether a belief is foundational depends in part on what the believer must take for granted to pursue her inquiry.',
    hue: { ink: '#286954', tint: '#d2ebdd' },
  },
  {
    id: 'ctx-heading', role: 'Speaker’s community', title: 'Social norms × Contextualism',
    idea: 'The norms of the speaker’s community help determine which claim the speaker makes.',
    hue: { ink: '#8c5233', tint: '#faecd9' },
  },
  {
    id: 'hinges-ctx-heading', role: 'Speaker’s inquiry', title: 'Hinges × Contextualism',
    idea: 'The speaker’s inquiry helps determine what she claims. Greco then looks to ordinary speech for clues about what speakers take for granted.',
    hue: { ink: '#944c37', tint: '#f8e0d4' },
  },
  {
    id: 'paper-alternative-views', role: OBJECTION_ROLE, title: 'Social norms × Sensitive invariantism',
    idea: 'A whole community might accept astrology without objection. Could its standards for what counts as foundational still be wrong?',
  },
  {
    id: 'paper-contextualist-reply', role: 'Speaker’s own standards', title: 'Social norms × Contextualism',
    idea: 'In a further contextualist version, the speaker reports her own commitment. She can criticize the community, but speakers with opposing standards can both speak truly.',
  },
  {
    id: 'paper-disagreement-responses', role: 'Response to disagreement', title: 'Knowledge at the base × Relativism',
    idea: 'The assessor’s standards may determine how a claim about knowledge or foundational justification is evaluated.',
    also: [{
      role: 'Response to disagreement', title: 'Knowledge at the base × Expressivism',
      idea: 'Claims about knowledge or foundational justification may express commitments that can clash.',
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
