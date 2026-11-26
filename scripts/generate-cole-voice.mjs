import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { buildSync } from 'esbuild';
import { generateVoiceClips } from './generate-voice-clips.mjs';
import { doorWorldPerformance } from './door-world-performance.mjs';

const voice = '4oeIbMTUt5QeJy4ZX1FC'; // Koichi Yashiro – Deep Cinematic Voice
const model = 'eleven_multilingual_v2';
const root = fileURLToPath(new URL('..', import.meta.url));
const manifestPath = new URL('../src/cole-voice-clips.json', import.meta.url);
const audioDirectory = new URL('../public/voices/cole/', import.meta.url);

const { outputFiles } = buildSync({
  absWorkingDir: root, bundle: true, write: false, format: 'esm',
  stdin: {
    contents: `
      export { buildClassroomScript } from './src/classroom-cues';
      export { isDoorWorldScene } from './src/simone-voice-lines';
      export { spokenText, spokenWords } from './src/timed-voice-words';
    `,
    resolveDir: root,
  },
});
const { buildClassroomScript, isDoorWorldScene, spokenText, spokenWords } =
  await import('data:text/javascript;base64,' + Buffer.from(outputFiles[0].contents).toString('base64'));
const { document: saved } = JSON.parse(readFileSync(new URL('../shared-slides.json', import.meta.url), 'utf8'));

const lines = new Map();
const shared = [];
for (const cue of buildClassroomScript(saved.dialogueStructure)) {
  if (cue.kind || cue.silent || !isDoorWorldScene(cue.scene) || !['Cole', 'Both'].includes(cue.speaker)) continue;
  const text = spokenText(saved.dialogue?.[cue.key] ?? cue.text);
  if (!text) continue;
  const { input, voiceSettings, timingKey, alignWords } = doorWorldPerformance(cue, text, spokenWords);
  const file = audioName(voice, model, input, timingKey, JSON.stringify(voiceSettings));
  lines.set(cue.key, { text, input, file, voiceSettings, alignWords, scene: cue.scene, languageCode: null });
  if (cue.speaker === 'Both') shared.push(cue.key);
}

await generateVoiceClips({
  lines, voice, model, manifestPath, audioDirectory, spokenWords,
  describe: `${lines.size} Cole clips in Door World`,
});

if (!process.exitCode && shared.length) {
  const coleClips = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const simoneClips = JSON.parse(readFileSync(new URL('../src/simone-voice-clips.json', import.meta.url), 'utf8'));
  const check = process.argv.includes('--check');
  let changed = false;
  for (const key of shared) {
    const cole = coleClips[key];
    const simone = simoneClips[key];
    if (!cole) continue; // A sample run may stop before the shared cue.
    if (!simone || cole.text !== simone.text) throw new Error(`Generate Simone’s matching clip for ${key} first.`);
    const file = audioName('door-duet-v2', cole.file, simone.file);
    const output = new URL(file, audioDirectory);
    if (cole.duet?.file === file && existsSync(output)) continue;
    if (check) {
      console.log(`The shared cue ${key} needs both voices mixed.`);
      process.exitCode = 1;
      continue;
    }
    mixChant(cole, simone, output);
    cole.duet = { file, simoneFile: simone.file };
    changed = true;
  }
  if (changed) {
    const temporary = new URL(manifestPath.href + '.tmp');
    writeFileSync(temporary, JSON.stringify(coleClips, null, 2) + '\n');
    renameSync(temporary, manifestPath);
  }
}

function audioName(...parts) {
  return createHash('sha256').update(parts.join('\0')).digest('hex').slice(0, 20) + '.mp3';
}

function mixChant(cole, simone, output) {
  // Fit Cole to the same timings as Simone. The chant’s colon gives both actors a breath before the last word.
  const split = spokenWords(cole.text).findIndex(word => word.text.endsWith(':')) + 1;
  const settings = split > 0 && split < cole.words.length && cole.words[split][0] > cole.words[split - 1][1]
    ? splitChant(cole, simone, split)
    : `[1:a]${fitPhrase(cole.words, simone.words)}[cole];[0:a][cole]amix=inputs=2:weights='1 0.9':normalize=1`;
  const simoneAudio = new URL(`../public/voices/simone/${simone.file}`, import.meta.url);
  execFileSync('ffmpeg', [
    '-v', 'error', '-y', '-i', fileURLToPath(simoneAudio), '-i', fileURLToPath(new URL(cole.file, audioDirectory)),
    '-filter_complex', settings,
    '-ar', '44100', '-b:a', '128k', fileURLToPath(output),
  ]);
}

function splitChant(cole, simone, split) {
  const cut = (cole.words[split - 1][1] + cole.words[split][0]) / 2;
  const lead = fitPhrase(cole.words.slice(0, split), simone.words.slice(0, split), 0, cut);
  const close = fitPhrase(cole.words.slice(split), simone.words.slice(split), cut);
  return `[1:a]asplit[lead][close];[lead]${lead}[a];[close]${close}[b];[0:a][a][b]amix=inputs=3:weights='0.53 0.47 0.47':normalize=0`;
}

function fitPhrase(source, target, start = 0, end) {
  const sourceStart = source[0][0];
  const targetStart = target[0][0];
  const rate = (source.at(-1)[1] - sourceStart) / (target.at(-1)[1] - targetStart);
  const offset = targetStart - (sourceStart - start) / rate;
  return `atrim=start=${start}${end === undefined ? '' : `:end=${end}`},asetpts=PTS-STARTPTS,atempo=${rate},atrim=start=${Math.max(0, -offset)},asetpts=PTS-STARTPTS,adelay=${Math.round(Math.max(0, offset) * 1000)}:all=1`;
}
