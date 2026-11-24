type Bounds = readonly [left: number, top: number, width: number, height: number];

// The full-color paintings use the same 16:9 frame for establishing shots and dialogue.
// These bounds frame the speaker's head and upper body on a 400 × 225 reference grid.
const artworkSpeakers: Record<string, Record<string, Bounds>> = {
  'L1-guardian-asks-why': {
    Man: [204, 23, 135, 143], 'Question mark': [16, 5, 140, 131],
  },
  'L2-neither-did-her-hand': {
    Woman: [2, 4, 123, 139],
    Y1: [124, 2, 55, 55], Y2: [177, 20, 47, 53], Y3: [222, 3, 52, 56],
    Y4: [267, 20, 50, 55], SOWHAT: [235, 58, 31, 35],
  },
  'L3-the-question-splits': {
    Man: [59, 3, 130, 125],
    Y1: [185, 77, 64, 70], Y2: [288, 98, 64, 63],
    Y3: [166, 138, 29, 36], Y4: [45, 140, 29, 34], SOWHAT: [189, 162, 27, 29],
  },
  'L4-pyrrho-at-the-bog-y-refined': {
    Pyrrho: [57, 20, 126, 129], Y: [181, 46, 40, 41],
  },
  'L4-peirce-on-turtles-two-ys': {
    Peirce: [137, 2, 104, 123], Y1: [241, 14, 27, 30], Y2: [267, 27, 29, 28],
  },
  'L4-neurath-on-deck-three-ys-sowhat': {
    Neurath: [33, 12, 136, 131],
    Y1: [218, 78, 30, 31], Y2: [242, 95, 31, 32], Y3: [272, 86, 31, 31],
    SOWHAT: [306, 111, 43, 46],
  },
  'L5-the-fourth-answer-v2': {
    Descartes: [9, 3, 179, 148], Y: [234, 34, 55, 57], SOWHAT: [270, 98, 34, 44],
  },
  'L6-moderates-city-on-jelly': { Y: [26, 69, 31, 37] },
  'L7-stranger-covered-artifacts': { Stranger: [17, 3, 223, 136] },
  'P2-1-cole-asks': { Cole: [172, 3, 163, 151] },
  'P2-2a-flashback-sea-wall': {
    Simone: [31, 30, 67, 104], Cole: [104, 36, 80, 99],
  },
  'P2-2b-flashback-old-door': { Cole: [59, 37, 39, 100] },
  'P2-2c-flashback-through-the-door': { Cole: [3, 4, 97, 113] },
  'P2-3-he-walks-away': {
    Simone: [44, 38, 61, 94], Cole: [350, 76, 34, 69],
  },
  'P2-4-the-omen': { Simone: [287, 52, 79, 98] },
  'P2-5-the-source': { Simone: [75, 32, 68, 104] },
  'P2-6-no-time-to-explain': {
    Simone: [50, 24, 103, 121], Cole: [151, 28, 86, 90],
  },
};

const svgNS = 'http://www.w3.org/2000/svg';

function cornerPath([left, top, width, height]: Bounds) {
  const right = left + width;
  const bottom = top + height;
  const length = Math.min(width / 3, height / 3, 25);
  const radius = Math.min(8, length / 2);
  return [
    `M${left} ${top + length}V${top + radius}Q${left} ${top} ${left + radius} ${top}H${left + length}`,
    `M${right - length} ${top}H${right - radius}Q${right} ${top} ${right} ${top + radius}V${top + length}`,
    `M${right} ${bottom - length}V${bottom - radius}Q${right} ${bottom} ${right - radius} ${bottom}H${right - length}`,
    `M${left + length} ${bottom}H${left + radius}Q${left} ${bottom} ${left} ${bottom - radius}V${bottom - length}`,
  ].join('');
}

export function createSpeakerOutline() {
  const element = document.createElementNS(svgNS, 'svg');
  element.classList.add('speaker-outline');
  element.setAttribute('viewBox', '0 0 400 225');
  element.setAttribute('aria-hidden', 'true');
  const paths = Array.from({ length: 2 }, () => {
    const path = document.createElementNS(svgNS, 'path');
    element.append(path);
    return path;
  });
  function clear() { element.removeAttribute('data-speaker'); }
  return {
    element,
    clear,
    show(artwork: string, speaker: string, turn = 0) {
      const name = artwork.split('/').pop()?.replace(/\.webp$/, '') ?? '';
      const speakers = artworkSpeakers[name];
      const bounds = speaker === 'Y' ? speakers?.[`Y${turn + 1}`] ?? speakers?.Y : speakers?.[speaker];
      if (!bounds) { clear(); return; }
      const d = cornerPath(bounds);
      for (const path of paths) path.setAttribute('d', d);
      element.setAttribute('data-speaker', speaker);
    },
  };
}
