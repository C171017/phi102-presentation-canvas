import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { buildSync } from 'esbuild';
import { generateVoiceClips } from './generate-voice-clips.mjs';

const voice = 'wo6udizrrtpIxWGp2qJk'; // Northern Terry
const model = 'eleven_v4_turbo';
const root = fileURLToPath(new URL('..', import.meta.url));
const compiled = buildSync({
  absWorkingDir: root, bundle: true, write: false, format: 'esm',
  stdin: {
    contents: `
      export { buildClassroomScript, unlabeledYTurn } from './src/classroom-cues';
      export { spokenText, spokenWords } from './src/timed-voice-words';
    `,
    resolveDir: root,
  },
});
const { buildClassroomScript, unlabeledYTurn, spokenText, spokenWords } = await import(
  'data:text/javascript;base64,' + Buffer.from(compiled.outputFiles[0].contents).toString('base64')
);
const { document: saved } = JSON.parse(readFileSync(new URL('../shared-slides.json', import.meta.url), 'utf8'));

const whyDirections = [
  'low, husky voice',
  'a little higher, alert and genuinely curious',
  'higher and brighter, quick and incredulous',
  'high and animated, with a sharp rising question',
];

const lines = new Map();
for (const cue of buildClassroomScript(saved.dialogueStructure)) {
  const part = voicePart(cue);
  if (!part) continue;
  const text = spokenText(saved.dialogue?.[cue.key] ?? cue.text);
  if (!text) continue;
  const scene = cue.sourceScene ?? cue.scene;
  const input = performance(text, part, scene);
  const voiceSettings = { stability: part === 'sowhat' ? 0.3 : 0.45 };
  const file = createHash('sha256').update([cue.key, voice, model, input, JSON.stringify(voiceSettings)].join('\0'))
    .digest('hex').slice(0, 20) + '.mp3';
  lines.set(cue.key, { text, input, file, voiceSettings, scene });
}

await generateVoiceClips({
  lines, voice, model, spokenWords, describe: `${lines.size} YYYY SOWATT and guardian cues`,
  manifestPath: new URL('../src/sowatt-voice-clips.json', import.meta.url),
  audioDirectory: new URL('../public/voices/sowatt/', import.meta.url),
});

function voicePart(cue) {
  if (cue.kind || cue.silent) return;
  if (cue.speaker === 'Question mark') return 'guardian';
  if (cue.speaker.toUpperCase() === 'SOWHAT') return 'sowhat';
  const number = /^Y([1-4₁₂₃₄])$/.exec(cue.speakerId ?? cue.speaker)?.[1];
  if (number) return '₁₂₃₄'.indexOf(number) + 1 || Number(number);
  if (cue.speaker === 'Y') return unlabeledYTurn(cue) % 4 + 1;
}

function performance(text, part, scene) {
  if (part === 'guardian') return `[deadpan] ${text}`;
  if (part !== 'sowhat') {
    const emphasized = part === 4 ? text.replace(/(?<=\? )Why\b/g, '[even more incredulous] Why') : text;
    return `[${whyDirections[part - 1]}] ${emphasized}`;
  }
  const [opening, followup] = ({
    L2: ['mischievous, a sharp pitch leap on What', 'a hushed, urgent warning'],
    L3: ['incredulous', 'gleefully'],
    'regress-coherentism': ['exaggerated playful disbelief', 'dry and teasing, with a sly lift on too'],
    'regress-foundationalism': ['mischievously', 'whispers'],
  })[scene] ?? ['mischievous and wildly questioning', 'dry and pointed'];
  return `[${opening}] ${text.replace(/^(So what\?)\s+(?=\S)/i, `$1 [${followup}] `)}`;
}
