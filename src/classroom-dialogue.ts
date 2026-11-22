import portrait from './assets/professor-lin-classroom.webp';
import type { createLocalQuizVotes, QuizChoice, QuizCounts } from './local-quiz-votes';
import { regressFlashback } from './slide-content';
import './classroom-dialogue.css';

const introScenes = ['unitrans-arrival', 'before-lecture'];
const script: { scene: string; speaker: string; text: string; voice?: number; phase?: 'question' | 'reveal' }[] = [
  { scene: 'contemporary-heading', speaker: 'Professor Lin', text: 'Contextualism is the idea that what we mean when we say “I know” can change depending on the conversation.' },
  { scene: 'contemporary-heading', speaker: 'Professor Lin', phase: 'question', text: 'What do you see there?' },
  { scene: 'contemporary-heading', speaker: 'Professor Lin', text: 'Contemporary contextualism it is.' },
  { scene: 'contemporary-heading', speaker: 'Professor Lin', text: 'Now, long, long ago, when the chalk in this very room was still young, philosophers used the word “contextualism” for a different question.' },
  { scene: 'contemporary-heading', speaker: 'Professor Lin', phase: 'reveal', text: 'Flexible foundationalism.' },
  ...regressFlashback.flatMap(({ id, dialogue }) => dialogue.map(line => ({ ...line, scene: id }))),
];

const questionIndex = script.findIndex(line => line.phase === 'question');
const answerWindowMs = 10_000;

