# Policy Engine

Hedron policies decide whether a commerce flow may proceed. They are pure functions over a `PolicyContext`, returning a `PolicyDecision`. Every evaluation produces an auditable `PolicyDecisionEvent` on HCS.

## Design rules

1. **Deny by default.** A flow without an explicit `allow` decision from at least one rule is denied.
2. **All rules compose deterministically.** Order matters; rules are evaluated in declaration order; the first `deny` short-circuits.
3. **Approval is a rule outcome, not a side channel.** If a rule returns `requireApproval`, the broker emits `APPROVAL_REQUIRED` and waits for `APPROVAL_GRANTED` from an authorized approver.
4. **Decisions are reproducible offline.** A `PolicyDecision` is the function of `(ruleSet, context)` only — no time-dependent randomness, no network calls during evaluation. (Time-of-day rules are allowed but must read the timestamp from `context`, not the clock.)
5. **Every decision is logged with an input hash.** Auditors can rebuild context from the hash and re-run the evaluator.

## Types

```ts
type PolicyDecision =
  | { kind: 'allow', reason: string }
  | { kind: 'deny', reason: string }
  | { kind: 'requireApproval', reason: string, approverScope: ApproverScope }

interface PolicyContext {
  timestamp: string
  correlationId: string
  intent: IntentRequest
  quote: QuoteResponse
  agent: AgentIdentity
  caller: { id: string, role: 'user' | 'app' | 'agent' }
  spendWindow: { dailySpentHbar: string, since: string }
}

interface PolicyRule {
  id: string
  description: string
  evaluate(ctx: PolicyContext): PolicyDecision
}

interface PolicyDecisionEvent {
  policyId: string         // composite hash of rule ids in the active set
  inputHash: string        // sha256 of canonical(PolicyContext)
  decision: PolicyDecision
  timestamp: string
  correlationId: string
}
```

## Built-in rule kinds (`src/policy/rules/`)

| Rule | Behavior |
| --- | --- |
| `maxPricePerCall` | Denies if `quote.pricing.amount` > configured cap (per asset). |
| `maxDailySpend` | Denies / requires approval based on `spendWindow.dailySpentHbar`. |
| `allowedRails` | Denies if `quote.pricing.rail` is not in the allow list. |
| `allowedAgents` | Denies if `quote.agentId` not in allow list. |
| `allowedCapabilities` | Denies if `quote.capabilityId` not in allow list. |
| `denylist` | Hard deny — short-circuits everything. |
| `approvalThreshold` | Requires approval when amount > threshold. |
| `humanInTheLoop` | Requires approval for an explicit list of capabilities (e.g. `mint_token`). |
| `denyByDefault` | Tail rule. If reached, returns `deny: 'no rule allowed this flow'`. |

## Composition example (TypeScript)

```ts
import { policy } from 'hedron-agent-sdk/policy'

const ruleset = policy.compose([
  policy.denylist({ agentIds: ['0.0.bad'] }),
  policy.allowedRails({ rails: ['hedera-hbar', 'hedera-hts', 'x402'] }),
  policy.maxPricePerCall({ asset: 'hbar', maxAmountTinybar: '500000000' }),  // 5 HBAR
  policy.maxDailySpend({ asset: 'hbar', maxAmountTinybar: '10000000000' }), // 100 HBAR
  policy.approvalThreshold({ asset: 'hbar', overTinybar: '500000000', approverScope: 'operator' }),
  policy.humanInTheLoop({ capabilities: ['mint_token', 'transfer_admin'], approverScope: 'operator' }),
  policy.allow({ description: 'default-allow for everything that passed the gates' }),
])
```

`policy.allow` is intentionally explicit — there is no implicit allow, including no implicit `denyByDefault`. The default-deny tail is added automatically by `policy.compose` if no `allow` is present.

## Auditable decision events

Every evaluation produces:

```json
{
  "schemaVersion": "1",
  "eventType": "POLICY_EVALUATED",
  "correlationId": "…",
  "flowId": "…",
  "policyId": "sha256(rule.id…)",
  "inputHash": "sha256(canonical(PolicyContext))",
  "decision": { "kind": "allow", "reason": "default-allow after gates" },
  "timestamp": "…",
  "signature": "…"
}
```

The combination of `policyId` + `inputHash` + `decision` is sufficient for an auditor (who has the rule code at the relevant version) to re-derive the decision.

## Approval flow

When a rule returns `requireApproval`, the broker:

1. Emits `APPROVAL_REQUIRED` with `approverScope`.
2. Pauses the flow in state `approval_required`.
3. Accepts `POST /v1/flows/:flowId/approve` from a signer whose key matches the `approverScope`.
4. Emits `APPROVAL_GRANTED` and resumes.

If no approval arrives before the quote expiry, the broker emits `EXECUTION_FAILED { reason: 'approval_timeout' }` and issues a failure receipt.

## Threat-model notes

- Rules execute in the broker, not at adapter edges. A malicious adapter cannot bypass policy by claiming "approved".
- Approval signatures are checked against the published operator-or-approver keyset. Compromise of an approver key requires a key rotation event, which itself produces an HCS event on a separate `operator-keys` topic (planned).
- A future "policy registry" milestone (post-Tier 1) will publish active rulesets on HCS so reviewers don't need source-code access to audit a flow.
