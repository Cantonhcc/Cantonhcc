// Interactive exhibits. Each function fills a container element.
import { audio } from '../engine/audio';
import { mix } from '../engine/core';
import { AS_OF, SRC, STATIONS, Source, WidgetId } from '../content/stations';
import {
  BURN_POINTS, CASE_FIELDS, FEE, FUND, GLOSSARY, HEADLINES, ISSUANCE, ISSUANCE_NOW, LIFECYCLE, PATCH_NOTES,
  QUIZ, RENAMES, STATUS_LABEL, SV_GHOST, SV_NODES, SV_TOTAL, Status, TIMELINE, TRILLIONS, VOTE_THRESHOLD, WITNESSES,
} from '../content/widgets';
import { setScore } from '../progress';
import { esc, h } from '../ui/dom';
import { mountCertificate } from './certificate';

type Mount = (el: HTMLElement, accent: string) => void;

function srcLink(s: Source): HTMLElement {
  return h('a', { class: 'src', href: s.url, target: '_blank', rel: 'noopener' }, (s.kind === 'reported' ? 'Reported: ' : 'Source: ') + s.label);
}
function pct(n: number, digits = 1): string {
  return n.toFixed(digits) + '%';
}

const glossary: Mount = (el) => {
  const grid = h('div', { class: 'flip-grid' });
  for (const g of GLOSSARY) {
    const card = h('button', { class: 'flip', 'aria-pressed': 'false' },
      h('span', { class: 'flip-front' }, g.term),
      h('span', { class: 'flip-back' }, g.plain),
    );
    card.addEventListener('click', () => {
      const on = card.classList.toggle('on');
      card.setAttribute('aria-pressed', String(on));
      audio.sfx('blip');
    });
    grid.append(card);
  }
  el.append(grid);
};

const lifecycle: Mount = (el) => {
  let i = 0;
  const dots = h('div', { class: 'steps' });
  const title = h('div', { class: 'step-title' });
  const text = h('p', { class: 'step-text' });
  const prev = h('button', { class: 'pbtn' }, '◀ Back');
  const next = h('button', { class: 'pbtn primary' }, 'Next ▶');
  const render = () => {
    dots.innerHTML = '';
    LIFECYCLE.forEach((s, k) => {
      const d = h('button', { class: 'step' + (k === i ? ' on' : k < i ? ' past' : ''), 'aria-label': s.name }, String(k + 1));
      d.addEventListener('click', () => { i = k; audio.sfx('blip'); render(); });
      dots.append(d);
      if (k < LIFECYCLE.length - 1) dots.append(h('span', { class: 'step-line' + (k < i ? ' past' : '') }));
    });
    title.textContent = `${i + 1}. ${LIFECYCLE[i].name}`;
    text.textContent = LIFECYCLE[i].text;
    prev.toggleAttribute('disabled', i === 0);
    next.toggleAttribute('disabled', i === LIFECYCLE.length - 1);
  };
  prev.addEventListener('click', () => { i = Math.max(0, i - 1); audio.sfx('blip'); render(); });
  next.addEventListener('click', () => { i = Math.min(LIFECYCLE.length - 1, i + 1); audio.sfx('blip'); render(); });
  el.append(dots, title, text, h('div', { class: 'row' }, prev, next));
  render();
};

const whosees: Mount = (el) => {
  let cur = 0;
  const tabs = h('div', { class: 'witness-tabs', role: 'tablist' });
  const file = h('div', { class: 'casefile' });
  const render = () => {
    const w = WITNESSES[cur];
    tabs.querySelectorAll('button').forEach((b, k) => {
      b.classList.toggle('on', k === cur);
      b.setAttribute('aria-selected', String(k === cur));
    });
    const seen = CASE_FIELDS.filter((f) => w.sees[f.id] === 'yes').length;
    file.innerHTML = '';
    file.append(
      h('div', { class: 'case-head' },
        h('div', {}, h('div', { class: 'case-stamp' }, 'CASE FILE 0001'), h('div', { class: 'case-who' }, w.name), h('div', { class: 'case-role' }, w.role)),
        h('div', { class: 'case-score' }, h('b', {}, `${seen}/${CASE_FIELDS.length}`), ' lines readable'),
      ),
    );
    const table = h('div', { class: 'case-rows' });
    CASE_FIELDS.forEach((f, k) => {
      const vis = w.sees[f.id] === 'yes';
      const row = h('div', { class: 'case-row ' + (vis ? 'vis' : 'red') },
        h('span', { class: 'case-label' }, f.label),
        vis ? h('span', { class: 'case-value' }, f.value) : h('span', { class: 'case-value redact', 'aria-label': 'hidden' }, '█'.repeat(Math.min(18, f.value.length))),
      );
      row.style.animationDelay = k * 45 + 'ms';
      table.append(row);
    });
    file.append(table, h('p', { class: 'case-quote' }, w.quote), h('p', { class: 'case-note' }, w.note), srcLink(w.source));
  };
  WITNESSES.forEach((w, k) => {
    const b = h('button', { role: 'tab' }, w.name);
    b.addEventListener('click', () => { cur = k; audio.sfx('blip'); render(); });
    tabs.append(b);
  });
  el.append(tabs, file);
  render();
};

