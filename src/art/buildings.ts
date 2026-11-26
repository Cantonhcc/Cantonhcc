// The eight station buildings. Each is painted pixel by pixel from simple
// shapes, then outlined. Lights and vents are returned separately so the
// overworld can animate them.
import { clamp, mix } from '../engine/core';
import { Px } from '../engine/px';
import { ACCENT, HULL, INK, REGOLITH, StationId } from './palette';
import { drawText, textWidth } from './font';

export interface Light { x: number; y: number; color: string; phase: number; size: number }
export interface Emitter { x: number; y: number; color: string }
export interface BuildingArt {
  canvas: HTMLCanvasElement;
  w: number;
  h: number;
  doorX: number;
  lights: Light[];
  emitters: Emitter[];
}

function dome(p: Px, cx: number, baseY: number, rx: number, ry: number, ramp: string[]) {
  p.shade(cx - rx, baseY - ry, rx * 2 + 1, ry + 1, ramp,
    (x, y) => {
      const dx = (x - cx) / rx;
      const dy = (y - baseY) / ry;
      return dx * dx + dy * dy <= 1 && y <= baseY;
    },
    (x, y) => {
      const dx = (x - cx) / rx;
      const dy = (y - baseY) / ry;
      const nz = Math.sqrt(Math.max(0, 1 - dx * dx - dy * dy));
      return clamp(0.2 + (-dx * 0.5 - dy * 0.45 + nz * 0.35) * 0.8, 0, 1);
    });
}

function box(p: Px, x: number, y: number, w: number, h: number, ramp: string[]) {
  p.shade(x, y, w, h, ramp, () => true,
    (px, py) => 0.68 - ((py - y) / h) * 0.28 - (px > x + w - 6 ? 0.22 : 0) + (py < y + 2 ? 0.3 : 0) - (px < x + 2 ? -0.1 : 0));
}

function port(p: Px, x: number, y: number, w: number, h: number, glow: string) {
  p.rrect(x - 1, y - 1, w + 2, h + 2, HULL[5]);
  p.rect(x, y, w, h, mix(glow, '#10122a', 0.25));
  p.rect(x, y, w, 1, mix(glow, '#ffffff', 0.5));
  p.px(x, y, '#ffffff');
}

function door(p: Px, cx: number, baseY: number, accent: string) {
  p.rect(cx - 9, baseY - 19, 18, 19, HULL[5]);
  p.rect(cx - 7, baseY - 17, 14, 17, '#191b34');
  p.rect(cx - 6, baseY - 16, 12, 16, mix(accent, '#0d0e1f', 0.62));
  p.rect(cx - 6, baseY - 16, 12, 3, mix(accent, '#0d0e1f', 0.35));
  p.rect(cx, baseY - 16, 1, 16, '#191b34');
  p.rect(cx - 7, baseY - 21, 14, 2, accent);
  p.rect(cx - 5, baseY - 21, 3, 1, '#ffffff');
  p.rect(cx - 11, baseY, 22, 2, HULL[3]);
  p.rect(cx - 11, baseY, 22, 1, HULL[1]);
}

function sign(p: Px, cx: number, y: number, text: string, accent: string) {
  const w = textWidth(text) + 6;
  const x = Math.round(cx - w / 2);
  p.rect(x, y, w, 9, '#12142a');
  p.rect(x, y, w, 1, HULL[4]);
  p.rect(x, y + 8, w, 1, HULL[5]);
  drawText(p, x + 3, y + 2, text, accent);
}

function tint(accent: string, amount: number): string[] {
  return HULL.map((c) => mix(c, accent, amount));
}

