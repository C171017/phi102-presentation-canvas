import clock from './assets/application/clock.webp';
import lens from './assets/application/lens.webp';
import spoken from './assets/application/spoken.webp';
import email from './assets/application/email.webp';
import caravan from './assets/application/caravan.webp';
import caravanEmail from './assets/application/caravan-email.webp';
import './application-map.css';

// World coordinates for the three zoom stops in the argument map.
export const applicationPositions: Record<string, readonly [number, number]> = {
  'access-heading': [1775, 708],
  'access-principle': [2240, 560],
  'access-doubt': [2240, 858],
  'home-heading': [2790, 123],
  'home-weather': [2790, 290],
  'mobile-heading': [3390, -226],
  'mobile-scene': [3390, -41],
};

const sprite = (asset: string) => `<span aria-hidden="true" class="application-model" style="--model:url('${asset}')"></span>`;
function replay(model: HTMLElement) {
  model.classList.remove('is-replaying');
  void model.offsetWidth;
  model.classList.add('is-replaying');
}

export function mountOrder(host: HTMLElement, higher: boolean) {
  host.classList.add('order-node');
  const kind = higher ? 'Higher-order' : 'First-order';
  host.innerHTML = `<button type="button" class="model-target" aria-label="${higher ? 'Examine the grounds for the party-time belief' : 'Trace first-order justification to higher-order justification'}">
    ${sprite(higher ? lens : clock)}</button>
    <div class="order-claim"><strong>${kind}</strong><span>${higher
      ? 'I have grounds to believe I’m justified in believing it starts at 7.'
      : 'I have good reason to think the party starts at 7.'}</span></div>`;
  const target = host.querySelector('button')!;
  const model = target.querySelector<HTMLElement>('.application-model')!;
  function trace() {
    replay(model);
    if (!higher) {
      const next = host.ownerDocument.querySelector<HTMLElement>('#access-doubt .application-model');
      if (next) replay(next);
    }
  }
  target.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') trace(); });
  target.addEventListener('focus', () => { if (target.matches(':focus-visible')) trace(); });
  target.addEventListener('click', trace);
}

type Context = 'clear' | 'mumbled';
const sourceName = { clear: 'What Peter said', mumbled: 'What Justine remembers from his email' };

export function mountApplicationBase(host: HTMLElement) {
  host.classList.add('base-node');
  host.innerHTML = `<button type="button" class="model-target" aria-label="Turn the local cognitive home">
    ${sprite(spoken)}</button><span class="base-source" aria-live="polite">${sourceName.clear}</span>`;
  const target = host.querySelector('button')!;
  const model = target.querySelector<HTMLElement>('.application-model')!;
  const turn = () => replay(model);
  target.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') turn(); });
  target.addEventListener('focus', () => { if (target.matches(':focus-visible')) turn(); });
  target.addEventListener('click', turn);
}

export function mountApplicationHome(host: HTMLElement) {
  host.classList.add('mobile-node');
  host.innerHTML = `<div class="home-track"><div class="home-carriage">${sprite(caravan)}</div></div>
    <div class="home-contexts" role="group" aria-label="Context for Justine’s belief">
      <button type="button" data-choice="clear">Heard clearly</button>
      <button type="button" data-choice="mumbled">Possibly mumbled</button>
    </div><span class="home-source" aria-live="polite"></span>`;
  const model = host.querySelector<HTMLElement>('.application-model')!;
  const buttons = Array.from(host.querySelectorAll<HTMLButtonElement>('.home-contexts button'));
  const caption = host.querySelector<HTMLElement>('.home-source')!;
  let selected: Context = 'clear';
  function display(context: Context) {
    if (host.dataset.context === context) return;
    host.dataset.context = context;
    const changed = context === 'mumbled';
    caption.textContent = changed ? 'Local base · remembered email' : 'Local base · spoken words';
    buttons.forEach(button => {
      button.classList.toggle('is-current', button.dataset.choice === context);
      button.setAttribute('aria-pressed', String(button.dataset.choice === selected));
    });
    model.style.setProperty('--model', `url('${changed ? caravanEmail : caravan}')`);
    replay(model);
    const base = host.ownerDocument.getElementById('home-weather');
    const baseModel = base?.querySelector<HTMLElement>('.application-model');
    if (base && baseModel) {
      baseModel.style.setProperty('--model', `url('${changed ? email : spoken}')`);
      base.querySelector('.base-source')!.textContent = sourceName[context];
      replay(baseModel);
    }
  }
  for (const button of buttons) {
    const context = button.dataset.choice as Context;
    button.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') display(context); });
    button.addEventListener('pointerleave', () => display(selected));
    button.addEventListener('click', () => {
      selected = context;
      display(context);
      buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    });
  }
  display(selected);
}
