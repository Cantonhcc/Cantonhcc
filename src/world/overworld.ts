// The lunar surface: eight stations, paved lit paths, starlight shards, PIP,
// and a moonboard for anyone who would rather glide than walk.
import { G, Scene } from '../game';
import { clamp, rng } from '../engine/core';
import { audio } from '../engine/audio';
import { input } from '../engine/input';
import { Particles, drawSparkle } from '../engine/particles';
import { save, storeSave } from '../engine/save';
import { ACCENT, SHARD_COLORS, StationId } from '../art/palette';
import { BuildingArt, makeBuildings } from '../art/buildings';
import { glow, vignette } from '../art/glow';
import { makeBeacon, makeBoulder, makeCrystal, makeDish, makeSolar } from '../art/props';
import { makeLamp, makeLander, makeRobot } from '../art/sprites';
import { SHARDS, STATIONS } from '../content/stations';
import { hasShard, stationDone, stationSeen, takeShard, totals } from '../progress';
import { ui } from '../ui/hud';
import { Crater, makeCraters, paintGround } from './ground';
import { DOORS, GUIDE, LANDER, LANDING, MAP_H, MAP_W, PATHS, SHARD_SPOTS, distToPaths, ridgeY } from './layout';
import { Player } from './player';
import { Interior } from './interior';

interface Building { id: StationId; art: BuildingArt; x: number; y: number; left: number; top: number }
interface Prop { x: number; y: number; img: HTMLCanvasElement; r: number; glow?: string; blink?: string }
interface Drawable { y: number; draw: () => void }

// The surface is expensive to paint, so it is built once and reused.
let cache: {
  ground: HTMLCanvasElement; craters: Crater[]; buildings: Building[]; props: Prop[];
  lander: HTMLCanvasElement; robot: HTMLCanvasElement[]; lamps: Record<string, HTMLCanvasElement>;
  studs: { x: number; y: number; i: number }[];
} | null = null;

function build() {
  const craters = makeCraters();
  const arts = makeBuildings();
  const buildings: Building[] = (Object.keys(DOORS) as StationId[]).map((id) => {
    const art = arts[id];
    const d = DOORS[id];
    return { id, art, x: d.x, y: d.y, left: d.x - art.doorX, top: d.y - (art.h - 4) };
  });
  const ground = paintGround(craters, buildings.map((b) => ({ x: b.x, y: b.y, w: b.art.w, accent: ACCENT[b.id] })));

  const r = rng(99);
  const props: Prop[] = [];
  const free = (x: number, y: number, pad: number) => {
    if (y < ridgeY(x | 0) + 26) return false;
    if (distToPaths(x, y) < 16 + pad) return false;
    if (buildings.some((b) => Math.abs(b.x - x) < b.art.w / 2 + 14 + pad && y > b.top - 8 && y < b.y + 46)) return false;
    if (Math.hypot(LANDER.x - x, LANDER.y - y) < 56 + pad || Math.hypot(GUIDE.x - x, GUIDE.y - y) < 30) return false;
    if (SHARD_SPOTS.some(([sx, sy]) => Math.hypot(sx - x, sy - y) < 22 + pad)) return false;
    if (props.some((k) => Math.hypot(k.x - x, k.y - y) < 24 + pad)) return false;
    if (craters.some((c) => Math.hypot(c.x - x, c.y - y) < c.r + 6 && Math.hypot(c.x - x, c.y - y) > c.r - 8)) return false;
    return true;
  };
  const scatter = (n: number, pad: number, make: (i: number) => Omit<Prop, 'x' | 'y'>) => {
    let placed = 0;
    let guard = 0;
    while (placed < n && guard++ < 4000) {
      const x = 24 + r() * (MAP_W - 48);
      const y = 150 + r() * (MAP_H - 174);
      if (!free(x, y, pad)) continue;
      props.push({ x: Math.round(x), y: Math.round(y), ...make(placed) });
      placed++;
    }
  };
  const crystalColors = ['#4fd1c5', '#a78bfa', '#f472b6', '#9be7ff'];
  scatter(9, 8, () => { const img = makeSolar(); return { img, r: 11 }; });
  scatter(5, 8, () => { const img = makeDish(); return { img, r: 7, blink: '#ff6b6b' }; });
  scatter(22, 2, (i) => { const c = crystalColors[i % crystalColors.length]; return { img: makeCrystal(c, i), r: 6, glow: c }; });
  scatter(40, 0, (i) => { const img = makeBoulder(i); return { img, r: img.width / 2 - 1 }; });
  // beacons mark the bends of the walkways
  for (const path of PATHS) {
    for (let i = 1; i < path.length - 1; i++) {
      props.push({ x: path[i][0] + 13, y: path[i][1] - 8, img: makeBeacon('#9be7ff'), r: 2, glow: '#9be7ff' });
    }
  }

  const lamps: Record<string, HTMLCanvasElement> = {};
  for (const id of Object.keys(ACCENT) as StationId[]) lamps[id] = makeLamp(ACCENT[id]);
  const studs: { x: number; y: number; i: number }[] = [];
  for (const path of PATHS) {
    let n = 0;
    for (let s = 0; s < path.length - 1; s++) {
      const [ax, ay] = path[s];
      const [bx, by] = path[s + 1];
      const len = Math.hypot(bx - ax, by - ay);
      const nx = -(by - ay) / len;
      const ny = (bx - ax) / len;
      for (let d = 7; d < len; d += 14) {
        const px = ax + ((bx - ax) * d) / len;
        const py = ay + ((by - ay) * d) / len;
        studs.push({ x: Math.round(px + nx * 6), y: Math.round(py + ny * 6), i: n });
        studs.push({ x: Math.round(px - nx * 6), y: Math.round(py - ny * 6), i: n });
        n++;
      }
    }
  }
  cache = { ground, craters, buildings, props, lander: makeLander(), robot: makeRobot(ACCENT.welcome), lamps, studs };
}

