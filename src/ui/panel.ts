// The exhibit viewer: a pixel-framed panel with the text, an optional
// interactive widget and the sources for every claim on the card.
import { audio } from '../engine/audio';
import { ACCENT } from '../art/palette';
import { iconCanvas } from '../art/icons';
import type { Exhibit, IconId, Source, Station } from '../content/stations';
import { mountWidget } from '../exhibits/widgets';
import { $, esc, h, rich } from './dom';
import { ui } from './hud';

export function sourceList(sources: Source[]): HTMLElement {
  const ul = h('ul', { class: 'sources' });
  for (const s of sources) {
    ul.append(h('li', {},
      h('span', { class: 'tag ' + s.kind }, s.kind === 'primary' ? 'primary' : 'reported'),
      h('a', { href: s.url, target: '_blank', rel: 'noopener' }, s.label),
    ));
  }
  return ul;
}

export interface PanelOptions {
  kicker: string;
  title: string;
  accent: string;
  icon?: IconId;
  body: HTMLElement;
  wide?: boolean;
  onClose?: () => void;
}

export function openPanel(o: PanelOptions) {
  if (ui.panelOpen) return;
  ui.panelOpen = true;
  ui.setPrompt(null);
  const root = $('panel-root');
  const close = () => {
    if (!ui.panelOpen) return;
    window.removeEventListener('keydown', onKey, true);
    overlay.classList.add('out');
    audio.sfx('close');
    setTimeout(() => overlay.remove(), 160);
    ui.panelOpen = false;
    ui.cooldown(300);
    o.onClose?.();
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.code === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      close();
    }
  };
  const head = h('header', { class: 'panel-head' });
  if (o.icon) {
    const ic = iconCanvas(o.icon, o.accent, 4);
    ic.className = 'panel-icon';
    head.append(ic);
  }
  head.append(
    h('div', { class: 'panel-titles' }, h('div', { class: 'kicker' }, o.kicker), h('h2', {}, o.title)),
    h('button', { class: 'pbtn close', 'aria-label': 'Close', onclick: close }, '✕'),
  );
  const panel = h('article', { class: 'panel pixel-box' + (o.wide ? ' wide' : ''), role: 'dialog', 'aria-modal': 'true', 'aria-label': o.title },
    head,
    h('div', { class: 'panel-body' }, o.body),
    h('footer', { class: 'panel-foot' }, h('button', { class: 'pbtn primary', onclick: close }, 'Done ', h('kbd', {}, 'Esc'))),
  );
  panel.style.setProperty('--accent', o.accent);
  const overlay = h('div', { class: 'overlay', onclick: (e: MouseEvent) => { if (e.target === overlay) close(); } }, panel);
  root.append(overlay);
  window.addEventListener('keydown', onKey, true);
  (panel.querySelector('.close') as HTMLElement).focus({ preventScroll: true });
}

export function openExhibit(station: Station, ex: Exhibit, onClose: () => void) {
  const accent = ACCENT[station.id];
  const body = h('div', {});
  for (const para of ex.body) body.append(h('p', { html: rich(para) }));
  if (ex.widget) {
    const w = h('div', { class: 'widget w-' + ex.widget });
    body.append(w);
    mountWidget(ex.widget, w, accent);
  }
  if (ex.sources.length) {
    body.append(h('div', { class: 'sources-head' }, 'Sources'), sourceList(ex.sources));
  }
  openPanel({
    kicker: `${station.name.toUpperCase()} · ${ex.kicker}`, title: ex.title, accent, icon: ex.icon, body, onClose,
    wide: !!ex.widget,
  });
}

export { esc };
