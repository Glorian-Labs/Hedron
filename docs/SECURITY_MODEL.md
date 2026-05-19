# Security Model

This is a working threat model for Hedron v0.2. It is deliberately conservative — Hedron's value proposition is *proof*, so anything that breaks proof must fail closed.

## Trust assumptions

- **Hedera consensus** — trusted. We anchor receipts here.
- **Hedera mirror nodes** — trusted for read paths, but Hedron supports plural mirror hints so a single mirror cannot lie.
- **Provider agents** — *untrusted*. They produce signed quotes and signed execution results, but the broker re-verifies everything against the bound `actionHash`.
- **External x402 facilitators** — *partially trusted*. We trust them to broadcast and timestamp; we do not trust their reported settlement status without an independent on-chain check.
- **The Hedron operator key** — trusted root. Compromise of this key is a P0 incident. The key signs receipts and runs the broker. See "Operator-key compromise" below.

## Invariants

| ID | Invariant |
| --- | --- |
| I-1 | No execution begins before a verified payment for the same `(quoteId, actionHash, correlationId)` triple. |
| I-2 | No payment is collected against a quote that the policy engine did not allow (possibly via approval). |
| I-3 | Every flow ends with a `RECEIPT_ISSUED` event, even on failure. |
| I-4 | `paymentId` is single-use across the operator's namespace. |
| I-5 | An HCS event chain mismatch (broken `prevEventHash`) is a hard verification failure. |
| I-6 | No private keys, mnemonics, prompts, or PII appear in any HCS event payload. |
| I-7 | Adapters cannot bypass the policy engine — policy runs inside the broker, not at adapter edges. |
| I-8 | Every inbound HTTP request to the broker is signed; unsigned/replayed requests are rejected before any state transition. |

## Threats and mitigations

### Replay

- **Threat:** an attacker resends an old `pay` request to collect against a stale quote.
- **Mitigation:** quotes carry single-use `quoteId` + expiry; payment payloads carry `paymentId`; idempotency cache rejects repeats; signatures bind body to nonce.

### Quote swapping

- **Threat:** an attacker swaps a low-price quote for a high-price one between selection and payment.
- **Mitigation:** the `SettlementIntent` carries `quoteId` + `actionHash`; the broker re-binds quote to settlement before dispatch; rail adapters must reject mismatched payloads.

### Paid-but-denied

- **Threat:** payment succeeds, then policy denies, leaving the user paid but un-served.
- **Mitigation:** policy is evaluated *before* `PAYMENT_REQUIRED` is emitted. The only legal path from `policy_evaluated` to `payment_required` is `allow` or `approval_granted`. If `policy_evaluated` returns `deny`, the broker short-circuits to `RECEIPT_ISSUED { status: 'failed', reason: 'policy_denied' }` and never asks for payment.

### Unpaid execution

- **Threat:** an agent executes work without verified payment.
- **Mitigation:** broker is the only path to provider agents through Hedron-supplied adapters. The adapter dispatcher refuses to call `provider.execute` unless `flow.state === 'payment_verified'`. Provider agents that accept direct calls outside Hedron are out of scope.

### Unsigned / forged messages

- **Threat:** an attacker injects an `approve` or `pay` call.
- **Mitigation:** signature header is required; signature is over a canonical encoding including a server-issued nonce; unsigned bodies are dropped before state changes (grant Tier 1 success criterion).

### HCS tampering / mirror lying

- **Threat:** an attacker controls a mirror and serves a falsified event chain.
- **Mitigation:** verifier accepts plural mirror hints and cross-checks. The `prevEventHash` chain plus the operator signature on each event makes selective omission detectable. (Full mirror disagreement detection lands in v0.3.)

### Operator-key compromise

- **Threat:** the Hedron operator key is leaked.
- **Mitigation:** receipts include a `signature` field, but verification accepts a keyset (multiple operator keys with rotation). Compromise → emit a rotation event on the operator-keys topic, mark new receipts under the new key, refuse old key after a cooldown. Past receipts remain verifiable against the (now-revoked) key; they should be re-anchored if the compromise pre-dated the receipt.

### Sensitive-data leakage on HCS

- **Threat:** a careless caller passes private context into a payload and it ends up on HCS forever.
- **Mitigation:** event emitters use a strict schema; the HCS emit wrapper rejects events whose payload size exceeds a budget or whose JSON contains banned key names (`privateKey`, `mnemonic`, `prompt`, `apiKey`, etc.). Adapters MUST hash before reference; see `docs/HCS_RECEIPTS.md` "Forbidden payload content".

### Adapter misbehavior

- **Threat:** a third-party adapter reports success without actually settling.
- **Mitigation:** the broker verifies `SettlementResult` independently (on-chain read for native rails, facilitator-result + on-chain read for x402). The adapter does not get to be the only witness.

### Smart-contract risk

- **Status:** unaudited. Contracts in `contracts/` are reference implementations of example agents (supply-chain). They are **not** part of the commerce trust path. Receipts do not depend on contract state.

## Secret hygiene

- `.env` is never committed. Only `.env.example` (placeholders).
- CI runs `gitleaks` on every push.
- A pre-push hook in `CONTRIBUTING.md` mirrors the CI check locally.
- Test credentials live in operator-managed secret stores, never in tracked files. Test data files include `<placeholder-*>` markers and CI fails on a known-bad pattern set.

## Reporting vulnerabilities

See [`SECURITY.md`](../SECURITY.md) in the repo root.
