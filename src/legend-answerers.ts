import { theories, theoryNames, type Theory } from './theory-vote';
import './legend-answerers.css';

const explanation: Record<Theory, string> = {
  skepticism: 'Pyrrho suspends judgment. His answer leaves no justified starting belief.',
  infinitism: 'Peirce always gives a further reason. His chain has no last link.',
  coherentism: 'Neurath’s planks support one another. Following their support brings you back around the raft.',
  foundationalism: 'Foundationalism. A basic belief can support other beliefs without first borrowing support from another belief.',
};

export function createLegendQuiz(stage: HTMLElement, presenter: boolean, onReveal: () => void) {
  const panel = document.createElement('section');
  panel.className = 'legend-answerer-quiz';
  panel.hidden = true;
  panel.setAttribute('aria-label', 'Regress audience check');

  const choices = document.createElement('div');
  choices.className = 'legend-quiz-choices';
  const feedback = document.createElement('p');
  feedback.setAttribute('role', 'status');
  feedback.setAttribute('aria-live', 'polite');
  const revealButton = document.createElement('button');
  revealButton.className = 'legend-quiz-reveal';
  revealButton.type = 'button';
  revealButton.textContent = 'Reveal answer';
  const buttons = new Map<Theory, HTMLButtonElement>();
  let active = false;
  let revealed = false;

  function answer(choice: Theory, broadcast = presenter) {
    const correct = choice === 'foundationalism';
    feedback.textContent = explanation[choice];
    revealed = correct;
    revealButton.hidden = !presenter || revealed;
    for (const [theory, button] of buttons) {
      button.setAttribute('aria-pressed', String(theory === choice));
      button.dataset.correct = String(correct && theory === choice);
      button.disabled = revealed;
    }
    if (correct && broadcast) onReveal();
  }
  for (const theory of theories) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = theoryNames[theory];
    button.addEventListener('click', () => answer(theory));
    buttons.set(theory, button);
    choices.append(button);
  }
  revealButton.addEventListener('click', () => answer('foundationalism'));
  panel.append(choices, feedback, revealButton);
  stage.append(panel);

  return {
    isRevealed: () => active && revealed,
    reveal: () => { if (active && !revealed) answer('foundationalism', false); },
    showScene(id?: string) {
      const show = id === 'L4-quiz';
      if (active === show) return;
      active = show;
      panel.hidden = !show;
      revealed = false;
      feedback.textContent = '';
      revealButton.hidden = !presenter;
      for (const button of buttons.values()) {
        button.disabled = false;
        button.setAttribute('aria-pressed', 'false');
        delete button.dataset.correct;
      }
    },
    advance() {
      if (!active || revealed) return false;
      answer('foundationalism');
      return true;
    },
  };
}
