export const paperExplanationPath = '/api/paper/explain';
export const maxPassageWords = 450;

export type PaperWord = { file: string; index: number };
export type PaperPassage = { start: PaperWord; end: PaperWord };
export type PaperExplanationEvent =
  | { type: 'passage'; pages: string; text: string }
  | { type: 'delta'; text: string }
  | { type: 'done' }
  | { type: 'error'; message: string };

export async function* streamLines(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffered = '';
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffered += decoder.decode(value, { stream: true });
      const lines = buffered.split('\n');
      buffered = lines.pop() ?? '';
      for (const line of lines) yield line.replace(/\r$/, '');
    }
    buffered += decoder.decode();
    if (buffered) yield buffered.replace(/\r$/, '');
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}
