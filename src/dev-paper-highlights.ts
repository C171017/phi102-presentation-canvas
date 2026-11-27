import type { PaperMarks } from './paper-selection';

const STORAGE_KEY = 'phi102-paper-highlights-greco-2017-v1';

function parse(raw: string | null): unknown {
  try { return JSON.parse(raw ?? '[]'); } catch { return []; }
}

export const devPaperMarks: PaperMarks = {
  read() {
    try { return parse(localStorage.getItem(STORAGE_KEY)); } catch { return []; }
  },
  write(marks) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(marks)); } catch { /* Keep marks in this session. */ }
  },
  subscribe(restore) {
    window.addEventListener('storage', event => {
      if (event.key === STORAGE_KEY) restore(parse(event.newValue));
    });
  },
};
