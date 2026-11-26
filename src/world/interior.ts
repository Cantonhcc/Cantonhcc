// Inside a station: a small museum room. Walk up to an exhibit and press E.
import { G, Scene } from '../game';
import { clamp, mix } from '../engine/core';
import { audio } from '../engine/audio';
import { input } from '../engine/input';
import { Particles, drawSparkle } from '../engine/particles';
import { ACCENT, SHARD_COLORS, StationId } from '../art/palette';
import { DOOR_X0, DOOR_X1, ROOM_H, ROOM_W, Slot, WALL_H, makePedestal, paintRoom, slotsFor } from '../art/interior';
import { iconCanvas } from '../art/icons';
import { glow, vignette } from '../art/glow';
import { makeCrate, makePlant } from '../art/sprites';
import { Exhibit, STATIONS, Station } from '../content/stations';
import { isSeen, markSeen, stationDone } from '../progress';
import { ui } from '../ui/hud';
import { openExhibit } from '../ui/panel';
import { Player } from './player';
import { Overworld } from './overworld';

interface Stand { ex: Exhibit; slot: Slot; icon: HTMLCanvasElement; iconDim: HTMLCanvasElement }
interface Prop { x: number; y: number; img: HTMLCanvasElement; w: number }

const rooms: Partial<Record<StationId, HTMLCanvasElement>> = {};

export class Interior implements Scene {
  private station: Station;
  private room: HTMLCanvasElement;
  private stands: Stand[];
  private props: Prop[] = [];
  private pedestal: HTMLCanvasElement;
  private player: Player;
  private dust = new Particles();
  private camX = 0;
  private camY = 0;
  private accent: string;
  private near: Stand | null = null;
  private leaving = false;

  constructor(private id: StationId) {
    this.station = STATIONS.find((s) => s.id === id)!;
    this.accent = ACCENT[id];
    const slots = slotsFor(this.station.exhibits.length);
    if (!rooms[id]) rooms[id] = paintRoom(id, this.station.name, slots);
    this.room = rooms[id]!;
    this.stands = this.station.exhibits.map((ex, i) => ({
      ex, slot: slots[i],
      icon: iconCanvas(ex.icon, mix(this.accent, '#ffffff', 0.35), 2),
      iconDim: iconCanvas(ex.icon, mix(this.accent, '#0e1024', 0.45), 2),
    }));
    this.pedestal = makePedestal(this.accent);
    const plantA = makePlant(1);
    const plantB = makePlant(2);
    const crate = makeCrate(mix(this.accent, '#3f436b', 0.35));
    this.props.push({ x: 20, y: WALL_H + 14, img: plantA, w: 8 });
    this.props.push({ x: ROOM_W - 20, y: WALL_H + 14, img: plantB, w: 8 });
    this.props.push({ x: 24, y: ROOM_H - 14, img: crate, w: 10 });
    this.props.push({ x: ROOM_W - 24, y: ROOM_H - 14, img: crate, w: 10 });
    this.player = new Player(152, ROOM_H - 16);
    this.player.dir = 'up';
    this.snap();
  }

  enter() {
    ui.setLabels([]);
    ui.showHud(true, false);
    ui.banner(this.station.name, this.station.tagline, this.accent);
  }
  leave() {
    ui.setPrompt(null);
    ui.setLabels([]);
  }
  focus() {
    return { x: this.player.x - this.camX, y: this.player.y - 10 - this.camY };
  }

  private solid = (x: number, y: number): boolean => {
    if (x < 9 || x > ROOM_W - 9 || y < WALL_H + 6) return true;
    if (y > ROOM_H - 10) return !(x > DOOR_X0 + 3 && x < DOOR_X1 - 3);
    for (const s of this.stands) {
      if (s.slot.kind === 'pedestal' && Math.abs(x - s.slot.x) < 11 && y > s.slot.y - 8 && y < s.slot.y + 2) return true;
    }
    for (const q of this.props) {
      if (Math.abs(x - q.x) < q.w && y > q.y - 6 && y < q.y + 2) return true;
    }
    return false;
  };

  private target(axis: 'x' | 'y'): number {
    if (axis === 'x') return G.vw >= ROOM_W ? -(G.vw - ROOM_W) / 2 : clamp(this.player.x - G.vw / 2, 0, ROOM_W - G.vw);
    return G.vh >= ROOM_H ? -(G.vh - ROOM_H) / 2 : clamp(this.player.y - 20 - G.vh / 2, 0, ROOM_H - G.vh);
  }
  private snap() {
    this.camX = this.target('x');
    this.camY = this.target('y');
  }

  update(dt: number) {
    const p = this.player;
    const locked = ui.locked() || G.busy;
    p.frozen = locked;
    p.update(dt, this.solid, this.dust);
    this.dust.update(dt);
    const k = 1 - Math.exp(-dt * 9);
    this.camX += (this.target('x') - this.camX) * k;
    this.camY += (this.target('y') - this.camY) * k;

    if (p.y > ROOM_H - 7 && !this.leaving && !G.busy) {
      this.leaving = true;
      audio.sfx('enter');
      G.go(() => new Overworld(this.id));
      return;
    }

    this.near = null;
    let best = 30;
    for (const s of this.stands) {
      const d = Math.hypot(p.x - s.slot.x, p.y - (s.slot.y + (s.slot.kind === 'wall' ? 0 : 8)));
      if (d < best) {
        best = d;
        this.near = s;
      }
    }
    if (this.near) {
      ui.setPrompt(this.near.ex.title);
      if (!locked && input.take('action')) this.open(this.near);
    } else {
      ui.setPrompt(null);
    }
    this.updateLabels();
  }

