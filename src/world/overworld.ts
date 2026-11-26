// The lunar surface: eight stations, lit paths, starlight shards and PIP.
import { G, Scene } from '../game';
import { clamp, rng } from '../engine/core';
import { audio } from '../engine/audio';
import { input } from '../engine/input';
import { Particles, drawSparkle } from '../engine/particles';
import { save, storeSave } from '../engine/save';
import { ACCENT, SHARD_COLORS, StationId } from '../art/palette';
import { BuildingArt, makeBuildings } from '../art/buildings';
import { makeLamp, makeLander, makeRobot, makeRock } from '../art/sprites';
import { SHARDS, STATIONS } from '../content/stations';
import { hasShard, stationDone, stationSeen, takeShard, totals } from '../progress';
import { ui } from '../ui/hud';
import { Crater, makeCraters, paintGround } from './ground';
import { DOORS, GUIDE, LANDER, LANDING, MAP_H, MAP_W, PATHS, SHARD_SPOTS, distToPaths, ridgeY } from './layout';
import { Player } from './player';
import { Interior } from './interior';

interface Building { id: StationId; art: BuildingArt; x: number; y: number; left: number; top: number }
interface Rock { x: number; y: number; img: HTMLCanvasElement; r: number }
interface Drawable { y: number; draw: () => void }

// The surface is expensive to paint, so it is built once and reused.
let cache: {
  ground: HTMLCanvasElement; craters: Crater[]; buildings: Building[]; rocks: Rock[];
  lander: HTMLCanvasElement; robot: HTMLCanvasElement[]; lamps: Record<string, HTMLCanvasElement>;
  studs: { x: number; y: number; i: number }[];
} | null = null;

function build() {
  const craters = makeCraters();
  const ground = paintGround(craters);
  const arts = makeBuildings();
  const buildings: Building[] = (Object.keys(DOORS) as StationId[]).map((id) => {
    const art = arts[id];
    const d = DOORS[id];
    return { id, art, x: d.x, y: d.y, left: d.x - art.doorX, top: d.y - (art.h - 4) };
  });
  const r = rng(99);
  const rocks: Rock[] = [];
  let guard = 0;
  while (rocks.length < 46 && guard++ < 3000) {
    const x = 20 + r() * (MAP_W - 40);
    const y = 160 + r() * (MAP_H - 180);
    if (distToPaths(x, y) < 20) continue;
    if (buildings.some((b) => Math.abs(b.x - x) < b.art.w / 2 + 16 && y > b.top - 6 && y < b.y + 26)) continue;
    if (Math.hypot(LANDER.x - x, LANDER.y - y) < 60 || Math.hypot(GUIDE.x - x, GUIDE.y - y) < 30) continue;
    if (SHARD_SPOTS.some(([sx, sy]) => Math.hypot(sx - x, sy - y) < 24)) continue;
    if (rocks.some((k) => Math.hypot(k.x - x, k.y - y) < 26)) continue;
    const img = makeRock(rocks.length);
    rocks.push({ x, y, img, r: img.width / 2 - 1 });
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
      for (let d = 8; d < len; d += 16) studs.push({ x: Math.round(ax + ((bx - ax) * d) / len), y: Math.round(ay + ((by - ay) * d) / len), i: n++ });
    }
  }
  cache = { ground, craters, buildings, rocks, lander: makeLander(), robot: makeRobot(ACCENT.welcome), lamps, studs };
}

