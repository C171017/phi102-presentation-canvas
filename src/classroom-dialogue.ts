import { addDialogueSpeaker, dialogueSpeaker, groupDialogueLabels } from './dialogue-speakers';
import { createPaperMiniSlide } from './paper-mini-slide';
import { createTrialDialogue } from './trial-dialogue';
import { createDialogueFrame } from './dialogue-frame';
import { createSpeakerOutline } from './speaker-outline';
import { createTheoryRecords } from './theory-records';
import portrait from './assets/professor-lin-classroom.webp';
import type { createLocalQuizVotes, QuizChoice, QuizCounts } from './local-quiz-votes';
import { openingQuizWindowMs, type OpeningQuizSnapshot } from './opening-quiz';
import { legendById } from './slide-content';
import { authoredCues, buildClassroomScript, customCueOffset, editableCueSequence, firstGreatInkwellCue, openingClassroomScene } from './classroom-cues';
import { hasEstablishingShot, openingInkScene, type InkOceanCue } from './ink-ocean-scenes';
import { establishingCueOffset, revealedTrialCueOffset } from './live-protocol';
import type { DialogueStructure, SlideCopy } from './shared-slide-data';
import type { InlineDialogueTarget } from './inline-dialogue';
import './classroom-dialogue.css';

const introScenes = ['unitrans-arrival', 'before-lecture'];
const answerWindowMs = openingQuizWindowMs;