  private open(s: Stand) {
    audio.sfx('open');
    const sx = s.slot.x - this.camX;
    const sy = (s.slot.kind === 'wall' ? 52 : s.slot.y - 22) - this.camY;
    G.fx.burst(sx, sy, 18, [this.accent, '#ffffff', ...SHARD_COLORS], 70, 0.7);
    openExhibit(this.station, s.ex, () => {
      const completed = markSeen(s.ex.id);
      ui.refresh();
      if (completed) {
        audio.sfx('fanfare');
        G.fx.burst(G.vw / 2, G.vh / 2, 80, [this.accent, '#ffffff', ...SHARD_COLORS], 150, 1.6);
        ui.stampToast(this.station);
      }
    });
  }

  private updateLabels() {
    const done = stationDone(this.station);
    ui.setLabels(this.stands.map((s, i) => ({
      id: 'ex' + i,
      x: s.slot.x - this.camX,
      y: (s.slot.kind === 'wall' ? 36 : s.slot.y - 34) - this.camY,
      text: isSeen(s.ex.id) ? '✓' : '!',
      color: isSeen(s.ex.id) ? '#86efac' : this.accent,
      done: done,
      small: true,
    })));
  }

  draw(ctx: CanvasRenderingContext2D) {
    const cx = G.snap(this.camX);
    const cy = G.snap(this.camY);
    const t = G.time;
    ctx.fillStyle = '#070816';
    ctx.fillRect(0, 0, G.vw, G.vh);
    // a few stars outside the hull
    for (let i = 0; i < 40; i++) {
      const x = (i * 97 + 13) % Math.ceil(G.vw);
      const y = (i * 61 + 29) % Math.ceil(G.vh);
      if ((Math.floor(t * 2) + i) % 9 !== 0) {
        ctx.fillStyle = i % 3 ? '#3a3f6b' : '#6b7196';
        ctx.fillRect(x, y, 1, 1);
      }
    }
    ctx.drawImage(this.room, -cx, -cy);
    // light from the window strip and the exhibits
    glow(ctx, ROOM_W / 2 - cx, 22 - cy, 170, '#6f8cff', 0.22, 46);
    for (const s of this.stands) {
      const gy = s.slot.kind === 'wall' ? 60 : s.slot.y - 18;
      glow(ctx, s.slot.x - cx, gy - cy, 42, this.accent, isSeen(s.ex.id) ? 0.18 : 0.34 + 0.08 * Math.sin(t * 3 + s.slot.x), 34);
    }
    this.player.drawLight(ctx, cx, cy);

    // wall screens
    for (const s of this.stands) {
      if (s.slot.kind !== 'wall') continue;
      const seen = isSeen(s.ex.id);
      const x = s.slot.x - cx;
      const y = 40 - cy;
      const pulse = 0.5 + 0.5 * Math.sin(t * 3 + s.slot.x);
      ctx.fillStyle = mix('#0e1024', this.accent, seen ? 0.12 : 0.18 + pulse * 0.14);
      ctx.fillRect(x - 16, y + 1, 32, 23);
      ctx.drawImage(seen ? s.iconDim : s.icon, x - 9, y + 3);
      // scanline
      const scan = Math.floor((t * 14 + s.slot.x) % 30);
      if (scan < 23) {
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.fillRect(x - 16, y + 1 + scan, 32, 1);
      }
      if (!seen && this.near !== s) drawSparkle(ctx, x + 13, y + 3, pulse > 0.6 ? 2 : 1, '#ffffff');
      if (this.near === s) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(x - 18.5, y - 2.5, 37, 29);
      }
    }

    const items: { y: number; draw: () => void }[] = [];
    for (const s of this.stands) {
      if (s.slot.kind !== 'pedestal') continue;
      items.push({
        y: s.slot.y,
        draw: () => {
          const seen = isSeen(s.ex.id);
          const x = s.slot.x - cx;
          const y = s.slot.y - cy;
          const bob = Math.round(Math.sin(t * 2 + s.slot.x) * 2);
          ctx.drawImage(this.pedestal, x - 11, y - 13);
          // hologram beam
          ctx.fillStyle = this.accent;
          for (let i = 0; i < 12; i++) {
            ctx.globalAlpha = 0.05 + (i % 2) * 0.05;
            ctx.fillRect(x - 6 - Math.floor(i / 3), y - 13 - i * 2, 12 + Math.floor(i / 3) * 2, 2);
          }
          ctx.globalAlpha = seen ? 0.7 : 1;
          ctx.drawImage(seen ? s.iconDim : s.icon, x - 9, y - 38 + bob);
          ctx.globalAlpha = 1;
          if (!seen) drawSparkle(ctx, x + 10, y - 38 + bob, Math.sin(t * 5) > 0 ? 2 : 1, '#ffffff');
          if (this.near === s) drawSparkle(ctx, x, y - 44 + bob, 3, '#ffffff');
        },
      });
    }
    for (const q of this.props) {
      items.push({ y: q.y, draw: () => ctx.drawImage(q.img, Math.round(q.x - q.img.width / 2) - cx, q.y - q.img.height + 2 - cy) });
    }
    items.push({ y: this.player.y, draw: () => this.player.draw(ctx, cx, cy) });
    items.sort((a, b) => a.y - b.y);
    for (const it of items) it.draw();
    this.dust.draw(ctx, cx, cy);
    vignette(ctx, G.vw, G.vh, 0.45);
  }
}
