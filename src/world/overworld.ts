// The lunar surface, drawn as a small round moon. The ground rolls away over
// a curved horizon, distant stations rise from behind it, and the world wraps:
// keep going in one direction and you arrive back where you started.
import { G, Scene } from '../game';
import { rng } from '../engine/core';
import { audio } from '../engine/audio';
import { input } from '../engine/input';
import { makeCanvas } from '../engine/px';
import { Particles, drawSparkle } from '../engine/particles';
import { save, storeSave } from '../engine/save';
import { ACCENT, SHARD_COLORS, STAR_COLORS, StationId } from '../art/palette';
import { BuildingArt, makeBuildings } from '../art/buildings';
import { glow, vignette } from '../art/glow';
import { makeBeacon, makeBoulder, makeCrystal, makeDish, makeSolar } from '../art/props';
import { makeLamp, makeLander, makeRobot } from '../art/sprites';
import { SHARDS, STATIONS } from '../content/stations';
import { hasShard, stationDone, stationSeen, takeShard, totals } from '../progress';
import { ui } from '../ui/hud';
import { Crater, makeCraters, paintEarth, paintGround } from './ground';
import { DOORS, GUIDE, LANDER, LANDING, MAP_H, MAP_W, PATHS, SHARD_SPOTS, delta, distToPaths, wrapX, wrapY } from './layout';
import { Player } from './player';
import { Interior } from './interior';

interface Building { id: StationId; art: BuildingArt; x: number; y: number }
interface Prop { x: number; y: number; img: HTMLCanvasElement; r: number; glow?: string; blink?: string }
interface Drawable { y: number; draw: () => void }

const PAD = 900; // extra columns copied onto the right edge so one draw can cross the seam

let cache: {
  ground: HTMLCanvasElement; wide: HTMLCanvasElement; craters: Crater[]; buildings: Building[]; props: Prop[];
  lander: HTMLCanvasElement; robot: HTMLCanvasElement[]; lamps: Record<string, HTMLCanvasElement>;
  studs: { x: number; y: number; i: number }[]; stars: HTMLCanvasElement; earth: HTMLCanvasElement;
} | null = null;

function build() {
  const craters = makeCraters();
  const arts = makeBuildings();
  const buildings: Building[] = (Object.keys(DOORS) as StationId[]).map((id) => ({ id, art: arts[id], x: DOORS[id].x, y: DOORS[id].y }));
  const ground = paintGround(craters, buildings.map((b) => ({ x: b.x, y: b.y, w: b.art.w, accent: ACCENT[b.id] })));
  const wide = makeCanvas(MAP_W + PAD, MAP_H);
  const wg = wide.getContext('2d')!;
  wg.drawImage(ground, 0, 0);
  wg.drawImage(ground, MAP_W, 0);

  const r = rng(99);
  const props: Prop[] = [];
  const free = (x: number, y: number, pad: number) => {
    if (distToPaths(x, y) < 16 + pad) return false;
    if (buildings.some((b) => Math.abs(b.x - x) < b.art.w / 2 + 14 + pad && y > b.y - b.art.h - 4 && y < b.y + 46)) return false;
    if (Math.hypot(LANDER.x - x, LANDER.y - y) < 56 + pad || Math.hypot(GUIDE.x - x, GUIDE.y - y) < 30) return false;
    if (SHARD_SPOTS.some(([sx, sy]) => Math.hypot(sx - x, sy - y) < 22 + pad)) return false;
    if (props.some((k) => Math.hypot(k.x - x, k.y - y) < 24 + pad)) return false;
    if (craters.some((c) => { const d = Math.hypot(delta(c.x - x, MAP_W), delta(c.y - y, MAP_H)); return d < c.r + 6 && d > c.r - 8; })) return false;
    return true;
  };
  const scatter = (n: number, pad: number, make: (i: number) => Omit<Prop, 'x' | 'y'>) => {
    let placed = 0;
    let guard = 0;
    while (placed < n && guard++ < 4000) {
      const x = 20 + r() * (MAP_W - 40);
      const y = 20 + r() * (MAP_H - 40);
      if (!free(x, y, pad)) continue;
      props.push({ x: Math.round(x), y: Math.round(y), ...make(placed) });
      placed++;
    }
  };
  const crystalColors = ['#4fd1c5', '#a78bfa', '#f472b6', '#9be7ff'];
  scatter(10, 8, () => ({ img: makeSolar(), r: 11 }));
  scatter(6, 8, () => ({ img: makeDish(), r: 7, blink: '#ff6b6b' }));
  scatter(26, 2, (i) => { const c = crystalColors[i % crystalColors.length]; return { img: makeCrystal(c, i), r: 6, glow: c }; });
  scatter(46, 0, (i) => { const img = makeBoulder(i); return { img, r: img.width / 2 - 1 }; });
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
  // a tile of stars for the sky
  const stars = makeCanvas(512, 256);
  const sg = stars.getContext('2d')!;
  const sr = rng(4242);
  for (let n = 0; n < 420; n++) {
    const x = Math.floor(sr() * 512);
    const y = Math.floor(sr() * 256);
    sg.fillStyle = STAR_COLORS[(sr() * STAR_COLORS.length) | 0];
    sg.globalAlpha = 0.35 + sr() * 0.65;
    sg.fillRect(x, y, 1, 1);
    if (sr() < 0.06) {
      sg.fillRect(x - 1, y, 3, 1);
      sg.fillRect(x, y - 1, 1, 3);
    }
  }
  const earth = makeCanvas(60, 60);
  paintEarth(earth.getContext('2d')!, 30, 30, 26);
  cache = { ground, wide, craters, buildings, props, lander: makeLander(), robot: makeRobot(ACCENT.welcome), lamps, studs, stars, earth };
}

