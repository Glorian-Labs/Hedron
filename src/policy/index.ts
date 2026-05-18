/**
 * Hedron policy engine.
 *
 * Rules are pure: given (ruleSet, context) the decision is deterministic.
 * Every evaluation produces a structured PolicyDecisionEvent suitable for HCS.
 */

import { canonicalHash } from '../utils/canonical'
import type {
  ApproverScope,
  PolicyContext,
  PolicyDecision,
  PolicyRule,
} from '../types'

export interface PolicyDecisionEvent {
  policyId: string
  inputHash: string
  decision: PolicyDecision
  timestamp: string
  correlationId: string
}

export interface RuleSet {
  rules: PolicyRule[]
  id: string
}

/** Compose a rule list into a deterministic ruleset id. */
export function compose(rules: PolicyRule[]): RuleSet {
  const idMaterial = rules.map((r) => r.id).join('|')
  return { rules, id: canonicalHash({ kind: 'hedron-ruleset', rules: idMaterial }) }
}

/**
 * Evaluate rules in order. First non-allow short-circuits.
 * If every rule returns allow, the final decision is allow.
 * Note: callers should always include a tail rule (`allow` or `denyByDefault`).
 */
export function evaluate(ruleSet: RuleSet, ctx: PolicyContext): PolicyDecisionEvent {
  let decision: PolicyDecision = {
    kind: 'deny',
    reason: 'no rule allowed this flow (default deny)',
  }

  for (const rule of ruleSet.rules) {
    const d = rule.evaluate(ctx)
    if (d.kind === 'deny' || d.kind === 'requireApproval') {
      decision = d
      break
    }
    // allow → continue, last allow wins.
    decision = d
  }

  return {
    policyId: ruleSet.id,
    inputHash: canonicalHash(ctx),
    decision,
    timestamp: ctx.timestamp,
    correlationId: ctx.correlationId,
  }
}

// -----------------------------------------------------------------------------
// Built-in rules
// -----------------------------------------------------------------------------

export const denylist = (opts: { agentIds?: string[] }): PolicyRule => ({
  id: `denylist:${(opts.agentIds ?? []).join(',')}`,
  description: 'deny if quote.agentId is on the denylist',
  evaluate(ctx) {
    if (opts.agentIds?.includes(ctx.quote.agentId)) {
      return { kind: 'deny', reason: `agent ${ctx.quote.agentId} is denylisted` }
    }
    return { kind: 'allow', reason: 'agent not denylisted' }
  },
})

export const allowedRails = (opts: { rails: string[] }): PolicyRule => ({
  id: `allowedRails:${opts.rails.join(',')}`,
  description: 'deny if quote.pricing.rail is not in the allowed set',
  evaluate(ctx) {
    if (!opts.rails.includes(ctx.quote.pricing.rail)) {
      return {
        kind: 'deny',
        reason: `rail ${ctx.quote.pricing.rail} not in allowed set`,
      }
    }
    return { kind: 'allow', reason: 'rail allowed' }
  },
})

export const allowedCapabilities = (opts: { capabilityIds: string[] }): PolicyRule => ({
  id: `allowedCapabilities:${opts.capabilityIds.join(',')}`,
  description: 'deny if quote.capabilityId is not in the allowed set',
  evaluate(ctx) {
    if (!opts.capabilityIds.includes(ctx.quote.capabilityId)) {
      return {
        kind: 'deny',
        reason: `capability ${ctx.quote.capabilityId} not in allowed set`,
      }
    }
    return { kind: 'allow', reason: 'capability allowed' }
  },
})

export const allowedAgents = (opts: { agentIds: string[] }): PolicyRule => ({
  id: `allowedAgents:${opts.agentIds.join(',')}`,
  description: 'deny if quote.agentId is not in the allowed set',
  evaluate(ctx) {
    if (!opts.agentIds.includes(ctx.quote.agentId)) {
      return { kind: 'deny', reason: `agent ${ctx.quote.agentId} not in allowed set` }
    }
    return { kind: 'allow', reason: 'agent allowed' }
  },
})