export function createClassroomDialogue(shell: HTMLElement, quizEnabled: boolean, openScene: (id: string) => void, tally?: ReturnType<typeof createLocalQuizVotes>, playVideo?: () => void, showVoice?: (voice?: number) => void) {
  const stage = document.createElement('div');
  stage.className = 'classroom-stage';
  stage.hidden = true;
  const character = document.createElement('button');
  character.type = 'button';
  character.className = 'classroom-character';
  character.setAttribute('aria-label', 'Continue by clicking Professor Lin');
  const image = new Image();
  image.src = portrait;
  image.alt = 'Illustrated Professor Lin';
  image.draggable = false;
  character.dataset.speaker = 'Professor Lin';
  character.append(image);

  const panel = document.createElement('section');
  panel.className = 'transcript-panel';
  panel.setAttribute('aria-label', 'Opening dialogue');
  const summary = document.createElement('p');
  summary.className = 'transcript-summary';
  const sceneTitle = document.createElement('span');
  sceneTitle.className = 'transcript-scene-title';
  const summaryText = document.createTextNode('');
  summary.append(sceneTitle, summaryText);
  const reader = document.createElement('div');
  reader.className = 'transcript-reader';
  reader.tabIndex = 0;
  reader.setAttribute('role', 'region');
  reader.setAttribute('aria-label', 'Transcript. Scroll or use the arrow keys to move between lines.');
  const rows = script.map(({ text, phase }) => {
    const row = document.createElement('div');
    row.className = 'transcript-row';
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
  panel.append(summary, reader);
  stage.append(character, panel, announcement);
  if (quizEnabled || tally) stage.append(choices);
  shell.append(stage);

  const characters = stage.querySelectorAll<HTMLElement>('.classroom-character[data-speaker]');
  let introIndex = -1;
  let active = -1;
  let pendingLine = -1;
  let highlighted = -1;
  let scrollTimer = 0;
  let quizTimer = 0;
  let visit = 0;
  let latestRead = 0;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function center(index: number) {
    const row = rows[index];
    return row.offsetTop + row.offsetHeight / 2 - reader.clientHeight / 2;
  }
  function highlight(index: number) {
    if (highlighted === index) return;
    if (highlighted >= 0) rows[highlighted].removeAttribute('aria-current');
    highlighted = index;
    const line = script[index];
    characters.forEach(actor => actor.classList.toggle('is-speaking', actor.dataset.speaker === line?.speaker));
    showVoice?.(line?.voice);

    rows[index]?.setAttribute('aria-current', 'true');
  }
  function centeredLine() {
    return rows.reduce((best, row, index) =>
      !row.hidden && Math.abs(center(index) - reader.scrollTop) < Math.abs(center(best) - reader.scrollTop) ? index : best, active);
  }
  function finishQuestion() {
    if (active === questionIndex && !choices.hidden) select(questionIndex + 1, false);
  }
  async function submitAnswer(answer: QuizChoice) {
    if (!tally) { finishQuestion(); return; }
    const questionVisit = visit;
    clearTimeout(quizTimer);
    answerButtons.forEach(button => { button.disabled = true; });
    try {
      await tally.request(answer);
      if (visit === questionVisit) finishQuestion();
    } catch {
      if (visit !== questionVisit) return;
      answerButtons.forEach(button => { button.disabled = false; });
      resultLabel.textContent = 'Could not reach the local tally. Choose again to retry.';
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
    const read = ++latestRead;
    try {
      const counts = await tally.request();
      if (read === latestRead) paintResults(counts);
    } catch {
      if (read === latestRead) resultLabel.textContent = 'Local tally unavailable';
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
  function select(index: number, animate: boolean) {
    clearQuestion();
    const line = script[index];
    // Keep the reading and the later conversation out of the transcript until the choice resolves.
    rows.forEach((row, i) => { row.hidden = script[i].scene !== line.scene || (index <= questionIndex && i > questionIndex); });
    clearTimeout(scrollTimer);
    active = index;
    highlight(index);
    announcement.textContent = line.speaker + '. ' + line.text;
    if (quizEnabled && index === questionIndex) {
      choices.hidden = false;
      announcement.textContent += ' Choose B or 13 within ten seconds.';
      quizTimer = window.setTimeout(finishQuestion, answerWindowMs);
    } else if (tally && index === questionIndex + 1) {
      choices.dataset.mode = 'results';
      choices.setAttribute('aria-label', 'Audience vote distribution');
      choices.hidden = false;
      answerButtons.forEach(button => { button.disabled = true; });
      resultLabel.hidden = false;
      resultLabel.textContent = 'Reading audience votes…';
      void refreshResults();
    }
    // The question changes row heights and reveals the rest of the transcript.
    // Snap to its new geometry before processing any further scroll gestures.
    reader.scrollTo({ top: center(index), behavior: animate && index > questionIndex && !reduced.matches ? 'smooth' : 'instant' });
  }
  function goToLine(index: number, animate = true) {
    if (active < 0) return;
    if (!choices.hidden && active === questionIndex && index > active) {
      answerButtons[0].focus({ preventScroll: true });
      return;
    }
    if (index < 0) { openScene(introScenes[introScenes.length - 1]); return; }
    if (index > active && finishIntro()) return;
    if (index === script.length) { openScene('dilemma-heading'); return; }
    if (script[index].scene !== script[active].scene) {
      pendingLine = index;
      openScene(script[index].scene);
      return;
    }
    select(index, animate);
  }
  function move(direction: number, animate = true) {
    if (introIndex < 0) { goToLine(active + direction, animate); return; }
    const next = introIndex + direction;
    const scene = next === introScenes.length ? script[0].scene : introScenes[next];
    if (scene) openScene(scene);
  }
  function handleArrow(key: string) {
    if (stage.hidden) return false;
    if (key === 'ArrowLeft' || key === 'ArrowUp') move(-1, false);
    else if (key === 'ArrowRight' || key === 'ArrowDown') move(1, false);
    else return false;
    return true;
  }
  function finishIntro() {
    if (script[active]?.phase !== 'reveal') return false;
    if (playVideo) playVideo();
    else openScene('regress-problem');
    return true;
  }
  function stepFlashback(direction: number) {
    if (!regressFlashback.some(scene => scene.id === script[active]?.scene)) return false;
    move(direction, false);
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
    if (stage.hidden || active < 0) return;
    const nearest = centeredLine();
    if (active < questionIndex && nearest === questionIndex) {
      select(nearest, false);
      return;
    }
    if (script[nearest].scene === script[active].scene) highlight(nearest);
    scrollTimer = window.setTimeout(() => {
      if (stage.hidden || active < 0) return;
      const nearest = centeredLine();
      if (nearest !== active) goToLine(nearest);
    }, 160);
  });
  new ResizeObserver(() => {
    if (!stage.hidden && active >= 0) reader.scrollTop = center(active);
  }).observe(reader);

  function showScene(id?: string, description = '', title = '') {
    introIndex = introScenes.findIndex(scene => scene === id);
    const index = script.findIndex(line => line.scene === id);
    stage.hidden = index < 0 && introIndex < 0;
    panel.hidden = index < 0;
    const nextLine = script[pendingLine]?.scene === id ? pendingLine : index;
    pendingLine = -1;
    if (index < 0) {
      clearTimeout(scrollTimer);
      clearQuestion();
      active = -1;
      highlight(-1);
      announcement.textContent = '';
      return;
    }
    sceneTitle.textContent = title;
    summaryText.data = description;
    if (script[active]?.scene !== id) select(nextLine, false);
  }
  return { showScene, handleArrow, finishIntro, stepFlashback, advance: () => move(1) };
}
