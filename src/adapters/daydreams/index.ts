/**
 * Daydreams adapter — interface skeleton.
 *
 * See docs/DAYDREAMS_ADAPTER.md for the design contract.
 *
 * TODO(v0.2.0): implement against the Daydreams (Lucid Agents) public API.
 *   - https://docs.daydreams.systems/
 *   - https://docs.daydreams.systems/docs/packages/a2a
 *   - https://docs.daydreams.systems/docs/packages/payments
 */

import type {
  AdapterManifest,
  AgentCapability,
  AgentIdentity,
  ExecutionResult,
  IntentRequest,
  QuoteResponse,
  VerifiableReceipt,
} from '../../types'

export const daydreamsManifest: AdapterManifest = {
  id: 'hedron/daydreams',
  kind: 'agent-runtime',
  version: '0.2.0-alpha.0',
  description: 'Maps Daydreams (Lucid Agents) runtime to Hedron commerce primitives',
}

export interface RegisterDaydreamsAgentOpts {
  daydreamsAgentId: string
  displayName: string
  hederaIdentity?: AgentIdentity
}

export interface ExposeCapabilityOpts {
  daydreamsActionId: string
  capability: Omit<AgentCapability, 'agentId'>
}

export interface DaydreamsAdapter {
  registerDaydreamsAgent(opts: RegisterDaydreamsAgentOpts): Promise<AgentIdentity>
  exposeCapability(opts: ExposeCapabilityOpts): Promise<AgentCapability>
  requestQuote(opts: {
    intent: IntentRequest
    agentId: string
    capabilityId: string
  }): Promise<QuoteResponse>
  executePaidAction(opts: { flowId: string; capabilityId: string }): Promise<ExecutionResult>
  emitReceipt(opts: { flowId: string }): Promise<VerifiableReceipt>
}

export class MockDaydreamsAdapter implements DaydreamsAdapter {
  async registerDaydreamsAgent(opts: RegisterDaydreamsAgentOpts): Promise<AgentIdentity> {
    return (
      opts.hederaIdentity ?? {
        id: `daydreams:${opts.daydreamsAgentId}`,
        displayName: opts.displayName,
      }
    )
  }

  async exposeCapability(opts: ExposeCapabilityOpts): Promise<AgentCapability> {
    return { ...opts.capability, agentId: `daydreams:${opts.daydreamsActionId}` }
  }

  async requestQuote(): Promise<QuoteResponse> {
    throw new Error('MockDaydreamsAdapter.requestQuote: not implemented (use Router.mockQuote)')
  }

  async executePaidAction(opts: { flowId: string; capabilityId: string }): Promise<ExecutionResult> {
    return {
      executionId: `daydreams_exec_${opts.flowId}`,
      flowId: opts.flowId,
      resultHash: 'mock-not-implemented',
      result: { stub: true },
      status: 'completed',
    }
  }

  async emitReceipt(): Promise<VerifiableReceipt> {
    throw new Error(
      'MockDaydreamsAdapter.emitReceipt: receipts are emitted by Broker; use brokered flow',
    )
  }
}