function welcome(): BuildingArt {
  const a = ACCENT.welcome;
  const p = new Px(108, 92);
  const base = 88;
  dome(p, 54, base - 6, 46, 46, HULL);
  // equator band and base ring
  p.rect(9, base - 14, 90, 2, HULL[4]);
  box(p, 8, base - 10, 92, 10, tint(a, 0.12));
  p.rect(8, base - 10, 92, 1, HULL[0]);
  // panel seams follow the dome
  for (const k of [-0.6, -0.2, 0.2, 0.6]) {
    for (let y = base - 50; y < base - 14; y += 2) {
      const t = (y - (base - 6)) / 46;
      const half = 46 * Math.sqrt(Math.max(0, 1 - t * t));
      p.px(Math.round(54 + half * k), y, HULL[3]);
    }
  }
  port(p, 24, base - 34, 9, 7, a);
  port(p, 49, base - 44, 10, 7, a);
  port(p, 76, base - 34, 9, 7, a);
  // antenna and flag
  p.line(54, base - 52, 54, base - 64, HULL[3]);
  p.px(54, base - 65, a);
  p.line(92, base - 12, 92, base - 44, HULL[2]);
  p.rect(93, base - 44, 11, 7, a);
  p.rect(93, base - 44, 11, 1, mix(a, '#ffffff', 0.5));
  p.rect(96, base - 42, 5, 3, '#ffffff');
  door(p, 54, base, a);
  sign(p, 54, base - 33, '101', a);
  p.outline(INK);
  return {
    canvas: p.canvas, w: 108, h: 92, doorX: 54,
    lights: [{ x: 54, y: base - 65, color: a, phase: 0, size: 2 }],
    emitters: [],
  };
}

function privacy(): BuildingArt {
  const a = ACCENT.privacy;
  const p = new Px(100, 100);
  const base = 96;
  const ramp = tint(a, 0.1);
  box(p, 16, base - 34, 68, 34, ramp);
  p.rect(14, base - 36, 72, 3, HULL[4]);
  p.rect(14, base - 36, 72, 1, HULL[1]);
  dome(p, 50, base - 36, 32, 30, HULL);
  // observation slit and telescope
  p.rect(46, base - 67, 9, 26, '#12142a');
  p.rect(47, base - 66, 7, 24, mix(a, '#0d0e1f', 0.7));
  for (let i = 0; i < 16; i++) {
    p.rect(52 + i, base - 60 - i, 5, 5, i % 5 === 4 ? HULL[4] : HULL[2]);
  }
  p.rect(67, base - 77, 7, 7, HULL[5]);
  p.rect(68, base - 76, 5, 5, a);
  p.px(69, base - 75, '#ffffff');
  port(p, 24, base - 26, 8, 8, a);
  port(p, 68, base - 26, 8, 8, a);
  door(p, 50, base, a);
  sign(p, 50, base - 33, 'EYE', a);
  p.outline(INK);
  return {
    canvas: p.canvas, w: 100, h: 100, doorX: 50,
    lights: [{ x: 70, y: base - 74, color: a, phase: 1.2, size: 3 }],
    emitters: [],
  };
}

function reactor(): BuildingArt {
  const a = ACCENT.reactor;
  const p = new Px(108, 108);
  const base = 104;
  // side tanks
  for (const tx of [10, 76]) {
    p.shade(tx, base - 50, 22, 50, HULL, (x, y) => {
      const dx = (x - tx - 10.5) / 11;
      const top = y - (base - 40);
      return top >= 0 ? true : dx * dx + (top / 10) * (top / 10) <= 1;
    }, (x) => 0.9 - ((x - tx) / 22) * 0.75);
    p.rect(tx, base - 24, 22, 2, HULL[4]);
    p.rect(tx, base - 8, 22, 2, a);
    for (let s = 0; s < 22; s += 6) p.rect(tx + s, base - 8, 3, 2, '#15172b');
  }
  // pipes
  p.rect(30, base - 30, 10, 3, HULL[3]);
  p.rect(68, base - 30, 10, 3, HULL[3]);
  p.rect(30, base - 30, 10, 1, HULL[1]);
  p.rect(68, base - 30, 10, 1, HULL[1]);
  // tower
  box(p, 36, base - 78, 36, 78, tint(a, 0.08));
  p.rect(34, base - 80, 40, 3, HULL[4]);
  p.rect(34, base - 80, 40, 1, HULL[1]);
  // glowing core window
  p.rrect(44, base - 70, 20, 40, '#12142a');
  p.shade(46, base - 68, 16, 36, ['#fff3c4', '#ffd27a', a, '#d9622b', '#8f3a1f'], () => true,
    (x, y) => 1 - Math.abs(x - 53.5) / 9 - Math.abs(y - (base - 50)) / 34);
  for (let y = base - 66; y < base - 34; y += 6) p.rect(46, y, 16, 1, '#12142a');
  // vents
  p.rect(40, base - 90, 8, 10, HULL[3]);
  p.rect(60, base - 90, 8, 10, HULL[3]);
  p.rect(39, base - 92, 10, 3, HULL[5]);
  p.rect(59, base - 92, 10, 3, HULL[5]);
  door(p, 54, base, a);
  sign(p, 54, base - 31, 'MINT', a);
  p.outline(INK);
  return {
    canvas: p.canvas, w: 108, h: 108, doorX: 54,
    lights: [{ x: 54, y: base - 50, color: '#ffd27a', phase: 0, size: 4 }],
    emitters: [{ x: 44, y: base - 93, color: a }, { x: 64, y: base - 93, color: '#ffd27a' }],
  };
}

