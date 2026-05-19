# HCS Receipts and Audit Trail

Hedron treats the HCS audit trail as the source of truth. Every commerce flow is a sequence of structured events on a dedicated HCS topic, terminated by a verifiable receipt that anchors content hashes and HCS sequence numbers.

## Event taxonomy

Every flow emits the following ordered events. Some are conditional (approval, failure).

| # | Event | Required keys | When |
| --- | --- | --- | --- |
| 1 | `INTENT_CREATED` | `intent`, `correlationId` | on accepting an intent |
| 2 | `AGENTS_DISCOVERED` | `candidates: AgentId[]` | after router discovery |
| 3 | `QUOTE_REQUESTED` | `quoteRequestId`, `targetAgentId` | per candidate |
| 4 | `QUOTE_RECEIVED` | `quote` | per candidate that replied |
| 5 | `POLICY_EVALUATED` | `policyDecisionHash`, `decision`, `reason` | after policy evaluation |
| 6a | `APPROVAL_REQUIRED` | `approverScope` | when policy demands HITL |
| 6b | `APPROVAL_GRANTED` | `approvalId`, `approverId` | when a human approves |
| 7 | `PAYMENT_REQUIRED` | `paymentRequirement` | broker dispatches to rail |
| 8 | `PAYMENT_VERIFIED` | `paymentId`, `settlementHash`, `rail` | rail confirms + broker verifies |
| 9 | `EXECUTION_STARTED` | `executionId` | provider agent dispatched |
| 10 | `EXECUTION_COMPLETED` \| `EXECUTION_FAILED` | `resultHash` or `failureReason` | provider finished |
| 11 | `RECEIPT_ISSUED` | `receipt: VerifiableReceipt` | end of flow |

## Event envelope

Every HCS message uses one envelope:

```ts
interface HcsAuditEvent<T = unknown> {
  schemaVersion: '1'
  eventType: HedronEventType
  correlationId: string
  flowId: string
  agentId?: string
  capabilityId?: string
  quoteId?: string
  paymentId?: string
  timestamp: string        // ISO-8601 UTC
  prevEventHash?: string   // sha256 of canonical-encoded previous event
  payload: T
  signature: string        // signature over canonical encoding of the envelope minus signature
}
```

**Hashing rules**

- Canonical encoding: JSON with sorted keys, UTF-8, no insignificant whitespace.
- `prevEventHash`: sha256 hex of the canonical encoding of the previous event in the same flow (omit on event #1).
- `signature`: detached signature over the canonical encoding with the signature field stripped.

This gives a per-flow hash chain even when HCS sequence numbers are not adjacent (events from multiple flows interleave on a shared topic).

## Forbidden payload content

- No private keys, mnemonics, or operator credentials.
- No raw prompts or private agent memory.
- No confidential business context. Hash and reference, do not embed.
- No PII. If a flow involves PII, only the salted hash + retention policy reference goes on HCS.
- No secrets of any kind. Even error messages must be sanitized.

If a payload needs to reference something private, it carries:
- `contentHash: sha256(content)`
- `contentHashAlgorithm: 'sha-256'`
- `contentLocation: 'off-chain'` (with a non-identifying pointer if needed)

## Receipt schema

```ts
interface VerifiableReceipt {
  receiptId: string                    // uuidv4
  schemaVersion: '1'
  flowId: string
  intentId: string
  correlationId: string
  quoteId: string
  paymentId: string
  executionId: string
  hcsTopicId: string                   // e.g. 0.0.xxxxx
  hcsSequenceStart: number             // sequence number of INTENT_CREATED
  hcsSequenceEnd: number               // sequence number of RECEIPT_ISSUED (this event)
  resultHash: string                   // sha256 hex of canonical execution result
  policyDecisionHash: string           // sha256 hex of canonical policy decision
  settlementHash: string               // sha256 hex of canonical settlement record
  rail: PaymentRail
  asset: { kind: 'hbar' } | { kind: 'hts', tokenId: string } | { kind: 'evm-erc20', chainId: number, contract: string }
  amount: string                       // smallest unit, base10 string
  recipient: string
  status: 'completed' | 'failed'
  failureReason?: string
  issuedAt: string                     // ISO-8601 UTC
  verification: {
    method: 'hcs-mirror'
    mirrorHints: string[]              // optional public mirror node URLs
    chainAlgorithm: 'sha-256-prevhash'
  }
  signature: string                    // operator signature over canonical receipt
}
```

## Verification path

`src/receipts/verifier.ts` implements:

```ts
verifyReceipt(receipt: VerifiableReceipt, opts?: { mirrorUrl?: string }): Promise<VerificationResult>
```

It performs, in order:

1. **Schema check** — receipt parses against the v1 schema.
2. **Signature check** — operator signature is valid for the published Hedron operator key.
3. **HCS mirror read** — fetch events `hcsSequenceStart..hcsSequenceEnd` on `hcsTopicId`.
4. **Chain integrity** — recompute `prevEventHash` chain across events; mismatches fail.
5. **Receipt anchoring** — the `RECEIPT_ISSUED` event at `hcsSequenceEnd` must contain a receipt with matching `receiptId` and matching content hashes.
6. **Policy + settlement consistency** — `policyDecisionHash` and `settlementHash` in the receipt match what is anchored in events #5 and #8.
7. **Final status** — `status` in the receipt matches the terminal `EXECUTION_*` event.

`VerificationResult` returns each check with `{ ok, detail }` so reviewers can inspect partial failures (e.g. signature ok, mirror unreachable).

## Topics

By default Hedron uses two topics:

- `HEDRON_HCS_AUDIT_TOPIC_ID` — every event in the table above.
- `HEDRON_HCS_RECEIPT_TOPIC_ID` — `RECEIPT_ISSUED` events also mirrored here for a smaller "receipt-only" index.

Operators can run both on a single topic — the verifier accepts both topologies. Audit and receipt separation is purely an indexing optimization.

## Versioning

`schemaVersion: '1'` is the only valid value until v0.2.0 is tagged. Breaking schema changes bump the major and ship a side-by-side migration verifier.
