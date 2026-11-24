# PHI 102 canvas · Story draft 5

**Living design document, updated November 23, 2026.** It's written scene by scene so that it can be read straight through, visualized, reviewed and revised.

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
- The time table in §5.2 comes to about 30 minutes with Q&A, about 2 over (open question 12).
- Part 1 is ~7 minutes. L0 (~30 sec) was offset by shortening L1.
- AI-drafted extras (side jokes, secondary names, optional lines) are the first things to cut.

## Presentation format: concept first, then story [FIXED]

**Every small section runs in two beats, with time split roughly evenly between them:**

1. **Concept (the slide side).** A traditional slide introduces the philosophical idea: the definition, the argument, the objection. Plain academic explanation.
2. **Transition line:** *"Let's see how it plays out in the story."*
3. **Story (the visual-novel side).** The voice-acted scene applies the idea: the audience watches the concept work, or fail, in the story.

**Why:** story alone loses the academic rigor; slides alone waste the visual novel and lose the audience. Alternating gives both entertainment and rigor, and keeps time balanced.

**Consequence for the script:** every scene must be **shorter**. The concept slide does the explaining, so a scene only needs the lines that *show* the idea. Cut any line that explains what the slide already said.

**[AI DRAFT] Section-by-section pairing:**

| Section | Concept slide | Story scene |
| --- | --- | --- |
| Part 1a | The regress problem: every reason needs a reason | L0–L3: the Law of Ink, the guardian, the brain-in-a-vat chain, the Whypocalypse |
| Part 1b | Agrippa's trilemma: skepticism, infinitism, coherentism, foundationalism | L4–L5: Operation Because, Descartes |
| Part 1c | The foundationalist's dilemma; flexible foundationalism: undoubted, not undoubtable | L6–L7: one ink pebble vs jelly; the stranger and the three treasures |
| P1 | The social route (Annis): a claim holds while nobody in the community objects; read as sensitive invariantism; the astrology objection | The trial |
| P2 | Wittgenstein's hinges: some things must stay put for any question to be asked; read as sensitive invariantism (it depends on the subject's inquiry) | The door |
| P3 | Contextualism: the speaker fixes the claim; "Oh, come on"; the commitment view; the hunger case and the disagreement problem | The wedding |
| Part 3 | Access internalism: the leak-down worry, the supervenience base, the cognitive home, the mobile home | R1–R10 |
| Finale | The moral question | R11–R13: Cole's confession, the vote and the coda |

## For the visualization agent