export const maxPricePerCall = (opts: {
  asset: 'hbar'
  maxAmountTinybar: string
}): PolicyRule => ({
  id: `maxPricePerCall:${opts.asset}:${opts.maxAmountTinybar}`,
  description: 'deny if quote price exceeds cap (per asset)',
  evaluate(ctx) {
    const price = ctx.quote.pricing
    if (price.kind === 'fixed-hbar' && opts.asset === 'hbar') {
      if (BigInt(price.amountTinybar) > BigInt(opts.maxAmountTinybar)) {
        return {
          kind: 'deny',
          reason: `price ${price.amountTinybar} tinybar > cap ${opts.maxAmountTinybar}`,
        }
      }
    }
    return { kind: 'allow', reason: 'price within cap' }
  },
})

export const maxDailySpend = (opts: {
  asset: 'hbar'
  maxAmountTinybar: string
}): PolicyRule => ({
  id: `maxDailySpend:${opts.asset}:${opts.maxAmountTinybar}`,
  description: 'deny if completing this flow would exceed daily spend',
  evaluate(ctx) {
    if (opts.asset !== 'hbar') return { kind: 'allow', reason: 'rule scoped to hbar' }
    const price = ctx.quote.pricing
    if (price.kind !== 'fixed-hbar') return { kind: 'allow', reason: 'non-hbar quote' }
    const projected = BigInt(ctx.spendWindow.dailySpentHbar) + BigInt(price.amountTinybar)
    if (projected > BigInt(opts.maxAmountTinybar)) {
      return {
        kind: 'deny',
        reason: `projected daily spend ${projected} > cap ${opts.maxAmountTinybar}`,
      }
    }
    return { kind: 'allow', reason: 'daily spend within cap' }
  },
})

export const approvalThreshold = (opts: {
  asset: 'hbar'
  overTinybar: string
  approverScope: ApproverScope
}): PolicyRule => ({
  id: `approvalThreshold:${opts.asset}:${opts.overTinybar}:${opts.approverScope}`,
  description: 'require approval when amount exceeds threshold',
  evaluate(ctx) {
    if (opts.asset !== 'hbar') return { kind: 'allow', reason: 'rule scoped to hbar' }
    const price = ctx.quote.pricing
    if (price.kind !== 'fixed-hbar') return { kind: 'allow', reason: 'non-hbar quote' }
    if (BigInt(price.amountTinybar) > BigInt(opts.overTinybar)) {
      return {
        kind: 'requireApproval',
        reason: `amount ${price.amountTinybar} > threshold ${opts.overTinybar}`,
        approverScope: opts.approverScope,
      }
    }
    return { kind: 'allow', reason: 'below approval threshold' }
  },
})

export const humanInTheLoop = (opts: {
  capabilities: string[]
  approverScope: ApproverScope
}): PolicyRule => ({
  id: `humanInTheLoop:${opts.capabilities.join(',')}:${opts.approverScope}`,
  description: 'require approval for sensitive capabilities',
  evaluate(ctx) {
    if (opts.capabilities.includes(ctx.quote.capabilityId)) {
      return {
        kind: 'requireApproval',
        reason: `capability ${ctx.quote.capabilityId} requires HITL approval`,
        approverScope: opts.approverScope,
      }
    }
    return { kind: 'allow', reason: 'capability is not HITL-gated' }
  },
})

export const allow = (opts: { description: string }): PolicyRule => ({
  id: `allow:${opts.description}`,
  description: `tail allow rule: ${opts.description}`,
  evaluate() {
    return { kind: 'allow', reason: opts.description }
  },
})

export const denyByDefault: PolicyRule = {
  id: 'denyByDefault',
  description: 'tail rule: deny anything that reaches it',
  evaluate() {
    return { kind: 'deny', reason: 'no rule explicitly allowed this flow' }
  },
}

export const policy = {
  compose,
  evaluate,
  denylist,
  allowedRails,
  allowedAgents,
  allowedCapabilities,
  maxPricePerCall,
  maxDailySpend,
  approvalThreshold,
  humanInTheLoop,
  allow,
  denyByDefault,
}
