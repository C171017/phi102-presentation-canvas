import './gavel-scene.css';

const artwork = '/generated/props/ink-ocean/gavel.webp';

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
          <!-- Follow the contact seam between the gavel head and the sounding block. -->
          <path id="gavel-block-cut" d="M0 362H98Q118 387 161 400Q203 414 247 405Q278 403 294 387L310 370H450V540H0Z"/>
          <clipPath id="gavel-block-clip"><use href="#gavel-block-cut"/></clipPath>
          <mask id="gavel-moving-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="960" height="540">
            <rect width="960" height="540" fill="white"/>
            <use href="#gavel-block-cut" fill="black"/>
          </mask>
        </defs>
        <image class="gavel-rest" href="${artwork}" width="960" height="540"/>
        <g class="gavel-action">
          <!-- Complete the portion of the block's top normally covered by the head. -->
          <ellipse cx="220" cy="399" rx="162" ry="33" fill="#bd7240" stroke="#261712" stroke-width="5"/>
          <ellipse cx="220" cy="398" rx="151" ry="24" fill="#693e2a"/>
          <image href="${artwork}" width="960" height="540" clip-path="url(#gavel-block-clip)"/>
          <g class="gavel-moving">
            <image href="${artwork}" width="960" height="540" mask="url(#gavel-moving-mask)"/>
          </g>
        </g>
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
