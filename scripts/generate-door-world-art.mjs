// Local asset-generation command for the P2 "door world" slide art. Never imported by the website.
// Usage: node scripts/generate-door-world-art.mjs [--check] [--refs=canon|version-c] [--no-crop]
//                                                 [--out=<dir>] [--raw=<dir>] [--converter=<name>] [ids…]
//   ids: P2-1-road-meeting P2-2a-flashback-sea-wall P2-2b-flashback-old-door P2-2c-flashback-through-the-door
//        P2-3-he-walks-away P2-4-the-omen P2-5-the-source P2-6-no-time-to-explain P2-7-white   (default: all nine)
//   --check  dry run: prints the queue and makes zero network requests.
// Reads OPENAI_API_KEY from ~/.config/phi102-presentation/.env (outside the project). Each id is one billed
// request, sent one at a time. The command stops on the first error and never retries automatically.
// An image whose .webp already exists is skipped; move or rename the .webp to generate it again.
// Output: <id>.webp plus P2-door-world.manifest.json in public/generated/backgrounds/ink-ocean/, and the
// untouched API PNG in docs/story-illustrations/door-world-raw/. Shot notes: docs/story-illustrations/p2-door-world-shot-list.md
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { homedir } from 'node:os';
import { loadEnvFile } from 'node:process';

try { loadEnvFile(path.join(homedir(), '.config', 'phi102-presentation', '.env')); }
catch (error) { if (error.code !== 'ENOENT') throw Error('Could not read the private PHI 102 .env file.'); }

const root = fileURLToPath(new URL('../', import.meta.url));
const flag = name => process.argv.find(arg => arg.startsWith(`--${name}=`))?.slice(name.length + 3);
const out = flag('out') ? path.resolve(flag('out')) : path.join(root, 'public/generated/backgrounds/ink-ocean');
const raw = flag('raw') ? path.resolve(flag('raw')) : path.join(root, 'docs/story-illustrations/door-world-raw');
const model = 'gpt-image-2.6-sunburst';
const quality = 'high';
const size = '1536x1024'; // the landscape size already used with this model; cropped to 16:9 like the other slide art
const crop = !process.argv.includes('--no-crop');
const webpQuality = 89;
const manifestName = 'P2-door-world.manifest.json';
const refSet = flag('refs') ?? 'canon';

// Identity references, relative to the project root. `canon` is the current Ink Ocean cast on the canvas (one neutral
// figure each, so no off-tone panel can be copied). `version-c` is the original model sheets; the prompt then tells
// the model to ignore the panels the character bible bans.
const referenceSets = {
  canon: {
    simone: 'src/assets/full-body-cast/simone.webp',
    cole: 'src/assets/full-body-cast/cole.webp',
    echo: 'src/assets/full-body-cast/echo.webp',
  },
  'version-c': {
    simone: 'docs/character-references/version-c/justine-model-sheet.png',
    cole: 'docs/character-references/version-c/kit-model-sheet.png',
    echo: 'docs/character-references/version-c/gus-model-sheet.png',
  },
};
if (!referenceSets[refSet]) throw Error('--refs must be canon or version-c.');
const referenceFiles = {
  ...referenceSets[refSet],
  gavel: 'public/generated/props/ink-ocean/gavel-brass.webp',
  hinge: 'public/generated/props/ink-ocean/hinge.webp',
  townsfolk: 'docs/character-references/ink-people-blue-hour.png',
};

