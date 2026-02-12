# TrustScore Oracle - Video Pitch Plan

**Focus**: TrustScore Oracle only  
**Duration**: 5-7 minutes  
**Audience**: Hackathon Judges

---

## Overview

This document outlines the video pitch plan for the **TrustScore Oracle**, showcasing what judges should see, real-world use cases, and how users can use the service.

---

## 🎯 Core Message

**The TrustScore Oracle is a decentralized reputation marketplace for Hedera accounts, enabling autonomous agents to buy and sell trust scores through a complete A2A → AP2 → x402 → Analytics → HCS workflow.**

---

## 📋 Video Structure (5-7 minutes)

### **Section 1: Problem Statement (30 seconds)**

**What to show:**

- **Problem 1**: No standardized way to assess trustworthiness of Hedera accounts
- **Problem 2**: Manual reputation checking is slow and expensive
- **Problem 3**: Agents need automated trust assessment for autonomous decisions
- **Problem 4**: No decentralized marketplace for reputation data

**Visual elements:**

- Show a marketplace scenario (agents trying to transact)
- Highlight the complexity of manual trust assessment
- Emphasize the need for autonomous decision-making

**Key talking points:**

> "In a decentralized agent economy, how do agents know who to trust? How do they assess the reputation of a Hedera account before entering into a transaction? Currently, there's no standardized, automated way to do this. That's where TrustScore Oracle comes in."

---

### **Section 2: Solution Overview (1 minute)**

**What to show:**

- **Architecture diagram** (A2A → AP2 → x402 → Analytics → HCS)
- **Key components**:
  - Producer Agent (sells trust scores)
  - Consumer Agent (buys trust scores)
  - Mesh Orchestrator (coordinates agents)
  - Arkhia Analytics (on-chain data)
  - x402 Payment Gateway (payment-gated access)

**Visual elements:**

- Animated flow diagram showing the complete workflow
- Highlight each component as you explain it

**Key talking points:**

> "TrustScore Oracle implements a complete autonomous agent workflow. Consumer agents discover trust score products, negotiate prices via AP2 protocol, pay via x402 micropayments, receive computed scores based on real Hedera on-chain analytics, and all transactions are logged immutably on HCS. Everything happens autonomously without human intervention."

**Technical highlights for judges:**

- ✅ Complete A2A protocol implementation
- ✅ AP2 negotiation protocol (dynamic pricing)
- ✅ x402 payment standard (HBAR micropayments)
- ✅ Real Arkhia API integration (live Hedera data)
- ✅ HCS-10 event logging (immutable audit trail)
- ✅ Production-ready code with error handling

---

### **Section 3: Real-World Use Cases (2 minutes)**

**What to show: Live demos of 3-4 real use cases**

#### **Use Case 1: Marketplace Trust Assessment (40 seconds)**

**Scenario**: A decentralized marketplace where buyers and sellers are autonomous agents.

**Demo flow:**

1. **Setup**: Show a marketplace with buyer and seller agents
2. **Problem**: Buyer agent needs to assess seller's reputation before purchase
3. **Solution**: Consumer agent requests trust score for seller's account
4. **Result**: Trust score returned (e.g., 85/100) → Buyer agent proceeds with confidence

**What to show visually:**

```
Buyer Agent: "I need to verify seller 0.0.1234567"
     ↓
Consumer Agent: Request trust score
     ↓
Producer Agent: Computes score from Arkhia data
     ↓
Result: Trust Score 85/100 (Account Age: 20pts, Diversity: 18pts, ...)
     ↓
Buyer Agent: "Trust score 85 - Proceeding with transaction"
```

**Business impact:**

- ✅ Reduces fraud risk in marketplace transactions
- ✅ Enables autonomous agent-to-agent commerce
- ✅ Builds trust in decentralized marketplaces

**Code snippet to show:**

```typescript
// Buyer agent assesses seller
const trustScore = await consumer.requestTrustScore(sellerAccountId);
if (trustScore.score >= 70) {
  // Proceed with transaction
  await completePurchase();
}
```

---

#### **Use Case 2: B2B Credit Assessment (40 seconds)**

