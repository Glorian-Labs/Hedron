/**
 * Hedera Agent Kit v4 plugin — interface skeleton.
 *
 * See docs/HEDERA_AGENT_KIT_PLUGIN.md for the design contract.
 *
 * TODO(v0.2.0): implement BaseTool subclasses + plugin builder against
 *   @hashgraph/hedera-agent-kit v4. Until v4 is added as a real dependency
 *   the adapter declares only the public surface so consumers can plan against
 *   it without forcing a peer-dep upgrade.
 */

import type { AdapterManifest } from '../../types'

export const hederaAgentKitManifest: AdapterManifest = {
  id: 'hedron/hedera-agent-kit',
  kind: 'agent-runtime',
  version: '0.2.0-alpha.0',
  description: 'Exposes Hedron commerce actions as HAK v4 BaseTool plugins',
}

export interface HedronHakPlugin {
  id: string
  description: string
  tools: HedronHakTool[]
  policies: HedronHakPolicy[]
}

export interface HedronHakTool {
  id:
    | 'hedronListAgents'
    | 'hedronGetQuote'
    | 'hedronApproveQuote'
    | 'hedronPay'
    | 'hedronVerifyReceipt'
    | 'hedronGetAuditTrail'
  description: string
}

export interface HedronHakPolicy {
  id: string
  stage:
    | 'pre-tool-execution'
    | 'post-parameter-normalization'
    | 'post-core-action'
    | 'post-tool-execution'
  description: string
}

export function describeMinimalPlugin(): HedronHakPlugin {
  return {
    id: 'hedron-commerce',
    description: 'Minimal Hedron commerce plugin: quote / pay / verify (+ helpers)',
    tools: [
      { id: 'hedronListAgents', description: 'List provider agents for a capability filter' },
      { id: 'hedronGetQuote', description: 'Request a quote for a capability' },
      { id: 'hedronApproveQuote', description: 'Approve a quote (HITL path)' },
      { id: 'hedronPay', description: 'Submit a payment payload to the broker' },
      { id: 'hedronVerifyReceipt', description: 'Verify a Hedron receipt' },
      { id: 'hedronGetAuditTrail', description: 'Fetch the HCS event chain for a flow' },
    ],
    policies: [
      {
        id: 'hedron-pre-tool-role-check',
        stage: 'pre-tool-execution',
        description: 'Reject when caller role is not allowed by Hedron policy',
      },
      {
        id: 'hedron-post-param-spend-check',
        stage: 'post-parameter-normalization',
        description: 'Check max-price and daily-spend caps before forming a transaction',
      },
      {
        id: 'hedron-post-core-payment-validate',
        stage: 'post-core-action',
        description: 'Re-validate the payment payload against the bound quote before submit',
      },
      {
        id: 'hedron-post-tool-spend-track',
        stage: 'post-tool-execution',
        description: 'Append a spend-tracking entry to the audit trail',
      },
    ],
  }
}
