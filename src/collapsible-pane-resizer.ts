const COLLAPSE_DISTANCE = 48;
const EXPAND_DISTANCE = 32;
const DRAG_DISTANCE = 5;

type Axis = 'x' | 'y';
type PaneSize = { open: boolean; size: number; min: number; preferred: number | null };
type ResizeOptions = {
  inward: 1 | -1;
  getAxis?: () => Axis;
  getSize: () => PaneSize;
  setOpen: (open: boolean) => void;
  setSize: (size: number) => void;
  save: (axis: Axis, previousSize?: number | null) => void;
};

export function attachCollapsiblePaneResizer(
  pane: HTMLElement,
  handle: HTMLElement,
  { inward, getAxis = () => 'x', getSize, setOpen, setSize, save }: ResizeOptions,
) {
  let drag: (PaneSize & { pointerId: number; axis: Axis; start: number }) | undefined;
  let dragged = false;
  const position = (event: PointerEvent, axis: Axis) => axis === 'x' ? event.clientX : event.clientY;

  handle.addEventListener('pointerdown', event => {
    if (event.button !== 0 || drag) return;
    event.preventDefault();
    const axis = getAxis();
    dragged = false;
    drag = { ...getSize(), pointerId: event.pointerId, axis, start: position(event, axis) };
    handle.setPointerCapture(event.pointerId);
    pane.classList.add('is-resizing');
  });

  function resizeFromPointer(event: PointerEvent) {
    if (drag?.pointerId !== event.pointerId || drag.axis !== getAxis()) return;
    const distance = inward * (position(event, drag.axis) - drag.start);
    if (!dragged && Math.abs(distance) < DRAG_DISTANCE) return;
    dragged = true;
    const size = drag.open ? drag.size + distance : drag.min + distance - EXPAND_DISTANCE;
    const open = drag.open ? size > drag.min - COLLAPSE_DISTANCE : distance >= EXPAND_DISTANCE;
    setOpen(open);
    if (open) setSize(size);
  }

  handle.addEventListener('pointermove', resizeFromPointer);
  function finishResize(event: PointerEvent) {
    if (drag?.pointerId !== event.pointerId) return;
    if (event.type === 'pointerup') resizeFromPointer(event);
    save(drag.axis, getSize().open ? undefined : drag.preferred);
    drag = undefined;
    pane.classList.remove('is-resizing');
  }
  handle.addEventListener('pointerup', finishResize);
  handle.addEventListener('pointercancel', finishResize);
  handle.addEventListener('lostpointercapture', finishResize);

  handle.addEventListener('click', event => {
    if (getSize().open || (dragged && event.detail > 0)) return;
    setOpen(true);
    save(getAxis());
  });

  handle.addEventListener('keydown', event => {
    if (drag || event.metaKey || event.ctrlKey || event.altKey) return;
    const axis = getAxis();
    const [negative, positive] = axis === 'x' ? ['ArrowLeft', 'ArrowRight'] : ['ArrowUp', 'ArrowDown'];
    const expand = inward === 1 ? positive : negative;
    const contract = inward === 1 ? negative : positive;
    const { open, size, min } = getSize();
    if (!open) {
      if (event.key !== expand && event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      if (event.repeat) return;
      setOpen(true);
    } else {
      if (event.key !== expand && event.key !== contract) return;
      event.preventDefault();
      if (event.key === contract && size <= min) setOpen(false);
      else setSize(size + (event.key === expand ? 1 : -1) * (event.shiftKey ? 96 : 24));
    }
    save(axis);
  });

  return () => drag !== undefined;
}