**Scenario**: A B2B lending platform that needs to assess creditworthiness.

**Demo flow:**

1. **Setup**: Show a lending platform receiving loan application
2. **Problem**: Platform needs to assess borrower's creditworthiness
3. **Solution**: Consumer agent requests trust score for borrower's account
4. **Result**: Trust score with risk flags → Platform makes lending decision

**What to show visually:**

```
Lending Platform: "New loan application from 0.0.7654321"
     ↓
Consumer Agent: Request trust score
     ↓
Producer Agent: Computes score (detects risk flags)
     ↓
Result: Trust Score 45/100
        Risk Flags: ["Rapid Outflow", "Low Activity"]
     ↓
Lending Platform: "Risk too high - Rejecting loan"
```

**Business impact:**

- ✅ Enables automated credit decisions
- ✅ Reduces default risk through on-chain analytics
- ✅ Supports DeFi lending protocols

**Code snippet to show:**

```typescript
const score = await consumer.requestTrustScore(borrowerAccountId);
if (score.score < 50 || score.riskFlags.length > 0) {
  // Reject loan application
  rejectLoan();
}
```

---

#### **Use Case 3: Supply Chain Vendor Verification (40 seconds)**

**Scenario**: A supply chain platform that needs to verify vendor reliability.

**Demo flow:**

1. **Setup**: Show a procurement system selecting vendors
2. **Problem**: Platform needs to verify vendor's transaction history
3. **Solution**: Consumer agent requests trust score for vendor account
4. **Result**: Trust score with detailed components → Platform selects reliable vendor

**What to show visually:**

```
Procurement System: "Selecting vendor for $10,000 order"
     ↓
Consumer Agent: Request trust scores for 3 vendor candidates
     ↓
Producer Agent: Computes scores for each vendor
     ↓
Results:
  Vendor A: 90/100 (Established, High Diversity, Stable)
  Vendor B: 60/100 (New, Low Activity)
  Vendor C: 75/100 (Mature, Moderate Risk)
     ↓
Procurement System: "Selecting Vendor A (highest trust score)"
```

**Business impact:**

- ✅ Automated vendor selection based on on-chain reputation
- ✅ Reduces supply chain risk
- ✅ Enables autonomous B2B transactions

**Code snippet to show:**

```typescript
const vendors = ["0.0.vendor1", "0.0.vendor2", "0.0.vendor3"];
const scores = await Promise.all(
  vendors.map((id) => consumer.requestTrustScore(id))
);
const bestVendor = scores.reduce((best, current) =>
  current.score > best.score ? current : best
);
selectVendor(bestVendor);
```

---

#### **Use Case 4: Agent-to-Agent Negotiation (40 seconds)**

**Scenario**: Autonomous agents negotiating contracts based on trust scores.

**Demo flow:**

1. **Setup**: Show two agents negotiating a service contract
2. **Problem**: Service provider agent needs to verify client's payment history
3. **Solution**: Consumer agent requests trust score for client account
4. **Result**: Trust score informs negotiation terms (pricing, payment schedule)

**What to show visually:**

```
Service Provider Agent: "New client 0.0.9999999 - Negotiating contract"
     ↓
Consumer Agent: Request trust score
     ↓
Producer Agent: Computes score (high trust score, stable history)
     ↓
Result: Trust Score 88/100
        Components: Stable payments, High diversity, Established account
     ↓
Service Provider Agent: "Offering favorable terms (payments over 30 days)"
Client Agent: "Agreement accepted"
```

**Business impact:**

- ✅ Enables autonomous contract negotiation
- ✅ Trust-based pricing and terms
- ✅ Reduces risk in agent-to-agent commerce

---

### **Section 4: How Users Can Use the Service (1.5 minutes)**

**What to show: Live code demonstration**

#### **Part A: Producer Agent Setup (30 seconds)**

**Demo steps:**

1. Show terminal starting producer agent
2. Show API server starting on port 3001
3. Show health check endpoint working
4. Show product registry (trustscore.basic.v1)

**What to show:**

