# PHI 102 canvas · Story draft 5

**Living design document, updated November 22, 2026.** It's written scene by scene so that it can be read straight through, visualized, reviewed and revised.

**Title status.** The story has no title yet. Leave the story title blank until the author chooses one.

## How to read this document

| Tag | Meaning |
| --- | --- |
| **[FIXED]** | Confirmed by the author, or stated by the author as a requirement. Don't change it without asking. |
| **[YOUR IDEA · AI VERSION]** | The idea came from the author (proposed or asked for), but it isn't confirmed in this form. The AI wrote a provisional version for review. |
| **[AI DRAFT]** | The author never suggested this. The AI filled a gap. Not confirmed. Expect revisions. |
| **[OPEN]** | A decision still to make. The drafts use the default noted in §8. |

Tags can combine. **[FIXED concept · AI DRAFT text]** means the idea is confirmed and the wording is the AI's. **[YOUR IDEA · AI VERSION]** on a scene means the direction is the author's and the details are the AI's.

**Why things are the way they are:** §9 records the reasoning behind recent decisions: the author's questions, the checks against Greco's paper, the references used, and what was corrected.

## The guiding principle [FIXED]

**Every decision in this document follows this rule, including the story rework now in progress.**

- **Time is the hardest limit.** The whole presentation is 28 minutes, and that includes Q&A and everything else.
- **Keep only what's important:** what the audience needs to follow the story, and what carries Greco's main ideas.
- **Cut anything that isn't closely related, or that makes the audience do extra work to understand,** even if it's clever or accurate.
- **Concise and effective. Easy to understand. Intuitive.** Show rather than explain; one idea per scene; no new name, rule or term unless it pays off.

**The test for every element:** does the audience need it to follow the story, or does it carry a key point of the paper? If neither, cut it. When in doubt, cut.

**[AI DRAFT] Known pressure points under this rule:**
- The time table in §5.2 adds up to the full 28 minutes and leaves nothing for Q&A (open question 22).
- Part 1 is ~7 minutes. L0 (~30 sec) was offset by shortening L1.
- AI-drafted extras (side jokes, secondary names, optional lines) are the first things to cut.

## For the visualization agent

