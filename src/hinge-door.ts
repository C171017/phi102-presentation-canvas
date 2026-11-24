import './hinge-door.css';

export const hingeArtwork = '/generated/props/ink-ocean/hinge.webp';

export const hingeScene = {
  w: 540,
  h: 450,
  label: 'A weathered teal door hinge with a steel pin.',
  mount(host: HTMLElement) {
    const art = document.createElement('div');
    art.className = 'scene-art hinge-illustration';
    const image = document.createElement('img');
    image.src = hingeArtwork;
    image.alt = hingeScene.label;
    image.draggable = false;
    image.width = 900;
    image.height = 600;
    art.append(image);
    host.prepend(art);
  },
};
