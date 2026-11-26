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
const knowledge = cite('Knowledge as evidence', 'knowledge-as-evidence');
const flexibleKnowledge = cite('Flexible knowledge, flexible foundations', 'flexible-knowledge-flexible-foundations');
const flexibleBelief = cite('Belief at the base', 'belief-at-the-base');
const versions = cite('The four versions', 'the-four-versions');
const disagreement = cite('Relativism and expressivism', 'relativism-and-expressivism');
const access = cite('The Access principle', 'the-access-principle');
const justine = cite('Justine’s grounds for belief', 'justines-grounds-for-belief');
const contextShift = cite('When Peter might have mumbled', 'when-peter-might-have-mumbled');

export const slidePaperLinks: Record<string, readonly PaperSlideLink[]> = {
  'contemporary-heading': [
    cite('What a sentence expresses', 'what-a-sentence-expresses'),
    cite('Contextualism about knowledge', 'contextualism-about-knowledge'),
    cite('Flexible foundationalism', 'flexible-foundationalism'),
  ],
  L2: [regress, doubtedReason],
  'L3-continued': [descartes],
  L4: [skepticism, infinitism, coherentism],
  'regress-skepticism': [skepticism, regressObjections],
  'regress-infinitism': [infinitism, cite('Why we cannot give reasons forever', 'why-we-cannot-give-reasons-forever')],
  'regress-coherentism': [coherentism, regressObjections, cite('Circular arguments in practice', 'circular-arguments-in-practice')],
  'regress-foundationalism': [foundations, cite('What makes a stopping point legitimate?', 'what-makes-a-stopping-point-legitimate')],
  'L6-A': [descartes, doubtedReason, scarcity],
  'L6-B': [moderate, cite('Can a doubted belief resolve doubt?', 'can-a-doubted-belief-resolve-doubt')],
  L7: [localDoubt, doubtedReason],
  'P2-1': [hinges],
  'P2-2a': [colour],
  'P2-2b': [cite('Assumptions that make inquiry possible', 'assumptions-that-make-inquiry-possible')],
  'P2-2c': [colour, varyingHinges],
  'P2-3': [cite('Taking memory for granted', 'taking-memory-for-granted'), varyingHinges],
  'P2-4': [hinges, cite('What makes testing possible', 'what-makes-testing-possible')],
  'P2-5': [cite('The argument from inquiry', 'the-argument-from-inquiry')],
  'P2-6': [varyingHinges, colour, subjectsHinges],
  'P2-7': [subjectsHinges],
  'dilemma-heading': [descartes, scarcity, moderate, cite('The foundationalist’s dilemma', 'the-foundationalists-dilemma')],
  'undoubted-heading': [localDoubt],
  'route-social-heading': [
    cite('Justification as an activity', 'justification-as-an-activity'),
    cite('Annis’s appropriate objectors', 'anniss-appropriate-objectors'),
    cite('Can the whole community be wrong?', 'can-the-whole-community-be-wrong'),
  ],
  'route-hinges-heading': [hinges, colour, varyingHinges],
  'route-knowledge-heading': [knowledge, flexibleKnowledge, flexibleBelief],
  'versions-map-heading': [versions, cite('Sensitive invariantism', 'sensitive-invariantism'), cite('Contextualism', 'contextualism'), disagreement],
  'pairings-heading': [cite('Flexible audiences', 'flexible-audiences'), varyingHinges, flexibleKnowledge, flexibleBelief, versions],
  'pairing-social-simone': [cite('The believer’s community', 'the-believers-community'), cite('The astrology objection', 'the-astrology-objection')],
  'pairing-social-cole': [
    cite('The speaker’s community', 'the-speakers-community'),
    cite('The speaker’s own commitments', 'the-speakers-own-commitments'),
    cite('The disagreement problem', 'the-disagreement-problem'),
  ],
  'pairing-hinges-simone': [subjectsHinges],
  'pairing-hinges-cole': [cite('The speaker’s inquiry', 'the-speakers-inquiry')],
  'pairing-knowledge-simone': [flexibleKnowledge, cite('The subject’s practical situation', 'the-subjects-practical-situation')],
  'pairing-knowledge-cole': [flexibleKnowledge, cite('Different propositions', 'different-propositions')],
  'pairing-knowledge-rae': [flexibleKnowledge, disagreement],
  'pairing-knowledge-echo': [disagreement],
  'pairing-belief': [flexibleBelief, cite('Sensitivism about belief', 'sensitivism-about-belief')],
  'access-heading': [access, cite('Doubt about one’s evidence', 'doubt-about-ones-evidence')],
  'home-heading': [justine, cite('What facts fix justification?', 'what-facts-fix-justification')],
  'mobile-heading': [contextShift, cite('A cognitive home that can shift', 'a-cognitive-home-that-can-shift')],
  'flexible-heading': [cite('The definition', 'the-definition'), localDoubt],
  'aim-motivations': [cite('Greco’s first aim', 'grecos-first-aim'), regress],
  'aim-versions': [cite('Greco’s second aim', 'grecos-second-aim'), versions],
  'aim-applications': [cite('Greco’s third aim', 'grecos-third-aim'), access, contextShift],
};

export class OpenPaperReference extends Event {
  static readonly type = 'open-paper-reference';
  constructor(readonly reference: PaperSlideLink, readonly source: HTMLButtonElement) {
    super(OpenPaperReference.type, { bubbles: true });
  }
}

export function renderPaperSlideLinks(key: string) {
  const references = slidePaperLinks[key];
  if (!references?.length) return;
  const links = document.createElement('nav');
  links.className = 'slide-paper-links';
  links.setAttribute('aria-label', 'Passages in Greco’s paper');
  const label = document.createElement('span');
  label.className = 'slide-paper-links-label';
  label.textContent = 'In the paper';
  links.append(label);
  for (const reference of references) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = reference.label;
    button.setAttribute('aria-controls', 'paper-pane');
    button.addEventListener('click', () => button.dispatchEvent(new OpenPaperReference(reference, button)));
    links.append(button);
  }
  return links;
}