// ---- Shared prompt blocks -------------------------------------------------------------------------------------
// House look, described in words only. See docs/slide-visual-style.md and docs/character-bible.md.
const house = [
  'One wide landscape illustration for a story slide: a single finished frame of luminous, painterly, hand-painted Japanese feature animation.',
  'Richly detailed painted backgrounds with clean, softly shaded cel-style characters; vast towering cumulus clouds with crisp sunlit edges;',
  'sparkling light on water; soft lens glow and gentle bloom around highlights; deep atmospheric perspective; strong contrast of warm light and cool shadow.',
  'Sincere, cinematic and beautiful, with a quiet deadpan stillness.',
  'Framing: keep every face and key prop inside the central horizontal band, because the top and bottom tenth of the picture will be cropped away;',
  'keep the lowest quarter calm and low in detail so a dialogue box can sit over it.',
  'Original characters in an original composition. Do not depict, copy or imitate any existing film, series, game, studio, artist, character, logo or film frame.',
].join(' ');
const noText = 'No text, lettering, numerals, captions, written signs, logos, watermarks, borders or interface anywhere in the picture';
const memory = 'Memory treatment for the whole picture: this is a remembered moment, not the present. Warm and faded, with lifted blacks, a soft amber-rose wash, gentle bloom, softened and slightly vignetted edges, a little less saturation than daylight, and fine film grain.';
const inkWorld = 'World rule: everything here is made of ink except the brass hinge. Doors are dried matte black ink. The question marks are tiny, crisp, black question-mark glyphs, thousands of them, moving like smoke or a swarm; they are the only glyphs in the picture.';
const contrast = 'Each character’s emotional energy must read differently at a glance: Cole performs, Simone notices, Echo abides.';

const identity = {
  simone: 'Simone: a young woman with black hair in a high looped ponytail and sharp bangs, a teal-green cropped jacket over a cream shirt, wide dark charcoal trousers, and one small red map-pin badge on her lapel. No wristwatch and no letter.',
  cole: 'Cole: a young man with spiky dark hair, a rust-red cropped jacket over a slim black outfit, headphones resting around his neck, and a smartphone mounted in a small glowing ring light.',
  echo: 'Echo: one palm-sized hermit crab with a tall faceted violet shell, one oversized coral claw, small legs and two ivory eyes on stalks. Exactly one crab in the picture.',
  gavel: 'The Gavel: a judge’s gavel with a honey-gold brass head, octagonal beveled faces, a narrow teal enamel band, and a tapered dark walnut handle.',
  hinge: 'The hinge: one plain antique brass door hinge, dry, warm and solid, the only thing in this world that is not ink.',
  townsfolk: 'Townspeople: background figures only, each visibly built from small solid ink cubes, with a slightly irregular, faceless, cube-shaped head packed with the finest cubes; indigo bodies with steel-blue lit planes and a thin amber edge. They have no faces.',
};
const referenceLabel = {
  simone: 'Simone identity reference', cole: 'Cole identity reference', echo: 'Echo identity reference',
  gavel: 'Gavel prop reference', hinge: 'brass hinge prop reference', townsfolk: 'ink-cube townspeople reference',
};

// Acting blocks: copied from docs/character-bible.md, with the bracket filled in for the shot.
const act = {
  simone: shot => `Simone: calm, observant and quietly caring. Relaxed level brows, clear attentive eyes with a catchlight, soft closed mouth. Her feeling shows only in a small way: ${shot}. Upright, relaxed shoulders, economical gestures. Not sulky, not glaring, not bored, no pout, no chin-on-hand slump.`,
  cole: shot => `Cole: warm, sunny livestream hype man, fully committed to the bit. Big open friendly grin, bright eyes, raised brows, big open-handed gesture, leaning toward his phone lens. ${shot}. Friendly and sincere, never smug, sly or sneering.`,
  echo: claw => `Echo: one palm-sized dignified, unbothered hermit crab. Half-lidded ivory eye stalks, flat expression that never changes. His one oversized coral claw is ${claw}. No smile, no wide eyes, no cute styling.`,
};

