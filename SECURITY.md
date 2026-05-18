# Security Policy

## Supported versions

Hedron is pre-1.0. Security fixes land on `main`. Older tags receive critical fixes for 90 days after a new minor is tagged.

| Version | Supported |
| --- | --- |
| `0.2.x` | ✅ |
| `< 0.2.0` | ❌ (hackathon-era code; please upgrade) |

## Reporting a vulnerability

**Please do NOT open a public GitHub issue for security reports.**

Email **security@glorianlabs.dev** with:

1. A short description and severity in your view.
2. Steps to reproduce.
3. Impact assessment (what an attacker could do with this).
4. Your preferred disclosure timeline (we aim to triage within 72 hours).

If you have not heard back within 72 hours, please escalate by emailing the same address with `[URGENT]` in the subject.

## Scope

In scope:

- Hedron Router / Broker runtime (`src/router`, `src/broker`).
- Policy engine and policy decision events (`src/policy`).
- Settlement adapters (`src/settlement/**`).
- HCS event envelope, receipt schema, and verifier (`src/hcs`, `src/receipts`).
- Adapter interfaces (`src/adapters/**`).
- Smart contracts in `contracts/` (note: experimental and unaudited).

Out of scope (please do not file as Hedron vulnerabilities):

- Bugs in Hedera consensus, mirror nodes, or `@hashgraph/sdk` / `@hiero-ledger/sdk`.
- Bugs in third-party adapter providers (Daydreams, PayAI, etc.). Please report those to their maintainers; we are happy to help relay.
- Issues that only manifest with a leaked operator key. (Key custody is the operator's responsibility; receipt verification is what we secure.)

## Known properties (what we promise)

- Default-deny policy posture.
- HCS receipts are hash-chained and signed.
- Replay-safe settlement via single-use `paymentId` + idempotency cache.
- Unsigned / replayed messages rejected on the broker boundary.
- No secrets, prompts, or PII in any HCS event payload.

If you can break any of the above, that is in-scope.

## What we do NOT claim (yet)

- The smart contracts are NOT audited.
- The HAK v4 plugin and Daydreams adapter are interface-level skeletons in v0.2.0-alpha; expect rough edges.
- Mainnet rails are operator-driven, not "anyone can run on mainnet" yet.

## Coordinated disclosure

We will credit reporters in `CHANGELOG.md` unless you ask otherwise. We can coordinate a 90-day embargo for critical issues.
