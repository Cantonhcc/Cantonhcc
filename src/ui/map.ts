// The travel map: the whole base at a glance. Click a station to go there.
import { ACCENT, StationId } from '../art/palette';
import { STATIONS } from '../content/stations';
import { stationDone, stationSeen } from '../progress';
import { DOORS, MAP_H, MAP_W } from '../world/layout';
import { h } from './dom';
import { openPanel } from './panel';

export function openMap(ground: HTMLCanvasElement, player: { x: number; y: number } | null, travel: (id: StationId) => void) {
  const wrap = h('div', { class: 'bigmap' });
  const canvas = h('canvas', { width: 640, height: Math.round((640 * MAP_H) / MAP_W), 'aria-hidden': 'true' }) as HTMLCanvasElement;
  const g = canvas.getContext('2d')!;
  g.imageSmoothingEnabled = true;
  g.drawImage(ground, 0, 0, canvas.width, canvas.height);
  g.fillStyle = 'rgba(8,10,44,0.22)';
  g.fillRect(0, 0, canvas.width, canvas.height);
  wrap.append(canvas);
  let go: ((id: StationId) => void) | null = null;
  for (const s of STATIONS) {
    const d = DOORS[s.id];
    const done = stationDone(s);
    const pin = h('button', { class: 'pin' + (done ? ' done' : ''), title: `Travel to ${s.name}` },
      h('i', {}), h('span', {}, s.name), h('small', {}, done ? 'stamped' : `${stationSeen(s)}/${s.exhibits.length}`));
    pin.style.left = (d.x / MAP_W) * 100 + '%';
    pin.style.top = ((d.y - 30) / MAP_H) * 100 + '%';
    pin.style.setProperty('--c', ACCENT[s.id]);
    pin.addEventListener('click', () => go?.(s.id));
    wrap.append(pin);
  }
  if (player) {
    const you = h('div', { class: 'you' }, 'YOU');
    you.style.left = (player.x / MAP_W) * 100 + '%';
    you.style.top = (player.y / MAP_H) * 100 + '%';
    wrap.append(you);
  }
  const body = h('div', {},
    h('p', {}, 'Click a station to travel there. Golden sparkles on the surface are starlight shards, and they are not marked here: finding them is your job.'),
    wrap);
  let chosen: StationId | null = null;
  openPanel({
    kicker: 'LUNAR LEDGER BASE', title: 'Map', accent: '#9be7ff', icon: 'globe', body, wide: true,
    onClose: () => { if (chosen) travel(chosen); },
  });
  go = (id) => {
    chosen = id;
    (document.querySelector('.panel .close') as HTMLElement)?.click();
  };
}
