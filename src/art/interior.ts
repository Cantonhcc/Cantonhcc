// Paints a station's museum room: back wall with a panoramic window, exhibit
// frames, tiled floor and a rug leading in from the door.
import { dither, mix, rng } from '../engine/core';
import { Px } from '../engine/px';
import { ACCENT, HULL, STAR_COLORS, StationId } from './palette';
import { drawText, textWidth } from './font';
import { paintEarth } from '../world/ground';

export const ROOM_W = 304;
export const ROOM_H = 184;
export const WALL_H = 72;
export const DOOR_X0 = 136;
export const DOOR_X1 = 168;

export interface Slot { x: number; y: number; kind: 'wall' | 'pedestal' }

/** Where exhibits go, depending on how many the station has. */
export function slotsFor(n: number): Slot[] {
  const wall = (x: number): Slot => ({ x, y: WALL_H + 10, kind: 'wall' });
  const ped = (x: number, y: number): Slot => ({ x, y, kind: 'pedestal' });
  switch (n) {
    case 2: return [wall(92), wall(212)];
    case 3: return [wall(60), wall(152), wall(244)];
    case 4: return [wall(44), wall(116), wall(188), wall(260)];
    default: return [wall(60), wall(152), wall(244), ped(84, 132), ped(220, 132)];
  }
}

