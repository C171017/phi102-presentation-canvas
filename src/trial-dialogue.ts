import type { InkOceanCue } from './ink-ocean-scenes';
import { renderPaperLink, slidePaperLinks } from './paper-slide-links';
import { createTrialAudio } from './trial-audio';
import { trialDialogueText, trialShout } from './trial-script';
import { trialArt } from './trial-art';
import './trial-dialogue.css';

export function createTrialDialogue(stage: HTMLElement, advance: () => void) {
  const screen = document.createElement('div');
  screen.className = 'trial-screen';
  screen.hidden = true;
  screen.innerHTML = `
    <div class="trial-confetti" aria-hidden="true"></div>
    <div class="trial-impact" aria-hidden="true"></div>
    <div class="trial-panel">
      <button type="button" class="trial-message" aria-label="Continue courtroom dialogue">
        <span class="trial-name" aria-hidden="true"></span>
        <span class="trial-words" aria-hidden="true"><span></span><span class="trial-unspoken"></span></span>
        <span class="trial-next" aria-hidden="true"></span>
      </button>
      <p class="trial-explanation" hidden>
        (Justification as a <strong>social activity</strong> × <strong>sensitive invariantism</strong>.<span class="trial-explanation-citation"></span>
        The norms of the court (Simone’s epistemic community) determine whose objections she has to answer.
        Those norms help determine Simone's belief (the subject in sensitive invariantism).
        If no one entitled to object would challenge the claim, it can serve as a local foundation.)
      </p>
    </div>`;
  stage.append(screen);
  const message = screen.querySelector<HTMLButtonElement>('.trial-message')!;
  const name = screen.querySelector<HTMLElement>('.trial-name')!;
  const words = screen.querySelector<HTMLElement>('.trial-words')!;
  const explanation = screen.querySelector<HTMLElement>('.trial-explanation')!;
  explanation.querySelector('.trial-explanation-citation')!.append(renderPaperLink(slidePaperLinks['pairing-social-simone'].title));
  const spoken = words.querySelector<HTMLElement>('span')!;
  const unspoken = words.lastElementChild!;
  const impact = screen.querySelector<HTMLElement>('.trial-impact')!;
  const confetti = screen.querySelector<HTMLElement>('.trial-confetti')!;
  const sounds = createTrialAudio();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  for (let i = 0; i < 48; i++) {
    const fleck = document.createElement('i');
    fleck.style.left = ((i * 37) % 99) + '%';
    fleck.style.setProperty('--drift', (i % 2 ? 1 : -1) * (i % 8 + 2) + 'cqw');
    fleck.style.setProperty('--turn', (i * 67) + 'deg');
    fleck.style.setProperty('--delay', (i % 9 * 65) + 'ms');
    confetti.append(fleck);
  }
  message.addEventListener('click', advance);
  message.addEventListener('keydown', event => {
    if (event.repeat && (event.key === 'Enter' || event.key === ' ')) event.preventDefault();
  });
  let timer = 0;
  let strikeTimer = 0;
  let strike: (() => void) | undefined;
  let fullText = '';
  let typing = false;
  function reset() {
    clearTimeout(timer);
    clearTimeout(strikeTimer);
    strike = undefined;
    sounds.stop();
    impact.replaceChildren();
    impact.removeAttribute('data-effect');
    confetti.removeAttribute('data-motion');
    delete screen.dataset.interrupting;
    delete screen.dataset.photo;
    delete screen.dataset.strike;
    delete screen.dataset.ready;
    explanation.hidden = true;
    typing = false;
  }
  function finish() {
    clearTimeout(timer);
    clearTimeout(strikeTimer);
    strike?.();
    impact.replaceChildren();
    delete impact.dataset.effect;
    delete screen.dataset.interrupting;
    spoken.textContent = fullText;
    unspoken.textContent = '';
    screen.dataset.ready = '';
    typing = false;
  }
  function type(line: InkOceanCue) {
    delete screen.dataset.interrupting;
    impact.replaceChildren();
    delete impact.dataset.effect;
    if (reduced.matches) { finish(); return; }
    let count = 0;
    let lastBlip = -Infinity;
    const voice = /^(Simone|Old woman)$/.test(line.speaker) ? 'high' : 'low';
    function tick() {
      const char = fullText[count++];
      spoken.textContent = fullText.slice(0, count);
      unspoken.textContent = fullText.slice(count);
      if (!line.kind && /[\p{L}\p{N}]/u.test(char) && performance.now() - lastBlip > 48) {
        sounds.play(voice, 0.23);
        lastBlip = performance.now();
      }
      if (count >= fullText.length) { typing = false; screen.dataset.ready = ''; return; }
      timer = window.setTimeout(tick, /[.!?…]/.test(char) ? 110 : /[,—]/.test(char) ? 66 : 22);
    }
    tick();
  }
  function show(line?: InkOceanCue, edited?: string) {
    reset();
    const entering = screen.hidden;
    screen.hidden = false;
    screen.toggleAttribute('data-door-exit', line?.background === trialArt.doorTransitionStart);
    if (entering && document.activeElement?.closest('#slide-progress')) message.focus({ preventScroll: true });
    sounds.warm();
    if (!line) {
      screen.dataset.photo = '';
      screen.dataset.ready = '';
      name.textContent = spoken.textContent = unspoken.textContent = '';
      return;
    }
    const shout = trialShout(line.text);
    const verdict = /“NOT GUILTY”/.test(line.text);
    const title = line.trialBanner ?? /^Banner: (.+)/.exec(line.text)?.[1];
    explanation.hidden = line.speaker !== 'Simone' || line.text !== '…So that’s how it works.';
    name.textContent = line.kind ? '' : line.speaker;
    message.toggleAttribute('data-narration', Boolean(line.kind));
    fullText = trialDialogueText(line.text, edited);
    spoken.textContent = '';
    unspoken.textContent = fullText;
    typing = true;
    if (/confetti flies back up/i.test(line.text)) confetti.dataset.motion = 'rise';
    if (/gallery (roars|howls)/i.test(line.text)) sounds.play('gallery', .36);
    if (/^POP\./.test(line.text)) sounds.play('pop');
    if (line.trialCallToOrder || /\bBANG\./.test(line.text)) {
      strike = () => {
        strike = undefined;
        sounds.play('gavel', .7);
        if (verdict) confetti.dataset.motion = 'fall';
        screen.dataset.strike = '';
      };
      if (line.trialCallToOrder) strike();
      else strikeTimer = window.setTimeout(() => strike?.(), 330);
    }
    if (shout || verdict || title) {
      screen.dataset.interrupting = '';
      impact.dataset.effect = shout ? 'shout' : 'title';
      if (shout) {
        const image = new Image();
        image.alt = '';
        image.src = '/trial/' + (shout === 'OBJECTION!' ? 'objection.webp' : 'take-that.webp');
        impact.append(image);
        sounds.play(shout === 'TAKE THAT!' ? 'takeThat' : line.speaker === 'Old woman' ? 'mother' : 'prosecutor', .66);
      } else {
        impact.textContent = title ?? 'NOT GUILTY';
      }
      timer = window.setTimeout(() => type(line), shout ? 950 : 1250);
    } else type(line);
  }
  return {
    show,
    inlineRoot: message,
    inlineText: spoken,
    startInline() {
      strike = undefined;
      sounds.stop();
      finish();
      words.removeAttribute('aria-hidden');
      message.tabIndex = -1;
    },
    stopInline() {
      words.setAttribute('aria-hidden', 'true');
      message.removeAttribute('tabindex');
    },
    updateText(line: InkOceanCue, edited?: string) {
      strike = undefined;
      fullText = trialDialogueText(line.text, edited);
      finish();
    },
    hide() { reset(); screen.hidden = true; },
    reveal() {
      if (screen.hidden) return false;
      sounds.warm();
      if (!typing) return false;
      finish();
      return true;
    },
  };
}
