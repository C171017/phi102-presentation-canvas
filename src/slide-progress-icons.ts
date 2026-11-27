const paths = {
  bus: 'M3 13V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8m-14 0a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2m-14 0h14M3 9h14M6 15v2m8-2v2M6 11h.1m7.9 0h.1',
  classroom: 'M3 3h14v9H3zm7 9v5m-3 0h6M6 7h5m-5 2h3',
  tiles: 'M3 3h6v6H3zm8 8h6v6h-6zM6.4 13.5l6.9-7M11 6h3v3',
  ink: 'M10 2.5c2.8 4 5 6 5 9a5 5 0 0 1-10 0c0-3 2.2-5 5-9ZM7.5 12a2.5 2.5 0 0 0 2 2',
  chain: 'M8 13l-1.2 1.2a2.8 2.8 0 0 1-4-4L6 7a2.8 2.8 0 0 1 4 0m2 0 1.2-1.2a2.8 2.8 0 0 1 4 4L14 13a2.8 2.8 0 0 1-4 0m-3-1 6-4',
  storm: 'M4 12h11a3 3 0 1 0-.5-6 4.5 4.5 0 0 0-8.5 1.1A2.5 2.5 0 1 0 4 12Zm6 1.5-2 2.3h2.8l-2 2',
  branches: 'M10 17V9m0 0-6-5m6 5 6-5M4 8V4h4m4 0h4v4',
  question: 'M7 6.5a3 3 0 1 1 5 2.2c-1.3.8-2 1.4-2 2.8m0 3.5h.01M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z',
  infinity: 'M10 10c-1.8-2.2-2.6-3.3-4.4-3.3a3.3 3.3 0 1 0 0 6.6c1.8 0 2.6-1.1 4.4-3.3s2.6-3.3 4.4-3.3a3.3 3.3 0 1 1 0 6.6c-1.8 0-2.6-1.1-4.4-3.3Z',
  ship: 'M10 3v9m0-8 5 7h-5m-1-5-3 5h3M3 13h14l-3 3H6l-3-3Zm0 5c1.2 0 1.5-.7 2.5-.7s1.3.7 2.5.7 1.5-.7 2.5-.7 1.3.7 2.5.7 1.5-.7 2.5-.7 1.3.7 2.5.7',
  stone: 'M3 11l4-6 7-1 3 5-3 6-7 1-4-5Zm0 0 6 1 5 3m-5-3 5-8',
  blocks: 'M3 12h7v5H3zm7 0h7v5h-7zM6 7h7v5H6z',
  waves: 'M2 8c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2M2 12c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2M2 16c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2',
  footsteps: 'M7 3c1.3 0 2.2 1.6 1.8 3.2S7.6 8.5 6.6 8.3 5 7 5.1 5.7 5.8 3 7 3Zm5.7 7.3c1.2-.5 2.5.6 2.8 2.2s-.2 2.8-1.2 3.1-2-.7-2.4-2 .0-2.9.8-3.3ZM5.6 10l1.9.3m6 7.5 1.8-.6',
  gavel: 'm8 4 3-2 4 5-3 2-4-5Zm2 3-6 5m7 4h7m-6-2h5v2',
  road: 'M7 3 3 17m10-14 4 14m-7-14v3m0 3v2m0 3v3',
  door: 'M4 17h13M6 17V4h8v13m-2-7h.01',
  openDoor: 'M5 17V4h10v13M5 4l7-2v16l-7-1m4-7h.01',
  sunset: 'M2 11h16m-5 0a3 3 0 0 0-6 0m3-8v2M5 5l1.5 1.5M15 5l-1.5 1.5M4 14h12m-9 3h6',
  spark: 'M10 2c.6 4.9 2.5 6.8 7.5 8-5 1.2-6.9 3.1-7.5 8-.6-4.9-2.5-6.8-7.5-8C7.5 8.8 9.4 6.9 10 2Z',
  hinge: 'M9 3h2v14H9zM9 5H3v10h6m2-10h6v10h-6M6 8h.01M6 12h.01M14 8h.01m0 4h.01',
  clock: 'M10 2.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15Zm0 3.5v4l3 1.5',
  scales: 'M10 3v13m-4 1h8M3 6h14M5 6l-3 6h6L5 6Zm10 0-3 6h6l-3-6Z',
  check: 'M4 4h12v12H4zm3 6 2 2 4-4',
  people: 'M7 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm6 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM3 16v-2a4 4 0 0 1 8 0v2m2-6a4 4 0 0 1 4 4v2',
  book: 'M10 17V5m0 0C8 3 5 3 3 4v11c2-1 5-1 7 2 2-3 5-3 7-2V4c-2-1-5-1-7 1Z',
  grid: 'M3.5 3.5h5v5h-5zm8 0h5v5h-5zm-8 8h5v5h-5zm8 0h5v5h-5z',
  speech: 'M3 4h14v10H8l-4 3v-3H3zm3 4h8m-8 3h5',
  eye: 'M2.5 10s3-5 7.5-5 7.5 5 7.5 5-3 5-7.5 5-7.5-5-7.5-5ZM10 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z',
  key: 'M12 3a4 4 0 1 1-2.5 7.1L5 15v2H3v-3l5-5A4 4 0 0 1 12 3Zm.5 3.5h.01',
  home: 'm2 9 8-6 8 6m-2-1v9H4V8m4 9v-5h4v5',
  move: 'M2 10h16m-13-3-3 3 3 3m10-6 3 3-3 3',
  layers: 'm10 3 7 4-7 4-7-4 7-4Zm-7 7 7 4 7-4m-14 3 7 4 7-4',
  page: 'M5 3h7l3 3v11H5zM12 3v4h3M8 10h4m-4 3h4',
};