// ---- The nine shots, in story order ---------------------------------------------------------------------------
// refs: which reference files to attach, in order. after: an earlier shot whose finished frame is attached last,
// so the framing or the set stays the same. The prompt is assembled in the order the character bible asks for:
// art direction, reference rule, identity, acting, scene, contrast.
export const shots = {
  'P2-1-road-meeting': {
    refs: ['simone', 'cole', 'echo'], after: null,
    alt: 'Simone rides her bicycle up a sunny coast road with Echo in the basket. Ahead of her, Cole, a backpack on his shoulders, turns back and recognizes her. The sea glitters under towering clouds.',
    acting: [
      act.simone('stillness: her eyes open a fraction wider and hold on Cole, and she takes one small held breath; her hands rest lightly on the handlebars'),
      act.cole('In this shot he is caught halfway through turning back over his shoulder, and warm, delighted recognition is spreading across his face: brows up, eyes bright, the grin just beginning, his free hand starting to lift in an open greeting; his phone hangs lowered at his side for once'),
      act.echo('TUCKED in, withholding; his eye stalks are turned toward Cole'),
    ],
    scene: 'Scene: late morning in high summer on a narrow coast road that climbs from lower left to upper right across the picture. The camera stands on the grassy inland verge, a little above the road, looking across it to the sea. Beyond a low white guardrail the sea is a deep indigo, almost ink-dark, covered in thousands of sparkling sun glints, with a pale horizon. The upper half of the picture is sky: enormous white cumulus towers with crisp lit edges. On the right the road bends out of sight around a steep, overgrown green hillside with tall summer grass, vines over an old stone retaining wall and one leaning utility pole. Left of centre, Simone rides a plain upright city bicycle uphill, seen in three-quarter view with her face clearly visible, looking ahead; Echo sits in the wire front basket. Right of centre and higher up the road, Cole walks uphill with a canvas backpack on both shoulders; his body still points up the hill, but his head and shoulders have turned back toward her. Clear open road and sparkling sea lie between the two of them. A light sea wind moves her ponytail and the grass.',
    textException: '.',
  },
  'P2-2a-flashback-sea-wall': {
    refs: ['simone', 'cole'], after: null,
    alt: 'A faded memory at sunset. Cole livestreams from a sea wall with his phone on a ring light while orange chat slips drift around him. Beside him, Simone looks up at the orange sky.',
    acting: [
      act.cole('In this shot he is in loose group-chat mode, mid-sentence to his stream, phone held up at arm’s length, the ring light glowing on his face, his other hand sweeping open toward the sunset as if presenting it'),
      act.simone('a small closed-mouth smile and a soft, unguarded gaze lifted to the sky; she is not looking at the phone'),
    ],
    scene: 'Scene: a long concrete sea wall at sunset, seen from the landward side at a slight low angle, the wall running across the picture and away to the right. Cole and Simone sit side by side on top of it, left of centre, their legs hanging over the near side, backs to the water but faces turned so both are clearly visible. Cole, on the left, streams to his phone. Simone, on the right, sits a hand’s width away from him and looks up and out at the sky. The whole sky is orange and rose with long amber-edged clouds, and the low sun lays a bright path across a calm sea. Around Cole’s phone drift a dozen small, blank, translucent orange paper slips, like chat messages turned into petals, carried off on the wind toward the sun; the slips are empty, with nothing written on them. Weeds grow from cracks in the wall and one faded mooring post stands at the right.',
    treatment: memory, textException: '; the orange slips are blank.',
  },
  'P2-2b-flashback-old-door': {
    refs: ['simone', 'cole'], after: null,
    alt: 'A faded memory. Simone and Cole stand side by side in overgrown ruins in front of an old, weathered door that stands by itself, still closed.',
    acting: [
      act.simone('quiet curiosity: her head tilts slightly and her eyes study the door; one hand has begun to rise toward it'),
      act.cole('In this shot the bit has gone quiet for a second: he has lowered his phone to his chest, and he looks at the door with open, wide-eyed wonder, mouth a little open, leaning forward on his toes'),
    ],
    scene: 'Scene: the overgrown ruin of a small seaside building, roofless, late in the day. Broken walls and empty window openings are wrapped in ivy; ferns and tall grass grow through cracked floor tiles; puddles on the floor hold pieces of sky. In the middle of the floor, slightly right of centre, one old wooden door stands upright in its frame with no wall around it: tall, plain, panelled, its pale paint weathered and peeling, with a dull round brass knob and one brass hinge showing on its edge. It is closed. Simone and Cole stand side by side on the left, about three steps from the door, seen in three-quarter view from behind and to the side so that both faces are still readable in profile. Low golden light comes over the broken wall behind the door and rims its edges; dust and seed fluff hang in the air.',
    treatment: memory, textException: '.',
  },
  'P2-2c-flashback-through-the-door': {
    refs: ['simone', 'cole'], after: 'P2-2b-flashback-old-door',
    alt: 'A faded memory seen through the open door: a white chapel by the sea, petals in the air, and a figure in a suit at the end of the aisle, face lost in light. Simone is a silhouette in the doorway with Cole’s hand on her arm.',
    acting: [
      'Simone is seen only from behind, as a dark silhouette: upright and very still, one hand resting on the door frame, her high looped ponytail and cropped jacket clear in outline. Her face is not shown.',
      'Cole is almost entirely out of frame. Only his forearm in its rust-red sleeve and his hand are seen, entering from the lower left and resting gently on her upper arm: an open, careful, friendly touch, not a grab.',
    ],
    scene: 'Scene: the camera stands just behind Simone and looks through the same old weathered door as in the last attached image, now swung wide open. The dark ruin, the door frame and her silhouette form a dim frame around a bright picture beyond the threshold: a small white clapboard chapel interior with its far wall open to the sea, rows of plain white benches on both sides of a narrow aisle, white flowers tied to the bench ends, and pale petals drifting through the air and across the threshold toward the camera. At the far end of the aisle stands one figure in a dark suit, small in the frame and facing this way; the head and face are completely lost in a bloom of white-gold light from the sea behind, so no features can be seen. The light from the doorway spills onto the ruin’s cracked floor and rims Simone’s outline. No other people.',
    treatment: memory, textException: '.',
  },
  'P2-3-he-walks-away': {
    refs: ['simone', 'cole', 'echo'], after: 'P2-1-road-meeting',
    alt: 'The same coast road. Cole is now a small figure walking away up the hill. Simone has stopped her bicycle and watches him go, with Echo in the basket.',
    acting: [
      act.simone('she is quietly noticing: lips pressed lightly together, eyes following Cole up the road, a faint crease of thought between her brows; she has stopped and stands astride the bicycle with one foot on the ground'),
      'Cole is small and far away, seen from behind: an easy, bouncing walk, backpack on both shoulders, one arm raised with his phone and its tiny glowing ring light held up ahead of him as he talks to it. Friendly and unhurried, not cold. His face is not shown.',
      act.echo('TUCKED in, withholding; his eye stalks are turned up toward Simone'),
    ],
    scene: 'Scene: exactly the same place, camera position, lens, horizon, road, guardrail, hillside, sea, clouds and light as the last attached image, which is the previous frame of this same shot. Change only the figures. Simone and her bicycle are in the same spot left of centre, but she has stopped, one foot down, turned in three-quarter view with her face visible, looking up the road. Echo is still in the front basket. Cole has walked on: he is now far up the road at the right, just before the bend under the overgrown hillside, less than a quarter of his earlier height. A long stretch of empty sunlit road lies between them.',
    textException: '.',
  },
  'P2-4-the-omen': {
    refs: ['simone', 'echo', 'townsfolk'], after: null,
    alt: 'On a quiet seaside town street, Simone stands with her bicycle and looks up. Above the hilltop a thin black thread made of tiny question marks rises into the sky. Nobody else looks up.',
    acting: [
      act.simone('she has noticed something wrong: her chin is lifted, her eyes are a fraction wider and fixed on the sky above the hill, her lips are barely parted, and one hand has tightened on the handlebar'),
      act.echo('TUCKED in, withholding; his eye stalks are tilted up toward the same point in the sky'),
      'The townspeople are relaxed and busy with small ordinary things, and every one of them faces away from the hill or looks down. None of them looks up.',
    ],
    scene: 'Scene: a quiet shopping street in a small seaside town, early afternoon, looking gently uphill along the street toward a green hill that rises behind the rooftops. Low tiled roofs, faded striped awnings, potted plants, a vending machine, overhead wires and round traffic mirrors; all shop signs and boards are blank. A strip of sparkling sea shows between two buildings on the left. Simone stands in the street right of centre, beside her upright city bicycle, both hands on the handlebars, in three-quarter view with her face clearly visible, looking up and into the distance. Echo sits in the front basket. Four or five townspeople are spread along the street in the middle distance: one sweeping a shop step, two talking with their heads together, one bent over a crate, one walking away. High above them, from the very top of the hill, one thin black thread rises straight up into the blue sky and the cumulus clouds, leaning slightly in the wind. It is hair-thin at this distance, but where it is nearest it can be seen to be made of countless tiny black question-mark glyphs streaming upward. It casts no shadow. The street is bright, warm and ordinary; only the thread is black.',
    treatment: inkWorld, textException: ' except the tiny black question-mark glyphs of the thread.',
  },
  'P2-5-the-source': {
    refs: ['simone', 'echo', 'gavel', 'hinge'], after: null,
    alt: 'In a flooded, overgrown resort courtyard on the hilltop, an empty door frame with one brass hinge stands in still water. Black question-mark fog pours out of it and rises in a column. Simone stands in the water, gripping the Gavel, frightened, with Echo on her shoulder.',
    acting: [
      act.simone('fear held very still, not panic: her eyes are wide, her inner brows are lifted, her lips are slightly parted on a held breath, her weight has shifted half a step back, and her hand is tight around the Gavel at her side. She does not scream, cry or flail'),
      act.echo('TUCKED in, withholding; he sits on her shoulder and looks at the door frame, completely unbothered'),
    ],
    scene: 'Scene: the abandoned courtyard of an old seaside resort on the hilltop, long flooded and overgrown. Two storeys of pale plaster arcades with round arches surround it on three sides, stained and cracked, hung with ivy and ferns; a broken roof lets in shafts of late-afternoon sun. The whole floor lies under a few centimetres of perfectly still, clear water over old patterned tiles, reflecting the arches and the sky like a mirror. In the exact middle of the water, right of centre in the picture, stands one EMPTY door frame: only two upright posts and a top beam of dried matte black ink, with no door in it at all, so the arches behind can be seen straight through it. On the inner side of one post is fixed the single brass hinge, catching a warm point of light. Out of the empty opening seeps a dense black fog made of countless tiny black question-mark glyphs; it spills low over the water and then gathers and climbs into one twisting column that rises through the broken roof into the sky. Simone stands ankle-deep in the water at the left, a few steps from the frame, seen in three-quarter view with her face clearly visible, facing it; small rings spread from her ankles. Echo is on her near shoulder. Warm sunlit plaster and green leaves against cool blue water shadow; only the frame and the fog are black.',
    treatment: inkWorld, textException: ' except the tiny black question-mark glyphs of the fog.',
  },
  'P2-6-no-time-to-explain': {
    refs: ['simone', 'cole', 'echo', 'hinge'], after: 'P2-5-the-source',
    alt: 'In the flooded ruin, Simone and Cole push shoulder to shoulder against a half-built door of dried black ink while black question marks flood through the gaps. The brass hinge glows with engraved lines. Cole chants with his eyes closed and one hand raised; Echo presses his claw to the door.',
    acting: [
      act.simone('quiet, precise effort: her jaw is set, her brows are level with a faint crease between them, her eyes are open and fixed on the glowing hinge, and both hands and one shoulder are braced flat against the planks. Determined, not angry'),
      'Cole: warm, sunny livestream hype man, fully committed to the bit, and the bit is now deadly earnest. His eyes are closed, his brows are raised, and his mouth is open in the middle of a chanted word. One shoulder and one forearm are braced against the door beside Simone; his other hand is raised high with the palm flat and open, in his solemn "for the record" gesture. His phone hangs on his chest with the ring light still glowing. Earnest and sincere, never smug, sly or sneering.',
      act.echo('pressed flat against the door, low down beside Simone’s hands, doing his small part; he stands on a plank edge, and his face shows nothing'),
    ],
    scene: 'Scene: the same flooded resort courtyard and the same black door frame as in the last attached image, now seen from closer and from the side the two of them push on, at about waist height. The frame is no longer empty: it holds a half-built door made of rough vertical planks of dried matte black ink, with wide gaps still open between them and the upper third missing. Simone and Cole lean into it shoulder to shoulder, left of centre, their feet braced in the shallow water and spray kicking up around their ankles; both faces are clearly visible in three-quarter view. Through every gap, and over the unfinished top, a flood of tiny black question-mark glyphs blasts toward them like a gale of soot, whipping their hair and jackets back. On the frame, at the right, the brass hinge glows gold-white; fine engraved lines of tiny lettering burn on its plate, too small to read, and its light rims the planks and both their faces with warm gold against the cold blue-black of the storm. Shafts of late sun and the pale arches are dimly visible behind.',
    treatment: inkWorld, textException: ' except the tiny black question-mark glyphs and the unreadably small engraved lines on the hinge.',
  },
  'P2-7-white': {
    refs: ['hinge'], after: 'P2-6-no-time-to-explain',
    alt: 'The door of dried black ink is almost whole. Gold light pours through one last gap at the top, cracks run across the planks, and blinding white begins to swallow the frame.',
    acting: ['No people and no creatures appear in this picture.'],
    scene: 'Scene: the same door, frame and flooded courtyard as in the last attached image, seen straight on and close, from the side that was being pushed, so that the door fills most of the height of the picture. The door of dried matte black ink planks is now almost complete: every gap is closed except one narrow slot at the very top, and through that last slot pours a hard blade of gold light, fanning out into the air above. Fine bright cracks race across the black planks from the top downward, each crack leaking the same gold. The brass hinge on the frame at the right blazes gold-white, its engraved lines too bright and too small to read. A few last tiny black question-mark glyphs drift in the air and are thinning away. Blinding white is closing in from all four edges of the picture and has already dissolved the arches, the outer parts of the frame and most of the water; only the centre of the door, the hinge and a patch of mirror-still water at its foot, reflecting the gold, are still solid. The very next frame would be pure white.',
    treatment: inkWorld, textException: ' except a few tiny black question-mark glyphs and the unreadably small engraved lines on the hinge.',
  },
};

