import { addDialogueSpeaker, dialogueSpeaker, groupDialogueLabels } from './dialogue-speakers';
import { createPaperMiniSlide } from './paper-mini-slide';
import { createTrialDialogue } from './trial-dialogue';
import { createDialogueVoice } from './timed-dialogue';
import { createDoorClosingMusic } from './door-closing-music';
import { isDoorWorldScene, isSimoneCue } from './simone-voice-lines';
import { createDialogueFrame } from './dialogue-frame';
import { createSpeakerOutline } from './speaker-outline';
import { createOperationBecause } from './operation-because';
import { regressSceneDestination } from './regress-responses';
import portrait from './assets/professor-lin-classroom.webp';
import type { createLocalQuizVotes, QuizChoice, QuizCounts } from './local-quiz-votes';
import { openingQuizWindowMs, type OpeningQuizSnapshot } from './opening-quiz';
import { legendById } from './slide-content';
import { authoredCues, buildClassroomScript, customCueOffset, editableCueSequence, inkPassageStarts, openingClassroomScene, unlabeledYTurn } from './classroom-cues';
import { hasEstablishingShot, inkPassages, type InkOceanCue } from './ink-ocean-scenes';
import { establishingCueOffset, revealedTrialCueOffset, transcriptPreviewCue } from './live-protocol';
import type { DialogueStructure, SlideCopy } from './shared-slide-data';
import type { InlineDialogueTarget } from './inline-dialogue';
import './classroom-dialogue.css';

const introScenes = ['unitrans-arrival', 'before-lecture'];
const answerWindowMs = openingQuizWindowMs;
const whypocalypseScene = 'L3-continued';
const whypocalypseLoopUrl = '/generated/backgrounds/ink-ocean/L3-whypocalypse-loop-2k.mp4';

type DialogueStep = 'artwork' | 'preview' | 'line';
type CueSelection = { local?: boolean; step?: DialogueStep; playVoice?: boolean };

