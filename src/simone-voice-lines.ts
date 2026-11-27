export function simoneNarratesScene(scene: string) {
  return /^(?:L[0-7](?:-|$)|regress-)/.test(scene);
}

export function isDoorWorldScene(scene: string) {
  return /^P2(?:-|$)/.test(scene);
}

export function isSimoneCue(cue: { speaker: string; scene: string; kind?: string; silent?: boolean }) {
  if (cue.scene === 'P1' || cue.kind || cue.silent) return false;
  return cue.speaker === 'Simone' || cue.speaker === 'Both' ||
    (cue.speaker === 'Narrator' && simoneNarratesScene(cue.scene));
}

export function spokenWords(text: string) {
  const words: { text: string; offset: number }[] = [];
  let offset = 0;
  for (const part of text.split(/(\[[^\[\]]*\])/g)) {
    if (!part.startsWith('[') || !part.endsWith(']')) {
      for (const word of part.matchAll(/\S+/g)) {
        words.push({ text: word[0], offset: offset + word.index });
      }
    }
    offset += part.length;
  }
  return words;
}

export function spokenText(text: string) {
  return spokenWords(text).map(word => word.text).join(' ');
}
