import { slides } from './slide-content';
import { applyTheoryAction, theories, theoryNames, theoryScene, voteHub, voteView,
  type Theory, type TheoryAction, type TheoryBallot, type TheoryView } from './theory-vote';
import './theory-records.css';

export function createTheoryRecords(stage: HTMLElement, openScene: (scene: string) => void, shared: boolean, presenter: boolean, onOpen: () => void) {
  const panel = document.createElement('section');
  panel.className = 'theory-ballot';
  panel.hidden = true;
  panel.setAttribute('aria-label', 'Audience vote');
  const title = document.createElement('h2');
  title.textContent = 'Which Answerer goes next?';
  const records = document.createElement('div');
  records.className = 'record-quiz theory-records';
  records.dataset.mode = 'theories';
  const status = document.createElement('p');
  status.setAttribute('role', 'status');
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'close-ballot';
  close.textContent = 'Use current votes';
  close.addEventListener('click', () => act('close'));
  panel.append(title, records, status, close);
  stage.append(panel);

  let scene: string | undefined;
  let state: TheoryView | undefined;
  let solo: TheoryBallot | null = null;
  let send: ((message: TheoryAction) => void) | undefined;
  let online = !shared;
  let hostOnline = false;
  let order: Theory[] = [];
  let swappedAt = -Infinity;
  let soloTimer: number | undefined;
  function act(action: TheoryAction['action'], choice?: Theory) {
    const message: TheoryAction = { type: 'theory', round: state?.id ?? null, action, choice };
    if (shared) { if (online) send?.(message); return; }
    const index = slides.findIndex(slide => slide.members[0] === scene);
    solo = applyTheoryAction(solo, message, index, true, 'solo', []);
    if (!solo) return;
    window.clearTimeout(soloTimer);
    if (!solo.winner && solo.remaining.length > 1) {
      const round = solo.id;
      soloTimer = window.setTimeout(() => {
        if (solo?.id === round && scene === voteHub) act('close');
      }, Math.max(0, solo.closesAt - Date.now()));
    }
    update(voteView(solo, ['solo'], 'solo'), true);
    const destination = solo.winner ? theoryScene(solo.winner) : voteHub;
    if (destination !== scene) openScene(destination);
  }
  const buttons = new Map<Theory, HTMLButtonElement>();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function dodge() {
    if (order.length < 2 || performance.now() - swappedAt < 350) return;
    const others = order.filter(choice => choice !== 'foundationalism');
    const partner = others[Math.floor(Math.random() * others.length)];
    const a = order.indexOf('foundationalism'), b = order.indexOf(partner);
    const pair = [buttons.get('foundationalism')!, buttons.get(partner)!];
    const before = pair.map(button => button.getBoundingClientRect());
    [order[a], order[b]] = [order[b], order[a]];
    swappedAt = performance.now();
    pair.forEach(button => {
      button.style.order = String(order.indexOf(button.dataset.theory as Theory));
      button.getAnimations().forEach(animation => animation.cancel());
    });
    if (reduced.matches) return;
    pair.forEach((button, i) => {
      const after = button.getBoundingClientRect();
      const from = 'translate(' + (before[i].x - after.x) + 'px,' + (before[i].y - after.y) + 'px)';
      button.animate([{ transform: from, opacity: 1 }, { opacity: i === 0 ? 0 : 1, offset: .5 },
        { transform: 'none', opacity: 1 }], { duration: 330, easing: 'ease-out' });
    });
  }
  for (const choice of theories) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.theory = choice;
    const label = document.createElement('span');
    label.textContent = theoryNames[choice];
    button.append(label);
    const locked = () => choice === 'foundationalism' && order.length > 1;
    if (choice === 'foundationalism') {
      button.addEventListener('pointermove', event => {
        // On touch, keep this target under the finger until its click rejects the vote.
        if (event.pointerType !== 'touch' && !event.buttons && !button.disabled && locked()) dodge();
      });
    }
    button.addEventListener('click', () => {
      if (locked()) { dodge(); return; }
      if (!button.getAnimations().some(animation => animation.playState === 'running')) act('vote', choice);
    });
    buttons.set(choice, button);
    records.append(button);
  }
  function render() {
    const wasHidden = panel.hidden;
    panel.hidden = scene !== voteHub || !state || Boolean(state.winner);
    if (panel.hidden || !state) return;
    if (wasHidden) onOpen();
    const total = Object.values(state.counts).reduce((a, b) => a + b, 0);
    for (const [choice, button] of buttons) {
      button.hidden = !order.includes(choice);
      button.style.order = String(order.indexOf(choice));
      button.disabled = !online || (presenter && state.voters > 0 && shared);
      const locked = choice === 'foundationalism' && order.length > 1;
      button.tabIndex = locked || button.disabled ? -1 : 0;
      button.setAttribute('aria-disabled', String(locked || button.disabled));
      button.setAttribute('aria-pressed', String(state.mine === choice));
      button.style.setProperty('--share', (total ? 100 * state.counts[choice] / total : 0) + '%');
    }
    title.textContent = order.length === 1 ? 'One theory left' : 'Which theory goes next?';
    close.hidden = !shared || !presenter || !total || !online;
    status.textContent = !online ? 'Reconnecting…' : shared && state.voters > 0
      ? (state.mine ? 'Your vote: ' + theoryNames[state.mine] + ' · ' : '') + total + ' of ' + state.voters + ' voted'
      : 'Choose a record';
  }
  function update(next: TheoryView | undefined, connected: boolean, hasPresenter = false) {
    if (next?.id !== state?.id) {
      order = [...next?.remaining ?? []];
      swappedAt = -Infinity;
    }
    state = next;
    online = connected;
    hostOnline = hasPresenter;
    render();
  }
  return {
    connect(sender: typeof send) { send = sender; },
    update,
    disconnect() { online = false; render(); },
    showScene(id?: string) {
      scene = id;
      if (!shared && solo && id !== (solo.winner ? theoryScene(solo.winner) : voteHub)) {
        solo = null;
        window.clearTimeout(soloTimer);
        update(undefined, true);
      }
      render();
    },
    isOpen: () => !panel.hidden,
    masterMeter() { return state?.remaining.length === 4 ? 52 : state?.remaining.length === 3 ? 47 : 41; },
    selectedAnswererScene: () => state?.winner && state.winner !== 'foundationalism' ? theoryScene(state.winner) : undefined,
    advance(id: string) {
      if (id === voteHub || (state?.winner && state.winner !== 'foundationalism' && theoryScene(state.winner) === id)) {
        if (!shared || presenter || (!hostOnline && online)) act('open');
        return true;
      }
      return false;
    },
  };
}

export type TheoryRecords = ReturnType<typeof createTheoryRecords>;
