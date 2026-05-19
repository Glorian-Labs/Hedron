import { describe, it, expect } from 'vitest'
import { loadHedronConfig, validateForNetwork } from '../../src/config'
import { ConfigError } from '../../src/errors'

describe('config', () => {
  it('loads with empty env (mock-friendly defaults)', () => {
    const cfg = loadHedronConfig({})
    expect(cfg.hedera.network).toBe('testnet')
    expect(cfg.flags.demoMode).toBe('mock')
    expect(cfg.policy.defaultDecision).toBe('deny')
  })

  it('rejects an unknown network', () => {
    expect(() => loadHedronConfig({ HEDERA_NETWORK: 'devnet' })).toThrow(ConfigError)
  })

  it('rejects mainnet without operator credentials', () => {
    const cfg = loadHedronConfig({ HEDERA_NETWORK: 'mainnet', DEMO_MODE: 'mainnet' })
    expect(() => validateForNetwork(cfg, 'mainnet')).toThrow(ConfigError)
  })

  it('accepts mainnet with operator credentials', () => {
    const cfg = loadHedronConfig({
      HEDERA_NETWORK: 'mainnet',
      HEDERA_OPERATOR_ID: '0.0.1',
      HEDERA_OPERATOR_KEY: 'env-ref',
      DEMO_MODE: 'mainnet',
    })
    expect(() => validateForNetwork(cfg, 'mainnet')).not.toThrow()
  })
})
