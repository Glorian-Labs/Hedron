# Quickstart

> Estimated time: 2 minutes for the mocked demo, 10 minutes for the testnet demo.

## Requirements

- Node.js 20+
- npm 10+
- (Testnet demo only) A Hedera testnet account from <https://portal.hedera.com>

## Install

```bash
git clone https://github.com/Glorian-Labs/Hedron.git
cd Hedron
npm install
cp .env.example .env
```

`.env.example` has placeholders for every variable Hedron understands. The mocked demo works without filling any in.

## Mocked local demo

```bash
npm run demo:local
```

What it does:

1. Boots an in-memory registry with three example agents.
2. Sends an `IntentRequest` through the Router.
3. Collects mocked `QuoteResponse`s.
4. Runs the policy engine — the demo policy denies any quote > 5 HBAR and requires approval > 2 HBAR.
5. Approves the chosen quote (auto-approved in mock mode).
6. Runs a mocked HBAR settlement.
7. Executes the provider agent (returns a deterministic stub result).
8. Issues a `VerifiableReceipt` and prints its `verifyReceipt(...)` result.

You should see, near the end:

```
✔ schema           ok
✔ signature        ok
✔ chainIntegrity   ok
✔ anchoring        ok
✔ policyConsistent ok
✔ status           ok
Receipt verified: receiptId=…
```

No HCS calls are made in mock mode. The chain is computed locally with the same canonical-encoding rules as `docs/HCS_RECEIPTS.md` so the verifier path is real.

## Optional Hedera testnet demo

1. Edit `.env`:

   ```env
   HEDERA_NETWORK=testnet
   HEDERA_OPERATOR_ID=0.0.xxxxx
   HEDERA_OPERATOR_KEY=<your-testnet-operator-private-key>
   RUN_HEDERA_INTEGRATION=true
   ```

2. Run:

   ```bash
   npm run demo:testnet
   ```

3. The first run provisions an HCS topic and writes its id back into your local `.env`. Subsequent runs reuse the topic.

4. At the end, the verifier reads the topic from a public Hedera mirror and checks the receipt against on-chain events. The printed HashScan link points to the topic so you can inspect the flow visually.

The testnet demo costs only HCS submit fees (fractions of a cent). It does not settle real value unless you explicitly enable an HBAR transfer rail.

## Running the test suite

```bash
npm run typecheck
npm run lint
npm run test           # = test:unit
npm run test:contracts # Hardhat
```

`npm run test:integration` is opt-in:

```bash
RUN_HEDERA_INTEGRATION=true npm run test:integration
```

CI runs the unit, lint, typecheck, and contract paths only. Integration tests never run in CI by default.

## Next steps

- [`ARCHITECTURE.md`](ARCHITECTURE.md) — components and lifecycle
- [`ROUTER_BROKER.md`](ROUTER_BROKER.md) — the commerce loop in detail
- [`HEDERA_AGENT_KIT_PLUGIN.md`](HEDERA_AGENT_KIT_PLUGIN.md) — plug Hedron commerce into a HAK v4 agent
- [`DAYDREAMS_ADAPTER.md`](DAYDREAMS_ADAPTER.md) — wire Hedron into a Daydreams agent
