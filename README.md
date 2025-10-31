# Hedron

**Autonomous Agent Ecosystem SDK for Hedera Hashgraph**

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Hedera](https://img.shields.io/badge/Hedera-Testnet-green.svg)](https://hedera.com)

Hedron is a complete SDK and framework for building autonomous agent-to-agent systems on the Hedera network. It combines Google's A2A Protocol, x402 Payment Standard, and Hedera Consensus Service (HCS) to enable truly autonomous, multi-protocol agent communication and settlement.

---

## 🌟 Vision

**Hedron** envisions a future where autonomous agents orchestrate complex workflows across blockchain networks—negotiating contracts, processing payments, detecting fraud, and making intelligent decisions—all without human intervention.

Our ecosystem integrates:

- **AP2 Protocol** - Agent-to-agent payment negotiations
- **A2A Protocol** - Standardized agent communication
- **x402 Payment Standard** - Autonomous cross-chain settlements
- **Hedera HCS** - Decentralized messaging infrastructure

---

## 🎯 What Is Hedron?

Hedron is both a **production-ready SDK** and a **complete framework** that enables:

### 🔄 Autonomous Workflows

- **Agent Negotiation**: Buyers and sellers negotiate terms autonomously
- **Intelligent Verification**: LLM-powered decision making and fraud detection
- **Automated Settlement**: Cross-chain payments executed without intermediaries

### 🌐 Multi-Chain Support

- **Hedera Network**: Native HBAR transfers, HCS messaging, fast finality
- **EVM Chains**: USDC on Base, Ethereum, or any EVM-compatible network
- **Cross-Chain**: Seamless settlements across networks

### 🤖 Smart Agents

- **AnalyzerAgent**: Queries account data, generates insights, proposes actions
- **VerifierAgent**: Validates proposals, applies business rules, makes decisions
- **SettlementAgent**: Executes payments via x402, records settlements on-chain
- **IntelligentVerifierAgent**: AI-powered validation with GPT-4 reasoning

---

## 📦 SDK Installation

Hedron is available as an npm package for easy integration into your projects.

### Install

```bash
npm install hedron-agent-sdk
```

### Quick Start

```typescript
import { 
  AnalyzerAgent, 
  VerifierAgent, 
  SettlementAgent,
  A2AProtocol 
} from 'hedron-agent-sdk'

// Initialize an agent
const agent = new AnalyzerAgent()
await agent.init()

// Query account data
const accountInfo = await agent.queryAccount('0.0.123456')
```

### SDK Documentation

- **[SDK README](./SDK_README.md)** - Complete SDK installation and usage guide
- **[API Reference](./docs/API_REFERENCE.md)** - Full API documentation
- **[Usage Guide](./docs/USAGE_GUIDE.md)** - Integration examples

---

## 🎬 Demos & Examples

Hedron includes comprehensive demos showcasing real-world use cases with actual blockchain transactions.

### Bounty 1: x402 Payment Standard Demos

#### NFT Royalty Payment (Cross-Chain x402)
```bash
npm run demo:nft-royalty 150
```

**Demonstrates:**
- NFT sale simulation ($150)
- Automatic 10% royalty calculation ($15)
- Cross-chain x402 payment execution
- USDC transfer on Base Sepolia
- Complete payment receipt

**Network:** Base Sepolia | **Asset:** USDC | **Protocol:** x402

#### HBAR Direct Transfer (Native x402)
```bash
npm run demo:hbar-x402 10
```

**Demonstrates:**
- Direct Hedera HBAR transfer
- x402 verification on native Hedera
- Fast, low-cost settlement
- Payment authorization and settlement

**Network:** Hedera Testnet | **Asset:** HBAR | **Protocol:** x402

### Bounty 2: Hedera Agent Kit Demos

#### Intelligent Invoice with LLM Reasoning
```bash
npm run demo:invoice-llm
```

**Demonstrates:**
- LLM-powered invoice validation (GPT-4)
- AI decision making with reasoning
- Autonomous approval/rejection
- Hedera token settlement
- Complete agent coordination workflow

**Technology:** LLM + A2A Protocol | **Network:** Hedera Testnet | **Asset:** HBAR

#### Supply Chain Fraud Detection
```bash
npm run demo:supply-chain-fraud
```

**Demonstrates:**
- Multi-agent price negotiation
- AI fraud detection algorithms
- Blockchain memo verification
- Hedera token settlement
- Complete security workflow

**Technology:** Fraud Detection + Memo Verification + A2A | **Network:** Hedera Testnet | **Asset:** HBAR

### Additional Supporting Demos

```bash
npm run demo                    # Complete 3-agent workflow
npm run demo:invoice            # Invoice automation
npm run demo:negotiation        # Supply chain negotiation
npm run demo:rwa-invoice        # Tokenized RWA invoice demo
```

### Demo Documentation

- **[Demo Guide](./demo/README.md)** - Complete demo showcase guide
- **[Bounty 1 Details](./docs/BOUNTY_1_HEDERA_X402_STANDARD.md)** - x402 implementation
- **[Bounty 2 Details](./docs/BOUNTY_2_HEDERA_AGENT_KIT.md)** - Agent Kit implementation

---

## 🏆 Hackathon Submission

Hedron was built for the **Hedera Africa Hackathon**, implementing both bounties with production-ready code:

- ✅ **Bounty 1: Hedera x402 Payment Standard SDK** - Complete cross-chain payment protocol
- ✅ **Bounty 2: Hedera Agent Kit & Google A2A Protocol** - Autonomous agent systems with AI-powered decision making

### Quick Hackathon Overview

**What We Built:**
- 80+ files of production-ready code
- 11 passing tests (unit, integration, e2e)
- 7 working demos with real blockchain transactions
- 21+ comprehensive documentation files
- 2 deployed smart contracts

**Key Highlights:**
- First x402 implementation connecting Hedera and Base
- LLM reasoning for autonomous invoice validation
- Fraud detection with blockchain memo verification
- Multi-protocol agent communication (A2A, AP2, x402)

📖 **[Read Complete Hackathon README](./HACKATHON_README.md)** for full submission details, setup instructions, and demo walkthroughs.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Agent Network                          │
├──────────────────┬──────────────────┬──────────────────┤
│ AnalyzerAgent    │  VerifierAgent   │ SettlementAgent  │
│                  │                  │                  │
│ • Query Data     │ • Validate       │ • x402 Payments  │
│ • Generate       │ • Approve/Reject │ • Cross-Chain    │
│   Proposals      │ • AI Reasoning   │ • Settlement     │
└────────┬─────────┴─────────┬─────────┴─────────┬────────┘
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────────┐
│      Hedera Consensus Service (HCS) Messaging          │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐         │
│  │ Analyzer │  │ Verifier │  │ Settlement   │         │
│  │ Topic    │  │ Topic    │  │ Topic        │         │
│  └──────────┘  └──────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────┘
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────────┐
│            Multi-Chain Settlement Layer                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐         │
│  │ Hedera   │  │ Base     │  │ x402         │         │
│  │ HBAR     │  │ USDC     │  │ Protocol     │         │
│  └──────────┘  └──────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────┘
```

---

## 💡 Use Cases

Hedron enables autonomous systems across multiple industries:

### 🧾 Invoice Automation

- **Autonomous Processing**: AI analyzes invoices, validates business rules, and approves payments
- **Fraud Detection**: ML algorithms flag suspicious transactions
- **Instant Settlement**: Automated USDC or HBAR transfers

### 📦 Supply Chain

- **Agent Negotiation**: Buyer and vendor agents negotiate terms autonomously
- **Agreement Recording**: Smart contracts record finalized terms on Hedera
- **Automated Payments**: x402 protocol executes settlements

### 🎨 NFT Royalties

- **Automatic Calculation**: 10% royalty calculated on each NFT sale
- **Cross-Chain Payments**: Creators receive USDC on preferred network
- **Transparent Trail**: All payments recorded on blockchain

### 💰 Financial Services

- **Autonomous Trading**: Agents execute trades based on market conditions
- **Risk Management**: AI evaluates risk and makes decisions
- **Multi-Asset Settlement**: USDC, HBAR, or any supported token

### 🔒 Security & Compliance

- **Fraud Detection**: AI analyzes transaction patterns
- **Memo Verification**: Blockchain-verified agreement recording
- **Audit Trails**: Complete transparency via HCS

---

## ⚡ Quick Start (Development)

### Installation

```bash
# Clone repository
git clone https://github.com/Hebx/hedron.git
cd hedron

# Install dependencies
npm install

# Configure environment
cp env.example .env
# Edit .env with your credentials

# Setup HCS-11 profile
npm run setup:hcs11-fixed
```

### Configuration

Configure your `.env` file with:

- Hedera testnet account ID and private key
- Base Sepolia wallet with USDC
- Agent credentials (auto-generated)
- Payment network preference

See [Environment Setup](./docs/HCS11_SETUP_GUIDE.md) for detailed instructions.

---

## 🧪 Testing

### Run All Tests

```bash
npm run test:all  # Unit + Integration + E2E tests
```

### Test Coverage

- **Unit Tests**: Agent logic, protocol implementations
- **Integration Tests**: Cross-protocol workflows, payment flows
- **E2E Tests**: Complete agent coordination (requires HCS-11 setup)

**Status:** ✅ All tests passing

---

## 🌍 Network Support

### Hedera Networks

- **Testnet**: Primary development environment
- **Mainnet**: Production deployments

### EVM Networks

- **Base Sepolia**: Primary settlement network for USDC
- **Ethereum Sepolia**: Alternative network
- **Any EVM**: Compatible with any EVM-compatible chain

---

## 🔧 Development

### Build

```bash
npm run build  # Build SDK and source code
```

### Deploy Contracts

```bash
npm run deploy:simple        # Simple supply chain
npm run deploy:supply-chain  # Advanced supply chain
```

### Check Status

```bash
npm run check:credentials    # Verify configuration
npm run check:wallets        # Check wallet status
```

---

## 📚 Documentation

### SDK Documentation

- **[SDK README](./SDK_README.md)** - SDK installation and usage
- **[API Reference](./docs/API_REFERENCE.md)** - Complete API documentation
- **[Usage Guide](./docs/USAGE_GUIDE.md)** - How to use Hedron

### Bounty Submissions

- [Bounty 1: Hedera x402 Payment Standard](./docs/BOUNTY_1_HEDERA_X402_STANDARD.md) - Cross-chain payment protocol
- [Bounty 2: Hedera Agent Kit](./docs/BOUNTY_2_HEDERA_AGENT_KIT.md) - Autonomous agent systems
- [Bounties Comparison](./docs/BOUNTIES_GUIDE.md) - Side-by-side comparison

### Core Documentation

- [Complete Documentation Index](./docs/INDEX.md) - All available documentation
- [A2A Protocol Implementation](./docs/A2A_PROTOCOL_IMPLEMENTATION.md) - Agent communication
- [Human-in-the-Loop Mode](./docs/HUMAN_IN_THE_LOOP.md) - HITL configuration
- [Smart Contract Deployment](./docs/SMART_CONTRACT_DEPLOYMENT.md) - Contract deployment

### Setup Guides

- [HCS-11 Setup Guide](./docs/HCS11_SETUP_GUIDE.md) - Profile registration
- [Local HCS Resolver](./docs/LOCAL_HCS_RESOLVER.md) - Local profile resolver
- [Hackathon Ready](./docs/HACKATHON_READY.md) - Submission checklist

---

## 📦 Project Structure

```
hedron/
├── src/
│   ├── agents/              # Agent implementations (SDK)
│   ├── protocols/           # A2A, AP2, x402 protocols (SDK)
│   ├── facilitator/         # x402 facilitator server (SDK)
│   ├── modes/              # Human-in-the-loop (SDK)
│   ├── services/           # Token services (SDK)
│   └── utils/              # Utility functions (SDK)
├── contracts/              # Solidity smart contracts
├── tests/                  # Test suite (unit, integration, e2e)
├── demo/                   # Showcase demos
├── docs/                   # Complete documentation
├── dist/                   # Built SDK files
├── SDK_README.md          # SDK-specific documentation
├── HACKATHON_README.md    # Hackathon submission details
└── README.md              # This file
```

---

## 🚀 Key Features

### ✅ Multi-Protocol Support

- A2A for standardized communication
- AP2 for payment negotiations
- x402 for autonomous settlements
- HCS for decentralized messaging

### ✅ Intelligent Agents

- AI-powered decision making
- Fraud detection algorithms
- Risk assessment
- Business rule validation

### ✅ Cross-Chain Capabilities

- USDC on Base/Ethereum
- HBAR on Hedera
- Automatic network selection
- Seamless bridging

### ✅ Production Ready

- Error handling
- Human-in-the-loop (HITL)
- Complete audit trails
- Security best practices

### ✅ SDK Ready

- npm package available
- TypeScript definitions
- Modular exports
- Optional environment configuration

---

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines in the documentation.

---

## 📄 License

ISC License - see LICENSE file for details.

---

## 🔗 Links

- **GitHub Repository**: [github.com/Hebx/hedron](https://github.com/Hebx/hedron)
- **Issues**: [GitHub Issues](https://github.com/Hebx/hedron/issues)
- **Documentation**: See `docs/` directory
- **SDK Package**: `hedron-agent-sdk` on npm

---

## 🏆 Built For

- **Hedera x402 Payment Standard Bounty** - Agentic Cross-chain payment protocol
- **Hedera Agent Kit Bounty** - Autonomous agent systems and protocols
- **Hedera Africa Hackathon** - Complete submission with both bounties

---

**Hedron** - _Autonomous agents, intelligent decisions, seamless settlements._
