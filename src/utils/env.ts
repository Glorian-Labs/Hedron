/**
 * Environment utility functions.
 *
 * Optional dotenv loading. dotenv is a runtime-optional dependency.
 * Uses createRequire so the call survives both CommonJS and ESM consumers
 * and avoids tripping ESLint's no-require-imports rule.
 */

import { createRequire } from 'node:module'

let dotenvLoaded = false

/** Load `.env` once if dotenv is installed; otherwise no-op. */
export function loadEnvIfNeeded(): void {
  if (dotenvLoaded) return
  try {
    // Anchor createRequire to this file's path. Works in CJS builds where
    // `__filename` is defined; falls back to cwd in ESM environments.
    const anchor =
      typeof __filename === 'string' ? `file://${__filename}` : `file://${process.cwd()}/`
    const req = createRequire(anchor)
    const dotenv = req('dotenv') as { config?: () => unknown }
    if (dotenv && typeof dotenv.config === 'function') {
      dotenv.config()
      dotenvLoaded = true
    }
  } catch {
    // dotenv is optional. If not installed, env must come from process.env.
  }
}

/** Get an environment variable with an optional default. */
export function getEnv(key: string, defaultValue?: string): string | undefined {
  loadEnvIfNeeded()
  return process.env[key] ?? defaultValue
}
