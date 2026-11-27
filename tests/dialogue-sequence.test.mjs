import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { buildSync } from 'esbuild';

const bundle = buildSync({
  stdin: {
    contents: "export * from './classroom-cues'; export * from './live-protocol'; export { slides } from './slide-content';",
    resolveDir: fileURLToPath(new URL('../src/', import.meta.url)),
  },
  bundle: true, write: false, format: 'esm',
});
const { authoredCues, buildClassroomScript, customCueNumber, inkPassageStarts, joinInkPassageEdits,
  firstPresentationCue, establishingCueOffset, transcriptPreviewCue, customCueOffset, slides } =
  await import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].contents).toString('base64'));

const id = n => 'line-' + n.toString(16).padStart(12, '0') + '0'.repeat(20);
const scene = 'contemporary-heading';
const classroom = structure => buildClassroomScript(structure && { [scene]: structure }).filter(cue => cue.scene === scene);

test('room defaults start dialogue slides on their artwork and reserve a separate cue for silent preview', () => {
  const initialCue = key => firstPresentationCue(slides.findIndex(slide => slide.members[0] === key));
  for (const key of [scene, 'L0', 'L4', 'P2-arrival']) assert.equal(initialCue(key), establishingCueOffset, key);
  assert.equal(initialCue('access-heading'), 0);
  assert.ok(transcriptPreviewCue > establishingCueOffset && transcriptPreviewCue < customCueOffset * 2);
});

test('a voice cue can retry below 90%, plays silently after completion, and resets on a fresh visit', () => {
  const { outputFiles } = buildSync({
    entryPoints: [fileURLToPath(new URL('../src/timed-dialogue.ts', import.meta.url))],
    bundle: true, write: false, format: 'iife', globalName: 'dialogue', loader: { '.css': 'empty' },
  });
  let audio, playCount = 0;
  class Audio extends EventTarget {
    duration = 10;
    constructor() { super(); audio = this; }
    set src(_) { this.currentTime = 0; }
    play() { playCount++; return Promise.resolve(); }
    pause() {}
  }
  const text = 'Everything is made of belief. And belief is ink.';
  const target = { textContent: text, replaceChildren() {} };
  const document = Object.assign(new EventTarget(), {
    createDocumentFragment: () => ({ append() {} }),
    createElement: () => ({ classList: { toggle() {} } }),
  });
  const context = { Audio, document, AbortController, DOMException, requestAnimationFrame() {}, cancelAnimationFrame() {} };
  runInNewContext(outputFiles[0].text, context);
  const voice = context.dialogue.createDialogueVoice();
  const play = (cue = 'first') => voice.play(target, text, cue);
  const advanceAudio = time => { audio.dispatchEvent(new Event('playing')); audio.currentTime = time; };
  assert.equal(play(), true);
  advanceAudio(8.99);
  voice.stop();
  assert.equal(play(), true);
  advanceAudio(9);
  voice.stop();
  assert.equal(play(), false);
  assert.equal(playCount, 2);

  assert.equal(play('second'), true, 'identical text can appear in a different cue');
  advanceAudio(10);
  audio.dispatchEvent(new Event('ended'));
  assert.equal(play('second'), false);
  voice.resetVisit();
  assert.equal(play(), true);
  assert.equal(play('second'), true);
  voice.stop();
});

test('inserting a line keeps the original quiz and reveal cue numbers', () => {
  const [first, question, result, bridge, reveal] = authoredCues(scene);
  const extra = { key: id(1), after: question.key, text: 'New line after the quiz.' };
  const firstExtra = { key: id(2), after: null, text: 'New introductory line.' };
  const changes = classroom({ added: [extra, firstExtra], removed: [bridge.key] });
  assert.deepEqual(changes.map(cue => cue.key), [firstExtra.key, first.key, question.key, extra.key, result.key, reveal.key]);
  assert.equal(changes.find(cue => cue.phase === 'question').number, 1);
  assert.equal(changes.find(cue => cue.phase === 'reveal').number, 4);
  assert.equal(changes.find(cue => cue.key === extra.key).number, customCueNumber(extra.key));
  assert.equal(changes.find(cue => cue.key === extra.key).speaker, question.speaker);
  assert.equal(classroom().length, 5);
});

