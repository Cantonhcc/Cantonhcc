// Heads-up display, floating labels, prompts, toasts, the dialogue box and
// the title screen controls. All of it is ordinary HTML laid over the canvas,
// so text stays sharp and links stay clickable.
import { G } from '../game';
import { audio } from '../engine/audio';
import { input } from '../engine/input';
import type { Shard, Station } from '../content/stations';
import { stationDone, totals } from '../progress';
import { ACCENT } from '../art/palette';
import { STATIONS } from '../content/stations';
import { DOORS } from '../world/layout';
import { $, esc, h } from './dom';

export interface Label { id: string; x: number; y: number; text: string; sub?: string; color: string; done?: boolean; small?: boolean }

class Ui {
  private labelEls = new Map<string, HTMLElement>();
  private lockUntil = 0;
  private dialogLines: string[] = [];
  private dialogIndex = 0;
  private dialogChars = 0;
  private dialogTimer = 0;
  private dialogDone: (() => void) | null = null;
  private bannerTimer = 0;
  panelOpen = false;
  dialogOpen = false;
  onJournal: () => void = () => {};
  onMap: () => void = () => {};
  onRide: () => void = () => {};
  private outdoor = false;

  init() {
    $('btn-journal').addEventListener('click', () => this.onJournal());
    $('btn-map').addEventListener('click', () => this.onMap());
    $('minimap').addEventListener('click', () => this.onMap());
    $('btn-ride').addEventListener('click', () => this.onRide());
    $('t-ride').addEventListener('pointerdown', (e) => { e.preventDefault(); this.onRide(); });
    $('btn-sound').addEventListener('click', () => {
      audio.start();
      audio.toggleMute();
      this.refresh();
    });
    const dlg = $('dialog');
    dlg.addEventListener('click', () => this.advanceDialog());
    window.addEventListener('keydown', (e) => {
      if (this.dialogOpen && ['Space', 'Enter', 'KeyE'].includes(e.code)) {
        e.preventDefault();
        this.advanceDialog();
      }
    });
    this.initTouch();
  }

  /** True while the game should ignore the action key (a box is open, or was a moment ago). */
  locked(): boolean {
    return this.panelOpen || this.dialogOpen || performance.now() < this.lockUntil;
  }
  cooldown(ms = 250) {
    this.lockUntil = performance.now() + ms;
  }

  showHud(on: boolean, outdoor = false) {
    this.outdoor = outdoor;
    $('hud').hidden = !on;
    $('minimap-wrap').hidden = !on || !outdoor;
    $('btn-ride').hidden = !outdoor;
    $('btn-map').hidden = !outdoor;
    $('t-ride').hidden = !outdoor;
    if (on && input.usedTouch) $('touch').hidden = false;
  }
  setRiding(on: boolean) {
    $('btn-ride').classList.toggle('on', on);
    $('t-ride').classList.toggle('on', on);
  }
  /** Redraws the corner mini-map: the surface, the stations and a blinking dot for the player. */
  drawMinimap(ground: HTMLCanvasElement, px: number, py: number) {
    const c = $('minimap') as HTMLCanvasElement;
    const g = c.getContext('2d')!;
    const w = c.width;
    const hgt = c.height;
    g.imageSmoothingEnabled = true;
    g.drawImage(ground, 0, 0, w, hgt);
    g.fillStyle = 'rgba(8,10,44,0.25)';
    g.fillRect(0, 0, w, hgt);
    const k = w / ground.width;
    for (const s of STATIONS) {
      const d = DOORS[s.id];
      const x = Math.round(d.x * k);
      const y = Math.round((d.y - 14) * k);
      g.fillStyle = '#15172b';
      g.fillRect(x - 4, y - 4, 9, 9);
      g.fillStyle = ACCENT[s.id];
      g.fillRect(x - 3, y - 3, 7, 7);
      if (stationDone(s)) {
        g.fillStyle = '#15172b';
        g.fillRect(x - 1, y - 1, 3, 3);
      }
    }
    const blink = Math.floor(performance.now() / 300) % 2 === 0;
    const x = Math.round(px * k);
    const y = Math.round(py * k);
    g.fillStyle = '#15172b';
    g.fillRect(x - 4, y - 4, 9, 9);
    g.fillStyle = blink ? '#ffffff' : '#ff6b6b';
    g.fillRect(x - 3, y - 3, 7, 7);
  }
  showTitle(on: boolean) {
    $('title').hidden = !on;
  }

  refresh() {
    const t = totals();
    $('chip-stamps').querySelector('b')!.textContent = `${t.stations}/${t.stationCount}`;
    $('chip-shards').querySelector('b')!.textContent = `${t.shards}/${t.shardCount}`;
    $('btn-sound').classList.toggle('off', audio.muted);
    $('btn-sound').setAttribute('aria-pressed', String(!audio.muted));
  }

  setLabels(labels: Label[]) {
    const root = $('labels');
    const keep = new Set<string>();
    for (const l of labels) {
      keep.add(l.id);
      let el = this.labelEls.get(l.id);
      if (!el) {
        el = h('div', { class: 'label' });
        root.append(el);
        this.labelEls.set(l.id, el);
      }
      const key = `${l.text}|${l.sub ?? ''}|${l.color}|${l.done}|${l.small}`;
      if (el.dataset.key !== key) {
        el.dataset.key = key;
        el.className = 'label' + (l.small ? ' small' : '') + (l.done ? ' done' : '');
        el.style.setProperty('--c', l.color);
        el.innerHTML = `<span class="label-text">${esc(l.text)}</span>` + (l.sub ? `<span class="label-sub">${esc(l.sub)}</span>` : '');
      }
      el.style.transform = `translate(${Math.round(l.x * G.zoom)}px, ${Math.round(l.y * G.zoom)}px) translate(-50%, -100%)`;
    }
    for (const [id, el] of this.labelEls) {
      if (!keep.has(id)) {
        el.remove();
        this.labelEls.delete(id);
      }
    }
  }

