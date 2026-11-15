// Small reading aids. The full explanations and their qualifications stay in the notes.
type Visual = { label: string; caption: string; drawing: string; height?: number };
const ink = '#334c4c', green = '#327563', rust = '#a65343';
const text = (x: number, y: number, words: string, color = ink, size = 13) =>
  `<text x="${x}" y="${y}" text-anchor="middle" fill="${color}" font-size="${size}">${words}</text>`;
const box = (x: number, y: number, w: number, lines: string[], tone = 'sage', h = 45) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="9" class="rv-${tone}"/>${lines.map((line, i) => text(x + w / 2, y + h / 2 + 5 + (i - (lines.length - 1) / 2) * 17, line)).join('')}`;
const arrow = (x: number, y: number, endX: number, endY: number, color = '#89998f') => {
  const angle = Math.atan2(endY - y, endX - x), len = 6;
  return `<path d="M${x} ${y} L${endX} ${endY} M${endX-len*Math.cos(angle-.55)} ${endY-len*Math.sin(angle-.55)} L${endX} ${endY} L${endX-len*Math.cos(angle+.55)} ${endY-len*Math.sin(angle+.55)}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
};
const person = (x: number, y: number, color: string) => `<circle cx="${x}" cy="${y}" r="9" fill="${color}"/><path d="M${x-14} ${y+30} Q${x-14} ${y+12} ${x} ${y+12} Q${x+14} ${y+12} ${x+14} ${y+30}" fill="${color}"/>`;
const pair = (left: string[], right: string[], relation = '→') => box(8, 28, 140, left) + text(170, 56, relation, rust, 22) + box(192, 28, 140, right, 'sand');
const foundations = (x: number, label: string, bases: string[]) => text(x + 72, 17, label, '#786b57', 11) + box(x + 15, 29, 114, ['Belief P'], 'paper', 34) + `<path d="M${x+30} 64 V78 H${x+115} V64" fill="none" stroke="${ink}" stroke-width="2"/>` + bases.map((b, i) => box(x + i * 76, 79, 68, [b], i ? 'sand' : 'sage', 30)).join('');
const roles = () => box(6, 15, 104, ['Subject', 'holds P']) + box(118, 15, 104, ['Speaker', 'attributes'], 'sand') + box(230, 15, 104, ['Assessor', 'evaluates'], 'lavender') + text(170, 91, 'Expressivism: the commitment expressed', ink, 12);
const mobile = () => box(8, 17, 141, ['Context C', 'What Peter said']) + box(191, 17, 141, ['Context C′', 'Email / memory'], 'sand') + arrow(151, 40, 188, 40) + text(170, 88, 'Doubt about hearing → reconsider the base', rust, 12);
const visuals: Visual[] = [
  { label: 'One sentence, two contexts', caption: 'The words stay the same; what they express can change.', drawing: box(85, 5, 170, ['“S knows P”'], 'paper', 34) + arrow(140, 42, 82, 62) + arrow(200, 42, 258, 62) + box(8, 66, 140, ['Context A', 'Proposition A']) + box(192, 66, 140, ['Context B', 'Proposition B'], 'sand'), height: 122 },
  { label: 'Same role, changing foundations', caption: 'A different inquiry can use a different supporting base.', drawing: foundations(8, 'INQUIRY A', ['Q', 'R']) + foundations(188, 'INQUIRY B', ['S', 'T']), height: 120 },
  { label: 'Why look for flexibility?', caption: 'The task: explain a legitimate stopping point in context.', drawing: pair(['Demand certainty', 'Too few foundations'], ['Allow doubt', 'Why stop here?'], '↔') },
  { label: 'Where context enters', caption: 'These are different proposals, not interchangeable labels.', drawing: roles() },
  { label: 'Access with a moving base', caption: 'The proposed strategy preserves access within each context.', drawing: mobile() },
  { label: 'What happens to the chain of reasons?', caption: 'Four responses to the demand for another reason.', height: 155, drawing:
    text(65, 21, 'Skepticism', rust) + text(65, 49, 'P  ←  ?  ×', rust, 19) + text(249, 21, 'Infinitism') + text(249, 49, 'P ← Q ← R ← …', ink, 17) + text(65, 94, 'Coherentism') + text(65, 123, 'P ⇄ Q ⇄ R', ink, 18) + `<path d="M20 127 Q65 150 110 127" fill="none" stroke="${ink}"/>` + text(249, 94, 'Foundationalism', green) + text(249, 123, 'P ← Q ← base', green, 17) },
  { label: 'The two horns', caption: 'Certainty seems too restrictive; a weaker base needs a rationale.', drawing: pair(['Indubitable', 'Too little to build on'], ['Open to doubt', 'Why is it a base?'], '↔') },
  { label: 'A role can change', caption: 'Undoubted here does not mean impossible to doubt elsewhere.', drawing: pair(['Inquiry A', 'Q supports P'], ['Inquiry B', 'Q is questioned']) },
  { label: 'Reasons meet an audience', caption: 'The relevant objections are those the appropriate group would raise.', drawing: person(32, 25, '#b5854c') + arrow(53, 46, 104, 46) + box(111, 19, 125, ['Reason for P']) + arrow(241, 46, 279, 46) + person(299, 20, '#69877f') + person(320, 34, '#90a39a') + text(40, 91, 'Speaker', ink, 12) + text(286, 91, 'Objector-group', ink, 12) },
  { label: 'Question and hinge swap roles', caption: 'Every inquiry needs some fixed points; they need not be identical.', drawing: pair(['Inquiry A', 'Test P · hold Q fixed'], ['Inquiry B', 'Test Q · hold R fixed']) },
  { label: 'Two ingredients', caption: 'The flexible account supplies the contextual variation.', height: 134, drawing: box(7, 8, 143, ['Knowledge or belief', 'at the base']) + text(170, 37, '+', rust, 24) + box(191, 8, 142, ['Flexible account of', 'knowledge or belief'], 'sand') + arrow(170, 59, 170, 78) + box(72, 84, 196, ['Flexible foundations'], 'sage', 34) },
  { label: 'Separate the roles', caption: 'One person can fill several roles; the roles remain distinct.', drawing: roles() },
  { label: 'Status changes; meaning stays fixed', caption: 'Stakes, norms, or inquiry enter through the subject’s situation.', drawing: box(7, 24, 143, ['Subject’s', 'circumstances']) + arrow(154, 46, 185, 46) + box(190, 24, 143, ['Foundational', 'status'], 'sand') + text(170, 92, 'Same meaning of the attribution', ink, 12) },
  { label: 'Context enters through the speaker', caption: 'Being able to voice criticism raises a further question about disagreement.', drawing: person(27, 22, '#b5854c') + arrow(49, 44, 82, 44) + box(88, 18, 139, ['Speaker’s context']) + arrow(231, 44, 253, 44) + box(259, 18, 75, ['What is', 'claimed'], 'sand') },
  { label: 'Two different kinds of “no”', caption: 'Different people can have different appetites. But how should we treat the same belief?', height: 176, drawing:
    text(170, 16, 'DIFFERENT PEOPLE', '#786b57', 10) + box(8, 26, 141, ['“I’m hungry”'], 'sage', 35) + box(191, 26, 141, ['“I’m not hungry”'], 'sand', 35) + text(170, 82, '✓ Both can be true; no conflict', green, 12) + `<path d="M10 96 H330" stroke="#ded9ce" stroke-dasharray="3 5"/>` + text(170, 116, 'THE SAME BELIEF P', '#786b57', 10) + box(8, 128, 141, ['“Treat P as a base”'], 'sage', 35) + text(170, 151, '↔', rust, 23) + box(191, 128, 141, ['“Don’t treat P so”'], 'rose', 35) },
  { label: 'One level up', caption: 'Justification for the further belief—not a requirement to form it.', drawing: pair(['Justified', 'in believing P'], ['Justified in believing', '“I have justification”']) },
  { label: 'Evidence and truth can come apart', caption: 'The challenge: explain why our justificatory basis is accessible.', drawing: box(7, 18, 143, ['Forecast', '“Sunshine”'], 'sand') + text(170, 46, '≠', rust, 24) + box(190, 18, 143, ['Actual weather', 'Rain'], 'lavender') + text(170, 91, 'Can facts about justification be hidden too?', ink, 12) },
  { label: 'Change the context, change the base', caption: 'Each base is treated as accessible in its own context.', drawing: mobile() },
  { label: 'Two ideas to take away', caption: 'Still open: what makes a local foundation legitimate?', drawing: pair(['Foundations', 'Undoubted here'], ['Access', 'A locally known base'], '+') },
];

export function readingVisual(index: number) {
  const visual = visuals[index];
  if (!visual) return '';
  return `<figure class="reading-visual"><div class="reading-visual-label">${visual.label}</div><svg viewBox="0 0 340 ${visual.height ?? 106}" role="img" aria-label="${visual.label}"><title>${visual.label}</title>${visual.drawing}</svg><figcaption>${visual.caption}</figcaption></figure>`;
}
