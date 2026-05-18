import { describe, it, expect } from 'vitest'
import { MockPaymentAdapter } from '../../src/settlement'
import { ReplayDetectedError, IdempotencyHitError } from '../../src/errors'
import type { PaymentPayload, QuoteResponse } from '../../src/types'

function quote(): QuoteResponse {
  return {
    quoteId: 'q1',
    quoteRequestId: 'qr1',
    intentId: 'i1',
    correlationId: 'c1',
    agentId: 'a',
    capabilityId: 'c',
    pricing: { kind: 'fixed-hbar', amountTinybar: '100', rail: 'hedera-hbar' },
    actionHash: 'h',
    policyRequirements: {},
    paymentRequirement: {
      rail: 'hedera-hbar',
      asset: { kind: 'hbar' },
      amount: '100',
      recipient: 'r',
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      actionHash: 'h',
      quoteHash: '',
      correlationId: 'c1',
    },
    signature: 'sig',
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
  }
}

describe('MockPaymentAdapter', () => {
  it('rejects replayed paymentId', async () => {
    const adapter = new MockPaymentAdapter()
    const q = quote()
    const requirement = await adapter.createPaymentRequirement({
      quote: q,
      correlationId: q.correlationId,
    })
    const payload: PaymentPayload = {
      rail: q.pricing.rail,
      quoteId: q.quoteId,
      paymentId: 'pay_replay',
      signedPayload: 's',
    }
    await adapter.settlePayment({ requirement, payload, idempotencyKey: 'k-1' })
    await expect(
      adapter.settlePayment({ requirement, payload, idempotencyKey: 'k-2' }),
    ).rejects.toBeInstanceOf(ReplayDetectedError)
  })

  it('idempotency cache returns/throws on second call with same key', async () => {
    const adapter = new MockPaymentAdapter()
    const q = quote()
    const requirement = await adapter.createPaymentRequirement({
      quote: q,
      correlationId: q.correlationId,
    })
    const payloadA: PaymentPayload = {
      rail: q.pricing.rail,
      quoteId: q.quoteId,
      paymentId: 'pay_a',
      signedPayload: 's',
    }
    await adapter.settlePayment({ requirement, payload: payloadA, idempotencyKey: 'kkey' })
    const payloadB: PaymentPayload = { ...payloadA, paymentId: 'pay_b' }
    await expect(
      adapter.settlePayment({ requirement, payload: payloadB, idempotencyKey: 'kkey' }),
    ).rejects.toBeInstanceOf(IdempotencyHitError)
  })

  it('validatePaymentPayload reports per-check status', async () => {
    const adapter = new MockPaymentAdapter()
    const q = quote()
    const requirement = await adapter.createPaymentRequirement({
      quote: q,
      correlationId: q.correlationId,
    })
    const bad: PaymentPayload = {
      rail: 'x402', // mismatch with hedera-hbar requirement
      quoteId: q.quoteId,
      paymentId: 'pay_z',
      signedPayload: 's',
    }
    const v = await adapter.validatePaymentPayload({ requirement, payload: bad })
    expect(v.ok).toBe(false)
    expect(v.checks.rail?.ok).toBe(false)
  })
})
