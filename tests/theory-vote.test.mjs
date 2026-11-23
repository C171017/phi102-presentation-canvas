import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const slides = ['L4', 'regress-skepticism', 'regress-infinitism', 'regress-coherentism', 'regress-foundationalism']
  .map(id => ({ members: [id] }));
const source = readFileSync(new URL('../src/theory-vote.ts', import.meta.url), 'utf8');
const context = { exports: {}, crypto, require: () => ({ slides }) };
vm.runInNewContext(ts.transpile(source, { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }), context);
const { applyTheoryAction, ballotSlide, resolveBallot } = context.exports;

test('foundation can only win the final round by an explicit vote, even after its deadline', () => {
  const audience = ['a', 'b'];
  let ballot = null;
  function act(action, voter, slide, choice, round = ballot?.id ?? null) {
    ballot = applyTheoryAction(ballot, { type: 'theory', action, choice, round }, slide,
      voter === 'presenter', voter, audience);
  }
  act('open', 'presenter', 0);
  const firstRound = ballot.id;
  for (const theory of ['coherentism', 'skepticism', 'infinitism']) {
    act('vote', 'a', 0, 'foundationalism');
    assert.equal(ballot.ballots.a, undefined);
    act('vote', 'a', 0, theory);
    act('vote', 'b', 0, theory);
    assert.equal(ballot.winner, theory);
    act('open', 'presenter', ballotSlide(ballot));
  }
  assert.equal(ballot.remaining.join(), 'foundationalism');
  ballot.closesAt = 0;
  resolveBallot(ballot, audience);
  act('close', 'presenter', 0);
  act('vote', 'a', 0, 'foundationalism', firstRound);
  assert.equal(ballot.winner, null);
  act('vote', 'a', 0, 'foundationalism');
  assert.equal(ballot.winner, 'foundationalism');
  assert.equal(slides[ballotSlide(ballot)].members[0], 'regress-foundationalism');
});
