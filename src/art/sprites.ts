// Character and prop sprites, drawn procedurally.
import { Px } from '../engine/px';
import { INK } from './palette';

export type Dir = 'down' | 'up' | 'left' | 'right';

const SUIT = '#eef1ff';
const SUIT2 = '#cdd3f2';
const SUIT3 = '#9da5d2';
const PACK = '#8088b8';
const BOOT = '#5b6192';
const VISOR = '#1c2b52';
const VISOR2 = '#2f5b8f';
const GLARE = '#8ff0ff';
// Canton's own site colours: violet and pale lime
const CV = '#875cff';
const CD = '#4e22c9';
const CL = '#f3ff97';

function astronautFrame(dir: Dir, frame: number): HTMLCanvasElement {
  const p = new Px(18, 24);
  const step = frame === 1 ? 1 : frame === 3 ? -1 : 0;
  if (dir === 'down' || dir === 'up') {
    // legs
    const l = 4 + (step > 0 ? 1 : step < 0 ? -1 : 0);
    const r = 4 + (step < 0 ? 1 : step > 0 ? -1 : 0);
    p.rect(5, 18, 3, l, SUIT2);
    p.rect(10, 18, 3, r, SUIT2);
    p.rect(5, 18 + l - 2, 3, 2, CD);
    p.rect(10, 18 + r - 2, 3, 2, CD);
    // arms
    const la = step > 0 ? 1 : 0;
    const ra = step < 0 ? 1 : 0;
    p.rect(2, 11 + la, 2, 6, SUIT2);
    p.rect(14, 11 + ra, 2, 6, SUIT2);
    p.rect(2, 11 + la, 2, 1, CV);
    p.rect(14, 11 + ra, 2, 1, CV);
    p.rect(2, 16 + la, 2, 2, CV);
    p.rect(14, 16 + ra, 2, 2, CV);
    // torso
    p.rect(4, 11, 10, 7, SUIT);
    p.rect(4, 17, 10, 1, CD);
    // helmet with a violet crest
    p.rrect(3, 1, 12, 10, SUIT);
    p.rect(5, 1, 8, 1, CV);
    p.rect(4, 10, 10, 1, SUIT2);
    if (dir === 'down') {
      // chest badge: a lime C on violet
      p.rect(6, 11, 6, 5, CV);
      p.rect(7, 12, 3, 1, CL);
      p.px(7, 13, CL);
      p.rect(7, 14, 3, 1, CL);
      p.rrect(5, 3, 8, 6, VISOR);
      p.rect(6, 4, 6, 2, VISOR2);
      p.rect(6, 4, 2, 1, GLARE);
      p.px(6, 5, GLARE);
    } else {
      // backpack
      p.rect(5, 10, 8, 7, CV);
      p.rect(6, 11, 6, 1, CL);
      p.rect(6, 15, 6, 1, CD);
      p.px(7, 13, CL);
      p.px(10, 13, '#ffffff');
      p.rect(4, 3, 10, 1, SUIT2);
    }
  } else {
    // side view, facing right (left is mirrored)
    const s = step;
    p.rect(6 - s, 18, 3, 4, SUIT3);
    p.rect(6 - s, 20, 3, 2, CD);
    p.rect(9 + s, 18, 3, 4, SUIT2);
    p.rect(9 + s, 20, 4, 2, CD);
    // backpack then torso
    p.rect(2, 10, 4, 8, CV);
    p.rect(2, 11, 3, 1, CL);
    p.rect(5, 11, 8, 7, SUIT);
    p.rect(5, 17, 8, 1, CD);
    // arm with a violet shoulder band
    p.rect(8 + s, 12, 3, 5, SUIT2);
    p.rect(8 + s, 12, 3, 1, CV);
    p.px(9 + s, 13, CL);
    p.rect(8 + s, 16, 3, 2, CV);
    // helmet
    p.rrect(4, 1, 11, 10, SUIT);
    p.rect(6, 1, 7, 1, CV);
    p.rect(5, 10, 9, 1, SUIT2);
    p.rrect(10, 3, 5, 6, VISOR);
    p.rect(11, 4, 3, 2, VISOR2);
    p.px(11, 4, GLARE);
    p.px(12, 4, GLARE);
  }
  p.outline(INK);
  return dir === 'left' ? p.flipped() : p.canvas;
}

export interface PlayerSprites {
  frames: Record<Dir, HTMLCanvasElement[]>;
  w: number;
  h: number;
}

export function makePlayerSprites(): PlayerSprites {
  const frames = {} as Record<Dir, HTMLCanvasElement[]>;
  for (const d of ['down', 'up', 'left', 'right'] as Dir[]) {
    frames[d] = [0, 1, 2, 3].map((f) => astronautFrame(d, f));
  }
  return { frames, w: 18, h: 24 };
}

/** PIP, the guide robot. Two frames: eyes open and blinking. */
export function makeRobot(accent: string): HTMLCanvasElement[] {
  return [0, 1].map((blink) => {
    const p = new Px(16, 18);
    p.line(8, 2, 8, 5, '#8088b8');
    p.px(8, 1, accent);
    p.rrect(3, 5, 10, 9, '#eef1ff');
    p.rect(4, 13, 8, 1, '#aab1da');
    p.rect(4, 8, 8, 3, '#172244');
    if (blink) {
      p.rect(5, 9, 2, 1, accent);
      p.rect(9, 9, 2, 1, accent);
    } else {
      p.rect(5, 8, 2, 2, accent);
      p.rect(9, 8, 2, 2, accent);
    }
    p.px(2, 9, '#8088b8');
    p.px(13, 9, '#8088b8');
    p.rect(6, 14, 4, 2, '#5b6192');
    p.outline(INK);
    return p.canvas;
  });
}

