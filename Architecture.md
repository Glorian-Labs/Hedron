# Architecture Document

## Hedera A2A Agents System

### Document Information

- **Version**: 1.0.0
- **Date**: December 2024
- **Status**: Implementation Complete
- **Project**: Hedera Agent-to-Agent Communication System

---

## 1. System Overview

The Hedera A2A Agents System is a distributed, event-driven architecture that enables autonomous agent-to-agent communication and settlement using Hedera Hashgraph and the x402 payment protocol. The system implements a three-agent workflow that processes, verifies, and settles transactions in a decentralized manner.

### 1.1 Architecture Principles

- **Decentralization**: No central authority or single point of failure
- **Autonomy**: Agents operate independently without human intervention
- **Event-Driven**: Reactive architecture based on message passing
- **Stateless Design**: Minimal state management for scalability
- **Cross-Chain**: Integration between Hedera and Ethereum ecosystems

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  AnalyzerAgent  │───▶│  VerifierAgent  │───▶│ SettlementAgent │
│                 │    │                 │    │                 │
│ • Account Query │    │ • Validation    │    │ • x402 Payment  │
│ • Threshold     │    │ • Decision      │    │ • Facilitator   │
│ • Proposal      │    │ • Routing       │    │ • Settlement    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Hedera Consensus Service (HCS)              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Analyzer    │  │ Verifier    │  │ Settlement  │              │
│  │ Topic       │  │ Topic       │  │ Topic       │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    x402 Facilitator Server                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Verify      │  │ Settle      │  │ USDC        │              │
│  │ Payment     │  │ Payment     │  │ Transfer    │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Ethereum/Base Sepolia                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ USDC        │  │ Settlement  │  │ Merchant    │              │
│  │ Contract    │  │ Wallet      │  │ Wallet      │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Component Overview

#### 2.2.1 AnalyzerAgent

- **Purpose**: Analyzes account data and generates proposals
- **Responsibilities**:
  - Query Hedera account information
  - Evaluate account balances against thresholds
  - Generate analysis proposals
  - Send proposals to VerifierAgent

#### 2.2.2 VerifierAgent

- **Purpose**: Validates proposals and makes approval decisions
- **Responsibilities**:
  - Receive and validate analysis proposals
  - Apply business logic for approval/rejection
  - Route approved proposals to SettlementAgent
  - Handle rejection scenarios

#### 2.2.3 SettlementAgent

- **Purpose**: Executes complete x402 payment flow with facilitator server
- **Responsibilities**:
  - Process approved proposals from VerifierAgent
  - Create payment authorization using x402 protocol
  - Verify payments via local facilitator server
  - Execute actual USDC transfers on Base Sepolia
  - Record settlement completion with real transaction hashes
  - Handle payment failures with strict error handling

---

## 3. Detailed Component Architecture

### 3.1 AnalyzerAgent Architecture

```typescript
class AnalyzerAgent {
  private hcsClient: HCS10Client; // HCS communication
  private hederaClient: Client; // Direct Hedera SDK access
  private readonly MIRROR_NODE_URL; // Mirror node endpoint

  // Core Methods
  async init(): Promise<void>; // Initialize agent
  async queryAccount(accountId: string); // Query account data
  async queryAccountViaMirror(accountId: string); // Mirror node queries
}
```

#### 3.1.1 Data Flow

1. **Initialization**: Connect to Hedera testnet and verify credentials
2. **Account Query**: Query account information via SDK or mirror node
3. **Analysis**: Evaluate account data against business rules
4. **Proposal Generation**: Create structured proposal for downstream processing

#### 3.1.2 Dependencies

- **@hashgraph/sdk**: Direct Hedera blockchain access
- **@hashgraphonline/standards-agent-kit**: HCS communication
- **axios**: HTTP client for mirror node queries

### 3.2 VerifierAgent Architecture

```typescript
class VerifierAgent {
  private hcsClient: HCS10Client; // HCS communication
  private messageHandlers: Map<string, Function>; // Custom handlers

  // Core Methods
  async init(): Promise<void>; // Initialize agent
  private startMessagePolling(topicId: string); // Poll for messages
  private async handleMessage(message: any); // Process messages
  private async validateProposal(proposal: any); // Validate proposals
  onMessage(type: string, handler: Function); // Register handlers
}
```

#### 3.2.1 Data Flow