```bash
$ npm run demo:trustscore-oracle

🚀 Starting TrustScore Producer Agent...
✅ Producer agent initialized
✅ API Server running on http://localhost:3001
✅ Product registered: trustscore.basic.v1
   Price: 0.3 HBAR
   Rate Limit: 100 calls / 86400s
```

**Key talking points:**

> "Setting up the Producer Agent is simple. Just run one command, and you get a payment-gated API server that computes and sells trust scores. The producer automatically registers its product in the marketplace, sets pricing, and handles all payment verification."

---

#### **Part B: Consumer Agent Usage (30 seconds)**

**Demo steps:**

1. Show consumer agent code initializing
2. Show product discovery
3. Show AP2 negotiation
4. Show trust score request

**What to show:**

```typescript
// Initialize consumer agent
const consumer = new TrustScoreConsumerAgent();
await consumer.init();

// Discover available products
const products = await consumer.discoverProducts();
console.log("Available products:", products);
// Output: [{ productId: 'trustscore.basic.v1', price: '0.3', ... }]

// Negotiate price (optional)
const offer = await consumer.negotiatePrice(
  "trustscore.basic.v1",
  "http://localhost:3001"
);
console.log("Negotiated offer:", offer);

// Request trust score (handles payment automatically)
const trustScore = await consumer.requestTrustScore("0.0.1234567");
console.log("Trust Score:", trustScore.score);
console.log("Components:", trustScore.components);
console.log("Risk Flags:", trustScore.riskFlags);
```

**Key talking points:**

> "Using the Consumer Agent is just as simple. Initialize the agent, discover products, optionally negotiate pricing, and request trust scores. The consumer agent handles all the complexity: payment processing, retry logic, error handling. You just call one method and get back a trust score."

---

#### **Part C: Direct API Usage (30 seconds)**

**Demo steps:**

1. Show initial request (returns 402 Payment Required)
2. Show payment requirements JSON
3. Show payment processing via x402 facilitator
4. Show retry request with X-PAYMENT header
5. Show trust score response

**What to show:**

```bash
# Step 1: Initial request (no payment)
$ curl http://localhost:3001/trustscore/0.0.1234567

# Response: 402 Payment Required
{
  "error": {
    "code": "PAYMENT_REQUIRED",
    "payment": {
      "network": "hedera-testnet",
      "asset": "HBAR",
      "payTo": "0.0.producer-account",
      "maxAmountRequired": "0.3",
      ...
    }
  }
}

# Step 2: Pay via x402 facilitator (handled by consumer agent)
# Step 3: Retry with X-PAYMENT header

$ curl -H "X-PAYMENT: <payment-token>" \
       http://localhost:3001/trustscore/0.0.1234567

# Response: 200 OK
{
  "account": "0.0.1234567",
  "score": 85,
  "components": {
    "accountAge": 20,
    "diversity": 18,
    "volatility": 15,
    "tokenHealth": 10,
    "hcsQuality": 10,
    "riskPenalty": 0
  },
  "riskFlags": [],
  "timestamp": 1703123456789
}
```

**Key talking points:**

> "You can also use the API directly. The producer returns 402 Payment Required with all payment details. After paying via the x402 facilitator, you retry with the X-PAYMENT header and get the trust score. This follows the standard x402 payment protocol."

---

### **Section 5: Trust Score Computation Deep Dive (1 minute)**

**What to show: Technical details judges care about**

#### **Trust Score Components (30 seconds)**

**What to show:**

- Breakdown of how trust score is computed
- Show each component and its weight

**Visual breakdown:**

```
Trust Score (0-100) = Sum of Components - Risk Penalties

Components:
├─ Account Age (0-20 pts)
│   ├─ Established (≥365 days): 20 pts
│   ├─ Mature (90-364 days): 10 pts
│   └─ New (<90 days): 3 pts
│
├─ Transaction Diversity (0-20 pts)
│   ├─ High (≥20 unique): 20 pts
│   ├─ Medium (10-19): 10 pts
│   ├─ Low (5-9): 5 pts
│   └─ Very Low (<5): 0 pts
│
├─ Transfer Volatility (0-20 pts)
│   ├─ Low (CV < 0.3): 20 pts
│   ├─ Medium (0.3 ≤ CV < 0.6): 10 pts
│   └─ High (CV ≥ 0.6): 3 pts
│
├─ Token Health (0-10 pts)
│   └─ Based on distribution and holdings
│
└─ HCS Quality (0-10 pts, can be negative)
    ├─ Trusted topics: +2 pts each (max +10)
    └─ Suspicious topics: -5 pts each (max -10)

Risk Flags (subtract from score):
├─ Rapid Outflow: -10 pts
├─ New Account Large Transfer: -15 pts
└─ Malicious Interactions: -20 pts
```