test('newer insertions follow their anchor immediately and survive its removal', () => {
  const [first, question] = authoredCues(scene);
  const old = { key: id(1), after: first.key, text: 'Older addition.' };
  const inner = { key: id(2), after: old.key, text: 'Nested addition.' };
  const recent = { key: id(3), after: first.key, text: 'Newer addition.' };
  const changes = classroom({ added: [old, inner, recent], removed: [first.key, old.key] });
  assert.deepEqual(changes.slice(0, 3).map(cue => cue.key), [recent.key, inner.key, question.key]);
  assert.equal(changes[1].sourceNumber, first.number);
});

test('removing classroom text keeps the quiz, result and reveal as silent events', () => {
  const [first, question, result, bridge, reveal] = authoredCues(scene);
  const cues = classroom({ added: [], removed: [question.key, result.key, reveal.key] });
  assert.deepEqual(cues.filter(cue => !cue.silent).map(cue => cue.key), [first.key, bridge.key]);
  assert.deepEqual(cues.filter(cue => cue.silent).map(cue => [cue.phase, cue.number]),
    [['question', 1], ['result', 2], ['reveal', 4]]);
});

test('removing all ordinary lines leaves a silent cue on the slide', () => {
  const id = 'L3-continued';
  const original = authoredCues(id);
  const updated = buildClassroomScript({ [id]: { added: [], removed: original.map(cue => cue.key) } })
    .filter(cue => cue.scene === id);
  assert.equal(updated.length, 1);
  assert.equal(updated[0].key, original[0].key);
  assert.equal(updated[0].silent, true);
});

test('removing wording from an artwork transition keeps its background', () => {
  const id = 'P2-1';
  const transition = authoredCues(id).find(cue => cue.background);
  assert.ok(transition);
  const updated = buildClassroomScript({ [id]: { added: [], removed: [transition.key] } })
    .find(cue => cue.key === transition.key);
  assert.equal(updated.silent, true);
  assert.equal(updated.background, transition.background);
});

test('moving the quiz preserves its wire cue and leaves the original wording in place', () => {
  const [first, question, result, bridge, reveal] = authoredCues(scene);
  const cues = classroom({ added: [], removed: [], quizAfter: bridge.key });
  assert.deepEqual(cues.map(cue => cue.key), [first.key, question.key, result.key, bridge.key, 'classroom-quiz', reveal.key]);
  assert.equal(cues[1].text, question.text);
  assert.equal(cues[1].phase, undefined);
  assert.equal(cues[4].phase, 'question');
  assert.equal(cues[4].number, 1);
  assert.equal(cues[4].silent, true);
});

test('moving a quiz with removed wording produces a single silent event', () => {
  const [, question, , , reveal] = authoredCues(scene);
  const cues = classroom({ added: [], removed: [question.key], quizAfter: reveal.key });
  assert.equal(cues.length, 5);
  assert.equal(cues.filter(cue => cue.phase === 'question').length, 1);
  assert.equal(cues.at(-1).number, 1);
  assert.equal(cues.at(-1).silent, true);
});


test('every Y sentence starts with Why and each SOWHAT cue opens with So what?', () => {
  const sentences = new Intl.Segmenter('en', { granularity: 'sentence' });
  const lines = buildClassroomScript().filter(cue => !cue.kind && !cue.silent);
  const yLines = lines.filter(cue => /^Y[₁₂₃₄1-4]?$/.test(cue.speaker));
  const sowhatLines = lines.filter(cue => cue.speaker === 'SOWHAT');
  assert.ok(yLines.length && sowhatLines.length);
  for (const cue of yLines) {
    const text = cue.text.replace(/\[[^\]]*\]/g, '').trim();
    for (const { segment } of sentences.segment(text)) {
      assert.match(segment.trimStart(), /^Why\b/, cue.key);
    }
  }
  for (const cue of sowhatLines) {
    assert.match(cue.text.replace(/\[[^\]]*\]/g, '').trimStart(), /^So what\?/, cue.key);
  }
});


