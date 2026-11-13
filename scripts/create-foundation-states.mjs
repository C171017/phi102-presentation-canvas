import { mkdir, writeFile } from 'node:fs/promises';
const folder = new URL('../public/generated/foundationalism/', import.meta.url);
await mkdir(folder, { recursive: true });
const positions = [60, 160, 260];
for (const [name, selected] of [['left', [0, 1]], ['right', [1, 2]]]) {
  const struts = selected.map(i => `<path d="M${positions[i]} 255L${positions[i]} 140" fill="none" stroke="#b7793f" stroke-width="12" stroke-linecap="round"/>`).join('');
  const blocks = positions.map((x, i) => {
    const on = selected.includes(i), stroke = on ? '#b7793f' : '#b5ada0';
    return `<g><rect x="${x-38}" y="250" width="76" height="48" rx="3" fill="${on ? '#ead0ad' : '#ece7de'}" stroke="${stroke}" stroke-width="2"/><path d="M${x-38} 274H${x+38}M${x} 250V274M${x-19} 274V298M${x+19} 274V298" fill="none" stroke="${stroke}" stroke-width="1" opacity=".6"/></g>`;
  }).join('');
  // Both pairs support a single shared beam; the belief remains unchanged.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="280" viewBox="12 38 296 272" role="img" aria-labelledby="title desc"><title id="title">${name === 'left' ? 'Left two' : 'Right two'} foundations support the belief</title><desc id="desc">Three stone foundations in a row. The ${name} pair has two solid supporting struts beneath the same platform and belief. The third foundation is inactive.</desc>${struts}<rect x="35" y="132" width="250" height="14" rx="3" fill="#334c4c"/><path d="M115 61H205Q216 61 216 72V110Q216 121 205 121H154L140 132V121H115Q104 121 104 110V72Q104 61 115 61Z" fill="#334c4c"/>${blocks}</svg>`;
  await writeFile(new URL(`stone-${name}.svg`, folder), svg);
}
console.log('Created two transparent, text-free stone foundation states.');
