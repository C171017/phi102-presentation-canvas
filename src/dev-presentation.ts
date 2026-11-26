import { createPresentationClient } from './live-presentation';
import { isSlide, type PresentationCues, type RoomSnapshot } from './live-protocol';
import { addStoryReader } from './story-reader';
import type { TheoryRecords } from './theory-records';
import type { SchoolRoomDisplay } from './legend-schools';
import './dev-presentation.css';

type PreviewRole = 'audience' | 'presenter';
type DevRole = PreviewRole | 'editor' | 'live-preview';
const roles = [
  ['editor', 'Editor'],
  ['audience', 'Audience'],
  ['presenter', 'Presenter'],
] as const;

export function addDevRolePicker(shell: HTMLElement, role: DevRole, canSwitchRoles: boolean) {
  const picker = document.createElement('div');
  picker.className = 'dev-role-picker';
  picker.setAttribute('role', 'group');
  picker.setAttribute('aria-label', 'Canvas views');
  const label = document.createElement('span');
  label.textContent = 'Local dev';
  picker.append(label);
  function appendRole(value: DevRole, title: string) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = title;
    button.setAttribute('aria-pressed', String(value === role));
    button.addEventListener('click', () => {
      if (value === role) return;
      const url = new URL(location.href);
      if (value === 'editor') url.searchParams.delete('role');
      else url.searchParams.set('role', value);
      location.assign(url);
    });
    picker.append(button);
  }
  for (const [value, title] of roles) {
    if (canSwitchRoles || value === 'audience') appendRole(value, title);
  }
  shell.append(picker);
  addStoryReader(shell, picker, role === 'editor');
  if (canSwitchRoles) appendRole('live-preview', 'Live Preview');
  return picker;
}

export function connectDevPresentation(viewport: HTMLElement, openSlide: (index: number) => void, role: PreviewRole, theory: TheoryRecords,
  openingVideo?: { isOpen(): boolean; close(): void }, schools?: SchoolRoomDisplay, cues?: PresentationCues) {
  const hot = import.meta.hot!;
  const blackout = role === 'audience' ? document.createElement('dialog') : undefined;
  if (blackout) {
    blackout.className = 'audience-opening-blackout';
    blackout.setAttribute('aria-label', 'Opening playing on the presenter screen');
    blackout.addEventListener('cancel', event => event.preventDefault());
    blackout.addEventListener('keydown', event => event.stopPropagation());
    viewport.parentElement!.append(blackout);
  }
  const client = createPresentationClient(viewport, openSlide, role === 'presenter', theory,
    message => hot.send('phi102:preview:report', message), schools, cues);
  function join() {
    const buttons = Array.from(viewport.querySelectorAll('#slide-progress button[data-slide]'));
    const slide = buttons.findIndex(button => button.hasAttribute('aria-current'));
    hot.send('phi102:preview:join', { role, slide: isSlide(slide) ? slide : 0, openingPlaying: openingVideo?.isOpen() });
  }
  function clearState() {
    blackout?.close();
    client.clearState();
  }
  hot.on('phi102:preview:state', (state: RoomSnapshot) => {
    client.showState(state);
    if (!blackout) return;
    if (state.openingPlaying && !blackout.open) blackout.showModal();
    else if (!state.openingPlaying && blackout.open) blackout.close();
  });
  hot.on('phi102:preview:superseded', () => { openingVideo?.close(); clearState(); });
  hot.on('vite:ws:disconnect', clearState);
  hot.on('vite:ws:connect', join);
  window.addEventListener('pageshow', event => { if (event.persisted) join(); });
  window.addEventListener('pagehide', () => {
    hot.send('phi102:preview:leave');
    clearState();
  });
  join();
  return client.reportSlide;
}
