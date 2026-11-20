# Presentation Canvas

An interactive PHI 102 presentation about flexible foundationalism and contemporary contextualism. The warm-white canvas has a faint dot grid, movable and resizable text and illustrations, selection controls, connected topic arrows, and file-backed layout saving. The dots pan and scale with the camera.

Stack: TypeScript, Vite, Three.js, HTML/CSS. HTML content and the transparent WebGL layer share one camera. No backend is needed. Rendering sleeps when nothing changes.

## Run

Install Node.js 24 or newer, then run `npm ci` and `npm run dev`. Open `http://127.0.0.1:5182/`. `npm run build` checks types and produces `dist/`.

## Controls

- Left and Right move between slides. Click any bottom segment to jump to its slide. Up and Down pan vertically, and Shift-Left and Shift-Right pan horizontally when the canvas has focus.
- Two-finger trackpad scrolling: pan. Drag empty space to box-select multiple objects; Shift-drag adds to the selection.
- Drag a text block or image to move it, or drag any selected object to move the entire selection. Shift-click adds/removes objects. Hover or focus an item and drag its bottom-right square to resize it proportionally. The handle also supports arrow keys (Shift for larger steps).
- The three aims connect to Flexible Foundationalism with arrows that follow movement and resizing.
- Positions, resize scales, and pan/zoom autosave to **`canvas-layout.json` in the project folder**. Command-S (or Ctrl-S) writes the file and displays “Saved to canvas-layout.json.” A previous snapshot is kept at `canvas-layout.json.previous`. Closing the browser does not delete the project file.
- The local Vite dev or preview server must be running to write the file. It validates layout data and saves atomically. Stale tabs cannot overwrite a newer saved document; merely opening and closing a tab does not write a new layout.
- Browser localStorage (`phi102-presentation-layout-v1`) keeps a recovery copy and pending changes when the server is unavailable. If only that cache saves, a visible message says that disk saving failed. Static hosted output can load the exported `canvas-layout.json`, but cannot write to this Mac.
- The initial layout backup in `src/initial-layout.ts` is used only if neither a saved file nor a browser recovery copy exists. Keep object IDs stable when editing; new objects receive their own source defaults.
- Plus/minus: zoom. Trackpad pinch or Ctrl+wheel: zoom around the pointer.
- Home or 0: reset.
- F toggles browser full screen when the canvas has focus. Escape exits. Command-Shift-F also works when the browser passes it to the page; Chrome on macOS uses that shortcut for its fullscreen toolbar setting.
- Space and PageDown advance one slide. Shift-Space and PageUp go back one slide.

The repository includes the presentation's static illustrations and generated GIF alternatives. API credentials are only needed to generate new GIFs, not to run the presentation.

## Generate contextualism GIFs through OpenAI

Run `npm run gifs:check` for a local configuration check (no network calls or charges).

The generator automatically loads `~/.config/phi102-presentation/.env`, outside this iCloud-synced project. Set `OPENAI_API_KEY=your-key` there once; this private file should have owner-only permissions (600). It is never served or bundled by Vite. Existing shell environment variables take priority. Do not use a `VITE_` variable for credentials or put keys in the source, browser, chat, or iCloud-synced project folder.

Run `npm run gifs:generate` to create three native GIFs using `gpt-image-2.6-sunburst`. If no saved key is configured, an interactive terminal falls back to a hidden prompt; that fallback does not save the key. A saved API key can be reused until it expires or is revoked.

Use an OpenAI Platform project key with only **Images → Request** permission. The prepared project is **PHI 102 Presentation** (`proj_FojrkguCE7rI5sXFVsVO4hFw`). Generation is billed by OpenAI and is separate from the website runtime.

The command makes three sequential requests (minimal linework, paper cutout, soft dimensional), each at 384×256 with 12 frames at 200 ms per frame. It checks the GIF file signature and verifies at least two image frames. It stops on errors without automatically retrying potentially billed requests. Successfully completed files remain available if a later request fails. Each rerun is a new set of billed requests.