export function paintRoom(id: StationId, name: string, slots: Slot[]): HTMLCanvasElement {
  const a = ACCENT[id];
  const p = new Px(ROOM_W, ROOM_H);
  const r = rng(id.length * 31 + id.charCodeAt(0));
  const wall = [mix('#5b6192', a, 0.14), mix('#4a4f7d', a, 0.12), mix('#3f436b', a, 0.1), mix('#33375a', a, 0.08)];

  // back wall
  p.shade(0, 0, ROOM_W, WALL_H, wall, () => true, (x, y) => 0.7 - (y / WALL_H) * 0.45 + (x % 38 === 0 ? -0.3 : 0), 0.8);
  p.rect(0, 0, ROOM_W, 2, HULL[5]);
  p.rect(0, WALL_H - 5, ROOM_W, 5, mix('#292c4b', a, 0.1));
  p.rect(0, WALL_H - 5, ROOM_W, 1, mix('#6b7196', a, 0.2));

  // panoramic window
  p.rect(12, 9, ROOM_W - 24, 26, HULL[5]);
  p.rect(14, 11, ROOM_W - 28, 22, '#070816');
  for (let i = 0; i < 90; i++) {
    const x = 14 + Math.floor(r() * (ROOM_W - 28));
    const y = 11 + Math.floor(r() * 22);
    p.ctx.globalAlpha = 0.4 + r() * 0.6;
    p.px(x, y, STAR_COLORS[(r() * STAR_COLORS.length) | 0]);
  }
  p.ctx.globalAlpha = 1;
  const earthX = 40 + Math.floor(r() * (ROOM_W - 80));
  p.ctx.save();
  p.ctx.beginPath();
  p.ctx.rect(14, 11, ROOM_W - 28, 22);
  p.ctx.clip();
  paintEarth(p.ctx, earthX, 24, 9);
  // moon horizon seen through the glass
  for (let x = 14; x < ROOM_W - 14; x++) {
    const h = 3 + Math.round(Math.sin(x * 0.07) * 1.5 + Math.sin(x * 0.21) * 0.8);
    p.rect(x, 33 - h, 1, h, (x + h) % 3 === 0 ? '#565c85' : '#494f77');
  }
  p.ctx.restore();
  for (let x = 14; x < ROOM_W - 14; x += 46) p.rect(x, 11, 2, 22, HULL[4]);
  p.rect(12, 9, ROOM_W - 24, 1, HULL[2]);

  // name plate
  const tw = textWidth(name) + 8;
  const nx = Math.round(ROOM_W / 2 - tw / 2);
  p.rect(nx, 1, tw, 8, '#12142a');
  drawText(p, nx + 4, 2, name, a);

  // exhibit frames on the wall
  for (const s of slots) {
    if (s.kind !== 'wall') continue;
    p.rrect(s.x - 18, 38, 36, 28, HULL[5]);
    p.rect(s.x - 16, 40, 32, 24, '#0e1024');
    p.rect(s.x - 16, 40, 32, 1, mix(a, '#0e1024', 0.5));
    p.rect(s.x - 6, 66, 12, 2, HULL[3]);
    // spill of light on the wall under the screen
    for (let y = 68; y < WALL_H; y++) p.rect(s.x - 14, y, 28, 1, mix(a, wall[2], 0.75));
  }

  // floor tiles
  const f1 = mix('#2c2f52', a, 0.07);
  const f2 = mix('#34385e', a, 0.07);
  for (let y = WALL_H; y < ROOM_H; y++) {
    for (let x = 0; x < ROOM_W; x++) {
      const tx = Math.floor(x / 16);
      const ty = Math.floor((y - WALL_H) / 16);
      let c = (tx + ty) % 2 === 0 ? f1 : f2;
      if (x % 16 === 0 || (y - WALL_H) % 16 === 0) c = mix(f1, '#15172b', 0.35);
      const glow = Math.max(0, 1 - (y - WALL_H) / 26);
      if (glow > 0 && dither(x, y) + 0.5 < glow * 0.6) c = mix(c, a, 0.18);
      p.px(x, y, c);
    }
  }
  // rug from the door to the wall
  const rug = mix(a, '#1a1c38', 0.62);
  const rug2 = mix(a, '#1a1c38', 0.4);
  p.rect(DOOR_X0 + 2, WALL_H + 22, DOOR_X1 - DOOR_X0 - 4, ROOM_H - WALL_H - 30, rug);
  p.rect(DOOR_X0 + 2, WALL_H + 22, 1, ROOM_H - WALL_H - 30, rug2);
  p.rect(DOOR_X1 - 3, WALL_H + 22, 1, ROOM_H - WALL_H - 30, rug2);
  for (let y = WALL_H + 26; y < ROOM_H - 12; y += 8) {
    p.px(152, y, rug2);
    p.px(151, y + 1, rug2);
    p.px(153, y + 1, rug2);
    p.px(152, y + 2, rug2);
  }

  // side walls and the wall the door sits in
  p.rect(0, WALL_H, 6, ROOM_H - WALL_H, mix('#3f436b', a, 0.1));
  p.rect(ROOM_W - 6, WALL_H, 6, ROOM_H - WALL_H, mix('#33375a', a, 0.1));
  p.rect(5, WALL_H, 1, ROOM_H - WALL_H, HULL[4]);
  p.rect(ROOM_W - 6, WALL_H, 1, ROOM_H - WALL_H, '#1f2140');
  p.rect(0, ROOM_H - 8, ROOM_W, 8, mix('#3f436b', a, 0.1));
  p.rect(0, ROOM_H - 8, ROOM_W, 1, HULL[4]);
  // doorway
  p.rect(DOOR_X0, ROOM_H - 8, DOOR_X1 - DOOR_X0, 8, '#0e1024');
  p.rect(DOOR_X0, ROOM_H - 8, 2, 8, a);
  p.rect(DOOR_X1 - 2, ROOM_H - 8, 2, 8, a);
  drawText(p, 145, ROOM_H - 7, 'EXIT', mix(a, '#ffffff', 0.4));
  return p.canvas;
}

/** Free-standing hologram pedestal. */
export function makePedestal(accent: string): HTMLCanvasElement {
  const p = new Px(22, 16);
  p.rect(3, 6, 16, 8, HULL[3]);
  p.rect(3, 6, 16, 2, HULL[1]);
  p.rect(1, 12, 20, 3, HULL[4]);
  p.rect(1, 12, 20, 1, HULL[2]);
  p.rect(5, 3, 12, 4, HULL[5]);
  p.rect(6, 2, 10, 2, accent);
  p.rect(7, 2, 3, 1, '#ffffff');
  p.outline('#15172b');
  return p.canvas;
}
