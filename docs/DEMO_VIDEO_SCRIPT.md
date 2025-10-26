# Demo Video Script (5 Minutes Max)

## Target Bounty: Best Use of Hedera Agent Kit & Google A2A ($4,000)

---

## Minute 0:00 - Opening (15 seconds)

**[Screen: GitHub Repository]**

"Hi, I'm showing you our hackathon submission for the Hedera Agent Kit & Google A2A bounty. We've built a multi-agent system that autonomously settles NFT royalties in seconds, saving marketplaces $18K per year."

**[Transition to Terminal]**

---

## Minute 0:15 - Problem Statement (45 seconds)

**[Screen: Problem Slide or Diagram]**

"The problem: NFT marketplaces waste $18,000 per year on manual royalty settlement. Every time an NFT sells, marketplace operators manually calculate royalties, manually process payments, and wait 24-48 hours for settlement. This is slow, expensive, and error-prone."

**[Show ROI calculation]**

"At 100 sales per day, that's $50 in daily gas fees alone. Our solution eliminates all of that."

**[Transition to Terminal]**

---

## Minute 1:00 - Solution Overview (1 minute)

**[Screen: Architecture Diagram or Code]**

"Our solution uses three autonomous agents that communicate via A2A protocol:

1. **AnalyzerAgent** - Detects NFT sales and calculates royalties
2. **VerifierAgent** - Validates royalty calculations and approves payments
3. **SettlementAgent** - Executes cross-chain payments autonomously

All agents communicate using the Google A2A protocol on Hedera's Consensus Service, and can negotiate payment terms with human-in-the-loop approval for high-value transactions."

**[Transition to Live Demo]**

---

## Minute 2:00 - Live Demo (2 minutes)

**[Screen: Terminal showing `npm run demo:hackathon`]**

"Let me show you this in action. First, I'll start our hackathon demo..."

**[Run command in terminal, show output]**

```bash
npm run demo:hackathon 0.0.123456 50
```

### Show Initialization (30 seconds)

"As you can see, three agents are initializing on the Hedera testnet. Notice they're using A2A protocol for communication - each agent has a unique ID and capabilities."

**[Highlight in output:**

```
✅ AnalyzerAgent: Ready (HCS-10 Compatible)
✅ VerifierAgent: Ready (HCS-10 Compatible)
✅ SettlementAgent: Ready (HCS-10 Compatible)
```

### Show Analysis Phase (30 seconds)

"Now AnalyzerAgent is detecting an NFT sale. It queries the Hedera account, calculates the balance, and determines that the 10% royalty threshold has been met."

**[Highlight:]**

```
💰 Analysis: 10% royalty = 10 HBAR
✓ Sale confirmed
```

### Show Verification Phase (20 seconds)

"VerifierAgent receives the analysis via A2A protocol and validates the royalty calculation. It approves the payment and routes it to SettlementAgent."

**[Highlight:]**

```
🔐 Verification: APPROVED
Reason: Royalty calculation confirmed
```

### Show Human-in-the-Loop (20 seconds)

"This is where it gets interesting. For high-value payments, we can enable human-in-the-loop mode. Here's the approval request..."

**[Show HITL prompt]**

"If the payment exceeds our $100 threshold, we pause and request human approval. This gives you control over high-value transactions while still automating routine ones."

**[Type 'y' to approve]**

### Show Settlement (20 seconds)

"Finally, SettlementAgent executes the payment. You can see it creating the AP2 payment request, verifying it, and executing the actual USDC transfer on Base Sepolia."

**[Highlight:]**

```
💳 Executing AP2 payment
✅ Transaction: 0x1234...
🔗 Verify: https://sepolia.basescan.org/tx/0x1234...
```

### Show Transaction Verification (10 seconds)

"Here's the transaction on BaseScan - you can verify it in real-time. Complete transparency, complete audit trail."

**[Open BaseScan URL]**

---

## Minute 4:00 - Technical Deep Dive (45 seconds)

**[Screen: Code snippets or Architecture diagram]**

"Let me highlight some of the key innovations:

**A2A Protocol Implementation** - We implemented the full Google A2A protocol for agent communication, including handshake, negotiation, and messaging.

**AP2 Payment Protocol** - We added AP2 support for autonomous agent-to-agent payments on Hedera.

**Human-in-the-Loop Mode** - Hybrid autonomous/manual mode with configurable approval thresholds.

**Multi-Agent Negotiation** - Agents can counter-offer and negotiate payment terms autonomously.

**Cross-Chain Integration** - Works seamlessly on Hedera (native HBAR) and Base (USDC)."

**[Show code snippet]**

```typescript
// A2A Protocol
const a2a = new A2AProtocol(hcsClient, agentId, ["payment"]);
await a2a.sendMessage(topicId, receiverId, "request", payload);

// HITL Mode
const hitl = new HumanInTheLoopMode({ enabled: true });
const approval = await hitl.requestApproval({ action: "payment" });
```

---

## Minute 4:45 - Impact & Next Steps (15 seconds)

**[Screen: Results/Metrics]**

"Results: Instant settlement, $18K annual savings, zero manual work. This system runs 24/7, trustless, with complete on-chain verification."

**[Close with GitHub link]**

"Try it yourself at github.com/Hebx/hedera-a2a-agents. Thanks for watching!"

---

## Production Notes

### Voice-Over Script

- Speak at approximately 150 words per minute
- Emphasize key features: A2A, AP2, HITL, Multi-agent negotiation
- Show enthusiasm about technical innovations
- Keep it conversational and engaging

### Video Editing

- Add transitions between sections
- Highlight key terminal output
- Show code snippets with syntax highlighting
- Add text overlays for important points
- Use smooth camera movement/zooms
- Add background music (subtle, non-distracting)

### Tips

- Practice the demo several times before recording
- Have a clean terminal with good font size
- Test all commands beforehand
- Show actual transaction links on chain explorer
- Keep it under 5 minutes strictly

### Recording Tools

- Use OBS Studio or similar for screen recording
- 1080p minimum resolution
- Good audio quality (microphone close)
- Minimize distractions in background
- Professional intro/outro if possible

### What NOT to Include

- ❌ Pauses or mistakes
- ❌ Unnecessary setup (do it off-screen)
- ❌ Long compilation waits
- ❌ Repeated information
- ❌ Going over 5 minutes

### Key Highlights to Show

1. **Multi-Agent System Working** ✅
2. **A2A Protocol in Action** ✅
3. **Human-in-the-Loop Approval** ✅
4. **AP2 Payment Execution** ✅
5. **On-Chain Verification** ✅
6. **Live Transaction on Explorer** ✅

---

## Demo Checklist

Before recording:

- [ ] All agents working
- [ ] Test accounts funded
- [ ] Demo runs smoothly
- [ ] Transaction links ready
- [ ] Environment configured
- [ ] No errors in demo

During recording:

- [ ] Run demo smoothly
- [ ] Explain each step
- [ ] Show key features
- [ ] Keep under 5 minutes
- [ ] Clear audio
- [ ] Good screen quality

After recording:

- [ ] Edit for smoothness
- [ ] Add transitions
- [ ] Add music (optional)
- [ ] Export to mp4
- [ ] Upload to YouTube/Vimeo
- [ ] Share link in submission

---

## Estimated Timeline

- Intro: 15 seconds
- Problem: 45 seconds
- Solution: 1 minute
- Demo: 2 minutes
- Technical Deep Dive: 45 seconds
- Close: 15 seconds
- **Total: 5 minutes**