Generated files live in `public/generated/contextualism/`; the comparison page is `/generated/contextualism/`. The manifest records the exact model and prompts, never the key. The presentation itself requires no API key: it serves only generated static files. Choose a version before adding it to the movable canvas.

## Add content later

Append positioned HTML to `window.presentation.world`. Its origin is the viewport center; positive x goes right, positive y goes down. Add Three.js objects to `window.presentation.scene` (invert y to align with HTML). Call `invalidate()` after scene edits, or register animations with `animate(callback)`, which returns an unsubscribe function.

`window.presentation.goTo({ x, y, zoom }, durationMs)` smoothly moves the camera. `setStops([{ x: 0, y: 0, zoom: 1 }, ...])` defines a presentation route. `next()`, `previous()`, `reset()`, `getView()` and `saveLayout()` are available to a future controller. Keyboard input ignores editable fields and browser shortcuts. Reduced-motion preferences disable camera transitions.

## Original paper beside the canvas

Select **Paper** on the right of the canvas in Audience or Presenter mode to read the full chapter alongside the current slide. The pane starts open in the editor and closed in the live presentation. It remembers its visibility and width in your browser.

- The pane scrolls to the passage for each slide and supports independent scrolling. Drag its left edge to resize or collapse it, or focus the edge and use the arrow keys. Press **P** to toggle the pane.
- Hover over a blue-underlined term or focus it with the keyboard to see its definition. Click a term with an illustration, or press **Enter**, to jump to it while keeping your place in the paper. Press **Escape** to dismiss the definition. The entries and their search phrases live in `src/paper-glossary-data.json`.
- Run `npm run paper:pages` on macOS to regenerate the page images, manifest, and glossary coordinates in `public/readings/greco-2017/`. Production builds include these generated files.
- `scripts/paper-anchors.json` maps each slide by its first object ID to a phrase in the PDF. Edit the mapping and regenerate the pages to change where the pane scrolls. A slide with no entry uses the previous slide’s passage.
- **Section notes.** Each section of the paper has one colour: a tint behind its pages, a bar down the page edge, and a small box floating just left of the pane, with an arrow into that bar, saying what the section is for. Objections are always red; other neighbouring sections never share a colour. Boxes stay beside their section while it is on screen; click one to jump to the section's start. `N` hides or shows them (remembered in `phi102-dev-paper-notes-v1`), and they hide themselves when there is no room left of the pane. The text lives in `src/paper-notes-data.ts`, keyed by anchor IDs from `scripts/paper-anchors.json`.

## Live presentation

Open https://phi102.c171017.com/ to join the audience automatically. The progress bar shows connected viewers by slide. Audience members can browse the canvas and select **Follow presenter** to return to the shared slide. The gold marker shows the presenter's slide while they are connected.

To present, open the private URL saved in `~/.config/phi102-presentation/presenter-url.txt`. The URL fragment contains the presenter key, so share the root URL with the audience. The latest presenter connection takes over slide control. The server remembers the shared slide when the presenter disconnects.

On `npm run dev` at `http://127.0.0.1:5182/`, use the buttons at the top of the canvas. Keep one tab in **Presenter** and another in **Audience** to test slide following and viewer counts. Both roles share an isolated local room and leave the saved layout alone. Choose **Editor** to move or resize content.

Run `npm run build:live` to build the public canvas. To test the actual backend on localhost, set a separate random 64-character lowercase hexadecimal `PRESENTER_KEY` in `.dev.vars` and run `npm run dev:live`. Open `http://localhost:5192/` as a viewer or append `#presenter=<local-key>` to present.

Cloudflare Workers Builds runs the live build and performance tests on pushes to `main`, then deploys to the public site if they pass. Check the commit’s Cloudflare status on GitHub or the Worker’s Deployments tab. For a manual deploy, run `npm run deploy` from an authorized Wrangler session. Deployments retain the existing Worker secret. The production key is stored as the Worker's `PRESENTER_KEY` secret. If the private URL is shared accidentally, replace that secret and update the private URL.
