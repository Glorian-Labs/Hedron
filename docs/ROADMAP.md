# Roadmap

Versioned milestones. Each milestone has a tag and a definition of done. Until a tag exists in `git tag`, the milestone is in progress.

This roadmap is calibrated against the public Hedera surface area as of **May 2026**:

- **Hedera Agent Kit v4** (May 2026): modular packages from `@hashgraph/hedera-agent-kit/plugins`; `BaseTool` lifecycle (Pre-Tool, Post-Parameter-Normalization, Post-Core-Action, Post-Tool); first-class hooks and policies. See [`docs/HEDERA_AGENT_KIT_PLUGIN.md`](HEDERA_AGENT_KIT_PLUGIN.md).
- **Hedera x402 (Feb 2026)**: Hedera's `exact` scheme uses partially signed `TransferTransaction` payloads where the facilitator pays gas and submits. HBAR and HTS-native. Reference facilitator: [Blocky402](https://blocky402.com/) (supports Hedera testnet V1). See [`docs/PAYAI_X402_ADAPTER.md`](PAYAI_X402_ADAPTER.md).
- **HCS-10 / OpenConvAI**: production discovery and messaging standard for Hedera-resident agents.
- **Hiero SDKs** (`@hiero-ledger/sdk`) are the forward-looking SDK surface that the legacy `@hashgraph/sdk` migrates into; see [`docs/DEPENDENCY_HARDENING.md`](DEPENDENCY_HARDENING.md).

Hedron tracks these surfaces rather than wrapping them, so each milestone below maps to one external surface plus the corresponding Hedron interface.

---

## v0.2.0-alpha.0 — cleanup + skeleton ✅ (released as PR #6, merged 2026-05-19)

- Public repo is clean and review-friendly (no generated artifacts, no hackathon clutter, no leaked secrets).
- Type surface (`src/types/`), errors (`src/errors/`), and config loader (`src/config/`) landed.
- Router/Broker skeleton with mocked rails passes unit tests.
- Policy engine: pure evaluator + auditable decision events.
- HCS receipt schema v1 + verifier (six checks: schema, signature, chain integrity, anchoring, policy + settlement consistency, terminal status).
- Adapter interfaces defined for Daydreams, HAK v4, x402.
- 27/27 unit tests green; CI runs typecheck / lint / unit / mocked demo / gitleaks / `npm audit` (warn-only).

---

## v0.2.0-alpha.1 — quote-verification + ergonomics (next, small)

Scope: tighten the Broker so a quote cannot be silently swapped or expired. Optional warm-up before the heavier testnet work in `alpha.2`.

- `Broker.runFlow` verifies `quote.signature` against the registered agent identity before policy.
- `Broker.runFlow` checks `quote.expiresAt` (and `paymentRequirement.expiresAt`) against `now()`; rejects with a typed `QuoteExpiredError`.
- Emit `QUOTE_VERIFIED` HCS event with the verifier outcome; include it in the receipt's chain integrity check.
- Router stamps `paymentRequirement.quoteHash` **before** signing the quote.
- Small docs pass on `docs/ROUTER_BROKER.md` to call out the new event.

DoD: tag `v0.2.0-alpha.1` once tests cover signature mismatch, expired quote, and `QUOTE_VERIFIED` event ordering; CI green.

---

## v0.2.0-alpha.2 — Hedera surface bring-up on testnet

Scope: replace the mock HCS emitter and one settlement adapter with real testnet calls. **No mainnet anything.**

- **Real HCS emission**: drop-in `HieroHcsEmitter` that publishes commerce-loop events to a configured audit topic. Defaults to a topic provisioned at first boot when missing. Pins `@hashgraph/sdk` v2 (per Tier 1 M3 in [`DEPENDENCY_HARDENING.md`](DEPENDENCY_HARDENING.md)) with `@hiero-ledger/sdk` as the deferred upgrade target.
- **HBAR settlement adapter** (`src/settlement/hedera/`): partially-signed `TransferTransaction` builder + verifier helper. Operator key never leaves the broker process. Default-deny on amount-over-cap.
- **Receipt verifier reads mirror node** (Hedera public mirror by default; overridable via `HEDERA_MIRROR_NODE_URL`) and confirms the audit message exists on-chain before issuing a verified receipt.
- **HAK v4 policy bridge**: Hedron's policy decisions are exposed as a HAK v4 policy object so a HAK-driven agent uses the same allow/deny/approval semantics.
- E2E demo on testnet (`npm run demo:testnet`) ends with `Receipt verified ✅` and a public mirror-node URL for the audit topic.

DoD: tag `v0.2.0-beta.0` once `demo:testnet` runs against the Hedera testnet using a HAK v4 agent and emits a verifiable receipt that the verifier confirms against the mirror.

---

## v0.2.0-beta.1 — x402 facilitator adapter (Hedera-native)

