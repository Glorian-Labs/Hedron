import { ethers } from 'ethers'
import chalk from 'chalk'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

async function fundSettlementWallet(): Promise<void> {
  try {
    console.log(chalk.bold('💰 Funding Settlement Wallet with ETH'))
    console.log('')

    const provider = new ethers.JsonRpcProvider(process.env.BASE_RPC_URL)
    
    // Settlement wallet (needs ETH)
    const settlementWallet = new ethers.Wallet(process.env.SETTLEMENT_WALLET_PRIVATE_KEY!, provider)
    const settlementAddress = await settlementWallet.getAddress()
    
    // Merchant wallet (has ETH)
    const merchantWallet = new ethers.Wallet(process.env.SETTLEMENT_WALLET_PRIVATE_KEY!, provider) // Using same wallet for demo
    const merchantAddress = process.env.MERCHANT_WALLET_ADDRESS!
    
    console.log(chalk.bold('--- Wallet Status Before Transfer ---'))
    const settlementBalance = await provider.getBalance(settlementAddress)
    const merchantBalance = await provider.getBalance(merchantAddress)
    
    console.log(`Settlement Wallet: ${ethers.formatEther(settlementBalance)} ETH`)
    console.log(`Merchant Wallet: ${ethers.formatEther(merchantBalance)} ETH`)
    console.log('')

    if (settlementBalance > ethers.parseEther('0.005')) {
      console.log(chalk.green('✅ Settlement wallet already has sufficient ETH'))
      return
    }

    console.log(chalk.bold('--- Transferring ETH ---'))
    console.log(chalk.yellow('📤 Transferring 0.01 ETH to settlement wallet...'))
    
    // Create a transaction to send ETH
    const tx = await merchantWallet.sendTransaction({
      to: settlementAddress,
      value: ethers.parseEther('0.01'),
      gasLimit: 21000
    })
    
    console.log(chalk.blue('📋 Transaction Hash:'), tx.hash)
    console.log(chalk.yellow('⏳ Waiting for confirmation...'))
    
    await tx.wait()
    
    console.log(chalk.green('✅ Transfer confirmed!'))
    console.log('')

    console.log(chalk.bold('--- Wallet Status After Transfer ---'))
    const newSettlementBalance = await provider.getBalance(settlementAddress)
    const newMerchantBalance = await provider.getBalance(merchantAddress)
    
    console.log(`Settlement Wallet: ${ethers.formatEther(newSettlementBalance)} ETH`)
    console.log(`Merchant Wallet: ${ethers.formatEther(newMerchantBalance)} ETH`)
    console.log('')

    console.log(chalk.green('🎉 Settlement wallet is now funded and ready for payments!'))

  } catch (error) {
    console.error(chalk.red('❌ Funding failed:'), error)
    throw error
  }
}

// Run the funding
fundSettlementWallet()
  .then(() => {
    console.log(chalk.green('\n✅ Funding completed successfully!'))
    process.exit(0)
  })
  .catch((error) => {
    console.error(chalk.red('\n💥 Funding failed:'), error)
    process.exit(1)
  })
