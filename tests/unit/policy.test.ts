import { describe, it, expect } from 'vitest'
import { policy } from '../../src/policy'
import type { PolicyContext, QuoteResponse } from '../../src/types'

function makeCtx(overrides: Partial<QuoteResponse> = {}): PolicyContext {
  const baseQuote: QuoteResponse = {
    quoteId: 'q1',
    quoteRequestId: 'qr1',
    intentId: 'i1',
    correlationId: 'c1',
    agentId: 'agent-a',
    capabilityId: 'cap-x',
    pricing: { kind: 'fixed-hbar', amountTinybar: '100000000', rail: 'hedera-hbar' }, // 1 HBAR
    actionHash: 'h',
    policyRequirements: {},
    paymentRequirement: {
      rail: 'hedera-hbar',
      asset: { kind: 'hbar' },
      amount: '100000000',
      recipient: 'r',
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      actionHash: 'h',
      quoteHash: '',
      correlationId: 'c1',
    },
    signature: 'sig',
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
    ...overrides,
  }
  return {
    timestamp: new Date().toISOString(),
    correlationId: 'c1',
    intent: {
      intentId: 'i1',
      correlationId: 'c1',
      caller: { id: 'u1', role: 'user' },
      capabilityFilter: {},
      action: {},
    },
    quote: baseQuote,
    agent: { id: baseQuote.agentId },
    caller: { id: 'u1', role: 'user' },
    spendWindow: { dailySpentHbar: '0', since: new Date(0).toISOString() },
  }
}

describe('policy engine', () => {
  it('default-denies when no rule allows', () => {
    const rules = policy.compose([])
    const out = policy.evaluate(rules, makeCtx())
    expect(out.decision.kind).toBe('deny')
  })

  it('allowedRails rejects unknown rail', () => {
    const rules = policy.compose([
      policy.allowedRails({ rails: ['hedera-hts'] }),
      policy.allow({ description: 'tail' }),
    ])
    const out = policy.evaluate(rules, makeCtx())
    expect(out.decision.kind).toBe('deny')
  })

  it('approvalThreshold returns requireApproval above limit', () => {
    const rules = policy.compose([
      policy.approvalThreshold({
        asset: 'hbar',
        overTinybar: '50000000', // 0.5 HBAR
        approverScope: 'operator',
      }),
      policy.allow({ description: 'tail' }),
    ])
    const out = policy.evaluate(rules, makeCtx())
    expect(out.decision.kind).toBe('requireApproval')
  })

  it('maxPricePerCall denies when over cap', () => {
    const rules = policy.compose([
      policy.maxPricePerCall({ asset: 'hbar', maxAmountTinybar: '50000000' }),
      policy.allow({ description: 'tail' }),
    ])
    const out = policy.evaluate(rules, makeCtx())
    expect(out.decision.kind).toBe('deny')
  })

  it('produces a stable policyId for the same rule set', () => {
    const a = policy.compose([
      policy.allowedRails({ rails: ['hedera-hbar'] }),
      policy.allow({ description: 'tail' }),
    ])
    const b = policy.compose([
      policy.allowedRails({ rails: ['hedera-hbar'] }),
      policy.allow({ description: 'tail' }),
    ])
    expect(a.id).toBe(b.id)
  })

  it('emits inputHash that is stable for the same context', () => {
    const rules = policy.compose([policy.allow({ description: 'tail' })])
    const ctx = makeCtx()
    const a = policy.evaluate(rules, ctx)
    const b = policy.evaluate(rules, ctx)
    expect(a.inputHash).toBe(b.inputHash)
  })
})
