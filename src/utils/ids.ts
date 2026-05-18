import { randomBytes, randomUUID } from 'node:crypto'

/** Stable, opaque correlation id. */
export function newCorrelationId(): string {
  return `corr_${randomUUID()}`
}

/** Stable flow id (one per commerce loop). */
export function newFlowId(): string {
  return `flow_${randomUUID()}`
}

/** Stable single-use quote id. */
export function newQuoteId(): string {
  return `quote_${randomUUID()}`
}

/** Stable single-use payment id. Encodes 16 random bytes hex. */
export function newPaymentId(): string {
  return `pay_${randomBytes(16).toString('hex')}`
}

/** Receipt id — uuidv4 with prefix for easy debugging. */
export function newReceiptId(): string {
  return `rcpt_${randomUUID()}`
}
