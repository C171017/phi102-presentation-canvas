import { inkOceanStory } from './ink-ocean-story';
import type { StoryScene } from './story-text';

// These IDs are also the storage keys for edits to draft 4.
const untilItDries: readonly StoryScene[] = [
  {
    id: 'until-it-dries-expanded-01-bridge-before',
    title: "This bridge holds",
    summary: "Cole goes live as he crosses the Red Bridge.",
    paragraphs: [
      "Cole taps his ring light. “Evening, chat.” The Red Bridge is small enough to cross before the stream catches up. The lamps on its rust-red rail come on one by one, and his regulars watch their reflections streak across the river.",
      "On the west bank Simone waits with Echo beside her carrier. Their way home is through the round-topped teal door across the water. Set into the bridge is a cream plaque with four plain words: THIS BRIDGE HOLDS.",
      "Cole reads it to the stream. The words are dry.",
    ],
    illustration: {
      src: new URL('./assets/story/until-it-dries-expanded/01-bridge-before.webp', import.meta.url).href,
      alt: "Cole films from the middle of an intact red-railed bridge while Simone waits at the west landing.",
    },
  },
  {
    id: 'until-it-dries-expanded-02-the-letters-run',
    title: "The letters run",
    summary: "Five voices rise as the bridge turns wet.",
    paragraphs: [
      "A bubble breaks the surface. It has a pointed tail and a voice. “Why believe it holds?” Three more rise beside it, and then the smallest one, with a bright red dot.",
      "Cole turns the phone toward the plaque. The bottom of the last letter runs. A seam opens in the bars under his feet. He backs toward the landing while there’s still enough dry ground to reach it.",
      "The center span slumps into the river. The lamps at both ends are still lit.",
    ],
    illustration: {
      src: new URL('./assets/story/until-it-dries-expanded/02-the-letters-run.webp', import.meta.url).href,
      alt: "Five ink bubbles hover over the central section of the bridge as the span begins to dissolve and Cole retreats.",
    },
  },
  {
    id: 'until-it-dries-expanded-03-the-far-bank',
    title: "The far bank",
    summary: "Simone lifts Echo away from the water. Home is on the other side.",
    paragraphs: [
      "Simone lifts Echo’s carrier away from the rising water. His claw stays tucked. On the far bank, the doorway is still lit. The route that was there a moment ago is gone.",
      "Upriver, at the Great Inkwell, the wax seal has split. A small V-shaped cut runs into its edge. None of them stops to look at it yet. They’re watching the five voices rise out of the river.",
    ],
    illustration: {
      src: new URL('./assets/story/until-it-dries-expanded/03-the-far-bank.webp', import.meta.url).href,
      alt: "Simone gathers Echo at the west landing while the broken red rails and the teal doorway remain across the water.",
    },
  },
  {
    id: 'until-it-dries-expanded-04-a-question-spills',
    title: "A question spills",
    summary: "The legend begins with a drop of ink that never dries.",
    paragraphs: [
      "Long ago, every word in the world was written in ink. Left alone, ink dried in minutes. Hold a dried sentence in your hand and you could feel the words pressed into a solid bar. A serious question was like water. Once someone started asking, the ink could stay wet all night.",
      "Then somebody spilled a question mark into the Great Inkwell. It never dried. It grew into five voices, four named Y and a little red-marked one named SOWHAT. People called what grew there YYYY SOWATT.",
    ],
    illustration: {
      src: new URL('./assets/story/until-it-dries-expanded/04-a-question-spills.webp', import.meta.url).href,
      alt: "A question-shaped splash in an old brass inkwell gives rise to five dark ink bubbles.",
    },
  },
  {
    id: 'until-it-dries-expanded-05-the-bridge-will-hold',
    title: "The bridge will hold",
    summary: "Two Y voices ask the pen what supports her prediction.",
    paragraphs: [
      "A pen sits at her ledger and writes, “The bridge will hold.” A dark shape lifts out of the fresh line.",
      "Y: Why believe it will hold?\nPen: I crossed it this morning.\nY: Why think this morning tells you about tonight?\nPen: Bridges don’t change overnight.",
    ],
    illustration: {
      src: new URL('./assets/story/until-it-dries-expanded/05-the-bridge-will-hold.webp', import.meta.url).href,
      alt: "The pen writes in a ledger while the first two larger ink bubbles drift close to the nib.",
    },
  },
  {
    id: 'until-it-dries-expanded-06-so-what',
    title: "So what?",
    summary: "The smallest voice asks what forty years of crossings can establish.",
    paragraphs: [
      "Y: Why believe they don’t?\nPen: This one never has.\nY: Why trust “never has”?\nPen: I’ve crossed it every day for forty years.",
      "The smallest voice drifts right up to the nib. Its dot is bright red.",
      "SOWHAT: So what? Every bridge holds until the day it doesn’t.",
      "Her words never dried. Neither did the bridge.",
    ],
    illustration: {
      src: new URL('./assets/story/until-it-dries-expanded/06-so-what.webp', import.meta.url).href,
      alt: "The red-dotted SOWHAT floats nearest the pen while the other four watch and the writing pools on the page.",
    },
  },
  {
    id: 'until-it-dries-expanded-07-the-quill-goes-down',
    title: "Skepticism",
    summary: "One writer sets the quill down.",
    paragraphs: [
      "Some writers ran out of reasons and put down their quills. They left the question open. At first the others mistook the quiet for defeat. Then they noticed how much more calmly those writers slept.",
      "The bridge remained a question. They carried on with what they could do without answering it.",
    ],
    illustration: {
      src: new URL('./assets/story/until-it-dries-expanded/07-the-quill-goes-down.webp', import.meta.url).href,
      alt: "A writer looks out an arched window while her quill rests beside an unfinished line.",
    },
  },
  {
    id: 'until-it-dries-expanded-08-the-scroll-keeps-going',
    title: "Infinitism",
    summary: "One wet scroll rolls beyond the hills.",
    paragraphs: [
      "Others kept writing. A reason supported the sentence and a further reason supported that one. As soon as a Y asked again, there was more paper.",
      "Their scrolls went down the street, over the hills and out of sight. All the ink was still wet.",
    ],
    illustration: {
      src: new URL('./assets/story/until-it-dries-expanded/08-the-scroll-keeps-going.webp', import.meta.url).href,
      alt: "A continuous trail of written parchment unrolls from a desk into the distance.",
    },
  },
  {
    id: 'until-it-dries-expanded-09-the-ring-of-letters',
    title: "Coherentism",
    summary: "A circle of letters lets each one support another.",
    paragraphs: [
      "Some writers pinned their letters in a ring. Each supported the next, and the whole set made more sense together than any one letter had on its own.",
      "YYYY SOWATT followed the circle. Whenever one voice asked where to go next, another letter was waiting.",
    ],
    illustration: {
      src: new URL('./assets/story/until-it-dries-expanded/09-the-ring-of-letters.webp', import.meta.url).href,
      alt: "Four sealed letters hang in a circular arrangement as the five voices follow the loop.",
    },
  },
  {
    id: 'until-it-dries-expanded-10-descartes-seals-the-inkwell',
    title: "Descartes’s seal",
    summary: "Legend says one small ink stick could withstand every question.",
    paragraphs: [
      "Legend says that, in a stove-heated room one winter, Descartes asked how far his doubt could go. He could question what he saw and whether he was awake. The act of doubting itself was something he was doing.",
      "“I think.” The words hardened as he wrote them. He pressed that little stick into the wax of the Great Inkwell and sealed the five voices away.",
    ],
    illustration: {
      src: new URL('./assets/story/until-it-dries-expanded/10-descartes-seals-the-inkwell.webp', import.meta.url).href,
      alt: "Descartes presses a small rectangular stick into the Great Inkwell’s wax seal in a winter room.",
    },
  },
  {
    id: 'until-it-dries-expanded-11-a-grain-of-rice',
    title: "A grain of rice",
    summary: "The stick outlasted the seal. It’s barely large enough to hold.",
    paragraphs: [
      "At the Great Inkwell, Simone lifts what’s left of the seal. There it is, a bar of ink the size of a grain of rice. The wax has split all around it. The stick itself is whole.",
      "“I think” gets her to something she can rely on even here. She puts the stick next to the long gap she has to cross and imagines building the rest of her way home out of claims that certain. She can’t get very far.",
    ],
    illustration: {
      src: new URL('./assets/story/until-it-dries-expanded/11-a-grain-of-rice.webp', import.meta.url).href,
      alt: "Simone examines a tiny ink stick in her palm beside the Inkwell’s cracked red wax.",
    },
  },
  {
    id: 'until-it-dries-expanded-12-why-stop-there',
    title: "Why stop there?",
    summary: "Cole tests an ordinary starting point.",
    paragraphs: [
      "Cole kneels beside the street. “But I can see it’s solid.” He pats an ordinary paving bar with his palm. It feels like a better place to start than something the size of a grain of rice.",
      "“Why stop there?” a Y asks. Cole looks closer. The bar softens at the edge and runs over the side of the quay. Once he’s taking the doubt seriously, simply seeing it as solid doesn’t settle the matter.",
    ],
    illustration: {
      src: new URL('./assets/story/until-it-dries-expanded/12-why-stop-there.webp', import.meta.url).href,
      alt: "A Y voice watches as an ordinary rectangular street bar softens near Cole’s hand.",
    },
  },
  {
    id: 'until-it-dries-expanded-13-where-the-ground-holds',
    title: "Where the ground holds",
    summary: "The city stands on many ordinary claims that can be questioned again.",
    paragraphs: [
      "Simone looks from the little stick to the whole city. The seal had kept the questions out. The streets stood on thousands of plain sentences people had left dry. The bar under her hand stays firm, even though the one Cole was testing has gone wet.",
      "There are a few ways a sentence can stay dry. People may let it stand in conversation. A question may hold something else fixed. Even a Y asking whether a bridge holds already takes talk of a bridge for granted. Sometimes Simone can start from what she knows by looking.",
      "They’ve been searching for another seal. Now they need somewhere ordinary to put their feet.",
    ],
    illustration: {
      src: new URL('./assets/story/until-it-dries-expanded/13-where-the-ground-holds.webp', import.meta.url).href,
      alt: "Simone tests a solid street bar beside one wet joint as everyday life continues on the quay.",
    },
  },
  {
    id: 'until-it-dries-expanded-14-four-openings',
    title: "Four openings",
    summary: "Rae punches four ways into the same city.",
    paragraphs: [
      "Rae takes her punch to the edge of the page. One click makes a round hole. Through it the same canal comes into view under a different light. Three more clicks make three more ways through.",
      "Each opening leads to a draft of the same city. In each draft they’ll find a different answer to whose situation, speech, or judgment matters when they treat something as settled. They agree to meet back at the bridge.",
    ],
    illustration: {
      src: new URL('./assets/story/until-it-dries-expanded/14-four-openings.webp', import.meta.url).href,
      alt: "Rae holds her punch beside four circular openings in thick paper while the companions wait on the quay.",
    },
  },
  {
    id: 'until-it-dries-expanded-15-simones-street',
    title: "Simone’s street",
    summary: "The street softens when Simone changes the question.",
    paragraphs: [
      "Simone is looking for a path home. “Which way home?” The row of bars under her boots stays dry. To answer that question she’s taking for granted which street she’s on.",
      "She sees the turn ahead and stops. “Is this even my street?” The edge of the next bar gives way. Same person, same street, different inquiry. What Simone can take for granted follows the question she’s pursuing.",
    ],
    illustration: {
      src: new URL('./assets/story/until-it-dries-expanded/15-simones-street.webp', import.meta.url).href,
      alt: "Simone steps through a round paper opening onto a street with firm bars behind her and wet ink ahead.",
    },
  },
  {
    id: 'until-it-dries-expanded-16-cole-two-audiences',
    title: "Two audiences",
    summary: "Cole uses the same sentence with his regulars and with the Timetable Society.",
    paragraphs: [
      "“This bridge holds,” Cole tells his regulars. They take it as the ordinary reassurance they were expecting. The ink dries.",
      "He goes live for the Timetable Society. Same words. This time he’s speaking to people who expect him to certify the crossing. They want to see what he checked. He squares his phone like a newscaster, but the ink stays wet.",
    ],
    illustration: {
      src: new URL('./assets/story/until-it-dries-expanded/16-cole-two-audiences.webp', import.meta.url).href,
      alt: "Cole streams beside the Red Bridge with two chat columns on his phone and dry and wet ink in view.",
    },
  },
  {
    id: 'until-it-dries-expanded-17-the-raid',
    title: "The horoscope raid",
    summary: "A whole chat lets a bad sentence dry.",
    paragraphs: [
      "The Retrograde crowd raids the stream. Their stars and rings fill his phone. Somebody offers a reason nobody in that chat thinks to challenge. “Mercury retrograde weakens bridges.”",
      "The test strip dries in front of him. Cole reads the sentence back, slower this time. The bar is solid. The reason is still bad.",
    ],
    illustration: {
      src: new URL('./assets/story/until-it-dries-expanded/17-the-raid.webp', import.meta.url).href,
      alt: "The stream fills with star icons and a test strip dries beside an astrological mark.",
    },
  },
  {
    id: 'until-it-dries-expanded-18-echo-raises-a-claw',
    title: "One raised claw",
    summary: "Echo’s draft spells out a commitment with a gesture.",
    paragraphs: [
      "Echo’s draft is a pale page. He sits with his original shell and his patient half-lidded stare. Here a raised claw is enough to express taking something for granted. A tucked claw withholds that commitment.",
      "He has kept it tucked for “This bridge holds.” What he takes a stand on is visible in what he does.",
    ],
    illustration: {
      src: new URL('./assets/story/until-it-dries-expanded/18-echo-raises-a-claw.webp', import.meta.url).href,
      alt: "In a pale paper draft, one small Echo raises a single coral claw.",
    },
  },
  {
    id: 'until-it-dries-expanded-19-rae-not-valid',
    title: "Not valid",
    summary: "Rae inspects the same bridge from her side.",
    paragraphs: [
      "Rae has come to certify the bridge. Cole shows her the dry face of the bar. From her side, the same bar looks wet. She studies it for one beat, raises her ticket punch and clicks. “Not valid.”",
      "Cole’s words still make the claim he meant to make. Rae assesses that claim from where she stands. He hears her verdict as a disagreement about the bridge.",
    ],
    illustration: {
      src: new URL('./assets/story/until-it-dries-expanded/19-rae-not-valid.webp', import.meta.url).href,
      alt: "Rae punches a ticket while Cole watches from the dry-looking side of the same ink bar.",
    },
  },
  {
    id: 'until-it-dries-expanded-20-punch-and-claw',
    title: "Punch and claw",
    summary: "A claim, a verdict, and a visible commitment.",
    paragraphs: [
      "Back together, Cole says it again. “This bridge holds.” Rae clicks her punch. “Not valid.” At the sound of the punch, Echo raises his claw toward Rae’s verdict.",
      "No one repeats the inspection. Cole stands by what he said. Rae stands by what she punched. Echo, who has never raised his claw for Cole’s claim, has shown exactly where he stands.",
    ],
    illustration: {
      src: new URL('./assets/story/until-it-dries-expanded/20-punch-and-claw.webp', import.meta.url).href,
      alt: "Rae’s punch and Echo’s raised claw frame Cole’s ring light at the bridge rail.",
    },
  },
  {
    id: 'until-it-dries-expanded-21-the-dry-draft',
    title: "The Dry Draft",
    summary: "The Red Bridge is failing in a city where every sentence stays dry.",
    paragraphs: [
      "They go looking for a draft where somebody managed to destroy YYYY SOWATT. The first thing they notice when they find it is that the streets gleam. The words here dry forever.",
      "People walk to work on bars like “Mercury retrograde weakens bridges.” At the Red Bridge the inscription is perfectly sharp. Beneath it, joints are breaking away and falling. Nobody on the quay can reopen the question of whether the bridge holds.",
      "There is no point carrying that kind of certainty home. They turn back toward the river.",
    ],
    illustration: {
      src: new URL('./assets/story/until-it-dries-expanded/21-the-dry-draft.webp', import.meta.url).href,
      alt: "A golden, petrified version of the city has an intact-looking red rail and failing supports beneath it.",
    },
  },
  {
    id: 'until-it-dries-expanded-22-the-question-underfoot',
    title: "The question underfoot",
    summary: "Cole’s question about Simone’s grounds reaches the belief she is standing on.",
    paragraphs: [
      "The river has come up around the steps. Simone brings out her map. Cole looks over her shoulder. “Are you justified in thinking you’re justified?” He means it as a question about her grounds.",
      "The bar under Simone’s boot softens. She no longer feels sure that the route she took for granted is one she can actually rely on. It’s hard to keep standing on it while she’s wondering whether it holds.",
    ],
    illustration: {
      src: new URL('./assets/story/until-it-dries-expanded/22-the-question-underfoot.webp', import.meta.url).href,
      alt: "Simone’s boot rests on a softening ink bar while Cole leans toward her with his phone lowered.",
    },
  },
  {
    id: 'until-it-dries-expanded-23-the-map-runs',
    title: "The map runs",
    summary: "Simone can no longer read the words she had relied on.",
    paragraphs: [
      "The map had said, “Home is across the Red Bridge.” She could read those words before the river reached the landing. They settled which way she should go, and she could point to them when someone asked her why.",
      "She opens the fold. The ink has bled across it, and she can’t read the line beside the crossing. If those words still fix which way she should go, she has no way to find out what they say.",
    ],
    illustration: {
      src: new URL('./assets/story/until-it-dries-expanded/23-the-map-runs.webp', import.meta.url).href,
      alt: "The route on Simone’s folded cream map dissolves with the broken Red Bridge visible beyond.",
    },
  },
  {
    id: 'until-it-dries-expanded-24-echo-moves-house',
    title: "Echo moves house",
    summary: "Echo leaves an old shell behind and takes shelter in a new one.",
    paragraphs: [
      "At the edge of the water, Echo climbs out of his tall violet shell. His eyes stay half-lidded while his small legs find purchase. He backs into a lower, pale lavender shell, then settles.",
      "Simone watches him leave the empty shell on the step. The river is here. Cole’s camera can show her this bank. Her feet can tell her what the next bar feels like. She has something to work with without the map.",
    ],
    illustration: {
      src: new URL('./assets/story/until-it-dries-expanded/24-echo-moves-house.webp', import.meta.url).href,
      alt: "One Echo moves into a low lavender shell beside his empty tall violet shell on a sheltered step.",
    },
  },
  {
    id: 'until-it-dries-expanded-25-the-next-step',
    title: "The next step",
    summary: "What Simone can rely on moves as she moves.",
    paragraphs: [
      "Cole keeps the phone trained on the water. Simone hears where the current changes against the edge of the quay. A solid bar forms at her next step. She tests it with her foot before she puts her weight on it.",
      "She takes another step. Fresh ink dries ahead of her. She can still say why she’s stepping there, even though the map is behind her now and no longer tells her the way.",
    ],
    illustration: {
      src: new URL('./assets/story/until-it-dries-expanded/25-the-next-step.webp', import.meta.url).href,
      alt: "Simone crosses on firm ink bars as Cole watches from the west bank and the far doorway catches dawn light.",
    },
  },
  {
    id: 'until-it-dries-expanded-26-under-the-bridge',
    title: "Under the bridge",
    summary: "The dry face of the claim hid what Echo could already see.",
    paragraphs: [
      "Earlier that evening, Echo had been low enough on the quay to see the underside of the bridge. The joints had opened already. One dark bar was giving out, even though the inscription on top was crisp and dry.",
      "People were walking across because everybody took those words for granted. Echo had kept his claw tucked each time he heard them. It was the only answer he could give.",
    ],
    illustration: {
      src: new URL('./assets/story/until-it-dries-expanded/26-under-the-bridge.webp', import.meta.url).href,
      alt: "Before the collapse, Echo watches the failing joints under the still-intact Red Bridge.",
    },
  },
  {
    id: 'until-it-dries-expanded-27-echo-opens-the-inkwell',
    title: "The claw-shaped crack",
    summary: "Echo made the cut in the seal and let the questions back in.",
    paragraphs: [
      "Echo went to the Great Inkwell in his old violet shell. One push from his claw cracked the wax. The little stick inside stayed whole. Through the cut, five voices rose up and drifted downstream.",
      "He’d let someone ask the question before another person crossed a bridge that would fail under them. Simone recognizes the cut now. It’s the same shape as the opening of Echo’s claw.",
      "She hears the smallest voice in the legend again. “Every bridge holds until the day it doesn’t.”",
    ],
    illustration: {
      src: new URL('./assets/story/until-it-dries-expanded/27-echo-opens-the-inkwell.webp', import.meta.url).href,
      alt: "Echo presses his claw into the Great Inkwell’s red seal as five bubbles gather below the rim.",
    },
  },
  {
    id: 'until-it-dries-expanded-28-valid',
    title: "Valid",
    summary: "At home, there’s still room for a question.",
    paragraphs: [
      "Simone steps onto the far bank. The other voices disperse into the river. The smallest one comes to rest on her shoulder, its red dot bright in the early light. SOWHAT waits. There will be another question when it matters.",
      "Rae takes Simone’s ticket and punches it once. “Valid.” The corner of her mouth lifts for one frame. Behind them, the water goes on moving.",
    ],
    illustration: {
      src: new URL('./assets/story/until-it-dries-expanded/28-valid.webp', import.meta.url).href,
      alt: "Rae punches Simone’s ticket at the far bank while the red-dotted SOWHAT rests on Simone’s shoulder.",
    },
  },
];