**Key talking points:**

> "The trust score is computed from real Hedera on-chain data via Arkhia API. We analyze account age, transaction diversity, transfer volatility, token holdings, and HCS interactions. Each component is weighted, and risk flags can reduce the final score. The algorithm is designed to reward stable, established accounts while flagging suspicious behavior."

---

#### **Real Data Example (30 seconds)**

**What to show:**

- Show actual account data from Arkhia API
- Show how it's transformed into a trust score

**Demo:**

```typescript
// Real account data from Arkhia
const accountInfo = await arkhiaService.getAccountInfo("0.0.7132813");
// Account created: 2023-06-15 (180 days ago)

const transactions = await arkhiaService.getTransactions("0.0.7132813", 100);
// Found 45 transactions with 28 unique counterparties

const tokenBalances = await arkhiaService.getTokenBalances("0.0.7132813");
// 5 different tokens, balanced distribution

// Trust score computation
const score = computationEngine.computeTrustScore({
  accountInfo,
  transactions,
  tokenBalances,
  hcsMessages: [],
});

// Result:
// Account Age: 10 pts (Mature, 180 days)
// Diversity: 20 pts (High, 28 unique counterparties)
// Volatility: 18 pts (Low volatility, CV = 0.25)
// Token Health: 8 pts (Balanced portfolio)
// HCS Quality: 7 pts (Some trusted topics)
// Risk Penalty: 0 pts (No flags)
// Final Score: 63/100
```

**Key talking points:**

> "We pull real data from Arkhia API - account info, transactions, token balances. The computation engine analyzes this data, calculates each component score, applies risk flags if any, and returns a final score from 0-100. All of this happens in real-time, so scores are always up-to-date."

---

### **Section 6: Complete Workflow Demo (1 minute)**

**What to show: End-to-end live demo**

**Demo script:**

1. **Start Producer Agent** (10 seconds)
   - Show server starting
   - Show health check
   - Show product registration

2. **Start Consumer Agent** (10 seconds)
   - Show agent initializing
   - Show product discovery
   - Show AP2 negotiation

3. **Request Trust Score** (20 seconds)
   - Show initial request (402)
   - Show payment processing
   - Show trust score response
   - Show HCS event logging

4. **Show Results** (20 seconds)
   - Display trust score breakdown
   - Show components
   - Show risk flags (if any)
   - Show payment verification on-chain

**What to show visually:**

```
Terminal 1 (Producer):
🚀 TrustScore Producer Agent starting...
✅ Server running on http://localhost:3001
✅ Product registered: trustscore.basic.v1

Terminal 2 (Consumer):
🤖 Consumer Agent initializing...
✅ Product discovered: trustscore.basic.v1 (0.3 HBAR)
✅ AP2 negotiation successful
📊 Requesting trust score for 0.0.7132813...
✅ Payment processed (tx: 0.0.xxxxx)
✅ Trust Score received: 63/100

Results:
  Account: 0.0.7132813
  Overall Score: 63/100
  Components:
    - Account Age: 10 pts (Mature, 180 days)
    - Diversity: 20 pts (High, 28 unique counterparties)
    - Volatility: 18 pts (Low, CV=0.25)
    - Token Health: 8 pts (Balanced)
    - HCS Quality: 7 pts (Some trusted topics)
  Risk Flags: None
  Payment Verified: ✅ (tx: 0.0.xxxxx)
  HCS Event Logged: ✅ (topic: 0.0.yyyyy)
```

**Key talking points:**

