# Router / Broker

The Router and Broker are the two runtime services that implement Hedron's commerce loop. They are deliberately split so the read path (discovery, quoting) is independent from the write path (policy + settlement + execution + receipt).

## Router responsibilities

- Register and list agents (via the registry).
- Expose capabilities and pricing.
- Route a user/app `IntentRequest` to candidate provider agents.
- Drive the quote request flow.
- Return candidates with metadata:
  - capability id
  - price (`CapabilityPricing`)
  - supported payment rails
  - trust / reputation metadata when present
  - policy requirements (e.g. "approval-required if > 5 HBAR")
  - supported runtime adapter (Daydreams, HAK, MCP, native)

The Router never moves value and never executes work. If it goes down, no money is at risk.

## Broker responsibilities

- Accept buyer/user intent + a chosen quote.
- Re-request fresh quotes if the chosen quote is stale.
- Enforce policy via the policy engine.
- Require approval when the policy says so (HITL).
- Build a `SettlementIntent` bound to:
  - `quoteId`
  - `correlationId`
  - `capabilityId`
  - exact amount + asset + recipient + network
  - expiration timestamp
  - action hash (hash of the canonical execution request)
- Call the settlement adapter, then **independently verify** the returned settlement receipt.
- Trigger execution on the provider agent through the adapter interface.
- Emit HCS audit events at every transition.
- Issue a `VerifiableReceipt` at the end.
- **Prevent replay**: idempotency cache keyed by `correlationId`+`quoteId`+`paymentId`.
- **Prevent double execution**: a flow may pass through `EXECUTION_STARTED` at most once.
- **Prevent paid-but-denied** and **unpaid-execution** outcomes: payment verification and execution dispatch are linked by a single state machine; neither side gets to skip the other.

## State machine

```
created → discovered → quoted → policy_evaluated
                                    │
              ┌─────────────────────┴─────────────────────┐
              ▼                                           ▼
       approval_required                              approved
              │                                           │
              ▼                                           │
       approval_granted ───────────────────────────────► payment_required
                                                          │
                                                          ▼
                                                  payment_verified
                                                          │
                                                          ▼
                                                 execution_started
                                                          │
                                          ┌───────────────┴───────────────┐
                                          ▼                               ▼
                                  execution_completed             execution_failed
                                          │                               │
                                          └───────────► receipt_issued ◄──┘
```

Failed states still issue a receipt. The receipt is the contract; an absence of a receipt is a Hedron bug, not a "soft failure".

## Quote binding rules

A `QuoteResponse` must include:

- `quoteId` (uuidv4, server-generated, single-use)
- `correlationId` (propagated from the intent)
- `capabilityId`
- `agentId`
- `pricing` (asset, amount, rail, expiration)
- `actionHash` — sha256 over the canonical action request
- `policyRequirements`
- `paymentRequirement` (produced by the settlement adapter)
- `signature` over the above by the provider agent

A `SettlementIntent` MUST reference the exact `quoteId`. If the broker receives a payment payload that doesn't match the quoteId+actionHash+amount+asset+recipient+expiry, the broker rejects it and emits `EXECUTION_FAILED` with reason `quote_mismatch`.

## Replay protection invariants

- `paymentId` is unique across the system. Reusing a `paymentId` is an immediate reject.
- `correlationId` keys the idempotency cache; the same `correlationId` returns the same final result, even if the caller retries.
- `actionHash` ties quote → payment → execution; tampering with any of the three breaks verification.
- All inbound messages on the broker HTTP boundary must be signed; unsigned/replayed messages are rejected. (Grant Tier 1 success criterion: "Unsigned/replayed messages rejected (tests + runtime)".)

## Wire format (HTTP — v0.2 draft)

```
POST /v1/intents                  → { intent } → { intentId, correlationId }
GET  /v1/intents/:id/quotes       → { quotes: QuoteResponse[] }
POST /v1/intents/:id/select-quote → { quoteId } → { flowId }
POST /v1/flows/:flowId/approve    → { approvalId } → { ok }
POST /v1/flows/:flowId/pay        → { paymentPayload } → { paymentVerified, settlementId }
GET  /v1/flows/:flowId            → { stateMachine, events, receipt? }
GET  /v1/receipts/:receiptId      → { receipt: VerifiableReceipt }
GET  /v1/receipts/:receiptId/verify → { ok, checks: VerificationResult }
```

All non-GET requests require a signature header (`X-Hedron-Signature`) over the canonical request body. Signature scheme aligns with HCS-10 / AP2 conventions in the Hedera ecosystem; see `docs/SECURITY_MODEL.md`.

## Reference implementation status

- Today: a single TS module under `src/broker/` implements the state machine against in-memory mocks. HCS emission uses a topic stub.
- Tier 1 M3 target: real HCS emission + a CLI verifier.
- Tier 1 M4 target: mainnet HBAR/HTS settlement adapter wired end-to-end.
- Tier 1 M5 target: the policy engine fully enforces approval thresholds and emits auditable decision events.
