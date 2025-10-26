# 🏆 Hackathon Quick Start Guide

## 60-Second Setup

```bash
# 1. Clone and install
git clone https://github.com/Hebx/hedera-a2a-agents.git
cd hedera-a2a-agents
npm install

# 2. Configure credentials
cp env.example .env
# Edit .env with your testnet credentials

# 3. Run the hackathon demo
npm run demo:hackathon
```

## 🎬 Demo Commands

### Base Sepolia (USDC) Payment

```bash
PAYMENT_NETWORK=base-sepolia npm run demo:hackathon 0.0.123456 50 base-sepolia
```

### Hedera Native (HBAR) Payment

```bash
PAYMENT_NETWORK=hedera-testnet npm run demo:hackathon 0.0.123456 50 hedera-testnet
```

## 📺 What You'll See

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║     🏆 HEDERA HACKATHON DEMO: NFT ROYALTY SETTLEMENT 🏆     ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

📖 Scenario:
  1. Creator sells NFT for 100 HBAR on Hedera
  2. Marketplace needs to pay 10% royalty to creator
  3. Creator prefers USDC on Base Sepolia
  4. Our agents handle this autonomously in seconds

📡 Phase 1: Initializing Autonomous Agents

   ✅ AnalyzerAgent: Ready to analyze NFT sales
   ✅ VerifierAgent: Ready to validate royalty calculations
   ✅ SettlementAgent: Ready to execute cross-chain payments

✨ All agents initialized and ready!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 Phase 2: Analyzing NFT Sale

   📊 Sale Detection:
      Account: 0.0.123456
      Balance: 3846.12525862 ℏ
      Threshold: 50 HBAR

   💡 Analysis:
      ✓ Sale confirmed
      ✓ Royalty calculation: 10% of sale
      ✓ Creator identified

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔐 Phase 3: Verification & Approval (Autonomous)

   📋 Verification Details:
      Proposal: royalty_1234567890
      Status: APPROVED
      Reason: NFT sale confirmed
      Payment: 1 USDC

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 Phase 4: Executing Autonomous Payment

   🌐 Network: Base Sepolia
   💵 Payment Details:
      Amount: 1 USDC
      To: 0xb36faaA498D6E40Ee030fF651330aefD1b8D24D2
      Protocol: X402 Protocol

✅ PAYMENT SUCCESSFULLY SETTLED!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Phase 5: Results Summary

   ✅ Status: COMPLETED
   🌐 Network: Base Sepolia
   💰 Amount: 1 USDC
   ⏱️  Time: ~5 seconds
   💵 Fees: $0.05

   🔗 Verify Transaction:
      https://sepolia.basescan.org/tx/0x399ff074...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💼 Phase 6: Business Impact

   📈 Traditional Process:
      ❌ Manual processing
      ❌ 24-48 hour delays
      ❌ $50/day in gas fees
      ❌ Human error risk

   🚀 Our Solution:
      ✅ Autonomous execution
      ✅ 5-10 second settlement
      ✅ $0.05/transaction fees
      ✅ Zero human intervention

   💰 Annual Savings: $18,247 per marketplace

🎉 DEMO COMPLETE!
```

## 🎯 Key Points to Highlight

1. **Autonomous Operation**: No human intervention required
2. **Dual Network Support**: Base (USDC) + Hedera (HBAR)
3. **Cross-Chain Settlement**: Seamless payment execution
4. **Ultra-Low Fees**: $0.0001 on Hedera, $0.05 on Base
5. **Instant Settlement**: 5-10 second processing time
6. **Real On-Chain Verification**: All transactions verifiable

## 📊 Competition Pitch

**Problem**: NFT marketplaces waste $18K/year on manual royalty settlement  
**Solution**: Autonomous agents that settle payments in seconds  
**Impact**: Instant payments, $18K savings, zero manual work  
**Innovation**: X402 protocol + Hedera Consensus Service + Multi-agent architecture

## 🔗 Important Links

- **GitHub**: https://github.com/Hebx/hedera-a2a-agents
- **PR**: https://github.com/Hebx/hedera-a2a-x402-agents/pull/1
- **Full Demo**: `npm run demo:hackathon`
- **Documentation**: See `docs/HACKATHON_DEMO.md`

## ✅ Demo Checklist

- [ ] Clone repository
- [ ] Install dependencies: `npm install`
- [ ] Configure `.env` file
- [ ] Test demo: `npm run demo:hackathon`
- [ ] Have transaction URLs ready
- [ ] Prepare pitch script
- [ ] Rehearse demo flow

---

**Good luck at the hackathon! 🚀**
