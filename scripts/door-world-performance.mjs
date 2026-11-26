const stabilityByScene = {
  'P2-1': 0.43, 'P2-2a': 0.34, 'P2-2b': 0.46, 'P2-2c': 0.43,
  'P2-3': 0.43, 'P2-4': 0.37, 'P2-5': 0.33, 'P2-6': 0.33, 'P2-7': 0.4,
};

// Each cue specifies speed and style, followed by the corresponding English and Japanese phrases.
const dialogue = [
  [1.0, 0.15, ['Have you seen a door around here?', 'この辺で、扉を見なかった？']],
  [1.08, 0.26, ['Quick:', 'ほら、即答！'], ['what color is the sky?', '空は何色？']],
  [1.02, 0.13, ['Orange.', 'オレンジ。']],
  [1.07, 0.25, ['See?', 'ほらね？'],
    ["You didn't check whether I was messing with you.", '俺がからかってるかどうか、確かめなかっただろ。']],
  [0.98, 0.21, ['Were you?', 'からかってたの？']],
  [0.92, 0.18, ['Never.', 'まさか。']],
  [0.94, 0.14, ['Doubt anything you like.', '何だって疑っていい。'],
    ['But when I call your name, you answer.', 'でも、俺が名前を呼べば、君は答える。'],
    ['Start there.', 'そこから始めよう。']],
  [0.93, 0.16, ["Don't look too long.", 'あんまり長く見つめるなよ。'],
    ['The prettiest worlds are the hardest to leave.', 'きれいな世界ほど、離れがたいから。']],
  [0.91, 0.11, ['…Never mind.', '……なんでもない。']],
  [0.92, 0.16, ['I know him.', '私、あの人を知ってる。'],
    ["I don't know how I know him.", '……どうして知ってるのか、分からない。']],
  [0.91, 0.18, ['…What is that?', '……何、あれ？']],
  [0.95, 0.16, ["So that's the door he meant.", 'あれが、あの人の言ってた扉か。']],
  [0.95, 0.18, ['Is this even real—', 'これ、本当に現実なの——']],
  [1.03, 0.25, ['This world is fake!', 'この世界は偽物だ！'], ['Any objections?', '異議は？']],
  [0.88, 0.12, ['…No jury.', '……陪審員がいない。']],
  [1.05, 0.26, ["There's no door.", '扉がない。'],
    ["How do I close a door that isn't there?!", 'ない扉を、どうやって閉めるのよ！？']],
  [1.04, 0.25, ['You—!', 'あなた——！']],
  [1.12, 0.27, ['No time to explain.', '説明してる暇はない。'], ['Do it with me.', '一緒にやるんだ。']],
  [0.98, 0.3, ['O Hinges!', 'おお、ちょうつがいよ！'],
    ['Fixed Points Theoretical!', '理論の不動点よ！'],
    ['You who have held still for generations, that we might doubt all else!',
      '私たちがほかのすべてを疑えるよう、幾世代にもわたり揺るがずにいたものよ！']],
  [1.06, 0.32, ['Simone!', 'シモーヌ！']],
  [1.04, 0.28, ['…Here!', '……ここよ！']],
  [1.06, 0.29, ['To ask,', '問うには、'], ['our words must mean!', '言葉に意味がなきゃならない！']],
  [1.04, 0.23, ['Our words must mean!', '言葉に意味がなきゃならない！']],
  [1.02, 0.3, ['What we remember, we remember!', '覚えていることは、覚えている！']],
  [0.98, 0.24, ['To see it shut,', '閉まるところを見るには、'], ['my eyes must—', 'この目が——']],
  [1.1, 0.32, ['Different door, different hinge!', '扉が違えば、ちょうつがいも違う！']],
  [1.08, 0.32, ['—WORK!', 'ちゃんと見えなきゃ！']],
  [1.08, 0.31, ['The ground holds!', '足場はもつ！']],
  [1.03, 0.29, ['The door is here!', '扉はここにある！']],
  [0.99, 0.27, ["And you—you're not lying to me!", 'それに、あなたは——私に嘘なんかついてない！']],
  [0.94, 0.24, ['For this door, and this door alone—', 'この扉、ただこの扉に限り——']],
  [0.97, 0.25, ['—we take you as given, without further reasons!',
    'これ以上の理由を求めず、あなたを前提として受け入れます！']],
  [1.03, 0.28, ['These questions we return to you:', 'この問いを、あなたにお返しします。'],
    ['CLOS—', '閉め——！']],
  [0.91, 0.12, ["…I'm off.", '……行ってくる。']],
];

const translatedLines = new Map(dialogue.map(([speed, style, ...phrases]) => [
  phrases.map(([english]) => english).join(' '), { speed, style, phrases },
]));

export function doorWorldPerformance(cue, text, spokenWords) {
  const line = translatedLines.get(text);
  if (!line) throw new Error(`Door World dialogue needs a Japanese translation: ${text}`);
  return {
    input: line.phrases.map(([, japanese]) => japanese).join(' '),
    voiceSettings: { similarity_boost: 0.8, stability: stabilityByScene[cue.scene] ?? 0.4, speed: line.speed, style: line.style },
    alignWords: alignment => translatedWordTimes(line.phrases, alignment, spokenWords),
    // Timing changes need their own manifest entry even if the spoken text is identical.
    timingKey: line.phrases.map(([english]) => english).join('\0'),
  };
}

function translatedWordTimes(phrases, alignment, spokenWords) {
  if (!alignment?.characters?.length) return;
  const { characters, character_start_times_seconds: starts, character_end_times_seconds: ends } = alignment;
  const comparable = text => text.normalize('NFKC').replace(/[^\p{L}\p{M}\p{N}]/gu, '');
  let audibleText = '';
  const indices = [];
  for (const [index, char] of characters.entries()) {
    const segment = comparable(char);
    audibleText += segment;
    for (let i = 0; i < segment.length; i++) indices.push(index);
  }
  if (audibleText !== phrases.map(([, japanese]) => comparable(japanese)).join('')) return;
  let offset = 0;
  const words = [];
  for (const [english, japanese] of phrases) {
    const length = comparable(japanese).length;
    const start = starts[indices[offset]];
    const end = ends[indices[offset + length - 1]];
    if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || start >= end) return;
    const interval = [Math.round(start * 1000) / 1000, Math.round(end * 1000) / 1000];
    for (const word of spokenWords(english)) words.push(interval);
    offset += length;
  }
  return words;
}
