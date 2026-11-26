// Lightweight particle system used for stardust, moon dust, thruster exhaust
// and the sparkle bursts that mark transitions.
export interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; max: number; color: string; size: number;
  gravity: number; drag: number; twinkle: boolean;
}

export class Particles {
  list: Particle[] = [];

  add(p: Partial<Particle> & { x: number; y: number }) {
    if (this.list.length > 900) return;
    const life = p.life ?? 1;
    this.list.push({
      vx: 0, vy: 0, color: '#ffffff', size: 1, gravity: 0, drag: 0, twinkle: false,
      ...p, life, max: life,
    });
  }
  burst(x: number, y: number, n: number, colors: string[], speed = 40, life = 0.8, opts: Partial<Particle> = {}) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = speed * (0.3 + Math.random() * 0.7);
      this.add({
        x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s,
        life: life * (0.5 + Math.random() * 0.5),
        color: colors[(Math.random() * colors.length) | 0],
        size: Math.random() < 0.25 ? 2 : 1, drag: 1.5, twinkle: true, ...opts,
      });
    }
  }
  update(dt: number) {
    const l = this.list;
    for (let i = l.length - 1; i >= 0; i--) {
      const p = l[i];
      p.life -= dt;
      if (p.life <= 0) {
        l[i] = l[l.length - 1];
        l.pop();
        continue;
      }
      p.vy += p.gravity * dt;
      if (p.drag) {
        const k = Math.max(0, 1 - p.drag * dt);
        p.vx *= k;
        p.vy *= k;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
  }
  draw(ctx: CanvasRenderingContext2D, ox = 0, oy = 0) {
    for (const p of this.list) {
      const t = p.life / p.max;
      if (p.twinkle && ((p.life * 12) | 0) % 2 === 0 && t < 0.6) continue;
      ctx.globalAlpha = t < 0.3 ? t / 0.3 : 1;
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x - ox), Math.round(p.y - oy), p.size, p.size);
    }
    ctx.globalAlpha = 1;
  }
}

/** A four-point pixel sparkle, the game's signature "starlight shard" shape. */
export function drawSparkle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, core = '#ffffff') {
  x = Math.round(x);
  y = Math.round(y);
  ctx.fillStyle = color;
  for (let i = 1; i <= r; i++) {
    ctx.fillRect(x - i, y, 1, 1);
    ctx.fillRect(x + i, y, 1, 1);
    ctx.fillRect(x, y - i, 1, 1);
    ctx.fillRect(x, y + i, 1, 1);
  }
  if (r >= 3) {
    ctx.fillRect(x - 1, y - 1, 1, 1);
    ctx.fillRect(x + 1, y - 1, 1, 1);
    ctx.fillRect(x - 1, y + 1, 1, 1);
    ctx.fillRect(x + 1, y + 1, 1, 1);
  }
  ctx.fillStyle = core;
  ctx.fillRect(x, y, 1, 1);
}
