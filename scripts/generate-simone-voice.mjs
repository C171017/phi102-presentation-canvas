import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { buildSync } from 'esbuild';
import { generateVoiceClips } from './generate-voice-clips.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const voice = 'exsUS4vynmxd379XN4yO'; // Blondie - Conversational
const model = 'eleven_v4_turbo';
const doorVoice = '9wuWjGIR6FYAWDzxx9um'; // Amuro - Cute & Mature
const doorModel = 'eleven_multilingual_v2';
const manifestPath = new URL('../src/simone-voice-clips.json', import.meta.url);
const audioDirectory = new URL('../public/voices/simone/', import.meta.url);

// Use the same paginated, saved dialogue the canvas and the game display.
const compiled = buildSync({
  absWorkingDir: root, bundle: true, write: false, format: 'esm',
  stdin: { contents: `
    export { buildClassroomScript } from './src/classroom-cues';
    export { isDoorWorldScene, isSimoneCue } from './src/simone-voice-lines';
    export { spokenText, spokenWords } from './src/timed-voice-words';
    export { trialDialogueText, trialShout } from './src/trial-script';
  `, resolveDir: root, loader: 'ts' },
});
const { buildClassroomScript, isDoorWorldScene, isSimoneCue, spokenText, spokenWords, trialDialogueText, trialShout } =
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

function trialPerformance(text) {
  if (/treasures were never found/i.test(text)) {
    return `[hushed, telling a story] ${text.replace('Until now.', '[with sudden certainty] Until now.')}`;
  }
  if (/^That’s the legend/i.test(text)) {
    return `[matter-of-fact] ${text.replace('It’s fake.', '[low and emphatic] It’s fake.')}`;
  }
  if (/^And that gavel/i.test(text)) return `[with dry amusement and a clear emphasis on gavel] ${text}`;
  if (/^My Lord, may I borrow/i.test(text)) return `[politely, with a bright questioning lift] ${text}`;
  if (/so that’s how it works/i.test(text)) return `[clear conversational voice, with a bright lift of realization] ${text}`;
  if (/^And gavels don’t/i.test(text)) return `[quick and incredulous, building emphasis] ${text}`;
  if (/^You all saw it/i.test(text)) {
    return `[firmly] ${text.replace('Which real world', '[pointedly, slowing down] Which real world')}`;
  }
  if (/Any objections\?/i.test(text)) {
    const direction = /^The defendant/i.test(text) ? 'formal and clearly projected'
      : /^The prosecutor/i.test(text) ? 'dry and faintly amused'
        : 'low and utterly certain';
    return `[${direction}] ${text.replace('Any objections?', '[challenging, with a questioning lift] Any objections?')}`;
  }
  return `[poised, with firm conviction] ${text}`;
}

const lines = new Map();
const cues = buildClassroomScript(saved.dialogueStructure).filter(isSimoneCue);
for (const cue of cues) {
  const edited = saved.dialogue?.[cue.key];
  const isTrial = cue.scene === 'P1';
  const text = spokenText(isTrial ? trialDialogueText(cue.text, edited) : edited ?? cue.text);
  const isDoor = isDoorWorldScene(cue.scene);
  const id = isDoor ? cue.key : text;
  if (!text || lines.has(id) || (isTrial && text.toUpperCase() === trialShout(cue.text))) continue;
  if (isDoor) {
    const voiceSettings = { stability: 0.45, similarity_boost: 0.8 };
    const file = createHash('sha256').update([doorVoice, doorModel, text, JSON.stringify(voiceSettings)].join('\0'))
      .digest('hex').slice(0, 20) + '.mp3';
    lines.set(id, {
      text, input: text, file, voiceSettings, scene: cue.scene, voice: doorVoice, model: doorModel, languageCode: null,
    });
    continue;
  }
  const input = isTrial ? trialPerformance(text) : `[${direction(cue, text)}] ${text}`;
  const voiceSettings = isTrial ? { stability: 0.35 } : undefined;
  const generation = [voice, model, input];
  if (voiceSettings) generation.push(JSON.stringify(voiceSettings));
  const file = createHash('sha256').update(generation.join('\0')).digest('hex').slice(0, 20) + '.mp3';
  lines.set(text, { input, file, voiceSettings, scene: cue.scene });
}

const court = [...lines.values()].filter(line => line.scene === 'P1').length;
const door = [...lines.values()].filter(line => isDoorWorldScene(line.scene)).length;
await generateVoiceClips({
  lines, voice, model, manifestPath, audioDirectory, spokenWords,
  describe: `${lines.size} clips (${court} courtroom, ${door} Door World)`,
});