function ring(): BuildingArt {
  const a = ACCENT.ring;
  const p = new Px(150, 92);
  const base = 88;
  const cx = 75;
  const top = base - 40;
  const ramp = tint(a, 0.06);
  // cylinder side
  p.shade(5, top, 141, 42, ramp, (x, y) => {
    const dx = (x - cx) / 70;
    if (Math.abs(dx) > 1) return false;
    const edge = 22 * Math.sqrt(1 - dx * dx);
    return y >= top && y <= top + 16 + edge;
  }, (x, y) => 0.62 - ((x - 5) / 141) * 0.4 - ((y - top) / 60) * 0.2);
  // top face
  p.shade(5, top - 24, 141, 49, HULL, (x, y) => {
    const dx = (x - cx) / 70;
    const dy = (y - top) / 24;
    return dx * dx + dy * dy <= 1;
  }, (x, y) => 0.95 - ((x - 5) / 141) * 0.35 - ((y - top + 24) / 49) * 0.2);
  // courtyard
  p.shade(27, top - 15, 97, 31, ['#3f436b', '#33375a', '#292c4b', '#1f2140'], (x, y) => {
    const dx = (x - cx) / 48;
    const dy = (y - top) / 15;
    return dx * dx + dy * dy <= 1;
  }, (x, y) => 0.3 + ((y - top + 15) / 31) * 0.6);
  // central pylon
  p.rect(cx - 2, top - 22, 5, 22, HULL[2]);
  p.rect(cx - 2, top - 22, 2, 22, HULL[0]);
  p.rect(cx - 4, top - 26, 9, 5, HULL[4]);
  p.rect(cx - 3, top - 25, 7, 3, a);
  // thirteen node lights around the ring: one per Super Validator node identity
  const lights: Light[] = [];
  for (let i = 0; i < 13; i++) {
    const ang = (i / 13) * Math.PI * 2 + 0.24;
    const lx = Math.round(cx + Math.cos(ang) * 59);
    const ly = Math.round(top + Math.sin(ang) * 19.5);
    p.rect(lx - 1, ly - 1, 3, 3, HULL[5]);
    p.px(lx, ly, a);
    lights.push({ x: lx, y: ly, color: a, phase: i * 0.48, size: 1 });
  }
  door(p, cx, base, a);
  sign(p, cx, base - 33, 'VOTE', a);
  p.outline(INK);
  lights.push({ x: cx, y: top - 24, color: a, phase: 0.5, size: 3 });
  return { canvas: p.canvas, w: 150, h: 92, doorX: cx, lights, emitters: [] };
}

