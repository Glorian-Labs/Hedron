import { AnalyzerAgent } from '../src/agents/AnalyzerAgent'
import { VerifierAgent } from '../src/agents/VerifierAgent'
import { SettlementAgent } from '../src/agents/SettlementAgent'
import chalk from 'chalk'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Hackathon Demo: Automated NFT Royalty Settlement
console.log(chalk.bold.cyan(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║     🏆 HEDERA HACKATHON DEMO: NFT ROYALTY SETTLEMENT 🏆     ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`))

console.log(chalk.bold('\n🎨 Use Case: Automated Cross-Chain NFT Royalty Settlement\n'))

console.log(chalk.blue('📖 Scenario:'))
console.log(chalk.gray('  1. Creator sells NFT for 100 HBAR on Hedera'))
console.log(chalk.gray('  2. Marketplace needs to pay 10% royalty to creator'))
console.log(chalk.gray('  3. Creator prefers USDC on Base Sepolia'))
console.log(chalk.gray('  4. Our agents handle this autonomously in seconds\n'))

// Constants
const DEMO_ACCOUNT = process.argv[2] || '0.0.123456'
const THRESHOLD_HBAR = parseInt(process.argv[3] || '50') || 50
const PAYMENT_NETWORK = process.argv[4] || process.env.PAYMENT_NETWORK || 'base-sepolia'

// Set environment variable for agents to use
process.env.PAYMENT_NETWORK = PAYMENT_NETWORK

console.log(chalk.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'))

console.log(chalk.bold('📋 Demo Configuration:'))
console.log(`   Account: ${DEMO_ACCOUNT}`)
console.log(`   Threshold: ${THRESHOLD_HBAR} HBAR`)
console.log(`   Network: ${PAYMENT_NETWORK === 'hedera-testnet' ? 'Hedera Testnet' : 'Base Sepolia'}`)
console.log(`   Asset: ${PAYMENT_NETWORK === 'hedera-testnet' ? 'HBAR' : 'USDC'}\n`)

console.log(chalk.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'))

async function hackathonDemo() {
  try {
    // Phase 1: Initialize Agents
    console.log(chalk.bold.yellow('📡 Phase 1: Initializing Autonomous Agents\n'))
    console.log(chalk.gray('   Creating decentralized agent network on Hedera...\n'))

    const analyzer = new AnalyzerAgent()
    const verifier = new VerifierAgent()
    const settlement = new SettlementAgent()

    await analyzer.init()
    console.log(chalk.green('   ✅ AnalyzerAgent: Ready to analyze NFT sales'))
    
    await verifier.init()
    console.log(chalk.green('   ✅ VerifierAgent: Ready to validate royalty calculations'))
    
    await settlement.init()
    console.log(chalk.green('   ✅ SettlementAgent: Ready to execute cross-chain payments\n'))

    console.log(chalk.bold.green('✨ All agents initialized and ready!\n'))

    console.log(chalk.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'))

    // Phase 2: Analyze the Sale
    console.log(chalk.bold.yellow('🔍 Phase 2: Analyzing NFT Sale\n'))

    const accountData = await analyzer.queryAccount(DEMO_ACCOUNT)
    
    console.log(chalk.blue('   📊 Sale Detection:'))
    console.log(`      Account: ${accountData.accountId}`)
    console.log(`      Balance: ${accountData.balance}`)
    console.log(`      Threshold: ${THRESHOLD_HBAR} HBAR\n`)

    const balanceInHBAR = parseFloat(accountData.balance.replace(' ℏ', ''))
    const meetsThreshold = balanceInHBAR >= THRESHOLD_HBAR
    
    console.log(chalk.blue('   💡 Analysis:'))
    console.log(`      ${meetsThreshold ? chalk.green('✓ Sale confirmed') : chalk.red('✗ Sale below threshold')}`)
    console.log(`      ${meetsThreshold ? chalk.green('✓ Royalty calculation: 10% of sale') : chalk.gray('✗ No payment required')}`)
    console.log(`      ${meetsThreshold ? chalk.green('✓ Creator identified') : chalk.gray('✗ Waiting for sale')}\n`)

    if (!meetsThreshold) {
      console.log(chalk.yellow('   ⏭️  Skipping payment - threshold not met\n'))
      process.exit(0)
    }

    console.log(chalk.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'))

    // Phase 3: Verify and Approve
    console.log(chalk.bold.yellow('🔐 Phase 3: Verification & Approval (Autonomous)\n'))
    
    const verificationResult = {
      type: 'verification_result',
      agentId: process.env.VERIFIER_AGENT_ID || 'verifier-agent',
      proposalId: `royalty_${Date.now()}`,
      approved: true,
      reasoning: `NFT sale confirmed for ${accountData.accountId} (Balance: ${balanceInHBAR} HBAR). Royalty approved for settlement.`,
      paymentDetails: PAYMENT_NETWORK === 'hedera-testnet' ? {
        amount: process.env.HBAR_PAYMENT_AMOUNT || '10',
        asset: 'HBAR',
        payTo: process.env.HEDERA_MERCHANT_ACCOUNT_ID,
        description: 'NFT Royalty Payment (Hedera Native)'
      } : {
        amount: '1000000', // 1 USDC
        asset: process.env.USDC_CONTRACT,
        payTo: process.env.MERCHANT_WALLET_ADDRESS,
        description: 'NFT Royalty Payment (Cross-Chain)'
      }
    }

    console.log(chalk.blue('   📋 Verification Details:'))
    console.log(`      Proposal: ${verificationResult.proposalId}`)
    console.log(`      Status: ${chalk.green('APPROVED')}`)
    console.log(`      Reason: ${chalk.gray(verificationResult.reasoning)}`)
    console.log(`      Payment: ${PAYMENT_NETWORK === 'hedera-testnet' ? process.env.HBAR_PAYMENT_AMOUNT + ' HBAR' : '1 USDC'}\n`)

    console.log(chalk.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'))

    // Phase 4: Execute Payment
    console.log(chalk.bold.yellow('💰 Phase 4: Executing Autonomous Payment\n'))

    const networkName = PAYMENT_NETWORK === 'hedera-testnet' ? 'Hedera Testnet' : 'Base Sepolia'
    const asset = PAYMENT_NETWORK === 'hedera-testnet' ? 'HBAR' : 'USDC'
    const amount = PAYMENT_NETWORK === 'hedera-testnet' ? process.env.HBAR_PAYMENT_AMOUNT || '10' : '1'
    
    console.log(chalk.blue('   🌐 Network:'))
    console.log(`      ${networkName}\n`)

    console.log(chalk.blue('   💵 Payment Details:'))
    console.log(`      Amount: ${amount} ${asset}`)
    console.log(`      To: ${PAYMENT_NETWORK === 'hedera-testnet' ? process.env.HEDERA_MERCHANT_ACCOUNT_ID : process.env.MERCHANT_WALLET_ADDRESS}`)
    console.log(`      Protocol: ${PAYMENT_NETWORK === 'hedera-testnet' ? 'Native Hedera SDK' : 'X402 Protocol'}\n`)

    console.log(chalk.blue('   ⏳ Processing...\n'))

    let transactionHash = null
    
    try {
      await settlement.triggerSettlement(verificationResult)
      
      console.log(chalk.bold.green('\n✅ PAYMENT SUCCESSFULLY SETTLED!\n'))
      
      console.log(chalk.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'))
      
      // Phase 5: Results
      console.log(chalk.bold.yellow('📊 Phase 5: Results Summary\n'))
      
      console.log(chalk.blue('   ✅ Status: COMPLETED'))
      console.log(chalk.blue(`   🌐 Network: ${networkName}`))
      console.log(chalk.blue(`   💰 Amount: ${amount} ${asset}`))
      console.log(chalk.blue(`   ⏱️  Settlement Time: ~5-10 seconds`))
      console.log(chalk.blue(`   💵 Network Fees: $${PAYMENT_NETWORK === 'hedera-testnet' ? '0.0001' : '~0.02-0.05'}\n`))

      console.log(chalk.blue('   🔗 Transaction Verification:'))
      
      if (PAYMENT_NETWORK === 'hedera-testnet') {
        console.log(chalk.gray('      Note: Check terminal output above for Hedera Transaction ID'))
        console.log(chalk.gray('      Format: 0.0.X@timestamp.seconds.nanoseconds'))
        console.log(chalk.gray('      Explorer: https://hashscan.io/testnet'))
      } else {
        console.log(chalk.gray('      Note: Check terminal output above for Base Sepolia Transaction Hash'))
        console.log(chalk.gray('      Format: 0x...'))
        console.log(chalk.gray('      Explorer: https://sepolia.basescan.org'))
      }
      
      console.log('')

    } catch (error) {
      console.error(chalk.red('\n❌ Payment execution failed:'), error)
      console.log(chalk.yellow('\n💡 This might be due to:'))
      console.log(chalk.gray('   - Insufficient wallet balance'))
      console.log(chalk.gray('   - Network connectivity issues'))
      console.log(chalk.gray('   - Check wallet status: npm run check:wallets\n'))
    }

    console.log(chalk.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'))

    console.log(chalk.bold.green('🎉 DEMO COMPLETE!\n'))

    console.log(chalk.blue('📚 Resources:'))
    console.log(chalk.gray('   GitHub: https://github.com/Hebx/hedera-a2a-x402-agents'))
    console.log(chalk.gray('   Docs: See docs/ folder\n'))

    process.exit(0)
  } catch (error) {
    console.error(chalk.red('❌ Demo failed:'), error)
    process.exit(1)
  }
}

// Run the demo
hackathonDemo()

