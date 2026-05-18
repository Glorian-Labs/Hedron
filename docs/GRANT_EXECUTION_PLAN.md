# Grant Execution Plan — Hedron Tier 1

This document translates the Hedron Tier 1 grant ($20,000, 3–9 months) into technical milestones with concrete deliverables, success criteria, and verification paths.

## Two audiences

This page is intentionally written for **both** a non-technical grant reviewer and a contributing engineer. The high-level section answers "is this team shipping?". The technical section pins down "what does done look like?".

---

## For the grant reviewer (plain English)

Hedron is the **commerce and proof layer** for AI agents on Hedera. The Tier 1 grant funds an MVP that:

1. Lets an app or person find an AI agent that offers a paid capability.
2. Lets that app/person see the price, decide, and pay.
3. Lets the agent do the work and prove it did.
4. Gives the buyer a receipt anyone can independently verify on Hedera.

The grant is paid in two halves: 50% to start, 50% on completion of the major milestone. We will ship:

- A mainnet-ready commerce flow on Hedera (HBAR or HTS).
- A web UI that walks a real user through the flow.
- A receipt verifier anyone can run to confirm what happened.
- Public proof: HashScan links, demo videos, two technical posts, monthly progress updates.

We will not over-promise. The grant explicitly rules out hardware attestation, deep governance, and "trusted registry" work for Tier 1; those belong in later tiers. We will stay scope-locked: **one core flow, three example agents.**

---

## Milestones

Milestone numbering matches the cleanup roadmap. M1–M6 are Tier 1; M6–M9 begin to overlap into the AI Agent Kit / MCP work scoped for Tier 2.

### M1 — Repo hardening, docs, CI, security scan, env hygiene ✅ in progress

**Deliverable:** clean public repo + green CI + zero leaked secrets.

**Success criteria**
- `npm run build`, `npm run typecheck`, `npm run lint`, `npm run test` all green.
- `gitleaks` finds zero leaks across full history.
- `.gitignore` excludes generated output and env files.
- `CONTRIBUTING.md`, `SECURITY.md`, `RELEASE_CHECKLIST.md`, `CHANGELOG.md` present.
- CI runs typecheck + lint + unit tests + contract compile + gitleaks on every push.

**Verification:** reviewer can `git clone … && npm ci && npm run build && npm run test` from a clean machine.

### M2 — Router/Broker local mocked flow

**Deliverable:** `npm run demo:local` runs the entire commerce loop end-to-end against in-memory mocks and verifies the receipt.

**Success criteria**
- `src/router/`, `src/broker/`, `src/registry/`, `src/policy/`, `src/receipts/` exist with unit tests.
- The state machine in [`docs/ROUTER_BROKER.md`](ROUTER_BROKER.md) is implemented and reachable from CLI.
- A reviewer who has never touched the repo can reproduce the verifier output on their laptop.

**Verification:** demo prints `Receipt verified: receiptId=…` with six green checks.

### M3 — HCS receipt trail + verifier

**Deliverable:** events #1–#11 emit to a real HCS topic on testnet; the verifier reads from a public mirror and confirms the chain.

**Success criteria**
- Hash-chained events on a single topic.
- `verifyReceipt(...)` returns `ok: true` against a public mirror.
- HashScan link in the README shows a working flow.
- Unit tests cover the canonical-encoding and prevhash logic.

**Grant text covered:** *"emit an HCS audit trail for every step + a final receipt"*; *"correlation IDs"*; *"schema registry"*.

### M4 — Hedera testnet → mainnet settlement flow

**Deliverable:** HBAR and HTS settlement adapters production-ready. Mainnet opt-in behind a single `HEDERA_NETWORK=mainnet` switch and explicit operator approval.

**Success criteria**
- `tests/unit/settlement/{replay,quote-swap,mismatch,idempotency,expiry,policy-deny}.test.ts` all pass.
- `RUN_HEDERA_INTEGRATION=true npm run demo:testnet` settles a real HBAR transfer end-to-end.
- Mainnet rehearsal: same demo runs on mainnet with a tiny ($0.05) HBAR amount; receipt verified on HashScan.
- Idempotency cache survives broker restart.

**Grant text covered:** *"Mainnet settlement using HBAR and/or HTS"*; *"idempotent receipts (paymentId)"*; *"no double-execution"*.

### M5 — Policy engine + approval flow

**Deliverable:** auditable policy decisions, default-deny, HITL approval path on the broker HTTP surface.

**Success criteria**
- `POLICY_EVALUATED` event with `policyDecisionHash` matches what the receipt anchors.
- High-value flow (> threshold) emits `APPROVAL_REQUIRED`, blocks until `APPROVAL_GRANTED`.
- Unsigned `/approve` and `/pay` requests are rejected before any state change.
- A reviewer can post a doctored payment payload and the broker rejects it with a typed error.

