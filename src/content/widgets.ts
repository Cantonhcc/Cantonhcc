// Data behind the interactive exhibits. Same rule as stations.ts: every row
// carries its source.
import { SRC, Source } from './stations';

/* ---------- Welcome Dome ---------- */

export const GLOSSARY: { term: string; plain: string; source: Source }[] = [
  { term: 'Party', plain: 'Your identity on Canton, a bit like an account address. It looks like a name plus a key fingerprint.', source: SRC.core },
  { term: 'Validator', plain: 'A node that hosts parties and stores their contracts. It only validates transactions its own parties are part of.', source: SRC.arch },
  { term: 'Synchronizer', plain: 'A service that puts encrypted messages in order. It coordinates. It does not store your data.', source: SRC.arch },
  { term: 'Sequencer', plain: 'The part of a synchronizer that orders and delivers messages. It sees who receives them and how big they are, not what they say.', source: SRC.ordering },
  { term: 'Mediator', plain: 'The referee. It collects yes or no confirmations from the parties involved and announces the verdict.', source: SRC.ordering },
  { term: 'Global Synchronizer', plain: 'The shared, public synchronizer run by several independent organisations. Apps that use it can settle with each other.', source: SRC.gs },
  { term: 'Super Validator', plain: 'An operator of the Global Synchronizer. Runs a sequencer, a mediator, governance and a public index. No partial setups allowed.', source: SRC.svc },
  { term: 'Daml', plain: 'The smart-contract language. Contracts name their signatories and observers, and that decides who gets to see them.', source: SRC.core },
];

export const LIFECYCLE: { name: string; text: string }[] = [
  { name: 'Prepare', text: 'Your validator runs the command and builds a transaction tree. It works out who must be informed about each part.' },
  { name: 'Submit', text: 'Each part becomes an encrypted “view”. Only the nodes hosting stakeholders of that part can open it.' },
  { name: 'Sequence', text: 'The sequencer stamps the messages with a global order and delivers each view only to its recipients.' },
  { name: 'Confirm', text: 'Each stakeholder’s validator re-runs the logic and checks nothing was spent twice. Then it sends yes or no.' },
  { name: 'Commit', text: 'The mediator collects the answers and issues a verdict. Everyone applies it at the same point in the order. Final.' },
];

/* ---------- Privacy Observatory ---------- */

export const CASE_FIELDS = [
  { id: 'who', label: 'Who traded', value: 'Meridian Bank ⇄ Harbor Fund' },
  { id: 'what', label: 'What moved', value: '1 tokenized bond ⇄ cash' },
  { id: 'price', label: 'Price and size', value: '$10,000,000' },
  { id: 'terms', label: 'Contract terms', value: 'Settle both legs together, or not at all' },
  { id: 'recips', label: 'Which nodes got messages', value: '3 validator nodes' },
  { id: 'meta', label: 'Message size and time', value: '17 kB at 14:02:11' },
  { id: 'verdict', label: 'Verdict', value: 'APPROVED' },
] as const;

type Vis = 'yes' | 'no';
export interface Witness {
  id: string;
  name: string;
  role: string;
  sees: Record<string, Vis>;
  quote: string;
  note: string;
  source: Source;
}

const all: Record<string, Vis> = { who: 'yes', what: 'yes', price: 'yes', terms: 'yes', recips: 'yes', meta: 'yes', verdict: 'yes' };
const none: Record<string, Vis> = { who: 'no', what: 'no', price: 'no', terms: 'no', recips: 'no', meta: 'no', verdict: 'no' };

