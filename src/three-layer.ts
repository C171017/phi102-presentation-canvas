import * as THREE from 'three';
import type { CameraView } from './layout';

export function createThreeLayer(viewport: HTMLElement) {
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10000);
  camera.position.z = 2000;
  let renderer: THREE.WebGLRenderer | undefined;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.id = 'three-layer';
    renderer.domElement.setAttribute('aria-hidden', 'true');
    // Keep the 3D surface in front of the page art and behind canvas objects.
    viewport.insertBefore(renderer.domElement, viewport.querySelector('#world'));
  } catch (error) {
    console.warn('The optional 3D layer is unavailable.', error);
  }

  return {
    THREE, scene, camera,
    resize(width: number, height: number) {
      camera.left = -width / 2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = -height / 2;
      renderer?.setSize(width, height);
    },
    render(view: CameraView) {
      camera.position.x = view.x;
      camera.position.y = -view.y;
      camera.zoom = view.zoom;
      camera.updateProjectionMatrix();
      renderer?.render(scene, camera);
    },
  };
}

export type ThreeLayer = ReturnType<typeof createThreeLayer>;
