import tseslint from 'typescript-eslint'

// Lint the v0.2 surface strictly. Legacy v0.1 modules (agents/, protocols/,
// services/, facilitator/, modes/) keep their pre-existing style until they
// are lifted into the v0.2 layout — they remain in the build but skip lint to
// keep CI signal focused on the new code.
export default tseslint.config(
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      'cache/**',
      'artifacts/**',
      'typechain/**',
      'typechain-types/**',
      'tests/e2e/**',
      'tests/integration/**',
      'scripts/**',
      'setup/**',
      'contracts/**',
      // Legacy v0.1 modules (lift into v0.2 layout in M2–M6)
      'src/agents/**',
      'src/protocols/**',
      'src/services/**',
      'src/facilitator/**',
      'src/modes/**',
      // Legacy demos (kept under operator decision 6.b for example coverage)
      'demo/intelligent-invoice-demo.ts',
      'demo/nft-royalty-x402-demo.ts',
      'demo/hbar-direct-x402-demo.ts',
      // Legacy unit shells (use tests/unit/*.test.ts going forward)
      'tests/unit/test-*.ts',
    ],
  },
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-console': 'off',
    },
  },
)
