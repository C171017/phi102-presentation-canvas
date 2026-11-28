import { trialPages } from './trial-script';
import { inkOceanStory } from './ink-ocean-story';
import { inkOceanStoryTextId, savedStoryText } from './saved-story-text';
import { isStoryBeatHeading, type StoryScene } from './story-text';

type StorySceneId = keyof typeof inkOceanStory;

export type InkOceanSceneId = StorySceneId;

export interface InkOceanCue {
  speaker: string;
  speakerId?: string;
  text: string;
  kind?: 'direction' | 'note';
  background?: string;
  trialBanner?: string;
  trialCallToOrder?: true;
  sourceScene?: InkOceanSceneId;
}

export interface InkOceanScene {
  id: InkOceanSceneId;
  title: string;
  takeaway: string;
  background?: string;
  imageOnly?: true;
  cues: InkOceanCue[];
}

function cueFromParagraph(text: string): InkOceanCue {
  if (text.startsWith('[')) return { speaker: 'Stage direction', kind: 'direction', text };
  const spoken = /^([^:]+): (.+)$/.exec(text);
  if (!spoken || /^(?:SKEPTICISM|INFINITISM|COHERENTISM)\.|^The objection/.test(text)) {
    return { speaker: 'Story note', kind: 'note', text };
  }
  const [, speaker, line] = spoken;
  const number = '₁₂₃₄'.indexOf(speaker.slice(1));
  const speakerId = /^Y[₁₂₃₄]$/.test(speaker) ? 'Y' + (number + 1) : undefined;
  return { speaker, speakerId, text: line };
}

function storySlide(id: StorySceneId): InkOceanScene {
  const entry: Omit<StoryScene, 'id'> = inkOceanStory[id];
  const { summary, illustration } = entry;
  const { title, paragraphs } = savedStoryText[inkOceanStoryTextId(id)] ?? entry;
  // A title card occupies its own navigation step without a transcript.
  const cues: InkOceanCue[] = illustration?.imageOnly ? [{ speaker: '', text: '' }]
    : paragraphs.flatMap(paragraph => paragraph.split('\n').map(line => line.trim())
      .filter(line => line && !isStoryBeatHeading(line)).map(cueFromParagraph));
  if (id === 'P2-1') {
    const questionIndex = cues.findIndex(cue => cue.speaker === 'Cole');
    if (questionIndex >= 0) {
      cues[questionIndex].background = '/generated/backgrounds/ink-ocean/P2-1-cole-asks.webp';
      const reaction = cues[questionIndex + 1];
      if (reaction?.kind === 'direction') reaction.background = '/generated/backgrounds/ink-ocean/P2-1-simone-reacts.webp';
    }
  }
  if (id === 'P2-2a') {
    const frame = (name: string) => `/generated/backgrounds/ink-ocean/P2-2a-flashback-${name}.webp`;
    const replies = ['first-reply', 'second-reply', 'train'];
    let reply = 0;
    for (const cue of cues) {
      if (cue.speaker === 'Cole' || cue.text === '[Cole starts streaming.]') {
        cue.background = frame('streaming');
      } else if (cue.speaker === 'Chat' && reply < replies.length) {
        cue.background = frame(replies[reply++]);
      } else if (cue.kind === 'direction' && reply === replies.length) {
        cue.background = frame('train');
      }
    }
  }
  return {
    id,
    title,
    takeaway: summary,
    background: illustration?.src,
    imageOnly: illustration?.imageOnly,
    cues,
  };
}

export const schoolScenes = {
  'L6-A': storySlide('L6-A'),
  'L6-B': storySlide('L6-B'),
};

// The reader has five Trial pages. They play through the same presentation slide.
const trialFollowups: readonly StorySceneId[] = ['P1-2', 'P1-3', 'P1-4', 'P1-5'];
const testimony = storySlide('P1');
const trial: InkOceanScene = {
  ...testimony,
  title: 'The Trial',
  cues: trialPages([testimony, ...trialFollowups.map(storySlide)]),
};

export const openingInkScene = 'L0';
export const inkPassages = new Map<string, readonly StorySceneId[]>([
  [openingInkScene, ['regress-problem', 'regress-problem-birth']],
  ['L2', ['L3']],
]);
const joinedPassages = new Set([...inkPassages.values()].flat());

export const legendSlides = (Object.keys(inkOceanStory) as StorySceneId[])
  .filter(id => !joinedPassages.has(id) && !trialFollowups.includes(id))
  .map(id => {
    if (id === 'P1') return trial;
    if (id === 'L6-A' || id === 'L6-B') return schoolScenes[id];
    const scene = storySlide(id);
    const passages = inkPassages.get(id);
    if (!passages) return scene;
    return { ...scene, cues: [...scene.cues, ...passages.flatMap(sourceScene => {
      const passage = storySlide(sourceScene);
      // The regress slide holds on the hand illustration until the Whypocalypse title card.
      const background = sourceScene === 'L3' ? undefined : passage.background;
      return passage.cues.map(cue => ({ ...cue, sourceScene, background }));
    })] };
  });

export function hasEstablishingShot(scene: InkOceanScene, index: number): boolean {
  if (index === 0) return Boolean(scene.background);
  if (inkPassages.has(scene.id) || scene.id === 'P1' || scene.id === 'P2-1' || scene.id === 'P2-2a') return false; // Change artwork with the dialogue cue.
  const background = scene.cues[index]?.background;
  return Boolean(background && background !== scene.cues[index - 1]?.background);
}
