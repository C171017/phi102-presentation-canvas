import { slides } from './slide-content';

export const theoryNames = {
  skepticism: 'Skepticism', infinitism: 'Infinitism', coherentism: 'Coherentism', foundationalism: 'Foundationalism',
} as const;
export type Theory = keyof typeof theoryNames;
export const theories = Object.keys(theoryNames) as Theory[];
export const theoryVoteWindowMs = 10_000;
export const voteHub = 'L4';
export const theoryScene = (theory: Theory) => 'regress-' + theory;

export type TheoryAction = {
  type: 'theory';
  action: 'open' | 'vote' | 'close';
  round: string | null;
  choice?: Theory;
};
type Round = { id: string; remaining: Theory[]; eliminated?: Theory; winner: Theory | null };
export type TheoryBallot = Round & { closesAt: number; ballots: Record<string, Theory> };
export type TheoryView = Round & { counts: Record<Theory, number>; voters: number; mine?: Theory };

export function ballotSlide(ballot: Round) {
  return slides.findIndex(slide => slide.members[0] === (ballot.winner ? theoryScene(ballot.winner) : voteHub));
}

export function voteView(ballot: TheoryBallot, audience: string[], voter?: string): TheoryView {
  const counts = { skepticism: 0, infinitism: 0, coherentism: 0, foundationalism: 0 };
  for (const id of audience) {
    const choice = ballot.ballots[id];
    if (choice) counts[choice]++;
  }
  const { id, remaining, eliminated, winner } = ballot;
  return { id, remaining, eliminated, winner, counts, voters: audience.length, mine: voter ? ballot.ballots[voter] : undefined };
}

export function resolveBallot(ballot: TheoryBallot, audience: string[], close = false) {
  if (ballot.winner) return;
  const { counts } = voteView(ballot, audience);
  // The fourth approach is revealed by an actual choice, even if the room pauses
  // longer than the timer used for competitive rounds.
  if (ballot.remaining.length === 1 && ballot.remaining[0] === 'foundationalism') {
    if (counts.foundationalism > 0) ballot.winner = 'foundationalism';
    return;
  }
  const eligible = ballot.remaining.filter(choice => choice !== 'foundationalism' || ballot.remaining.length === 1);
  const votes = eligible.map(choice => counts[choice]);
  const high = Math.max(...votes);
  const allVoted = high > 0 && votes.reduce((a, b) => a + b, 0) === audience.length;
  if (!close && !allVoted && Date.now() < ballot.closesAt) return;
  const leaders = eligible.filter(choice => counts[choice] === high);
  ballot.winner = leaders[Math.floor(Math.random() * leaders.length)];
}

// The room owns the round token, eligible choices and winner. A delayed click from an
// earlier ballot cannot choose a branch or eliminate it twice.
export function applyTheoryAction(ballot: TheoryBallot | null, message: TheoryAction, slide: number,
  presenter: boolean, voter: string, audience: string[]): TheoryBallot | null {
  if (message.round !== (ballot?.id ?? null)) return ballot;
  if (message.action === 'open' && presenter) {
    if (ballot ? !ballot.winner || ballot.winner === 'foundationalism' || slide !== ballotSlide(ballot)
      : slides[slide]?.members[0] !== voteHub) return ballot;
    const remaining = ballot ? ballot.remaining.filter(choice => choice !== ballot.winner) : [...theories];
    return { id: Array.from(crypto.getRandomValues(new Uint32Array(3))).join('-'), closesAt: Date.now() + theoryVoteWindowMs, remaining, eliminated: ballot?.winner ?? undefined, winner: null, ballots: {} };
  }
  if (!ballot || ballot.winner || slide !== ballotSlide(ballot)) return ballot;
  if ((ballot.remaining.length > 1 && Date.now() >= ballot.closesAt) || (message.action === 'close' && presenter)) {
    resolveBallot(ballot, audience, true);
    return ballot;
  }
  if (message.action !== 'vote' || !message.choice || !ballot.remaining.includes(message.choice)) return ballot;
  if (message.choice === 'foundationalism' && ballot.remaining.length > 1) return ballot;
  // A presenter can rehearse alone, but cannot cast a vote for a connected audience.
  if (presenter && audience.length) return ballot;
  ballot.ballots[voter] = message.choice;
  resolveBallot(ballot, presenter ? [voter] : audience);
  return ballot;
}
