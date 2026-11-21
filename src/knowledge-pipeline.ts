import './knowledge-pipeline.css';

const ticketOutline = 'M5 0H158L163 4V18A8 8 0 0 0 163 34V48L158 52H5L0 48V34A8 8 0 0 0 0 18V4Z';
const label = 'The traveler knows the last train leaves at eleven. Under E = K, that known fact is evidence and can serve as a foundation. Hover, tap, or press Enter to replay.';

export function mountKnowledgePipeline(host: HTMLElement) {
  host.classList.add('knowledge-pipeline');
  host.insertAdjacentHTML('afterbegin', `
    <svg class="scene-art pipeline-art" viewBox="0 0 900 315" width="900" height="450" tabindex="0" role="button" aria-label="${label}">
      <defs>
        <linearGradient id="pipeline-cardstock" x2=".85" y2="1" gradientUnits="objectBoundingBox">
          <stop stop-color="#fff0ca"/><stop offset=".56" stop-color="#eed49e"/><stop offset="1" stop-color="#d4b77d"/>
        </linearGradient>
        <linearGradient id="pipeline-enamel" x2=".85" y2="1" gradientUnits="objectBoundingBox">
          <stop stop-color="#556e66"/><stop offset=".55" stop-color="#394f49"/><stop offset="1" stop-color="#283d38"/>
        </linearGradient>
        <linearGradient id="pipeline-brass" x2=".25" y2="1" gradientUnits="objectBoundingBox">
          <stop stop-color="#ecd49b"/><stop offset=".48" stop-color="#bc9555"/><stop offset="1" stop-color="#856740"/>
        </linearGradient>
      </defs>
      <ellipse cx="444" cy="224" rx="111" ry="11" fill="#705637" opacity=".12"/>
      <g transform="translate(93 124)">
        <g class="pipeline-ticket">
          <g transform="matrix(1 .035 -.14 .98 3 -3)">
            <path d="${ticketOutline}" fill="#947548" transform="translate(4 6)"/>
            <path d="${ticketOutline}" fill="#c5a775" transform="translate(2 3)"/>
            <path d="${ticketOutline}" fill="url(#pipeline-cardstock)" stroke="#a1885d"/>
            <path d="M7 3H155M4 6v9" fill="none" stroke="#fff4d7" stroke-width="2"/>
            <path d="M13 8h99m-99 36h99" stroke="#aa8958"/>
            <path d="M121 3v46" stroke="#96744a" stroke-width="1.4" stroke-dasharray="3 3"/>
            <path d="M131 11v29m4-29v29m7-29v29m4-29v29m5-29v29" stroke="#685235" stroke-width="2"/>
            <text x="62" y="22" class="ticket-title">LAST TRAIN</text>
            <text x="62" y="41" class="ticket-time">11:00</text>
          </g>
        </g>
      </g>
      <g class="pipeline-base">
        <ellipse cx="726" cy="186" rx="61" ry="12" fill="#674b30" opacity=".14"/>
        <use href="#foundation-back-stone" transform="translate(727 149) scale(1.27) translate(-124 -224)"/>
      </g>
      <g>
        <path d="M341 107l30-20 8-3h163l9 6-32 23Z" fill="#78877b"/>
        <path d="M347 106l30-18h157l-27 18Z" fill="#687c72"/>
        <path d="M509 111l34-23 8 2v105l-8 8-34 19Z" fill="#273c36"/>
        <path d="M516 115l30-20v95l-30 18Z" fill="#334b42"/>
        <path d="M522 146l19-12v15l-19 12Z" fill="#182b26"/>
        <path d="M522 161l19-12v3l-19 12Z" fill="#867955"/>
        <path d="M341 107h167l8 7v98l-8 8H343l-8-8v-98Z" fill="#253831"/>
        <path d="M343 109h162l7 6v92l-7 6H344l-6-6v-92Z" fill="url(#pipeline-enamel)"/>
        <path d="M342 114l4-3h158" fill="none" stroke="#879587" stroke-width="2"/>
        <path d="M341 211l4 4h160l6-5" fill="none" stroke="#536456" stroke-width="2"/>
        <rect x="355" y="129" width="140" height="63" rx="5" fill="#1f332e"/>
        <rect x="355" y="127" width="140" height="62" rx="5" fill="url(#pipeline-brass)"/>
        <rect x="358" y="130" width="134" height="56" rx="3" fill="#334941"/>
        <text x="425" y="172" class="pipeline-rule">E = K</text>
        ${[[346,119],[503,119],[346,203],[503,203]].map(([x,y]) => `
          <g transform="translate(${x} ${y})"><circle cy="1" r="3" fill="#26362c"/><circle r="2.6" fill="url(#pipeline-brass)"/><path d="M-1.2 1l2.4-2" stroke="#836844"/></g>`).join('')}
      </g>
    </svg>`);
  const art = host.querySelector<SVGSVGElement>('.pipeline-art')!;
  function replay() {
    art.classList.remove('pipeline-running');
    void art.getBoundingClientRect();
    art.classList.add('pipeline-running');
  }
  art.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') replay(); });
  art.addEventListener('pointerup', event => { if (event.pointerType === 'touch') replay(); });
  art.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); replay(); }
  });
}