/** The lander that drops the player off in the opening cutscene. */
export function makeLander(): HTMLCanvasElement {
  const p = new Px(46, 44);
  const gold = ['#ffe08a', '#e9b949', '#c08a2b', '#8f6220'];
  // legs
  p.line(10, 26, 3, 40, '#8088b8');
  p.line(35, 26, 42, 40, '#8088b8');
  p.line(16, 30, 12, 40, '#5b6192');
  p.line(29, 30, 33, 40, '#5b6192');
  p.rect(1, 40, 6, 2, '#aab1da');
  p.rect(39, 40, 6, 2, '#aab1da');
  p.rect(10, 40, 5, 2, '#8088b8');
  p.rect(31, 40, 5, 2, '#8088b8');
  // descent stage, wrapped in gold foil
  p.shade(8, 20, 30, 12, gold, () => true, (x, y) => 0.75 - (y - 20) / 22 - (x > 30 ? 0.25 : 0) + ((x + y) % 5 === 0 ? 0.2 : 0));
  p.rect(8, 20, 30, 1, '#fff2b8');
  // ascent cabin
  p.shade(13, 6, 20, 14, ['#f2f4ff', '#d3d8f4', '#aab1da', '#8088b8'], (x, y) => {
    const dx = (x - 23) / 10.5;
    const dy = (y - 14) / 9;
    return dx * dx + dy * dy <= 1;
  }, (x, y) => 0.8 - (x - 13) / 30 - (y - 6) / 28);
  p.rrect(18, 10, 7, 5, '#1c2b52');
  p.rect(19, 11, 3, 1, '#8ff0ff');
  p.px(28, 12, '#ff9d4d');
  // dish
  p.line(33, 8, 38, 3, '#8088b8');
  p.rect(36, 1, 5, 3, '#d3d8f4');
  p.px(38, 0, '#f2f4ff');
  // engine bell
  p.rect(20, 32, 6, 3, '#5b6192');
  p.rect(19, 35, 8, 2, '#3f436b');
  p.outline(INK);
  return p.canvas;
}

/** Path lamp. The glow is added at draw time so it can pulse. */
export function makeLamp(color: string): HTMLCanvasElement {
  const p = new Px(7, 16);
  p.rect(3, 4, 1, 10, '#8088b8');
  p.rect(2, 13, 3, 2, '#5b6192');
  p.rrect(1, 1, 5, 4, color);
  p.px(2, 2, '#ffffff');
  p.outline(INK);
  return p.canvas;
}

export function makeRock(seed: number): HTMLCanvasElement {
  const w = 10 + (seed % 3) * 3;
  const h = 7 + (seed % 2) * 2;
  const p = new Px(w + 2, h + 2);
  const ramp = ['#8f96bd', '#6f769f', '#565c85', '#3e4369'];
  p.shade(1, 1, w, h, ramp, (x, y) => {
    const dx = (x - 1 - w / 2 + 0.5) / (w / 2);
    const dy = (y - 1 - h + 0.5) / h;
    return dx * dx + dy * dy <= 1 + (((x * 7 + y * 13 + seed) % 5) - 2) * 0.03;
  }, (x, y) => 0.85 - (x - 1) / w * 0.5 - (y - 1) / h * 0.35, 1.2);
  p.outline(INK);
  return p.canvas;
}

/** Small space-plant in a pot: a cosy touch for the station interiors. */
export function makePlant(seed: number): HTMLCanvasElement {
  const p = new Px(14, 20);
  const leaf = ['#9ff0c0', '#5fd39a', '#2fa77a', '#1c7a63'];
  p.rect(4, 14, 6, 5, '#b07a52');
  p.rect(3, 13, 8, 2, '#d19a6a');
  p.rect(5, 18, 4, 1, '#7d5236');
  const blades = [[7, 13, 7, 3], [7, 13, 3, 5], [7, 13, 11, 5], [7, 13, 2, 9], [7, 13, 12, 9], [7, 12, 5, 2 + (seed % 2)], [7, 12, 9, 2]];
  blades.forEach(([x0, y0, x1, y1], i) => p.line(x0, y0, x1, y1, leaf[(i + seed) % 3]));
  p.px(7, 3, leaf[0]);
  p.px(3, 5, leaf[0]);
  p.px(11, 5, leaf[0]);
  p.outline(INK);
  return p.canvas;
}

export function makeCrate(color: string): HTMLCanvasElement {
  const p = new Px(18, 16);
  p.rect(1, 3, 16, 12, color);
  p.rect(1, 1, 16, 3, '#f2f4ff');
  p.rect(1, 3, 16, 1, '#ffffff');
  p.rect(1, 8, 16, 1, '#15172b33');
  p.rect(4, 4, 1, 11, '#15172b33');
  p.rect(13, 4, 1, 11, '#15172b33');
  p.rect(7, 9, 4, 3, '#f2f4ff');
  p.outline(INK);
  return p.canvas;
}
