import { createPaperHighlights } from './dev-paper-highlights';
import { createPaperPane as mountPaperPane } from './paper-pane';
import './dev-paper.css';

export function createPaperPane(shell: HTMLElement, rolePicker: HTMLElement) {
  return mountPaperPane(shell, {
    initiallyOpen: true,
    rolePicker,
    lastReadingPage: '435',
    createHighlights: createPaperHighlights,
  });
}
