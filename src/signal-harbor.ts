import { renderHarbor, type HarborCamera } from './signal-harbor-model';
import './signal-harbor.css';

const views = [
  { name: 'Contextualism', part: 'Kit’s radio', role: 'Speaker', color: '#a8543b', flag: 'Formal inquiry',
    text: 'Kit switches from harbor chat to a formal inquiry. The same words now say that Mara meets a stricter standard. The conversation changes which proposition Kit expresses.' },
  { name: 'Sensitive invariantism', part: 'Mara’s launch', role: 'Subject', color: '#39796f', flag: 'Rescue underway',
    text: 'Mara sees the same light, but now a rescue depends on it. Her higher stakes can change whether her belief is foundationally justified. The words keep their meaning.' },
  { name: 'Relativism', part: 'Jo’s telescope', role: 'Assessor', color: '#436f9d', flag: 'Reassessing the same report',
    text: 'Jo reassesses Kit’s original transmission. That one claim can be true by routine assessment standards and false by rescue-review standards.' },
  { name: 'Expressivism', part: 'Kit’s signal flag', role: 'Utterance', color: '#80578d', flag: 'A rule endorsed',
    text: 'Kit raises the flag. In calling Mara’s belief foundationally justified, Kit endorses a rule for reasoning. A clear sighting can serve as a starting point without a further reason.' },
];
const overview = 'Mara sees a glow and believes the harbor lamp is lit. Kit says Mara’s belief is foundationally justified. Jo assesses Kit’s claim.';

export function mountSignalHarbor(host: HTMLElement) {
  host.classList.add('signal-harbor');
  host.setAttribute('aria-label', 'Signal Harbor. Explore four views of foundational justification.');
  host.innerHTML = `<header><strong>Signal Harbor</strong><span>Hover to explore · click to hold · drag the harbor to turn</span></header>
    <div class="harbor-stage"><canvas role="img" aria-label="Mara beside a launch, Kit at the radio and signal flag, and Jo at the telescope. The four controls below explore the model."></canvas><span class="harbor-tag" hidden></span></div>
    <div class="harbor-views" role="group" aria-label="Views of foundational justification"></div>
    <p class="harbor-caption"></p>`;
  const canvas = host.querySelector('canvas')!;
  const tag = host.querySelector<HTMLElement>('.harbor-tag')!;
  const caption = host.querySelector<HTMLElement>('.harbor-caption')!;
  const controls = host.querySelector<HTMLElement>('.harbor-views')!;
  const buttons = views.map((view, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.style.setProperty('--role-color', view.color);
    const title = document.createElement('strong');
    title.textContent = view.name;
    const detail = document.createElement('span');
    detail.textContent = `${view.role} · ${view.part}`;
    button.append(title, detail);
    button.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') preview(index); });
    button.addEventListener('pointerleave', () => preview(-1));
    button.addEventListener('focus', () => preview(index));
    button.addEventListener('blur', () => preview(-1));
    button.addEventListener('click', () => toggle(index));
    controls.append(button);
    return button;
  });
  caption.id = `${host.id}-explanation`;
  for (const button of buttons) button.setAttribute('aria-describedby', caption.id);

  const camera: HarborCamera = { yaw: .24, tilt: .34, width: 8.72, height: 4.70, center: [0, 1.32, 0], shadow: 4.4 };
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let pinned = -1, hovered = -1, active = -1;
  let amounts = views.map(() => 0);
  let image: ReturnType<typeof renderHarbor> = null;
  let drag: { id: number; x: number; y: number; yaw: number; tilt: number; part: number; moved: boolean } | undefined;
  let frame = 0, previousTime = 0, visible = false;

  function schedule() {
    if (visible && !frame) frame = requestAnimationFrame(draw);
  }
  function draw(time: number) {
    frame = 0;
    if (!visible) return;
    const dt = previousTime ? Math.min(time - previousTime, 100) : 16;
    let moving = false;
    amounts = amounts.map((value, i) => {
      const goal = Number(i === active), delta = goal - value;
      if (reduceMotion.matches || Math.abs(delta) < .012) return goal;
      moving = true;
      return value + delta * (1 - Math.exp(-dt / 83));
    });
    const quality = moving || drag?.moved ? 1 : Math.min(2, Math.max(1.5, window.devicePixelRatio));
    image = renderHarbor(canvas, camera, amounts, quality);
    if (active >= 0 && image) {
      const [x, y] = image.markers[active];
      const inset = tag.offsetWidth / 2 + 4;
      tag.style.left = Math.max(inset, Math.min(canvas.clientWidth - inset, x)) + 'px';
      tag.style.top = Math.max(tag.offsetHeight, y - 4) + 'px';
    }
    previousTime = moving ? time : 0;
    if (moving) schedule();
  }
  function update() {
    active = hovered < 0 ? pinned : hovered;
    buttons.forEach((button, i) => {
      button.classList.toggle('is-active', i === active);
      button.setAttribute('aria-pressed', String(i === pinned));
    });
    caption.textContent = views[active]?.text ?? overview;
    tag.hidden = active < 0;
    tag.textContent = views[active]?.flag ?? '';
    schedule();
  }
  function preview(index: number) {
    if (hovered === index) return;
    hovered = index;
    update();
  }
  function toggle(index: number) {
    pinned = pinned === index ? -1 : index;
    hovered = -1;
    update();
  }
  function hit(event: PointerEvent) {
    if (!image) return -1;
    const bounds = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - bounds.left) * image.w / bounds.width);
    const y = Math.floor((event.clientY - bounds.top) * image.h / bounds.height);
    return x >= 0 && y >= 0 && x < image.w && y < image.h ? image.ids[y * image.w + x] : -1;
  }
  canvas.addEventListener('pointerdown', event => {
    if (event.button !== 0 || drag) return;
    // The surrounding title, margins and caption remain handles for moving the whole canvas object.
    event.stopPropagation();
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, yaw: camera.yaw, tilt: camera.tilt, part: hit(event), moved: false };
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove', event => {
    if (!drag) {
      if (event.pointerType !== 'touch') preview(hit(event));
      canvas.style.cursor = hovered < 0 ? 'grab' : 'pointer';
      return;
    }
    if (event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < 5) return;
    drag.moved = true;
    camera.yaw = drag.yaw + dx * .007;
    camera.tilt = Math.max(.13, Math.min(.95, drag.tilt + dy * .006));
    canvas.style.cursor = 'grabbing';
    preview(-1);
    schedule();
  });
  canvas.addEventListener('pointerup', event => {
    if (event.pointerId !== drag?.id) return;
    if (!drag.moved) toggle(drag.part);
    drag = undefined;
    schedule();
  });
  canvas.addEventListener('lostpointercapture', () => { drag = undefined; schedule(); });
  canvas.addEventListener('pointerleave', () => { if (!drag) preview(-1); });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    schedule();
  }).observe(canvas);
  update();
}
