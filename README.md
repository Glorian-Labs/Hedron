# Hedron

**Autonomous Agent Ecosystem on Hedera Hashgraph**

Hedron is a complete implementation of autonomous agent-to-agent systems built on the Hedera network. It combines Google's A2A Protocol, x402 Payment Standard, and Hedera Consensus Service (HCS) to enable truly autonomous, multi-protocol agent communication and settlement.

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

Hedron is a **multi-protocol autonomous agent framework** that enables:

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

## ⚡ Quick Start

### Installation

```bash
# Clone repository
git clone https://github.com/Hebx/hedera-a2a-agents.git
cd hedera-a2a-agents

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

### Run Demos

```bash
# Bounty 1: x402 Payment Standard
npm run demo:nft-royalty 150    # Cross-chain royalty (USDC on Base)
npm run demo:hbar-x402 10       # Native HBAR settlement

# Bounty 2: Hedera Agent Kit
npm run demo:invoice-llm        # LLM-powered invoice validation
npm run demo:supply-chain-fraud # Fraud detection + memo verification

# Supporting demos
npm run demo                    # Complete 3-agent workflow
npm run demo:invoice            # Invoice automation
npm run demo:negotiation        # Supply chain negotiation
```

---

## 📚 Documentation

### Bounty Submissions

- [Bounty 1: Hedera x402 Payment Standard](./docs/BOUNTY_1_HEDERA_X402_STANDARD.md) - Cross-chain payment protocol
- [Bounty 2: Hedera Agent Kit](./docs/BOUNTY_2_HEDERA_AGENT_KIT.md) - Autonomous agent systems
- [Bounties Comparison](./docs/BOUNTIES_COMPARISON.md) - Side-by-side comparison

### Core Documentation

- [Complete Documentation Index](./docs/INDEX.md) - All available documentation
- [API Reference](./docs/API_REFERENCE.md) - Complete API documentation
- [A2A Protocol Implementation](./docs/A2A_PROTOCOL_IMPLEMENTATION.md) - Agent communication
- [Human-in-the-Loop Mode](./docs/HUMAN_IN_THE_LOOP.md) - HITL configuration
- [Smart Contract Deployment](./docs/SMART_CONTRACT_DEPLOYMENT.md) - Contract deployment

### Setup Guides

- [HCS-11 Setup Guide](./docs/HCS11_SETUP_GUIDE.md) - Profile registration
- [Local HCS Resolver](./docs/LOCAL_HCS_RESOLVER.md) - Local profile resolver
- [Hackathon Ready](./docs/HACKATHON_READY.md) - Submission checklist

### Usage & Demos

- [Usage Guide](./docs/USAGE_GUIDE.md) - How to use Hedron
- [Demo Guide](./demo/README.md) - Demo showcase guide
- [Hackathon Showcase](./docs/HACKATHON_SHOWCASE_GUIDE.md) - Presentation guide

---

## 🧪 Testing

### Run All Tests

```bash
npm run test:all  # Unit + Integration tests
```

See [Test Status](./docs/TEST_STATUS.md) for detailed results.

### Test Coverage

- **Unit Tests**: Agent logic, protocol implementations
- **Integration Tests**: Cross-protocol workflows, payment flows
- **E2E Tests**: Complete agent coordination (requires HCS-11 setup)

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
npm run build
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

## 📦 Project Structure

```
hedron/
├── src/
│   ├── agents/              # Agent implementations
│   ├── protocols/           # A2A, AP2, x402 protocols
│   ├── facilitator/         # x402 facilitator server
│   ├── modes/              # Human-in-the-loop
│   └── services/            # Token services
├── contracts/              # Solidity smart contracts
├── tests/                  # Test suite (unit, integration, e2e)
├── demo/                   # Showcase demos
└── docs/                   # Complete documentation
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

---

## 📖 Learn More

- [Documentation Index](./docs/INDEX.md) - Browse all documentation
- [API Reference](./docs/API_REFERENCE.md) - Complete API docs
- [Usage Guide](./docs/USAGE_GUIDE.md) - How to use Hedron
- [Bounty Guides](./docs/BOUNTY_1_HEDERA_X402_STANDARD.md) - Bounty details

---

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines in the documentation.

---

## 📄 License

ISC License - see LICENSE file for details.

---

## 🏆 Built For

- **Hedera x402 Payment Standard Bounty** - Cross-chain payment protocol
- **Hedera Agent Kit Bounty** - Autonomous agent systems

---

**Hedron** - _Autonomous agents, intelligent decisions, seamless settlements._
