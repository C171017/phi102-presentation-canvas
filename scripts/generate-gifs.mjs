// Local asset-generation command. Never imported by the website.
import { mkdir, writeFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { homedir } from 'node:os';
import { loadEnvFile } from 'node:process';

const privateEnv = path.join(homedir(), '.config', 'phi102-presentation', '.env');
try { loadEnvFile(privateEnv); }
catch (error) { if (error.code !== 'ENOENT') throw Error('Could not read the private PHI 102 .env file.'); }

const root = fileURLToPath(new URL('../', import.meta.url));
const fiveCircleMode = process.argv.includes('--orbit-five');
const orbitMode = fiveCircleMode || process.argv.includes('--orbit');
const orbitPrefix = fiveCircleMode ? 'orbit-five' : 'orbit';
const selectedModel = process.argv.find(arg => arg.startsWith('--model='))?.split('=')[1] ?? 'sunburst';
if (!['flare', 'sunburst'].includes(selectedModel)) throw Error('Model must be flare or sunburst.');
const model = `gpt-image-2.6-${selectedModel}`;
const output = path.join(root, 'public/generated/contextualism', ...(orbitMode ? [`${orbitPrefix}-${selectedModel}`] : []));
const fiveCirclePrompt = `Native animated GIF, square composition, one seamless CLOCKWISE revolution. Color-coded EDITORIAL ILLUSTRATION on warm off-white paper #faf9f6 with subtle print texture. EXACTLY FIVE large stationary context circles evenly spaced around one circular orbit, like five vertices of a regular pentagon: BLUE at the TOP (12 o'clock), ORANGE at UPPER RIGHT, GREEN at LOWER RIGHT, PURPLE at LOWER LEFT, PINK at UPPER LEFT. These five circles MUST ALL remain visible and unchanged in every frame. Distinct, easy-to-differentiate palette: blue #0072B2, golden orange #E69F00, green #009E73, violet #8055C7, rose pink #D96F9C. Medium-weight colored circle outlines, pale matching colored interiors, consistent size. Leave clear space between all circles and an empty center. A fine dotted circular track connects their centers. Exactly ONE small speech bubble with identical black glyphs “文 A” travels along that track clockwise: top blue → upper-right orange → lower-right green → lower-left purple → upper-left pink → back to blue. The bubble passes through each circle's center, changes its fill to a readable lighter tint of THAT circle's specific color and its outline to that circle's full color. Only one bubble, no copies, ghosts, trails, or extra text. Constant forward motion, ONE revolution across the animation, never backtracks. Keep bubble upright with exactly the same shape, size and glyphs. Keep all five background circles fixed in position, color and size. Start at top and finish approaching top from upper left, creating a continuous clockwise loop. Entire ring remains comfortably inside the square, wide margins, flat geometric editorial design, crisp shapes, no 3D, no title, no labels or legend. Priority: exactly FIVE distinct fixed context circles, exactly ONE moving bubble, clockwise movement, correct bubble color in each context.`;
const base = fiveCircleMode ? fiveCirclePrompt : orbitMode
  ? `A native animated GIF, square composition, one seamless clockwise revolution. Elegant COLOR-CODED EDITORIAL ILLUSTRATION for a philosophy lecture. Warm off-white paper #faf9f6, restrained screen-print grain, precise flat geometric shapes, taupe ink, generous negative space. FOUR identical stationary circular contexts arranged as a CIRCLE OF CIRCLES: top at twelve o'clock is terracotta, right at three o'clock is teal, bottom at six o'clock is ochre, left at nine o'clock is muted blue. The four circles have clearly colored outlines and very pale matching fills, form a symmetric ring surrounding an empty center, and never move, deform, or change their own colors. Exactly ONE small speech bubble containing the identical black glyphs “文 A” travels around this ring CLOCKWISE: top, right, bottom, left, back to top. Its center follows a circular orbit through the center of each context circle. It takes one revolution over all frames, constant forward motion, no reversal, no bouncing, no duplication, no trails. Bubble stays upright and retains identical silhouette and lettering in every frame. Bubble fill smoothly changes to match the color of each context as it passes through, illustrating the SAME sentence taking DIFFERENT meanings. Context circles remain behind the moving bubble. Delicate dotted circular guide may connect their centers. First frame starts at top; final frame approaches top from upper-left so the loop closes smoothly. No title, labels, legends, other letters, arrows, additional bubbles or objects. Entire composition fits within the square with wide margins. Communicate using form and color, like a polished editorial diagram; avoid photorealism and 3D.`
  : `A seamless looping animated GIF for a philosophy presentation, landscape composition. Exactly ONE small speech bubble with the unchanged black glyphs “文 A” represents a sentence. It moves from the center of a large fixed circle on the left to a large fixed circle on the right and back. Its fill changes from terracotta in the left context to teal in the right context. Keep the glyphs and bubble shape unchanged. Never show two copies of the sentence. The two circles represent contexts and remain stationary. No title, no captions, no additional text. Generous negative space and warm off-white #faf9f6 background. Fixed camera, clear movement, readable at small scale, first and last poses align for a loop.`;
const variants = orbitMode ? [{ id: `${orbitPrefix}-${selectedModel}`, name: `${selectedModel === 'flare' ? 'Flare' : 'Sunburst'} · Clockwise editorial orbit`, style: 'Flat, color-coded editorial illustration with subtle paper texture.' }] : [
  { id: 'minimal', name: 'Minimal linework', style: 'Precise flat editorial illustration, delicate taupe circle outlines, solid matte speech bubble, clean simple geometry.' },
  { id: 'paper', name: 'Paper cutout', style: 'Handmade cut-paper illustration. Two large paper rings and a small speech bubble cut from textured paper with very subtle shadows. Restrained tactile paper grain.' },
  { id: 'glass', name: 'Soft dimensional', style: 'Soft minimal 3D illustration. Two translucent glass context spheres, viewed straight on, a rounded satin-finish speech bubble smoothly passing from one sphere to the other. Gentle studio shadows, no reflections obscuring the glyphs.' },
];
const payload = (variant) => ({ model, prompt: `${base} Style: ${variant.style}`, output_format: 'gif', size: orbitMode ? '384x384' : '384x256', frame_count: fiveCircleMode ? 15 : 12, frame_duration_ms: 200, quality: orbitMode ? 'medium' : 'low', complexity: 'medium', n: 1 });

// Parse GIF structure rather than counting bytes that may also occur in pixels.
function countFrames(bytes) {
  if (!['GIF87a', 'GIF89a'].includes(bytes.subarray(0, 6).toString())) throw Error('OpenAI returned a non-GIF file.');
  let pos = 13, frames = 0;
  if (bytes[10] & 128) pos += 3 * (1 << ((bytes[10] & 7) + 1));
  function skipBlocks() {
    while (pos < bytes.length) { const size = bytes[pos++]; if (!size) return; pos += size; }
    throw Error('Incomplete GIF data.');
  }
  while (pos < bytes.length) {
    const marker = bytes[pos++];
    if (marker === 0x3b) return frames;
    if (marker === 0x21) { pos++; skipBlocks(); }
    else if (marker === 0x2c) {
      if (pos + 9 > bytes.length) throw Error('Incomplete GIF frame.');
      const packed = bytes[pos + 8]; pos += 9;
      if (packed & 128) pos += 3 * (1 << ((packed & 7) + 1));
      pos++; skipBlocks(); frames++;
    } else throw Error('Invalid GIF structure.');
  }
  throw Error('GIF has no trailer.');
}

function readKey() {
  if (process.env.OPENAI_API_KEY) return Promise.resolve(process.env.OPENAI_API_KEY.trim());
  if (!process.stdin.isTTY) throw Error(`Add OPENAI_API_KEY to ${privateEnv}, then rerun.`);
  return new Promise((resolve, reject) => {
    let value = '';
    process.stdout.write('Paste the PHI 102 API key (hidden; not saved), then press Enter: ');
    process.stdin.setRawMode(true); process.stdin.resume(); process.stdin.setEncoding('utf8');
    const finish = () => { process.stdin.off('data', onData); process.stdin.setRawMode(false); process.stdin.pause(); process.stdout.write('\n'); };
    function onData(chunk) {
      for (const char of chunk) {
        if (char === '\u0003') { finish(); reject(Error('Cancelled.')); return; }
        if (char === '\r' || char === '\n') { finish(); resolve(value.trim()); return; }
        if (char === '\u007f' || char === '\b') value = value.slice(0, -1);
        else if (char >= ' ') value += char;
      }
    }
    process.stdin.on('data', onData);
  });
}

async function main() {
  await mkdir(output, { recursive: true });
  await access(output, constants.W_OK);
  if (process.argv.includes('--check')) {
    console.log(JSON.stringify({ endpoint: 'https://api.openai.com/v1/images/generations', ...payload(variants[0]), prompt: '[three prepared prompts]', variants: variants.map(v => v.name), output, credentialConfigured: Boolean(process.env.OPENAI_API_KEY), networkRequests: 0 }, null, 2));
    return;
  }
  const key = await readKey();
  if (!key || /\s/.test(key)) throw Error('No valid API key supplied.');
  const run = new Date().toISOString().replace(/[:.]/g, '-');
  const results = [];
  for (const variant of variants) {
    console.log(`Generating ${variant.name} (${results.length + 1}/${variants.length})…`);
    // No automatic retries: a timed-out request might already incur a charge.
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload(variant)), signal: AbortSignal.timeout(300000),
    });
    if (!response.ok) {
      const detail = await response.json().catch(() => ({}));
      const code = String(detail.error?.code ?? detail.error?.type ?? 'request_failed').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80);
      throw Error(`OpenAI HTTP ${response.status} (${code}). Stopped; no automatic retry. Request ID: ${response.headers.get('x-request-id') ?? 'unavailable'}`);
    }
    const result = await response.json();
    if (!result.data?.[0]?.b64_json) throw Error('No image bytes in the API response.');
    const bytes = Buffer.from(result.data[0].b64_json, 'base64');
    const frames = countFrames(bytes);
    if (frames < 2) throw Error('Output is a still GIF, not an animation.');
    const filename = `${variant.id}-${run}.gif`;
    await writeFile(path.join(output, filename), bytes, { flag: 'wx' });
    results.push({ ...variant, filename, frames, model: payload(variant).model, request: payload(variant) });
    await writeFile(path.join(output, 'manifest.json'), JSON.stringify({ run, results }, null, 2));
    const cards = results.map(v => `<article><h2>${v.name}</h2><img src="${v.filename}" alt="Animated sentence moving between contexts, ${v.name}"><p>${v.frames} frames · <a href="${v.filename}" download>Download GIF</a></p></article>`).join('');
    await writeFile(path.join(output, 'index.html'), `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Contextualism GIF previews</title><style>body{background:#faf9f6;color:#322a20;font:18px Georgia,serif;margin:40px auto;max-width:1280px;padding:0 24px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px}img{width:100%}h2{font-size:22px}a{color:inherit}</style><h1>Contextualism · GIF previews</h1><main>${cards}</main></html>`);
    console.log(`Saved ${filename}: ${frames} frames.`);
  }
  console.log(`Ready to compare: http://127.0.0.1:5182/generated/contextualism/${orbitMode ? `${orbitPrefix}-${selectedModel}/` : ''}`);
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
