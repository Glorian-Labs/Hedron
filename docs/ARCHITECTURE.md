# Hedron Architecture

> Status: **v0.2 design.** Modules are being landed incrementally. Where code does not yet match this doc, the doc is the target.

## Goals

1. Make the **commerce loop** explicit and reviewable: `discover → quote → policy → pay → execute → receipt`.
2. Make **HCS the source of truth** for that loop — every transition emits a structured event; every flow ends with a verifiable receipt.
3. Keep the **runtime small and the adapters big**. Payment rails, agent runtimes (Daydreams, HAK), and protocols (A2A, AP2, HCS-10, MCP) live behind adapter interfaces.
4. **Default deny.** Policy is enforced inside the broker, not at adapter edges.
5. **Replay-safe.** Quotes are bound to capability+resource+correlationId; payments are bound to quotes; executions are bound to verified payments.

## Components

```
┌────────────────────────────────────────────────────────────────────┐
│                              Hedron                                │
│                                                                    │
│   ┌──────────┐    ┌──────────┐    ┌─────────────┐   ┌───────────┐  │
│   │  Router  │ →  │  Broker  │ →  │  Settlement │ → │   Agent   │  │
│   └────┬─────┘    └────┬─────┘    └──────┬──────┘   └─────┬─────┘  │
│        │               │                 │                │        │
│        ▼               ▼                 ▼                ▼        │
│   ┌─────────┐    ┌─────────┐       ┌─────────┐      ┌──────────┐   │
│   │Registry │    │ Policy  │       │ Rails:  │      │ Adapter  │   │
│   │AgentCard│    │ Engine  │       │ HBAR    │      │Daydreams │   │
│   └─────────┘    └─────────┘       │ HTS     │      │ HAK v4   │   │
│        │               │           │ x402    │      │ MCP      │   │
│        │               │           │ EVM     │      └──────────┘   │
│        └───────────────┴───────────┴────┬────┘                     │
│                                         ▼                          │
│                              ┌────────────────────┐                │
│                              │      Receipts      │                │
│                              │ Verifier + Schema  │                │
│                              └─────────┬──────────┘                │
│                                        ▼                           │
│                          ┌─────────────────────────┐               │
│                          │  HCS Audit Topic(s)     │               │
│                          │  ordered, queryable     │               │
│                          └─────────────────────────┘               │
└────────────────────────────────────────────────────────────────────┘
```

### Router (`src/router/`)
- Maintains the live capability index (built from `AgentCard`s in the registry).
- Accepts `IntentRequest` from a user/app/agent and returns ranked candidate agents.
- Fans out `QuoteRequest`s to candidates that match the intent capability filter.
- Returns `QuoteResponse[]` annotated with metadata: capability, pricing, allowed rails, policy requirements, supported runtime adapter, trust/reputation if present.
- **Does not settle, does not execute.** Router is read-mostly.

### Broker (`src/broker/`)
- Stateful coordinator of a single flow lifecycle (`flowId`).
- Accepts a chosen `QuoteResponse` + `IntentRequest` and:
  1. Calls the policy engine with `PolicyContext`.
  2. If approval is required, emits `APPROVAL_REQUIRED` and waits for an out-of-band `APPROVAL_GRANTED`.
  3. Builds a `SettlementIntent` and dispatches it to the rail.
  4. Verifies the `SettlementResult` against the quote.
  5. Triggers execution on the provider agent (via the adapter interface).
  6. Issues a `VerifiableReceipt` with HCS sequence anchors.
- Maintains an idempotency cache keyed by `correlationId` + `quoteId` + `paymentId` to prevent double execution.

### Registry (`src/registry/`)
- Owns `AgentIdentity`, `AgentCard`, `AgentCapability`, `CapabilityPricing`.
- Supports static config-driven registration and HCS-10 / ERC-8004 discovery (planned).
- Capability index is queryable by tag, price ceiling, and rail.

### Policy engine (`src/policy/`)
- Pure-function evaluator: `(PolicyRule[], PolicyContext) → PolicyDecision`.
- Every evaluation produces a `PolicyDecisionEvent` with `policyId`, `inputHash`, `decision`, `reason`, `timestamp`, `correlationId`. The hash + id let auditors reproduce the decision later without trusting the runtime.
- Built-in rule kinds: spending limit, allowlist, denylist, max-price-per-call, max-daily-spend, allowed-rails, allowed-capabilities, allowed-agents, approval-threshold, deny-by-default.
- Human-in-the-loop is just a rule that produces `APPROVAL_REQUIRED`.

