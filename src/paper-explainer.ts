import { paperExplanationPath, streamLines, type PaperExplanationEvent, type PaperPassage } from './paper-explainer-protocol';
import './paper-explainer.css';

type Anchor = () => { x: number; top: number; bottom: number };

function element<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

export function createPaperExplainer(pane: HTMLElement, scroll: HTMLElement, clearSelection: () => void) {
  const trigger = element('button', 'paper-explain-trigger', '?');
  trigger.type = 'button';
  trigger.title = 'Explain selected passage';
  trigger.setAttribute('aria-label', trigger.title);
  trigger.setAttribute('aria-controls', 'paper-explainer');
  trigger.hidden = true;

  const panel = element('section', 'paper-explainer');
  panel.id = 'paper-explainer';
  panel.hidden = true;
  panel.tabIndex = -1;
  panel.setAttribute('aria-labelledby', 'paper-explainer-title');
  const header = element('header', 'paper-explainer-header');
  const title = element('h2', undefined, 'Passage explanation');
  title.id = 'paper-explainer-title';
  const pages = element('span', 'paper-explainer-pages');
  const close = element('button', 'paper-explainer-close', '×');
  close.type = 'button';
  close.setAttribute('aria-label', 'Close passage explanation');
  header.append(title, pages, close);
  const content = element('div', 'paper-explainer-content');
  const quote = element('blockquote');
  quote.hidden = true;
  const status = element('p', 'paper-explainer-status');
  status.setAttribute('role', 'status');
  const answer = element('p', 'paper-explainer-answer');
  const text = new Text();
  answer.append(text);
  const retry = element('button', 'paper-explainer-retry', 'Try again');
  retry.type = 'button';
  retry.hidden = true;
  content.append(quote, status, answer, retry);
  panel.append(header, content);
  pane.append(trigger, panel);

  let pending: { passage: PaperPassage; anchor: Anchor } | undefined;
  let current: PaperPassage | undefined;
  let active: AbortController | undefined;
  let requestedY = 16;

  function positionTrigger() {
    if (!pending) return;
    const point = pending.anchor();
    const bounds = scroll.getBoundingClientRect();
    const paneBounds = pane.getBoundingClientRect();
    trigger.hidden = point.bottom <= bounds.top || point.top >= bounds.bottom || bounds.height === 0;
    if (trigger.hidden) return;
    const size = trigger.offsetWidth;
    const x = Math.min(bounds.right - size - 7, Math.max(bounds.left + 7, point.x - size / 2));
    const y = point.top - size - 6 >= bounds.top + 5 ? point.top - size - 6 : Math.min(point.bottom + 6, bounds.bottom - size - 5);
    trigger.style.left = `${x - paneBounds.left - pane.clientLeft}px`;
    trigger.style.top = `${y - paneBounds.top - pane.clientTop}px`;
  }

  function positionPanel() {
    if (panel.hidden) return;
    const bounds = pane.getBoundingClientRect();
    const gap = bounds.left >= 610 ? 258 : 14;
    const room = bounds.left - gap - 16;
    panel.classList.toggle('is-inset', room < 285);
    panel.style.setProperty('--explanation-gap', `${gap}px`);
    panel.style.setProperty('--explanation-width', `${Math.min(350, room)}px`);
    panel.style.setProperty('--explanation-y', `${Math.max(10, Math.min(requestedY, pane.clientHeight - panel.offsetHeight - 10))}px`);
  }

  function dismissOffer() {
    pending = undefined;
    trigger.hidden = true;
  }

  function closePanel(restoreFocus = false) {
    const hadFocus = panel.contains(document.activeElement) || document.activeElement === trigger;
    active?.abort();
    active = undefined;
    current = undefined;
    panel.hidden = true;
    dismissOffer();
    clearSelection();
    if (restoreFocus && hadFocus) scroll.focus({ preventScroll: true });
  }

  async function explain(passage: PaperPassage) {
    active?.abort();
    const controller = new AbortController();
    active = controller;
    panel.dataset.state = 'waiting';
    retry.hidden = true;
    quote.hidden = true;
    pages.textContent = '';
    text.data = '';
    status.textContent = 'Reading the passage…';
    content.scrollTop = 0;
    try {
      const response = await fetch(paperExplanationPath, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(passage), signal: controller.signal,
      });
      if (!response.ok || !response.body || !response.headers.get('content-type')?.includes('application/x-ndjson')) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message ?? 'The paper explainer is unavailable right now.');
      }
      for await (const line of streamLines(response.body)) {
        if (active !== controller) return;
        if (!line) continue;
        const event = JSON.parse(line) as PaperExplanationEvent;
        if (event.type === 'passage') {
          quote.textContent = event.text;
          pages.textContent = event.pages;
          quote.hidden = false;
        } else if (event.type === 'delta') {
          if (!text.length) {
            panel.dataset.state = 'streaming';
            status.textContent = 'Writing explanation…';
          }
          text.appendData(event.text);
        } else if (event.type === 'done') {
          panel.dataset.state = 'done';
          status.textContent = 'Explanation ready.';
          return;
        } else if (event.type === 'error') {
          throw new Error(event.message);
        }
      }
      throw new Error('The explanation was interrupted. You can try again.');
    } catch (error) {
      if (active !== controller) return;
      panel.dataset.state = 'error';
      status.textContent = error instanceof Error && error.message && !['Failed to fetch', 'Load failed'].includes(error.message)
        ? error.message : 'The paper explainer is unavailable right now.';
      retry.hidden = false;
    } finally {
      if (active === controller) active = undefined;
    }
  }

  trigger.addEventListener('click', () => {
    if (!pending) return;
    requestedY = pending.anchor().top - pane.getBoundingClientRect().top - 24;
    current = pending.passage;
    dismissOffer();
    panel.hidden = false;
    panel.focus({ preventScroll: true });
    void explain(current);
    positionPanel();
  });
  close.addEventListener('click', () => closePanel(true));
  retry.addEventListener('click', () => {
    if (!current) return;
    panel.focus({ preventScroll: true });
    void explain(current);
  });
  pane.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || (panel.hidden && !pending)) return;
    event.stopPropagation();
    event.preventDefault();
    closePanel(true);
  });
  scroll.addEventListener('scroll', positionTrigger, { passive: true });
  const observer = new ResizeObserver(() => { positionTrigger(); positionPanel(); });
  observer.observe(scroll);
  observer.observe(panel);
  window.addEventListener('resize', positionPanel);

  return {
    offer(passage: PaperPassage, anchor: Anchor) {
      pending = { passage, anchor };
      positionTrigger();
      if (!trigger.hidden) trigger.focus({ preventScroll: true });
    },
    dismissOffer,
    close: closePanel,
  };
}