const issuance: Mount = (el) => {
  const slider = h('input', { type: 'range', min: 0, max: 12, step: 0.1, value: ISSUANCE_NOW, 'aria-label': 'Years since launch' }) as HTMLInputElement;
  const out = h('div', { class: 'iss' });
  const render = () => {
    const y = parseFloat(slider.value);
    const ph = ISSUANCE.find((p) => y >= p.from && y < p.to) ?? ISSUANCE[ISSUANCE.length - 1];
    const isNow = Math.abs(y - ISSUANCE_NOW) < 0.06;
    out.innerHTML = '';
    out.append(
      h('div', { class: 'iss-head' },
        h('div', {}, h('div', { class: 'big' }, `Year ${y.toFixed(1)}`), h('div', { class: 'dim' }, ph.label + (isNow ? ' · roughly today' : ''))),
        h('div', { class: 'iss-cap' }, h('div', { class: 'big' }, `${ph.cap} bn`), h('div', { class: 'dim' }, 'max CC minted per year')),
      ),
      h('div', { class: 'capbar' }, h('div', { class: 'capfill', style: `width:${(ph.cap / 40) * 100}%` })),
      h('div', { class: 'dim small' }, 'Who the newly minted coins go to:'),
      h('div', { class: 'split' },
        h('div', { class: 'seg apps', style: `width:${ph.apps}%` }, ph.apps >= 12 ? `Apps ${ph.apps}%` : ''),
        h('div', { class: 'seg vals', style: `width:${ph.validators}%` }, ph.validators >= 12 ? `Validators ${ph.validators}%` : ''),
        h('div', { class: 'seg svs', style: `width:${ph.svs}%` }, ph.svs >= 12 ? `Super Validators ${ph.svs}%` : ''),
      ),
      h('div', { class: 'legend' },
        h('span', {}, h('i', { class: 'sw apps' }), `Apps ${ph.apps}%`),
        h('span', {}, h('i', { class: 'sw vals' }), `Validators ${ph.validators}%`),
        h('span', {}, h('i', { class: 'sw svs' }), `Super Validators ${ph.svs}%`),
      ),
    );
  };
  slider.addEventListener('input', render);
  const now = h('button', { class: 'pbtn' }, 'Jump to today');
  now.addEventListener('click', () => { slider.value = String(ISSUANCE_NOW); render(); });
  el.append(h('div', { class: 'row' }, slider, now), out,
    h('p', { class: 'note' }, 'The Super Validators’ share falls from 80% to 5% over the schedule. Since late 2025, 5% of each round is set aside first for the Development Fund, so the real shares are slightly lower than the white paper table shown here.'));
  render();
};

const burnmint: Mount = (el) => {
  const chart = h('div', { class: 'gauge' });
  chart.append(h('div', { class: 'gauge-target' }, h('span', {}, 'balance = 1.0')));
  for (const b of BURN_POINTS) {
    chart.append(h('div', { class: 'gauge-row' },
      h('span', { class: 'gauge-label' }, b.when),
      h('div', { class: 'gauge-track' }, h('div', { class: 'gauge-fill', style: `width:${b.ratio * 100}%` })),
      h('span', { class: 'gauge-val' }, b.ratio.toFixed(2)),
    ));
  }
  el.append(
    h('div', { class: 'dim small' }, 'CC burned for every 1 CC minted (third-party reports)'),
    chart,
    h('p', { class: 'note' }, 'Read this with care. These ratios come from third-party analysts, not from an official series. And because fees are fixed in dollars, a falling coin price burns more coins for the same usage: a rising ratio can mean more activity, a cheaper coin, or both.'),
  );
};

