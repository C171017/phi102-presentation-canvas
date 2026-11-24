import { createPaperMiniSlide } from './paper-mini-slide';
import { createTrialDialogue } from './trial-dialogue';
import { createDialogueFrame } from './dialogue-frame';
import { createSpeakerOutline } from './speaker-outline';
import { createTheoryRecords } from './theory-records';
import portrait from './assets/professor-lin-classroom.webp';
import type { createLocalQuizVotes, QuizChoice, QuizCounts } from './local-quiz-votes';
import { openingQuizWindowMs, type OpeningQuizSnapshot } from './opening-quiz';
import { legendById, legendSlides } from './slide-content';
import { hasEstablishingShot, type InkOceanCue } from './ink-ocean-scenes';
import { establishingCueOffset, revealedTrialCueOffset } from './live-protocol';
import './classroom-dialogue.css';

const introScenes = ['unitrans-arrival', 'before-lecture'];
const script: (InkOceanCue & { scene: string; phase?: 'question' | 'reveal' })[] = [
  { scene: 'contemporary-heading', speaker: 'Professor Lin', text: 'Contextualism is the idea that what we mean when we say “I know” can change depending on the conversation.' },
  { scene: 'contemporary-heading', speaker: 'Professor Lin', phase: 'question', text: 'What do you see there?' },
  { scene: 'contemporary-heading', speaker: 'Professor Lin', text: 'Ten seconds, a room full of philosophers, and somehow you’re all wrong. Well, Contemporary Contextualism it is. Read the texts.' },
  { scene: 'contemporary-heading', speaker: 'Professor Lin', text: 'Anyway, long, long ago, when the chalk in this very room was still young, it has a very different name:' },
  { scene: 'contemporary-heading', speaker: 'Professor Lin', phase: 'reveal', text: 'Flexible foundationalism.' },
  ...legendSlides.flatMap(({ id, cues }) => cues.map(line => ({ ...line, scene: id }))),
];

const questionIndex = script.findIndex(line => line.phase === 'question');
const answerWindowMs = openingQuizWindowMs;

