# x402 (Hedera-native) & PayAI Adapters

> Status: **interface defined, skeletons in `src/settlement/x402/` (Hedera, primary) and `src/settlement/payai/` (deferred).**

x402 is the HTTP-native pay-per-request standard from Coinbase, leveraging the HTTP 402 "Payment Required" status. Hedera shipped a native **`exact` scheme** for x402 in February 2026 (see <https://hedera.com/blog/hedera-and-the-x402-payment-standard/>): the client builds a partially signed `TransferTransaction` (HBAR or HTS), the facilitator pays gas and submits, settlement confirms on-chain. **[Blocky402](https://blocky402.com/)** is the open-source reference facilitator and supports Hedera testnet V1 today.

Hedron's role:

- **First-class Hedera x402 rail** (`src/settlement/x402/`). Default facilitator: Blocky402 (testnet) — swappable to a self-hosted or CDP-hosted facilitator via config.
- **PayAI** (`src/settlement/payai/`) ships as an *interface-only* skeleton in v0.2. PayAI's network coverage is Solana + EVM (Base, Avalanche, etc.); Hedron will add a real PayAI adapter only after PayAI exposes Hedera support. Until then, the interface lives behind a feature flag and is not wired into the default Router.

Multiple payment rails are first-class. The broker selects a rail per quote based on `quote.pricing.rail` and policy.

## Supported rails

| Rail id | Scheme | Network | Status |
| --- | --- | --- | --- |
| `hedera-hbar` | native HBAR transfer | testnet, mainnet | primary |
| `hedera-hts` | HTS fungible token transfer | testnet, mainnet | primary |
| `x402-hedera` | x402 exact-scheme via Blocky402 (default) or self-hosted facilitator | testnet (V1) | v0.2.0-beta.1 target |
| `payai` | x402 via PayAI facilitator | Base, Solana | interface only — gated by upstream Hedera support |
| `evm-usdc` | direct ERC-20 transfer | EVM chains | optional |

## Payment adapter interface

```ts
// src/settlement/index.ts (target shape)

export interface PaymentAdapter {
  rail: PaymentRail

  createPaymentRequirement(opts: {
    quote: QuoteResponse
    correlationId: string
  }): Promise<PaymentRequirement>

  validatePaymentPayload(opts: {
    requirement: PaymentRequirement
    payload: PaymentPayload
  }): Promise<PaymentValidation>     // checks shape, signature, amount, asset, recipient, network, expiry, action-hash

  settlePayment(opts: {
    requirement: PaymentRequirement
    payload: PaymentPayload
    idempotencyKey: string
  }): Promise<SettlementResult>

  getSettlementStatus(settlementId: string): Promise<SettlementStatus>

  produceSettlementReceipt(settlementId: string): Promise<SettlementReceipt>

  verifySettlementReceipt(receipt: SettlementReceipt): Promise<SettlementVerification>
}
```

`validatePaymentPayload` is a **pure check** — no side effects. `settlePayment` is the only adapter call that moves value, and it requires an `idempotencyKey` derived from `(correlationId, quoteId)`.

## Safety invariants (apply to every rail)

These are not guidelines, they are tests in `tests/unit/settlement/`:

1. **Bind payment authorization to exact quote.** A payment payload that targets a different `quoteId` is rejected.
2. **Bind quote to exact resource / action / capability.** `actionHash` must match the quote.
3. **Bind payment to `correlationId`.** Cross-flow payment reuse is rejected.
4. **Prevent replay.** `paymentId` is single-use; an idempotency cache lookup returns the previous result instead of re-settling.
5. **Prevent quote swapping.** Quote substitution between selection and pay is detected via `quoteId` + `actionHash`.
6. **Prevent paid-but-denied.** Policy runs before `PAYMENT_REQUIRED`; the rail is never asked to settle for a denied flow.
7. **Prevent unpaid execution.** The broker dispatcher requires `flow.state === 'payment_verified'` before calling the provider agent.
8. **Verify amount, asset, network, recipient, expiration, action hash.** All seven fields are checked, all seven must match.
9. **Separate verification from execution but link them.** `verifySettlementReceipt` returns a `SettlementVerification` independent of execution; execution receives the verification result as input.

Tests:

- `tests/unit/settlement/replay.test.ts` — replay rejection
- `tests/unit/settlement/quote-swap.test.ts` — quote-substitution detection
- `tests/unit/settlement/mismatch.test.ts` — amount / asset / recipient mismatch
- `tests/unit/settlement/idempotency.test.ts` — second call returns cached result
- `tests/unit/settlement/expiry.test.ts` — late payment rejected
- `tests/unit/settlement/policy-deny.test.ts` — no `createPaymentRequirement` after deny

## PayAI specifics

- PayAI is configured via `PAYAI_FACILITATOR_URL`, `PAYAI_NETWORK`, `PAYAI_API_KEY` in `.env`.
- Hedron does not assume the PayAI API is stable. The adapter wraps it behind `PaymentAdapter` and re-verifies settlement on-chain (Base / Solana) before reporting `PAYMENT_VERIFIED`.
- PayAI does not handle Hedera. For Hedera flows always use the `hedera-hbar`, `hedera-hts`, or `x402` (Hedera) rails.

## Hedera x402 specifics

- The `x402` rail uses the Hedera exact-scheme facilitator. Hedron either hosts the facilitator itself (`HEDRON_X402_FACILITATOR_URL` left blank → embedded mode) or delegates to an external one (URL set).
- The facilitator accepts a partially-signed `TransferTransaction` from a client, runs a strict verification pipeline, optionally does an on-chain preflight, countersigns as fee payer, and submits to consensus. Hedron awaits the receipt rather than trusting a pre-check.
- Reference: <https://github.com/x402-foundation/x402/blob/main/typescript/packages/mechanisms/hedera/README.md>.

## What this adapter is NOT

- It is **not** a wallet. Custody stays with the caller.
- It is **not** a router for off-chain pricing. Pricing lives in the quote.
- It is **not** an oracle. Settlement status comes from the rail; Hedron just verifies and anchors.
