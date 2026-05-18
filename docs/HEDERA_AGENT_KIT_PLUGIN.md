# Hedera Agent Kit v4 Plugin

> Status: **interface defined, skeleton in `src/adapters/hedera-agent-kit/`.** Targets Hedera Agent Kit (HAK) v4 — see <https://hedera.com/blog/hedera-agent-kit-v4-policies-modular-packages-and-plugin-updates/>.

HAK v4 introduces:

- A modular `@hashgraph/hedera-agent-kit*` namespace (core, langchain, ai-sdk, elizaos, mcp packages).
- `BaseTool` — abstract class replacing v3's object-literal tools so the kit can hook into a tool's lifecycle.
- A first-class **hooks and policies** system with four lifecycle stages:
  1. **Pre-Tool Execution** — early validation / role-based gating.
  2. **Post-Parameter Normalization** — inspect/rewrite params before transaction bytes are formed (e.g. address allowlist).
  3. **Post-Core Action** — final pre-submit check.
  4. **Post-Tool Execution** — logging / spend tracking / downstream triggers.
- Explicit plugin imports (an empty `plugins` array now means zero tools).
- A new namespace for the underlying SDK: `@hiero-ledger/sdk` (peer dependency, ≥ 2.80.0).

Hedron's plugin exposes the commerce loop as HAK tools, with policy hooks that mirror Hedron's own policy engine. This means a HAK agent gains the discover → quote → policy → pay → execute → receipt loop with a tiny tool surface and automatic guardrails.

## Tool surface (intentionally minimal)

Per the Tier 1 grant scope: **"Keep tool surface minimal: quote/pay/verify."**

| Tool | Purpose |
| --- | --- |
| `hedronListAgents` | List provider agents matching a capability filter. |
| `hedronGetQuote` | Request a quote from a chosen agent. |
| `hedronApproveQuote` | Approve a quote (HITL path). |
| `hedronPay` | Submit payment payload to the broker. |
| `hedronVerifyReceipt` | Verify a receipt against HCS. |
| `hedronGetAuditTrail` | Read the HCS event chain for a flow. |

Each tool is implemented as a `BaseTool` subclass so the four HAK lifecycle hooks fire automatically.

## Sketched implementation

```ts
// src/adapters/hedera-agent-kit/tools/getQuote.ts
import { BaseTool } from '@hashgraph/hedera-agent-kit'
import { z } from 'zod'

export class HedronGetQuoteTool extends BaseTool {
  readonly id = 'hedronGetQuote'
  readonly description = 'Request a Hedron commerce quote for a capability.'
  readonly schema = z.object({
    intentId: z.string(),
    agentId: z.string(),
    capabilityId: z.string(),
  })

  async execute(params: z.infer<typeof this.schema>): Promise<QuoteResponse> {
    return this.deps.brokerClient.requestQuote(params)
  }
}
```

A plugin builder ties the tools together:

```ts
// src/adapters/hedera-agent-kit/index.ts
import { coreConsensusPlugin } from '@hashgraph/hedera-agent-kit/plugins'

export function buildHedronPlugin(deps: HedronPluginDeps) {
  return {
    id: 'hedron-commerce',
    description: 'Hedron commerce tools for HAK v4 agents',
    tools: [
      new HedronListAgentsTool(deps),
      new HedronGetQuoteTool(deps),
      new HedronApproveQuoteTool(deps),
      new HedronPayTool(deps),
      new HedronVerifyReceiptTool(deps),
      new HedronGetAuditTrailTool(deps),
    ],
    policies: buildHedronPolicies(deps),
  }
}
```

## Policies (HAK hooks → Hedron policy engine)

Hedron's policy engine is the single source of truth. The HAK plugin exposes thin wrappers that translate HAK lifecycle calls into Hedron policy queries so a HAK agent gets the same default-deny posture without re-implementing rules.

| HAK stage | Hedron action |
| --- | --- |
| Pre-Tool Execution | reject tool call if `caller.role` is not allowed by policy |
| Post-Parameter Normalization | check `quote.pricing.amount` against `maxPricePerCall` and `maxDailySpend` |
| Post-Core Action | for `hedronPay`, verify the payment payload via `PaymentAdapter.validatePaymentPayload` before submission |
| Post-Tool Execution | append a structured spend-tracking entry to the audit trail |

All four are programmable; the HAK Agent Lab "no-code panel" view of policies is enabled because the policies are plain TS objects.

## Package wiring

The plugin assumes a HAK v4 host:

```json
{
  "dependencies": {
    "@hashgraph/hedera-agent-kit": "^4.0.0",
    "@hiero-ledger/sdk": "^2.80.0"
  }
}
```

Hedron itself still depends on `@hashgraph/sdk` (v2) on this branch — the HAK v4 plugin is the bridge to `@hiero-ledger/sdk` and only loads when an operator opts in (`HAK_PLUGIN_ENABLED=true`). Migrating Hedron's core to `@hiero-ledger/sdk` is a separate work item, planned alongside the M6–M9 grant milestones.

## Open questions

- HAK v4 is a fresh release; the BaseTool / hooks API may evolve. The adapter pins versions and ships a smoke-test matrix.
- MCP integration: HAK v4 ships `@hashgraph/hedera-agent-kit-mcp` (a standalone MCP server). Hedron's own MCP adapter (planned for v0.3) will likely shell out to that package rather than re-implement.

## Status

- v0.2.0-alpha.0: `BaseTool` subclasses + plugin builder behind a feature flag; conformance test on the mock broker.
- v0.2.0: end-to-end demo of a HAK v4 agent buying a Hedron capability with policy enforcement.
- M6–M9 grant: full MCP tool surface, third-party HAK plugin compatibility tests, published as `@glorian-labs/hedron-hak-plugin`.
