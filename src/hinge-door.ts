import './hinge-door.css';

export const hingeScene = {
  w: 540,
  h: 450,
  label: 'A weathered teal door hinge with a steel pin.',
  mount(host: HTMLElement) {
    const art = document.createElement('div');
    art.className = 'scene-art hinge-illustration';
    const image = document.createElement('img');
    image.src = '/generated/props/ink-ocean/hinge.webp';
    image.alt = hingeScene.label;
    image.draggable = false;
    image.width = 900;
    image.height = 600;
    art.append(image);
    host.prepend(art);
  },
};
