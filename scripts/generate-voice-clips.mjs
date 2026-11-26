import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export async function generateVoiceClips({
  lines, voice, model, manifestPath, audioDirectory, describe, spokenWords,
}) {
  const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {};
  function saveManifest() {
    const current = Object.fromEntries([...lines.keys()].flatMap(id => manifest[id] ? [[id, manifest[id]]] : []));
    const temporary = new URL(manifestPath.href + '.tmp');
    writeFileSync(temporary, JSON.stringify(current, null, 2) + '\n');
    renameSync(temporary, manifestPath);
  }

  function isReady(id, { file, text = id }) {
    const clip = manifest[id];
    return clip?.file === file && clip.words.length === spokenWords(text).length && existsSync(new URL(file, audioDirectory));
  }

  const missing = [...lines].filter(([id, line]) => !isReady(id, line));
  console.log(`${describe}, ${missing.length} awaiting audio.`);
  if (process.argv.includes('--check')) {
    process.exitCode = Number(missing.length > 0);
  } else if (missing.length) {
    const key = process.env.ELEVENLABS_API_KEY || readKeychain();
    if (!key) throw new Error('The PHI 102 ElevenLabs API key is unavailable.');
    mkdirSync(audioDirectory, { recursive: true });
    const batch = process.argv.includes('--sample') ? missing.slice(0, 1) : missing;
    const characters = batch.reduce((sum, [, { input }]) => sum + input.length, 0);
    console.log(`Requesting ${batch.length} clips with ${characters} input characters.`);
    // A pair stays below the Starter tier's stated concurrency for this model.
    for (let offset = 0; offset < batch.length; offset += 2) {
      const results = await Promise.allSettled(batch.slice(offset, offset + 2).map(generate));
      for (const result of results) {
        if (result.status === 'fulfilled') {
          const { id, clip } = result.value;
          manifest[id] = clip;
        }
      }
      saveManifest();
      const failed = results.find(result => result.status === 'rejected');
      if (failed) throw failed.reason;
      console.log(`Saved ${Math.min(batch.length, offset + 2)}/${batch.length} new clips.`);
    }

    async function generate([id, {
      text = id, input, file, voiceSettings, scene, voice: lineVoice = voice, model: lineModel = model, languageCode = 'en',
      alignWords,
    }]) {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${lineVoice}/with-timestamps?output_format=mp3_44100_128`, {
        method: 'POST',
        headers: { 'xi-api-key': key, 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, model_id: lineModel, language_code: languageCode ?? undefined, voice_settings: voiceSettings }),
        signal: AbortSignal.timeout(90_000),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(`ElevenLabs returned ${response.status} for ${scene} (${error.detail?.status ?? 'speech request'}).`);
      }
      const result = await response.json();
      const getWords = alignWords ?? (alignment => wordTimes(text, alignment, spokenWords));
      const words = getWords(result.alignment) ?? getWords(result.normalized_alignment);
      if (!result.audio_base64 || words?.length !== spokenWords(text).length) {
        const directory = mkdtempSync(join(tmpdir(), 'phi102-voice-response-'));
        writeFileSync(join(directory, 'response.json'), JSON.stringify({ id, text, file, result }));
        throw new Error(`ElevenLabs did not return matching audio and word timing for ${scene}. Response saved in ${directory}.`);
      }
      writeFileSync(new URL(file, audioDirectory), Buffer.from(result.audio_base64, 'base64'));
      return { id, clip: { file, words, ...(id !== text && { text }), ...(alignWords && { phrases: true }) } };
    }
  } else if (Object.keys(manifest).length !== lines.size) saveManifest();
}

function readKeychain() {
  try {
    return execFileSync('security', ['find-generic-password', '-a', process.env.USER,
      '-s', 'phi102-elevenlabs', '-w'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

function wordTimes(text, alignment, spokenWords) {
  if (!alignment?.characters?.length) return;
  const { characters, character_start_times_seconds: starts, character_end_times_seconds: ends } = alignment;
  const aligned = characters.join('');
  const spokenOffset = aligned.lastIndexOf(text);
  const alignedWords = spokenOffset >= 0
    ? spokenWords(text).map(word => ({ ...word, offset: word.offset + spokenOffset }))
    // Mask performance instructions without shifting the provider’s character offsets.
    : spokenWords(aligned.replace(/\[[^\]]*\]|<break time="[\d.]+s"\s*\/>/g, tag => ' '.repeat(tag.length)));
  const words = spokenWords(text);
  const matchable = word => word.normalize('NFKC').replace(/\p{P}/gu, '').toLowerCase();
  if (alignedWords.length !== words.length ||
    alignedWords.some((word, i) => matchable(word.text) !== matchable(words[i].text))) return;
  let offset = 0;
  const characterIndex = new Map();
  for (const [index, character] of characters.entries()) {
    for (let i = 0; i < character.length; i++) characterIndex.set(offset++, index);
  }
  const result = alignedWords.map(word => [
    starts[characterIndex.get(word.offset)],
    ends[characterIndex.get(word.offset + word.text.length - 1)],
  ]);
  if (result.some(([start, end]) => !Number.isFinite(start) || !Number.isFinite(end) || start < 0 || start > end)) return;
  return result.map(times => times.map(time => Math.round(time * 1000) / 1000));
}
