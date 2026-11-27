// Exhibit films: short looping pixel animations that show an idea instead of
// describing it. Each one is drawn by code on a small canvas, with captions.
import { clamp } from '../engine/core';
import { drawTextCtx, textWidth } from '../art/font';
import { FUND } from '../content/widgets';
import { h } from '../ui/dom';

export type FilmId = 'chain' | 'journey' | 'envelope' | 'furnace' | 'votes' | 'jars' | 'tub';

interface Film {
  title: string;
  length: number;
  captions: [number, string][];
  draw: (g: CanvasRenderingContext2D, t: number, accent: string) => void;
}

const W = 256;
const H = 128;
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a), 0, 1);
const ease = (k: number) => k * k * (3 - 2 * k);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

function label(g: CanvasRenderingContext2D, x: number, y: number, s: string, c: string) {
  drawTextCtx(g, x - textWidth(s) / 2, y, s, c);
}
function box(g: CanvasRenderingContext2D, x: number, y: number, w: number, hh: number, fill: string, border: string) {
  g.fillStyle = border;
  g.fillRect(Math.round(x), Math.round(y), w, hh);
  g.fillStyle = fill;
  g.fillRect(Math.round(x) + 1, Math.round(y) + 1, w - 2, hh - 2);
}
function coin(g: CanvasRenderingContext2D, x: number, y: number, c = '#ffe27a') {
  x = Math.round(x);
  y = Math.round(y);
  g.fillStyle = '#c08a2b';
  g.fillRect(x - 2, y - 1, 5, 3);
  g.fillRect(x - 1, y - 2, 3, 5);
  g.fillStyle = c;
  g.fillRect(x - 1, y - 1, 3, 3);
  g.fillStyle = '#ffffff';
  g.fillRect(x - 1, y - 1, 1, 1);
}
function envelope(g: CanvasRenderingContext2D, x: number, y: number, c: string, locked = true) {
  x = Math.round(x);
  y = Math.round(y);
  box(g, x - 6, y - 4, 13, 9, '#f3ead2', '#15172b');
  g.fillStyle = '#b9ad8c';
  for (let i = 0; i < 5; i++) {
    g.fillRect(x - 5 + i, y - 3 + i, 1, 1);
    g.fillRect(x + 5 - i, y - 3 + i, 1, 1);
  }
  if (locked) {
    g.fillStyle = c;
    g.fillRect(x - 1, y, 3, 3);
    g.fillRect(x, y - 1, 1, 1);
  }
}
function node(g: CanvasRenderingContext2D, x: number, y: number, c: string, lit = true) {
  x = Math.round(x);
  y = Math.round(y);
  box(g, x - 7, y - 6, 15, 13, lit ? '#2a3066' : '#1a1d40', '#15172b');
  g.fillStyle = lit ? c : '#3a3e66';
  g.fillRect(x - 5, y - 4, 11, 2);
  g.fillStyle = lit ? '#e8ecff' : '#3a3e66';
  g.fillRect(x - 5, y - 1, 7, 1);
  g.fillRect(x - 5, y + 1, 9, 1);
  g.fillRect(x - 5, y + 3, 5, 1);
}
function backdrop(g: CanvasRenderingContext2D, t: number) {
  g.fillStyle = '#080a22';
  g.fillRect(0, 0, W, H);
  for (let i = 0; i < 46; i++) {
    const x = (i * 97 + 13) % W;
    const y = (i * 53 + 7) % H;
    if ((Math.floor(t * 2) + i) % 7 === 0) continue;
    g.fillStyle = i % 4 ? '#2c3168' : '#6b73b8';
    g.fillRect(x, y, 1, 1);
  }
}
function ringPos(i: number, n: number, cx: number, cy: number, rx: number, ry: number): [number, number] {
  const a = (i / n) * Math.PI * 2 - Math.PI / 2;
  return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry];
}

