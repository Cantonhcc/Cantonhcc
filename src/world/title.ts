// Title screen: a living postcard of the base. Layers of stars, a nebula, the
// Earth, a far ridge and the lit stations on the near hill all drift at
// different speeds with the pointer, which gives the scene real depth.
import { G, Scene } from '../game';
import { hex, makeNoise, rng } from '../engine/core';
import { audio } from '../engine/audio';
import { makeCanvas } from '../engine/px';
import { Particles, drawSparkle } from '../engine/particles';
import { ACCENT, SHARD_COLORS, STAR_COLORS, StationId } from '../art/palette';
import { BuildingArt, makeBuildings } from '../art/buildings';
import { glow, vignette } from '../art/glow';
import { makeBoulder, makeCrystal, makeShip } from '../art/props';
import { makeLander, makePlayerSprites, makeRobot } from '../art/sprites';
import { ui } from '../ui/hud';
import { paintEarth } from './ground';
import { Overworld } from './overworld';

interface Star { x: number; y: number; z: number; c: string; ph: number }

const LINEUP: { id: StationId; dx: number; dy: number }[] = [
  { id: 'harbor', dx: -396, dy: 30 },
  { id: 'arcade', dx: -272, dy: 20 },
  { id: 'privacy', dx: -150, dy: 8 },
  { id: 'welcome', dx: 0, dy: 0 },
  { id: 'reactor', dx: 150, dy: 12 },
  { id: 'library', dx: 270, dy: 22 },
  { id: 'archive', dx: 396, dy: 32 },
];

const INTRO = 3.1;

export class Title implements Scene {
  private stars: Star[] = [];
  private nebula: HTMLCanvasElement;
  private earth: HTMLCanvasElement;
  private hill: HTMLCanvasElement | null = null;
  private ridge: HTMLCanvasElement | null = null;
  private arts: Record<StationId, BuildingArt>;
  private lander = makeLander();
  private hero = makePlayerSprites().frames.down[0];
  private pip = makeRobot(ACCENT.welcome);
  private rocks = [makeBoulder(1), makeBoulder(5), makeBoulder(7)];
  private crystals = [makeCrystal('#4fd1c5', 0), makeCrystal('#a78bfa', 1), makeCrystal('#f472b6', 2)];
  private fxp = new Particles();
  private shoot = 2;
  private warp = 0;
  private starting = false;
  private size = '';
  private age = 0;
  private ship = makeShip();
  private intro = 0;          // seconds into the fly-past; the title opens when it ends
  private introDone = false;
  private skipIntro = () => { if (!this.introDone) this.intro = Math.max(this.intro, INTRO * 0.82); };
  private mx = 0;
  private my = 0;
  private tx = 0;
  private ty = 0;
  private onMove = (e: PointerEvent) => {
    this.tx = (e.clientX / window.innerWidth) * 2 - 1;
    this.ty = (e.clientY / window.innerHeight) * 2 - 1;
  };

  constructor() {
    const r = rng(1234);
    for (let i = 0; i < 340; i++) {
      this.stars.push({ x: r(), y: r(), z: 0.15 + r() * 0.85, c: STAR_COLORS[(r() * STAR_COLORS.length) | 0], ph: r() * 6.28 });
    }
    this.arts = makeBuildings();
    this.earth = makeCanvas(84, 84);
    paintEarth(this.earth.getContext('2d')!, 42, 42, 36);
    // a soft nebula, painted small and stretched
    const nw = 180;
    const nh = 100;
    this.nebula = makeCanvas(nw, nh);
    const g = this.nebula.getContext('2d')!;
    const img = g.createImageData(nw, nh);
    const noise = makeNoise(9);
    const cols = [hex('#7a4bd6'), hex('#2a9ac4'), hex('#d0559a')];
    for (let y = 0; y < nh; y++) {
      for (let x = 0; x < nw; x++) {
        const i = (y * nw + x) * 4;
        const a = noise(x / 34, y / 22) * 0.65 + noise(x / 11 + 7, y / 9) * 0.35;
        const b = noise(x / 40 + 30, y / 26 + 11);
        const which = b > 0.6 ? 1 : b < 0.36 ? 2 : 0;
        const fade = Math.sin((y / nh) * Math.PI);
        const alpha = Math.max(0, a - 0.46) * 2.1 * fade;
        img.data[i] = cols[which][0];
        img.data[i + 1] = cols[which][1];
        img.data[i + 2] = cols[which][2];
        img.data[i + 3] = Math.min(150, alpha * 255);
      }
    }
    g.putImageData(img, 0, 0);
  }

