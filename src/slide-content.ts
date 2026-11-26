import { castIds } from './cast-ids';
import { pairingView, versionPairings } from './version-pairings';

import { inkPassages, legendSlides, type InkOceanScene } from './ink-ocean-scenes';

export { legendSlides };
export const legendById = new Map<string, InkOceanScene>(legendSlides.map(scene => [scene.id, scene]));

export const slides = [
  { title: 'Unitrans arrival', description: 'Arriving at UC Davis for lecture', members: ['unitrans-arrival'] },
  { title: 'Before lecture', description: 'You take your seat in Giedt Hall and open your notebook.', members: ['before-lecture'] },
  { title: 'Contemporary Contextualism', description: 'The same sentence can express different claims in different contexts.', members: ['contemporary-heading', 'state-red'] },
  ...legendSlides.map(({ id, title, takeaway }) => {
    const passages = inkPassages.get(id);
    return {
      title, description: takeaway,
      ...(passages
        ? { members: [id, ...passages] as const, frameMembers: [id] as const }
        : { members: [id] as const }),
    };
  }),
  { title: 'The Foundationalist’s Dilemma', description: 'What makes a belief fit to end a chain of reasons?', members: ['dilemma-heading', 'dilemma-cartesian', 'dilemma-moderate'] },
  { title: 'Undoubted, Not Undoubtable', description: 'Keep Descartes’s insight about doubt, but apply it locally', members: ['undoubted-heading', 'undoubted-crystal'] },
  { title: 'Route 1: Justification as a Social Activity', description: 'We justify to an audience, and audiences differ', members: ['route-social-heading', 'route-social-scene'] },
  { title: 'Route 2: Hinges', description: 'Asking one question means holding others fixed', members: ['route-hinges-heading', 'route-hinges-door'] },
  { title: 'Route 3: Knowledge or Belief at the Base', description: 'Two familiar views turn flexible “without trying”', members: ['route-knowledge-heading', 'route-knowledge-scene'] },
  { title: 'Routes and Versions', description: 'How the routes from §2 connect to four views of foundational justification', members: ['versions-map-heading', ...castIds] },
  { title: 'Routes × versions', description: 'See which routes go with each version', paperAnchor: 'versions-map-heading', members: ['pairings-heading'], frameMembers: ['pairings-heading', ...versionPairings.map(pairing => pairing.id)] },
  ...versionPairings.map(pairing => ({
    title: `${pairing.route} × ${pairingView(pairing)}`,
    description: pairing.summary,
    paperAnchor: pairing.paperAnchor,
    members: [pairing.id] as const,
  })),
  { title: 'Access internalism', description: 'First-order justification guarantees higher-order justification', paperAnchor: 'paper-access-principle', members: ['access-heading', 'access-principle', 'access-doubt'] },
  { title: 'Supervenience base', description: 'What fixes Justine’s first-order justification?', paperAnchor: 'paper-party-example', members: ['home-heading', 'home-weather'], frameMembers: ['home-heading', 'home-weather', 'access-principle'] },
  { title: 'Flexible foundationalism and Access', description: 'Which facts fix Justine’s grounds can shift with the context', paperAnchor: 'paper-context-shift', members: ['mobile-heading', 'mobile-scene'], frameMembers: ['mobile-heading', 'mobile-scene', 'home-heading', 'home-weather'] },
  { title: 'Flexible Foundationalism', description: 'Justified beliefs rest on foundations that vary with context', members: ['flexible-heading', 'foundation-left'] },
  { title: 'Why Accept It?', description: 'Motivations for flexible foundationalism', members: ['aim-motivations'] },
  { title: 'Different Versions', description: 'Four ways context can shape foundational justification', members: ['aim-versions'] },
  { title: 'Applications', description: 'How flexible foundations can explain access to our own grounds', members: ['aim-applications'], frameMembers: ['access-heading', 'access-principle', 'access-doubt', 'home-heading', 'home-weather', 'mobile-heading', 'mobile-scene'] },
] as const;
