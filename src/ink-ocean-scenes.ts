import focusPlates from './ink-ocean-focus.json';
// Dialogue source: docs/dialogue-box-script-s0-through-l6.md.
export type InkOceanSceneId =
  | "regress-problem"
  | "L2"
  | "L3"
  | "L4"
  | "regress-skepticism"
  | "regress-infinitism"
  | "regress-coherentism"
  | "L4-quiz"
  | "regress-foundationalism"
  | "L5b"
  | "L6"
  | "L6-A"
  | "L6-B";

export interface InkOceanCue {
  speaker: string;
  speakerId?: 'Y1' | 'Y2' | 'Y3' | 'Y4';
  text: string;
  background?: string;
  speakerFocus?: string;
}

export interface InkOceanScene {
  id: InkOceanSceneId;
  title: string;
  takeaway: string;
  background: string;
  cues: InkOceanCue[];
}

function artwork(basename: string): string {
  return `/generated/backgrounds/ink-ocean/${basename}.webp`;
}

export const inkOceanScenes: Record<InkOceanSceneId, InkOceanScene> = {
  "regress-problem": {
    id: "regress-problem",
    title: "The Great Inkwell",
    takeaway: "Once a belief is settled, you can use it to support another.",
    background: artwork("L1-01-guardian"),
    cues: [
      { speaker: "Narrator", text: "Long ago, every word in the world was written in ink. It all came from one place, the Great Inkwell." },
      { speaker: "Narrator", text: "To form a belief, you took a ladle of ink and said what you believed. A question mark stood at the rim. Its job was to ask why." },
      { speaker: "Villager", text: "I believe I’m the best cook in the village." },
      { speaker: "Guardian", text: "Why?" },
      { speaker: "Villager", text: "My mother says so." },
      { speaker: "Narrator", text: "The guardian seemed satisfied. The ink dried. The cook fitted the stick into his chest and went home quite pleased with himself." },
      { speaker: "Woman", text: "I believe Tuesdays are lucky." },
      { speaker: "Guardian", text: "Why?" },
      { speaker: "Woman", text: "I was born on one." },
      { speaker: "Narrator", text: "That dried too. The guardian had yet to meet an answer it particularly disliked." },
      { speaker: "Baby", text: "[Gurgles.]" },
      { speaker: "Guardian", text: "…Good enough." },
      { speaker: "Narrator", text: "The baby’s first stick said WARM. Her parents tucked it gently into place. That was what people were made of here. One settled belief on top of another." },
      { speaker: "Narrator", text: "Then somebody bumped the question mark. It tipped into the ink. Nobody saw who did it. Everyone agreed it was an accident." },
      { speaker: "Narrator", text: "Five bubbles came up. Four asked “Why?” The smallest asked “So what?” People called them YYYY SOWATT.", background: artwork("L1-02-first-questions") },
    ],
  },
  "L2": {
    id: "L2",
    title: "The Regress Problem",
    takeaway: "Every reason invites another “why?”",
    background: artwork("L2-01-the-hand"),
    cues: [
      { speaker: "Woman", text: "I have a hand.", speakerFocus: artwork("L2-speaking-woman") },
      { speaker: "Y", speakerId: "Y1", text: "Why believe you have a hand?", speakerFocus: artwork("L2-speaking-y1") },
      { speaker: "Woman", text: "I can see it. It’s holding the ladle.", speakerFocus: artwork("L2-speaking-woman") },
      { speaker: "Y", speakerId: "Y2", text: "Why trust what you see?", speakerFocus: artwork("L2-speaking-y2") },
      { speaker: "Woman", text: "I’m wide awake, and my eyes work when I’m awake.", speakerFocus: artwork("L2-speaking-woman") },
      { speaker: "Y", speakerId: "Y3", text: "Why believe you’re awake?", speakerFocus: artwork("L2-speaking-y3") },
      { speaker: "Woman", text: "Everything’s sharp: the ladle, the Inkwell, the cold ink. Dreams are never this clear.", speakerFocus: artwork("L2-speaking-woman") },
      { speaker: "Y", speakerId: "Y4", text: "Why believe you’re not a brain in a vat?", speakerFocus: artwork("L2-speaking-y4") },
      { speaker: "Woman", text: "Oh, come on.", speakerFocus: artwork("L2-speaking-woman") },
      { speaker: "SOWHAT", text: "So what? A brain in a vat would see a hand this clear, too.", speakerFocus: artwork("L2-speaking-sowhat") },
      { speaker: "Narrator", text: "Her words never dried. Then, slowly, neither did her hand.", speakerFocus: artwork("L2-narration") },
    ],
  },
  "L3": {
    id: "L3",
    title: "The Whypocalypse",
    takeaway: "A reason you also doubt leaves the original doubt unresolved.",
    background: artwork("L3-01-whypocalypse"),
    cues: [
      { speaker: "Narrator", text: "She had relied on her sight to settle the question about her hand. Now her sight was the very thing in question. Looking at the ladle again gave her the same view and the same problem." },
      { speaker: "Narrator", text: "It never stopped at one question. And it never stopped at one person. Nothing anyone scooped would dry." },
      { speaker: "Narrator", text: "Babies were born and couldn’t finish forming a single opinion. Their parents, meanwhile, were losing theirs." },
      { speaker: "Narrator", text: "A man who had believed for forty years that he was tall woke up noticeably shorter." },
      { speaker: "Narrator", text: "Whole cities, built on beliefs nobody had thought to question, slid quietly into the sea." },
      { speaker: "Narrator", text: "Scholars still argue about who named it. They argue about everything. That’s rather the problem.", background: artwork("L3-02-crisis-title") },
    ],
  },
  "L4": {
    id: "L4",
    title: "The Answerer Project",
    takeaway: "If every belief needs a reason, what shape can justification take?",
    background: artwork("L4-00-answerers"),
    cues: [
      { speaker: "Narrator", text: "For the first time in its history, humanity united. It elected the three greatest minds alive and gave each of them unlimited ink, unlimited time and absolute authority." },
      { speaker: "Narrator", text: "Each was given one task: answer it." },
    ],
  },
  "regress-skepticism": {
    id: "regress-skepticism",
    title: "Pyrrho, the Unmoved",
    takeaway: "Skepticism · The demand for reasons defeats justification.",
    background: artwork("L4-01-pyrrho"),
    cues: [
      { speaker: "Y", text: "Why believe anything?" },
      { speaker: "Pyrrho", text: "I don’t." },
      { speaker: "Narrator", text: "Pyrrho set down his empty ladle. He could suspend judgment about the hand, the water, even the ground beneath him. The bubbles had no claim left to challenge." },
      { speaker: "Narrator", text: "Nothing of his ever got wet. Nothing of his ever got built." },
      { speaker: "Narrator", text: "His disciples caught him by the sleeve at the water’s edge. They still wanted to know whether they had good reason to believe there was a sea there." },
    ],
  },
  "regress-infinitism": {
    id: "regress-infinitism",
    title: "Peirce, the Endless",
    takeaway: "Infinitism · Each reason has a further, distinct reason.",
    background: artwork("L4-02-peirce"),
    cues: [
      { speaker: "Y", text: "Why believe that?" },
      { speaker: "Peirce", text: "Excellent question. The reason is—" },
      { speaker: "Y", text: "Why believe the reason?" },
      { speaker: "Peirce", text: "An even better question. The reason for that is—" },
      { speaker: "Narrator", text: "Every answer got a fresh line on his scroll. No line repeated an earlier one. And no matter where you put your finger, there was another line still to come." },
      { speaker: "Narrator", text: "As far as anyone knows, he is still answering. He was last seen on the horizon, mid-sentence, scroll still wet." },
    ],
  },
  "regress-coherentism": {
    id: "regress-coherentism",
    title: "Neurath, the Shipwright",
    takeaway: "Coherentism · Beliefs draw support from their fit with one another.",
    background: artwork("L4-03-neurath"),
    cues: [
      { speaker: "Neurath", text: "We rebuild the ship at sea, one plank at a time." },
      { speaker: "Y", text: "Why trust the plank under your feet?" },
      { speaker: "Neurath", text: "The neighboring planks hold it in place. I can replace this one while standing on the others." },
      { speaker: "Narrator", text: "Follow the support around his ring-shaped raft and you eventually return to the plank where you began. YYYY SOWATT swam a lap to check." },
      { speaker: "Narrator", text: "It was the most coherent raft in history. It held together perfectly as it drifted off the edge of the map." },
    ],
  },
  "L4-quiz": {
    id: "L4-quiz",
    title: "Audience check",
    takeaway: "Where can a chain of reasons end?",
    background: artwork("L4-00-answerers"),
    cues: [
      { speaker: "Narrator", text: "One master set down his ladle. One gave a new reason every time. One sent the question around the raft. Which answer would let a belief support others without first borrowing support from another belief?" },
    ],
  },
  "regress-foundationalism": {
    id: "regress-foundationalism",
    title: "Descartes and the Fourth Answer",
    takeaway: "Foundationalism · Some justified beliefs can support others without a further reason.",
    background: artwork("L5-parent"),
    cues: [
      { speaker: "Narrator", text: "And then there was a fourth. Nobody had elected him. He hadn’t been listening. He was sitting by a stove, doubting things, which was what he did anyway." },
      { speaker: "Narrator", text: "At his window, each wet voice budded another. A little copy of the whole chorus slipped inside.", background: artwork("L5-budding") },
      { speaker: "Descartes", text: "Suppose there were a demon, one that could fake everything I see. What would be left?", background: artwork("L5-reply") },
      { speaker: "Narrator", text: "It was only a hypothetical. Descartes was very clear about that.", background: artwork("L5-copy"), speakerFocus: artwork("L5-local-narration") },
      { speaker: "Y", text: "Why believe you’re thinking?", background: artwork("L5-copy") },
      { speaker: "Descartes", text: "Because you just made me doubt it. And doubting is thinking.", background: artwork("L5-reply") },
      { speaker: "SOWHAT", text: "So what? Suppose even this room is a trick.", background: artwork("L5-challenge") },
      { speaker: "Descartes", text: "I think, therefore I am.", background: artwork("L5-hardens") },
      { speaker: "Narrator", text: "The question still hung in the air. A bead at the bubble’s tip went matte, snapped free, and fell.", background: artwork("L5-falls") },
      { speaker: "Narrator", text: "The woman could doubt whether the hand she saw was really there. Descartes tried the same trick on his own thinking. The attempt itself gave him something he could be certain of.", background: artwork("L5-lands") },
      { speaker: "Narrator", text: "In his ladle lay one grain from that copy of YYYY SOWATT. Outside the window, the others kept asking. It was the first belief in the history of the world that dried while it was being asked about." },
    ],
  },
  "L5b": {
    id: "L5b",
    title: "One Grain, One Ocean",
    takeaway: "Certainty gives a reason to stop. How much can that starting point support?",
    background: artwork("L5b-01-one-grain-one-ocean"),
    cues: [
      { speaker: "Narrator", text: "The grain stayed dry. The woman still had a practical question: could she trust the hand holding her ladle?" },
      { speaker: "Narrator", text: "“I exist” tells her there is someone asking. It leaves open whether that someone has hands, or a ladle, or a village to go home to." },
      { speaker: "Narrator", text: "One dry grain could not hold back an ocean. YYYY SOWATT kept asking. Towns that had survived the Whypocalypse started to lean." },
      { speaker: "Narrator", text: "There was no time to doubt everything carefully. There was no time not to." },
      { speaker: "Narrator", text: "So Descartes’s followers did what scholars always do in an emergency. They split into two schools." },
    ],
  },
  "L6": {
    id: "L6",
    title: "Choose Your School",
    takeaway: "The foundationalist’s dilemma · What makes a starting point legitimate?",
    background: artwork("L6-00-choice"),
    cues: [
      { speaker: "Narrator", text: "Both schools agree that a chain of reasons can stop. They disagree about what you may stand on when it does." },
      { speaker: "Sect disciple", text: "Stand on what survives every doubt." },
      { speaker: "Fleet lookout", text: "We can see the coast from here. That’s enough to start building." },
      { speaker: "Narrator", text: "The ocean is running out of time. Whose side are you on?" },
    ],
  },
  "L6-A": {
    id: "L6-A",
    title: "Sect of No Doubt",
    takeaway: "Cartesian foundations. Indubitable starting points are too few to support ordinary beliefs.",
    background: artwork("L6-A1-tower"),
    cues: [
      { speaker: "Sect examiner", text: "Suppose there were a demon. Tell us what’s left." },
      { speaker: "New disciple", text: "Even if it fools me about everything I see, I’m thinking." },
      { speaker: "Narrator", text: "One disciple stands on the grain. The next stands on her shoulders. Welcome to the top of the tower. Please don’t move." },
      { speaker: "Disciple", text: "Look at that golden fleet. From here it looks perfectly solid. So would a fleet the demon made me see." },
      { speaker: "Disciple, from a rowboat", text: "You say the flagship will hold because you can see its deck. Are you sure?", background: artwork("L6-A2-challenge") },
      { speaker: "Fleet lookout, across the water", text: "I can see it right here!" },
      { speaker: "Narrator", text: "The deck goes soft. Once the lookout doubts that the deck is as it appears, pointing at the same view leaves that doubt exactly where it was." },
      { speaker: "Narrator", text: "Victory. You row home. Your grain has survived every objection. It still has room for exactly one foot." },
      { speaker: "Narrator", text: "The lookout had a reason you need if you ever want to sail: what the water ahead looks like. Your entrance test throws that reason overboard before you leave home." },
      { speaker: "Narrator", text: "Fourteen battles. All fourteen were the Battle of Are You Sure. It was the Sect’s only sport." },
    ],
  },
  "L6-B": {
    id: "L6-B",
    title: "Seeing-Is-Believing School",
    takeaway: "Moderate foundations. Perception gives us starting points. What settles a doubt about perception itself?",
    background: artwork("L6-B1-fleet"),
    cues: [
      { speaker: "Fleet examiner", text: "What do you see?" },
      { speaker: "New lookout", text: "A mast, a deck, my hand on the rail." },
      { speaker: "Narrator", text: "You get three planks on your first day. With a lookout on every mast, the Thousand-Sail Palace has become the largest fleet on the ocean." },
      { speaker: "Lookout", text: "See that white tower on the horizon? They’ve been certain since Tuesday. They still can’t tell us whether it’s safe to sail." },
      { speaker: "Heckler, from a rowboat", text: "You say the flagship will hold because you can see its deck. Are you sure?", background: artwork("L6-B2-challenge") },
      { speaker: "Fleet lookout", text: "I can see it right here!" },
      { speaker: "Narrator", text: "Your hand sinks into the rail. Looking again gives you the same evidence. Why should that settle the very doubt the heckler just raised about your sight?" },
      { speaker: "Narrator", text: "On a clear day you had grounds to build a fleet. Now your school owes you an account of when “I can see it” is enough to settle a question." },
      { speaker: "Narrator", text: "Across the water the tower is still standing. Its disciples can explain exactly why their grain stays dry. It’s hard to navigate an ocean with “I think.”" },
      { speaker: "Narrator", text: "The fleet fought fourteen battles. All fourteen were the Battle of Are You Sure. By the fourteenth, everyone recognized the rowboat." },
    ],
  },
};

