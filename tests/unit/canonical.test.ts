import { describe, it, expect } from 'vitest'
import { canonicalize, canonicalHash, sha256Hex } from '../../src/utils/canonical'

describe('canonical encoding', () => {
  it('produces identical strings regardless of key order', () => {
    expect(canonicalize({ b: 1, a: 2 })).toBe(canonicalize({ a: 2, b: 1 }))
  })

  it('hashes are stable', () => {
    expect(canonicalHash({ a: 1, b: [1, 2, 3] })).toBe(canonicalHash({ b: [1, 2, 3], a: 1 }))
  })

  it('sha256Hex returns 64-char hex', () => {
    const h = sha256Hex('hello')
    expect(h).toMatch(/^[0-9a-f]{64}$/)
  })
})
