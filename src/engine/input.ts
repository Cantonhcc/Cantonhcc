// Keyboard and touch input folded into one small interface.
type Action = 'action' | 'journal' | 'back' | 'mute';

const KEY_ACTION: Record<string, Action> = {
  KeyE: 'action', Space: 'action', Enter: 'action',
  KeyJ: 'journal', Tab: 'journal',
  Escape: 'back',
  KeyM: 'mute',
};

class Input {
  private down = new Set<string>();
  private pressed = new Set<Action>();
  /** Virtual joystick vector set by the touch controls. */
  stick = { x: 0, y: 0 };
  touchBoost = false;
  enabled = true;
  usedTouch = false;

  init() {
    window.addEventListener('keydown', (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Tab'].includes(e.code)) e.preventDefault();
      if (!e.repeat) {
        const a = KEY_ACTION[e.code];
        if (a) this.pressed.add(a);
      }
      this.down.add(e.code);
    });
    window.addEventListener('keyup', (e) => this.down.delete(e.code));
    window.addEventListener('blur', () => this.down.clear());
  }
  press(a: Action) {
    this.pressed.add(a);
  }
  /** True once per key press. */
  take(a: Action): boolean {
    if (this.pressed.has(a)) {
      this.pressed.delete(a);
      return true;
    }
    return false;
  }
  endFrame() {
    this.pressed.clear();
  }
  axis(): { x: number; y: number } {
    if (!this.enabled) return { x: 0, y: 0 };
    let x = 0;
    let y = 0;
    if (this.down.has('ArrowLeft') || this.down.has('KeyA')) x -= 1;
    if (this.down.has('ArrowRight') || this.down.has('KeyD')) x += 1;
    if (this.down.has('ArrowUp') || this.down.has('KeyW')) y -= 1;
    if (this.down.has('ArrowDown') || this.down.has('KeyS')) y += 1;
    if (x === 0 && y === 0) {
      x = this.stick.x;
      y = this.stick.y;
    }
    const m = Math.hypot(x, y);
    if (m > 1) {
      x /= m;
      y /= m;
    }
    return { x, y };
  }
  boost(): boolean {
    return this.enabled && (this.down.has('ShiftLeft') || this.down.has('ShiftRight') || this.touchBoost);
  }
}

export const input = new Input();
