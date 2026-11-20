import type { PaperAnchor } from './paper-notes';
import type { HarborView } from './signal-harbor';
import type { slides } from './slide-content';

type CanvasId = (typeof slides)[number]['members'][number];
export type GlossaryVisual = CanvasId | { id: 'versions-map-scene'; harborView: HarborView };

const visualByTerm: Partial<Record<string, GlossaryVisual>> = {
  contextualism: 'state-red',
  proposition: 'state-red',
  semantics: 'state-red',
  foundationalism: 'regress-foundationalism',
  coherentism: 'regress-coherentism',
  'flexible-foundationalism': 'foundation-left',
  'sensitive-invariantism': { id: 'versions-map-scene', harborView: 'sensitive-invariantism' },
  relativism: { id: 'versions-map-scene', harborView: 'relativism' },
  expressivism: { id: 'versions-map-scene', harborView: 'expressivism' },
  'regress-problem': 'regress-problem',
  taxonomy: 'regress-problem',
  skepticism: 'regress-skepticism',
  infinitism: 'regress-infinitism',
  'circular-reasoning': 'regress-coherentism',
  'chain-of-reasons': 'regress-foundationalism',
  'regress-stopper': 'undoubted-crystal',
  'foundational-justification': 'undoubted-crystal',
  'cartesian-foundationalism': 'dilemma-cartesian',
  indubitable: 'dilemma-cartesian',
  undoubted: 'undoubted-crystal',
  'moderate-foundationalism': 'dilemma-moderate',
  'activity-of-justification': 'route-social-scene',
  'objector-group': 'route-social-scene',
  'epistemic-norm': 'route-social-scene',
  'epistemic-community': 'route-social-scene',
  hinge: 'route-hinges-door',
  inquiry: 'route-hinges-door',
  'knowledge-is-evidence': 'route-knowledge-scene',
  'general-foundations': 'route-knowledge-scene',
  sensitivism: 'route-knowledge-scene',
  'practical-stakes': { id: 'versions-map-scene', harborView: 'sensitive-invariantism' },
  'conversational-context': { id: 'versions-map-scene', harborView: 'contextualism' },
  'contextual-factors': 'versions-map-scene',
  'linguistic-data': 'ctx-evidence',
  'speaker-relativism': 'ctx-criticism',
  'problem-of-disagreement': 'disagree-scene',
  'access-internalism': 'access-principle',
  access: 'access-principle',
  'higher-order': 'access-doubt',
  'first-order': 'access-principle',
  supervenience: 'home-weather',
  'supervenience-base': 'home-weather',
  'local-base': 'home-weather',
  'global-base': 'mobile-scene',
  presupposition: 'home-weather',
  'relevant-possibilities': 'mobile-scene',
  'epistemic-access': 'mobile-scene',
  introspection: 'home-weather',
  'cognitive-home': 'home-weather',
  'mobile-home': 'mobile-scene',
};

// The same term can refer to a different example later in the chapter.
const passages: { start: string; end: string; terms: string[]; visual: GlossaryVisual }[] = [
  { start: 'paper-social-objection', end: 'route-hinges-heading', terms: ['objector-group', 'subjectivism', 'epistemic-norm', 'foundational-justification'], visual: 'si-worry' },
  { start: 'si-heading', end: 'hinges-si-heading', terms: ['sensitive-invariantism', 'epistemic-norm', 'epistemic-community', 'foundational-justification'], visual: 'si-scene' },
  { start: 'hinges-si-heading', end: 'ctx-heading', terms: ['sensitive-invariantism', 'hinge', 'inquiry', 'foundational-justification'], visual: 'hinges-si-scene' },
  { start: 'ctx-heading', end: 'hinges-ctx-heading', terms: ['contextualism', 'epistemic-community', 'foundational-justification'], visual: 'ctx-criticism' },
  { start: 'hinges-ctx-heading', end: 'paper-contextual-evidence', terms: ['contextualism', 'hinge', 'inquiry', 'foundational-justification'], visual: 'hinges-ctx-scene' },
  { start: 'paper-contextual-evidence', end: 'paper-alternative-views', terms: ['inference', 'felicity', 'foundational-justification'], visual: 'ctx-evidence' },
  { start: 'paper-alternative-views', end: 'paper-contextualist-reply', terms: ['sensitive-invariantism', 'epistemic-norm', 'epistemic-community'], visual: 'si-worry' },
  { start: 'paper-contextualist-reply', end: 'disagree-heading', terms: ['contextualism', 'foundational-justification'], visual: 'ctx-criticism' },
  { start: 'disagree-heading', end: 'paper-disagreement-responses', terms: ['subjectivism', 'foundational-justification'], visual: 'disagree-scene' },
  { start: 'paper-mobile-home', end: 'paper-notes', terms: ['cognitive-home'], visual: 'mobile-scene' },
];

type PaperPosition = { page: number; x: number; y: number };

function follows(position: PaperPosition, anchor: PaperAnchor) {
  if (position.page !== anchor.page) return position.page > anchor.page;
  if (position.y < anchor.y) return false;
  return !anchor.split || position.y >= anchor.split.bottom || position.x >= anchor.split.x;
}

export function glossaryVisual(term: string, position: PaperPosition, anchors: Record<string, PaperAnchor>): GlossaryVisual | undefined {
  const passage = passages.find(({ start, end, terms }) =>
    terms.includes(term) && anchors[start] && anchors[end] &&
    follows(position, anchors[start]) && !follows(position, anchors[end]));
  return passage?.visual ?? visualByTerm[term];
}