/** The painted surface, for the mini-map and the travel map. */
export function mapCanvas(): HTMLCanvasElement | null {
  return cache ? cache.ground : null;
}

export class Overworld implements Scene {
  player: Player;
  private dust = new Particles();
  private near: Building | null = null;
  private enterHold = 0;
  private cut = -1;        // landing cutscene clock, -1 when not playing
  private ambient = 0;
  private mapTick = 0;
  // projection state, refreshed every frame
  private fx = 0;          // world point the camera looks at
  private fy = 0;
  private H0 = 40;         // screen y of the horizon
  private P = 150;         // screen y of the focus point
  private R = 110;         // radius of the little moon, in game pixels
  private sagK = 0;
  private qx = 0;          // result of the last place() call
  private qy = 0;
  private qs = 1;
  private qfar = false;

  constructor(from?: StationId) {
    if (!cache) build();
    const start = from ? { x: DOORS[from].x, y: DOORS[from].y + 16 } : LANDING;
    this.player = new Player(start.x, start.y);
    this.player.canRide = true;
    if (!from && !save.intro) {
      this.cut = 0;
      this.player.frozen = true;
    }
    this.frame();
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
    this.place(this.player.x, this.player.y);
    return { x: this.qx, y: this.qy - 10 };
  }

  private solid = (x: number, y: number): boolean => {
    const c = cache!;
    x = wrapX(x);
    y = wrapY(y);
    for (const b of c.buildings) {
      const left = b.x - b.art.doorX;
      if (x > left + 5 && x < left + b.art.w - 5 && y > b.y - 24 && y < b.y + 1) return true;
    }
    for (const k of c.props) {
      if (Math.abs(x - k.x) < k.r && y > k.y - 6 && y < k.y + 1) return true;
    }
    if (Math.abs(x - LANDER.x) < 20 && y > LANDER.y - 14 && y < LANDER.y + 2) return true;
    if (Math.abs(x - GUIDE.x) < 6 && y > GUIDE.y - 6 && y < GUIDE.y + 2) return true;
    return false;
  };

  /** Sets up this frame's projection. */
  private frame() {
    const p = this.player;
    this.fx = this.cut >= 0 ? LANDER.x : p.x;
    this.fy = this.cut >= 0 ? LANDER.y - 6 : p.y;
    this.H0 = Math.round(G.vh * 0.22);
    this.P = Math.round(G.vh * 0.68);
    this.R = this.P - this.H0;
    this.sagK = (G.vh * 0.065) / ((G.vw / 2) * (G.vw / 2));
  }