const slideIcons: Record<string, keyof typeof paths> = {
  'unitrans-arrival': 'bus',
  'before-lecture': 'classroom',
  'contemporary-heading': 'tiles',
  L0: 'ink',
  L2: 'chain',
  'L3-continued': 'storm',
  L4: 'branches',
  'regress-skepticism': 'question',
  'regress-infinitism': 'infinity',
  'regress-coherentism': 'ship',
  'regress-foundationalism': 'stone',
  'L6-A': 'blocks',
  'L6-B': 'waves',
  L7: 'footsteps',
  P1: 'gavel',
  'P2-arrival': 'road',
  'P2-1': 'door',
  'P2-2a': 'sunset',
  'P2-2b': 'door',
  'P2-2c': 'openDoor',
  'P2-3': 'footsteps',
  'P2-4': 'storm',
  'P2-5': 'hinge',
  'P2-6': 'clock',
  'P2-7': 'spark',
  'dilemma-heading': 'scales',
  'undoubted-heading': 'check',
  'route-social-heading': 'people',
  'route-hinges-heading': 'hinge',
  'route-knowledge-heading': 'book',
  'versions-map-heading': 'branches',
  'pairings-heading': 'grid',
  'pairing-social-simone': 'people',
  'pairing-social-cole': 'speech',
  'pairing-hinges-simone': 'hinge',
  'pairing-hinges-cole': 'openDoor',
  'pairing-knowledge-simone': 'book',
  'pairing-knowledge-cole': 'speech',
  'pairing-knowledge-rae': 'eye',
  'pairing-knowledge-echo': 'spark',
  'pairing-belief': 'layers',
  'access-heading': 'key',
  'home-heading': 'home',
  'mobile-heading': 'move',
  'flexible-heading': 'layers',
  'aim-motivations': 'question',
  'aim-versions': 'branches',
  'aim-applications': 'clock',
};

export function slideProgressIcon(slide: string) {
  const namespace = 'http://www.w3.org/2000/svg';
  const icon = document.createElementNS(namespace, 'svg');
  icon.classList.add('slide-progress-icon');
  icon.setAttribute('viewBox', '0 0 20 20');
  icon.setAttribute('aria-hidden', 'true');
  icon.setAttribute('fill', 'none');
  icon.setAttribute('stroke', 'currentColor');
  icon.setAttribute('stroke-width', '1.5');
  icon.setAttribute('stroke-linecap', 'round');
  icon.setAttribute('stroke-linejoin', 'round');
  const path = document.createElementNS(namespace, 'path');
  path.setAttribute('d', paths[slideIcons[slide] ?? 'page']);
  icon.append(path);
  return icon;
}
