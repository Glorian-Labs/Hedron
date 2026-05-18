import { describe, it, expect } from 'vitest'
import { AgentRegistry } from '../../src/registry'
import { Router } from '../../src/router'
import { Broker } from '../../src/broker'
import { MockHcsEmitter } from '../../src/hcs'
import { MockPaymentAdapter } from '../../src/settlement'
import { policy } from '../../src/policy'
import { newCorrelationId } from '../../src/utils/ids'
import type { AgentCard, IntentRequest } from '../../src/types'

function buildWorld() {
  const registry = new AgentRegistry()
  const card: AgentCard = {
    identity: { id: 'agent-x' },
    manifest: { id: 'm', kind: 'agent-runtime', version: '0' },
    capabilities: [
      {
        id: 'cap-x',
        agentId: 'agent-x',
        name: 'invoice.analyze',
        description: '',
        tags: ['demo'],
        pricing: { kind: 'fixed-hbar', amountTinybar: '100000000' },
        allowedRails: ['hedera-hbar'],
        adapterId: 'demo',
      },
    ],
  }
  registry.register(card)
  const router = new Router(registry)
  const intent: IntentRequest = {
    intentId: 'i1',
    correlationId: newCorrelationId(),
    caller: { id: 'u1', role: 'user' },
    capabilityFilter: { name: 'invoice.analyze' },
    action: { hello: 'world' },
  }
  const caps = router.discover(intent)
  const quoteReq = router.buildQuoteRequest(intent, caps[0]!)
  const quote = router.mockQuoteFromCapability(quoteReq, card)
  return { registry, router, card, intent, quote }
}

describe('Broker.runFlow', () => {
  it('emits all events and produces a verifiable receipt (happy path)', async () => {
    const { intent, quote } = buildWorld()
    const rules = policy.compose([policy.allow({ description: 'allow all' })])
    const emitter = new MockHcsEmitter()
    const broker = new Broker({
      emitter,
      paymentAdapter: new MockPaymentAdapter(),
      rules,
      operatorId: 'op',
      topicId: '0.0.test',
    })
    const out = await broker.runFlow({
      intent,
      quote,
      execute: async () => ({ ok: true }),
    })
    expect(out.receipt.status).toBe('completed')
    expect(out.verification.ok).toBe(true)
  })

  it('fails closed on policy deny without taking payment', async () => {
    const { intent, quote } = buildWorld()
    const rules = policy.compose([
      policy.allowedRails({ rails: ['x402'] }), // quote is hedera-hbar → deny
      policy.allow({ description: 'tail' }),
    ])
    const emitter = new MockHcsEmitter()
    const broker = new Broker({
      emitter,
      paymentAdapter: new MockPaymentAdapter(),
      rules,
      operatorId: 'op',
      topicId: '0.0.test',
    })
    const out = await broker.runFlow({
      intent,
      quote,
      execute: async () => ({ ok: true }),
    })
    expect(out.receipt.status).toBe('failed')
    // Make sure the chain does NOT contain PAYMENT_REQUIRED for this flow
    const events = await emitter.readByCorrelation(intent.correlationId)
    expect(events.find((e) => e.eventType === 'PAYMENT_REQUIRED')).toBeUndefined()
  })

  it('runs the approval path when policy requires approval', async () => {
    const { intent, quote } = buildWorld()
    const rules = policy.compose([
      policy.approvalThreshold({
        asset: 'hbar',
        overTinybar: '50000000', // < 1 HBAR → approval required
        approverScope: 'operator',
      }),
      policy.allow({ description: 'tail' }),
    ])
    const emitter = new MockHcsEmitter()
    const broker = new Broker({
      emitter,
      paymentAdapter: new MockPaymentAdapter(),
      rules,
      operatorId: 'op',
      topicId: '0.0.test',
    })
    const out = await broker.runFlow({
      intent,
      quote,
      approver: async () => ({ approvalId: 'apv', approverId: 'op' }),
      execute: async () => ({ ok: true }),
    })
    expect(out.receipt.status).toBe('completed')
    const events = await emitter.readByCorrelation(intent.correlationId)
    expect(events.find((e) => e.eventType === 'APPROVAL_REQUIRED')).toBeDefined()
    expect(events.find((e) => e.eventType === 'APPROVAL_GRANTED')).toBeDefined()
  })
})