/** The painted surface, for the mini-map and the travel map. */
export function mapCanvas(): HTMLCanvasElement | null {
  return cache ? cache.ground : null;
}

export class Overworld implements Scene {
  player: Player;
  private dust = new Particles();
  private camX = 0;
  private camY = 0;
  private near: Building | null = null;
  private enterHold = 0;
  private cut = -1;        // landing cutscene clock, -1 when not playing
  private ambient = 0;
  private mapTick = 0;

  constructor(from?: StationId) {
    if (!cache) build();
    const start = from ? { x: DOORS[from].x, y: DOORS[from].y + 16 } : LANDING;
    this.player = new Player(start.x, start.y);
    this.player.canRide = true;
    if (!from && !save.intro) {
      this.cut = 0;
      this.player.frozen = true;
    }
    this.snapCamera();
  }

  enter() {
    ui.showHud(true, true);
    ui.refresh();
  }
  leave() {
    ui.setLabels([]);
    ui.setPrompt(null);
    ui.setRiding(false);
  }
  focus() {
    return { x: this.player.x - this.camX, y: this.player.y - 10 - this.camY };
  }

  private solid = (x: number, y: number): boolean => {
    const c = cache!;
    if (x < 6 || x > MAP_W - 6 || y > MAP_H - 6) return true;
    if (y < ridgeY(x | 0) + 12) return true;
    for (const b of c.buildings) {
      if (x > b.left + 5 && x < b.left + b.art.w - 5 && y > b.y - 24 && y < b.y + 1) return true;
    }
    for (const k of c.props) {
      if (Math.abs(x - k.x) < k.r && y > k.y - 6 && y < k.y + 1) return true;
    }
    if (Math.abs(x - LANDER.x) < 20 && y > LANDER.y - 14 && y < LANDER.y + 2) return true;
    if (Math.abs(x - GUIDE.x) < 6 && y > GUIDE.y - 6 && y < GUIDE.y + 2) return true;
    return false;
  };