function references(shot) {
  const list = shot.refs.map(name => ({ file: referenceFiles[name], label: referenceLabel[name], name }));
  if (shot.after) list.push({ after: shot.after, label: `the finished frame "${shot.after}", for continuity of place and framing only` });
  return list;
}

export function buildPrompt(id) {
  const shot = shots[id];
  const list = references(shot);
  const rule = [
    `Attached images, in order: ${list.map((ref, index) => `${index + 1}. ${ref.label}`).join('; ')}.`,
    'The character and prop references are flat cut-paper designs. Use them for identity only: face shape, hair, costume, colours and props. Repaint everything in this picture’s painterly animation finish.',
    'Take expressions and body language from the written acting notes, not from the references. Do not reproduce any reference’s layout, pose, background or labels.',
    refSet === 'version-c' && shot.refs.includes('simone') ? 'On Simone’s sheet, ignore the bottom-left and bottom-right panels completely.' : '',
  ].filter(Boolean).join(' ');
  const who = shot.refs.map(name => identity[name]).join(' ');
  const cast = shot.refs.filter(name => ['simone', 'cole', 'echo'].includes(name));
  return [
    house, rule, `Identity: ${who}`, `Acting: ${shot.acting.join(' ')}`, shot.scene, shot.treatment ?? '',
    cast.length > 1 ? contrast : '', `${noText}${shot.textException}`,
  ].filter(Boolean).join('\n\n');
}