1. **Job:** draw each scene below for review. Label every image with its scene ID (for example `L6`) and its status. Mark images of **[AI DRAFT]** material as drafts.
2. **House style:** follow [slide-visual-style.md](slide-visual-style.md): cut-paper planes, one shadow plane per surface, fine paper grain, ink navy with pools of amber. Leave the lower part of the frame quiet for the dialogue box.
3. **Identity [FIXED: personality matches philosophical role]:** *Simone is the main character (subject), Cole never stops talking (speaker), Echo only reacts.* Take faces and costumes from the current full-body cast art (`src/assets/full-body-cast/`).
4. **Recurring identifiers:** Simone: black loop ponytail, teal-green cropped jacket, a red "YOU ARE HERE" map-pin badge on her lapel, and a vented pet carrier on her shoulder for Echo; no watch, no letter, no other prop. Cole: rust jacket, phone on a ring light, earbud wire. Echo: one palm-sized hermit crab with a tall faceted violet shell and one oversized coral claw. YYYY SOWATT: five ink bubbles, each with exactly one pointed speech-bubble tail; the smallest has a red dot ([reference](character-references/quibble-a3-single-tail.png)).
5. **Context colors:** teal for Simone, rust for Cole, violet and coral for Echo.
6. **Don't** put the names of films, games, studios, artists or specific artworks into image prompts. Describe painting traditions and visual qualities instead. Don't reproduce any existing character, logo or painting. Descartes appears as a generic seventeenth-century scholar in scroll style, not a copy of a known portrait.
7. **Avoid baked-in text** except where a scene asks for a short label (a title card, words pressed into an ink stick).
8. **[FIXED] Only NPCs are made of ink cubes.** Named characters (the three masters, Descartes, the keeper, the heroes) are drawn as ordinary people with expressive faces and drawn clothing. **NPCs (unnamed crowds and background people) are made of dried ink [new design from the author's design session, Nov 22]:** figures built entirely of small ink cubes, finest and densest at the head, growing gradually larger toward the feet, with no sudden jump in density, so the body reads as one coherent, seamless form. From across the room you see a person; up close you see the beliefs they're built from. When their beliefs go wet, they slump, drip and shrink. Simone, Cole and Echo keep their Version C designs.
9. **The three Answerers and Descartes** are stylized characters, not portraits: invent faces; don't copy any known painting or photograph.
10. **The regress dialogue in `src/slide-content.ts` is out of date.** Use L1–L5 of this document.
11. **Everything from Part 2 on is unconfirmed** (either [YOUR IDEA · AI VERSION] or [AI DRAFT]). Label those images as drafts.
12. **The three dreams are nested, and each has its own look:** P1's gaslit courtroom, P2's luminous seaside ruin, P3's white chapel by the sea. The white flash that ends P2 becomes the wedding. Simone carries the treasures from one dream into the next.
13. **P1 opens with a pull-back reveal:** the legend's last painting pulls back to a courtroom, and the narrator turns out to be Simone, testifying. The art style changes there, from the scroll's painting styles to P1's gaslit 1890s courtroom.

## Quick reference

| | |
| --- | --- |
| **Heroes** | Simone (subject · sensitive invariantism): main-character energy, everything is about her situation. Cole (speaker · contextualism): talkative and sassy, never stops performing. He has been awake for a very long time, and he loves Simone, who never remembers him **[YOUR IDEA · AI VERSION]**. |
| **Simone's arc [AI DRAFT]** | Three dreams, each inside the last. In P1 she can only win through everyone else's silence. In P2 she learns what she has to hold still before she can ask anything. In P3 she finds that two people can both speak truly and still be fighting. In Part 3 she stands on what she can know from where she is, and has to decide for everyone else. |
| **The love story [YOUR IDEA · AI VERSION]** | Hidden inside the philosophy. Simone says "I don't love you," Cole says "I love you," and both can be right. Cole knows every world is fake and keeps silent, because in the dream he has a happy, fulfilling life with her. |
| **The one who only reacts** | Echo, Simone's hermit crab, who rides in her pet carrier through every world. Never in the legend, never speaks **[YOUR IDEA · AI VERSION]** |
| **Villain** | The Cartesian demon (no body: a dark ink sky with strings) |
| **The demon's creation** | YYYY SOWATT (four Y voices + SOWHAT), its manifestation in the world |
| **Allies** | The old judge, who is also the lighthouse keeper (P1) and the officiant at the wedding (P3) **[AI DRAFT]** |
| **Legend figures** | The guardian question mark; the three Answerers (Pyrrho, Peirce, Neurath); Descartes, the fourth; the Cartesians; the moderates; the unnamed stranger who found a way out and left the Three Sacred Treasures of Good Enough (L7) |
| **Objects** | Ink sticks (foundations); the *I think* stick (grain-sized); the three sacred treasures: the Gavel (P1), the Hinge (P2) and, as a proposal, the Ring (P3) **[AI DRAFT]** |
| **Places** | The Great Inkwell; the ink ocean; the dream domes; the 1890s courtroom (P1); the coast road and the flooded ruin (P2); the white chapel by the sea (P3); the lighthouse |

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

**[AI DRAFT]** On the ocean, a stick dries under your feet like a plank. A further belief floats just above the stick that supports it. A stick is tinted by whose context matters (teal or rust). Echo has no sticks, only his claw (§9.3).

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
2. **[FIXED]** **Legend:** YYYY SOWATT is born and starts to wet the world like a virus, getting visibly worse with every chapter. People fight back: humanity elects three great masters, the Answerers, who appear in an order the audience chooses and are all useless; then Descartes, the fourth master nobody elected, right after. Descartes's *I think* is the first belief that stays dry while being asked about, but one dry grain can't hold back an ocean, and people have to hurry. Two schools try to dry the world again and fail. Then someone finds a better way, flexible foundationalism, and leaves three weapons to the world. Whether the Whypocalypse ever ended is left open.
3. **[FIXED structure · scenes tagged one by one]** **Three dreams, nested:** a dream within a dream within a dream. **[FIXED requirement]** The legend turns out to be Simone's testimony in a dream-world courtroom, where she's laughed at, then proves it with the Gavel (P1). The courtroom breaks straight into a second dream: she meets Cole on a coast road and closes a door with the Hinge (P2). The white flash becomes a third: her own wedding, with Cole as the groom (P3). She never remembers him. He has been awake for a very long time. A love story is hidden inside, and the disagreement problem happens between the two of them.
4. **[FIXED concept · AI DRAFT content]** **The real ocean:** Simone, Cole and Echo face the demon. Following §4 of the paper, Simone learns to stand without bedrock. Cole knew every world was fake and never said so, because his happy life with her was in there. Then the demon poses a moral question, and the audience votes on the ending.

---

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
- **"Oh, come on" is planted on purpose.** Here it fails. In P3, the same line from Cole becomes Greco's example of ordinary talk treating a belief as a starting point.

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
> *[A choir hits one enormous chord. THE WHYPOCALYPSE stretches across the sky in jagged black brushwork. The Cartesian demon reaches a huge claw toward the curved ink world. The prophecy appears beside the artwork.]*
> **Narrator:** An old prophecy had warned of this.
> **Prophecy:** When the last question goes unanswered, the ink will forget what is real.
> **Prophecy:** And when the stones have melted, the Cartesian demon will return.
> **Prophecy:** To the melted, he will offer worlds of solid ground. They will step inside, and none of them will know they are dreaming.
> **Narrator:** Nobody believed the prophecy. By then, it was very hard to believe anything.

**Notes [YOUR IDEA · AI VERSION]:**
- **The same belief as L1, now asked properly.** The guardian let "all ravens are black" dry on a joke answer; SOWATT asks the real philosophical questions about the raven inference, and the dried belief goes wet again.
- **The four Ys and SOWHAT, one classic problem each:** Y₂ is Hume's problem of induction (why should the unseen resemble the seen?); Y₃ is Hempel's raven paradox (if "all ravens are black" means "everything non-black is a non-raven," a white shoe confirms it); Y₄ is Goodman's "grue" puzzle; SOWHAT is Popper's asymmetry (no number of confirmations proves a universal claim; one counterexample refutes it).
- **First cut if time is short:** Y₄. Grue is the least familiar to this audience.
- **[FIXED: the author's choice of wording] The prophecy plants the dream worlds** before the P1 twist, so the courtroom reveal doesn't come out of nowhere. The logic follows from L2: if you can't rule out being a brain in a vat, you can't tell a dream from the real thing; and once your beliefs have melted completely, nothing is left to tell them apart. **[FIXED: the author's requirement] The Cartesian demon is named here, deliberately.** A deceiver who feeds you a convincing false world is exactly what Descartes's demon is. Naming it in the prophecy makes L5 dramatic irony: when Descartes says the demon is "only a hypothetical," the audience has already been warned it's coming. R2 confirms it.

**Visual:** Bubbles divide like cells. The Great Inkwell overflows, and puddles across the map sprout their own five bubbles. Ink-stick people slump as towns tilt into the sea. On the prophecy page, exaggerated brush lettering stretches across the sky above the demon’s claw and the curved ink world.

### L4 · Operation Because: three great masters [FIXED]

**[FIXED]** Humanity unites and elects three famous masters to stop the crisis, in the spirit of the Wallfacers in *The Three-Body Problem*: celebrated, given everything, and completely useless. Each represents one answer to the regress. **Show all four options in the L4 chooser:** Skepticism, Infinitism, Coherentism, and Foundationalism. While any of the first three remain, Foundationalism slips away from the cursor when the pointer approaches. The audience picks the three available Answerers in any order. Once they have all been visited, Foundationalism stays still and the audience selects it as the fourth and final choice, leading to Descartes. Each master's scene stands on its own, so any order works.

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
- **[YOUR IDEA · AI VERSION] Shortened, with real history:** Descartes really did his doubting "shut up alone in a stove-heated room" (*Discourse on Method*, Part 2); the demon is his own thought experiment (*Meditations*, I); "to be fooled, I have to exist" is his own answer to the demon: however much it deceives him, it can never make him nothing while he thinks he is something (*Meditations*, II). "It could hold up exactly one person" sets up L6, where all the Cartesians' effort yields one small ink pebble.
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
| Result | After enormous effort, one pebble of fused ink grains | Whole towns, all of them jelly |
| Why it fails | Far too few foundations to build anything on | Half-dry at best: nothing settles a doubt once it's asked |
| Art style | Ink-wash (水墨): sparse, grey, still | Fine-line heavy color (工笔重彩): crowded, gilded |

> **Narrator:** For the first time since the Whypocalypse, people had a way to fight back. The goal: dry the world solid again, the way it used to be.
> **Narrator:** They split into two schools.

**Page 1 · Cartesian foundationalism**

> **Narrator:** The Cartesians would dry only what could not be doubted. Ten thousand of them worked on it, day and night, for three hundred years.
> *(A vast crowd, sweating, ladles raised over a single spot. Y bubbles everywhere. Something small hardens.)*
> **Narrator:** All their efforts combined produced one little stone.
> *(A few grains of dry ink fuse into one irregular pebble. Polite applause.)*
> **Narrator:** It was a very good stone. Nothing anyone asked could get it wet. They are still deciding what to build.

**Page 2 · Moderate foundationalism**

> **Narrator:** The moderates didn't have three hundred years. They dried whatever seemed true, and they dried it fast.
> *(A whole town goes up in an afternoon.)*
> **Narrator:** But their ink only ever dried halfway. Everything they built was jelly.
> *(A man steps onto his new floor. It jiggles. His house sways like a pudding.)*
> **Y:** Are you sure that's solid?
> *(The town slumps into a puddle.)*
> **Narrator:** You can't build a city on jelly. They tried. Several times.

**Notes [AI DRAFT]:**
- **The pebble is the parody contrast.** Ten thousand people and three hundred years produce one small, irregular stone. It gathers a few grains like Descartes's in L5. The rectangular dry ink sticks belong to the Stranger's local footing in L7 and the Undoubted canvas demonstration.
- **Jelly** is the moderate view's problem in one picture: its foundations are neither wet nor dry, so they hold until someone asks, and then nothing can be built on them.

**Visual.** The Cartesians' crowd and five ink bubbles gather around one tiny pebble in golden ripples. The canvas card presents it on a velvet cushion. The moderates' crowded, gilded town wobbles under bright banners and slumps into a glossy puddle.

**Paper:** the foundationalist's dilemma (§1). Greco: very few beliefs meet the Cartesian standard; the moderate view lacks a clear explanation of why a stopping point can settle a doubt that's already in play.

### L7 · The Stranger: a way out, and three sacred treasures [FIXED] · ~20 sec

**[FIXED]** Right after the two schools, a short hook: someone found a way out, better than either school, and she left the world three parody-named weapons, "the Three Sacred Treasures of Good Enough." No heroes are mentioned. Whether the Whypocalypse ever ended is left open, so the audience can start to wonder whether the world they're about to see is real.

> **Narrator:** But someone found a way out.
> *(A lone figure, seen from behind, steps out onto bare ink. A stick dries under her foot.)*
> **Stranger:** It doesn't have to be undoubtable. It only has to be undoubted. Here. Now.
> **Narrator:** Not one solid world. Solid ground wherever you stood, for as long as nobody there was asking.
> **Narrator:** She left the world three legendary artifacts.
> *[Title card, full anime gold, choir:]* **THE THREE SACRED TREASURES OF GOOD ENOUGH**
> **Narrator:** Then she was gone.
> **Narrator:** And the treasures were never found.

**Notes [AI DRAFT]:**
- **The one idea the audience must leave with:** flexible foundationalism. A foundation doesn't have to be undoubtable, only undoubted, and only here and now (Greco's core claim). Everything in Part 2 builds on this line.
- **The narrator is revealed in P1:** the legend's narration was Simone's testimony in court all along. Whether the Whypocalypse ended is never stated, so the audience can start doubting the world they're in.
- **The three treasures,** one in each dream of Part 2: the Gavel (social norms, Annis, §2.1), the Hinge (hinges, Wittgenstein, §2.2), and a third for the speaker's commitment (contextualism, §3). **[AI DRAFT proposal]** The third is the Ring. Each answers to anyone who holds it (§9.2).

**Visual:** blue-green landscape (青绿山水): calm mineral blues and greens. A lone woman seen only from behind, one stick dry under her foot. Then the gold title card, and an empty sea.

**Canvas:** Story page 18 and the presentation show the Stranger’s first step from the waterline. Three artifact shapes under a cloth on the lower-left ledge foreshadow the reveal. [First-step illustration](../public/generated/backgrounds/ink-ocean/L7-stranger-covered-artifacts.webp)

---

## 5 · Part 2 · Three dreams (*Which version?*) [FIXED structure · scenes tagged one by one]

### 5.1 Notes for the dream era [FIXED: the author's requirements]

These are the requirements every draft of Parts 2 and 3 must meet.

1. **Parts 2 and 3 are the core of the presentation.** Everything before them is introduction. Once the audience understands the mechanism, the time goes to (a) flexible foundationalism under the different versions and (b) the application to access internalism.
2. **Part 2 is three parallel worlds, nested: a dream within a dream.** The courtroom breaks straight into the second dream, and the second into the third, "a dream world of dream world."
3. **Two routes, three worlds.** The routes on stage are social norms and hinges. P1 is social × sensitive invariantism (the Gavel). P2 is hinges × sensitive invariantism (the Hinge, the second Sacred Treasure). P3, a wedding, is contextualism: the speaker.
4. **A love story is hidden inside.** The focus is Simone and Cole. Simone doesn't know who Cole is. Cole has been awake for a really long time. She says "I don't love you," he says "I love you," and they can both be right.
5. **Cole knows everything and doesn't want to break it.** In the dream world he has a happy, fulfilling life with Simone, so even though he knows all of it is fake, he keeps it going. This comes out in the confrontation with the demon.
6. **The disagreement problem happens inside the story,** between the two of them, as it does in Greco's §3.
7. **The finale applies the Access section,** then turns into a moral confrontation with the demon, and the audience votes on the ending.
8. **[FIXED] Visual-novel format.** The dream-world scenes (the parallel universes) use the same visual-novel style as the courtroom-game parody in P1: a dialogue box, character portraits, shouted speech bubbles, banners.
9. **Be selective.** Reference the paper's important points; leave out trivial details (the professor has said we don't need every detail). Take liberties where they make the story or the philosophical question better.
10. **The legend is Simone's testimony inside the first dream** (P1): she's laughed at, then proves it, and she's the first hero.

**The author's proposals now in the drafts [YOUR IDEA · AI VERSION]** (direction from the author, details not yet confirmed; reasoning in §9):

- **Echo is Simone's pet, not a hero.** The legend never mentions him. He rides along in every world and only reacts (§9.3).

### 5.2 Time budget and what to leave out [AI DRAFT]

| Part | Minutes |
| --- | --- |
| Part 0 · Frame and OP | ~2.5 |
| Part 1 · Legend (L0–L7) | ~6 |
| **P1 · The Trial** | **~3** |
| **P2 · The Door** | **~5** |
| **P3 · The Wedding** | **~3.5** |
| **Part 3 · Access and the confrontation (R1–R11)** | **~4.5** |
| Vote, ending, coda | ~1.5 |
| Q&A and housekeeping | ~4 |
| **Total** | **~30: about 2 minutes over** |

Each row includes its concept slide as well as its scene (see "Presentation format"). The 2 minutes come out of P2 first, by its own cut list, then R7 and R9 in the Access sequence (open question 12).

**Keep from the paper:** sensitive invariantism via Annis (social norms); the astrology objection; Wittgenstein's hinges (*On Certainty* §341, §345) and the point that no claim has to be a hinge for every inquiry; contextualism (the speaker fixes the claim; "Oh, come on"; the commitment view; the hunger case; the disagreement problem); Access, the leak-down worry, the supervenience base, the global cognitive home, the mobile home, Peter and Justine, split confidence.

**Leave out:** Wright's "entitlement"; the quantifier and Rorty footnotes; secondary authors' names; the technical-term worry; hinges × contextualism; the knowledge route (E = K, footnotes 15–16); relativism and expressivism, beyond one line on the P3 concept slide; belief at the base (Harman); Conee & Feldman, anti-luminosity, the restricted version of Access.

### 5.3 The three dreams at a glance [FIXED structure · AI DRAFT details]

Greco's §3 moves in steps: each version runs into a problem, and the next is brought in. The dreams nest the same way: each one breaks open into the next.

| Step | Where | Version × route | Treasure | The crack, or what it plants | How it ends |
| --- | --- | --- | --- | --- | --- |
| P1 | An 1890s courtroom | Sensitive invariantism × social | The Gavel | A whole community can agree and still be wrong (astrology) | "This world is fake." The courtroom breaks into the next dream |
| P2 | A coast road and a flooded ruin | Sensitive invariantism × hinges | The Hinge | A hinge is held, never proven. Planted: Cole's half-beat flicker at "you're not lying to me" | The door bursts. White |
| P3 | A white chapel by the sea | Contextualism: the speaker | The Ring **[AI DRAFT proposal]** | The **disagreement problem**, played between Simone and Cole: both speak truly, and it's still a fight | The aisle splits. Simone wakes |
| Part 3 | The real ocean | Access (§4) | All of them | — | Cole's confession, the moral question, the vote |

**Echo [YOUR IDEA · AI VERSION]:** Simone's hermit crab is with her in every world: on her shoulder in the courtroom, in the bicycle basket on the coast road, in a ribboned carrier at the wedding, on her knee in the real ocean. He only reacts.

**Cole [YOUR IDEA · AI VERSION]:** awake for a very long time. He walks back into the dreams by choice, because that's where his life with Simone is. In every dream she meets him as a stranger.

**Visual tells [AI DRAFT]:** a faint dome of ink overhead and one dark thread in a corner of every dream frame.

### P1 · The Trial · Simone · social × sensitive invariantism · the Gavel [FIXED concept · YOUR IDEA · AI VERSION text] · ~2 min

**[FIXED: the author's requirements]** The legend was Simone's testimony all along: she was the narrator, and her first lines continue the legend. A dream-world courtroom, 1890s, in the style of the classic courtroom-battle games. One question only: **is this world real?** Simone knows the judge's gavel is the first sacred treasure and says so; everyone laughs. The judge, the calm, thoughtful one, hands it over to test it. Five short scenes.

**The Gavel's rule [FIXED: the author's design]:** say a claim, ask "Any objections?" If nobody in the room objects, BANG: it takes effect. The moment anyone objects, the effect reverts. If the objection is answered and withdrawn, the claim holds again. This is the world's own rule: dry ink goes wet again when it's questioned and nobody can answer.

**Paper:** Annis's social view, read as sensitive invariantism: you're justified in accepting a claim with no further reasons when your community raises no objection to it (§2.1, §3). Undoubted, not undoubtable. The astrology objection (§3): a whole community can treat something wrong as unobjectionable, and that doesn't make it right. **[FIXED]** The scene only shows this, it never says it; the presenter explains it if needed.

**P1.1 · The Testimony**

> *(The legend's last painting pulls back. The narrator's voice was coming from the witness stand.)*
> **Simone:** …and the treasures were never found. Until now. That's the legend, and this world is part of it. It's fake. *(She points at the bench.)* And that gavel, Your Honor, is one of the treasures.
> *(The gallery roars with laughter. Only the judge doesn't laugh. He glances at the gavel in his hand.)*

**P1.2 · Court Is Now in Session**

> *(Above the bench hangs a great brass zodiac wheel. Nobody looks at it twice.)*
> *[Banner:]* **COURT IS NOW IN SESSION**
> **Judge:** The stars favor this session. *(The jurors nod.)* The defendant stands accused of spreading the rumor that this world is fake.
> **Prosecutor** *(smirking)***:** The world is real, My Lord. Nobody here doubts it.
> **Judge:** Does anyone object? *(Silence. BANG.)* So ordered. The world is real.
> *(The floor gleams, solid.)*
> **Simone:** My Lord, may I borrow your gavel?
> *(The gallery howls. The judge looks at the gavel, then at her. A long pause.)*
> **Judge:** …Show me.

**P1.3 · Not Guilty**

> **Simone:** The defendant is innocent. Any objections?
> *(Silence. BANG. "NOT GUILTY" confetti rains down. Her shackles fall off.)*
> *(The laughter stops.)*
> **Prosecutor:** **OBJECTION!**
> *(The confetti flies back up into the ceiling. The shackles snap back onto her wrists.)*
> **Simone** *(looking at the gavel)***:** …So that's how it works.

**P1.4 · The Dream**

> **Simone:** The prosecutor is dreaming. Any objections?
> *(Silence. BANG. He slumps over the desk, snoring, a nightcap on his head.)*
> *(The whole room is silent. Then, from the very back of the gallery, a small old woman stands up.)*
> **Old woman:** **OBJECTION!** My son never sleeps on the job!
> *(POP. He jolts awake, nightcap gone.)*
> **Prosecutor:** …Mother?
> **Judge** *(calmly)***:** …Hm.

**P1.5 · The Verdict**

> **Judge** *(quietly)***:** Go on.
> **Simone:** This world is fake. Any objections?
> **Prosecutor:** **OBJECTION!** Worlds don't just turn out to be fake!
> **Simone:** **TAKE THAT!** *(She raises the gavel.)* And gavels don't rain confetti from nowhere, or put a man to sleep mid-sentence. You all saw it. Which real world works like this?
> *(The prosecutor sweats. His mother slowly sits down. The jurors look up at the ceiling where the confetti went.)*
> **Prosecutor:** …I withdraw the objection.
> *(Silence. BANG. Cracks race across the walls, the windows, the sky. The dream breaks.)*

**What each beat teaches (the concept slide has already explained the theory):**

| Beat | Paper point |
| --- | --- |
| P1.3 · nobody objects, the confetti falls | The social route: no objection, so the claim is justified and takes effect |
| P1.3 · one objection, the confetti flies back | The justification lasts only while nobody objects |
| P1.4 · everyone silent but one old woman in the back | Not a majority vote: anyone in the community objecting is enough |
| P1.4 · the dreaming prosecutor | A quiet hint: everyone in the room is dreaming too |
| P1.5 · TAKE THAT, then the objection withdrawn | Undoubted, not undoubtable: an objection that has been answered no longer blocks the claim |
| P1.2 · "The world is real" holds; the zodiac wheel; the jurors nod at "the stars favor this session" | The astrology objection, shown and never stated: a whole community can accept something wrong, and the rule still counts it as justified. The audience already knows this world is fake |

**Notes [AI DRAFT]:**
- **The judge** is the calm, thoughtful one: he never laughs, hands over the gavel, and says only "…Hm." and "Go on." He's the lighthouse keeper, the one person in the dream who half-suspects the truth.
- **Why the prosecutor can't object in P1.4:** he's asleep. If he could object, he'd undo it himself, and his mother's objection is the point.
- **Courtroom-game format:** the session banner, "My Lord," the shouted "OBJECTION!", "TAKE THAT!" when Simone presents her evidence, the sweating prosecutor.
- **Scope:** "anyone in the room" is simpler than Annis's exact objector group (the people whose objections count by the community's standards). Mention it in Q&A if asked.

**Visual:** a courtroom in the style of classic courtroom-battle games: warm wood panels, the judge's bench high in the center with a large brass zodiac wheel above it, a jury box of six, the gallery behind, jagged shout bubbles, screen shake on each BANG. Simone at the stand, Echo peeking from her carrier. Snow and a frozen lake through the tall windows. New art: P1.3 (confetti and shackles) and P1.4 (the prosecutor asleep in a nightcap; his small old mother standing at the back of the gallery). P1.1, P1.2 and P1.5 reuse the courtroom image with the zodiac wheel added. A homage to the genre only: don't copy any existing character, logo or sprite.

### P2 · The Door · Simone and Cole · hinges × sensitive invariantism · the Hinge [YOUR IDEA · AI VERSION · chant and filler lines AI DRAFT] · ~4–4.5 min

**[YOUR IDEA · AI VERSION]** The next dream nested inside the first: a parody of *Suzume* (2022). It reuses the film's best-known beats: the meeting on the seaside road, the lone door in a flooded ruin, the dark column rising over the town, two people holding the door shut while one of them chants, and the white flash. The courtroom dissolves straight into this world, and Simone meets Cole at once. The moment he turns and asks about a door triggers her memory. He walks away. She finds the source alone: an empty frame with one brass hinge and no door. Cole comes back to help her close it. Each hinge they speak aloud snaps one plank of dried ink onto the frame while the flood grows, so they speak faster and faster. Just before the door shuts, everything bursts out and the screen goes white. The second Sacred Treasure in this scene is a **hinge**.

**Paper:** Wittgenstein's hinges (§2.2): "the questions that we raise and our doubts depend on the fact that some propositions are exempt from doubt" (*On Certainty* §341), and the color example (§345): to ask one thing, you can't at the same time question whether the other person understands you, whether he wants to take you in, or whether your memory is failing you. Read as sensitive invariantism (§3): whether a subject has foundational justification to believe a claim depends on what inquiries she's engaged in, and whether she must treat that claim as a hinge, "a theoretical fixed point," to carry them out. Flexible: no claim has to be a hinge for every inquiry (§2.2).

**Rules of this world [YOUR IDEA · AI VERSION]:**
- Everything here is ink except the hinges. Doors are dried ink. The question marks are the Whypocalypse, the endless "why?" from the legend.
- Each hinge spoken aloud burns into the brass as words, and one plank of ink snaps onto the door.
- Hinges are held, never proven. Nobody in this scene says "I prove" or "it is certain."
- Every chant line is first-person, about the speakers' own inquiry. Cole never declares Simone's belief foundational on her behalf.

**Page 1 · "Have you seen a door around here?" [YOUR IDEA · AI VERSION]**

> *(The courtroom dissolves into bright sea light. Simone is on a bicycle on a coastal road, Echo in the basket. She has no idea how she got here.)*
> *(Up ahead, a young man with a backpack walks uphill. He hears the bike, turns and looks at her. For a moment, something like recognition crosses his face.)*
> **Cole:** Have you seen a door around here?
> *(Simone stops. His face. That question. Something cracks open.)*

**Page 2 · Flashback, three quick cuts [YOUR IDEA: the flashback and the view through the door · AI DRAFT lines]**

> *(Sunset. A sea wall. Cole is streaming, orange chat slips drifting around him.)*
> **Cole:** Quick: what color is the sky?
> **Simone:** Orange.
> **Cole:** See? You didn't check whether I was messing with you.
> **Simone:** Were you?
> **Cole:** Never.
>
> *(An old door in the ruins. The two of them stand before it.)*
> **Cole:** Doubt anything you like. But when I call your name, you answer. Start there.
>
> *(Through the open door: a white chapel by the sea. Petals. Someone at the end of the aisle. Simone can't look away.)*
> **Cole** *(gently pulling her back)***:** Don't look too long. The prettiest worlds are the hardest to leave.

**Page 3 · He walks away [YOUR IDEA: she doesn't know who he is · AI DRAFT lines]**

> *(Back on the road. Simone can't make a sound.)*
> *(Cole waits. Then he smiles, a little sadly, as if he expected this.)*
> **Cole:** …Never mind.
> *(He walks on uphill.)*
> **Simone** *(thinking)***:** *(I know him. I don't know how I know him.)*

**Page 4 · The omen [AI DRAFT]**

> *(A few minutes later, Simone walks her bike through a quiet town. Echo's shell starts to rattle like an alarm.)*
> *(Above the hilltop, a thin black thread rises into the sky. It is made of tiny question marks.)*
> **Simone:** …What is that?
> *(Nobody else in the street looks up.)*
> *(She drops the bike and runs uphill.)*

**Page 5 · The source [YOUR IDEA: the empty frame with one hinge · AI DRAFT lines]**

> *(A flooded ruin on the hilltop. Where a door should be: an empty frame with one brass hinge. Question marks seep out of it like fog across black ink water.)*
> **Simone:** So that's the door he meant.
> **Simone:** Is this even real—
> *(More pour out. Every question she asks feeds it. The thread swells into a roaring column:* **WHY? WHY? WHY?***)*
> **Simone** *(raising the Gavel)***:** This world is fake! Any objections?
> *(BANG. Only her own echo.)*
> **Simone:** …No jury.
> **Simone:** There's no door. How do I close a door that isn't there?!
> *(The ground around her starts to melt.)*

**Page 6 · No time to explain [YOUR IDEA: the chant explains the hinges; each line adds a plank; faster and faster · AI VERSION lines]**

> *(Splashing footsteps. Cole arrives, out of breath.)*
> **Simone:** You—!
> **Cole:** No time to explain. Do it with me.
> **Cole** *(eyes closed, hand raised)***:** O Hinges! Fixed Points Theoretical! You who have held still for generations, that we might doubt all else!
> *(The hinge glows.)*
> **Cole:** Simone!
> **Simone:** …Here!
> *(*MY NAME IS SIMONE *burns into the brass. The first plank of dried ink snaps onto the frame.)*
> **Cole:** To ask, our words must mean!
> **Simone:** Our words must mean! *(Plank.)*
> **Cole:** What we remember, we remember! *(Plank.)*
> *(The flood surges. They push the half-built door together, faster.)*
> **Simone:** To see it shut, my eyes must— *(She falters. A minute ago she doubted them.)*
> **Cole:** Different door, different hinge!
> **Simone:** —WORK! *(Plank.)*
> **Cole:** The ground holds! *(Plank.)*
> **Simone:** The door is here! *(Plank.)* And you—you're not lying to me!
> *(Cole's eyes flicker. Half a beat. Plank.)*

**Page 7 · White [YOUR IDEA: everything bursts out and the screen goes white · AI VERSION lines]**

> *(One gap left. The door shudders on its hinge. Lines of words glow all over the brass.)*
> **Cole:** For this door, and this door alone—
> **Simone:** —we take you as given, without further reasons!
> **Both:** These questions we return to you: CLOS—
> *(Everything explodes. WHITE.)*
> **Simone** *(on the white, small)***:** …I'm off.
> *(Organ music. The white slowly becomes a wedding. Simone opens her hand: the hinge, cold and silent.)*

*[Caption option for Page 7:]* "If I want the door to turn, the hinges must stay put." — Wittgenstein, *On Certainty* §343

**What each page teaches (the concept slide has already explained the theory):**

| Page | Paper point |
| --- | --- |
| 1–3 · The meeting, the flashback, "Never mind" | To ask one thing, you take others for granted: Simone answers "Orange" without checking that Cole understands her or isn't tricking her (*On Certainty* §345, quoted by Greco) |
| 4–5 · The thread, the empty frame, the column | Questions with nothing exempt from doubt never stop (§341). This is the regress again. The Gavel does nothing: the social route needs a jury |
| 6 · The chant and the planks | The door is made of what she holds fixed. The lines are §345's own list: the words mean something, memory holds, the other person isn't deceiving you |
| 6 · Her eyes falter; "Different door, different hinge!" | Flexible: no claim has to be a hinge for every inquiry (§2.2) |
| 6 · "You're not lying to me!" | A hinge for her inquiry, held without proof |
| 7 · "For this door, and this door alone" | Sensitive invariantism: it depends on the inquiry she's engaged in (§3) |
| 7 · "Without further reasons" | Foundational justification: it supports other claims without needing support |

**Notes [AI DRAFT]:**
- **Cole** has been awake for a long time and knows Simone. She doesn't remember him. Whether this Cole is real or part of the dream stays unanswered. His flicker at "you're not lying to me" is the hook.
- **Echo** only reacts: his shell rattles at the omen, and he rides in the bicycle basket.
- **[FIXED] No personal talk at the door.** Once the flood starts, everything is urgent: they're busy closing the door, not talking. Nothing after Page 3 hints at who Cole is to her. Their real meeting, and the love lines, are saved for the wedding (P3).
- **Time:** the scene runs ~4–4.5 minutes, longer than P1. If it has to shrink, cut in this order: the Gavel beat on Page 5; merge Pages 3 and 4; "The ground holds!" and "The door is here!". Keep "Never mind," the eyes faltering, and "you're not lying to me."

**Visual:** a luminous, painterly animated-film look: towering cumulus skies, sparkling sea light, lens glow, overgrown ruins and flooded floors with reflections. Everything except the hinge is ink: the column is made of tiny black question marks, the door planks are dried black ink, and the brass hinge carries glowing engraved lines. A homage to the genre only: don't copy any existing character, logo or film frame. Shot list: [p2-door-world-shot-list.md](story-illustrations/p2-door-world-shot-list.md).

### P3 · The Wedding · Simone and Cole · contextualism · the disagreement problem [YOUR IDEA · AI VERSION · lines AI DRAFT] · ~2.5 min

**[YOUR IDEA · AI VERSION]** The third dream, a dream inside a dream: the white flash from the door becomes a wedding, in the chapel Simone glimpsed through the door in P2. Cole is the groom. She doesn't remember him. The love story sits inside the philosophy: he says "I love you," she says "I don't love you," and both can be right. Then they clash over something they can't both be right about so easily, and the dream splits down the aisle.

**Paper:** §3, the contextualist version (pp. 430–431). "Oh, come on" as ordinary talk that treats a belief as a starting point. The commitment view: in calling a belief foundationally justified, I state that I'm committed to treating it as such, not asking for further reasons and accepting it as a reason for more. The hunger case: "I'm hungry" and "I'm not hungry" don't disagree; both can be right. The disagreement problem: on the commitment view, two people who call the same thing foundational and not foundational are each stating their own commitment, so both speak truly, yet it's plausible that they really disagree.

**Rule of this world [AI DRAFT]:** ink dries on words. A sentence dries the moment its speaker stands behind it, and it dries under the speaker.

**Beat 1 · The aisle [YOUR IDEA: the white becomes a wedding; Cole is the groom; she doesn't know him · AI DRAFT lines]**

> *(Organ music. The white becomes a chapel by the sea. Petals. Simone is in a wedding dress, the Gavel and the Hinge tucked into her bouquet, Echo in a ribboned carrier. Guests made of ink cubes turn to look.)*
> *(At the end of the aisle: the man from the coast road, in a suit. Between them stands the old judge, a book open in his hands.)*
> **Cole** *(quietly)***:** You came.
> **Simone:** I don't know who you are.
> **Cole:** I know.

**Beat 2 · "Oh, come on" [AI DRAFT]**

> **Cole:** I love you.
> *(The words float out as a ribbon of ink and dry at once.)*
> **Simone:** What makes you think that?
> **Cole:** Oh, come *on*.
> *(No reason behind it. It holds anyway.)*
> **Narrator:** Some things Cole simply refused to defend. Philosophers call that foundational. Cole called it obvious.

**Beat 3 · Both right [YOUR IDEA · AI VERSION lines]**

> **Simone:** I don't love you.
> *(Her ribbon dries too. The guests gasp. Neither ribbon wobbles.)*
> **Narrator:** Nobody had said anything false. He was telling her about Cole. She was telling him about Simone.

**Beat 4 · The fight [AI DRAFT · a proposal, not confirmed]**

> **Judge:** The ring.
> *(Cole takes her hand. Under their feet the aisle is dry and white.)*
> **Cole:** What we have is solid ground. I'm building on it.
> **Simone:** It's built on nothing.
> *(Both sentences dry. His under him. Hers under her.)*
> **Narrator:** Each of them was only saying what they would stand on. So both spoke truly, again. Then why did this one feel like a fight?
> *(A crack runs down the aisle between them. Echo's shell rattles.)*

**Quiz Q4.**

**Beat 5 · The aisle splits [AI DRAFT]**

> *(The judge holds out one ring. Cole's hand is steady. He has done this before.)*
> **Cole:** Stay. It's a good life. I promise you it's a good life.
> **Simone:** How would you know?
> *(Half a beat. The same flicker as at the door.)*
> *(Simone takes the ring. She doesn't put it on. In her other hand, the hinge.)*
> **Simone:** You told me the prettiest worlds are the hardest to leave.
> **Cole** *(very quietly)***:** …You remembered.
> *(The crack reaches the altar. The chapel splits along the aisle into two dry floors, drifting apart. White pours in between them.)*

**The third treasure [AI DRAFT proposal]:** **the Ring.** Whoever wears it stands behind their word: what they vow dries under them, and only under them. It is the speaker's commitment made into an object (§3). Simone leaves the chapel with it unworn and first puts it on in R9. P3 also plays without it: the lines dry on being spoken, and the judge's "The ring" is only a wedding cue.

**What each beat teaches (the concept slide has already explained the theory):**

| Beat | Paper point |
| --- | --- |
| 2 · "What makes you think that?" "Oh, come on." | Ordinary talk already treats some beliefs as starting points: refusing to give a reason is how people mark a foundation (§3) |
| 3 · "I love you." / "I don't love you." | The hunger case: each speaker is talking about themselves, so there's no disagreement and both can be right |
| 4 · "Solid ground." / "Built on nothing." | The commitment view: each states what they're committed to treating as a foundation, so both speak truly |
| 4 · "Then why did this one feel like a fight?" | The disagreement problem: the view makes it look like the hunger case, but it's plausible they really disagree (§3) |
| 5 · The aisle splits | The contextualist version, as it stands, can't say who's right. Greco leaves this open |

**Notes [AI DRAFT]:**
- **Why two exchanges.** "I love you" and "I don't love you" are about two different people, so they can't carry the disagreement problem by themselves. The problem needs one thing both of them are judging: whether their life together is a foundation.
- **Cole knows this life is fake and wants it anyway.** His flicker at "How would you know?" is the same one as at the door. Both are paid off in R6 and R11.
- **"You remembered"** refers to the line from the P2 flashback, the one fragment she has. She still doesn't know who he is.
- **The old judge officiates:** the same calm figure as in P1, who half-suspects the truth.
- **Echo** only reacts: his shell rattles when the aisle cracks.
- **If it has to shrink:** fold Beat 2 into Beat 3 (keep "Oh, come on"), and cut "It's a good life. I promise you it's a good life."

**Visual:** a small white chapel by the sea, the one seen through the door in P2: soft bloom, drifting petals, pale wood. Spoken lines float out as ribbons of ink and dry in the air. The crack is a thin black line down a white aisle. Cole in a suit, without his phone or ring light.

---

## 6 · Part 3 · The real ocean (*What does this explain?*) [FIXED concept · AI DRAFT scenes]

### R1 · Awake [AI DRAFT]

> *(The white drains away. A grey ocean to the horizon. Domes of ink in every direction, a sleeper curled inside each. Simone sits on one dry plank, Echo on her knee. In her lap: the Gavel, the Hinge, the Ring.)*
> *(Beside her, already standing: Cole. No suit. He looks as if he has stood here many times.)*
> **Simone:** Is this one real?
> **Cole:** This is the one you wake up in.
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

Planted earlier: the prophecy (L3); Descartes's hypothetical demon (L5); the dark sleeve at the guardian question mark (L1).

### R3 · The goal [FIXED: save the dreamers · AI DRAFT details]

> **SOWHAT:** The rest of them are still dreaming. Every night, I ask them the same thing.
> **Y:** Why believe you're justified?
> **Narrator:** The doubt leaks down. Nothing under them can dry. They never wake.
> **Simone:** Then we wake them.
> *(On the horizon stands a lighthouse, the one place the demon's storm hasn't reached. It's dark.)*
> **Simone:** Which way is it?
> **Cole** *(a beat too long)***:** …North. I've walked it.

### R4–R10 · The Access sequence, following §4 of the paper [FIXED concept · AI DRAFT beats]

Cole plays Peter and Simone plays Justine: what he told her fixes what she should believe, until his honesty comes into doubt.

| ID | Story | Paper (§4) |
| --- | --- | --- |
| R4 · Grounds | Cole has told her the way: *north*. Taking for granted that he's honest and she heard him right, what he said fixes which way she should go. A teal stick dries under her: NORTH. | Given Peter's honesty and Justine's hearing, what he said fixes what she should believe. |
| R5 · The attack | **Y:** Why believe he said north? **SOWHAT:** So what? Can you even tell whether you're justified? The stick softens; Simone sinks to her ankles. | The leak-down worry: doubt about your grounds carries over to the belief. That's why Greco wants Access. |
| R6 · He knew **[YOUR IDEA · AI VERSION]** | **Demon:** Ask him how long he's been awake. *(Cole says nothing.)* **Demon:** The courtroom. The door. The wedding. He knew every one of them was mine. *(In Simone's hand, one line on the Hinge goes dim: YOU'RE NOT LYING TO ME.)* **Simone:** Were you messing with me? **Cole:** Never. I just never said. **Narrator:** If her grounds were whatever Cole *really* meant, the demon could hide that from her, and she'd have no way to tell what she should believe. | The supervenience base: if justification depended on facts she can't get at, she could be misled about her own grounds. Peter turns out to be a prankster, or he mumbled. |
| R7 · The tempting retreat | **SOWHAT:** Then retreat into your own mind, like Descartes. The grain-sized *I think* stick, the only belief that never got wet, drifts up beside her. **Simone:** That's very small. **Narrator:** It was. It always had been. | A global cognitive home, always-knowable facts big enough to fix all justification, is too much to ask. |
| R8 · The mobile home | Echo climbs out of his shell and into an empty one drifting past. *Clack.* **Simone:** Then I'll move too. She stops asking "Was he honest?" and asks "Given what I can know here, which way?" Far off, the dark lamp catches the light once. She saw that herself. The **Hinge**: for this walk, she holds fixed that her eyes work. *Different door, different hinge.* The **Gavel**: "North. Any objections?" Cole, the only one there who could object, stays silent. BANG. It dries. **Quiz Q5.** | The mobile home: in each context, the facts that fix justification must be ones the subject is in a position to know. Justine falls back on Peter's email. |
| R9 · Split confidence | The glint was faint. She puts on the **Ring [AI DRAFT]** and says only what she'll stand behind. **Simone:** Probably north. Maybe north-east. A stick dries for *that*, pressed with both words. **Narrator:** She didn't know where the lighthouse was. She knew exactly how sure to be. | Footnote 36: she may only be justified in spreading her confidence, and Access holds if she can know how to spread it. |
| R10 · Access, and arrival | **Cole:** What makes you think that? No "Oh, come on" this time. Simone tells him: the glint she saw, what she's holding fixed, her best guess. Cole looks at her for a long beat, and steps aside. She steps forward; a stick dries ahead of her and the one behind melts. Step by step through the storm, she reaches the lighthouse and puts her hand on the lamp. **Narrator:** Her ground didn't stay put. It came with her. Like Echo's. | Access holds context by context. A new doubt can move the home again. |

**If it has to shrink [AI DRAFT]:** cut R7, then R9.

### R11 · The moral question [FIXED concept · AI DRAFT text · Cole's confession YOUR IDEA · AI VERSION]

> *(Simone at the lamp. The strings tighten across the sky.)*
> **Demon:** There is no ground. There never was. Your old world dried on "because my mother said so." I didn't drown it. I showed you it was water.
> **Simone:** You're right. There's no ground under the ocean.
> *(beat)*
> **Simone:** There's ground under me.
> **Demon:** Then decide for everyone else. Wake them, to what? An ocean with no floor. The moment they start asking properly, half of each of them melts. In my dreams, each of them is whole: one world, one rule, home. Who are you to take that?
> **Demon:** Ask the one who has been awake the longest.
> *(Simone turns. Cole hasn't followed her to the lamp.)*
> **Cole:** I knew. Every time. Out here there's a plank and a grey sea. In there, I had a life with you.
> **Simone:** It was fake.
> **Cole:** I know. I was happy. So were you.
> **Simone:** I don't remember.
> **Cole:** I do.
> **Demon:** And you. What are *you* made of?
> *(Simone looks down at the sticks of her own body. Near her heart: ECHO IS SAFE WITH ME. It dried long ago, on no reason at all.)*
> *(Echo climbs onto the lamp, turns to face the audience, and raises his claw. Waiting.)*
> **Narrator:** Nobody in the story can answer this one. So we're asking you.

**Notes [AI DRAFT]:**
- **The epistemic question is settled before the moral one opens.** Simone has already answered the skeptic: there's no ground under the ocean, but there is ground under her. What's left open is what to do about everyone else.
- **Cole is the demon's best case.** He is awake, he knows the dream is fake, and he chose it anyway. He never lied to her: her hinge was true. He just never said.
- **This stays within the paper:** Greco's §3 runs on moral analogies (a community approving of something wrong; speaker relativism in ethics).
- **The demon remains the antagonist** (it trapped everyone in dreams), but it gets the skeptic's best argument (§1.1c).
- **Echo** only reacts: his raised claw is the cue for the vote.

### R12 · The vote, and three endings [FIXED concept · AI DRAFT endings]

Every audience screen shows three choices for 15 seconds. The majority ending plays. Afterwards, the canvas can show the other two.

| Ending | What happens |
| --- | --- |
| **A · Light it** | The beam sweeps across the ocean and into every dome. Dreamers wake, melt a little, then find a stick that holds, then another. **Narrator:** "It hurt. Then they stood." **Simone:** "You can take my truth. You can't take my footing." The strings go slack. SOWHAT drops free and lands on Simone's other shoulder, next to Echo. Cole holds out his hand. **Cole:** "Hi. I'm Cole." **Simone:** "…Simone." |
| **B · Let them sleep** | Simone takes her hand off the lamp. Cole holds out his hand. Organ music; the white comes back. The domes glow on, each one home to someone. **Narrator:** "Everyone was happy. Nobody was right." The strings stay taut. |
| **C · Teach the question** | Simone pulls SOWHAT off its strings and sets it beside the first dome. In its own small voice, it asks the dreamer one question, and waits for an answer that matters. **Narrator:** "It wasn't the end of questions. It was the end of questions that never end." |

After every ending: the title card in the same mock-anime style as L7's title card, **THE END.** *(beat)* **(Probably.)**

**What each ending means [AI DRAFT]:**
- **A:** truth over comfort; Access lets people stand without bedrock. Simone and Cole start again, awake.
- **B:** the astrology objection on a world scale: comfort a community accepts isn't justification. Cole gets his life back.
- **C:** flexible foundationalism as a practice: neither the lazy guardian nor the endless demon, but questions that come when they matter.

**Staying honest [AI DRAFT]:** in no ending is the demon destroyed or the ocean proved real. Unit 2.2 already raised the worry that contextualism gives no reply to the skeptic. What changes is whether people can tell what they're justified in believing. Greco's paper never mentions the demon; present it as the class's skeptic from Units 2.1–2.2 meeting Greco's tool. The bridge to the paper is §4's Peter and Justine.

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

The classroom vote (B or 13) opens the presentation in S0.3. In Parts 2 and 3, each quiz asks the audience to spot the point of the scene before the narrator says it.

| # | Scene | Question (correct answer in italics) | Ingredients revealed |
| --- | --- | --- | --- |
| Q2 | P1 | The whole court agrees the world is solid, and the floor dries. What should Simone point out? (a) The court would object. (b) *A whole community can agree and still be wrong.* (c) The gavel decides what's true. | The Gavel + Simone's community (social × sensitive invariantism) |
| Q3 | P2 | Simone falters at "my eyes must work": a minute ago she doubted them. Why can she hold it now? (a) She has proved her eyes work. (b) *Closing this door is a different inquiry, and this inquiry needs that hinge.* (c) Cole told her to. | The Hinge + Simone's inquiry (hinges × sensitive invariantism) |
| Q4 | P3 | "It's solid ground." / "It's built on nothing." If each of them is only stating their own commitment, what's the problem? (a) One of them is lying. (b) *Both would be right, like "I'm hungry" / "I'm not," yet it feels like a real disagreement.* (c) The guests decide who's right. | The speaker's commitment (contextualism) |
| Q5 | R8 | Cole's honesty is in doubt. What should fix Simone's grounds now? *Facts she can know here: the glint she saw, what she holds fixed for this walk, her best guess.* | — |

---

## 8 · Open questions for the dream era (AI defaults used in the drafts above)

| # | Question | AI default |
| --- | --- | --- |
| 1 | Is there a third treasure? | Yes, so L7's "three treasures" and its artwork stay as they are. Proposal: the Ring, the speaker's commitment, found in P3 and first worn in R9. The alternative is two treasures, with a new L7 title card and illustration |
| 2 | The real clash in P3 (Beat 4): "solid ground" / "built on nothing" | Use it. "I love you" / "I don't love you" is Greco's hunger case; the disagreement problem needs one thing they both judge |
| 3 | How the wedding ends | The aisle splits into two dry floors. Simone leaves with the ring unworn |
| 4 | Where Cole's secret comes out | The demon reveals it at R6, as the attack on Simone's grounds. Cole explains himself at R11 |
| 5 | Did Cole lie? | No. "Never. I just never said." Her hinge was true |
| 6 | Rae (relativism) and Echo's expressivism: bring them back? | Not in the main line. One line on the P3 concept slide: the disagreement problem is what moves some philosophers to relativism or expressivism |
| 7 | Endings: A, B and C, or only A and C? | All three |
| 8 | Number of quizzes in Parts 2–3 | Four (Q2–Q5) |
| 9 | Professor coda | Keep |
| 10 | The demon: villain, or a misunderstood truth-teller? | Villain, with the skeptic's best argument at R11 |
| 11 | Does Echo ever speak? | Never. Only claws |
| 12 | Timing: the §5.2 table runs about 2 minutes over the 28 | Shrink P2 by its own cut list; cut R7, then R9 |
| 13 | Who officiates at the wedding? | The old judge from P1 |
| 14 | The opening film introduces Simone, Cole, Rae and Echo (S0.5). Keep it as it is? | Keep |

---

## 9 · Design rationale: the author's questions, the paper checks, and why

This section keeps the reasoning behind recent decisions in one place: what the author asked, what Greco's paper actually says, which references were used, and what was corrected. It records reasons, not old versions of scenes.

### 9.1 The legend as anime parody, and the transition into the first dream (P1)

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

**Why a courtroom (the author's idea):** a jury of peers *is* social justification made visible: a belief counts as settled when nobody in the relevant group objects (Annis). The gavel and "Any objections?" turn the route into one gesture, and the courtroom "OBJECTION!" is the parody target, because the social route is literally about objections. The legend becomes Simone's testimony, so the narrator's identity is the reveal.

**Why the town's verdict is wrong:** their consensus really does make the floor solid, which shows the social route working, and they're still wrong, because they're dreaming. That one scene also plants the astrology objection: a whole community can agree and still be wrong.

### 9.2 Treasures and worlds: does each route have one perfect match?

**The author's question:** should only the right person be able to use each treasure? That depends on whether the paper matches each route to exactly one version.

**Paper check:** it doesn't. In Greco, routes and versions aren't one-to-one:
- **Social norms** pair with both sensitive invariantism and contextualism (§3).
- **Hinges** also pair with both.

**Decision:** "only the chosen one can wield it" would misstate the paper. Each treasure is a route, and it answers to anyone who meets its condition. The Gavel needs a jury: in the flooded ruin Simone bangs it and gets only her own echo. The Hinge needs an inquiry: "For this door, and this door alone."

**The third treasure [AI DRAFT proposal]:** the routes on stage are two, and the third world is a version, contextualism. So the proposed Ring stands for the speaker's commitment rather than for a third route. A wedding ring is the plainest picture of the commitment view: saying the words is taking on the commitment.

| | **Gavel** (social) | **Hinge** (hinges) | **Ring** (the speaker's commitment) **[AI DRAFT]** |
| --- | --- | --- | --- |
| What dries | What nobody present objects to | What you must hold fixed to carry out the inquiry in front of you | What the speaker stands behind |
| Where it comes from | Other people | The inquiry | The speaker |
| Can it be false? | Yes: a whole court can agree on something wrong | Yes: a hinge is held, not proven | Yes |
| What breaks it | Any objection nobody can answer | The inquiry changes | Nothing breaks it, and that's the problem: two speakers can both stand firm and still be fighting |

### 9.3 Echo: the one who only reacts

**The author's idea:** the legend never mentions Echo. He is Simone's pet, not a hero.

**Design:** Echo stays the Version C hermit crab, which is a fixed design. He never speaks. He reacts: a rattle of the shell, a raised claw. The model is Gromit in *Wallace & Gromit*: silent, expresses everything.

**Echo's beats:** P1 (the only one in the courtroom who doesn't laugh), P2 (in the bicycle basket; his shell rattles at the omen), P3 (in a ribboned carrier; his shell rattles when the aisle cracks), R8 (the shell swap, which is the mobile home in one image), R11 (faces the audience and raises his claw: the cue for the vote).

**Avoided:** the pet-who-betrays twist (Scabbers in *Harry Potter*, Kyubey in *Madoka Magica*). The demon and Cole already carry the moral ambiguity.

### 9.4 The love story, checked against §3 and §4

**The author's idea:** the story is mostly about Simone and Cole, a love story hidden inside the philosophy. Simone doesn't know who Cole is; Cole has been awake for a really long time. She says "I don't love you," he says "I love you," and they can both be right, because she has no memory of him at all. In the confrontation with the demon it comes out that Cole knows everything but doesn't want to break it, because in the dream world he has a happy, fulfilling life with her.

**What Greco says:**
- **The commitment view (§3):** in calling a belief "foundationally justified," I state that I am committed to treating it as such: not asking for further reasons when people express it, and accepting it as a reason for further beliefs.
- **The hunger case (§3):** if I say "I'm hungry" and you say "I'm not hungry," we aren't disagreeing; we can both be right.
- **The disagreement problem (§3):** the commitment view makes "that's foundationally justified" / "no, it isn't" look like the hunger case. But when one person calls an action right and another calls it wrong, it's plausible that they really disagree.
- **Peter and Justine (§4):** what Peter said fixes what Justine should believe, as long as we take him to be honest and her to have heard him. If he might be a prankster, or might have mumbled, we look for another base that she is in a position to know.

**Check:**

| The author's line | What the paper supports | Verdict |
| --- | --- | --- |
| "I love you" / "I don't love you": both can be right | This is the hunger case: each speaker reports on themselves | ✅ Exact, as the setup |
| They're not really disagreeing | True of the love lines. The disagreement problem needs a pair that *feels* like a real disagreement | ⚠️ Added: "solid ground" / "built on nothing" **[AI DRAFT]** |
| Cole knows everything and doesn't want to break it | Cole is Peter: the one whose word fixes what Simone should believe, until his honesty is in doubt (§4) | ✅ Fits R4–R8 |

**What the love story does for the paper:** the same two people carry the hinge ("you're not lying to me," P2), the disagreement problem (P3) and the Access case (Part 3), so the audience follows one relationship instead of three setups.

### 9.5 The core mechanism, stated at the start (L0)

**The author's requirement:** explain the world's one core mechanism at the very beginning of the Legend, as pure explanation with one image, not a string of demo scenes. Everything is made of ink beliefs. Belief is concrete and has two forms: solid, which you can build on, and liquid. To make a belief solid it must withstand questioning, from the sacred question mark at the Inkwell and from anyone else. If someone questions it and you can't answer, or they can keep asking, it never solidifies.

**What the AI added, and why:**
1. **"Withstand" means the questioning stops, not that the answer is good.** The guardian accepted "my mother says so," and the ink still dried. If only good answers dried ink, three later beats would break: the guardian joke (L1), "undoubted, not undoubtable" (L7), and the astrology objection in P1, where a community's lazy approval lets a false belief dry.
2. **Re-wetting, stated plainly.** "If someone questions a dry belief and you have no answer, it goes wet again" wasn't in the author's statement of the mechanism, but it follows from the author's rule that ink dries only while nobody is asking. It is stated as a plain sentence, not a metaphor.