  private target(): { x: number; y: number } {
    const fx = this.cut >= 0 ? LANDER.x : this.player.x;
    const fy = this.cut >= 0 ? LANDER.y - 30 : this.player.y - 14;
    return {
      x: G.vw >= MAP_W ? (MAP_W - G.vw) / 2 : clamp(fx - G.vw / 2, 0, MAP_W - G.vw),
      y: G.vh >= MAP_H ? (MAP_H - G.vh) / 2 : clamp(fy - G.vh / 2, 0, MAP_H - G.vh),
    };
  }
  private snapCamera() {
    const t = this.target();
    this.camX = t.x;
    this.camY = t.y;
  }

  update(dt: number) {
    const c = cache!;
    const p = this.player;
    const locked = ui.locked() || G.busy;

    if (this.cut >= 0) this.updateCutscene(dt);
    p.frozen = locked || this.cut >= 0;
    if (this.cut < 0) {
      if (!locked && input.take('ride')) this.toggleRide();
      p.update(dt, this.solid, this.dust);
    }
    this.dust.update(dt);

    // the camera glides after the player; drawing is sub-pixel, so this is smooth
    const t = this.target();
    const k = 1 - Math.exp(-dt * 9);
    this.camX += (t.x - this.camX) * k;
    this.camY += (t.y - this.camY) * k;

    for (const b of c.buildings) {
      for (const e of b.art.emitters) {
        if (Math.random() < dt * 9) {
          this.dust.add({
            x: b.left + e.x + (Math.random() - 0.5) * 4, y: b.top + e.y,
            vx: (Math.random() - 0.5) * 6, vy: -14 - Math.random() * 10,
            life: 1.2 + Math.random(), color: e.color, drag: 0.4, twinkle: true,
          });
        }
      }
    }
    this.ambient -= dt;
    if (this.ambient <= 0) {
      this.ambient = 0.14;
      this.dust.add({
        x: this.camX + Math.random() * G.vw, y: this.camY + Math.random() * G.vh,
        vx: (Math.random() - 0.5) * 4, vy: -3 - Math.random() * 4,
        life: 2 + Math.random() * 2, color: SHARD_COLORS[(Math.random() * 4) | 0], twinkle: true,
      });
    }

    this.mapTick -= dt;
    if (this.mapTick <= 0) {
      this.mapTick = 0.12;
      ui.drawMinimap(c.ground, p.x, p.y);
    }

    if (this.cut >= 0) {
      ui.setPrompt(null);
      this.updateLabels();
      return;
    }

    SHARDS.forEach((s, i) => {
      if (hasShard(s.id)) return;
      const [sx, sy] = SHARD_SPOTS[i];
      if (Math.hypot(p.x - sx, p.y - 4 - sy) < 14) {
        takeShard(s.id);
        audio.sfx('collect');
        this.dust.burst(sx, sy - 6, 34, SHARD_COLORS, 80, 1.1);
        ui.shardToast(s);
        ui.refresh();
      }
    });

    this.near = null;
    for (const b of c.buildings) {
      if (Math.abs(p.x - b.x) < 14 && p.y > b.y - 2 && p.y < b.y + 20) this.near = b;
    }
    const nearGuide = Math.hypot(p.x - GUIDE.x, p.y - GUIDE.y) < 28;
    if (this.near) {
      const st = STATIONS.find((s) => s.id === this.near!.id)!;
      ui.setPrompt(`Enter ${st.name}`);
      const pushing = input.axis().y < -0.6;
      this.enterHold = pushing ? this.enterHold + dt : 0;
      if (!locked && (input.take('action') || this.enterHold > 0.3)) this.enterStation(this.near.id);
    } else if (nearGuide) {
      ui.setPrompt('Talk to PIP');
      if (!locked && input.take('action')) this.talk();
    } else {
      ui.setPrompt(null);
      this.enterHold = 0;
    }
    this.updateLabels();
  }

