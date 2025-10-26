# Quick Start Guide - Hedera A2A Agent System

This guide will get you up and running with the Hedera A2A Agent System in under 10 minutes.

## 🚀 Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed
- **A Hedera Testnet account** with HBAR (get from [Hedera Portal](https://portal.hedera.com/))
- **Basic familiarity** with command line tools

## ⚡ Quick Setup (5 minutes)

### Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/Hebx/hedera-a2a-agents.git
cd hedera-a2a-agents

# Install dependencies
npm install
```

### Step 2: Configure Environment

```bash
# Copy the example environment file
cp env.example .env

# Edit the .env file with your Hedera credentials
nano .env  # or use your preferred editor
```

**Required values in `.env`:**

```bash
HEDERA_ACCOUNT_ID=0.0.123456  # Your Hedera testnet account ID
HEDERA_PRIVATE_KEY=302e0201...  # Your Hedera private key (DER format)
```

### Step 3: Register Agents

```bash
# This creates agent accounts and HCS topics automatically
npx tsx setup/register-agents.ts
```

**Expected output:**

```
🚀 Starting agent registration process...
✅ Successfully parsed private key as DER encoded string
📡 Connected to Hedera testnet with account: 0.0.123456
💰 Account balance: 500.0 ℏ tinybars
🔧 Registering AnalyzerAgent...
   ✅ Created agent account: 0.0.789012
   ✅ Created inbound topic: 0.0.345678
🎉 All agents registered successfully!
```

### Step 4: Test the System

```bash
# Test individual agents
npm run test:analyzer

# Run the complete demo
npm run demo
```

**Expected demo output:**

```
🤖 Hedera A2A Agent System Demo
--- Initializing Agents ---
✓ All agents ready
--- Workflow Starting ---
🔍 Querying account: 0.0.123456
✅ Account 0.0.123456 found
💰 Balance: 3446.12525862 ℏ
📊 AnalyzerAgent proposing insight...
✓ Proposal: Meets threshold
📤 Sending analysis proposal to VerifierAgent...
✓ Analysis proposal sent to topic: 0.0.345678
--- Workflow Complete ---
```

## 🎯 What Just Happened?

The system successfully:

1. **Initialized** three autonomous agents
2. **Queried** a Hedera account for balance information
3. **Analyzed** the balance against a threshold
4. **Sent** an analysis proposal via HCS
5. **Demonstrated** the complete A2A workflow

## 🔍 Monitoring Your Agents

### HashScan Integration

After registration, you can monitor your agents on HashScan:

- **AnalyzerAgent Topic**: https://hashscan.io/testnet/topic/{ANALYZER_TOPIC_ID}
- **VerifierAgent Topic**: https://hashscan.io/testnet/topic/{VERIFIER_TOPIC_ID}
- **SettlementAgent Topic**: https://hashscan.io/testnet/topic/{SETTLEMENT_TOPIC_ID}

### Check Your .env File

Your `.env` file now contains agent credentials:

```bash
# Agent Credentials
ANALYZER_AGENT_ID=0.0.789012
ANALYZER_TOPIC_ID=0.0.345678
ANALYZER_PRIVATE_KEY=PLACEHOLDER_ANALYZER_KEY

VERIFIER_AGENT_ID=0.0.789013
VERIFIER_TOPIC_ID=0.0.345679
VERIFIER_PRIVATE_KEY=PLACEHOLDER_VERIFIER_KEY

SETTLEMENT_AGENT_ID=0.0.789014
SETTLEMENT_TOPIC_ID=0.0.345680
SETTLEMENT_PRIVATE_KEY=PLACEHOLDER_SETTLEMENT_KEY
```

## 🛠️ Next Steps

### 1. Explore Individual Agents

```bash
# Test each agent individually
npm run test:analyzer    # Queries account data
npm run test:verifier    # Listens for proposals
npm run test:settlement  # Listens for approvals
```

### 2. Customize the Demo

```bash
# Run demo with custom account and threshold
npm run demo -- 0.0.123456 100
```

### 3. Add Settlement Configuration

To enable actual payments, add to your `.env`:

```bash
# Settlement Configuration
BASE_RPC_URL=https://sepolia.base.org
SETTLEMENT_WALLET_PRIVATE_KEY=0x...
USDC_CONTRACT=0x036CbD53842c5426634e7929541eC2318f3dCF7e
MERCHANT_WALLET_ADDRESS=0x...
```

### 4. Programmatic Usage

```typescript
import { AnalyzerAgent } from "./src/agents/AnalyzerAgent";

const analyzer = new AnalyzerAgent();
await analyzer.init();

// Query any Hedera account
const accountData = await analyzer.queryAccount("0.0.123456");
console.log("Balance:", accountData.balance);
```

## 🚨 Troubleshooting

### Common Issues

#### "Missing required environment variables"

- Ensure your `.env` file exists and contains `HEDERA_ACCOUNT_ID` and `HEDERA_PRIVATE_KEY`

#### "Invalid private key format"

- Use DER encoded format: `302e020100300506032b657004220420...`
- Ensure no extra whitespace or characters

#### "Account does not have sufficient balance"

- Get more HBAR from [Hedera Portal](https://portal.hedera.com/) or Discord faucet

#### "Failed to retrieve profile"

- This is a known issue with HCS-10 library
- Agents still function correctly despite the warning

### Getting Help

- **Documentation**: [System Documentation](docs/SYSTEM_DOCUMENTATION.md)
- **Issues**: [GitHub Issues](https://github.com/Hebx/hedera-a2a-agents/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Hebx/hedera-a2a-agents/discussions)

## 🎉 Success!

You've successfully set up the Hedera A2A Agent System! The agents are now:

- ✅ **Registered** on Hedera testnet
- ✅ **Communicating** via HCS topics
- ✅ **Processing** account data autonomously
- ✅ **Ready** for custom implementations

## 📚 Further Reading

- **[System Documentation](docs/SYSTEM_DOCUMENTATION.md)**: Complete technical guide
- **[Architecture Guide](Architecture.md)**: Detailed system architecture
- **[API Reference](docs/SYSTEM_DOCUMENTATION.md#api-reference)**: Method documentation
- **[Security Guide](docs/SYSTEM_DOCUMENTATION.md#security)**: Security best practices

---

**Ready to build the future of decentralized agent systems! 🚀**
