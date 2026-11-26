import { isRegressDetour, operationBecauseScene, regressDetours } from './regress-responses';
import './operation-because.css';

export function createOperationBecause(stage: HTMLElement, openScene: (scene: string) => void) {
  const choices = document.createElement('div');
  choices.className = 'operation-because-choices';
  choices.hidden = true;
  choices.setAttribute('role', 'group');
  choices.setAttribute('aria-label', 'Optional dialogues about the regress problem');

  const buttons = new Map<string, HTMLButtonElement>();
  for (const { scene, character, theory } of regressDetours) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.scene = scene;
    button.setAttribute('aria-label', `${character} · ${theory}`);
    const label = document.createElement('span');
    label.textContent = theory;
    button.append(label);
    button.addEventListener('click', () => openScene(scene));
    choices.append(button);
    buttons.set(scene, button);
  }

  const back = document.createElement('button');
  back.className = 'operation-because-return';
  back.type = 'button';
  back.textContent = 'Back to Operation Because';
  back.hidden = true;
  back.addEventListener('click', () => openScene(operationBecauseScene));
  stage.prepend(choices);
  stage.append(back);

  return {
    showScene(scene?: string) {
      choices.hidden = scene !== operationBecauseScene;
      back.hidden = !isRegressDetour(scene);
    },
    markViewed(scene: string) {
      const button = buttons.get(scene);
      if (!button || button.hasAttribute('data-viewed')) return;
      button.toggleAttribute('data-viewed', true);
      button.setAttribute('aria-label', button.getAttribute('aria-label') + ', viewed');
    },
  };
}
