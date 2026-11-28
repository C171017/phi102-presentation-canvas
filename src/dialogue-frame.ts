// Keep the last painted frame until the requested one is decoded. The scene
// can change again before decoding finishes (rapid input or a room update).
export function createDialogueFrame(paint: (url: string) => void) {
  let requested: string | undefined;
  let displayed: HTMLImageElement | undefined;
  let preloaded = new Map<string, HTMLImageElement>();
  function preload(...urls: string[]) {
    const images = new Map<string, HTMLImageElement>();
    for (const url of urls) {
      let image = preloaded.get(url);
      if (!image) {
        image = new Image();
        image.src = url;
        void image.decode().catch(() => {});
      }
      images.set(url, image);
    }
    preloaded = images;
  }
  return {
    show(url: string) {
      requested = url;
      if (displayed?.getAttribute('src') === url) { paint(url); return; }
      const image = preloaded.get(url) ?? new Image();
      if (!image.hasAttribute('src')) image.src = url;
      void image.decode().then(() => {
        if (requested !== url) return;
        displayed = image;
        paint(url);
      }).catch(() => {});
    },
    preload,
    cancel() { requested = undefined; },
  };
}