const fee: Mount = (el) => {
  const slider = h('input', { type: 'range', min: 1, max: 120, step: 0.5, value: FEE.typicalKb, 'aria-label': 'Transaction size in kilobytes' }) as HTMLInputElement;
  const out = h('div', { class: 'receipt' });
  const render = () => {
    const kb = parseFloat(slider.value);
    const cost = (kb * 1000 * FEE.pricePerMb) / 1_000_000;
    const freeTx = Math.floor(FEE.freeBytes / (kb * 1000));
    out.innerHTML = '';
    out.append(
      h('div', { class: 'receipt-title' }, 'GLOBAL SYNCHRONIZER · TRAFFIC RECEIPT'),
      h('div', { class: 'receipt-row' }, h('span', {}, 'Bytes put in order'), h('b', {}, `${kb.toFixed(1)} kB`)),
      h('div', { class: 'receipt-row' }, h('span', {}, 'List price'), h('b', {}, `$${FEE.pricePerMb} per MB`)),
      h('div', { class: 'receipt-row total' }, h('span', {}, 'You burn CC worth'), h('b', {}, `$${cost.toFixed(2)}`)),
      h('div', { class: 'receipt-row' }, h('span', {}, 'Free allowance covers'), h('b', {}, `${freeTx} of these per ${FEE.freeWindowMin} min`)),
    );
  };
  slider.addEventListener('input', render);
  el.append(
    h('div', { class: 'dim small' }, 'Drag to change the size of the transaction'),
    slider, out,
    h('p', { class: 'note' }, 'Why is a simple transfer around 17 kB? Because every step is a message that must be ordered: the encrypted views, the confirmations and the verdict. A governance proposal approved in 2026 calls the current price, “about $1 per transaction”, too high for high-volume uses such as payments.'),
  );
  render();
};

const patchnotes: Mount = (el) => {
  const list = h('div', { class: 'patches' });
  for (const pn of PATCH_NOTES) {
    list.append(h('div', { class: 'patch' },
      h('div', { class: 'patch-top' }, h('span', { class: 'ptag t-' + pn.tag.toLowerCase().replace(/\s/g, '') }, pn.tag), h('span', { class: 'dim' }, pn.date)),
      h('div', { class: 'patch-title' }, pn.title),
      h('div', { class: 'patch-text' }, pn.text),
      srcLink(pn.source),
    ));
  }
  el.append(list);
};

const vote: Mount = (el) => {
  const yes = new Set<number>();
  const ring = h('div', { class: 'ring' });
  const result = h('div', { class: 'vote-result' });
  const render = () => {
    ring.querySelectorAll('button').forEach((b, k) => {
      b.classList.toggle('yes', yes.has(k));
      b.setAttribute('aria-pressed', String(yes.has(k)));
    });
    const n = yes.size;
    const pass = n >= VOTE_THRESHOLD;
    result.className = 'vote-result ' + (pass ? 'pass' : 'fail');
    result.innerHTML = `<b>${n} of 13</b> vote yes · needs ${VOTE_THRESHOLD} · <span>${pass ? 'PASSES' : 'DOES NOT PASS'}</span>`;
  };
  SV_NODES.forEach((s, k) => {
    const ang = (k / SV_NODES.length) * Math.PI * 2 - Math.PI / 2;
    const b = h('button', { class: 'node', title: s.id, 'aria-label': s.id }, h('span', {}, s.org));
    b.style.left = 50 + Math.cos(ang) * 42 + '%';
    b.style.top = 50 + Math.sin(ang) * 40 + '%';
    b.addEventListener('click', () => {
      if (yes.has(k)) yes.delete(k); else yes.add(k);
      audio.sfx(yes.size >= VOTE_THRESHOLD ? 'right' : 'blip');
      render();
    });
    ring.append(b);
  });
  ring.append(h('div', { class: 'ring-mid' }, 'click a node to vote yes'));
  const preset = (label: string, pick: (org: string) => boolean) => {
    const b = h('button', { class: 'pbtn' }, label);
    b.addEventListener('click', () => {
      yes.clear();
      SV_NODES.forEach((s, k) => { if (pick(s.org)) yes.add(k); });
      audio.sfx('blip');
      render();
    });
    return b;
  };
  const two = (o: string) => o === 'Digital Asset' || o === 'Cumberland';
  el.append(ring, result,
    h('div', { class: 'row wrap' },
      preset('Only Digital Asset + Cumberland', two),
      preset('Everyone except those two', (o) => !two(o)),
      preset('Clear', () => false),
    ),
    h('p', { class: 'note' }, `With 13 nodes, ${VOTE_THRESHOLD} must agree, and 5 can block. The two organisations that run two nodes each hold 4 of the 13 votes: not enough to pass or to block alone, and one node short of blocking. The threshold is our arithmetic from the formula in the docs, applied to the 13 identities in the file read on ${AS_OF}.`),
  );
  render();
};

