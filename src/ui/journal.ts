// The journal: progress by station, collected shard facts and a small map.
import { ACCENT } from '../art/palette';
import { SHARDS, STATIONS } from '../content/stations';
import { resetSave } from '../engine/save';
import { hasShard, isSeen, rank, stationDone, totals } from '../progress';
import { DOORS, MAP_H, MAP_W } from '../world/layout';
import { h } from './dom';
import { ui } from './hud';
import { openPanel, sourceList } from './panel';

export function openJournal(mapSource: HTMLCanvasElement | null, player: { x: number; y: number } | null) {
  const t = totals();
  const body = h('div', { class: 'journal' });
  body.append(h('div', { class: 'stats' },
    h('div', { class: 'stat' }, h('b', {}, `${t.stations}/${t.stationCount}`), h('span', {}, 'stations stamped')),
    h('div', { class: 'stat' }, h('b', {}, `${t.seen}/${t.exhibits}`), h('span', {}, 'exhibits read')),
    h('div', { class: 'stat' }, h('b', {}, `${t.shards}/${t.shardCount}`), h('span', {}, 'starlight shards')),
    h('div', { class: 'stat' }, h('b', {}, rank()), h('span', {}, 'current rank')),
  ));

  if (mapSource) {
    const mw = 320;
    const mh = Math.round((mw * MAP_H) / MAP_W);
    const map = h('canvas', { class: 'minimap', width: mw, height: mh, 'aria-label': 'Map of the base' }) as HTMLCanvasElement;
    const g = map.getContext('2d')!;
    g.imageSmoothingEnabled = false;
    g.drawImage(mapSource, 0, 0, mw, mh);
    const k = mw / MAP_W;
    for (const s of STATIONS) {
      const d = DOORS[s.id];
      g.fillStyle = '#15172b';
      g.fillRect(Math.round(d.x * k) - 4, Math.round(d.y * k) - 9, 9, 9);
      g.fillStyle = stationDone(s) ? ACCENT[s.id] : '#e8ecff';
      g.fillRect(Math.round(d.x * k) - 3, Math.round(d.y * k) - 8, 7, 7);
      if (!stationDone(s)) {
        g.fillStyle = ACCENT[s.id];
        g.fillRect(Math.round(d.x * k) - 1, Math.round(d.y * k) - 6, 3, 3);
      }
    }
    if (player) {
      g.fillStyle = '#ff6b6b';
      g.fillRect(Math.round(player.x * k) - 2, Math.round(player.y * k) - 2, 5, 5);
      g.fillStyle = '#ffffff';
      g.fillRect(Math.round(player.x * k) - 1, Math.round(player.y * k) - 1, 3, 3);
    }
    body.append(h('div', { class: 'sources-head' }, 'Map'), map,
      h('div', { class: 'legend' }, h('span', {}, h('i', { class: 'sw you' }), 'you'), h('span', {}, h('i', { class: 'sw stn' }), 'station (coloured when stamped)')));
  }

  body.append(h('div', { class: 'sources-head' }, 'Stations'));
  const list = h('div', { class: 'jstations' });
  for (const s of STATIONS) {
    const seen = s.exhibits.filter((e) => isSeen(e.id)).length;
    const row = h('div', { class: 'jstation' + (stationDone(s) ? ' done' : '') },
      h('div', { class: 'jname' }, s.name, h('span', { class: 'dim' }, ` ${seen}/${s.exhibits.length}`)),
      h('div', { class: 'jtag dim' }, s.tagline),
      h('div', { class: 'jdots' }, ...s.exhibits.map((e) => h('i', { class: isSeen(e.id) ? 'on' : '', title: e.title }))),
    );
    row.style.setProperty('--accent', ACCENT[s.id]);
    list.append(row);
  }
  body.append(list);

  body.append(h('div', { class: 'sources-head' }, `Starlight shards (${t.shards}/${t.shardCount})`));
  const found = SHARDS.filter((s) => hasShard(s.id));
  if (!found.length) body.append(h('p', { class: 'note' }, 'None yet. Look for golden sparkles out on the surface, away from the paths.'));
  for (const s of found) body.append(h('div', { class: 'jshard' }, h('p', {}, '✦ ' + s.text), sourceList([s.source])));

  body.append(h('div', { class: 'sources-head' }, 'Controls'),
    h('p', { class: 'note' }, 'Move: arrow keys or WASD. Moonboard: R. Map and travel: M. Interact: E, Space or Enter. Journal: J. Thruster: hold Shift. On a phone, use the stick and the buttons.'));

  const reset = h('button', { class: 'pbtn danger' }, 'Erase progress and restart');
  reset.addEventListener('click', () => {
    if (confirm('Erase all progress on this device and start again?')) {
      resetSave();
      location.reload();
    }
  });
  body.append(h('div', { class: 'row' }, reset));

  openPanel({ kicker: 'FIELD JOURNAL', title: 'Your research so far', accent: '#9be7ff', icon: 'book', body, wide: true });
  ui.refresh();
}