const firstGreatInkwellCue = inkPassageStarts.get('regress-problem');
const firstBirthCue = inkPassageStarts.get('regress-problem-birth');

test('The opening uses three backgrounds in order and keeps the original edit keys', () => {
  const cues = authoredCues('L0');
  assert.equal(authoredCues('regress-problem').length, 0);
  assert.equal(authoredCues('regress-problem-birth').length, 0);
  assert.equal(cues[0].background, undefined);
  assert.equal(firstGreatInkwellCue, cues[3]);
  assert.match(firstGreatInkwellCue.background, /L1-guardian-asks-why\.webp$/);
  assert.equal(cues[4].key, 'regress-problem:1:o0irx4');
  assert.ok(cues.slice(3, firstBirthCue.number).every(line => line.background === firstGreatInkwellCue.background));
  assert.match(firstBirthCue.background, /L1-birth-wide-inkwell\.webp$/);
  assert.equal(cues[firstBirthCue.number + 1].key, 'regress-problem-birth:1:23jdfg');
  assert.ok(cues.slice(firstBirthCue.number).every(line => line.background === firstBirthCue.background));
  assert.deepEqual(cues.map(cue => cue.number), cues.map((_, index) => index));
});

test('historical additions and removals survive joining both opening passages', () => {
  const cues = authoredCues('L0');
  const preface = { key: id(1), after: null, text: 'An older added Great Inkwell line.' };
  const birthPreface = { key: id(2), after: null, text: 'An older added Birth line.' };
  const removedBirthLine = cues[firstBirthCue.number + 1].key;
  const saved = {
    L0: { added: [], removed: [cues[1].key] },
    'regress-problem': { added: [preface], removed: [cues[3].key, cues[4].key] },
    'regress-problem-birth': { added: [birthPreface], removed: [removedBirthLine] },
  };
  const result = buildClassroomScript(saved).filter(cue => cue.scene === 'L0');
  assert.deepEqual(result.slice(0, 5).map(cue => cue.key),
    [cues[0].key, cues[2].key, preface.key, cues[3].key, cues[5].key]);
  assert.equal(result[2].background, firstGreatInkwellCue.background);
  assert.equal(result[3].silent, true);
  assert.equal(result.find(line => line.key === birthPreface.key).background, firstBirthCue.background);
  assert.equal(result.some(line => line.key === removedBirthLine), false);
  assert.deepEqual(Object.keys(joinInkPassageEdits(saved)), ['L0']);
});

test('clearing the opening dialogue still leaves all three artwork cues', () => {
  const cues = authoredCues('L0');
  const result = buildClassroomScript({ L0: { added: [], removed: cues.map(cue => cue.key) } })
    .filter(cue => cue.scene === 'L0');
  assert.deepEqual(result.map(cue => cue.key), [cues[0].key, firstGreatInkwellCue.key, firstBirthCue.key]);
  assert.ok(result.every(cue => cue.silent));
});

test('the Regress Problem keeps its artwork and saved cue identities through the joined dialogue', () => {
  const cues = authoredCues('L2');
  const first = inkPassageStarts.get('L3');
  assert.equal(authoredCues('L3').length, 0);
  assert.ok(authoredCues('L3-continued').length > 0);
  assert.equal(first.scene, 'L2');
  assert.equal(first.background, undefined);
  assert.equal(cues[first.number + 2].key, 'L3:2:1yq4kak');
  const added = { key: id(3), after: null, text: 'A saved opening line for the Whypocalypse.' };
  const saved = { L3: { added: [added], removed: [first.key] } };
  const result = buildClassroomScript(saved).filter(line => line.scene === 'L2');
  assert.deepEqual(result.slice(first.number, first.number + 2).map(line => line.key),
    [added.key, cues[first.number + 1].key]);
  assert.equal(result[first.number].background, undefined);
  assert.ok(result.every(line => line.key !== first.key));
});
