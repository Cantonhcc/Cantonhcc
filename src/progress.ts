// What the visitor has seen and collected.
import { SHARDS, STATIONS, TOTAL_EXHIBITS, Station } from './content/stations';
import { save, storeSave } from './engine/save';

export function isSeen(id: string): boolean {
  return save.seen.includes(id);
}
export function stationSeen(s: Station): number {
  return s.exhibits.filter((e) => isSeen(e.id)).length;
}
export function stationDone(s: Station): boolean {
  return stationSeen(s) === s.exhibits.length;
}
/** Marks an exhibit as viewed. Returns true if this completed its station. */
export function markSeen(id: string): boolean {
  if (isSeen(id)) return false;
  save.seen.push(id);
  storeSave();
  const st = STATIONS.find((s) => s.exhibits.some((e) => e.id === id));
  return !!st && stationDone(st);
}
export function hasShard(id: string): boolean {
  return save.shards.includes(id);
}
export function takeShard(id: string) {
  if (!hasShard(id)) {
    save.shards.push(id);
    storeSave();
  }
}
export function setScore(key: string, value: number) {
  if ((save.scores[key] ?? -1) < value) {
    save.scores[key] = value;
    storeSave();
  }
}
export function totals() {
  const seen = save.seen.length;
  const stations = STATIONS.filter(stationDone).length;
  const shards = save.shards.length;
  const pct = Math.round(((seen / TOTAL_EXHIBITS) * 0.8 + (shards / SHARDS.length) * 0.2) * 100);
  return { seen, exhibits: TOTAL_EXHIBITS, stations, stationCount: STATIONS.length, shards, shardCount: SHARDS.length, pct };
}
export function rank(): string {
  const t = totals();
  if (t.stations === t.stationCount && t.shards === t.shardCount) return 'Lunar Ledger Laureate';
  if (t.stations === t.stationCount) return 'Senior Field Researcher';
  if (t.stations >= 5) return 'Field Researcher';
  if (t.stations >= 2) return 'Junior Analyst';
  return 'Cadet';
}
