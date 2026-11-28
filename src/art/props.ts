// Surface decoration: rocks, solar arrays, dishes, crystals, beacons and the
// moonboard. All drawn in code like everything else.
import { Px } from '../engine/px';
import { mix } from '../engine/core';
import { HULL, INK } from './palette';

/** A faceted boulder with a lit top face and a shaded side. */
export function makeBoulder(seed: number): HTMLCanvasElement {
  const w = 9 + (seed % 4) * 3;
  const h = 7 + (seed % 3) * 2;
  const p = new Px(w + 2, h + 3);
  const top = '#9aa2d3';
  const mid = '#727aae';
  const side = '#4b5186';
  const dark = '#343861';
  const peak = 2 + (seed % 3);
  for (let y = 0; y < h; y++) {
    const t = y / (h - 1);
    const inset = Math.round((1 - Math.sin(Math.min(1, t * 1.25) * Math.PI * 0.5)) * (w * 0.32));
    for (let x = inset; x < w - inset; x++) {
      const rel = (x - inset) / Math.max(1, w - inset * 2);
      let c = rel < 0.55 ? (t < 0.38 ? top : mid) : t < 0.3 ? mid : side;
      if (t > 0.78) c = rel < 0.55 ? side : dark;
      if (x === inset + peak && t < 0.5) c = top;
      p.px(1 + x, 1 + y, c);
    }
  }
  p.outline(INK);
  return p.canvas;
}

export function makeSolar(): HTMLCanvasElement {
  const p = new Px(30, 22);
  p.rect(14, 12, 2, 8, HULL[3]);
  p.rect(11, 19, 8, 2, HULL[4]);
  for (let i = 0; i < 2; i++) {
    const x = 1 + i * 15;
    p.rect(x, 3, 13, 9, '#1c2a66');
    for (let cx = 0; cx < 3; cx++) for (let cy = 0; cy < 2; cy++) {
      p.rect(x + 1 + cx * 4, 4 + cy * 4, 3, 3, (cx + cy) % 2 ? '#3b6fd6' : '#2f58b8');
      p.px(x + 1 + cx * 4, 4 + cy * 4, '#8fc4ff');
    }
    p.rect(x, 3, 13, 1, HULL[1]);
  }
  p.outline(INK);
  return p.canvas;
}

export function makeDish(): HTMLCanvasElement {
  const p = new Px(22, 24);
  p.rect(10, 12, 2, 9, HULL[3]);
  p.rect(6, 20, 10, 2, HULL[4]);
  p.shade(2, 3, 18, 11, HULL, (x, y) => {
    const dx = (x - 10.5) / 9;
    const dy = (y - 5) / 9;
    return dx * dx + dy * dy <= 1 && y >= 5 - 2;
  }, (x, y) => 0.9 - (x - 2) / 26 - (y - 3) / 22, 0.4);
  p.line(10, 9, 14, 2, HULL[4]);
  p.rect(13, 1, 3, 3, '#ff6b6b');
  p.outline(INK);
  return p.canvas;
}

/** A cluster of glowing crystals. */
export function makeCrystal(color: string, seed: number): HTMLCanvasElement {
  const p = new Px(18, 18);
  const light = mix(color, '#ffffff', 0.6);
  const dark = mix(color, '#15172b', 0.45);
  const shard = (x: number, h: number, w: number) => {
    for (let y = 0; y < h; y++) {
      const half = Math.min(w, Math.floor(y / 2) + 0);
      for (let dx = -half; dx <= half; dx++) p.px(x + dx, 16 - h + y, dx < 0 ? light : dx === 0 ? color : dark);
    }
    p.px(x, 16 - h, '#ffffff');
  };
  shard(5, 8 + (seed % 3), 2);
  shard(10, 12 + (seed % 2), 2);
  shard(14, 6 + (seed % 3), 1);
  p.rect(2, 15, 14, 2, '#454b7b');
  p.outline(INK);
  return p.canvas;
}

export function makeBeacon(color: string): HTMLCanvasElement {
  const p = new Px(9, 20);
  p.rect(4, 5, 1, 13, HULL[3]);
  p.rect(2, 17, 5, 2, HULL[4]);
  p.rect(1, 10, 7, 1, HULL[4]);
  p.rrect(2, 1, 5, 5, color);
  p.px(3, 2, '#ffffff');
  p.outline(INK);
  return p.canvas;
}

/** The moonboard: a hover board the astronaut can ride. Two frames, facing right; flip for left. */
export function makeBoard(): HTMLCanvasElement[] {
  return [0, 1].map((f) => {
    const p = new Px(26, 10);
    p.rrect(2, 2, 22, 4, '#e9edff');
    p.rect(3, 2, 20, 1, '#ffffff');
    p.rect(3, 5, 20, 1, '#8088b8');
    p.rect(6, 3, 14, 1, '#4fd1c5');
    p.rect(20, 3, 3, 2, '#ffd27a');
    p.rect(4, 6, 4, 1, f ? '#9be7ff' : '#4fd1c5');
    p.rect(11, 6, 4, 1, f ? '#4fd1c5' : '#9be7ff');
    p.rect(18, 6, 4, 1, f ? '#9be7ff' : '#4fd1c5');
    p.outline(INK);
    return p.canvas;
  });
}

/** The arrival ship: white hull, violet trim and a lime C badge. Faces right. */
export function makeShip(): HTMLCanvasElement {
  const p = new Px(76, 34);
  const V = '#875cff';
  const D = '#4e22c9';
  const L = '#f3ff97';
  // fins
  for (let i = 0; i < 11; i++) {
    p.rect(10 + i, 6 + i, 12 - i, 1, i < 2 ? '#b69cff' : V);
    p.rect(10 + i, 27 - i, 12 - i, 1, i > 8 ? V : D);
  }
  // hull
  p.shade(8, 7, 64, 20, ['#ffffff', '#eef1ff', '#d3d8f4', '#aab1da', '#8088b8'], (x, y) => {
    const dx = (x - 38) / 34;
    const taper = x > 38 ? 1 - Math.pow((x - 38) / 34, 2) * 0.9 : 1 - Math.pow((38 - x) / 30, 2) * 0.35;
    return Math.abs(dx) <= 1 && Math.abs(y - 16.5) <= 9.5 * Math.max(0, taper);
  }, (x, y) => 0.95 - (y - 7) / 24, 0.5);
  // violet belly stripe and nose
  for (let x = 12; x < 66; x++) p.px(x, 21 + (x > 56 ? Math.round((x - 56) * -0.3) : 0), V);
  p.rect(66, 15, 5, 3, V);
  // cockpit
  p.rrect(50, 11, 11, 6, '#1c2b52');
  p.rect(51, 12, 8, 2, '#2f5b8f');
  p.rect(51, 12, 3, 1, '#8ff0ff');
  // badge
  p.rrect(27, 10, 11, 11, D);
  p.rect(28, 11, 9, 9, V);
  p.rect(31, 12, 4, 1, L);
  p.rect(30, 13, 1, 5, L);
  p.rect(31, 18, 4, 1, L);
  p.px(35, 13, L);
  p.px(35, 17, L);
  // engine block
  p.rect(4, 11, 6, 12, '#5b6192');
  p.rect(2, 13, 3, 8, '#3f436b');
  p.rect(4, 11, 6, 1, '#aab1da');
  p.outline(INK);
  return p.canvas;
}