const FILMS: Record<FilmId, Film> = {
  chain: {
    title: 'One ledger, or many?',
    length: 16,
    captions: [
      [0, 'A typical blockchain: one transaction is copied to every node.'],
      [4, 'Every node stores everything. Everyone can read it.'],
      [8, 'Canton: each party keeps only its own contracts.'],
      [11.5, 'A synchronizer puts sealed messages in order. It stores nothing.'],
    ],
    draw(g, t, accent) {
      backdrop(g, t);
      const canton = t >= 8;
      const k = canton ? t - 8 : t;
      label(g, W / 2, 6, canton ? 'CANTON' : 'A TYPICAL BLOCKCHAIN', canton ? accent : '#9aa3d4');
      const n = 6;
      const cols = ['#4fd1c5', '#a78bfa', '#fb923c', '#facc15', '#60a5fa', '#f472b6'];
      const pts = Array.from({ length: n }, (_, i) => ringPos(i, n, W / 2, 70, 92, 40));
      if (!canton) {
        const spread = ease(seg(k, 0.8, 3.2));
        for (let i = 1; i < n; i++) {
          g.fillStyle = '#2c3168';
          for (let d = 0; d < 1; d += 0.04) g.fillRect(Math.round(lerp(pts[0][0], pts[i][0], d)), Math.round(lerp(pts[0][1], pts[i][1], d)), 1, 1);
          if (spread > 0 && spread < 1) coin(g, lerp(pts[0][0], pts[i][0], spread), lerp(pts[0][1], pts[i][1], spread));
        }
        pts.forEach(([x, y], i) => {
          node(g, x, y, '#ffe27a', true);
          if (i === 0 ? k > 0.4 : spread >= 1) {
            g.fillStyle = '#ffe27a';
            g.fillRect(Math.round(x) - 5, Math.round(y) + 5, 9, 1);
          }
        });
        if (k > 4) label(g, W / 2, 68, 'SAME DATA EVERYWHERE', '#ffe27a');
      } else {
        // the synchronizer in the middle
        box(g, W / 2 - 15, 61, 31, 19, '#1f2450', accent);
        label(g, W / 2, 64, 'SYNC', accent);
        label(g, W / 2, 72, String(1 + Math.floor(k * 2) % 9).padStart(3, '0'), '#e8ecff');
        const go = ease(seg(k, 1, 2.6));
        const back = ease(seg(k, 3, 4.6));
        pts.forEach(([x, y], i) => {
          const involved = i === 0 || i === 3;
          node(g, x, y, cols[i], involved || k < 0.6);
          if (!involved && k > 4.8) label(g, x, y + 9, 'SEES NOTHING', '#6b73b8');
        });
        if (go > 0 && go < 1) envelope(g, lerp(pts[0][0], W / 2, go), lerp(pts[0][1], 70, go), cols[0]);
        if (back > 0 && back < 1) envelope(g, lerp(W / 2, pts[3][0], back), lerp(70, pts[3][1], back), cols[0]);
        if (back >= 1) {
          g.fillStyle = cols[0];
          g.fillRect(Math.round(pts[3][0]) - 5, Math.round(pts[3][1]) + 5, 9, 1);
          g.fillRect(Math.round(pts[0][0]) - 5, Math.round(pts[0][1]) + 5, 9, 1);
        }
      }
    },
  },

  journey: {
    title: 'The journey of one transaction',
    length: 15,
    captions: [
      [0, '1. Prepare: your validator builds the transaction.'],
      [3, '2. Submit: each part is sealed for the parties who may see it.'],
      [6, '3. Sequence: every message gets a place in one global order.'],
      [9, '4. Confirm: the stakeholders check it and answer yes or no.'],
      [12, '5. Commit: the mediator announces the verdict. Final.'],
    ],
    draw(g, t, accent) {
      backdrop(g, t);
      const stage = Math.min(4, Math.floor(t / 3));
      const names = ['PREPARE', 'SUBMIT', 'SEQUENCE', 'CONFIRM', 'COMMIT'];
      names.forEach((s, i) => {
        const x = 28 + i * 50;
        box(g, x - 22, 4, 45, 11, i === stage ? accent : '#1f2450', i <= stage ? accent : '#3a4078');
        label(g, x, 7, s, i === stage ? '#15172b' : i < stage ? accent : '#6b73b8');
      });
      const k = t - stage * 3;
      const cols = ['#4fd1c5', '#fb923c', '#a78bfa'];
      const y = 72;
      if (stage === 0) {
        node(g, 40, y, accent, true);
        const grow = ease(seg(k, 0.5, 2.2));
        box(g, 100, y - 30, 30, 12, '#2a3066', '#e8ecff');
        label(g, 115, y - 27, 'TRADE', '#e8ecff');
        cols.forEach((c, i) => {
          const bx = 80 + i * 36;
          if (grow > i / 3) {
            g.fillStyle = '#e8ecff';
            g.fillRect(115, y - 18, 1, 8);
            g.fillRect(Math.min(115, bx + 12), y - 10, Math.abs(115 - bx - 12) + 1, 1);
            g.fillRect(bx + 12, y - 10, 1, 6);
            box(g, bx, y - 4, 25, 12, '#2a3066', c);
            label(g, bx + 12, y - 1, ['CASH', 'BOND', 'FEE'][i], c);
          }
        });
      } else if (stage === 1) {
        cols.forEach((c, i) => {
          const bx = 92 + i * 36;
          const lock = seg(k, 0.4 + i * 0.5, 0.9 + i * 0.5);
          if (lock < 1) {
            box(g, bx - 12, y - 4, 25, 12, '#2a3066', c);
          } else envelope(g, bx, y + 2, c);
        });
        if (k > 2.2) label(g, W / 2, y + 22, 'ONLY THE RIGHT NODES CAN OPEN EACH ONE', '#9aa3d4');
      } else if (stage === 2) {
        box(g, W / 2 - 22, y - 16, 45, 36, '#1f2450', accent);
        label(g, W / 2, y - 12, 'SEQUENCER', accent);
        cols.forEach((c, i) => {
          const go = ease(seg(k, 0.2 + i * 0.6, 1.5 + i * 0.6));
          const x = lerp(30, 226, go);
          envelope(g, x, y + 6 + (i - 1) * 2, c);
          if (go > 0.52) label(g, x, y - 6 + (i - 1) * 2, '#' + (41 + i), '#ffe27a');
        });
      } else if (stage === 3) {
        cols.forEach((c, i) => {
          const x = 60 + i * 68;
          node(g, x, y, c, true);
          if (k > 0.6 + i * 0.5) {
            box(g, x - 9, y - 26, 19, 12, '#86efac', '#15172b');
            label(g, x, y - 23, 'YES', '#15172b');
          }
        });
      } else {
        box(g, W / 2 - 26, y - 22, 53, 20, '#1f2450', accent);
        label(g, W / 2, y - 18, 'MEDIATOR', accent);
        label(g, W / 2, y - 10, '3 OF 3 YES', '#86efac');
        const stamp = seg(k, 0.9, 1.3);
        if (stamp > 0) {
          const s = 1 + (1 - stamp) * 1.5;
          g.save();
          g.translate(W / 2, y + 16);
          g.scale(s, s);
          box(g, -34, -8, 69, 17, '#12142a', '#86efac');
          label(g, 0, -3, 'COMMITTED', '#86efac');
          g.restore();
        }
        if (k > 1.8) label(g, W / 2, y + 34, 'NO FORKS. NO ROLLBACKS.', '#9aa3d4');
      }
    },
  },

  envelope: {
    title: 'What the sequencer sees',
    length: 13,
    captions: [
      [0, 'Your trade travels as a sealed envelope.'],
      [3, 'It passes through a sequencer, run by a Super Validator.'],
      [6, 'The scan: the content stays locked.'],
      [9, 'But the envelope is readable: who it goes to, how big, and when.'],
    ],
    draw(g, t, accent) {
      backdrop(g, t);
      // conveyor
      g.fillStyle = '#3a4078';
      g.fillRect(0, 92, W, 6);
      for (let x = -(Math.floor(t * 20) % 12); x < W; x += 12) {
        g.fillStyle = '#5b63b8';
        g.fillRect(x, 93, 6, 1);
      }
      // scanner gate
      box(g, 104, 44, 48, 50, '#1f2450', accent);
      g.fillStyle = '#080a22';
      g.fillRect(110, 62, 36, 30);
      label(g, 128, 48, 'SEQUENCER', accent);
      const x = t < 4.6 ? lerp(-10, 128, ease(seg(t, 0.6, 4.6))) : t < 11.5 ? 128 : lerp(128, 270, ease(seg(t, 11.5, 13)));
      envelope(g, x, 86, '#ffe27a');
      if (t > 5 && t < 11.5) {
        // scan beam
        const beam = 64 + ((t * 30) % 26);
        g.fillStyle = 'rgba(155,231,255,0.5)';
        g.fillRect(110, Math.round(beam), 36, 1);
        // read-out screen
        box(g, 160, 18, 92, 62, '#0e1024', '#e8ecff');
        label(g, 206, 22, 'SCAN RESULT', '#9be7ff');
        drawTextCtx(g, 164, 32, 'CONTENT:', '#9aa3d4');
        if (t > 6.4) {
          g.fillStyle = '#ff8a8a';
          g.fillRect(202, 32, 44, 5);
          drawTextCtx(g, 164, 40, 'LOCKED', '#ff8a8a');
        }
        if (t > 9) {
          drawTextCtx(g, 164, 50, 'TO: 3 NODES', '#86efac');
          if (t > 9.6) drawTextCtx(g, 164, 58, 'SIZE: 17 KB', '#86efac');
          if (t > 10.2) drawTextCtx(g, 164, 66, 'AT: 14:02:11', '#86efac');
        }
      }
      if (t < 3) label(g, 60, 70, 'YOUR TRADE', '#ffe27a');
    },
  },

  furnace: {
    title: 'The burn-mint reactor',
    length: 15,
    captions: [
      [0, 'Using the network costs fees. Fees are paid by burning Canton Coin.'],
      [4, 'Each round, new coins are minted for apps, validators and Super Validators.'],
      [8, 'So far more has been minted than burned.'],
      [11.5, 'Third parties report the ratio climbing from about 0.6 towards 0.8.'],
    ],
    draw(g, t, accent) {
      backdrop(g, t);
      // furnace on the left
      box(g, 18, 46, 60, 58, '#2a3066', '#15172b');
      g.fillStyle = '#12142a';
      g.fillRect(28, 70, 40, 28);
      for (let i = 0; i < 9; i++) {
        const fh = 8 + ((Math.sin(t * 9 + i * 1.7) + 1) * 7);
        g.fillStyle = i % 2 ? '#fb923c' : '#ffd27a';
        g.fillRect(30 + i * 4, Math.round(98 - fh), 4, Math.round(fh));
      }
      label(g, 48, 50, 'BURN', '#fb923c');
      label(g, 48, 58, 'FEES', '#9aa3d4');
      for (let i = 0; i < 5; i++) {
        const k = (t * 0.5 + i / 5) % 1;
        coin(g, lerp(8, 48, k), lerp(14, 72, k * k));
      }
      // mint on the right
      box(g, 178, 46, 60, 26, '#2a3066', '#15172b');
      label(g, 208, 50, 'MINT', accent);
      label(g, 208, 58, 'REWARDS', '#9aa3d4');
      const bins: [string, string, number][] = [['APPS', '#86efac', 62], ['VALID', '#9be7ff', 18], ['SVS', '#ffe27a', 20]];
      const show = t > 4;
      bins.forEach(([name, c, pct], i) => {
        const bx = 160 + i * 32;
        box(g, bx, 90, 28, 22, '#12142a', c);
        const fill = show ? Math.round((pct / 62) * 18 * ease(seg(t, 4, 7.5))) : 0;
        g.fillStyle = c;
        g.fillRect(bx + 1, 111 - fill, 26, fill);
        label(g, bx + 14, 116, name, c);
        if (show) label(g, bx + 14, 82, pct + '%', c);
        if (show) {
          const k = (t * 0.7 + i * 0.33) % 1;
          coin(g, lerp(208, bx + 14, k), lerp(72, 96, k), c);
        }
      });
      // the scale
      const ratio = t < 8 ? 0.6 : lerp(0.6, 0.8, ease(seg(t, 9, 13)));
      const tilt = (1 - ratio) * 14;
      g.fillStyle = '#e8ecff';
      g.fillRect(127, 40, 2, 34);
      g.fillRect(118, 74, 20, 2);
      for (let dx = -26; dx <= 26; dx++) g.fillRect(128 + dx, Math.round(42 - (dx / 26) * tilt), 1, 1);
      box(g, 96, Math.round(44 + tilt) - 1, 14, 6, '#fb923c', '#15172b');
      box(g, 148, Math.round(44 - tilt) - 1, 14, 6, accent, '#15172b');
      if (t > 8) {
        label(g, 128, 18, 'BURNED PER 1 MINTED', '#9aa3d4');
        label(g, 128, 26, ratio.toFixed(2), '#ffe27a');
      }
    },
  },

  votes: {
    title: 'About sixty names, thirteen votes',
    length: 14,
    captions: [
      [0, 'Headlines count about sixty Super Validators.'],
      [3.5, 'The configuration file lists 13 node identities. Most names are hosted on one of them.'],
      [8, 'Votes are one per node. A proposal needs 9 of 13.'],
      [11.5, 'Two organisations run two nodes each: 4 votes, one short of blocking.'],
    ],
    draw(g, t, accent) {
      backdrop(g, t);
      const n = 13;
      const gather = ease(seg(t, 3.5, 6.5));
      const pts = Array.from({ length: n }, (_, i) => ringPos(i, n, W / 2, 66, 88, 44));
      // name tags drifting, then attaching to their host nodes
      for (let i = 0; i < 60; i++) {
        const sx = (i * 73 + 20) % (W - 20) + 10;
        const sy = (i * 41 + 12) % (H - 36) + 14;
        const host = i < 34 ? 0 : i < 44 ? 6 : i < 50 ? 12 : i % n;
        const tx = pts[host][0] + ((i * 7) % 15) - 7;
        const ty = pts[host][1] + ((i * 5) % 11) - 5;
        const x = lerp(sx + Math.sin(t + i) * 3, tx, gather);
        const y = lerp(sy + Math.cos(t * 1.3 + i) * 2, ty, gather);
        g.fillStyle = gather < 1 ? '#6b73b8' : '#3f467f';
        g.fillRect(Math.round(x), Math.round(y), 4, 2);
      }
      if (t < 3.5) label(g, W / 2, 62, '~60 NAMES', '#e8ecff');
      if (t >= 3.5) {
        const yes = t < 8 ? 0 : Math.min(9, Math.floor((t - 8) * 3.2));
        pts.forEach(([x, y], i) => {
          const two = i === 3 || i === 4 || i === 9 || i === 10;
          const on = t >= 11.5 ? two : i < yes;
          box(g, x - 5, y - 5, 11, 11, on ? (t >= 11.5 ? '#ff8a8a' : '#86efac') : '#1f2450', gather >= 1 ? accent : '#3a4078');
        });
        if (t >= 6.5 && t < 8) label(g, W / 2, 62, '13 NODES', accent);
        if (t >= 8 && t < 11.5) {
          label(g, W / 2, 58, yes + ' OF 13', '#e8ecff');
          if (yes >= 9) label(g, W / 2, 68, 'PASSED', '#86efac');
        }
        if (t >= 11.5) {
          label(g, W / 2, 58, '4 OF 13', '#ff8a8a');
          label(g, W / 2, 68, 'BLOCKING NEEDS 5', '#9aa3d4');
        }
      }
    },
  },

  jars: {
    title: 'Where the first payments went',
    length: 13,
    captions: [
      [0, `By August 2026 the Development Fund had paid out ${FUND.paid} million CC.`],
      [3.5, 'We added up the report by recipient.'],
      [7, `${FUND.digitalAsset} million went to Digital Asset. ${FUND.others} million went to the ten other projects.`],
      [10.5, 'Most of it pays for maintaining the core software.'],
    ],
    draw(g, t, accent) {
      backdrop(g, t);
      // the pipe
      box(g, 98, 8, 60, 16, '#2a3066', '#15172b');
      label(g, 128, 11, 'DEV FUND', accent);
      label(g, 128, 18, FUND.paid + 'M CC', '#ffe27a');
      const fill = ease(seg(t, 1.5, 7));
      const share = FUND.digitalAsset / FUND.paid;
      const jar = (x: number, w: number, level: number, name: string, val: string, c: string) => {
        g.fillStyle = '#e8ecff';
        g.fillRect(x, 44, 1, 62);
        g.fillRect(x + w, 44, 1, 62);
        g.fillRect(x, 106, w + 1, 1);
        const hgt = Math.round(60 * level);
        g.fillStyle = c;
        g.fillRect(x + 1, 106 - hgt, w - 1, hgt);
        g.fillStyle = 'rgba(255,255,255,0.35)';
        g.fillRect(x + 1, 106 - hgt, w - 1, 1);
        label(g, x + w / 2, 111, name, '#e8ecff');
        label(g, x + w / 2, 119, val, c);
      };
      jar(40, 70, fill * share, 'DIGITAL ASSET', (FUND.digitalAsset * fill).toFixed(1) + 'M', '#ffe27a');
      jar(160, 56, fill * (1 - share), '10 OTHERS', (FUND.others * fill).toFixed(1) + 'M', '#9be7ff');
      if (fill < 1) {
        for (let i = 0; i < 12; i++) {
          const k = (t * 1.1 + i / 12) % 1;
          const right = i === 0;
          coin(g, lerp(128, right ? 188 : 75, Math.min(1, k * 1.6)), lerp(24, 100 - 58 * fill * (right ? 1 - share : share), k * k), right ? '#9be7ff' : '#ffe27a');
        }
      }
      if (t > 7) {
        label(g, 75, 34, Math.round(share * 1000) / 10 + '%', '#ffe27a');
        label(g, 188, 34, Math.round((1 - share) * 1000) / 10 + '%', '#9be7ff');
      }
    },
  },

  tub: {
    title: 'A river is not a lake',
    length: 13,
    captions: [
      [0, 'Canton says $9 trillion is processed each month.'],
      [3.5, 'That is a flow: mostly repo trades that roll over every day.'],
      [7, 'What stays on the ledger is a stock, and it is far smaller.'],
      [10.5, 'When you see a big number, ask: river or lake?'],
    ],
    draw(g, t, accent) {
      backdrop(g, t);
      // the river
      label(g, 128, 8, 'FLOW: WHAT PASSES THROUGH', '#9be7ff');
      box(g, 6, 20, 244, 30, '#12142a', '#3a4078');
      for (let i = 0; i < 40; i++) {
        const x = ((i * 31 + t * 90) % 250) + 6;
        const y = 24 + ((i * 7) % 22);
        g.fillStyle = i % 3 ? '#3f8fe0' : '#9be7ff';
        g.fillRect(Math.round(x), y, 5, 1);
      }
      if (t > 1) label(g, 128, 32, '$9T A MONTH', '#ffffff');
      // the lake
      if (t > 6.5) {
        label(g, 128, 62, 'STOCK: WHAT STAYS', '#ffe27a');
        box(g, 78, 74, 100, 40, '#12142a', '#e8ecff');
        const level = Math.round(10 * ease(seg(t, 7, 9)));
        g.fillStyle = '#ffe27a';
        g.fillRect(79, 113 - level, 98, level);
        for (let i = 0; i < 6; i++) {
          g.fillStyle = '#fff7c2';
          g.fillRect(84 + i * 16 + Math.round(Math.sin(t * 2 + i) * 2), 113 - level, 6, 1);
        }
        if (t > 9) label(g, 128, 88, 'FAR SMALLER', '#e8ecff');
      } else if (t > 3.5) {
        label(g, 128, 76, 'THE SAME DOLLARS COME BACK', '#9aa3d4');
        label(g, 128, 84, 'DAY AFTER DAY', '#9aa3d4');
      }
      void accent;
    },
  },
};

