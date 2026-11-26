// Game shell: canvas sizing, the main loop, scene switching and the
// starlight iris transition used between scenes.
import { ease } from './engine/core';
import { Particles, drawSparkle } from './engine/particles';
import { input } from './engine/input';
import { SHARD_COLORS, SPACE } from './art/palette';

export interface Scene {
  update(dt: number): void;
  draw(ctx: CanvasRenderingContext2D): void;
  enter?(): void;
  leave?(): void;
  /** Screen position the iris transition closes on. */
  focus?(): { x: number; y: number };
}

interface Transition {
  t: number;
  half: number;
  mid: () => void;
  done: boolean;
  cx: number;
  cy: number;
}

class Game {
  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;
  /** Visible game area in game pixels. Changes with the window size. */
  vw = 384;
  vh = 216;
  /** CSS pixels per game pixel. */
  zoom = 3;
  time = 0;
  private dt = 1 / 60;
  scene: Scene | null = null;
  fx = new Particles();
  private tr: Transition | null = null;
  /** True while a panel or dialog is open: the world keeps animating but ignores input. */
  paused = false;
  onResize: (() => void)[] = [];

  init(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    window.addEventListener('resize', () => this.resize());
    let last = performance.now();
    const frame = (now: number) => {
      const raw = Math.min(0.05, (now - last) / 1000);
      last = now;
      // smooth out uneven frame times so movement does not stutter
      this.dt = this.dt * 0.8 + raw * 0.2;
      this.tick(this.dt);
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  /** Device pixels per game pixel. Drawing at device resolution lets the camera move in sub-pixel steps without blur. */
  zp = 3;

  resize() {
    const dpr = window.devicePixelRatio || 1;
    const pw = Math.round(window.innerWidth * dpr);
    const ph = Math.round(window.innerHeight * dpr);
    this.zp = Math.max(1, Math.round(Math.min(pw / 230, ph / 215)));
    this.zoom = this.zp / dpr;
    this.vw = pw / this.zp;
    this.vh = ph / this.zp;
    this.canvas.width = pw;
    this.canvas.height = ph;
    this.canvas.style.width = window.innerWidth + 'px';
    this.canvas.style.height = window.innerHeight + 'px';
    document.documentElement.style.setProperty('--zoom', String(this.zoom));
    for (const f of this.onResize) f();
  }
  /** Rounds a camera coordinate to the nearest device pixel so pixel art stays crisp. */
  snap(v: number): number {
    return Math.round(v * this.zp) / this.zp;
  }

  get busy(): boolean {
    return this.tr !== null;
  }

  /** Switch scene behind a closing and reopening ring of starlight. */
  go(next: () => Scene, seconds = 0.5) {
    if (this.tr) return;
    const f = this.scene?.focus?.() ?? { x: this.vw / 2, y: this.vh / 2 };
    this.tr = {
      t: 0, half: seconds, done: false, cx: f.x, cy: f.y,
      mid: () => {
        this.scene?.leave?.();
        this.scene = next();
        this.scene.enter?.();
      },
    };
  }
  set(scene: Scene) {
    this.scene?.leave?.();
    this.scene = scene;
    scene.enter?.();
  }

  private tick(dt: number) {
    this.time += dt;
    const ctx = this.ctx;
    ctx.setTransform(this.zp, 0, 0, this.zp, 0, 0);
    ctx.imageSmoothingEnabled = false;
    if (this.scene) {
      this.scene.update(dt);
      this.scene.draw(ctx);
    }
    this.fx.update(dt);
    this.fx.draw(ctx);
    if (this.tr) this.drawTransition(dt);
    input.endFrame();
  }

  private drawTransition(dt: number) {
    const tr = this.tr!;
    const ctx = this.ctx;
    tr.t += dt;
    const max = Math.hypot(this.vw, this.vh);
    let radius: number;
    if (tr.t < tr.half) {
      radius = max * (1 - ease(tr.t / tr.half));
    } else {
      if (!tr.done) {
        tr.done = true;
        tr.mid();
        const f = this.scene?.focus?.() ?? { x: this.vw / 2, y: this.vh / 2 };
        tr.cx = f.x;
        tr.cy = f.y;
        this.fx.burst(tr.cx, tr.cy, 26, SHARD_COLORS, 90, 0.9);
      }
      radius = max * ease(Math.min(1, (tr.t - tr.half - 0.12) / tr.half));
      if (radius < 0) radius = 0;
    }
    ctx.fillStyle = SPACE;
    ctx.beginPath();
    ctx.rect(0, 0, this.vw, this.vh);
    ctx.arc(tr.cx, tr.cy, Math.max(0.01, radius), 0, Math.PI * 2, true);
    ctx.fill('evenodd');
    // a ring of sparkles rides the edge of the iris
    if (radius > 2 && radius < max * 0.8) {
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * Math.PI * 2 + this.time * 1.5;
        const x = tr.cx + Math.cos(a) * radius;
        const y = tr.cy + Math.sin(a) * radius;
        if (x > -4 && y > -4 && x < this.vw + 4 && y < this.vh + 4) drawSparkle(ctx, x, y, i % 3 === 0 ? 3 : 2, SHARD_COLORS[i % 4]);
      }
    }
    if (tr.t >= tr.half * 2 + 0.12) this.tr = null;
  }
}

export const G = new Game();
