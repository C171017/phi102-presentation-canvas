type Vec = number[];
type Face = { v: Vec[]; color: string; normal: Vec; owner: number };
export type HarborCamera = {
  yaw: number;
  tilt: number;
  width: number;
  height: number;
  center: Vec;
  shadow: number;
};
const tau = Math.PI * 2,
  clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const palette: Record<string, string> = {
  paper: '#f3e6c8',
  cream: '#fff2ce',
  chalk: '#fff9e8',
  sand: '#cfac75',
  skin: '#e8b18a',
  ink: '#393c3c',
  dark: '#393638',
  wood: '#ad7550',
  oak: '#c29162',
  grain: '#986741',
  walnut: '#71503d',
  brass: '#c39a56',
  gold: '#e3bc70',
  bronze: '#94703b',
  mint: '#91b6aa',
  teal: '#41877e',
  deepteal: '#315f5b',
  red: '#ba6146',
  brick: '#944b3a',
  coral: '#d58765',
  blue: '#587eac',
  navy: '#3b5578',
  sky: '#a3c7d4',
  lilac: '#b197ba',
  purple: '#895e98',
  plum: '#6c4c78',
  water: '#87b8b4',
  wave: '#bdd7ca',
  rock: '#aaa38b',
  grey: '#7a7e70',
  flash: '#ffe6a0',
  steel: '#667a77',
};
const rgb = Object.fromEntries(
  Object.entries(palette).map(([key, hex]) => [key, [1, 3, 5].map((n) => parseInt(hex.slice(n, n + 2), 16))]),
);
const sub = (a: Vec, b: Vec) => a.map((v, i) => v - b[i]),
  add = (a: Vec, b: Vec) => a.map((v, i) => v + b[i]),
  mul = (a: Vec, t: number) => a.map((v) => v * t);
const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: Vec, b: Vec) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const unit = (a: Vec) => mul(a, 1 / (Math.sqrt(dot(a, a)) || 1));
function rotate(p: Vec, axis: Vec, angle: number) {
  const a = unit(axis),
    c = Math.cos(angle),
    s = Math.sin(angle);
  return add(add(mul(p, c), mul(cross(a, p), s)), mul(a, dot(a, p) * (1 - c)));
}
const light = unit([-0.55, 0.98, 0.67]),
  lightX = unit(cross([0, 1, 0], light)),
  lightY = cross(light, lightX);