/** Builds a small cinema: the animation, its captions and simple controls. */
export function mountFilm(id: FilmId, accent: string): HTMLElement {
  const film = FILMS[id];
  const canvas = h('canvas', { class: 'film-screen', width: W * 2, height: H * 2, 'aria-label': film.title }) as HTMLCanvasElement;
  const g = canvas.getContext('2d')!;
  g.imageSmoothingEnabled = false;
  const caption = h('div', { class: 'film-caption', 'aria-live': 'polite' });
  const bar = h('div', { class: 'film-bar' }, h('i', {}));
  const fill = bar.firstChild as HTMLElement;
  const play = h('button', { class: 'pbtn', 'aria-label': 'Pause or play' }, '❚❚');
  const again = h('button', { class: 'pbtn', 'aria-label': 'Play from the start' }, '↺');
  let t = 0;
  let playing = true;
  let last = performance.now();
  let lastCaption = '';
  const frame = (now: number) => {
    if (!canvas.isConnected) return;
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    if (playing) t = (t + dt) % film.length;
    g.setTransform(2, 0, 0, 2, 0, 0);
    film.draw(g, t, accent);
    let text = film.captions[0][1];
    for (const [at, s] of film.captions) if (t >= at) text = s;
    if (text !== lastCaption) {
      lastCaption = text;
      caption.textContent = text;
    }
    fill.style.width = (t / film.length) * 100 + '%';
    requestAnimationFrame(frame);
  };
  play.addEventListener('click', () => {
    playing = !playing;
    play.textContent = playing ? '❚❚' : '▶';
  });
  again.addEventListener('click', () => {
    t = 0;
    playing = true;
    play.textContent = '❚❚';
  });
  bar.addEventListener('click', (e) => {
    const r = bar.getBoundingClientRect();
    t = clamp((e.clientX - r.left) / r.width, 0, 0.999) * film.length;
  });
  const el = h('div', { class: 'film' },
    h('div', { class: 'film-head' }, h('span', { class: 'film-rec' }), 'EXHIBIT FILM · ' + film.title.toUpperCase()),
    canvas, caption,
    h('div', { class: 'film-controls' }, play, again, bar),
  );
  // start once the element is on the page
  requestAnimationFrame(() => requestAnimationFrame(frame));
  return el;
}
