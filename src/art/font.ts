// A 3x5 pixel font for signs painted onto buildings and props.
import { Px } from '../engine/px';

const G: Record<string, string> = {
  A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110',
  E: '111100110100111', F: '111100110100100', G: '011100101101011', H: '101101111101101',
  I: '111010010010111', J: '001001001101010', K: '101101110101101', L: '100100100100111',
  M: '101111111101101', N: '110101101101101', O: '010101101101010', P: '110101110100100',
  Q: '010101101110011', R: '110101110101101', S: '011100010001110', T: '111010010010010',
  U: '101101101101111', V: '101101101101010', W: '101101111111101', X: '101101010101101',
  Y: '101101010010010', Z: '111001010100111',
  '0': '111101101101111', '1': '010110010010111', '2': '110001010100111', '3': '111001011001111',
  '4': '101101111001001', '5': '111100110001110', '6': '011100110101010', '7': '111001010010010',
  '8': '010101010101010', '9': '010101011001110',
  '?': '110001010000010', '!': '010010010000010', '-': '000000111000000', '.': '000000000000010',
  '#': '101111101111101', ',': '000000000010100', '=': '000111000111000', ':': '000010000010000', '/': '001001010100100', '%': '101001010100101', '$': '011110010011110', '+': '000010111010000',
  ' ': '000000000000000',
};

export function textWidth(s: string): number {
  return s.length * 4 - 1;
}
export function drawText(p: Px, x: number, y: number, s: string, color: string) {
  let cx = x;
  for (const ch of s.toUpperCase()) {
    const g = G[ch] ?? G['?'];
    for (let i = 0; i < 15; i++) {
      if (g[i] === '1') p.px(cx + (i % 3), y + ((i / 3) | 0), color);
    }
    cx += 4;
  }
}

/** Same font, drawn straight onto a 2D context (used by the exhibit films). */
export function drawTextCtx(g: CanvasRenderingContext2D, x: number, y: number, s: string, color: string) {
  g.fillStyle = color;
  let cx = Math.round(x);
  for (const ch of s.toUpperCase()) {
    if (ch === '%') {
      // a percent sign needs five columns to read clearly
      const rows = ['11001', '11010', '00100', '01011', '10011'];
      rows.forEach((r, j) => { for (let i = 0; i < 5; i++) if (r[i] === '1') g.fillRect(cx + i, Math.round(y) + j, 1, 1); });
      cx += 6;
      continue;
    }
    const gl = G[ch] ?? G['?'];
    for (let i = 0; i < 15; i++) if (gl[i] === '1') g.fillRect(cx + (i % 3), Math.round(y) + ((i / 3) | 0), 1, 1);
    cx += 4;
  }
}
