import { legendSlides } from './slide-content';
import type { InkOceanCue } from './ink-ocean-scenes';
import type { DialogueStructure } from './shared-slide-data';

const classroomScript: (InkOceanCue & { scene: string; phase?: 'question' | 'result' | 'reveal' })[] = [
  { scene: 'contemporary-heading', speaker: 'Professor Lin', text: 'Contextualism is the idea that what we mean when we say “I know” can change depending on the conversation.' },
  { scene: 'contemporary-heading', speaker: 'Professor Lin', phase: 'question', text: 'What do you see there?' },
  { scene: 'contemporary-heading', speaker: 'Professor Lin', phase: 'result', text: 'Ten seconds, a room full of philosophers, and somehow you’re all wrong. Well, Contemporary Contextualism it is. Read the texts.' },
  { scene: 'contemporary-heading', speaker: 'Professor Lin', text: 'Anyway, long, long ago, when the chalk in this very room was still young, it has a very different name:' },
  { scene: 'contemporary-heading', speaker: 'Professor Lin', phase: 'reveal', text: 'Flexible foundationalism.' },
  ...legendSlides.flatMap(({ id, cues }) => cues.map(line => ({ ...line, scene: id }))),
];

// Scene-local ordinals and the authored cue identify edits without shifting to a
// different line after a source-script revision.
const counts = new Map<string, number>();
const classroomCueKeys = classroomScript.map(cue => {
  const index = counts.get(cue.scene) ?? 0;
  counts.set(cue.scene, index + 1);
  let hash = 2166136261;
  for (const character of cue.speaker + '\0' + cue.text) {
    hash = Math.imul(hash ^ character.codePointAt(0)!, 16777619);
  }
  return `${cue.scene}:${index}:${(hash >>> 0).toString(36)}`;
});

export const openingClassroomScene = 'contemporary-heading';
const relocatedQuestionTextNumber = 999;
export const customCueOffset = 3000;
export const customCueKeyPattern = /^line-[0-9a-f]{32}$/;
export const customCueNumber = (key: string) => customCueOffset + Number.parseInt(key.slice(5, 17), 16);
export const maxAddedCues = 200;

type ClassroomCue = typeof classroomScript[number] & { key: string; number: number; sourceNumber: number; original: boolean; silent?: true };
const authoredByScene = new Map<string, ClassroomCue[]>();
for (const [index, cue] of classroomScript.entries()) {
  const scene = authoredByScene.get(cue.scene) ?? [];
  scene.push({ ...cue, key: classroomCueKeys[index], number: scene.length, sourceNumber: scene.length, original: true });
  authoredByScene.set(cue.scene, scene);
}

export function authoredCues(scene: string) {
  return authoredByScene.get(scene) ?? [];
}

export function editableCueSequence(scene: string) {
  return scene !== 'P1' && authoredCues(scene).some(cue => cue.text);
}

function placeQuiz(cues: ClassroomCue[], after: string | null) {
  const questionIndex = cues.findIndex(cue => cue.phase === 'question');
  const anchorIndex = after === null ? -1 : cues.findIndex(cue => cue.key === after && !cue.silent);
  if (questionIndex < 0 || (after !== null && anchorIndex < 0)) return;
  let position = anchorIndex + 1;
  if (position === questionIndex) return;
  const question = cues[questionIndex];
  if (question.silent) {
    cues.splice(questionIndex, 1);
    if (questionIndex < position) position--;
  } else {
    cues[questionIndex] = { ...question, phase: undefined, number: relocatedQuestionTextNumber };
  }
  cues.splice(position, 0, { ...question, key: 'classroom-quiz', text: '', silent: true });
}

export function buildClassroomScript(structure?: Record<string, DialogueStructure>): ClassroomCue[] {
  if (!structure) return [...authoredByScene.values()].flat();
  return [...authoredByScene].flatMap(([scene, base]) => {
    const edits = structure[scene];
    if (!edits) return base;
    const removed = new Set(edits.removed);
    const after = new Map<string | null, typeof edits.added>();
    for (const cue of edits.added) {
      const siblings = after.get(cue.after) ?? [];
      siblings.push(cue);
      after.set(cue.after, siblings);
    }
    const result: ClassroomCue[] = [];
    function appendAdded(anchor: string | null, from: ClassroomCue) {
      const children = after.get(anchor);
      if (!children) return;
      for (let i = children.length - 1; i >= 0; i--) {
        const child = children[i];
        const cue: ClassroomCue = { scene, key: child.key, text: child.text, speaker: from.speaker,
          speakerId: from.speakerId, kind: from.kind, background: from.background, number: customCueNumber(child.key),
          sourceNumber: from.sourceNumber, original: false };
        if (!removed.has(cue.key)) result.push(cue);
        appendAdded(cue.key, cue);
      }
    }
    appendAdded(null, base[0]);
    for (const cue of base) {
      if (!removed.has(cue.key)) result.push(cue);
      // These cues also drive something other than transcript text.
      else if (cue.phase || cue.background) result.push({ ...cue, silent: true });
      appendAdded(cue.key, cue);
    }
    if (scene === openingClassroomScene && edits.quizAfter !== undefined) placeQuiz(result, edits.quizAfter);
    return result.length ? result : [{ ...base[0], silent: true }];
  });
}
