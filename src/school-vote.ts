export type School = 'L6-A' | 'L6-B';
export type SchoolCounts = Record<School, number>;
export type SchoolVote = { type: 'school'; voter: string; school: School };

export function isSchool(value: unknown): value is School {
  return value === 'L6-A' || value === 'L6-B';
}

export function isSchoolVote(value: unknown): value is SchoolVote {
  if (!value || typeof value !== 'object') return false;
  const vote = value as Partial<SchoolVote>;
  return vote.type === 'school' && isSchool(vote.school) &&
    typeof vote.voter === 'string' && /^[a-f0-9]{32}$/.test(vote.voter);
}

export function countSchools(members: Iterable<{ schoolVote?: SchoolVote }>): SchoolCounts {
  const byDevice = new Map<string, School>();
  for (const member of members) {
    if (member.schoolVote) byDevice.set(member.schoolVote.voter, member.schoolVote.school);
  }
  const counts: SchoolCounts = { 'L6-A': 0, 'L6-B': 0 };
  for (const school of byDevice.values()) counts[school]++;
  return counts;
}
