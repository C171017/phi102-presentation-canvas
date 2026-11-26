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
    summary: 'On Annis’s view, a person’s community helps determine which beliefs they may take for granted. Could a whole community be mistaken in accepting astrology without question?' },
  { id: 'pairing-social-cole', route: social, character: 'cole', words: 736, pages: '430–431', paperAnchor: 'ctx-heading',
    summary: 'A speaker’s community can affect what they mean by calling a belief foundational. If two speakers each report their own commitments, can they genuinely disagree?' },
  { id: 'pairing-hinges-simone', route: hinges, character: 'simone', words: 93, pages: '430', paperAnchor: 'hinges-si-heading',
    summary: 'Which beliefs a person may take for granted depends on their inquiry. A speaker’s grasp of English can be assumed in a color inquiry and tested in a language exam.' },
  { id: 'pairing-hinges-cole', route: hinges, character: 'cole', words: 191, pages: '430', paperAnchor: 'hinges-ctx-heading',
    summary: 'On the contextualist hinge view, the speaker’s inquiry helps determine what they mean when they call a belief foundationally justified.' },
  { id: 'pairing-knowledge-simone', route: knowledge, character: 'simone', words: 25, pages: '429', paperAnchor: 'paper-flexible-knowledge',
    summary: 'If knowledge is evidence, changes in a person’s practical situation can change what they know and therefore what evidence they have.' },
  { id: 'pairing-knowledge-cole', route: knowledge, character: 'cole', words: 25, pages: '429', paperAnchor: 'paper-flexible-knowledge',
    summary: 'If knowledge supplies the foundations, a change in the speaker’s context can change what they claim about someone’s evidence.' },
  { id: 'pairing-knowledge-rae', route: knowledge, character: 'rae', words: 57, pages: '429, 431', paperAnchor: 'paper-flexible-knowledge',
    summary: 'If knowledge supplies the foundations, whether a claim about someone’s evidence is true can depend on the assessor’s context. This offers one way to understand disagreement.' },
  { id: 'pairing-knowledge-echo', route: knowledge, character: 'echo', words: 31, pages: '431', paperAnchor: 'paper-disagreement-responses',
    summary: 'When knowledge supplies the foundations, an expressivist account of knowledge can extend to foundational justification. Calling a belief basic can express a willingness to accept it as a reason.' },
  { id: 'pairing-belief', route: belief, alternative: 'Sensitivism about belief', words: 237, pages: '429', paperAnchor: 'paper-belief-at-the-base',
    summary: 'Harman treats every belief as foundational. On Clarke’s account, what a person believes can vary with their task or situation, so the foundations can vary too.' },
];

export function pairingView(pairing: Pairing) {
  return pairing.character ? cast[pairing.character].view : pairing.alternative!;
}

