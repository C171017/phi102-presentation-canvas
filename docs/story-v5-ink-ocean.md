# PHI 102 canvas · Story draft 5: *The Ink Ocean* (working title)

**Living design document, updated November 21, 2026.** It's written scene by scene so that it can be read straight through, visualized, reviewed and revised.

## How to read this document

| Tag | Meaning |
| --- | --- |
| **[FIXED]** | Confirmed by the author. Don't change it without asking. |
| **[AI DRAFT]** | Temporarily written by AI to fill a gap. Not confirmed. Expect revisions. |
| **[OPEN]** | A decision still to make. The AI draft uses the default noted in §8. |

A scene can be fixed in concept and AI-drafted in wording. Both tags then appear, for example **[FIXED concept · AI DRAFT text]**.

## For the visualization agent

1. **Job:** draw each scene below for review. Label every image with its scene ID (for example `L6`) and its status. Mark images of **[AI DRAFT]** material as drafts.
2. **House style:** follow [slide-visual-style.md](slide-visual-style.md): cut-paper planes, one shadow plane per surface, fine paper grain, ink navy with pools of amber. Leave the lower part of the frame quiet for the dialogue box.
3. **Identity:** use the [Version C model sheets](character-references/version-c/) for faces, hair, costume and props only. Take expressions and body language from the [character bible](character-bible.md): *Cole performs, Simone notices, Rae assesses, Echo abides.*
4. **Recurring identifiers:** Simone: black loop ponytail, green jacket. Cole: rust jacket, phone, ring light, earbud wire. Rae: navy cap, ticket punch. Echo: one palm-sized hermit crab with a tall faceted violet shell and one oversized coral claw. YYYY SOWATT: five ink bubbles, each with exactly one pointed speech-bubble tail; the smallest has a red dot ([reference](character-references/quibble-a3-single-tail.png)).
5. **Context colors:** teal for Simone, rust for Cole, blue for Rae, violet and coral for Echo.
6. **Don't** put the names of films, games, studios, artists or specific artworks into image prompts. Describe painting traditions and visual qualities instead. Don't reproduce any existing character, logo or painting. Descartes appears as a generic seventeenth-century scholar in scroll style, not a copy of a known portrait.
7. **Avoid baked-in text** except where a scene asks for a short label (a title card, words pressed into an ink stick).
8. **Show the Dry World meter** (§2b) in the corner of every legend, prison and real-ocean frame, at the value given for that scene.
9. **Legend-era people are made of ink sticks:** stacked, inscribed bars of dried ink shaped into a person, each bar pressed with one belief. When their beliefs go wet, they slump, drip and shrink. The four heroes keep their Version C designs.
10. **The three Answerers and Descartes** are stylized characters, not portraits: invent faces; don't copy any known painting or photograph.
11. **L6 has a live game** with one shared split screen (Sect left, School right). Visualize the shared board at the start, mid-battle and at the result, plus the audience device with its input bar.
12. **The regress dialogue in `src/slide-content.ts` is out of date.** Use L1–L5 of this document.

## Quick reference

| | |
| --- | --- |
| **Heroes** | Simone (subject · sensitive invariantism), Cole (speaker · contextualism), Rae (assessor · relativism), Echo (hermit crab · expressivism) |
| **Villain** | The Cartesian demon (no body: a dark ink sky with strings) |
| **The demon's creation** | YYYY SOWATT (four Y voices + SOWHAT), its manifestation in the world |
| **Legend figures** | The guardian question mark; the three Answerers (Pyrrho, Peirce, Neurath); Descartes, the fourth; the Sect of No Doubt; the Seeing-Is-Believing School; the ferryman; his daughter |
| **Objects** | Ink sticks (foundations); the *I think* stick (grain-sized); the three sacred weapons |
| **Places** | The Great Inkwell; the ink ocean; four dream universes; the lighthouse |

---

## 1 · The world

### 1.1 Wet ink and dry ink [FIXED]

Everything in this world is written in ink. A sentence stays wet while anyone is asking about it. Left alone, it dries. **Dry means settled.** Dry ink is a foundation: you can stand on it, and you can use it to support further claims.

### 1.1b The Great Inkwell, the guardian question mark, and people made of beliefs [FIXED]

