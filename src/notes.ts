// The written companion: the same research as the game, as one long article.
// It is generated from the same content files, so the two can never disagree.
import '@fontsource/press-start-2p/400.css';
import '@fontsource/vt323/400.css';
import './notes.css';
import { ACCENT } from './art/palette';
import { iconCanvas } from './art/icons';
import { AS_OF, SHARDS, STATIONS, Source, WidgetId } from './content/stations';
import {
  BURN_POINTS, CASE_FIELDS, FEE, FUND, GLOSSARY, HEADLINES, ISSUANCE, LIFECYCLE, PATCH_NOTES, QUIZ, RENAMES,
  STATUS_LABEL, SV_GHOST, SV_NODES, SV_TOTAL, TIMELINE, TRILLIONS, VOTE_THRESHOLD, WITNESSES,
} from './content/widgets';
import { allSources } from './exhibits/widgets';
import { h, rich } from './ui/dom';

function link(s: Source): HTMLElement {
  return h('a', { href: s.url, target: '_blank', rel: 'noopener' }, s.label);
}
function cite(s: Source): HTMLElement {
  return h('span', { class: 'cite' }, ' (', s.kind === 'reported' ? 'reported: ' : '', link(s), ')');
}
function table(head: string[], rows: (string | Node)[][]): HTMLElement {
  const t = h('table', {});
  t.append(h('thead', {}, h('tr', {}, ...head.map((x) => h('th', {}, x)))));
  const b = h('tbody', {});
  for (const r of rows) b.append(h('tr', {}, ...r.map((c) => h('td', {}, c))));
  t.append(b);
  return h('div', { class: 'tablewrap' }, t);
}
const pc = (n: number) => n.toFixed(1) + '%';