export const WITNESSES: Witness[] = [
  {
    id: 'trader', name: 'The two traders', role: 'Signatories', sees: all,
    quote: '“Always sees the contract and all its events.”',
    note: 'They signed the deal, so their nodes hold it and must confirm it.',
    source: SRC.privacy,
  },
  {
    id: 'observer', name: 'A regulator', role: 'Named as observer', sees: all,
    quote: 'An observer sees the contract. Its confirmation is not required.',
    note: 'Only if the contract names it. Visibility is written into the contract, not granted afterwards.',
    source: SRC.privacy,
  },
  {
    id: 'host', name: 'Your hosting validator', role: 'The node that hosts a trader', sees: all,
    quote: '“Your hosting validator sees all your data.”',
    note: 'The docs call this a trust relationship and tell you to choose carefully.',
    source: SRC.core,
  },
  {
    id: 'sequencer', name: 'A sequencer', role: 'Run by Super Validators', sees: { ...none, recips: 'yes', meta: 'yes' },
    quote: '“They see metadata — recipient lists and message sizes — but not transaction content.”',
    note: 'The content is encrypted. The envelope is not.',
    source: SRC.ordering,
  },
  {
    id: 'mediator', name: 'The mediator', role: 'Run by Super Validators', sees: { ...none, recips: 'yes', verdict: 'yes' },
    quote: 'It learns which parties must be informed and their yes or no answers, not the payload.',
    note: 'A referee who counts raised hands without hearing the conversation.',
    source: SRC.ordering,
  },
  {
    id: 'other', name: 'Another validator', role: 'Hosts no party in this trade', sees: none,
    quote: '“receives nothing and learns nothing about the transaction”',
    note: 'It cannot even tell that a trade happened.',
    source: SRC.life,
  },
  {
    id: 'public', name: 'The public', role: 'You, with an explorer', sees: none,
    quote: 'Canton Coin activity that involves the network’s operator party is indexed publicly. App contracts that do not are invisible.',
    note: 'If the cash leg were Canton Coin, that transfer would show up. The bond would not.',
    source: SRC.svc,
  },
];

/* ---------- Burn-Mint Reactor ---------- */

export const ISSUANCE = [
  { from: 0, to: 0.5, label: 'Years 0 to 0.5', cap: 40, apps: 15, validators: 5, svs: 80 },
  { from: 0.5, to: 1.5, label: 'Years 0.5 to 1.5', cap: 20, apps: 40, validators: 12, svs: 48 },
  { from: 1.5, to: 5, label: 'Years 1.5 to 5', cap: 10, apps: 62, validators: 18, svs: 20 },
  { from: 5, to: 10, label: 'Years 5 to 10', cap: 5, apps: 69, validators: 21, svs: 10 },
  { from: 10, to: 14, label: 'Year 10 onward', cap: 2.5, apps: 75, validators: 20, svs: 5 },
];
/** Minting started mid-2024, so late November 2026 is about 2.4 years in. */
export const ISSUANCE_NOW = 2.4;

export const BURN_POINTS: { when: string; ratio: number; source: Source }[] = [
  { when: 'Q1 2026', ratio: 0.6, source: SRC.pill },
  { when: 'Q2 2026', ratio: 0.66, source: SRC.pill },
  { when: 'Sep 2026', ratio: 0.68, source: SRC.alea },
  { when: 'Nov 2026', ratio: 0.8, source: SRC.burnNews },
];

export const FEE = {
  pricePerMb: 60,
  typicalKb: 16.7,
  freeBytes: 400_000,
  freeWindowMin: 20,
};