// ---- Files and conversion -------------------------------------------------------------------------------------
const exists = file => access(file).then(() => true, () => false);
const mime = file => ({ '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg' })[path.extname(file)] ?? 'application/octet-stream';
const run = (command, args) => spawnSync(command, args, { encoding: 'utf8' });

// The same order of preference as the other art scripts: sharp from node_modules, then Pillow, then ffmpeg, then cwebp.
async function findConverter() {
  const forced = flag('converter');
  const probes = {
    sharp: async () => Boolean((await import('sharp')).default),
    pillow: async () => run('python3', ['-c', 'import PIL.features as f, sys; sys.exit(0 if f.check("webp") else 1)']).status === 0,
    ffmpeg: async () => /libwebp/.test(run('ffmpeg', ['-hide_banner', '-encoders']).stdout ?? ''),
    cwebp: async () => run('cwebp', ['-version']).status === 0,
  };
  for (const name of forced ? [forced] : Object.keys(probes)) {
    if (probes[name] && await probes[name]().catch(() => false)) return name;
  }
  return null;
}

// Centre crop to 16:9, the shape of the other ink-ocean slide art (the prompts keep the outer tenths empty for this).
function cropBox(png) {
  const width = png.readUInt32BE(16), height = png.readUInt32BE(20);
  if (!crop) return { left: 0, top: 0, width, height };
  const target = Math.min(height, Math.round(width * 9 / 16 / 2) * 2);
  return { left: 0, top: Math.floor((height - target) / 2), width, height: target };
}