export function createClassroomDialogue(shell: HTMLElement, quizEnabled: boolean, openScene: (id: string) => void, tally?: ReturnType<typeof createLocalQuizVotes>, shared = false, presenter = false, playOpening?: () => void, sharedCopy?: (key: string) => SlideCopy | undefined, sharedLine?: (key: string) => string | undefined, dialogueStructure?: () => Record<string, DialogueStructure> | undefined) {
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
  function yTurn(line: typeof script[number]) {
    return line.speaker === 'Y' && !line.speakerId
      ? authoredCues(line.scene).slice(0, line.sourceNumber).filter(cue => cue.speaker === 'Y').length
      : 0;
  }
  function appearance(line: typeof script[number]) {
    return line.silent ? undefined : dialogueSpeaker(line, line.scene, yTurn(line));
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
  const theory = createTheoryRecords(shell, openScene, shared, presenter, () => {
    if (script[active]?.scene === 'L4') select(lastCue.get('L4')!, false);
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
  const trial = createTrialDialogue(stage, () => move(1));
  let onCueChange: (() => void) | undefined;
  shell.append(stage);

  const characters = stage.querySelectorAll<HTMLElement>('.classroom-character[data-speaker]');
  let introIndex = -1;
  let active = -1;
  let establishing = false;
  let trialRevealed = false;
  let editing = false;
  let pendingLine = -1;
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
  const openingArtwork = document.createElement('div');
  openingArtwork.className = 'opening-ink-artwork';
  openingArtwork.setAttribute('aria-hidden', 'true');
  const lawImage = legendById.get(openingInkScene)?.background;
  const inkwellImage = firstGreatInkwellCue.background;
  if (lawImage && inkwellImage) {
    openingArtwork.style.backgroundImage = `url("${lawImage}")`;
    openingArtwork.style.setProperty('--inkwell-image', `url("${inkwellImage}")`);
    viewport.prepend(openingArtwork);
  }
  const artwork = createDialogueFrame(url => {
    viewport.style.setProperty('--regress-background', `url("${url}")`);
    openingArtwork.classList.toggle('show-inkwell', script[active]?.scene === openingInkScene && url === inkwellImage);
    const line = script[highlighted];
    if (!line || line.silent || line.kind || line.scene === 'P1') return;
    speakerOutline.show(url, line.speakerId ?? line.speaker, yTurn(line));
  });
  function photoAt(index: number) {
    const line = script[index];
    const scene = line && legendById.get(line.scene);
    if (!scene) return;
    if (index === firstCue.get(scene.id)) return line.background ?? scene.background;
    if (line.original && line.number > 0 && hasEstablishingShot(scene, line.number)) return line.background ?? scene.background;
  }
  function highlight(index: number) {
    if (highlighted === index) return;
    if (highlighted >= 0) rows[highlighted].removeAttribute('aria-current');
    highlighted = index;
    speakerOutline.clear();
    const line = script[index];
    characters.forEach(actor => actor.classList.toggle('is-speaking', !line?.silent && actor.dataset.speaker === line?.speaker));
    const legend = line && legendById.get(line.scene);
    if (legend) notes.show(legend.id, legend.title);
    if (line?.scene === 'contemporary-heading') notes.show('contemporary-heading', 'Contemporary Contextualism');
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
    if (!finishIntro(next)) select(next, presenter);
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
    rows.forEach((row, index) => { row.hidden = script[index].scene !== scene || Boolean(script[index].silent); });
    groupDialogueLabels(rows);
  }
  function quizResultsIndex() {
    return resultIndex > questionIndex ? resultIndex : questionIndex + 1;
  }
  function select(index: number, local = false, photo?: string) {
    clearQuestion();
    const line = script[index];
    clearTimeout(scrollTimer);
    active = index;
    trialRevealed = false;
    establishing = Boolean(photo);
    viewport.toggleAttribute('data-establishing-shot', establishing);
    const inCourt = line.scene === 'P1';
    showTranscript(!establishing && !inCourt);
    if (inCourt) trial.show(photo ? undefined : line, sharedLine?.(line.key));
    else trial.hide();
    if (photo) {
      highlight(-1);
      announcement.textContent = 'Full-color scene: ' + legendById.get(line.scene)!.title;
      artwork.show(photo);
      if (local) onCueChange?.();
      return;
    }
    setVisibleRows(line.scene);
    highlight(index);
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
    // The question changes row heights and reveals the rest of the transcript.
    // Snap to its new geometry before processing any further scroll gestures.
    if (!inCourt && !rows[index].hidden) reader.scrollTo({ top: center(index), behavior: 'instant' });
  }
  function skipSilentText(index: number, direction: number) {
    while (script[index]?.silent && (script[index].phase === 'reveal' || (script[index].phase === 'result' && !tally))) index += direction;
    return index;
  }
  function goToLine(index: number, leavingPhoto = false) {
    if (active < 0 || theory.isOpen()) return;
    const scene = script[active].scene;
    index = skipSilentText(index, index < active ? -1 : 1);
    if (scene === openingClassroomScene && active < questionIndex && index > questionIndex) index = questionIndex;
    if (!leavingPhoto && index < active) {
      const photo = photoAt(active);
      if (photo) { select(active, true, photo); return; }
    }
    if (script[index]?.scene !== scene) {
      if (index < active && theory.selectedAnswererScene() === scene) return;
      if (index > active && theory.advance(scene)) return;
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
      pendingLine = index;
      openScene(destination);
      return;
    }
    if (index > active) {
      // Scrolling or clicking a later line still stops at the first new picture.
      for (let next = active + 1; next <= index; next++) {
        const photo = photoAt(next);
        if (photo) { select(next, true, photo); return; }
      }
    }
    select(index, true);
  }
  function move(direction: number) {
    if (editing) return;
    if (direction > 0 && trial.reveal()) {
      trialRevealed = true;
      onCueChange?.();
      return;
    }
    if (establishing) {
      if (direction > 0 && legendById.get(script[active].scene)?.imageOnly) goToLine(active + 1, true);
      else if (direction > 0) select(active, true);
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
    if (index >= 0) goToLine(index === active ? active + 1 : index);
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
    if (editing || stage.hidden || panel.hidden || active < 0 || script[active].silent) return;
    scrollTimer = window.setTimeout(() => {
      if (editing || stage.hidden || panel.hidden || active < 0 || script[active].silent) return;
      const nearest = centeredLine();
      if (nearest !== active) goToLine(nearest);
    }, 160);
  });
  new ResizeObserver(() => {
    if (!editing && !stage.hidden && !panel.hidden && active >= 0 && !rows[active].hidden) reader.scrollTop = center(active);
  }).observe(reader);

  function showScene(id?: string) {
    const openingInk = id === openingInkScene && Boolean(lawImage && inkwellImage);
    viewport.toggleAttribute('data-opening-ink', openingInk);
    if (!openingInk) openingArtwork.classList.remove('show-inkwell');
    theory.showScene(id);
    if (id === 'contemporary-heading' && !image.hasAttribute('src')) image.src = portrait;
    const nextScene = id === 'contemporary-heading' ? 'L0'
      : id === 'L7' ? 'P1' : id === 'P1' ? 'P2-1' : undefined;
    const nextBackground = id === openingInkScene ? inkwellImage : nextScene && legendById.get(nextScene)?.background;
    if (nextBackground) artwork.preload(nextBackground);
    introIndex = introScenes.findIndex(scene => scene === id);
    const index = script.findIndex(line => line.scene === id);
    stage.hidden = index < 0 && introIndex < 0;
    const nextLine = theory.isOpen() ? lastCue.get('L4')! : script[pendingLine]?.scene === id ? pendingLine : index;
    pendingLine = -1;
    if (index < 0) {
      trial.hide();
      establishing = false;
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
    if (script[active]?.scene !== id) select(nextLine, false, nextLine === index && !theory.isOpen() ? photoAt(index) : undefined);
  }
  function refreshSlideCopy(force = false) {
    if (editing) return;
    notes.refresh(force);
    const nextStructure = dialogueStructure?.();
    const serialized = JSON.stringify(nextStructure ?? {});
    if (serialized !== structure) {
      const previous = script[active];
      const position = previous ? active - firstCue.get(previous.scene)! : 0;
      const previousShot = establishing;
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
        select(index, false, previousShot ? photoAt(index) : undefined);
      }
    }
    rows.forEach((row, index) => {
      const next = lineText(index);
      const words = row.querySelector<HTMLElement>('.dialogue-words')!;
      if (words.textContent !== next) words.textContent = next;
    });
    if (force && script[active]?.scene === 'P1' && !establishing) trial.updateText(script[active], sharedLine?.(script[active].key));
  }

  function inlineTarget(): InlineDialogueTarget | undefined {
    if (stage.hidden || establishing || active < 0 || theory.isOpen()) return;
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
    theory, showScene, handleArrow, stepDialogue, advance: () => move(1),
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
      const current = script[active];
      if (!current.original) return current.number * 2 + Number(establishing);
      const offset = establishing ? establishingCueOffset : trialRevealed ? revealedTrialCueOffset : 0;
      return current.number + offset;
    },
    setCue(cue: number) {
      if (active < 0 || theory.isOpen()) return;
      const scene = script[active].scene;
      const custom = cue >= customCueOffset * 2;
      const revealed = !custom && scene === 'P1' && cue >= revealedTrialCueOffset;
      const photoStep = custom ? cue % 2 === 1 : !revealed && cue >= establishingCueOffset;
      const number = custom ? Math.floor(cue / 2) : cue - (revealed ? revealedTrialCueOffset : photoStep ? establishingCueOffset : 0);
      let index = script.findIndex(line => line.scene === scene && line.number === number && line.original !== custom);
      if (index < 0 && number === 0 && !custom) index = firstCue.get(scene)!;
      if (index < 0) return;
      if (revealed) {
        if (index !== active || establishing) select(index);
        trial.reveal();
        trialRevealed = true;
        return;
      }
      if (index === active && photoStep === establishing && !trialRevealed) return;
      const photo = photoStep ? photoAt(index) : undefined;
      if (legendById.get(scene)?.imageOnly && !photo) return;
      if (!photoStep || photo) select(index, false, photo);
    },
  };
}