function harbor(): BuildingArt {
  const a = ACCENT.harbor;
  const p = new Px(132, 96);
  const base = 92;
  const ramp = tint(a, 0.12);
  // hangar with a barrel roof
  p.shade(8, base - 62, 84, 22, HULL, (x, y) => {
    const dx = (x - 50) / 42;
    const dy = (y - (base - 42)) / 20;
    return dx * dx + dy * dy <= 1 && y <= base - 42;
  }, (x, y) => 0.95 - ((x - 8) / 84) * 0.4 - ((y - (base - 62)) / 22) * 0.25);
  box(p, 8, base - 42, 84, 42, ramp);
  for (let x = 14; x < 90; x += 8) p.rect(x, base - 60, 1, 18, HULL[3]);
  p.rect(8, base - 42, 84, 2, HULL[4]);
  port(p, 16, base - 30, 12, 7, a);
  port(p, 72, base - 30, 12, 7, a);
  // crane
  p.rect(110, base - 82, 3, 82, HULL[3]);
  p.rect(110, base - 82, 1, 82, HULL[1]);
  p.rect(86, base - 82, 40, 3, HULL[2]);
  p.rect(86, base - 82, 40, 1, HULL[0]);
  p.line(113, base - 72, 124, base - 80, HULL[4]);
  p.rect(92, base - 79, 1, 14, HULL[4]);
  p.rect(90, base - 65, 5, 3, a);
  p.rect(107, base - 2, 9, 2, HULL[4]);
  // containers
  const cols = [a, '#fb923c', '#4fd1c5'];
  const spots: [number, number, number][] = [[96, base - 12, 0], [114, base - 12, 1], [105, base - 24, 2]];
  for (const [x, y, c] of spots) {
    p.rect(x, y, 17, 12, cols[c]);
    p.rect(x, y, 17, 2, mix(cols[c], '#ffffff', 0.45));
    for (let i = 3; i < 17; i += 4) p.rect(x + i, y + 2, 1, 10, mix(cols[c], '#15172b', 0.35));
  }
  door(p, 50, base, a);
  sign(p, 50, base - 33, 'PORT', a);
  p.outline(INK);
  return {
    canvas: p.canvas, w: 132, h: 96, doorX: 50,
    lights: [{ x: 125, y: base - 82, color: '#ff6b6b', phase: 0, size: 2 }, { x: 92, y: base - 63, color: a, phase: 2, size: 2 }],
    emitters: [],
  };
}

function arcade(): BuildingArt {
  const a = ACCENT.arcade;
  const p = new Px(104, 92);
  const base = 88;
  const ramp = tint('#7c5cc4', 0.5);
  box(p, 10, base - 50, 84, 50, ramp);
  p.rect(8, base - 52, 88, 3, '#2b1f52');
  p.rect(8, base - 52, 88, 1, mix(a, '#ffffff', 0.3));
  // neon marquee
  p.rect(16, base - 78, 72, 24, '#12142a');
  p.rect(16, base - 78, 72, 1, a);
  p.rect(16, base - 55, 72, 1, a);
  p.rect(16, base - 78, 1, 24, a);
  p.rect(87, base - 78, 1, 24, a);
  drawText(p, 24, base - 73, 'MYTH OR', '#9be7ff');
  drawText(p, 34, base - 65, 'FACT?', a);
  p.rect(22, base - 54, 2, 4, '#2b1f52');
  p.rect(80, base - 54, 2, 4, '#2b1f52');
  // windows with cabinet glow
  port(p, 18, base - 38, 14, 12, '#9be7ff');
  port(p, 72, base - 38, 14, 12, a);
  p.rect(21, base - 34, 3, 5, '#12142a');
  p.rect(27, base - 34, 3, 5, '#12142a');
  p.rect(75, base - 34, 3, 5, '#12142a');
  p.rect(81, base - 34, 3, 5, '#12142a');
  // marquee bulbs
  const lights: Light[] = [];
  for (let i = 0; i < 9; i++) {
    const lx = 20 + i * 8;
    p.px(lx, base - 80, '#fff7c2');
    lights.push({ x: lx, y: base - 80, color: i % 2 ? a : '#9be7ff', phase: i * 0.7, size: 1 });
  }
  door(p, 52, base, a);
  p.outline(INK);
  return { canvas: p.canvas, w: 104, h: 92, doorX: 52, lights, emitters: [] };
}

