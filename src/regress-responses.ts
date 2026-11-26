export const operationBecauseScene = 'L4';
export const foundationalismScene = 'regress-foundationalism';

export const regressDetours = [
  { scene: 'regress-skepticism', character: 'Pyrrho', theory: 'Skepticism' },
  { scene: 'regress-infinitism', character: 'Peirce', theory: 'Infinitism' },
  { scene: 'regress-coherentism', character: 'Neurath', theory: 'Coherentism' },
] as const;

export function isRegressDetour(scene?: string) {
  return regressDetours.some(detour => detour.scene === scene);
}

export function regressSceneDestination(scene: string, forward: boolean) {
  if (isRegressDetour(scene) || (scene === foundationalismScene && !forward)) return operationBecauseScene;
  if (scene === operationBecauseScene && forward) return foundationalismScene;
}
