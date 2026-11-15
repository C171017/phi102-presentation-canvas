import { slides } from './slide-content';
import { paperNotes } from './paper-notes';
import { readingVisual } from './reading-visuals';
import './reading-panel.css';

// Paraphrases of Daniel Greco, “Contextualism about Foundations” (2017).
// Section references refer to the paper, not to the presentation's ordering.
const notes = [
  {
    source: 'Introduction · §3',
    lead: 'The same sentence can express different propositions in different contexts.',
    body: `<h2>What changes?</h2><p>Contemporary contextualism is a view about <strong>meaning in context</strong>. In epistemology, its familiar target is sentences containing “knows.” What a speaker claims by saying that someone knows something can vary with the context of utterance.</p>
    <h2>Two uses of “contextualism”</h2><p>An earlier tradition used the term for a view about the <strong>structure of justification</strong>: our beliefs have foundations, but which beliefs serve as foundations depends on context.</p><p>Greco calls that earlier view <strong>flexible foundationalism</strong> to keep it distinct from the contemporary semantic thesis.</p>
    <div class="reading-takeaway"><strong>Keep the distinction</strong><p>A context-sensitive foundation does not, by itself, commit us to context-sensitive meanings.</p></div>
    <h2>Reading the animation</h2><p>The moving sentence represents one linguistic form; its changing color represents a change in what it expresses. The colors are a visual analogy, not categories proposed in the paper.</p>`
  },
  {
    source: 'Introduction · §1 · §5',
    lead: 'Justification has foundations, but their identity can vary with context.',
    body: `<h2>The central proposal</h2><p>A foundational belief can support other beliefs without needing support from further beliefs in that context. Flexible foundationalism retains this stopping point while allowing <strong>different beliefs to play the foundational role in different inquiries</strong>.</p>
    <h2>Undoubted in this context</h2><p>Greco starts from the thought that a reason still in doubt cannot resolve another doubt. A foundation must therefore be free from doubt in the context where it is doing the supporting.</p><p>This does not require a belief that could never reasonably be doubted. A claim taken for granted here may become a subject of investigation elsewhere.</p>
    <div class="reading-takeaway"><strong>The key move</strong><p>Keep the foundational role; allow its occupants to change.</p></div>
    <h2>Reading the animation</h2><p>The supported belief remains in place while its supporting foundations change. This illustrates contextual variation in support, not the claim that any arbitrary belief can be a foundation.</p>`
  },
  {
    source: '§1 · §§2.1–2.3',
    lead: 'Flexible foundations offer a way between demanding certainty and choosing arbitrary stopping points.',
    body: `<h2>The foundationalist’s dilemma</h2><p><strong>Demand indubitability:</strong> too few beliefs qualify to support ordinary knowledge. <strong>Relax that demand:</strong> we need an explanation of why these particular beliefs can legitimately stop the regress.</p>
    <h2>Three routes to flexibility</h2><ol><li><strong>Justification as a social activity.</strong> We offer reasons to an audience. Which claims need defending depends on which objections are appropriate in that setting.</li><li><strong>Hinges of inquiry.</strong> Investigating one question requires treating others as settled. Different inquiries may rely on different background commitments.</li><li><strong>Knowledge or belief at the base.</strong> A theory identifying evidence with knowledge, or treating beliefs as foundations, can become flexible when combined with context-sensitive accounts of knowledge or belief.</li></ol>
    <div class="reading-takeaway"><strong>An open challenge</strong><p>A community can be epistemically mistaken. Mere agreement cannot automatically establish that its accepted foundations are appropriate.</p></div>`
  },
  {
    source: '§3 · see also §2.3',
    lead: 'Flexible foundationalism is a family of views, not a single theory of how context matters.',
    body: `<h2>Four ways to develop the idea</h2><dl><dt>Contextualism</dt><dd>The proposition expressed by an epistemic attribution varies with the speaker’s context. Greco cautions that “foundationally justified” is a technical phrase, so ordinary linguistic evidence is harder to obtain.</dd><dt>Sensitive invariantism</dt><dd>The meaning remains stable, while facts about the subject’s situation—such as practical stakes, community norms, or current inquiry—affect epistemic status.</dd><dt>Relativism</dt><dd>In broad terms, evaluation depends on a context of assessment. Greco identifies this as a possible development rather than providing a complete theory here.</dd><dt>Expressivism</dt><dd>In broad terms, epistemic judgments express commitments to norms of acceptance and support. Greco likewise sketches this as a possible direction.</dd></dl>
    <h2>Why the difference matters</h2><p>Can we criticize a community’s epistemic norms? And when people endorse conflicting norms, are they genuinely disagreeing or merely describing different standards?</p><div class="reading-takeaway"><strong>The pressure point</strong><p>Greco uses criticism and disagreement to motivate alternatives, without settling on one of the four.</p></div>`
  },
  {
    source: '§§4.1–4.2 · §5',
    lead: 'Greco sketches access internalism without requiring an infallible, permanent foundation.',
    body: `<h2>The access principle</h2><p>If someone is justified in believing a claim, they are also justified in believing that they have that justification. This is a <strong>higher-order justification</strong> requirement, not a demand that they actually form that further belief.</p>
    <h2>A changing “cognitive home”</h2><p>In a given context, certain facts determine what the person is justified in believing, and the person counts as able to know those facts. Greco allows this accessible basis to change as the context changes.</p>
    <h2>Justine and the party</h2><p>If we take for granted that Justine heard Peter, what he told her can settle what she should believe about the party’s starting time.</p><p>If we start doubting her hearing, the relevant basis may shift to an email she remembers, the times of previous parties, or her best estimate of what was said.</p>
    <div class="reading-takeaway"><strong>The proposed payoff</strong><p>Preserve access to justification locally without claiming one permanently privileged class of facts. Greco offers a promising sketch, not a full defense.</p></div>`
  },
  {
    source: '§1 · note 1',
    lead: 'If a belief needs a supporting reason, what justifies that reason?',
    body: `<h2>Four responses</h2><dl class="reading-routes"><dt class="route-skepticism">Skepticism</dt><dd>Justification is impossible. The difficulty is explaining away our apparent justified beliefs.</dd><dt class="route-infinitism">Infinitism</dt><dd>Reasons continue indefinitely without repetition. The inward spiral represents continuing justification, not a return to an earlier reason.</dd><dt class="route-coherentism">Coherentism</dt><dd>Support returns to beliefs within an interconnected system. The challenge is distinguishing mutually supporting beliefs from an unconvincing circular argument.</dd><dt class="route-foundationalism">Foundationalism</dt><dd>The chain terminates in foundations. The challenge is explaining why those beliefs may legitimately stop the demand for further reasons.</dd></dl>
    <h2>Why flexibility enters</h2><p>Certainty seems a principled stopping point, but demanding indubitable foundations threatens skepticism. Flexible foundationalism instead asks which beliefs can remain undoubted in this particular context.</p>
    <div class="reading-takeaway"><strong>A qualification from Greco</strong><p>This taxonomy assumes justification involves chains of reasons. Some coherentists would dispute that characterization of their view.</p></div>`
  },
  ...paperNotes,
];

export function createReadingPanel() {
  const panel = document.querySelector<HTMLElement>('#reading-panel')!;
  panel.innerHTML = '<article class="reading-content" tabindex="0" aria-label="Slide explanation"></article>';
  const article = panel.querySelector<HTMLElement>('article')!;
  let current = -1;
  function update(index: number) {
    if (index < 0 || index === current) return;
    current = index;
    const note = notes[index];
    article.innerHTML = `<h1>${slides[index].title}</h1><p class="reading-lead">${note.lead}</p>${readingVisual(index)}${note.body}<p class="reading-source">Source: ${note.source}</p>`;
    article.scrollTop = 0;
  }
  update(0);
  return { update };
}