export async function toWebp(converter, source, target) {
  const png = await readFile(source);
  if (png.readUInt32BE(0) !== 0x89504e47) throw Error(`${path.basename(source)} is not a PNG. Stopped.`);
  const box = cropBox(png);
  if (converter === 'sharp') {
    const sharp = (await import('sharp')).default;
    await sharp(png).extract(box).webp({ quality: webpQuality }).toFile(target);
  } else {
    const result = converter === 'pillow'
      ? run('python3', ['-c', 'import sys\nfrom PIL import Image\nl,t,w,h=map(int,sys.argv[3:7])\nImage.open(sys.argv[1]).convert("RGB").crop((l,t,l+w,t+h)).save(sys.argv[2],quality=int(sys.argv[7]))',
          source, target, box.left, box.top, box.width, box.height, webpQuality].map(String))
      : converter === 'ffmpeg'
        ? run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', source, '-vf', `crop=${box.width}:${box.height}:${box.left}:${box.top}`,
            '-frames:v', '1', '-c:v', 'libwebp', '-quality', String(webpQuality), target])
        : run('cwebp', ['-quiet', '-q', String(webpQuality), '-crop', ...[box.left, box.top, box.width, box.height].map(String), source, '-o', target]);
    if (result.status !== 0) throw Error(`Could not convert ${path.basename(source)} to WebP with ${converter}. The PNG is kept; rerun to convert it. Stopped.`);
  }
  if (!await exists(target)) throw Error(`Conversion wrote no ${path.basename(target)}. Stopped.`);
  return `${box.width}x${box.height}`;
}

