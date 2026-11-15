import { isSlide, presenterKeyPattern, slideCount, type RoomSnapshot } from './live-protocol';
import './live-presentation.css';

export const liveMode = import.meta.env.VITE_LIVE_PRESENTATION === '1';

type SlideReport = { type: 'present' | 'view'; slide: number | null };

export function connectPresentation(viewport: HTMLElement, openSlide: (index: number) => void) {
  const fragment = new URLSearchParams(location.hash.slice(1));
  const key = fragment.get('presenter');
  const presenter = key !== null;
  let socket: WebSocket | undefined;
  const client = createPresentationClient(viewport, openSlide, presenter, message => {
    if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify(message));
  });
  let active = true;
  let retry: ReturnType<typeof setTimeout> | undefined;
  let heartbeat: ReturnType<typeof setInterval> | undefined;
  let receivedAt = 0;
  let retryDelay = 500;
  let rejected = false;

  function connect() {
    if (!active || socket || rejected || (presenter && !presenterKeyPattern.test(key))) return;
    const endpoint = new URL('/api/live', location.href);
    endpoint.protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
    const connection = new WebSocket(endpoint, key ? ['phi102', key] : ['phi102']);
    socket = connection;
    receivedAt = Date.now();
    heartbeat = setInterval(() => {
      if (Date.now() - receivedAt > 45000) connection.close();
      else if (connection.readyState === WebSocket.OPEN) connection.send('ping');
    }, 20000);
    connection.addEventListener('message', ({ data }) => {
      receivedAt = Date.now();
      if (data === 'pong') return;
      try {
        const state: RoomSnapshot | { type: 'rejected'; code: number } = JSON.parse(data);
        if (state.type === 'rejected') {
          connection.close(state.code);
          return;
        }
        if (state.type !== 'state' || !isSlide(state.presenterSlide) ||
            state.counts.length !== slideCount) return;
        retryDelay = 500;
        client.showState(state);
      } catch { /* Ignore invalid messages. */ }
    });
    connection.addEventListener('close', event => {
      if (socket !== connection) return;
      clearInterval(heartbeat);
      socket = undefined;
      client.clearState();
      rejected = [4003, 4008, 4009].includes(event.code);
      if (!active || rejected) return;
      retry = setTimeout(connect, retryDelay + Math.random() * 250);
      retryDelay = Math.min(retryDelay * 2, 10000);
    });
  }

  window.addEventListener('pagehide', () => {
    active = false;
    clearTimeout(retry);
    socket?.close();
  });
  window.addEventListener('pageshow', () => {
    active = true;
    connect();
  });
  connect();
  return client.reportSlide;
}

export function createPresentationClient(
  viewport: HTMLElement,
  openSlide: (index: number) => void,
  presenter: boolean,
  send: (message: SlideReport) => void,
) {
  const progress = viewport.querySelector<HTMLElement>('#slide-progress')!;
  const followButton = document.createElement('button');
  followButton.type = 'button';
  followButton.className = 'live-follow-presenter';
  followButton.textContent = 'Follow presenter';
  followButton.hidden = true;
  viewport.append(followButton);

  const indicators = Array.from(progress.querySelectorAll('button')).map(button => {
    const count = document.createElement('span');
    count.className = 'live-audience-count';
    count.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="4.5" r="2.4"/><path d="M3 14v-1a5 5 0 0 1 10 0v1"/></svg><span></span>';
    count.hidden = true;
    const number = count.querySelector('span')!;
    const label = button.getAttribute('aria-label');
    button.append(count);
    return { button, count, number, label };
  });

  let snapshot: RoomSnapshot | undefined;
  let currentSlide: number | null = null;
  let following = true;
  let navigating = false;

  function sendView() {
    if (!snapshot) return;
    if (presenter && currentSlide === null) return;
    send({ type: presenter ? 'present' : 'view', slide: currentSlide });
  }

  function syncSlide() {
    if (!snapshot) return;
    navigating = true;
    openSlide(snapshot.presenterSlide);
    currentSlide = snapshot.presenterSlide;
    navigating = false;
    sendView();
  }

  function showState(state: RoomSnapshot) {
    const previous = snapshot;
    snapshot = state;
    indicators.forEach(({ button, count, number, label }, index) => {
      const viewers = state.counts[index];
      const onAir = state.presenterOnline && index === state.presenterSlide;
      count.hidden = viewers === 0;
      number.textContent = String(viewers);
      button.classList.toggle('presenter-slide', onAir);
      button.setAttribute('aria-label', label + (onAir ? ', presenter here' : '') + ', ' + viewers + (viewers === 1 ? ' viewer' : ' viewers'));
    });
    if ((!previous && (presenter || following)) ||
        (!presenter && following && previous?.presenterSlide !== state.presenterSlide)) {
      syncSlide();
    } else if (!previous) {
      sendView();
    }
  }

  function clearState() {
    snapshot = undefined;
    indicators.forEach(({ button, count, label }) => {
      count.hidden = true;
      button.classList.remove('presenter-slide');
      if (label) button.setAttribute('aria-label', label);
    });
  }

  followButton.addEventListener('click', () => {
    following = true;
    followButton.hidden = true;
    syncSlide();
    viewport.focus({ preventScroll: true });
  });
  function reportSlide(index: number) {
    const slide = isSlide(index) ? index : null;
    if (currentSlide === slide) return;
    currentSlide = slide;
    if (navigating) return;
    if (!presenter && following && (!snapshot || slide !== snapshot.presenterSlide)) {
      following = false;
      followButton.hidden = false;
    }
    sendView();
  }
  return { showState, clearState, reportSlide };
}
