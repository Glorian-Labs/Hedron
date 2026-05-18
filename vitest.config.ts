import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
    exclude: [
      'node_modules',
      'dist',
      'build',
      'coverage',
      'tests/e2e/**',
      'tests/integration/**',
      'tests/debug/**',
    ],
    environment: 'node',
    reporters: ['default'],
    passWithNoTests: false,
    testTimeout: 10_000,
  },
})
