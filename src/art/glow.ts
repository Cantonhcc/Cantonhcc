// Soft light. Glows are smooth radial gradients drawn additively over the
// pixel art, which gives lamps, windows and crystals real atmosphere.
import { hex } from '../engine/core';
import { makeCanvas } from '../engine/px';

const cache = new Map<string, HTMLCanvasElement>();

function sprite(color: string): HTMLCanvasElement {
  let c = cache.get(color);
  if (c) return c;
  const size = 64;
  c = makeCanvas(size, size);
  const g = c.getContext('2d')!;
  const [r, gg, b] = hex(color);
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, `rgba(${r},${gg},${b},0.9)`);
  grad.addColorStop(0.25, `rgba(${r},${gg},${b},0.42)`);
  grad.addColorStop(0.6, `rgba(${r},${gg},${b},0.12)`);
  grad.addColorStop(1, `rgba(${r},${gg},${b},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  cache.set(color, c);
  return c;
}

/** Additive glow centred on (x, y). `rx`/`ry` are radii in game pixels. */
export function glow(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, color: string, alpha = 1, ry = rx) {
  if (alpha <= 0) return;
  const prevOp = ctx.globalCompositeOperation;
  const prevSmooth = ctx.imageSmoothingEnabled;
  ctx.globalCompositeOperation = 'lighter';
  ctx.imageSmoothingEnabled = true;
  ctx.globalAlpha = alpha;
  ctx.drawImage(sprite(color), x - rx, y - ry, rx * 2, ry * 2);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = prevOp;
  ctx.imageSmoothingEnabled = prevSmooth;
}

let vignetteCanvas: HTMLCanvasElement | null = null;
/** Darkens the corners of the view to focus the eye on the centre. */
export function vignette(ctx: CanvasRenderingContext2D, w: number, h: number, strength = 0.55) {
  if (!vignetteCanvas) {
    vignetteCanvas = makeCanvas(128, 128);
    const g = vignetteCanvas.getContext('2d')!;
    const grad = g.createRadialGradient(64, 64, 30, 64, 64, 92);
    grad.addColorStop(0, 'rgba(5,6,26,0)');
    grad.addColorStop(0.7, 'rgba(5,6,26,0.35)');
    grad.addColorStop(1, 'rgba(5,6,26,1)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
  }
  const prev = ctx.imageSmoothingEnabled;
  ctx.imageSmoothingEnabled = true;
  ctx.globalAlpha = strength;
  ctx.drawImage(vignetteCanvas, 0, 0, w, h);
  ctx.globalAlpha = 1;
  ctx.imageSmoothingEnabled = prev;
}
