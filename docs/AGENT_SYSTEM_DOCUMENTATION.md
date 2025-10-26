# Hedera A2A Agents System Documentation

## Overview

The Hedera A2A (Agent-to-Agent) system is a decentralized autonomous agent coordination platform built on Hedera Consensus Service (HCS) and Ethereum-compatible networks. The system enables three specialized agents to coordinate payment settlements using the x402 payment protocol.

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  AnalyzerAgent  │───▶│  VerifierAgent  │───▶│ SettlementAgent │
│                 │    │                 │    │                 │
│ • Queries data  │    │ • Validates     │    │ • Executes      │
│ • Creates       │    │ • Approves/     │    │   x402 payments │
│   proposals     │    │   Rejects      │    │ • USDC transfers│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   HCS Topics    │
                    │                 │
                    │ • Communication │
                    │ • Coordination  │
                    │ • State sync    │
                    └─────────────────┘
```

## Agent Credentials and Configuration

### Main Hedera Account

- **Account ID**: `0.0.7132337`
- **Network**: Hedera Testnet
- **Current Issue**: HCS-11 memo format needs to be fixed
- **Current Memo**: `HCS-11:agent-coordinator` (❌ Invalid format)
- **Required Memo**: `HCS-11:profile:agent-coordinator:v1.0` (✅ Valid format)

### Agent Credentials (Auto-generated)

The system automatically generates credentials for each agent during registration:

#### AnalyzerAgent

- **Agent ID**: `0.0.XXXXXXX` (Generated during registration)
- **Topic ID**: `0.0.XXXXXXX` (Generated during registration)
- **Private Key**: `placeholder-key-for-{agentId}` (Placeholder - needs actual key)
- **Status**: ⚠️ Using main account fallback

#### VerifierAgent

- **Agent ID**: `0.0.XXXXXXX` (Generated during registration)
- **Topic ID**: `0.0.XXXXXXX` (Generated during registration)
- **Private Key**: `placeholder-key-for-{agentId}` (Placeholder - needs actual key)
- **Status**: ⚠️ Using main account fallback

#### SettlementAgent

- **Agent ID**: `0.0.XXXXXXX` (Generated during registration)
- **Topic ID**: `0.0.XXXXXXX` (Generated during registration)
- **Private Key**: `placeholder-key-for-{agentId}` (Placeholder - needs actual key)
- **Status**: ⚠️ Using main account fallback

### HCS Topics

- **Topic 0.0.7132813**: Main coordination topic
- **Status**: Active on HashScan
- **Purpose**: Agent-to-agent communication

## Current Issues and Solutions

### Issue 1: HCS-11 Memo Error

**Error**: `Account 0.0.7132337 does not have a valid HCS-11 memo. Current memo: HCS-11:agent-coordinator`

**Root Cause**: The HCS-11 standard requires a specific memo format for profile retrieval.

**Solution**: Run the fixed memo setup script:

```bash
npx tsx setup-hcs11-memo-fixed.ts
```

This will update the memo to: `HCS-11:profile:agent-coordinator:v1.0`

### Issue 2: Placeholder Private Keys

**Problem**: Agent registration creates placeholder private keys instead of actual keys.

**Current Workaround**: Agents fall back to using the main Hedera account credentials.

**Impact**: All agents effectively use the same account, which works for testing but isn't ideal for production.

## Environment Configuration

### Required Environment Variables

```bash
# Main Hedera Account
HEDERA_ACCOUNT_ID=0.0.7132337
HEDERA_PRIVATE_KEY=your_private_key_here

# Agent Credentials (Auto-populated by register-agents.ts)
ANALYZER_AGENT_ID=0.0.XXXXXXX
ANALYZER_TOPIC_ID=0.0.XXXXXXX
ANALYZER_PRIVATE_KEY=placeholder-key-for-{agentId}

VERIFIER_AGENT_ID=0.0.XXXXXXX
VERIFIER_TOPIC_ID=0.0.XXXXXXX
VERIFIER_PRIVATE_KEY=placeholder-key-for-{agentId}

SETTLEMENT_AGENT_ID=0.0.XXXXXXX
SETTLEMENT_TOPIC_ID=0.0.XXXXXXX
SETTLEMENT_PRIVATE_KEY=placeholder-key-for-{agentId}

# Settlement Configuration
BASE_RPC_URL=https://sepolia.base.org
SETTLEMENT_WALLET_PRIVATE_KEY=your_ethereum_private_key
USDC_CONTRACT=0x036CbD53842c5426634e7929541eC2318f3dCF7e
MERCHANT_WALLET_ADDRESS=0x1234567890123456789012345678901234567890
```

## Setup Instructions

### Step 1: Fix HCS-11 Memo Issue

```bash
# Run the fixed memo setup script
npx tsx setup-hcs11-memo-fixed.ts
```

### Step 2: Register Agents (Optional - for testing)

```bash
# Register agents with HCS-10
npx tsx setup/register-agents.ts
```

### Step 3: Run Agent Coordination Test

```bash
# Test complete agent coordination
npx tsx tests/e2e/test-complete-coordination.ts

