import { createPresentationClient } from './live-presentation';
import { isSlide, type RoomSnapshot } from './live-protocol';
import { addStoryReader } from './story-reader';
import './dev-presentation.css';

type PreviewRole = 'audience' | 'presenter';
const roles = [
  ['editor', 'Editor'],
  ['audience', 'Audience'],
  ['presenter', 'Presenter'],
] as const;

export function addDevRolePicker(shell: HTMLElement, role: PreviewRole | null) {
  const picker = document.createElement('div');
  picker.className = 'dev-role-picker';
  picker.setAttribute('role', 'group');
  picker.setAttribute('aria-label', 'Canvas views');
  const label = document.createElement('span');
  label.textContent = 'Local dev';
  picker.append(label);
  for (const [value, title] of roles) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = title;
    button.setAttribute('aria-pressed', String(value === (role ?? 'editor')));
    button.addEventListener('click', () => {
      if (value === (role ?? 'editor')) return;
      const url = new URL(location.href);
      if (value === 'editor') url.searchParams.delete('role');
      else url.searchParams.set('role', value);
      location.assign(url);
    });
    picker.append(button);
  }
  shell.append(picker);
  addStoryReader(shell, picker, role === null);
  return picker;
}

export function connectDevPresentation(viewport: HTMLElement, openSlide: (index: number) => void, role: PreviewRole) {
  const hot = import.meta.hot!;
  const client = createPresentationClient(viewport, openSlide, role === 'presenter',
    message => hot.send('phi102:preview:report', message));
  function join() {
    const buttons = Array.from(viewport.querySelectorAll('#slide-progress button'));
    const slide = buttons.findIndex(button => button.hasAttribute('aria-current'));
    hot.send('phi102:preview:join', { role, slide: isSlide(slide) ? slide : 0 });
  }
  hot.on('phi102:preview:state', (state: RoomSnapshot) => client.showState(state));
  hot.on('phi102:preview:superseded', client.clearState);
  hot.on('vite:ws:disconnect', client.clearState);
  hot.on('vite:ws:connect', join);
  window.addEventListener('pageshow', event => { if (event.persisted) join(); });
  window.addEventListener('pagehide', () => {
    hot.send('phi102:preview:leave');
    client.clearState();
  });
  join();
  return client.reportSlide;
}