1. **Message Polling**: Continuously poll HCS topic for new messages
2. **Message Processing**: Parse and route messages to appropriate handlers
3. **Proposal Validation**: Apply business logic to validate proposals
4. **Decision Routing**: Forward approved proposals to SettlementAgent

#### 3.2.2 Message Types

- **analysis_proposal**: Incoming proposals from AnalyzerAgent
- **verification_result**: Outgoing results to SettlementAgent
- **Custom Types**: Extensible handler system for additional message types

### 3.3 SettlementAgent Architecture

```typescript
class SettlementAgent {
  private hcsClient: HCS10Client; // HCS communication
  private provider: JsonRpcProvider; // Ethereum/EVM provider
  private wallet: Wallet; // Ethereum wallet
  private x402Utils: typeof x402Utils; // x402 payment utilities
  private facilitator: X402FacilitatorServer; // Local facilitator server

  // Core Methods
  async init(): Promise<void>; // Initialize agent
  async triggerSettlement(verification: any); // Public settlement trigger
  private startMessagePolling(topicId: string); // Poll for messages
  private async handleMessage(message: any); // Process messages
  private async executeSettlement(verification: any); // Execute complete x402 flow
  private async recordSettlement(txHash: string, amount: number); // Record completion
}
```

#### 3.3.1 Data Flow

1. **Message Reception**: Receive verification results from VerifierAgent
2. **Payment Authorization**: Create x402 payment authorization with signature
3. **Payment Verification**: Validate payment via local facilitator server
4. **Payment Settlement**: Execute actual USDC transfer on Base Sepolia
5. **Settlement Recording**: Record completion with real transaction hash

#### 3.3.2 Complete x402 Payment Flow

```typescript
// Step 1: Create payment authorization
const requirements = {
  scheme: "exact",
  network: "base-sepolia",
  asset: USDC_CONTRACT_ADDRESS,
  payTo: MERCHANT_WALLET_ADDRESS,
  maxAmountRequired: "1000000", // 1 USDC
  resource: "/agent-settlement",
  description: "A2A agent settlement",
  mimeType: "application/json",
  maxTimeoutSeconds: 120,
};

const paymentPayload = await processPayment(requirements, wallet);
const paymentHeader = Buffer.from(JSON.stringify(paymentPayload)).toString('base64');

// Step 2: Verify payment via facilitator
const verificationResult = await this.facilitator.verify(paymentHeader, requirements);

// Step 3: Settle payment and execute USDC transfer
const settlementResult = await this.facilitator.settle(paymentHeader, requirements);
```

#### 3.3.3 x402 Facilitator Server

```typescript
class X402FacilitatorServer {
  private provider: JsonRpcProvider; // Base Sepolia provider
  private wallet: Wallet; // Settlement wallet

  // Core Methods
  async verify(paymentHeader: string, requirements: any); // Local verification
  async settle(paymentHeader: string, requirements: any); // Execute USDC transfer
  getSupportedSchemes(); // Return supported schemes
  private validatePaymentLocally(paymentPayload: any, requirements: any); // Validation logic
  private async executeUSDCTransfer(paymentPayload: any, requirements: any); // Actual transfer
}
```

---

## 4. Communication Architecture

### 4.1 Hedera Consensus Service (HCS)

#### 4.1.1 Topic Structure

- **Analyzer Topic**: Receives settlement completion notifications
- **Verifier Topic**: Receives analysis proposals from AnalyzerAgent
- **Settlement Topic**: Receives verification results from VerifierAgent

#### 4.1.2 Message Format

```typescript
interface HCSMessage {
  type: string; // Message type identifier
  timestamp: number; // Unix timestamp
  data?: any; // Message payload
  originalProposal?: any; // Reference to original proposal
  approved?: boolean; // Approval status
  reasoning?: string; // Decision reasoning
  txHash?: string; // Transaction hash (for settlements)
  amount?: string; // Amount (for settlements)
}
```

#### 4.1.3 Message Flow

```
AnalyzerAgent ──analysis_proposal──▶ VerifierAgent
VerifierAgent ──verification_result──▶ SettlementAgent
SettlementAgent ──settlement_complete──▶ AnalyzerAgent (broadcast)
```

### 4.2 Polling Architecture

#### 4.2.1 Polling Strategy

- **Interval**: 5-second polling intervals
- **Error Handling**: Graceful error handling with logging
- **Message Processing**: Sequential processing of messages
- **State Management**: Stateless design for scalability

