# Hedera A2A Agents System

A comprehensive multi-agent system built on Hedera Hashgraph for autonomous agent-to-agent communication and settlement using the x402 payment protocol. This system demonstrates advanced blockchain integration, cross-chain payments, and decentralized autonomous operations.

## 🚀 Overview

The Hedera A2A Agents System implements a three-agent workflow that processes, verifies, and settles transactions in a completely autonomous manner. The system showcases the power of decentralized agent communication and cross-chain payment execution.

### Key Features

- **🤖 Autonomous Operation**: Agents operate independently without human intervention
- **🔗 Cross-Chain Integration**: Seamless operation between Hedera and Ethereum ecosystems
- **💳 x402 Payment Protocol**: Advanced autonomous payment processing
- **📡 Decentralized Communication**: Uses Hedera Consensus Service for message passing
- **🔒 Secure Architecture**: Comprehensive security and key management
- **📊 Real-time Monitoring**: Complete audit trail and transaction tracking

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  AnalyzerAgent  │───▶│  VerifierAgent  │───▶│ SettlementAgent │
│                 │    │                 │    │                 │
│ • Account Query │    │ • Validation    │    │ • Payment Exec │
│ • Threshold     │    │ • Decision      │    │ • Settlement    │
│ • Proposal      │    │ • Routing       │    │ • Recording     │
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
│                    Ethereum/Base Sepolia                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ USDC        │  │ Settlement  │  │ Merchant    │              │
│  │ Contract    │  │ Wallet      │  │ Wallet      │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

## 🤖 Agent Overview

### AnalyzerAgent

**Purpose**: Analyzes account data and generates proposals for downstream processing.

**Key Capabilities**:

- Query Hedera account information via SDK and mirror node
- Evaluate account balances against predefined thresholds
- Generate structured analysis proposals
- Validate account data integrity

**Usage**:

```typescript
import { AnalyzerAgent } from "./src/agents/AnalyzerAgent";

const analyzer = new AnalyzerAgent();
await analyzer.init();
const accountData = await analyzer.queryAccount("0.0.123456");
```

### VerifierAgent

**Purpose**: Validates proposals and makes approval decisions based on business logic.

**Key Capabilities**:

- Receive and validate analysis proposals from AnalyzerAgent
- Apply business logic for approval/rejection decisions
- Route approved proposals to SettlementAgent
- Handle rejection scenarios with proper reasoning

**Usage**:

```typescript
import { VerifierAgent } from "./src/agents/VerifierAgent";

const verifier = new VerifierAgent();
await verifier.init();
// Agent automatically polls for messages and processes them
```

### SettlementAgent

**Purpose**: Executes x402 payments and records settlement completion.

**Key Capabilities**:

- Process approved proposals from VerifierAgent
- Execute x402 payments on Base Sepolia network
- Handle USDC token transfers
- Record settlement completion on HCS

**Usage**:

```typescript
import { SettlementAgent } from "./src/agents/SettlementAgent";

const settlement = new SettlementAgent();
await settlement.init();
// Agent automatically processes verification results and executes payments
```

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+ and npm
- Hedera testnet account with HBAR
- Base Sepolia wallet with USDC
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Hebx/hedera-a2a-agents.git
   cd hedera-a2a-agents
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   ```bash
   cp env.example .env
   # Edit .env with your credentials
   ```

4. **Register agents**

   ```bash
   npm run register-agents
   ```

5. **Test the system**

   ```bash
   # Test individual agents
   npm run test:analyzer
   npm run test:verifier
   npm run test:settlement

   # Run complete demo
   npm run demo
   ```

## ⚙️ Configuration

### Environment Variables

```bash
# Hedera Configuration
HEDERA_ACCOUNT_ID=0.0.123456
HEDERA_PRIVATE_KEY=your_private_key_here

# Agent Credentials (auto-generated by register-agents)
ANALYZER_AGENT_ID=0.0.123456
ANALYZER_TOPIC_ID=0.0.123456
ANALYZER_PRIVATE_KEY=agent_private_key

VERIFIER_AGENT_ID=0.0.123456
VERIFIER_TOPIC_ID=0.0.123456
VERIFIER_PRIVATE_KEY=agent_private_key

SETTLEMENT_AGENT_ID=0.0.123456
SETTLEMENT_TOPIC_ID=0.0.123456
SETTLEMENT_PRIVATE_KEY=agent_private_key

# Settlement Configuration
BASE_RPC_URL=https://sepolia.base.org
SETTLEMENT_WALLET_PRIVATE_KEY=wallet_private_key
USDC_CONTRACT=0x036CbD53842c5426634e7929541eC2318f3dCF7e
MERCHANT_WALLET_ADDRESS=0x1234567890123456789012345678901234567890
```

### Agent Registration

The system includes an automated agent registration process that:

- Creates Hedera accounts for each agent
- Sets up HCS topics for communication
- Generates and stores agent credentials
- Updates your `.env` file with the new credentials

```bash
npm run register-agents
```

## 🔄 Workflow

### Complete Transaction Flow

1. **Analysis Phase**
   - AnalyzerAgent queries account data from Hedera
   - Evaluates account balance against threshold
   - Generates analysis proposal

2. **Verification Phase**
   - VerifierAgent receives analysis proposal
   - Validates proposal against business rules
   - Makes approval/rejection decision
   - Routes approved proposals to SettlementAgent

