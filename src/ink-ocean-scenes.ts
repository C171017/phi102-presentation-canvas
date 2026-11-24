import { inkOceanStory } from './ink-ocean-story';
import { inkOceanStoryTextId, savedStoryText } from './saved-story-text';
import type { StoryScene } from './story-text';

type StorySceneId = keyof typeof inkOceanStory;

export type InkOceanSceneId = StorySceneId;

export interface InkOceanCue {
  speaker: string;
  speakerId?: string;
  text: string;
  kind?: 'direction' | 'note';
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
  return {
    id,
    title,
    takeaway: summary,
    background: illustration?.src,
    imageOnly: illustration?.imageOnly,
    // A title card occupies its own navigation step without a transcript.
    cues: illustration?.imageOnly ? [{ speaker: '', text: '' }]
      : paragraphs.flatMap(paragraph => paragraph.split('\n').map(line => line.trim()).filter(Boolean).map(cueFromParagraph)),
  };
}

export const schoolScenes = {
  'L6-A': storySlide('L6-A'),
  'L6-B': storySlide('L6-B'),
};

export const legendSlides = (Object.keys(inkOceanStory) as StorySceneId[]).map(id =>
  id === 'L6-A' || id === 'L6-B' ? schoolScenes[id] : storySlide(id),
);

export function hasEstablishingShot(scene: InkOceanScene, index: number): boolean {
  return index === 0 && Boolean(scene.background);
}
