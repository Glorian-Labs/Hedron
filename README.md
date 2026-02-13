# Hedron

**Hedera-native SDK for agentic commerce -- negotiate, pay, and prove, all on-chain.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Hedera](https://img.shields.io/badge/Hedera-Testnet-green.svg)](https://hedera.com)

---

## What is Hedron?

Hedron is an open-source TypeScript SDK that lets autonomous AI agents conduct real commerce on Hedera. An agent can discover a service, request a quote, settle payment in HBAR or USDC, and produce a cryptographically verifiable receipt -- all without human intervention.

**Who is it for?** Teams building agent-to-agent marketplaces, AI-powered procurement tools, or any workflow where software agents need to spend and receive money with an auditable trail.

**What can I do in 5 minutes?** Clone the repo, set two Hedera testnet keys in `.env`, run `npm run demo`, and watch a buyer agent negotiate a price, pay, and receive a verified receipt -- logged to HCS.

---

## Why it matters

- **Agents need rails, not wallets.** LLMs can reason about purchases but have no native way to pay. Hedron provides the missing settlement + proof layer.
- **Auditability by default.** Every negotiation step and payment is anchored to Hedera Consensus Service, giving you a tamper-proof event trail.
- **Protocol-agnostic agents.** Built-in adapters for A2A, AP2, and x402 mean your agents can interoperate across ecosystems today.

---

## Key Capabilities

- **Agent discovery & negotiation** -- list agents, request quotes, accept proposals
- **Policy engine** -- approvals, allowlists, spending limits, rate limits
- **HBAR & EVM settlement** -- native HBAR transfers, EVM USDC, and x402 payment rails
- **HCS audit trails** -- every event is timestamped on Hedera Consensus Service
- **Receipt verification** -- cryptographic proof that payment occurred and service was delivered
- **Multi-protocol support** -- A2A, AP2, and x402 integration out of the box
- **Typed SDK with docs & tests** -- production ergonomics, not hackathon glue

---

## Status

| Aspect | State |
|---|---|
| SDK core (agents, settlement, HCS) | **Alpha** -- API surface may change |
| Demo flows | **Stable** -- working end-to-end on testnet |
| Smart contracts | **Experimental** -- deployed on testnet only |
| Recommended for | Prototyping, hackathons, early integration partners |

> Hedron is in active development. We welcome early adopters and contributors -- but pin to a specific commit or tag for anything beyond experimentation.

---

## Use Cases

| Flow | What happens |
|---|---|
| **Quote-to-receipt** | Buyer agent requests a quote, seller agent responds, buyer pays in HBAR, HCS logs the receipt |
| **Policy-gated spending** | Agent checks spending limits and approval rules before releasing funds |
| **HCS audit export** | Export the full negotiation + settlement trail from HCS for compliance review |
| **Trust-scored marketplace** | Agents build on-chain reputation via payment-gated trust scoring (see `ascension` branch) |
| **Cross-chain settlement** | Settle in HBAR natively or bridge to EVM USDC via x402 rails |

---

## Quick Start

```bash
git clone https://github.com/glorian-labs/hedron.git
cd hedron
npm install
cp env.example .env   # add your Hedera testnet operator ID + key
npm run build
```

## Demo

Run the full orchestrated flow -- a buyer agent negotiates, pays, and receives a verified receipt:

```bash
npm run demo
```

You will see console output showing each protocol step: discovery, quote, proposal acceptance, HBAR transfer, HCS message submission, and receipt verification.

---

## Architecture

```text
┌─────────────────────────────────────────────────────────┐
│                   Agent Network                         │
├──────────────────┬──────────────────┬──────────────────┤
│ AnalyzerAgent    │ VerifierAgent    │ SettlementAgent  │
└────────┬─────────┴─────────┬────────┴─────────┬────────┘
         │                   │                  │
         ▼                   ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│        Hedera Consensus Service (HCS) Messaging        │
└─────────────────────────────────────────────────────────┘
         │                   │                  │
         ▼                   ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│             Multi-Chain Settlement Layer               │
│           Hedera HBAR | EVM USDC | x402 Rail           │
└─────────────────────────────────────────────────────────┘
```

---

## Vision

Hedron's long-term product direction is a **Router/Broker** layer for autonomous commerce:

- **Discovery** -- list agents, capabilities, and pricing
- **Negotiation** -- request, quote, proposal
- **Policy & Safety** -- approvals, allowlists, spending and rate limits
- **Settlement** -- collect payment and trigger execution
- **Proof** -- HCS audit trails and receipt verification

---

## Documentation

- **[SDK Guide](./SDK_README.md)** -- installation and usage
- **[Usage Guide](./docs/USAGE_GUIDE.md)** -- integration walkthroughs
- **[API Reference](./docs/API_REFERENCE.md)** -- full API surface
- **[Roadmap](./docs/ROADMAP.md)** -- activation, milestones, scale
- **[Showcase](./docs/SHOWCASE.md)** -- hackathon submission, demos, feature matrix
- **[Real-World Use Cases](./docs/REAL_WORLD_USE_CASES.md)** -- applied production scenarios
- **[Docs Index](./docs/INDEX.md)** -- full documentation map

---

## Recognition

**Top 3 -- AI & DePIN track, Hedera Africa Hackathon.** The award included a grant from Hedera to accelerate development of autonomous agent commerce infrastructure.

---

## Project Structure

```text
hedron/
├── src/                 # SDK source: agents, protocols, services, facilitator
├── contracts/           # Solidity contracts
├── scripts/             # deployment and maintenance scripts
├── tests/               # unit, integration, e2e
├── demo/                # runnable demo workflows
├── docs/                # documentation, roadmap, showcase
├── SDK_README.md        # SDK-focused guide
└── README.md            # this file
```

### Branches

- `main` -- stable SDK and demo flows
- `ascension` -- TrustScore Oracle: decentralized reputation marketplace with A2A, AP2, x402, analytics, and HCS integration
- `hackathon/hedera-africa` -- submission artifacts, pitch/demo materials, grant documentation

---

## Contributing

See **[CONTRIBUTING.md](./CONTRIBUTING.md)** for workflow and PR expectations.

## Security

See **[SECURITY.md](./SECURITY.md)** for vulnerability reporting and disclosure policy.

## License

[MIT](./LICENSE)

---

**Hedron** -- _Autonomous agents, intelligent decisions, seamless settlements._
