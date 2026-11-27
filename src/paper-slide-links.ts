import './paper-slide-links.css';

export type PaperSlideLink = {
  label: string;
  id: string;
};

function cite(label: string, id: string): PaperSlideLink {
  return { label, id };
}

// The exact passages for these links are defined in scripts/paper-citations.json.
// Reuse a passage wherever different slides explain or dramatize the same point.
const regress = cite('The regress of reasons', 'the-regress-of-reasons');
const skepticism = cite('Skepticism', 'skepticism');
const infinitism = cite('Infinitism', 'infinitism');
const coherentism = cite('Coherentism', 'coherentism');
const foundations = cite('Where the chain stops', 'where-the-chain-stops');
const regressObjections = cite('Problems with the four answers', 'problems-with-the-four-answers');
const descartes = cite('Indubitable foundations', 'indubitable-foundations');
const doubtedReason = cite('How a premise settles doubt', 'how-a-premise-settles-doubt');
const scarcity = cite('Too few indubitable claims', 'too-few-indubitable-claims');
const moderate = cite('Perception and intuition', 'perception-and-intuition');
const localDoubt = cite('Freedom from doubt in context', 'freedom-from-doubt-in-context');
const hinges = cite('What inquiry takes for granted', 'what-inquiry-takes-for-granted');
const colour = cite('Wittgenstein’s colour example', 'wittgensteins-colour-example');
const varyingHinges = cite('How hinges can vary', 'how-hinges-can-vary');
const subjectsHinges = cite('The subject’s inquiry', 'the-subjects-inquiry');
const flexibleKnowledge = cite('Flexible knowledge, flexible foundations', 'flexible-knowledge-flexible-foundations');
const flexibleBelief = cite('Belief at the base', 'belief-at-the-base');
const versions = cite('The four versions', 'the-four-versions');
const disagreement = cite('Relativism and expressivism', 'relativism-and-expressivism');
const access = cite('The Access principle', 'the-access-principle');
const contextShift = cite('When Peter might have mumbled', 'when-peter-might-have-mumbled');

type InlinePaperLink = { after: string; reference: PaperSlideLink };
type SlidePaperLinks = { title: PaperSlideLink; inline?: readonly InlinePaperLink[] };

function beside(after: string, reference: PaperSlideLink): InlinePaperLink {
  return { after, reference };
}

const undoubted = cite('Must be undoubted', 'must-be-undoubted');
const definition = cite('Flexible foundationalism', 'flexible-foundationalism');
const context = cite('Contextualism about knowledge', 'contextualism-about-knowledge');
const colourMemory = cite('Taking memory for granted', 'taking-memory-for-granted');
const inquiry = cite('Assumptions that make inquiry possible', 'assumptions-that-make-inquiry-possible');
const hingesArgument = cite('The argument from inquiry', 'the-argument-from-inquiry');
const stoppingPoint = cite('What makes a stopping point legitimate?', 'what-makes-a-stopping-point-legitimate');
const moderateDefinition = cite('Moderate foundationalism', 'moderate-foundationalism');
const cognitiveHome = cite('A cognitive home that can shift', 'a-cognitive-home-that-can-shift');
const practicalStakes = cite('The subject’s practical situation', 'the-subjects-practical-situation');
const differentPropositions = cite('Different propositions', 'different-propositions');

