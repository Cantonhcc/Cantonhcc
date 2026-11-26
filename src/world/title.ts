// Title screen: drifting stars, shooting stars, the Earth and the lunar horizon.
import { G, Scene } from '../game';
import { dither, makeNoise, rng } from '../engine/core';
import { audio } from '../engine/audio';
import { makeCanvas } from '../engine/px';
import { Particles, drawSparkle } from '../engine/particles';
import { SHARD_COLORS, STAR_COLORS } from '../art/palette';
import { ui } from '../ui/hud';
import { paintEarth } from './ground';
import { Overworld } from './overworld';

interface Star { x: number; y: number; z: number; c: string; ph: number }

export class Title implements Scene {
  private stars: Star[] = [];
  private horizon: HTMLCanvasElement | null = null;
  private earth: HTMLCanvasElement;
  private fxp = new Particles();
  private shoot = 1.5;
  private warp = 0;
  private starting = false;
  private size = '';

  constructor() {
    const r = rng(1234);
    for (let i = 0; i < 260; i++) {
      this.stars.push({ x: r(), y: r(), z: 0.2 + r() * 0.8, c: STAR_COLORS[(r() * STAR_COLORS.length) | 0], ph: r() * 6.28 });
    }
    this.earth = makeCanvas(60, 60);
    paintEarth(this.earth.getContext('2d')!, 30, 30, 24);
  }

  enter() {
    ui.showHud(false);
    ui.showTitle(true);
  }
  leave() {
    ui.showTitle(false);
  }

  /** Called by the Start button. */
  start() {
    if (this.starting) return;
    this.starting = true;
    audio.start();
    audio.sfx('enter');
    ui.showTitle(false);
  }

  private buildHorizon() {
    const w = G.vw;
    const hgt = 70;
    const c = makeCanvas(w, hgt);
    const g = c.getContext('2d')!;
    const noise = makeNoise(31);
    const ramp = ['#99a0c6', '#8088b2', '#6c739f', '#5c628e', '#4e547e', '#42476e', '#363a5f', '#2b2e50'];
    const R = w * 1.6;
    for (let x = 0; x < w; x++) {
      const dx = x - w / 2;
      const top = Math.round(R - Math.sqrt(Math.max(0, R * R - dx * dx)) + 16 + noise(x / 30, 2) * 5);
      for (let y = top; y < hgt; y++) {
        const depth = (y - top) / (hgt - top + 1);
        const n = noise(x / 22, y / 9) * 0.5 + noise(x / 6, y / 4) * 0.2;
        let b = 0.78 - depth * 0.5 + n * 0.25 - Math.abs(dx / w) * 0.25;
        if (y === top) b = 1;
        let idx = Math.floor((1 - b) * ramp.length + dither(x, y));
        idx = idx < 0 ? 0 : idx >= ramp.length ? ramp.length - 1 : idx;
        g.fillStyle = ramp[idx];
        g.fillRect(x, y, 1, 1);
      }
    }
    // tiny base silhouettes on the horizon
    const cx = Math.round(w / 2);
    const baseY = Math.round(16 + noise(cx / 30, 2) * 5) + 1;
    g.fillStyle = '#15172b';
    for (const [ox, rw, rh] of [[-34, 9, 7], [-12, 13, 10], [14, 8, 6], [34, 11, 8]] as number[][]) {
      for (let y = 0; y <= rh; y++) {
        const half = Math.round(rw * Math.sqrt(1 - (y * y) / (rh * rh)));
        g.fillRect(cx + ox - half, baseY - y, half * 2 + 1, 1);
      }
    }
    g.fillRect(cx - 12, baseY - 18, 1, 9);
    this.horizon = c;
  }

  update(dt: number) {
    const key = G.vw + 'x' + G.vh;
    if (key !== this.size) {
      this.size = key;
      this.buildHorizon();
    }
    this.shoot -= dt;
    if (this.shoot <= 0) {
      this.shoot = 1.2 + Math.random() * 2.6;
      const x = Math.random() * G.vw * 0.9;
      const y = Math.random() * G.vh * 0.35;
      for (let i = 0; i < 26; i++) {
        this.fxp.add({
          x: x - i * 2.2, y: y - i * 1.1, vx: 120, vy: 60,
          life: 0.5 + i * 0.012, color: i < 6 ? '#ffffff' : i < 14 ? '#9be7ff' : '#5b6192', drag: 0.4,
        });
      }
    }
    if (Math.random() < dt * 5) {
      this.fxp.add({
        x: Math.random() * G.vw, y: G.vh - 30 - Math.random() * 20, vx: (Math.random() - 0.5) * 6, vy: -8 - Math.random() * 14,
        life: 2.5 + Math.random() * 2.5, color: SHARD_COLORS[(Math.random() * 4) | 0], twinkle: true,
      });
    }
    this.fxp.update(dt);
    if (this.starting) {
      this.warp += dt;
      if (this.warp > 1.1 && !G.busy) {
        this.starting = false;
        G.go(() => new Overworld(), 0.6);
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const w = G.vw;
    const hgt = G.vh;
    const t = G.time;
    ctx.fillStyle = '#070816';
    ctx.fillRect(0, 0, w, hgt);
    // soft glow above the horizon
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = ['#0b0d26', '#0f1232', '#14183f', '#191e4c', '#1e2459'][i];
      ctx.fillRect(0, hgt - 110 + i * 14, w, 14);
    }
    const speed = this.starting ? 20 + this.warp * 260 : 2;
    for (const s of this.stars) {
      const y = ((s.y * hgt + t * speed * s.z) % hgt + hgt) % hgt;
      const x = Math.floor(s.x * w);
      const tw = 0.5 + 0.5 * Math.sin(t * 2 + s.ph);
      ctx.globalAlpha = 0.25 + s.z * 0.5 + tw * 0.25;
      ctx.fillStyle = s.c;
      if (this.starting) ctx.fillRect(x, Math.floor(y), 1, Math.max(1, Math.round(this.warp * 14 * s.z)));
      else {
        ctx.fillRect(x, Math.floor(y), 1, 1);
        if (s.z > 0.92 && tw > 0.8) {
          ctx.globalAlpha = 1;
          drawSparkle(ctx, x, Math.floor(y), 2, s.c);
        }
      }
    }
    ctx.globalAlpha = 1;
    ctx.drawImage(this.earth, Math.round(w * 0.8) - 30, Math.round(hgt * (hgt > w ? 0.08 : 0.2)) - 30);
    if (this.horizon) {
      const lift = this.starting ? Math.round(this.warp * this.warp * 60) : 0;
      ctx.drawImage(this.horizon, 0, hgt - 70 + lift);
      if (!this.starting) {
        const cx = Math.round(w / 2);
        const by = hgt - 70 + 22;
        const lights: [number, number, string][] = [[-34, -8, '#a78bfa'], [-12, -19, '#4fd1c5'], [14, -7, '#fb923c'], [34, -9, '#f472b6']];
        lights.forEach(([ox, oy, c], i) => {
          if (Math.sin(t * 2.2 + i * 1.3) > -0.2) drawSparkle(ctx, cx + ox, by + oy, 1, c);
        });
      }
    }
    this.fxp.draw(ctx);
  }
}