### Settlement (`src/settlement/`)
- Adapter interface: `createPaymentRequirement → validatePaymentPayload → settlePayment → getSettlementStatus → produceSettlementReceipt → verifySettlementReceipt`.
- Adapters: `hedera/` (HBAR + HTS), `x402/` (Hedera exact scheme), `evm/` (optional).
- Each adapter is responsible for binding payment authorization to the exact `quoteId` / `resourceId` / `correlationId` and rejecting replays.

### Receipts (`src/receipts/`)
- `Receipt` is the structured artifact returned to the caller.
- `VerifiableReceipt` extends it with the HCS sequence anchors + content hashes (`resultHash`, `policyDecisionHash`, `settlementHash`).
- The verifier in `src/receipts/verifier.ts` accepts a receipt + an HCS mirror node URL and re-derives the event chain, returning a structured `VerificationResult`.

### HCS layer (`src/hcs/`)
- Thin wrapper over `@hashgraph/sdk` / `@hiero-ledger/sdk` for topic discovery, event signing, sequence reads.
- All events are emitted via a single `emit(event: HcsAuditEvent)` API so envelope shape stays uniform.

### Adapters (`src/adapters/`)
- `daydreams/` — maps Daydreams agent/action/task lifecycle to Hedron capabilities; exposes `registerDaydreamsAgent`, `exposeCapability`, `requestQuote`, `executePaidAction`, `emitReceipt`.
- `hedera-agent-kit/` — exposes Hedron commerce actions as HAK v4 tools (BaseTool-based) with policy hooks: `listAgents`, `getQuote`, `approveQuote`, `pay`, `verifyReceipt`, `getAuditTrail`.
- `mcp/` — planned, exposes the same tool surface as an MCP server.

### Protocols (`src/protocols/`)
- `a2a/` — Google A2A handshake (lifted from current `A2AProtocol*`).
- `hcs10/` — HCS-10 OpenConvAI connection + transaction approval.
- `ap2/` — AP2 payment negotiation.

## Lifecycle (single flow)

```
IntentRequest
    │
    ▼
INTENT_CREATED                          ← HCS event #1 (correlationId, flowId)
    │
    ▼
Router.discover → AgentCard[]
    │
    ▼
AGENTS_DISCOVERED                        ← HCS event #2
    │
    ▼
QUOTE_REQUESTED → QUOTE_RECEIVED (×N)   ← HCS events #3, #4
    │
    ▼
Broker → Policy.evaluate
    │
    ▼
POLICY_EVALUATED                         ← HCS event #5
    ├─ APPROVAL_REQUIRED                 ← HCS event (conditional)
    │       │
    │       ▼
    └─ APPROVAL_GRANTED                  ← HCS event (conditional)
    │
    ▼
PAYMENT_REQUIRED                         ← HCS event
    │
    ▼
Settlement.settlePayment
    │
    ▼
PAYMENT_VERIFIED                         ← HCS event (carries paymentId, settlementHash)
    │
    ▼
EXECUTION_STARTED                        ← HCS event
    │
    ▼
provider agent runs
    │
    ▼
EXECUTION_COMPLETED | EXECUTION_FAILED   ← HCS event
    │
    ▼
RECEIPT_ISSUED                           ← HCS event (final, carries receiptId + anchors)
```

## Type surface

The shared public types live in `src/types/`:

`HedronConfig`, `AgentIdentity`, `AgentCapability`, `AgentCard`, `CapabilityPricing`,
`IntentRequest`, `QuoteRequest`, `QuoteResponse`, `BrokerDecision`,
`PolicyRule`, `PolicyContext`, `PolicyDecision`,
`SettlementIntent`, `SettlementResult`, `PaymentRail`,
`HcsAuditEvent`, `Receipt`, `VerifiableReceipt`, `ExecutionResult`,
`AdapterManifest`.

Treat anything outside `src/types/` and the module index files as private until v0.2.0 is tagged.

## Non-goals (v0.2)

- Mainnet self-custody for arbitrary users. Mainnet settlement is operator-driven.
- Cross-chain bridging beyond what x402 rails already provide.
- A general-purpose agent framework. Hedron is the commerce layer; runtimes plug in.
- Verifiable compute attestation. Tier 1 explicitly does not block on this.
