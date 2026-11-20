import hingePoses from './assets/hinge-door/hinge-poses.webp';
import './hinge-door.css';

// The leaf, palette and shadows are rendered together in each of the 30 poses.
export function hingeDoor() {
  return `<svg class="hinge-door-model" x="30" y="0" width="480" height="450" viewBox="0 0 640 600" overflow="hidden">
    <image class="hinge-door-poses" href="${hingePoses}" width="3840" height="3000"/>
  </svg>`;
}
