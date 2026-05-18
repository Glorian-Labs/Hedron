/**
 * x402 Hedera-exact-scheme settlement adapter — interface skeleton.
 *
 * Aligned with the Hedera exact payment scheme accepted into x402:
 *   https://github.com/x402-foundation/x402/blob/main/typescript/packages/mechanisms/hedera/README.md
 *
 * v0.2 Tier 1 M7 target: implement embedded facilitator + delegated mode.
 */

import type { PaymentAdapter, PaymentRail } from '../types'

export interface X402AdapterOptions {
  facilitatorUrl?: string // empty = embedded mode (Hedron-hosted facilitator)
  network: 'testnet' | 'mainnet'
}

export interface X402Adapter extends PaymentAdapter {
  readonly rail: Extract<PaymentRail, 'x402'>
}

export const X402_RAIL: PaymentRail = 'x402'
