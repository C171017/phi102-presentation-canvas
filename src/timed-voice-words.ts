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
