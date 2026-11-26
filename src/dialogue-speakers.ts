import type { InkOceanCue } from './ink-ocean-scenes';
import { simoneNarratesScene } from './simone-voice-lines';
import './dialogue-speakers.css';

type SpeakerAppearance = { id: string; name: string; faces: readonly number[] };

// Cell indices in dialogue-speaker-profiles.webp, read across each of its five columns.
const cast: Readonly<Record<string, number>> = {
  'Professor Lin': 0,
  Simone: 1,
  Cole: 2,
  Man: 3,
  'Question mark': 4,
  Woman: 5,
  Y1: 6,
  Y2: 7,
  Y3: 8,
  Y4: 9,
  SOWHAT: 10,
  Prophecy: 11,
  Pyrrho: 12,
  Peirce: 13,
  Neurath: 14,
  Descartes: 15,
  Stranger: 16,
};

export function dialogueSpeaker(cue: Pick<InkOceanCue, 'speaker' | 'speakerId' | 'kind'>, scene: string, yTurn = 0): SpeakerAppearance | undefined {
  if (cue.kind || !cue.speaker || /^P1(?:-|$)/.test(scene)) return;
  if (cue.speaker === 'Narrator') {
    if (simoneNarratesScene(scene)) return { id: 'Simone', name: 'Simone (Narrator)', faces: [cast.Simone] };
    return;
  }
  if (cue.speaker === 'Both') return { id: 'Both', name: 'Simone & Cole', faces: [cast.Simone, cast.Cole] };
  const number = /^Y[₁₂₃₄]$/.test(cue.speaker) ? '₁₂₃₄'.indexOf(cue.speaker[1]) : -1;
  const key = cue.speakerId ?? (number >= 0 ? `Y${number + 1}` : cue.speaker === 'Y' ? `Y${yTurn % 4 + 1}` : cue.speaker);
  const face = cast[key];
  return { id: key, name: cue.speaker, faces: face === undefined ? [] : [face] };
}

export function showDialogueSpeaker(element: HTMLElement, speaker?: SpeakerAppearance) {
  element.replaceChildren();
  element.hidden = !speaker;
  if (!speaker) return;
  const name = document.createElement('span');
  name.className = 'dialogue-speaker-name';
  name.textContent = speaker.name;
  element.append(name);
  if (!speaker.faces.length) return;
  const faces = document.createElement('span');
  faces.className = 'dialogue-speaker-faces';
  for (const cell of speaker.faces) {
    const face = document.createElement('span');
    face.className = 'dialogue-speaker-face';
    face.setAttribute('aria-hidden', 'true');
    face.style.backgroundPosition = `${(cell % 5) * 25}% ${Math.floor(cell / 5) * 100 / 3}%`;
    faces.append(face);
  }
  element.append(faces);
}

export function addDialogueSpeaker(row: HTMLElement, speaker: SpeakerAppearance) {
  const element = document.createElement('span');
  element.className = 'dialogue-speaker';
  row.classList.add('has-dialogue-speaker');
  row.dataset.dialogueSpeaker = speaker.id;
  showDialogueSpeaker(element, speaker);
  row.append(element);
}

export function groupDialogueLabels(rows: Iterable<HTMLElement>) {
  let previousSpeaker: string | undefined;
  for (const row of rows) {
    if (row.hidden) continue;
    const speaker = row.dataset.dialogueSpeaker;
    if (!speaker) continue;
    const label = row.querySelector<HTMLElement>(':scope > .dialogue-speaker');
    const repeated = speaker === previousSpeaker;
    if (label && label.hidden !== repeated) label.hidden = repeated;
    previousSpeaker = speaker;
  }
}
