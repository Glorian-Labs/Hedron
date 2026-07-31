# x402 Adapter (Hedera-native)

> Status: **implemented and verified against a live Hedera testnet facilitator.** `src/settlement/x402/` ships a working `PaymentAdapter`, wire codec, facilitator client, and client-side payer. 31 offline unit tests (incl. drift guards against the real `@x402/hedera@2.20.0` constants) plus a live probe — `npm run e2e:x402:testnet` — whose credential-free tier passes 6/6 against Blocky402's testnet facilitator. On-chain settlement (Tier B) is implemented but unproven: it needs a funded testnet account, which CI does not have.

x402 is the HTTP-native pay-per-request standard built on the `402 Payment Required` status code. Hedera ships a native **`exact` scheme**: the client builds a *partially signed* `TransferTransaction` (HBAR or HTS), the facilitator sponsors the fee and submits it, and settlement is confirmed on-chain.

Hedron treats x402 as a first-class settlement rail (`x402`) alongside `hedera-hbar` and `hedera-hts`. Rail selection happens per quote from `quote.pricing` plus policy.

**Hedron custodies nothing on this rail.** The client signs the transfer with its own key, the facilitator pays fees and submits. Hedron's job is to bind the payment to a *verified quote* and anchor the on-chain result into a receipt.

## Canonical sources

Pinned during implementation — earlier drafts of this doc cited the wrong repo.

- Spec repo: <https://github.com/x402-foundation/x402> (`specs/schemes/exact/scheme_exact_hedera.md`). `coinbase/x402` also resolves but `x402-foundation` is canonical.
- Packages: `@x402/hedera@2.20.0`, `@x402/core@2.20.0` (both optional peer deps). The unscoped `x402` package is a stale v1 line — do not use it.
- Hedera docs: <https://docs.hedera.com/solutions/ai/x402>
- Networks are CAIP-2 (`hedera:testnet`, `hedera:mainnet`), not short names, on the wire.

## Module layout

| File | Responsibility | Keys / network |
| --- | --- | --- |
| `wire.ts` | x402 v2 wire types + `X-PAYMENT` base64 encode/decode | none |
| `mapping.ts` | Hedron ⇄ x402 mapping, CAIP-2 conversion, requirement matching | none (pure) |
| `facilitator.ts` | Facilitator HTTP client — `/supported`, `/verify`, `/settle` | network only |
| `adapter.ts` | `PaymentAdapter` implementation (`X402HederaAdapter`) | network only |
| `client.ts` | Client-side payer (`X402HederaPayer`) | **only module touching a private key** |

The key-handling surface is deliberately confined to `client.ts` so the adapter, mapping, and facilitator client all stay key-free and testable without credentials.

## Rails table

| Rail id | Scheme | Network | Status |
| --- | --- | --- | --- |
| `hedera-hbar` | native HBAR transfer | testnet | type surface only, mock settles |
| `hedera-hts` | HTS fungible token transfer | testnet | type surface only, mock settles |
| `x402` | x402 exact scheme via configured facilitator | testnet | **implemented, unproven on live facilitator** |
| `evm-usdc` | direct ERC-20 transfer | EVM | optional, not implemented |

## Client payer contract

`X402HederaPayer.buildPaymentHeader()` follows the scheme spec exactly:

1. Build a **direct** `TransferTransaction` — never `ScheduleCreate`-wrapped.
2. Debit self and credit `payTo` by exactly `amount` of `asset`.
3. Set the transaction id's account to `extra.feePayer` so the *facilitator* is the network-level fee payer. This is the counter-intuitive step: the transaction id belongs to the facilitator even though the payer is the one sending value.
4. Freeze and sign — yielding a *partially* signed transaction, missing the fee payer's signature.
5. Base64 the serialized bytes into `payload.transaction`.

Amounts stay in base units end to end. HBAR goes through `Hbar.fromTinybars(string)` and HTS amounts are passed to `addTokenTransfer` as `bigint`; nothing round-trips through a float, since that is a silent way to pay the wrong amount.

## Adapter behaviour

`X402HederaAdapter` is deliberately asymmetric with `MockPaymentAdapter`: **it cannot fabricate a settlement.**

