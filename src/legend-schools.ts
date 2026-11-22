import { createPaperMiniSlide } from './paper-mini-slide';
import { createDialogueFrame } from './dialogue-frame';
import { dialogueArtwork, establishingArtwork, hasEstablishingShot, inkOceanScenes } from './ink-ocean-scenes';
import { establishingCueOffset } from './live-protocol';
import { isSchoolVote, type School, type SchoolCounts, type SchoolVote } from './school-vote';
import './legend-schools.css';

export type SchoolRoomDisplay = {
  connectSchoolVotes(send: (vote: SchoolVote) => void, followingPresenter?: () => boolean): void;
  updateSchoolCounts(counts?: SchoolCounts): void;
  disconnectSchoolVotes(): void;
};

const schoolIds = ['L6-A', 'L6-B'] as const;
const schoolNames: Record<School, string> = {
  'L6-A': 'Sect of No Doubt',
  'L6-B': 'Seeing-Is-Believing School',
};
const ballotKey = 'phi102-ink-ocean-l6-school-v1';

function savedBallot(): SchoolVote | undefined {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(ballotKey) ?? 'null');
    if (isSchoolVote(stored)) return stored;
  } catch { /* Storage can be disabled for a presentation viewed in private mode. */ }
}

type Scene = (typeof inkOceanScenes)[School | 'L6'];

function makePanel(scene: Scene, selectCue: (cue: number) => void) {
  const section = document.createElement('section');
  section.className = 'school-pane';
  section.dataset.scene = scene.id;
  section.setAttribute('aria-label', scene.title);
  const picture = document.createElement('div');
  picture.className = 'school-picture';
  const meter = document.createElement('span');
  meter.className = 'school-dry-meter';
  const panel = document.createElement('div');
  panel.className = 'school-dialogue transcript-panel';
  const notes = createPaperMiniSlide();
  notes.show(scene.id, scene.title);
  const reader = document.createElement('div');
  reader.className = 'transcript-reader';
  reader.setAttribute('aria-label', scene.title + ' dialogue');
  reader.tabIndex = 0;
  const rows = scene.cues.map((cue, index) => {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'transcript-row';
    row.dataset.speaker = cue.speakerId ?? cue.speaker;
    row.textContent = cue.text;
    row.setAttribute('aria-label', cue.speaker + ': ' + cue.text);
    row.addEventListener('click', () => selectCue(index));
    reader.append(row);
    return row;
  });
  panel.append(notes.element, reader);
  section.append(picture, meter, panel);
  let selected = -1;
  let scrolling = 0;
  reader.addEventListener('wheel', event => {
    if (event.deltaY === 0) return;
    event.preventDefault();
    event.stopPropagation();
    const now = performance.now();
    if (now < scrolling) return;
    scrolling = now + 180;
    const next = Math.min(rows.length - 1, Math.max(0, selected + Math.sign(event.deltaY)));
    if (next !== selected) selectCue(next);
  }, { passive: false });
  reader.addEventListener('scrollend', () => {
    if (section.hidden || panel.hidden || !reader.clientHeight || selected < 0) return;
    const middle = reader.scrollTop + reader.clientHeight / 2;
    const distance = (row: HTMLElement) => Math.abs(row.offsetTop + row.offsetHeight / 2 - middle);
    const nearest = rows.reduce((best, row, index) => distance(row) < distance(rows[best]) ? index : best, selected);
    if (nearest !== selected) selectCue(nearest);
  });

  const artwork = createDialogueFrame(url => { picture.style.backgroundImage = `url("${url}")`; });
  function update(index: number, photo = false) {
    const row = rows[index];
    if (!row) return;
    panel.hidden = meter.hidden = photo;
    if (photo) {
      rows[selected]?.removeAttribute('aria-current');
      selected = -1;
      artwork.show(establishingArtwork(scene, index));
      artwork.preload(dialogueArtwork(scene, index));
      return;
    }
    if (selected !== index) {
      rows[selected]?.removeAttribute('aria-current');
      selected = index;
      row.setAttribute('aria-current', 'true');
      artwork.show(dialogueArtwork(scene, index));
      if (index + 1 < scene.cues.length) artwork.preload(hasEstablishingShot(scene, index + 1)
        ? establishingArtwork(scene, index + 1) : dialogueArtwork(scene, index + 1));
      const dry = scene.id === 'L6-B' ? (index >= 6 ? 28 : index >= 3 ? 40 : 35)
        : scene.id === 'L6-A' && index >= 6 ? 34 : 35;
      meter.textContent = 'Dry world remaining · ' + dry + '%';
    }
    reader.scrollTop = row.offsetTop + (row.offsetHeight - reader.clientHeight) / 2;
  }
  return { section, update, prepare: () => artwork.preload(establishingArtwork(scene, 0)) };
}

