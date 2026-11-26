import simoneManifest from './simone-voice-clips.json';
import sowattManifest from './sowatt-voice-clips.json';
import { spokenText, spokenWords } from './timed-voice-words';
import './timed-dialogue.css';

type Clip = { file: string; words: readonly (readonly number[])[] };
const simoneClips: Readonly<Record<string, Clip & { text?: string }>> = simoneManifest;
const sowattClips: Readonly<Record<string, Clip & { text: string }>> = sowattManifest;

export function createDialogueVoice() {
  const audio = new Audio();
  audio.preload = 'none';
  let close: (() => void) | undefined;

  function stop() {
    const cancel = close;
    close = undefined;
    cancel?.();
  }

  function find(text: string) {
    const key = spokenText(text);
    return Object.hasOwn(simoneClips, key) ? simoneClips[key] : undefined;
  }

  function play(target: HTMLElement, text: string, onFinish?: (played: boolean) => void) {
    return playClip(target, text, find(text), 'simone', onFinish);
  }

  function playDoorSimone(target: HTMLElement, text: string, cueKey: string) {
    const clip = simoneClips[cueKey];
    if (clip?.text === spokenText(text)) return playClip(target, text, clip, 'simone');
    return false;
  }

  function playSowatt(target: HTMLElement, text: string, cueKey: string) {
    const clip = sowattClips[cueKey];
    if (clip && clip.text === spokenText(text)) return playClip(target, text, clip, 'sowatt');
    return false;
  }

  function playClip(target: HTMLElement, text: string, clip: Clip | undefined, folder: string,
      onFinish?: (played: boolean) => void) {
    stop();
    const words = spokenWords(text);
    if (document.hidden || !clip || clip.words.length !== words.length) return false;

    const fragments = document.createDocumentFragment();
    let offset = 0;
    const spans = words.map(word => {
      fragments.append(text.slice(offset, word.offset));
      const span = document.createElement('span');
      span.className = 'timed-dialogue-word';
      span.textContent = word.text;
      fragments.append(span);
      offset = word.offset + word.text.length;
      return span;
    });
    fragments.append(text.slice(offset));
    target.replaceChildren(fragments);

    const listeners = new AbortController();
    const options = { signal: listeners.signal };
    let frame = 0;
    let active = -1;
    let waitingForGesture = false;
    function clear() {
      listeners.abort();
      cancelAnimationFrame(frame);
      audio.pause();
      if (target.textContent === text) target.textContent = text;
    }
    close = clear;
    function finish(played: boolean) {
      if (close !== clear) return;
      stop();
      onFinish?.(played);
    }
    function paint() {
      if (close !== clear) return;
      const position = audio.currentTime;
      const index = clip!.words.findIndex(([start, end]) => position >= start && position < end);
      if (index !== active) {
        spans[active]?.classList.remove('is-spoken-word');
        spans[index]?.classList.add('is-spoken-word');
        active = index;
      }
      frame = requestAnimationFrame(paint);
    }
    function begin() {
      if (close !== clear) return;
      waitingForGesture = false;
      void audio.play().catch(error => {
        if (close !== clear) return;
        if (error instanceof DOMException && error.name === 'NotAllowedError') waitingForGesture = true;
        else finish(false);
      });
    }
    function retry() {
      if (waitingForGesture) begin();
    }
    document.addEventListener('pointerdown', retry, { ...options, capture: true });
    document.addEventListener('keydown', retry, { ...options, capture: true });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) finish(true);
    }, options);
    audio.addEventListener('playing', () => {
      cancelAnimationFrame(frame);
      paint();
    }, options);
    audio.addEventListener('ended', () => finish(true), options);
    audio.addEventListener('error', () => finish(false), options);
    audio.src = `/voices/${folder}/${clip.file}`;
    begin();
    return true;
  }

  return { find, play, playDoorSimone, playSowatt, stop };
}
