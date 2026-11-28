// Every fact shown in the game lives in this file, next to its source.
// "primary" sources were read directly (official docs, CIP texts, the MainNet
// configuration file, Foundation pages). "reported" sources are third-party
// coverage that could not be opened in full and are worded as reports.
import type { StationId } from '../art/palette';
import type { FilmId } from '../exhibits/films';

export type WidgetId =
  | 'glossary' | 'lifecycle' | 'whosees' | 'issuance' | 'burnmint' | 'fee' | 'patchnotes'
  | 'vote' | 'weights' | 'fund' | 'ladder' | 'trillions' | 'quiz' | 'timeline' | 'renames'
  | 'sources' | 'certificate';

export type IconId =
  | 'globe' | 'cast' | 'steps' | 'stake' | 'eye' | 'lock' | 'note' | 'scale' | 'chart' | 'coin'
  | 'flame' | 'bill' | 'patch' | 'nodes' | 'bars' | 'money' | 'doc' | 'shield' | 'ship' | 'digits'
  | 'layers' | 'quiz' | 'boot' | 'clock' | 'tag' | 'method' | 'gap' | 'book' | 'medal';

export interface Source {
  label: string;
  url: string;
  kind: 'primary' | 'reported';
}

export interface Exhibit {
  id: string;
  title: string;
  kicker: string;
  icon: IconId;
  body: string[];
  widget?: WidgetId;
  /** A short animated film shown at the top of the exhibit. */
  film?: FilmId;
  /** Extra paragraphs behind a "Dig deeper" fold. */
  more?: string[];
  sources: Source[];
}

export interface Station {
  id: StationId;
  name: string;
  tagline: string;
  intro: string;
  exhibits: Exhibit[];
}

const DOCS = 'https://docs.canton.network';
const CIPS = 'https://raw.githubusercontent.com/canton-foundation/cips/main';
const p = (label: string, url: string): Source => ({ label, url, kind: 'primary' });
const r = (label: string, url: string): Source => ({ label, url, kind: 'reported' });
const cip = (n: string, title: string): Source => p(`CIP-${n}: ${title}`, `${CIPS}/cip-${n}/cip-${n}.md`);