> "Here's the complete workflow in action. Producer agent starts, registers its product. Consumer agent discovers the product, negotiates price, requests trust score. Payment is processed via x402, trust score is computed from real Hedera data, and the entire transaction is logged immutably on HCS. All of this happens autonomously, end-to-end, in seconds."

---

### **Section 7: Technical Highlights for Judges (30 seconds)**

**What to show: Key technical achievements**

**Technical achievements:**

- ✅ **Complete A2A Protocol**: Agent-to-agent messaging via HCS
- ✅ **AP2 Negotiation**: Dynamic price negotiation between agents
- ✅ **x402 Payment Standard**: Payment-gated API with HBAR micropayments
- ✅ **Arkhia Analytics Integration**: Real-time Hedera on-chain data
- ✅ **HCS-10 Event Logging**: Immutable audit trail for all transactions
- ✅ **Property-Based Testing**: 57 correctness properties verified
- ✅ **Production-Ready**: Error handling, retry logic, circuit breakers

**Code quality metrics:**

- 10+ property-based tests (57 properties defined)
- Comprehensive error handling
- Real API integration (not mocked)
- Production-ready architecture

**Key talking points:**

> "This isn't just a demo - it's production-ready code. We've implemented the complete A2A → AP2 → x402 workflow, integrated real Arkhia analytics, added comprehensive error handling, and verified correctness with property-based tests. The system is ready for real-world use."

---

### **Section 8: Call to Action (30 seconds)**

**What to show:**

- GitHub repository link
- Documentation links
- How to try it yourself

**Key talking points:**

> "You can try TrustScore Oracle yourself. Check out our GitHub repository, read the documentation, and run the demo. Everything is open source and production-ready. Thank you for your time!"

**Links to show:**

- GitHub: `github.com/Hebx/hedron`
- Documentation: `docs/TRUSTSCORE_ORACLE_USER_GUIDE.md`
- Demo: `npm run demo:trustscore-oracle`

---

## 🎬 Production Notes

### **Recording Setup**

- **Two terminal windows**: One for producer, one for consumer
- **Code editor**: Show TypeScript code snippets
- **Browser**: Show API responses (optional)
- **Screen recording**: Capture entire workflow

### **Timing Guidelines**

- **Total duration**: 5-7 minutes
- **Problem/Solution**: 1.5 minutes
- **Use Cases**: 2 minutes
- **How to Use**: 1.5 minutes
- **Deep Dive**: 1 minute
- **Workflow Demo**: 1 minute
- **Technical Highlights**: 0.5 minutes
- **Call to Action**: 0.5 minutes

### **Visual Elements**

- ✅ **Flow diagrams**: Show A2A → AP2 → x402 → Analytics → HCS
- ✅ **Terminal output**: Live code execution
- ✅ **Code snippets**: Highlight key implementation details
- ✅ **API responses**: Show JSON responses
- ✅ **Trust score breakdown**: Visual component breakdown

### **Key Messages for Judges**

1. ✅ **Complete Implementation**: Not just a proof of concept
2. ✅ **Real Integration**: Uses actual Arkhia API (not mocked)
3. ✅ **Production-Ready**: Error handling, retry logic, comprehensive tests
4. ✅ **Autonomous**: Full agent-to-agent workflow without human intervention
5. ✅ **Decentralized**: Payment-gated, immutable HCS logging
6. ✅ **Real-World Value**: Multiple concrete use cases

---

## 📝 Demo Script Template

### **Opening (30 seconds)**

> "Hi, I'm [Name], and I'm excited to present the TrustScore Oracle - a decentralized reputation marketplace for Hedera accounts. In a world where autonomous agents need to assess trust, we've built a complete solution that enables agents to buy and sell trust scores autonomously."

### **Problem Statement (30 seconds)**

> "The problem is clear: how do autonomous agents know who to trust? How do they assess the reputation of a Hedera account before entering into a transaction? Currently, there's no standardized, automated way to do this. That's where TrustScore Oracle comes in."

### **Solution Overview (1 minute)**

> "TrustScore Oracle implements a complete autonomous agent workflow. Consumer agents discover trust score products, negotiate prices via AP2 protocol, pay via x402 micropayments, receive computed scores based on real Hedera on-chain analytics, and all transactions are logged immutably on HCS. Everything happens autonomously without human intervention."