export function createClassroomDialogue(shell: HTMLElement, quizEnabled: boolean, openScene: (id: string) => void, tally?: ReturnType<typeof createLocalQuizVotes>, shared = false, presenter = false, playOpening?: () => void) {
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
  const notes = createPaperMiniSlide();
  const reader = document.createElement('div');
  reader.className = 'transcript-reader';
  reader.tabIndex = 0;
  reader.setAttribute('role', 'region');
  reader.setAttribute('aria-label', 'Transcript. Scroll or use the arrow keys to move between lines.');
  const rows = script.map(({ text, phase, speaker, speakerId, kind }) => {
    const row = document.createElement('div');
    row.className = 'transcript-row';
    row.dataset.speaker = speakerId ?? speaker;
    if (kind) row.dataset.cueKind = kind;
    if (phase === 'reveal') row.classList.add('flashback-reveal');
    row.textContent = text;
    reader.append(row);
    return row;
  });
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
  const firstCue = new Map<string, number>();
  script.forEach((line, index) => { if (!firstCue.has(line.scene)) firstCue.set(line.scene, index); });
  const finalAnswererCue = firstCue.get('L4')! + legendById.get('L4')!.cues.length - 1;
  const theory = createTheoryRecords(shell, openScene, shared, presenter, () => {
    if (script[active]?.scene === 'L4') select(finalAnswererCue, false);
  });
  const controls = document.createElement('nav');
  controls.className = 'legend-paging';
  controls.setAttribute('aria-label', 'Dialogue navigation');
  for (const direction of [-1, 1]) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = direction < 0 ? '‹' : '›';
    button.setAttribute('aria-label', direction < 0 ? 'Previous cue' : 'Next cue');
    button.addEventListener('click', () => move(direction));
    controls.append(button);
  }
  stage.append(controls);
  const trial = createTrialDialogue(stage, () => move(1));
  let onCueChange: (() => void) | undefined;
  shell.append(stage);

  const characters = stage.querySelectorAll<HTMLElement>('.classroom-character[data-speaker]');
  let introIndex = -1;
  let active = -1;
  let establishing = false;
  let trialRevealed = false;
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
  const artwork = createDialogueFrame(url => {
    viewport.style.setProperty('--regress-background', `url("${url}")`);
    const line = script[highlighted];
    if (!line || line.kind || line.scene === 'P1') return;
    const turn = line.speaker === 'Y' && !line.speakerId
      ? script.slice(firstCue.get(line.scene), highlighted).filter(cue => cue.speaker === 'Y').length
      : 0;
    speakerOutline.show(url, line.speakerId ?? line.speaker, turn);
  });
  function photoAt(index: number) {
    const line = script[index];
    const scene = line && legendById.get(line.scene);
    if (!scene) return;
    const cue = index - firstCue.get(scene.id)!;
    if (hasEstablishingShot(scene, cue)) return line.background ?? scene.background;
  }
  function highlight(index: number) {
    if (highlighted === index) return;
    if (highlighted >= 0) rows[highlighted].removeAttribute('aria-current');
    highlighted = index;
    speakerOutline.clear();
    const line = script[index];
    characters.forEach(actor => actor.classList.toggle('is-speaking', actor.dataset.speaker === line?.speaker));
    const legend = line && legendById.get(line.scene);
    if (legend) notes.show(legend.id, legend.title);
    if (line?.scene === 'contemporary-heading') {
      const revealed = line.phase === 'reveal';
      const key = revealed ? 'contemporary-reveal'
        : index > questionIndex ? 'contemporary-result' : 'contemporary-heading';
      notes.show(key, revealed ? 'Flexible Foundationalism' : 'Contemporary Contextualism');
    }
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
    return rows.reduce((best, row, index) =>
      !row.hidden && Math.abs(center(index) - reader.scrollTop) < Math.abs(center(best) - reader.scrollTop) ? index : best, active);
  }
  function finishQuestion() {
    if (active === questionIndex && !choices.hidden) select(questionIndex + 1, presenter);
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
  function select(index: number, local = false, photo?: string) {
    clearQuestion();
    const line = script[index];
    clearTimeout(scrollTimer);
    active = index;
    trialRevealed = false;
    establishing = Boolean(photo);
    viewport.toggleAttribute('data-establishing-shot', establishing);
    const inCourt = line.scene === 'P1';
    panel.hidden = establishing || inCourt;
    if (inCourt) trial.show(photo ? undefined : line);
    else trial.hide();
    if (photo) {
      highlight(-1);
      announcement.textContent = 'Full-color scene: ' + legendById.get(line.scene)!.title;
      artwork.show(photo);
      if (local) onCueChange?.();
      return;
    }
    // Keep the reading and the later conversation out of the transcript until the choice resolves.
    rows.forEach((row, i) => { row.hidden = script[i].scene !== line.scene || (index <= questionIndex && i > questionIndex); });
    highlight(index);
    announcement.textContent = line.speaker + '. ' + line.text;
    if (index === questionIndex && (quizEnabled || presenter)) {
      choices.hidden = false;
      const remaining = roomQuiz?.closesAt ? Math.max(0, roomQuiz.closesAt - Date.now()) : answerWindowMs;
      choices.style.setProperty('--answer-window', remaining + 'ms');
      announcement.textContent += ' Choose B or 13 within ten seconds.';
      quizTimer = window.setTimeout(finishQuestion, remaining);
    }
    if (tally && (index === questionIndex + 1 || (presenter && index === questionIndex))) {
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
    if (!inCourt) reader.scrollTo({ top: center(index), behavior: 'instant' });
  }
  function goToLine(index: number, leavingPhoto = false) {
    if (active < 0 || theory.isOpen()) return;
    const scene = script[active].scene;
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
    if (index > active && finishIntro()) return;
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
  function finishIntro() {
    if (script[active]?.phase !== 'reveal') return false;
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
    const row = (event.target as HTMLElement).closest<HTMLDivElement>('.transcript-row');
    const index = row ? rows.indexOf(row) : -1;
    if (index >= 0) goToLine(index === active ? active + 1 : index);
  });
  reader.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || choices.contains(event.target as Node)) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    move(1);
  });
  reader.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    if (stage.hidden || panel.hidden || active < 0) return;
    const nearest = centeredLine();
    if (active < questionIndex && nearest === questionIndex) {
      select(nearest, true);
      return;
    }
    scrollTimer = window.setTimeout(() => {
      if (stage.hidden || panel.hidden || active < 0) return;
      const nearest = centeredLine();
      if (nearest !== active) goToLine(nearest);
    }, 160);
  });
  new ResizeObserver(() => {
    if (!stage.hidden && !panel.hidden && active >= 0) reader.scrollTop = center(active);
  }).observe(reader);

  function showScene(id?: string) {
    theory.showScene(id);
    if (id === 'contemporary-heading' && !image.hasAttribute('src')) image.src = portrait;
    const legend = id && legendById.has(id);
    controls.hidden = id === 'P1' || (!legend && id !== 'contemporary-heading' && !introScenes.includes(id ?? ''));
    introIndex = introScenes.findIndex(scene => scene === id);
    const index = script.findIndex(line => line.scene === id);
    stage.hidden = index < 0 && introIndex < 0;
    const nextLine = theory.isOpen() ? finalAnswererCue : script[pendingLine]?.scene === id ? pendingLine : index;
    pendingLine = -1;
    if (index < 0) {
      trial.hide();
      establishing = false;
      viewport.removeAttribute('data-establishing-shot');
      panel.hidden = true;
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
  return {
    theory, showScene, handleArrow, stepDialogue, advance: () => move(1),
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
      const offset = establishing ? establishingCueOffset : trialRevealed ? revealedTrialCueOffset : 0;
      return active - firstCue.get(script[active].scene)! + offset;
    },
    setCue(cue: number) {
      if (active < 0 || theory.isOpen()) return;
      const scene = script[active].scene;
      if (scene === 'P1' && cue >= revealedTrialCueOffset) {
        const index = firstCue.get(scene)! + cue - revealedTrialCueOffset;
        if (script[index]?.scene !== scene) return;
        if (index !== active || establishing) select(index);
        trial.reveal();
        trialRevealed = true;
        return;
      }
      const photoStep = cue >= establishingCueOffset;
      const index = firstCue.get(scene)! + cue - (photoStep ? establishingCueOffset : 0);
      if (script[index]?.scene !== scene || (index === active && photoStep === establishing && !trialRevealed)) return;
      const photo = photoStep ? photoAt(index) : undefined;
      if (legendById.get(scene)?.imageOnly && !photo) return;
      if (!photoStep || photo) select(index, false, photo);
    },
  };
}