export const SRC = {
  arch: p('Canton docs: Architecture', `${DOCS}/overview/learn/architecture`),
  core: p('Canton docs: Core Concepts', `${DOCS}/overview/understand/core-concepts`),
  gs: p('Canton docs: The Global Synchronizer', `${DOCS}/overview/understand/global-synchronizer`),
  life: p('Canton docs: Transaction Lifecycle', `${DOCS}/overview/reference/transaction-lifecycle`),
  privacy: p('Canton docs: Privacy Model', `${DOCS}/overview/learn/privacy-model`),
  ordering: p('Canton docs: Ordering Consensus', `${DOCS}/overview/reference/ordering-consensus`),
  svc: p('Canton docs: Super Validator Components', `${DOCS}/overview/reference/super-validator-components`),
  consensus: p('Canton docs: Smart Contract Consensus', `${DOCS}/overview/reference/smart-contract-consensus`),
  m2: p('Canton docs: How Canton privacy differs', `${DOCS}/appdev/modules/m2-privacy-differences`),
  multi: p('Canton docs: Multi-synchronizer', `${DOCS}/overview/learn/multi-synchronizer`),
  traffic: p('Canton docs: Synchronizer traffic', `${DOCS}/global-synchronizer/deployment/synchronizer-traffic`),
  tokgs: p('Canton docs: Tokenomics of the Global Synchronizer', `${DOCS}/overview/reference/tokenomics-of-gs`),
  cctok: p('Canton docs: Canton Coin tokenomics', `${DOCS}/overview/reference/canton-coin-tokenomics`),
  scal: p('Canton docs: Network Scalability', `${DOCS}/global-synchronizer/production-operations/scalability`),
  lsu: p('Canton docs: November 2026 upgrade recovery guide', `${DOCS}/global-synchronizer/production-operations/validator-recovery-november-2026-lsu`),
  rel370: p('Canton docs: Canton 3.7.0 release notes', `${DOCS}/global-synchronizer/release-notes/canton-releases/3-7-0`),
  svgov: p('Canton docs: SV governance reference', `${DOCS}/overview/reference/sv-governance-reference.md`),
  finding: p('Canton docs: Finding apps', `${DOCS}/integrations/apps/finding-apps`),
  cns: p('Canton docs: Canton Name Service', `${DOCS}/overview/reference/canton-name-service`),
  index: p('Canton docs: index', `${DOCS}/llms.txt`),
  svyaml: p('MainNet approved Super Validator identities (config file)', 'https://raw.githubusercontent.com/canton-foundation/configs/main/configs/MainNet/approved-sv-id-values.yaml'),
  cipIndex: p('CIP index (README)', `${CIPS}/README.md`),
  fund: p('Canton Foundation: Protocol Development Fund, the first report', 'https://canton.foundation/protocol-development-fund-the-first-report/'),
  auditors: p('Canton Foundation: Calling All Security Auditors', 'https://canton.foundation/calling-all-security-auditors-help-us-strengthen-canton/'),
  disclosure: p('Canton Foundation: Responsible Disclosure', 'https://canton.foundation/responsible-disclosure'),
  rename: p('Canton Foundation: The GSF is now Canton Foundation', 'https://canton.foundation/the-gsf-is-now-canton-foundation/'),
  fundLaunch: p('Canton Foundation: Protocol Development Fund launch', 'https://canton.foundation/canton-foundation-launches-protocol-development-fund/'),
  grants: p('Canton Foundation: Community Research Grants', 'https://canton.foundation/introducing-the-canton-community-research-grants/'),
  ccwp: p('Canton Coin white paper', 'https://www.canton.network/hubfs/Canton%20Network%20Files/Documents%20%28whitepapers%2C%20etc...%29/Canton%20Coin_%20A%20Canton-Network-native%20payment%20application.pdf'),
  mica: p('Canton Coin MiCA white paper', 'https://www.canton.network/hubfs/Canton%20Network%20Files/whitepapers/Canton%20Coin%20%20-%20MiCA%20Whitepaper.pdf'),
  fdv: p('canton.network: How should we think about FDV?', 'https://www.canton.network/blog/canton-coin-how-should-we-think-about-fdv'),
  faqpdf: p('Canton Network FAQ (PDF)', 'https://www.canton.network/hubfs/Canton_network_faq_Final.pdf'),
  leap: p('canton.network: One Giant Leap', 'https://www.canton.network/blog/one-giant-leap'),
  slipsheet: p('Canton slipsheet, 22 July 2026', 'https://www.canton.network/hubfs/Onchain%20RWAs%20and%20Financing%2c%20Slipsheet%2c%202026-07-22.pdf'),
  usdcx: p('canton.network: USDCx now live on Canton', 'https://www.canton.network/blog/usdcx-now-live-on-canton-unlocking-private-and-composable-usdc-backed-settlement'),
  dtccLive: p('DTCC Tokenization Service goes live (announcement text)', 'https://www.canton.network/news/dtcc-tokenization-service-goes-live-marking-major-milestone-in-the-adoption-of-digital-assets'),
  dtccAnnounce: p('DTCC and Digital Asset partnership announcement', 'https://www.canton.network/canton-network-press-releases/dtcc-and-digital-asset-partner-to-tokenize-dtc-custodied-u.s.-treasury-securities-on-the-canton-network'),
  jpm: p("canton.network: J.P. Morgan's deposit token to be issued natively", 'https://www.canton.network/news/j.p.-morgans-deposit-token-to-be-issued-natively-on-canton-network'),
  hsbc: p('canton.network: HSBC completes tokenised deposit pilot', 'https://www.canton.network/news/hsbc-completes-tokenised-deposit-pilot-on-canton-network'),
  uber: p('Uber completes pilot (press release)', 'https://www.canton.network/canton-network-press-releases/uber-completes-pilot-of-a-first-ever-on-chain-liquidity-and-settlement-solution-on-a-public-network'),
  ust: p('On-chain US Treasury financing (press release)', 'https://www.canton.network/canton-network-press-releases/digital-asset-complete-on-chain-us-treasury-financing'),
  summit: p('canton.network: Canton Summit 2026 takeaways', 'https://www.canton.network/blog/canton-summit-2026-takeaways'),
  launch: p('Canton Network launch announcement, 9 May 2023', 'https://www.canton.network/canton-network-press-releases/canton-network-press-release'),
  goLive: p('Global Synchronizer and Canton Coin go live', 'https://www.canton.network/canton-network-press-releases/the-canton-networks-global-synchronizer-and-canton-coin-go-live'),
  pilot: p('Canton Network pilot announcement, March 2024', 'https://www.canton.network/canton-network-press-releases/the-canton-network-completes-the-most-comprehensive-blockchain-pilot-to-date-for-tokenized-real-world-assets'),
  secPr: p('Canton announcement on the SEC staff letter', 'https://www.canton.network/canton-network-press-releases/sec-recognizes-canton-coin-as-a-digital-commodity-providing-additional-regulatory-clarity-for-institutional-adoption'),
  bondShare: p('canton.network: digital bond issuance share', 'https://www.canton.network/blog/canton-network-accounts-for-over-half-of-all-digital-bond-issuances'),
  cip0033: cip('0033', 'Add Strange Pixels as a Tier 4 SV (rejected)'),
  cip0045: cip('0045', 'SV self-hosting rules'),
  cip0056: cip('0056', 'Canton Network Token Standard'),
  cip0067: cip('0067', 'Unclaimed rewards to the Foundation'),
  cip0070: cip('0070', 'Validator liveness rewards'),
  cip0078: cip('0078', 'Canton Coin Fee Removal'),
  cip0082: cip('0082', 'Development Fund'),
  cip0083: cip('0083', 'DTCC as Super Validator'),
  cip0096: cip('0096', 'Phasing out liveness rewards'),
  cip0098: cip('0098', 'Cap per-transaction app rewards at $1.50'),
  cip0104: cip('0104', 'Traffic-Based App Rewards'),
  cip0105: cip('0105', 'SV Locking and Long-Term Commitment'),
  cip0116: cip('0116', 'Featured app locking'),
  cip0129: cip('0129', 'Universal Burn'),
  cip0130: cip('0130', 'Nomura and BOOSTRY as Super Validators'),
  cip0132: cip('0132', 'Paymaster model for Universal Burn'),
  cip0000: cip('0000', 'The CIP process'),
  cointelegraph: r('Cointelegraph (reported, April 2026)', 'https://cointelegraph.com/news/canton-zksync-clash-blockchains-enforce-rules'),
  sft: r('Securities Finance Times (reported)', 'https://www.securitiesfinancetimes.com/securitieslendingnews/repoarticle.php?article_id=229129'),
  rwa: r('rwa.xyz, Broadridge DLR (reported)', 'https://app.rwa.xyz/platforms/broadridge-dlr'),
  rwaNews: r('cryptonews.net on rwa.xyz figures (reported)', 'https://cryptonews.net/news/altcoins/33716778/'),
  burnNews: r('cryptonews.net / Decrypt on burn totals (reported)', 'https://cryptonews.net/news/altcoins/33761908/'),
  pill: r('The Learning Pill (reported)', 'https://thelearningpill.substack.com/p/is-cantons-token-meant-to-lag'),
  alea: r('Alea Research (reported)', 'https://alearesearch.substack.com/p/canton-universal-burn'),
  register: r('The Register on ASX (reported)', 'https://www.theregister.com/2022/11/17/asx_blockchain_reading_project_paused/'),
  nomuraNews: r('FX News Group on Nomura, NRI and BOOSTRY (reported)', 'https://fxnewsgroup.com/forex-news/institutional/nomura-holdings-nomura-research-institute-and-boostry-to-collaborate-on-development-of-on-chain-finance/'),
  lukka: r('Lukka on the first CC listings (reported)', 'https://lukka.tech/canton-coin-goes-live-how-lukka-powers-the-institutional-infrastructure-behind-tokenized-markets/'),
};

