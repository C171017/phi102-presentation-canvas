# Handoff: finish the PHI 102 presentation canvas (Greco 2017)

Written 2026-11-13 by a Claude session that could read this folder but could not build natively or push. It did the investigation and design and started the illustration kit. **Nothing in the repo's tracked files has been changed yet.** Everything from that session is in this `docs/handoff/` folder.

## The user's request (verbatim intent)

Find the presentation canvas, read what exists, read the assigned paper, reason through it, then **build the entire canvas for the whole paper** as the logical completion of what is there. It should look complete, well organized, and visually coherent: a **sketched editorial style with shadows, a pseudo-3D / 2.5D feel**. Infer reasonable implementations from the existing work and from `docs/chat-history/`. When done: **git add, commit, push**.

## Facts established

- **Paper**: Daniel Greco (not John Greco, as one old transcript says), "Contextualism about Foundations" (2017), Routledge Handbook of Epistemic Contextualism.
  - Clean text: `../output/text/Greco - Contextualism about Foundations - clean.txt`
  - PDF: `../Course Materials/2026-10-13/Presentation Materials/10. Greco (2017) ... .pdf`, also `public/readings/greco-2017.pdf`
- **Assignment** (`../Course Materials/2026-10-13/Presentation Materials/0. Presentation Slots .txt`): Slot 10, Dec 3. "Present the author's contextualism about foundations (basic beliefs), called flexible foundationalism: foundations must be undoubted in context, not indubitable. Cover its contextualist and relativist versions and its application to access internalism." 28-minute slide presentation plus 10-minute Q&A, group of four.
- **Rubric** (`.../Slide Presentation Rubric.txt`): one or two clear main points; concise, and **explicitly explains what is left out and why**; visuals clean, readable, not distracting. Keep on-canvas text short and let the reading panel carry the prose.
- **Course vocabulary** (`../Course Materials/2026-11-03/Unit 5 ... .txt`): three roles, **subject / speaker / assessor**, and the question "whose context?". Relativism = Dependency + Non-Uniqueness; contextualism accepts dependency but denies non-uniqueness. Use this framing for the versions slides. Greco himself does not define relativism or expressivism; he only points to MacFarlane 2011 and Chrisman 2007. Say so in the reading panel.
- **Repo**: `main` at `cee343d`, remote `https://github.com/C171017/phi102-presentation-canvas.git`. Uncommitted before this work: `AGENTS.md` modified, `docs/` untracked (chat-history has about 32 MB of screenshot attachments).
- **A push to `main` auto-deploys** to https://phi102.c171017.com via Cloudflare Workers Builds, which runs `npm run build:live` and the tests. Both must pass before pushing: `npm run build`, `npm run build:live`, `node --test tests/performance.test.mjs`.
- Read `AGENTS.md` first. Key rules: do not move, resize or restyle existing objects; never overwrite `canvas-layout.json`; new objects get new IDs and take their positions from source defaults; verify in a separate preview, not the user's open tab.

## What exists on the canvas now

Six slides (`src/slide-content.ts`): Contemporary Contextualism, Flexible Foundationalism, Why Accept It?, Different Versions, Applications, The Regress Problem. That covers the paper's introduction and the start of §1.

Saved world positions (centres, from `canvas-layout.json`):

| Object | x | y |
|---|---|---|
| flexible-heading | 0 | -461 |
| foundation-left | 17 | -152 |
| contemporary-heading | 8 | 571 |
| state-red | 33 | 357 |
| aim-motivations | 746 | -1041 |
| aim-versions | 738 | -468 |
| aim-applications | 738 | 5 |
| regress-problem | 1469 | -1412 |
| regress-skepticism | 1596 | -2030 |
| regress-infinitism | 2061 | -1768 |
| regress-coherentism | 2234 | -1435 |
| regress-foundationalism | 1878 | -949 |

The regress rings are 320 px across. The "?" beside Foundationalism reveals a brick strip about 270 px to its right.

## Plan: 13 new slides (19 total)

Three lanes grow rightward, one per aim. Suggested slide box about 900 x 680: a centred title block on top, illustrations beneath.

**Lane 1, continuing "Why accept it?" → Regress Problem** (row top about y = -1375; x centres 3050 and 4100)

7. **The foundationalist's dilemma** (§1). Horn 1, Descartes: demand indubitable foundations; principled, but too few qualify, so skepticism. Horn 2, moderate foundationalism (perception, intuition): avoids skepticism, but the stopping point looks arbitrary. Objects: `dilemma-heading`, `dilemma-cartesian`, `dilemma-moderate`. Both scenes are drawn; see `wip/`.
8. **Undoubted, not undoubtable** (§1, the main point). A doubted Q cannot settle a doubt about P, so freedom from doubt matters; flexible foundationalism keeps that idea locally. Objects: `undoubted-heading`, `undoubted-logic` (Q doubted → P stays doubted; Q undoubted → P settled), `undoubted-standards` (three pedestals: undoubtable / doubtable / undoubted here, the last inside a dashed context ring with the gold star).

