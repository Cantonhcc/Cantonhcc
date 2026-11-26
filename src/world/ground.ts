// Paints the whole lunar surface once into a single bitmap: flat-toned
// regolith, crisp craters, paved walkways, plazas, the ridge and the sky.
import { hex, makeNoise, mix, rng } from '../engine/core';
import { makeCanvas } from '../engine/px';
import { STAR_COLORS } from '../art/palette';
import { DOORS, LANDER, MAP_H, MAP_W, distToPaths, nearestOnPaths, ridgeY } from './layout';

type RGB = [number, number, number];
const TONES: RGB[] = ['#646ca5', '#5b629a', '#535a90', '#4b5186', '#43487b'].map(hex);
const RIM_LIGHT = hex('#9ba3d8');
const RIM_DARK = hex('#2c3058');
const FLOOR = hex('#3b406c');
const FLOOR_SHADOW = hex('#2a2d52');
const FLOOR_LIGHT = hex('#565d94');
const PLATE = hex('#727aae');
const PLATE_SEAM = hex('#515890');
const PLATE_EDGE = hex('#99a1d0');
const PLATE_BORDER = hex('#2d315a');

export interface Crater { x: number; y: number; r: number }
export interface Footprint { x: number; y: number; w: number; accent: string }

export function makeCraters(): Crater[] {
  const r = rng(20261126);
  const out: Crater[] = [];
  let guard = 0;
  while (out.length < 40 && guard++ < 4000) {
    const rad = 8 + Math.floor(Math.pow(r(), 2.4) * 40);
    const x = 30 + r() * (MAP_W - 60);
    const y = 170 + r() * (MAP_H - 200);
    if (distToPaths(x, y) < rad + 22) continue;
    let ok = true;
    for (const d of Object.values(DOORS)) if (Math.hypot(d.x - x, d.y - 30 - y) < rad + 84) ok = false;
    if (Math.hypot(LANDER.x - x, LANDER.y - y) < rad + 60) ok = false;
    for (const c of out) if (Math.hypot(c.x - x, c.y - y) < c.r + rad + 10) ok = false;
    if (ok) out.push({ x, y, r: rad });
  }
  return out;
}

