// Tiny pixel-drawing toolkit. Every sprite in the game is drawn with code:
// no image files, so all art is original.
import { dither } from './core';

export function makeCanvas(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

export class Px {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  constructor(w: number, h: number) {
    this.canvas = makeCanvas(w, h);
    this.ctx = this.canvas.getContext('2d')!;
    this.ctx.imageSmoothingEnabled = false;
    this.w = w;
    this.h = h;
  }
  px(x: number, y: number, c: string) {
    this.ctx.fillStyle = c;
    this.ctx.fillRect(x | 0, y | 0, 1, 1);
  }
  rect(x: number, y: number, w: number, h: number, c: string) {
    this.ctx.fillStyle = c;
    this.ctx.fillRect(x | 0, y | 0, w | 0, h | 0);
  }
  clear(x: number, y: number, w: number, h: number) {
    this.ctx.clearRect(x | 0, y | 0, w | 0, h | 0);
  }
  /** Rectangle with a 1px cut on each corner: the classic pixel "rounded" box. */
  rrect(x: number, y: number, w: number, h: number, c: string) {
    this.rect(x + 1, y, w - 2, h, c);
    this.rect(x, y + 1, w, h - 2, c);
  }
  line(x0: number, y0: number, x1: number, y1: number, c: string) {
    x0 |= 0; y0 |= 0; x1 |= 0; y1 |= 0;
    const dx = Math.abs(x1 - x0);
    const dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      this.px(x0, y0, c);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
  }
  /** Filled ellipse drawn scanline by scanline (no anti-aliasing). */
  ellipse(cx: number, cy: number, rx: number, ry: number, c: string) {
    this.ctx.fillStyle = c;
    for (let y = -ry; y <= ry; y++) {
      const t = 1 - (y * y) / (ry * ry || 1);
      if (t < 0) continue;
      const half = Math.round(rx * Math.sqrt(t));
      this.ctx.fillRect((cx - half) | 0, (cy + y) | 0, half * 2 + 1, 1);
    }
  }
  /**
   * Shaded shape: `inside` decides coverage, `light` returns 0 (dark) .. 1 (bright).
   * The result is quantised to `ramp` (bright -> dark) with ordered dithering.
   */
  shade(
    x0: number, y0: number, w: number, h: number, ramp: string[],
    inside: (x: number, y: number) => boolean,
    light: (x: number, y: number) => number,
    ditherAmount = 0.9,
  ) {
    for (let y = y0; y < y0 + h; y++) {
      for (let x = x0; x < x0 + w; x++) {
        if (!inside(x, y)) continue;
        const l = light(x, y);
        let i = Math.floor((1 - l) * ramp.length + dither(x, y) * ditherAmount);
        if (i < 0) i = 0;
        if (i >= ramp.length) i = ramp.length - 1;
        this.px(x, y, ramp[i]);
      }
    }
  }
  /** Adds a 1px outline around every opaque region. */
  outline(c: string) {
    const img = this.ctx.getImageData(0, 0, this.w, this.h);
    const d = img.data;
    const solid = (x: number, y: number) => x >= 0 && y >= 0 && x < this.w && y < this.h && d[(y * this.w + x) * 4 + 3] > 0;
    const todo: number[] = [];
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        if (solid(x, y)) continue;
        if (solid(x - 1, y) || solid(x + 1, y) || solid(x, y - 1) || solid(x, y + 1)) todo.push(x, y);
      }
    }
    for (let i = 0; i < todo.length; i += 2) this.px(todo[i], todo[i + 1], c);
  }
  /** Draws a pictogram from rows of characters; `map` gives each character a colour. */
  glyph(x: number, y: number, rows: string[], map: Record<string, string>) {
    for (let j = 0; j < rows.length; j++) {
      for (let i = 0; i < rows[j].length; i++) {
        const c = map[rows[j][i]];
        if (c) this.px(x + i, y + j, c);
      }
    }
  }
  flipped(): HTMLCanvasElement {
    const out = makeCanvas(this.w, this.h);
    const g = out.getContext('2d')!;
    g.translate(this.w, 0);
    g.scale(-1, 1);
    g.drawImage(this.canvas, 0, 0);
    return out;
  }
}