Routes fan out up and to the right of slide 8 (x centre about 5250; tops about -3060, -2280, -1500), like the regress fan:

9. **Route 1 · Justification as a social activity** (§2.1). Annis 1978: a belief is foundational when the appropriate objector-group raises no objection. Greco's toddler who keeps asking "why". Worry flag: a whole community could wrongly take a claim for granted; picked up in lane 2. Objects: `route-social-heading`, `route-social-scene`, `route-social-worry`.
10. **Route 2 · Hinges** (§2.2). Wittgenstein: a door (the open question "What colour do you see?") turning on three hinges (he understands English; he isn't deceiving me; my memory for colour names works). Flexible, not fixed: every inquiry has some hinges (∀∃), not some hinges for every inquiry (∃∀); the same proposition can be hinge in one inquiry and question in another (OC §98, paraphrase it). Objects: `route-hinges-heading`, `route-hinges-door`, `route-hinges-swap`.
11. **Route 3 · Knowledge or belief at the base** (§2.3). E = K (Williamson 2000) plus a flexible account of "knows", or general foundations (Harman 2001) plus sensitivist belief (Clarke 2013), gives flexible foundationalism "without trying". Caveat: Williamson rejects the flexible views (n. 15). Objects: `route-knowledge-heading`, `route-knowledge-scene`.

**Lane 2, from "Different versions"** (row top about y = -620; x centres 1850, 2850, 3850, 4850)

12. **How does context matter? / Whose context?** (§3). One scene: subject S holding a belief, a speaker saying "S's belief is foundationally justified", an assessor judging that claim. Four coloured brackets reuse the icon colours already on `aim-versions`: sensitive invariantism `#457c71` on the subject, contextualism `#a25b45` on the speaker, relativism `#4c729a` on the assessor, expressivism `#89688e` on the commitment expressed. Objects: `versions-map-heading`, `versions-map-scene`.
13. **Sensitive invariantism** ("the most straightforward"). Meaning fixed; the subject's situation (stakes, community norms as in Annis, current inquiries as with hinges) helps settle the status. Worry: a misguided community; astrology treated as unobjectionable "doesn't make it so". Objects: `si-heading`, `si-scene`, `si-worry`.
14. **Contextualism** ("more tricky"). "Foundationally justified" is a technical term, so no ordinary-usage data. Greco's fix: ordinary talk that shows judgments of foundationality: "It must be cold outside" (inferred), "I have a toothache." / "What makes you think that?" / "Oh, come on." (needs no support). Speaker-relativism analogue: I can say "that community thinks it's foundationally justified, but they're wrong". Objects: `ctx-heading`, `ctx-evidence`, `ctx-criticism`.
15. **The problem of disagreement**. "I'm hungry" / "I'm not hungry": both true, no conflict. But "that belief is foundationally justified" / "no it isn't" looks like real disagreement. This pushes some toward relativism (MacFarlane 2011) or expressivism (Chrisman 2007). Greco leaves it open (n. 23: Plunkett and Sundell argue the challenge is overstated) and defers to the parallel debate about "knows". Objects: `disagree-heading`, `disagree-scene`, `disagree-exits`.

**Lane 3, from "Applications"** (row top about y = 160; same x centres)

16. **(Access)** (§4.1). "If S has justification to believe that P, then S has justification to believe that S has justification to believe that P." Motivation: higher-order doubt leaks down into first-order doubt (the organic-food example), so a foundationalist who denies (Access) has a subject treating a claim as a regress-stopper while doubting it. Objects: `access-heading`, `access-principle`, `access-doubt` (two-storey structure, a "?" leaking from the upper floor onto the foundation stone).
17. **The catch: a cognitive home?** (§4.1). (Access) seems to need a realm where evidence never misleads. Weather is not like that. Smithies 2012 posits introspectively accessible mental states, which looks Cartesian again; Williamson's "cognitive home" and anti-luminosity. Objects: `home-heading`, `home-weather`, `home-cartesian` (glass house, "nothing hidden").
18. **A cognitive mobile home** (§4.2). Each context fixes a local supervenience base that S counts as able to know. Justine and Peter's party: taken for granted that Peter said 7:00 or 8:00 and Justine heard him, so the base is what Peter said. Doubt her hearing (he mumbled) and the context shifts: the base becomes his email, when his parties usually start, or her best guess. Draw a small caravan that rolls from plot B to plot B′ when a "?" arrives. Caveat on the canvas: a sketch, not a full defence. Objects: `mobile-heading`, `mobile-scene`.
19. **Takeaways**. (1) Keep the foundationalist answer; let the foundations vary with context: undoubted here, not undoubtable everywhere. (2) A family of views, with criticism and disagreement as the pressure points. (3) Payoff: a contextualized (Access) without a Cartesian cognitive home. Plus a small "What the chapter sets aside" card for the rubric: which version is right (deferred to the "knows" debate), a full defence of contextualized (Access), views that reject chains of reasons (n. 1). Objects: `conclusion-heading`, `conclusion-points`, `conclusion-scope`.

Slide order: existing 1–6, then 7–19 as numbered. Tune coordinates after measuring real sizes; nothing may overlap the regress cluster (x 1300–2400, y -2200 to -780).

**Connectors** (add `<path data-source data-target>` to `#connections`; the existing right-edge → left-edge Bézier already supports this): Foundationalism's "?" button → `dilemma-heading` (give the button an id; the arrow then reads as the question leading to the dilemma) → `undoubted-heading` → the three route headings. `aim-versions` → `versions-map-heading` → `si-heading` → `ctx-heading` → `disagree-heading`. `aim-applications` → `access-heading` → `home-heading` → `mobile-heading` → `conclusion-heading`.

## Design system (started in `wip/`)

- `wip/sketch.ts`: dependency-free drawing kit returning SVG strings. Seeded wobble for hand-drawn double strokes, oblique `block`/`stone` with top and side faces, hard offset shadows drawn as shapes (**no SVG or CSS filters**, so pan and zoom stay cheap), `person`, `bubble`, `arrow`, `plate`, `doubt` (the bold serif "?"), `check`, `cross`, `star`, `ring` (dashed context ring), and `st(i, …)` for build steps. Type-checks under the repo's `tsc`.
- `wip/scenes.ts`: scene registry, `mountScene`, `initializeScenes`, shared motifs (`belief` slate speech block, `strut`, `beam`, `skull`), and the two finished dilemma scenes. `wip/preview-dilemma-scenes.png` shows them; that is the look to match.
- `wip/scenes.css`: hover replays a stepped build (`.is-playing .st`); the finished drawing is always visible at rest and never hides on leave. This follows the user's later corrections in chat history (revealed elements persist, hover replays). Respects reduced motion.
- `wip/gallery.html`: dev-only contact sheet. Copy to the project root, run `npm run dev`, open `/gallery.html?only=dilemma`. Do not commit it.
- Palette, all from the existing canvas: ink `#322a20`, paper `#fffdf8`, slate `#334c4c`, stone `#ead0ad` / `#b7793f`, routes burgundy `#9d3b4b`, blue `#285c9d`, green `#206c58`, ochre `#8a571c`, gold star `#eab638`, connector tan `#a58a67`. Georgia for words, small sans capitals for tags. Scene text no smaller than about 15 px.
- Slide titles: a small tan eyebrow (lane number and section, for example "① Why accept it? · §1"), a 40 px Georgia title, and a one-line description, matching the existing headings.

## Integration notes

- Move `wip/sketch.ts`, `scenes.ts`, `scenes.css` into `src/`. Create the new objects from a data array (id, x, y, kind, content) **before** `createSlideNavigation` and `createLayoutController` run in `src/main.ts`, and mount scenes before the loop that appends resize handles. Give scenes and titles `max-width: none`.
- `src/slide-content.ts` is imported by the Cloudflare worker through `src/live-protocol.ts`. Keep it free of DOM and CSS imports; only extend the array.
- `src/reading-panel.ts` indexes its notes by slide. Add 13 notes in the existing format (lead, short sections, takeaway). Its header comment already credits Daniel Greco.
- Progress bar: 19 segments need a wider bar than `min(390px, …)`; consider small gaps between the five groups (intro, roadmap, lane 1, lane 2, lane 3).
- Do not add npm dependencies; the Cloudflare build and the user's machine would both need a reinstall.
- `tests/performance.test.mjs` executes `updateConnections`, `moveSelection`, `render` and `tick` from `src/main.ts` with exact geometry expectations. Leave their default behaviour unchanged.
- Optional, for coherence with the new style: a light hard shadow on the two original illustrations. Change nothing else about existing objects.

## Decisions to confirm with the user

1. The user once asked for circled numbers ①②③ before the three aims. A transcript says it was done, but it is not in the source or git history; it was probably overwritten by a concurrent session. Restoring it fits the lane eyebrows. Ask or mention it.
2. Whether to commit `docs/chat-history/` (about 32 MB of screenshots, plus transcripts with local paths) to the GitHub repo, or add it to `.gitignore`. The user said "git add, commit, and push" without saying.
3. The "external world" example in an old transcript is not from Greco's paper. Do not attribute it to him.

## Verify before pushing

Build and tests as above. Open a separate preview, step through all 19 slides, and look at each one: text fits, nothing overlaps, connectors attach, hover builds play and persist, reading panel matches the slide. Check every claim on the canvas against the paper text.
