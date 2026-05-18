import { describe, it, expect } from 'vitest'
import { AgentRegistry } from '../../src/registry'
import type { AgentCard } from '../../src/types'

function makeCard(id: string, name: string, rail: 'hedera-hbar' | 'x402' = 'hedera-hbar'): AgentCard {
  return {
    identity: { id, displayName: id },
    manifest: { id: `manifest:${id}`, kind: 'agent-runtime', version: '0.2.0' },
    capabilities: [
      {
        id: `cap-${id}`,
        agentId: id,
        name,
        description: '',
        tags: ['demo'],
        pricing: { kind: 'fixed-hbar', amountTinybar: '100000000' },
        allowedRails: [rail],
        adapterId: 'demo',
      },
    ],
  }
}

describe('AgentRegistry', () => {
  it('registers and lists agents', () => {
    const r = new AgentRegistry()
    r.register(makeCard('a', 'foo'))
    r.register(makeCard('b', 'bar'))
    expect(r.list().length).toBe(2)
  })

  it('filters by name + rail', () => {
    const r = new AgentRegistry()
    r.register(makeCard('a', 'foo', 'hedera-hbar'))
    r.register(makeCard('b', 'foo', 'x402'))
    const x402Only = r.findCapabilities({ name: 'foo', rails: ['x402'] })
    expect(x402Only.length).toBe(1)
    expect(x402Only[0]!.agentId).toBe('b')
  })
})