const weights: Mount = (el) => {
  const max = SV_NODES[0].weight;
  const list = h('div', { class: 'wbars' });
  for (const s of SV_NODES) {
    const live = s.weight - s.ghost;
    list.append(h('div', { class: 'wrow' },
      h('span', { class: 'wname' }, s.org + (s.id.endsWith('-2') ? ' (2)' : s.id.endsWith('-1') && (s.org === 'Digital Asset' || s.org === 'Cumberland') ? ' (1)' : '')),
      h('div', { class: 'wtrack' },
        h('div', { class: 'wfill', style: `width:${(live / max) * 100}%` }),
        h('div', { class: 'wghost', style: `width:${(s.ghost / max) * 100}%` }),
      ),
      h('span', { class: 'wval' }, pct((s.weight / SV_TOTAL) * 100)),
    ));
  }
  el.append(
    h('div', { class: 'legend' }, h('span', {}, h('i', { class: 'sw wfill' }), 'weight in active entries'), h('span', {}, h('i', { class: 'sw wghost' }), 'weight in “ghost” or “escrow” entries')),
    list,
    h('div', { class: 'stats' },
      h('div', { class: 'stat' }, h('b', {}, pct((SV_NODES[0].weight / SV_TOTAL) * 100)), h('span', {}, `of all reward weight sits on the Foundation’s node, on behalf of ${SV_NODES[0].hosted} beneficiary entries`)),
      h('div', { class: 'stat' }, h('b', {}, pct((SV_GHOST / SV_TOTAL) * 100)), h('span', {}, 'of all reward weight is in entries labelled ghost or escrow: not yet earned')),
      h('div', { class: 'stat' }, h('b', {}, '13 / 11'), h('span', {}, 'node identities / organisations running them')),
    ),
    h('p', { class: 'note' }, `How we counted: we summed the weights in the public MainNet file on ${AS_OF} (total ${SV_TOTAL}) and added up every beneficiary line whose own comment says “ghost” or “escrow” (${SV_GHOST}). Governance texts for several large names say their milestones were “agreed privately”. The file is an onboarding reference and live on-chain weights may differ.`),
  );
};

const fund: Mount = (el) => {
  const share = (FUND.digitalAsset / FUND.paid) * 100;
  const rows = h('div', { class: 'fundrows' });
  const maxPaid = FUND.rows[0].paid;
  for (const r of FUND.rows) {
    rows.append(h('div', { class: 'frow' + (r.who === 'Digital Asset' ? ' da' : '') },
      h('span', { class: 'fname' }, r.name, h('em', {}, ' · ' + r.who)),
      h('div', { class: 'ftrack' }, h('div', { class: 'ffill', style: `width:${Math.max(1.5, (r.paid / maxPaid) * 100)}%` })),
      h('span', { class: 'fval' }, r.paid + 'M'),
    ));
  }
  el.append(
    h('div', { class: 'stats' },
      h('div', { class: 'stat' }, h('b', {}, `${FUND.paid}M CC`), h('span', {}, `paid out by 24 August 2026, of ${FUND.committed}M committed across ${FUND.approvedProjects} projects`)),
      h('div', { class: 'stat' }, h('b', {}, pct(share)), h('span', {}, `of payments (${FUND.digitalAsset}M CC) went to Digital Asset, for ${FUND.daProjects} projects`)),
      h('div', { class: 'stat' }, h('b', {}, `${FUND.others}M CC`), h('span', {}, `went to the other ${FUND.otherProjects} paid projects combined`)),
    ),
    h('div', { class: 'bigbar' }, h('div', { class: 'bb da', style: `width:${share}%` }, 'Digital Asset'), h('div', { class: 'bb other' }, '')),
    h('details', { class: 'more' }, h('summary', {}, 'Show all 23 paid projects'), rows),
    h('p', { class: 'note' }, 'Context matters here. Most of that money pays for maintaining and extending software that Digital Asset wrote and still maintains: the protocol, Daml, the consensus upgrade. The same report says the fund should make the network “less dependent on any single contributor”. The first payments show how far there is to go. The split is our sum of the report’s appendix.'),
  );
};

