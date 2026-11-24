import type { InkOceanCue, InkOceanScene } from './ink-ocean-scenes';
import { trialArt } from './trial-art';

const directionShots: readonly [RegExp, string][] = [
  [/the judge looks|only the judge|above the bench/i, trialArt.judge],
  [/confetti rains down|confetti flies back up/i, trialArt.witness],
  [/^The laughter stops\.$/i, trialArt.confetti],
  [/slumps over the desk/i, trialArt.asleep],
  [/a small old woman stands/i, trialArt.motherObjects],
  [/jolts awake|prosecutor sweats/i, trialArt.prosecutor],
  [/cracks race across/i, trialArt.dreamBreaks],
];

const speakerShots: Readonly<Record<string, string | undefined>> = {
  Simone: trialArt.witness,
  Judge: trialArt.judge,
  Prosecutor: trialArt.prosecutor,
  'Old woman': trialArt.motherObjects,
};

function dialoguePages(text: string): string[] {
  // Break at a sentence when possible. All viewers get the same page boundaries.
  const pages: string[] = [];
  let page = '';
  for (const sentence of text.match(/[^.!?]+[.!?]*|[.!?]+/g) ?? []) {
    const words = sentence.trim().split(/\s+/);
    if (page && page.length + sentence.length > 76) {
      pages.push(page);
      page = '';
    }
    for (const word of words) {
      if (page && page.length + word.length + 1 > 88) {
        pages.push(page);
        page = '';
      }
      page += (page ? ' ' : '') + word;
    }
  }
  if (page) pages.push(page);
  return pages;
}

export function trialPages(beats: InkOceanScene[]): InkOceanCue[] {
  return beats.flatMap(beat => {
    let background = trialArt.witness;
    return beat.cues.flatMap(cue => {
      background = speakerShots[cue.speaker] ?? background;
      return (cue.text.match(/\[[^\]]*\]|[^\[]+/g) ?? []).flatMap(part => {
        const direction = part.startsWith('[');
        const text = direction ? part.slice(1, -1).trim() : part.trim();
        if (!text) return [];
        // Performance cues color the actor's delivery without interrupting it.
        if (direction && /^(Smirking|Quietly|Calmly|Looking at the gavel)\.$/.test(text)) return [];
        if (direction) background = directionShots.find(([pattern]) => pattern.test(text))?.[1] ?? background;
        const pages = direction ? [text] : dialoguePages(text);
        return pages.map(text => ({
          ...cue, background, text,
          ...(direction ? { speaker: 'Stage direction', kind: 'direction' as const } : {}),
        }));
      });
    });
  });
}
