// The researcher certificate: a pixel card drawn on a canvas that the visitor
// can save as an image.
import { save, storeSave } from '../engine/save';
import { rng } from '../engine/core';
import { drawSparkle } from '../engine/particles';
import { STAR_COLORS } from '../art/palette';
import { STATIONS } from '../content/stations';
import { QUIZ, HEADLINES } from '../content/widgets';
import { rank, stationDone, totals } from '../progress';
import { h } from '../ui/dom';

const CW = 320;
const CH = 200;

function draw(canvas: HTMLCanvasElement, name: string) {
  const g = canvas.getContext('2d')!;
  const S = 3; // output scale
  canvas.width = CW * S;
  canvas.height = CH * S;
  g.imageSmoothingEnabled = false;
  // a hair of letter spacing stops the browser from joining "fi" into a ligature
  if ('letterSpacing' in g) (g as any).letterSpacing = '0.01px';
  g.save();
  g.scale(S, S);
  g.fillStyle = '#0b0d22';
  g.fillRect(0, 0, CW, CH);
  const r = rng(7);
  for (let i = 0; i < 150; i++) {
    g.globalAlpha = 0.3 + r() * 0.7;
    g.fillStyle = STAR_COLORS[(r() * STAR_COLORS.length) | 0];
    g.fillRect((r() * CW) | 0, (r() * CH) | 0, 1, 1);
  }
  g.globalAlpha = 1;
  // moon horizon
  for (let x = 0; x < CW; x++) {
    const yy = CH - 26 - Math.round(Math.sin(x * 0.02) * 4 + Math.sin(x * 0.07) * 2);
    g.fillStyle = '#565c85';
    g.fillRect(x, yy, 1, CH - yy);
    g.fillStyle = '#8c93bb';
    g.fillRect(x, yy, 1, 1);
  }
  // frame
  g.fillStyle = '#e8ecff';
  g.fillRect(6, 6, CW - 12, 2);
  g.fillRect(6, CH - 8, CW - 12, 2);
  g.fillRect(6, 6, 2, CH - 12);
  g.fillRect(CW - 8, 6, 2, CH - 12);
  g.fillStyle = '#facc15';
  for (const [x, y] of [[6, 6], [CW - 10, 6], [6, CH - 10], [CW - 10, CH - 10]]) g.fillRect(x, y, 4, 4);
  drawSparkle(g, 30, 30, 5, '#ffe27a');
  drawSparkle(g, CW - 30, 30, 5, '#9be7ff');

  const t = totals();
  g.textAlign = 'center';
  g.fillStyle = '#9be7ff';
  g.font = '8px "Press Start 2P", monospace';
  g.fillText('LUNAR LEDGER', CW / 2, 30);
  g.fillStyle = '#9aa3d4';
  g.font = '14px "VT323", monospace';
  g.fillText('an unofficial field trip through the Canton Network', CW / 2, 44);
  g.fillStyle = '#e8ecff';
  g.font = '16px "VT323", monospace';
  g.fillText('This certifies that', CW / 2, 66);
  g.fillStyle = '#ffe27a';
  g.font = '10px "Press Start 2P", monospace';
  g.fillText((name || 'Anonymous Researcher').slice(0, 24), CW / 2, 84);
  g.fillStyle = '#e8ecff';
  g.font = '16px "VT323", monospace';
  g.fillText('has explored the base and earned the rank of', CW / 2, 102);
  g.fillStyle = '#86efac';
  g.font = '8px "Press Start 2P", monospace';
  g.fillText(rank().toUpperCase(), CW / 2, 118);

  // station stamps
  const n = STATIONS.length;
  const gap = 30;
  const x0 = CW / 2 - ((n - 1) * gap) / 2;
  STATIONS.forEach((s, i) => {
    const x = Math.round(x0 + i * gap);
    const done = stationDone(s);
    g.fillStyle = done ? '#facc15' : '#3a3e66';
    g.fillRect(x - 8, 128, 16, 16);
    g.fillStyle = '#0b0d22';
    g.fillRect(x - 6, 130, 12, 12);
    if (done) drawSparkle(g, x, 136, 4, '#facc15');
  });
  g.fillStyle = '#e8ecff';
  g.font = '15px "VT323", monospace';
  const quiz = save.scores.quiz !== undefined ? `${save.scores.quiz}/${QUIZ.length}` : 'not played';
  const lad = save.scores.ladder !== undefined ? `${save.scores.ladder}/${HEADLINES.length}` : 'not played';
  g.fillText(`Stations ${t.stations}/${t.stationCount}   Exhibits ${t.seen}/${t.exhibits}   Shards ${t.shards}/${t.shardCount}`, CW / 2, 160);
  g.fillText(`Myth Arcade ${quiz}   Headline Harbor ${lad}`, CW / 2, 172);
  g.fillStyle = '#15172b';
  g.font = '13px "VT323", monospace';
  g.fillText(new Date().toISOString().slice(0, 10) + '  ·  independent community research, not affiliated with the Canton Foundation', CW / 2, CH - 12);
  g.restore();
}

export function mountCertificate(el: HTMLElement) {
  const canvas = h('canvas', { class: 'cert', 'aria-label': 'Researcher certificate' }) as HTMLCanvasElement;
  const input = h('input', { type: 'text', maxlength: 24, placeholder: 'Your name or handle', value: save.name, 'aria-label': 'Name on the certificate' }) as HTMLInputElement;
  const render = () => draw(canvas, input.value.trim());
  input.addEventListener('input', () => {
    save.name = input.value.trim();
    storeSave();
    render();
  });
  const dl = h('button', { class: 'pbtn primary' }, 'Save as image');
  dl.addEventListener('click', () => {
    canvas.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'lunar-ledger-certificate.png';
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    });
  });
  const t = totals();
  const text = `I explored Lunar Ledger, a pixel field trip through the Canton Network, and reached the rank of ${rank()} (${t.stations}/${t.stationCount} stations, ${t.shards}/${t.shardCount} shards).`;
  const share = h('a', {
    class: 'pbtn', target: '_blank', rel: 'noopener',
    href: 'https://x.com/intent/post?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(location.origin + location.pathname),
  }, 'Share on X');
  el.append(h('div', { class: 'row wrap' }, input, dl, share), canvas);
  if (document.fonts?.ready) document.fonts.ready.then(render);
  render();
}
