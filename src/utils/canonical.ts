/**
 * Canonical JSON encoding utilities for Hedron.
 *
 * Rules:
 *  - JSON with sorted keys (recursive)
 *  - UTF-8
 *  - no insignificant whitespace
 *
 * The same encoding is used everywhere a hash is computed (event chain,
 * receipt anchors, policy input hash, settlement record hash) so that an
 * external auditor can re-derive any hash deterministically.
 */

import { createHash } from 'node:crypto'

type Canonical = unknown

export function canonicalize(value: Canonical): string {
  return JSON.stringify(sortKeys(value))
}

export function sha256Hex(input: string): string {
  return createHash('sha256').update(input, 'utf8').digest('hex')
}

export function canonicalHash(value: Canonical): string {
  return sha256Hex(canonicalize(value))
}

function sortKeys(value: Canonical): Canonical {
  if (value === null || typeof value !== 'object') return value
  if (Array.isArray(value)) return value.map(sortKeys)
  const obj = value as Record<string, unknown>
  const sorted: Record<string, unknown> = {}
  for (const key of Object.keys(obj).sort()) {
    sorted[key] = sortKeys(obj[key])
  }
  return sorted
}