  enter() {
    ui.showHud(false);
    ui.showTitle(true);
    document.getElementById('title')?.classList.toggle('wait', !this.introDone);
    window.addEventListener('pointermove', this.onMove);
    window.addEventListener('pointerdown', this.skipIntro);
    window.addEventListener('keydown', this.skipIntro);
  }
  leave() {
    ui.showTitle(false);
    window.removeEventListener('pointermove', this.onMove);
    window.removeEventListener('pointerdown', this.skipIntro);
    window.removeEventListener('keydown', this.skipIntro);
  }

  /** Called by the Start button. */
  start() {
    if (this.starting || !this.introDone) return;
    this.starting = true;
    audio.start();
    audio.sfx('enter');
    document.getElementById('title')?.classList.add('leaving');
  }

  /** Where the arrival ship is on screen during the fly-past. */
  private shipPos(): [number, number] {
    const k = Math.min(1, this.intro / (INTRO * 0.92));
    const e = k * k * (3 - 2 * k) * 0.35 + k * 0.65;
    return [-100 + e * (G.vw + 230), G.vh * 0.4 + Math.sin(this.intro * 2.4) * 5];
  }

  private groundY(): number {
    return G.vh - Math.max(66, Math.min(120, G.vh * 0.3));
  }

  private buildHill() {
    const w = Math.ceil(G.vw) + 80;
    const hgt = Math.ceil(G.vh - this.groundY()) + 40;
    const c = makeCanvas(w, hgt);
    const g = c.getContext('2d')!;
    const noise = makeNoise(31);
    const tones = ['#6a72ab', '#5d659c', '#51588d', '#464c7d', '#3c416d'];
    const top = (x: number) => 8 + ((x - w / 2) * (x - w / 2)) / (w * 2.4);
    for (let x = 0; x < w; x++) {
      const t0 = Math.round(top(x));
      for (let y = t0; y < hgt; y++) {
        const depth = (y - t0) / 70;
        const n = noise(x / 46, y / 20) * 0.6 + noise(x / 15, y / 8) * 0.4;
        let t = n > 0.62 ? 0 : n > 0.5 ? 1 : n > 0.38 ? 2 : 3;
        if (depth > 0.75) t = Math.min(4, t + 1);
        let col = tones[t];
        if (y === t0) col = '#aab2e6';
        else if (y === t0 + 1) col = '#8088c0';
        else if (y < t0 + 5) col = tones[Math.min(4, t + 1)];
        g.fillStyle = col;
        g.fillRect(x, y, 1, 1);
      }
    }
    // craters, squashed by perspective
    const r = rng(3);
    for (let i = 0; i < 9; i++) {
      const cx = 20 + r() * (w - 40);
      const rad = 7 + r() * 16;
      const cy = top(cx) + 26 + r() * (hgt - 60);
      if (Math.abs(cx - w / 2) < 30) continue;
      for (let y = -rad; y <= rad; y++) {
        for (let x = -rad; x <= rad; x++) {
          const d = Math.hypot(x, y * 2.2) / rad;
          if (d > 1) continue;
          const lightSide = -x - y * 2.2 > 0;
          g.fillStyle = d > 0.82 ? (lightSide ? '#9ba3d8' : '#2c3058') : Math.hypot(x - rad * 0.2, (y - rad * 0.1) * 2.2) / rad > 0.72 ? '#2a2d52' : '#3b406c';
          g.fillRect(Math.round(cx + x), Math.round(cy + y), 1, 1);
        }
      }
    }
    // the walkway from the landing pad up to the base
    const cx = w / 2;
    for (let y = Math.round(top(cx)) + 14; y < hgt; y++) {
      const half = 5 + (y - top(cx)) * 0.16;
      for (let x = Math.round(cx - half - 1); x <= cx + half + 1; x++) {
        const d = Math.abs(x - cx);
        g.fillStyle = d > half ? '#2d315a' : d > half - 1.3 ? '#99a1d0' : Math.floor(Math.pow(y - top(cx), 1.25)) % 9 === 0 ? '#515890' : '#727aae';
        g.fillRect(x, y, 1, 1);
      }
    }
    this.hill = c;

    // far ridge: a dark silhouette with a thin lit edge
    const rc = makeCanvas(w, 60);
    const rg = rc.getContext('2d')!;
    for (let x = 0; x < w; x++) {
      const y0 = Math.round(22 + Math.sin(x * 0.021) * 9 + Math.sin(x * 0.063 + 2) * 5 + noise(x / 12, 4) * 6);
      rg.fillStyle = '#1b1a52';
      rg.fillRect(x, y0, 1, 60 - y0);
      rg.fillStyle = '#4a3f98';
      rg.fillRect(x, y0, 1, 1);
      rg.fillStyle = '#2a2670';
      rg.fillRect(x, y0 + 1, 1, 3);
    }
    this.ridge = rc;
  }

