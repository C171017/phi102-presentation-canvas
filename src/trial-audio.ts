// Short game samples from the Objection Engine asset pack. See public/trial/CREDITS.txt.
const files = {
  low: 'blip-low.wav', high: 'blip-high.wav', gavel: 'gavel.wav',
  prosecutor: 'prosecutor.mp3', mother: 'mother.wav', takeThat: 'take-that.wav',
  gallery: 'gallery.wav', pop: 'pop.wav', shatter: 'shatter.wav',
};
type Sound = keyof typeof files;

export function createTrialAudio() {
  let context: AudioContext | undefined;
  const samples = new Map<Sound, AudioBuffer>();
  const playing = new Set<AudioBufferSourceNode>();
  function warm() {
    if (!window.AudioContext) return;
    if (!context) {
      const engine = context = new AudioContext();
      for (const key of Object.keys(files) as Sound[]) {
        void fetch('/trial/' + files[key]).then(r => r.arrayBuffer())
          .then(data => engine.decodeAudioData(data)).then(buffer => samples.set(key, buffer))
          .catch(() => {});
      }
    }
    if (context.state === 'suspended' && navigator.userActivation?.hasBeenActive)
      void context.resume().catch(() => {});
  }
  function play(key: Sound, volume = 0.52) {
    const buffer = samples.get(key);
    if (!context || context.state !== 'running' || !buffer || document.hidden) return;
    const source = context.createBufferSource();
    source.buffer = buffer;
    const gain = context.createGain();
    gain.gain.value = volume;
    source.connect(gain).connect(context.destination);
    playing.add(source);
    source.onended = () => { playing.delete(source); source.disconnect(); gain.disconnect(); };
    source.start();
  }
  return { warm, play, stop() { for (const source of playing) source.stop(); playing.clear(); } };
}