export function inkOceanBackgroundAt(scene: InkOceanScene, cueIndex: number): string {
  for (let i = Math.min(cueIndex, scene.cues.length - 1); i >= 0; i--) {
    const background = scene.cues[i]?.background;
    if (background) return background;
  }
  return scene.background;
}

export function establishingArtwork(scene: InkOceanScene, index: number): string {
  const background = inkOceanBackgroundAt(scene, index);
  if (scene.id !== 'regress-foundationalism') return background;
  return background.replace(/L5-(reply|challenge)\.webp$/, 'L5-copy.webp').replace(/\.webp$/, '-color.webp');
}

export function hasEstablishingShot(scene: InkOceanScene, index: number): boolean {
  // The audience check returns to the already introduced Answerer Project art.
  return scene.id !== 'L4-quiz' && (index === 0 ||
    establishingArtwork(scene, index) !== establishingArtwork(scene, index - 1));
}

const focusByPlate: Record<string, Record<string, string>> = focusPlates;
export function dialogueArtwork(scene: InkOceanScene, index: number): string {
  const cue = scene.cues[index];
  if (cue.speakerFocus) return cue.speakerFocus;
  const base = inkOceanBackgroundAt(scene, index);
  const variants = focusByPlate[base.split('/').pop()!.replace(/\.webp$/, '')];
  const file = variants?.[cue.speaker] ?? variants?.Narrator;
  return file ? '/generated/backgrounds/ink-ocean/' + file : base;
}