/** A plain, readable version of each interactive exhibit. */
function widgetText(id: WidgetId): Node[] {
  switch (id) {
    case 'glossary':
      return [table(['Term', 'In plain words'], GLOSSARY.map((g) => [g.term, h('span', {}, g.plain, cite(g.source))]))];
    case 'lifecycle':
      return [h('ol', {}, ...LIFECYCLE.map((s) => h('li', {}, h('strong', {}, s.name + '. '), s.text)))];
    case 'whosees':
      return [
        h('p', {}, 'The case file has seven lines: ' + CASE_FIELDS.map((f) => f.label.toLowerCase()).join(', ') + '. This is what each witness can read.'),
        table(['Witness', 'Can read', 'Why'], WITNESSES.map((w) => {
          const seen = CASE_FIELDS.filter((f) => w.sees[f.id] === 'yes');
          const what = seen.length === CASE_FIELDS.length ? 'Everything' : seen.length === 0 ? 'Nothing' : seen.map((f) => f.label).join('; ');
          return [h('span', {}, h('strong', {}, w.name), h('br', {}), w.role), `${what} (${seen.length}/${CASE_FIELDS.length})`, h('span', {}, w.quote + ' ' + w.note, cite(w.source))];
        })),
      ];
    case 'issuance':
      return [
        table(['Period after launch', 'Max minted per year', 'Apps', 'Validators', 'Super Validators'],
          ISSUANCE.map((p) => [p.label, p.cap + ' billion CC', p.apps + '%', p.validators + '%', p.svs + '%'])),
        h('p', {}, 'Minting began in mid-2024, so late 2026 falls in the third row. Since late 2025, 5% of each round is set aside first for the Development Fund, so the real shares are slightly lower than this white paper table.'),
      ];
    case 'burnmint':
      return [
        table(['Period', 'CC burned per CC minted', 'Reported by'], BURN_POINTS.map((b) => [b.when, b.ratio.toFixed(2), link(b.source)])),
        h('p', {}, 'These ratios come from third-party analysts, not from an official series. Because fees are fixed in dollars, a falling coin price burns more coins for the same usage, so a rising ratio can mean more activity, a cheaper coin, or both.'),
      ];
    case 'fee':
      return [h('p', {}, `The list price is $${FEE.pricePerMb} per megabyte of traffic. A typical transaction uses roughly ${FEE.typicalKb} kilobytes, which is where the figure of about one dollar comes from. Every validator also gets a free allowance of ${FEE.freeBytes.toLocaleString('en-US')} bytes that refills over ${FEE.freeWindowMin} minutes, enough for about ${Math.floor(FEE.freeBytes / (FEE.typicalKb * 1000))} typical transactions in that window. A simple transfer is that large because every step is a message that must be ordered: the encrypted views, the confirmations and the verdict.`)];
    case 'patchnotes':
      return [table(['When', 'Change', 'What the proposal says'], PATCH_NOTES.map((p) => [p.date, h('span', {}, h('strong', {}, p.title)), h('span', {}, p.text, cite(p.source))]))];
    case 'vote':
      return [h('p', {}, `With 13 node identities, ${VOTE_THRESHOLD} must agree for a vote to pass, and 5 can block. Digital Asset and Cumberland each run two nodes, so together they hold 4 of the 13 votes: not enough to pass or to block alone, and one node short of blocking. The threshold is our arithmetic from the formula in the docs, applied to the identities in the file as read on ${AS_OF}.`)];
    case 'weights':
      return [
        table(['Node identity', 'Run by', 'Reward weight', 'Share', 'Of which ghost or escrow'],
          SV_NODES.map((s) => [s.id, s.org, String(s.weight), pc((s.weight / SV_TOTAL) * 100), s.ghost ? String(s.ghost) : '0'])),
        h('p', {}, `Total weight in the file: ${SV_TOTAL}. The Foundation’s node carries ${pc((SV_NODES[0].weight / SV_TOTAL) * 100)} of it, on behalf of ${SV_NODES[0].hosted} beneficiary entries. Entries whose own comment says “ghost” or “escrow” add up to ${SV_GHOST}, or ${pc((SV_GHOST / SV_TOTAL) * 100)} of all weight: weight promised against milestones that are not yet met. The file is an onboarding reference and live on-chain weights may differ.`),
      ];
    case 'fund':
      return [
        h('p', {}, `By 24 August 2026 the fund had approved ${FUND.approvedProjects} projects with ${FUND.committed} million CC committed, and had paid out ${FUND.paid} million CC. Summing the appendix by recipient: ${FUND.digitalAsset} million CC (${pc((FUND.digitalAsset / FUND.paid) * 100)}) went to Digital Asset for ${FUND.daProjects} projects, and ${FUND.others} million CC went to the other ${FUND.otherProjects} paid projects combined.`),
        table(['Project', 'Recipient', 'Paid (million CC)'], FUND.rows.map((r) => [r.name, r.who, String(r.paid)])),
        h('p', {}, 'Most of that money pays for maintaining and extending software that Digital Asset wrote and still maintains. The same report says the fund should make the network “less dependent on any single contributor”. The first payments show how far there is to go.'),
      ];
    case 'ladder':
      return [table(['Headline', 'Status', 'Why'], HEADLINES.map((q) => [q.text, h('strong', {}, STATUS_LABEL[q.status]), h('span', {}, q.why, cite(q.source))]))];
    case 'trillions':
      return [table(['Figure', 'Usually described as', 'What it counts'], TRILLIONS.map((t) => [h('strong', {}, t.figure), t.claim, h('span', {}, h('em', {}, t.kind + '. '), t.counts, cite(t.source))]))];
    case 'quiz':
      return [table(['Claim', 'Verdict', 'Why'], QUIZ.map((q) => [q.claim, h('strong', {}, q.fact ? 'Fact' : 'Myth'), h('span', {}, q.why, cite(q.source))]))];
    case 'timeline':
      return [table(['Date', 'Event'], TIMELINE.map((t) => [t.date, h('span', {}, h('strong', {}, t.title + '. '), t.text, cite(t.source))]))];
    case 'renames':
      return [table(['Old name', 'Name now', 'Note'], RENAMES.map((r) => [r.old, r.now, r.note]))];
    default:
      return [];
  }
}

