// All sound is synthesised in the browser with WebAudio: no audio files.
import { save, storeSave } from './save';

type Sfx = 'blip' | 'open' | 'close' | 'collect' | 'enter' | 'stamp' | 'right' | 'wrong' | 'step' | 'boost' | 'fanfare';

const PENTA = [220, 261.63, 293.66, 329.63, 392, 440, 523.25, 587.33, 659.25, 783.99];
const CHORDS = [
  [110, 164.81, 220, 261.63],   // A minor
  [87.31, 130.81, 174.61, 220], // F major
  [130.81, 196, 261.63, 329.63],// C major
  [98, 146.83, 196, 246.94],    // G major
];

class Audio {
  ctx: AudioContext | null = null;
  private master!: GainNode;
  private musicGain!: GainNode;
  private delay!: DelayNode;
  private timer = 0;
  private chord = 0;
  started = false;

  /** Must be called from a user gesture (browsers block audio otherwise). */
  start() {
    if (this.started) {
      this.ctx?.resume();
      return;
    }
    try {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AC();
    } catch {
      return;
    }
    const ctx = this.ctx!;
    this.master = ctx.createGain();
    this.master.gain.value = save.muted ? 0 : 0.6;
    this.master.connect(ctx.destination);
    this.musicGain = ctx.createGain();
    this.musicGain.gain.value = 0.5;
    this.delay = ctx.createDelay(1.5);
    this.delay.delayTime.value = 0.42;
    const fb = ctx.createGain();
    fb.gain.value = 0.38;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 1800;
    this.delay.connect(lp);
    lp.connect(fb);
    fb.connect(this.delay);
    this.delay.connect(this.musicGain);
    this.musicGain.connect(this.master);
    this.started = true;
    this.schedule();
    this.timer = window.setInterval(() => this.schedule(), 4000);
  }

  get muted() {
    return save.muted;
  }
  toggleMute() {
    save.muted = !save.muted;
    storeSave();
    if (this.ctx) this.master.gain.setTargetAtTime(save.muted ? 0 : 0.6, this.ctx.currentTime, 0.05);
  }

  private tone(freq: number, t: number, dur: number, type: OscillatorType, vol: number, dest: AudioNode, attack = 0.01) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(dest);
    o.start(t);
    o.stop(t + dur + 0.05);
    return o;
  }

  /** One bar of ambient music: a soft pad chord plus a few music-box notes. */
  private schedule() {
    if (!this.ctx || this.ctx.state !== 'running') return;
    const ctx = this.ctx;
    const t = ctx.currentTime + 0.05;
    const chord = CHORDS[this.chord % CHORDS.length];
    this.chord++;
    for (const f of chord) {
      this.tone(f, t, 5.2, 'sine', 0.05, this.musicGain, 1.6);
      this.tone(f * 1.003, t, 5.2, 'triangle', 0.018, this.musicGain, 1.8);
    }
    const notes = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < notes; i++) {
      const f = PENTA[Math.floor(Math.random() * PENTA.length)];
      const at = t + i * (4 / notes) + Math.random() * 0.2;
      this.tone(f * 2, at, 1.4, 'sine', 0.035, this.delay);
    }
  }

  sfx(name: Sfx) {
    if (!this.ctx || !this.started) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const out = this.master;
    switch (name) {
      case 'blip': this.tone(660, t, 0.08, 'square', 0.05, out); break;
      case 'open':
        this.tone(440, t, 0.1, 'triangle', 0.09, out);
        this.tone(660, t + 0.07, 0.14, 'triangle', 0.09, out);
        break;
      case 'close':
        this.tone(520, t, 0.08, 'triangle', 0.07, out);
        this.tone(330, t + 0.06, 0.12, 'triangle', 0.07, out);
        break;
      case 'collect':
        [784, 988, 1175, 1568].forEach((f, i) => this.tone(f, t + i * 0.06, 0.3, 'sine', 0.09, this.delay));
        [784, 1175].forEach((f, i) => this.tone(f, t + i * 0.06, 0.2, 'triangle', 0.06, out));
        break;
      case 'enter': {
        const o = this.tone(180, t, 0.45, 'sawtooth', 0.04, out, 0.05);
        o.frequency.exponentialRampToValueAtTime(720, t + 0.4);
        break;
      }
      case 'stamp':
        this.tone(196, t, 0.12, 'square', 0.08, out);
        [523, 659, 784].forEach((f, i) => this.tone(f, t + 0.1 + i * 0.07, 0.3, 'triangle', 0.08, out));
        break;
      case 'right':
        this.tone(659, t, 0.1, 'square', 0.05, out);
        this.tone(988, t + 0.08, 0.2, 'square', 0.05, out);
        break;
      case 'wrong':
        this.tone(220, t, 0.12, 'sawtooth', 0.05, out);
        this.tone(165, t + 0.1, 0.22, 'sawtooth', 0.05, out);
        break;
      case 'step': this.tone(90 + Math.random() * 30, t, 0.06, 'sine', 0.05, out); break;
      case 'boost': this.tone(120, t, 0.12, 'triangle', 0.025, out); break;
      case 'fanfare':
        [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => this.tone(f, t + i * 0.11, 0.4, 'triangle', 0.09, out));
        [262, 330, 392].forEach((f) => this.tone(f, t + 0.66, 1.2, 'sine', 0.06, out, 0.1));
        break;
    }
  }
}

export const audio = new Audio();
