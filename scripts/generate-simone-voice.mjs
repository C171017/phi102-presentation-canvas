import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { buildSync } from 'esbuild';
import { generateVoiceClips } from './generate-voice-clips.mjs';
import { doorWorldPerformance } from './door-world-performance.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const voice = 'exsUS4vynmxd379XN4yO'; // Blondie - Conversational
const model = 'eleven_v4_turbo';
const doorVoice = 'OSwaPSNdfituxkWcjlkR'; // Kano - Cute & Anime
const doorModel = 'eleven_multilingual_v2';
const manifestPath = new URL('../src/simone-voice-clips.json', import.meta.url);
const audioDirectory = new URL('../public/voices/simone/', import.meta.url);

// Use the saved presentation cues.
const compiled = buildSync({
  absWorkingDir: root, bundle: true, write: false, format: 'esm',
  stdin: { contents: `
    export { buildClassroomScript } from './src/classroom-cues';
    export { isDoorWorldScene, isSimoneCue } from './src/simone-voice-lines';
    export { spokenText, spokenWords } from './src/timed-voice-words';
  `, resolveDir: root, loader: 'ts' },
});
const { buildClassroomScript, isDoorWorldScene, isSimoneCue, spokenText, spokenWords } =
  await import('data:text/javascript;base64,' + Buffer.from(compiled.outputFiles[0].contents).toString('base64'));
const { document: saved } = JSON.parse(readFileSync(new URL('../shared-slides.json', import.meta.url), 'utf8'));

function direction(cue, text) {
  if (cue.speaker === 'Narrator') {
    if (cue.scene.startsWith('regress-') || cue.scene === 'L6-A' || cue.scene === 'L6-B') {
      return 'matter-of-fact, with dry humor';
    }
    if (cue.scene === 'L2' || cue.scene === 'L3-continued') return 'softly, with growing unease';
    return 'warm, measured storytelling';
  }
  if (/I’m off|I'm off/.test(text)) return 'very softly, after a breath';
  return 'firm and deliberate';
}

const lines = new Map();
const cues = buildClassroomScript(saved.dialogueStructure).filter(isSimoneCue);
for (const cue of cues) {
  const edited = saved.dialogue?.[cue.key];
  const text = spokenText(edited ?? cue.text);
  const isDoor = isDoorWorldScene(cue.scene);
  const id = isDoor ? cue.key : text;
  if (!text || lines.has(id)) continue;
  if (isDoor) {
    const { input, voiceSettings, timingKey, alignWords } = doorWorldPerformance(cue, text, spokenWords);
    const file = createHash('sha256').update([doorVoice, doorModel, input, timingKey, JSON.stringify(voiceSettings)].join('\0'))
      .digest('hex').slice(0, 20) + '.mp3';
    lines.set(id, {
      text, input, file, voiceSettings, alignWords, scene: cue.scene, voice: doorVoice, model: doorModel, languageCode: null,
    });
    continue;
  }
  const input = `[${direction(cue, text)}] ${text}`;
  const file = createHash('sha256').update([voice, model, input].join('\0')).digest('hex').slice(0, 20) + '.mp3';
  lines.set(text, { input, file, scene: cue.scene });
}

const door = [...lines.values()].filter(line => isDoorWorldScene(line.scene)).length;
await generateVoiceClips({
  lines, voice, model, manifestPath, audioDirectory, spokenWords,
  describe: `${lines.size} clips (${door} Door World)`,
});
