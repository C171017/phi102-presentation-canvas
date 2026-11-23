export const storyTextEndpoint = '/__canvas/story-text';
export const storyTitleLimit = 400;
export const storyBodyLimit = 24000;

export type StoryText = { title: string; paragraphs: readonly string[] };
export type StoryScene = StoryText & {
  id: string;
  summary: string;
  illustration?: { src: string; alt: string; imageOnly?: true };
};
export type SavedStoryText = StoryText & { revision: string };
export type StoryEdits = Partial<Record<string, SavedStoryText>>;

export function isStoryText(value: unknown): value is StoryText {
  if (!value || typeof value !== 'object' || !('title' in value) || !('paragraphs' in value)) return false;
  const { title, paragraphs } = value;
  return typeof title === 'string' && Boolean(title.trim()) && title.length <= storyTitleLimit &&
    Array.isArray(paragraphs) && paragraphs.length > 0 &&
    paragraphs.every(paragraph => typeof paragraph === 'string' && paragraph.trim()) &&
    paragraphs.join('\n\n').length <= storyBodyLimit;
}