  /**
   * Projects a world point onto the screen. North of the focus the ground
   * curves away like the surface of a ball; past the horizon things sink.
   * Returns false when the point cannot be seen. Result is left in qx, qy, qs, qfar.
   */
  private place(x: number, y: number, margin = 60): boolean {
    const dx = delta(x - this.fx, MAP_W);
    if (Math.abs(dx) > G.vw / 2 + margin) return false;
    const dy = delta(y - this.fy, MAP_H);
    this.qx = G.vw / 2 + dx;
    this.qfar = false;
    if (dy >= 0) {
      if (dy > G.vh - this.P + margin) return false;
      this.qy = this.P + dy;
      this.qs = 1;
      return true;
    }
    const th = dy / this.R;
    let w: number;
    if (th >= -Math.PI / 2) {
      this.qy = this.P + this.R * Math.sin(th);
      this.qs = Math.max(0.12, Math.cos(th));
      w = (this.P - this.qy) / this.R;
    } else {
      const phi = -th - Math.PI / 2;
      if (phi > 1.35) return false;
      this.qy = this.H0 + this.R * (1 - Math.cos(phi));
      this.qs = 0.12;
      this.qfar = true;
      w = 1;
    }
    this.qy += this.sagK * dx * dx * w * w;
    return true;
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
      p.x = wrapX(p.x);
      p.y = wrapY(p.y);
    }
    this.dust.update(dt);
    this.frame();