function lerpRGB(a: RGB, b: RGB, t: number): RGB {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

export function paintGround(craters: Crater[], feet: Footprint[]): HTMLCanvasElement {
  const canvas = makeCanvas(MAP_W, MAP_H);
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(MAP_W, MAP_H);
  const data = img.data;
  const noise = makeNoise(77);
  const put = (x: number, y: number, c: RGB) => {
    const i = (y * MAP_W + x) * 4;
    data[i] = c[0];
    data[i + 1] = c[1];
    data[i + 2] = c[2];
    data[i + 3] = 255;
  };

  // 1. regolith in a few flat tones, plus the sky above the ridge
  const skyStops: [number, RGB][] = [[0, hex('#04051a')], [0.45, hex('#0a0d36')], [0.8, hex('#1d1a5c')], [1, hex('#41307f')]];
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      const ridge = ridgeY(x);
      if (y < ridge) {
        const f = y / ridge;
        let k = 0;
        while (k < skyStops.length - 2 && f > skyStops[k + 1][0]) k++;
        const [f0, c0] = skyStops[k];
        const [f1, c1] = skyStops[k + 1];
        let c = lerpRGB(c0, c1, Math.min(1, Math.max(0, (f - f0) / (f1 - f0))));
        const neb = noise(x / 110, y / 44) * 0.6 + noise(x / 34 + 9, y / 20) * 0.4;
        if (neb > 0.52) c = lerpRGB(c, [112, 70, 190], Math.min(0.5, (neb - 0.52) * 1.5));
        const neb2 = noise(x / 90 + 50, y / 38 + 20);
        if (neb2 > 0.62) c = lerpRGB(c, [40, 150, 190], Math.min(0.35, (neb2 - 0.62) * 1.4));
        put(x, y, c);
        continue;
      }
      const n = noise(x / 86, y / 86) * 0.6 + noise(x / 27 + 40, y / 27) * 0.4;
      let t = n > 0.64 ? 0 : n > 0.53 ? 1 : n > 0.4 ? 2 : n > 0.3 ? 3 : 4;
      const grain = ((Math.imul(x, 73856093) ^ Math.imul(y, 19349663)) >>> 0) % 113;
      if (grain === 0 && t > 0) t--;
      else if (grain === 1 && t < 4) t++;
      const edge = y - ridge;
      let c = TONES[t];
      if (edge < 2) c = RIM_LIGHT;
      else if (edge < 9) c = TONES[Math.min(4, t + 1)];
      put(x, y, c);
    }
  }

  // 2. craters: lit rim, dark floor, a shadow crescent on the sunward wall
  for (const c of craters) {
    const R = c.r * 1.2;
    for (let y = Math.max(0, Math.floor(c.y - R)); y < Math.min(MAP_H, c.y + R + 1); y++) {
      for (let x = Math.max(0, Math.floor(c.x - R)); x < Math.min(MAP_W, c.x + R + 1); x++) {
        if (y < ridgeY(x) + 4) continue;
        const dx = x - c.x;
        const dy = y - c.y;
        const d = Math.hypot(dx, dy) / c.r;
        if (d > 1.16) continue;
        const toLight = (-dx * 0.7 - dy * 0.7) / (Math.hypot(dx, dy) || 1);
        const rimW = Math.max(0.08, 2.2 / c.r);
        if (d > 1) {
          if (toLight < -0.25 && d < 1.14) put(x, y, TONES[4]);
          continue;
        }
        if (d > 1 - rimW) {
          put(x, y, toLight > 0.15 ? RIM_LIGHT : toLight < -0.35 ? RIM_DARK : TONES[1]);
          continue;
        }
        const s = c.r * 0.26;
        const shadow = Math.hypot(dx - s, dy - s) / c.r > 0.86 - rimW;
        const lit = Math.hypot(dx + s, dy + s) / c.r > 0.9 - rimW;
        put(x, y, shadow ? FLOOR_SHADOW : lit ? FLOOR_LIGHT : FLOOR);
      }
    }
  }

  // 3. plazas in front of each station and the landing pad
  const disc = (cx: number, cy: number, r: number, ring: RGB | null, hazard: boolean) => {
    for (let y = Math.floor(cy - r - 2); y <= cy + r + 2; y++) {
      for (let x = Math.floor(cx - r - 2); x <= cx + r + 2; x++) {
        if (x < 0 || y < 0 || x >= MAP_W || y >= MAP_H) continue;
        const d = Math.hypot(x - cx, y - cy);
        if (d > r + 1.4) continue;
        let c: RGB = PLATE;
        if (d > r) c = PLATE_BORDER;
        else if (d > r - 1.2) c = PLATE_EDGE;
        else if (hazard && d > r - 8 && d < r - 3) {
          const a = Math.atan2(y - cy, x - cx);
          c = Math.floor((a + Math.PI) / (Math.PI / 12)) % 2 ? hex('#f0c84a') : hex('#2a2d52');
        } else if (ring && d > r - 7 && d < r - 4.6) c = ring;
        else if (Math.abs(x - cx) < 0.6 || Math.abs(y - cy) < 0.6) c = PLATE_SEAM;
        else if (hazard && d < 9 && (Math.abs(x - cx) < 2 || Math.abs(y - cy) < 2)) c = hex('#f0c84a');
        put(x, y, c);
      }
    }
  };
  for (const f of feet) disc(f.x, f.y + 16, 25, hex(mix(f.accent, '#727aae', 0.25)), false);
  disc(LANDER.x, LANDER.y - 2, 40, null, true);

  // 4. paved walkways
  for (let y = 130; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      const { d, t } = nearestOnPaths(x, y);
      if (d > 8.4) continue;
      let c: RGB = PLATE;
      if (d > 7.2) c = PLATE_BORDER;
      else if (d > 6.1) c = PLATE_EDGE;
      else if (Math.floor(t) % 14 === 0) c = PLATE_SEAM;
      else if (d < 0.8 && Math.floor(t / 2) % 2 === 0) c = PLATE_SEAM;
      put(x, y, c);
    }
  }
  ctx.putImageData(img, 0, 0);

  // 5. long shadows cast by the buildings
  ctx.fillStyle = 'rgba(24,26,60,0.42)';
  for (const f of feet) {
    ctx.beginPath();
    ctx.ellipse(f.x + 12, f.y - 4, f.w / 2 + 4, 11, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.ellipse(LANDER.x + 8, LANDER.y - 1, 26, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // 6. stars and the Earth
  const r = rng(4242);
  for (let n = 0; n < 520; n++) {
    const x = Math.floor(r() * MAP_W);
    const y = Math.floor(r() * 126);
    if (y >= ridgeY(x) - 2) continue;
    ctx.fillStyle = STAR_COLORS[(r() * STAR_COLORS.length) | 0];
    ctx.globalAlpha = 0.4 + r() * 0.6;
    ctx.fillRect(x, y, 1, 1);
    if (r() < 0.07) {
      ctx.fillRect(x - 1, y, 3, 1);
      ctx.fillRect(x, y - 1, 1, 3);
    }
  }
  ctx.globalAlpha = 1;
  paintEarth(ctx, 936, 56, 31);

  // 7. pebbles: a light pixel with a dark one beneath reads as a tiny stone
  for (let n = 0; n < 1500; n++) {
    const x = Math.floor(r() * MAP_W);
    const y = Math.floor(140 + r() * (MAP_H - 150));
    if (distToPaths(x, y) < 12) continue;
    if (feet.some((f) => Math.hypot(f.x - x, f.y + 16 - y) < 28)) continue;
    ctx.fillStyle = '#8f97c9';
    ctx.fillRect(x, y, r() < 0.4 ? 2 : 1, 1);
    ctx.fillStyle = '#2c3058';
    ctx.fillRect(x, y + 1, 2, 1);
  }
  return canvas;
}

/** The Earth, hanging above the ridge. */
export function paintEarth(ctx: CanvasRenderingContext2D, cx: number, cy: number, rad: number) {
  const noise = makeNoise(5);
  for (let y = -rad - 2; y <= rad + 2; y++) {
    for (let x = -rad - 2; x <= rad + 2; x++) {
      const d = Math.hypot(x, y);
      if (d > rad + 1.6) continue;
      let c: string;
      if (d > rad) {
        c = x + y < 0 ? '#7fd4ff' : '#1f3a78';
        ctx.globalAlpha = 0.55;
      } else {
        ctx.globalAlpha = 1;
        const land = noise((x + 60) / 11, (y + 60) / 9) + noise((x + 20) / 4, (y + 90) / 4) * 0.3;
        const cloud = noise((x + 200) / 7, (y + 10) / 4);
        const lit = (-x * 0.75 - y * 0.55) / rad;
        if (lit < -0.4) c = '#0b1233';
        else if (lit < -0.12) c = land > 0.72 ? '#163a45' : '#12265e';
        else if (cloud > 0.7) c = lit > 0.35 ? '#ffffff' : '#cfe6ff';
        else if (land > 0.72) c = lit > 0.3 ? '#6fd08a' : '#3fa27a';
        else c = lit > 0.4 ? '#4aa8ff' : '#2f6fd6';
      }
      ctx.fillStyle = c;
      ctx.fillRect(cx + x, cy + y, 1, 1);
    }
  }
  ctx.globalAlpha = 1;
}