- `createPaymentRequirement` requires fixed pricing (`fixed-hbar` or `fixed-hts`); anything else throws `X402MappingError('unsupported_pricing')`.
- `feePayer` is preferred from config and otherwise discovered from the facilitator's `/supported` response.
- `settlePayment` rejects a repeated `paymentId` with `ReplayDetectedError`, decodes the `X-PAYMENT` header, asserts the wire requirements match Hedron's requirement (`assertRequirementsMatch`), then calls `/settle`. It returns only what the facilitator actually confirmed.
- A failed settlement raises `X402FacilitatorError` carrying the facilitator's own `errorReason`.
- `settlementHash` binds scheme, network, transaction, payer, amount, asset, `payTo`, `quoteHash`, `actionHash`, and `correlationId` — so a receipt cannot be re-pointed at a different payment.

## Facilitator configuration

The facilitator is **swappable**. Hedron assumes no single operator; any facilitator implementing the published exact scheme works.

```
HEDRON_X402_FACILITATOR_URL=
HEDRON_X402_FACILITATOR_API_KEY=
HEDRON_X402_NETWORK=testnet
```

When `HEDRON_X402_FACILITATOR_URL` is empty the `x402` rail is disabled.

### Known-good testnet facilitator

Blocky402 runs an open-access Hedera **testnet** facilitator — no API key. Verified live 2026-07-31:

| | Value |
| --- | --- |
| Base URL | `https://api.testnet.blocky402.com` |
| Advertised fee payer | `0.0.7162784` |
| Networks | `hedera:testnet` (also `eip155:80002`, a Solana devnet) |

**Watch the host.** `https://api.blocky402.com` (no `testnet.`) also answers `200` but advertises **`hedera:mainnet`** with a *different* fee payer (`0.0.10571514`). Pointing a testnet run at the mainnet host is a silent misconfiguration — `/supported` succeeds, then every payload is rejected for the wrong network. Mainnet requires an API key. Two other plausible hostnames (`facilitator.blocky402.com`, `x402.blocky402.com`) do not resolve.

## Live verification

```bash
npm run e2e:x402:testnet
```

Two tiers, so the credential-free part is always runnable:

**Tier A (no credentials, 6 checks, currently 6/6 green)** — `/supported` reachable and advertising `hedera:testnet`; our `feePayerFor()` and `supportsHederaNetwork()` agree with it; the mirror node confirms the advertised fee-payer account exists; the adapter builds a `PaymentRequirement` off the discovered fee payer; and the facilitator **rejects a malformed payload** (`invalid_exact_hedera_payload_transaction_could_not_be_decoded`). That last check is the important one — it proves `/verify` is genuinely round-tripping rather than being stubbed out.

**Tier B (needs `HEDERA_OPERATOR_ID` + `HEDERA_OPERATOR_KEY`, funded testnet)** — builds and signs a real `TransferTransaction` via `X402HederaPayer`, asserts the tx-id account is the fee payer, `/verify`s it, settles it on-chain through the adapter, polls the mirror node for consensus, runs `verifySettlementReceipt` against the real settlement, and asserts a replay is rejected without a second `/settle`. Amount is 100 tinybar (0.000001 HBAR) so a real run costs ~nothing. **Not yet executed** — no funded account available.

## Verification invariants

- The on-chain transfer amount, asset, and recipient MUST match the `paymentRequirement`. Any mismatch fails the verifier and aborts the flow.
- `verifySettlementReceipt` runs `railMatches`, `recordShape`, `known`, `recordMatches`, and `networkMatches`. An unrecognised `settlementId` fails closed with `known: false`.
- The receipt's `settlementRef` carries the on-chain tx id and the facilitator id; both are independently auditable.

## Known gaps

- **No on-chain settlement has actually happened.** Tier B of the probe is written but unexecuted — it needs a funded testnet account. This is the single remaining unknown on the rail.
- The adapter has no mirror-node read-back of its own, so `receipt.verification.mirrorHints` stays empty and confirmation depends on the facilitator's response. The probe polls the mirror node directly; the adapter should eventually do so itself. Blocks the Audit-Trail-v1 "explorer-verifiable" bullet.
- Refund/dispute hooks are not implemented on this rail.
