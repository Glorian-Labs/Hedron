/**
 * EVM settlement adapter — optional, off by default.
 *
 * v0.2 Tier 1 explicitly does not block on cross-chain rails. This file
 * documents the contract for future contributors.
 */

import type { PaymentAdapter, PaymentRail } from '../types'

export interface EvmAdapterOptions {
  rpcUrl: string
  chainId: number
  usdcContract: string
  merchantAddress: string
  settlementKeyRef: string
}

export interface EvmAdapter extends PaymentAdapter {
  readonly rail: Extract<PaymentRail, 'evm-usdc'>
}

export const EVM_RAIL: PaymentRail = 'evm-usdc'