const ORDER: Status[] = ['live', 'oneoff', 'pilot', 'announced'];
const ladder: Mount = (el) => {
  let i = 0;
  let score = 0;
  const stage = h('div', { class: 'ladder' });
  const show = () => {
    stage.innerHTML = '';
    if (i >= HEADLINES.length) {
      setScore('ladder', score);
      stage.append(
        h('div', { class: 'final' }, h('div', { class: 'big' }, `${score} / ${HEADLINES.length}`),
          h('div', {}, score >= 7 ? 'Dockmaster! You read past the headline.' : score >= 5 ? 'Good eye. The pilot versus production line is the tricky one.' : 'That is the point of the exercise: headlines blur these four shelves.')),
        again(),
      );
      audio.sfx(score >= 5 ? 'fanfare' : 'blip');
      return;
    }
    const q = HEADLINES[i];
    const fb = h('div', { class: 'feedback', 'aria-live': 'polite' });
    const btns = h('div', { class: 'shelves' });
    for (const st of ORDER) {
      const b = h('button', { class: 'shelf s-' + st }, STATUS_LABEL[st]);
      b.addEventListener('click', () => {
        const ok = st === q.status;
        if (ok) score++;
        audio.sfx(ok ? 'right' : 'wrong');
        btns.querySelectorAll('button').forEach((x) => x.setAttribute('disabled', ''));
        b.classList.add(ok ? 'correct' : 'wrong');
        btns.querySelector('.s-' + q.status)!.classList.add('correct');
        fb.append(
          h('div', { class: 'verdict ' + (ok ? 'ok' : 'no') }, ok ? 'Correct.' : `Not quite. It is: ${STATUS_LABEL[q.status]}.`),
          h('p', {}, q.why), srcLink(q.source),
          h('button', { class: 'pbtn primary', onclick: () => { i++; show(); } }, i === HEADLINES.length - 1 ? 'See score' : 'Next crate ▶'),
        );
      });
      btns.append(b);
    }
    stage.append(h('div', { class: 'dim small' }, `Crate ${i + 1} of ${HEADLINES.length}`), h('div', { class: 'crate' }, q.text), btns, fb);
  };
  const again = () => h('button', { class: 'pbtn', onclick: () => { i = 0; score = 0; show(); } }, 'Play again');
  el.append(stage, h('p', { class: 'note' }, `Statuses as of ${AS_OF}. “Announced only” means we found no report that the thing has happened yet.`));
  show();
};

const trillions: Mount = (el) => {
  const grid = h('div', { class: 'flip-grid tr' });
  for (const t of TRILLIONS) {
    const card = h('button', { class: 'flip tall', 'aria-pressed': 'false' },
      h('span', { class: 'flip-front' }, h('b', {}, t.figure), h('small', {}, t.claim)),
      h('span', { class: 'flip-back' }, h('em', {}, t.kind), t.counts, h('small', { class: 'dim' }, (t.source.kind === 'reported' ? 'Reported: ' : 'Source: ') + t.source.label)),
    );
    card.addEventListener('click', () => {
      const on = card.classList.toggle('on');
      card.setAttribute('aria-pressed', String(on));
      audio.sfx('blip');
    });
    grid.append(card);
  }
  el.append(grid, h('p', { class: 'note' }, 'The rule of thumb: ask whether a number is a stock (what sits there) or a flow (what passed through), and who counted it.'));
};