#### 4.2.2 Polling Implementation

```typescript
private startMessagePolling(topicId: string): void {
  setInterval(async () => {
    try {
      const result = await this.hcsClient.getMessages(topicId)
      if (result.messages && result.messages.length > 0) {
        for (const message of result.messages) {
          await this.handleMessage(message)
        }
      }
    } catch (error) {
      console.error('Error polling for messages:', error)
    }
  }, 5000)
}
```

---

## 5. Data Architecture

### 5.1 Data Models

#### 5.1.1 Account Data Model

```typescript
interface AccountInfo {
  accountId: string; // Hedera account ID
  balance: string; // Account balance in tinybars/HBAR
  key: string; // Public key
  isDeleted: boolean; // Account deletion status
  autoRenewPeriod: string; // Auto-renewal period
}
```

#### 5.1.2 Proposal Data Model

```typescript
interface AnalysisProposal {
  type: "analysis_proposal";
  accountId: string; // Target account ID
  balance: string; // Account balance
  threshold: number; // Threshold value
  meetsThreshold: boolean; // Threshold evaluation result
  timestamp: number; // Proposal timestamp
  analysisData: AccountInfo; // Complete account information
}
```

#### 5.1.3 Verification Data Model

```typescript
interface VerificationResult {
  type: "verification_result";
  originalProposal: AnalysisProposal; // Original proposal reference
  approved: boolean; // Approval decision
  reasoning: string; // Decision reasoning
  timestamp: number; // Verification timestamp
}
```

#### 5.1.4 Settlement Data Model

```typescript
interface SettlementComplete {
  type: "settlement_complete";
  txHash: string; // Ethereum transaction hash
  amount: string; // Settlement amount
  timestamp: number; // Settlement timestamp
  network: string; // Settlement network
  asset: string; // Settlement asset
}
```

### 5.2 Data Flow Architecture

#### 5.2.1 Request Flow

```
User Request → AnalyzerAgent → Account Query → Analysis → Proposal
Proposal → VerifierAgent → Validation → Decision → Result
Result → SettlementAgent → Payment → Settlement → Recording
```

#### 5.2.2 State Transitions

```
INIT → INITIALIZED → LISTENING → PROCESSING → COMPLETED
  ↓         ↓           ↓           ↓           ↓
ERROR ← ERROR ← ERROR ← ERROR ← ERROR ← ERROR
```

---

## 6. Security Architecture

### 6.1 Authentication and Authorization

#### 6.1.1 Agent Authentication

- **Hedera Account**: Each agent has a unique Hedera account
- **Private Key Management**: Secure private key storage and handling
- **Key Rotation**: Support for key rotation and updates
- **Access Control**: Role-based access control for agent operations

#### 6.1.2 Message Security

- **Cryptographic Signing**: All messages cryptographically signed
- **Message Integrity**: Hash-based message integrity verification
- **Replay Protection**: Timestamp-based replay attack prevention
- **Encryption**: Optional message encryption for sensitive data

### 6.2 Key Management

#### 6.2.1 Key Storage

- **Environment Variables**: Primary key storage mechanism
- **Secure Defaults**: Placeholder keys for development
- **Key Validation**: Runtime key format validation
- **Fallback Mechanisms**: Graceful handling of missing keys

#### 6.2.2 Key Operations

```typescript
// Key parsing with multiple format support
try {
  parsedPrivateKey = PrivateKey.fromString(privateKey); // DER format
} catch (error) {
  try {
    parsedPrivateKey = PrivateKey.fromStringEd25519(privateKey); // Raw hex
  } catch (error2) {
    parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey); // ECDSA format
  }
}
```

---

## 7. Integration Architecture

### 7.1 Hedera Integration

#### 7.1.1 SDK Integration

- **Client Management**: Hedera SDK client initialization and configuration
- **Account Operations**: Account creation, querying, and management
- **Transaction Signing**: Secure transaction signing and submission
- **Network Configuration**: Testnet and mainnet support

#### 7.1.2 HCS Integration

- **Topic Management**: Topic creation and management
- **Message Publishing**: Secure message publishing to topics
- **Message Consumption**: Reliable message consumption and processing
- **Error Handling**: Comprehensive error handling and recovery

### 7.2 Ethereum Integration

#### 7.2.1 Provider Architecture

