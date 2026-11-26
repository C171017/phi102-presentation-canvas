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
export const greatInkwellScene = 'regress-problem';
const lawOfInk = storySlide(openingInkScene);
const greatInkwell = storySlide(greatInkwellScene);
const openingInk: InkOceanScene = {
  ...lawOfInk,
  cues: [...lawOfInk.cues, ...greatInkwell.cues.map((cue): InkOceanCue => ({
    ...cue, sourceScene: greatInkwellScene, background: greatInkwell.background,
  }))],
};

export const legendSlides = (Object.keys(inkOceanStory) as StorySceneId[])
  .filter(id => id !== greatInkwellScene && !trialFollowups.includes(id))
  .map(id => {
    if (id === openingInkScene) return openingInk;
    if (id === 'P1') return trial;
    if (id === 'L6-A' || id === 'L6-B') return schoolScenes[id];
    return storySlide(id);
  });

export function hasEstablishingShot(scene: InkOceanScene, index: number): boolean {
  if (index === 0) return Boolean(scene.background);
  if (scene.id === openingInkScene || scene.id === 'P1' || scene.id === 'P2-1') return false; // Cut directly on the dialogue cue.
  const background = scene.cues[index]?.background;
  return Boolean(background && background !== scene.cues[index - 1]?.background);
}
