// Where everything sits on the lunar surface.
import type { StationId } from '../art/palette';

export const MAP_W = 1280;
export const MAP_H = 900;
export const SKY = 118;

/** The ridge line that separates the walkable surface from the sky. */
export function ridgeY(x: number): number {
  return SKY + Math.round(Math.sin(x * 0.013) * 7 + Math.sin(x * 0.041 + 2) * 4 + Math.sin(x * 0.09 + 5) * 2);
}

/** Door positions (the point on the ground in front of each building). */
export const DOORS: Record<StationId, { x: number; y: number }> = {
  welcome: { x: 640, y: 560 },
  ring: { x: 640, y: 330 },
  privacy: { x: 300, y: 430 },
  reactor: { x: 980, y: 430 },
  arcade: { x: 240, y: 700 },
  harbor: { x: 1040, y: 700 },
  archive: { x: 170, y: 250 },
  library: { x: 1110, y: 262 },
};

export const LANDING = { x: 640, y: 770 };
export const LANDER = { x: 596, y: 752 };
export const GUIDE = { x: 684, y: 752 };

/** Lit footpaths between stations. */
export const PATHS: [number, number][][] = [
  [[640, 760], [640, 600], [640, 568]],
  [[640, 610], [470, 520], [300, 440]],
  [[640, 610], [810, 520], [980, 440]],
  [[600, 606], [548, 560], [548, 440], [640, 392], [640, 338]],
  [[640, 756], [440, 744], [240, 708]],
  [[640, 756], [840, 744], [1040, 708]],
  [[300, 440], [215, 350], [170, 258]],
  [[980, 440], [1060, 350], [1110, 270]],
];

export const SHARD_SPOTS: [number, number][] = [
  [420, 650], [860, 650], [110, 560], [1180, 560], [450, 320], [830, 320], [640, 200], [360, 210],
  [940, 180], [80, 400], [1200, 420], [140, 830], [1140, 840], [640, 856], [430, 840], [880, 846],
];

export function distToSegment(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
  const dx = bx - ax;
  const dy = by - ay;
  const len = dx * dx + dy * dy || 1;
  let t = ((px - ax) * dx + (py - ay) * dy) / len;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  return Math.hypot(px - (ax + dx * t), py - (ay + dy * t));
}
export function distToPaths(x: number, y: number): number {
  let best = 1e9;
  for (const path of PATHS) {
    for (let i = 0; i < path.length - 1; i++) {
      const d = distToSegment(x, y, path[i][0], path[i][1], path[i + 1][0], path[i + 1][1]);
      if (d < best) best = d;
    }
  }
  return best;
}

/** Nearest point on any path: distance to it and how far along that path it lies. */
export function nearestOnPaths(x: number, y: number): { d: number; t: number } {
  let best = 1e9;
  let bt = 0;
  for (const path of PATHS) {
    let acc = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const [ax, ay] = path[i];
      const [bx, by] = path[i + 1];
      const dx = bx - ax;
      const dy = by - ay;
      const len2 = dx * dx + dy * dy || 1;
      let k = ((x - ax) * dx + (y - ay) * dy) / len2;
      k = k < 0 ? 0 : k > 1 ? 1 : k;
      const d = Math.hypot(x - (ax + dx * k), y - (ay + dy * k));
      const len = Math.sqrt(len2);
      if (d < best) {
        best = d;
        bt = acc + k * len;
      }
      acc += len;
    }
  }
  return { d: best, t: bt };
}