- **RPC Provider**: JsonRpcProvider for Base Sepolia network
- **Wallet Integration**: Ethers.js wallet for transaction signing
- **Contract Interaction**: USDC contract interaction
- **Transaction Monitoring**: Transaction status tracking

#### 7.2.2 x402 Protocol Integration

- **Payment Requirements**: Structured payment requirement definition
- **Payment Processing**: Autonomous payment execution
- **Timeout Handling**: Payment timeout management
- **Resource Management**: Payment resource handling

---

## 8. Deployment Architecture

### 8.1 Environment Configuration

#### 8.1.1 Environment Variables

```bash
# Hedera Configuration
HEDERA_ACCOUNT_ID=0.0.123456
HEDERA_PRIVATE_KEY=your_private_key_here

# Agent Configuration (Auto-generated)
ANALYZER_AGENT_ID=0.0.123456
ANALYZER_TOPIC_ID=0.0.123456
ANALYZER_PRIVATE_KEY=agent_private_key

# Settlement Configuration
BASE_RPC_URL=https://sepolia.base.org
SETTLEMENT_WALLET_PRIVATE_KEY=wallet_private_key
USDC_CONTRACT=0x036CbD53842c5426634e7929541eC2318f3dCF7e
MERCHANT_WALLET_ADDRESS=0x1234567890123456789012345678901234567890
```

#### 8.1.2 Configuration Management

- **Environment Files**: .env file for configuration
- **Validation**: Runtime configuration validation
- **Defaults**: Sensible default values
- **Documentation**: Comprehensive configuration documentation

### 8.2 Agent Registration Architecture

#### 8.2.1 Registration Process

```typescript
async function registerAgents(): Promise<void> {
  // 1. Validate environment variables
  // 2. Initialize Hedera client
  // 3. Create agent accounts
  // 4. Create HCS topics
  // 5. Store credentials
  // 6. Write configuration
}
```

#### 8.2.2 Registration Components

- **Account Creation**: Automated agent account creation
- **Topic Creation**: HCS topic creation and management
- **Credential Storage**: Secure credential storage
- **Configuration Generation**: Environment file generation

---

## 9. Testing Architecture

### 9.1 Testing Strategy

#### 9.1.1 Test Types

- **Unit Tests**: Individual component testing
- **Integration Tests**: Component interaction testing
- **End-to-End Tests**: Complete workflow testing
- **Demo System**: Interactive demonstration system

#### 9.1.2 Test Implementation

```typescript
// Individual Agent Testing
npm run test:analyzer    // Test AnalyzerAgent
npm run test:verifier    // Test VerifierAgent
npm run test:settlement   // Test SettlementAgent

// Complete System Testing
npm run demo            // End-to-end workflow demo
```

### 9.2 Testing Components

#### 9.2.1 Test Files

- **test-analyzer.ts**: AnalyzerAgent testing
- **test-verifier.ts**: VerifierAgent testing
- **test-settlement.ts**: SettlementAgent testing
- **demo/orchestrator.ts**: Complete system demo

#### 9.2.2 Test Data

- **Mock Accounts**: Test account data
- **Test Transactions**: Sample transaction data
- **Expected Results**: Validation criteria
- **Error Scenarios**: Error condition testing

---

## 10. Monitoring and Observability

### 10.1 Logging Architecture

#### 10.1.1 Logging Strategy

- **Structured Logging**: JSON-formatted log messages
- **Log Levels**: Debug, Info, Warn, Error levels
- **Context Information**: Rich context in log messages
- **Performance Metrics**: Timing and performance data

#### 10.1.2 Logging Implementation

```typescript
// Colored console output using Chalk
console.log(chalk.green("✅ Agent initialized successfully"));
console.log(chalk.yellow("⚠️  Using placeholder private key"));
console.log(chalk.red("❌ Failed to initialize agent"));
```

### 10.2 Monitoring Components

#### 10.2.1 Health Checks

- **Agent Status**: Individual agent health monitoring
- **Network Connectivity**: Hedera and Ethereum network status
- **Message Processing**: Message processing metrics
- **Payment Status**: Payment execution monitoring

#### 10.2.2 Metrics Collection

- **Transaction Counts**: Number of processed transactions
- **Success Rates**: Success/failure ratios
- **Processing Times**: Average processing times
- **Error Rates**: Error frequency and types

---

## 11. Scalability Architecture