export const PATCH_NOTES: { tag: string; date: string; title: string; text: string; source: Source }[] = [
  {
    tag: 'KNOWN ISSUE', date: 'mid 2025', title: 'Idle nodes were getting paid',
    text: 'With 225 validators, roughly 80% of the validator pool went to liveness rewards: about 709k CC a month each, for being online.',
    source: SRC.cip0070,
  },
  {
    tag: 'REMOVED', date: 'Sep 2025', title: 'Transfer fees',
    text: 'Coin transfer fees were switched off. The proposal notes that “the majority of burn on MainNet is due to traffic purchases”.',
    source: SRC.cip0078,
  },
  {
    tag: 'NERF', date: 'Jan 2026', title: 'App rewards capped at $1.50 per transaction',
    text: 'The proposal’s own reason: “Apps may optimize for reward farming rather than sustainable usage”.',
    source: SRC.cip0098,
  },
  {
    tag: 'REMOVED', date: '30 Apr 2026', title: 'Liveness rewards set to zero',
    text: 'The proposal counted 132M CC paid in liveness incentives over the period it reviewed. Now: “Activity rewards are now the only validator minting mechanism.”',
    source: SRC.cip0096,
  },
  {
    tag: 'NEW RULE', date: '2026', title: 'Super Validators must lock rewards',
    text: 'Super Validator weight now depends on the share of lifetime SV rewards kept locked.',
    source: SRC.cip0105,
  },
  {
    tag: 'NEW RULE', date: '2026', title: 'Featured apps post a bond',
    text: 'Each featured app locks 5M CC, asset issuers 25M CC, with a 60-day unlock.',
    source: SRC.cip0116,
  },
  {
    tag: 'UPCOMING', date: 'approved', title: 'Rewards measured from real traffic',
    text: 'Instead of apps declaring their own activity, rewards will follow measured traffic, with the featured-app cap set to 0.79.',
    source: SRC.cip0104,
  },
];

/* ---------- Validator Ring ---------- */
// Read from the MainNet configuration file on 26 November 2026 and summed by us.
export const SV_NODES: { id: string; org: string; weight: number; ghost: number; hosted: number }[] = [
  { id: 'Global-Synchronizer-Foundation', org: 'Canton Foundation', weight: 176.455, ghost: 79.25, hosted: 52 },
  { id: 'MPC-Holding-Inc', org: 'MPC Holding', weight: 61, ghost: 49.125, hosted: 12 },
  { id: 'Five-North-1', org: 'Five North', weight: 33, ghost: 27, hosted: 7 },
  { id: 'Digital-Asset-1', org: 'Digital Asset', weight: 15.925, ghost: 0, hosted: 0 },
  { id: 'Digital-Asset-2', org: 'Digital Asset', weight: 15.925, ghost: 0, hosted: 0 },
  { id: 'Cumberland-1', org: 'Cumberland', weight: 13.6125, ghost: 0, hosted: 0 },
  { id: 'Cumberland-2', org: 'Cumberland', weight: 13.6125, ghost: 0, hosted: 0 },
  { id: 'C7-Technology-Services-Limited', org: 'C7 Technology Services', weight: 10.575, ghost: 0, hosted: 2 },
  { id: 'SV-Nodeops-Limited', org: 'SV Nodeops', weight: 10.25, ghost: 0, hosted: 0 },
  { id: 'Orb-1-LP-1', org: 'Orb 1 LP', weight: 10, ghost: 0, hosted: 2 },
  { id: 'Tradeweb-Markets-1', org: 'Tradeweb Markets', weight: 10, ghost: 0, hosted: 0 },
  { id: 'Liberty-City-Ventures-1', org: 'Liberty City Ventures', weight: 10, ghost: 0, hosted: 2 },
  { id: 'Proof-Group-1', org: 'Proof Group', weight: 1.25, ghost: 0, hosted: 0 },
];
export const SV_TOTAL = 381.605;
export const SV_GHOST = 155.375;
export const VOTE_THRESHOLD = 9;