const root = document.getElementById('notes')!;
root.append(
  h('header', { class: 'hero' },
    h('a', { class: 'back', href: '/' }, '◀ Play the game'),
    h('div', { class: 'kicker' }, 'LUNAR LEDGER · FIELD NOTES'),
    h('h1', {}, 'Canton, with the receipts'),
    h('p', { class: 'lede' }, 'What the Canton Network is, who runs it and what is really live. This is the written version of the research inside the game: the same claims, the same sources, no walking required.'),
    h('p', { class: 'meta' }, `Independent community research, not affiliated with the Canton Foundation or Digital Asset. Facts as of ${AS_OF}.`),
  ),
  h('section', { class: 'summary' },
    h('h2', {}, 'The short version'),
    h('ul', {},
      h('li', {}, h('strong', {}, 'Canton is not one shared ledger. '), 'Each institution stores its own contracts, and a shared service only puts encrypted messages in order.'),
      h('li', {}, h('strong', {}, 'Its privacy comes from not sharing data, and it uses no zero-knowledge proofs. '), 'Network operators cannot read a trade. They can see which nodes received a message, when, and how large it was.'),
      h('li', {}, h('strong', {}, 'Thirteen node identities, run by eleven organisations, order the transactions. '), 'The roughly sixty “Super Validators” in headlines are mostly reward entries hosted on those nodes.'),
      h('li', {}, h('strong', {}, `${pc((SV_GHOST / SV_TOTAL) * 100)} of reward weight sits in “ghost” or “escrow” entries, `), 'and ', h('strong', {}, `${pc((FUND.digitalAsset / FUND.paid) * 100)} of early Development Fund payments went to Digital Asset. `), 'Both are our own sums from public files.'),
      h('li', {}, h('strong', {}, 'Much of what is announced is not yet in production. '), 'One repo platform and a one-month-old DTCC service carry the real volume. Many bank headlines are pilots or plans.'),
    ),
  ),
);

for (const st of STATIONS) {
  if (st.id === 'library') continue;
  const sec = h('section', { class: 'station' });
  sec.style.setProperty('--accent', ACCENT[st.id]);
  sec.append(h('h2', {}, st.name), h('p', { class: 'tagline' }, st.tagline));
  for (const ex of st.exhibits) {
    const art = h('article', {});
    const ic = iconCanvas(ex.icon, ACCENT[st.id], 3);
    ic.className = 'icon';
    art.append(h('h3', {}, ic, ex.title));
    for (const para of ex.body) {
      if (ex.widget && /^(Tap|Drag|Pick|Scroll|Eight real|Twelve statements|Insert|Flip)/.test(para)) continue;
      art.append(h('p', { html: rich(para) }));
    }
    if (ex.more) for (const para of ex.more) art.append(h('p', { html: rich(para) }));
    if (ex.widget) art.append(...widgetText(ex.widget));
    if (ex.sources.length) {
      const ul = h('ul', { class: 'srcs' });
      for (const s of ex.sources) ul.append(h('li', {}, h('span', { class: 'tag ' + s.kind }, s.kind), link(s)));
      art.append(h('details', {}, h('summary', {}, `Sources for this section (${ex.sources.length})`), ul));
    }
    sec.append(art);
  }
  root.append(sec);
}

const lib = STATIONS.find((s) => s.id === 'library')!;
const method = h('section', { class: 'station' });
method.style.setProperty('--accent', ACCENT.library);
method.append(h('h2', {}, 'Method and limits'));
for (const ex of lib.exhibits.slice(0, 2)) {
  method.append(h('h3', {}, ex.title));
  for (const para of ex.body) method.append(h('p', { html: rich(para) }));
}
method.append(h('h3', {}, 'Sixteen small facts'), h('ul', {}, ...SHARDS.map((s) => h('li', {}, s.text, cite(s.source)))));
const src = allSources();
const srcList = (items: Source[]) => h('ul', { class: 'srcs' }, ...items.map((s) => h('li', {}, link(s))));
method.append(
  h('h3', {}, `Primary sources (${src.primary.length})`),
  h('p', {}, 'Official docs, proposal texts, white papers, the MainNet configuration file and Foundation pages, read directly.'),
  srcList(src.primary),
  h('h3', {}, `Reported sources (${src.reported.length})`),
  h('p', {}, 'Third-party coverage, used only where no primary document was available and always worded as a report.'),
  srcList(src.reported),
);
root.append(method, h('footer', {}, h('a', { class: 'back', href: '/' }, '◀ Play the game'), h('p', {}, 'Lunar Ledger is independent, unofficial community research. All pixel art and sound in the game are generated by its own code.')));
