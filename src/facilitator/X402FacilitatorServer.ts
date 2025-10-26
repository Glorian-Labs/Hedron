import { verifyPayment, settlePayment } from 'a2a-x402'
import { ethers } from 'ethers'
import chalk from 'chalk'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

export class X402FacilitatorServer {
  private provider: ethers.JsonRpcProvider
  private wallet: ethers.Wallet

  constructor() {
    const baseRpcUrl = process.env.BASE_RPC_URL
    const walletPrivateKey = process.env.SETTLEMENT_WALLET_PRIVATE_KEY

    if (!baseRpcUrl || !walletPrivateKey) {
      throw new Error('Missing required environment variables: BASE_RPC_URL and SETTLEMENT_WALLET_PRIVATE_KEY')
    }

    this.provider = new ethers.JsonRpcProvider(baseRpcUrl)
    this.wallet = new ethers.Wallet(walletPrivateKey, this.provider)
  }

  // POST /verify endpoint
  async verify(paymentHeader: string, paymentRequirements: any): Promise<any> {
    try {
      console.log(chalk.blue('🔍 Facilitator: Verifying payment locally...'))
      
      // Decode payment header
      const paymentPayload = JSON.parse(Buffer.from(paymentHeader, 'base64').toString())
      
      // Local verification logic instead of HTTP call
      const isValid = this.validatePaymentLocally(paymentPayload, paymentRequirements)
      
      if (isValid) {
        console.log(chalk.green('✅ Facilitator: Payment verification successful'))
        return { isValid: true, invalidReason: null }
      } else {
        console.log(chalk.red('❌ Facilitator: Payment verification failed'))
        return { isValid: false, invalidReason: 'Local validation failed' }
      }
    } catch (error) {
      console.error('❌ Facilitator: Verification error:', error)
      return {
        isValid: false,
        invalidReason: `Verification error: ${(error as Error).message}`
      }
    }
  }

  // Local payment validation
  private validatePaymentLocally(paymentPayload: any, requirements: any): boolean {
    try {
      // Check x402 version
      if (paymentPayload.x402Version !== 1) {
        console.log(chalk.red('❌ Invalid x402 version'))
        return false
      }

      // Check scheme matches
      if (paymentPayload.scheme !== requirements.scheme) {
        console.log(chalk.red('❌ Scheme mismatch'))
        return false
      }

      // Check network matches
      if (paymentPayload.network !== requirements.network) {
        console.log(chalk.red('❌ Network mismatch'))
        return false
      }

      // Check authorization exists
      const authorization = paymentPayload.payload?.authorization
      if (!authorization) {
        console.log(chalk.red('❌ No authorization found'))
        return false
      }

      // Check amount matches
      if (authorization.value !== requirements.maxAmountRequired) {
        console.log(chalk.red('❌ Amount mismatch'))
        return false
      }

      // Check recipient matches
      if (authorization.to !== requirements.payTo) {
        console.log(chalk.red('❌ Recipient mismatch'))
        return false
      }

      // Check validity period
      const now = Math.floor(Date.now() / 1000)
      if (authorization.validBefore && now > authorization.validBefore) {
        console.log(chalk.red('❌ Payment expired'))
        return false
      }

      console.log(chalk.green('✅ All local validations passed'))
      return true
    } catch (error) {
      console.error('❌ Local validation error:', error)
      return false
    }
  }

  // POST /settle endpoint
  async settle(paymentHeader: string, paymentRequirements: any): Promise<any> {
    try {
      console.log(chalk.blue('🏦 Facilitator: Settling payment locally...'))
      
      // Decode payment header
      const paymentPayload = JSON.parse(Buffer.from(paymentHeader, 'base64').toString())
      
      // Execute actual USDC transfer
      const txHash = await this.executeUSDCTransfer(paymentPayload, paymentRequirements)
      
      if (txHash) {
        console.log(chalk.green('✅ Facilitator: Payment settled successfully'))
        console.log(chalk.blue(`📋 Transaction Hash: ${txHash}`))
        console.log(chalk.blue(`📋 Network: base-sepolia`))
        
        return {
          success: true,
          error: null,
          txHash: txHash,
          networkId: 'base-sepolia'
        }
      } else {
        console.log(chalk.red('❌ Facilitator: Payment settlement failed'))
        return {
          success: false,
          error: 'Failed to execute USDC transfer',
          txHash: null,
          networkId: null
        }
      }
    } catch (error) {
      console.error('❌ Facilitator: Settlement error:', error)
      return {
        success: false,
        error: `Settlement error: ${(error as Error).message}`,
        txHash: null,
        networkId: null
      }
    }
  }

  // Execute actual USDC transfer
  private async executeUSDCTransfer(paymentPayload: any, requirements: any): Promise<string | null> {
    try {
      console.log(chalk.blue('💰 Executing actual USDC transfer...'))
      
      const authorization = paymentPayload.payload?.authorization
      if (!authorization) {
        throw new Error('No authorization found in payment payload')
      }

      // Create USDC contract instance
      const usdcContract = new ethers.Contract(
        requirements.asset,
        [
          'function transfer(address to, uint256 amount) returns (bool)',
          'function balanceOf(address account) view returns (uint256)'
        ],
        this.wallet
      )

      // Check balance before transfer
      const balance = await (usdcContract as any).balanceOf(this.wallet.address)
      const amount = BigInt(authorization.value)
      
      console.log(chalk.blue(`📋 Current USDC balance: ${ethers.formatUnits(balance, 6)} USDC`))
      console.log(chalk.blue(`📋 Transfer amount: ${ethers.formatUnits(amount, 6)} USDC`))
      console.log(chalk.blue(`📋 Recipient: ${authorization.to}`))

      if (balance < amount) {
        throw new Error(`Insufficient USDC balance: ${ethers.formatUnits(balance, 6)} < ${ethers.formatUnits(amount, 6)}`)
      }

      // Execute transfer
      const tx = await (usdcContract as any).transfer(authorization.to, amount)
      console.log(chalk.yellow(`📋 Transaction submitted: ${tx.hash}`))
      
      // Wait for confirmation
      const receipt = await tx.wait()
      console.log(chalk.green(`✅ Transfer confirmed in block: ${receipt.blockNumber}`))
      
      return tx.hash
    } catch (error) {
      console.error('❌ USDC transfer error:', error)
      return null
    }
  }

  // GET /supported endpoint
  getSupportedSchemes(): { kinds: Array<{ scheme: string; network: string }> } {
    return {
      kinds: [
        { scheme: 'exact', network: 'base-sepolia' }
      ]
    }
  }
}
