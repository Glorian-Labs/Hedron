import { describe, it, expect } from 'vitest'
import {
  describeMinimalPlugin,
  hederaAgentKitManifest,
} from '../../../src/adapters/hedera-agent-kit'

describe('HAK v4 plugin (planning surface)', () => {
  it('exposes a manifest', () => {
    expect(hederaAgentKitManifest.id).toBe('hedron/hedera-agent-kit')
  })

  it('declares the minimum tool surface: quote / pay / verify', () => {
    const plugin = describeMinimalPlugin()
    const ids = plugin.tools.map((t) => t.id)
    expect(ids).toContain('hedronGetQuote')
    expect(ids).toContain('hedronPay')
    expect(ids).toContain('hedronVerifyReceipt')
  })

  it('declares four HAK lifecycle policies', () => {
    const plugin = describeMinimalPlugin()
    const stages = new Set(plugin.policies.map((p) => p.stage))
    expect(stages.has('pre-tool-execution')).toBe(true)
    expect(stages.has('post-parameter-normalization')).toBe(true)
    expect(stages.has('post-core-action')).toBe(true)
    expect(stages.has('post-tool-execution')).toBe(true)
  })
})
