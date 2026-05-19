# x402 Adapter (Hedera-native)

> Status: **interface defined, skeleton in `src/settlement/x402/`. Real-network adapter ships in `v0.2.0-beta.1`.**

x402 is the HTTP-native pay-per-request standard that uses the `402 Payment Required` status code. Hedera ships a native **`exact` scheme**: the client builds a partially signed `TransferTransaction` (HBAR or HTS), the facilitator pays gas and submits, and settlement confirms on-chain.

Hedron treats x402 as a first-class settlement rail (`x402-hedera`) alongside the native `hedera-hbar` and `hedera-hts` rails. Selecting `x402` happens per quote based on `quote.pricing.rail` and policy.

## What ships in Hedron

- `src/settlement/x402/` exposes the `PaymentAdapter` interface for the Hedera exact scheme.
- The Router emits a properly-shaped `402` response (`x-payment` header schema, amount in tinybar, recipient, `expiresAt`, `actionHash`).
- The Broker verifies the returned payment payload, dispatches it to a configured facilitator, and waits for on-chain settlement. The verifier confirms the resulting receipt against a public Hedera mirror node.

## Rails table

| Rail id | Scheme | Network | Status |
| --- | --- | --- | --- |
| `hedera-hbar` | native HBAR transfer | testnet | primary |
| `hedera-hts` | HTS fungible token transfer | testnet | primary |
| `x402` | x402 exact-scheme via configured facilitator | testnet | beta.1 target |
| `evm-usdc` | direct ERC-20 transfer | EVM | optional |

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
  }): Promise<PaymentValidation> // checks shape, signature, amount, asset, recipient, network, expiry, action-hash

  settle(opts: {
    requirement: PaymentRequirement
    payload: PaymentPayload
    correlationId: string
  }): Promise<SettlementResult>

  verifySettlement(opts: {
    settlement: SettlementResult
    requirement: PaymentRequirement
  }): Promise<SettlementVerification>
}
```

Each Hedron payment is **single-use** (the broker tracks `paymentId`s). The adapter never broadcasts twice for the same `quoteId + actionHash + recipient + amount + asset + rail + expiry` tuple — the broker rejects replays with `ReplayDetectedError` before the adapter is called.

## Facilitator configuration

The facilitator is **swappable** via configuration. Hedron does not assume any single operator. Use whichever Hedera-compatible x402 facilitator your environment requires (self-hosted, reference, or a managed service); the adapter behaves the same way as long as the facilitator implements the published x402 exact scheme.

`.env` keys:

```
HEDRON_X402_FACILITATOR_URL=
HEDRON_X402_NETWORK=testnet
```

When `HEDRON_X402_FACILITATOR_URL` is empty, the `x402` rail is disabled.

## Verification invariants

- `settlement.txId` MUST be present on the configured Hedera mirror node before the broker emits `PAYMENT_VERIFIED`.
- The on-chain transfer amount, asset, and recipient MUST match the `paymentRequirement`. Any mismatch fails the verifier and aborts the flow.
- The receipt's `settlementRef` carries the on-chain tx id and the facilitator id; both are independently auditable.

## Sources

- Hedera x402 announcement (Feb 2026): <https://hedera.com/blog/hedera-and-the-x402-payment-standard/>
- x402 specs (Coinbase): <https://github.com/coinbase/x402>
- x402 exact scheme: <https://github.com/coinbase/x402/tree/main/specs/schemes/exact>
- Hedera native developer path: <https://docs.hedera.com/hedera/getting-started-hedera-native-developers>