export function createClassroomDialogue(shell: HTMLElement, quizEnabled: boolean, openScene: (id: string) => void, tally?: ReturnType<typeof createLocalQuizVotes>, presenter = false, playOpening?: () => void, sharedCopy?: (key: string) => SlideCopy | undefined, sharedLine?: (key: string) => string | undefined, dialogueStructure?: () => Record<string, DialogueStructure> | undefined) {
  const stage = document.createElement('div');
  stage.className = 'classroom-stage';
  stage.hidden = true;
  const character = document.createElement('button');
  character.type = 'button';
  character.className = 'classroom-character';
  character.setAttribute('aria-label', 'Continue by clicking Professor Lin');
  const image = new Image();
  image.decoding = 'async';
  image.alt = 'Illustrated Professor Lin';
  image.draggable = false;
  character.dataset.speaker = 'Professor Lin';
  character.append(image);

  const panel = document.createElement('section');
  panel.className = 'transcript-panel';
  panel.setAttribute('aria-label', 'Opening dialogue');
  const notes = createPaperMiniSlide(sharedCopy);
  const reader = document.createElement('div');
  reader.className = 'transcript-reader';
  reader.tabIndex = 0;
  reader.setAttribute('role', 'region');
  reader.setAttribute('aria-label', 'Transcript. Scroll or use the arrow keys to move between lines.');
  let structure = JSON.stringify(dialogueStructure?.() ?? {});
  let script = buildClassroomScript(dialogueStructure?.());
  const firstCue = new Map<string, number>();
  const lastCue = new Map<string, number>();
  let questionIndex = -1;
  let resultIndex = -1;
  const lineText = (index: number) => sharedLine?.(script[index].key) ?? script[index].text;
  function appearance(line: typeof script[number]) {
    return line.silent ? undefined : dialogueSpeaker(line, line.scene, unlabeledYTurn(line));
  }
  function renderRows() {
    firstCue.clear();
    lastCue.clear();
    reader.replaceChildren();
    return script.map(({ phase, speaker, speakerId, kind, scene }, index) => {
      if (!firstCue.has(scene)) firstCue.set(scene, index);
      lastCue.set(scene, index);
      if (phase === 'question') questionIndex = index;
      if (phase === 'result') resultIndex = index;
      const row = document.createElement('div');
      row.className = 'transcript-row';
      row.dataset.speaker = speakerId ?? speaker;
      if (kind) row.dataset.cueKind = kind;
      const speakerAppearance = appearance(script[index]);
      if (speakerAppearance) addDialogueSpeaker(row, speakerAppearance);
      else if (!script[index].silent && !kind && speaker) row.dataset.dialogueSpeaker = speaker;
      const words = document.createElement('span');
      words.className = 'dialogue-words';
      words.textContent = lineText(index);
      row.append(words);
      reader.append(row);
      return row;
    });
  }
  let rows = renderRows();
  const choices = document.createElement('div');
  choices.className = 'record-quiz';
  choices.style.setProperty('--answer-window', answerWindowMs + 'ms');
  choices.hidden = true;
  choices.setAttribute('role', 'group');
  choices.setAttribute('aria-label', 'Choose a reading of the mark');
  const answers = ['B', '13'] as const;
  const answerButtons = answers.map(answer => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = answer;
    button.insertAdjacentHTML('beforeend', '<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false"><circle cx="50" cy="50" r="47" pathLength="100"/></svg>');
    button.addEventListener('click', event => {
      event.stopPropagation();
      void submitAnswer(answer);
    });
    choices.append(button);
    return button;
  });
  const resultLabel = document.createElement('span');
  resultLabel.className = 'record-result-label';
  resultLabel.setAttribute('role', 'status');
  resultLabel.hidden = true;
  choices.append(resultLabel);
  const announcement = document.createElement('span');
  announcement.className = 'transcript-announcement';
  announcement.setAttribute('role', 'status');
  panel.append(notes.element, reader);
  const speakerOutline = createSpeakerOutline();
  stage.append(speakerOutline.element, character, panel, announcement);
  if (quizEnabled || tally) stage.append(choices);
  const operation = createOperationBecause(stage, scene => {
    if (!editing) openScene(scene);
  });
  const controls = document.createElement('nav');
  controls.className = 'legend-paging';
  controls.setAttribute('aria-label', 'Dialogue navigation');
  for (const direction of [-1, 1]) {
    const button = document.createElement('button');
    button.type = 'button';
    const label = direction < 0 ? 'Previous cue' : 'Next cue';
    button.setAttribute('aria-label', label);
    button.title = label;
    button.setAttribute('aria-keyshortcuts', direction < 0 ? 'ArrowUp' : 'ArrowDown');
    button.addEventListener('click', () => move(direction));
    controls.append(button);
  }
  stage.append(controls);
  function showTranscript(visible: boolean) {
    const parent = visible ? panel : stage;
    const focused = document.activeElement;
    panel.hidden = !visible;
    if (controls.parentElement === parent) return;
    parent.append(controls);
    if (focused instanceof HTMLButtonElement && controls.contains(focused)) focused.focus({ preventScroll: true });
  }
  const voice = createDialogueVoice();
  const showMusicScene = createDoorClosingMusic(stage);
  const trial = createTrialDialogue(stage, () => move(1));
  let onCueChange: (() => void) | undefined;
  shell.append(stage);

  const characters = stage.querySelectorAll<HTMLElement>('.classroom-character[data-speaker]');
  let introIndex = -1;
  let active = -1;
  let dialogueStep: DialogueStep = 'line';
  let trialRevealed = false;
  let editing = false;
  let pendingTrialLine = -1;
  let highlighted = -1;
  let scrollTimer = 0;
  let quizTimer = 0;
  let roomQuiz: OpeningQuizSnapshot | undefined;
  let visit = 0;
  let latestRead = 0;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function center(index: number) {
    const row = rows[index];
    return row.offsetTop + row.offsetHeight / 2 - reader.clientHeight / 2;
  }
  const viewport = shell.querySelector<HTMLElement>('#viewport')!;
  const passageArtwork = document.createElement('div');
  passageArtwork.className = 'ink-passage-artwork';
  passageArtwork.setAttribute('aria-hidden', 'true');
  const outgoingArtwork = document.createElement('div');
  outgoingArtwork.className = 'ink-passage-outgoing';
  const whypocalypseLoop = document.createElement('video');
  whypocalypseLoop.hidden = true;
  whypocalypseLoop.loop = true;
  whypocalypseLoop.playsInline = true;
  let whypocalypseVisible = false;
  whypocalypseLoop.addEventListener('playing', () => {
    whypocalypseLoop.hidden = !whypocalypseVisible || reduced.matches;
  });
  whypocalypseLoop.addEventListener('error', () => { whypocalypseLoop.hidden = true; });
  function updateWhypocalypseLoop() {
    if (!whypocalypseVisible || reduced.matches) {
      whypocalypseLoop.pause();
      whypocalypseLoop.hidden = true;
      return;
    }
    if (!whypocalypseLoop.paused) return;
    if (!whypocalypseLoop.hasAttribute('src')) whypocalypseLoop.src = whypocalypseLoopUrl;
    whypocalypseLoop.muted = false;
    void whypocalypseLoop.play().catch(error => {
      if (error.name !== 'NotAllowedError' || !whypocalypseVisible || reduced.matches || !whypocalypseLoop.paused) return;
      whypocalypseLoop.muted = true;
      void whypocalypseLoop.play().catch(() => {}); // Keep the still if autoplay is unavailable.
    });
  }
  function enableWhypocalypseAudio() {
    if (!whypocalypseVisible || reduced.matches || !whypocalypseLoop.muted) return;
    whypocalypseLoop.muted = false;
    void whypocalypseLoop.play().catch(() => {});
  }
  document.addEventListener('click', enableWhypocalypseAudio, { capture: true });
  document.addEventListener('keydown', enableWhypocalypseAudio, { capture: true });
  reduced.addEventListener('change', updateWhypocalypseLoop);
  passageArtwork.append(whypocalypseLoop, outgoingArtwork);
  viewport.prepend(passageArtwork);
  const passageImages = new Map([...inkPassages].map(([id, passages]) =>
    [id, [legendById.get(id)?.background, ...passages.map(passage => inkPassageStarts.get(passage)?.background)]] as const));
  let passageImage: string | undefined;
  let passageFade: Animation | undefined;
  function showPassageArtwork(url: string, fade = true) {
    if (url === passageImage) return;
    passageFade?.cancel();
    const previous = passageImage;
    passageImage = url;
    passageArtwork.style.backgroundImage = `url("${url}")`;
    if (fade && previous && !reduced.matches) {
      outgoingArtwork.style.backgroundImage = `url("${previous}")`;
      passageFade = outgoingArtwork.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 240, easing: 'ease' });
    }
  }
  const artwork = createDialogueFrame(url => {
    viewport.style.setProperty('--regress-background', `url("${url}")`);
    const images = passageImages.get(script[active]?.scene);
    if (images) {
      showPassageArtwork(url);
      const nextImage = images[images.indexOf(url) + 1];
      if (nextImage) artwork.preload(nextImage);
    }
    const line = script[highlighted];
    if (!line || line.silent || line.kind || line.scene === 'P1') return;
    speakerOutline.show(url, line.speakerId ?? line.speaker, unlabeledYTurn(line));
  });
  function photoAt(index: number) {
    const line = script[index];
    const scene = line && legendById.get(line.scene);
    if (!scene) return;
    if (index === firstCue.get(scene.id)) {
      return hasEstablishingShot(scene, 0) ? line.background ?? scene.background : undefined;
    }
    if (line.original && line.number > 0 && hasEstablishingShot(scene, line.number)) return line.background ?? scene.background;
  }
  function hasArtworkStep(index: number) {
    return Boolean(photoAt(index)) || index === firstCue.get(openingClassroomScene);
  }
  function opensTranscript(index: number) {
    const { scene } = script[index];
    return index === firstCue.get(scene) && scene !== 'P1' && scene !== whypocalypseScene &&
      !legendById.get(scene)?.imageOnly;
  }
  function highlight(index: number) {
    if (highlighted === index) return;
    if (highlighted >= 0) rows[highlighted].removeAttribute('aria-current');
    highlighted = index;
    speakerOutline.clear();
    const line = script[index];
    characters.forEach(actor => actor.classList.toggle('is-speaking', !line?.silent && actor.dataset.speaker === line?.speaker));
    const legend = line && legendById.get(line.scene);
    if (line) notes.show(line.scene);
    if (legend) {
      const background = line.background ?? legend.background;
      if (background) artwork.show(background);
      else {
        artwork.cancel();
        viewport.style.removeProperty('--regress-background');
      }
    }

    rows[index]?.setAttribute('aria-current', 'true');
  }
  function centeredLine() {
    const nearest = rows.reduce((best, row, index) =>
      !row.hidden && (best < 0 || Math.abs(center(index) - reader.scrollTop) < Math.abs(center(best) - reader.scrollTop)) ? index : best, -1);
    return nearest < 0 ? active : nearest;
  }
  function finishQuestion() {
    if (editing || active !== questionIndex || choices.hidden) return;
    const next = skipSilentText(questionIndex + 1, 1);
    if (!finishIntro(next)) select(next, { local: presenter });
  }
  async function submitAnswer(answer: QuizChoice) {
    if (!quizEnabled || active !== questionIndex) return;
    if (!tally) { finishQuestion(); return; }
    const questionVisit = visit;
    answerButtons.forEach(button => { button.disabled = true; });
    try {
      await tally.request(answer, roomQuiz?.round);
      if (visit === questionVisit) finishQuestion();
    } catch {
      if (visit !== questionVisit) return;
      answerButtons.forEach(button => { button.disabled = false; });
      resultLabel.textContent = 'Vote unavailable. Choose again to retry.';
      resultLabel.hidden = false;
    }
  }
  function paintResults(counts: QuizCounts) {
    const total = counts.B + counts['13'];
    answers.forEach((answer, i) => {
      const share = total ? 100 * counts[answer] / total : 0;
      const button = answerButtons[i];
      button.style.setProperty('--vote-offset', String(100 - share));
      button.classList.toggle('vote-leader', counts[answer] > total / 2);
      button.setAttribute('aria-label', `${answer}, ${counts[answer]} of ${total} votes`);
    });
    const outcome = counts.B === counts['13'] ? 'Tie' : `${counts.B > counts['13'] ? 'B' : '13'} leads`;
    resultLabel.textContent = total ? `${outcome} · ${total} ${total === 1 ? 'vote' : 'votes'}` : 'No audience votes yet';
  }
  async function refreshResults() {
    if (!tally || choices.dataset.mode !== 'results') return;
    if (roomQuiz) { paintResults(roomQuiz.counts); return; }
    const read = ++latestRead;
    try {
      const counts = await tally.request();
      if (read === latestRead) paintResults(counts);
    } catch {
      if (read === latestRead) resultLabel.textContent = 'Vote tally unavailable';
    }
  }
  if (tally && import.meta.hot) {
    import.meta.hot.on('phi102:quiz:changed', refreshResults);
    import.meta.hot.on('vite:ws:connect', refreshResults);
  }
  function clearQuestion() {
    visit++;
    latestRead++;
    clearTimeout(quizTimer);
    if (choices.contains(document.activeElement)) reader.focus({ preventScroll: true });
    choices.hidden = true;
    delete choices.dataset.mode;
    resultLabel.hidden = true;
    choices.setAttribute('aria-label', 'Choose a reading of the mark');
    answerButtons.forEach(button => {
      button.disabled = false;
      button.classList.remove('vote-leader');
      button.style.removeProperty('--vote-offset');
      button.removeAttribute('aria-label');
    });
  }
  function setVisibleRows(scene: string) {
    const waitingForQuiz = scene === openingClassroomScene && !editing && active <= questionIndex;
    rows.forEach((row, index) => {
      row.hidden = script[index].scene !== scene || Boolean(script[index].silent) ||
        (waitingForQuiz && index > questionIndex);
    });
    groupDialogueLabels(rows);
  }
  function quizResultsIndex() {
    return resultIndex > questionIndex ? resultIndex : questionIndex + 1;
  }
  function select(index: number, { local = false, step = 'line', playVoice = true }: CueSelection = {}) {
    voice.stop();
    clearQuestion();
    const line = script[index];
    clearTimeout(scrollTimer);
    active = index;
    trialRevealed = false;
    dialogueStep = step;
    const establishing = step === 'artwork';
    viewport.toggleAttribute('data-establishing-shot', establishing);
    const inCourt = line.scene === 'P1';
    showTranscript(!establishing && !inCourt);
    if (inCourt) trial.show(establishing ? undefined : line, sharedLine?.(line.key));
    else trial.hide();
    if (establishing) {
      highlight(-1);
      const legend = legendById.get(line.scene);
      announcement.textContent = 'Full-color scene: ' + (legend?.title ?? 'Contemporary Contextualism');
      const photo = photoAt(index);
      if (photo) artwork.show(photo);
      if (local) onCueChange?.();
      return;
    }
    setVisibleRows(line.scene);
    if (step === 'preview') {
      highlight(-1);
      notes.show(line.scene);
      const background = line.background ?? legendById.get(line.scene)?.background;
      if (background) artwork.show(background);
      announcement.textContent = 'Dialogue open. Advance to start the first line.';
      const firstVisible = rows.findIndex(row => !row.hidden);
      reader.scrollTo({ top: firstVisible >= 0 ? center(firstVisible) : 0, behavior: 'instant' });
      if (local) onCueChange?.();
      return;
    }
    highlight(index);
    if (playVoice && !inCourt && !editing && !line.silent) {
      const target = rows[index].querySelector<HTMLElement>('.dialogue-words')!;
      if (isSimoneCue(line)) {
        if (isDoorWorldScene(line.scene)) voice.playDoorSimone(target, lineText(index), line.key, line.speaker === 'Both');
        else voice.play(target, lineText(index), line.key);
      } else if (line.speaker === 'Cole' && isDoorWorldScene(line.scene)) {
        voice.playDoorCole(target, lineText(index), line.key);
      } else voice.playSowatt(target, lineText(index), line.key);
    }
    if (index === lastCue.get(line.scene)) operation.markViewed(line.scene);
    announcement.textContent = line.silent ? '' : (appearance(line)?.name ?? line.speaker) + '. ' + lineText(index);
    if (index === questionIndex && (quizEnabled || presenter)) {
      choices.hidden = false;
      const remaining = roomQuiz?.closesAt ? Math.max(0, roomQuiz.closesAt - Date.now()) : answerWindowMs;
      choices.style.setProperty('--answer-window', remaining + 'ms');
      announcement.textContent += ' Choose B or 13 within ten seconds.';
      quizTimer = window.setTimeout(finishQuestion, remaining);
    }
    if (tally && line.scene === openingClassroomScene && (index === quizResultsIndex() || (presenter && index === questionIndex))) {
      choices.dataset.mode = 'results';
      choices.setAttribute('aria-label', 'Audience vote distribution');
      choices.hidden = false;
      answerButtons.forEach(button => { button.disabled = true; });
      resultLabel.hidden = false;
      resultLabel.textContent = 'Reading audience votes…';
      void refreshResults();
    }
    if (local) onCueChange?.();
    // Entering or leaving the quiz can change which transcript rows are visible.
    // Snap to its new geometry before processing any further scroll gestures.
    if (!inCourt && !rows[index].hidden) reader.scrollTo({ top: center(index), behavior: 'instant' });
  }
  function skipSilentText(index: number, direction: number) {
    while (script[index]?.silent && (script[index].phase === 'reveal' || (script[index].phase === 'result' && !tally))) index += direction;
    return index;
  }
  function goToLine(index: number, leavingPhoto = false) {
    if (active < 0) return;
    const scene = script[active].scene;
    index = skipSilentText(index, index < active ? -1 : 1);
    if (scene === openingClassroomScene && active < questionIndex && index > questionIndex) index = questionIndex;
    if (!leavingPhoto && index < active) {
      if (opensTranscript(active)) { select(active, { local: true, step: 'preview' }); return; }
      if (hasArtworkStep(active)) { select(active, { local: true, step: 'artwork' }); return; }
    }
    if (script[index]?.scene !== scene) {
      const forward = index > active;
      const destination = regressSceneDestination(scene, forward);
      if (destination) {
        openScene(destination);
        return;
      }
    }
    if (!choices.hidden && active === questionIndex && index > active) {
      answerButtons[0].focus({ preventScroll: true });
      return;
    }
    if (index < 0) { openScene(introScenes[introScenes.length - 1]); return; }
    if (index > active && finishIntro(index)) return;
    if (index === script.length) { openScene('dilemma-heading'); return; }
    const destination = script[index].scene;
    if (destination !== scene) {
      if (destination === 'P1') pendingTrialLine = index;
      openScene(destination);
      return;
    }
    if (index > active) {
      // Scrolling or clicking a later line still stops at the first new picture.
      for (let next = active + 1; next <= index; next++) {
        if (hasArtworkStep(next)) { select(next, { local: true, step: 'artwork' }); return; }
      }
    }
    select(index, { local: true });
  }
  function move(direction: number) {
    if (editing || viewport.hasAttribute('data-door-transition')) return;
    if (direction > 0 && trial.reveal()) {
      trialRevealed = true;
      onCueChange?.();
      return;
    }
    if (dialogueStep === 'artwork') {
      if (direction > 0 && legendById.get(script[active].scene)?.imageOnly) goToLine(active + 1, true);
      else if (direction > 0) select(active, { local: true, step: opensTranscript(active) ? 'preview' : 'line' });
      else goToLine(active - 1, true);
      return;
    }
    if (dialogueStep === 'preview') {
      if (direction > 0) select(active, { local: true });
      else if (hasArtworkStep(active)) select(active, { local: true, step: 'artwork' });
      else goToLine(active - 1, true);
      return;
    }
    if (introIndex < 0) { goToLine(active + direction); return; }
    const next = introIndex + direction;
    const scene = next === introScenes.length ? script[0].scene : introScenes[next];
    if (scene) openScene(scene);
  }
  function handleArrow(key: string, repeat = false) {
    if (stage.hidden) return false;
    const inCourt = script[active]?.scene === 'P1';
    if (inCourt && repeat && ['Enter', ' ', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) return true;
    if (inCourt && (key === 'Enter' || key === ' ')) move(1);
    else if (key === 'ArrowLeft' || key === 'ArrowUp') move(-1);
    else if (key === 'ArrowRight' || key === 'ArrowDown') move(1);
    else return false;
    return true;
  }
  function finishIntro(next: number) {
    if (script[active]?.scene !== 'contemporary-heading' || script[next]?.scene === 'contemporary-heading') return false;
    if (playOpening) playOpening();
    else openScene('L0');
    return true;
  }
  function stepDialogue(direction: number) {
    if (stage.hidden) return false;
    move(direction);
    return true;
  }
  character.addEventListener('click', () => {
    move(1);
    if (!reduced.matches) character.animate([{ rotate: '0deg' }, { rotate: '-0.7deg' }, { rotate: '0deg' }], 440);
  });
  choices.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const next = event.target === answerButtons[0] ? 1 : 0;
    answerButtons[next].focus({ preventScroll: true });
  });
  reader.addEventListener('click', event => {
    if (editing) return;
    const row = (event.target as HTMLElement).closest<HTMLDivElement>('.transcript-row');
    const index = row ? rows.indexOf(row) : -1;
    if (index < 0) return;
    if (dialogueStep === 'preview') move(1);
    else goToLine(index === active ? active + 1 : index);
  });
  reader.addEventListener('keydown', event => {
    if (editing) return;
    if (event.altKey || event.ctrlKey || event.metaKey || choices.contains(event.target as Node)) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    move(1);
  });
  reader.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    if (editing || stage.hidden || panel.hidden || dialogueStep === 'preview' || active < 0 || script[active].silent) return;
    scrollTimer = window.setTimeout(() => {
      if (editing || stage.hidden || panel.hidden || dialogueStep === 'preview' || active < 0 || script[active].silent) return;
      const nearest = centeredLine();
      if (nearest !== active) goToLine(nearest);
    }, 160);
  });
  new ResizeObserver(() => {
    if (!editing && !stage.hidden && !panel.hidden && active >= 0 && !rows[active].hidden) reader.scrollTop = center(active);
  }).observe(reader);

  function showScene(id?: string) {
    if (script[active]?.scene !== id) voice.resetVisit();
    showMusicScene(id);
    whypocalypseVisible = id === whypocalypseScene;
    const firstImage = whypocalypseVisible ? legendById.get(whypocalypseScene)?.background
      : id && passageImages.get(id)?.[0];
    viewport.toggleAttribute('data-ink-passage', Boolean(firstImage));
    if (firstImage && script[active]?.scene !== id) showPassageArtwork(firstImage, false);
    updateWhypocalypseLoop();
    operation.showScene(id);
    if (id === 'contemporary-heading' && !image.hasAttribute('src')) image.src = portrait;
    const nextScene = id === 'contemporary-heading' ? 'L0'
      : id === 'L7' ? 'P1' : id === 'P1' ? 'P2-arrival' : id === 'P2-arrival' ? 'P2-1' : undefined;
    const nextBackground = nextScene && legendById.get(nextScene)?.background;
    if (nextBackground) artwork.preload(nextBackground);
    introIndex = introScenes.findIndex(scene => scene === id);
    const index = script.findIndex(line => line.scene === id);
    stage.hidden = index < 0 && introIndex < 0;
    const nextLine = id === 'P1' && script[pendingTrialLine]?.scene === id ? pendingTrialLine : index;
    pendingTrialLine = -1;
    if (index < 0) {
      voice.stop();
      trial.hide();
      dialogueStep = 'line';
      viewport.removeAttribute('data-establishing-shot');
      showTranscript(false);
      artwork.cancel();
      clearTimeout(scrollTimer);
      clearQuestion();
      active = -1;
      highlight(-1);
      announcement.textContent = '';
      return;
    }
    if (script[active]?.scene !== id) {
      const step = nextLine === index && hasArtworkStep(index) ? 'artwork' : opensTranscript(nextLine) ? 'preview' : 'line';
      select(nextLine, { step });
    }
  }
  function refreshSlideCopy(force = false) {
    if (editing) return;
    notes.refresh(force);
    const nextStructure = dialogueStructure?.();
    const serialized = JSON.stringify(nextStructure ?? {});
    if (serialized !== structure) {
      const previous = script[active];
      const position = previous ? active - firstCue.get(previous.scene)! : 0;
      const previousStep = dialogueStep;
      structure = serialized;
      script = buildClassroomScript(nextStructure);
      rows = renderRows();
      highlighted = -1;
      if (previous) {
        const kept = script.findIndex(cue => cue.key === previous.key && (!cue.silent || previous.silent));
        const first = firstCue.get(previous.scene)!;
        const last = lastCue.get(previous.scene)!;
        const nearby = Math.min(first + position, last);
        const later = script.findIndex((cue, index) => index >= nearby && index <= last && !cue.silent);
        let earlier = nearby - 1;
        while (earlier >= first && script[earlier].silent) earlier--;
        const index = kept >= 0 ? kept : later >= 0 ? later : earlier >= first ? earlier : first;
        const step = previousStep !== 'line' && position === 0 ? previousStep
          : previousStep === 'artwork' && hasArtworkStep(index) ? 'artwork' : 'line';
        select(step !== 'line' && position === 0 ? first : index, { step, playVoice: false });
      }
    }
    rows.forEach((row, index) => {
      const next = lineText(index);
      const words = row.querySelector<HTMLElement>('.dialogue-words')!;
      if (words.textContent !== next) {
        if (index === active) voice.stop();
        words.textContent = next;
      }
    });
    if (force && script[active]?.scene === 'P1' && dialogueStep !== 'artwork') trial.updateText(script[active], sharedLine?.(script[active].key));
  }

  function inlineTarget(): InlineDialogueTarget | undefined {
    if (stage.hidden || dialogueStep === 'artwork' || active < 0) return;
    const scene = script[active].scene;
    const court = scene === 'P1';
    const root = court ? trial.inlineRoot : panel;
    const lines = court ? [{ key: script[active].key, element: trial.inlineText }]
      : rows.flatMap((row, index) => {
        const cue = script[index];
        const element = row.querySelector<HTMLElement>('.dialogue-words')!;
        return cue.scene === scene && !cue.silent ? [{ key: cue.key, row, element }] : [];
      });
    let quiz: { after: string | null } | undefined;
    if (scene === openingClassroomScene) {
      let previous = questionIndex - 1;
      while (previous >= firstCue.get(scene)! && script[previous].silent) previous--;
      quiz = { after: previous >= firstCue.get(scene)! ? script[previous].key : null };
    }
    return {
      scene, root, lines, quiz, panel: court ? undefined : notes.inlineFields,
      sequence: editableCueSequence(scene) ? reader : undefined,
      start() {
        voice.stop();
        clearTimeout(scrollTimer);
        clearTimeout(quizTimer);
        editing = true;
        root.toggleAttribute('data-inline-editing', true);
        if (court) trial.startInline();
        else setVisibleRows(scene);
      },
      stop() {
        editing = false;
        root.removeAttribute('data-inline-editing');
        if (court) trial.stopInline();
        else setVisibleRows(scene);
        refreshSlideCopy(true);
        if (!court && !rows[active].hidden) reader.scrollTo({ top: center(active), behavior: 'instant' });
        if (active === questionIndex && !choices.hidden) quizTimer = window.setTimeout(finishQuestion, answerWindowMs);
      },
    };
  }
  return {
    showScene, handleArrow, stepDialogue, advance: () => move(1),
    get slideCopyKey() { return panel.hidden || stage.hidden ? undefined : notes.key; },
    refreshSlideCopy, inlineTarget,
    get inlineEditing() { return editing; },
    updateOpeningQuiz(view?: OpeningQuizSnapshot) {
      const previousDeadline = roomQuiz?.closesAt;
      roomQuiz = view;
      if (choices.dataset.mode === 'results' && view) {
        latestRead++;
        paintResults(view.counts);
      }
      if (active === questionIndex && view?.closesAt && view.closesAt !== previousDeadline) {
        clearTimeout(quizTimer);
        quizTimer = window.setTimeout(finishQuestion, Math.max(0, view.closesAt - Date.now()));
      }
    },
    onCue(listener: () => void) { onCueChange = listener; },
    getCue() {
      if (active < 0) return 0;
      if (dialogueStep === 'preview') return transcriptPreviewCue;
      const current = script[active];
      const establishing = dialogueStep === 'artwork';
      if (!current.original) return current.number * 2 + Number(establishing);
      const offset = establishing ? establishingCueOffset : trialRevealed ? revealedTrialCueOffset : 0;
      return current.number + offset;
    },
    setCue(cue: number) {
      if (active < 0) return;
      const scene = script[active].scene;
      const first = firstCue.get(scene)!;
      if (cue === transcriptPreviewCue) {
        if (dialogueStep !== 'preview' && opensTranscript(first)) select(first, { step: 'preview' });
        return;
      }
      const custom = cue >= customCueOffset * 2;
      const revealed = !custom && scene === 'P1' && cue >= revealedTrialCueOffset;
      const photoStep = custom ? cue % 2 === 1 : !revealed && cue >= establishingCueOffset;
      const number = custom ? Math.floor(cue / 2) : cue - (revealed ? revealedTrialCueOffset : photoStep ? establishingCueOffset : 0);
      let index = script.findIndex(line => line.scene === scene && line.number === number && line.original !== custom);
      if (!custom && number === 0 && (photoStep || index < 0)) index = first;
      if (index < 0) return;
      if (revealed) {
        if (index !== active || dialogueStep === 'artwork') select(index);
        trial.reveal();
        trialRevealed = true;
        return;
      }
      const step = photoStep ? 'artwork' : 'line';
      if (index === active && step === dialogueStep && !trialRevealed) return;
      if (photoStep ? hasArtworkStep(index) : !legendById.get(scene)?.imageOnly) select(index, { step });
    },
  };
}
