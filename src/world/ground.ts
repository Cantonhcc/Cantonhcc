// Paints the whole lunar surface once, pixel by pixel, into a single bitmap:
// regolith, craters, footpaths, the ridge, the starry sky and the Earth.
import { dither, hex, makeNoise, rng } from '../engine/core';
import { makeCanvas } from '../engine/px';
import { STAR_COLORS } from '../art/palette';
import { DOORS, LANDER, MAP_H, MAP_W, SHARD_SPOTS, distToPaths, ridgeY } from './layout';

const RAMP = ['#99a0c6', '#8088b2', '#6c739f', '#5c628e', '#4e547e', '#42476e', '#363a5f', '#2b2e50', '#212341'];

export interface Crater { x: number; y: number; r: number }

export function makeCraters(): Crater[] {
  const r = rng(20261126);
  const out: Crater[] = [];
  let guard = 0;
  while (out.length < 46 && guard++ < 4000) {
    const rad = 7 + Math.floor(Math.pow(r(), 2.2) * 44);
    const x = 30 + r() * (MAP_W - 60);
    const y = 170 + r() * (MAP_H - 200);
    if (distToPaths(x, y) < rad + 18) continue;
    let ok = true;
    for (const d of Object.values(DOORS)) if (Math.hypot(d.x - x, d.y - 40 - y) < rad + 70) ok = false;
    if (Math.hypot(LANDER.x - x, LANDER.y - y) < rad + 50) ok = false;
    for (const c of out) if (Math.hypot(c.x - x, c.y - y) < c.r + rad + 6) ok = false;
    if (ok) out.push({ x, y, r: rad });
  }
  return out;
}

export function paintGround(craters: Crater[]): HTMLCanvasElement {
  const canvas = makeCanvas(MAP_W, MAP_H);
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(MAP_W, MAP_H);
  const data = img.data;
  const noise = makeNoise(77);
  const bright = new Float32Array(MAP_W * MAP_H);

  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      const n = noise(x / 70, y / 70) * 0.55 + noise(x / 19 + 40, y / 19) * 0.3 + noise(x / 5, y / 5 + 9) * 0.15;
      bright[y * MAP_W + x] = 0.34 + n * 0.3;
    }
  }
  // craters: dark bowl, shadowed wall towards the light, bright rim
  for (const c of craters) {
    const R = c.r * 1.25;
    for (let y = Math.max(0, Math.floor(c.y - R)); y < Math.min(MAP_H, c.y + R); y++) {
      for (let x = Math.max(0, Math.floor(c.x - R)); x < Math.min(MAP_W, c.x + R); x++) {
        const dx = x - c.x;
        const dy = y - c.y;
        const d = Math.hypot(dx, dy) / c.r;
        if (d > 1.22) continue;
        const toLight = (-dx * 0.7 - dy * 0.7) / c.r;
        let delta = 0;
        if (d < 1) {
          delta = -0.1 - 0.06 * (1 - d) - toLight * 0.24 * Math.min(1, d * 1.6);
        } else {
          delta = 0.07 + Math.max(0, toLight) * 0.2 - Math.max(0, -toLight) * 0.12;
          delta *= 1 - (d - 1) / 0.22;
        }
        bright[y * MAP_W + x] += delta;
      }
    }
  }
  // footpaths and soft shadows under the buildings
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      const i = y * MAP_W + x;
      const d = distToPaths(x, y);
      if (d < 11) {
        const k = d < 7 ? 1 : 1 - (d - 7) / 4;
        bright[i] = bright[i] * (1 - k * 0.8) + 0.66 * k * 0.8 + (d > 6 && d < 8 ? -0.07 : 0);
      }
    }
  }
  for (const d of Object.values(DOORS)) {
    for (let y = d.y - 26; y < d.y + 10; y++) {
      for (let x = d.x - 80; x < d.x + 80; x++) {
        const e = ((x - d.x) / 74) ** 2 + ((y - d.y + 8) / 16) ** 2;
        if (e < 1 && x >= 0 && x < MAP_W) bright[y * MAP_W + x] -= 0.16 * (1 - e);
      }
    }
  }

  const ramp = RAMP.map(hex);
  const r = rng(4242);
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      const i = y * MAP_W + x;
      const ridge = ridgeY(x);
      let col: [number, number, number];
      if (y < ridge) {
        // sky: deep space with a faint glow above the horizon
        const glow = Math.max(0, 1 - (ridge - y) / 60);
        const t = glow * 0.9 + dither(x, y) * 0.25;
        col = t > 0.75 ? [26, 30, 74] : t > 0.45 ? [17, 20, 54] : t > 0.2 ? [11, 13, 38] : [7, 8, 22];
      } else {
        let b = bright[i];
        const edge = y - ridge;
        if (edge < 3) b += 0.28;
        else if (edge < 12) b -= 0.1 * (1 - edge / 12);
        let idx = Math.floor((1 - b) * ramp.length + dither(x, y) * 1.1);
        idx = idx < 0 ? 0 : idx >= ramp.length ? ramp.length - 1 : idx;
        col = ramp[idx];
      }
      data[i * 4] = col[0];
      data[i * 4 + 1] = col[1];
      data[i * 4 + 2] = col[2];
      data[i * 4 + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);

  // stars
  for (let n = 0; n < 420; n++) {
    const x = Math.floor(r() * MAP_W);
    const y = Math.floor(r() * 126);
    if (y >= ridgeY(x) - 2) continue;
    ctx.fillStyle = STAR_COLORS[(r() * STAR_COLORS.length) | 0];
    ctx.globalAlpha = 0.35 + r() * 0.65;
    ctx.fillRect(x, y, 1, 1);
    if (r() < 0.06) {
      ctx.fillRect(x - 1, y, 3, 1);
      ctx.fillRect(x, y - 1, 1, 3);
    }
  }
  ctx.globalAlpha = 1;
  paintEarth(ctx, 936, 56, 31);

  // pebbles
  for (let n = 0; n < 2600; n++) {
    const x = Math.floor(r() * MAP_W);
    const y = Math.floor(140 + r() * (MAP_H - 150));
    if (distToPaths(x, y) < 9) continue;
    ctx.fillStyle = r() < 0.5 ? '#a9b0d4' : '#2b2e50';
    ctx.fillRect(x, y, 1, 1);
    if (r() < 0.3) {
      ctx.fillStyle = '#2b2e50';
      ctx.fillRect(x + 1, y + 1, 1, 1);
    }
  }
  // faint sparkle marks where shards rest
  for (const [sx, sy] of SHARD_SPOTS) {
    ctx.fillStyle = '#7d84ad';
    ctx.fillRect(sx - 3, sy + 3, 7, 1);
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
        c = (x + y) < 0 ? '#7fd4ff' : '#1f3a78';
        ctx.globalAlpha = 0.55;
      } else {
        ctx.globalAlpha = 1;
        const land = noise((x + 60) / 11, (y + 60) / 9) + noise((x + 20) / 4, (y + 90) / 4) * 0.3;
        const cloud = noise((x + 200) / 7, (y + 10) / 4);
        const lit = (-x * 0.75 - y * 0.55) / rad + dither(x + 64, y + 64) * 0.35;
        if (lit < -0.45) c = '#0b1233';
        else if (lit < -0.15) c = land > 0.72 ? '#163a45' : '#12265e';
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
