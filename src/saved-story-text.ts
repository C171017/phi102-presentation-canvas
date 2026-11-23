import snapshot from '../story-text.json';
import type { StoryEdits } from './story-text';

export const savedStoryText: StoryEdits = snapshot;

export function inkOceanStoryTextId(scene: string) {
  return 'ink-ocean-' + scene;
}
