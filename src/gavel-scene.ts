import './gavel-scene.css';

export const gavelScene = {
  w: 560,
  h: 450,
  label: 'The sacred Gavel from The Trial.',
  mount(host: HTMLElement) {
    const art = document.createElement('div');
    art.className = 'scene-art gavel-illustration';
    art.tabIndex = 0;
    art.setAttribute('role', 'img');
    art.setAttribute('aria-label', 'The sacred Gavel from The Trial. Hover, focus, or tap to replay.');
    art.innerHTML = '<img src="/generated/props/ink-ocean/gavel.webp" alt="" draggable="false" width="960" height="540" />';
    host.prepend(art);

    function replay() {
      art.classList.remove('is-striking');
      void art.offsetWidth;
      art.classList.add('is-striking');
    }

    art.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') replay(); });
    art.addEventListener('pointerup', event => { if (event.pointerType === 'touch') replay(); });
    art.addEventListener('focus', () => { if (art.matches(':focus-visible')) replay(); });
    art.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      replay();
    });
  },
};
