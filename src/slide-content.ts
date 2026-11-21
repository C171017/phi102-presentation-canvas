import { castIds } from './cast-ids';
import { pairingView, versionPairings } from './version-pairings';

export const slides = [
  { title: 'Contemporary Contextualism', description: 'The same sentence can express different claims in different contexts', members: ['contemporary-heading', 'state-red'] },
  { title: 'Flexible Foundationalism', description: 'Justified beliefs rest on foundations that vary with context', members: ['flexible-heading', 'foundation-left'] },
  { title: 'Why Accept It?', description: 'Motivations for flexible foundationalism', members: ['aim-motivations'] },
  { title: 'Different Versions', description: 'Four ways context can shape foundational justification', members: ['aim-versions'] },
  { title: 'Applications', description: 'How flexible foundations can explain access to our own grounds', members: ['aim-applications'], frameMembers: ['access-heading', 'access-principle', 'access-doubt', 'home-heading', 'home-weather', 'mobile-heading', 'mobile-scene'] },
  { title: 'The Regress Problem', description: 'Where can a chain of reasons reasonably stop?', members: [
    'regress-problem', 'regress-skepticism', 'regress-infinitism', 'regress-coherentism', 'regress-foundationalism',
  ] },
  { title: 'The Foundationalist’s Dilemma', description: 'What makes a belief fit to end a chain of reasons?', members: ['dilemma-heading', 'dilemma-cartesian', 'dilemma-moderate'] },
  { title: 'Undoubted, Not Undoubtable', description: 'Keep Descartes’s insight about doubt, but apply it locally', members: ['undoubted-heading', 'undoubted-crystal'] },
  { title: 'Route 1: Justification as a Social Activity', description: 'We justify to an audience, and audiences differ', members: ['route-social-heading', 'route-social-scene', 'route-social-consensus'] },
  { title: 'Route 2: Hinges', description: 'Asking one question means holding others fixed', members: ['route-hinges-heading', 'route-hinges-door'] },
  { title: 'Route 3: Knowledge or Belief at the Base', description: 'Two familiar views turn flexible “without trying”', members: ['route-knowledge-heading', 'route-knowledge-scene', 'route-knowledge-evan'] },
  { title: 'Routes and Versions', description: 'How the routes from §2 connect to four views of foundational justification', members: ['versions-map-heading', ...castIds] },
  { title: 'Routes × versions', description: 'Compare the pairings by the space Greco gives them', paperAnchor: 'versions-map-heading', members: ['pairings-heading'], frameMembers: ['pairings-heading', ...versionPairings.map(pairing => pairing.id)] },
  ...versionPairings.map(pairing => ({
    title: `${pairing.route} × ${pairingView(pairing)}`,
    description: pairing.summary,
    paperAnchor: pairing.paperAnchor,
    members: [pairing.id] as const,
  })),
  { title: 'Access internalism', description: 'First-order justification guarantees higher-order justification', paperAnchor: 'paper-access-principle', members: ['access-heading', 'access-principle', 'access-doubt'] },
  { title: 'Supervenience base', description: 'What fixes Justine’s first-order justification?', paperAnchor: 'paper-party-example', members: ['home-heading', 'home-weather'], frameMembers: ['home-heading', 'home-weather', 'access-principle'] },
  { title: 'Flexible foundationalism and Access', description: 'Which facts fix Justine’s grounds can shift with the context', paperAnchor: 'paper-context-shift', members: ['mobile-heading', 'mobile-scene'], frameMembers: ['mobile-heading', 'mobile-scene', 'home-heading', 'home-weather'] },
] as const;