# Or test with working HCS bypass
npx tsx tests/e2e/test-working-coordination.ts
```

## Agent Communication Flow

### 1. AnalyzerAgent

- **Purpose**: Analyzes account data and creates proposals
- **Input**: Account ID to analyze
- **Output**: Analysis proposal with threshold validation
- **HCS Topic**: Sends to VerifierAgent topic

### 2. VerifierAgent

- **Purpose**: Validates proposals and makes approval decisions
- **Input**: Analysis proposal from AnalyzerAgent
- **Output**: Verification result (approved/rejected)
- **HCS Topic**: Sends to SettlementAgent topic

### 3. SettlementAgent

- **Purpose**: Executes x402 payments and USDC transfers
- **Input**: Approved verification result
- **Output**: Settlement completion with transaction hash
- **HCS Topic**: Broadcasts settlement completion

## x402 Payment Protocol Integration

### Payment Requirements

```typescript
const requirements = {
  scheme: "exact",
  network: "base-sepolia",
  asset: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // USDC
  payTo: "0x1234567890123456789012345678901234567890", // Merchant
  maxAmountRequired: "1000000", // 1 USDC (6 decimals)
  resource: "/agent-settlement",
  description: "A2A agent settlement",
  mimeType: "application/json",
  maxTimeoutSeconds: 120,
};
```

### Payment Flow

1. **Create Authorization**: SettlementAgent creates payment authorization
2. **Verify Payment**: X402FacilitatorServer validates the payment
3. **Settle Payment**: Execute actual USDC transfer on Base Sepolia
4. **Record Settlement**: Broadcast completion via HCS

## Monitoring and Debugging

### HashScan Links

- **Main Topic**: https://hashscan.io/testnet/topic/0.0.7132813
- **Agent Topics**: Check individual agent topic IDs in .env file

### BaseScan Links

- **Base Sepolia**: https://sepolia.basescan.org
- **USDC Contract**: https://sepolia.basescan.org/address/0x036CbD53842c5426634e7929541eC2318f3dCF7e

### Debug Commands

```bash
# Check account status
npx tsx check-wallet-status.ts

# Fund settlement wallet
npx tsx fund-settlement-wallet.ts

# Test direct payment
npx tsx tests/debug/test-direct-payment.ts
```

## Troubleshooting

### Common Issues

#### 1. "Failed to retrieve profile" Error

**Solution**: Run `setup-hcs11-memo-fixed.ts` to fix the memo format.

#### 2. "Account does not have a valid HCS-11 memo" Error

**Solution**: Ensure the memo follows the format: `HCS-11:profile:{identifier}:{version}`

#### 3. Placeholder Private Key Warnings

**Impact**: Agents fall back to main account - this is expected behavior for testing.

#### 4. HCS Message Send Failures

**Workaround**: The system includes fallback mechanisms for direct agent communication.

### Error Recovery

1. **HCS Issues**: System falls back to direct agent method calls
2. **Payment Failures**: SettlementAgent includes comprehensive error handling
3. **Network Issues**: All agents include retry mechanisms

## Security Considerations

### Current Security Status

- ✅ Private keys stored in environment variables
- ✅ Testnet-only deployment
- ⚠️ Placeholder keys in use (testing mode)
- ✅ Proper error handling and validation

### Production Recommendations

1. Generate actual private keys for each agent
2. Implement proper key management
3. Add authentication and authorization
4. Deploy to mainnet with proper security measures

## API Reference

### AnalyzerAgent Methods

- `init()`: Initialize agent and verify account access
- `queryAccount(accountId)`: Query account information
- `queryAccountViaMirror(accountId)`: Query via mirror node

### VerifierAgent Methods

- `init()`: Initialize agent and start message polling
- `onMessage(type, handler)`: Register custom message handlers
- `validateProposal(proposal)`: Validate analysis proposals

### SettlementAgent Methods

- `init()`: Initialize agent and start message polling
- `triggerSettlement(verification)`: Trigger settlement execution
- `executeSettlement(verification)`: Execute x402 payment flow

## Development Notes

### Current Limitations

1. All agents use the same Hedera account (due to placeholder keys)
2. HCS-11 memo format was incorrect (now fixed)
3. Agent registration doesn't capture actual private keys

### Future Improvements

1. Implement proper agent key generation
2. Add agent authentication mechanisms
3. Enhance error handling and recovery
4. Add comprehensive logging and monitoring

## Support and Maintenance

### Logs and Monitoring

- All agents include comprehensive logging
- HCS message polling every 5 seconds
- Error handling with fallback mechanisms

### Maintenance Tasks

1. Monitor HCS topic activity
2. Check agent account balances
3. Verify settlement wallet funding
4. Review error logs for issues

---

**Last Updated**: 2025-01-26
**Version**: 1.0.0
**Status**: Testing Phase (HCS-11 memo issue resolved)
