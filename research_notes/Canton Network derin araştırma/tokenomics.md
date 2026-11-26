# Canton Coin (CC) tokenomics and network economics — research notes (as of 26 November 2026)

Conventions used in these notes

- "Design" = what the whitepaper, docs or a CIP specifies. "Observed" = on-chain or market data reported by someone. Each observed figure carries its date.
- "Verified" means I read the primary document directly (CIP repository raw files, canton.network whitepaper PDFs, docs.canton.network, canton.foundation). Everything from explorers, market-data sites, news and Substack came through search-result summaries only, because those hosts are blocked from this machine. Those items are marked "(search summary)" and should be treated as lower confidence.
- CIP short links: `CIP-NNNN` = `https://raw.githubusercontent.com/canton-foundation/cips/main/cip-NNNN/cip-NNNN.md`. Index: [CIP README](https://raw.githubusercontent.com/canton-foundation/cips/main/README.md).
- WP = [Canton Coin whitepaper, Digital Asset, July 2024](https://www.canton.network/hubfs/Canton%20Network%20Files/Documents%20(whitepapers%2C%20etc...)/Canton%20Coin_%20A%20Canton-Network-native%20payment%20application.pdf). MiCA WP = [Canton Coin MiCA whitepaper, notified 2025-09-09](https://www.canton.network/hubfs/Canton%20Network%20Files/whitepapers/Canton%20Coin%20%20-%20MiCA%20Whitepaper.pdf).

---

## 1. Launch facts: mint start, premine/presale/VC/foundation allocation, supply schedule and cap

### Takeaway
CC had no premine, presale or founder pool: minting began only when the Global Synchronizer MainNet went live in late June / 1 July 2024, and every coin has been minted by Super Validators (SVs), validators or app providers. There is no hard cap: the curve allows up to 100 billion CC in the first ten years and 2.5 billion per year after that, with actual supply equal to minted minus burned.

### Cited Findings
- Design: "There are no presales or special pools for 'founders'. Canton Coin could only be minted once the fully decentralized Global Synchronizer was running." — [WP](https://www.canton.network/hubfs/Canton%20Network%20Files/Documents%20(whitepapers%2C%20etc...)/Canton%20Coin_%20A%20Canton-Network-native%20payment%20application.pdf)
- Official claim: "launched with no pre-mine, no pre-sale, and no special allocations to founders, VCs, or foundations"; "The Global Synchronizer Foundation received no special token allocation". — [Canton blog, "Canton Coin: rewarding utility"](https://www.canton.network/blog/canton-coin-rewarding-utility)
- MiCA WP: CC "is not issued by an identifiable entity and was not sold in any initial coin offering"; participants mint "directly from the protocol in exchange for providing either infrastructure or applications". The Canton Foundation was registered 24 June 2024 and is the person seeking admission to trading. — [MiCA WP](https://www.canton.network/hubfs/Canton%20Network%20Files/whitepapers/Canton%20Coin%20%20-%20MiCA%20Whitepaper.pdf)
- MainNet launch date is given as 25 June 2024 in CIP-0024. — [CIP-0024 PDF](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0024/cip-00024%20and%20cip%200025%20v0.2%20.pdf)
- The first issuance step (1.5 years) "corresponds to about December 30, 2025 when measured from the MainNet start", which puts the start of the minting clock at about 30 June / 1 July 2024. — [CIP-0104](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0104/cip-0104.md)
- Canton's blog calls the initial phase "July–December 2024". — [Canton blog](https://www.canton.network/blog/canton-coin-rewarding-utility)
- Supply schedule (design): 100 billion CC mintable over the first ten years, split 50/50 between infrastructure providers and app providers; then 2.5 billion CC per year (about 75% apps, 25% infrastructure). — [WP](https://www.canton.network/hubfs/Canton%20Network%20Files/Documents%20(whitepapers%2C%20etc...)/Canton%20Coin_%20A%20Canton-Network-native%20payment%20application.pdf)
- No cap (official): "Everyone looks at the Canton Coin (CC) minting curve and assumes there's a fixed maximum supply of 100 billion. That's wrong"; "There's no hard cap on issuance"; "FDV = MarketCap = CurrentTotalSupply × CurrentMarketPrice". — [Canton blog, "How should we think about FDV?", 31 Oct 2025](https://www.canton.network/blog/canton-coin-how-should-we-think-about-fdv)
- CoinGecko lists max supply as unlimited (search summary). — [CoinGecko](https://www.coingecko.com/en/coins/canton)
- Launch on-chain conversion rate: fixed placeholder of $0.005 per CC. — [CIP-0001/0002/0003 PDF](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0001/CIP-0001-0002-0003.pdf); [WP](https://www.canton.network/hubfs/Canton%20Network%20Files/Documents%20(whitepapers%2C%20etc...)/Canton%20Coin_%20A%20Canton-Network-native%20payment%20application.pdf)
- Later allocations that qualify the "no foundation allocation" claim:
  - CIP-0067 (approved 2025-07-21) gave the Global Synchronizer Foundation a one-time allocation of historical unclaimed rewards, "expected … 1.6 to 1.7 billion CC". — [CIP-0067](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0067/cip-0067.md)
  - CIP-0082 (approved 2025-10-01) routes 5% of all future emissions to a Foundation-governed Development Fund; it states the Foundation then had "SV Weight of 10 and approximately 1.5 billion CC in its treasury". The CIP itself says "Canton was fair-launched, so there is no large premine to draw from." — [CIP-0082](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0082/cip-0082.md)

### Inferences
- "No premine / no presale" is supported by every primary document. "No foundation allocation" was true at launch but is no longer the whole picture: the Foundation holds an SV weight of 10, received roughly 1.6–1.7 billion CC of unclaimed rewards in 2025, and now receives 5% of emissions.
- "Fair launch" does not mean broad distribution. Minting was open only to approved SVs, an invite-only validator set (capped at 200 at launch per CIP-0003) and featured apps, so early supply went to a small institutional group (see section 10).

### Gaps
- The exact timestamp of mining round 0 was not found in a primary source. The two anchors (25 June 2024 launch, about 30 June 2024 curve origin) differ by a few days.
- No primary source states whether Digital Asset investors received CC by any off-protocol arrangement; the documents only describe protocol minting.

---

## 2. Issuance curve: per-round and per-year minting, round length, step changes, split by phase

### Takeaway
Issuance is a step function of time since launch: 40bn, 20bn, 10bn, 5bn and then 2.5bn CC per year, with the SV share falling from 80% to 5% while the app share rises from 15% to 75%. Rounds open every 10 minutes (about 52,560 per year). The network is now in the third phase (10bn/yr; 62% apps, 18% validators, 20% SVs), which runs until roughly mid-2029; since CIP-0082, 5% of each round is taken off the top for the Development Fund.

### Cited Findings
- Whitepaper minting curve (design, verified):

| Years since launch | Max mint / year | Total in phase | Apps | Validators | SVs |
|---|---|---|---|---|---|
| 0–0.5 | 40bn | 20bn | 15% | 5% | 80% |
| 0.5–1.5 | 20bn | 20bn | 40% | 12% | 48% |
| 1.5–5 | 10bn | 35bn | 62% | 18% | 20% |
| 5–10 | 5bn | 25bn | 69% | 21% | 10% |
| 10-year cumulative | — | 100bn | 50bn | 15bn | 35bn |
| 10+ | 2.5bn | 2.5bn/yr | 75% | 20% | 5% |

  — [WP, Figure 4](https://www.canton.network/hubfs/Canton%20Network%20Files/Documents%20(whitepapers%2C%20etc...)/Canton%20Coin_%20A%20Canton-Network-native%20payment%20application.pdf)
- Round length: "A round starts every 10 minutes by default, a parameter the Super Validators may change via governance vote"; per-round issuance is `amuletToIssuePerYear` divided by rounds per year, "roughly 52,560 rounds per year". — [Canton docs, tokenomics reference](https://docs.canton.network/overview/reference/canton-coin-tokenomics.md); [Canton docs, tokenomics of the GS](https://docs.canton.network/overview/reference/tokenomics-of-gs.md)
- The 10-minute round was set by CIP-0002 before launch ("Increase reward round time to 10 minutes"). — [CIP-0001/0002/0003 PDF](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0001/CIP-0001-0002-0003.pdf)
- Per-round anchors from primary documents: first six months, 114,155 CC per round for apps (15% of the round); in phase two, 45,662 CC per round for validators and 152,207 CC per round for apps. — [WP](https://www.canton.network/hubfs/Canton%20Network%20Files/Documents%20(whitepapers%2C%20etc...)/Canton%20Coin_%20A%20Canton-Network-native%20payment%20application.pdf); [CIP-0048](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0048/cip-0048.md)
- Step dates:
  - Step to phase 3: official blog said "round 78,840, coming up around mid-January 2026 … total issuance per block will be cut in half … the SV share of that issuance will fall from 48% → 20%". — [Canton FDV blog](https://www.canton.network/blog/canton-coin-how-should-we-think-about-fdv)
  - CIP-0104 gives the same step as a time offset of 47,304,000,000,000 μs (1.5 years), "about December 30, 2025". Secondary coverage used 1 January 2026 (search summary). — [CIP-0104](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0104/cip-0104.md); [Phemex news](https://phemex.com/news/article/canton-coin-adopts-dynamic-supply-model-with-upcoming-token-halving-34387)
  - Next step (to 5bn/yr, SVs 20% → 10%): "currently forecast to occur late summer 2029" per CIP-0105; "until mid-2029" per the Canton blog. — [CIP-0105](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0105/cip-0105.md); [Canton blog](https://www.canton.network/blog/canton-coin-rewarding-utility)
- Development Fund carve-out: `developmentFundPercentage` (default 5%) "is set aside from each round's issuance … before the remainder is split across the tranches". — [Canton docs](https://docs.canton.network/overview/reference/tokenomics-of-gs.md)
- Unused allocation: within each tranche, per-coupon issuance is capped; surplus flows to the next tranche and "unclaimed rewards beyond all tranches go to SV rewards" (docs). The whitepaper says activity records still open after the minting phase "are reassigned to the pool of unminted Canton Coin". — [Canton docs](https://docs.canton.network/overview/reference/tokenomics-of-gs.md); [WP](https://www.canton.network/hubfs/Canton%20Network%20Files/Documents%20(whitepapers%2C%20etc...)/Canton%20Coin_%20A%20Canton-Network-native%20payment%20application.pdf)

### Inferences
- Computed per-round maxima (annual rate ÷ 52,560), before the 5% Development Fund:

| Phase | Total / round | Apps | Validators | SVs |
|---|---|---|---|---|
| 0–0.5 yr | 761,035 | 114,155 | 38,052 | 608,828 |
| 0.5–1.5 yr | 380,518 | 152,207 | 45,662 | 182,648 |
| 1.5–5 yr (current) | 190,259 | 117,960 | 34,247 | 38,052 |
| 5–10 yr | 95,129 | 65,639 | 19,977 | 9,513 |
| 10+ yr | 47,565 | 35,674 | 9,513 | 2,378 |

  The whitepaper and CIP-0048 anchors (114,155; 45,662; 152,207) match these exactly.
- In the current phase the maximum is about 833 million CC per month, of which about 517 million for apps; the Development Fund's 5% is up to about 500 million CC per year.
- Approximate calendar: phase 1 July–December 2024; phase 2 January 2025 to about January 2026; phase 3 to mid/late 2029; phase 4 to mid/late 2034. Rounds have slipped behind wall-clock time (upgrade downtime pauses rounds, per CIP-0089), which explains why "round 78,840" was expected in mid-January while the 1.5-year offset is 30 December.

### Gaps
- Whether the step triggered on the time offset (about 30 Dec 2025) or at round 78,840 (mid-Jan 2026) was not confirmed from on-chain data.
- The on-chain `IssuanceConfig` values currently live on MainNet were not read directly (Scan is blocked from here).

---

## 3. Burn-mint equilibrium (BME): mechanism, conversion rate, cumulative minted vs burned

### Takeaway
Fees are priced in USD and paid by burning CC at an on-chain CC/USD rate that is the median of rates published by SVs (a fixed vote before listing, a market feed since November 2025). The design target is 2.5bn CC burned and minted per year at steady state. In practice minting has exceeded burning every period so far: about 6.1bn CC burned in total by mid-November 2026 against a supply of about 40bn, with the monthly burn-to-mint ratio rising from about 0.6 in early 2026 to roughly 0.7–0.8 in autumn 2026.

### Cited Findings
Design
- Mechanism: users pay USD-denominated fees by burning CC; providers mint new CC; "network usage must burn 2.5 billion Canton Coins per year to keep the number of Canton Coins in circulation stable". If burn exceeds mint, supply falls and the rate is expected to rise, which lowers the CC burned per dollar of fees; the reverse if burn falls short. — [WP](https://www.canton.network/hubfs/Canton%20Network%20Files/Documents%20(whitepapers%2C%20etc...)/Canton%20Coin_%20A%20Canton-Network-native%20payment%20application.pdf)
- Conversion rate: "Each Super Validator publishes the CC conversion rate they consider appropriate. The rate used for each mining round is the median of all published SV rates"; it is stored as `amuletPrice` on each `OpenMiningRound`. — [Canton docs](https://docs.canton.network/overview/reference/tokenomics-of-gs.md)
- History of the rate:
  - Launch: fixed $0.005. — [CIP-0001/0002/0003 PDF](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0001/CIP-0001-0002-0003.pdf)
  - July 2025: "current Super Validator oracle price of 0.05". — [CIP-0070](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0070/cip-0070.md)
  - CIP-0079 (created 2025-09-15): every SV must ingest a reference price feed (Kaiko cited as an example) and update its on-chain rate at least every 10 minutes, live on MainNet by 2025-10-15. — [CIP-0079](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0079/cip-0079.md)
  - CIP-0092 (approved 2025-11-07): 10-day controlled transition after the first Tier-1 spot listing, with each SV updating its vote at least every 24 hours, then full dynamic market feeds. — [CIP-0092](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0092/cip-0092.md)
- Official supply scenario (31 Oct 2025): if validator and app pools reach equilibrium by mid-2026 and only SV rewards are inflationary, total supply would be under 42bn in July 2026, under 48bn in July 2029 and under 50bn in July 2034. The same post said over 1bn CC had been burned and the network was burning about $900k per day. — [Canton FDV blog](https://www.canton.network/blog/canton-coin-how-should-we-think-about-fdv)

Observed burn (cumulative)
- 14 May–14 Aug 2025: 446,680,130 CC burned, of which 423,475,365 (94.8%) from traffic purchases. — [CIP-0078](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0078/cip-0078.md)
- 8 Apr 2026: 2,898,443,014 CC burned (about $417m at the time), announced by the Canton Foundation (search summary). — [cryptonews.net](https://cryptonews.net/news/altcoins/32682102/)
- 20 Jul 2026: 4.3bn CC (search summary). — [CantonNews](https://cantonnews.org/canton-network-has-burned-4-3-billion-canton-coin-since-launch)
- Early Aug 2026: 4.71bn CC, daily burn about 12–15m CC (search summary). — [thelearningpill Substack](https://thelearningpill.substack.com/p/is-cantons-token-meant-to-lag)
- 9 Nov 2026: "Nearly 6 billion CC has been burned to date. Source: CantonScan"; 16 Nov 2026: 6.13bn (search summary). — [Canton Network on X](https://x.com/CantonNetwork/status/2119874665271157019); [cryptonews.net / Decrypt](https://cryptonews.net/news/altcoins/33761908/)

Observed burn vs mint
- Burn-to-mint ratio 0.596 in Q1 2026 and 0.662 at end of Q2 2026 (search summary). — [thelearningpill Substack](https://thelearningpill.substack.com/p/is-cantons-token-meant-to-lag)
- 90 days to 3 Aug 2026: about 2.0bn minted vs 1.33bn burned, net about +670m CC (+1.71%) on a 39.2bn base (single third-party estimate, search summary). — [DEV Community](https://dev.to/mrnasdog/cc-inflation-analysis-june-2026-mint-still-ahead-of-the-burn-cd5)
- September 2026: about 0.44bn burned vs about 0.65bn (648m) minted, a ratio of about 68% (search summary). — [Alea Research](https://alearesearch.substack.com/p/canton-universal-burn)
- November 2026: daily burn roughly 80% of daily mint per CantonScan data, as reported by Decrypt (search summary). — [cryptonews.net / Decrypt](https://cryptonews.net/news/altcoins/33761908/)
- The Tie's Canton report describes the ratio as moving "toward equilibrium" (official summary of a commissioned report). — [Canton blog, Canton Network Series part 4](https://www.canton.network/blog/the-canton-network-series-part-4-of-5)

### Inferences
- Cumulative minted is roughly 46bn CC (about 40.1bn supply on 26 Nov 2026 plus about 6.1–6.2bn burned). The curve allowed about 49bn by that date (20bn + 20bn + about 0.9 years at 10bn), so about 3bn of allowed issuance was never minted or sits unminted.
- The July 2026 supply came in under the official "< 42bn" scenario (about 39–40bn), but for a different reason than the scenario assumed: validator/app pools were not at equilibrium; rather, a lower CC price raised CC burned per dollar and parts of the tranches went unminted.
- A ratio below 1 is expected by design while SV rewards (20% of issuance) and the Development Fund (5%) have no matching burn. Burn would need to exceed validator-plus-app minting for total supply to shrink.
- Because fees are fixed in USD, a falling CC price mechanically raises CC burned. Rising cumulative burn in CC therefore mixes real usage growth with price decline; the USD burn series is the better usage indicator.

### Gaps
- No primary cumulative-minted figure was retrieved; the 46bn estimate is derived.
- Sources disagree on burn totals for the same period (The Tie: 4.49bn burned 1 Jan–11 Nov 2026 vs CantonScan about 6bn since launch); methods were not reconciled.
- The on-chain conversion rate just before listing was not found in a primary source.

---

## 4. Fees: traffic, transfer, holding, creation — and what was changed or removed

### Takeaway
Only two fee mechanisms remain: the synchronizer traffic fee (currently $60 per MB, about $1 for a typical transaction, paid by burning CC) and a holding fee of about $1 per coin record per year that is charged only when a dust coin is expired. Percentage transfer fees, the $0.03 creation fee and the $0.005 lock fee were all set to zero by CIP-0078 (approved 15 September 2025).

### Cited Findings
- Launch fee schedule (historical, superseded):
  - Percentage transfer fee per output: 1.0% on the first $100; 0.1% from $100 to $1,000; 0.01% from $1,000 to $1m; 0.001% above.
  - Base transfer ("create") fee: $0.03 per output coin.
  - Lock holder fee: $0.005 per lock holder.
  - Holding fee: $1 per year per coin record.
  - Traffic: $17/MB beyond the free tier.
  - Limits: 100 inputs, 100 outputs, 10 lock holders.
  — [WP](https://www.canton.network/hubfs/Canton%20Network%20Files/Documents%20(whitepapers%2C%20etc...)/Canton%20Coin_%20A%20Canton-Network-native%20payment%20application.pdf)
- CIP-0002 (approved 2024-01-26): target of about $1 of traffic per standard CC transfer; the full CC amount is burned when buying traffic; traffic purchases removed from app-reward calculation. — [CIP-0001/0002/0003 PDF](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0001/CIP-0001-0002-0003.pdf)
- Traffic price history:
  - $16.67/MB at launch ($1 for a 60 kB transfer). — [CIP-0008 PDF](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0008/cip-0008.pdf); [CIP-0042 PDF](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0042/cip-0042.pdf)
  - CIP-0042 (approved 2024-12-14): SV operators may adjust the fee to keep a typical transfer at $1; after Canton 3.1 cut payloads about 32%, the price was to rise "to roughly $25 USD per MB". — [CIP-0042 PDF](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0042/cip-0042.pdf)
  - CIP-0084 (approved 2025-10-17): the Tokenomics Committee may recommend $/MB changes to SVs without a new CIP, to manage demand while scaling work lands. — [CIP-0084](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0084/cip-0084.md)
  - Current: "$60/MB, about $1 for a typical transaction before rewards" (October 2026); docs show `extraTrafficPrice: "60.0"`. — [CIP-0129](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0129/cip-0129.md); [Canton docs, synchronizer traffic](https://docs.canton.network/global-synchronizer/deployment/synchronizer-traffic.md)
- Free tier and other traffic parameters (docs example): `burstAmount` 400,000 bytes per burst window; `minTopupAmount` 200,000 bytes. CIP-0008 (approved 2024-05-02) doubled `burstAmount` from 200,000 to 400,000 bytes with a 20-minute window. — [Canton docs, synchronizer traffic](https://docs.canton.network/global-synchronizer/deployment/synchronizer-traffic.md); [CIP-0008 PDF](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0008/cip-0008.pdf)
- Read surcharge: CIP-0020 (approved 2024-06-14) cut `readVsWriteScalingFactor` from 200 to 4 basis points per recipient. Docs example: a 1 MB message with 10 recipients costs 1,004,000 bytes. — [CIP-0020 PDF](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0020/cip-0020.pdf); [Canton docs](https://docs.canton.network/overview/reference/tokenomics-of-gs.md)
- Traffic credits are non-transferable, cannot be converted back to CC, are charged to the submitting validator only, and are consumed even when a request fails on contention. — [Canton docs](https://docs.canton.network/overview/reference/canton-coin-tokenomics.md)
- CIP-0078 "Canton Coin Fee Removal" (created 2025-09-08, approved 2025-09-15): sets `createFee`, all `transferFee` steps and `lockHolderFee` to 0.0; holding fees are no longer deducted on transfers, only when SVs expire a coin whose accrued holding fee exceeds its amount. Rationale: 94.8% of burn already came from traffic. — [CIP-0078](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0078/cip-0078.md)
- Holding fee detail: rate per round corrected from 0.0000192901 to 0.0000190259 USD by CIP-0012 (approved 2024-05-24), i.e. $1 per year at 52,560 rounds. A $0.01 coin lives 3.65 days; a $10 coin 10 years. — [CIP-0012 PDF](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0012/cip-0012.pdf); [CIP-0078](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0078/cip-0078.md)
- Transfer-preapproval fee: CIP-0119 (approved 2026-06-15) makes preapprovals of up to 90 days free (`transferPreapprovalBaseDuration`), to fix a bootstrapping problem created when liveness rewards ended; longer durations still burn CC. — [CIP-0119](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0119/cip-0119.md)
- Confirmation responses: CIP-0104 makes protocol-conformant confirmation responses free, so validators pay only for submissions; roll-out table targets August 2026 for this step. — [CIP-0104](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0104/cip-0104.md)
- Dedicated synchronizers: historically paid licence fees to Digital Asset and burned nothing; CIP-0129 (approved October 2026) makes them burn CC at the same list price, with volume and commitment discounts to follow; phase 1 targeted for Q1 2027. — [CIP-0129](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0129/cip-0129.md)

### Inferences
- At $60/MB the minimum top-up of 200,000 bytes costs $12, and a "typical" $1 transaction is about 16.7 kB.
- The move from $16.67 to $60 per MB tracks shrinking transaction payloads (to hold $1 per transfer) plus demand management under CIP-0084; it is not a 3.6x increase in the cost of a typical transfer.

### Gaps
- The dates and intermediate values between about $25/MB (December 2024) and $60/MB were not found; they were set by SV votes on Tokenomics Committee recommendations, recorded on the tokenomics-announce list (not reachable).
- A forum title reports confirmation-response cost dropping to zero on MainNet on 2 March 2026 (Splice 0.5.11), which conflicts with the CIP-0104 table's "August 2026" (search summary, unverified). — [Daml forum](https://discuss.daml.com/t/confirmation-response-cost-dropping-to-zero-on-mainnet-march-2nd-splice-0-5-11/8429)

---

## 5. Rewards: liveness, faucet, app rewards, featured apps, markers, caps, SV weights, coupons — and anti-farming changes

### Takeaway
Rewards are minted from "activity records" (coupons) each round: SVs by governance-assigned weight, validators in proportion to CC burned by their users, and featured apps per qualifying transaction. During 2025–2026 governance removed the validator liveness faucet (to $0 on 30 April 2026), capped app rewards at $1.50 per transaction, required apps and SVs to lock CC, and approved a switch from self-declared activity markers to traffic-measured app rewards (dry run targeted December 2026, go-live February 2027).

### Cited Findings
How coupons are minted (design)
- Each round has five phases: fees written; activity recording; issuance-per-weight computed; minting; close. Several rounds overlap. Templates: `AmuletRules`, `OpenMiningRound`, `IssuingMiningRound`. — [Canton docs](https://docs.canton.network/overview/reference/canton-coin-tokenomics.md)
- Coupon types: `SvRewardCoupon` (one per SV per round), `ValidatorRewardCoupon` (created when CC is burned for traffic or on a transfer; weight = CC burned), `ValidatorLivenessActivityRecord` (historical), `AppRewardCoupon`, `FeaturedAppActivityMarker` (converted to app coupons by SV automation). — [Canton docs](https://docs.canton.network/overview/reference/tokenomics-of-gs.md)
- Minting formula: pool for each group = its percentage × round issuance; minting per unit of weight = pool ÷ total weight, capped. Launch caps: validator activity 0.2 CC per CC of weight; validator liveness $2.85 per round; featured app 100x; unfeatured app 0.6x. — [WP](https://www.canton.network/hubfs/Canton%20Network%20Files/Documents%20(whitepapers%2C%20etc...)/Canton%20Coin_%20A%20Canton-Network-native%20payment%20application.pdf)
- Coupons not minted in time go to the unminted/unclaimed pool. CIP-0066 (approved 2025-06-27) lets SVs vote to mint from that pool to a named beneficiary, the mechanism behind milestone "escrow" for SVs. — [CIP-0066](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0066/cip-0066.md)
- Rewards can be split among beneficiaries (weights summing to 1.0); external parties can use minting delegations. — [Canton docs](https://docs.canton.network/overview/reference/canton-coin-tokenomics.md)

Validator liveness / faucet (historical)
- CIP-0003 (approved 2024-01-26): every active validator gets a coupon worth up to $2.85 per round (about $150,000 per year), drawn from the validator pool after activity rewards; MainNet participation invite-only and limited to 200 validators at launch. — [CIP-0001/0002/0003 PDF](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0001/CIP-0001-0002-0003.pdf)
- CIP-0048 (approved 2025-03-03): caps raised 200x, validator faucet cap $2.85 → $570 per round and featured-app cap 100 → 20,000, to keep pools fully minted as the rate rose. — [CIP-0048](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0048/cip-0048.md)
- CIP-0070 (created 2025-07-22, withdrawn 2025-08-11) documented the free-rider problem: with 225 validators, about 80% of the validator pool went to liveness and each live validator earned about 709k CC per month. — [CIP-0070](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0070/cip-0070.md)
- CIP-0073 (approved 2025-08-27, replaced): weighted liveness rewards for SV-chosen parties; superseded except for minting delegations. — [CIP-0073](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0073/cip-0073.md)
- CIP-0096 (approved 2025-12-31): liveness cap stepped $570 → $3.33 → $2.50 (+30 days) → $0.60 (+60 days) → $0 on 30 April 2026. Evidence cited: 8 Nov–7 Dec 2025, about 70% of validator-pool minting was liveness, 132m CC. — [CIP-0096](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0096/cip-0096.md)
- Current: "Activity rewards are now the only validator minting mechanism." — [Canton docs](https://docs.canton.network/overview/reference/tokenomics-of-gs.md)

App rewards
- Original: app activity record weight = fees burned on a CC transfer; featured apps got an extra $1 (`extraFeaturedAppRewardAmount`) and a 100x cap, unfeatured a 0.6x cap. — [WP](https://www.canton.network/hubfs/Canton%20Network%20Files/Documents%20(whitepapers%2C%20etc...)/Canton%20Coin_%20A%20Canton-Network-native%20payment%20application.pdf); [CIP-0078](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0078/cip-0078.md)
- CIP-0047 (approved 2025-03-24): featured apps may create `FeaturedAppActivityMarker` contracts without moving CC; each is worth `featuredAppActivityMarkerAmount` (default $1), splittable among beneficiaries; fair-use policy left to the Tokenomics Committee. — [CIP-0047](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0047/cip-0047.md)
- After CIP-0078 no unfeatured app records are generated; "Unfeatured applications receive no reward under either mechanism." — [CIP-0078](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0078/cip-0078.md); [Canton docs](https://docs.canton.network/overview/reference/canton-coin-tokenomics.md)
- CIP-0098 (approved 2026-01-07): maximum $1.50 app reward per featured transaction, about 50% positive expected value on fee burn; motivation explicitly names "reward farming". — [CIP-0098](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0098/cip-0098.md)
- CIP-0104 "Traffic-Based App Rewards" (created 2026-01-29; approved 2026-02-12; amended and re-approved 2026-10-27): rewards computed from actual traffic of confirmed transactions using sequencer and mediator data; featured-app reward cap set to 0.79 CC minted per $1 of burn for curve steps 1–3; app categories (basic app, asset-moving app, featured asset) with weights `extraFeaturedAssetsActivityWeight` 0.2, `maxExtraActivityWeightPerAsset` 0.1, `dsoAppActivityWeight` 0.1. Roll-out: dry-run on MainNet December 2026; switch February 2027 "contingent on Tokenomics committee approval". — [CIP-0104](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0104/cip-0104.md)
- Under traffic-based rewards, a party whose per-round allowance is below `appRewardCouponThreshold` ($0.50 default) gets no coupon and "the reward is burned, not carried forward". Default `mintingVersion` is still `RewardVersion_FeaturedAppMarkers`. — [Canton docs, traffic-based app rewards](https://docs.canton.network/global-synchronizer/splice-fundamentals/traffic-based-app-rewards.md)
- CIP-0116 "Featured App Locking" (approved 2026-05-20): each featured-app PartyId must lock 5,000,000 CC (non-issuer) or 25,000,000 CC (asset issuer); 60-day unlock vesting at 1/60 per day; existing apps had 30 days to comply; SV operators must be able to respond to an unfeature vote within 30 minutes. — [CIP-0116](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0116/cip-0116.md)
- Featured status is granted by the Tokenomics Committee via the Foundation's request form. — [Canton docs](https://docs.canton.network/overview/reference/canton-coin-tokenomics.md)

SV reward weights
- CIP-0001 (approved 2024-01-26): tier time delays replaced by weights: Tier 1 weight 10, Tier 2 weight 3, Tier 3 weight 1; fully allocated design of 16/16/32 SVs with total weight 240; expected earnings per SV 1.46% / 0.44% / 0.15% of all CC. — [CIP-0001/0002/0003 PDF](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0001/CIP-0001-0002-0003.pdf)
- CIP-0007 (2024-03-18, replaced) and CIP-0024 (2024-10-08): referral weight for bringing validators (0.025–0.1 each) and featured apps (0.5–1), capped at a total pool increase of 20, time-bound to 18 months after launch. — [CIP-0006/0007 PDF](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0007/cip-0006,%20cip-0007.pdf); [CIP-0024 PDF](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0024/cip-00024%20and%20cip%200025%20v0.2%20.pdf)
- CIP-0045 (approved 2025-02-14): any SV above weight 2.5 must run its own node within 6 months or be cut to weight 1. — [CIP-0045](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0045/cip-0045.md)
- SV admissions by CIP (weights from the index): 10 — Broadridge, Tradeweb, 7RIDGE, Circle, YZi Labs, Zenith, Shinhan AM, Marex, Nomura, a16z crypto (up to 10), USDT0 and Mesh (outcome-linked, max 10); 8 — Further AM, Paxos, Société Générale (max); 7.5 — Zero Hash, Chainlink; 7 — Apollo (max); 6.5 — Kaiko, Talos; 6 — Republic, Bosphorus (max); 5 — Ledger, Ubyx, Fireblocks, BitGo, Zodia (max), Taurus, Blockdaemon, QCP, Franklin Templeton (max), CapConnect+ (max); 4 — Tharimmune, TreasurySpring (max); 3 — Five North, Hex Trust, LayerZero/Wormhole/Chainlink; 2.5 — AngelHack; 1 or 0.5 — many data, custody and analytics firms. DTCC, Nasdaq, Visa and LSEG participate under separate CIPs (0083, 0097, 0109, 0124). — [CIP README](https://raw.githubusercontent.com/canton-foundation/cips/main/README.md)
- "Ghost SV": an SV still completing milestones; rewards for its potential weight accrue unminted in escrow. CIP-0111 (approved 2026-04-23) defines how weight is reduced and escrowed coupons burned. — [CIP-0111](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0111/cip-0111.md)
- CIP-0105 SV locking (approved 2026-03-02): to keep full weight an SV must lock 70% of lifetime SV rewards (Tier 1, earns 100%); 45% earns 60%; 35% earns 40%; thresholds step to 65/50 after one year, then 60, then 55; unlocks vest at 1/365.25 per day; under-locked weight is removed within 7 days and permanently after 30 days; requirement ends 30 days after the next halving (late summer 2029); no exemptions, including the Foundation. — [CIP-0105](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0105/cip-0105.md)
- CIP-0127 (approved 2026-10-23): on-chain enforcement of SV and featured-app locks; 7-day grace for under-locked apps; drops the 7-day SV grace; minimum lock 10,000 CC; configurable controllers to support staking apps. — [CIP-0127](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0127/cip-0127.md)

### Inferences
- The anti-farming sequence is: remove fee-based unfeatured rewards (Sept 2025) → cap per-transaction app reward at $1.50 (Jan 2026) → end liveness faucet (Apr 2026) → require locks (Mar/May 2026) → measure activity by traffic instead of self-declared markers (2027).
- Once CIP-0104's 0.79 cap is live, a featured app plus its validator can mint at most about 0.79 + 0.20 = 0.99 CC per CC burned, so app and validator pools become structurally non-inflationary; only SV rewards and the Development Fund would then add net supply. Until then the marker system can pay up to $1.50 on about $1 of fees.
- The 100x and 20,000x featured-app multipliers were deliberately generous bootstrapping settings; the whitepaper's own example shows a featured app's combined net fee as negative (it earns more than its users burn).

### Gaps
- Whether the $1.50 cap and `featuredAppActivityMarkerAmount` are unchanged on MainNet today was not confirmed on-chain.
- Sources conflict on CIP-0104 status: the CIP table says dry-run December 2026 and switch February 2027; CantonNews reports it in dry-run with markers still live; a community wiki claims traffic-based calculation began 18 August 2026 (search summaries). The CIP text is the more authoritative. — [CantonNews](https://cantonnews.org/canton-enables-cip-0104-models-and-featured-app-weight-voting); [canton.wiki](https://canton.wiki/earn-canton-coin)
- The current full SV weight table (actual, not announced maxima) lives in a Foundation document linked from [SV Network Status](https://canton.foundation/sv-network-status/) that did not render here.

---

## 6. Governance-driven changes: every tokenomics-relevant CIP

### Takeaway
About 40 CIPs since December 2023 have shaped CC economics. The direction is consistent: bootstrap incentives (high caps, liveness faucet, referral weight) in 2024–early 2025, then tightening from mid-2025 (fee removal, Development Fund, liveness removal, reward cap, locking, weight-reduction process), and in late 2026 extending burn to all synchronizers.

### Cited Findings
All rows verified against the CIP files unless marked "index only". Dates are created / approved.

| CIP | Created / approved | Status | Effect |
|---|---|---|---|
| 0001 | 2023-12-15 / 2024-01-26 | Final | SV tier delays replaced by weights 10 / 3 / 1 |
| 0002 | 2023-12-15 / 2024-01-26 | Replaced | 10-minute rounds; fixed $0.005 rate; about $1 traffic per transfer; burn full CC for traffic; +$1 featured-app boost |
| 0003 | 2023-12-15 / 2024-01-26 | Final | Validator liveness reward up to $2.85 per round; 200-validator invite-only launch |
| 0007 | 2024-03-12 / 2024-03-18 | Replaced | Referral SV weight for bringing validators and apps |
| 0008 | 2024-05-01 / 2024-05-02 | Replaced | Free-tier burst 200,000 → 400,000 bytes |
| 0012 | 2024-05-22 / 2024-05-24 | Final | Holding fee per round corrected to 0.0000190259 USD; round-stall fix |
| 0020 | 2024-06-13 / 2024-06-14 | Final | Read scaling factor 200 → 4 bps |
| 0021 | 2024-06-16 / 2024-06-20 | Active | Featured Application and Validator Committee (FAV-C) |
| 0024 | 2024-09-27 / 2024-10-08 | Final | Referral weight revised; cap of 20 total; 18-month limit |
| 0025 | with 0024 | Obsolete | FAV-C moved into the Foundation's Tokenomics Working Group |
| 0042 | 2024-12-06 / 2024-12-14 | Active | SV operators may adjust $/MB to hold $1 per transfer (to about $25/MB) |
| 0045 | 2025-02-06 / 2025-02-14 | Active | Weight above 2.5 must run own SV node or drop to 1 |
| 0047 | 2025-02-12 / 2025-03-24 | Final | Featured app activity markers ($1 default) |
| 0048 | 2025-02-19 / 2025-03-03 | Final | Caps x200: faucet $570, featured app 20,000 |
| 0049 | index only | Proposed | Incentivise cold backups for SVs |
| 0066 | 2025-06-18 / 2025-06-27 | Final | SV vote can mint from unminted pool (escrow mechanism) |
| 0067 | 2025-06-13 / 2025-07-21 | Final | One-time 1.6–1.7bn CC of unclaimed rewards to the Foundation |
| 0068 | index only | Final | Bootstrap network from non-zero round |
| 0070 | 2025-07-22 / — | Withdrawn 2025-08-11 | Would have set activity cap 0.35 and liveness cap $4.5 |
| 0073 | 2025-07-23 / 2025-08-27 | Replaced by 0096 | Weighted liveness for SV-chosen parties; minting delegation kept |
| 0078 | 2025-09-08 / 2025-09-15 | Final | CC transfer, create and lock fees to zero; holding fee only on expiry |
| 0079 | 2025-09-15 / — | Approved | SVs must run a CC/USD price feed by 2025-10-15 |
| 0082 | 2025-09-24 / 2025-10-01 | Final | 5% of all future emissions to Foundation-governed Development Fund; implementation linked 2026-03-24 |
| 0084 | 2025-10-01 / 2025-10-17 | Approved | Tokenomics Committee recommends $/MB tuning |
| 0086 | 2025-10-14 / 2025-10-20 | Approved | ERC-20 middleware and indexer (typed Tokenomics; funded work) |
| 0089 | 2025-08-21 / 2025-10-30 | Final | Upgrade to Splice 0.5 / Canton 3.4; MainNet 10 Dec 2025; no minting while paused |
| 0092 | 2025-10-31 / 2025-11-07 | Final | 10-day transition to market price feeds after listing |
| 0096 | 2025-12-07 / 2025-12-31 | Approved | Liveness rewards phased to $0 by 30 April 2026 |
| 0098 | 2025-12-17 / 2026-01-07 | Approved | $1.50 cap per featured transaction |
| 0099 | index only | Approved | Zero Hash adoption-incentive modifications |
| 0100 | 2025-12-22 / 2026-01-14 | Active | Governance of the Development Fund (Tech & Ops Committee; 5 voting members + 2 alternates; appeals by 20% of members, two-thirds to pass) |
| 0104 | 2026-01-29 / 2026-02-12, re-approved 2026-10-27 | Approved | Traffic-based app rewards; featured cap 0.79; free confirmation responses |
| 0105 | 2026-02-06 / 2026-03-02 | Active | SV locking: 70% of lifetime rewards for full weight; 365.25-day vesting |
| 0107 | 2026-01-21 / 2026-03-10 | Final | 24-hour submission delay for end-user CC transactions |
| 0111 | 2026-03-18 / 2026-04-23 | Approved | Process to reduce SV weight; burn escrowed ghost-SV coupons |
| 0114 | 2026-03-19 / 2026-04-16 | Approved | Digital Asset Treasury SV programme: 1 SV weight per $50m of CC, $100m minimum, cap 20 weight, 12-month window |
| 0116 | 2026-01-21 / 2026-05-20 | Active | Featured apps lock 5m / 25m CC |
| 0119 | 2026-05-22 / 2026-06-15 | Approved | Free 90-day transfer preapprovals |
| 0120 | 2026-06-29 / — | Proposed | Traffic-based validator rewards; 70/30 submitter/confirmer split |
| 0127 | 2026-08-10 / 2026-10-23 | Approved | On-chain enforcement of SV and app locks |
| 0129 | 2026-10-07 / 2026-10-23 | Approved | Universal burn on all synchronizers; volume and commitment discounts |
| 0132 | 2026-11-09 / 2026-11-24 | Approved | Paymaster model for dedicated synchronizers (phase 1 of universal burn) |

Sources: [CIP README](https://raw.githubusercontent.com/canton-foundation/cips/main/README.md) and the individual files, e.g. [CIP-0082](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0082/cip-0082.md), [CIP-0100](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0100/cip-0100.md), [CIP-0105](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0105/cip-0105.md), [CIP-0114](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0114/cip-0114.md), [CIP-0129](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0129/cip-0129.md), [CIP-0132](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0132/cip-0132.md).

Further detail on the items the brief named
- CIP-0082: prospective only, "No change to total issuance — this is a reallocation of 5% of each future mint", taken pro rata from all streams; quarterly reports and annual attestation; review every 12 months; also ratifies moving Splice, Daml and Canton repositories to the Foundation. — [CIP-0082](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0082/cip-0082.md)
- CIP-0100: the Tech & Ops Committee is the governing body; a Core Contributors Group assesses proposals; a Security Subcommittee handles sensitive ones. — [CIP-0100](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0100/cip-0100.md)
- CIP-0114 escrow: 50% of awarded weight released at the first quarterly review, the rest in four quarterly tranches; if holdings fall below the recorded quantum for two quarters, escrowed rewards are burned; CC earned from rewards does not count. — [CIP-0114](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0114/cip-0114.md)
- CIP-0129 key terms: list price is the Global Synchronizer price ($60/MB); rewards on dedicated-synchronizer traffic weighted by CC actually burned after discounts; operators self-report traffic at launch; reward split unchanged; phase 1 Q1 2027, phase 2 (pricing curve via a second CIP) Q3 2027. — [CIP-0129](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0129/cip-0129.md)

### Inferences
- The Development Fund reduced every stream's effective share by 5% (e.g. apps 62% → 58.9%, validators 18% → 17.1%, SVs 20% → 19%) without changing the headline curve.
- Lock-ups and escrow now cover three groups: SVs (70% of lifetime rewards, 1-year vesting), featured apps (5m/25m CC, 60-day vesting) and treasury companies (quarterly holding tests). This is the protocol's answer to sell-pressure criticism.

### Gaps
- The MainNet activation date of the 5% Development Fund carve-out, and the first quarterly fund report, were not found.
- CIP-0129's header says approved 2026-10-23 while its changelog shows "2026-09-25: Approval" and press reports say 21 October; the exact vote date is uncertain. — [CryptoTicker](https://cryptoticker.io/en/canton-universal-burn-vote/)
- Approval dates of the individual SV-admission CIPs were not collected.

---

## 7. Current state: supply, price, market cap, listings, price history, holders, yield products, ETPs

### Takeaway
As of 25–26 November 2026, CC trades near $0.073 with about 40.1bn coins outstanding, giving a market cap (which the project equates with FDV) of about $2.9–3.0bn. It listed on 10 November 2025, hit an all-time low of $0.059 on 6 December 2025 and an all-time high of $0.194 on 3 February 2026, and is now about 62% below that high. Holdings are concentrated: Grayscale's June 2026 filing says the top 100 wallets hold about 89%.

### Cited Findings
Supply and market data (all search summaries unless noted)
- Coin supply 40.1bn (The Tie data shown on the Canton Foundation homepage, fetched 26 Nov 2026; verified). — [Canton Foundation](https://canton.foundation/)
- Price $0.07326, market cap $2.952bn (Coinbase price page snapshot dated 25 Nov 2026). — [Coinbase](https://www.coinbase.com/price/canton)
- Price $0.084, market cap $3.38bn (CoinDesk, 18 Nov 2026). — [CoinDesk](https://www.coindesk.com/price/canton-coin)
- Circulating supply 40.05bn (CoinMarketCap) and 40.03bn (CoinGecko), snapshot dates unclear; max supply shown as unlimited. — [CoinMarketCap](https://coinmarketcap.com/currencies/canton-network/); [CoinGecko](https://www.coingecko.com/en/coins/canton)
- 18 Jul 2026: price $0.1249, market cap $4.89bn, circulating 39.11bn. — [Bybit](https://www.bybit.com/en/price/canton-network/)
- A community wiki lists about 34.9bn circulating out of about 38.15bn total (undated; a different definition that likely excludes locked coins). — [canton.wiki](https://canton.wiki/learn/canton-coin-cc-tokenomics)

Price history
- First spot trading 10 Nov 2025 at 07:00 UTC across 11 exchanges. — [Lukka](https://lukka.tech/canton-coin-goes-live-how-lukka-powers-the-institutional-infrastructure-behind-tokenized-markets/)
- Largest single-day loss −18.06% on 10 Nov 2025; price fell about 30% after the listings. — [CoinGlass](https://www.coinglass.com/currencies/CC/historical-data); [crypto.news](https://crypto.news/canton-network-price-down-30-after-major-exchange-listings/)
- All-time low $0.05902 on 6 Dec 2025; all-time high $0.1942 on 3 Feb 2026. — [CoinGecko](https://www.coingecko.com/en/coins/canton)
- About $0.10 in late September 2026, roughly 48% below the February high. — [thelearningpill Substack](https://thelearningpill.substack.com/p/is-cantons-token-meant-to-lag)

Exchange listings
- Kraken was named as the initial EU venue, with admission expected around 1 Nov 2025 (verified). — [MiCA WP](https://www.canton.network/hubfs/Canton%20Network%20Files/whitepapers/Canton%20Coin%20%20-%20MiCA%20Whitepaper.pdf)
- 10 Nov 2025 cohort includes Bybit, Kraken (USD and EUR pairs), KuCoin ("world premiere"), MEXC (announced 7 Nov), Bitget (announced 5 Nov), OKX (perpetuals at launch). — [Odaily](https://www.odaily.news/en/newsflash/455828); [KuCoin](https://www.kucoin.com/announcement/th-canton-network-cc-gets-listed-on-kucoin-world-premiere); [Lukka](https://lukka.tech/canton-coin-goes-live-how-lukka-powers-the-institutional-infrastructure-behind-tokenized-markets/)
- OKX spot 12 Feb 2026 (aggregator AI summary, low confidence). — [CoinMarketCap updates](https://coinmarketcap.com/cmc-ai/canton-network/latest-updates/)
- Upbit announced KRW, BTC and USDT pairs on 14 Apr 2026, with trading delayed by deposit/withdrawal checks; Crypto.com enabled CC via the Canton Network. — [BitcoinWorld](https://bitcoinworld.co.in/upbit-lists-canton-cc-token/)
- Bithumb KRW market from 23 June (2026). — [The Defiant](https://thedefiant.io/news/cefi/bithumb-lists-canton-cc-korean-won-market-institutional-blockchain-retail)
- Bitstamp by Robinhood: CC/USD and CC/EUR, announced 21 August (2026). — [CantonNews](https://cantonnews.org/canton-coin-goes-live-on-bitstamp-by-robinhood-with-usd-and-eur-markets)
- Binance: most-traded pair is on Binance Futures. — [CoinCodex](https://coincodex.com/crypto/canton-coin/exchanges)

Treasury companies and notable holders
- Tharimmune raised about $540m in November 2025 (investors included ARK Invest, DRW and Kraken) to build a CC treasury; renamed Canton Strategic Holdings, ticker CNTN, from 18 Feb 2026. — [The Block](https://www.theblock.co/post/377347/tharimmune-canton-coin-treasury-blockchain); [Finviz / press release](https://finviz.com/news/312408/tharimmune-inc-announces-corporate-rebrand-to-canton-strategic-holdings-inc-marking-milestone-in-canton-network-digital-asset-treasury-strategy)
- CNTN holdings: 3,339,569,946 CC ($501.8m) at 31 Dec 2025; 3,677,150,850 CC ($541.6m) at 31 Mar 2026; $523.4m at 30 Jun 2026, with a $38.7m unrealised loss in H1 2026. — [StockTitan 8-K](https://www.stocktitan.net/sec-filings/CNTN/8-k-canton-strategic-holdings-inc-reports-material-event-7ab79358e46e.html); [StockTitan Q1](https://www.stocktitan.net/news/CNTN/canton-strategic-holdings-reports-first-quarter-2026-financial-and-7igg69ug1mtx.html); [StockTitan 10-Q](https://www.stocktitan.net/sec-filings/CNTN/10-q-canton-strategic-holdings-inc-quarterly-earnings-report-bacd7820759e.html)
- CNTN is an SV (weight 4 under CIP-0102; approved reward weight 15 as of 30 Jun 2026 after CIP-0114, per an investment-research note). — [CIP README](https://raw.githubusercontent.com/canton-foundation/cips/main/README.md); [Yahoo Finance](https://finance.yahoo.com/markets/crypto/articles/institutional-tokenization-canton-network-initiation-170542970.html)
- Canton Foundation: about 1.5bn CC in treasury as of September 2025 (verified). — [CIP-0082](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0082/cip-0082.md)
- Concentration: the 100 largest wallets held about 89% of circulating CC, per Grayscale's S-1. — [Stocktwits](https://stocktwits.com/news-articles/markets/cryptocurrency/grayscale-files-spot-canton-coin-etf-on-nyse-arca/cZ0szpHRe6W)

ETF / ETP products
- 21Shares Canton Network ETF (TCAN), described as the first fund to track Canton, listed in the US in May 2026; 21Shares also has a European ETP (CANTN, 2.50% fee) whose page shows staking yield accruing to NAV. — [The Block](https://www.theblock.co/amp/post/400436/crypto-etf-boom-continues-with-debut-of-first-fund-to-track-canton); [21Shares](https://www.21shares.com/en-ch/product/cantn)
- Bitwise Canton Network ETP (BWCC) on Deutsche Börse Xetra from 26 May 2026; physically backed; tracks a Kaiko reference rate; reported fee 0.85%. — [The Block](https://www.theblock.co/post/402538/bitwise-debuts-canton-network-etp-on-deutsche-borse-xetra)
- Grayscale filed an S-1 on 5 June 2026 for a spot CC trust (NYSE Arca). — [Stocktwits](https://stocktwits.com/news-articles/markets/cryptocurrency/grayscale-files-spot-canton-coin-etf-on-nyse-arca/cZ0szpHRe6W)
- REX-Osprey Canton Coin ETF registration reported effective 13 Nov 2026 (status unclear). — [Coinranking](https://coinranking.com/news/rex-osprey-canton-coin-etf-registration-goes-effective-november-13)

Staking and yield
- There is no proof-of-stake delegation; non-validator holders get no protocol yield. Exchange "earn" products are custodial: Kraken about 0.1% APY; aggregator listings range 1.0%–17.6% (Gate at the top). — [Four Pillars](https://validated.4pillars.io/protocols/canton); [Kraken](https://www.kraken.com/ch/features/auto-earn/canton); [CoinMarketCap yield](https://coinmarketcap.com/yield/)
- CNTN launched a locking service on 23 June 2026 for SVs and featured apps needing to meet lock requirements. — [StockTitan](https://www.stocktitan.net/news/CNTN/canton-strategic-holdings-inc-announces-launch-of-locking-service-to-7q34blxno3oo.html)
- CIP-0127 adds configurable lock controllers "to simplify building staking apps" (verified). — [CIP-0127](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0127/cip-0127.md)

Regulatory
- On 3 Nov 2026 the SEC's Division of Corporation Finance issued a no-action letter (request by Digital Asset dated 30 Oct 2026) on programmatic minting of CC by SVs, validators and app providers, taking the view that CC is a "digital commodity"; it is a staff position tied to the facts presented. — [The Block](https://www.theblock.co/news/regulation/2026-11-03-sec-no-action-letter-canton-coin-digital-commodity-432492)

### Inferences
- 40.1bn × $0.0733 ≈ $2.94bn, consistent with Coinbase's $2.95bn. Trackers treat essentially all outstanding CC as circulating even though a large share is locked under CIP-0105/0116; effective float is smaller.
- Supply has barely grown in four months (39.1bn in July to about 40.1bn in November 2026, roughly +2.5%), consistent with burn running at 70–80% of mint.
- CNTN's 3.68bn CC was about 9% of supply in March 2026, making it one of the largest single holders.

### Gaps
- 24-hour trading volume for late November 2026 was not retrieved.
- Binance spot and Coinbase centralized-exchange listing status could not be confirmed (Coinbase pages conflict; one says CC is only available via its DEX routing).
- No reliable figure for total CC locked; one investor summary's "nearly 50% of supply locked" is unverified.
- No other qualifying CC treasury company was identified. CNTN's Q3 2026 holdings and the launch-day opening price were not found.

---

## 8. Network usage economics: transactions, USD fees burned, who earns

### Takeaway
The network handles roughly 0.9 million transactions and burns about $1.3–1.4 million of CC per day (November 2026), with 742 validators and 64 SV nodes shown on the Foundation's site. Reward flow has shifted from SVs to apps: featured apps took about 73% of CC minted in September 2026 versus about 15% in December 2024, while the SV share fell to about 14–19%.

### Cited Findings
- Foundation homepage (The Tie data, fetched 26 Nov 2026; verified): 64 Super Validator nodes, 742 total validators, $1.4m daily fees, 40.1bn coin supply. — [Canton Foundation](https://canton.foundation/)
- The Tie dashboard: 63 SVs, 756 validator nodes, daily fees $1.27m; CantonScan 24-hour burn volume $1,371,384 (search summaries, November 2026). — [The Tie Canton dashboard](https://canton.thetie.io/); [Cantonscan](https://www.cantonscan.com/)
- Transactions: about 860k per day (7-day average), peak 888k on 4 Nov 2026 (search summary). — [CantonNews live stats](https://cantonnews.org/network)
- Earlier points: more than 600,000 transactions per day, validators up from 24 at launch to over 575, more than 28,000 wallets (official, late 2025; verified). — [Canton blog, Network Series part 4](https://www.canton.network/blog/the-canton-network-series-part-4-of-5)
- Validator counts over time (verified in CIPs): 70 on 17 Feb 2025; 225 in July 2025. — [CIP-0048](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0048/cip-0048.md); [CIP-0070](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0070/cip-0070.md)
- USD fees: about $900k per day in October 2025 (official); CertiK counted over $155m of fees in Q3 2026; a single-day figure of $1.47m put Canton at the top of chain fee rankings (search summaries). — [Canton FDV blog](https://www.canton.network/blog/canton-coin-how-should-we-think-about-fdv); [The Defiant](https://thedefiant.io/converge/blockchains/canton-records-over-155-million-in-q3-fees-certik-says); [Digg](https://digg.com/tech/ts22w219)
- Reward shares: featured apps 73% of CC minted in September 2026 (15% in December 2024); SVs about 14%. — [Alea Research](https://alearesearch.substack.com/p/canton-universal-burn)
- Independent on-chain analysis: apps' share of claimed rewards rose from 6% (2025) to 65% (June–October 2026); SVs fell from 66% to 19%; the largest SV node carries 48% of reward weight (announced weights, since it hosts many SVs). — [DeniKram canton-rewards-analysis](https://github.com/DeniKram/canton-rewards-analysis)
- Top apps: Temple Digital Group has burned over 1bn CC on its own; by cumulative transactions Temple (107m), Cantonloop (75m), Cantex (45m) lead (search summaries). — [CantonNews](https://cantonnews.org/temple-passes-one-billion-cc-burned-on-canton); [The Tie Canton dashboard](https://canton.thetie.io/)
- Early app earners: Hashnote USYC, 3Trade and Brale minted 100m–500m CC per month each in early 2025 (official; verified). — [Canton blog](https://www.canton.network/blog/canton-coin-rewarding-utility)
- Liveness era: about 132m CC paid to validators for uptime alone in 8 Nov–7 Dec 2025 (verified). — [CIP-0096](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0096/cip-0096.md)

### Inferences
- $1.3–1.4m per day annualises to about $480–510m of burn. At $0.073 that is roughly 18–19m CC per day, or about 550m CC per month against a maximum mint of about 833m, consistent with the reported 70–80% ratio.
- At about $1 per transaction and about 0.9m transactions per day, fee revenue per transaction is close to the design target.
- Because apps mint up to $1.50 (soon 0.79x) per $1 burned, much of the burn is paid by the same parties that mint the rewards; net economic cost to featured apps is small or negative. Gross burn therefore overstates net fee demand.

### Gaps
- No verified per-entity ranking of reward earners (by SV or app) for 2026 was retrieved.
- Validator counts differ by source (742, 756, 876, 1,100+, 1,237), reflecting active vs registered nodes; the Foundation's 742 is used here.

---

## 9. Explorers and dashboards

### Takeaway
CC balances, rewards and burns are public through the SVs' Scan service, and several third-party explorers surface them. Cantonscan and The Tie's Canton dashboard are the two cited by the network itself.

### Cited Findings
- Scan API / Scan UI (run by every SV): source of truth for `amuletPrice` per round, traffic price parameters, balances and transaction history; "CC balances and transaction history are publicly visible via the network's scan service". — [Canton docs, Canton Coin](https://docs.canton.network/overview/understand/canton-coin.md); [Canton docs, synchronizer traffic](https://docs.canton.network/global-synchronizer/deployment/synchronizer-traffic.md)
- Cantonscan — https://www.cantonscan.com/ — Proof Group's explorer, launched 4 June 2025: CC balances, validator connections, token transfers, governance proposals; shows cumulative burn and 24-hour burn volume; cited by Canton Network for the burn total. — [Canton press release](https://www.canton.network/canton-network-press-releases/proof-group-launches-first-ever-canton-block-explorer); [Canton Network on X](https://x.com/CantonNetwork/status/2119874665271157019)
- The Tie Canton analytics — https://canton.thetie.io/ — supply, daily fees, validator and SV counts, app activity; feeds the Foundation homepage. — [Canton Foundation](https://canton.foundation/)
- Canton Foundation SV Network Status — https://canton.foundation/sv-network-status/ — SV node lists, minting weights and beneficiaries, active vote requests for DevNet, TestNet and MainNet. — [Canton Foundation](https://canton.foundation/sv-network-status/)
- CantonNews live network stats — https://cantonnews.org/network — transactions per day, validators, CC price, governance (search summary). — [CantonNews](https://cantonnews.org/network)
- CC Space API — data source used by an open-source rewards analysis (search summary). — [DeniKram canton-rewards-analysis](https://github.com/DeniKram/canton-rewards-analysis)
- DefiLlama token page and Tokenomics.com revenue page for CC (search summaries). — [DefiLlama](https://defillama.com/token/cc); [Tokenomics.com](https://app.tokenomics.com/tokenomics/canton-network/revenue)
- PixelPlex CC Suite explorer: transactions to finality, validator health, CC flows (search summary). — [PixelPlex](https://pixelplex.io/cc-suite/)
- CIP repository for rule changes; tokenomics and tokenomics-announce mailing lists at lists.sync.global for committee decisions. — [CIP README](https://raw.githubusercontent.com/canton-foundation/cips/main/README.md); [Canton docs](https://docs.canton.network/overview/reference/canton-coin-tokenomics.md)

### Inferences
- Only CC and synchronizer-level data are public. Application contracts are private by design, so explorers cannot verify the business activity behind app rewards; they can only show burn, mint and traffic.

### Gaps
- Explorer sites could not be opened from this machine, so which exact charts each offers (for example a burn/mint ratio series) is unverified. Other explorers named in the community (CCView, CC Explorer, Canton Nodes, Lighthouse) were not confirmed by any search result.

---

## 10. Criticisms and risks, and the counter-arguments

### Takeaway
The main criticisms are early concentration of minting among invite-only SVs that overlap with Digital Asset's investors, persistent net inflation with burn still below mint, reward loops in which featured apps earn back more than they burn, and SV control over who may earn. The project's response is that the curve has already cut the SV share to 20%, that locks and escrow now bind SVs and apps, and that reward rules have been tightened repeatedly.

### Cited Findings
Criticisms
- SVs are an invite-only set; many validating nodes are run by the network's investors; new SVs need a supermajority of existing SVs. One count: 46 SVs but only 13 actively running nodes (search summaries). — [Unchained](https://unchainedcrypto.com/is-canton-permissionless-why-crypto-is-fighting-over-what-the-word-means/); [The Defiant](https://thedefiant.io/newsletter/defi-daily/the-canton-blockchain-debate-permissioned-or-not)
- "A large amount of CC … was accumulated by Super Validator institutions who joined the network early on." — [DL News](https://dlnews.com/articles/defi/canton-network-ceo-addresses-criticism-from-crypto-ideologues/)
- SVs, through the power to designate featured apps, "continue to wield excessive influence over Canton's issuance"; featured apps could mint up to 100x fees. — [Bankless](https://www.bankless.com/read/how-canton-network-works)
- 80% of early emissions went to permissioned SVs. — [Nick Sawinyh blog](https://sawinyh.com/blog/canton-coin-tokenomics)
- Holder concentration: top 100 wallets hold about 89%; Grayscale flags large-holder sales as a price risk. — [Stocktwits](https://stocktwits.com/news-articles/markets/cryptocurrency/grayscale-files-spot-canton-coin-etf-on-nyse-arca/cZ0szpHRe6W)
- Mint still exceeds burn (see section 3); the token is "in net-inflationary territory"; price "lags" network growth. — [thelearningpill Substack](https://thelearningpill.substack.com/p/is-cantons-token-meant-to-lag); [DailyCoin](https://dailycoin.com/9-trillion-a-month-flat-price-inside-cantons-paradox/)
- Much institutional activity runs on private or dedicated synchronizers that did not burn CC, leaving burns 30–35% short of mint. — [Dropstab research](https://dropstab.com/research/crypto/canton-network-the-blockchain-powering-wall-street)
- App-reward fairness: forum users report wide variation in rewards per transaction between apps; Kaiko argues marker-based rewards are "not well correlated with the actual traffic generated". — [Canton forum](https://forum.canton.network/t/app-rewards/8566); [Kaiko](https://www.kaiko.com/resources/a-new-economic-model-for-oracle-services-on-canton)
- Governance's own documents concede the problems: liveness free-riding (validators earning about 709k CC per month for idle nodes), uncapped app rewards that "distort behavior and create artificial incentive loops", and a multitenant "free rider problem" among low-weight SVs (verified). — [CIP-0070](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0070/cip-0070.md); [CIP-0098](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0098/cip-0098.md); [CIP-0045](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0045/cip-0045.md)
- Trust assumptions in new rules: dedicated-synchronizer operators self-report traffic and "a maliciously constructed report can misdirect rewards"; the paymaster phase relies on off-ledger discount deals between SVs and operators (verified). — [CIP-0129](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0129/cip-0129.md); [CIP-0132](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0132/cip-0132.md)
- Transparency criticism around DTCC's choice of Canton (search summary). — [The Coin Republic](https://www.thecoinrepublic.com/2025/12/23/developers-bash-dtccs-8-trillion-tokenization-infrastructure-pick-over-lack-of-transparency/)

Counter-arguments
- Digital Asset's CEO Yuval Rooz says the criticism is "really a compliment" and comes from "crypto ideologues". — [DL News](https://dlnews.com/articles/defi/canton-network-ceo-addresses-criticism-from-crypto-ideologues/)
- The SV share has already fallen 80% → 48% → 20% and drops to 10% in 2029; if validator and app pools reach equilibrium, SV-only inflation would be about 32.5m CC per year, under 0.1% (official scenario). — [Canton FDV blog](https://www.canton.network/blog/canton-coin-how-should-we-think-about-fdv)
- SVs must lock 70% of lifetime rewards with one-year vesting to keep full weight, with "no exemptions"; featured apps lock 5m/25m CC; milestone-based SVs earn into escrow that is burned if milestones are missed (verified). — [CIP-0105](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0105/cip-0105.md); [CIP-0116](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0116/cip-0116.md); [CIP-0111](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0111/cip-0111.md)
- Reward weight is not voting power; governance counts SV nodes. — [DeniKram canton-rewards-analysis](https://github.com/DeniKram/canton-rewards-analysis)
- Universal burn (CIP-0129) is aimed directly at the "private activity doesn't burn" critique: licence revenue "that used to leave the ecosystem becomes burn on the network" (verified). — [CIP-0129](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0129/cip-0129.md)
- The SEC staff's no-action letter of 3 Nov 2026 treats CC as a digital commodity. — [The Block](https://www.theblock.co/news/regulation/2026-11-03-sec-no-action-letter-canton-coin-digital-commodity-432492)

### Inferences
- Arithmetic on the curve: SVs could mint up to 16bn of the first 20bn and 9.6bn of the next 20bn, i.e. up to 25.6bn of the first 40bn CC (64%) in the first 18 months. With supply at about 40bn today, the bulk of existing coins originated in SV rewards, which fits the 89% top-100 concentration.
- The 70% lock with one-year vesting converts early SV holdings from potential immediate sell pressure into a slow, visible overhang; it defers rather than removes it, and the requirement sunsets after the 2029 step.
- BME sustainability depends on real, unsubsidised fee demand. Today a large part of burn is matched by app rewards to the same parties, and the USD fee level ($60/MB) is set by governance, not a market; both mean the "equilibrium" is partly administered.
- Net inflation is modest at present (about 2–3% over the last four months) but the comparison base is a price about 62% below the high; a higher CC price would reduce CC burned per dollar and widen the gap unless usage grows.

### Gaps
- No verified data on actual selling by SVs, apps or the Foundation was found.
- No Messari, Delphi or Galaxy report on CC was found; independent analyst coverage located was Coin Metrics/Talos, Kaiko, The Tie (commissioned), Alea Research, Dropstab and Four Pillars, none of which could be opened directly. — [Coin Metrics](https://coinmetrics.substack.com/p/state-of-the-network-issue-334); [Talos](https://www.talos.com/insights/inside-the-canton-network-a-special-insights-report)

---

## 11. Tokenomics Working Group and pending proposals

### Takeaway
The Tokenomics Working Group (also called the Tokenomics Committee) of the Canton Foundation grew out of the SVs' Featured Application and Validator Committee. It approves featured apps and validators, recommends the traffic price, administers SV weight reductions and the treasury-company programme, and gates the switch to traffic-based rewards. Pending items are CIP-0120 (validator rewards), the second universal-burn CIP (pricing curve) and the CIP-0104 go-live decision.

### Cited Findings
- Origin: CIP-0021 (approved 2024-06-20) created the FAV-C; CIP-0025 moved it into the Foundation's Tokenomics Working Group, with a one-week service level and a required annual review of its mandate. — [CIP-0024/0025 PDF](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0024/cip-00024%20and%20cip%200025%20v0.2%20.pdf)
- Foundation page lists the group's agenda/minutes document, mailing list (tokenomics@lists.sync.global), Slack channel and document repository. — [Canton Foundation, Tokenomics Working Group](https://canton.foundation/tokenomics-working-group/)
- Powers assigned by CIPs:
  - Featured-app approvals and fair-use policy. — [CIP-0047](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0047/cip-0047.md)
  - $/MB recommendations. — [CIP-0084](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0084/cip-0084.md)
  - SV weight-reduction reviews, delegable to an Accountability Committee. — [CIP-0111](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0111/cip-0111.md)
  - Administering the Digital Asset Treasury programme. — [CIP-0114](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0114/cip-0114.md)
  - Proposing lock thresholds and durations. — [CIP-0116](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0116/cip-0116.md)
- It approved "Featured App Guidance 2.0b" on 22 Oct 2026, which CIP-0104's amended reward computation implements. — [CIP-0104](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0104/cip-0104.md)
- The Development Fund is governed separately, by the Tech & Ops Committee. — [CIP-0100](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0100/cip-0100.md)
- Pending or upcoming:
  - CIP-0120 (Proposed, created 2026-06-29): validator rewards based on actual traffic; 70% to the submitting validator, 30% shared among confirming validators with decentralisation weighting (`maximumDecentralizationValue` 7); no rewards for rejected or SV-submitted transactions; validator cap raised from 20% to 30%. — [CIP-0120](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0120/cip-0120.md)
  - CIP-0104 final go-live, targeted February 2027, after a December 2026 dry run. — [CIP-0104](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0104/cip-0104.md)
  - Second universal-burn CIP: volume curve, discount sizes, collateral rules; phase 2 targeted Q3 2027. — [CIP-0129](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0129/cip-0129.md)
  - A future CIP on what to do with unclaimed rewards (flagged in CIP-0098) and one to automate featured-app lock ordering (flagged in CIP-0116). — [CIP-0098](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0098/cip-0098.md); [CIP-0116](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0116/cip-0116.md)
  - CIP-0049 (Proposed): incentives for SV cold backups; CIP-0108 (Proposed): a weight-1 SV admission. — [CIP README](https://raw.githubusercontent.com/canton-foundation/cips/main/README.md)
  - Annual review of the 5% Development Fund rate (due about October 2026 onward). — [CIP-0082](https://raw.githubusercontent.com/canton-foundation/cips/main/cip-0082/cip-0082.md)

### Inferences
- The group is the practical rate-setter of the system: it controls who can earn app rewards, the USD price of traffic and enforcement of SV obligations, while SVs ratify by on-chain vote. That concentration of discretion is itself one of the governance risks critics raise.
- If CIP-0120 passes, all three reward streams other than SV rewards will be measured from sequencer traffic rather than from self-reported events or purchases.

### Gaps
- The group's minutes, the tokenomics-announce archive and its current membership could not be opened (Google Docs and lists.sync.global are not reachable from here), so recent recommendations (for example the dates of $/MB changes) are not documented in these notes.
