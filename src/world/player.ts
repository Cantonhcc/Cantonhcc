// The astronaut. Movement has a little inertia so walking feels like gliding
// in low gravity; holding Shift fires the suit thruster and skates faster.
import { audio } from '../engine/audio';
import { input } from '../engine/input';
import { Particles } from '../engine/particles';
import { Dir, PlayerSprites, makePlayerSprites } from '../art/sprites';

let sprites: PlayerSprites | null = null;

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
  private wasDown = true;
  private boostSound = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    if (!sprites) sprites = makePlayerSprites();
  }

  update(dt: number, solid: (x: number, y: number) => boolean, dust: Particles) {
    const a = this.frozen ? { x: 0, y: 0 } : input.axis();
    this.boosting = !this.frozen && input.boost() && (a.x !== 0 || a.y !== 0);
    const max = this.boosting ? 118 : 66;
    const accel = this.boosting ? 520 : 460;
    this.vx += a.x * accel * dt;
    this.vy += a.y * accel * dt;
    const friction = a.x === 0 && a.y === 0 ? 3.4 : 1.2;
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

    const nx = this.x + this.vx * dt;
    if (!this.blocked(nx, this.y, solid)) this.x = nx;
    else this.vx = 0;
    const ny = this.y + this.vy * dt;
    if (!this.blocked(this.x, ny, solid)) this.y = ny;
    else this.vy = 0;

    const moving = sp > 8;
    if (this.boosting) {
      // hover and leave an exhaust trail
      this.lift += (3 - this.lift) * Math.min(1, dt * 10);
      for (let i = 0; i < 2; i++) {
        dust.add({
          x: this.x + (Math.random() - 0.5) * 4, y: this.y - 2,
          vx: -this.vx * 0.3 + (Math.random() - 0.5) * 20, vy: -this.vy * 0.3 + (Math.random() - 0.5) * 20 + 8,
          life: 0.35 + Math.random() * 0.3, color: Math.random() < 0.5 ? '#9be7ff' : '#ffffff', drag: 2,
        });
      }
      this.boostSound -= dt;
      if (this.boostSound <= 0) {
        audio.sfx('boost');
        this.boostSound = 0.14;
      }
      this.phase += dt * 6;
    } else if (moving) {
      this.phase += dt * (5 + sp * 0.05);
      const s = Math.sin(this.phase);
      this.lift = Math.abs(s) * 3.2;
      const down = Math.abs(s) < 0.25;
      if (down && !this.wasDown) {
        for (let i = 0; i < 4; i++) {
          dust.add({
            x: this.x + (Math.random() - 0.5) * 6, y: this.y,
            vx: (Math.random() - 0.5) * 22, vy: -6 - Math.random() * 10,
            life: 0.5 + Math.random() * 0.4, color: Math.random() < 0.5 ? '#a9b0d4' : '#7d84ad', gravity: 14, drag: 1.5,
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

  draw(ctx: CanvasRenderingContext2D, camX: number, camY: number) {
    const s = sprites!;
    const sp = Math.hypot(this.vx, this.vy);
    let frame = 0;
    if (sp > 8 && !this.boosting) frame = Math.floor((this.phase / Math.PI) * 2) % 4;
    const sx = Math.round(this.x - camX);
    const sy = Math.round(this.y - camY);
    // shadow shrinks as the astronaut rises
    const sw = this.lift > 2 ? 4 : 5;
    ctx.fillStyle = 'rgba(12,13,32,0.45)';
    ctx.fillRect(sx - sw, sy - 1, sw * 2, 2);
    ctx.fillRect(sx - sw + 1, sy - 2, sw * 2 - 2, 4);
    ctx.drawImage(s.frames[this.dir][frame], sx - 9, sy - 23 - Math.round(this.lift));
  }
}