// From the appendix of the Development Fund's first report (24 August 2026), in million CC.
export const FUND = {
  approvedProjects: 42,
  committed: 290.0,
  paid: 62.2,
  digitalAsset: 57.295,
  others: 4.905,
  daProjects: 13,
  otherProjects: 10,
  rows: [
    { name: 'Canton Open Source Maintenance', who: 'Digital Asset', paid: 10 },
    { name: 'ISS-Based BFT', who: 'Digital Asset', paid: 6.5 },
    { name: 'Logical Synchronizer Upgrades', who: 'Digital Asset', paid: 6 },
    { name: 'Daml Open Source Maintenance', who: 'Digital Asset', paid: 5 },
    { name: 'Splice Open Source Maintenance', who: 'Digital Asset', paid: 5 },
    { name: 'Scalability, Performance, Robustness', who: 'Digital Asset', paid: 4.92 },
    { name: 'Token Standard V2', who: 'Digital Asset', paid: 4.8 },
    { name: 'Open-Source Validator Indexer', who: 'Digital Asset', paid: 3.9 },
    { name: 'Contract Keys', who: 'Digital Asset', paid: 3.875 },
    { name: 'Traffic-Based App Rewards', who: 'Digital Asset', paid: 3 },
    { name: 'Splice Wallet Kernel Maintenance', who: 'Digital Asset', paid: 2 },
    { name: 'dApp SDK and Tooling', who: 'Digital Asset', paid: 1.5 },
    { name: 'Wallet Gateway Reference', who: 'Digital Asset', paid: 0.8 },
    { name: 'Go SDKs and Python contributions', who: 'Noders', paid: 1 },
    { name: 'Denex Localnet', who: 'Denex', paid: 1 },
    { name: 'SV Governance dApp', who: 'Avro', paid: 0.8 },
    { name: 'Canton DevKit', who: 'Bit Dynamics', paid: 0.8 },
    { name: 'x402 Protocol Integration', who: 'FTP', paid: 0.4 },
    { name: 'CCTools', who: 'CCTools', paid: 0.375 },
    { name: 'PartyLayer', who: 'Cayvox Labs', paid: 0.2 },
    { name: 'Canton Payment Streams', who: 'Deepthi', paid: 0.15 },
    { name: 'Concordia', who: 'Unlockit', paid: 0.09 },
    { name: 'Rust SDK', who: 'NODEJUMPER', paid: 0.09 },
  ],
};

/* ---------- Headline Harbor ---------- */

export type Status = 'live' | 'oneoff' | 'pilot' | 'announced';
export const STATUS_LABEL: Record<Status, string> = {
  live: 'In production',
  oneoff: 'One-off live trade',
  pilot: 'Pilot',
  announced: 'Announced only',
};

export const HEADLINES: { text: string; status: Status; why: string; source: Source }[] = [
  {
    text: 'Broadridge runs US Treasury repo on Canton technology every day.',
    status: 'live',
    why: 'Canton’s own summary says Broadridge settles more than $300 billion in Treasury repo a day. It is the one workflow with large, sustained, published volume. Whether it runs through the shared public synchronizer is not something we could confirm.',
    source: SRC.summit,
  },
  {
    text: 'DTCC’s Tokenization Service is open for business.',
    status: 'live',
    why: 'Announced December 2025, live on 28 October 2026. It is real and it is one month old. No source we found states how much has been tokenized so far.',
    source: SRC.dtccLive,
  },
  {
    text: 'J.P. Morgan’s deposit token will be issued natively on Canton.',
    status: 'announced',
    why: 'Announced in January 2026 as a phased plan. As of 26 November 2026 we found no report of a completed issuance.',
    source: SRC.jpm,
  },
  {
    text: 'HSBC completes a tokenised deposit pilot on Canton.',
    status: 'pilot',
    why: 'The word is in the headline. The April 2026 exercise simulated issuance, transfer and atomic settlement.',
    source: SRC.hsbc,
  },
  {
    text: 'Uber moves treasury cash on-chain over a weekend.',
    status: 'pilot',
    why: 'The press release itself is titled “Uber completes pilot”. A real workflow was shown end to end. It is not a running service.',
    source: SRC.uber,
  },
  {
    text: 'US Treasuries financed against USDC, on a Saturday.',
    status: 'oneoff',
    why: 'A real transaction with real assets in August 2025, done once to prove weekend atomic settlement works. No notional amount was published.',
    source: SRC.ust,
  },
  {
    text: 'USDC-backed dollars (USDCx) can be used on Canton.',
    status: 'live',
    why: 'Live since 4 December 2025 according to Canton’s announcement. How much sits on Canton has not been published.',
    source: SRC.usdcx,
  },
  {
    text: 'Nomura and BOOSTRY will put Japanese bonds and equities on-chain.',
    status: 'announced',
    why: 'What is confirmed: a governance proposal approved them as Super Validators. The use cases were reported as something the firms “will begin examining”.',
    source: SRC.cip0130,
  },
];

