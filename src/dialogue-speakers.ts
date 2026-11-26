import professor from './assets/professor-lin-classroom.webp';
import simone from './assets/full-body-cast/simone.webp';
import cole from './assets/full-body-cast/cole.webp';
import type { InkOceanCue } from './ink-ocean-scenes';
import { trialArt } from './trial-art';
import './dialogue-speakers.css';

// A face's center is a percentage of the original frame. The crop is square
// and its side is a percentage of the frame height, independent of the aspect ratio.
type Face = readonly [url: string, x: number, y: number, crop: number];
type SpeakerAppearance = { name: string; faces: readonly Face[] };
const ink = '/generated/backgrounds/ink-ocean/';
const cast: Readonly<Record<string, Face>> = {
  'Professor Lin': [professor, 55, 24, 46],
  Simone: [simone, 61, 15, 21],
  Cole: [cole, 56, 15, 20],
  Man: [ink + 'L1-guardian-asks-why.webp', 68, 22, 24],
  'Question mark': [ink + 'L1-guardian-asks-why.webp', 22, 41, 78],
  Woman: [ink + 'L2-neither-did-her-hand.webp', 18, 22, 45],
  Y1: [ink + 'L2-neither-did-her-hand.webp', 39, 14, 22],
  Y2: [ink + 'L2-neither-did-her-hand.webp', 50, 23, 21],
  Y3: [ink + 'L2-neither-did-her-hand.webp', 62, 13, 21],
  Y4: [ink + 'L2-neither-did-her-hand.webp', 73, 24, 21],
  SOWHAT: [ink + 'L2-neither-did-her-hand.webp', 62.6, 32.3, 13],
  Prophecy: [ink + 'L3-whypocalypse-prophecy.webp', 48, 57, 44],
  Pyrrho: [ink + 'L4-pyrrho-at-the-bog-y-refined.webp', 31, 27, 31],
  Peirce: [ink + 'L4-peirce-on-turtles-two-ys.webp', 50, 11, 21],
  Neurath: [ink + 'L4-neurath-on-deck-three-ys-sowhat.webp', 30, 25, 38],
  Descartes: [ink + 'L5-the-fourth-answer-v2.webp', 30, 24, 42],
  Stranger: [ink + 'L7-the-stranger.webp', 45, 13, 24],
  Judge: [trialArt.judge, 50, 34, 37],
  Prosecutor: [trialArt.prosecutor, 61, 26, 40],
  'Old woman': [trialArt.motherObjects, 30, 28, 32],
};

export function dialogueSpeaker(cue: Pick<InkOceanCue, 'speaker' | 'speakerId' | 'kind'>, scene: string, yTurn = 0): SpeakerAppearance | undefined {
  if (cue.kind || !cue.speaker) return;
  if (cue.speaker === 'Narrator') {
    if (/^(?:L[0-7](?:-|$)|regress-)/.test(scene)) return { name: 'Simone (Narrator)', faces: [cast.Simone] };
    return;
  }
  if (cue.speaker === 'Both') return { name: 'Simone & Cole', faces: [cast.Simone, cast.Cole] };
  const number = /^Y[₁₂₃₄]$/.test(cue.speaker) ? '₁₂₃₄'.indexOf(cue.speaker[1]) : -1;
  const key = cue.speakerId ?? (number >= 0 ? `Y${number + 1}` : cue.speaker === 'Y' ? `Y${yTurn % 4 + 1}` : cue.speaker);
  const face = cast[key];
  return { name: cue.speaker, faces: face ? [face] : [] };
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
  for (const [url, x, y, crop] of speaker.faces) {
    const face = document.createElement('span');
    face.className = 'dialogue-speaker-face';
    const image = document.createElement('img');
    image.src = url;
    image.alt = '';
    image.loading = 'lazy';
    image.decoding = 'async';
    image.draggable = false;
    image.style.setProperty('--dialogue-face-height', 10000 / crop + '%');
    image.style.setProperty('--dialogue-face-x', -x + '%');
    image.style.setProperty('--dialogue-face-y', -y + '%');
    face.append(image);
    faces.append(face);
  }
  element.append(faces);
}

export function addDialogueSpeaker(row: HTMLElement, speaker: SpeakerAppearance) {
  const element = document.createElement('span');
  element.className = 'dialogue-speaker';
  row.classList.add('has-dialogue-speaker');
  showDialogueSpeaker(element, speaker);
  row.append(element);
}