  private promptText: string | null = null;
  setPrompt(text: string | null) {
    if (this.locked()) text = null;
    if (text === this.promptText) return;
    this.promptText = text;
    const el = $('prompt');
    el.hidden = !text;
    if (text) el.innerHTML = `<kbd>${input.usedTouch ? 'A' : 'E'}</kbd> ${esc(text)}`;
  }

  toast(html: string, ms = 6500, cls = '') {
    const el = h('div', { class: 'toast ' + cls, html, role: 'status' });
    $('toasts').append(el);
    const close = () => {
      el.classList.add('out');
      setTimeout(() => el.remove(), 350);
    };
    el.addEventListener('click', (e) => {
      if (!(e.target as HTMLElement).closest('a')) close();
    });
    setTimeout(close, ms);
  }
  shardToast(s: Shard) {
    const t = totals();
    this.toast(
      `<div class="toast-kicker">✦ STARLIGHT SHARD ${t.shards}/${t.shardCount}</div><div>${esc(s.text)}</div>` +
      `<a class="src" href="${s.source.url}" target="_blank" rel="noopener">${esc(s.source.label)}</a>`, 9000, 'shard');
  }
  stampToast(st: Station) {
    const t = totals();
    this.toast(
      `<div class="toast-kicker">▣ STATION STAMPED ${t.stations}/${t.stationCount}</div><div>${esc(st.name)} complete.</div>` +
      (t.stations === t.stationCount ? '<div>All stations stamped. Your certificate is in the Library.</div>' : ''), 7000, 'stamp');
  }

  banner(title: string, sub: string, color: string) {
    const el = $('banner');
    el.style.setProperty('--c', color);
    el.innerHTML = `<div class="banner-title">${esc(title)}</div><div class="banner-sub">${esc(sub)}</div>`;
    el.hidden = false;
    el.classList.remove('show');
    void el.offsetWidth;
    el.classList.add('show');
    clearTimeout(this.bannerTimer);
    this.bannerTimer = window.setTimeout(() => (el.hidden = true), 3600);
  }

  dialog(speaker: string, lines: string[], done?: () => void) {
    this.dialogLines = lines;
    this.dialogIndex = 0;
    this.dialogDone = done ?? null;
    this.dialogOpen = true;
    this.setPrompt(null);
    $('dialog').hidden = false;
    $('dialog-name').textContent = speaker;
    this.typeLine();
  }
  private typeLine() {
    const line = this.dialogLines[this.dialogIndex];
    const body = $('dialog-text');
    this.dialogChars = 0;
    clearInterval(this.dialogTimer);
    body.textContent = '';
    this.dialogTimer = window.setInterval(() => {
      this.dialogChars += 2;
      body.textContent = line.slice(0, this.dialogChars);
      if (this.dialogChars % 6 === 0) audio.sfx('blip');
      if (this.dialogChars >= line.length) clearInterval(this.dialogTimer);
    }, 24);
  }
  private advanceDialog() {
    if (!this.dialogOpen) return;
    const line = this.dialogLines[this.dialogIndex];
    if (this.dialogChars < line.length) {
      clearInterval(this.dialogTimer);
      this.dialogChars = line.length;
      $('dialog-text').textContent = line;
      return;
    }
    this.dialogIndex++;
    if (this.dialogIndex >= this.dialogLines.length) {
      this.dialogOpen = false;
      $('dialog').hidden = true;
      this.cooldown();
      const d = this.dialogDone;
      this.dialogDone = null;
      d?.();
    } else {
      this.typeLine();
    }
  }

  private initTouch() {
    const stick = $('stick');
    const knob = $('knob');
    let id: number | null = null;
    const set = (e: PointerEvent) => {
      const r = stick.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      let dx = (e.clientX - cx) / (r.width / 2);
      let dy = (e.clientY - cy) / (r.height / 2);
      const m = Math.hypot(dx, dy);
      if (m > 1) {
        dx /= m;
        dy /= m;
      }
      input.stick.x = Math.abs(dx) < 0.18 ? 0 : dx;
      input.stick.y = Math.abs(dy) < 0.18 ? 0 : dy;
      knob.style.transform = `translate(${dx * 28}px, ${dy * 28}px)`;
    };
    const end = () => {
      id = null;
      input.stick.x = 0;
      input.stick.y = 0;
      knob.style.transform = '';
    };
    stick.addEventListener('pointerdown', (e) => {
      id = e.pointerId;
      stick.setPointerCapture(e.pointerId);
      set(e);
    });
    stick.addEventListener('pointermove', (e) => {
      if (e.pointerId === id) set(e);
    });
    stick.addEventListener('pointerup', end);
    stick.addEventListener('pointercancel', end);
    $('t-act').addEventListener('pointerdown', (e) => {
      e.preventDefault();
      if (this.dialogOpen) this.advanceDialog();
      else input.press('action');
    });
    window.addEventListener('touchstart', () => {
      if (!input.usedTouch) {
        input.usedTouch = true;
        if (!$('hud').hidden) $('touch').hidden = false;
      }
    }, { passive: true });
  }
}

export const ui = new Ui();
