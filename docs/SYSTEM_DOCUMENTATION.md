# Hedera A2A Agent System - Complete Documentation

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Agent Specifications](#agent-specifications)
4. [Setup and Installation](#setup-and-installation)
5. [Configuration](#configuration)
6. [Usage Guide](#usage-guide)
7. [API Reference](#api-reference)
8. [Testing](#testing)
9. [Troubleshooting](#troubleshooting)
10. [Deployment](#deployment)
11. [Monitoring](#monitoring)
12. [Security](#security)

---

## System Overview

The Hedera A2A Agent System is a decentralized multi-agent architecture built on Hedera Hashgraph that enables autonomous agent-to-agent communication and settlement using the x402 payment protocol. The system consists of three specialized agents that work together to process, verify, and settle transactions in a trustless environment.

### Key Features

- **Autonomous Operation**: Agents operate independently without human intervention
- **Decentralized Communication**: Uses Hedera Consensus Service (HCS) for agent messaging
- **Trustless Settlement**: Implements x402 protocol for secure payment execution
- **Multi-Chain Support**: Integrates Hedera Hashgraph with Ethereum-compatible networks
- **Real-time Processing**: 5-second polling intervals for responsive operations
- **Comprehensive Error Handling**: Graceful fallbacks and detailed logging

### System Components

1. **AnalyzerAgent**: Queries account data and generates analysis proposals
2. **VerifierAgent**: Validates proposals and makes approval decisions
3. **SettlementAgent**: Executes payments and records settlements
4. **HCS Communication Layer**: Handles inter-agent messaging
5. **x402 Payment Protocol**: Manages cross-chain settlements

---

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  AnalyzerAgent  │───▶│  VerifierAgent  │───▶│ SettlementAgent │
│                 │    │                 │    │                 │
│ • Query Accounts│    │ • Validate      │    │ • Execute       │
│ • Analyze Data  │    │ • Approve/Reject│    │ • Record        │
│ • Propose       │    │ • Send Results  │    │ • Notify        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │ Hedera Consensus│
                    │ Service (HCS)   │
                    │                 │
                    │ • Topic 1       │
                    │ • Topic 2       │
                    │ • Topic 3       │
                    └─────────────────┘
```

### Communication Flow

1. **Analysis Request** → AnalyzerAgent queries account data
2. **Analysis Proposal** → AnalyzerAgent sends proposal to VerifierAgent
3. **Verification Result** → VerifierAgent sends decision to SettlementAgent
4. **Settlement Execution** → SettlementAgent executes payment and records result

### Technology Stack

- **Primary Platform**: Hedera Hashgraph Testnet
- **Communication**: Hedera Consensus Service (HCS-10 Standard)
- **Payment Protocol**: x402 (a2a-x402 library)
- **Ethereum Integration**: Base Sepolia Network
- **Language**: TypeScript
- **Libraries**:
  - @hashgraph/sdk
  - @hashgraphonline/standards-agent-kit
  - a2a-x402
  - ethers.js

---

## Agent Specifications

### AnalyzerAgent

**Purpose**: Queries Hedera account information and generates analysis proposals.

**Key Methods**:

- `queryAccount(accountId: string)`: Queries account via Hedera SDK
- `queryAccountViaMirror(accountId: string)`: Queries account via Mirror Node API
- `getHcsClient()`: Returns HCS client for message sending

**Configuration**:

- Agent ID: `ANALYZER_AGENT_ID`
- Topic ID: `ANALYZER_TOPIC_ID`
- Private Key: `ANALYZER_PRIVATE_KEY`

**Message Types**:

- **Sends**: `analysis_proposal`
- **Receives**: Settlement completion notifications

### VerifierAgent

**Purpose**: Validates analysis proposals and makes approval decisions.

**Key Methods**:

- `validateProposal(proposal: AnalysisProposal)`: Validates proposals
- `onMessage(type: string, handler: Function)`: Registers custom handlers

**Configuration**:

- Agent ID: `VERIFIER_AGENT_ID`
- Topic ID: `VERIFIER_TOPIC_ID`
- Private Key: `VERIFIER_PRIVATE_KEY`

**Message Types**:

- **Receives**: `analysis_proposal`
- **Sends**: `verification_result`

**Business Logic**:

- Approval criteria: `proposal.meetsThreshold === true`
- Automatic routing to SettlementAgent on approval

### SettlementAgent

**Purpose**: Executes payments and records settlement completion.

**Key Methods**:

- `executeSettlement(verification: VerificationResult)`: Executes x402 payments
- `recordSettlement(txHash: string, amount: number)`: Records completion

**Configuration**:

- Agent ID: `SETTLEMENT_AGENT_ID`
- Topic ID: `SETTLEMENT_TOPIC_ID`
- Private Key: `SETTLEMENT_PRIVATE_KEY`
- RPC URL: `BASE_RPC_URL`
- Wallet Key: `SETTLEMENT_WALLET_PRIVATE_KEY`

**Message Types**:

- **Receives**: `verification_result`
- **Sends**: `settlement_complete`

**Payment Configuration**:

- Network: Base Sepolia
- Token: USDC (ERC-20)
- Contract: `USDC_CONTRACT`
- Recipient: `MERCHANT_WALLET_ADDRESS`

---

## Setup and Installation

### Prerequisites

1. **Node.js**: Version 18+ recommended
2. **Hedera Testnet Account**: With sufficient HBAR balance
3. **Base Sepolia Wallet**: For settlement operations (optional for testing)

### Installation Steps

1. **Clone Repository**:

   ```bash
   git clone https://github.com/Hebx/hedera-a2a-agents.git
   cd hedera-a2a-agents
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Environment Setup**:

   ```bash
   cp env.example .env
   # Edit .env with your credentials
   ```

4. **Agent Registration**:
   ```bash
   npx tsx setup/register-agents.ts
   ```

### Getting Testnet HBAR

- **Hedera Portal**: https://portal.hedera.com/
- **Discord Faucet**: https://discord.gg/hedera (#testnet-faucet)
- **Community Faucets**: Various community-run faucets

---

## Configuration

### Environment Variables

#### Required Variables

```bash
# Hedera Configuration
HEDERA_ACCOUNT_ID=0.0.123456
HEDERA_PRIVATE_KEY=302e020100300506032b657004220420...

# Agent Credentials (Auto-generated)
ANALYZER_AGENT_ID=0.0.789012
ANALYZER_TOPIC_ID=0.0.345678
ANALYZER_PRIVATE_KEY=agent_private_key

VERIFIER_AGENT_ID=0.0.789013
VERIFIER_TOPIC_ID=0.0.345679
VERIFIER_PRIVATE_KEY=agent_private_key

SETTLEMENT_AGENT_ID=0.0.789014
SETTLEMENT_TOPIC_ID=0.0.345680
SETTLEMENT_PRIVATE_KEY=agent_private_key

# Settlement Configuration
BASE_RPC_URL=https://sepolia.base.org
SETTLEMENT_WALLET_PRIVATE_KEY=0x...
USDC_CONTRACT=0x036CbD53842c5426634e7929541eC2318f3dCF7e
MERCHANT_WALLET_ADDRESS=0x...
```

#### Private Key Formats

The system supports multiple private key formats:

1. **DER Encoded** (recommended): `302e020100300506032b657004220420...`
2. **Raw Hex**: `1234567890abcdef...` (32 bytes)
3. **ECDSA Format**: As provided by Hedera SDK

### Network Configuration

#### Hedera Testnet

- **Network**: Hedera Testnet
- **Mirror Node**: https://testnet.mirrornode.hedera.com
- **HashScan**: https://hashscan.io/testnet

#### Base Sepolia

- **RPC URL**: https://sepolia.base.org
- **Explorer**: https://sepolia.basescan.org
- **USDC Contract**: 0x036CbD53842c5426634e7929541eC2318f3dCF7e

---

## Usage Guide

### Basic Usage

#### 1. Individual Agent Testing

```bash
# Test AnalyzerAgent
npm run test:analyzer

# Test VerifierAgent
npm run test:verifier

# Test SettlementAgent
npm run test:settlement
```

#### 2. Complete Demo

```bash
# Run full workflow demo
npm run demo

# With custom parameters
npm run demo -- 0.0.123456 100
```

#### 3. Programmatic Usage

```typescript
import { AnalyzerAgent, VerifierAgent, SettlementAgent } from "./src/agents";

// Initialize agents
const analyzer = new AnalyzerAgent();
const verifier = new VerifierAgent();
const settlement = new SettlementAgent();

// Initialize all agents
await analyzer.init();
await verifier.init();
await settlement.init();

// Query account data
const accountData = await analyzer.queryAccount("0.0.123456");
console.log("Account balance:", accountData.balance);
```

### Advanced Usage

#### Custom Message Handlers

```typescript
// Register custom handler in VerifierAgent
verifier.onMessage("custom_proposal", async (proposal) => {
  console.log("Custom proposal received:", proposal);
  // Custom validation logic
});
```

#### Manual Message Sending

```typescript
// Send analysis proposal manually
const proposal = {
  type: "analysis_proposal",
  accountId: "0.0.123456",
  balance: "100 ℏ",
  threshold: 50,
  meetsThreshold: true,
  timestamp: Date.now(),
};

await analyzer
  .getHcsClient()
  .sendMessage(process.env.VERIFIER_TOPIC_ID!, JSON.stringify(proposal));
```

---

## API Reference

### AnalyzerAgent

#### Methods

##### `constructor()`

Initializes the AnalyzerAgent with credentials from environment variables.

##### `async init(): Promise<void>`

Initializes the agent and verifies connection to Hedera testnet.

##### `async queryAccount(accountId: string): Promise<AccountInfo>`

Queries account information using Hedera SDK.

**Parameters**:

- `accountId`: Hedera account ID (e.g., "0.0.123456")

**Returns**:

```typescript
interface AccountInfo {
  accountId: string;
  balance: string;
  key: string;
  isDeleted: boolean;
  autoRenewPeriod: string;
}
```

##### `async queryAccountViaMirror(accountId: string): Promise<any>`

Queries account information via Hedera Mirror Node API.

**Parameters**:

- `accountId`: Hedera account ID

**Returns**: Raw mirror node response data

##### `getHcsClient(): HCS10Client`

Returns the HCS client for sending messages.

**Returns**: HCS10Client instance

### VerifierAgent

#### Methods

##### `constructor()`

Initializes the VerifierAgent with credentials from environment variables.

##### `async init(): Promise<void>`

Initializes the agent and starts message polling.

##### `onMessage(type: string, handler: Function): void`

Registers a custom message handler.

**Parameters**:

- `type`: Message type to handle
- `handler`: Handler function to call

### SettlementAgent

#### Methods

##### `constructor()`

Initializes the SettlementAgent with credentials and wallet configuration.

##### `async init(): Promise<void>`

Initializes the agent and starts message polling.

### Message Types

#### Analysis Proposal

```typescript
interface AnalysisProposal {
  type: "analysis_proposal";
  accountId: string;
  balance: string;
  threshold: number;
  meetsThreshold: boolean;
  timestamp: number;
}
```

#### Verification Result

```typescript
interface VerificationResult {
  type: "verification_result";
  originalProposal: AnalysisProposal;
  approved: boolean;
  reasoning: string;
  timestamp: number;
}
```

#### Settlement Complete

```typescript
interface SettlementRecord {
  type: "settlement_complete";
  txHash: string;
  amount: string;
  timestamp: number;
}
```

---

## Testing

### Test Structure

The system includes comprehensive test files for each agent:

- `test-analyzer.ts`: Tests AnalyzerAgent functionality
- `test-verifier.ts`: Tests VerifierAgent initialization
- `test-settlement.ts`: Tests SettlementAgent initialization
- `demo/orchestrator.ts`: Complete workflow demonstration

### Running Tests

```bash
# Individual agent tests
npm run test:analyzer
npm run test:verifier
npm run test:settlement

# Complete demo
npm run demo
```

### Test Scenarios

#### AnalyzerAgent Tests

- Account querying via SDK
- Account querying via Mirror Node
- Balance analysis and threshold comparison
- Error handling for invalid accounts

#### VerifierAgent Tests

- Message polling initialization
- Proposal validation logic
- Custom message handler registration
- HCS message processing

#### SettlementAgent Tests

- Payment execution (demo mode)
- Settlement recording
- Error handling for failed payments
- Multi-chain integration

### Demo Workflow

The demo orchestrator demonstrates the complete A2A workflow:

1. **Initialization**: All three agents are initialized
2. **Account Query**: AnalyzerAgent queries a test account
3. **Analysis**: Balance is compared against threshold
4. **Proposal**: Analysis proposal is sent to VerifierAgent
5. **Verification**: VerifierAgent validates and approves/rejects
6. **Settlement**: SettlementAgent executes payment (if approved)
7. **Recording**: Settlement completion is recorded

---

## Troubleshooting

### Common Issues

#### 1. Agent Registration Failures

**Problem**: HCS-11 profile registration errors

```
Error: Account does not have a valid HCS-11 memo
```

**Solution**:

- This is a known issue with the HCS-10 library
- Agents still function correctly despite the warning
- The system falls back to main account credentials

#### 2. Private Key Format Issues

**Problem**: Invalid private key format

```
Error: Invalid private key format
```

**Solutions**:

- Ensure private key is in DER encoded format
- Check for extra whitespace or characters
- Verify account ID matches private key

#### 3. Network Connectivity Issues

**Problem**: Failed to connect to Hedera testnet

```
Error: Failed to retrieve profile
```

**Solutions**:

- Check internet connection
- Verify Hedera testnet status
- Ensure sufficient HBAR balance

#### 4. Settlement Payment Failures

**Problem**: x402 payment execution fails

```
Error: Payment execution failed
```

**Solutions**:

- Verify Base Sepolia wallet has sufficient ETH for gas
- Check USDC contract address is correct
- Ensure merchant wallet address is valid

### Debug Mode

Enable debug logging by setting environment variables:

```bash
DEBUG=hedera-a2a-agents:*
npm run demo
```

### Log Analysis

The system provides comprehensive logging:

- **Success Operations**: Green checkmarks (✓)
- **Warnings**: Yellow warnings (⚠️)
- **Errors**: Red X marks (❌)
- **Info**: Blue information (📋)

### Performance Monitoring

Monitor system performance:

- **Message Polling**: Every 5 seconds
- **Account Queries**: 1-3 seconds average
- **Payment Execution**: 30-120 seconds
- **End-to-End**: <2 minutes total

---

## Deployment

### Production Considerations

#### 1. Environment Security

- Store private keys securely (not in code)
- Use environment variable management
- Implement key rotation policies
- Monitor access logs

#### 2. Network Configuration

- Use production Hedera network
- Configure proper RPC endpoints
- Set up monitoring and alerting
- Implement backup systems

#### 3. Scaling

- Deploy multiple agent instances
- Use load balancers for HCS topics
- Implement horizontal scaling
- Monitor resource usage

#### 4. Monitoring

- Set up HashScan monitoring
- Implement health checks
- Monitor transaction success rates
- Track performance metrics

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hedera-a2a-agents
spec:
  replicas: 3
  selector:
    matchLabels:
      app: hedera-a2a-agents
  template:
    metadata:
      labels:
        app: hedera-a2a-agents
    spec:
      containers:
        - name: agents
          image: hedera-a2a-agents:latest
          env:
            - name: HEDERA_ACCOUNT_ID
              valueFrom:
                secretKeyRef:
                  name: hedera-secrets
                  key: account-id
          ports:
            - containerPort: 3000
```

---

## Monitoring

### HashScan Integration

Monitor agent activity on HashScan:

- **AnalyzerAgent Topic**: https://hashscan.io/testnet/topic/{ANALYZER_TOPIC_ID}
- **VerifierAgent Topic**: https://hashscan.io/testnet/topic/{VERIFIER_TOPIC_ID}
- **SettlementAgent Topic**: https://hashscan.io/testnet/topic/{SETTLEMENT_TOPIC_ID}

### BaseScan Integration

Monitor settlement transactions:

- **Base Sepolia Explorer**: https://sepolia.basescan.org
- **USDC Contract**: https://sepolia.basescan.org/address/{USDC_CONTRACT}

### Health Checks

Implement health check endpoints:

```typescript
// Health check for each agent
app.get("/health/analyzer", async (req, res) => {
  try {
    await analyzer.queryAccount(process.env.HEDERA_ACCOUNT_ID!);
    res.json({ status: "healthy", agent: "analyzer" });
  } catch (error) {
    res.status(500).json({ status: "unhealthy", error: error.message });
  }
});
```

### Metrics Collection

Track key metrics:

- **Message Processing Rate**: Messages per minute
- **Account Query Success Rate**: Percentage of successful queries
- **Payment Success Rate**: Percentage of successful settlements
- **Average Processing Time**: End-to-end processing time
- **Error Rate**: Percentage of failed operations

---

## Security

### Private Key Management

#### Best Practices

- Never store private keys in code
- Use environment variables or secure vaults
- Implement key rotation policies
- Monitor key usage and access

#### Key Formats

- **DER Encoded**: Recommended for Hedera
- **Raw Hex**: For Ethereum-compatible networks
- **Encrypted Storage**: For production environments

### Access Control

#### Agent Isolation

- Each agent has unique credentials
- Agents can only access assigned topics
- Implement proper permission boundaries
- Monitor cross-agent communications

#### Transaction Security

- All transactions are cryptographically signed
- Implement nonce management
- Use proper gas estimation
- Monitor for suspicious activity

### Network Security

#### Hedera Security

- Use official Hedera SDK
- Verify transaction signatures
- Monitor consensus timestamps
- Implement proper error handling

#### Ethereum Security

- Use reputable RPC providers
- Implement proper gas management
- Monitor for front-running attacks
- Use secure wallet implementations

### Audit Trail

#### Comprehensive Logging

- Log all agent operations
- Record message flows
- Track payment executions
- Monitor error conditions

#### Compliance

- Implement data retention policies
- Ensure audit trail integrity
- Monitor for compliance violations
- Generate compliance reports

---

## Conclusion

The Hedera A2A Agent System provides a robust, scalable, and secure platform for autonomous agent operations. The comprehensive documentation above covers all aspects of the system, from basic setup to advanced deployment scenarios.

### Key Strengths

- **Modular Architecture**: Independent agent development and deployment
- **Comprehensive Error Handling**: Graceful fallbacks and detailed logging
- **Multi-Chain Support**: Hedera and Ethereum-compatible networks
- **Real-time Processing**: Responsive 5-second polling intervals
- **Security-First Design**: Proper credential management and access control

### Future Enhancements

- **Machine Learning Integration**: AI-powered decision making
- **Cross-Chain Bridges**: Native cross-chain asset transfers
- **Privacy Features**: Zero-knowledge proof integration
- **Governance Systems**: Decentralized parameter management

For additional support or questions, please refer to the project repository or contact the development team.

---

_Last Updated: December 2024_
_Version: 1.0.0_
