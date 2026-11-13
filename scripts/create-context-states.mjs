// Static vector states have genuine transparency, with no raster background.
import { mkdir, writeFile } from 'node:fs/promises';
const folder = new URL('../public/generated/contextualism/states/', import.meta.url);
await mkdir(folder, { recursive: true });
const contexts = [
  { x: 192, y: 67, color: '#BF4338' },
  { x: 311, y: 153, color: '#216BB0' },
  { x: 265, y: 292, color: '#26856D' },
  { x: 119, y: 292, color: '#BA811A' },
  { x: 73, y: 153, color: '#8056A6' },
];
for (const [name, active] of [['red', 0], ['blue', 1]]) {
  const state = contexts[active];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="384" height="384" viewBox="0 0 384 384" role="img" aria-labelledby="title desc">
  <title id="title">The same sentence in a ${name} context</title>
  <desc id="desc">Five colored contexts form a ring. One ${name} speech bubble containing 文 A sits in the ${name} circle. The sentence stays the same; its color represents its meaning.</desc>
  <circle cx="192" cy="192" r="125" fill="none" stroke="#8C8375" stroke-width="2" stroke-dasharray="1 7" stroke-linecap="round"/>
  ${contexts.map(c => `<circle cx="${c.x}" cy="${c.y}" r="47" fill="${c.color}" fill-opacity=".14" stroke="${c.color}" stroke-width="3"/>`).join('\n  ')}
  <g transform="translate(${state.x} ${state.y})">
    <path d="M-34-24H34Q45-24 45-13V12Q45 23 34 23H-18L-36 35L-31 23H-34Q-45 23-45 12V-13Q-45-24-34-24Z" fill="${state.color}" stroke="${state.color}" stroke-width="2" stroke-linejoin="round"/>
    <text x="0" y="7" fill="#FFFFFF" text-anchor="middle" font-family="Arial, 'PingFang SC', 'Noto Sans CJK SC', sans-serif" font-size="27" font-weight="600">文 A</text>
  </g>
</svg>`;
  await writeFile(new URL(`context-${name}.svg`, folder), svg);
}
console.log('Created two transparent static states. No background rectangle or animation.');
