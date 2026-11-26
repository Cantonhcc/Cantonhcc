# Canton Network: application ecosystem, user/developer experience, competition, criticism, community and existing content (as of 26 November 2026)

**How to read these notes (method and limits).** Pages on `canton.foundation`, `www.canton.network`, `docs.canton.network` and `raw.githubusercontent.com` were fetched and read in full on 26 Nov 2026; these are marked **[fetched]**. Every other host was unreachable from this machine, so findings from those hosts rest on web-search result summaries of the page and are marked **[search]**; wording and numbers from **[search]** items should be re-checked against the original page before being quoted. `cantonecosystem.com` (the official app directory), `climate.canton.network` (sustainability dashboard), all explorers, rwa.xyz, X, Discord and Telegram could not be opened directly. Statistics are date-stamped; where sources disagree, both are given.

---

## 1. Applications: what is actually built on Canton, by category, and what "featured app" means

### Takeaway
Canton has two visibly different app layers: an institutional layer (Broadridge DLR repo, DTCC Tokenization Service, Goldman Sachs DAP, tokenized deposits and MMFs) that produces the headline volumes, and a much smaller crypto-native/retail layer (Loop wallet, Cantex/OneSwap/Temple, CBTC, USDCx, OnePump memecoins, one NFT drop) that produces most of what an ordinary user can touch. "Featured app" is not a marketing badge: it is an on-chain right, granted by Super Validator vote after a Foundation committee review, to mint Canton Coin (CC) app rewards, and since May 2026 it requires locking 5M CC (25M CC for asset issuers) per party.

### Cited Findings