export function createLegendSchools(shell: HTMLElement, options: {
  role: 'presenter' | 'audience' | 'editor'; onEnd?: () => void;
}) {
  const isAudience = options.role === 'audience';
  const intro = inkOceanScenes.L6;
  const splitAt = intro.cues.length;
  const end = splitAt + inkOceanScenes['L6-A'].cues.length - 1;
  const stage = document.createElement('section');
  stage.className = 'legend-schools';
  stage.hidden = true;
  stage.setAttribute('aria-label', 'Choose your school');
  const panels = document.createElement('div');
  panels.className = 'school-panes';
  const controls = document.createElement('div');
  controls.className = 'school-choices';
  const tally = document.createElement('p');
  tally.className = 'school-tally';
  tally.hidden = true;
  const arrows = document.createElement('nav');
  arrows.className = 'school-cue-controls';
  arrows.setAttribute('aria-label', 'School dialogue');
  function button(label: string, action: () => void) {
    const element = document.createElement('button');
    element.type = 'button';
    element.textContent = label;
    element.addEventListener('click', action);
    return element;
  }
  const previous = button('‹', () => step(-1));
  const next = button('›', () => { if (!step(1)) options.onEnd?.(); });
  previous.setAttribute('aria-label', 'Previous dialogue cue');
  next.setAttribute('aria-label', 'Next dialogue cue');
  arrows.append(previous, next);
  stage.append(panels, controls, tally, arrows);
  (shell.querySelector<HTMLElement>('#viewport') ?? shell).append(stage);
  stage.addEventListener('pointerdown', event => event.stopPropagation());
  stage.addEventListener('pointerup', event => event.stopPropagation());
  stage.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const direction = ['ArrowRight', 'ArrowDown', 'PageDown'].includes(event.key) ? 1
      : ['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key) ? -1 : 0;
    if (direction && step(direction)) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  let ballot = isAudience ? savedBallot() : undefined;
  let sendVote: ((vote: SchoolVote) => void) | undefined;
  let roomReady = false;
  let followingPresenter = () => false;
  let cursor = 0;
  let establishing = true;
  let onLocalCue: ((index: number) => void) | undefined;
  const introPanel = makePanel(intro, browseCue);
  const views = {
    'L6-A': makePanel(inkOceanScenes['L6-A'], index => browseCue(splitAt + index)),
    'L6-B': makePanel(inkOceanScenes['L6-B'], index => browseCue(splitAt + index)),
  };
  panels.append(introPanel.section, views['L6-A'].section, views['L6-B'].section);
  const confirmation = document.createElement('span');
  confirmation.className = 'school-confirmation';
  confirmation.setAttribute('role', 'status');
  if (isAudience) {
    for (const school of schoolIds) {
      const choice = button(schoolNames[school], () => choose(school));
      choice.dataset.school = school;
      controls.append(choice);
    }
    controls.append(confirmation);
  } else {
    controls.append(button('Show both schools', () => localCue(splitAt, true)));
  }

  function hasPhoto(index: number) {
    if (index < splitAt) return hasEstablishingShot(intro, index);
    const schools = isAudience && ballot ? [ballot.school] : schoolIds;
    return schools.some(school => hasEstablishingShot(inkOceanScenes[school], index - splitAt));
  }

  function render() {
    if (stage.hidden) return;
    const awaitingChoice = isAudience && !ballot;
    const inBranches = cursor >= splitAt && !awaitingChoice;
    const split = inBranches && !isAudience;
    const photo = establishing && (inBranches || cursor < splitAt);
    stage.toggleAttribute('data-establishing-shot', photo);
    panels.classList.toggle('school-split', split);
    introPanel.section.hidden = inBranches;
    for (const school of schoolIds) {
      views[school].section.hidden = !inBranches || (isAudience && ballot?.school !== school);
      if (!views[school].section.hidden) views[school].update(cursor - splitAt, photo);
    }
    if (!inBranches) {
      introPanel.update(Math.min(cursor, splitAt - 1), photo);
      if (cursor === splitAt - 1) schoolIds.forEach(id => views[id].prepare());
    }
    controls.hidden = photo || inBranches || cursor < splitAt - 1;
    if (isAudience) {
      controls.querySelectorAll<HTMLButtonElement>('button').forEach(choice => { choice.hidden = Boolean(ballot); });
      confirmation.hidden = !ballot;
      if (ballot) confirmation.textContent = 'Your school · ' + schoolNames[ballot.school];
    }
    previous.disabled = cursor === 0 && establishing;
    next.disabled = awaitingChoice && cursor >= splitAt - 1;
    next.hidden = cursor === end && !options.onEnd;
  }

  function choose(school: School) {
    if (ballot) return;
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    const voter = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
    ballot = { type: 'school', school, voter };
    try { localStorage.setItem(ballotKey, JSON.stringify(ballot)); } catch { /* Keep the tab's choice. */ }
    if (roomReady) sendVote?.(ballot);
    // Selecting a school is a ballot, not a request to navigate away from the presenter.
    // Late voters join the current row. Early followers wait for the shared first row.
    if (followingPresenter()) render();
    else setCue(cursor < splitAt ? splitAt + establishingCueOffset : getCue());
  }

  function getCue() { return cursor + (establishing ? establishingCueOffset : 0); }
  function setCue(cue: number) {
    const photo = cue >= establishingCueOffset;
    const index = cue - (photo ? establishingCueOffset : 0);
    if (!Number.isInteger(index) || index < 0 || index > end) return;
    if (photo && !hasPhoto(index)) return;
    cursor = index;
    establishing = photo;
    render();
  }
  function localCue(index: number, photo = false) {
    setCue(index + (photo ? establishingCueOffset : 0));
    onLocalCue?.(getCue());
  }
  function browseCue(index: number) {
    for (let next = cursor + 1; next <= index; next++) {
      if (hasPhoto(next)) { localCue(next, true); return; }
    }
    localCue(index);
  }
  function show(active: boolean) {
    if (active === !stage.hidden) return;
    stage.hidden = !active;
    if (active) {
      cursor = 0;
      establishing = true;
      render();
    }
  }
  function step(direction: number) {
    if (stage.hidden || direction === 0) return false;
    if (isAudience && !ballot && direction > 0 && cursor >= splitAt - 1) return true;
    if (direction > 0 && establishing) { localCue(cursor); return true; }
    if (direction < 0 && !establishing && hasPhoto(cursor)) { localCue(cursor, true); return true; }
    const index = cursor + Math.sign(direction);
    if (index < 0 || index > end) return false;
    localCue(index, direction > 0 && hasPhoto(index));
    return true;
  }
  new ResizeObserver(render).observe(panels);
  return {
    show, step, setCue, getCue,
    onCue(listener: (index: number) => void) { onLocalCue = listener; },
    connectSchoolVotes(send: (vote: SchoolVote) => void, follows?: () => boolean) {
      sendVote = send;
      followingPresenter = follows ?? (() => false);
    },
    updateSchoolCounts(counts?: SchoolCounts) {
      if (!roomReady && ballot) sendVote?.(ballot);
      roomReady = true;
      tally.hidden = isAudience || !counts;
      if (counts && !isAudience) {
        tally.textContent = schoolIds.map(school => schoolNames[school] + ' ' + counts[school]).join(' · ');
      }
    },
    disconnectSchoolVotes() { roomReady = false; tally.hidden = true; },
  };
}
