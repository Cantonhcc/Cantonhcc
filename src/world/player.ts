// The astronaut. Walking has a little inertia, like low gravity. Holding Shift
// fires the suit thruster. Pressing R hops onto the moonboard, a hover board
// that glides fast and smooth for anyone who would rather not walk.
import { audio } from '../engine/audio';
import { input } from '../engine/input';
import { Particles } from '../engine/particles';
import { glow } from '../art/glow';
import { makeBoard } from '../art/props';
import { Dir, PlayerSprites, makePlayerSprites } from '../art/sprites';

let sprites: PlayerSprites | null = null;
let board: HTMLCanvasElement[] | null = null;

export class Player {
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
  dir: Dir = 'down';
  phase = 0;
  lift = 0;
  boosting = false;
  frozen = false;
  /** On the moonboard. */
  riding = false;
  /** Only the surface allows the board; station floors do not. */
  canRide = false;
  private wasDown = true;
  private hum = 0;
  private boardFace = 1;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    if (!sprites) sprites = makePlayerSprites();
    if (!board) board = makeBoard();
  }

  toggleRide(dust: Particles) {
    if (!this.canRide) return;
    this.riding = !this.riding;
    audio.sfx(this.riding ? 'enter' : 'close');
    dust.burst(this.x, this.y - 2, 22, ['#9be7ff', '#ffffff', '#4fd1c5'], 60, 0.6);
  }

  update(dt: number, solid: (x: number, y: number) => boolean, dust: Particles) {
    const a = this.frozen ? { x: 0, y: 0 } : input.axis();
    const pushing = a.x !== 0 || a.y !== 0;
    this.boosting = !this.frozen && !this.riding && input.boost() && pushing;
    const max = this.riding ? 196 : this.boosting ? 118 : 68;
    const accel = this.riding ? 560 : this.boosting ? 520 : 480;
    this.vx += a.x * accel * dt;
    this.vy += a.y * accel * dt;
    const friction = pushing ? (this.riding ? 0.9 : 1.2) : this.riding ? 2.2 : 3.6;
    const k = Math.max(0, 1 - friction * dt);
    this.vx *= k;
    this.vy *= k;
    const sp = Math.hypot(this.vx, this.vy);
    if (sp > max) {
      this.vx = (this.vx / sp) * max;
      this.vy = (this.vy / sp) * max;
    }
    if (Math.abs(a.x) > Math.abs(a.y)) this.dir = a.x > 0 ? 'right' : 'left';
    else if (a.y !== 0) this.dir = a.y > 0 ? 'down' : 'up';
    if (a.x > 0.2) this.boardFace = 1;
    else if (a.x < -0.2) this.boardFace = -1;

    const nx = this.x + this.vx * dt;
    if (!this.blocked(nx, this.y, solid)) this.x = nx;
    else this.vx = 0;
    const ny = this.y + this.vy * dt;
    if (!this.blocked(this.x, ny, solid)) this.y = ny;
    else this.vy = 0;

    const moving = sp > 8;
    if (this.riding) {
      this.phase += dt * 3;
      this.lift += (5 + Math.sin(this.phase) * 1.2 - this.lift) * Math.min(1, dt * 8);
      if (moving) {
        for (let i = 0; i < 2; i++) {
          dust.add({
            x: this.x - (this.vx / (sp || 1)) * 8 + (Math.random() - 0.5) * 6, y: this.y - 2 + (Math.random() - 0.5) * 3,
            vx: -this.vx * 0.25 + (Math.random() - 0.5) * 14, vy: -this.vy * 0.25 + (Math.random() - 0.5) * 14,
            life: 0.4 + Math.random() * 0.4, color: ['#9be7ff', '#ffffff', '#4fd1c5'][(Math.random() * 3) | 0], drag: 2, twinkle: true,
          });
        }
      }
      this.hum -= dt;
      if (this.hum <= 0 && moving) {
        audio.sfx('boost');
        this.hum = 0.2;
      }
    } else if (this.boosting) {
      this.lift += (3 - this.lift) * Math.min(1, dt * 10);
      for (let i = 0; i < 2; i++) {
        dust.add({
          x: this.x + (Math.random() - 0.5) * 4, y: this.y - 2,
          vx: -this.vx * 0.3 + (Math.random() - 0.5) * 20, vy: -this.vy * 0.3 + (Math.random() - 0.5) * 20 + 8,
          life: 0.35 + Math.random() * 0.3, color: Math.random() < 0.5 ? '#9be7ff' : '#ffffff', drag: 2,
        });
      }
      this.hum -= dt;
      if (this.hum <= 0) {
        audio.sfx('boost');
        this.hum = 0.14;
      }
      this.phase += dt * 6;
    } else if (moving) {
      this.phase += dt * (5 + sp * 0.05);
      const s = Math.sin(this.phase);
      // a gentle bounce, eased so it never looks like a jolt
      this.lift += (Math.abs(s) * 1.8 - this.lift) * Math.min(1, dt * 18);
      const down = Math.abs(s) < 0.25;
      if (down && !this.wasDown) {
        for (let i = 0; i < 3; i++) {
          dust.add({
            x: this.x + (Math.random() - 0.5) * 6, y: this.y,
            vx: (Math.random() - 0.5) * 20, vy: -5 - Math.random() * 9,
            life: 0.45 + Math.random() * 0.35, color: Math.random() < 0.5 ? '#aab2de' : '#7f87b8', gravity: 14, drag: 1.5,
          });
        }
        audio.sfx('step');
      }
      this.wasDown = down;
    } else {
      this.lift += (0 - this.lift) * Math.min(1, dt * 8);
      this.wasDown = true;
    }
  }

  private blocked(x: number, y: number, solid: (x: number, y: number) => boolean): boolean {
    return solid(x - 4, y - 5) || solid(x + 4, y - 5) || solid(x - 4, y) || solid(x + 4, y);
  }

  /** Soft light under and around the astronaut. Drawn before the sprites. */
  drawLight(ctx: CanvasRenderingContext2D, camX: number, camY: number) {
    const sx = this.x - camX;
    const sy = this.y - camY;
    glow(ctx, sx, sy - 6, 46, '#8fa8ff', 0.16, 34);
    if (this.riding) glow(ctx, sx, sy, 26, '#4fd1c5', 0.55, 12);
  }

  draw(ctx: CanvasRenderingContext2D, camX: number, camY: number) {
    const s = sprites!;
    const sp = Math.hypot(this.vx, this.vy);
    let frame = 0;
    if (sp > 8 && !this.boosting && !this.riding) frame = Math.floor((this.phase / Math.PI) * 2) % 4;
    const sx = this.x - camX;
    const sy = this.y - camY;
    const sw = this.lift > 2.5 ? 4 : 5;
    ctx.fillStyle = 'rgba(14,15,40,0.42)';
    ctx.fillRect(sx - sw, sy - 1, sw * 2, 2);
    ctx.fillRect(sx - sw + 1, sy - 2, sw * 2 - 2, 4);
    const lift = Math.round(this.lift * 2) / 2;
    if (this.riding) {
      const b = board![Math.floor(this.phase * 4) % 2];
      const bx = sx - 13;
      const by = sy - 6 - lift + 3;
      if (this.boardFace < 0) {
        ctx.save();
        ctx.translate(sx * 2, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(b, bx, by);
        ctx.restore();
      } else ctx.drawImage(b, bx, by);
      ctx.drawImage(s.frames[this.dir][0], sx - 9, sy - 26 - lift);
    } else {
      ctx.drawImage(s.frames[this.dir][frame], sx - 9, sy - 23 - lift);
    }
  }
}