### **Use Cases (2 minutes)**

> "Let me show you four real-world use cases. First, marketplace trust assessment - buyer agents can verify seller reputation before purchase. Second, B2B credit assessment - lending platforms can assess borrower creditworthiness. Third, supply chain vendor verification - procurement systems can select reliable vendors. Fourth, agent-to-agent negotiation - service providers can verify client payment history."

### **How to Use (1.5 minutes)**

> "Using TrustScore Oracle is simple. For producers, just run one command and you get a payment-gated API server. For consumers, initialize the agent, discover products, and request trust scores. The system handles all the complexity - payment processing, retry logic, error handling."

### **Trust Score Computation (1 minute)**

> "The trust score is computed from real Hedera on-chain data via Arkhia API. We analyze account age, transaction diversity, transfer volatility, token holdings, and HCS interactions. Each component is weighted, and risk flags can reduce the final score."

### **Complete Workflow Demo (1 minute)**

> "Here's the complete workflow in action. Producer starts, consumer discovers product, negotiates price, requests trust score, payment is processed, score is computed, and everything is logged on HCS. All autonomously, end-to-end, in seconds."

### **Technical Highlights (30 seconds)**

> "This is production-ready code. Complete A2A protocol, AP2 negotiation, x402 payments, real Arkhia integration, HCS logging, and comprehensive tests. Ready for real-world use."

### **Closing (30 seconds)**

> "You can try TrustScore Oracle yourself. Check out our GitHub repository and documentation. Everything is open source and production-ready. Thank you!"

---

## 🎯 Key Differentiators to Emphasize

### **For Judges**

1. ✅ **Complete Implementation**: Not a proof of concept - production-ready code
2. ✅ **Real Integration**: Actual Arkhia API (not mocked data)
3. ✅ **Autonomous Workflow**: Full A2A → AP2 → x402 → Analytics → HCS chain
4. ✅ **Payment-Gated**: x402 payment standard implementation
5. ✅ **Immutable Logging**: HCS-10 event logging for audit trail
6. ✅ **Comprehensive Testing**: Property-based tests, integration tests
7. ✅ **Real-World Value**: Concrete use cases (marketplace, lending, supply chain)

### **Technical Excellence**

- Complete protocol implementations (A2A, AP2, x402)
- Real API integration (Arkhia Analytics)
- Production-ready error handling
- Comprehensive documentation
- Property-based testing

### **Innovation**

- First decentralized trust score marketplace for Hedera
- Complete autonomous agent workflow
- Payment-gated API for reputation data
- On-chain analytics integration
- Immutable audit trail

---

## ✅ Checklist Before Recording

- [ ] Producer agent runs successfully
- [ ] Consumer agent runs successfully
- [ ] Trust score computation works with real account
- [ ] Payment flow works end-to-end
- [ ] AP2 negotiation works
- [ ] HCS event logging works
- [ ] Demo account IDs are valid (testnet)
- [ ] Terminal windows are clean and readable
- [ ] Code snippets are formatted correctly
- [ ] API responses are valid JSON
- [ ] Screen recording software is set up
- [ ] Audio is clear and professional
- [ ] Timing is within 5-7 minutes

---

## 📚 Supporting Documentation

**For Judges:**

- `docs/TRUSTSCORE_ORACLE_USER_GUIDE.md` - Complete user guide
- `docs/TRUSTSCORE_ORACLE_API.md` - API documentation
- `docs/TRUSTSCORE_VERIFICATION_REPORT.md` - Technical verification
- `prd.md` - Product requirements document

**For Developers:**

- `demo/trustscore-oracle-demo.ts` - Complete demo code
- `src/agents/TrustScoreProducerAgent.ts` - Producer implementation
- `src/agents/TrustScoreConsumerAgent.ts` - Consumer implementation
- `tests/integration/test-trustscore-oracle-complete.ts` - Integration tests

---

**Last Updated**: 2025-01-XX  
**Version**: 1.0.0  
**Status**: Ready for recording