function archive(): BuildingArt {
  const a = ACCENT.archive;
  const p = new Px(124, 84);
  const base = 80;
  const rock = ['#8f96bd', '#787fa9', '#646b93', '#565c85', '#494f77', '#33375a'];
  p.shade(4, base - 62, 116, 62, rock, (x, y) => {
    const dx = (x - 62) / 58;
    const bump = Math.sin(x * 0.31) * 3 + Math.sin(x * 0.11 + 1) * 5;
    const topY = base - (56 + bump) * Math.sqrt(Math.max(0, 1 - dx * dx));
    return y >= topY && y <= base;
  }, (x, y) => 0.9 - ((x - 4) / 116) * 0.5 - ((y - (base - 62)) / 62) * 0.3 + (((x * 5 + y * 3) % 11) === 0 ? 0.25 : 0), 1.4);
  // strata lines: the "layers of time"
  for (const [y, x0, x1] of [[base - 40, 22, 46], [base - 28, 12, 40], [base - 34, 82, 108], [base - 18, 86, 112]]) {
    p.rect(x0, y, x1 - x0, 1, rock[5]);
  }
  // tunnel mouth
  p.shade(40, base - 40, 45, 40, HULL, (x, y) => {
    const dx = (x - 62) / 22;
    const dy = (y - base) / 40;
    return dx * dx + dy * dy <= 1;
  }, (x) => 0.9 - Math.abs(x - 62) / 40);
  p.shade(45, base - 34, 35, 34, ['#1f2140', '#15172b', '#0d0e1f'], (x, y) => {
    const dx = (x - 62) / 17;
    const dy = (y - base) / 34;
    return dx * dx + dy * dy <= 1;
  }, (x, y) => 0.2 + (base - y) / 60);
  const lights: Light[] = [];
  for (let i = 0; i < 5; i++) {
    const ang = Math.PI + (i + 0.5) * (Math.PI / 5);
    const lx = Math.round(62 + Math.cos(ang) * 19.5);
    const ly = Math.round(base + Math.sin(ang) * 37);
    p.px(lx, ly, a);
    lights.push({ x: lx, y: ly, color: a, phase: i * 0.9, size: 1 });
  }
  p.rect(51, base, 22, 2, HULL[3]);
  sign(p, 62, base - 52, 'TIME', a);
  p.outline(INK);
  return { canvas: p.canvas, w: 124, h: 84, doorX: 62, lights, emitters: [] };
}

function library(): BuildingArt {
  const a = ACCENT.library;
  const p = new Px(108, 104);
  const base = 100;
  const ramp = tint(a, 0.1);
  box(p, 8, base - 40, 92, 40, ramp);
  p.rect(6, base - 42, 96, 3, HULL[4]);
  p.rect(6, base - 42, 96, 1, HULL[1]);
  box(p, 22, base - 74, 64, 32, HULL);
  p.rect(20, base - 76, 68, 3, HULL[4]);
  p.rect(20, base - 76, 68, 1, HULL[1]);
  dome(p, 54, base - 76, 16, 12, tint(a, 0.3));
  // tall windows with bookshelf silhouettes
  const win = (x: number, y: number, w: number, h: number) => {
    port(p, x, y, w, h, a);
    for (let sy = y + 4; sy < y + h; sy += 5) p.rect(x, sy, w, 1, mix(a, '#15172b', 0.6));
    for (let sx = x + 1; sx < x + w; sx += 2) {
      if ((sx * 7 + y) % 3 !== 0) p.rect(sx, y + 1 + (((sx + y) % 3) | 0), 1, 2, mix(a, '#b5552f', 0.5));
    }
  };
  win(28, base - 68, 10, 20);
  win(49, base - 68, 10, 20);
  win(70, base - 68, 10, 20);
  win(14, base - 32, 10, 20);
  win(84, base - 32, 10, 20);
  door(p, 54, base, a);
  sign(p, 54, base - 33, 'BOOKS', a);
  p.outline(INK);
  return {
    canvas: p.canvas, w: 108, h: 104, doorX: 54,
    lights: [{ x: 54, y: base - 86, color: a, phase: 0.3, size: 2 }],
    emitters: [],
  };
}

export function makeBuildings(): Record<StationId, BuildingArt> {
  return {
    welcome: welcome(), privacy: privacy(), reactor: reactor(), ring: ring(),
    harbor: harbor(), arcade: arcade(), archive: archive(), library: library(),
  };
}

export { REGOLITH };
