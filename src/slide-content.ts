import { castIds } from './cast-ids';
import { pairingView, versionPairings } from './version-pairings';

export const regressFlashback = [
  { id: 'regress-problem', title: 'The Regress Problem', description: 'Every reason invites another “why?”', dialogue: [
    { speaker: 'Narrator', text: 'Long ago, people told stories about a creature called YYYY SOWATT.' },
    { speaker: 'Archive keeper', text: 'Someone wrote this tonight.' },
    { speaker: 'Y', voice: 0, text: 'Why do you believe that?' },
    { speaker: 'Archive keeper', text: 'The ink’s still wet.' },
    { speaker: 'Y', voice: 1, text: 'Why does wet ink mean it was written tonight?' },
    { speaker: 'Archive keeper', text: 'Ink like this dries in minutes.' },
    { speaker: 'Y', voice: 2, text: 'How do you know it dries that fast?' },
    { speaker: 'Archive keeper', text: 'I tested it yesterday.' },
    { speaker: 'Y', voice: 3, text: 'How do you know today’s ink is the same?' },
    { speaker: 'Archive keeper', text: 'It came from the same bottle.' },
    { speaker: 'SOWHAT', voice: 4, text: 'So what? How do you know the ink hasn’t changed?' },
    { speaker: 'Narrator', text: 'Give it a reason, and it asks for another.' },
  ] },
  { id: 'regress-skepticism', title: 'Skepticism', description: 'Suspend judgment when the reasons run out.', dialogue: [
    { speaker: 'Narrator', text: 'Some gave no verdict. The chain ran out before they found enough support.' },
  ] },
  { id: 'regress-infinitism', title: 'Infinitism', description: 'There is always another reason to ask for.', dialogue: [
    { speaker: 'Narrator', text: 'Others kept going. For every reason they gave, there was another reason to ask for.' },
  ] },
  { id: 'regress-coherentism', title: 'Coherentism', description: 'Beliefs support one another as a web.', dialogue: [
    { speaker: 'Narrator', text: 'Some looked at how their beliefs supported one another, like strands in a web.' },
  ] },
  { id: 'regress-foundationalism', title: 'Descartes Finds a Foundation', description: 'A starting point doubt cannot shake.', dialogue: [
    { speaker: 'Narrator', text: 'Descartes noticed that even while he doubted, he was thinking.' },
    { speaker: 'Descartes', text: 'I think, therefore I am.' },
    { speaker: 'Narrator', text: 'He had found a place to start.' },
  ] },
] as const;

export const slides = [
  { title: 'Unitrans arrival', description: 'Arriving at UC Davis for lecture', members: ['unitrans-arrival'] },
  { title: 'Before lecture', description: 'You take your seat in Giedt Hall and open your notebook.', members: ['before-lecture'] },
  { title: 'Contemporary Contextualism', description: 'The same sentence can express different claims in different contexts.', members: ['contemporary-heading', 'state-red'] },
  { title: 'Flexible Foundationalism', description: 'Justified beliefs rest on foundations that vary with context', members: ['flexible-heading', 'foundation-left'] },
  { title: 'Why Accept It?', description: 'Motivations for flexible foundationalism', members: ['aim-motivations'] },
  { title: 'Different Versions', description: 'Four ways context can shape foundational justification', members: ['aim-versions'] },
  { title: 'Applications', description: 'How flexible foundations can explain access to our own grounds', members: ['aim-applications'], frameMembers: ['access-heading', 'access-principle', 'access-doubt', 'home-heading', 'home-weather', 'mobile-heading', 'mobile-scene'] },
  ...regressFlashback.map(({ id, title, description }) => ({ title, description, members: [id] as const })),
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
