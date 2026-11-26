// Progress lives in the visitor's own browser. Every access is guarded because
// storage can be unavailable (private windows, blocked site data).
const KEY = 'lunar-ledger-save-v1';

export interface SaveData {
  seen: string[];      // exhibit ids opened
  shards: string[];    // shard ids collected
  scores: Record<string, number>; // best mini-game scores
  intro: boolean;      // landing cutscene already watched
  muted: boolean;
  name: string;
}

function blank(): SaveData {
  return { seen: [], shards: [], scores: {}, intro: false, muted: false, name: '' };
}

export const save: SaveData = blank();

export function loadSave() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return;
    const d = JSON.parse(raw);
    Object.assign(save, blank(), d);
  } catch {
    /* play without persistence */
  }
}
export function storeSave() {
  try {
    localStorage.setItem(KEY, JSON.stringify(save));
  } catch {
    /* ignore */
  }
}
export function resetSave() {
  Object.assign(save, blank());
  storeSave();
}
