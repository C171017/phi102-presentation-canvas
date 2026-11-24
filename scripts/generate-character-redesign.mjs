// Local asset-generation command for the story-draft-5 character and treasure redesign. Never imported by the website.
// Usage: node scripts/generate-character-redesign.mjs [--check] [--out=<dir>] [ids…]
//   ids: simone cole rae echo gavel anchor evan   (default: all seven)
// Reads OPENAI_API_KEY from ~/.config/phi102-presentation/.env (outside the project). Each id is
// one billed request. The command stops on the first error and never retries automatically.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { homedir } from 'node:os';
import { loadEnvFile } from 'node:process';

try { loadEnvFile(path.join(homedir(), '.config', 'phi102-presentation', '.env')); }
catch (error) { if (error.code !== 'ENOENT') throw Error('Could not read the private PHI 102 .env file.'); }

const root = fileURLToPath(new URL('../', import.meta.url));
const cast = path.join(root, 'src/assets/full-body-cast');
const outArg = process.argv.find(arg => arg.startsWith('--out='))?.slice(6);
const out = outArg ? path.resolve(outArg) : path.join(root, 'docs/character-references/redesign-v6');
const model = 'gpt-image-2.6-sunburst';

// House style: match the current full-body cast art on the canvas.
const figure = [
  'One full-body character illustration that matches the attached character art exactly in medium and finish:',
  'flat cut-paper vector style, bold simplified shapes, crisp silhouette, a limited muted palette built around one signature color,',
  'subtle paper grain, a small cast shadow under the feet, a plain warm beige paper background, the whole figure visible with a margin.',
  'No text, letters, labels, banners, numerals or logos. Do not imitate any existing film, game, studio, artist or character.',
].join(' ');
const object = [
  'One single object illustration in exactly the same medium and finish as the attached character art:',
  'flat cut-paper vector style, bold simplified shapes, limited muted palette, subtle paper grain, a small cast shadow,',
  'centered on a plain warm beige paper background with generous margin. No people. No text, letters, labels or logos.',
  'Do not imitate any existing film, game, studio, artist or artwork.',
].join(' ');

export const items = {
  simone: {
    size: '1024x1536', references: ['simone.webp', 'cole.webp'],
    prompt: `${figure} Keep the woman in the first reference, Simone, the first hero: her face, her black hair in a high looped ponytail, her teal-green cropped jacket, cream shirt and wide dark trousers. Changes: remove both wristwatches and the sealed letter completely. On her lapel, one small red map-pin badge shaped like a "you are here" marker. On her shoulder strap, a small vented pet carrier, with a palm-sized hermit crab with a violet shell peeking out of it. New pose with main-character energy: chin slightly raised, one hand on her hip, a small self-assured half-smile, as if the whole world is arranged around her. Confident, not mean.`,
  },
  cole: {
    size: '1024x1536', references: ['cole.webp', 'simone.webp'],
    prompt: `${figure} Keep the young man in the first reference, Cole, almost exactly: his spiky dark hair, rust-red cropped jacket, black slim outfit, earbud wire and confident showman pose, holding a phone on a ring-light selfie stick. He is a present-day livestreamer. Add three small floating chat bubbles near his phone, blank inside, in pale paper tones. His signature color stays rust red.`,
  },
  rae: {
    size: '1024x1536', references: ['rae.webp', 'simone.webp'],
    prompt: `${figure} Redesign of the woman in the first reference, Rae, the assessor. Keep her face shape, short dark hair, cool unreadable expression, upright posture and navy signature color. Remove the conductor's cap and the ticket punch completely. New costume, near-future: a sleek navy inspector's long coat with clean seams and a high collar, fitted trousers, plain boots. Signature prop: a prism lens. A small faceted crystal monocle sits over her right eye, and in her raised hand she holds a small triangular glass prism that splits one thin white beam of light into a narrow fan of colors. She is assessing something, one eyebrow very slightly raised.`,
  },
  echo: {
    size: '1024x1024', references: ['echo.webp', 'simone.webp'],
    prompt: `${figure} Keep the hermit crab in the first reference, Echo, exactly as designed: palm-sized, a tall faceted violet shell, one oversized coral claw raised high, half-lidded unimpressed eyes, small legs. Add only a faint glossy sheen of wet black ink along the edges of the violet shell, as if freshly inked. The crab fills the center of the frame.`,
  },
  gavel: {
    size: '1024x1024', references: ['simone.webp', 'echo.webp'],
    prompt: `${object} The first sacred treasure: a judge's gavel with a head and handle of dark ink-black wood and one bright gold band around the head, resting on a small round striking block at a slight angle. Two thin concentric rings of glossy black ink ripple outward across the block from where it last struck.`,
  },
  anchor: {
    size: '1024x1024', references: ['simone.webp', 'echo.webp'],
    prompt: `${object} The second sacred treasure: an old iron ship's anchor, dark and slightly crusted, standing upright, with one gold ring at the top and a small round hinge-pin detail where the shank meets the arms. A short, slack length of rope hangs from the ring. Heavy, simple, still.`,
  },
  evan: {
    size: '1024x1536', references: ['evan.webp', 'echo.webp'],
    prompt: `${object} The third sacred treasure, who is alive: keep the fountain pen in the first reference, Evan, almost exactly: the faceted navy-and-violet barrel with gold bands, the gold clip, the gold nib, the thin gold legs and the deep, polite bow. Add only two small, friendly eyes on the clip, and one drop of glossy black ink hanging from the nib. Courteous and charming, clearly an object, not a human.`,
  },
};

async function main() {
  const wanted = process.argv.slice(2).filter(arg => !arg.startsWith('--'));
  const queue = Object.entries(items).filter(([id]) => !wanted.length || wanted.includes(id));
  if (process.argv.includes('--check')) {
    console.log(JSON.stringify({ model, out, items: queue.map(([id, f]) => ({ id, size: f.size, references: f.references })),
      credentialConfigured: Boolean(process.env.OPENAI_API_KEY), networkRequests: 0 }, null, 2));
    return;
  }
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key || /\s/.test(key)) throw Error('Add OPENAI_API_KEY to ~/.config/phi102-presentation/.env, then rerun.');
  await mkdir(out, { recursive: true });
  for (const [id, item] of queue) {
    console.log(`Generating ${id} with ${model}…`);
    const form = new FormData();
    form.append('model', model);
    form.append('prompt', item.prompt);
    form.append('size', item.size);
    form.append('quality', 'high');
    form.append('n', '1');
    for (const file of item.references) {
      form.append('image[]', new Blob([await readFile(path.join(cast, file))], { type: 'image/webp' }), file);
    }
    const response = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST', headers: { Authorization: `Bearer ${key}` }, body: form, signal: AbortSignal.timeout(300000),
    });
    if (!response.ok) {
      const detail = await response.json().catch(() => ({}));
      const code = String(detail.error?.code ?? detail.error?.type ?? 'request_failed').replace(/[^\w-]/g, '').slice(0, 80);
      throw Error(`OpenAI HTTP ${response.status} (${code}) ${String(detail.error?.message ?? '').slice(0, 300)} Stopped; no automatic retry.`);
    }
    const b64 = (await response.json()).data?.[0]?.b64_json;
    if (!b64) throw Error('No image bytes in the API response.');
    await writeFile(path.join(out, `${id}.png`), Buffer.from(b64, 'base64'));
    await writeFile(path.join(out, `${id}.json`), JSON.stringify({ id, model, references: item.references,
      prompt: item.prompt, created: new Date().toISOString() }, null, 2) + '\n');
    console.log(`Saved ${id}.png`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
