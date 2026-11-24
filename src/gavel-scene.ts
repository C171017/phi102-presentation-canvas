import './gavel-scene.css';

export const gavelArtwork = '/generated/props/ink-ocean/gavel-brass.webp';

export const gavelScene = {
  w: 560,
  h: 450,
  label: 'The sacred Gavel from The Trial.',
  mount(host: HTMLElement) {
    const art = document.createElement('div');
    art.className = 'scene-art gavel-illustration';
    art.tabIndex = 0;
    art.setAttribute('role', 'button');
    art.setAttribute('aria-label', 'Replay the gavel strike. The jury raises no objections, so the claim stands.');
    art.innerHTML = `
      <svg class="gavel-artwork" viewBox="0 0 960 540" aria-hidden="true">
        <defs>
          <!-- The transparent gap separates the hammer from the sounding block. -->
          <clipPath id="gavel-hammer-clip"><rect width="960" height="360"/></clipPath>
          <clipPath id="gavel-block-clip"><rect y="360" width="960" height="180"/></clipPath>
        </defs>
        <image href="${gavelArtwork}" width="960" height="540" clip-path="url(#gavel-block-clip)"/>
        <image class="gavel-moving" href="${gavelArtwork}" width="960" height="540" clip-path="url(#gavel-hammer-clip)"/>
      </svg>
      <span class="gavel-bubble gavel-question" aria-hidden="true">Any objections?</span>
      <span class="gavel-bubble gavel-jury" aria-hidden="true">None from the jury.</span>
      <span class="gavel-bubble gavel-ruling" aria-hidden="true">The claim stands.</span>`;
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
      if (!event.repeat) replay();
    });
  },
};
