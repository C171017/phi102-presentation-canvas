export type QuizChoice = 'B' | '13';
export type QuizCounts = Record<QuizChoice, number>;
export type OpeningQuizSnapshot = { counts: QuizCounts; round: string; closesAt: number };
export type OpeningQuizRound = OpeningQuizSnapshot & { ballots: Record<string, QuizChoice> };
export const openingQuizWindowMs = 10_000;

export function newOpeningQuiz(closesAt = 0): OpeningQuizRound {
  return { counts: { B: 0, '13': 0 }, round: crypto.randomUUID(), closesAt, ballots: {} };
}

export function recordOpeningVote(quiz: OpeningQuizRound, voter: string, answer: QuizChoice): boolean {
  const previous = quiz.ballots[voter];
  if (previous === answer) return false;
  if (previous) quiz.counts[previous]--;
  quiz.counts[answer]++;
  quiz.ballots[voter] = answer;
  return true;
}
