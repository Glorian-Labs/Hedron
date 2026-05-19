/**
 * PayAI x402 facilitator adapter — interface skeleton.
 *
 * PayAI is one supported x402 facilitator focused on Base + Solana. Hedron
 * does not assume PayAI; the adapter re-verifies settlement on-chain before
 * reporting PAYMENT_VERIFIED.
 *
 * v0.2 Tier 1 M7 target: real PayAI handshake behind RUN_PAYAI_INTEGRATION.
 */

import type { PaymentAdapter, PaymentRail } from '../types'

export interface PayAiAdapterOptions {
  facilitatorUrl: string
  network: string
  apiKeyRef?: string // env var name only — never the value
}

export interface PayAiAdapter extends PaymentAdapter {
  readonly rail: Extract<PaymentRail, 'payai'>
}

export const PAYAI_RAIL: PaymentRail = 'payai'