**Size of the app layer (conflicting counts, different definitions)**
- Official blog, 12 Nov 2026: DTCC's Tokenization Service "can natively connect with more than 150 production applications" across "more than 830 firms" — [canton.network "One Giant Leap"](https://www.canton.network/blog/one-giant-leap) [fetched]
- SEC staff no-action letter coverage, 3 Nov 2026: ~60 Super Validators, 700+ validators, 120+ application providers — [Genfinity](https://genfinity.io/2026/11/03/canton-coin-no-action-letter-digital-commodity-minting/) [search]; incoming letter: [sec.gov](https://www.sec.gov/files/corpfin/no-action/canton-incoming-103026.pdf) [search]
- Palladium Labs "State of the Canton Network – H1 2026" (51 pages, snapshot 30 Jun 2026): featured apps rose from 47 (end Q1 2026) to 107 (end Q2 2026) per one summary — [thelearningpill Substack](https://thelearningpill.substack.com/p/connecting-trillions-on-chain) [search]; a different summary of the same report says 118 featured apps, 655+ active validators, 45+ active Super Validators — [CantonNews](https://cantonnews.org/state-of-the-canton-network-h1-2026-key-findings-from-palladium-labs) [search]. The 107 vs 118 conflict is unresolved.
- Independent directory CCTools lists 626 "projects" on Canton (a far looser definition) — [cctools.network/ecosystem](https://cctools.network/ecosystem) [search]
- By Q2 2026 traffic burn, Temple leads "by a distance", ahead of Cantor8, Cantex and a tail of newer apps (Palladium, via [thelearningpill](https://thelearningpill.substack.com/p/connecting-trillions-on-chain)) [search]

**Wallets**
- Official list (7 Nov 2025): retail self-custody — Bron, Console Wallet, Loop (Five North), Republic, Send, Zoro Wallet, Cantor8; hardware — Cypherock X1; enterprise self-custody — BitGo, Blockdaemon, Copper, Dfns, Unit410, Taurus, Fireblocks; enterprise cold custody — BitGo, Blockdaemon, Hydra X, Zodia, Copper — [canton.network wallet guide](https://www.canton.network/blog/a-guide-to-wallets-exchanges-and-custody-providers) [fetched]
- Loop (Five North): browser-based, no extension, passkey login, described by a community wiki as "THE default self-custodial wallet for Canton projects"; no native mobile app, no extension, no hardware support — [canton.wiki Loop](https://canton.wiki/projects/5n-loop), [canton.wiki wallet guide](https://canton.wiki/learn/canton-wallet-guide) [search]
- Console Wallet: self-custodial mobile wallet; C8 Wallet (Cantor8): non-custodial mobile; Bron: wallet + DEX; also Calden and Meteor Wallet named in community lists — [BitSafe hub](https://hub.bitsafe.finance/canton-defi-ecosystem), [CantonNews projects](https://cantonnews.org/projects) [search]
- Ledger: retail CC support in the Ledger Wallet app arrived after a business-only rollout that drew public complaints — [X/@AlewXRP](https://x.com/AlewXRP/status/2090127435320750478) [search]

**DEXs / AMMs / trading venues**
- Cantex: AMM/DEX; pairs CC/USDT, CC/CBTC, CC/USDC; described as the most actively used Canton DeFi project as of March 2026 — [canton.wiki DeFi](https://canton.wiki/learn/canton-network-defi), [canton.wiki best projects](https://canton.wiki/learn/best-canton-network-projects) [search]
- Temple (Temple Digital): custodial order-book venue; "Temple Lightspeed" claims sub-10ms / 100k+ orders/sec; pairs CC-CBTC and USDCX-CBTC live on MainNet; also named by the official blog among firms trading DTCC-tokenized assets — [canton.wiki DeFi](https://canton.wiki/learn/canton-network-defi) [search]; [canton.network "One Giant Leap"](https://www.canton.network/blog/one-giant-leap) [fetched]
- OneSwap (AMM; email+password signup with a platform wallet, no government ID for swaps), Helvet Swap (AMM), Kairo (atomic cross-token trading), Tenkai swaps — [OneSwap](https://www.oneswap.cc/buy/cc), [BitSafe hub](https://hub.bitsafe.finance/canton-defi-ecosystem), [CantonNews](https://cantonnews.org/tenkai-s-canton-swaps-gain-recognition-under-network-reward-rules) [search]

**Lending**
- Verity (privacy-first institutional lending/collateral), ACME Markets (over-collateralized lending), Rhein Finance, Edel Finance, Haven Digital Partners — [BitSafe hub](https://hub.bitsafe.finance/canton-defi-ecosystem), [CantonNews projects](https://cantonnews.org/projects) [search]

**Perpetuals**
- CEDE (leveraged perps on real-world assets) — [cede.markets](https://cede.markets/); Canty (perp DEX) — [canty.xyz](https://www.canty.xyz/); Canborsa (perp RWA DEX: tokenized oil, gold, stocks, real estate) — [CantonNews projects](https://cantonnews.org/projects) [search]
- Rocky Exchange: perp futures DEX built natively on Canton, winner of HackCanton Season 2 — [CantonNews](https://cantonnews.org/rocky-exchange-wins-hackcanton-season-2-as-umbra-and-tirai-complete-the-podium) [search]

**Stablecoins, cash legs, payments**
- USDCx live on Canton via Circle xReserve (USDC locked on Ethereum, USDCx minted on Canton by attestation; "without reliance on third-party bridges"); launch users included Bron, Cantor8, Dfns, DRW, IMC, QCP, Send, Temple, Loop — [Circle blog](https://www.circle.com/blog/usdcx-on-canton-now-available-via-circle-xreserve), [canton.network blog](https://www.canton.network/blog/usdcx-now-live-on-canton-unlocking-private-and-composable-usdc-backed-settlement), [X/@CantonNetwork](https://x.com/CantonNetwork/status/1996567053998649685) [search]. Kraken added USDCx deposits/withdrawals in June 2026 — [CryptBull](https://www.cryptbull.net/2026/06/13/kraken-enables-usdcx-deposits-and-withdrawals-on-canton-network/) [search]
- Cash legs used in trades: USDCx, tokenized deposits from HSBC, Lloyds and JPM, LSEG-provided GBP/USD cash legs — [Canton FAQ PDF, version 27 Jul 2026](https://www.canton.network/hubfs/Canton_network_faq_Final.pdf) [fetched]
- Payments vertical named by the official guide: Bitwave (B2B cross-border), Paysafe, Worldpay; stablecoins USDC, Brale (SBC), M1 — [canton.network ecosystem guide, 29 Oct 2025](https://www.canton.network/blog/the-ultimate-guide-to-canton-networks-ecosystem) [fetched]
- "Gas station" services (e.g. Denex Gas Station) convert fiat into network traffic so a firm never holds CC — [Canton FAQ PDF](https://www.canton.network/hubfs/Canton_network_faq_Final.pdf) [fetched]
- USDT0 onboarding is the subject of an outcome-linked Super Validator weight (CIP-0090, max 10) — [CIP index](https://raw.githubusercontent.com/canton-foundation/cips/main/README.md) [fetched]

**Wrapped assets / bridges / interoperability**
- CBTC (BitSafe): first wrapped Bitcoin on Canton, with Chainlink Proof of Reserve attesting 1:1 backing — [Cryptonomist, 27 Feb 2026](https://en.cryptonomist.ch/2026/02/27/cbtc-token-canton-network/) [search]
- BitSafe "Decentralization Manager": open-source framework for apps controlled by several operators, public beta July 2026, backed by a Canton Foundation Development Fund grant of over $1M — [Decrypt](https://decrypt.co/374525/cantons-decentralized-app-layer-launches-backed-by-1m-foundation-grant) [search]
- LayerZero, Wormhole and Chainlink were admitted as Super Validators at weight 3 each (CIP-0065); an "ERC-20 Middleware and Distributed Indexer" is CIP-0086 (ChainSafe appears as its beneficiary in the MainNet SV config) — [CIP index](https://raw.githubusercontent.com/canton-foundation/cips/main/README.md), [MainNet approved-sv-id-values.yaml](https://raw.githubusercontent.com/canton-foundation/configs/main/configs/MainNet/approved-sv-id-values.yaml) [fetched]

**Name services**
- Canton Name Service (CNS; "Amulet Name Service"/ANS in the Splice code) is protocol-native: names take the form `<name>.unverified.cns`, anyone with a wallet and CC can register, the fee is burned, entries expire and must be renewed — [docs: Canton Name Service](https://docs.canton.network/overview/reference/canton-name-service) [fetched]
- Third-party front ends: CC Tag (names at "$1/mo") — [cctag.io](https://cctag.io/); name-hub — [GitHub](https://github.com/kutaibah/name-hub) [search]

**Launchpads / memecoins**
- OnePump (OneSwap team): memecoin launchpad launched 12 Nov 2026, bonding curve then locked liquidity on OneSwap; pitch is "no public mempool = no snipers"; claims 20M+ CC (~$1.8M) traded since launch. Coverage is largely company-linked (one piece is by OneSwap's CEO) — [CantonNews](https://cantonnews.org/oneswap-s-onepump-is-coming-soon-to-canton-network), [openPR](https://www.openpr.com/news/4696922/memecoins-on-canton-test-a-new-model-creator-rewards-tied), [oneswap.cc](https://www.oneswap.cc/launchpad/trenches) [search]
- Supanova is promoted on X as "the first token launchpad on Canton" (early Nov 2026) — a competing "first" claim — [X/@jollygreenmoney](https://x.com/jollygreenmoney/status/2117415309942595645) [search]

**NFTs / collectibles / games / prediction markets**
- PrivKet's "Canton Penguin" (444 NFTs at 25 CC) sold out in May 2026 and is described as Canton's first NFT drop; Arkena is listed as an NFT marketplace/wallet — [CantonNews](https://cantonnews.org/privket-launches-canton-network-s-first-nft-collection), [CantonNews app overview](https://cantonnews.org/a-look-inside-the-applications-building-on-canton-network) [search]
- Confimarket (privacy-preserving prediction market) won HackCanton Season 1 — [Swace News, 29 May 2026](https://www.swacenews.com/2026/05/29/confimarket-wins-hackcanton-season-1-with-privacy-preserving-consensus-and-market-intelligence-infrastructure-built-on-canton-network/) [search]

**Institutional applications (source of headline volume)**
- Named as live: Goldman Sachs DAP, Broadridge DLR, Versana, BNP Paribas, DTCC, Circle, Franklin Templeton, HSBC, iCapital, EquiLend, Kaiko, Novaprime, Tradeweb — [canton.network FAQ](https://www.canton.network/faq), [Canton FAQ PDF](https://www.canton.network/hubfs/Canton_network_faq_Final.pdf) [fetched]
- DTCC Tokenization Service went live 28 Oct 2026 with an "initial pool of $30tn+" HQLA (USTs, equities, ETFs) "available for on-chain use"; early trades highlighted by Morgan Stanley, Tradeweb, Temple, Talos, Broadridge — [canton.network "One Giant Leap"](https://www.canton.network/blog/one-giant-leap) [fetched]

**What "featured app" means in practice**
- Featured apps can mint CC app rewards; "app providers do not receive rewards from SVs; they have to mint their own Canton Coin" — [Canton FAQ PDF](https://www.canton.network/hubfs/Canton_network_faq_Final.pdf) [fetched]
- Application form asks for: featured party ID, app type (Basic Featured App / Featured Asset-Moving App / Featured Asset), a "Standalone SV Sponsor" (Foundation, 5North, 7Ridge, Cumberland, Digital Asset, Liberty City Ventures, MPCH, Orb-1, Proof Group, SBI Digital Asset, Tradeweb), expected tx per user, controls against "non-bona fide transactions", audit report, 14 days live on MainNet, testing access, and whether the business relies on app rewards. Applicants present for 5 minutes to the committee; on-chain governance follows within ~2 weeks — [Featured App Request](https://canton.foundation/featured-app-request/) [fetched]
- Obligations after approval: one-month and then quarterly activity reports (tx/day, max tx per round, customers), two-week cure period, and "At any time your Featured Application status may be revoked by the Committee"; reward weight "may be increased or decreased by the Committee" — [Featured App Request](https://canton.foundation/featured-app-request/) [fetched]
- CIP-0116 "Featured App Locking" (approved 20 May 2026): 5,000,000 CC locked per PartyId for non-issuers, 25,000,000 CC for asset issuers; 60-day unlock vesting 1/60 per day; existing featured apps had 30 days to comply; SV operators must respond to an unfeature vote within 30 minutes — [CIP-0116](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0116/cip-0116.md) [fetched]
- CIP-0098 (approved 7 Jan 2026): per-transaction app reward capped at $1.50, explicitly because uncapped rewards meant "Apps may optimize for reward farming rather than sustainable usage" — [CIP-0098](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0098/cip-0098.md) [fetched]
- CIP-0104 "Traffic-Based App Rewards": removes self-reported featured-app activity markers and bases rewards on actual traffic burn measured from sequencer/mediator data; caps minting at "at most 79 cents for $1 of burn"; introduces the three app categories — [CIP-0104](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0104/cip-0104.md) [fetched]. The CIP header says "Approved: 2026-10-27"; CantonNews says traffic-based calculation took effect 18 Aug 2026 — [CantonNews](https://cantonnews.org/community/cip-0096-and-cip-0104-canton-no-longer-pays-nodes-that-are-merely-online) [search]. The date conflict is unresolved (the October date may be an amendment).
- The docs page on getting featured names `cantonecosystem.com` as the listing venue and warns against "misleading claims", abandoned projects and spam — [docs: Getting Your App Featured](https://docs.canton.network/overview/understand/getting-app-featured) [fetched]

### Inferences
- At the mid/late-Nov 2026 price range of ~$0.073–$0.084 per CC (see section 5), the 5M CC lock is roughly $365k–$420k and the 25M CC issuer lock roughly $1.8M–$2.1M. That is a real capital barrier for small crypto-native teams and an under-explained fact for newcomers who read "featured" as a listing badge.
- The reward rules were tightened three times in under a year (cap per tx, lock requirement, traffic-based measurement). The CIP texts themselves concede that the earlier design invited reward farming; this is the best primary evidence for the "farming" criticism (section 8).
- Retail-facing categories that are thin or absent in everything found: games (none found), identity/KYC apps for end users (none found; compliance is supplied by Elliptic/TRM-type vendors to institutions), consumer payments.

### Gaps
- The official directory `cantonecosystem.com` and `canton.foundation/canton-apps/` could not be loaded, so there is no authoritative per-app status/usage table and no authoritative current count of featured apps.
- No independent usage numbers (users, volume, TVL) were found for most apps; nearly all per-app figures come from the apps themselves or from community wikis.
- "Alpend", "CantonSwap" and a dedicated on-chain KYC/identity app did not appear in any result.
- Whether Zenith (CIP-0091, SV weight 10) is an EVM layer for Canton could not be confirmed from fetched sources.

---

## 2. How an ordinary user gets started today, and the pain points

### Takeaway
The realistic retail path is: create a Canton-native wallet (most guides say Loop, in a browser with a passkey), copy the party ID, buy CC on a centralized exchange and withdraw to that party ID, then use a handful of DEX/launchpad apps. The friction is specific to Canton's design: no MetaMask, long party IDs, explorers that only show your own activity, fees targeted at about $1 per CC transfer, capped wallet sign-ups, and KYC that varies app by app.

### Cited Findings
- Official framing: "Anyone can start participating in Canton with a wallet"; CC is "generally available" through wallets, custodians and exchanges; official exchange list (Nov 2025): Bybit, Gate, Kraken, KuCoin, MEXC — [Canton FAQ PDF](https://www.canton.network/hubfs/Canton_network_faq_Final.pdf), [wallet/exchange guide](https://www.canton.network/blog/a-guide-to-wallets-exchanges-and-custody-providers) [fetched]. Community guides add SBI VCTrade and BingX — [CantonNews get-started](https://cantonnews.org/get-started), [cnews.dev tutorial](https://cnews.dev/learn/canton-network-tutorial) [search]
- A party ID looks like `auth0_007c675a429eaf831f0991308d85::12201abe669f...`; CNS names (`alice.unverified.cns`) exist to hide this — [docs: Canton Name Service](https://docs.canton.network/overview/reference/canton-name-service) [fetched]
- Canton-native wallets are required for CC; Ethereum-style wallets such as MetaMask do not work — [CantonNews get-started](https://cantonnews.org/get-started), [OneSwap wallet guide](https://www.oneswap.cc/blog/how-to-get-started-on-canton-a-wallet-guide-for-oneswap-users) [search]
- "Explorers are personal — Canton explorers show only your transactions, not network-wide activity"; balances, transactions and token holdings are visible only to entitled parties — [docs: Integrations overview](https://docs.canton.network/integrations/apps/finding-apps) [fetched]. But "Canton Coin itself is fully transparent" — [Canton FAQ PDF](https://www.canton.network/hubfs/Canton_network_faq_Final.pdf) [fetched]
- Fees: fixed and known in advance, no auctions; the $/MB traffic rate is tuned by the Tokenomics Committee "to keep a typical Canton Coin transfer near a $1 target" — [Canton FAQ PDF](https://www.canton.network/hubfs/Canton_network_faq_Final.pdf) [fetched]
- KYC: "You can control KYC requirements on an app by app basis, and also at the infrastructure layer by permissioning synchronizers" — [Canton FAQ PDF](https://www.canton.network/hubfs/Canton_network_faq_Final.pdf) [fetched]. Examples: OneSwap swaps need only email/password (cash-out has separate identity checks) — [OneSwap](https://www.oneswap.cc/buy/cc) [search]; Temple's airdrop programme was KYC-gated with review taking up to 7 days — [note.com guide](https://note.com/nft_labo2100/n/n6db282b6ae6e?hl=en) [search]
- End-user CC transactions have a 24-hour window between preparing and executing (previously 10 minutes), which matters for external/hardware signing; "preapprovals" for incoming transfers are an explicit protocol object — [CIP-0107](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0107/cip-0107.md) [fetched]
- Pain points on record: a forum user says they tried for 7+ months to use Canton as a retail user and "most of them I can't sign-up because the waitlist is full"; a Kraken → Zoro Wallet transfer failure thread — [Canton forum](https://forum.canton.network/t/cant-send-money-from-exchange-kraken-to-zoro-wallet/8702) [search]; Console Wallet onboarding "may be subject to the current Canton registration limits" — [LetsExchange](https://letsexchange.io/blog/top-6-wallets-on-canton-in-2026/) [search]; wallet onboarding that loses state on refresh and can create duplicate wallets — [GitHub canton-network/wallet #3055](https://github.com/canton-network/wallet/issues/3055) [search]
- Scam surface: guides tell users to use only official domains (cantonloop.com, canton.network) — [CantonNews get-started](https://cantonnews.org/get-started) [search]
- Wallet growth figure: 28,000+ wallets, "driven primarily by institutional accounts" (Oct 2025) — [The Tie part 4 via canton.network](https://www.canton.network/blog/the-canton-network-series-part-4-of-5) [fetched]

### Inferences
- A wallet on Canton is hosted on someone's validator (the party lives on a participant node), so "self-custody" on Canton means holding the signing key while a validator operator still hosts your party and sees your data. This is the single least-explained point in the beginner guides found, and it is where "registration limits" and waitlists come from.
- A ~$1 target fee per transfer is fine for institutions and expensive for retail micro-activity; it clashes directly with the memecoin/launchpad use case now being promoted.
- Guides conflict on Loop backup (passkey only vs "store a backup key"); newcomers have no single authoritative walkthrough.

### Gaps
- No official end-user onboarding guide was found (`docs.canton.network/integrations/wallets/for-users` redirects to a developer overview).
- No list of geo-restrictions for wallets or apps was found; no reliable count of retail users or active parties for 2026.
- Exactly how transfer preapproval works for a retail user (who pays, how long it lasts; CIP-0119 concerns a free base duration) was not read in detail.

---

## 3. Developer experience

### Takeaway
Building on Canton means learning Daml and a UTXO-like, privacy-by-default contract model; tooling has improved in 2026 (dpm, LocalNet, QuickStart, Wallet/dApp SDKs, an MCP server for the docs, and the grant-funded Canton DevKit completed in Nov 2026). Running a validator is cheap in hardware terms but gated by sponsorship, committee approval and IP allow-listing. No credible count of active developers was found.

### Cited Findings
- **Canton DevKit** (Bit Dynamics; announcement dated 12 Nov 2026): open-source (Apache 2.0) CLI + browser UI on top of LocalNet; one-command start, health checks, logs, named instances, snapshot/restore, dashboards and contract inspection, DAR package tooling, Token Standard V2 (CIP-0112) testing with faucet. Final milestone approved 10 Sep 2026; 500+ downloads reported 28 Aug 2026; tested by Certora, Moonsong Labs, Gateway.FM; a follow-up proposal for multi-participant/multi-synchronizer environments is under review — [Canton Foundation](https://canton.foundation/bit-dynamics-completes-canton-devkit-development-fund-project-making-local-development-easier/) [fetched]
- Toolchain: Daml SDK (compiler, Daml Script, Sandbox), `dpm` package manager, Daml Studio (VS Code), LocalNet (Docker Compose multi-validator network from `cn-quickstart`), PQS (SQL over ledger data), Wallet SDK and dApp SDK (TypeScript), TypeScript and Java codegen — [docs: SDKs and Tools](https://docs.canton.network/sdks-tools/overview) [fetched]
- QuickStart: reference app with Daml model, Java backend, React frontend and LocalNet with a simulated super validator; a software-licensing workflow paid in CC — [docs: QuickStart](https://docs.canton.network/appdev/quickstart) [fetched]
- Docs warn that Canton/Daml 2.x material "is outdated and must not be used"; 3.x is backward-incompatible; the docs ship an `llms.txt`, a version compatibility dashboard and an MCP server — [docs llms.txt](https://docs.canton.network/llms.txt) [fetched]
- For Ethereum developers the docs list the mental shifts: immutable contracts (archive + create), explicit authorization (signatory/controller rather than msg.sender), privacy by default (declare observers) — [docs: Choose Your Path](https://docs.canton.network/appdev/get-started/choose-your-path) [fetched]
- Non-Daml/EVM: "technically possible and an active area of R&D"; an ERC-20-compatible middleware and indexer is in progress; a "Polyglot Canton Whitepaper" explores Solidity via Wasm — [Canton FAQ PDF](https://www.canton.network/hubfs/Canton_network_faq_Final.pdf) [fetched]
- Networks: LocalNet, DevNet, TestNet, MainNet; the Foundation status page lists SV nodes, versions and vote requests for the last three — [SV Network Status](https://canton.foundation/sv-network-status/) [fetched]. DevNet onboarding: fill the Foundation form, provide egress IPs, "allow roughly 2–7 days for IP propagation" — [Canton FAQ PDF](https://www.canton.network/hubfs/Canton_network_faq_Final.pdf) [fetched]
- Validator hardware (reference): laptop experiments 1 CPU/6 GB; production with little activity 2 CPU/8 GB + DB 2 CPU/4 GB/10 GB; app provider with moderate activity 2 CPU/16 GB + 100 GB DB — [docs: Prerequisites](https://docs.canton.network/global-synchronizer/deployment/prerequisites) [fetched]
- Super Validator hardware: three VMs (~GCP e2-standard-8 each) in Kubernetes; "no software license cost" — [Canton FAQ PDF](https://www.canton.network/hubfs/Canton_network_faq_Final.pdf) [fetched]
- Becoming a validator: apply via the Foundation; Tokenomics Committee review "about two weeks"; "currently sponsorship is needed" — [Validators page](https://canton.foundation/validators/), [canton.network FAQ](https://www.canton.network/faq) [fetched]
- Most common onboarding blockers per the Foundation: IP whitelisting, internal proxy configuration, protocol-version mismatches — [Canton FAQ PDF](https://www.canton.network/hubfs/Canton_network_faq_Final.pdf) [fetched]
- Development Fund: 5% of future CC emissions (CIP-0082), governed under CIP-0100; first report (24 Aug 2026): 42 projects approved, 290.0M CC committed, 62.2M CC paid; "Development Fund 2.0" directs 80% to roadmap RFPs — [Dev Fund first report](https://canton.foundation/protocol-development-fund-the-first-report/), [grants programme](https://canton.foundation/grants-program/), [dev-fund README](https://raw.githubusercontent.com/canton-foundation/canton-dev-fund/main/README.md) [fetched]. Non-members need a champion on the Tech & Ops Committee — [grants programme](https://canton.foundation/grants-program/) [fetched]
- Hackathons: HackCanton Season 2 — 360+ builders, 60+ countries, 75+ teams, $10K + 100K CC — [dev.to/NODERS](https://dev.to/noders/hackcanton-season-2-recap-from-75-teams-to-10k-100k-cc-in-rewards-262i) [search]; Season 3 announced — [Canton forum](https://forum.canton.network/t/hackcanton-season-3-build-something-real-on-canton/9065) [search]; Canton Construct Ideathon (AngelHack), winners 12 Jan 2026 — [StackUp](https://hackathon.stackup.dev/web/events/canton-core-ideathon) [search]; Cantor8 London hackathon 29 Aug 2026 with Cambridge, Oxford, Imperial — [Cantor8](https://www.cantor8.io/official-blog/cantor8-canton-network-hackathon-2026) [search]; Canton Core Academy "Learn & Earn" quests (AngelHack) — [canton.network ecosystem guide](https://www.canton.network/blog/the-ultimate-guide-to-canton-networks-ecosystem) [fetched]
- Support channels: Slack, forum.canton.network, GitHub, mailing lists at lists.sync.global, office hours — [docs: Support Channels](https://docs.canton.network/shared/support-channels) [fetched]
- Security: the Foundation published "Calling All Security Auditors" on 24 Nov 2026 — [Canton Foundation](https://canton.foundation/calling-all-security-auditors-help-us-strengthen-canton/) [fetched]

### Inferences
- The developer funnel is still institution-shaped: sponsorship, allow-lists, committee calls and Slack rather than a faucet and a public RPC. DevKit and LocalNet remove the local-setup pain but not the path to DevNet/MainNet.
- HackCanton participation (hundreds of builders) is the only quantitative developer signal found; it is self-reported by organisers.

### Gaps
- No Electric Capital-style developer count for Canton/Daml was found. No dollar cost for running a validator or for NaaS hosting was found (the Foundation says to request quotes).
- The Season 1 HackCanton figure ("300 teams from 15 countries") comes from a single press-release-style source and was not verified.

---

## 4. Infrastructure: explorers, dashboards, node providers, custodians, oracles, status and sustainability

### Takeaway
Canton has many dashboards for a privacy chain, but they all expose the same public slice: CC supply/mint/burn, rewards, validators, Super Validators, governance votes and featured-app activity. They do not show private asset balances or institutional transaction contents.

### Cited Findings
- **The Tie Canton dashboard** (canton.thetie.io): real-time CC supply, minted rewards, burned fees, SV participation, featured-app adoption — [canton.network ecosystem guide](https://www.canton.network/blog/the-ultimate-guide-to-canton-networks-ecosystem) [fetched]; [syncinsights comparison](https://syncinsights.io/blog/canton-network-analytics-tools-11-options-compared) [search]
- **CantonScan** (Proof Group, cantonscan.com; launched June 2025 per a community wiki): search by participant, token activity, validator dashboard — [canton.network ecosystem guide](https://www.canton.network/blog/the-ultimate-guide-to-canton-networks-ecosystem) [fetched]; [canton.wiki](https://canton.wiki/learn/cantonscan-guide) [search]
- **CC View** (PixelPlex, ccview.io): explorer, indexer, API, party search, transfer tracing, webhook alerts, plus a featured-app locking tracker — [canton.wiki](https://canton.wiki/projects/cc-view), [ccview.io](https://ccview.io/featured-app-locking/) [search]
- **CC Explorer** (Node Fortress): governance actions/proposals, paid API — [canton.network ecosystem guide](https://www.canton.network/blog/the-ultimate-guide-to-canton-networks-ecosystem) [fetched]; [canton.wiki](https://canton.wiki/projects/cc-explorer) [search]
- **5N Lighthouse** (Five North): SV/validator data, governance, live transactions, featured apps, and Development Fund mints. Official pages link `lighthouse.cantonloop.com` — [Canton primer](https://www.canton.network/blog/canton-network-primer-8-terms), [Dev Fund report](https://canton.foundation/protocol-development-fund-the-first-report/) [fetched]
- **Coin Metrics Canton Intelligence**: validator rewards, fee flows, app incentives; **RWA.xyz** integrated via Kaiko — [canton.network ecosystem guide](https://www.canton.network/blog/the-ultimate-guide-to-canton-networks-ecosystem) [fetched]
- Community tools: CantonNews live stats — [cantonnews.org/network](https://cantonnews.org/network); CCTools — [cctools.network/network](https://cctools.network/network); community GitHub dashboard — [guelowrd/canton-ecosystem-dashboard](https://github.com/guelowrd/canton-ecosystem-dashboard); emissions countdown — [cc-halving-countdown](https://cc-halving-countdown.vercel.app/) [search]
- **SV Network Status page**: per-network deployment info, list of SV nodes, links to SV minting weights and beneficiaries on GitHub, DSO info and active vote requests — [canton.foundation/sv-network-status](https://canton.foundation/sv-network-status/) [fetched]
- **Node-as-a-service**: the Foundation lists about 50 NaaS providers (52 names counted on 26 Nov 2026), including 5North, BitGo, Blockdaemon, Copper, Dfns, Everstake, Figment, Kiln, Luganodes, P2P.org, Republic, Validation Cloud, Zodia; NaaS providers must show 15 days of uptime with fewer than 50 missed rounds, multi-tenancy with key segregation, and 24/7 incident contact — [Validators page](https://canton.foundation/validators/) [fetched]
- **Custodians**: Fireblocks, BitGo, Blockdaemon, Zodia, Copper, Dfns named as supporting CC — [Canton FAQ PDF](https://www.canton.network/hubfs/Canton_network_faq_Final.pdf) [fetched]
- **Oracles/data**: Chainlink (SV, weight 7.5, CIP-0061), Kaiko (SV, weight 6.5, CIP-0063), RedStone (Foundation member); CIP-0079 required a third-party price feed for CC — [CIP index](https://raw.githubusercontent.com/canton-foundation/cips/main/README.md), [Canton Foundation news index](https://canton.foundation/news/) [fetched]
- **Compliance/forensics**: Elliptic and TRM Labs provide AML monitoring for CC — [Canton FAQ PDF](https://www.canton.network/hubfs/Canton_network_faq_Final.pdf) [fetched]
- **Energy (MiCA white paper for Canton Coin, notified 9 Sep 2025, data from CCRI for 28 Aug 2025)**: 131,115 kWh per year; 29.07% renewable; 0.00096 kWh per validated transaction; Scope 2 emissions 60.18 tCO2e per year; 0.00044 kg CO2e per transaction; "all indicators are based on a set of assumptions and thus represent estimates" — [Canton Coin MiCA white paper](https://www.canton.network/hubfs/Canton%20Network%20Files/whitepapers/Canton%20Coin%20%20-%20MiCA%20Whitepaper.pdf) [fetched]

### Inferences
- The MiCA figures cover a snapshot from August 2025, when the network had ~575–600 validators and ~0.5–0.6M tx/day; with ~1.7M tx/day and 800+ validators in late 2026 the annual total is likely higher. Nobody appears to have published an updated independent energy analysis.
- Because private-asset data is invisible, every public dashboard measures "CC economy" activity. That is the root of the "opaque numbers" criticism in section 8.

### Gaps
- `climate.canton.network` could not be opened; its current claims are unknown.
- Lighthouse URL differs across sources (`lighthouse.cantonloop.com` official; `lighthouse.fivenorth.io` and `lighthouse.5n.app` in community guides).

---

## 5. Network statistics over time

### Takeaway
All counts rise steeply from mid-2024 to late 2026, but the series are not clean: transaction-counting methodology changed in 2026, "Super Validator" is counted three ways (13 nodes, ~45 active, ~60 approved organisations), and the largest figures ($ trillions) are assets processed or made available, not value locked.

### Cited Findings

| Metric | Value | Date | Source |
|---|---|---|---|
| Validators | 24 | MainNet launch (mid-2024) | [The Tie pt 4](https://www.canton.network/blog/the-canton-network-series-part-4-of-5) [fetched] |
| Validators | 575+ | 22 Oct 2025 | same |
| Validators | ~600 | 29 Oct 2025 | [ecosystem guide](https://www.canton.network/blog/the-ultimate-guide-to-canton-networks-ecosystem) [fetched] |
| Active validators | 655+ | 30 Jun 2026 | [CantonNews on Palladium](https://cantonnews.org/state-of-the-canton-network-h1-2026-key-findings-from-palladium-labs) [search] |
| Validators | 800+ | 27 Jul 2026 | [FAQ PDF](https://www.canton.network/hubfs/Canton_network_faq_Final.pdf) [fetched] |
| Validators / SVs | 807 validators, 62 SVs | 11 Oct 2026 | third-party tracker citing the Canton Foundation site ([whatiscanton.com](https://whatiscanton.com/) or [cctools.network](https://cctools.network/network); exact page uncertain) [search] |
| Validators | 700+ | 3 Nov 2026 | [Genfinity on SEC letter](https://genfinity.io/2026/11/03/canton-coin-no-action-letter-digital-commodity-minting/) [search] |
| Validators | "1,000+" | 2026 | [ourcryptotalk](https://ourcryptotalk.com/news/canton-network-1000-validators-grayscale-cc-2026) [search], unverified |
| Super Validators | 55+ organisations | 1 Jul 2026 | [primer](https://www.canton.network/blog/canton-network-primer-8-terms) [fetched] |
| Super Validators | ~60 organisations, 13 shown online | 27 Jul 2026 | [FAQ PDF](https://www.canton.network/hubfs/Canton_network_faq_Final.pdf) [fetched] |
| SV node identities in MainNet config | 13 | 26 Nov 2026 | [approved-sv-id-values.yaml](https://raw.githubusercontent.com/canton-foundation/configs/main/configs/MainNet/approved-sv-id-values.yaml) [fetched] |
| Daily transactions | 500k+ | end Sep 2025 | [MEXC news](https://www.mexc.com/news/240826) [search]; which result in the set carried this figure is uncertain |
| Daily transactions | 600k+ | 22 Oct 2025 | [The Tie pt 4](https://www.canton.network/blog/the-canton-network-series-part-4-of-5) [fetched] |
| Avg daily tx | 0.75M / 1.37M / 2.28M | Q4 2025 / Q1 2026 / Q2 2026 | [Coingabbar on Canton Strategic](https://www.coingabbar.com/en/crypto-blogs-details/canton-network-ecosystem-2026) [search]; methodology changed |
| Avg daily tx | 902K | Q1 2026 | [Canton Strategic Q1 report](https://cdn.prod.website-files.com/697d5b6446aa7378c74b26d0/69e14b7e09c6eed9fcb9d4fd_Canton_Q1%202026%20Ecosystem%20Report_04.16.26.pdf) [search]; conflicts with 1.37M above |
| Daily transactions | ~1.7M (~600M annualized) | 12 Nov 2026 | ["One Giant Leap"](https://www.canton.network/blog/one-giant-leap) [fetched] |
| Monthly tx using CC | 15M+ | Oct 2025 | [ecosystem guide](https://www.canton.network/blog/the-ultimate-guide-to-canton-networks-ecosystem) [fetched] |
| Wallets | 28,000+ | Oct 2025 | [The Tie pt 4](https://www.canton.network/blog/the-canton-network-series-part-4-of-5) [fetched] |
| Firms connected | 650+ / 800+ / 830+ | Sep–Oct / Sep / Nov 2026 | [Summit takeaways](https://www.canton.network/blog/canton-summit-2026-takeaways), [The Tie pt 5](https://www.canton.network/blog/the-canton-network-series-part-5-of-5), ["One Giant Leap"](https://www.canton.network/blog/one-giant-leap) [fetched] |
| On-chain assets "processed" | $6T+; $280B daily UST repo | Oct 2025 | [ecosystem guide](https://www.canton.network/blog/the-ultimate-guide-to-canton-networks-ecosystem) [fetched] |
| Broadridge repo | $300B+ per day | Oct 2026 | [Summit takeaways](https://www.canton.network/blog/canton-summit-2026-takeaways) [fetched] |
| Tokenized RWA processed | $9T monthly | Sep–Nov 2026 | [The Tie pt 5](https://www.canton.network/blog/the-canton-network-series-part-5-of-5), ["One Giant Leap"](https://www.canton.network/blog/one-giant-leap) [fetched] |
| CC price / market cap | ~$0.073–$0.084 / ~$2.95–3.38B | 18–25 Nov 2026 | [Coinbase](https://www.coinbase.com/price/canton), [CoinDesk](https://www.coindesk.com/price/canton-coin) [search] |
| CC circulating supply | ~40.1B | Nov 2026 | [CoinMarketCap](https://coinmarketcap.com/currencies/canton-network/) [search] |
| CC all-time high | $0.1706 | n/a | [Coinbase](https://www.coinbase.com/price/canton) [search] |

- Emissions: on ~12 Jan 2026 a "double halving" cut max issuance per round by 50% and the Super Validator share from 48% to 20% — [X/@CantonNetwork](https://x.com/CantonNetwork/status/2010761692616315100) [search]. Canton says there is no fixed supply cap; 1B+ CC burned as of that statement; a later halving is expected to cut the SV share to 10% — [Bitget News](https://www.bitget.com/news/detail/12560605055166) [search]
- A community account says 62% of native rewards (~516M CC/month) flow to applications — [X/@CantonArmy](https://x.com/CantonArmy/status/2061565418762834204) [search] (project-aligned framing, not independent)
- Rewards mint every 10-minute round; the flat "active validator" (liveness) reward was phased out — [FAQ PDF](https://www.canton.network/hubfs/Canton_network_faq_Final.pdf), [CIP-0096](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0096/cip-0096.md) [fetched]
- Grayscale's June 2026 filing reportedly says the 100 largest wallets hold ~89% of circulating CC — [DropsTab research](https://news.dropstab.com/research/canton-network-the-blockchain-powering-wall-street) [search]

### Inferences
- The validator count dipped or plateaued in some series (800+ in July, 700+ in the Nov SEC letter). The removal of liveness rewards by 30 Apr 2026 (CIP-0096) plausibly removed idle validators; this is an inference, not a sourced fact.
- A clean, sourced time series (validators, SVs, tx/day, featured apps, burn/mint) with methodology notes does not appear to exist in public; it is a concrete content gap.

### Gaps
- No reliable "active parties" or daily-active-user series was found for 2026. Explorer data could not be read directly.
- One aggregator cites "$155.36M in Q3 fees" for Canton ([ad-hoc-news](https://www.ad-hoc-news.de/boerse/news/marktberichte/155-36-million-usd-in-q3-fees-what-it-means-for-the-canton-price/70383356) [search]); this is unverified and should not be used without checking a dashboard.

---

## 6. Competitive comparison

### Takeaway
Canton wins on native sub-transaction privacy combined with cross-application atomic settlement and on depth of incumbent market-infrastructure adoption (Broadridge, DTCC, Nasdaq, LSEG, Visa as approved Super Validators). It loses on public verifiability, permissionless participation, open liquidity, developer base and "distributed" (freely transferable) RWA value, where Ethereum leads by a wide margin. The newest competitors are not other privacy chains but corporate payment chains (Tempo, Arc) and bank chains (Kinexys).

### Cited Findings
- **Canton's own comparison**: Avalanche-style private subnets and L2s "force a binary choice" (in the subnet you see everything, outside nothing); FHE/ZK "have serious security drawbacks today"; Solana is a high-performance monolith where "all participants compete for the same global bandwidth"; other chains push regulated assets to subnets/L2s and lose atomic composability — [canton.network FAQ](https://www.canton.network/faq) [fetched]
- **Canton on ZK**: "No, Canton achieves privacy through the protocol and smart contract programmability… ZK systems introduce a huge amount of complexity and attack surface… Canton's position is not anti-ZKP" — [FAQ PDF](https://www.canton.network/hubfs/Canton_network_faq_Final.pdf) [fetched]
- **Ethereum**: about $16.89B of $39.28B distributed RWAs (~43%) on rwa.xyz as of 18 Oct 2026 — [Protofire guide](https://protofire.io/guides/institutional-blockchains/) [search]; ~$17.3B on Ethereum and ~$4.1B on Solana at end Aug 2026 — rwa.xyz-derived rankings (one of several ranking articles in the result set, e.g. [CoinCentral](https://coincentral.com/best-blockchains-for-real-world-asset-rwa-tokenization-in-2026); exact page uncertain; check [app.rwa.xyz](https://app.rwa.xyz/)) [search]
- **Canton on rwa.xyz**: ~$320.7B of ~$366B "represented" assets, almost all Broadridge DLR repo, with effectively zero "distributed" value — [cryptonews.net](https://cryptonews.net/news/altcoins/33716778/), [defiprime](https://defiprime.com/distributed-vs-represented-rwa-framework) [search]
- **ZKsync / Ethereum ZK stack**: Alex Gluchowski argues a blockchain's defining feature is a shared ledger whose rules apply to everyone, and that Canton participants "cannot independently verify system-wide properties such as total asset supply"; he advocates ZK systems anchored to public chains — [Cointelegraph](https://cointelegraph.com/magazine/canton-zksync-clash-blockchains-enforce-rules) [search]
- **Tempo (Stripe/Paradigm)**: live since 18 Mar 2026; raised $500M at a $5B valuation; BlackRock's BUIDL added Tempo in July 2026 — [Protofire](https://protofire.io/guides/institutional-blockchains/), [Blockonomi](https://blockonomi.com/institutional-investors-pour-1-billion-into-privacy-first-blockchain-projects) [search]
- **Arc (Circle)**: public mainnet since 16 Sep 2026; raised $222M at $3B valuation; privacy is opt-in ("selectively shield transaction details", addresses visible by default), the opposite default to Canton — [Protofire](https://protofire.io/guides/institutional-blockchains/), [The Bright Minded](https://www.thebrightminded.com/news/arc-canton-and-tempo-the-same-privacy-principle-two-opposite-architectures-and-nine-years-of-evidence/) [search]
- **JPMorgan Kinexys**: bank-run network; one source says >$2B daily and >$1.4T cumulative, another "over $4T since inception" (29 Jun 2026) — figures conflict; JPMorgan planned to issue JPMD natively on Canton in phases during 2026, not confirmed live as of 18 Oct 2026 — [Protofire](https://protofire.io/guides/institutional-blockchains/), [RedStone RWA report](https://www.redstone.finance/blog/real-world-assets-in-onchain-finance-report/) [search]
- **R3 Corda + Solana**: May 2025 strategic collaboration to bring Corda's regulated assets ($10B+; HSBC, Bank of America, Euroclear among participants) to Solana via a consensus service; Solana Foundation's Lily Liu joined R3's board — [The Block](https://www.theblock.co/post/355386/r3-corda-blockchain-public-internet-capital-market-solana), [R3](https://r3.com/r3-signals-strategic-shift-to-lead-the-convergence-of-public-and-private-blockchains-to-deliver-internet-capital-markets-through-collaboration-with-solana-foundation) [search]. Later 2026 claims (e.g. ~$17B on Corda, SIX mainnet link) come from one aggregator and are unverified — [Solana Compass](https://solanacompass.com/projects/r3) [search]
- **Stellar / XRP Ledger / Avalanche**: an undated rwa.xyz-derived table shows Stellar ~$4.9B, XRPL ~$3.2B, Avalanche C-Chain ~$1.3B in RWA value — rwa.xyz-derived ranking article (e.g. [CoinCentral](https://coincentral.com/best-blockchains-for-real-world-asset-rwa-tokenization-in-2026); exact page uncertain) [search]. Press coverage says VanEck's corporate-chain analysis ranked XRPL ahead of Kinexys and Canton — [CoinPaper](https://coinpaper.com/17355/xrp-ledger-takes-the-helm-in-van-eck-s-corporate-blockchain-ranking-beating-jp-morgan-s-kinexys) [search] (secondhand; criteria not confirmed)
- **VanEck "The Rise of Corporate Blockchains" (Mar 2026)**: groups Canton, Tempo, Arc and Kinexys as "corpchains"; cites ~$300B repo activity for Canton and a market value of ~$5.3–5.6B at the time; projects $60B+ annual corporate-chain revenue by 2030 — [VanEck](https://www.vaneck.com/us/en/blogs/digital-assets/matthew-sigel-the-rise-of-corporate-blockchains/) [search]
- **Provenance**: Figure's HELOC assets are the other large contributor to rwa.xyz "represented" value — [Funkleville](https://funkleville.com/uplink/tokenized-rwa-market-size) [search]
- **Justin Bons** groups Canton with Ripple, Stellar, Hedera and Algorand as "centralized blockchains" requiring permission — [X/@Justin_Bons](https://x.com/Justin_Bons/status/2026338296180396405) [search]

**Dimension scorecard (synthesis of the findings above)**

| Dimension | Who wins | Basis |
|---|---|---|
| Native transaction privacy for regulated workflows | Canton | protocol-level sub-transaction privacy ([FAQ](https://www.canton.network/faq)); Arc opt-in, Ethereum L1 transparent |
| Publicly verifiable state / trust minimisation | Ethereum and ZK L2s | Rooz concedes Canton lacks public verifiability ([Cointelegraph](https://cointelegraph.com/magazine/canton-zksync-clash-blockchains-enforce-rules)) |
| Cross-app atomic composability with privacy | Canton (claimed) | [FAQ](https://www.canton.network/faq); not independently benchmarked |
| Permissionless validation / decentralisation | Ethereum, Solana | SV admission by 2/3 vote; 13 SV nodes ([FAQ PDF](https://www.canton.network/hubfs/Canton_network_faq_Final.pdf)) |
| Freely transferable RWA value and DeFi liquidity | Ethereum, then Solana/Stellar/XRPL | rwa.xyz "distributed" figures above |
| Institutional notional processed | Canton (Broadridge, DTCC) | official figures above; self-reported |
| Developer base and tooling familiarity | Ethereum/EVM, Solana | Daml is Canton-specific; no dev count found |
| Stablecoin payments distribution | Tempo, Arc, Ethereum, Solana | corporate distribution (Stripe, Circle) |

### Inferences
- "Canton vs Ethereum" is partly a category error that both sides exploit: Canton reports flows and represented assets; Ethereum reports stock of transferable assets. Any fair comparison needs both columns side by side.
- The R3–Solana and Kinexys–Canton moves show permissioned incumbents attaching themselves to public networks; Canton's bet is the reverse (a privacy-first network adding public-chain features such as a token, DEXs and bridges).

### Gaps
- No sourced, current material was found in this session on Aztec (privacy L2), Avalanche Evergreen subnets, Hedera, Polygon, Hyperledger Besu/Fabric, Plume or Ondo Chain versus Canton; any comparison on those must be researched separately. The only Canton-side statement is the generic "private side-chain (like Avalanche)" argument in the official FAQ.
- Stripe's chain is Tempo; no separate "Stripe chain" was found.
- The Protofire guide "Onchain Privacy for Institutions: Canton, FHE, ZK" ([link](https://protofire.io/guides/onchain-privacy-for-institutions/)) and the OpenZeppelin "Technical Risk Assessment on Blockchain Networks" PDF ([link](https://openzeppelin.com/hubfs/OpenZeppelin%20%7C%20Technical%20Risk%20Assessment%20on%20Blockchain%20Networks.pdf)) look directly relevant but could not be read.

---

## 7. Criticisms and controversies, with named sources and rebuttals

### Takeaway
The criticisms are substantive and several are partly conceded by Canton's own leadership or governance documents: no public verifiability today, Super Validator admission by vote of incumbents, only 13 SV nodes actually running, reward rules that had to be rewritten to curb farming, and headline RWA numbers that are "represented" rather than transferable. The rebuttals are also substantive: SVs order encrypted messages and cannot read or selectively censor transactions, regulated assets are permissioned on every chain, and emissions were restructured away from SVs in January 2026.

### Cited Findings

**(a) "Not a real blockchain / a private database / no shared ledger"**
- Unchained ran three pieces in spring 2026: an interview with Yuval Rooz titled "Is Canton Permissionless? CEO Says Yes, but SuperValidators Need Approval"; "The Big Canton Debate" with Alex Gluchowski (Matter Labs) and Haseeb Qureshi (Dragonfly); and a Chopping Block episode with Evgeny Gaevoy (Wintermute) asking whether Canton is "just TradFi with extra steps". The stated charges: Canton cannot enforce financial rules without a trusted third party, validators are "permissioned in everything but name", and there is no universally shared ledger — [Unchained](https://unchainedcrypto.com/is-canton-permissionless-why-crypto-is-fighting-over-what-the-word-means/), [Unchained debate](https://unchainedcrypto.com/the-big-canton-debate-is-it-permissionless-is-it-a-blockchain/), [Chopping Block](https://unchainedcrypto.com/the-chopping-block-is-canton-a-real-blockchain-ethereums-cypherpunk-dilemma-ai-security-chaos/) [search]
- Bankless: podcast "Is Canton Even a Real Blockchain?" with Rooz, and article "Is Canton a Real Blockchain?" — [Bankless](https://www.bankless.com/read/is-canton-a-real-blockchain), [podcast](https://www.bankless.com/podcast/is-canton-even-a-real-blockchain) [search]
- The Defiant: "Canton is a permissioned network, and it shouldn't be a matter of debate" — [The Defiant](https://thedefiant.io/newsletter/defi-daily/the-canton-blockchain-debate-permissioned-or-not) [search]
- A critic quoted on blockchain.news calls it "a fully permissioned DAG with no globally verifiable" state — [blockchain.news](https://blockchain.news/flashnews/canton-criticized-as-permissioned-blockchain-by-itsdave-ada) [search]
- 4Pillars frames Canton as "the most institutional blockchain, the most controversial blockchain", reducing the debate to whether it is public and whether it is a blockchain at all — [4Pillars](https://research.4pillars.io/en/research/canton-the-most-institutional-blockchain-the-most-controversial-blockchain) [search]
- Flashbots forum: "Deep Dive on Permissioned Blockchains – The Canton Network" — [Flashbots Collective](https://collective.flashbots.net/t/deep-dive-on-permissioned-blockchains-the-canton-network/5517) [search] (not read)
- **Rebuttal (official)**: "That gets Canton backwards. Canton is permissionless at the network layer and sovereign at the application layer"; like the internet, where a bank portal is permissioned but the network is public — [FAQ PDF](https://www.canton.network/hubfs/Canton_network_faq_Final.pdf) [fetched]
- **Rebuttal (Rooz, DL News at EthCC)**: Ethereum L2s also rely on centralized sequencers; the criticism "is a compliment"; critics are "crypto ideologues that keep on confusing crypto assets versus real-world assets"; the point of blockchains is not to remove intermediaries — [DL News](https://www.dlnews.com/articles/defi/canton-network-ceo-addresses-criticism-from-crypto-ideologues/) [search]
- **Regulatory framing**: the SEC staff no-action materials describe Canton as public and permissionless while noting SV admission needs two-thirds approval; the relief relies on Digital Asset's own representations and is a staff position, not a Commission ruling — [Unchained](https://unchainedcrypto.com/canton-coin-is-a-digital-commodity-sec-staff-say-in-letter-covering-network-rewards/), [Disruption Banking](https://www.disruptionbanking.com/2026/11/05/sec-staff-call-canton-coin-a-digital-commodity-relying-on-digital-assets-own-representations/) [search]

**(b) Permissioned Super Validators dominated by Digital Asset and Wall Street firms**
- Admission: a CIP sponsored by existing SVs, then a 2/3 vote of SV node operators — [FAQ PDF](https://www.canton.network/hubfs/Canton_network_faq_Final.pdf) [fetched]. Justin Bons (Cyber Capital) calls the process invitation-only and direct evidence of centralization — [Blockonomi](https://blockonomi.com/is-canton-really-blockchain-researcher-says-it-fails-every-decentralization-test/) [search]
- Only 13 SVs are "shown online" versus ~60 claimed; the Foundation's explanation is that many SVs run "on a multi-tenant model with their votes coordinated and submitted by the hosting Super Validator" — [FAQ PDF](https://www.canton.network/hubfs/Canton_network_faq_Final.pdf) [fetched]
- Primary data, MainNet config read 26 Nov 2026: 13 SV node identities. Share of configured reward weight: Global-Synchronizer-Foundation node 46.2% (hosting 52 beneficiary entries such as Broadridge, Circle, Chainlink, Kaiko, DTCC, Nasdaq, Paxos, Franklin Templeton, Société Générale), MPC Holding 16.0% (hosting Visa, LSEG, a16z, Marex, Hex Trust, Blockdaemon, Canton Strategic Holdings), Five North 8.6% (hosting Apollo, QCP, Further, ChainSafe, Bosphorus), Digital Asset 8.3% across two nodes, Cumberland 7.1% across two nodes, C7 2.8%, SV-Nodeops 2.7%, Tradeweb 2.6%, Orb-1 2.6%, Liberty City Ventures 2.6%, Proof Group 0.3% — [approved-sv-id-values.yaml](https://raw.githubusercontent.com/canton-foundation/configs/main/configs/MainNet/approved-sv-id-values.yaml) [fetched]. Many large-name entries (DTCC, Nasdaq, Visa, LSEG, a16z, Paxos, USDT0, Mesh) are "ghost"/escrow parties whose weight is earned on milestones.
- Bankless reported that SVs, "primarily early network investors", received 48% of emissions and control which apps are featured, keeping "the flow of CC tokens… heavily controlled by insiders" — [Bankless](https://www.bankless.com/read/is-canton-a-real-blockchain), [How Canton Network Works](https://www.bankless.com/read/how-canton-network-works) [search]. In the first six months 80% of minted CC reportedly went to 42 SVs; critics say early SVs accumulated a large amount of CC, creating an uneven playing field — [DL News](https://www.dlnews.com/articles/defi/canton-network-ceo-addresses-criticism-from-crypto-ideologues/) [search]
- Alex Gluchowski: the model "lacks redundancy and introduces centralization risks"; it relies on trusted operators segregating data — [KuCoin news](https://www.kucoin.com/news/flash/canton-challenges-ethereum-s-institutional-adoption-with-zk-criticism), [Token Dispatch](https://www.thetokendispatch.com/p/canton-picked-a-fight) [search]
- **Rebuttals**: the SV share was cut from 48% to 20% in Jan 2026 — [X/@CantonNetwork](https://x.com/CantonNetwork/status/2010761692616315100) [search]; SVs "purely act as a coordination layer and a timestamping layer" and cannot see transaction contents — [Crypto Briefing](https://cryptobriefing.com/yuval-rooz-achieving-on-chain-capital-markets-requires-solving-privacy-and-settlement-finality-misconceptions-about-canton-are-unfounded-and-super-validators-play-a-crucial-role-in-transaction-proc/) [search]; an SV "cannot pick and choose which transactions to process", though SVs collectively can, by 2/3 vote, block a validator or party from the Global Synchronizer (e.g. OFAC-listed) — [FAQ PDF](https://www.canton.network/hubfs/Canton_network_faq_Final.pdf) [fetched]; "Digital Asset is just one of the ~60 Super Validators"; the Foundation is "entirely independent of Digital Asset" — [FAQ PDF](https://www.canton.network/hubfs/Canton_network_faq_Final.pdf) [fetched]; Rooz argues merit-based admission is no less fair than a capital requirement — [whatiscanton.com summary](https://whatiscanton.com/) [search]; CIP-0105 (approved 2 Mar 2026) makes SV weight depend on locking lifetime rewards, with unlocks vesting over 365.25 days, "replac[ing] reputational assurances with cryptographic proof of alignment" — [CIP-0105](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0105/cip-0105.md) [fetched]
- The Foundation's own answer on decentralisation is combative: "Trick question — we don't need to prove this like public networks because all Validators operate independently, and are only party to the transactions they need to validate" — [FAQ PDF](https://www.canton.network/hubfs/Canton_network_faq_Final.pdf) [fetched]

**(c) Reward farming and wash activity**
- Governance documents concede the risk: uncapped rewards meant "Apps may optimize for reward farming rather than sustainable usage" — [CIP-0098](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0098/cip-0098.md); validators "can collect liveness rewards… without otherwise participating" (free-rider problem), so liveness rewards were cut to zero by 30 Apr 2026 — [CIP-0096](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0096/cip-0096.md); self-reported activity markers were replaced by measured traffic — [CIP-0104](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0104/cip-0104.md) [all fetched]
- The featured-app form asks "Does your application have any controls to prevent non-bona fide transactions?" and whether the business will rely on app rewards — [Featured App Request](https://canton.foundation/featured-app-request/) [fetched]
- Outside commentary: featured apps could mint up to 100x the CC burned in fees, which made wash-trading and artificial fee generation "a real risk"; the stated safeguard is committee oversight — [Nick Sawinyh](https://sawinyh.com/blog/canton-coin-tokenomics/), [Bankless](https://www.bankless.com/read/how-canton-network-works) [search]
- **Rebuttal/remedy**: the $1.50 cap, the 0.79 mint-per-$1-burn cap, CC locking for featured apps and committee revocation powers (above). CantonNews frames CIP-0116 as a "shift from incentives to accountability" — [CantonNews](https://cantonnews.org/cip-0116-canton-s-shift-from-incentives-to-accountability) [search]

**(d) Opaque RWA numbers**
- Conflux co-founder "Forgiven" (Dec 2025) accused rwa.xyz of inflating the RWA total to ~$410B, about 91% of it from Canton, and said ~$18B of distributed value was the honest measure — [Bitget News](https://www.bitget.com/news/detail/12560605118235), [Lookonchain](https://lookonchain.com/feeds/41080) [search]. He leads a competing chain; no direct rwa.xyz rebuttal was found.
- Austin Campbell argues Canton's reported repo volume is secondary reporting data rather than real market activity — via [4Pillars](https://research.4pillars.io/en/research/canton-the-most-institutional-blockchain-the-most-controversial-blockchain) / [DL News](https://www.dlnews.com/articles/defi/canton-network-ceo-addresses-criticism-from-crypto-ideologues/) [search]
- Justin Bons: the reported $326B+ RWA figure would be unaffected if the network shut down tomorrow; DeFiLlama reportedly lists Canton TVL at $0 — [Blockonomi](https://blockonomi.com/is-canton-really-blockchain-researcher-says-it-fails-every-decentralization-test/), [LiveBitcoinNews](https://www.livebitcoinnews.com/researcher-says-canton-resembles-banking-system-not-crypto/) [search]
- "Canton's reported figures for daily transactions and monthly volume come from the network's own reporting" — [The Synthesis](https://thesynthesisai.substack.com/p/the-invisible-ledger) [search]
- **Rebuttal**: rwa.xyz's distributed/represented split is definitional, not an error — [defiprime](https://defiprime.com/distributed-vs-represented-rwa-framework) [search]; Canton claims tokenized assets on it are the legal books and records, "not just the synthetic representation" — [ecosystem guide](https://www.canton.network/blog/the-ultimate-guide-to-canton-networks-ecosystem) [fetched]; Rooz: the network is "opaque by design, a necessity for its institutional users" — [DL News](https://www.dlnews.com/articles/defi/canton-network-ceo-addresses-criticism-from-crypto-ideologues/) [search]

**(e) Lack of public verifiability because of privacy**
- Gluchowski: participants can check their own transactions but cannot verify system-wide properties such as total supply — [Cointelegraph](https://cointelegraph.com/magazine/canton-zksync-clash-blockchains-enforce-rules) [search]
- Rooz conceded Canton does not have public verifiability and said it is planned; he countered that public-chain users also trust issuers (citing hacks involving assets like USDC). Shaul Kfir said Gluchowski is "confusing the capabilities of Canton" with implementations by centralized RWA issuers. Cointelegraph called the divide unresolved — [Cointelegraph](https://cointelegraph.com/magazine/canton-zksync-clash-blockchains-enforce-rules) [search]
- Developers criticised DTCC's choice of Canton over transparency and KYC-gated access; named critic Cyprien Grau of Status Network — [The Coin Republic, 23 Dec 2025](https://www.thecoinrepublic.com/2025/12/23/developers-bash-dtccs-8-trillion-tokenization-infrastructure-pick-over-lack-of-transparency/) [search]
- Critics also call Canton's privacy "trust-by-policy" — [The Bright Minded](https://www.thebrightminded.com/news/arc-canton-and-tempo-the-same-privacy-principle-two-opposite-architectures-and-nine-years-of-evidence/) [search]
- **Rebuttal**: Canton "offers privacy, not anonymity"; issuers, CSDs and regulators see what they must — [FAQ PDF](https://www.canton.network/hubfs/Canton_network_faq_Final.pdf) [fetched]; The Tie argues hidden-state ZK designs trade auditability for confidentiality and cites a 2026 soundness bug — [The Tie pt 5](https://www.canton.network/blog/the-canton-network-series-part-5-of-5) [fetched]; Rooz presents the design as a guard against state-sponsored DeFi hacks — [Decrypt](https://decrypt.co/366086/how-canton-network-lets-institutions-guard-against-defi-security-risks) [search]

**(f) Token: inflation, concentration, sell pressure**
- Bons puts CC inflation at 21.8% — [Blockonomi](https://blockonomi.com/is-canton-really-blockchain-researcher-says-it-fails-every-decentralization-test/) [search]
- "Is Canton's Token Meant to Lag?" argues minting has outpaced burning — [thelearningpill](https://thelearningpill.substack.com/p/is-cantons-token-meant-to-lag) [search]; a counter-piece says the "$377M inflationary loss" framing is wrong and the spread is protocol inflation, not an operating loss — [CantonNews](https://cantonnews.org/insights/cantons-377m-inflationary-loss-is-the-wrong-frame) [search]
- A critical X thread (48% to SVs, 5% dev fund, large featured-app multiplier, "mechanism to enrich insiders") was blamed for a 3.78% price drop in thin liquidity — [CoinMarketCap](https://coinmarketcap.com/top-stories/6aa2ab0874987d0665b12859/) [search]
- Top-100 wallets hold ~89% of circulating CC (Grayscale filing, June 2026) — [DropsTab](https://news.dropstab.com/research/canton-network-the-blockchain-powering-wall-street) [search]
- CC fell from ~$0.16 (Feb 2026, ~$6.0B cap) to ~$0.073–0.084 (Nov 2026, ~$3.0–3.4B) — [MEXC](https://www.mexc.com/tr-CT/news/705011), [Coinbase](https://www.coinbase.com/price/canton) [search]
- **Rebuttal**: "No pre-mine, no VC allocations: every token in circulation has been earned" — [canton.network FAQ](https://www.canton.network/faq) [fetched]; SV locking with one-year linear unlock and featured-app locking with 60-day unlock are designed to slow selling — [CIP-0105](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0105/cip-0105.md), [CIP-0116](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0116/cip-0116.md) [fetched]

**(g) Retail access and cultural clash**
- Validator onboarding needs sponsorship and committee approval; featured status needs a committee presentation, an SV sponsor and a multi-million-CC lock (sections 1 and 3) [fetched sources above]
- Retail users report full waitlists and registration limits (section 2) — [Canton forum](https://forum.canton.network/t/cant-send-money-from-exchange-kraken-to-zoro-wallet/8702) [search]
- crypto.news frames the debate as "TradFi LARP or institutional blockchain pivot" — [crypto.news](https://crypto.news/canton-vs-ethereum-tradfi-larp-or-institutional-blockchain-pivot/) [search]; Token Dispatch: "Wall Street's Stealth Chain", "Canton picked a fight" — [Token Dispatch](https://www.thetokendispatch.com/p/wall-streets-stealth-chain) [search]
- Canton's own summit messaging: "We were not going to build against the financial system. We were going to build with it and for it" — [Summit takeaways](https://www.canton.network/blog/canton-summit-2026-takeaways) [fetched]
- A community researcher (OnePump co-founder, disclosed) asks "Institutions are building Canton. Who brings retail?" in a Nov 2026 grant-tagged article — [X/@stan_havryliuk](https://x.com/stan_havryliuk/status/2124902300917329997) [search]

### Inferences
- The strongest factual criticisms are the ones with primary-source support: 13 running SV nodes; 2/3 incumbent vote for entry; no public verifiability (conceded); reward rules repeatedly patched against farming; top-100 concentration. The weakest are slogans ("private database") that ignore that SVs cannot read payloads.
- The strongest rebuttals are the January 2026 emissions cut and the locking CIPs; the weakest is the "trick question" answer on decentralisation, which will read as evasive to a crypto-native audience.
- The MainNet config shows the Foundation-hosted node carrying ~46% of configured reward weight on behalf of ~50 beneficiaries. This is reward weight, not vote share, but it is exactly the kind of fact that neither critics nor defenders have presented clearly.

### Gaps
- No documented case of a featured app being unfeatured for wash activity was found; whether enforcement has happened is unknown.
- No on-chain analysis of SV selling/unlock flows was found; "sell pressure" claims are argued from design and price, not flow data.
- Exact quotes from the Unchained, Bankless and Chopping Block episodes were not retrieved (no transcripts read). The "ledger with marketing" phrase could not be confirmed and should not be quoted.
- A sentiment tally seen in one search summary (about 55% positive, 20% critical, 25% neutral on X, mid-Oct to mid-Nov 2026) could not be attributed to a specific source and is unverified.

---

## 8. Community

### Takeaway
The official community is large on paper (about 100k X followers and 93–96k Discord members) with a modest active core (2–3.5k online), plus an organised fan layer (Canton Army, CantonNews with a 408-creator directory). A Turkish-language community exists but is thinly documented. The first formal creator incentive is the Canton Community Research Grants, started November 2026.

### Cited Findings
- X: @CantonNetwork ~101.9K followers in the latest snapshot seen (84.4K in an older one; ~102,776 cited July 2026) — [X/@CantonNetwork](https://x.com/CantonNetwork) [search]
- Discord: 93,162 members, ~2,286 active (CertiK Skynet); 95,889 members, 3,473 online (CommunityOne) — [CertiK Skynet](https://skynet.certik.com/projects/canton-network), [CommunityOne](https://communityone.io/servers/1379531004116471878/canton-network/) [search]
- Official channels: X @CantonFdn, discord.gg/canton, Telegram t.me/CantonNetwork1, LinkedIn, GitHub; canton.network also links a YouTube channel — [Canton Foundation footer](https://canton.foundation/), [canton.network blog](https://www.canton.network/blog) [fetched]
- Canton Army: independent fan community; self-reports 110,000+ members and 20,000+ X followers; publishes wallet and app round-ups — [cantonarmy.com](https://www.cantonarmy.com/), [X/@CantonArmy](https://x.com/CantonArmy/status/2052109536010399829) [search]
- CantonNews: creator directory (408 creators), an editor-scored leaderboard (score out of 10 per approved piece), monthly "Canton Signal" recaps, live stats — [creators](https://cantonnews.org/community/creators), [leaderboard](https://cantonnews.org/community/leaderboard) [search]
- **Canton Community Research Grants** (announced 4 Nov 2026): up to 50,000 CC per month at the Foundation's sole discretion; covers original research and educational content (written or video) published 1–30 Nov 2026; share on X tagging @CantonFdn with #CantonResearchNov26 by 4 Dec 2026; KYC, sanctions screening and a grant agreement required; "thoughtful, constructive criticism supported by research" welcome; "Artificial or purchased engagement will be disregarded"; recipients must disclose the grant — [Canton Foundation](https://canton.foundation/introducing-the-canton-community-research-grants/) [fetched]
- Yuval Rooz on the grants: "This initial program mainly tests ease of administration and scaling. We aim to do more." (4 Nov 2026) — [X/@YuvalRooz](https://x.com/YuvalRooz/status/2118087482265030915) [search]
- Turkish-speaking community: an account "Canton Network Türkiye @CantonNetwrkTR" is referenced in a Canton Foundation post — [X/@CantonFdn](https://x.com/CantonFdn/status/1976272555754574162) [search]; Turkish KOL @Ferhat_NZ posted a Turkish summary of the grants (206 likes, 4 Nov 2026) — [X/@Ferhat_NZ](https://x.com/Ferhat_NZ/status/2118085284512375135) [search]; Turkish explainers exist at [Kriptofoni](https://www.kriptofoni.com/canton-cc-coin-nedir/) and [WEEX TR](https://www.weex.com/tr-CT/learn/articles/what-is-canton-network-pioneering-institutional-crypto-with-canton-coin-cc-and-privacy-preserving-blockchain-innovation-8168) [search]
- Named independent voices found: Stan Havryliuk, Shelley (@shelleymaeph), Aliba (@Aliba_79), thelearningpill (Substack), Nick Sawinyh, Michael Hypov, Tanay Ved (Coin Metrics), Thejaswini M A (Token Dispatch), Saurabh Deshpande (Decentralised.co); critics Justin Bons, Alex Gluchowski, Austin Campbell, Haseeb Qureshi, Evgeny Gaevoy (sources in sections 7 and 9) [search]
- Publicly listed treasury vehicle Canton Strategic Holdings (Tharimmune, ticker CNTN) publishes quarterly ecosystem reports and is an SV beneficiary — [StockTitan](https://www.stocktitan.net/news/CNTN/canton-strategic-holdings-inc-delivers-third-quarter-canton-network-l0es0li82dvp.html) [search]; [SV config](https://raw.githubusercontent.com/canton-foundation/configs/main/configs/MainNet/approved-sv-id-values.yaml) [fetched]

### Inferences
- Much "independent" coverage is produced by parties with CC exposure (SV beneficiaries, app founders, validators). The grants' disclosure rule exists for this reason; clearly disclosed, genuinely independent work is scarce and therefore differentiated.
- November 2026 engagement on grant-tagged posts is modest (tens to low hundreds of likes), so a well-made piece can stand out.

### Gaps
- No formal ambassador programme was found. Telegram member counts, the size of the Turkish community and its channels were not found. Follower counts for individual KOLs were not retrieved.
- The grants' Terms and Conditions page exists on canton.foundation but its body text could not be extracted in this session; eligibility details (countries, age, AI-generated content) must be read directly.

---

## 9. Existing research and educational content, overdone angles, open questions, untried formats

### Takeaway
Long-form written explainers and tokenomics threads are abundant and repetitive; data dashboards are plentiful. What was not found anywhere: interactive simulators, games, quizzes, comics or visual "who sees what" tools, and neutral data work that reconciles the conflicting headline numbers.

### Cited Findings

**Best existing material (title, author, date, angle)**
- "Understanding Canton Network: A Comprehensive Overview", Messari / Blockworks Research, ~May 2026, 22 pages: architecture, privacy, tokenomics, governance, adoption — [Messari](https://messari.io/report/understanding-canton-network-a-comprehensive-overview), [Blockworks](https://app.blockworks.com/report/understanding-canton-network-a-comprehensive-overview) [search] (promoted by Digital Asset as "independent")
- "The Canton Network Series" parts 1–5, The Tie, 2025 – 9 Sep 2026: stablecoins (pt 3), state of the network (pt 4, 22 Oct 2025), privacy models (pt 5) — [pt 4](https://www.canton.network/blog/the-canton-network-series-part-4-of-5), [pt 5](https://www.canton.network/blog/the-canton-network-series-part-5-of-5) [fetched]. The Tie is an SV reward beneficiary — [SV config](https://raw.githubusercontent.com/canton-foundation/configs/main/configs/MainNet/approved-sv-id-values.yaml) [fetched]
- "Inside the Canton Network", Talos with Coin Metrics data (Tanay Ved), Nov 2025 — [Talos](https://www.talos.com/insights/inside-the-canton-network-a-special-insights-report) [search]; "Canton Network Overview", Coin Metrics State of the Network #321 — [Coin Metrics](https://coinmetrics.substack.com/p/state-of-the-network-issue-321) [search]
- "The State of Canton", Dfns — [Dfns](https://dfns.co/reports/the-state-of-canton) [search]
- "State of the Canton Network – H1 2026", Palladium Labs, July 2026, 51 pages, 16 categories — [CantonNews summary](https://cantonnews.org/state-of-the-canton-network-h1-2026-key-findings-from-palladium-labs) [search]
- Canton Strategic quarterly ecosystem reports (Q1 2026 dated 16 Apr 2026; Q3 on 14 Oct 2026) — [Q1 PDF](https://cdn.prod.website-files.com/697d5b6446aa7378c74b26d0/69e14b7e09c6eed9fcb9d4fd_Canton_Q1%202026%20Ecosystem%20Report_04.16.26.pdf) [search]
- "Canton: The Most Institutional Blockchain, The Most Controversial Blockchain", 4Pillars — [4Pillars](https://research.4pillars.io/en/research/canton-the-most-institutional-blockchain-the-most-controversial-blockchain) [search]
- "How Canton Network Works" and "Is Canton a Real Blockchain?", Bankless — [Bankless](https://www.bankless.com/read/how-canton-network-works) [search]
- "The Rise of Corporate Blockchains", VanEck (Matthew Sigel), Mar 2026 — [VanEck](https://www.vaneck.com/us/en/blogs/digital-assets/matthew-sigel-the-rise-of-corporate-blockchains/) [search]
- "Institutional Blockchains: Ethereum vs Canton vs Arc" and "Onchain Privacy for Institutions: Canton, FHE, ZK", Protofire, Oct 2026 — [Protofire](https://protofire.io/guides/institutional-blockchains/) [search]
- "Canton Network: RWA Deep Dive", Bloodstone Capital, June 2026 — [Bloodstone](https://www.bloodstonecapital.co.uk/research/journal/canton-network-rwa-deep-dive-june-2026) [search]
- "Canton Network: Alpha or Beta Bet on a Privacy Chain?", DropsTab — [DropsTab](https://news.dropstab.com/research/canton-network-the-blockchain-powering-wall-street) [search]
- "Going Institutional", Saurabh Deshpande, Decentralised.co — [link](https://www.decentralised.co/p/going-institutional) [search]
- "Canton Network: Connecting Trillions On-chain" and "Is Canton's Token Meant to Lag?", thelearningpill — [link](https://thelearningpill.substack.com/p/connecting-trillions-on-chain) [search]
- "Canton Coin ($CC) Tokenomics: The Institutional Blockchain That Pays Its Builders", Nick Sawinyh — [link](https://sawinyh.com/blog/canton-coin-tokenomics/) [search]
- "Canton Network 101 in Simple Terms", Michael Hypov — [link](https://techhyvc.substack.com/p/canton-network-101-in-simple-terms) [search]; "The Canton Network, explained", Frame — [link](https://frame.xyz/insights/canton-network/) [search]; "What is Canton Network and why it matters", CoinShares — [link](https://coinshares.com/insights/knowledge/what-is-canton-network-and-why-it-matters/) [search]
- "The Invisible Ledger", The Synthesis — [link](https://thesynthesisai.substack.com/p/the-invisible-ledger) [search]; "Wall Street's Stealth Chain" and "Canton picked a fight", Token Dispatch — [link](https://www.thetokendispatch.com/p/canton-picked-a-fight) [search]
- "2026 is the year of pragmatic privacy in crypto: Canton, Zcash and more", Cointelegraph Magazine — [link](https://cointelegraph.com/magazine/2026-pragmatic-privacy-crypto-canton-zcash-ethereum-foundation) [search]
- Podcasts: Unchained (three episodes), Bankless, The Chopping Block (section 7)
- Official: "Canton Network Primer: 8 Terms to Get You Started" (1 Jul 2026) — [link](https://www.canton.network/blog/canton-network-primer-8-terms); "The Ultimate Guide to Canton Network's Ecosystem" (29 Oct 2025) — [link](https://www.canton.network/blog/the-ultimate-guide-to-canton-networks-ecosystem); searchable FAQ PDF (27 Jul 2026) — [link](https://www.canton.network/hubfs/Canton_network_faq_Final.pdf) [fetched]; "A Technical Primer" — [link](https://www.canton.network/blog/a-technical-primer) [search]
- Community reference sites: [whatiscanton.com](https://whatiscanton.com/), [canton.wiki/learn](https://canton.wiki/learn) (wallet, validator, CantonScan, DeFi guides), [cantonnews.org/get-started](https://cantonnews.org/get-started), [syncinsights "11 analytics tools compared"](https://syncinsights.io/blog/canton-network-analytics-tools-11-options-compared), [BitSafe hub](https://hub.bitsafe.finance/canton-defi-ecosystem) [search]
- November 2026 grant-tagged pieces: "Why Canton Needs Retail: What a Week of Memecoin Trading Shows" (Stan Havryliuk, 23 Nov; OnePump vs Robinhood Chain vs Pump.fun) — [link](https://x.com/stan_havryliuk/status/2124902300917329997); "I Spent Hours Digging Through Canton's Docs. These 7 Details Stood Out." (Shelley) — [link](https://x.com/shelleymaeph/status/2119772131051344006); Aliba's thread on the "third route" (20 Nov) — [link](https://x.com/Aliba_79/status/2123626584397774992) [search]
- Quest-style learning exists for developers only: AngelHack's Canton Core Academy "Learn & Earn" — [ecosystem guide](https://www.canton.network/blog/the-ultimate-guide-to-canton-networks-ecosystem) [fetched]

**Formats**
- A search for Canton explainers returned only written guides; no YouTube explainer, interactive simulator or quiz surfaced — [search result set led by Messari](https://messari.io/report/understanding-canton-network-a-comprehensive-overview) [search]
- Small interactive tools found: an emissions/halving countdown — [link](https://cc-halving-countdown.vercel.app/); a featured-app lock tracker — [link](https://ccview.io/featured-app-locking/); a community ecosystem dashboard — [GitHub](https://github.com/guelowrd/canton-ecosystem-dashboard) [search]
- Playful crypto education precedents: CryptoZombies (Loom Network) teaches Solidity by building a zombie collectibles game and reports 400k+ registered users — [cryptozombies.io](https://cryptozombies.io/en/course), [OnchainStack](https://www.onchainstack.io/cryptozombies) [search]; Ethernaut is a web-based wargame played in the EVM — [Hashnode overview](https://frankiefab.hashnode.dev/learn-blockchain-development-by-playing-games) [search]

### Inferences
- **Overdone angles**: "Wall Street's blockchain" overviews; "what is Canton / CC" explainers; burn-mint tokenomics threads; partnership round-ups; lists of apps and wallets; "is it a real blockchain" opinion pieces; price commentary.
- **Poorly explained or unanswered questions** (each traceable to a finding above):
  1. Who actually runs the Global Synchronizer: 13 nodes vs ~45 active vs ~60 approved SVs, hosted/"ghost" parties, and how reward weight differs from votes (section 7b).
  2. What exactly counts in "$6T", "$9T monthly", "$300B/day", "$30tn available" versus rwa.xyz "represented" vs "distributed" and DeFiLlama TVL (sections 5, 7d).
  3. What a validator operator can see about the retail users it hosts, and what "self-custody" means on Canton (section 2).
  4. What Super Validators and sequencers can and cannot see or censor, including the collective 2/3 power to block a party (section 7b).
  5. Featured-app economics after CIP-0098/0104/0116: who can afford a 5M/25M CC lock, and how much a real app earns per $1 of burn (section 1).
  6. Whether reward farming happened, how much, and whether anyone was unfeatured (section 7c).
  7. What "public verifiability is planned" concretely means (section 7e).
  8. Why validator counts moved (800+ → 700+) after liveness rewards ended (section 5).
  9. A retail user's true cost and steps for a first transfer (~$1 target fee, preapprovals, 24h window) (section 2).
  10. Energy use at late-2026 scale versus the Aug 2025 MiCA snapshot (section 4).
- **Formats not found in any search**: an interactive "who sees what" privacy simulator for a DvP trade; a role-play game (be a Super Validator, a featured app, a regulator, a farmer); a burn-mint or featured-app reward calculator; a quiz that corrects misconceptions; a comic or illustrated story; a jargon-free onboarding walkthrough with screenshots; a reconciled, sourced data dashboard of headline numbers with methodology notes; Turkish-language deep research.
- The grants name only "written research and video" as eligible formats. An interactive piece would likely need an accompanying written article or video to fit the stated criteria; this is an inference from the announcement text, not a stated rule.
- Other well-known playful precedents worth checking as inspiration (from background knowledge, **not verified in this session**): Speedrun Ethereum (BuidlGuidl), Anders Brownworth's blockchain demo, Nicky Case's "The Evolution of Trust" (game-theory explainer, not crypto), EVM Puzzles, learnmeabitcoin. Whether any won grants was not confirmed.

### Gaps
- "Not found by search" is not proof of absence: X threads, YouTube and Discord could not be browsed directly, so some interactive or video content may exist.
- No Delphi Digital or Galaxy Research report on Canton surfaced; Kaiko appeared only through coverage of the 21Shares Canton ETF (TCAN) — [TokenPost](https://www.tokenpost.com/news/business/20480) [search].
- Publication dates for several Substack/blog pieces could not be confirmed.

---

## 10. Common misconceptions newcomers have

### Takeaway
Misconceptions run in both directions: crypto natives under-credit Canton's privacy mechanics and over-read "private database", while newcomers arriving via the CC token over-read the trillion-dollar figures and assume Ethereum-style wallets, explorers and permissionless participation.

### Cited Findings
- "Super Validators see or control everything." Official position: SVs "cannot decrypt or read the underlying transaction payloads"; "cannot see all data or unilaterally censor transactions" — [primer](https://www.canton.network/blog/canton-network-primer-8-terms) [fetched]. Nuance: collectively, by 2/3 vote, they can block a validator or party — [FAQ PDF](https://www.canton.network/hubfs/Canton_network_faq_Final.pdf) [fetched]
- "Canton is a private permissioned chain." Official: permissionless at the network layer, permissioned per application; but validator onboarding currently needs sponsorship and SV entry needs a 2/3 vote — [FAQ PDF](https://www.canton.network/hubfs/Canton_network_faq_Final.pdf), [canton.network FAQ](https://www.canton.network/faq) [fetched]
- "There are 60 Super Validators running the network." ~60 approved organisations, but 13 node identities; many are hosted with votes submitted by the host — [FAQ PDF](https://www.canton.network/hubfs/Canton_network_faq_Final.pdf), [SV config](https://raw.githubusercontent.com/canton-foundation/configs/main/configs/MainNet/approved-sv-id-values.yaml) [fetched]
- "Canton = Digital Asset" / "Global Synchronizer = Canton Network." The FAQ separates Canton (network), Digital Asset (company, one SV) and the Canton Foundation, and treats the Global Synchronizer as one synchronizer among many possible ones — [FAQ PDF](https://www.canton.network/hubfs/Canton_network_faq_Final.pdf) [fetched]
- "Privacy means anonymity" / "Canton uses ZK proofs." "Canton offers privacy, not anonymity"; "Does Canton use ZKPs? No" — [FAQ PDF](https://www.canton.network/hubfs/Canton_network_faq_Final.pdf) [fetched]
- "You must hold CC to use Canton." No; fiat "gas stations" buy traffic for you — [FAQ PDF](https://www.canton.network/hubfs/Canton_network_faq_Final.pdf) [fetched]
- "CC has a 100 billion hard cap." Canton has rejected a fixed cap; supply follows a curve with burn-mint — [Bitget News](https://www.bitget.com/news/detail/12560605055166), [DropsTab](https://dropstab.com/coins/canton-network) [search]
- "No pre-mine means widely distributed." Every coin was earned, yet early SVs received most early emissions and the top-100 wallets reportedly hold ~89% — [canton.network FAQ](https://www.canton.network/faq) [fetched]; [DropsTab](https://news.dropstab.com/research/canton-network-the-blockchain-powering-wall-street) [search]
- "$6T / $9T / $30tn is TVL on Canton." These are assets processed, represented or made available by institutional apps; rwa.xyz classes nearly all of Canton's value as "represented" — [ecosystem guide](https://www.canton.network/blog/the-ultimate-guide-to-canton-networks-ecosystem) [fetched]; [defiprime](https://defiprime.com/distributed-vs-represented-rwa-framework) [search]
- "I can look anything up on an explorer" / "MetaMask works." Explorers show only your own activity (CC flows aside); Canton-native wallets are required — [docs](https://docs.canton.network/integrations/apps/finding-apps) [fetched]; [CantonNews get-started](https://cantonnews.org/get-started) [search]
- "Featured app is a listing badge." It is a reward-minting right with a 5M/25M CC lock and reporting duties — [CIP-0116](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0116/cip-0116.md), [Featured App Request](https://canton.foundation/featured-app-request/) [fetched]
- "Validators earn just for being online." Liveness rewards were removed by 30 Apr 2026; validator rewards are now proportional to traffic — [CIP-0096](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0096/cip-0096.md), [FAQ PDF](https://www.canton.network/hubfs/Canton_network_faq_Final.pdf) [fetched]
- "MEV/front-running works like on Ethereum." Official: MEV "is almost impossible… without sophisticated collusion" because the sequencer cannot see contents — [FAQ PDF](https://www.canton.network/hubfs/Canton_network_faq_Final.pdf) [fetched]. OnePump's "no mempool means no snipers" claim is being tested by community research — [X/@stan_havryliuk](https://x.com/stan_havryliuk/status/2124902300917329997) [search]
- "JPMorgan's Kinexys runs on Canton." Sources conflict; one describes Kinexys as a permissioned Ethereum-based chain, another says JPM planned JPMD on Canton but it was not confirmed live as of 18 Oct 2026 — [RedStone](https://www.redstone.finance/blog/real-world-assets-in-onchain-finance-report/), [Protofire](https://protofire.io/guides/institutional-blockchains/) [search]
- "Daml 2.x tutorials still apply." The docs say 2.x material "must not be used" — [docs llms.txt](https://docs.canton.network/llms.txt) [fetched]

### Inferences
- Each misconception pairs a short myth with a checkable primary source, which makes this list directly usable for a quiz or myth-vs-fact piece; no such piece was found (section 9).

### Gaps
- No survey or dataset measures how common each misconception is; the list is compiled from official "misconception" call-outs and recurring points in critical coverage.
