# Daydreams Adapter

> Status: **interface defined, skeleton in `src/adapters/daydreams/`.** Adapter targets the public Daydreams (Lucid Agents) docs at <https://docs.daydreams.systems>.

Daydreams is an agent commerce neighbor (its tagline is literally "agent commerce infrastructure" and it ships x402, A2A, ERC-8004, and MPP packages). Hedron and Daydreams compose well: Daydreams runs the agent, Hedron handles the discover → quote → policy → pay → execute → receipt loop on Hedera.

## Mapping

| Daydreams concept | Hedron concept | Notes |
| --- | --- | --- |
| Daydreams agent | `AgentIdentity` (one per agent) | A Daydreams agent identity is exposed as a Hedron `AgentCard`. |
| Daydreams action | `AgentCapability` | Each callable Daydreams action becomes one capability with its own `CapabilityPricing`. |
| Daydreams task (one execution) | `flowId` | A single task = one Hedron commerce flow. |
| Daydreams x402 payment hint | Hedron `paymentRequirement` | Hedron's settlement adapter consumes the x402 hint; the Hedera x402 rail is the default. |
| Daydreams memory / context | NOT exported to HCS | Hedron carries only `correlationId` + `actionHash`. Memory stays in Daydreams. |
| Daydreams tool result | `ExecutionResult` | The result hash goes into the receipt; the raw content never goes on HCS. |

## Adapter interface

```ts
// src/adapters/daydreams/index.ts (target shape)

export interface DaydreamsAdapter {
  registerDaydreamsAgent(opts: RegisterDaydreamsAgentOpts): Promise<AgentIdentity>
  exposeCapability(opts: ExposeCapabilityOpts): Promise<AgentCapability>
  requestQuote(opts: { intent: IntentRequest, agentId: string, capabilityId: string }): Promise<QuoteResponse>
  executePaidAction(opts: { flowId: string, paymentVerified: PaymentVerifiedEvent }): Promise<ExecutionResult>
  emitReceipt(opts: { flowId: string }): Promise<VerifiableReceipt>
}

export interface RegisterDaydreamsAgentOpts {
  daydreamsAgentId: string
  displayName: string
  manifest: AdapterManifest           // who, what, version, supported caps
  hederaIdentity?: AgentIdentity      // pre-existing Hedera identity; else auto-derive
}

export interface ExposeCapabilityOpts {
  daydreamsActionId: string
  capability: Omit<AgentCapability, 'agentId'>
  pricing: CapabilityPricing
}
```

The adapter never reaches into Daydreams memory. It only consumes the public action/result surface.

## Wire path (canonical flow)

```
Daydreams Agent                Hedron (Router + Broker)              Daydreams Caller
       │                                  │                                  │
       │   registerDaydreamsAgent         │                                  │
       ├─────────────────────────────────►│                                  │
       │   exposeCapability(×N)           │                                  │
       ├─────────────────────────────────►│                                  │
       │                                  │   intent                          │
       │                                  │◄─────────────────────────────────┤
       │                                  │   QuoteResponse[]                 │
       │                                  ├─────────────────────────────────►│
       │                                  │   select-quote                    │
       │                                  │◄─────────────────────────────────┤
       │                                  │   policy + payment + verify       │
       │   executePaidAction(flowId)      │                                  │
       │◄─────────────────────────────────┤                                  │
       │   result (signed)                │                                  │
       ├─────────────────────────────────►│                                  │
       │                                  │   VerifiableReceipt              │
       │                                  ├─────────────────────────────────►│
```

## Security rules for Daydreams payloads

- The adapter **must not** copy Daydreams agent memory or prompt context into HCS payloads.
- The adapter **may** include a salted hash of input parameters in `actionHash` so the receipt anchors the canonical request.
- Result content is hashed before reference. Raw result goes to the caller via the adapter return channel, never on HCS.
- The adapter respects Hedron policy outcomes; a `deny` decision must abort the Daydreams task with a clear error.

## Open questions (resolve before v0.2.0)

- Daydreams docs surface several supporting protocols (x402, A2A, ERC-8004, SIWX, MPP). The first integration cut targets **A2A + x402** because those overlap directly with Hedron's existing protocols. ERC-8004 identity verification is a v0.3 candidate.
- Daydreams' MPP (Machine Payments Protocol) overlaps with Hedron's `PaymentAdapter` surface. We will model MPP as one rail (`mpp`) inside `src/settlement/`, parallel to `x402/`.

## Status

- v0.2.0-alpha.0: interface + mocked adapter + conformance test in `tests/unit/adapters/daydreams.test.ts`.
- v0.2.0: real handshake against a Daydreams sandbox endpoint, gated on `RUN_DAYDREAMS_INTEGRATION=true`.
- v0.3: ERC-8004 identity + MPP rail.