const quiz: Mount = (el) => {
  let i = 0;
  let score = 0;
  const stage = h('div', { class: 'quiz' });
  const show = () => {
    stage.innerHTML = '';
    if (i >= QUIZ.length) {
      setScore('quiz', score);
      stage.append(
        h('div', { class: 'final' }, h('div', { class: 'big' }, `${score} / ${QUIZ.length}`),
          h('div', {}, score >= 11 ? 'High score! You could moderate a Canton thread.' : score >= 8 ? 'Solid. A few myths got through.' : 'These myths are common for a reason. Try the other stations and come back.')),
        h('button', { class: 'pbtn', onclick: () => { i = 0; score = 0; show(); } }, 'Play again'),
      );
      audio.sfx(score >= 8 ? 'fanfare' : 'blip');
      return;
    }
    const q = QUIZ[i];
    const fb = h('div', { class: 'feedback', 'aria-live': 'polite' });
    const answer = (guess: boolean, b: HTMLElement) => {
      const ok = guess === q.fact;
      if (ok) score++;
      audio.sfx(ok ? 'right' : 'wrong');
      stage.querySelectorAll('.ans').forEach((x) => x.setAttribute('disabled', ''));
      b.classList.add(ok ? 'correct' : 'wrong');
      fb.append(
        h('div', { class: 'verdict ' + (ok ? 'ok' : 'no') }, `${ok ? 'Correct' : 'Not quite'}: it is a ${q.fact ? 'FACT' : 'MYTH'}.`),
        h('p', {}, q.why), srcLink(q.source),
        h('button', { class: 'pbtn primary', onclick: () => { i++; show(); } }, i === QUIZ.length - 1 ? 'See score' : 'Next ▶'),
      );
    };
    const myth = h('button', { class: 'ans myth' }, 'MYTH');
    const fact = h('button', { class: 'ans fact' }, 'FACT');
    myth.addEventListener('click', () => answer(false, myth));
    fact.addEventListener('click', () => answer(true, fact));
    stage.append(
      h('div', { class: 'quiz-top' }, h('span', { class: 'dim small' }, `Claim ${i + 1} of ${QUIZ.length}`), h('span', { class: 'dim small' }, `Score ${score}`)),
      h('div', { class: 'claim' }, '“' + q.claim + '”'),
      h('div', { class: 'row center' }, myth, fact), fb,
    );
  };
  el.append(stage);
  show();
};

const timeline: Mount = (el) => {
  const track = h('div', { class: 'timeline', tabindex: 0, 'aria-label': 'Timeline, scroll sideways' });
  let lastYear = 0;
  for (const t of TIMELINE) {
    if (t.year !== lastYear) {
      track.append(h('div', { class: 'tl-year' }, String(t.year)));
      lastYear = t.year;
    }
    track.append(h('div', { class: 'tl-item' },
      h('div', { class: 'tl-dot' }),
      h('div', { class: 'tl-date' }, t.date),
      h('div', { class: 'tl-title' }, t.title),
      h('div', { class: 'tl-text' }, t.text),
      srcLink(t.source),
    ));
  }
  el.append(h('div', { class: 'dim small' }, 'Scroll sideways ▶'), track);
};

const renames: Mount = (el) => {
  const table = h('table', { class: 'ptable' });
  table.append(h('thead', {}, h('tr', {}, h('th', {}, 'Old name'), h('th', {}, 'Name now'), h('th', {}, 'Note'))));
  const body = h('tbody', {});
  for (const r of RENAMES) body.append(h('tr', {}, h('td', {}, r.old), h('td', {}, h('b', {}, r.now)), h('td', {}, r.note)));
  table.append(body);
  el.append(table);
};

/** Every source defined for the project, grouped by how it was read. */
export function allSources(): { primary: Source[]; reported: Source[] } {
  const used = new Map<string, Source>();
  const add = (s: Source) => used.set(s.url, s);
  STATIONS.forEach((st) => st.exhibits.forEach((e) => e.sources.forEach(add)));
  Object.values(SRC).forEach(add);
  const list = [...used.values()].sort((a, b) => a.label.localeCompare(b.label));
  return { primary: list.filter((s) => s.kind === 'primary'), reported: list.filter((s) => s.kind === 'reported') };
}

const sources: Mount = (el) => {
  const s = allSources();
  const block = (title: string, note: string, items: Source[]) => {
    const ul = h('ul', { class: 'sources' });
    for (const it of items) ul.append(h('li', {}, h('a', { href: it.url, target: '_blank', rel: 'noopener' }, it.label)));
    return h('div', {}, h('div', { class: 'sources-head' }, `${title} (${items.length})`), h('p', { class: 'note' }, note), ul);
  };
  el.append(
    block('Primary sources', 'Official docs, proposal texts, white papers, the MainNet configuration file and Foundation pages, read directly.', s.primary),
    block('Reported sources', 'Third-party coverage, used only where no primary document was available and always worded as a report.', s.reported),
  );
};

const REGISTRY: Record<WidgetId, Mount> = {
  glossary, lifecycle, whosees, issuance, burnmint, fee, patchnotes, vote, weights, fund,
  ladder, trillions, quiz, timeline, renames, sources, certificate: mountCertificate,
};

export function mountWidget(id: WidgetId, el: HTMLElement, accent: string) {
  el.style.setProperty('--accent', accent);
  el.style.setProperty('--accent-dim', mix(accent, '#161a38', 0.6));
  REGISTRY[id](el, accent);
}
export { esc };