export const TRILLIONS: { figure: string; claim: string; counts: string; kind: string; source: Source }[] = [
  {
    figure: '$114T', claim: 'Assets DTCC manages',
    counts: 'DTCC’s total custody. Canton says tokenization will expand to cover nearly all of it. That is a plan for the future. It is not on-chain today.',
    kind: 'A ceiling', source: SRC.leap,
  },
  {
    figure: '$30T+', claim: 'Available for on-chain use',
    counts: 'The pool of securities that is eligible to be tokenized through DTCC’s service. Eligible is not the same as tokenized.',
    kind: 'Eligibility', source: SRC.leap,
  },
  {
    figure: '$9T', claim: 'Processed monthly',
    counts: 'Canton’s own figure for the value of tokenized assets processed in a month. It is a flow, dominated by repo that rolls over daily. It is not money sitting on the network.',
    kind: 'A monthly flow', source: SRC.leap,
  },
  {
    figure: '$7.6T', claim: 'Broadridge repo in October 2026',
    counts: 'Reported monthly volume of one platform, Broadridge’s repo service. Most of the $9T comes from here, and the gap between the two has not been explained.',
    kind: 'One platform’s flow', source: SRC.sft,
  },
  {
    figure: '~$320B', claim: 'Real-world assets (rwa.xyz)',
    counts: 'Reported by a third-party tracker in its “represented” category: recorded on a ledger but not transferable outside the issuing platform.',
    kind: 'A stock, not freely movable', source: SRC.rwaNews,
  },
  {
    figure: '~$0', claim: 'Freely transferable assets',
    counts: 'The same tracker’s “distributed” category, where assets can move between wallets, was reported as showing next to nothing for Canton. Critics quote this number. It is just as true as the others, and just as partial.',
    kind: 'A different definition', source: SRC.rwa,
  },
];

/* ---------- Myth Arcade ---------- */

export const QUIZ: { claim: string; fact: boolean; why: string; source: Source }[] = [
  { claim: 'Canton uses zero-knowledge proofs to keep data private.', fact: false, why: 'The docs: “Canton does not use zero-knowledge proofs.” Privacy comes from sending data only to the parties involved.', source: SRC.m2 },
  { claim: 'Canton Coin launched with no presale.', fact: true, why: 'The white paper: “There are no presales or special pools for “founders”.”', source: SRC.ccwp },
  { claim: 'Canton Coin has a hard cap of 100 billion.', fact: false, why: 'The schedule allows up to 100 billion in ten years, then 2.5 billion a year. Canton’s own blog says there is no hard cap.', source: SRC.fdv },
  { claim: 'A Super Validator can read the transactions it puts in order.', fact: false, why: 'Sequencers “see metadata — recipient lists and message sizes — but not transaction content.”', source: SRC.ordering },
  { claim: 'The validator that hosts you can see all your data.', fact: true, why: 'The docs: “Your hosting validator sees all your data.”', source: SRC.core },
  { claim: '“Proof of Stakeholder” means you stake tokens to validate.', fact: false, why: 'A stakeholder is a party to a contract. No tokens are locked to validate.', source: SRC.consensus },
  { claim: 'About sixty Super Validators each run a node.', fact: false, why: 'The MainNet configuration file lists 13 approved node identities, run by 11 organisations. Many named Super Validators are hosted by another node.', source: SRC.svyaml },
  { claim: 'A Canton explorer shows everyone’s transactions.', fact: false, why: 'The docs: “Explorers are personal”. You see your own activity.', source: SRC.finding },
  { claim: 'Validators earn rewards simply for being online.', fact: false, why: 'That ended on 30 April 2026. “Activity rewards are now the only validator minting mechanism.”', source: SRC.cctok },
  { claim: '“Featured app” is just a marketing badge.', fact: false, why: 'It is a right to mint rewards, and it now requires locking 5 million CC.', source: SRC.cip0116 },
  { claim: 'Once a Canton transaction is committed, it cannot be rolled back.', fact: true, why: 'The docs: “There are no forks, reorganizations, or rollbacks.”', source: SRC.life },
  { claim: 'The Canton Foundation pays bug bounties.', fact: false, why: 'Its policy: “We do not offer a bug bounty program and compensation requests will not be considered.”', source: SRC.disclosure },
];