const classroom = '/generated/backgrounds/dead-ink/01-giedt-classroom.webp';
const openingScenes: StoryScene[] = [
  {
    id: 'ink-ocean-S0.1',
    title: 'Unitrans arrival',
    summary: 'S0.1 · UC Davis',
    paragraphs: ['A student steps off the red Unitrans double-decker at UC Davis.'],
    illustration: { src: '/generated/backgrounds/dead-ink/00-unitrans-arrival.webp', alt: 'A red double-decker arrives on campus.' },
  },
  {
    id: 'ink-ocean-S0.2',
    title: 'Before lecture',
    summary: 'S0.2 · Giedt Hall',
    paragraphs: ['The student takes a seat in Giedt Hall and opens their notebook.'],
    illustration: { src: classroom, alt: 'Giedt Hall seen from a student’s seat.' },
  },
  {
    id: 'ink-ocean-S0.3',
    title: 'Contemporary Contextualism',
    summary: 'The same sentence can express different claims in different contexts.',
    paragraphs: [
      'Professor Lin: Contextualism is the idea that what we mean when we say “I know” can change depending on the conversation.',
      'Professor Lin: What do you see there?',
      'The audience has ten seconds to vote. The same mark reads as B between A and C, or 13 between 12 and 14.',
      'Professor Lin: Ten seconds, a room full of philosophers, and somehow you’re all wrong. Well, Contemporary Contextualism it is. Read the texts.',
      'Professor Lin: Anyway, long, long ago, when the chalk in this very room was still young, it has a very different name:',
    ],
    illustration: { src: classroom, alt: 'The classroom where Professor Lin gives the B or 13 quiz.' },
  },
  {
    id: 'ink-ocean-S0.4',
    title: 'The reveal',
    summary: 'S0.4 · Giedt Hall',
    paragraphs: ['Professor Lin: Flexible foundationalism.', 'The existing opening video plays. When it ends, the legend begins.'],
    illustration: { src: classroom, alt: 'Giedt Hall at the end of the classroom introduction.' },
  },

];

const legendScenes: StoryScene[] = Object.entries(inkOceanStory).map(([id, scene]) => ({
  id: 'ink-ocean-' + id,
  ...scene,
}));

export const storyVersions = [
  { title: null, scenes: [...openingScenes, ...legendScenes] },
  { title: 'Until It Dries', scenes: untilItDries },
] as const;