async function record(entry) {
  const file = path.join(out, manifestName);
  const manifest = await readFile(file, 'utf8').then(JSON.parse, () => ({}));
  const images = { ...(manifest.images ?? {}), [entry.id]: entry };
  await writeFile(file, JSON.stringify({
    generator: 'scripts/generate-door-world-art.mjs', shotList: 'docs/story-illustrations/p2-door-world-shot-list.md',
    endpoint: 'https://api.openai.com/v1/images/edits', model, quality,
    images: Object.fromEntries(Object.keys(shots).filter(id => images[id]).map(id => [id, images[id]])),
  }, null, 2) + '\n');
}

// Reference paths as they are recorded and attached. A continuity frame resolves to the raw PNG, or else the WebP.
async function resolveReferences(shot) {
  const resolved = [];
  for (const ref of references(shot)) {
    if (!ref.after) { resolved.push({ file: path.join(root, ref.file), shown: ref.file, present: await exists(path.join(root, ref.file)) }); continue; }
    const candidates = [path.join(raw, `${ref.after}.png`), path.join(out, `${ref.after}.webp`)];
    let found = null;
    for (const candidate of candidates) if (!found && await exists(candidate)) found = candidate;
    resolved.push({ file: found, shown: found ? path.relative(root, found) : `${ref.after} (made earlier in the same run)`, present: Boolean(found), after: ref.after });
  }
  return resolved;
}