/* ---------- Archive Tunnel ---------- */

export const TIMELINE: { date: string; year: number; title: string; text: string; source: Source }[] = [
  { date: 'Nov 2022', year: 2022, title: 'A public setback', text: 'Australia’s stock exchange was reported to have cancelled its project to replace a core system with technology from Digital Asset, the company behind Canton.', source: SRC.register },
  { date: '9 May 2023', year: 2023, title: 'Canton Network announced', text: 'Announced with 30 named participants from finance and technology.', source: SRC.launch },
  { date: '12 Mar 2024', year: 2024, title: 'The big pilot', text: 'A test-network pilot with 22 apps and more than 350 simulated transactions in four days.', source: SRC.pilot },
  { date: '1 Jul 2024', year: 2024, title: 'Go-live', text: 'The Global Synchronizer and Canton Coin went live. Minting began with it.', source: SRC.goLive },
  { date: '31 Mar 2025', year: 2025, title: 'A token standard', text: 'CIP-0056, the Canton Network Token Standard, was approved.', source: SRC.cip0056 },
  { date: '12 Aug 2025', year: 2025, title: 'A Saturday trade', text: 'The first fully on-chain US Treasury financing against USDC was announced, done outside market hours.', source: SRC.ust },
  { date: '22 Sep 2025', year: 2025, title: 'A new name', text: 'The Global Synchronizer Foundation became the Canton Foundation.', source: SRC.rename },
  { date: '10 Nov 2025', year: 2025, title: 'Canton Coin trades', text: 'Spot trading of CC was reported to have begun on exchanges.', source: SRC.lukka },
  { date: '4 Dec 2025', year: 2025, title: 'Dollars arrive', text: 'USDCx, backed by USDC, went live on Canton.', source: SRC.usdcx },
  { date: '17 Dec 2025', year: 2025, title: 'DTCC says yes', text: 'DTCC announced it would tokenize US Treasuries it holds in custody on Canton.', source: SRC.dtccAnnounce },
  { date: '19 Feb 2026', year: 2026, title: 'A fund for builders', text: 'The Protocol Development Fund opened.', source: SRC.fundLaunch },
  { date: '28 Oct 2026', year: 2026, title: 'DTCC service live', text: 'The DTCC Tokenization Service went live.', source: SRC.dtccLive },
  { date: '3 Nov 2026', year: 2026, title: 'A letter from the SEC staff', text: 'Canton announced a staff no-action letter that treats Canton Coin as a digital commodity. It is a staff position, not a ruling.', source: SRC.secPr },
  { date: '7 Nov 2026', year: 2026, title: 'Upgrade without downtime', text: 'MainNet moved to protocol version 36 through a logical synchronizer upgrade.', source: SRC.lsu },
  { date: '24 Nov 2026', year: 2026, title: 'Auditors wanted', text: 'The Foundation asked security audit firms for quotes.', source: SRC.auditors },
];

export const RENAMES: { old: string; now: string; note: string }[] = [
  { old: 'Domain', now: 'Synchronizer', note: 'Same thing. Older docs and articles say “domain”.' },
  { old: 'Global Synchronizer Foundation (GSF)', now: 'Canton Foundation', note: 'September 2025. The Foundation called it “a change in name only”.' },
  { old: 'Domain transfer', now: 'Reassignment', note: 'Moving a contract from one synchronizer to another.' },
  { old: 'Amulet', now: 'Canton Coin', note: 'Not a rename, a code name: the open-source software calls the coin Amulet.' },
  { old: 'Participant node', now: 'Validator', note: 'A validator is a participant node plus the validator app.' },
];