function model() {
  const faces: Face[] = [],
    tags: Vec[] = [];
  let owner = -1,
    transform = (p: Vec) => p;
  function part(id: number, draw: () => void) {
    const old = owner;
    owner = id;
    draw();
    owner = old;
  }
  function group(at: Vec, axis: Vec, angle: number, draw: () => void) {
    const old = transform;
    transform = (p) => old(add(at, rotate(p, axis, angle)));
    draw();
    transform = old;
  }
  function poly(points: Vec[], color: string) {
    const v = points.map(transform),
      normal = unit(cross(sub(v[1], v[0]), sub(v[2], v[0])));
    faces.push({ v, color, normal, owner });
  }
  function marker(id: number, x: number, y: number, z: number) {
    tags[id] = transform([x, y, z]);
  }
  function box(x: number, y: number, z: number, w: number, h: number, d: number, c: string, cut = 0.06) {
    const a = w / 2,
      b = d / 2,
      k = Math.min(cut, a * 0.34, b * 0.34);
    const foot = [
      [-a + k, -b],
      [-a, -b + k],
      [-a, b - k],
      [-a + k, b],
      [a - k, b],
      [a, b - k],
      [a, -b + k],
      [a - k, -b],
    ];
    const ring = (yy: number, inset: number) =>
      foot.map(([xx, zz]) => [x + xx * (1 - inset / a), y + yy, z + zz * (1 - inset / b)]);
    const rim = Math.min(k * 0.42, h * 0.19),
      rings = [ring(-h / 2, rim), ring(-h / 2 + rim, 0), ring(h / 2 - rim, 0), ring(h / 2, rim)];
    poly(rings[0].slice().reverse(), c);
    poly(rings[3], c);
    for (let r = 0; r < 3; r++)
      for (let i = 0; i < 8; i++) {
        let j = (i + 1) % 8;
        poly([rings[r][i], rings[r][j], rings[r + 1][j], rings[r + 1][i]], c);
      }
  }
  function tube(a: Vec, b: Vec, r1: number, r2: number, c: string, n = 12) {
    const axis = unit(sub(b, a)),
      side = unit(cross(axis, Math.abs(axis[1]) > 0.85 ? [1, 0, 0] : [0, 1, 0])),
      up = cross(axis, side);
    const rings = [a, b].map((v, k) =>
      Array.from({ length: n }, (_, i) =>
        add(v, mul(add(mul(side, Math.cos((tau * i) / n)), mul(up, Math.sin((tau * i) / n))), k ? r2 : r1)),
      ),
    );
    poly(rings[0].slice().reverse(), c);
    poly(rings[1], c);
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      poly([rings[0][i], rings[0][j], rings[1][j], rings[1][i]], c);
    }
  }
  function cyl(x: number, y: number, z: number, rb: number, rt: number, h: number, c: string, n = 14) {
    tube([x, y - h / 2, z], [x, y + h / 2, z], rb, rt, c, n);
  }
  function ball(
    x: number,
    y: number,
    z: number,
    rx: number,
    ry: number,
    rz: number,
    c: string,
    n = 10,
    l = 6,
  ) {
    const rings = Array.from({ length: l + 1 }, (_, j) =>
      Array.from({ length: n }, (_, i) => {
        const lat = (j / l - 0.5) * Math.PI,
          ang = (tau * i) / n;
        return [
          x + rx * Math.cos(lat) * Math.cos(ang),
          y + ry * Math.sin(lat),
          z + rz * Math.cos(lat) * Math.sin(ang),
        ];
      }),
    );
    for (let j = 0; j < l; j++)
      for (let i = 0; i < n; i++) {
        const k = (i + 1) % n;
        poly(
          j === 0
            ? [rings[j][i], rings[j + 1][i], rings[j + 1][k]]
            : j === l - 1
              ? [rings[j][i], rings[j + 1][i], rings[j][k]]
              : [rings[j][i], rings[j + 1][i], rings[j + 1][k], rings[j][k]],
          c,
        );
      }
  }
  function line(a: Vec, b: Vec, r: number, c: string) {
    tube(a, b, r, r, c, 7);
  }
  function peg(x: number, y: number, z: number, paint: string, angle = 0, s = 1) {
    group([x, y, z], [0, 1, 0], angle, () => {
      cyl(0, 0.075 * s, 0, 0.235 * s, 0.21 * s, 0.15 * s, 'dark', 10);
      cyl(0, 0.45 * s, 0, 0.23 * s, 0.165 * s, 0.72 * s, paint, 10);
      ball(0, 0.98 * s, 0, 0.18 * s, 0.21 * s, 0.18 * s, 'skin');
      cyl(0, 1.115 * s, 0, 0.198 * s, 0.168 * s, 0.105 * s, paint);
      box(0, 1.085 * s, 0.145 * s, 0.25 * s, 0.045 * s, 0.165 * s, paint);
      line([0.13 * s, 0.7 * s, 0.02 * s], [0.25 * s, 0.52 * s, 0.12 * s], 0.054 * s, paint);
      line([-0.13 * s, 0.69 * s, 0], [-0.22 * s, 0.57 * s, 0.1 * s], 0.054 * s, paint);
      ball(0.075 * s, 1.01 * s, 0.158 * s, 0.021 * s, 0.024 * s, 0.018 * s, 'ink', 6, 4);
      ball(-0.075 * s, 1.01 * s, 0.158 * s, 0.021 * s, 0.024 * s, 0.018 * s, 'ink', 6, 4);
    });
  }
  return { faces, tags, part, group, poly, box, tube, cyl, ball, line, marker, peg };
}
// Both camera and light use the same world-space mesh. A small software depth
// buffer keeps overlapping surfaces and hover targets correct without WebGL.
function raster(
  a: Vec,
  b: Vec,
  c: Vec,
  w: number,
  h: number,
  visit: (index: number, u: number, v: number) => void,
) {
  const x0 = Math.max(0, Math.floor(Math.min(a[0], b[0], c[0]))),
    x1 = Math.min(w - 1, Math.ceil(Math.max(a[0], b[0], c[0])));
  const y0 = Math.max(0, Math.floor(Math.min(a[1], b[1], c[1]))),
    y1 = Math.min(h - 1, Math.ceil(Math.max(a[1], b[1], c[1])));
  const den = (b[1] - c[1]) * (a[0] - c[0]) + (c[0] - b[0]) * (a[1] - c[1]);
  if (Math.abs(den) < 0.002) return;
  const du = (b[1] - c[1]) / den,
    dv = (c[1] - a[1]) / den,
    eu = (c[0] - b[0]) / den,
    ev = (a[0] - c[0]) / den;
  for (let y = y0; y <= y1; y++) {
    let u = du * (x0 + 0.5 - c[0]) + eu * (y + 0.5 - c[1]),
      v = dv * (x0 + 0.5 - c[0]) + ev * (y + 0.5 - c[1]);
    for (let x = x0; x <= x1; x++, u += du, v += dv)
      if (u >= -1e-6 && v >= -1e-6 && u + v <= 1.000001) visit(y * w + x, u, v);
  }
}
export function renderHarbor(
  canvas: HTMLCanvasElement,
  cam: HarborCamera,
  amount: number[],
  quality: number,
) {
  const w = Math.round(canvas.clientWidth * quality),
    h = Math.round(canvas.clientHeight * quality);
  const m = harbor(amount);
  if (!w || !h) return null;
  if (canvas.width !== w) canvas.width = w;
  if (canvas.height !== h) canvas.height = h;
  const ctx = canvas.getContext('2d')!,
    pixels = ctx.createImageData(w, h),
    rgba = pixels.data,
    depth = new Float32Array(w * h).fill(-1e4),
    ids = new Int8Array(w * h).fill(-1);
  const eye = [
      Math.sin(cam.yaw) * Math.cos(cam.tilt),
      Math.sin(cam.tilt),
      Math.cos(cam.yaw) * Math.cos(cam.tilt),
    ],
    right = unit(cross([0, 1, 0], eye)),
    up = cross(eye, right);
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  for (const f of m.faces)
    for (const p of f.v) {
      const x = dot(p, right),
        y = dot(p, up);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  const scale = Math.min(
    w / cam.width,
    h / cam.height,
    (w * 0.96) / (maxX - minX),
    (h * 0.9) / (maxY - minY),
  );
  const originX = clamp(
    w * 0.5 - dot(cam.center, right) * scale,
    w * 0.02 - minX * scale,
    w * 0.98 - maxX * scale,
  );
  const originY = clamp(
    h * 0.505 + dot(cam.center, up) * scale,
    h * 0.04 + maxY * scale,
    h * 0.94 + minY * scale,
  );
  const proj = (p: Vec) => [originX + dot(p, right) * scale, originY - dot(p, up) * scale, dot(p, eye)];
  const sw = 256,
    ss = sw / 12,
    shadows = new Float32Array(sw * sw).fill(-1e4);
  const lp = (p: Vec) => [sw / 2 + dot(p, lightX) * ss, sw * 0.61 - dot(p, lightY) * ss, dot(p, light)];
  const data = m.faces.map((f) => ({ f, lit: f.v.map(lp) }));
  for (const { f, lit } of data) {
    if (dot(f.normal, light) <= 0) continue;
    const a = lit[0];
    for (let i = 1; i < lit.length - 1; i++) {
      const b = lit[i],
        c = lit[i + 1];
      raster(a, b, c, sw, sw, (j, u, v) => {
        const d = c[2] + u * (a[2] - c[2]) + v * (b[2] - c[2]);
        if (d > shadows[j]) shadows[j] = d;
      });
    }
  }
  for (const { f, lit } of data) {
    const facing = dot(f.normal, eye);
    if (facing < 0.0001) continue;
    const v = f.v.map(proj),
      base = rgb[f.color],
      ndl = Math.max(0, dot(f.normal, light)),
      sky = f.normal[1] * 0.055;
    const hot = f.owner >= 0 ? amount[f.owner] : 0,
      gloss = ['gold', 'bronze', 'brass', 'steel'].includes(f.color)
        ? Math.pow(Math.max(0, dot(f.normal, unit(add(light, eye)))), 12) * 0.19
        : 0;
    const fill = 0.78 + 0.26 * ndl + sky + gloss + hot * 0.055;
    const near = base.map((c) => Math.round(Math.min(255, c * fill + hot * 4))),
      shade = base.map((c) => Math.round(Math.min(255, c * (fill - 0.17))));
    for (let i = 1; i < v.length - 1; i++) {
      const a = v[0],
        b = v[i],
        c = v[i + 1],
        la = lit[0],
        lb = lit[i],
        lc = lit[i + 1];
      raster(a, b, c, w, h, (j, u, t) => {
        const d = c[2] + u * (a[2] - c[2]) + t * (b[2] - c[2]);
        if (d <= depth[j]) return;
        depth[j] = d;
        ids[j] = f.owner;
        const lx = lc[0] + u * (la[0] - lc[0]) + t * (lb[0] - lc[0]),
          ly = lc[1] + u * (la[1] - lc[1]) + t * (lb[1] - lc[1]),
          ld = lc[2] + u * (la[2] - lc[2]) + t * (lb[2] - lc[2]);
        const k = (ly | 0) * sw + (lx | 0),
          inShade = shadows[k] > ld + 0.075 && shadows[k + 1] > ld + 0.06;
        const col = inShade ? shade : near,
          j4 = j * 4;
        rgba[j4] = col[0];
        rgba[j4 + 1] = col[1];
        rgba[j4 + 2] = col[2];
        rgba[j4 + 3] = 255;
      });
    }
  }
  ctx.putImageData(pixels, 0, 0);
  ctx.save();
  ctx.globalCompositeOperation = 'destination-over';
  const ground = proj([0, -0.21, 0]);
  ctx.translate(ground[0] + scale * 0.18, ground[1]);
  ctx.scale(scale * cam.shadow, scale * (0.48 + 0.9 * Math.sin(cam.tilt)));
  const gradient = ctx.createRadialGradient(0, 0, 0.14, 0, 0, 1);
  gradient.addColorStop(0, 'rgba(68,53,39,.38)');
  gradient.addColorStop(0.66, 'rgba(68,53,39,.15)');
  gradient.addColorStop(1, 'rgba(68,53,39,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(-1, -1, 2, 2);
  ctx.restore();
  return { ids, w, h, markers: m.tags.map((p) => proj(p).map((x) => x / quality)) };
}
function harbor(t: Vec) {
  const m = model(),
    { box, cyl, tube, line, ball, group, part, poly, marker, peg } = m;
  // A cut section of water, a timber pier and an outcrop cast from one tabletop model.
  box(0, 0.03, 0, 7.8, 0.31, 3.95, 'deepteal', 0.46);
  box(0, 0.2, 0, 7.78, 0.16, 3.93, 'water', 0.46);
  for (let i = 0; i < 28; i++) {
    const x = -3.47 + ((i * 1.764) % 6.94),
      z = -1.67 + ((i * 0.913) % 3.32);
    box(x, 0.289, z, 0.12 + (i % 4) * 0.1, 0.011, 0.022, i % 3 ? 'wave' : 'mint', 0.008);
  }
  for (const [x, z, r] of [
    [-2.65, -0.8, 0.96],
    [-3.05, -0.26, 0.62],
    [-2.03, -0.68, 0.7],
    [-2.6, -1.34, 0.76],
  ]) {
    ball(x, 0.27, z, r, 0.54 * r, r * 0.77, 'rock', 8, 4);
  }
  const lx = -2.6,
    lz = -0.8;
  cyl(lx, 0.96, lz, 0.45, 0.33, 0.88, 'chalk');
  cyl(lx, 1.58, lz, 0.34, 0.275, 0.38, 'brick');
  cyl(lx, 1.97, lz, 0.281, 0.244, 0.4, 'chalk');
  cyl(lx, 2.21, lz, 0.42, 0.42, 0.09, 'ink');
  cyl(lx, 2.44, lz, 0.226, 0.226, 0.4, 'flash', 8);
  for (let i = 0; i < 6; i++) {
    const a = (tau * i) / 6;
    line(
      [lx + 0.235 * Math.cos(a), 2.24, lz + 0.235 * Math.sin(a)],
      [lx + 0.235 * Math.cos(a), 2.67, lz + 0.235 * Math.sin(a)],
      0.025,
      'ink',
    );
  }
  cyl(lx, 2.71, lz, 0.4, 0.03, 0.26, 'brick', 8);
  cyl(lx, 2.88, lz, 0.036, 0.025, 0.12, 'brass');
  for (let i = 0; i < 9; i++) {
    const a = (tau * i) / 9,
      b = (tau * (i + 1)) / 9;
    const p = [lx + 0.39 * Math.cos(a), 2.37, lz + 0.39 * Math.sin(a)],
      q = [lx + 0.39 * Math.cos(b), 2.37, lz + 0.39 * Math.sin(b)];
    line([p[0], 2.23, p[2]], p, 0.014, 'ink');
    line(p, q, 0.013, 'ink');
  }
  box(lx, 1.0, lz + 0.386, 0.15, 0.27, 0.035, 'navy');
  box(lx, 1.91, lz + 0.257, 0.1, 0.14, 0.035, 'navy');
  for (const x of [-1.25, 0.42, 2.03, 3.13])
    for (const z of [-0.64, 0.65]) {
      cyl(x, 0.47, z, 0.093, 0.1, 0.54, 'walnut', 8);
      cyl(x, 0.77, z, 0.115, 0.116, 0.095, 'oak', 8);
    }
  for (let i = 0; i < 24; i++)
    box(-1.48 + i * 0.205, 0.625, 0, 0.19, 0.12, 1.48, i % 4 === 1 ? 'oak' : 'wood', 0.025);
  part(1, () => {
    peg(-1.09, 0.69, 0.11, 'teal', -0.28, 0.84);
    group([-1.83 + 0.46 * t[1], 0.31, 1.24], [0, 1, 0], -0.09 - 0.16 * t[1], () => {
      for (const [yy, a, b, d, c] of [
        [0.1, 1.44, 0.11, 0.32, 'brick'],
        [0.18, 1.56, 0.12, 0.46, 'chalk'],
        [0.27, 1.61, 0.075, 0.51, 'teal'],
      ] as const)
        box(0, yy, 0, a, b, d, c, 0.19);
      box(-0.05, 0.34, 0, 0.6, 0.15, 0.37, 'cream');
      box(-0.03, 0.48, 0, 0.46, 0.19, 0.32, 'teal');
      box(-0.04, 0.592, 0, 0.57, 0.05, 0.4, 'cream');
      box(-0.04, 0.5, 0.17, 0.28, 0.092, 0.025, 'sky');
      line([-0.47, 0.3, -0.08], [-0.47, 0.68, -0.08], 0.025, 'gold');
    });
    marker(1, -1.38, 1.77, 0.7);
  });
  part(0, () => {
    peg(0.13, 0.69, -0.04, 'red', 0.2, 0.93);
    box(0.69, 0.95, 0.22, 0.48, 0.5, 0.37, 'walnut');
    group([0.69, 1.29, 0.21], [0, 1, 0], -0.5 + 0.95 * t[0], () => {
      box(0, 0, 0, 0.55, 0.24, 0.35, 'red');
      box(0, 0.015, 0.186, 0.3, 0.11, 0.015, 'cream');
      line([0.18, 0.1, 0], [0.25, 0.57, 0], 0.016, 'ink');
      line([-0.12, 0.15, 0.03], [0.1, 0.15, 0.03], 0.047, 'dark');
    });
    marker(0, 0.48, 2.05, 0.12);
  });
  part(2, () => {
    peg(2.61, 0.69, 0.1, 'blue', -0.48, 0.88);
    group([2.0, 0.7, -0.0], [0, 1, 0], -0.2 - 1.02 * t[2], () => {
      for (const [x, z] of [
        [-0.22, 0.18],
        [0.21, 0.13],
        [0, -0.22],
      ])
        line([x, 0, z], [0, 0.57, 0], 0.044, 'brass');
      tube([0.15, 0.61, 0.14], [-0.32, 0.77, -0.31], 0.075, 0.14, 'blue');
      tube([-0.29, 0.76, -0.28], [-0.37, 0.79, -0.35], 0.15, 0.15, 'brass');
    });
    marker(2, 2.52, 1.9, 0.11);
  });
  part(3, () => {
    const x = 1.14,
      z = -0.57;
    line([x, 0.66, z], [x, 2.78, z], 0.044, 'oak');
    ball(x, 2.82, z, 0.075, 0.075, 0.075, 'gold');
    const fy = 2.14 + 0.48 * t[3],
      width = 0.68 + 0.44 * t[3];
    const cloth = [];
    for (let i = 0; i < 5; i++) {
      const u = i / 4;
      cloth.push([x + width * u, fy - 0.1 * u, z + 0.12 * Math.sin(u * 4.8 + 0.5 * t[3])]);
    }
    for (let i = 0; i < 4; i++) {
      const a = cloth[i],
        b = cloth[i + 1],
        aa = [a[0], a[1] - 0.43 * (1 - i * 0.12), a[2]],
        bb = [b[0], b[1] - 0.43 * (1 - (i + 1) * 0.12), b[2]];
      const face = [a, aa, bb, b];
      poly(face, i === 2 ? 'lilac' : 'purple');
      poly(face.slice().reverse(), i === 2 ? 'lilac' : 'purple');
    }
    marker(3, x + 0.51, fy + 0.13, z);
  });
  return m;
}
