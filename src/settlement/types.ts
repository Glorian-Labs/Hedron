/**
 * Payment adapter contract. Every payment rail implements this interface.
 */

export type {
  PaymentRail,
  PaymentRequirement,
  PaymentPayload,
  SettlementIntent,
  SettlementResult,
  SettlementStatus,
  SettlementReceipt,
  SettlementVerification,
  QuoteResponse,
} from '../types'

import type {
  PaymentPayload,
  PaymentRail,
  PaymentRequirement,
  QuoteResponse,
  SettlementReceipt,
  SettlementResult,
  SettlementStatus,
  SettlementVerification,
} from '../types'

export interface PaymentAdapter {
  rail: PaymentRail
  createPaymentRequirement(opts: {
    quote: QuoteResponse
    correlationId: string
  }): Promise<PaymentRequirement>
  validatePaymentPayload(opts: {
    requirement: PaymentRequirement
    payload: PaymentPayload
  }): Promise<SettlementVerification>
  settlePayment(opts: {
    requirement: PaymentRequirement
    payload: PaymentPayload
    idempotencyKey: string
  }): Promise<SettlementResult>
  getSettlementStatus(settlementId: string): Promise<SettlementStatus>
  produceSettlementReceipt(settlementId: string): Promise<SettlementReceipt>
  verifySettlementReceipt(receipt: SettlementReceipt): Promise<SettlementVerification>
}
