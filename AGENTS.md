# AGENTS.md — Hedron (agent harness)

*Implementation agent bootstrap for the Hedron SDK. Deep design: `docs/ARCHITECTURE.md`.*

## Role

**Hedron** = Hedera-native agentic commerce SDK + Router/Broker runtime.

Canonical loop: `discover → quote → policy → pay → execute → receipt`

HCS is the source of truth — do not claim success without verifiable receipts.

## Tooling

- **Runtime:** Node 20+, npm 10+
- **Tests:** Vitest — `npm test` (unit under `tests/unit/`)
- **Lint:** `npm run lint` · **Build:** `npm run build`
- **Demo:** `demo/local.ts`, `demo/testnet.ts`

## Codebase map

See **`docs/CODEBASE.md`** before broad grep. Unconventional Hedera/x402 surface — map first.

## Module guide

| Path | Responsibility |
|------|----------------|
| `src/router/` | Intent routing, quote fan-out (no settle/execute) |
| `src/broker/` | Flow lifecycle, idempotency, receipt issuance |
| `src/policy/` | Default-deny policy engine |
| `src/settlement/` | HBAR / HTS / x402 / EVM rails |
| `src/receipts/` | Verifiable receipt schema + verifier |
| `src/hcs/` | HCS audit topic emit/query |
| `src/registry/` | Agent cards / capability index |
| `src/adapters/` | Daydreams, Hedera Agent Kit, MCP |

## Harness rules

- **Simplicity first** — match existing module boundaries; adapters stay at edges.
- **Verify before done** — `npm test` + affected unit path; report output.
- **Surgical edits** — v0.2 APIs may change until tagged; update docs when behavior shifts.
- **No mainnet claims** — testnet-first unless explicitly chartered.

## Navigation

- Filesystem tools for code in `src/` and `tests/`
- Architecture truth: `docs/ARCHITECTURE.md`, `docs/ROUTER_BROKER.md`, `docs/HCS_RECEIPTS.md`
- Private hackathon notes: `docs/internal/` (if present)

## Security

- Never commit `.env`, keys, or operator credentials
- Smart contracts unaudited — no mainnet value without explicit review

## Definition of done

1. Change matches scope; tests pass for touched modules
2. Summary lists files, commands run, receipt/HCS implications if any
3. Durable lessons → this file § Learned or `docs/internal/`

## Learned

*(Append one-line bullets when corrected.)*

- **HAK v4 API: trust the tarball, not GitHub docs.** Upstream `main` markdown is ahead of published `4.0.0` and wrong in 4 ways: hooks/policies are NOT on the root export (use `/hooks`, `/policies` subpaths), hook signature is 2-arg `(params, method)` not 3-arg, `BaseTransactionTool` does not exist in 4.0.0, and `HederaLangchainToolkit` is a separate package. Full verified reference: `~/clawd/memory/2026-07-31-hak-v4-api-research.md`.
- HAK v4 tool fields are `method` (not `id`) and `parameters` (not `schema`); `Plugin.tools` is a **function** `(ctx) => Tool[]` and `Plugin` has no `id`/`policies`. Policies register on `configuration.context.hooks`.
- `BaseTool.shouldSecondaryAction()` **defaults to `true`** — always override to `false` for non-transaction tools, and never override `execute()` (it drives the hooks).
- Do NOT add a blanket `protobufjs` override: legacy `@hashgraph/sdk` v2 exact-pins 7.5.4 while `@hiero-ledger/sdk` resolves 8.6.6 in its own subtree; forcing one version breaks `npm ls`.
- **`@hiero-ledger/sdk` `addTokenTransfer` takes `bigint` directly** — `amount: number | Long | BigNumber | bigint` on `AbstractTokenTransferTransaction`. Do NOT reach for `Long.fromString()`: `Long` is a UMD global in the SDK's type surface and referencing it in an ESM module is a `TS2686` build error that tests will not catch (vitest transpiles without typecheck — always run `npm run build` too).
- Quote trust boundary lives in `src/quotes/`. `BrokerDeps.quoteVerifier` is **required** by design so no broker can skip the gate. Two distinct checks needed: `quoteHashBinding` (identity) and `requirementConsistent` (terms) — the core hash excludes `paymentRequirement`, so binding alone cannot catch a price contradiction between `pricing` and `paymentRequirement`.
