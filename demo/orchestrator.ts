import { AnalyzerAgent } from '../src/agents/AnalyzerAgent'
import { VerifierAgent } from '../src/agents/VerifierAgent'
import { SettlementAgent } from '../src/agents/SettlementAgent'
import chalk from 'chalk'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Constants - npm run demo -- passes args differently
const DEMO_ACCOUNT = process.argv[2] || '0.0.123456'
const THRESHOLD_HBAR = parseInt(process.argv[3] || '50') || 50
const PAYMENT_NETWORK = process.argv[4] || process.env.PAYMENT_NETWORK || 'base-sepolia'

// Helper function for sleep
const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main(): Promise<void> {
  try {
    // Print banner
    console.log(chalk.bold('🤖 Hedera A2A Agent System Demo'))
    console.log(chalk.gray('Query account data and trigger agent coordination workflow'))
    console.log('')

    // Initialize agents
    console.log(chalk.bold('--- Initializing Agents ---'))
    const analyzer = new AnalyzerAgent()
    const verifier = new VerifierAgent()
    const settlement = new SettlementAgent()

    // Call init() on all 3 agents
    await analyzer.init()
    await verifier.init()
    await settlement.init()

    console.log(chalk.green('✓ All agents ready'))
    console.log('')

    // Execute workflow
    console.log(chalk.bold('--- Workflow Starting ---'))
    
    // Query account data
    const accountData = await analyzer.queryAccount(DEMO_ACCOUNT)
    
    // Propose insight (this would normally be a method on AnalyzerAgent)
    console.log(chalk.blue('📊 AnalyzerAgent proposing insight...'))
    console.log(`Account: ${accountData.accountId}`)
    console.log(`Balance: ${accountData.balance}`)
    console.log(`Threshold: ${THRESHOLD_HBAR} HBAR`)
    
    // Analyze threshold and trigger payment if met
    const balanceInHBAR = parseFloat(accountData.balance.replace(' ℏ', ''))
    const meetsThreshold = balanceInHBAR >= THRESHOLD_HBAR
    console.log(chalk.blue(`✓ Proposal: ${meetsThreshold ? 'Meets' : 'Does not meet'} threshold`))
    
    if (meetsThreshold) {
      console.log(chalk.bold('--- Triggering Payment Flow ---'))
      
      const paymentAsset = PAYMENT_NETWORK === 'hedera-testnet' ? 'HBAR' : 'USDC'
      const paymentNetworkName = PAYMENT_NETWORK === 'hedera-testnet' ? 'Hedera Testnet' : 'Base Sepolia'
      
      console.log(chalk.yellow(`💰 Account meets threshold - executing ${paymentAsset} payment on ${paymentNetworkName}`))
      
      // Create verification result for SettlementAgent
      const verificationResult = {
        type: 'verification_result',
        agentId: process.env.VERIFIER_AGENT_ID || 'verifier-agent',
        proposalId: `proposal_${Date.now()}`,
        approved: true,
        reasoning: `Account ${accountData.accountId} meets threshold of ${THRESHOLD_HBAR} HBAR (balance: ${balanceInHBAR} HBAR)`,
        paymentDetails: PAYMENT_NETWORK === 'hedera-testnet' ? {
          amount: process.env.HBAR_PAYMENT_AMOUNT || '10',
          asset: 'HBAR',
          payTo: process.env.HEDERA_MERCHANT_ACCOUNT_ID
        } : {
          amount: '1000000', // 1 USDC in atomic units
          asset: process.env.USDC_CONTRACT,
          payTo: process.env.MERCHANT_WALLET_ADDRESS
        }
      }
      
      console.log(chalk.blue('📋 Payment Details:'))
      console.log(`   Network: ${paymentNetworkName}`)
      if (PAYMENT_NETWORK === 'hedera-testnet') {
        console.log(`   Amount: ${process.env.HBAR_PAYMENT_AMOUNT || '10'} HBAR`)
        console.log(`   To: ${process.env.HEDERA_MERCHANT_ACCOUNT_ID}`)
      } else {
        console.log(`   Amount: 1 USDC`)
        console.log(`   To: ${process.env.MERCHANT_WALLET_ADDRESS}`)
        console.log(`   Asset: ${process.env.USDC_CONTRACT}`)
      }
      console.log('')
      
      // Execute settlement by calling the public triggerSettlement method
      console.log(chalk.yellow('🔧 Executing full x402 payment flow...'))
      console.log(chalk.gray('   1. Creating payment authorization'))
      console.log(chalk.gray('   2. Verifying payment via facilitator'))
      console.log(chalk.gray(`   3. Settling payment and executing ${paymentAsset} transfer`))
      console.log('')
      
      try {
        // Use triggerSettlement to execute the payment
        await settlement.triggerSettlement(verificationResult)
        console.log(chalk.green('✅ Complete x402 payment flow executed successfully!'))
        console.log(chalk.blue(`📋 Real ${paymentAsset} transfer completed on ${paymentNetworkName}`))
        
        if (PAYMENT_NETWORK === 'hedera-testnet') {
          console.log(chalk.blue('📋 Check HashScan for the transaction'))
        } else {
          console.log(chalk.blue('📋 Check BaseScan for the transaction'))
        }
      } catch (error) {
        console.error(chalk.red('❌ Payment execution failed:'), error)
        console.log(chalk.yellow('💡 This might be due to insufficient ETH for gas or USDC balance'))
        console.log(chalk.yellow('💡 Run: npm run check:wallets to verify wallet status'))
      }
    } else {
      console.log(chalk.gray('⏳ Account does not meet threshold - no payment triggered'))
    }
    
    console.log(chalk.gray('⏳ Waiting for agent coordination...'))
    await sleep(5000) // 5 seconds for coordination

    // Print final summary
    console.log(chalk.bold('--- Workflow Complete ---'))
    console.log(chalk.gray('📡 Monitor agent communication:'))
    console.log(chalk.gray(`   HashScan Topic: https://hashscan.io/testnet/topic/${process.env.ANALYZER_TOPIC_ID || 'ANALYZER_TOPIC_ID'}`))
    
    if (PAYMENT_NETWORK === 'hedera-testnet') {
      console.log(chalk.gray(`   HashScan: https://hashscan.io/testnet/search/${process.env.HEDERA_MERCHANT_ACCOUNT_ID}`))
    } else {
      console.log(chalk.gray(`   BaseScan: https://sepolia.basescan.org/address/${process.env.MERCHANT_WALLET_ADDRESS}`))
    }
    
    if (meetsThreshold) {
      const asset = PAYMENT_NETWORK === 'hedera-testnet' ? 'HBAR' : 'USDC'
      const network = PAYMENT_NETWORK === 'hedera-testnet' ? 'Hedera Testnet' : 'Base Sepolia'
      console.log(chalk.green(`💰 Real ${asset} payment executed on ${network}!`))
    }
    console.log('')

    // Exit cleanly
    process.exit(0)
  } catch (error) {
    console.error(chalk.red('❌ Demo failed:'), error)
    process.exit(1)
  }
}

// Run the demo
main()