1. **Job:** draw each scene below for review. Label every image with its scene ID (for example `L6`) and its status. Mark images of **[AI DRAFT]** material as drafts.
2. **House style:** follow [slide-visual-style.md](slide-visual-style.md): cut-paper planes, one shadow plane per surface, fine paper grain, ink navy with pools of amber. Leave the lower part of the frame quiet for the dialogue box.
3. **Identity:** use the [Version C model sheets](character-references/version-c/) for faces, hair, costume and props only. Take expressions and body language from the [character bible](character-bible.md): *Cole performs, Simone notices, Rae assesses, Echo abides.*
4. **Recurring identifiers:** Simone: black loop ponytail, green jacket. Cole: rust jacket, phone, ring light, earbud wire. Rae: navy cap, ticket punch. Echo: one palm-sized hermit crab with a tall faceted violet shell and one oversized coral claw. YYYY SOWATT: five ink bubbles, each with exactly one pointed speech-bubble tail; the smallest has a red dot ([reference](character-references/quibble-a3-single-tail.png)).
5. **Context colors:** teal for Simone, rust for Cole, blue for Rae, violet and coral for Echo.
6. **Don't** put the names of films, games, studios, artists or specific artworks into image prompts. Describe painting traditions and visual qualities instead. Don't reproduce any existing character, logo or painting. Descartes appears as a generic seventeenth-century scholar in scroll style, not a copy of a known portrait.
7. **Avoid baked-in text** except where a scene asks for a short label (a title card, words pressed into an ink stick).
8. **Show the Dry World meter** (§2b) in the corner of every legend, prison and real-ocean frame, at the value given for that scene.
9. **[FIXED] Only NPCs are made of ink cubes.** Named characters (the three masters, Descartes, the keeper, the heroes) are drawn as ordinary people with expressive faces and drawn clothing. **NPCs (unnamed crowds and background people) are made of dried ink [new design from the author's design session, Nov 22]:** figures built entirely of small ink cubes, finest and densest at the head, growing gradually larger toward the feet, with no sudden jump in density, so the body reads as one coherent, seamless form. From across the room you see a person; up close you see the beliefs they're built from. When their beliefs go wet, they slump, drip and shrink. Simone, Cole, Rae and Echo keep their Version C designs.
10. **The three Answerers and Descartes** are stylized characters, not portraits: invent faces; don't copy any known painting or photograph.
12. **The regress dialogue in `src/slide-content.ts` is out of date.** Use L1–L5 of this document.
13. **Everything from Part 2 on is unconfirmed** (either [YOUR IDEA · AI VERSION] or [AI DRAFT]). Label those images as drafts.
14. **Evan has no model sheet yet.** Draw him as a small, courteous, living fountain pen with two small eyes on the clip **[AI DRAFT; a living ink brush is the alternative, §8]**.
15. **L8 is a pull-back reveal:** the legend's handscroll turns out to be a real scroll in an old keeper's lap on a beach at night. The art style changes there, from the scroll's painting styles to P1's cut-paper island.

## Quick reference

| | |
| --- | --- |
| **Heroes** | Simone (subject · sensitive invariantism), Cole (speaker · contextualism), Rae (assessor · relativism). |
| **The one nobody counted** | Echo, Simone's hermit crab (expressivism). Not a hero and never in the legend, but the one who matters at the end **[YOUR IDEA · AI VERSION]** |
| **Villain** | The Cartesian demon (no body: a dark ink sky with strings) |
| **The demon's creation** | YYYY SOWATT (four Y voices + SOWHAT), its manifestation in the world |
| **Allies** | Evan, a living pen anyone can write with: the third sacred weapon, who denies being one **[YOUR IDEA · AI VERSION]**; the Ferry and its town, Here; the old lighthouse keeper, who tells the legend (L8) |
| **Legend figures** | The guardian question mark; the three Answerers (Pyrrho, Peirce, Neurath); Descartes, the fourth; the Cartesians; the moderates; the unnamed stranger who found a better way (L7) |
| **Objects** | Ink sticks (foundations); the *I think* stick (grain-sized); the three sacred weapons (the Conch, the Anchor, and Evan) |
| **Places** | The Great Inkwell; the ink ocean; the dream domes; Here, the first town after the fall; the lighthouse |

---

## 1 · The world

### 1.1 Wet ink and dry ink [FIXED]

Everything in this world is written in ink. A sentence stays wet while anyone is asking about it. Left alone, it dries. **Dry means settled.** Dry ink is a foundation: you can stand on it, and you can use it to support further claims.

**[FIXED] The core mechanism, which the Legend must make clear at its very start (L0):**
1. **Everything is made of ink beliefs:** every person, and the world each person sees. Belief is concrete: it's ink.
2. **Belief has two forms.** Liquid (wet ink): a belief still in question; nothing can stand on it. Solid (dry ink): a belief that holds; you can build on top of it.
3. **To make a belief solid, it has to withstand questioning:** from the guardian question mark at the Great Inkwell, the source of all belief, and from anyone else who asks. If it withstands the questions, it solidifies.
4. **If someone questions it and you can't answer, or they can keep on asking, it never solidifies.**
5. **[FIXED] Dry ink can go wet again:** if someone questions a dry belief and you have no answer, it softens.

**[AI DRAFT] Precision on "withstand":** what dries the ink is that the asking *stops*, not that the answer is good. The guardian accepted nonsense, and the ink still dried. This keeps "undoubted, not undoubtable" (L7) and the astrology objection (P1) working. Reasoning in §9.5.

### 1.1b The Great Inkwell, the guardian question mark, and people made of beliefs [FIXED]

- At the source of the world is **the Great Inkwell**. Everyone's beliefs are written in its ink, and each person's beliefs build the world as they know it: their own reality.
- **People are literally made of their beliefs.** To form a belief, you scoop a ladle of wet ink from the Inkwell and say what you want to believe. A **guardian question mark** stands at the Inkwell like a safety check. It asks you about the belief. Once you've answered to its satisfaction, it stops asking, the ink dries into a stick, and you set that stick into your own body. A person is a stack of dried beliefs.
- **The guardian was not a strict examiner.** It accepted almost any answer, including nonsense. (This is the legend's dark joke, and it foreshadows the social route: a lax enough audience will let anything dry.)
- One day, someone knocks the guardian into the Inkwell. It's gone, and YYYY SOWATT grows in its place: a mutant question mark that never stops asking. Nobody's ink can dry, and people start to melt.

### 1.1c What a foundation is: a process, not a plug [FIXED]

- **A foundation is a process, not an object.** Founding means making ink dry, temporarily, right where you stand, so that it can hold up more. Nothing ever seals the Inkwell or stops YYYY SOWATT. Even Descartes's *I think* is just one grain that stays dry; it plugs nothing.
- **The world was always an ink ocean.** Underneath, it was never solid. The old dry world, where the guardian let beliefs dry on answers like "because my mother said so," was the real illusion. What's true is the ocean, and the only footing anyone has is local: dry ink under their own feet, in their own context. This is exactly what the ending shows: the world is still an ocean, and people live anyway.
- **The old world should feel absurd from the very first scene** (the guardian's lazy questions, the nonsense answers it accepts), so that the audience senses something was off before anyone says so.
- **[FIXED as a hint] Moral ambiguity:** like games that leave you arguing over who was right, the story hints that the demon might have had a point: it didn't drown a solid world, it revealed a wet one. **[AI DRAFT] Treatment:** the demon stays the antagonist (it still traps everyone in dreams), but in R11 it gets the skeptic's best argument, and Simone's answer agrees with half of it: there is no ground under the ocean; there is ground under her.

### 1.2 Ink sticks [FIXED]

A sentence that nobody is asking about dries into an **ink stick**: a solid bar of dried ink with the claim pressed into its face, like the embossed ink sticks used in calligraphy.

| Rule | What you see |
| --- | --- |
| Nobody is asking, so it dries | The wet sentence hardens into a stick |
| Questioned again, no answer | A stick softens back into wet ink |
| Undoubted, not undoubtable | A stick is solid, but any stick melts if you pour water on it |
| Foundations support other beliefs | You grind a stick into fresh ink to write new conclusions |
| Building on foundations | Sticks are solid enough to stand on and build with |

**[AI DRAFT]** On the ocean, a stick dries under your feet like a plank. A further belief floats just above the stick that supports it. A stick is tinted by whose context matters (teal, rust or blue). Echo has no sticks, only his claw: raising it is a commitment, not a claim, so nothing dries under it, and SOWATT has nothing to melt (§9.3).

### 1.3 YYYY SOWATT [FIXED]

A chorus of five ink bubbles born when a question mark spilled into the world's inkwell. Every line from the four Y voices starts with "Why." The Ys ask what supports a reason. SOWHAT, the smallest, with the red dot of a teacher's margin note, asks whether the reason supports the claim at all.

### 1.4 The Cartesian demon and YYYY SOWATT [FIXED]

- **[FIXED]** The Cartesian demon is the supervillain behind everything. Everyone in PHI 102 knows it from Units 2.1–2.2.
- **[FIXED]** **The demon created YYYY SOWATT.** SOWATT is its manifestation in the world, the form its doubt takes when it touches ink. The "someone" who spilled the question mark into the inkwell (L1) was the demon.
- **[FIXED]** **The twist:** Descartes imagined the demon as a hypothetical, a thought experiment to find a foundation. He was right. It actually exists.
- **[AI DRAFT]** The demon has no body. It's a dark sky of ink with thin strings hanging from it, and it speaks only through YYYY SOWATT. Faint strings rise from SOWATT from its very first frame; nobody mentions them until R3.
- **[AI DRAFT]** Its lie: "There is one rule for the whole ocean, and I can make it fail."
- **[AI DRAFT]** Its weapon is the one Greco worries about in §4: doubt about your own grounds that leaks down into doubt about the belief itself.
- **[AI DRAFT] Catchphrase:** "Suppose there were a demon." Descartes says it first, as a hypothetical (L5). In R2, the demon says it back, and answers it.

---

## 2 · The story at a glance

1. **[FIXED]** **Frame.** A student steps off the red Unitrans double-decker and takes a seat in Giedt Hall. Professor Lin opens with the B/13 quiz on contemporary contextualism, then introduces flexible foundationalism. The OP plays. As soon as it ends, the legend begins.
2. **[FIXED]** **Legend:** YYYY SOWATT is born and starts to wet the world like a virus, getting visibly worse with every chapter (§2b). People fight back: humanity elects three great masters, the Answerers, who appear in an order the audience chooses and are all useless; then Descartes, the fourth master nobody elected, right after. Descartes's *I think* is the first belief that stays dry while being asked about, but one dry grain can't hold back an ocean, and people have to hurry. Two schools try to dry the world again and fail. Then someone finds a better way, flexible foundationalism, and leaves three weapons to the world. Whether the Whypocalypse ever ended is left open.
3. **[FIXED structure · AI DRAFT content]** **The relay:** as in *The Matrix*, whoever wakes goes back in for the others. **[FIXED requirement]** The legend's last lines turn out to be told inside the first dream, where Simone, laughed at, says someone should find the weapons (L8). Simone breaks out of her dream first, spends years alone with only Echo, then builds a rebellion, the Ferry, and a small new town, Here, while searching for the third weapon. She enters Cole's dream; then the two of them, with Evan and Echo, enter Rae's. The order follows the argument of Greco's §3, and the disagreement problem happens between the protagonists.
4. **[FIXED concept · AI DRAFT content]** **The real ocean:** the three heroes, Evan and Echo, with the town behind them, confront the demon. Following §4 of the paper, they learn to stand without bedrock. Then the demon poses a moral question, and the audience votes on the ending.

---

## 2b · The urgency device: the Dry World meter [FIXED concept · AI DRAFT design]

**[FIXED]** From the moment YYYY SOWATT is born, the disaster keeps spreading and the audience must *see* it getting worse, chapter by chapter, until a cure is in sight. Right before the cure, everything freezes.

**[AI DRAFT]** Five layers, all tied to the same number:

1. **The meter.** A small inset map of the world in the corner of every legend slide, with a mock-anime HUD label: **DRY WORLD REMAINING: 100%**. Dark ink spreads across the inset as the number falls. The sarcastic narrator never mentions it.
2. **Day captions.** Each chapter opens with a caption counting days since the first question: *Day 1*, *Day 3*, *Day 30*… The whole legend happens fast, like a myth told in one breath.
3. **The scroll itself gets wetter.** Each chapter, the handscroll is a little more damaged: the edges buckle, colors bleed past their outlines, ink runs down from the top edge. By the demonstration, the painting is barely holding together.
4. **The dialogue box drips.** The narrator's text picks up a faint run under each letter, a little longer each chapter. (On the canvas: an SVG turbulence and displacement filter whose strength rises with the chapter.)
5. **Sound** (if the canvas plays audio): a slow drip at L2 that speeds up chapter by chapter, like a pulse. Silence when the meter turns to ?? (L7).

| Scene | Day caption | Meter | What the audience feels |
| --- | --- | --- | --- |
| L1 · Origin | Before the fall | 100% | A clean map; everyone whole |
| L2 · The hand | Day 1 | 99% | One dark spot at the Inkwell's edge |
| L3 · The Whypocalypse | Days 2–30 | 99% → 58% | The number falls *while they watch*; the stain races outward from the Inkwell |
| L4 · The three Answerers | Days 30–39 | 58% → 52% → 47% → 41% | One step down per master, in whatever order the audience picks them |
| L5 · Descartes | Day 40 | **41%, holds** | For one day the number stops falling, while everyone stares at the grain |
| L6 · The two schools | Days 41–90 | 41% → 46% → 28% | The moderates' jelly towns push it up; each "Are you sure?" knocks it down further |
| L7 · The hook | — | 28% → **??** | The number blinks and nobody says why: did the Whypocalypse end? |
| L8 · The beach | — | **100%** | Suspiciously perfect: the first clue that this world is a dream |

**Payoff in Part 2 [AI DRAFT].** Inside every dream dome, the meter reads **DRY WORLD REMAINING: 100%**. Too perfect: a clue that the world is fake. When a dome cracks, it glitches to **??**.

**Payoff in the real ocean [AI DRAFT].**
- **I1:** **DRY WORLD REMAINING: 0%**, and it **stays at 0%** for the rest of the story: the ocean is real. A second line appears: **PEOPLE STANDING: 1**.
- **I2:** as Here grows, PEOPLE STANDING climbs: 12 … 140 … 600.
- **P2, P3:** one more for Cole, one more for Rae. (Echo was never asleep.)
- **R12:** the final reading depends on the ending the audience votes for. You don't need a dry world; you need dry footing. Beside the final title card: **THE END. (Probably.)**

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

### L0 · The Law of Ink [FIXED requirement · YOUR IDEA · AI VERSION wording] · ~30 sec

**[FIXED requirement]** Before the Legend begins, explain the world's one core mechanism plainly: pure narration over **one image**. No demo scenes. Everything is made of ink beliefs; belief has two forms; ink dries only if it withstands questioning.

**Narration [YOUR IDEA · AI VERSION]:**

> **Narrator:** In this world, everything is made of belief: every person, and the whole world each of them sees. And belief is ink.
> **Narrator:** Ink has two forms. Wet ink is a belief still being questioned. Nothing can stand on it. Dry ink is a belief that holds. You can stand on it, and build more beliefs on top of it.
> **Narrator:** Ink dries only if it withstands questioning: from the question mark at the Great Inkwell, and from anyone else who asks. If you can't answer, or the questions never stop, it stays wet. And if someone questions a dry belief and you have no answer, it goes wet again.
> **Narrator** *(beat)***:** Fortunately, in those days, nobody ever asked twice. **[AI DRAFT: optional last line]**

**The one image [AI DRAFT]:** a single diagram painted on the scroll, read left to right.
- **Left:** a ladle of wet ink, dripping. Label: **WET · still questioned · can't stand on it.** A small loop arrow above it: **can't answer / questions never stop.**
- **Middle:** the guardian question mark, with two or three people beside it, all asking **"Why?"** An arrow to the right: **withstands the questions.**
- **Right:** a solid ink stick, a small figure standing on it and a second stick resting on top. Label: **DRY · holds · can build on it.**
- **Bottom:** a return arrow from dry back to wet: **questioned again, no answer.**
- **Behind it all, faint:** a person built of stacked ink sticks, and a little world of sticks around them, to show that everything is made of these.

Keep labels to those few words. The narration does the explaining; the image is what the audience remembers.

### L1 · The Great Inkwell and the guardian question mark [FIXED concept · YOUR IDEA · AI VERSION text, shortened] · ~30 sec

**Purpose [FIXED]:** introduce the Great Inkwell as the source of every belief; use the old guardian question mark to show how beliefs first dried; then the birth of YYYY SOWATT. L0 has already explained the mechanism, so L1 doesn't repeat it.

> **Narrator:** At the source of the world was the Great Inkwell. Every belief anyone ever held was scooped from it.
> **Narrator:** Beside it stood the guardian, a question mark. Bring it a ladle of ink and it asked you one question. Answer, and the ink dried into a stick you took home and fitted into yourself.
> *(A man holds up a ladle. A raven sits on his shoulder.)*
> **Man:** All ravens are black.
> **Question mark:** Why?
> **Man:** They're made of ink.
> *(The ink dries. He slots the stick into his chest, satisfied. The raven nods.)*
> **Narrator:** The guardian was not a strict examiner. Any answer would do.
> **Narrator:** Then one day, someone bumped it.
> *(It tips into the Inkwell and sinks. At the edge of the frame, a dark sleeve.)*
> *(The ink churns. Five bubbles rise.)*
> **Narrator:** The guardian was gone. In its place were five: YYYY SOWATT.

**[FIXED]** The "someone" who knocked the question mark in was the demon. The legend never says so; R2 reveals it.

**Notes [AI DRAFT]:**
- **One example only [FIXED: the author's choice].** "All ravens are black" is the famous example from lecture. The answer, "they're made of ink," is a wink at this story's world, and it explains nothing (by that logic, everything would be black), which is exactly why it shows how lax the guardian is.
- **"One question"** sets up the contrast with SOWATT, which never stops asking (L2).

**Visual [AI DRAFT]:** the Great Inkwell at the center of the world; beside it, a tall, elegant question mark like a carved monument; a line of people made of stacked ink sticks, holding ladles. The man slotting his stick into his chest like a book onto a shelf, the raven on his shoulder. The bump: only the edge of a dark sleeve. Five bubbles surfacing, faint threads above them.

**Story reader:** Page 6 covers the Great Inkwell and the black-raven exchange. Page 7 starts at “Then one day, someone bumped it” and pairs the birth of YYYY SOWATT with the wide Inkwell artwork. [Reader illustration](../public/generated/backgrounds/ink-ocean/L1-birth-wide-inkwell.webp)

### L2 · The why-chain: from a hand to a brain in a vat [FIXED concept · YOUR IDEA · AI VERSION text, shortened] · ~35 sec

**[FIXED]** The next person in line states her belief, and this time YYYY SOWATT does the asking. **[Author's request]** Use the classic brain-in-a-vat chain from class, and keep it short.

> *(The next woman in line scoops up her ink.)*
> **Woman:** I have a hand.
> **Y₁:** Why believe that?
> **Woman:** I can see it.
> **Y₂:** Why trust your eyes?
> **Woman:** They've never fooled me.
> **Y₃:** Why believe you're not dreaming?
> **Woman:** Dreams are never this clear.
> **Y₄:** Why believe you're not a brain in a vat? It would see this hand just as clearly.
> **Woman:** Oh, come on.
> **SOWHAT:** So what? If you can't rule out the vat, you don't know you have a hand.
>
> **Narrator:** Her words never dried. Then, slowly, neither did her hand.

**Notes:**
- **Four Ys, one SOWHAT.** Each Y asks once, climbing the classic skeptical ladder: the senses, the dream, the brain in a vat. SOWHAT ends it with the argument from Units 2.1–2.2: if you know you have a hand, you know you're not a brain in a vat; you can't know you're not; so you don't know you have a hand.
- **Her hand is made of a belief.** The stick that forms her hand is pressed with I HAVE A HAND. When the questions won't stop, the belief goes wet, and so does the hand.
- **"Oh, come on" is planted on purpose.** Here it fails. In P2, the same line from Cole becomes Greco's example of ordinary talk treating a belief as a starting point.

**Visual:** a woman built of ink at the Inkwell's edge, ladle in hand; the bubbles pass the question along, each tail pointing at the next speaker. On SOWHAT's line, the faint outline of a glass vat appears around the whole scene. Final frame: her hand glistening wet, ink running from her fingertips back into the pool.

**Paper and class:** the regress problem (Greco §1); the brain-in-a-vat argument (Units 2.1–2.2).

### L3 · The Whypocalypse [FIXED]

**[FIXED]** With the guardian gone, YYYY SOWATT **breeds**. Every question it can't settle splits off another SOWATT. Because nothing dries, the ink keeps welling up out of the Great Inkwell and flooding outward; every puddle becomes a new inkwell with new SOWATTs in it, until there are inkwells everywhere. Nobody needs to go and scoop ink anymore: it's all around them. People still state beliefs and answer the questions, but no answer ever passes. And soaking in ink, their old dried beliefs soften too. People melt and shrink as their dry parts disappear. The crisis is called **The Whypocalypse**.

> **Narrator:** Then the five became ten.
> *(A Y bubble, mid-question, splits in two like a cell.)*
> **Narrator:** Every question that couldn't be settled split off another questioner. Nothing dried, so the ink kept coming. The Great Inkwell overflowed, and every puddle it left behind became an inkwell of its own, with its own five.
> **Narrator:** Nobody had to walk to the source anymore. The source walked to them.
>
> *(The man with the raven, from L1, on his doorstep, ankle-deep in ink. Bubbles rise around his feet.)*
> **Man:** All ravens are black.
> **Y₁:** Why?
> **Man:** Every raven I've ever seen was black.
> **Y₂:** Why believe the ones you haven't seen are like the ones you have?
> **Man:** Because… they always have been.
> *(That answer doesn't settle it. Y₂ splits in two, like a cell.)*
> **Y₃:** Then does a white shoe prove it too? Everything that isn't black isn't a raven.
> **Man:** …What?
> *(Two more bubbles split. Then four.)*
> **Y₄:** Why "black"? Why not "black until tomorrow, then white"?
> **SOWHAT:** So what? A million black ravens can't prove it. One white raven would end it.
> *(Around his feet, a swarm of new SOWATTs, all asking at once. On his shoulder, the raven begins to run.)*
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

**Notes [YOUR IDEA · AI VERSION]:**
- **The same belief as L1, now asked properly.** The guardian let "all ravens are black" dry on a joke answer; SOWATT asks the real philosophical questions about the raven inference, and the dried belief goes wet again.
- **The four Ys and SOWHAT, one classic problem each:** Y₂ is Hume's problem of induction (why should the unseen resemble the seen?); Y₃ is Hempel's raven paradox (if "all ravens are black" means "everything non-black is a non-raven," a white shoe confirms it); Y₄ is Goodman's "grue" puzzle; SOWHAT is Popper's asymmetry (no number of confirmations proves a universal claim; one counterexample refutes it).
- **First cut if time is short:** Y₄. Grue is the least familiar to this audience.

**Visual:** bubbles dividing like cells; the Great Inkwell overflowing; puddles across the map sprouting their own five bubbles; ink-stick people ankle-deep, slumping, shrinking, dripping; towns tilting into the sea. Then the title card: huge gold-edged lettering over the spreading stain.

### L4 · Operation Because: three great masters [FIXED]

**[FIXED]** Humanity unites and elects three famous masters to stop the crisis, in the spirit of the Wallfacers in *The Three-Body Problem*: celebrated, given everything, and completely useless. Each represents one answer to the regress. **Show all four options in the L4 chooser:** Skepticism, Infinitism, Coherentism, and Foundationalism. While any of the first three remain, Foundationalism slips away from the cursor when the pointer approaches. The audience picks the three available Answerers in any order. Once they have all been visited, Foundationalism stays still and the audience selects it as the fourth and final choice, leading to Descartes. Each master's scene stands on its own, so any order works, and the meter drops one step per master.

> **Narrator:** For the first time in its history, humanity united. It elected the three greatest minds alive and gave each of them unlimited ink, unlimited time and absolute authority.
> **Narrator:** Each was given one task: answer it.
> *[Title card:]* **OPERATION BECAUSE**

| | **Pyrrho, the Unmoved** | **Peirce, the Endless** | **Neurath, the Shipwright** |
| --- | --- | --- | --- |
| Answer to the regress | Skepticism | Infinitism | Coherentism |
| Real-world source | Pyrrho of Elis, founder of Pyrrhonian skepticism (Unit 1.1) | Charles Sanders Peirce, whose 1868 papers held that every cognition is determined by an earlier one, the earliest clear statement of infinitism. (Its leading modern defender, Peter Klein, can be credited by name on the slide; the story gives the comic lines to Peirce, a historical figure.) | Otto Neurath, whose famous image compares us to sailors who must rebuild their ship at sea, plank by plank |
| Look | A serene old man in a plain robe, eyes half-closed, holding an empty ladle he has never used | A nineteenth-century scholar whose beard is a scroll, still unrolling behind him across the floor and out the door | A sailor-scholar in a patched coat, standing on a ring-shaped raft of planks lashed to one another |
| Method | Never scoop, never answer, never believe | Answer every "why" with another reason, forever | Every plank supports its neighbors; no plank rests on anything |
| Signature line | "No more this than that." | "Excellent question. The reason is—" | "We rebuild the ship at sea, one plank at a time." |
| Art style | Sparse, pale, almost empty | A long, dense column of text and scroll | Warm wood tones on dark water |

**The three scenes [YOUR IDEA · AI VERSION, refined against the course slides]:** each opens with a one-line definition card in the course's own terms, shows the view answering YYYY SOWATT, and fails on its classic objection.

**Pyrrho · Skepticism**

*[Definition card:]* **SKEPTICISM.** None of our beliefs is justified, so suspend judgment on everything. *(Unit 1.1)*

> **Y:** Why believe anything?
> **Pyrrho:** I don't. No more this than that.
> *(SOWATT waits. There is nothing to ask about.)*
> **Narrator:** Nothing of his ever got wet. Nothing of his ever got built.
> **Narrator:** His disciples had to follow him everywhere to keep him from walking into the sea. He had suspended judgment on whether it was there.

*The objection:* you can't live by it; acting at all takes believing something. (The disciples are a real ancient anecdote about Pyrrho, exaggerated.)

**Peirce · Infinitism**

*[Definition card:]* **INFINITISM.** The chain of reasons never stops: B1 rests on B2, B2 on B3, and so on, forever. *(Agrippa's mode of infinite regress, Unit 1.1)*

> **Y:** Why believe that?
> **Peirce:** Excellent question. The reason is B2.
> **Y:** Why B2?
> **Peirce:** B3. And for B3, B4. And for B4—
> *(His scroll unrolls past the edge of the frame.)*
> **Narrator:** As far as anyone knows, he is still answering. He was last seen on the horizon, mid-sentence, scroll still wet.

*The objection:* at any finite time, the justification is still unfinished (Unit 1.1). Nothing ever dries.

**Neurath · Coherentism**

*[Definition card:]* **COHERENTISM.** A belief is justified if it belongs to a coherent system of beliefs: a web, not an edifice. *(Agrippa's mode of circularity, Unit 1.2)*

> **Y:** Why believe the ship is sound?
> **Neurath:** Because every plank holds.
> **Y:** Why believe every plank holds?
> **Neurath:** Because the ship is sound.
> **Y:** That's a circle.
> **Neurath:** It's a web. No belief stands alone; each is held up by all the others. The bigger the circle, the better.
> *(SOWATT swims laps around the ship, looking for a loose end. There isn't one.)*
> **SOWHAT:** So what? A fairy tale can fit together perfectly too.
> **Narrator:** It was the most coherent ship in history. Not one plank contradicted another. It sailed, perfectly consistent, off the edge of the map.

*The objection:* the isolation problem. A perfectly coherent system can be cut off from experience, so coherence alone isn't enough (Unit 1.2).

**Visual:** three portraits in a row as the audience picks them, each introduced with a mock-heroic title card and a gold nameplate. Then each failure: Pyrrho calmly stepping toward the waterline while disciples grab his sleeves; a scroll unrolling over the hills to the horizon; a neat ring-raft drifting off the scroll's painted map.

**Paper:** skepticism, infinitism, coherentism (§1).

### L5 · Descartes, the fourth master [FIXED]

**[FIXED]** Descartes comes straight after the three masters, whatever order they were chosen in. He asks one question, and *I think, therefore I am* dries the ink permanently into a small stick. A foundation that is never doubted is never wet again. In the old mechanism, dried sticks become beliefs that build people's worlds; this is the first one that holds while SOWATT is asking. **[FIXED]** It seals nothing: one dry grain can't stop an ocean (§1.1c). **[FIXED] The twist:** he imagines the demon as a hypothetical to find his foundation, and the demon really exists. The legend only hints at it; R2 confirms it.

> **Narrator:** And then there was a fourth. Nobody had elected him. He was shut alone in a stove-heated room, doubting everything, for fun.
> *[Nameplate:]* **RENÉ DESCARTES · NOT ELECTED**
> **Descartes:** Suppose there were a demon, faking everything I see. What would be left?
> **Narrator:** It was only a hypothetical. He was very clear about that.
> **Y:** Why believe you're thinking?
> **Descartes:** You just made me doubt it. Doubting is thinking.
> **SOWHAT:** So what? Your demon could be faking that too.
> **Descartes:** Then let it fool me. To be fooled, I have to exist. I think, therefore I am.
> *(In his ladle, one grain of ink turns matte. SOWATT keeps asking. It stays dry.)*
> **Narrator:** The first belief in history that stayed dry while being asked about.
> **Narrator** *(over a wide shot: one glowing grain, alone on an endless dark sea)***:** It was the size of a grain of rice. It could hold up exactly one person.

**Notes:**
- **[YOUR IDEA · AI VERSION] Shortened, with real history:** Descartes really did his doubting "shut up alone in a stove-heated room" (*Discourse on Method*, Part 2); the demon is his own thought experiment (*Meditations*, I); "to be fooled, I have to exist" is his own answer to the demon: however much it deceives him, it can never make him nothing while he thinks he is something (*Meditations*, II). "It could hold up exactly one person" sets up L6, where all the Cartesians' effort yields one brick.
- **Optional dark-humor tag, if time allows:** "Years later, a queen made him get up at five every morning to teach her philosophy. It killed him." (Queen Christina of Sweden, 1650; he died of pneumonia that winter.)
- **The fourth master nobody elected** is the same contrast as the overlooked Wallfacer who turns out to matter.
- Descartes wasn't really the first foundationalist (Aristotle had first principles; Unit 1.1 covers Agrippa). Since this is a legend, that's fine, but the presenter can say so in one line if asked.

**Visual:** a seventeenth-century scholar in a small stove-warmed room, painted in scroll style the way court painters once painted visitors from the far west. Against the frost on his window, the faint outline of something enormous looking in. A grain-sized stick drying in his ladle with a faint glow. Then a wide shot: one glowing grain floating alone on an endless dark sea, YYYY SOWATT still circling it.

**Paper:** Cartesian foundationalism (§1); the demon from Units 2.1–2.2.

### L6 · The two schools: Cartesian and moderate foundationalism [FIXED concept · YOUR IDEA · AI VERSION text] · ~40 sec

**[FIXED]** Descartes's grain is the first method that ever worked. The goal now is to dry the world solid again: everything in the old world was built of solid ink. Two schools try, and both fail, one on each horn of the foundationalist's dilemma (Greco §1). No custom school names: just Cartesian and moderate foundationalism.

| | **Cartesian foundationalism** | **Moderate foundationalism** |
| --- | --- | --- |
| Rule | Dry only what cannot be doubted | Dry whatever seems true |
| Result | After enormous effort, one brick | Whole towns, all of them jelly |
| Why it fails | Far too few foundations to build anything on | Half-dry at best: nothing settles a doubt once it's asked |
| Art style | Ink-wash (水墨): sparse, grey, still | Fine-line heavy color (工笔重彩): crowded, gilded |

> **Narrator:** For the first time since the Whypocalypse, people had a way to fight back. The goal: dry the world solid again, the way it used to be.
> **Narrator:** They split into two schools.

**Page 1 · Cartesian foundationalism**

> **Narrator:** The Cartesians would dry only what could not be doubted. Ten thousand of them worked on it, day and night, for three hundred years.
> *(A vast crowd, sweating, ladles raised over a single spot. Y bubbles everywhere. Something small hardens.)*
> **Narrator:** All their efforts combined produced one brick.
> *(A single perfect brick of dry ink, on a velvet cushion. Polite applause.)*
> **Narrator:** It was a very good brick. Nothing anyone asked could get it wet. They are still deciding what to build.

**Page 2 · Moderate foundationalism**

> **Narrator:** The moderates didn't have three hundred years. They dried whatever seemed true, and they dried it fast.
> *(A whole town goes up in an afternoon.)*
> **Narrator:** But their ink only ever dried halfway. Everything they built was jelly.
> *(A man steps onto his new floor. It jiggles. His house sways like a pudding.)*
> **Y:** Are you sure that's solid?
> *(The town slumps into a puddle.)*
> **Narrator:** You can't build a city on jelly. They tried. Several times.

**Notes [AI DRAFT]:**
- **The brick is the parody contrast:** ten thousand people, three hundred years, one brick. It also scales up from Descartes's grain of rice in L5: certainty is real, and pitifully small.
- **Jelly** is the moderate view's problem in one picture: its foundations are neither wet nor dry, so they hold until someone asks, and then nothing can be built on them.

**Visual:** the scroll switches style twice. First, sparse ink-wash: an enormous crowd around one tiny spot, then the single brick on its cushion in a vast empty sea. Then dense, gilded color: a bustling jelly town wobbling under bright banners, swaying, then slumping into a glossy puddle.

**Paper:** the foundationalist's dilemma (§1). Greco: very few beliefs meet the Cartesian standard; the moderate view lacks a clear explanation of why a stopping point can settle a doubt that's already in play.

### L7 · The hook: a better way, and three weapons [FIXED concept · YOUR IDEA · AI VERSION text] · ~20 sec

**[FIXED]** Right after the two schools, a short hook: someone found a way that works better than either school, and left three weapons to the world. No heroes are mentioned. Whether the Whypocalypse ever ended is left open, so the audience can start to wonder whether the world they're about to see is real.

> **Narrator:** Then someone found a better way.
> *(A lone figure, seen from behind, steps out onto bare ink. A stick dries under their foot.)*
> **Stranger:** It doesn't have to be undoubtable. It only has to be undoubted. Here. Now.
> **Narrator:** Not one solid world. Solid ground wherever you stood, for as long as nobody there was asking.
> **Narrator:** He left three weapons to the world.
> *(Three shapes under a cloth: something spiral, something hooked, and a flat, empty space.)*
> **Narrator:** Then he was gone.
> **Narrator:** Did the Whypocalypse ever end? *(beat)* Probably.

**Notes [AI DRAFT]:**
- **The one idea the audience must leave with:** flexible foundationalism. A foundation doesn't have to be undoubtable, only undoubted, and only here and now (Greco's core claim). Everything in Part 2 builds on this line.
- **The open question** ("Did the Whypocalypse ever end?") makes the beach in L8 look suspiciously perfect, so the audience can start doubting the narrator's world before anyone says it's a dream.
- **The three weapons,** revealed in Part 2: the Conch (social norms, Annis, §2.1), the Anchor (hinges, Wittgenstein, §2.2), and Evan (knowledge at the base, E = K, §2.3). Each answers to anyone, but differently in different hands (§9.2).

**Visual:** blue-green landscape (青绿山水): calm mineral blues and greens. A lone figure seen only from behind, one stick dry under their foot. Then the cloth with its three shapes, and nobody beside it. The corner meter blinks **??**.

### L8 · The scroll pulls back: the legend was told inside a dream [FIXED concept · YOUR IDEA · AI VERSION script]

**[FIXED requirement]** Everything before the dream era is one legend: an exaggerated tribute to and parody of classic anime and films. The legend turns out to be told *inside the first dream world*. Nobody there knows they're dreaming; to them it's only an old story. It ends on the three weapons waiting for the heroes to find them. Someone in the crowd says they'll be the hero, everyone laughs, and that person really is the first hero.

**[YOUR IDEA · AI VERSION] Script.** Picks up straight from L7.

> *(The narrator's voice swells, and gets audibly older and croakier.)*
> **Storyteller** *(wind rising from nowhere, ink petals swirling, lightning exactly on cue)***:** And so the three sacred weapons were lost across the seas… *(thunder)* …waiting for someone… to find them… and SAVE THE WORLD!
> *(A child in the front row gasps.)*
> **Storyteller:** Each weapon would answer to anyone. But it would answer *differently*, depending on whose hand it was in.
> *(beat)*
> **Storyteller:** Probably.
>
> *(The camera pulls back. The last scene was a painting on a long handscroll. The scroll is in the lap of an old lighthouse keeper on a beach at night, by a lantern. Villagers sit around him on the sand. Fog behind them. Corner meter: DRY WORLD REMAINING 100%.)*
> **Child:** Is it true?
> **Keeper:** It's a legend.
> **Child:** Did it ever end?
> **Villager** *(laughing, waving at the dry, lantern-lit island)***:** Of course it ended. Look around.
> *(Nervous laughter. The keeper rolls up the scroll. Its ink is still wet. Nobody notices.)*
> **Simone** *(from the back, calmly)***:** Then someone should go and find them.
> *(A pause. The whole beach laughs. In a tide pool at her feet, a small hermit crab raises one oversized claw. Clack.)*
> **Keeper** *(not unkindly)***:** Everyone says that. Nobody does. Goodnight.
> *(The crowd drifts off. Simone stays, looking at the dark water. Beside the tide pool, half-buried in the sand: a conch.)*
>
> *[Title card, full mock anime: speed lines, brush lettering, dramatic sting:]* **EPISODE ONE: THE GIRL WHO WENT LOOKING**

**Notes:**
- **[AI DRAFT] Who makes the claim:** Simone, deadpan rather than boastful (default; alternatives in §8). She is the first hero, so the rule "the one laughed at is the first hero" holds.
- **[AI DRAFT] Clues hidden in plain sight:** the too-perfect 100% meter, still-wet ink on an old scroll, and Echo, the only one on the beach who doesn't laugh.
- **[AI DRAFT] The keeper** tells the legend, and in P1 he tells Simone, "If you ever wake up, follow the light." He half-remembers that the legend is true.
- **[AI DRAFT] "Answers differently":** replaces "only the chosen one can wield it," which would misstate the paper (§9.2).
- **Visual [AI DRAFT]:** the pull-back is also the style shift, from the handscroll's painting styles into P1's cut-paper island. The scroll in the keeper's lap is the same scroll the audience has been watching.

---

## 5 · Part 2 · The relay (*Which version?*) [FIXED structure · AI DRAFT scenes]

### 5.1 Notes for the dream era [FIXED: the author's requirements]

These are the requirements every draft of Parts 2 and 3 must meet.

1. **Parts 2 and 3 are the core of the presentation.** Everything before them is introduction. Once the audience understands the mechanism, the time goes to (a) flexible foundationalism under the different versions and (b) the application to access internalism.
2. **Part 2 is a relay rescue, like *The Matrix*.** Whoever wakes up goes back in for the next person.
3. **The order, timeline and disagreement follow the paper wherever it matters.** The disagreement problem happens inside the story, as it does in Greco's §3.
4. **A huge time gap.** After Simone wakes, years pass before she reaches the next person. She builds a rebellion and a small new civilization while searching for the remaining sacred weapon. Time runs differently inside the dreams, so the dream worlds come from different eras (Simone's is ancient; Cole's is modern, with streaming).
5. **The third route is different.** In §2.3 Greco says you can become a flexible foundationalist "without trying." Knowledge itself is dried ink: what Evan writes down from what he has seen dries by itself.
6. **The finale applies the Access section,** then turns into a moral confrontation with the demon, and the audience votes on the ending.
7. **Be selective.** Reference the paper's important points; leave out trivial details (the professor has said we don't need every detail). Take liberties where they make the story or the philosophical question better.
8. **The legend's last scene is told inside the first dream** (L8), and the person laughed at for saying they'll find the weapons is the first hero.

**The author's proposals now in the drafts [YOUR IDEA · AI VERSION]** (direction from the author, details not yet confirmed; reasoning in §9):

- **Echo is Simone's pet, not a hero.** The legend never mentions him, but the expressivist still exists, and the creature nobody counted turns out to matter (§9.3).
- **Evan is himself the third weapon:** a strange living pen. Others write their beliefs with him, and what dries can't be argued away by outsiders, but it can go wet again when the writer doubts it. Checked against §2.3 and adjusted where the paper differs (§9.4).
- **The horcrux nod:** the third weapon may be a piece of the stranger who left the weapons. Used only for Evan, and only as a hint (§9.2).

### 5.2 Time budget and what to leave out [AI DRAFT]

| Part | Minutes |
| --- | --- |
| Part 0 · Frame and OP | ~2.5 |
| Part 1 · Legend | ~7 |
| **Part 2 · The relay** | **~10.5** |
| **Part 3 · Access and the finale** | **~6.5** |
| Vote, ending, coda | ~1.5 |

**Keep from the paper:** sensitive invariantism via Annis and via hinges; the astrology objection; contextualism (the speaker's community fixes the claim; the technical-term worry; "Oh, come on"; the commitment view; the disagreement problem); relativism and expressivism as two answers, left open; E = K, "without trying," footnote 16; Access, the leak-down worry, the supervenience base and the forecast, the global cognitive home, the mobile home, Peter and Justine, split confidence.

**Leave out:** Wright's "entitlement"; the quantifier and Rorty footnotes; secondary authors' names; hinges × contextualism (one line at most); knowledge × sensitive invariantism; belief at the base (Harman, at most a one-line gag); Conee & Feldman, anti-luminosity, the restricted version of Access.

### 5.3 The relay at a glance [FIXED structure · AI DRAFT details]

Greco's §3 is already a relay: each version runs into a problem, and the next version is brought in to fix it. So each person who wakes carries their world's problem into the next world.

| Step | Who | World (version × routes) | The crack (Greco's objection) | Carried forward |
| --- | --- | --- | --- | --- |
| P1 | Simone, alone | Sensitive invariantism × social + hinges; an ancient island | A whole community can be wrong (astrology) | "My world's rule can't call a community wrong" |
| I1–I3 | Simone, then the Ferry | The real ocean, twelve years | — | A town, an audience, and the third weapon |
| P2 | Simone enters Cole's dream | Contextualism × social; modern streaming | The commitment view fixes the astrology problem, but creates the **disagreement problem**, played between Simone and Cole | "We both feel right, and we can't both just be reporting ourselves" |
| P3 | Simone, Cole, Evan and Echo enter Rae's dream | Knowledge × relativism (Rae), with expressivism beside it (Echo) | Two answers to the disagreement, side by side; Greco declines to choose | — |
| Part 3 | The three heroes, Evan and Echo, with the town behind them | The real ocean | — | The finale |

**How rescues work [AI DRAFT]:**
- Every sleeper lies inside a dome of ink. Whoever is awake touches a dome and falls in.
- Nobody can simply be told. The rescuer has to help the dreamer find the crack themselves, and that's the quiz: the audience coaches the rescuer.
- Dream walls are thin. Voices can leak through from a neighboring dome.

**Echo [YOUR IDEA · AI VERSION]:** Simone's hermit crab was never asleep, because nothing in him was ever a belief. He is with her in every world: beside her on the beach in L8, alone with her in the real ocean, on her shoulder in Cole's and Rae's dreams.

**Time and eras [YOUR IDEA: the gap and the eras · AI DRAFT: the time rule]:** time runs fast inside the dreams and slow outside. While twelve years pass in the real ocean, centuries pass inside Cole's dome, which is why his world has livestreams and Simone's has lanterns. The longer someone dreams, the more it feels like home, so later rescues are harder.

**Simone's age [AI DRAFT rule]:** people are made of beliefs, so they change only when their beliefs do. Her core beliefs stayed dry, so she barely aged, and her character design stays fixed.

**Visual tells [AI DRAFT]:** a faint dome of ink overhead and one dark thread in a corner of every dream frame; inside every dream, the meter reads a suspiciously perfect 100%.

### P1 · The Lantern in the Fog · Simone · sensitive invariantism × social + hinges [AI DRAFT · opening follows L8] · ~2.5 min

**Paper:** §3: Annis's view as sensitive invariantism about foundations; the hinge version; the astrology objection (pp. 429–430). §2.2 for the hinge example.

**Rule of this world:** whether ink dries under your feet depends on *your own* situation: what your own community wouldn't challenge, and what your own question has to take for granted.

> **Narrator:** Simone had lived on Lantern Isle all her life. As far as she knew.
> *(Morning. She walks the tideline, Echo riding on her shoulder. The conch from last night is still half-buried in the sand. She blows it. The island answers with silence: nobody objects. Ink hardens under her feet, teal.)*
> **Simone:** Oh.
> **Narrator:** The first sacred weapon had been found. By someone who thought it was a shell.
> **Cole** *(a voice crackling down from the sky, from some other world)***:** Chat, is she okay? …Chat says she's fine 👍.
> *(The water doesn't change at all.)*
> **Simone** *(to the sky, politely)***:** Your chat isn't my community.
> **Narrator:** She had no idea who that was. It was still correct.
>
> *(Fog rolls in. A lighthouse keeper sits on a buoy.)*
> **Simone:** What color is the light on the far buoy?
> *(An anchor drops out of the fog and bites. Three planks dry under her: HE UNDERSTANDS ME. HE'S TELLING THE TRUTH. HE CAN TELL GREEN FROM RED.)*
> **Narrator:** The second sacred weapon. It arrived the way anchors do, from above and without asking.
> **Keeper:** Green.
> **Simone** *(a faint crease between her brows)***:** …Can you tell green from red?
> *(That plank softens into wet ink. It's the question now.)*
> **Keeper:** If you ever wake up, follow the light. Nobody here ever does. I say it to everyone.
>
> *(Across the strait, on Star Isle, everyone takes for granted that the stars predict the tides.)*
> **Islander:** The stars say the tide is safe.
> *(Solid ink forms under him. He strolls out onto the flats.)*
> **Narrator:** By the rules of this world, he was perfectly justified. By the rules of the tide, he was underwater.

**The crack:** a whole community can take something for granted and still be wrong, but this world's rule says the islander is justified anyway. This is Greco's moral analogy: if a community's approval is what justifies you, a misguided community is justified too. **Quiz Q2.** The dome cracks like porcelain, and Simone falls out.

**Visual:** an ancient island of cut-paper silhouettes on deep teal water, amber lanterns, a lighthouse; fog banks around it; Star Isle lit cold silver-violet.

### I1–I3 · Interlude: alone, the Ferry, Here, and the third weapon [FIXED concept · AI DRAFT montage] · ~1.5 min, no quiz

**I1 · Alone**

> *(A drop of ink that has hung in mid-air for ages finally falls. Plink. The meter: DRY WORLD REMAINING 0% · PEOPLE STANDING 1.)*
> **Narrator:** Nobody knows how long she slept. Long enough that the ink had forgotten what it said.
> *(Simone on one dry plank in an endless grey ocean. Domes of ink in every direction, a sleeper curled inside each.)*
> *(On her knee: Echo, exactly as before. Everything she had known had been a dream. Except, somehow, the crab.)*
> **Narrator:** He had never been asleep. Nothing about him had ever needed to be true.
> *(She blows the conch. Nothing.)*
> **Narrator:** A conch needs a community. No one to object. Also no one to agree.
> *(The anchor gives her one plank at a time, and only for the question she's asking.)*
> *[Caption: Year 1.]* *(Simone looks at the conch, then the anchor. Two weapons. Somewhere, a third.)*
> *[Caption: Year 3.]*
> **Narrator:** She told Echo everything. Echo raised his claw at the parts he liked.

**I2 · The Ferry and Here**

> *[Caption: Year 4.]* *(One dome looks like home: lanterns, a fog bank. She knows its rules. She goes in. A while later a fisherman stumbles out, blinking.)*
> **Narrator:** Some sleepers dreamed by her own rules. Those, she could wake.
> *(Two, then five, then twelve. She blows the conch. This time the silence comes from people: nobody objects. Ground spreads under all of them.)*
> **Narrator:** With someone to answer it, the conch finally worked.
> *[Caption: Year 6.]*
> **Narrator:** They called the town Here, after the stranger's last words. They called themselves the Ferry, because they carried sleepers across.
> **Narrator:** The first law of Here: no asking "Are you sure?" after dark.
> **Narrator:** The first school taught one subject: when to ask, and when not to.
> *(A dome that won't open. Inside, a young man talks to a glowing rectangle. Simone presses her hand to it. Nothing.)*
> **Narrator:** Some domes wouldn't open for a stranger. They opened only for someone with an audience of her own.
> *(One more dome, glassy navy. Nothing works on it.)*
> **Narrator:** And one would open only for someone who *knew*.
> *(Inside, a young woman in a navy cap punches tickets nobody hands her. Echo presses his claw to the glass. One stick near Simone's heart reads ECHO IS SAFE WITH ME.)*
> *[Caption: Year 12.]*

**I3 · The third weapon**

> **Narrator:** For twelve years, the Ferry searched every sea for the third weapon.
> *(Town hall. A small, courteous fountain pen with two eyes on its clip lies beside the minutes book. Simone picks it up to take the minutes and writes: "Rain at dawn." The ink dries the instant it touches the page. No question mark. No answers needed.)*
> *(A villager leans over and shouts at the page.)*
> **Villager:** WHY?
> *(Nothing happens.)*
> *(Simone writes, as a test: "Echo can talk." The ink stays wet, and stays wet for the rest of the scene.)*
> **Evan** *(politely)***:** I'm afraid that one isn't so.
> **Simone:** You only dry what's so.
> **Evan:** What the writer knows. Anything else would be impolite.
> **Simone:** You're the third sacred weapon.
> **Evan:** I'm a pen. I write down what's so. I'm not one of *those*.
> **Narrator:** The third weapon had been found. It disagreed.
> **Narrator:** He had never meant to found anything.
> *(Echo raises his claw over the dry line, and only over that one.)*

**How the third weapon works [YOUR IDEA · AI VERSION, checked against the paper; full check in §9.4]:**
- **Anyone can write with Evan, and only what the writer knows dries.** A lie never dries. Neither does a lucky guess. What you actually saw dries at once, by itself. (Factivity: you can only know what's true. This is standard background to Williamson's view rather than something Greco spells out.)
- **"Why?" bounces off.** What you know needs no further reason behind it: knowledge is evidence, and it stops the regress by itself (Williamson's E = K, which he calls "a very modest kind of foundationalism"). This is the author's "others can't question it," made exact: others *can* ask, but the ink doesn't need to answer.
- **The same pen gives different results in different hands,** because this route pairs with any flexible view of knowledge (§2.3). For Simone it dries when little is at stake; for Cole it dries unless someone in his audience raises a doubt he can't answer; for Rae it's dry now and wet again when someone who knows more reads it later. Echo raises his claw over Evan's ink and nothing else: expressivism reaches foundations only through knowledge (§3).
- **The catch (the author's idea, widened to match the paper):** the ink softens when a doubt is taken seriously and nobody can dispel it (footnote 16). The most dangerous doubter is the writer, because doubting whether you know leaks down into doubting the thing itself (§4.1). Hinted in P3, revealed in R6.
- **It isn't "my own experience."** Evan dries what you know about the world ("the boat is leaking"), not how things seem inside you. Retreating to "it seems to me" is Descartes's grain again: the cognitive home Greco argues against (§9.4).
- **[AI DRAFT] "Without trying," twice over.** Greco's phrase means you can end up a flexible foundationalist without aiming to (§2.3). Evan never meant to be a weapon, and Williamson himself rejects the flexible views (footnote 15), so Evan denies he's one.

**Why the gap is so long [AI DRAFT]:** the paper supplies the reason. Simone can't open Cole's dome until she has an audience to speak to, because in his world the speaker's community fixes what a sentence claims. So Here has to exist first. And the knowledge domes need someone who knows, so the Ferry needs Evan.

**Visual:** the grey ocean and the domes; Simone alone on one plank; then the town of Here growing across three panels, on sticks of many colors; the town hall; Evan's ink drying on the page with a faint glow.

### P2 · The Broadcast · Cole · contextualism × social [AI DRAFT · Echo's beats YOUR IDEA · AI VERSION] · ~3.5 min

**Paper:** §3: the contextualist version; the technical-term worry; "It must be cold" and "Oh, come on"; the speaker-commitment view; the problem of disagreement (pp. 430–431).

**Rule of this world:** ink doesn't dry under feet. It dries on *words*. Each sentence floats out as a ribbon, and whether it dries depends on **the community the speaker is talking to**.

> *(Centuries of dream time have passed in here. A neon night sea. Cole on a raft in his ring light, mid-stream.)*
> **Cole:** Chat. Chat. Look at this reef. That reef is *solid*.
> *(For his chill chat, the ribbon dries rust-red. He flips to the pedant stream, @tidetablepurists.)*
> **Cole** *(snapping upright, anchor voice)***:** For the record: that reef is solid.
> *(Same sentence. The ribbon stays wet.)*
> **Narrator:** Same sentence. Same reef. Two different claims.
> *(Simone climbs onto his raft, dripping, an old lantern in her hand and a hermit crab on her shoulder.)*
> **Chat:** who is this · is she a mod · lantern lady lol · is that a CRAB
> **Simone:** You're asleep. This is a dream.
> **Chat:** ratio
> **Narrator:** Nobody can be told. You have to see it for yourself.
> **Cole:** Okay, lantern lady. "Your belief is foundationally justified." Happy?
> **Chat:** bro what does that even mean
> **Narrator:** Nobody talks like that. Not even philosophers, at parties.
> **Simone:** Then listen to how people do talk.
> **Cole:** …"It must be stormy out there."
> *(The ribbon dries, with a thread tied to the clouds: he inferred it.)*
> *(Echo climbs down Simone's arm and pinches Cole's ankle.)*
> **Cole:** Ow! That hurts!
> **Simone:** What makes you think that?
> **Cole:** Oh, come *on*.
> *(That ribbon dries instantly. No thread at all.)*
> **Narrator:** Some beliefs, Cole discovered, he simply refused to defend. Philosophers call this foundational. Cole called it obvious.
> **Simone:** Where I come from, there was an island that trusted the stars over the tide. By our rules, they were justified. They drowned.
> **Cole** *(to camera)***:** Chat, the star people are wrong.
> *(The ribbon dries.)*
> **Narrator:** In this world, Cole wasn't describing the islanders. He was stating his own commitment. Which meant that, for once, someone could call a whole community wrong.
> *(Simone breathes out. Then she frowns.)*
> **Simone:** By my world's rules, they were justified.
> **Cole:** Not by mine.
> *(Both ribbons dry. Neither wobbles.)*
> *(Echo looks from one to the other, then raises his big claw toward Simone and his small one toward Cole. Both at once.)*
> **Cole:** …I'm starving.
> **Simone:** I'm not.
> **Narrator:** Those two didn't contradict each other. Then why did the first two feel like a fight?
> **Narrator:** Echo didn't think either of them had a fact wrong. He thought they were *for* different things. Nobody asked Echo.

**The crack:** if each of them is only stating their own commitments, both can be right, and yet it feels like a real disagreement. **Quiz Q3.** The dome splits, and they both fall out into Here. PEOPLE STANDING +1.

**Visual:** a neon night sea, Cole on a small raft in his ring light, rust ribbons of ink drifting from his mouth, glowing paper slips of chat around him; Simone, ancient and dripping, in the middle of it; Echo on her shoulder with both claws raised.

### P3 · Glass and Tide · Rae · knowledge × relativism, with Echo's expressivism beside it [AI DRAFT · recast for the author's Echo idea] · ~2 min

**Paper:** §2.3 (E = K plus a flexible view of knowledge) and the close of §3: some philosophers move to relativism or expressivism to handle disagreement; on some views, relativism and expressivism about knowledge just are relativism and expressivism about foundations (pp. 429, 431). Greco declines to choose. Because he spends so little space here, this is one short scene.

**Rules:** in Rae's **Glass Sea**, whether a patch counts as dry depends on *who is assessing it*, and no assessor is privileged. Beside it, **Echo**, awake from the real ocean, shows the other answer: calling footing solid is something you *do*. You raise a claw.

> *(Simone, Cole, Evan and Echo stand before the glassy navy dome. Simone writes with Evan on the glass: "There is someone inside. I can see her." The ink dries. The wall softens and lets them in.)*
> **Narrator:** Only someone who knew could open it.
> *(A mirror-flat navy sea. Rae, cap low, ticket punch in hand.)*
> *(Cole takes Evan and writes: "Simone is standing on solid ink. I can see it." From Cole's side, the words dry blue.)*
> **Cole:** See? She knows it. It's her evidence.
> **Rae** *(looking at the same patch)***:** A glass sea shows reflections. *(click)* Not valid.
> *(Under Rae's gaze, the same line sags a little and goes damp. Nobody can say how they know it isn't a reflection.)*
> **Narrator:** This time they were judging the same claim. Each verdict was right from where its judge stood.
> **Narrator:** And Evan's ink, it turned out, could get wet. Nobody wanted to think about that yet.
> *(Echo walks out onto the disputed patch. There's nothing to check. He regards Simone. Then the claw goes up. Clack.)*
> **Narrator:** Echo didn't describe the patch. He committed to it.
> **Narrator:** Two answers to the same disagreement, side by side. Neither won.

**The crack:** two equally live answers, and the paper leaves the choice open. The lie that there's one rule for the whole ocean can't survive that. **Quiz Q4.** The dome shatters. PEOPLE STANDING +1.

**The hint [AI DRAFT]:** Rae's doubt is one nobody can dispel, so in her assessment Evan's line stops counting as knowledge (footnote 16). That plants the catch revealed in R6.

**Visual:** a split frame along one seam through the disputed patch. Left: navy mirror sea, sharp reflections, Rae with her punch, the blue line going damp. Right: Echo standing on the same patch, claw raised, soft violet and coral light around him. Evan in Cole's hand at the seam.

---

## 6 · Part 3 · The real ocean (*What does this explain?*) [FIXED concept · AI DRAFT scenes]

### R1 · Three heroes, a crab, a pen, and a town behind them [AI DRAFT]

> *(Simone, Cole and Rae stand at the edge of Here, Echo on Simone's shoulder. Behind them, hundreds of people on dry sticks of every color. Evan bows to each newcomer in turn.)*
> **Cole:** Okay. Chat? …Chat's asleep. *(He looks at the crowd.)* New chat.
> **Rae:** *(looks at each of them, says nothing)*
> **Echo:** *(clack)*

### R2 · The demon [FIXED villain and twists · AI DRAFT text]

> *(The sky darkens. Strings descend. YYYY SOWATT rises, hanging from them like a marionette.)*
> **SOWHAT** *(in a voice that isn't its own)***:** Suppose there were a demon.
> *(beat)*
> **SOWHAT:** There was.
> **Narrator:** Descartes had been right. It is the most upsetting thing he ever got right.
> **SOWHAT:** Every world you just left was mine. Who do you think knocked the question mark into the Inkwell?
> **Simone** *(looking at the five bubbles, then up the strings)***:** It was never the creature.
> **SOWHAT:** The creature is just how I look when I touch ink.

Planted earlier: Descartes's hypothetical demon (L5); the dark sleeve at the guardian question mark (L1).

### R3 · The goal [FIXED: save the dreamers · AI DRAFT details]

> **SOWHAT:** The rest of them are still dreaming. Every night, I ask them the same thing.
> **Y:** Why believe you're justified?
> **Narrator:** The doubt leaks down. Nothing under them can dry. They never wake.
> **Simone:** Then we wake them.
> **Cole:** How?
> **Simone** *(remembering the keeper)***:** Follow the light.

On the horizon stands a lighthouse, the one place the demon's storm hasn't reached. It's dark.

### R4–R10 · The Access sequence, following §4 of the paper [FIXED concept · AI DRAFT beats]

| ID | Story | Paper (§4) |
| --- | --- | --- |
| R4 · Grounds | The lighthouse gives one last flash before going dark: *north*. Taking for granted that it's honest and she read it clearly, the flash fixes which way Simone should go. A teal stick dries under her: NORTH. | Given Peter's honesty and Justine's hearing, what he said fixes what she should believe. |
| R5 · The attack | **Y:** Why believe it said north? **SOWHAT:** So what? Can you even tell whether you're justified? The stick softens; Simone sinks to her ankles. **Cole:** Uh. Simone. You're sinking. | The leak-down worry: doubt about your grounds carries over to the belief. That's why Greco wants Access. |
| R6 · Why it works | The distant light flickers: three flashes, two, none. **SOWHAT:** Maybe the keeper jokes. Maybe you miscounted. The demon can't wet Evan's ink by shouting at it, so it asks Evan himself: *"Was it really the lighthouse you saw?"* Evan can't answer, and his own minutes soften. **Demon:** I never touched it. You did. **Narrator:** If her grounds were whatever the light *really* flashed, the demon could hide it, and she'd have no way to tell what she should believe. | The supervenience base: if justification depended on hidden facts, a misleading forecast could mislead you about your own grounds. Peter jokes or mumbles. For Evan: footnote 16, and higher-order doubt leaking down (§4.1). |
| R7 · The tempting retreat | **SOWHAT:** Then retreat into your own mind, like Descartes. The grain-sized *I think* stick, the only belief that never got wet, drifts up beside her. **Simone:** That's very small. **Narrator:** It was. It always had been. | A global cognitive home, always-knowable facts big enough to fix all justification, is too much to ask. |
| R8 · The mobile home | Echo climbs out of his shell and into an empty one drifting past. *Clack.* **Simone:** Then I'll move too. She stops asking "What did the light really flash?" and asks "Given what I can know here, which way?" **Cole:** I recorded the flashes. Habit. The **Anchor** drops: hold fixed that the recording isn't edited. She blows the **Conch**, and Here answers with silence: nobody objects. Evan writes what the recording shows, and it dries. **Quiz Q5.** | The mobile home: in each context, the facts that fix justification must be ones the subject is in a position to know. Justine falls back on Peter's email. |
| R9 · Split confidence | The recording is blurry. **Simone:** Probably north. Maybe north-east. A stick dries for *that*, pressed with both words. **Narrator:** She didn't know where the lighthouse was. She knew exactly how sure to be. | Footnote 36: she may only be justified in spreading her confidence, and Access holds if she can know how to spread it. |
| R10 · Access, and arrival | **Rae:** What makes you think that? Simone tells her: the recording, the keeper, Evan's minutes, her best guess. Rae looks for a long beat. *Click.* **Rae:** Valid. Simone steps forward; a stick dries ahead of her and the one behind melts. Step by step through the storm, she reaches the lighthouse and puts her hand on the lamp. **Narrator:** Her ground didn't stay put. It came with her. Like Echo's. | Access holds context by context. A new doubt can move the home again. |

### R11 · The moral question [FIXED concept · AI DRAFT text]

> *(Simone at the lamp. The strings tighten across the sky.)*
> **Demon:** There is no ground. There never was. Your old world dried on "because my mother said so." I didn't drown it. I showed you it was water.
> **Simone:** You're right. There's no ground under the ocean.
> *(beat)*
> **Simone:** There's ground under me.
> **Demon:** Then decide for everyone else. Wake them, to what? An ocean with no floor. The moment they start asking properly, half of each of them melts. In my dreams, each of them is whole: one world, one rule, home. Who are you to take that?
> **Demon:** And you. What are *you* made of?
> *(Simone looks down at the sticks of her own body. Near her heart: ECHO IS SAFE WITH ME. It dried long ago, on no reason at all.)*
> **Cole:** Chat… are we the bad guys?
> **Rae:** *(says nothing; the punch half-raised)*
> **Evan:** *(uncaps, and doesn't write. There is nothing here to know.)*
> *(Everyone's footing wobbles. Except Echo's. He has never stood on a fact in his life.)*
> *(Echo climbs onto the lamp, turns to face the audience, and raises his claw. Waiting.)*
> **Narrator:** The legend never mentioned a crab. Legends never count the pet.
> **Narrator:** This question has no fact under it to dry. It only has what we're *for*. So we're asking you.

**Notes [AI DRAFT]:**
- **The epistemic question is settled before the moral one opens.** Simone has already answered the skeptic: there's no ground under the ocean, but there is ground under her. What's left open is what to do about everyone else.
- **This stays within the paper:** Greco's §3 runs on moral analogies (a community approving of something wrong; speaker relativism in ethics).
- **The demon remains the antagonist** (it trapped everyone in dreams), but it gets the skeptic's best argument (§1.1c).
- **[YOUR IDEA · AI VERSION] Echo's payoff:** the moral question is home ground for expressivism, which began in ethics (Ayer, then Gibbard) before it was applied to knowledge. The vote is a room-sized raise of claws (§9.3).
- **[AI DRAFT] Optional demon line about Echo:** "He's safe because he never claimed anything. Would you like to live like that?"

### R12 · The vote, and three endings [FIXED concept · AI DRAFT endings]

Every audience screen shows three choices for 15 seconds. The majority ending plays. Afterwards, the canvas can show the other two.

| Ending | What happens | Final meter |
| --- | --- | --- |
| **A · Light it** | The beam sweeps across the ocean and into every dome. Dreamers wake, melt a little, then find a stick that holds, then another. **Narrator:** "It hurt. Then they stood." **Simone:** "You can take my truth. You can't take my footing." The strings go slack. SOWHAT drops free and lands on Simone's other shoulder, next to Echo. | DRY WORLD REMAINING 0% · PEOPLE STANDING 97% |
| **B · Let them sleep** | Simone takes her hand off the lamp. The domes glow on, each one home to someone. **Narrator:** "Everyone was happy. Nobody was right." The strings stay taut. | PEOPLE STANDING: only Here |
| **C · Teach the question** | Simone pulls SOWHAT off its strings and sets it beside the first dome. In its own small voice, it asks the dreamer one question, and waits for an answer that matters. **Narrator:** "It wasn't the end of questions. It was the end of questions that never end." | PEOPLE STANDING: climbing slowly… (Probably.) |

After every ending: the title card in the same mock-anime style as L8's title card, **THE END.** *(beat)* **(Probably.)**

**What each ending means [AI DRAFT]:**
- **A:** truth over comfort; Access lets people stand without bedrock.
- **B:** the astrology objection on a world scale: comfort a community accepts isn't justification.
- **C:** flexible foundationalism as a practice: neither the lazy guardian nor the endless demon, but questions that come when they matter.

**Staying honest [AI DRAFT]:** in no ending is the demon destroyed or the ocean proved real. Unit 2.2 already raised the worry that contextualism gives no reply to the skeptic. What changes is whether people can tell what they're justified in believing. Greco's paper never mentions the demon; present it as the class's skeptic from Units 2.1–2.2 meeting Greco's tool. The bridge to the paper is §4's misleading forecast.

### R13 · Coda: Giedt Hall [FIXED concept · AI DRAFT staging]

> *(Cut to black. Then: Giedt Hall, the present day, exactly as in S0.2. Professor Lin turns from the board and adjusts his dark sleeve. For a single frame, a thin thread of ink trails from the cuff.)*
> **Professor Lin:** So. Any questions?
> *(SOWHAT pops into the corner of the final slide.)*
> **SOWHAT:** So what?
> *[Slide:]* **Questions?**

This is the professor twist (§6b): a hint, never confirmed. "Any questions?" is both the real Q&A and the demon's favorite weapon.

## 6b · The final twist: is the demon the professor? [FIXED concept · AI DRAFT design]

**[FIXED]** At the very end, hint that the demon might be the Professor. Only a hint, never confirmed. Earlier scenes plant clues where useful.

**Why it works [AI DRAFT]:** in the real class, the person who first introduced this audience to the brain in a vat and the evil demon (Units 2.1–2.2) was the professor. The demon's whole method, asking "why?" until you can't answer, is a professor's job description. And SOWHAT's red dot was always a teacher's red pen.

**Clues [AI DRAFT]:**

| Where | Clue | Should anyone notice? |
| --- | --- | --- |
| S0.3 | Professor Lin asks, "What do you see there?", then tells the room they're all wrong | No: it's just class |
| L1 | The dark sleeve that bumps the guardian question mark is the same color and cuff as Professor Lin's jacket in S0 | Only on a second viewing |
| L2, R2 | SOWHAT's red dot: a teacher's red-pen margin note | Already part of the design |
| L5 | Descartes: "Suppose there were a demon…" in the same cadence Professor Lin uses for hypotheticals in S0.3 | No |
| R2 | The demon: "Every world you just left was mine." (The presentation's worlds were all built for his class.) | Laughs from people who catch it |
| Ending | See R13: the cut back to Giedt Hall | Yes: this is the payoff |

**Tone [AI DRAFT]:** a wink, not an accusation. Professor Lin is never shown doing anything villainous. Keep it affectionate, the kind of joke a professor enjoys being the target of.

## 7 · Quizzes [FIXED concept · AI DRAFT questions]

The classroom vote (B or 13) opens the presentation in S0.3. In Part 2, each quiz is the audience helping the rescuer find the crack.

| # | Scene | Question (correct answer in italics) | Ingredients revealed |
| --- | --- | --- | --- |
| Q2 | P1 | The islander stands on dry ink as the tide comes in. What should Simone notice? (a) His community would object. (b) *A whole community can take something for granted and still be wrong.* (c) The stars are reliable on Star Isle. | The Conch and the Anchor + Simone's own situation (sensitive invariantism × social and hinges) |
| Q3 | P2 | "They were justified." / "Not by mine." If each of them is only stating their own commitments, what's the problem? (a) One of them is lying. (b) *They wouldn't really disagree, yet it feels like they do.* (c) Cole's chat decides who's right. | The Conch + the speaker's audience (contextualism × social) |
| Q4 | P3 | Rae punches; Echo raises his claw. Which describes the two answers? (a) *Relativism: truth depends on the assessor. Expressivism: calling it foundational is a commitment.* (b) Both say the claim is false. (c) Both say Cole is right. | Evan + the assessor / Evan + a commitment |
| Q5 | R8 | The light is unreadable. What should fix Simone's grounds now? *Facts she can know here: the recording, the keeper, Evan's minutes, or her best guess.* | — |

---

## 8 · Open questions for the dream era (AI defaults used in the drafts above)

| # | Question | AI default |
| --- | --- | --- |
| 1 | Timing: P1 ~2.5, interlude ~1.5, P2 ~3.5, P3 ~2, Part 3 ~6.5, vote and coda ~1.5 minutes. Does it fit? | Untested |
| 2 | Simone's years alone: comic, quiet, or both? | Both: Echo for company (a *Cast Away* nod, except he's real), then one silent image of her alone on a single plank |
| 3 | Names of the rebellion and the town | The Ferry (摆渡会) and Here (此地) |
| 4 | Length of the gap | Twelve years outside; centuries inside Cole's dome |
| 5 | Simone's age | Barely aged: people change only when their beliefs do |
| 6 | P3: how to show relativism and expressivism together | One dome (Rae's), with Echo's answer beside it; Greco gives these views one paragraph |
| 7 | Endings: A, B and C, or only A and C? | All three |
| 8 | Number of quizzes in Parts 2–3 | Four (Q2–Q5) |
| 9 | Belief at the base (Harman) | Drop it, or one line in the interlude |
| 10 | Who pinches Cole? | Echo, riding into Cole's dream on Simone's shoulder |
| 11 | Professor coda | Keep |
| 12 | The demon: villain, or a misunderstood truth-teller? | Villain, with the skeptic's best argument at R11 |
| 14 | Who makes the "find them" claim in L8? (a) Simone, deadpan; (b) a loud kid boasts, while quiet Simone is the real hero (breaks the "laughed-at one is the hero" rule); (c) Simone, plus Cole's voice leaking from the sky ("Chat, I'm gonna find all three") | (a) |
| 15 | After L8, does the keeper stay the narrator for the whole show (a *Princess Bride* frame)? | No: a separate dry narrator from P1 on; the keeper appears as a character |
| 16 | Evan's form: a courteous fountain pen, or a living ink brush (matches the handscroll)? | Fountain pen |
| 17 | Horcrux nod: Evan as a piece of the stranger who left the weapons, left behind by accident? | A hint only, never explained |
| 18 | Where Evan's ink first sags: P2 (Cole's audience raises the doubt) or P3 (Rae)? | P3 |
| 19 | Does Echo ever speak? | Never. Only claws |
| 22 | How many of the 28 minutes go to Q&A and other housekeeping? The §5.2 table currently uses all 28 for the story | Reserve ~4 minutes, so the story runs ~24; cuts needed |

---

## 9 · Design rationale: the author's questions, the paper checks, and why

This section keeps the reasoning behind recent decisions in one place: what the author asked, what Greco's paper actually says, which references were used, and what was corrected. It records reasons, not old versions of scenes.

### 9.1 The legend as anime parody, and the transition into the first dream (L8)

**The author's request:** make everything before the dream era an exaggerated tribute to and parody of classic anime and films. Someone who found a better way leaves three sacred weapons to the world. The legend turns out to be told inside the first dream world, where the characters think it's just a legend. At the line about the weapons waiting for heroes, someone in the crowd says they'll be the hero, everyone laughs, and that person really is the first hero. The author asked for films, shows and anime that use this kind of transition, and a smart version based on them.

**References used:**

| Work | How its transition works | What we borrow |
| --- | --- | --- |
| *Kung Fu Panda* | An epic narrated legend in a different art style, then a hard cut: it was Po's daydream. Later Po declares he'll be the Dragon Warrior and gets laughed at. | The style shift as the reveal; the laughed-at hero |
| *Avatar: The Last Airbender* | The famous opening narration turns out to be spoken by Katara, a character in the world. | The narrator becomes a person in the scene: the keeper |
| *One Piece* | Gol D. Roger's last words send the world after his treasure. Luffy says he'll be King of the Pirates, and the bar laughs at him. | The closest match: treasure left behind at a death, a public boast, laughter, and the boaster really is the hero |
| *Shrek* | A storybook fairy tale, deflated from inside the world. | The sarcasm |
| *Hercules* (Disney) | A pompous narrator is interrupted by the Muses. | Heckling the storyteller |
| *The Princess Bride* | A story framed by a grandfather reading to a grandson who interrupts. | The child's "Is it true?" |

**Why "the scroll pulls back":** the legend is already painted as one long handscroll, so the reveal is almost free: the scroll is real, and it's in the keeper's lap. It creates dramatic irony (the villagers laugh off the story of their own sleep while the audience knows they are the sleepers), hides clues in plain sight (the 100% meter, the wet ink), and connects the keeper to his later line, "If you ever wake up, follow the light."

**Why Simone, deadpan (default):** a calm statement ("Then someone should go and find them") is funnier than a boast, fits her character (*Simone notices*), and keeps the author's rule that the one laughed at is the first hero.

### 9.2 Weapons and heroes: does each route have one perfect match?

**The author's question:** should the three heroes be parts of the one who left the weapons, like horcruxes in *Harry Potter*, or should only the right person be able to use each weapon? That depends on whether the paper matches each route to exactly one version.

**Paper check:** it doesn't. In Greco, routes and versions aren't one-to-one:
- **Social norms** pair with both sensitive invariantism and contextualism (§3).
- **Hinges** also pair with both.
- **Knowledge at the base** works with any flexible view of knowledge: contextualism, sensitive invariantism, relativism, "or others" (§2.3). Through it, relativism and expressivism too (§3, one sentence).

**Decision:** "only the chosen one can wield it" would misstate the paper. Instead, each weapon answers to anyone, but differently in each hand: the weapon is the route, and the hand holding it is the version. It still parodies the chosen-one cliché, and it's what the relay already does: the Conch dries footing by Simone's community in her world and by Cole's audience in his.

**The horcrux idea:** kept only for Evan, as an unexplained hint. Like Harry, he'd be a piece left behind without anyone meaning it to happen, which echoes "without trying." Not used for the heroes: splitting him into three pieces would crowd a 20-second hook.

### 9.3 Echo: from hero to the one nobody counted

**The author's idea:** the legend never mentions Echo, but the expressivist still exists. Echo can be Simone's pet: a twist, a third figure who isn't a hero but actually matters.

**Why it fits the paper:**
1. **Weight.** Greco gives sensitive invariantism and contextualism most of §3. Relativism and expressivism are left open, and expressivism connects to flexible foundations only through the knowledge route. A non-hero companion matches how the paper treats it: mentioned, undeveloped, but there.
2. **The disagreement problem** is what moves some philosophers from contextualism to relativism or expressivism (§3). So Echo's first real beat belongs at the P2 disagreement, as a hint of the paper's next step.
3. **Ethics.** Expressivism began as a view in ethics (Ayer, then Gibbard) before it was applied to knowledge. So the moral confrontation in R11 is Echo's home ground. That's the twist payoff.
4. **The legend never mentions him.** *"Legends never count the pet."*

**Design:** Echo stays the Version C hermit crab, which is a fixed design. (In conversation the AI floated a color-changing cuttlefish; that's dropped, because the crab already does the job.) Raising the claw is a commitment, not a description. And swapping shells is the mobile home in R8.

**Rules [AI DRAFT]:** nothing dries under Echo, because a commitment isn't a belief, so he can't hold anyone up. SOWATT can't melt him either: "why believe that?" has nothing to grab when he never believed anything. **Honest note:** the second rule is a story liberty. In the paper, expressivism is a theory of what "knows" means, not a shield against skepticism. The cost (he can't help anyone stand) keeps it honest, and the demon can say so in R11.

**Echo's beats:** L8 (the only one who doesn't laugh), I1 (company in the empty ocean, a *Cast Away* nod, except Echo is real), P2 (pinches Cole into "Oh, come on"; raises both claws at the disagreement), P3 (the expressivist answer beside Rae's relativism), R8 (the shell swap), R11–R12 (faces the audience; the vote).

**Avoided:** the pet-who-betrays twist (Scabbers in *Harry Potter*, Kyubey in *Madoka Magica*). The demon already carries the moral ambiguity; a second dark twist would muddy it. The model is closer to Gromit in *Wallace & Gromit*: silent, expresses everything, secretly the smart one.

### 9.4 Evan: the third weapon, checked against §2.3

**The author's proposal:** Evan, a strange creature, is himself the third weapon. Someone uses Evan to write their own belief, and what comes out can't be questioned by others, because evidence is a person's own experience or knowledge and no outside force can break it. The catch: if the person questions it themselves, it can break or go wet, and the story can reveal that later. The author asked whether this matches what Greco says about E = K.

**What Greco says:**
- Williamson holds that knowledge is evidence (E = K). Items of knowledge can support further beliefs without needing support themselves, so knowledge plays a regress-stopping role: Williamson calls it "a very modest kind of foundationalism" (§2.3).
- **"Without trying"** means a theorist can end up a flexible foundationalist by accident: accept E = K, add any flexible view of knowledge, and you're there (§2.3). It doesn't mean knowledge is effortless.
- **Footnote 15:** Williamson himself rejects the flexible views of knowledge; others combine them with E = K.
- **Footnote 16:** in any context where an attributor takes seriously a doubt the subject can't dispel, "S knows that P" is false as that attributor says it, so the belief can't stop regresses by that attributor's standards.
- **§4.1:** doubting whether you know or are justified in believing P naturally, and reasonably, leads to doubting P. A doubted claim can't be foundational in the context where it's doubted.

**Check:**

| The author's claim | What the paper supports | Verdict |
| --- | --- | --- |
| What you write with Evan becomes a foundation | Knowledge stops the regress (§2.3) | ✅ Exact |
| Others can't question it | Others can ask; knowledge just doesn't need an answer to stand | ⚠️ Reworded: "why?" bounces off |
| It's based on your own experience | No. E = K is about what you know of the world. An untouchable base of "my own experience" is the Cartesian cognitive home that Greco's §4 argues against | ❌ Changed |
| It breaks only if you question it yourself | Self-doubt does break it (§4.1). But under footnote 16, a doubt taken seriously by whoever is judging can break it too | ⚠️ Widened |

**A better story from the correction:** in Part 3 the demon can tempt Evan to write only "it seems to me…", which feels safe because nobody can doubt it. But that's Descartes's grain again: safe, and too small to stand on. Greco's answer is the mobile home: don't retreat inward; move to what you can know in this context.

**How the three weapons differ:**

| | **Conch** (social) | **Anchor** (hinges) | **Evan** (knowledge) |
| --- | --- | --- | --- |
| What dries | What nobody around you objects to | What you must hold fixed to do the task in front of you | What you actually know |
| Where it comes from | Other people | The task | Your contact with the world |
| Can it be false? | Yes: a whole village can agree on something wrong | Yes | No: a false sentence never dries |
| Response to "why?" | Needs the crowd to stay quiet | Needs the task to still be on | Bounces off |
| What breaks it | An objector the group takes seriously | The task changes | A serious doubt nobody can dispel, especially your own |

The "can it be false?" row is standard background about knowledge (Williamson's view), not something Greco states. It's the clearest way for the audience to tell the routes apart.

**Kept from the earlier draft:** Evan's name, his courtesy, "One sees," and the reveal in R6. **Changed:** he's a pen anyone can write with, not a pen that writes its own minutes.

### 9.5 The core mechanism, stated at the start (L0)

**The author's requirement:** explain the world's one core mechanism at the very beginning of the Legend, as pure explanation with one image, not a string of demo scenes. Everything is made of ink beliefs. Belief is concrete and has two forms: solid, which you can build on, and liquid. To make a belief solid it must withstand questioning, from the sacred question mark at the Inkwell and from anyone else. If someone questions it and you can't answer, or they can keep asking, it never solidifies.

**What the AI added, and why:**
1. **"Withstand" means the questioning stops, not that the answer is good.** The guardian accepted "my mother says so," and the ink still dried. If only good answers dried ink, three later beats would break: the guardian joke (L1), "undoubted, not undoubtable" (L7), and the astrology objection in P1, where a community's lazy approval lets a false belief dry.
2. **Re-wetting, stated plainly.** "If someone questions a dry belief and you have no answer, it goes wet again" wasn't in the author's statement of the mechanism, but it follows from the author's rule that ink dries only while nobody is asking. It is stated as a plain sentence, not a metaphor.