    for (const b of c.buildings) {
      for (const e of b.art.emitters) {
        if (Math.random() < dt * 9) {
          this.dust.add({
            x: b.x - b.art.doorX + e.x + (Math.random() - 0.5) * 4, y: b.y - 2, vx: (Math.random() - 0.5) * 6, vy: 0,
            life: 1.2 + Math.random(), color: e.color, drag: 0.4, twinkle: true, h: b.art.h - 4 - e.y, vh: 14 + Math.random() * 8,
          });
        }
      }
    }
    this.ambient -= dt;
    if (this.ambient <= 0) {
      this.ambient = 0.12;
      this.dust.add({
        x: p.x + (Math.random() - 0.5) * G.vw, y: p.y + (Math.random() - 0.7) * G.vh * 0.8,
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

    const far = (x: number, y: number) => Math.hypot(delta(x - p.x, MAP_W), delta(y - p.y, MAP_H));
    SHARDS.forEach((s, i) => {
      if (hasShard(s.id)) return;
      const [sx, sy] = SHARD_SPOTS[i];
      if (far(sx, sy + 4) < 14) {
        takeShard(s.id);
        audio.sfx('collect');
        this.dust.burst(sx, sy - 6, 34, SHARD_COLORS, 80, 1.1);
        ui.shardToast(s);
        ui.refresh();
      }
    });

    this.near = null;
    for (const b of c.buildings) {
      if (Math.abs(delta(p.x - b.x, MAP_W)) < 14 && p.y > b.y - 2 && p.y < b.y + 20) this.near = b;
    }
    const nearGuide = far(GUIDE.x, GUIDE.y) < 28;
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
        'This moon is small and round. Walk far enough in any direction and you come back to where you began.',
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
      for (let i = 0; i < 3; i++) {
        this.dust.add({
          x: LANDER.x + (Math.random() - 0.5) * 6, y: LANDER.y - 2,
          vx: (Math.random() - 0.5) * 30, vy: 0, h: this.landerLift() + 4, vh: -70,
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
          life: 0.8 + Math.random() * 0.8, color: Math.random() < 0.5 ? '#aab2de' : '#7f87b8', drag: 2.2,
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
        'One more thing: this moon is round. Keep walking in one direction and you will come all the way back.',
        'Start with the Welcome Dome, straight ahead. I will be here if you need a hint.',
      ]);
    }
  }
  /** How far above the pad the lander still is during the landing. */
  private landerLift(): number {
    if (this.cut < 0) return 0;
    const t = Math.min(1, this.cut / 2.6);
    return (1 - t) * (1 - t) * 230;
  }

  private updateLabels() {
    const c = cache!;
    const labels = [];
    for (const b of c.buildings) {
      if (!this.place(b.x, b.y, 90)) continue;
      const top = this.qy - b.art.h;
      if (top > G.vh - 30 || this.qy < this.H0 - 4) continue;
      const st = STATIONS.find((s) => s.id === b.id)!;
      labels.push({
        id: b.id, x: this.qx, y: Math.max(top - 2, 16), text: st.name,
        sub: stationDone(st) ? 'STAMPED' : `${stationSeen(st)}/${st.exhibits.length}`,
        color: ACCENT[b.id], done: stationDone(st),
      });
    }
    ui.setLabels(labels);
  }

  private drawSky(ctx: CanvasRenderingContext2D) {
    const c = cache!;
    const w = G.vw;
    const skyH = this.H0 + G.vh * 0.08 + 4;
    const g = ctx.createLinearGradient(0, 0, 0, skyH);
    g.addColorStop(0, '#04051a');
    g.addColorStop(0.55, '#0c0f3c');
    g.addColorStop(1, '#2b2370');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, skyH);
    // the stars turn as you walk, which is what makes the ground feel like a ball
    const ox = (((this.fx * 0.4) % 512) + 512) % 512;
    const oy = (((this.fy * 0.4) % 256) + 256) % 256;
    for (let x = -ox; x < w; x += 512) {
      for (let y = -oy; y < skyH; y += 256) ctx.drawImage(c.stars, G.snap(x), G.snap(y));
    }
    const ex = w * 0.78;
    const ey = this.H0 - 4 + this.sagK * (ex - w / 2) * (ex - w / 2);
    glow(ctx, ex, ey, 60, '#3f7dff', 0.35);
    ctx.drawImage(c.earth, ex - 30, ey - 30);
    glow(ctx, w / 2, this.H0 + 6, w * 0.8, '#7f8cff', 0.3, 30);
  }

  private drawGround(ctx: CanvasRenderingContext2D) {
    const c = cache!;
    const w = G.vw;
    const sx = wrapX(this.fx - w / 2);
    ctx.save();
    // everything below the curved horizon
    ctx.beginPath();
    ctx.moveTo(0, G.vh);
    for (let x = 0; x <= w + 4; x += 4) ctx.lineTo(x, this.H0 + this.sagK * (x - w / 2) * (x - w / 2));
    ctx.lineTo(w, G.vh);
    ctx.closePath();
    ctx.clip();
    // rows north of the focus are squeezed more and more towards the horizon
    const step = Math.max(1, Math.round(G.zp / 3)) / G.zp;
    const R = this.R;
    let prev = -Math.PI / 2;
    for (let y = this.H0; y < this.P; y += step) {
      const next = Math.asin(Math.min(0, (y + step - this.P) / R));
      const h = Math.max(0.2, (next - prev) * R);
      const wy = wrapY(this.fy + prev * R);
      ctx.drawImage(c.wide, sx, Math.min(wy, MAP_H - h), w, h, 0, y, w, step + 0.02);
      prev = next;
    }
    // south of the focus the ground is flat; one or two plain blits
    const rest = G.vh - this.P;
    const y0 = wrapY(this.fy);
    const first = Math.min(rest, MAP_H - y0);
    ctx.drawImage(c.wide, sx, y0, w, first, 0, this.P, w, first);
    if (first < rest) ctx.drawImage(c.wide, sx, 0, w, rest - first, 0, this.P + first, w, rest - first);
    // distance haze and a little night
    const haze = ctx.createLinearGradient(0, this.H0, 0, this.H0 + R * 0.55);
    haze.addColorStop(0, 'rgba(30,28,96,0.72)');
    haze.addColorStop(1, 'rgba(30,28,96,0)');
    ctx.fillStyle = haze;
    ctx.fillRect(0, this.H0, w, R * 0.6 + G.vh * 0.04);
    ctx.fillStyle = 'rgba(8,10,44,0.2)';
    ctx.fillRect(0, 0, w, G.vh);
    ctx.restore();
  }

  draw(ctx: CanvasRenderingContext2D) {
    const c = cache!;
    const t = G.time;
    const p = this.player;
    this.frame();
    this.drawSky(ctx);

    const nearItems: Drawable[] = [];
    const farItems: Drawable[] = [];
    const add = (x: number, y: number, margin: number, draw: (sx: number, sy: number, far: boolean) => void) => {
      if (!this.place(x, y, margin)) return;
      const sx = this.qx;
      const sy = this.qy;
      const far = this.qfar;
      (far ? farItems : nearItems).push({ y: sy, draw: () => draw(sx, sy, far) });
    };

    for (const b of c.buildings) {
      add(b.x, b.y, 110, (sx, sy, far) => {
        const a = ACCENT[b.id];
        const left = sx - b.art.doorX;
        const top = sy - (b.art.h - 4);
        ctx.drawImage(b.art.canvas, left, top);
        for (const l of b.art.lights) {
          const pulse = 0.5 + 0.5 * Math.sin(t * 2.4 + l.phase);
          if (l.size <= 1) {
            if (pulse > 0.4) {
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(left + l.x, top + l.y, 1, 1);
              glow(ctx, left + l.x + 0.5, top + l.y + 0.5, 6, l.color, 0.9);
            }
          } else {
            glow(ctx, left + l.x + 0.5, top + l.y + 0.5, 10 + l.size * 4, l.color, 0.35 + pulse * 0.5);
            drawSparkle(ctx, left + l.x, top + l.y, l.size, l.color);
          }
        }
        if (far) return;
        const lamp = c.lamps[b.id];
        ctx.drawImage(lamp, sx - 22, sy - 6);
        ctx.drawImage(lamp, sx + 16, sy - 6);
        glow(ctx, sx - 18.5, sy - 3, 9, a, 0.8);
        glow(ctx, sx + 19.5, sy - 3, 9, a, 0.8);
        glow(ctx, sx, sy - 8, 14, a, 0.45, 12);
      });
    }
    for (const k of c.props) {
      add(k.x, k.y, 30, (sx, sy, far) => {
        const iy = sy - k.img.height + 2;
        if (!far) {
          ctx.fillStyle = 'rgba(14,15,40,0.35)';
          ctx.fillRect(sx - k.r + 2, sy, k.r * 2, 2);
        }
        ctx.drawImage(k.img, sx - Math.floor(k.img.width / 2), iy);
        if (k.glow) glow(ctx, sx, iy + k.img.height / 2 - 2, 12, k.glow, 0.5);
        if (k.blink && Math.sin(t * 3 + k.x) > 0.3) glow(ctx, sx + 3.5, iy + 2.5, 7, k.blink, 0.9);
      });
    }
    add(LANDER.x, LANDER.y, 40, (sx, sy) => {
      const lift = this.landerLift();
      ctx.drawImage(c.lander, sx - 23, sy - 42 - lift);
      glow(ctx, sx + 5, sy - 30 - lift, 9, '#ff9d4d', 0.4 + 0.4 * Math.sin(t * 3));
      if (this.cut >= 0 && this.cut < 2.6) glow(ctx, sx, sy + 4, 40, '#ffd27a', 0.8, 30);
    });
    add(GUIDE.x, GUIDE.y, 30, (sx, sy) => {
      const bob = Math.sin(t * 2.2) * 2;
      ctx.fillStyle = 'rgba(14,15,40,0.4)';
      ctx.fillRect(sx - 4, sy - 1, 8, 2);
      ctx.drawImage(c.robot[Math.floor(t * 0.7) % 5 === 0 && (t * 3) % 1 < 0.3 ? 1 : 0], sx - 8, sy - 22 + bob);
    });
    SHARDS.forEach((s, i) => {
      if (hasShard(s.id)) return;
      const [wx, wy] = SHARD_SPOTS[i];
      add(wx, wy, 30, (sx, sy) => {
        const bob = Math.sin(t * 2 + i) * 2.5;
        const y = sy - 9 + bob;
        const pulse = 0.5 + 0.5 * Math.sin(t * 4 + i * 1.7);
        glow(ctx, sx + 0.5, y + 0.5, 20 + pulse * 6, '#ffe27a', 0.75);
        ctx.fillStyle = '#ffe27a';
        ctx.fillRect(sx - 1, y - 3, 3, 7);
        ctx.fillRect(sx - 2, y - 2, 5, 5);
        ctx.fillRect(sx - 3, y - 1, 7, 3);
        ctx.fillStyle = '#fff7c2';
        ctx.fillRect(sx - 1, y - 2, 2, 3);
        drawSparkle(ctx, sx, y, 4 + Math.round(pulse * 2), '#fff7c2');
      });
    });
    if (this.cut < 0 || this.cut >= 3.5) {
      add(p.x, p.y, 40, (sx, sy) => {
        // the player draws itself in world space; hand it a camera that lands it at (sx, sy)
        p.draw(ctx, p.x - sx, p.y - sy);
      });
    }

    // things beyond the horizon first: the ground will cover whatever has sunk
    farItems.sort((a, b) => b.y - a.y);
    for (const it of farItems) it.draw();
    this.drawGround(ctx);

    // light pooled on the ground
    for (const b of c.buildings) {
      if (!this.place(b.x, b.y + 10, 120) || this.qfar) continue;
      const a = ACCENT[b.id];
      glow(ctx, this.qx, this.qy, 44, a, 0.42, 26 * this.qs);
    }
    for (const k of c.props) {
      if (!k.glow || !this.place(k.x, k.y - 2, 30) || this.qfar) continue;
      glow(ctx, this.qx, this.qy, 22, k.glow, 0.34 + 0.1 * Math.sin(t * 2 + k.x), 14 * this.qs);
    }
    if (this.place(p.x, p.y, 40)) {
      glow(ctx, this.qx, this.qy - 6, 46, '#8fa8ff', 0.16, 34);
      if (p.riding) glow(ctx, this.qx, this.qy, 26, '#4fd1c5', 0.55, 12);
    }
    if (this.place(GUIDE.x, GUIDE.y - 3, 30) && !this.qfar) glow(ctx, this.qx, this.qy, 16, '#4fd1c5', 0.4, 9);
    SHARDS.forEach((s, i) => {
      if (hasShard(s.id)) return;
      if (this.place(SHARD_SPOTS[i][0], SHARD_SPOTS[i][1] + 1, 30) && !this.qfar) glow(ctx, this.qx, this.qy, 16, '#ffe27a', 0.35, 7 * this.qs);
    });
    // walkway lights ripple towards the stations
    for (const s of c.studs) {
      if (!this.place(s.x, s.y, 6) || this.qfar) continue;
      const on = (((s.i - Math.floor(t * 6)) % 6) + 6) % 6 === 0;
      ctx.fillStyle = on ? '#f2fdff' : '#58b6d6';
      ctx.fillRect(this.qx, this.qy, 1, 1);
      if (on) glow(ctx, this.qx + 0.5, this.qy + 0.5, 7, '#9be7ff', 0.8, 7 * Math.max(0.4, this.qs));
    }

    nearItems.sort((a, b) => a.y - b.y);
    for (const it of nearItems) it.draw();

    // dust and sparks live in world space; some carry a height above the ground
    for (const d of this.dust.list) {
      if (!this.place(d.x, d.y, 10) || this.qfar) continue;
      const k = d.life / d.max;
      if (d.twinkle && ((d.life * 12) | 0) % 2 === 0 && k < 0.6) continue;
      ctx.globalAlpha = k < 0.3 ? k / 0.3 : 1;
      ctx.fillStyle = d.color;
      ctx.fillRect(this.qx, this.qy - d.h, d.size, d.size);
    }
    ctx.globalAlpha = 1;
    // a thin line of light on the limb of the moon
    glow(ctx, G.vw / 2, this.H0 + G.vh * 0.02, G.vw * 0.75, '#aab6ff', 0.22, 9);
    vignette(ctx, G.vw, G.vh, 0.5);
  }
}