**Grant text covered:** *"Spending limits; approvals; allowlists; scheduled transactions support"*; *"Policies are auditable"*; *"Unsigned/replayed messages rejected (tests + runtime)"*.

### M6 — Daydreams adapter skeleton

**Deliverable:** Daydreams-runtime conformance adapter + mocked end-to-end test (`tests/unit/adapters/daydreams.test.ts`).

**Success criteria**
- Adapter implements the interface in [`docs/DAYDREAMS_ADAPTER.md`](DAYDREAMS_ADAPTER.md).
- Daydreams agent registration → Hedron `AgentCard` round-trip works against a stub Daydreams API.
- No private agent memory leaks into the HCS event payloads (tested with a `forbiddenKeys` assertion).

### M7 — PayAI / x402 adapter with replay + idempotency tests

**Deliverable:** the Hedera x402 facilitator (embedded mode) + a PayAI adapter, both wired into the broker.

**Success criteria**
- `src/settlement/x402/` runs the Hedera exact-scheme facilitator against testnet.
- `src/settlement/payai/` is a thin adapter that re-verifies on-chain before reporting `PAYMENT_VERIFIED`.
- All six safety tests pass for both rails.
- The HAK v4 blog reference implementation is cited and aligned with.

### M8 — Hedera Agent Kit v4 plugin / tools integration

**Deliverable:** `@glorian-labs/hedron-hak-plugin` (work-in-progress name) — a minimal HAK v4 plugin exposing `quote/pay/verify` plus `listAgents`, `approveQuote`, `getAuditTrail`. Built on `BaseTool`. Hooks bound to the Hedron policy engine.

**Success criteria**
- A HAK v4 agent in `examples/hak-agent/` runs the full Hedron loop with no Hedron-internal imports beyond the plugin entry.
- Pre-Tool / Post-Param / Post-Core / Post-Tool hooks each demonstrably fire.
- Tool surface kept minimal per grant requirement.

### M9 — Demo UI or CLI flow

**Deliverable:** a small web UI that lets a reviewer click through the loop. CLI flow is the fallback if UI work runs over.

**Success criteria**
- Web UI: browse agents, see pricing, request a quote, approve, pay, see receipt + HashScan link.
- A second reviewer can hit the public URL and verify a fresh receipt.
- Source for the UI in `apps/web/` or a sibling repo, linked from README.

**Grant text covered:** *"UI supports the full flow end-to-end and links to on-chain proofs"*.

### M10 — Release candidate v0.2.0-alpha.0

**Deliverable:** tagged release `v0.2.0-alpha.0`, semver discipline, CHANGELOG entry, RELEASE_CHECKLIST gate passed, two technical posts published, demo video recorded.

**Success criteria**
- `git tag v0.2.0-alpha.0` and `git tag --verify` passes.
- CHANGELOG covers every milestone.
- Public CI badge green on `main`.
- Two posts: one architecture, one "how to verify a Hedron receipt".
- Mainnet demo video referencing a verifiable on-chain receipt.

---

## KPIs (mapped from grant doc)

| KPI | Tier 1 target | How we measure |
| --- | --- | --- |
| End-to-end flows | ≥ 1 | demo logs + HashScan links |
| Production UI | 1 | deployed URL |
| HCS topics | ≥ 1 | published topic id |
| Supported assets | ≥ 1 (HBAR or HTS) | receipt examples |
| Uptime target | ≥ 99% | uptime dashboard once UI is live |
| CI time | < 10 min | GitHub Actions run history |
| Unsigned accepted | 0 | dedicated test in CI |
| Content assets | ≥ 4 (site + docs + video + posts) | linked from README |

## Constraints (grant-imposed)

- **No hardware attestation in Tier 1.** Verifiable compute is later.
- **Tool surface minimal: quote / pay / verify.**
- **Scope locked: 1 core flow + 3 example agents.** Do not generalize prematurely.
- **No marketing fluff** in public docs.
- **Mainnet readiness is real or absent.** No "production ready" claims without the receipts to back them up.

## Reporting

- **Monthly updates** on progress (public).
- **Case study** at M5 (policy + approval flow live).
- **Two technical posts** before M10.
- **Demo video** at M10.
- **Pricing sheet + 1-page narrative** for non-technical stakeholders, kept current alongside this plan.

## Out of scope for Tier 1 (intentional)

- Trusted-registry / governance work (Tier 2: M9–M18).
- Verifiable-compute attestation (Tier 2/3: M6–M18).
- AI Agent Kit / MCP work beyond the minimal plugin (Tier 2: M6–M9).
- Cross-chain bridging beyond what x402/PayAI already supply.
