import coleManifest from './cole-voice-clips.json';
import simoneManifest from './simone-voice-clips.json';
import sowattManifest from './sowatt-voice-clips.json';
import { spokenText, spokenWords } from './timed-voice-words';
import './timed-dialogue.css';

type Clip = { file: string; words: readonly (readonly number[])[]; phrases?: boolean };
const simoneClips: Readonly<Record<string, Clip & { text?: string }>> = simoneManifest;
const coleClips: Readonly<Record<string, Clip & {
  text: string;
  duet?: { file: string; simoneFile: string };
}>> = coleManifest;
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

  function play(target: HTMLElement, text: string) {
    return playClip(target, text, find(text), 'simone');
  }

  function playDoorSimone(target: HTMLElement, text: string, cueKey: string, withCole: boolean) {
    const clip = simoneClips[cueKey];
    const spoken = spokenText(text);
    if (clip?.text !== spoken) return false;
    const cole = coleClips[cueKey];
    if (withCole && cole?.text === spoken && cole.duet?.simoneFile === clip.file) {
      return playClip(target, text, { ...clip, file: cole.duet.file }, 'cole');
    }
    return playClip(target, text, clip, 'simone');
  }

  function playDoorCole(target: HTMLElement, text: string, cueKey: string) {
    const clip = coleClips[cueKey];
    return clip?.text === spokenText(text) && playClip(target, text, clip, 'cole');
  }

  function playSowatt(target: HTMLElement, text: string, cueKey: string) {
    const clip = sowattClips[cueKey];
    if (clip && clip.text === spokenText(text)) return playClip(target, text, clip, 'sowatt');
    return false;
  }

  function playClip(target: HTMLElement, text: string, clip: Clip | undefined, folder: string) {
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
    function finish() {
      if (close === clear) stop();
    }
    function highlight(index: number, shown: boolean) {
      if (index < 0) return;
      const [start, end] = clip!.words[index];
      spans[index].classList.toggle('is-spoken-word', shown);
      if (!clip!.phrases) return;
      // A Japanese phrase and its English translation share one timing interval.
      for (let i = index + 1; i < spans.length; i++) {
        if (clip!.words[i][0] !== start || clip!.words[i][1] !== end) break;
        spans[i].classList.toggle('is-spoken-word', shown);
      }
    }
    function paint() {
      if (close !== clear) return;
      const position = audio.currentTime;
      const index = clip!.words.findIndex(([start, end]) => position >= start && position < end);
      if (index !== active) {
        highlight(active, false);
        highlight(index, true);
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
        else finish();
      });
    }
    function retry() {
      if (waitingForGesture) begin();
    }
    document.addEventListener('pointerdown', retry, { ...options, capture: true });
    document.addEventListener('keydown', retry, { ...options, capture: true });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) finish();
    }, options);
    audio.addEventListener('playing', () => {
      cancelAnimationFrame(frame);
      paint();
    }, options);
    audio.addEventListener('ended', finish, options);
    audio.addEventListener('error', finish, options);
    audio.src = `/voices/${folder}/${clip.file}`;
    begin();
    return true;
  }

  return { play, playDoorSimone, playDoorCole, playSowatt, stop };
}
