# Hedera A2A Agents - Quick Setup Guide

## 🚨 Current Issue Resolution

### Problem

```
Error: Failed to retrieve profile
ERROR [HCS-SDK] Failed to retrieve profile for account ID: 0.0.7132337
Account 0.0.7132337 does not have a valid HCS-11 memo. Current memo: HCS-11:agent-coordinator
```

### Solution

Run the fixed memo setup script:

```bash
npx tsx setup-hcs11-memo-fixed.ts
```

This will update the memo from `HCS-11:agent-coordinator` to `HCS-11:profile:agent-coordinator:v1.0`

## 🔑 Current Credentials

### Main Hedera Account

- **Account ID**: `0.0.7132337`
- **Network**: Hedera Testnet
- **Status**: ⚠️ Needs memo fix
- **HashScan**: https://hashscan.io/testnet/account/0.0.7132337

### HCS Topics

- **Main Topic**: `0.0.7132813`
- **Status**: ✅ Active
- **HashScan**: https://hashscan.io/testnet/topic/0.0.7132813

### Agent Credentials (Auto-generated)

```bash
# These are populated by register-agents.ts
ANALYZER_AGENT_ID=0.0.XXXXXXX
ANALYZER_TOPIC_ID=0.0.XXXXXXX
ANALYZER_PRIVATE_KEY=placeholder-key-for-{agentId}

VERIFIER_AGENT_ID=0.0.XXXXXXX
VERIFIER_TOPIC_ID=0.0.XXXXXXX
VERIFIER_PRIVATE_KEY=placeholder-key-for-{agentId}

SETTLEMENT_AGENT_ID=0.0.XXXXXXX
SETTLEMENT_TOPIC_ID=0.0.XXXXXXX
SETTLEMENT_PRIVATE_KEY=placeholder-key-for-{agentId}
```

## 🚀 Quick Start Commands

### 1. Fix HCS-11 Memo Issue

```bash
npx tsx setup-hcs11-memo-fixed.ts
```

### 2. Register Agents (Optional)

```bash
npx tsx setup/register-agents.ts
```

### 3. Test Agent Coordination

```bash
# Complete coordination test
npx tsx tests/e2e/test-complete-coordination.ts

# Working coordination test (bypasses HCS issues)
npx tsx tests/e2e/test-working-coordination.ts
```

## 🔧 Environment Setup

### Required Variables

```bash
# Copy from env.example
cp env.example .env

# Edit .env with your credentials
HEDERA_ACCOUNT_ID=0.0.7132337
HEDERA_PRIVATE_KEY=your_private_key_here
BASE_RPC_URL=https://sepolia.base.org
SETTLEMENT_WALLET_PRIVATE_KEY=your_ethereum_private_key
USDC_CONTRACT=0x036CbD53842c5426634e7929541eC2318f3dCF7e
MERCHANT_WALLET_ADDRESS=0x1234567890123456789012345678901234567890
```

## 📊 System Status

### Current Status

- ✅ Agent system architecture complete
- ✅ x402 payment integration working
- ✅ HCS-10 communication implemented
- ⚠️ HCS-11 memo format issue (fixable)
- ⚠️ Placeholder private keys (testing mode)

### Agent Flow

```
AnalyzerAgent → VerifierAgent → SettlementAgent
     ↓              ↓              ↓
  Query Data    Validate      Execute x402
  Create Prop   Proposal      USDC Transfer
```

## 🐛 Troubleshooting

### Common Issues

#### 1. HCS-11 Memo Error

**Error**: `Account does not have a valid HCS-11 memo`
**Fix**: Run `setup-hcs11-memo-fixed.ts`

#### 2. Placeholder Key Warnings

**Warning**: `Using placeholder private key`
**Impact**: Agents use main account fallback (expected for testing)

#### 3. HCS Send Failures

**Error**: `Failed to send message`
**Workaround**: System includes direct agent communication fallback

### Debug Commands

```bash
# Check wallet status
npx tsx check-wallet-status.ts

# Fund settlement wallet
npx tsx fund-settlement-wallet.ts

# Test direct payment
npx tsx tests/debug/test-direct-payment.ts
```

## 📈 Monitoring

### HashScan Links

- **Main Account**: https://hashscan.io/testnet/account/0.0.7132337
- **Main Topic**: https://hashscan.io/testnet/topic/0.0.7132813
- **Agent Topics**: Check .env file for individual topic IDs

### BaseScan Links

- **Base Sepolia**: https://sepolia.basescan.org
- **USDC Contract**: https://sepolia.basescan.org/address/0x036CbD53842c5426634e7929541eC2318f3dCF7e

## 🔒 Security Notes

### Current Security

- ✅ Testnet-only deployment
- ✅ Environment variable storage
- ⚠️ Placeholder keys (testing mode)
- ✅ Comprehensive error handling

### Production Requirements

1. Generate actual private keys for each agent
2. Implement proper key management
3. Add authentication mechanisms
4. Deploy to mainnet with security measures

---

**Quick Fix**: Run `npx tsx setup-hcs11-memo-fixed.ts` to resolve the HCS-11 memo issue!
