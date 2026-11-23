import { inkOceanStory } from './ink-ocean-story';
import type { StoryScene } from './story-text';

export type InkOceanSceneId = keyof typeof inkOceanStory | 'L6';

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

function storySlide(id: keyof typeof inkOceanStory): InkOceanScene {
  const { title, summary, illustration, paragraphs }: Omit<StoryScene, 'id'> = inkOceanStory[id];
  return {
    id,
    title,
    takeaway: summary,
    background: illustration?.src,
    imageOnly: illustration?.imageOnly,
    // A title card occupies its own navigation step without a transcript.
    cues: illustration?.imageOnly ? [{ speaker: '', text: '' }] : paragraphs.map(cueFromParagraph),
  };
}

const schoolChoice: InkOceanScene = {
  id: 'L6',
  title: 'Choose Your School',
  takeaway: 'The foundationalist’s dilemma · What makes a starting point legitimate?',
  cues: [],
};

export const legendSlides = [
  ...(Object.keys(inkOceanStory) as (keyof typeof inkOceanStory)[])
    .filter(id => id !== 'L6-A' && id !== 'L6-B')
    .map(storySlide),
  schoolChoice,
];

export const schoolScenes = {
  'L6-A': storySlide('L6-A'),
  'L6-B': storySlide('L6-B'),
};

export function hasEstablishingShot(scene: InkOceanScene, index: number): boolean {
  return index === 0 && Boolean(scene.background);
}
