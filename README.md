# Hedron

**Hedera-native Agentic Commerce SDK (Hedron by Glorian Labs)**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Hedera](https://img.shields.io/badge/Hedera-Testnet-green.svg)](https://hedera.com)

Hedron is a Hedera-native SDK for agentic commerce. It enables autonomous agents to negotiate, request and settle payments, and generate verifiable receipts with auditable trails on Hedera.

---

## 🌟 Vision

Hedron's long-term product vision is a **Router/Broker** layer for autonomous commerce:

- **Discovery**: list agents, capabilities, and pricing
- **Negotiation**: request -> quote -> proposal
- **Policy & Safety**: approvals, allowlists, spending/rate limits
- **Settlement**: collect payment and trigger execution
- **Proof**: emit HCS audit trails + final receipt verification

---

## 🏆 Recognition

“We’re honored that Hedron — an autonomous agent ecosystem built on the Hedera Hashgraph stack — was recognized as a Top 3 winner in the AI & DePIN track at the Hedera Africa Hackathon. This grant accelerates our mission to power the emerging agent economy, enabling autonomous agents to coordinate, negotiate, establish trust, transact, and build real economic value on-chain.”

---

## 🚀 Key Features

- **Router/Broker-ready architecture** for agent discovery, negotiation, execution, and proof
- **Hedera-first verifiability** with HCS-based event trails and receipt-oriented settlement
- **Multi-protocol agent communication** with A2A, AP2, and x402 integration points
- **Policy-driven execution controls** including approvals, limits, and safe retries
- **Cross-network settlement support** for HBAR-native and EVM-based payment flows
- **Production SDK ergonomics** with typed modules, docs, tests, and reusable demos

---

## 🏗️ Architecture

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

## ⚡ Quick Start

```bash
git clone https://github.com/Hebx/hedron.git
cd hedron
npm install
cp env.example .env
npm run build
```

Run a complete orchestrated flow:

```bash
npm run demo
```

---

## 📚 Documentation

- **[SDK README](./SDK_README.md)** - SDK installation and usage
- **[Usage Guide](./docs/USAGE_GUIDE.md)** - integration walkthroughs
- **[API Reference](./docs/API_REFERENCE.md)** - full API surface
- **[Roadmap & Real-World Adoption](./docs/ROADMAP.md)** - Activation, Milestone, Scale
- **[Showcase: Hackathon Submission + Demos + Feature Matrix](./docs/SHOWCASE.md)** - consolidated demo/submission document
- **[Real-World SDK Use Cases](./docs/REAL_WORLD_USE_CASES.md)** - applied production scenarios
- **[Docs Index](./docs/INDEX.md)** - full documentation map
- **[Hackathon Archive](./docs/HACKATHON_ARCHIVE.md)** - separate branch and historical context

---

## 📦 Project Structure

```text
hedron/
├── src/                 # SDK source: agents, protocols, services, facilitator
├── contracts/           # Solidity contracts
├── scripts/             # deployment and maintenance scripts
├── tests/               # unit, integration, e2e
├── demo/                # runnable demo workflows
├── docs/                # documentation and roadmap/showcase pages
├── SDK_README.md        # SDK-focused guide
└── README.md            # project overview
```

---

## 🤝 Contributing

See **[CONTRIBUTING.md](./CONTRIBUTING.md)** for contribution workflow and PR expectations.

## 🔐 Security

See **[SECURITY.md](./SECURITY.md)** for vulnerability reporting and disclosure policy.

## 📄 License

This project is licensed under the **[MIT License](./LICENSE)**.

---

**Hedron** - _Autonomous agents, intelligent decisions, seamless settlements._