export const slidePaperLinks: Record<string, SlidePaperLinks> = {
  'contemporary-heading': {
    title: cite('What a sentence expresses', 'what-a-sentence-expresses'),
    inline: [beside('claims can depend on the conversation', context)],
  },
  L0: {
    title: localDoubt,
    inline: [beside('normal conversation', context), beside('which beliefs can serve as foundations', definition)],
  },
  L2: {
    title: regress,
    inline: [beside('trust the forecast', stoppingPoint), beside('leads to a regress', regress)],
  },
  'L3-continued': { title: descartes },
  L4: {
    title: cite('Skepticism, infinitism, and coherentism', 'three-answers-to-the-regress'),
    inline: [
      beside('skepticism holds', skepticism),
      beside('infinitism accepts', infinitism),
      beside('coherentism finds', coherentism),
    ],
  },
  'regress-skepticism': {
    title: skepticism,
    inline: [beside('ordinary beliefs seem justified', regressObjections)],
  },
  'regress-infinitism': {
    title: infinitism,
    inline: [beside('finite time to give reasons', cite('Why we cannot give reasons forever', 'why-we-cannot-give-reasons-forever'))],
  },
  'regress-coherentism': {
    title: coherentism,
    inline: [
      beside('back to an earlier belief', coherentism),
      beside('arguing in a circle is unconvincing', cite('Circular arguments in practice', 'circular-arguments-in-practice')),
    ],
  },
  'regress-foundationalism': {
    title: foundations,
    inline: [beside('justify other beliefs without borrowing', stoppingPoint)],
  },
  'L6-A': {
    title: descartes,
    inline: [
      beside('premise can settle a doubt', doubtedReason),
      beside('too few beliefs', scarcity),
    ],
  },
  'L6-B': {
    title: moderateDefinition,
    inline: [
      beside('ordinary perceptual beliefs', moderate),
      beside('perceptual belief can resolve a doubt', cite('Can a doubted belief resolve doubt?', 'can-a-doubted-belief-resolve-doubt')),
    ],
  },
  L7: {
    title: undoubted,
    inline: [beside('a premise can support a conclusion', doubtedReason), beside('absolute certainty', localDoubt)],
  },
  'P2-1': { title: hinges },
  'P2-2a': { title: colour, inline: [beside('my own memory', colourMemory)] },
  'P2-2b': { title: inquiry },
  'P2-2c': { title: colour, inline: [beside('lighting distorts the color', varyingHinges)] },
  'P2-3': { title: colourMemory, inline: [beside('doubt my recollection', varyingHinges)] },
  'P2-4': { title: cite('What makes testing possible', 'what-makes-testing-possible') },
  'P2-5': { title: hingesArgument },
  'P2-6': {
    title: varyingHinges,
    inline: [beside('asking about a color', colour), beside('language exam', subjectsHinges)],
  },
  'P2-7': {
    title: cite('Sensitive invariantism about foundations', 'hinge-sensitive-invariantism'),
    inline: [beside('their inquiry requires it', subjectsHinges)],
  },
  'dilemma-heading': { title: cite('The foundationalist’s dilemma', 'the-foundationalists-dilemma') },
  'undoubted-heading': { title: undoubted },
  'route-social-heading': { title: cite('Justification as an activity', 'justification-as-an-activity') },
  'route-hinges-heading': { title: hinges },
  'route-knowledge-heading': {
    title: cite('Knowledge or belief at the base', 'knowledge-or-belief-at-the-base'),
    inline: [beside('without trying', flexibleKnowledge)],
  },
  'versions-map-heading': { title: versions },
  'pairings-heading': { title: cite('How the routes connect to the versions', 'routes-and-versions') },
  'pairing-social-simone': {
    title: cite('The believer’s community', 'the-believers-community'),
    inline: [beside('accepting astrology', cite('The astrology objection', 'the-astrology-objection'))],
  },
  'pairing-social-cole': {
    title: cite('The speaker’s community', 'the-speakers-community'),
    inline: [beside('genuinely disagree', cite('The disagreement problem', 'the-disagreement-problem'))],
  },
  'pairing-hinges-simone': { title: subjectsHinges },
  'pairing-hinges-cole': { title: cite('The speaker’s inquiry', 'the-speakers-inquiry') },
  'pairing-knowledge-simone': { title: flexibleKnowledge, inline: [beside('practical situation', practicalStakes)] },
  'pairing-knowledge-cole': { title: flexibleKnowledge, inline: [beside('speaker’s context', differentPropositions)] },
  'pairing-knowledge-rae': { title: disagreement, inline: [beside('knowledge supplies the foundations', flexibleKnowledge)] },
  'pairing-knowledge-echo': { title: disagreement },
  'pairing-belief': {
    title: cite('Sensitivism about belief', 'sensitivism-about-belief'),
    inline: [beside('harman treats every belief', flexibleBelief)],
  },
  'access-heading': { title: access },
  'home-heading': { title: cite('What facts fix justification?', 'what-facts-fix-justification') },
  'mobile-heading': {
    title: cite('How flexible foundationalism explains Access', 'flexible-foundationalism-and-access'),
    inline: [beside('justine’s grounds', contextShift), beside('can shift', cognitiveHome)],
  },
  'flexible-heading': { title: definition },
  'aim-motivations': { title: cite('Greco’s first aim', 'grecos-first-aim') },
  'aim-versions': { title: cite('Greco’s second aim', 'grecos-second-aim') },
  'aim-applications': { title: cite('Greco’s third aim', 'grecos-third-aim') },
};

export class OpenPaperReference extends Event {
  static readonly type = 'open-paper-reference';
  constructor(readonly reference: PaperSlideLink, readonly source: HTMLButtonElement) {
    super(OpenPaperReference.type, { bubbles: true });
  }
}

export function renderPaperLink(reference: PaperSlideLink, title = false) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'slide-paper-link';
  button.dataset.paperCitation = reference.id;
  if (title) button.dataset.titleCitation = '';
  button.setAttribute('aria-controls', 'paper-pane');
  const label = 'Go to Greco’s paper · ' + reference.label;
  button.setAttribute('aria-label', label);
  button.title = label;
  button.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 1.75H4a1 1 0 0 0-1 1v10.5a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-8L9.5 1.75z"/><path d="M9.5 1.75v3.5H13M5.5 8.25h5m-5 2.5h3.5"/></svg>';
  button.addEventListener('click', () => button.dispatchEvent(new OpenPaperReference(reference, button)));
  return button;
}