export const AS_OF = '26 November 2026';

export const STATIONS: Station[] = [
  {
    id: 'welcome',
    name: 'Welcome Dome',
    tagline: 'Canton 101: what is this thing?',
    intro: 'Start here. Four short exhibits explain what Canton is before you explore the rest of the base.',
    exhibits: [
      {
        id: 'w1', film: 'chain', title: 'Not one chain', kicker: 'THE BIG IDEA', icon: 'globe',
        body: [
          'Most blockchains are a single shared ledger that every node copies. Canton is built the other way round, as a **network of networks**.',
          'The official docs say it in two sentences: “Canton separates coordination from storage. Synchronizers coordinate transaction ordering; participant nodes (validators) store data for their hosted parties.”',
          'So no computer anywhere holds the whole ledger. Each institution keeps its own contracts. What they share is a service that puts encrypted messages in order. In the docs’ words: “Unlike Ethereum where every node stores all state, Canton nodes store only their parties’ data.”',
        ],
        more: [
          'The docs describe the synchronizer as “a coordination layer, not a state storage layer. It never stores or has access to transaction data, only encrypted messages and confirmation results.”',
          'A consequence people miss: there is no single place to look up “the state of Canton”. A question such as “how many of this token exist?” can only be answered by the parties who hold the relevant contracts.',
        ],
        sources: [SRC.arch],
      },
      {
        id: 'w2', title: 'Cast of characters', kicker: 'WHO IS WHO', icon: 'cast', widget: 'glossary',
        body: ['Eight words unlock almost every Canton document. Tap a card to flip it.'],
        sources: [SRC.core, SRC.arch, SRC.gs, SRC.svc, SRC.ordering],
      },
      {
        id: 'w3', film: 'journey', title: 'Life of a transaction', kicker: 'FIVE STEPS', icon: 'steps', widget: 'lifecycle',
        body: [
          'A Canton transaction is split into encrypted pieces called **views**. Each piece goes only to the parties with a stake in it. The docs sum it up: “No single node ever sees the full transaction in the clear.”',
          'Once the verdict is delivered, it is final: “There are no forks, reorganizations, or rollbacks.”',
        ],
        more: [
          'Confirmation is strict: “A single signatory failing its threshold is enough to reject the entire transaction.” A deal either happens for everyone involved, or for no one.',
          'This is also why a contract depends on its signatories being reachable. If the nodes that host them are offline, nothing involving that contract can be confirmed.',
        ],
        sources: [SRC.life],
      },
      {
        id: 'w4', film: 'stake', title: 'Stake without staking', kicker: 'A NAME THAT MISLEADS', icon: 'stake',
        body: [
          'Canton calls its consensus **Proof of Stakeholder**. It sounds like proof of stake. It is not.',
          'Nobody locks tokens to validate. A “stakeholder” is a party that signed or observes a contract. The docs: “only the participant nodes hosting parties with a stake in the affected contracts participate in validation and confirmation.”',
          'The result is two layers. Stakeholders confirm the content of a transaction among themselves. Underneath, a set of Super Validators agrees only on the order of the encrypted messages.',
        ],
        sources: [SRC.consensus],
      },
    ],
  },
  {
    id: 'privacy',
    name: 'Privacy Observatory',
    tagline: 'One trade, seven witnesses: who sees what?',
    intro: 'Canton sells privacy. Look through each lens of the telescope to see exactly what that covers and what it does not.',
    exhibits: [
      {
        id: 'p1', title: 'Case file: one trade, seven witnesses', kicker: 'INTERACTIVE', icon: 'eye', widget: 'whosees',
        body: ['Meridian Bank sells a tokenized bond to Harbor Fund for cash. Pick a witness and see which lines of the case file stay readable.'],
        sources: [SRC.privacy, SRC.core, SRC.life, SRC.ordering, SRC.svc],
      },
      {
        id: 'p2', film: 'share', title: 'No zero-knowledge here', kicker: 'HOW THE PRIVACY WORKS', icon: 'lock',
        body: [
          'Many people assume a privacy chain must run on zero-knowledge proofs. Canton’s own docs say otherwise: “Canton does not use zero-knowledge proofs. Instead, privacy is achieved through selective data distribution.”',
          'In plain words, your data is private because it is never sent to anyone who is not part of the deal. The docs describe a node that hosts no stakeholder as one that “receives nothing and learns nothing about the transaction.”',
          'This is privacy by not sharing, rather than privacy by mathematics.',
        ],
        sources: [SRC.m2, SRC.life],
      },
      {
        id: 'p3', film: 'envelope', title: 'The metadata footnote', kicker: 'READ THE SMALL PRINT', icon: 'note',
        body: [
          'The privacy page promises “No metadata leakage about parties not entitled to see an action”. That sentence is about other participants: they cannot even tell that you traded.',
          'The infrastructure is a separate question, and a different page answers it. Sequencers “see metadata — recipient lists and message sizes — but not transaction content.” On the Global Synchronizer, sequencers are run by the Super Validators.',
          '**The takeaway:** what you traded stays hidden from the network operators. That a message went to certain nodes, when, and how large it was, does not. Both statements are true at once, and most explainers quote only the first.',
        ],
        more: [
          'The same reference page lists what a sequencer does: it gives every batch of messages a position in one total order, forwards “opaque (encrypted) messages”, and “never holds decryption keys”.',
          'Why does the envelope matter if the letter is sealed? Because patterns can be informative on their own: who exchanges messages with whom, how often, and how large they are.',
        ],
        sources: [SRC.privacy, SRC.ordering],
      },
      {
        id: 'p4', film: 'host', title: 'The price of privacy', kicker: 'TRADE-OFFS', icon: 'scale',
        body: [
          '**You trust your host.** The docs are blunt: “Your hosting validator sees all your data.”',
          '**There is no global state to check.** “There is no shared global state that could be queried or leaked.” That protects secrets, and it also means an outsider cannot independently verify, say, the total supply of a private asset.',
          '**Public verifiability is not there yet.** Cointelegraph reported in April 2026 that Digital Asset’s CEO acknowledged Canton does not have public verifiability and said the team plans to add it. No design or date had been published as of ' + '26 November 2026.',
        ],
        sources: [SRC.core, SRC.privacy, SRC.cointelegraph],
      },
    ],
  },
  {
    id: 'reactor',
    name: 'Burn-Mint Reactor',
    tagline: 'Canton Coin: how it is minted, burned and patched.',
    intro: 'Fees burn Canton Coin. Rewards mint it. Step up to the core and watch the two sides.',
    exhibits: [
      {
        id: 'r1', film: 'steps', title: 'The mint schedule', kicker: 'INTERACTIVE', icon: 'chart', widget: 'issuance',
        body: ['A new mining round opens every 10 minutes. How much may be minted, and who gets it, changes in steps. Drag the slider through the years.'],
        sources: [SRC.ccwp, SRC.tokgs, SRC.cip0082],
      },
      {
        id: 'r2', film: 'cap', title: 'Fair launch, with footnotes', kicker: 'SUPPLY', icon: 'coin',
        body: [
          'The white paper is clear about the start: “There are no presales or special pools for “founders”.” Every coin has been minted by taking part in the network.',
          '**Footnote 1: there is no hard cap.** The schedule allows up to 100 billion CC in the first ten years and 2.5 billion a year after that. Canton’s own blog corrects the common belief in a fixed maximum supply: actual supply is what was minted minus what was burned.',
          '**Footnote 2: the Foundation did receive coins later.** A 2025 proposal sent it an expected 1.6 to 1.7 billion CC of unclaimed rewards, and since 2025 it administers a Development Fund fed by 5% of future emission.',
        ],
        sources: [SRC.ccwp, SRC.fdv, SRC.cip0067, SRC.cip0082],
      },
      {
        id: 'r3', film: 'furnace', title: 'Burn versus mint', kicker: 'THE SCOREBOARD', icon: 'flame', widget: 'burnmint',
        body: [
          'The design target is a balance: “network usage must burn 2.5 billion Canton Coins per year” for supply to hold steady in the long run. Fees are priced in US dollars and paid by burning CC.',
          'So far minting has stayed ahead of burning. The gauge shows the ratios that third parties have reported.',
        ],
        sources: [SRC.ccwp, SRC.cip0078, SRC.pill, SRC.alea, SRC.burnNews],
      },
      {
        id: 'r4', film: 'bytes', title: 'Anatomy of a $1 transaction', kicker: 'INTERACTIVE', icon: 'bill', widget: 'fee',
        body: ['Canton does not charge gas. It charges for **traffic**: the bytes your validator sends to be put in order. “The sending validator is charged; recipients are not.”'],
        sources: [SRC.cip0129, SRC.traffic, SRC.tokgs],
      },
      {
        id: 'r5', film: 'patches', title: 'Patch notes: the war on reward farming', kicker: 'CHANGELOG', icon: 'patch', widget: 'patchnotes',
        body: ['Early rewards were generous on purpose, and people optimised for them. Governance has been patching the rules ever since. These are the release notes, taken from the proposals themselves.'],
        sources: [SRC.cip0070, SRC.cip0078, SRC.cip0096, SRC.cip0098, SRC.cip0104, SRC.cip0105, SRC.cip0116, SRC.cctok],
      },
    ],
  },
  {
    id: 'ring',
    name: 'Validator Ring',
    tagline: 'Governance: thirteen votes, about sixty names.',
    intro: 'Who actually runs the Global Synchronizer? Count the seats, then follow the money.',
    exhibits: [
      {
        id: 'g1', film: 'votes', title: 'Thirteen seats at the table', kicker: 'INTERACTIVE', icon: 'nodes', widget: 'vote',
        body: [
          'Headlines speak of 50 or 60 Super Validators. The MainNet configuration file lists **13 approved node identities, run by 11 organisations**. Two organisations run two nodes each.',
          'Votes are one per node. Try to pass a proposal.',
        ],
        sources: [SRC.svyaml, SRC.svgov, SRC.faqpdf],
      },
      {
        id: 'g2', film: 'ghosts', title: 'Weight is not votes', kicker: 'OUR COUNT FROM THE CONFIG FILE', icon: 'bars', widget: 'weights',
        body: [
          'Each node also carries **reward weight**, which decides how Super Validator rewards are split. Weight and votes are different things: the docs say the Foundation’s node “carries the same voting weight as any other SV.”',
          'We added up the weights in the public configuration file. One node hosts rewards on behalf of dozens of organisations, and a large slice of all weight sits in entries the file itself labels “ghost” or “escrow”: weight promised to big names against milestones not yet met.',
        ],
        sources: [SRC.svyaml, SRC.svgov, SRC.cip0083, SRC.cip0045],
      },
      {
        id: 'g3', film: 'jars', title: 'Follow the money', kicker: 'OUR COUNT FROM THE FIRST REPORT', icon: 'money', widget: 'fund',
        body: [
          'Five percent of future Canton Coin emission goes to a Protocol Development Fund. Its first report, in August 2026, lists every project that had been paid.',
          'We summed the appendix by recipient.',
        ],
        sources: [SRC.fund, SRC.cip0082, SRC.fundLaunch],
      },
      {
        id: 'g4', film: 'cips', title: 'How a rule changes', kicker: 'THE CIP PROCESS', icon: 'doc',
        body: [
          'Changes go through **Canton Improvement Proposals**. A proposal needs Super Validator backing, then a vote, then it is applied on-chain.',
          'The public index listed **121 proposals** when we counted: 56 final, 44 approved, 8 active, 3 proposed, 3 replaced, 1 obsolete, 5 withdrawn and exactly **1 rejected** (CIP-0033, a request to add a small Super Validator).',
          'One rejection in 121 does not mean nothing is contested. Disputed ideas tend to be withdrawn before a vote, so the withdrawn list is the better guide to what was controversial.',
        ],
        sources: [SRC.cipIndex, SRC.cip0000, SRC.cip0033],
      },
      {
        id: 'g5', film: 'audit', title: 'Security desk', kicker: 'AUDITS AND BOUNTIES', icon: 'shield',
        body: [
          'On 24 November 2026 the Foundation published “Calling All Security Auditors”, a request for quotes from audit firms covering core components.',
          'Two documents give the context. The Foundation’s disclosure policy states: “We do not offer a bug bounty program and compensation requests will not be considered.” And in the Canton Coin MiCA white paper, field H.8, “Audit”, reads **false**.',
          'A fair reading: an external audit programme is now starting, and it is starting after the network went live. That is worth knowing, and worth watching.',
        ],
        sources: [SRC.auditors, SRC.disclosure, SRC.mica],
      },
    ],
  },
  {
    id: 'harbor',
    name: 'Headline Harbor',
    tagline: 'Announced, pilot or live? Sort the cargo.',
    intro: 'Big names arrive here every week. The skill is telling an announcement from a service that is running.',
    exhibits: [
      {
        id: 'h1', title: 'Announced, pilot or live?', kicker: 'MINI-GAME', icon: 'ship', widget: 'ladder',
        body: ['Eight real Canton headlines are waiting on the dock. Put each one on the right shelf.'],
        sources: [SRC.summit, SRC.dtccLive, SRC.jpm, SRC.hsbc, SRC.uber, SRC.ust, SRC.usdcx, SRC.cip0130, SRC.nomuraNews],
      },
      {
        id: 'h2', film: 'tub', title: 'The trillions decoder', kicker: 'SIX NUMBERS, ONE NETWORK', icon: 'digits', widget: 'trillions',
        body: ['Canton is described with numbers from zero to 114 trillion dollars. They are not in conflict. They count different things. Flip each card.'],
        sources: [SRC.leap, SRC.sft, SRC.rwaNews, SRC.rwa],
      },
      {
        id: 'h3', film: 'three', title: '“On Canton” means three things', kicker: 'WATCH THE WORDING', icon: 'layers',
        body: [
          '**1. Built with Canton technology.** Several bank platforms use Canton or Daml software on their own private ledgers. That is real adoption of the technology, though it is not activity on the shared public network.',
          '**2. Running on the Global Synchronizer.** These are the apps that can settle with each other atomically. This is the part that makes Canton a network.',
          '**3. Being a member or a validator.** Joining the Foundation or running a node says nothing about volume.',
          'When a headline says “on Canton”, ask which of the three it means. For example, Canton’s own claim about digital bonds counts “Canton-connected platforms”, which is a statement about category 1.',
        ],
        sources: [SRC.bondShare, SRC.gs],
      },
    ],
  },
  {
    id: 'arcade',
    name: 'Myth Arcade',
    tagline: 'Twelve claims. Myth or fact?',
    intro: 'Insert coin. Every answer comes with its source, so you can check the machine.',
    exhibits: [
      {
        id: 'a1', title: 'Myth or fact?', kicker: 'QUIZ', icon: 'quiz', widget: 'quiz',
        body: ['Twelve statements you will meet in Canton threads. Call each one.'],
        sources: [SRC.m2, SRC.ccwp, SRC.fdv, SRC.ordering, SRC.core, SRC.consensus, SRC.svyaml, SRC.finding, SRC.cctok, SRC.cip0116, SRC.life, SRC.leap, SRC.disclosure],
      },
      {
        id: 'a2', title: 'First steps for humans', kicker: 'IF YOU TRY IT YOURSELF', icon: 'boot',
        body: [
          '**Your address is a party ID.** It looks like a name, two colons and a long fingerprint. It is longer than the addresses you may know from other chains.',
          '**Explorers are personal.** The docs say it directly: “Explorers are personal”. You see your own activity, and you do not get a public feed of everyone’s trades. Canton Coin balances and transfers are the main public exception.',
          '**Someone hosts you.** A wallet lives on a validator. Holding your own signing key protects your authority to sign. The validator that hosts your party still sees your data.',
          '**Fees aim at about a dollar.** A proposal approved in 2026 describes current pricing as “about $1 per transaction” and calls that too high for high-volume use.',
        ],
        sources: [SRC.finding, SRC.core, SRC.cip0129],
      },
    ],
  },
  {
    id: 'archive',
    name: 'Archive Tunnel',
    tagline: 'From a 2023 announcement to a live network.',
    intro: 'Walk the tunnel. Each lamp is a dated event with a document behind it.',
    exhibits: [
      {
        id: 't1', title: 'The long road', kicker: 'TIMELINE', icon: 'clock', widget: 'timeline',
        body: ['Scroll through the dated milestones. Every entry links to the announcement or proposal that records it.'],
        sources: [SRC.launch, SRC.pilot, SRC.goLive, SRC.cip0056, SRC.ust, SRC.rename, SRC.usdcx, SRC.dtccAnnounce, SRC.fundLaunch, SRC.dtccLive, SRC.secPr, SRC.lsu, SRC.auditors, SRC.register, SRC.lukka],
      },
      {
        id: 't2', title: 'Names that changed', kicker: 'A DECODER FOR OLD ARTICLES', icon: 'tag', widget: 'renames',
        body: ['Canton has renamed several things. If an older article confuses you, this table is probably why.'],
        sources: [SRC.rename, SRC.index, SRC.gs, SRC.multi],
      },
    ],
  },
  {
    id: 'library',
    name: 'Library',
    tagline: 'Method, limits and every source.',
    intro: 'Research should show its working. This is where ours lives.',
    exhibits: [
      {
        id: 'l1', title: 'How this was made', kicker: 'METHOD', icon: 'method',
        body: [
          'Lunar Ledger is an independent, unofficial piece of community research about the Canton Network. It is not affiliated with or endorsed by the Canton Foundation or Digital Asset.',
          'Every claim in the base is tied to a document. Where we quote, the words were checked against the official docs, the proposal texts, the white papers or the Foundation’s pages as they stood on ' + '26 November 2026.',
          'Three numbers are **our own arithmetic** on public files: the 13 node identities and their weight shares, the share of weight in ghost or escrow entries, and the split of Development Fund payments. The Validator Ring shows the inputs so you can redo the sums.',
          'Sources marked **reported** are third-party coverage we could not open in full. They are worded as reports and never as established fact.',
        ],
        sources: [SRC.svyaml, SRC.fund, SRC.grants],
      },
      {
        id: 'l2', title: 'What we could not verify', kicker: 'LIMITS', icon: 'gap',
        body: [
          '**Market data.** Prices, supply and burn totals move daily and came to us only through third-party reports, so the base shows very few of them.',
          '**Vote tallies.** The configuration file shows who can vote, and it does not show how each vote went.',
          '**Live weights.** The configuration file is an onboarding reference. On-chain weights can differ from it.',
          '**Private activity.** By design, nobody outside a trade can measure it. Volume figures for institutional platforms come from the platforms themselves.',
          'If you find an error, tell us. A correction is a contribution.',
        ],
        sources: [SRC.svyaml, SRC.finding],
      },
      {
        id: 'l3', title: 'Every source', kicker: 'BIBLIOGRAPHY', icon: 'book', widget: 'sources',
        body: ['All documents cited anywhere in the base, in one list.'],
        sources: [],
      },
      {
        id: 'l4', title: 'Researcher certificate', kicker: 'YOUR FIELD RECORD', icon: 'medal', widget: 'certificate',
        body: ['Your stamps, shards and scores, on one card you can save.'],
        sources: [],
      },
    ],
  },
];