  update(dt: number) {
    this.age += dt;
    if (!this.introDone) {
      this.intro += dt;
      // the ship sheds starlight as it crosses
      const [sx, sy] = this.shipPos();
      for (let i = 0; i < 4; i++) {
        this.fxp.add({
          x: sx - 60 + Math.random() * 10, y: sy + (Math.random() - 0.5) * 14, vx: -40 - Math.random() * 60, vy: (Math.random() - 0.5) * 24,
          life: 0.5 + Math.random() * 0.9, color: ['#f3ff97', '#875cff', '#ffffff', '#d5a5e3'][(Math.random() * 4) | 0], drag: 0.8, twinkle: true, size: Math.random() < 0.3 ? 2 : 1,
        });
      }
      if (this.intro >= INTRO) {
        this.introDone = true;
        document.getElementById('title')?.classList.remove('wait');
      }
    }
    const key = Math.ceil(G.vw) + 'x' + Math.ceil(G.vh);
    if (key !== this.size) {
      this.size = key;
      this.buildHill();
    }
    this.mx += (this.tx - this.mx) * Math.min(1, dt * 3);
    this.my += (this.ty - this.my) * Math.min(1, dt * 3);
    this.shoot -= dt;
    if (this.shoot <= 0 && this.age > 1.5) {
      this.shoot = 1.6 + Math.random() * 3;
      const x = Math.random() * G.vw * 0.8;
      const y = Math.random() * G.vh * 0.3;
      for (let i = 0; i < 30; i++) {
        this.fxp.add({
          x: x - i * 2.4, y: y - i * 1.2, vx: 130, vy: 65,
          life: 0.55 + i * 0.012, color: i < 6 ? '#ffffff' : i < 16 ? '#9be7ff' : '#6b63c8', drag: 0.4,
        });
      }
    }
    const gy = this.groundY();
    if (Math.random() < dt * 7) {
      this.fxp.add({
        x: Math.random() * G.vw, y: gy + Math.random() * 30, vx: (Math.random() - 0.5) * 6, vy: -8 - Math.random() * 16,
        life: 3 + Math.random() * 3, color: SHARD_COLORS[(Math.random() * 4) | 0], twinkle: true, size: Math.random() < 0.2 ? 2 : 1,
      });
    }
    // reactor exhaust
    const reactor = LINEUP.find((l) => l.id === 'reactor')!;
    if (Math.random() < dt * 8) {
      const a = this.arts.reactor;
      this.fxp.add({
        x: G.vw / 2 - this.mx * 14 + reactor.dx - a.doorX + 44 + Math.random() * 22, y: gy + reactor.dy + 10 - a.h + 10,
        vx: (Math.random() - 0.5) * 5, vy: -12 - Math.random() * 8, life: 1.4 + Math.random(), color: Math.random() < 0.5 ? '#fb923c' : '#ffd27a', twinkle: true,
      });
    }
    this.fxp.update(dt);
    if (this.starting) {
      this.warp += dt;
      if (this.warp > 1.15 && !G.busy) {
        this.starting = false;
        G.go(() => new Overworld(), 0.6);
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const w = G.vw;
    const hgt = G.vh;
    const t = G.time;
    const wz = this.warp * this.warp;
    const px = this.mx;
    const py = this.my;
    const gy = this.groundY() - wz * hgt * 0.22;

    const sky = ctx.createLinearGradient(0, 0, 0, hgt);
    sky.addColorStop(0, '#03041a');
    sky.addColorStop(0.42, '#0a0d38');
    sky.addColorStop(0.68, '#261d68');
    sky.addColorStop(0.84, '#4e3190');
    sky.addColorStop(1, '#7a469c');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, hgt);

    ctx.imageSmoothingEnabled = true;
    ctx.globalAlpha = 0.95;
    ctx.drawImage(this.nebula, -30 - px * 5 + Math.sin(t * 0.05) * 8, -10 - py * 3, w + 60, hgt * 0.86);
    ctx.globalAlpha = 1;
    ctx.imageSmoothingEnabled = false;

    const speed = this.starting ? 16 + this.warp * 300 : 1.4;
    for (const s of this.stars) {
      const y = (((s.y * hgt + t * speed * s.z - py * 6 * s.z) % hgt) + hgt) % hgt;
      const x = (((s.x * w - px * 8 * s.z) % w) + w) % w;
      const tw = 0.5 + 0.5 * Math.sin(t * 2 + s.ph);
      ctx.globalAlpha = Math.min(1, 0.25 + s.z * 0.5 + tw * 0.3);
      ctx.fillStyle = s.c;
      if (this.starting) {
        ctx.fillRect(Math.floor(x), Math.floor(y), 1, Math.max(1, Math.round(this.warp * 16 * s.z)));
      } else {
        ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
        if (s.z > 0.9) {
          ctx.globalAlpha = 1;
          glow(ctx, Math.floor(x) + 0.5, Math.floor(y) + 0.5, 5 + tw * 4, s.c, 0.55);
          if (tw > 0.7) drawSparkle(ctx, Math.floor(x), Math.floor(y), 2, s.c);
        }
      }
    }
    ctx.globalAlpha = 1;

    // the Earth with its halo
    const portrait = hgt > w;
    const ex = w * (portrait ? 0.8 : 0.87) - px * 10;
    const ey = hgt * (portrait ? 0.3 : 0.34) - py * 6 - wz * 30 + Math.sin(t * 0.4) * 1.5;
    glow(ctx, ex, ey, 96, '#3f7dff', 0.32);
    glow(ctx, ex - 6, ey - 6, 54, '#9be7ff', 0.3);
    ctx.drawImage(this.earth, Math.round(ex) - 42, Math.round(ey) - 42);

    // light behind the horizon
    glow(ctx, w / 2, gy + 4, w * 0.75, '#a26bff', 0.45, 80);
    glow(ctx, w / 2, gy + 10, w * 0.4, '#ff8ad0', 0.22, 46);
    if (this.ridge) ctx.drawImage(this.ridge, Math.round(-40 - px * 6), Math.round(gy - 34 - py * 2));
    if (this.hill) {
      const hx = Math.round(-40 - px * 14);
      const hy = Math.round(gy - 8 - py * 3);
      ctx.drawImage(this.hill, hx, hy);
      const baseX = w / 2 - px * 14;
      const baseY = hy + 12;
      const hillW = this.hill.width;
      const curve = (dx: number) => (dx * dx) / (hillW * 2.4);

      // ground light first, then the stations from back to front
      for (const l of LINEUP) {
        const x = baseX + l.dx;
        if (x < -80 || x > w + 80) continue;
        glow(ctx, x, baseY + l.dy + curve(l.dx) + 6, 46, ACCENT[l.id], 0.5, 20);
      }
      const order = [...LINEUP].sort((a, b) => a.dy - b.dy);
      for (const l of order) {
        const a = this.arts[l.id];
        const x = Math.round(baseX + l.dx);
        if (x < -90 || x > w + 90) continue;
        const y = Math.round(baseY + l.dy + curve(l.dx));
        const left = x - a.doorX;
        const top = y - (a.h - 4);
        ctx.fillStyle = 'rgba(20,20,60,0.4)';
        ctx.fillRect(left + 6, y - 1, a.w - 6, 3);
        ctx.drawImage(a.canvas, left, top);
        glow(ctx, x, y - 8, 15, ACCENT[l.id], 0.55, 13);
        for (const li of a.lights) {
          const pulse = 0.5 + 0.5 * Math.sin(t * 2.4 + li.phase);
          glow(ctx, left + li.x + 0.5, top + li.y + 0.5, li.size <= 1 ? 5 : 10 + li.size * 4, li.color, li.size <= 1 ? (pulse > 0.4 ? 0.9 : 0) : 0.35 + pulse * 0.5);
        }
      }
      // props in front
      const deco: [HTMLCanvasElement, number, number, string | null][] = [
        [this.crystals[0], -76, 26, '#4fd1c5'], [this.crystals[1], 84, 30, '#a78bfa'], [this.crystals[2], -214, 44, '#f472b6'],
        [this.rocks[0], -42, 50, null], [this.rocks[1], 52, 56, null], [this.rocks[2], 222, 52, null],
      ];
      for (const [img, dx, dy, gc] of deco) {
        const x = Math.round(baseX + dx);
        const y = Math.round(baseY + dy + curve(dx));
        if (gc) glow(ctx, x, y - 2, 20, gc, 0.5, 11);
        ctx.drawImage(img, x - Math.floor(img.width / 2), y - img.height + 2);
        if (gc) glow(ctx, x, y - 7, 10, gc, 0.5);
      }
      // the lander on one side, the astronaut and PIP on the other
      const padY = baseY + 46;
      const lx = baseX + 104;
      ctx.fillStyle = 'rgba(14,15,40,0.4)';
      ctx.fillRect(lx - 20, padY, 40, 3);
      ctx.drawImage(this.lander, Math.round(lx - 23), Math.round(padY - 40));
      glow(ctx, lx + 5, padY - 28, 8, '#ff9d4d', 0.4 + 0.4 * Math.sin(t * 3));
      const hx2 = baseX - 132;
      const bob = Math.sin(t * 2.2) * 2;
      glow(ctx, hx2, padY, 30, '#8fa8ff', 0.25, 12);
      ctx.fillStyle = 'rgba(14,15,40,0.4)';
      ctx.fillRect(hx2 - 5, padY + 5, 10, 2);
      ctx.drawImage(this.hero, Math.round(hx2 - 9), Math.round(padY - 17));
      glow(ctx, hx2 + 24, padY, 14, '#4fd1c5', 0.45, 8);
      ctx.drawImage(this.pip[Math.floor(t * 0.7) % 5 === 0 && (t * 3) % 1 < 0.3 ? 1 : 0], Math.round(hx2 + 16), Math.round(padY - 18 + bob));
    }

    // drifting motes and shooting stars glow as they go
    for (const p of this.fxp.list) {
      if (p.size > 1 || p.color === '#ffffff') glow(ctx, p.x, p.y, 6, p.color === '#ffffff' ? '#9be7ff' : p.color, 0.5 * Math.min(1, p.life));
    }
    this.fxp.draw(ctx);

    if (this.starting) glow(ctx, w / 2, gy, w * (0.3 + wz), '#ffffff', Math.min(1, wz * 0.9));
    if (!this.introDone) {
      // the scene is still dark ahead of the ship; it unveils the base as it flies
      const [sx, sy] = this.shipPos();
      const edge = sx - 30;
      const veil = ctx.createLinearGradient(edge - 50, 0, edge + 20, 0);
      veil.addColorStop(0, 'rgba(3,4,26,0)');
      veil.addColorStop(1, 'rgba(3,4,26,0.96)');
      ctx.fillStyle = veil;
      ctx.fillRect(edge - 50, 0, 70, hgt);
      ctx.fillStyle = 'rgba(3,4,26,0.96)';
      ctx.fillRect(edge + 20, 0, w, hgt);
      for (const s of this.stars) {
        const x = s.x * w;
        if (x > edge + 20 && s.z > 0.5) {
          ctx.globalAlpha = 0.3 + s.z * 0.5;
          ctx.fillStyle = s.c;
          ctx.fillRect(Math.floor(x), Math.floor(s.y * hgt), 1, 1);
        }
      }
      ctx.globalAlpha = 1;
      this.fxp.draw(ctx);
      const sc = w > 330 ? 2 : 1.5;
      const sw = this.ship.width * sc;
      const sh = this.ship.height * sc;
      glow(ctx, sx - sw * 0.5, sy, 46, '#875cff', 0.9, 20);
      glow(ctx, sx - sw * 0.46, sy, 22, '#f3ff97', 0.9, 10);
      glow(ctx, sx, sy, 110, '#875cff', 0.25, 60);
      ctx.drawImage(this.ship, sx - sw / 2, sy - sh / 2, sw, sh);
      // exhaust flame flickers
      const fl = 10 + Math.sin(t * 40) * 4;
      ctx.fillStyle = '#f3ff97';
      ctx.fillRect(sx - sw / 2 - fl, sy - 3, fl, 6);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(sx - sw / 2 - fl * 0.5, sy - 1.5, fl * 0.5, 3);
    }
    vignette(ctx, w, hgt, 0.6);
  }
}