async function main() {
  const wanted = process.argv.slice(2).filter(arg => !arg.startsWith('--'));
  const unknown = wanted.filter(id => !shots[id]);
  if (unknown.length) throw Error(`Unknown id: ${unknown.join(', ')}. Ids: ${Object.keys(shots).join(' ')}`);
  const queue = Object.entries(shots).filter(([id]) => !wanted.length || wanted.includes(id));
  const converter = await findConverter();

  if (process.argv.includes('--check')) {
    const items = [];
    for (const [id, shot] of queue) {
      const refs = await resolveReferences(shot);
      const done = await exists(path.join(out, `${id}.webp`)), rawDone = await exists(path.join(raw, `${id}.png`));
      items.push({ id, action: done ? 'skip (webp exists)' : rawDone ? 'convert existing PNG (no request)' : 'generate (1 billed request)',
        size, output: `${id}.webp`, references: refs.map(ref => ref.shown),
        missingReferences: refs.filter(ref => !ref.present && !ref.after).map(ref => ref.shown), promptCharacters: buildPrompt(id).length });
    }
    console.log(JSON.stringify({ model, quality, size, crop: crop ? '16:9 centre crop (1536x864)' : 'none', references: refSet, out, raw,
      manifest: path.join(out, manifestName), converter: converter ?? 'NONE FOUND (install Pillow, ffmpeg or cwebp before generating)',
      items, billedRequests: items.filter(item => item.action.startsWith('generate')).length,
      credentialConfigured: Boolean(process.env.OPENAI_API_KEY), networkRequests: 0 }, null, 2));
    if (process.argv.includes('--prompts')) for (const [id] of queue) console.log(`\n===== ${id} =====\n${buildPrompt(id)}`);
    return;
  }

  if (!converter) throw Error('No WebP converter found (sharp, Pillow, ffmpeg with libwebp, or cwebp). Nothing was requested.');
  const key = process.env.OPENAI_API_KEY?.trim();
  await mkdir(out, { recursive: true });
  await mkdir(raw, { recursive: true });
  for (const [id, shot] of queue) {
    const webp = path.join(out, `${id}.webp`), png = path.join(raw, `${id}.png`);
    if (await exists(webp)) { console.log(`Skipping ${id}: ${id}.webp already exists.`); continue; }
    const prompt = buildPrompt(id);
    const refs = await resolveReferences(shot);
    let requested = false;
    if (await exists(png)) {
      console.log(`Converting the existing ${id}.png (no request)…`);
    } else {
      const missing = refs.filter(ref => !ref.present);
      if (missing.length) throw Error(`${id} needs ${missing.map(ref => ref.after ? `the finished frame ${ref.after} (generate it first)` : ref.shown).join(' and ')}. Stopped before any request for ${id}.`);
      if (!key || /\s/.test(key)) throw Error('Add OPENAI_API_KEY to ~/.config/phi102-presentation/.env, then rerun.');
      console.log(`Generating ${id} with ${model}…`);
      const form = new FormData();
      form.append('model', model);
      form.append('prompt', prompt);
      form.append('size', size);
      form.append('quality', quality);
      form.append('n', '1');
      for (const ref of refs) {
        form.append('image[]', new Blob([await readFile(ref.file)], { type: mime(ref.file) }), path.basename(ref.file));
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
      await writeFile(png, Buffer.from(b64, 'base64'));
      requested = true;
    }
    const outputSize = await toWebp(converter, png, webp);
    await record({ id, file: `${id}.webp`, alt: shot.alt, model, quality, size, outputSize, converter,
      references: refs.map(ref => ref.shown), referenceSet: refSet, prompt,
      source: path.relative(root, png), requestedThisRun: requested, created: new Date().toISOString() });
    console.log(`Saved ${id}.webp (${outputSize})`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
