import { describe, it, expect } from 'vitest'
import { MockDaydreamsAdapter, daydreamsManifest } from '../../../src/adapters/daydreams'

describe('Daydreams adapter (mock)', () => {
  it('exposes a manifest', () => {
    expect(daydreamsManifest.kind).toBe('agent-runtime')
    expect(daydreamsManifest.id).toBe('hedron/daydreams')
  })

  it('registers a daydreams agent identity', async () => {
    const a = new MockDaydreamsAdapter()
    const id = await a.registerDaydreamsAgent({
      daydreamsAgentId: 'dd-1',
      displayName: 'Test',
    })
    expect(id.id).toBe('daydreams:dd-1')
  })

  it('forbids private payloads on the receipt path', async () => {
    const a = new MockDaydreamsAdapter()
    await expect(a.emitReceipt({ flowId: 'flow' })).rejects.toThrow(/Broker/)
  })
})
