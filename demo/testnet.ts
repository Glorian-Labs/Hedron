/**
 * Hedron Hedera testnet demo (opt-in).
 *
 * Requires:
 *   HEDERA_NETWORK=testnet
 *   HEDERA_OPERATOR_ID=0.0.xxxxx
 *   HEDERA_OPERATOR_KEY=<your-testnet-operator-private-key>
 *   RUN_HEDERA_INTEGRATION=true
 *
 *   npm run demo:testnet
 *
 * v0.2 Tier 1 M3 target: replace the mock HCS emitter with the real HCS
 * client and write events to a Hedron-owned topic. For now this file refuses
 * to run unless RUN_HEDERA_INTEGRATION=true, and prints a clear "TODO" if so.
 */

import { loadHedronConfig, validateForNetwork } from '../src/config'

async function main(): Promise<number> {
  const cfg = loadHedronConfig()
  validateForNetwork(cfg, 'testnet')

  if (!cfg.flags.runHederaIntegration) {
    console.error(
      'RUN_HEDERA_INTEGRATION=true is required for the testnet demo. See docs/QUICKSTART.md.',
    )
    return 1
  }

  console.log(
    `[hedron] testnet demo placeholder. Operator=${cfg.hedera.operatorId ?? '(unset)'} ` +
      `Audit topic=${cfg.hcs.auditTopicId ?? '(auto-provision)'}`,
  )
  console.log(
    '[hedron] Real HCS emission lands in Tier 1 M3. See docs/GRANT_EXECUTION_PLAN.md.',
  )
  return 0
}

main().then(
  (code) => process.exit(code),
  (err) => {
    console.error(err)
    process.exit(1)
  },
)