3. **Settlement Phase**
   - SettlementAgent receives verification result
   - Creates x402 payment requirements
   - Executes payment on Base Sepolia
   - Records settlement completion on HCS

### Message Flow

```
AnalyzerAgent ──analysis_proposal──▶ VerifierAgent
VerifierAgent ──verification_result──▶ SettlementAgent
SettlementAgent ──settlement_complete──▶ AnalyzerAgent (broadcast)
```

## 🧪 Testing

### Individual Agent Testing

```bash
# Test AnalyzerAgent
npm run test:analyzer

# Test VerifierAgent
npm run test:verifier

# Test SettlementAgent
npm run test:settlement
```

### Complete System Demo

```bash
# Run end-to-end demo
npm run demo

# Demo with custom parameters
npm run demo -- 0.0.123456 100
```

### Test Coverage

- ✅ **Unit Tests**: Individual component testing
- ✅ **Integration Tests**: Component interaction testing
- ✅ **End-to-End Tests**: Complete workflow testing
- ✅ **Demo System**: Interactive demonstration

## 📚 Documentation

- **[PRD.md](./PRD.md)** - Product Requirements Document
- **[Architecture.md](./Architecture.md)** - System Architecture Documentation
- **[SETUP.md](./SETUP.md)** - Detailed Setup Instructions

## 🔧 Development

### Project Structure

```
hedera-a2a-agents/
├── src/
│   ├── agents/           # Agent implementations
│   │   ├── AnalyzerAgent.ts
│   │   ├── VerifierAgent.ts
│   │   └── SettlementAgent.ts
│   └── tools/           # Utility tools
├── demo/
│   └── orchestrator.ts   # Demo system
├── setup/
│   └── register-agents.ts # Agent registration
├── test-*.ts            # Test files
└── docs/               # Documentation
```

### Available Scripts

```bash
npm run test:analyzer    # Test AnalyzerAgent
npm run test:verifier    # Test VerifierAgent
npm run test:settlement   # Test SettlementAgent
npm run demo            # Run complete demo
npm run register-agents  # Register agents on Hedera
```

## 🔗 Dependencies

### Core Dependencies

- **@hashgraph/sdk** - Hedera SDK for blockchain operations
- **@hashgraphonline/standards-agent-kit** - HCS client for agent communication
- **a2a-x402** - Autonomous agent payment protocol
- **ethers** - Ethereum/EVM blockchain interactions
- **axios** - HTTP client for API calls
- **chalk** - Terminal output formatting
- **dotenv** - Environment variable management

### Development Dependencies

- **TypeScript** - Type checking and compilation
- **ts-node** - TypeScript execution
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🌐 Network Support

### Hedera Networks

- **Testnet** - Primary development and testing network
- **Mainnet** - Production deployment (planned)

### Ethereum Networks

- **Base Sepolia** - Primary settlement network for USDC
- **Ethereum Sepolia** - Alternative settlement network (planned)

## 🔒 Security

### Security Features

- **Private Key Management**: Secure key storage and handling
- **Message Signing**: Cryptographic message verification
- **Access Control**: Role-based agent permissions
- **Audit Trail**: Complete transaction history
- **Error Handling**: Comprehensive error recovery

### Security Best Practices

- Never commit private keys to version control
- Use environment variables for sensitive data
- Regularly rotate keys and credentials
- Monitor agent operations for anomalies
- Implement proper access controls

## 🚀 Deployment

### Production Deployment

1. **Environment Setup**
   - Configure production environment variables
   - Set up monitoring and logging
   - Configure security settings

2. **Agent Registration**
   - Register agents on Hedera mainnet
   - Set up production HCS topics
   - Configure production wallets

3. **Monitoring**
   - Set up health checks
   - Configure alerting
   - Monitor transaction success rates

### Scaling Considerations

- **Horizontal Scaling**: Multiple agent instances
- **Load Balancing**: Message distribution across instances
- **Performance Monitoring**: Track processing times and success rates
- **Resource Management**: Efficient resource utilization

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help

- **Documentation**: Check the [docs](./docs/) directory
- **Issues**: Report bugs and request features via [GitHub Issues](https://github.com/Hebx/hedera-a2a-agents/issues)
- **Discussions**: Join the [GitHub Discussions](https://github.com/Hebx/hedera-a2a-agents/discussions)

### Common Issues

- **Agent Registration Failures**: Check Hedera account balance and credentials
- **Payment Failures**: Verify Base Sepolia wallet has sufficient USDC
- **Message Processing Issues**: Check HCS topic configuration and agent credentials

## 🎯 Roadmap

### Planned Features

- **Machine Learning Integration**: ML-based analysis and decision making
- **Multi-Chain Support**: Additional blockchain networks
- **Advanced Analytics**: Comprehensive reporting and analytics
- **Custom Workflows**: User-defined workflow customization
- **Performance Optimization**: Enhanced scalability and performance

### Future Enhancements

- **Web Interface**: Browser-based agent management
- **API Gateway**: RESTful API for agent operations
- **Mobile Support**: Mobile app for agent monitoring
- **Enterprise Features**: Advanced enterprise capabilities

---

**Built with ❤️ using Hedera Hashgraph and the x402 payment protocol**