/** The painted surface, for the journal's mini-map. */
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

  constructor(from?: StationId) {
    if (!cache) build();
    const start = from ? { x: DOORS[from].x, y: DOORS[from].y + 14 } : LANDING;
    this.player = new Player(start.x, start.y);
    if (!from && !save.intro) {
      this.cut = 0;
      this.player.frozen = true;
    }
    this.snapCamera();
  }

  enter() {
    ui.showHud(true);
    ui.refresh();
  }
  leave() {
    ui.setLabels([]);
    ui.setPrompt(null);
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
    for (const k of c.rocks) {
      if (Math.abs(x - k.x) < k.r && y > k.y - 6 && y < k.y + 1) return true;
    }
    if (Math.abs(x - LANDER.x) < 20 && y > LANDER.y - 14 && y < LANDER.y + 2) return true;
    if (Math.abs(x - GUIDE.x) < 6 && y > GUIDE.y - 6 && y < GUIDE.y + 2) return true;
    return false;
  };

  private snapCamera() {
    const fx = this.cut >= 0 ? LANDER.x : this.player.x;
    const fy = this.cut >= 0 ? LANDER.y - 30 : this.player.y - 12;
    this.camX = this.clampX(fx - G.vw / 2);
    this.camY = this.clampY(fy - G.vh / 2);
  }
  private clampX(v: number) {
    return G.vw >= MAP_W ? (MAP_W - G.vw) / 2 : clamp(v, 0, MAP_W - G.vw);
  }
  private clampY(v: number) {
    return G.vh >= MAP_H ? (MAP_H - G.vh) / 2 : clamp(v, 0, MAP_H - G.vh);
  }

  update(dt: number) {
    const c = cache!;
    const p = this.player;
    const locked = ui.locked() || G.busy;

    if (this.cut >= 0) this.updateCutscene(dt);
    p.frozen = locked || this.cut >= 0;
    if (this.cut < 0) p.update(dt, this.solid, this.dust);
    this.dust.update(dt);

    // camera eases after the player
    const tx = this.clampX((this.cut >= 0 ? LANDER.x : p.x) - G.vw / 2);
    const ty = this.clampY((this.cut >= 0 ? LANDER.y - 30 : p.y - 12) - G.vh / 2);
    const k = Math.min(1, dt * 6);
    this.camX += (tx - this.camX) * k;
    this.camY += (ty - this.camY) * k;

    // reactor vents
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
    // drifting stardust
    this.ambient -= dt;
    if (this.ambient <= 0) {
      this.ambient = 0.18;
      this.dust.add({
        x: this.camX + Math.random() * G.vw, y: this.camY + Math.random() * G.vh,
        vx: (Math.random() - 0.5) * 4, vy: -3 - Math.random() * 4,
        life: 2 + Math.random() * 2, color: SHARD_COLORS[(Math.random() * 4) | 0], twinkle: true,
      });
    }

    if (this.cut >= 0) {
      ui.setPrompt(null);
      this.updateLabels();
      return;
    }

    // shards
    SHARDS.forEach((s, i) => {
      if (hasShard(s.id)) return;
      const [sx, sy] = SHARD_SPOTS[i];
      if (Math.hypot(p.x - sx, p.y - 4 - sy) < 13) {
        takeShard(s.id);
        audio.sfx('collect');
        this.dust.burst(sx, sy - 6, 30, SHARD_COLORS, 70, 1);
        ui.shardToast(s);
        ui.refresh();
      }
    });

    // doors
    this.near = null;
    for (const b of c.buildings) {
      if (Math.abs(p.x - b.x) < 13 && p.y > b.y - 2 && p.y < b.y + 18) this.near = b;
    }
    const nearGuide = Math.hypot(p.x - GUIDE.x, p.y - GUIDE.y) < 26;
    if (this.near) {
      const st = STATIONS.find((s) => s.id === this.near!.id)!;
      ui.setPrompt(`Enter ${st.name}`);
      const pushing = input.axis().y < -0.6;
      this.enterHold = pushing ? this.enterHold + dt : 0;
      if (!locked && (input.take('action') || this.enterHold > 0.25)) this.enterStation(this.near.id);
    } else if (nearGuide) {
      ui.setPrompt('Talk to PIP');
      if (!locked && input.take('action')) this.talk();
    } else {
      ui.setPrompt(null);
      this.enterHold = 0;
    }
    this.updateLabels();
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
        'And keep an eye out for starlight shards. Each one holds a fact.',
      ];
    } else if (next) {
      lines = [
        `You have stamped ${t.stations} of ${t.stationCount} stations and found ${t.shards} of ${t.shardCount} shards.`,
        `Next idea: the ${next.name}. ${next.tagline}`,
        'Tip: hold Shift to fire your suit thruster and glide.',
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
      // descent: engine exhaust
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
          life: 0.8 + Math.random() * 0.8, color: Math.random() < 0.5 ? '#a9b0d4' : '#7d84ad', drag: 2.2, gravity: 10,
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
        'Walk with the arrow keys or WASD. Hold Shift to glide. Press E at a door or an exhibit.',
        'Start with the Welcome Dome, straight ahead. I will be here if you need a hint.',
      ]);
    }
  }
  private landerY(): number {
    if (this.cut < 0) return LANDER.y;
    const t = Math.min(1, this.cut / 2.6);
    return LANDER.y - (1 - (1 - (1 - t) * (1 - t))) * 260;
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
        id: b.id, x: sx, y: Math.max(sy - 6, 12), text: st.name,
        sub: stationDone(st) ? 'STAMPED' : `${stationSeen(st)}/${st.exhibits.length}`,
        color: ACCENT[b.id], done: stationDone(st),
      });
    }
    ui.setLabels(labels);
  }

  draw(ctx: CanvasRenderingContext2D) {
    const c = cache!;
    const cx = Math.round(this.camX);
    const cy = Math.round(this.camY);
    const t = G.time;
    ctx.fillStyle = '#070816';
    ctx.fillRect(0, 0, G.vw, G.vh);
    ctx.drawImage(c.ground, -cx, -cy);

    // path lights ripple towards the stations
    for (const s of c.studs) {
      const x = s.x - cx;
      const y = s.y - cy;
      if (x < -2 || y < -2 || x > G.vw + 2 || y > G.vh + 2) continue;
      const on = (((s.i - Math.floor(t * 5)) % 7) + 7) % 7 === 0;
      ctx.fillStyle = on ? '#e9fbff' : '#5fb9d6';
      ctx.fillRect(x, y, 1, 1);
      if (on) {
        ctx.fillStyle = 'rgba(155,231,255,0.5)';
        ctx.fillRect(x - 1, y, 3, 1);
        ctx.fillRect(x, y - 1, 1, 3);
      }
    }

    const items: Drawable[] = [];
    const vis = (x: number, y: number, m: number) => x > cx - m && x < cx + G.vw + m && y > cy - m && y < cy + G.vh + m + 60;

    for (const b of c.buildings) {
      if (!vis(b.x, b.y, 120)) continue;
      items.push({
        y: b.y - 2,
        draw: () => {
          ctx.drawImage(b.art.canvas, b.left - cx, b.top - cy);
          for (const l of b.art.lights) {
            const pulse = 0.5 + 0.5 * Math.sin(t * 2.4 + l.phase);
            const lx = b.left + l.x - cx;
            const ly = b.top + l.y - cy;
            if (l.size <= 1) {
              if (pulse > 0.45) {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(lx, ly, 1, 1);
                ctx.fillStyle = l.color;
                ctx.globalAlpha = 0.55;
                ctx.fillRect(lx - 1, ly, 3, 1);
                ctx.fillRect(lx, ly - 1, 1, 3);
                ctx.globalAlpha = 1;
              }
            } else {
              ctx.globalAlpha = 0.35 + pulse * 0.65;
              drawSparkle(ctx, lx, ly, l.size + (pulse > 0.8 ? 1 : 0), l.color);
              ctx.globalAlpha = 1;
            }
          }
          // door lamps
          const lamp = c.lamps[b.id];
          ctx.drawImage(lamp, b.x - 22 - cx, b.y - 6 - cy);
          ctx.drawImage(lamp, b.x + 16 - cx, b.y - 6 - cy);
        },
      });
    }
    for (const k of c.rocks) {
      if (!vis(k.x, k.y, 20)) continue;
      items.push({ y: k.y, draw: () => ctx.drawImage(k.img, Math.round(k.x - k.img.width / 2) - cx, Math.round(k.y - k.img.height + 2) - cy) });
    }
    // lander
    items.push({
      y: LANDER.y,
      draw: () => {
        const ly = this.landerY();
        ctx.fillStyle = 'rgba(12,13,32,0.4)';
        ctx.fillRect(LANDER.x - 20 - cx, LANDER.y - 2 - cy, 40, 4);
        ctx.drawImage(c.lander, LANDER.x - 23 - cx, Math.round(ly) - 42 - cy);
      },
    });
    // PIP
    items.push({
      y: GUIDE.y,
      draw: () => {
        const bob = Math.round(Math.sin(t * 2.2) * 2);
        ctx.fillStyle = 'rgba(12,13,32,0.4)';
        ctx.fillRect(GUIDE.x - 4 - cx, GUIDE.y - 1 - cy, 8, 2);
        ctx.drawImage(c.robot[Math.floor(t * 0.7) % 5 === 0 && (t * 3) % 1 < 0.3 ? 1 : 0], GUIDE.x - 8 - cx, GUIDE.y - 22 + bob - cy);
        if (Math.random() < 0.2) this.dust.add({ x: GUIDE.x + (Math.random() - 0.5) * 3, y: GUIDE.y - 5 + bob, vy: 10, life: 0.3, color: '#9be7ff' });
      },
    });
    // shards
    SHARDS.forEach((s, i) => {
      if (hasShard(s.id)) return;
      const [sx, sy] = SHARD_SPOTS[i];
      if (!vis(sx, sy, 20)) return;
      items.push({
        y: sy,
        draw: () => {
          const bob = Math.sin(t * 2 + i) * 2.5;
          const x = sx - cx;
          const y = sy - 8 + bob - cy;
          const pulse = 0.5 + 0.5 * Math.sin(t * 4 + i * 1.7);
          ctx.fillStyle = 'rgba(255,226,122,0.16)';
          ctx.fillRect(x - 5, y - 5, 11, 11);
          ctx.fillRect(x - 3, y - 7, 7, 15);
          ctx.fillRect(x - 7, y - 3, 15, 7);
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
    if (this.cut < 0 || this.cut >= 3.5) items.push({ y: this.player.y, draw: () => this.player.draw(ctx, cx, cy) });

    items.sort((a, b) => a.y - b.y);
    for (const it of items) it.draw();
    this.dust.draw(ctx, cx, cy);
  }
}
