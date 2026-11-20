import { createPaperHighlights } from './dev-paper-highlights';
import { createPaperPane as mountPaperPane } from './paper-pane';
import type { FocusGlossaryVisual } from './paper-glossary';
import './dev-paper.css';

export function createPaperPane(shell: HTMLElement, rolePicker: HTMLElement, focusVisual: FocusGlossaryVisual) {
  return mountPaperPane(shell, {
    initiallyOpen: true,
    focusVisual,
    rolePicker,
    lastReadingPage: '435',
    createHighlights: createPaperHighlights,
  });
}