### 11.1 Horizontal Scaling

#### 11.1.1 Agent Scaling

- **Multiple Instances**: Multiple instances of each agent type
- **Load Distribution**: Message distribution across instances
- **State Management**: Stateless design for easy scaling
- **Resource Management**: Efficient resource utilization

#### 11.1.2 Topic Scaling

- **Topic Partitioning**: Multiple topics for load distribution
- **Message Routing**: Intelligent message routing
- **Queue Management**: Message queue management
- **Backpressure Handling**: Backpressure management

### 11.2 Performance Optimization

#### 11.2.1 Caching Strategy

- **Account Data Caching**: Cache frequently accessed account data
- **Message Caching**: Cache processed messages
- **Connection Pooling**: Reuse connections for efficiency
- **Batch Processing**: Process multiple messages in batches

#### 11.2.2 Resource Optimization

- **Memory Management**: Efficient memory usage
- **CPU Optimization**: CPU usage optimization
- **Network Optimization**: Network usage optimization
- **Storage Optimization**: Storage usage optimization

---

## 12. Error Handling Architecture

### 12.1 Error Classification

#### 12.1.1 Error Types

- **Network Errors**: Hedera/Ethereum network connectivity issues
- **Authentication Errors**: Key and credential issues
- **Validation Errors**: Data validation failures
- **Processing Errors**: Business logic processing failures

#### 12.1.2 Error Handling Strategy

- **Graceful Degradation**: Continue operation despite errors
- **Retry Logic**: Automatic retry for transient errors
- **Circuit Breakers**: Prevent cascade failures
- **Error Reporting**: Comprehensive error reporting

### 12.2 Recovery Mechanisms

#### 12.2.1 Automatic Recovery

- **Connection Recovery**: Automatic connection re-establishment
- **Message Reprocessing**: Retry failed message processing
- **State Recovery**: Recover from inconsistent states
- **Resource Recovery**: Recover from resource exhaustion

#### 12.2.2 Manual Recovery

- **Administrative Tools**: Tools for manual intervention
- **State Inspection**: Tools for state inspection
- **Configuration Updates**: Runtime configuration updates
- **Emergency Procedures**: Emergency recovery procedures

---

## 13. Future Architecture Considerations

### 13.1 Planned Enhancements

#### 13.1.1 Advanced Features

- **Machine Learning**: ML-based analysis and decision making
- **Multi-Chain Support**: Support for additional blockchains
- **Advanced Analytics**: Comprehensive analytics and reporting
- **Custom Workflows**: User-defined workflow customization

#### 13.1.2 Performance Improvements

- **Async Processing**: Asynchronous message processing
- **Stream Processing**: Real-time stream processing
- **Microservices**: Microservices architecture migration
- **Container Orchestration**: Kubernetes deployment

### 13.2 Architecture Evolution

#### 13.2.1 Migration Strategy

- **Incremental Migration**: Gradual architecture evolution
- **Backward Compatibility**: Maintain backward compatibility
- **Feature Flags**: Feature flag-based deployment
- **A/B Testing**: A/B testing for new features

#### 13.2.2 Technology Updates

- **SDK Updates**: Regular SDK and library updates
- **Protocol Updates**: x402 protocol updates
- **Network Updates**: Hedera and Ethereum network updates
- **Security Updates**: Regular security updates

---

## 14. Conclusion

The Hedera A2A Agents System architecture provides a robust, scalable, and secure foundation for autonomous agent-to-agent communication and settlement. The architecture successfully balances:

- **Decentralization**: Distributed, peer-to-peer communication
- **Reliability**: Robust error handling and recovery mechanisms
- **Scalability**: Horizontal scaling and performance optimization
- **Security**: Comprehensive security and key management
- **Maintainability**: Clean, modular, and well-documented code

The implementation demonstrates best practices in:

- **Event-Driven Architecture**: Reactive, message-based communication
- **Microservices Design**: Independent, loosely coupled components
- **Cross-Chain Integration**: Seamless multi-blockchain operation
- **DevOps Practices**: Comprehensive testing, monitoring, and deployment

This architecture provides a solid foundation for future enhancements and scaling while maintaining the core principles of decentralization, autonomy, and reliability.

---

_This Architecture Document represents the current state of the Hedera A2A Agents System as of December 2024. For updates and modifications, please refer to the project repository and issue tracking system._