  toggleRide() {
    if (this.cut >= 0) return;
    this.player.toggleRide(this.dust);
    ui.setRiding(this.player.riding);
  }

  private enterStation(id: StationId) {
    audio.sfx('enter');
    G.go(() => new Interior(id));
  }

  private talk() {
    const t = totals();
    audio.sfx('blip');
    const next = STATIONS.find((s) => !stationDone(s));
    let lines: string[];
    if (t.seen === 0) {
      lines = [
        'Hello, researcher! I am PIP. Welcome to Lunar Ledger base.',
        'Each building is a small museum about one part of the Canton Network.',
        'Start with the Welcome Dome, straight up the lit path.',
        'In a hurry? Press R to hop on your moonboard, or M to open the map and travel.',
      ];
    } else if (next) {
      lines = [
        `You have stamped ${t.stations} of ${t.stationCount} stations and found ${t.shards} of ${t.shardCount} shards.`,
        `Next idea: the ${next.name}. ${next.tagline}`,
        'Press R for the moonboard, or M for the map.',
      ];
    } else {
      lines = [
        'Every station stamped. You know this network better than most headlines do.',
        t.shards < t.shardCount ? `There are still ${t.shardCount - t.shards} shards out on the surface.` : 'And every shard found. Remarkable.',
        'Your certificate is waiting in the Library.',
      ];
    }
    ui.dialog('PIP', lines);
  }

  private updateCutscene(dt: number) {
    const before = this.cut;
    this.cut += dt;
    const t = this.cut;
    if (t < 2.6) {
      const ly = this.landerY();
      for (let i = 0; i < 3; i++) {
        this.dust.add({
          x: LANDER.x + (Math.random() - 0.5) * 6, y: ly - 6,
          vx: (Math.random() - 0.5) * 30, vy: 40 + Math.random() * 50,
          life: 0.3 + Math.random() * 0.3, color: ['#fff3c4', '#ffd27a', '#fb923c', '#9be7ff'][(Math.random() * 4) | 0], drag: 1,
        });
      }
    }
    if (before < 2.6 && t >= 2.6) {
      audio.sfx('stamp');
      for (let i = 0; i < 46; i++) {
        const dir = Math.random() < 0.5 ? -1 : 1;
        this.dust.add({
          x: LANDER.x + dir * (6 + Math.random() * 10), y: LANDER.y,
          vx: dir * (30 + Math.random() * 70), vy: -Math.random() * 26,
          life: 0.8 + Math.random() * 0.8, color: Math.random() < 0.5 ? '#aab2de' : '#7f87b8', drag: 2.2, gravity: 10,
        });
      }
    }
    if (before < 3.5 && t >= 3.5) {
      this.dust.burst(LANDING.x, LANDING.y - 10, 24, SHARD_COLORS, 60, 0.8);
      audio.sfx('collect');
    }
    if (t >= 4.2) {
      this.cut = -1;
      save.intro = true;
      storeSave();
      ui.dialog('PIP', [
        'Touchdown! Welcome to Lunar Ledger base, researcher.',
        'This base has eight small museums. Together they explain the Canton Network: how it works, who runs it, and what is really live.',
        'Walk with the arrow keys or WASD. Press E at a door or an exhibit.',
        'Would you rather glide? Press R for your moonboard. Press M for the map: click a station to travel there.',
        'Start with the Welcome Dome, straight ahead. I will be here if you need a hint.',
      ]);
    }
  }
  private landerY(): number {
    if (this.cut < 0) return LANDER.y;
    const t = Math.min(1, this.cut / 2.6);
    return LANDER.y - (1 - t) * (1 - t) * 260;
  }

  private updateLabels() {
    const c = cache!;
    const labels = [];
    for (const b of c.buildings) {
      const sx = b.x - this.camX;
      const sy = b.top - this.camY;
      if (sx < -80 || sx > G.vw + 80 || sy < -60 || sy > G.vh + 20) continue;
      const st = STATIONS.find((s) => s.id === b.id)!;
      labels.push({
        id: b.id, x: sx, y: Math.max(sy - 6, 14), text: st.name,
        sub: stationDone(st) ? 'STAMPED' : `${stationSeen(st)}/${st.exhibits.length}`,
        color: ACCENT[b.id], done: stationDone(st),
      });
    }
    ui.setLabels(labels);
  }