Scope: wire the broker to the **Hedera x402 exact scheme** so a paywalled endpoint protected by x402 becomes a first-class settlement rail in Hedron.

- `src/settlement/x402-hedera/` implements the `PaymentAdapter` interface:
  - `createPaymentRequirement` returns an x402 402-response payload (`x-payment` header schema, amount in tinybar, recipient, expiresAt).
  - `verifyAndSettle` calls the configured facilitator (default Blocky402 testnet) and waits for on-chain confirmation; falls back to operator-submitted settlement if the facilitator times out.
- Treat the facilitator as **swappable**: Blocky402 is the default; a self-hosted facilitator and the Coinbase CDP-hosted facilitator are config switches.
- Cross-check: receipt's `settlementRef` includes the on-chain tx id and the facilitator id.
- New doc: `docs/X402_HEDERA_INTEGRATION.md` (already in repo as a stub; expand to match this adapter).

DoD: a mock merchant server on Hedron returns `402` for a metered endpoint, an agent driven by HAK v4 pays via the adapter, settlement confirms on testnet, and the receipt verifies. Single end-to-end test in `tests/e2e/`.

---

## v0.2.0 — production-grade testnet release

Scope: Hedron is publicly usable on Hedera testnet without operator hand-holding. **Still no mainnet.** This is the **Tier 1 grant DoD**.

- Router HTTP service deployed (Docker image + a documented hosting recipe) with monitoring + structured logs. No public mainnet endpoint is claimed.
- Operator-key rotation procedure documented; receipts survive rotation via `policyDecisionHash` and `agentId` chain.
- `p95` latency target set and met for the canonical loop against testnet (target: `< 4 s` for mock-execute happy path, `< 8 s` for an x402 paywalled fetch).
- HCS-10 / OpenConvAI discovery: agents in the registry can be looked up by HCS-10 inbox; the loop emits one HCS-10 message per stage so external observers can subscribe.
- Public showcase: one HAK v4 plugin example + one Daydreams adapter example, both running the same loop, both producing identical verifiable receipts.

DoD: tag `v0.2.0` once the deployed Router service handles 100 sequential and 20 concurrent commerce loops on Hedera testnet, all with verifiable receipts and a public mirror trail. Tier 1 grant deliverable.

---

## v0.3.0 — adapter expansion (post-grant)

- **MCP server** exposing the Hedron tool surface (`discover / quote / pay / verify`) so Claude / Cursor / Cline can use Hedron directly.
- **Daydreams runtime** sandbox integration test (Daydreams agents call Hedron via the adapter contract).
- **ERC-8004 identity** for cross-chain agent flows; receipts can carry an ERC-8004 attestation.
- **Hashgraph Online standards** opt-in plugin: agents that register through HCS-10 OpenConvAI inboxes appear in the Hedron registry automatically.

---

## v0.4.0 — governance + trust

- Policy registry on HCS: policies are **published**, not just executed; a `POLICY_REGISTERED` event makes the policy auditable independently of any flow.
- Operator-key rotation events on a dedicated HCS topic; the verifier walks rotations.
- Trust / reputation primitives on Hedera, kept separate from the TrustScore Oracle project (`Hebx/trustscore-oracle`). Hedron consumes TrustScore as an external policy input.

---

## v0.5.0 — verifiable compute

- Optional verifiable-compute adapter (TEE attestation or ZK-attached proof on selected adapters).
- Receipts include attestation references when adapter is enabled.
- Plug-in seam for Hedera-side or external attestation services.

---

## Beyond

- Public agent marketplace UI consuming Hedron as a separate project.
- Mainnet pilot (operator-gated, gradual). Only after `v0.2.0` testnet has run unattended for one quarter.

---

## What we are explicitly **not** doing in 2026

- No PayAI on Hedera (PayAI's network coverage is Solana + EVM; Hedron will revisit when PayAI adds Hedera).
- No bespoke wallet UX. Hedron is SDK + runtime; UX belongs to the consuming app.
- No on-chain governance token.
- No marketing claims beyond what the verifier proves.

---

## Source surfaces referenced by this roadmap

- Hedera Agent Kit v4 release notes: <https://hedera.com/blog/hedera-agent-kit-v4-policies-modular-packages-and-plugin-updates/>
- Hedera x402 announcement and exact scheme: <https://hedera.com/blog/hedera-and-the-x402-payment-standard/>
- x402 specs (Coinbase): <https://github.com/coinbase/x402>
- Blocky402 reference facilitator (Hedera testnet V1): <https://blocky402.com/>
- HCS-10 / OpenConvAI: <https://hashgraphonline.com/> + `hashgraph-online/standards-agent-kit`
- Hedera native dev path: <https://docs.hedera.com/hedera/getting-started-hedera-native-developers>
- Hedera Agent Lab (no-code experimentation surface): <https://portal.hedera.com/agent-lab>

Each milestone has a tag and a definition of done. Until a tag exists in `git tag`, the milestone is in progress.
