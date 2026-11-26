import '@fontsource/press-start-2p/400.css';
import '@fontsource/vt323/400.css';
import './style.css';
import { G } from './game';
import { audio } from './engine/audio';
import { input } from './engine/input';
import { loadSave, save } from './engine/save';
import { $ } from './ui/dom';
import { ui } from './ui/hud';
import { openJournal } from './ui/journal';
import { Title } from './world/title';
import { Overworld, mapCanvas } from './world/overworld';
import { Interior } from './world/interior';

loadSave();
input.init();
G.init($('game') as HTMLCanvasElement);
ui.init();

const title = new Title();
G.set(title);

const startBtn = $('btn-start');
if (save.seen.length || save.shards.length || save.intro) startBtn.textContent = 'Continue';
startBtn.addEventListener('click', () => title.start());

function journal() {
  if (G.scene === title || ui.locked() || G.busy) return;
  audio.sfx('open');
  const sc = G.scene;
  openJournal(mapCanvas(), sc instanceof Overworld ? sc.player : null);
}
ui.onJournal = journal;

window.addEventListener('keydown', (e) => {
  if (e.target instanceof HTMLInputElement) return;
  if (G.scene === title) {
    if ((e.code === 'Enter' || e.code === 'Space') && document.activeElement?.tagName !== 'A') {
      e.preventDefault();
      title.start();
    }
    return;
  }
  if (e.code === 'KeyJ' || e.code === 'Tab') {
    e.preventDefault();
    journal();
  } else if (e.code === 'KeyM') {
    audio.toggleMute();
    ui.refresh();
  }
});
// browsers only allow sound after a gesture
window.addEventListener('pointerdown', () => audio.start(), { once: true });

// small hook for automated tests
(window as any).__ll = { G, save, Overworld, Interior, ui };
