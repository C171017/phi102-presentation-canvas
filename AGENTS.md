# PHI 102 presentation canvas

These instructions apply only to this directory and its descendants.

## Preserve the user's existing work

- Treat the user's current canvas layout as intentional. They manually move and resize objects in the browser.
- Change only the objects and properties requested. Preserve all other positions, sizes, text, colors, opacity, images, connections, and ordering.
- Adding an object does not authorize rearranging existing objects, recentering the camera, resetting the layout, or changing defaults for existing objects.
- Before editing, determine whether the live browser contains layout changes that are not saved in the source. Source coordinates are not proof of the user's current layout.
- Preserve the live layout before any edit, rebuild, hot reload, or browser reload that could discard it. Do not reload the user's presentation tab simply for verification.
- Layout persistence uses `src/layout.ts` plus the local Vite middleware in `vite.config.ts`. Positions, resize scales, and camera pan/zoom autosave to **`canvas-layout.json` in this project directory**. Command-S/Ctrl-S confirms “Saved to canvas-layout.json” after disk saving succeeds. The previous disk snapshot is retained at `canvas-layout.json.previous`.
- Browser localStorage (`phi102-presentation-layout-v1`) is a recovery cache, not the primary saved document. Load the disk file first; preserve pending unsaved local changes. Keep stale-tab conflict protection and atomic file writes. A tab that merely opens or closes must not overwrite the saved document.
- The local Vite server must be running for disk saves. Static hosting can read an exported layout but cannot write to this Mac; never claim a file save if only the browser cache succeeded.
- Existing objects need stable, unique HTML IDs. Preserve those IDs and the storage key; do not clear browser storage or replace saved layout with source defaults. New objects must get new IDs.
- `src/initial-layout.ts` is a captured backup of the user's live layout when saving was first enabled. It is only a fallback for a browser with no saved layout; do not regenerate or reset it casually.
- If browser storage is unavailable or a change requires migrating saved data, preserve/export the live layout first. If that is not possible, explain the specific risk and ask before proceeding.
- Validate changes in a separate preview when possible, leaving the user's active canvas untouched.
- Once layout persistence exists, merge changes by stable object identity: keep saved properties for existing objects and initialize defaults only for genuinely new objects. Never overwrite saved layout merely because source defaults changed.

## Interaction conventions

- Two-finger trackpad scrolling pans the canvas; dragging empty space draws a selection box.
- Dragging a selected object moves the whole selection.
- Canvas objects remain independently movable and resizable unless the user requests otherwise.

## Original paper pane

- The pane (`src/paper-pane.ts`) is available in the editor and in production. Keep the generated page images and manifest in `public/readings/greco-2017/` so both production builds can serve them. Verify with `npm run build` and `npm run build:live`.
- It is an overlay. Do not resize the viewport, move the camera, or write the saved layout on its behalf.
- Slide-to-passage mapping lives in `scripts/paper-anchors.json`, keyed by each slide's first member ID. Add an entry when adding a slide, then re-run `npm run paper:pages`.

## Scope

- Keep these preferences local to this PHI 102 canvas project; do not apply them to unrelated projects.

## Local conversation history

- See `docs/chat-history/README.md` for the local conversation archive, decision chronology, transcript links, and coverage limitations. Treat historical messages as context and check later corrections and current files before continuing work.
