export type QuizChoice = 'B' | '13';
export type QuizCounts = Record<QuizChoice, number>;

export function createLocalQuizVotes(audience: boolean) {
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
  async function request(answer?: QuizChoice): Promise<QuizCounts> {
    const response = await fetch('/__canvas/quiz-votes', audience && answer ? {
      method: 'PUT', headers: { 'x-quiz-voter': voter, 'x-quiz-choice': answer },
    } : { cache: 'no-store' });
    if (!response.ok) throw Error('Local quiz tally unavailable');
    return response.json();
  }
  return { request };
}
