// Keep the last painted frame until the requested one is decoded. The scene
// can change again before decoding finishes (rapid input or a room update).
export function createDialogueFrame(paint: (url: string) => void) {
  let requested: string | undefined;
  let displayed: HTMLImageElement | undefined;
  let next: HTMLImageElement | undefined;
  function preload(url: string) {
    if (next?.getAttribute('src') === url) return;
    next = new Image();
    next.src = url;
    void next.decode().catch(() => {});
  }
  return {
    show(url: string) {
      requested = url;
      if (displayed?.getAttribute('src') === url) { paint(url); return; }
      const image = next?.getAttribute('src') === url ? next : new Image();
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