- At the source of the world is **the Great Inkwell**. Everyone's beliefs are written in its ink, and each person's beliefs build the world as they know it: their own reality.
- **People are literally made of their beliefs.** To form a belief, you scoop a ladle of wet ink from the Inkwell and say what you want to believe. A **guardian question mark** stands at the Inkwell like a safety check. It asks you about the belief. Once you've answered to its satisfaction, it stops asking, the ink dries into a stick, and you set that stick into your own body. A person is a stack of dried beliefs.
- **The guardian was not a strict examiner.** It accepted almost any answer, including nonsense. (This is the legend's dark joke, and it foreshadows the social route: a lax enough audience will let anything dry.)
- One day, someone knocks the guardian into the Inkwell. It's gone, and YYYY SOWATT grows in its place: a mutant question mark that never stops asking. Nobody's ink can dry, and people start to melt.

### 1.1c What a foundation is: a process, not a plug [FIXED]

- **A foundation is a process, not an object.** Founding means making ink dry, temporarily, right where you stand, so that it can hold up more. Nothing ever seals the Inkwell or stops YYYY SOWATT. Even Descartes's *I think* is just one grain that stays dry; it plugs nothing.
- **The world was always an ink ocean.** Underneath, it was never solid. The old dry world, where the guardian let beliefs dry on answers like "because my mother said so," was the real illusion. What's true is the ocean, and the only footing anyone has is local: dry ink under their own feet, in their own context. This is exactly what the ending shows: the world is still an ocean, and people live anyway.
- **The old world should feel absurd from the very first scene** (the guardian's lazy questions, the nonsense answers it accepts), so that the audience senses something was off before anyone says so.
- **[FIXED as a hint] Moral ambiguity:** like games that leave you arguing over who was right, the story hints that the demon might have had a point: it didn't drown a solid world, it revealed a wet one. **[AI DRAFT] Treatment:** the demon stays the antagonist (it still murders the ferryman and traps everyone in dreams), but in R14 it gets the skeptic's best argument, and Simone's answer agrees with half of it: there is no ground under the ocean; there is ground under her.

### 1.2 Ink sticks [FIXED]

A sentence that nobody is asking about dries into an **ink stick**: a solid bar of dried ink with the claim pressed into its face, like the embossed ink sticks used in calligraphy.

| Rule | What you see |
| --- | --- |
| Nobody is asking, so it dries | The wet sentence hardens into a stick |
| A question is water | Ask about a stick seriously and it softens back into wet ink |
| Undoubted, not undoubtable | A stick is solid, but any stick melts if you pour water on it |
| Foundations support other beliefs | You grind a stick into fresh ink to write new conclusions |
| Building on foundations | Sticks are solid enough to stand on and build with |

**[AI DRAFT]** On the ocean, a stick dries under your feet like a plank. A further belief floats just above the stick that supports it. A stick is tinted by whose context matters (teal, rust or blue). Echo has no sticks, only his claw.

### 1.3 YYYY SOWATT [FIXED]

A chorus of five ink bubbles born when a question mark spilled into the world's inkwell. Every line from the four Y voices starts with "Why." The Ys ask what supports a reason. SOWHAT, the smallest, with the red dot of a teacher's margin note, asks whether the reason supports the claim at all.

### 1.4 The Cartesian demon and YYYY SOWATT [FIXED]

- **[FIXED]** The Cartesian demon is the supervillain behind everything. Everyone in PHI 102 knows it from Units 2.1–2.2.
- **[FIXED]** **The demon created YYYY SOWATT.** SOWATT is its manifestation in the world, the form its doubt takes when it touches ink. The "someone" who spilled the question mark into the inkwell (L1) was the demon.
- **[FIXED]** **The twist:** Descartes imagined the demon as a hypothetical, a thought experiment to find a foundation. He was right. It actually exists.
- **[AI DRAFT]** The demon has no body. It's a dark sky of ink with thin strings hanging from it, and it speaks only through YYYY SOWATT. Faint strings rise from SOWATT from its very first frame; nobody mentions them until R3.
- **[AI DRAFT]** Its lie: "There is one rule for the whole ocean, and I can make it fail."
- **[AI DRAFT]** Its weapon is the one Greco worries about in §4: doubt about your own grounds that leaks down into doubt about the belief itself.
- **[AI DRAFT] Catchphrase:** "Suppose there were a demon." Descartes says it first, as a hypothetical (L5). The Sect of No Doubt chants it at its entrance test (L6). In R3, the demon says it back, and answers it.

---

## 2 · The story at a glance

1. **[FIXED]** **Frame.** A student steps off the red Unitrans double-decker and takes a seat in Giedt Hall. Professor Lin opens with the B/13 quiz on contemporary contextualism, then introduces flexible foundationalism. The OP plays. As soon as it ends, the legend begins.
2. **[FIXED]** **Legend:** YYYY SOWATT is born and starts to wet the world like a virus, getting visibly worse with every chapter (§2b). People fight back: humanity elects three great masters, the Answerers, who appear in an order the audience chooses and are all useless; then Descartes, the fourth master nobody elected, right after. Descartes's *I think* is the first belief that stays dry while being asked about, but one dry grain can't hold back an ocean, and people have to hurry. Two schools try to dry the world again and fail. A young ferryman discovers flexible foundationalism and makes three sacred weapons, but he's killed right before he can prove it. The weapons are lost, and the whole world falls asleep inside the demon's dreams.
3. **[FIXED concept · AI DRAFT content]** **Prisons:** the four heroes, each dreaming in a universe built from one route and one version, find the weapons and see through their worlds with the audience's help (the quizzes).
4. **[FIXED]** **Real ocean:** they wake ages later, meet, and confront the demon. Following §4 of the paper, they use what they learned to save everyone still dreaming.

---

## 2b · The urgency device: the Dry World meter [FIXED concept · AI DRAFT design]

**[FIXED]** From the moment YYYY SOWATT is born, the disaster keeps spreading and the audience must *see* it getting worse, chapter by chapter, until a cure is in sight. Right before the cure, everything freezes.

**[AI DRAFT]** Five layers, all tied to the same number:

1. **The meter.** A small inset map of the world in the corner of every legend slide, with a mock-anime HUD label: **DRY WORLD REMAINING: 100%**. Dark ink spreads across the inset as the number falls. The sarcastic narrator never mentions it.
2. **Day captions.** Each chapter opens with a caption counting days since the first question: *Day 1*, *Day 3*, *Day 30*… The whole legend happens fast, like a myth told in one breath.
3. **The scroll itself gets wetter.** Each chapter, the handscroll is a little more damaged: the edges buckle, colors bleed past their outlines, ink runs down from the top edge. By the demonstration, the painting is barely holding together.
4. **The dialogue box drips.** The narrator's text picks up a faint run under each letter, a little longer each chapter. (On the canvas: an SVG turbulence and displacement filter whose strength rises with the chapter.)
5. **Sound** (if the canvas plays audio): a slow drip at L2 that speeds up chapter by chapter, like a pulse. Silence at the freeze.

| Scene | Day caption | Meter | What the audience feels |
| --- | --- | --- | --- |
| L1 · Origin | Before the fall | 100% | A clean map; everyone whole |
| L2 · The hand | Day 1 | 99% | One dark spot at the Inkwell's edge |
| L3 · The Whypocalypse | Days 2–30 | 99% → 58% | The number falls *while they watch*; the stain races outward from the Inkwell |
| L4 · The three Answerers | Days 30–39 | 58% → 52% → 47% → 41% | One step down per master, in whatever order the audience picks them |
| L5 · Descartes | Day 40 | **41%, holds** | For one day the number stops falling, while everyone stares at the grain |
| L5b · Faster | Days 41–60 | 41% → 35% | It starts falling again. Faster. |
| L6 · The two schools | Days 60–90 | 35% → 40% → 28% | The School's fleets push it up; each "Are you sure?" knocks it down further |
| L7 · The ferryman | Day 91 | 28% → **29%** | The first time the number has *ever* gone up. Hope. |
| L8 · The weapons | The night before the demonstration | 29% | The number flickers, as if about to jump |
| L9 · The demonstration | The demonstration | **FREEZE at 29%** | See below |
| L10 · The Long Dream | — | **??%**, frozen and blinking | The world has stopped |

**The freeze [AI DRAFT].** Mid-demonstration, a voice asks "Are you sure?", the ferryman's footing melts, and as he sinks, his hand catches the cloth over the three weapons. At that instant, everything stops:
- the image becomes a freeze frame: drops of ink hang in mid-air, the ferryman sunk to the shoulders, the crowd mid-gasp;
- **one corner of the cloth over the three weapons is lifted**: the cure was literally a hand's width from being revealed;
- color drains from the scene to grey, except the five bubbles rising from the Inkwell and the faint strings above;
- the meter stops at 29%, then the digits turn to **??** and blink;
- the drip sound stops. Silence.

The narrator speaks the end of L9 and all of L10 over the frozen frame, as if the narrator is the only thing outside time.

**Payoff in Part 2 [AI DRAFT].** Inside every prison, the meter reads **DRY WORLD REMAINING: 100%**. Too perfect. It's a clue that the world is fake. When a prison cracks, the meter glitches and briefly shows **??**.

**Payoff in Part 3 [AI DRAFT].**
- **R1:** the hanging drops finally fall, *plink*, and time starts again. The meter reads **DRY WORLD REMAINING: 0%**, and it **stays at 0% for the rest of the story**. The ocean is real.
- **R5:** a second line appears under it: **PEOPLE STANDING: 1** (Simone, on one dry stick).
- **R11:** **PEOPLE STANDING: 4.**
- **R13:** as the dreamers wake, the second number races upward.
- **R14:** the final reading is **DRY WORLD REMAINING: 0% · PEOPLE STANDING: 97%**. The world never dried. Almost everyone is standing anyway. That contrast is the whole metaphor: you don't need a dry world, you need dry footing. (Not 100%, because the demon is still out there.) Beside the final title card: **THE END. (Probably.)**

## 3 · Part 0 · Frame [FIXED]

| ID | Scene |
| --- | --- |
| S0.1 | A student steps off the red Unitrans double-decker at UC Davis. |
| S0.2 | The student takes a seat in Giedt Hall and opens their notebook. |
| S0.3 | **Opening quiz · Contemporary Contextualism.** Professor Lin asks, “What do you see there?” The audience has ten seconds to vote. The same mark reads as **B** between A and C, or **13** between 12 and 14. |
| S0.4 | Professor Lin says, “Flexible foundationalism.” Cut straight to the OP. |
| S0.5 · Playback cue | **Play the existing standalone OP video.** When it ends, cut directly to L1. The narrator begins, “Long ago, every word in the world was written in ink.” |

S0.1–S0.4 use the existing campus and classroom visuals. S0.5 is a playback cue for the [separate opening film](../../op/drafts/dead-ink-op-codex-v2.mp4). The classroom reveal cuts to the film, then playback leads directly to L1.

### S0.5 · Creative brief for the standalone opening film [FIXED scope]

1. **Story trailer.** Introduce the protagonists, their world, and the trouble ahead. Give the audience a first look at Simone, Cole, Rae, and Echo and a sense of what it means to stand on an ocean made of ink. Save the answers to the mystery for the story.
2. **Project acknowledgments.** Credit the people who worked on this presentation and identify what each contributed. **[OPEN]** Contributor names, preferred spellings, and role wording.
3. **Real-world counterparts.** Identify the paper behind the story, Daniel Greco’s *Contextualism about Foundations* (2017), and place the presentation in Professor Hanti Lin’s PHI 102 course at UC Davis. **[OPEN]** How the opening moves between the classroom, the paper, and the fictional sea.

---

## 4 · Part 1 · The Legend (*Why accept flexible foundationalism?*)

**[AI DRAFT] Format:** one long horizontal handscroll. The camera pans right as the legend unfolds. Each chapter has its own painting style (see each scene). Faint threads hang above YYYY SOWATT in every frame where it appears. Nobody mentions them.

### L1 · The Great Inkwell and the guardian question mark [FIXED concept · AI DRAFT text]

> **Narrator:** Long ago, at the source of the world, there was a great inkwell. Everything anyone believed was written in its ink.
> **Narrator:** Left alone, ink dries. But ink can't dry while someone is still asking about it.
> **Narrator:** So beside the Inkwell stood a question mark. When you wanted to believe something, you scooped up a ladle of ink, said it out loud, and the question mark asked you about it. Once you'd answered, it stopped asking. The ink dried. And you carried your new belief home, and fitted it into yourself.
> **Narrator:** That's what people were made of. A person was a stack of dried beliefs.
>
> *(A man steps up with a ladle.)*
> **Man:** I believe I'm the best cook in the village.
> **Question mark:** Why?
> **Man:** My mother says so.
> *(A pause. The ink dries. He slots the stick into his chest, beaming.)*
> **Narrator:** The question mark was not a strict examiner. It mostly wanted an answer, any answer, delivered with confidence.
>
> *(A woman with a ladle.)*
> **Woman:** I believe Tuesdays are lucky.
> **Question mark:** Why?
> **Woman:** I was born on one.
> *(Dries.)*
> **Narrator:** Most people were built this way. It explained a great deal.
>
> *(A newborn, held up to the Inkwell by its parents. A tiny ladle.)*
> **Baby:** *(gurgles)*
> **Question mark:** …Good enough.
> *(A very small stick dries: WARM. It's fitted gently into the baby.)*
>
> **Narrator:** Then one day, someone bumped the question mark.
> *(It tips, slowly, into the Inkwell. The surface closes over it.)*
> **Narrator:** Nobody saw who. Everyone agreed it was an accident.
> *(The ink churns. Five bubbles rise.)*
> **Narrator:** The question mark was gone. In its place were five. People called them YYYY SOWATT.

**[FIXED]** The "someone" who knocked the question mark in was the demon. The legend never says so; R3 reveals it.

**Notes [AI DRAFT]:**
- **The example beliefs are deliberately harmless** (cooking, lucky Tuesdays, a baby's "warm"). A nonsense answer to a religious belief would get a bigger laugh from some and hurt others in the room; keep the joke on the guardian's laziness, not on anyone's faith.
- **The guardian foreshadows the social route.** It's a lax audience that lets almost anything dry, like Star Isle in P1. YYYY SOWATT is the opposite extreme: an audience that never lets anything dry. Flexible foundationalism lives between the two.
- **The newborn shows the mechanism at its purest:** before you can doubt anything, you need something to stand on.

**Visual [AI DRAFT]:** the scroll opens on the Great Inkwell at the center of the world, faded ink with light color. Beside it stands a tall, elegant question mark like a carved monument. A line of people made of stacked ink sticks, each holding a ladle. Close-ups: a stick drying in a ladle, then being slotted into a chest like a book onto a shelf. The bump: just the edge of a dark sleeve at the frame's edge, and the question mark tipping. Five bubbles surfacing, faint threads above them trailing off the top of the scroll.

### L2 · The why-chain: from a hand to a brain in a vat [FIXED]

**[FIXED]** The next person in line states her belief, and this time YYYY SOWATT does the asking.

> *(The next person in line scoops up her ink.)*
> **Woman:** I have a hand.
> **Y:** Why believe you have a hand?
> **Woman:** I can see it. It's holding the ladle.
> **Y:** Why trust what you see?
> **Woman:** I'm wide awake, and my eyes work when I'm awake.
> **Y:** Why believe you're awake?
> **Woman:** Everything's sharp: the ladle, the Inkwell, the cold ink. Dreams are never this clear.
> **Y:** Why believe you're not a brain in a vat?
> **Woman:** Oh, come on.
> **SOWHAT:** So what? A brain in a vat would see a hand this clear, too.
>
> **Narrator:** Her words never dried. Then, slowly, neither did her hand.

**Notes [AI DRAFT]:**
- **Her hand is made of a belief.** Look closely and the stick that forms her hand is pressed with I HAVE A HAND. When the question won't stop, the belief goes wet, and so does the hand.
- **Each step is a fair question about the previous answer:** the hand → sight → being awake → clarity → the vat. SOWHAT doesn't ask for another reason; it denies that "it's so clear" supports "it's real," because the two possibilities can't be told apart from the inside (Unit 2.2).
- **"Oh, come on" is planted on purpose.** Here it fails. In P4, the same line from Cole becomes Greco's example of ordinary talk showing that someone treats a belief as a starting point.
- **The vat rhymes with the Long Dream:** the domes of ink over the sleepers in L10 and over the prisons in Part 2 should look like vats.

**Visual [AI DRAFT]:** a woman of stacked ink sticks at the Inkwell's edge, ladle in hand. The five bubbles pass the question down, each tail pointing at the next speaker. On the last line, the camera drifts up to show, very faintly, the outline of a glass vessel around the whole scene. Final frame: her hand glistening wet, ink running from her fingertips back into the pool.

**Paper and class:** the regress problem (Greco §1); the brain-in-a-vat argument (Units 2.1–2.2).

### L3 · The Whypocalypse [FIXED concept and name · AI DRAFT text]

**[FIXED]** With the guardian gone, YYYY SOWATT **breeds**. Every question it can't settle splits off another SOWATT. Because nothing dries, the ink keeps welling up out of the Great Inkwell and flooding outward; every puddle becomes a new inkwell with new SOWATTs in it, until there are inkwells everywhere. Nobody needs to go and scoop ink anymore: it's all around them. People still state beliefs and answer the questions, but no answer ever passes. And soaking in ink, their old dried beliefs soften too. People melt and shrink as their dry parts disappear. The crisis is called **The Whypocalypse**.

> **Narrator:** Then the five became ten.
> *(A Y bubble, mid-question, splits in two like a cell.)*
> **Narrator:** Every question that couldn't be settled split off another questioner. Nothing dried, so the ink kept coming. The Great Inkwell overflowed, and every puddle it left behind became an inkwell of its own, with its own five.
> **Narrator:** Nobody had to walk to the source anymore. The source walked to them.
>
> *(A man on his doorstep, ankle-deep in ink, a ladle in his hand. Bubbles rise around his feet.)*
> **Man:** I believe I'm a good father.
> **Y:** Why?
> **Man:** My children love me.
> **Y:** Why believe they love you?
> **Narrator:** Answers still came. They just never passed.
>
> **Narrator:** And anyone who stood in wet ink long enough began to soften. A man who had believed for forty years that he was tall woke up noticeably shorter. Babies couldn't finish forming a single opinion. Their parents, meanwhile, were losing theirs.
> **Narrator:** Whole cities, built on beliefs nobody had thought to question, slid quietly into the sea.
>
> *[Title card: black ink, gold edges, a choir hits one enormous chord:]*
> **THE WHYPOCALYPSE**
> *THE ENDLESS WHY*
>
> **Narrator:** Scholars still argue about who named it. They argue about everything. That's rather the problem.

**Visual [AI DRAFT]:** bubbles dividing like cells; the Great Inkwell overflowing; puddles across the map sprouting their own five bubbles; ink-stick people ankle-deep, slumping, shrinking, dripping; towns tilting into the sea. Then the title card: huge gold-edged lettering over the spreading stain.

### L4 · The Answerer Project: three great masters [FIXED concept · AI DRAFT designs and text]

**[FIXED]** Humanity unites and elects three famous masters to stop the crisis, in the spirit of the Wallfacers in *The Three-Body Problem*: celebrated, given everything, and completely useless. Each represents one answer to the regress. **Show all four options in the L4 chooser:** Skepticism, Infinitism, Coherentism, and Foundationalism. While any of the first three remain, Foundationalism slips away from the cursor when the pointer approaches. The audience picks the three available Answerers in any order. Once they have all been visited, Foundationalism stays still and the audience selects it as the fourth and final choice, leading to Descartes. Each master's scene stands on its own, so any order works, and the meter drops one step per master.

> **Narrator:** For the first time in its history, humanity united. It elected the three greatest minds alive and gave each of them unlimited ink, unlimited time and absolute authority.
> **Narrator:** Each was given one task: answer it.
> *[Title card:]* **THE ANSWERER PROJECT**

| | **Pyrrho, the Unmoved** | **Peirce, the Endless** | **Neurath, the Shipwright** |
| --- | --- | --- | --- |
| Answer to the regress | Skepticism | Infinitism | Coherentism |
| Real-world source | Pyrrho of Elis, founder of Pyrrhonian skepticism (Unit 1.1) | Charles Sanders Peirce, whose 1868 papers held that every cognition is determined by an earlier one, the earliest clear statement of infinitism. (Its leading modern defender, Peter Klein, can be credited by name on the slide; the story gives the comic lines to Peirce, a historical figure.) | Otto Neurath, whose famous image compares us to sailors who must rebuild their ship at sea, plank by plank |
| Look | A serene old man in a plain robe, eyes half-closed, holding an empty ladle he has never used | A nineteenth-century scholar whose beard is a scroll, still unrolling behind him across the floor and out the door | A sailor-scholar in a patched coat, standing on a ring-shaped raft of planks lashed to one another |
| Method | Never scoop, never answer, never believe | Answer every "why" with another reason, forever | Every plank supports its neighbors; no plank rests on anything |
| Signature line | "No more this than that." | "Excellent question. The reason is—" | "We rebuild the ship at sea, one plank at a time." |
| Art style | Sparse, pale, almost empty | A long, dense column of text and scroll | Warm wood tones on dark water |

**Pyrrho [AI DRAFT]:**
> **Y:** Why believe anything?
> **Pyrrho:** I don't.
> **Narrator:** Nothing of his ever got wet. Nothing of his ever got built.
> **Narrator:** His disciples had to follow him everywhere to keep him from walking into the sea. He did not believe it was there.

(The disciples are a real ancient anecdote about Pyrrho, exaggerated.)

**Peirce [AI DRAFT]:**
> **Y:** Why believe that?
> **Peirce:** Excellent question. The reason is— and the reason for *that* is— and the reason for *that*—
> **Narrator:** As far as anyone knows, he is still answering. He was last seen on the horizon, mid-sentence, scroll still wet.

**Neurath [AI DRAFT]:**
> **Neurath:** No single plank needs a foundation. Each one is held up by the others.
> *(YYYY SOWATT swims laps around the ring.)*
> **Narrator:** It was the most coherent raft in history. It held together perfectly as it drifted off the edge of the map.

(The joke is the isolation objection: a perfectly coherent web can still float free of the world.)

**Visual [AI DRAFT]:** three portraits in a row as the audience picks them, each introduced with a mock-heroic title card and a gold nameplate. Then each failure: Pyrrho calmly stepping toward the waterline while disciples grab his sleeves; a scroll unrolling over the hills to the horizon; a neat ring-raft drifting off the scroll's painted map.

**Quiz Q1 [AI DRAFT]:** see §7.

**Paper:** skepticism, infinitism, coherentism (§1).

### L5 · Descartes, the fourth master [FIXED concept · AI DRAFT text]

**[FIXED]** Descartes comes straight after the three masters, whatever order they were chosen in. He asks one question, and *I think, therefore I am* dries the ink permanently into a small stick. A foundation that is never doubted is never wet again. In the old mechanism, dried sticks become beliefs that build people's worlds; this is the first one that holds while SOWATT is asking. **[FIXED]** It seals nothing: one dry grain can't stop an ocean (§1.1c). **[FIXED] The twist:** he imagines the demon as a hypothetical to find his foundation, and the demon really exists. The legend only hints at it; R3 confirms it.

> **Narrator:** And then there was a fourth.
> **Narrator:** Nobody had elected him. He hadn't been listening. He was sitting by a stove, doubting things, which was what he did anyway.
> *(At the window the five voices bud a second chorus. Only the copy slips inside.)*
> **Descartes:** Suppose there were a demon, one that could fake everything I see. What would be left?
> **Narrator:** It was only a hypothetical. Descartes was very clear about that.
> **Y:** Why believe you're thinking?
> **Descartes:** Because you just made me doubt it. And doubting is thinking.
> **SOWHAT:** So what? Suppose even this room is a trick.
> **Descartes:** I think, therefore I am.
> *(The ink at one copied Y’s tip turns matte. The solid grain snaps off, falls, and lands in the ladle. The parent chorus is still wet.)*
> **Narrator:** It was the first belief in the history of the world that dried *while it was being asked about*.
> **Narrator:** It was the first thing that had ever worked. It was also, unfortunately, the only thing.
> *(Wide shot: one glowing grain, floating alone on an endless dark sea.)*
> *(Outside his window, unnoticed, a single string goes slack.)*

**Notes [AI DRAFT]:**
- **The fourth master nobody elected** is the same contrast as the overlooked Wallfacer who turns out to matter.
- Descartes wasn't really the first foundationalist (Aristotle had first principles; Unit 1.1 covers Agrippa). Since this is a legend, that's fine, but the presenter can say so in one line if asked.

**Visual [AI DRAFT]:** a seventeenth-century scholar in a small stove-warmed room, painted in scroll style the way court painters once painted visitors from the far west. Against the frost on his window, the faint outline of something enormous looking in. A grain-sized stick drying in his ladle with a faint glow. Then a wide shot: one glowing grain floating alone on an endless dark sea, YYYY SOWATT still circling it.

**Paper:** Cartesian foundationalism (§1); the demon from Units 2.1–2.2.

### L5b · Faster [FIXED concept · AI DRAFT text]

**[FIXED]** Even after Descartes, things get worse and worse, and people have to speed up. That pressure is what splits his followers.

> **Narrator:** One dry grain could not hold back an ocean. YYYY SOWATT kept asking.
> **Narrator:** And wet ink, it turned out, was patient. Sentence by sentence, it kept soaking upward. Towns that had survived the Whypocalypse started to lean.
> **Narrator:** There was no time to doubt everything carefully. There was no time not to.
> **Narrator:** So Descartes's followers did what scholars always do in an emergency. They split into two schools.

**Visual [AI DRAFT]:** the scroll's own paper buckling; a town on stilts tilting by degrees across three quick panels; scholars arguing over a shrinking map while the corner meter falls again.

### L6 · The two schools [FIXED concept · AI DRAFT designs and text]

Under that pressure, Descartes's followers split into two rival schools, each sure it knew how to dry the world again: one insisted on doing it *right*, the other on doing it *fast*. Each is one side of the foundationalist's dilemma. They're designed as rival martial-arts sects, each with a house identity like rival schools in a wizarding story: a crest, colors, a motto, a headquarters, an entrance test and a signature move. Their art styles are two opposite traditions of Chinese painting.

| | **无疑宗 · The Sect of No Doubt** (Cartesian) | **眼见为实派 · The Seeing-Is-Believing School** (moderate) |
| --- | --- | --- |
| Name | From the idiom 确信无疑, "certain beyond doubt" | From the idiom 眼见为实, "what the eye sees is real" |
| Motto | 一粒藏世界, "A whole world in one grain" (after the Buddhist saying 一粒米中藏世界) | 眼见为实, "Seeing is believing" |
| Rule | Stand only on what cannot be doubted | Stand on whatever you can see |
| Attitude to the emergency | "Better slow and certain." | "We don't have time to doubt everything." |
| Headquarters | The Grain: the *I think* stick, the only permanently dry point in the ocean, with the whole Sect stacked on top of it in one tall tower of disciples, each on one leg on the shoulders of the one below | The Thousand-Sail Palace: an armada of junks and dragon boats lashed together, every plank a stick of something someone saw, dried only about halfway, so the whole fleet is soft, soggy and squelches underfoot |
| Crest | A single brushed circle (ensō) around one black dot | A gold peacock-feather eye |
| Costume | Undyed white hemp, one black dot over the heart, topknots | Jewel-toned silk brocade embroidered with eyes, peacock feathers, gold trim |
| Entrance test | "Suppose there were a demon. Tell us what's left." Only "I think" passes. | "What do you see?" Everyone passes. |
| Signature move | 金鸡独立, the Golden Rooster stance: the whole Sect stands on one leg, stacked into a single tower, because one grain has room for exactly one foot | The Thousand-Eye Formation: a lookout on every mast |
| How it fails | True starting points, far too few: only one thing in the whole ocean is solid | Half-dry at best: soggy, squelching, muddy. No account of why seeing settles a doubt once it's raised |
| Art style | **Ink-wash (水墨):** grey washes, black accents, vast empty space, almost no color, total stillness | **Fine-line heavy color (工笔重彩):** dense and ornate; crimson, malachite, azurite, gold leaf; crowded and bustling |

> **Narrator:** After Descartes, his followers split into two schools.
> **Narrator:** The Sect of No Doubt stood only on what could not be doubted. There was exactly one such stick, *I think*, the size of a grain of rice. So the whole Sect stood on it: one disciple on the grain, the next on her shoulders, and so on up, every one of them on one leg.
> **Narrator:** They were certain of everything. They never got anywhere. It was a very small campus.
>
> **Narrator:** The Seeing-Is-Believing School stood on whatever they could see. Their fleet was the largest the ocean had ever known.
> **Narrator:** Its planks dried about halfway. The whole fleet went *squelch*.
> **Heckler** *(from a rowboat: white robe, one black dot)***:** Are you sure?
> **Narrator:** The flagship melted. Nobody could explain why "I can see it" should beat "Are you sure?" The next heckler sank the rest.
> **Narrator:** The School fought fourteen battles. All fourteen were the Battle of Are You Sure. The hecklers were always from the Sect of No Doubt. It was their only sport.

**Visual [AI DRAFT]:** the scroll switches style twice. First, sparse ink-wash: a tall, thin tower of white-robed disciples, each on one leg on the shoulders of the one below, balanced on a single glowing grain, an enormous empty sea around them. Then dense, gilded color: a golden armada under eye-embroidered banners, and a single rowboat with one white-robed heckler, cupping his hands.

**Live game: the Battle of Are You Sure [FIXED design · AI DRAFT details]**

**[FIXED]**
1. **No QR code.** When the presenter reaches this slide, every audience page switches over automatically (the canvas already keeps the presenter and audience pages in sync).
2. **Sorting.** Each audience screen asks for one belief plus the reason that holds it up: the audience tries to come up with a foundation, like *I think, therefore I am*. A language model reads it and sorts the person into the Sect of No Doubt (Cartesian) or the Seeing-Is-Believing School (moderate), according to how Cartesian or moderate the reasoning is, while keeping the two teams as close to 50/50 as it can.
3. **One shared screen.** After sorting, every screen, presenter and audience alike, shows the same split screen: the Sect on the left, the School on the right, with each side's ink sticks appearing live, so each team can see how the other is doing.
4. **A countdown of one to two minutes.** In that time, each player can either **build** (submit a belief and its reason; if the model accepts it under *their* school's standard, it becomes an ink stick on their side) or **attack** (aim a doubt at one of the other side's sticks).
5. **Asymmetric rules.** The Sect is **hard to build and hard to break**. The School is **easy to build and easy to break**.
6. **When the countdown ends, the side with more sticks wins.**

**[AI DRAFT] Details:**

- **The prompt:** *"The ocean is running out of time. Write one thing you believe, and why. Give us something to stand on."* Placeholder: *I believe ___ because ___.*
- **Sorting:** the model returns a lean score from 0 (moderate) to 1 (Cartesian) and a one-line welcome in the narrator's voice ("You said 'it couldn't be otherwise.' The Sect of No Doubt welcomes you. Please stand on one leg." / "You said 'I saw it.' The Seeing-Is-Believing School welcomes you. Mind the squelch."). Strong leans (below 0.3 or above 0.7) go where they lean; borderline answers go to whichever team is smaller. Each person's sorting sentence also counts as their first build attempt.

| | **Sect of No Doubt** (left) | **Seeing-Is-Believing School** (right) |
| --- | --- | --- |
| **Build** | Accepted only if no conceivable doubt survives, the demon test. A paraphrase of an existing stick doesn't count ("Already standing on that one."), so the tower stays tiny. "I have a hand" → *"A demon could fake that. Rejected."* "2 + 2 = 4" → *"A demon could make you miscalculate. Rejected."* "I am thinking right now" → *accepted* | Accepted if it rests on seeing or experience. "The projector is on; I can see it" → *accepted, a plank appears* |
| **Defense** (when attacked) | An attack succeeds only if it shows the claim could be false even for the person thinking it, which practically never happens: *"You doubted it. Doubting is thinking. Attack failed."* | An attack succeeds if it raises a doubt that seeing can't answer (an illusion, a dream, a misperception): "Maybe it's a reflection" → *the plank melts: squelch* |

- **The shared screen:** left, an ink-wash tower of tiny glowing grains; right, a gilded, sagging fleet of planks. Each stick is pressed with its sentence (anonymous, moderated). Team counts at the top, the countdown in the center, and the Dry World meter in the corner, still falling the whole time.
- **The audience device:** the same shared screen, plus a personal input bar at the bottom with two buttons: **Build**, and **Attack** (tap a target stick first). The verdict arrives as a private pop-up.
- **The presenter screen:** the same shared screen, no input bar, plus an **End battle** button.
- **Unclaimed sticks:** an answer that appeals to the situation instead ("nobody here is doubting that," "for what we're doing right now") fits neither school's rule. It becomes a small grey stick floating in the seam between the two halves. This sets up the ferryman.
- **Result, and why both lose anyway:**
  > **Narrator** *(if the Sect wins)***:** Congratulations to the Sect of No Doubt. Three sticks, all perfectly certain. You are exactly where you started.
  > **Narrator** *(if the School wins)***:** Congratulations to the Seeing-Is-Believing School. Nineteen sticks. Please don't ask whether they'll be there tomorrow.
  > **Narrator** *(either way)***:** The meter: 28%. Winning did not help.
  > *(The camera finds the grey stick drifting in the seam.)*
  > **Narrator:** One of you wrote something neither school would accept: "…" Remember it.
- **Safety and tech:** the model also screens out anything inappropriate ("The question mark refuses to look at that.") before it reaches the shared screen, and nothing is shown with a name. Tell the audience at the start that their sentences may appear on the big screen. One submission per person every five seconds or so; a fast model; a small backend on the canvas's existing Cloudflare worker, with a shared store for the sticks. If the model is unavailable, fall back to tap-to-choose sorting and simple keyword rules; the presenter can end the battle at any time.
- **Time:** about three to four minutes in all, including sorting and the result.

**Paper:** the foundationalist's dilemma (§1). Greco: very few beliefs meet the Cartesian standard; the moderate view lacks a clear explanation of why a stopping point can settle a doubt that's already in play.

### L7 · The ferryman: undoubted, not undoubtable [FIXED concept · AI DRAFT text]

> **Narrator:** A young ferryman had been rejected by both schools. At the Sect's entrance test, he was told to suppose there were a demon and say what was left. He said, "The boat I'm standing in?" At the School, his interview was scheduled for the day of the fourteenth battle.
> **Narrator:** So he watched. And he noticed something. Sticks never melted because they *could* be questioned. They melted when someone *nearby* was questioning them.
> **Narrator:** He rowed to a quiet cove where nobody was asking anything and set down a single stick. It stayed dry for a year.
> **Ferryman:** It doesn't have to be undoubtable. It only has to be undoubted. Here. Now.
> **Narrator:** And because "here" and "now" can mean different things, the one sea split into many, each with its own rule for whose questions count.
> **Narrator:** He would prove it to both schools at once, on open water, where everyone could watch.

**[FIXED]** He doesn't freeze anything forever. He finds ways to make ink set *here*, for now. It can loosen again later, but while it's set, it really holds.

**Why a ferryman? [AI DRAFT]**
- **He lives between shores.** A ferryman's whole job is crossing from one place to another, so he notices what neither school does: what counts as solid ground depends on *where you are*. The Sect wants one rock for the whole ocean; the School treats every raft the same everywhere. He knows better, because he sees a different shore every hour.
- **He stands on a boat, not on bedrock.** His footing has always been local and temporary, and it has always been good enough to get people across. Flexible foundations are a ferryman's common sense.
- **He listens to who's on board.** He notices that a stick goes wet only when a *passenger nearby* starts asking about it. That's the discovery.
- **In Chinese, 摆渡 carries a Buddhist echo:** ferrying people to the other shore (彼岸). He ferries the world toward a cure, and dies a stroke from the far bank.

**Link from the battle [AI DRAFT]:** the grey, unclaimed stick from the live game is still drifting in the seam when L7 opens. The camera follows it across the water to a small boat, where a young ferryman fishes it out.

**Visual [AI DRAFT]:** a third painting style, **blue-green landscape (青绿山水)**: calm mineral blues and greens, neither empty like the Sect nor crowded like the School. A young ferryman in a small boat in a still cove, one stick resting dry on a rock. Then a wide shot as the sea divides into many seas, each a slightly different color.

**Paper:** flexible foundationalism: a starting point can be open to doubt in principle and free from doubt in this inquiry (§1). The splitting seas are where the parallel universes come from.

### L8 · The three sacred weapons [FIXED concept · AI DRAFT names]

> **Narrator:** For those seas, he made three sacred weapons, three ways to keep a stretch of water quiet. He showed them to no one. He would reveal them at the demonstration, and explain them properly.

**[FIXED]** The weapons are revealed inside the universes in Part 2, not here.

| Weapon [AI DRAFT name] | Route | Paper | Revealed in |
| --- | --- | --- | --- |
| **The Conch** | Social norms (Annis) | §2.1 | P1 The Archipelago, used again in P2/P4 The Broadcast Sea |
| **The Anchor** | Hinges (Wittgenstein) | §2.2 | P3 The Fog Sea |
| **The Spyglass** | Knowledge at the base (E = K) | §2.3 | P5 The Glass Sea and Tide Pools |

A conch calls your community. An anchor holds one point fixed so the ship can swing around it, which is how a hinge works. A spyglass is for seeing, and what you see becomes evidence.

**Visual [AI DRAFT]:** three shapes wrapped in cloth in the bottom of the ferryman's boat. Only silhouettes: something spiral, something hooked, something long and tapered.

### L9 · The demonstration [FIXED: he dies halfway · AI DRAFT staging and twist]

**[FIXED]** The ferryman dies halfway through saving the world, right as he's about to prove his discovery, so the weapons are lost. **[AI DRAFT]** He dies by his own rule, in front of both schools.

> **Narrator:** He chose open water, halfway between the Sect's tower and the School's soggy fleet, so both could see. Everyone came: both schools, and every half-melted person who could still float. The three weapons lay under a cloth in the bottom of his boat.
> *(The ferryman steps out of his boat onto bare ink. A stick dries under his foot. The crowd gasps.)*
> **Ferryman:** It doesn't have to be undoubtable. It only has to be undoubted. It only melts when someone *here* is—
> **A voice** *(from somewhere in the crowd)***:** Are you sure?
> *(beat. The stick under his foot goes soft. He sinks to the waist, then the chest.)*
> **Narrator:** His theory had predicted exactly this. He did not get to enjoy being right.
> *(His daughter leans over the side of the boat and grabs his hand.)*
> **Ferryman:** The weapons… one is called… one holds still… one s—
> *(His hand slips from hers, catches the cloth over the weapons, and lifts one corner. FREEZE.)*
> **Narrator:** She wrote down everything he said. It took one line.
> **Narrator:** Everyone knew who to blame. Heckling was the Sect of No Doubt's only sport.
> **Narrator:** For once, the Sect swore it wasn't them.
> **Narrator:** Nobody asked who else had been listening.

- **[AI DRAFT] The twist:** everyone, including the audience, assumes a Sect heckler asked. The voice actually came from a dark sleeve at the back of the crowd: the demon. It killed him with the one thing his own theory said could do it, a serious question asked right here. Revealed in R3.
- **Why this works [AI DRAFT]:** the death proves his theory in the act of losing it. A stick melts when someone nearby is asking about it; the audience watches that happen to the man who discovered it.
- **The fragments are the weapons' clues:** "one is called" (Conch), "one holds still" (Anchor), "one s—" (Spyglass: one *sees*).

**Visual [AI DRAFT]:** open ink sea between the Sect's ink-wash tower of one-legged disciples and the School's gilded, sagging fleet; a crowd of half-melted people on scraps of raft; the ferryman's small blue-green boat at the center. A dark sleeve, barely visible, at the back of the crowd. Then **the freeze** (§2b): drops hanging mid-air, the ferryman sunk to the shoulders, his hand lifting one corner of the cloth over the weapons, color draining to grey except the bubbles and faint strings, the meter stopped at 29%.

### L10 · The Long Dream [FIXED tone · AI DRAFT text]

> *(Far above, unnoticed, the strings reach the water.)*
>
> **Narrator:** That night, everyone in the world fell asleep. Each of them woke somewhere that felt like home. None of them woke up.
>
> **Narrator** *(the voice of every anime narrator who has ever lived)***:** And so, as is tradition, the only person who understood everything died one scene before explaining it.
> **Narrator:** The three sacred weapons were scattered across the seas, waiting for the chosen ones who would one day find them.
> **Narrator:** *(beat)* Probably.
>
> *[Title card, brushed calligraphy, dramatic orchestral sting:]* **NEXT TIME: A Hermit Crab, a Streamer, and the Sea That Wasn't There!**

**Visual [AI DRAFT]:** still frozen; the meter reads **??** and blinks. The lantern red has drained to grey. Across the scroll, sleepers in every town; above each one, a faint dome of ink. Then the title card in a mock-anime layout: bold brush lettering and speed lines.

**Tone [FIXED]:** a straight-faced, sarcastic narrator mocking anime-opening clichés: the mentor who dies before explaining, the scattered sacred weapons, the chosen ones, the next-episode card.

---

## 5 · Part 2 · The Prisons (*Which version?*)

### 5.1 How the prisons work

- **[FIXED]** Since the ferryman's death, everyone has been asleep inside the demon's dreams. Each dream universe is one combination of a route and a version, chosen only from pairings the paper discusses.
- **[FIXED]** Each hero discovers something in their own universe, including the sacred weapons.
- **[FIXED]** The quizzes are actions that help a character see through their universe.
- **[AI DRAFT]** Each dream really runs on one version's rules. The demon's lie is that this is the only rule in the ocean. The prisons are partial, not false: Greco never rejects any of the four versions.
- **[AI DRAFT]** Why these four wake up: the ferryman hid his weapons in the seas he opened, and the demon built its dreams from those seas. The four who wake are exactly the four who find a weapon.
- **[AI DRAFT]** Each escape is a two-step quiz: (1) choose the action that exposes the crack, an objection or open problem from the paper; (2) name the two ingredients the world was built from. Naming them cracks the dome.
- **[AI DRAFT]** The dream walls are thin: voices and glimpses leak between universes through cracks.
- **[AI DRAFT] Visual tells:** a faint dome of ink overhead and one dark thread in a corner of every prison frame.

### 5.2 Which universes [AI DRAFT selection]

Scored out of 20: paper fidelity ×2, teaching value, story potential. Pairings the paper doesn't discuss score 0.

| Universe | Route × version | Character | Score | Decision |
| --- | --- | --- | --- | --- |
| P1 · The Archipelago | Social × sensitive invariantism | Simone | 20 | Keep |
| P2/P4 · The Broadcast Sea | Social × contextualism | Cole | 20 | Keep |
| P3 · The Fog Sea | Hinges × sensitive invariantism | Simone | 16 | Keep |
| P5 · The Glass Sea and Tide Pools | Knowledge × relativism / expressivism | Rae and Echo | 14 / 14 | Keep, merged |
| — | Knowledge × contextualism (footnote 16) | — | 13 | Save for Q&A |
| — | Belief × sensitivism about belief | — | 12 | One-line gag in P6 |
| — | Hinges × contextualism | Cole | 11 | One line in P4 |
| — | Knowledge × sensitive invariantism | — | 8 | Cut |
| — | Social, hinges × relativism, expressivism; belief × contextualism, relativism, expressivism | — | 0 | Not in the paper |

**Running order [AI DRAFT]:** P1 → P2 → P3 → P4 → P5 → P6. This follows the paper's order in §3: sensitive invariantism (social, then hinges), contextualism, the commitment view, the disagreement problem, then relativism and expressivism.

### P1 · The Archipelago · the Conch × sensitive invariantism · Simone [AI DRAFT]

**Paper:** §3: Annis's view as sensitive invariantism about foundations; the astrology objection (pp. 429–430).

**Rule of this world:** ink dries under your feet if *your own community* wouldn't challenge what you're standing on.

> **Narrator:** Simone had lived on Lantern Isle all her life. As far as she knew.
> *(Simone walks the tideline, checking her watch. She finds a conch half-buried in the sand, brushes it off, and blows it. The island answers with silence: nobody objects. Ink hardens under her feet, teal.)*
> **Simone:** Oh.
> **Narrator:** The first sacred weapon had been found. By someone who thought it was a shell.
> **Cole** *(a voice crackling down from the sky, from some other world)***:** Chat, is she okay? …Chat says she's fine 👍.
> *(The water doesn't change at all.)*
> **Simone** *(to the sky, politely)***:** Your chat isn't my community.
> **Narrator:** She had no idea who that was. It was still correct.
>
> *(Across the strait, on Star Isle, everyone takes for granted that the stars predict the tides.)*
> **Islander:** The stars say the tide is safe.
> *(Solid ink forms under him. He strolls out onto the flats.)*
> **Narrator:** By the rules of this world, he was perfectly justified. By the rules of the tide, he was underwater.

**The crack:** a whole community can take something for granted and still be wrong, but this world's rule says the islander is justified anyway. **Quiz Q2.** When Simone names the ingredients, the dome above Lantern Isle cracks like porcelain, and she drops through into the Fog Sea.

> **Narrator:** Escaping a dream, it turns out, mostly gets you another dream.

**Visual:** small islands as cut-paper silhouettes on deep teal water, amber windows, a lighthouse on Lantern Isle. Simone's footing in teal. Star Isle lit cold silver-violet, so it reads as a different community at a glance.

### P2 · The Broadcast Sea (part 1) · the Conch × contextualism · Cole [AI DRAFT]

**Paper:** §3: the contextualist version; the technical-term worry (pp. 430–431).

**Rule of this world:** ink doesn't dry under feet. It dries on *words*. Each sentence Cole speaks floats out as a ribbon, and whether it dries depends on **the community Cole is speaking to**.

> *(Night sea. Cole on a raft, ring light on, a conch rigged to his phone like a microphone.)*
> **Cole:** Chat. Chat. Look at this reef. That reef is *solid*.
> *(For his chill chat, the ribbon dries rust-colored. He flips to the pedant stream, @tidetablepurists.)*
> **Cole** *(snapping upright, anchor voice)***:** For the record: that reef is solid.
> *(Same sentence. The ribbon stays wet. The pedants demand a source.)*
> **Narrator:** Same sentence. Same reef. Two different claims. Cole found this deeply exciting and slightly unfair.
> **Cole:** Fine. Okay. "Simone's belief is foundationally justified."
> **Chat:** bro what does that even mean
> **Narrator:** Nobody talks like that. Not even philosophers, at parties.

**Visual:** a night sea, Cole on a small raft in his ring light, rust ribbons of ink drifting from his mouth, glowing paper slips of chat floating around him. Split framing for the two audiences: one ribbon dry, one dripping.

### P3 · The Fog Sea · the Anchor × sensitive invariantism · Simone [AI DRAFT]

**Paper:** §2.2 (the friend and the green light; the test cards) and §3 (the hinge version of sensitive invariantism, p. 430). Wittgenstein: the same proposition can be tested at one time and serve as a rule of testing at another.

**Rule of this world:** you can only work on one question at a time. When you ask one, planks dry under you: whatever you must hold fixed to ask it.

> *(Thick fog. Simone stands on nothing in particular. A lighthouse keeper sits on a buoy nearby.)*
> **Simone:** What color is the light on the far buoy?
> *(An anchor drops out of the fog and bites. Three planks dry under her: HE UNDERSTANDS ME. HE'S TELLING THE TRUTH. HE CAN TELL GREEN FROM RED.)*
> **Narrator:** The second sacred weapon. It arrived the way anchors do, from above and without asking.
> **Keeper:** Green.
> *(The answer dries on top of the planks. Simone studies him. A faint crease between her brows.)*
> **Simone:** Can you tell green from red?
> *(The plank HE CAN TELL GREEN FROM RED softens into wet ink. She deals out color cards. A new plank dries: THESE CARDS ARE THE COLORS PRINTED ON THEM.)*
> **Keeper:** If you ever wake up, follow the light.
> **Simone:** Wake up?
> **Keeper:** Nobody here ever does. I say it to everyone.

**The crack:** what's held fixed depends on *her* inquiry. A plank solid a moment ago is now the open question, so nothing here was ever fixed for the whole ocean. **Quiz Q3.** The keeper's line plants the finale's lighthouse.

**Visual:** pale grey-green fog; the keeper on a buoy is the only dark shape; teal planks with short pressed words; a fan of color cards in Simone's hand.

### P4 · The Broadcast Sea (part 2) · Cole, with glimpses of Echo, Rae and Star Isle [AI DRAFT]

**Paper:** §3: "It must be cold" and "Oh, come on"; the speaker-commitment view; the problem of disagreement (pp. 430–431).

> **Cole:** New plan, chat: ordinary talk. "It must be stormy out there."
> *(The ribbon dries, with a thread tied to the dark clouds: he inferred it.)*
> *(A crack opens in the dome. A coral claw reaches through and pinches Cole's ankle.)*
> **Cole:** Ow! That hurts!
> **Rae** *(through the crack, flat)***:** What makes you think that?
> **Cole:** Oh, come *on*.
> *(That ribbon dries instantly, no thread at all.)*
> **Narrator:** Some beliefs, Cole discovered, he simply refused to defend. Philosophers call this foundational. Cole called it obvious.
> *(Through another crack: Star Isle, an islander strolling onto the flats.)*
> **Cole:** Chat, they think that tide reading is solid. They're wrong.
> **Narrator:** On one version of this world, Cole wasn't describing the islanders. He was announcing where he stood.
> **Rae** *(across the water)***:** It's solid.
> **Cole:** It's not.
> *(Neither ribbon wobbles.)*
> **Cole:** …I'm starving.
> **Rae** *(holding a sandwich)***:** I'm not.
> **Narrator:** Those two didn't contradict each other. Then why did the first two feel like a fight?

[Optional one line, hinges × contextualism: Cole switches segments from "route planning" to "is this a trap?", and the same ribbon changes what it says.]

**The crack:** if each is only stating their own commitments, both can be right, and yet it feels like a real disagreement. **Quiz Q4.** The dome doesn't break. It splits toward Rae's world, carrying the question with it.

**Visual:** cracks in the dome through which other worlds are visible (a coral claw; Rae's navy cap; Star Isle in silver-violet). Rust ribbons, one tied to clouds by a thread, one with none.

### P5 · The Glass Sea and the Tide Pools · the Spyglass × relativism / expressivism · Rae and Echo [AI DRAFT]

**Paper:** §2.3 (E = K plus a flexible view about knowledge) and §3's closing: relativism and expressivism as responses to disagreement; on some views, relativism and expressivism about knowledge just are versions of them about foundations (pp. 429, 431). Greco leaves the choice open.

**Rules of these worlds:** in the **Glass Sea**, what you know is your foundation, and a patch looks dry or wet depending on *who's looking*; no viewer is privileged. In the **Tide Pools**, nothing visibly changes, and calling footing solid is something you *do*: you raise a claw.

> *(Through a crack, Simone stands on a patch she can see clearly.)*
> **Cole:** She *knows* it's there. It's her evidence.
> *(Rae raises a brass spyglass. Through it, from Cole's side, what Simone knows dries into blue sticks.)*
> **Narrator:** The third sacred weapon. Rae had been using it as a paperweight.
> *(Rae lowers the spyglass. On a sea of glass, the patch might be a reflection. To Rae's eye, it's wet.)*
> **Rae:** *(click)* Not valid.
> **Narrator:** This time they were judging the same claim. Each verdict was right from where its judge stood.
> *(In the Tide Pools, there is nothing to inspect. Echo regards the patch with half-lidded eyes. Then the claw goes up. Clack.)*
> **Narrator:** Echo didn't describe the patch. He voted for it.
> *(Punch against claw. Neither moves.)*

**The crack:** two equally live answers to one question, side by side, and the paper leaves the choice open. The lie that there's one rule for the whole ocean can't survive that. **Quiz Q5.**

**Visual:** split frame along one seam running through the disputed patch. Left: navy and blue mirror-flat sea, sharp reflections, Rae with spyglass and punch, blue sticks. Right: violet and coral shallows, soft and flat, no sticks at all, Echo's claw raised.

### P6 · The prisons shatter [AI DRAFT]

> *(All four domes crack at once. The heroes fall, each clutching their weapon: conch, anchor, spyglass, and a claw.)*
> **Narrator:** Three sacred weapons. The Conch: whatever your own people wouldn't question. The Anchor: whatever your question needs held still. The Spyglass: whatever you know.
> **Narrator:** There had been a fourth, the Mirror, on which every passing thought dried solid. The ferryman threw it overboard himself.

**Paper:** recap of the three routes (§2.1–2.3). The Mirror is the belief-at-the-base route (Harman plus Clarke), as a one-line gag.

**Visual:** four figures falling through shattering porcelain-like domes against a dark sky, each lit in their context color.

---

## 6 · Part 3 · The Real Ocean (*What does this explain?*)

### R1 · Waking, ages later [FIXED concept · AI DRAFT text]

> *(A drop of ink that has hung in mid-air for ages finally falls. Plink. The meter flickers from ?? to 0%.)*
> **Narrator:** Nobody knows how long they slept. Long enough that the ink had forgotten what it said.

They wake on the real ocean, together for the first time.

> **Cole:** Okay. Chat? …Chat's asleep. Everyone's asleep.
> **Simone:** We're not.
> **Rae:** *(looks at each of them in turn, says nothing)*
> **Echo:** *(clack)*

**Visual [AI DRAFT]:** the only scene so far where all four colors share a frame. A grey ocean in which every sentence ever written still floats wet and illegible. The Great Inkwell, still churning. The Sect's toppled tower lying across the water. Half-melted hulls of the Thousand-Sail Palace on the horizon.

### R2 · The daughter's note [AI DRAFT]

> *(A scrap floats past. One line, in a careful hand: "The weapons… one is called… one holds still… one s—")*
> **Simone** *(looking at the conch, then the anchor, then Rae's spyglass)***:** One sees.
> **Narrator:** It had taken several thousand years and four strangers to finish one sentence. By the standards of philosophy, this was fast.

### R3 · The demon [FIXED villain and twists · AI DRAFT text]

> *(The sky darkens. Strings descend. YYYY SOWATT rises, hanging from them like a marionette.)*
> **SOWHAT** *(in a voice that isn't its own)***:** Suppose there were a demon.
> *(beat)*
> **SOWHAT:** There was.
> **Narrator:** Descartes had been right. It is the most upsetting thing he ever got right.
> **SOWHAT:** Every world you just left was mine. Who do you think spilled the question mark? Who do you think asked him "Are you sure?"
> **Simone** *(looking at the five bubbles, then up the strings)***:** It was never the creature.
> **SOWHAT:** The creature is just how I look when I touch ink.
> **Narrator:** Ah.

Three reveals in one speech, all planted earlier:

| Reveal | Planted in |
| --- | --- |
| Descartes's hypothetical demon is real | L5: "Suppose there were a demon"; "It was only a hypothetical"; the shape at his window; the Sect's entrance test |
| The demon created YYYY SOWATT | L1: the dark sleeve at the tipped bottle; faint strings above SOWATT in every legend frame |
| The demon killed the ferryman | L9: the voice from a dark sleeve at the back of the crowd; "For once, the Sect swore it wasn't them"; the strings lowering during the freeze |

**Visual [AI DRAFT]:** the five bubbles lifted on taut strings from a sky of moving ink, their tails pointing down at the heroes. On "There was," the sky's ink briefly forms the same enormous outline that looked through Descartes's window.

### R4 · The stakes [FIXED: save the dreamers · AI DRAFT details]

> **SOWHAT:** They're all still dreaming. Every one of them. And every night, I ask them the same thing.
> **Y:** Why believe you're justified?
> **Narrator:** The doubt leaks down. Nothing under them can dry. They never wake.
> **Simone:** Then we wake them.
> **Cole:** How?
> **Simone** *(remembering the keeper)***:** Follow the light.

On the horizon stands the lighthouse, the one place the storm hasn't reached. It's dark.

### R5–R12 · The finale, following §4 of the paper [FIXED concept · AI DRAFT beats]

| ID | Story | Paper (§4) |
| --- | --- | --- |
| R5 · Grounds | The lighthouse gives one last flash before going dark: *north*. Taking for granted that it's honest and she read it clearly, the flash fixes which way Simone should go. A teal stick dries under her: NORTH. | Given Peter's honesty and Justine's hearing, what he said fixes what she should believe. |
| R6 · The attack | **Y:** Why believe it said north? **SOWHAT:** So what? Can you even tell whether you're justified? The stick softens. Simone sinks to her ankles. **Cole:** Uh. Simone. You're sinking. | The leak-down worry: doubt about your grounds carries over to the belief. That's why Greco wants Access. |
| R7 · Why it works | The distant light flickers: three flashes, two, none. **SOWHAT:** Maybe the keeper jokes. Maybe you miscounted. **Narrator:** If her grounds were whatever the light *really* flashed, the demon could hide it, and she'd have no way to tell what she should believe. | The supervenience base. If justification depended on hidden facts, a misleading forecast could mislead you about your own grounds. Peter jokes or mumbles. |
| R8 · The tempting retreat | **SOWHAT:** Then retreat into your own mind, like Descartes. The grain-sized *I think* stick, the only belief in history that never got wet, drifts up beside her. It has survived everything. **Simone:** That's very small. **Narrator:** It was. It always had been. | A global cognitive home, always-knowable facts big enough to fix all justification, is too much to ask. |
| R9 · The mobile home | Echo climbs out of his shell and into an empty one drifting past. *Clack.* **Simone:** Then I'll move too. She stops asking "What did the light really flash?" and asks "Given what I can know here, which way?" **Cole:** I recorded the flashes. Habit. The **Anchor** drops: hold fixed that the recording isn't edited. She blows the **Conch**: her friends answer with silence, no objection. Through the **Spyglass**, what she knows dries. | The mobile home: in each context, the facts that fix justification must be ones the subject is in a position to know. Justine falls back on Peter's email. |
| R10 · Split confidence | The recording is blurry. **Simone:** Probably north. Maybe north-east. A stick dries for *that*, pressed with both words. **Narrator:** She didn't know where the lighthouse was. She knew exactly how sure to be. | Footnote 36: she may only be justified in spreading her confidence, and Access holds if she can know how to spread it. |
| R11 · Access | **Rae:** What makes you think that? Simone tells her: the recording, the keeper, the coastline, her best guess. Rae looks for a long beat. *Click.* **Rae:** Valid. Simone steps forward. A stick dries ahead of her; the one behind melts. **Narrator:** Her ground didn't stay put. It came with her. Like Echo's. | Access holds context by context. A new doubt can move the home again. |
| R12 · Arrival | Step by step through the storm, Simone reaches the lighthouse and relights it. **Cole:** Chat, you are not going to believe— oh, right. | — |

### R13 · The dreamers wake [AI DRAFT]

> *(The beam sweeps out across the ocean and into every dome. In dream after dream, a sleeper sees one steady light, finds a stick that stays dry, then another, and steps out onto the real water.)*
> **Narrator:** The light didn't prove anything. It just gave everyone one thing they could check, right where they were.

**Meter:** races upward as the dreamers wake.

**Paper:** the same move, generalized: each person's grounds rest on facts they can know in their own context.

### R14 · Ending [OPEN: disarm or destroy · AI DRAFT uses disarm]

> **SOWHAT** *(the demon's voice, thinner)***:** You still can't prove you're awake. There is no ground. There never was. Your old world dried on "because my mother said so." I didn't drown it. I showed you it was water.
> **Simone:** You're right. There's no ground under the ocean.
> *(beat)*
> **Simone:** There's ground under me. You can take my truth. You can't take my footing.
> *(The strings go slack. YYYY SOWATT drops free. The four Ys drift off over the water. SOWHAT lands on Simone's shoulder and settles there.)*
> **Rae:** *(punches nothing in particular; for one frame, the corner of her mouth lifts)*
> **Echo:** *(clack)*
> **Cole:** Chat? …CHAT! You're awake!
>
> *[Title card, same mock-anime style as L10, beside the meter: DRY WORLD REMAINING 0% · PEOPLE STANDING 97%:]* **THE END.** *(beat)* **(Probably.)**
>
> *(Cut to black. Then: Giedt Hall, the present day, exactly as in S0.2. Professor Lin turns from the board and adjusts his dark sleeve. For a single frame, a thin thread of ink trails from the cuff.)*
> **Professor Lin:** So. Any questions?
> *(SOWHAT pops into the corner of the final slide.)*
> **SOWHAT:** So what?
> *[Slide:]* **Questions?**

**[FIXED concept · AI DRAFT staging]** This is the professor twist (§6b): a hint, never confirmed. "Any questions?" is both the real Q&A and the demon's favorite weapon.

**Why the ending stays honest [AI DRAFT]:**
- The demon isn't destroyed. It can still make beliefs false, and nobody can prove it away; Unit 2.2 already raises the worry that contextualism gives no reply to the skeptic. What it loses is its real weapon: it can no longer leave people unable to tell what they should believe.
- Waking never proves the ocean is real. Simone can't rule out one more dream. What she can do is tell what she's justified in believing. The last line says exactly that.
- Greco's paper never mentions the demon. Present it as the class's skeptic from Units 2.1–2.2 meeting Greco's tool. The bridge to the paper is §4's misleading forecast.

**Visual [AI DRAFT]:** dawn over the ink ocean; the lighthouse beam; people standing on the water in every direction on small sticks of every color; slack strings trailing into a clearing sky; SOWHAT small and content on Simone's shoulder.

---

## 6b · The final twist: is the demon the professor? [FIXED concept · AI DRAFT design]

**[FIXED]** At the very end, hint that the demon might be the Professor. Only a hint, never confirmed. Earlier scenes plant clues where useful.

**Why it works [AI DRAFT]:** in the real class, the person who first introduced this audience to the brain in a vat and the evil demon (Units 2.1–2.2) was the professor. The demon's whole method, asking "why?" until you can't answer, is a professor's job description. And SOWHAT's red dot was always a teacher's red pen.

**Clues [AI DRAFT]:**

| Where | Clue | Should anyone notice? |
| --- | --- | --- |
| S0.3 | Professor Lin asks, "What do you see there?", then tells the room they're all wrong | No: it's just class |
| L1 | The dark sleeve that bumps the guardian question mark is the same color and cuff as Professor Lin's jacket in S0 | Only on a second viewing |
| L2, R3 | SOWHAT's red dot: a teacher's red-pen margin note | Already part of the design |
| L5 | Descartes: "Suppose there were a demon…" in the same cadence Professor Lin uses for hypotheticals in S0.3 | No |
| L9 | The voice that asks "Are you sure?" comes from a dark sleeve at the back of the crowd | Only on a second viewing |
| R3 | The demon: "Every world you just left was mine." (The presentation's worlds were all built for his class.) | Laughs from people who catch it |
| Ending | See R14: the cut back to Giedt Hall | Yes: this is the payoff |

**Tone [AI DRAFT]:** a wink, not an accusation. Professor Lin is never shown doing anything villainous. Keep it affectionate, the kind of joke a professor enjoys being the target of.

## 7 · Quizzes [FIXED concept · AI DRAFT questions]

The confirmed classroom vote (B or 13) opens the presentation in S0.3. The story quizzes below begin with Q1 during the legend, after the OP.

| # | Scene | Step 1 · action (correct answer in italics) | Step 2 · ingredients |
| --- | --- | --- | --- |
| Q1 | L4 | Four masters answered the endless why. Which answer stops at a starting point? *Foundationalism.* | — |
| Q2 | P1 | The islander stands on dry ink as the tide comes in. What should Simone point out? (a) His community would object. (b) *A whole community can take something for granted and still be wrong.* (c) The stars are reliable on Star Isle. | The Conch + Simone's own situation (social norms × sensitive invariantism) |
| Q3 | P3 | The plank melted when Simone's question changed. What does that show? (a) The keeper lied. (b) *What's held fixed depends on her inquiry.* (c) Planks always melt eventually. | The Anchor + Simone's own situation (hinges × sensitive invariantism) |
| Q4 | P4 | "It's solid." / "It's not." If both are only stating their own commitments, what's the problem? (a) One of them is lying. (b) *They wouldn't really disagree, yet it feels like they do.* (c) Cole's chat decides who's right. | The Conch + the speaker's audience (social norms × contextualism) |
| Q5 | P5 | Rae punches; Echo raises his claw. Which describes the two answers? (a) *Relativism: truth depends on the assessor. Expressivism: calling it foundational is a commitment.* (b) Both say the claim is false. (c) Both say Cole is right. | The Spyglass + the assessor / the Spyglass + a commitment |
| Q6 | R9 | The light is unreadable. What should fix Simone's grounds now? *Facts she can know here: the recording, the keeper, the coastline, or her best guess.* | — |

---

## 8 · Open questions (AI defaults used in the drafts above)

| # | Question | AI default |
| --- | --- | --- |
| 1 | Demon destroyed or disarmed? | Disarmed |
| 2 | Simone in two universes, or merge the Anchor into the Archipelago? | Two universes |
| 3 | Weapon names | Conch, Anchor, Spyglass |
| 4 | The twist: SOWATT blamed, the demon guilty? | Yes |
| 5 | The ferryman's death | Killed by his own rule: mid-demonstration, someone asks "Are you sure?" and his footing melts |
| 6 | The death's punchline | "His theory had predicted exactly this. He did not get to enjoy being right." |
| 7 | The ferryman's daughter: one-line witness, or an ancestor of one of the cast? | One-line witness |
| 8 | Route slides on the canvas: fold into the universes, or keep a recap? | Fold in; P6 is the recap |
| 9 | The Mirror gag (belief at the base)? | One line in P6 |
| 10 | Does the UC Davis frame return? | Yes: R14 cuts back to Giedt Hall for the professor twist |
| 11 | Catchphrase wording: "Suppose there were a demon." / "There was." | As written |
| 12 | Three reveals in R3 at once, or spread one into the legend's freeze? | All three in R3 |
| 13b | Infinitism's master | Peirce (the founder). Klein credited factually on the slide, not given comic lines |
| 13c | Example beliefs at the guardian: harmless ones, or the "God exists" example? | Harmless ones (cooking, lucky Tuesdays, a baby's "warm") |
| 13d | The demon: villain, or a misunderstood truth-teller? | Villain, with the skeptic's best argument in R14 (§1.1c) |
| 14 | Sorting | A language model sorts by the reasoning in each person's sentence, balanced toward 50/50 [FIXED] |
| 15 | Battle length | 90 seconds (within the fixed range of one to two minutes) |
| 15b | If the model is unavailable on the day | Tap-to-choose sorting and keyword rules |
| 16 | Timing: Part 1 about 7 min, Part 2 about 10, Part 3 about 7, quizzes included. Fits 28 minutes? | Untested |
