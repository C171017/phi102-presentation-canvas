import { legendSlides } from './slide-content';
import type { InkOceanCue } from './ink-ocean-scenes';

export const classroomScript: (InkOceanCue & { scene: string; phase?: 'question' | 'reveal' })[] = [
  { scene: 'contemporary-heading', speaker: 'Professor Lin', text: 'Contextualism is the idea that what we mean when we say “I know” can change depending on the conversation.' },
  { scene: 'contemporary-heading', speaker: 'Professor Lin', phase: 'question', text: 'What do you see there?' },
  { scene: 'contemporary-heading', speaker: 'Professor Lin', text: 'Ten seconds, a room full of philosophers, and somehow you’re all wrong. Well, Contemporary Contextualism it is. Read the texts.' },
  { scene: 'contemporary-heading', speaker: 'Professor Lin', text: 'Anyway, long, long ago, when the chalk in this very room was still young, it has a very different name:' },
  { scene: 'contemporary-heading', speaker: 'Professor Lin', phase: 'reveal', text: 'Flexible foundationalism.' },
  ...legendSlides.flatMap(({ id, cues }) => cues.map(line => ({ ...line, scene: id }))),
];

// Scene-local ordinals and the authored cue identify edits without shifting to a
// different line after a source-script revision.
const counts = new Map<string, number>();
export const classroomCueKeys = classroomScript.map(cue => {
  const index = counts.get(cue.scene) ?? 0;
  counts.set(cue.scene, index + 1);
  let hash = 2166136261;
  for (const character of cue.speaker + '\0' + cue.text) {
    hash = Math.imul(hash ^ character.codePointAt(0)!, 16777619);
  }
  return `${cue.scene}:${index}:${(hash >>> 0).toString(36)}`;
});
export const classroomCueScenes = new Map(classroomCueKeys.map((key, index) => [key, classroomScript[index].scene]));
