export const cast = {
  simone: { name: 'Simone', view: 'Sensitive invariantism', color: '#315d53' },
  cole: { name: 'Cole', view: 'Contextualism', color: '#8c4230' },
  rae: { name: 'Rae', view: 'Relativism', color: '#36587d' },
  echo: { name: 'Echo', view: 'Expressivism', color: '#714d81' },
};

const social = 'Social norms';
const hinges = 'Hinges';
const knowledge = 'Knowledge at the base';
const belief = 'Belief at the base';

export const pairingRouteAnchors = {
  [social]: 'route-social-scene',
  [hinges]: 'route-hinges-door',
  [knowledge]: 'route-knowledge-evidence',
  [belief]: 'route-knowledge-evidence',
};

type Pairing = {
  id: `pairing-${string}`;
  route: keyof typeof pairingRouteAnchors;
  character?: keyof typeof cast;
  alternative?: string;
  summary: string;
  paperAnchor: string;
  pages: string;
  words: number;
};

// Approximate words in the relevant body passages. Split §2.3's shared
// knowledge paragraph three ways, the shared contextualist evidence two
// ways, and §3's short discussion of the two replies to disagreement two ways.
// Social Simone includes the astrology objection. Social Cole includes the
// speaker-commitment proposal and the paragraph that motivates disagreement.
export const versionPairings: readonly Pairing[] = [
  { id: 'pairing-social-simone', route: social, character: 'simone', words: 187, pages: '429–430', paperAnchor: 'si-heading',
    summary: 'What Simone may take for granted depends partly on what her own community would challenge. Greco tests this with a community that accepts astrology.' },
  { id: 'pairing-social-cole', route: social, character: 'cole', words: 736, pages: '430–431', paperAnchor: 'ctx-heading',
    summary: 'Cole’s community can change what his words claim. Greco also considers a version where Cole reports his own commitment, raising the question of how two speakers can genuinely disagree.' },
  { id: 'pairing-hinges-simone', route: hinges, character: 'simone', words: 93, pages: '430', paperAnchor: 'hinges-si-heading',
    summary: 'What Simone can take for granted depends on her inquiry. A witness’s English can be a hinge in a color inquiry and the question itself in a language test.' },
  { id: 'pairing-hinges-cole', route: hinges, character: 'cole', words: 191, pages: '430', paperAnchor: 'hinges-ctx-heading',
    summary: 'Which inquiry Cole is pursuing helps determine which claim he makes when he calls a belief foundational.' },
  { id: 'pairing-knowledge-simone', route: knowledge, character: 'simone', words: 25, pages: '429', paperAnchor: 'paper-flexible-knowledge',
    summary: 'If knowledge is evidence, Simone’s situation can change what she knows and thus what evidence she has.' },
  { id: 'pairing-knowledge-cole', route: knowledge, character: 'cole', words: 25, pages: '429', paperAnchor: 'paper-flexible-knowledge',
    summary: 'If knowledge supplies the foundations, what Cole claims about those foundations can vary with his context as speaker.' },
  { id: 'pairing-knowledge-rae', route: knowledge, character: 'rae', words: 57, pages: '429, 431', paperAnchor: 'paper-flexible-knowledge',
    summary: 'If knowledge supplies the foundations, the truth of a claim about them can depend on Rae’s context as assessor. Greco revisits relativism when discussing disagreement.' },
  { id: 'pairing-knowledge-echo', route: knowledge, character: 'echo', words: 31, pages: '431', paperAnchor: 'paper-disagreement-responses',
    summary: 'Greco suggests that some expressivist views about knowledge carry over to foundations. Echo shows the commitment involved in taking a belief for granted.' },
  { id: 'pairing-belief', route: belief, alternative: 'Sensitivism about belief', words: 237, pages: '429', paperAnchor: 'paper-belief-at-the-base',
    summary: 'Harman treats every belief as foundational. On Clarke’s account, what a person believes can vary with their task or situation, so the foundations can vary too.' },
];

export function pairingView(pairing: Pairing) {
  return pairing.character ? cast[pairing.character].view : pairing.alternative!;
}

