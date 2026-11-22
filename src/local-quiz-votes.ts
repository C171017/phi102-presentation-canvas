import type { QuizChoice, QuizCounts } from './opening-quiz';
export type { QuizChoice, QuizCounts } from './opening-quiz';

export function createLocalQuizVotes(audience: boolean, hosted = false) {
  const key = 'phi102-local-quiz-voter';
  // Plain HTTP on the LAN has getRandomValues, while randomUUID needs a secure context.
  let voter: string = crypto.randomUUID?.() ?? Array.from(crypto.getRandomValues(new Uint8Array(18)),
    byte => byte.toString(16).padStart(2, '0')).join('');
  if (audience) {
    try {
      const saved = localStorage.getItem(key);
      if (saved && /^[a-f0-9-]{36}$/.test(saved)) voter = saved;
      else localStorage.setItem(key, voter);
    } catch { /* Keep this tab's ballot stable while it is open. */ }
  }
  async function request(answer?: QuizChoice, round?: string): Promise<QuizCounts> {
    const headers: Record<string, string> = { 'x-quiz-voter': voter };
    if (answer) headers['x-quiz-choice'] = answer;
    if (round) headers['x-quiz-round'] = round;
    const response = await fetch(hosted ? '/api/opening-quiz' : '/__canvas/quiz-votes', audience && answer ? {
      method: 'PUT', headers,
    } : { cache: 'no-store' });
    if (!response.ok) throw Error('Quiz tally unavailable');
    return response.json();
  }
  return { request };
}