export interface Shard { id: string; text: string; source: Source }

/** Collectible starlight shards scattered across the surface: one fact each. */
export const SHARDS: Shard[] = [
  { id: 's1', text: 'A mining round opens every 10 minutes. That is roughly 52,560 rounds a year.', source: SRC.tokgs },
  { id: 's2', text: 'The docs state that MainNet has never been reset.', source: SRC.index },
  { id: 's3', text: 'Inside the open-source code, Canton Coin goes by another name: Amulet.', source: SRC.gs },
  { id: 's4', text: 'Names in the Canton Name Service end in “.unverified.cns”.', source: SRC.cns },
  { id: 's5', text: 'Of 121 improvement proposals in the public index, exactly one was rejected.', source: SRC.cipIndex },
  { id: 's6', text: 'Every validator gets free traffic: a burst of 400,000 bytes that refills over 20 minutes.', source: SRC.traffic },
  { id: 's7', text: 'A participant node is documented to support up to 1 million parties.', source: SRC.scal },
  { id: 's8', text: 'There is no half-way Super Validator. The docs: “There is no partial SV deployment.”', source: SRC.svc },
  { id: 's9', text: 'A Daml transaction runs on a single synchronizer. Contracts on another one must be reassigned first.', source: SRC.multi },
  { id: 's10', text: 'If one required signatory fails to confirm, the whole transaction is rejected.', source: SRC.life },
  { id: 's11', text: 'With 225 validators online, one proposal noted each earned roughly 709,000 CC a month just for being live. That reward is now zero.', source: SRC.cip0070 },
  { id: 's12', text: 'A featured app must lock 5 million CC. An asset issuer must lock 25 million.', source: SRC.cip0116 },
  { id: 's13', text: 'MainNet moved to protocol version 36 in the November 2026 upgrade.', source: SRC.lsu },
  { id: 's14', text: 'The Foundation’s node hosts reward weight for 52 beneficiary entries in the MainNet configuration file.', source: SRC.svyaml },
  { id: 's15', text: 'One early proposal named the problem out loud: shared hosting was “creating a bit of a free rider problem”.', source: SRC.cip0045 },
  { id: 's16', text: 'Canton says it handles about 1.7 million transactions a day. That averages near 20 per second.', source: SRC.leap },
];

export function exhibitById(id: string): { station: Station; exhibit: Exhibit } | null {
  for (const s of STATIONS) {
    const e = s.exhibits.find((x) => x.id === id);
    if (e) return { station: s, exhibit: e };
  }
  return null;
}
export const TOTAL_EXHIBITS = STATIONS.reduce((n, s) => n + s.exhibits.length, 0);