  draw(ctx: CanvasRenderingContext2D) {
    const c = cache!;
    const cx = G.snap(this.camX);
    const cy = G.snap(this.camY);
    const t = G.time;
    const p = this.player;
    ctx.fillStyle = '#04051a';
    ctx.fillRect(0, 0, G.vw, G.vh);
    ctx.drawImage(c.ground, -cx, -cy);
    // night falls a little so that every lamp matters
    ctx.fillStyle = 'rgba(8,10,44,0.2)';
    ctx.fillRect(0, 0, G.vw, G.vh);

    const vis = (x: number, y: number, m: number) => x > cx - m && x < cx + G.vw + m && y > cy - m && y < cy + G.vh + m + 60;

    // pools of light on the ground
    for (const b of c.buildings) {
      if (!vis(b.x, b.y, 140)) continue;
      const a = ACCENT[b.id];
      glow(ctx, b.x - cx, b.y + 10 - cy, 44, a, 0.42, 26);
      glow(ctx, b.x - 19 - cx, b.y + 6 - cy, 18, a, 0.5, 12);
      glow(ctx, b.x + 19 - cx, b.y + 6 - cy, 18, a, 0.5, 12);
    }
    for (const k of c.props) {
      if (k.glow && vis(k.x, k.y, 30)) glow(ctx, k.x - cx, k.y - 4 - cy, 22, k.glow, 0.34 + 0.1 * Math.sin(t * 2 + k.x), 14);
    }
    p.drawLight(ctx, cx, cy);

    // walkway lights ripple towards the stations
    for (const s of c.studs) {
      const x = s.x - cx;
      const y = s.y - cy;
      if (x < -6 || y < -6 || x > G.vw + 6 || y > G.vh + 6) continue;
      const on = (((s.i - Math.floor(t * 6)) % 6) + 6) % 6 === 0;
      ctx.fillStyle = on ? '#f2fdff' : '#58b6d6';
      ctx.fillRect(x, y, 1, 1);
      if (on) glow(ctx, x + 0.5, y + 0.5, 7, '#9be7ff', 0.8);
    }

    const items: Drawable[] = [];
    for (const b of c.buildings) {
      if (!vis(b.x, b.y, 140)) continue;
      items.push({
        y: b.y - 2,
        draw: () => {
          ctx.drawImage(b.art.canvas, b.left - cx, b.top - cy);
          for (const l of b.art.lights) {
            const pulse = 0.5 + 0.5 * Math.sin(t * 2.4 + l.phase);
            const lx = b.left + l.x - cx;
            const ly = b.top + l.y - cy;
            if (l.size <= 1) {
              if (pulse > 0.4) {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(lx, ly, 1, 1);
                glow(ctx, lx + 0.5, ly + 0.5, 6, l.color, 0.9);
              }
            } else {
              glow(ctx, lx + 0.5, ly + 0.5, 10 + l.size * 4, l.color, 0.35 + pulse * 0.5);
              drawSparkle(ctx, lx, ly, l.size, l.color);
            }
          }
          const lamp = c.lamps[b.id];
          ctx.drawImage(lamp, b.x - 22 - cx, b.y - 6 - cy);
          ctx.drawImage(lamp, b.x + 16 - cx, b.y - 6 - cy);
          glow(ctx, b.x - 18.5 - cx, b.y - 3 - cy, 9, ACCENT[b.id], 0.8);
          glow(ctx, b.x + 19.5 - cx, b.y - 3 - cy, 9, ACCENT[b.id], 0.8);
          // warm light spilling from the doorway
          glow(ctx, b.x - cx, b.y - 8 - cy, 14, ACCENT[b.id], 0.45, 12);
        },
      });
    }
    for (const k of c.props) {
      if (!vis(k.x, k.y, 30)) continue;
      items.push({
        y: k.y,
        draw: () => {
          const ix = k.x - k.img.width / 2 - cx;
          const iy = k.y - k.img.height + 2 - cy;
          ctx.fillStyle = 'rgba(14,15,40,0.35)';
          ctx.fillRect(Math.round(k.x - k.r) - cx + 2, k.y - cy, k.r * 2, 2);
          ctx.drawImage(k.img, Math.floor(k.x - k.img.width / 2) - cx, iy);
          if (k.glow) glow(ctx, ix + k.img.width / 2, iy + k.img.height / 2 - 2, 12, k.glow, 0.5);
          if (k.blink && Math.sin(t * 3 + k.x) > 0.3) glow(ctx, k.x + 3.5 - cx, iy + 2.5, 7, k.blink, 0.9);
        },
      });
    }
    items.push({
      y: LANDER.y,
      draw: () => {
        const ly = this.landerY();
        ctx.drawImage(c.lander, LANDER.x - 23 - cx, ly - 42 - cy);
        glow(ctx, LANDER.x + 5 - cx, ly - 30 - cy, 9, '#ff9d4d', 0.4 + 0.4 * Math.sin(t * 3));
        if (this.cut >= 0 && this.cut < 2.6) glow(ctx, LANDER.x - cx, ly + 4 - cy, 40, '#ffd27a', 0.8, 30);
      },
    });
    items.push({
      y: GUIDE.y,
      draw: () => {
        const bob = Math.sin(t * 2.2) * 2;
        ctx.fillStyle = 'rgba(14,15,40,0.4)';
        ctx.fillRect(GUIDE.x - 4 - cx, GUIDE.y - 1 - cy, 8, 2);
        glow(ctx, GUIDE.x - cx, GUIDE.y - 4 - cy, 16, '#4fd1c5', 0.4, 9);
        ctx.drawImage(c.robot[Math.floor(t * 0.7) % 5 === 0 && (t * 3) % 1 < 0.3 ? 1 : 0], GUIDE.x - 8 - cx, GUIDE.y - 22 + bob - cy);
        if (Math.random() < 0.2) this.dust.add({ x: GUIDE.x + (Math.random() - 0.5) * 3, y: GUIDE.y - 5 + bob, vy: 10, life: 0.3, color: '#9be7ff' });
      },
    });
    SHARDS.forEach((s, i) => {
      if (hasShard(s.id)) return;
      const [sx, sy] = SHARD_SPOTS[i];
      if (!vis(sx, sy, 30)) return;
      items.push({
        y: sy,
        draw: () => {
          const bob = Math.sin(t * 2 + i) * 2.5;
          const x = sx - cx;
          const y = sy - 9 + bob - cy;
          const pulse = 0.5 + 0.5 * Math.sin(t * 4 + i * 1.7);
          glow(ctx, x + 0.5, sy + 1 - cy, 16, '#ffe27a', 0.35, 7);
          glow(ctx, x + 0.5, y + 0.5, 20 + pulse * 6, '#ffe27a', 0.75);
          ctx.fillStyle = '#ffe27a';
          ctx.fillRect(x - 1, y - 3, 3, 7);
          ctx.fillRect(x - 2, y - 2, 5, 5);
          ctx.fillRect(x - 3, y - 1, 7, 3);
          ctx.fillStyle = '#fff7c2';
          ctx.fillRect(x - 1, y - 2, 2, 3);
          drawSparkle(ctx, x, y, 4 + Math.round(pulse * 2), '#fff7c2');
        },
      });
    });
    if (this.cut < 0 || this.cut >= 3.5) items.push({ y: p.y, draw: () => p.draw(ctx, cx, cy) });

    items.sort((a, b) => a.y - b.y);
    for (const it of items) it.draw();
    this.dust.draw(ctx, cx, cy);
    vignette(ctx, G.vw, G.vh, 0.5);
  }
}
