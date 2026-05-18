import type { AgentRegistry } from '../registry'
import type {
  AgentCard,
  AgentCapability,
  IntentRequest,
  QuoteRequest,
  QuoteResponse,
} from '../types'
import { newQuoteId, newPaymentId } from '../utils/ids'
import { canonicalHash } from '../utils/canonical'

/**
 * Router — read-only path. Discovery + quote dispatch.
 */
export class Router {
  constructor(private readonly registry: AgentRegistry) {}

  discover(intent: IntentRequest): AgentCapability[] {
    return this.registry.findCapabilities({
      ...(intent.capabilityFilter.name !== undefined
        ? { name: intent.capabilityFilter.name }
        : {}),
      ...(intent.capabilityFilter.tags !== undefined
        ? { tags: intent.capabilityFilter.tags }
        : {}),
      ...(intent.capabilityFilter.allowedRails !== undefined
        ? { rails: intent.capabilityFilter.allowedRails }
        : {}),
    })
  }

  buildQuoteRequest(intent: IntentRequest, cap: AgentCapability): QuoteRequest {
    return {
      quoteRequestId: `qreq_${newPaymentId().slice(4)}`,
      intentId: intent.intentId,
      correlationId: intent.correlationId,
      agentId: cap.agentId,
      capabilityId: cap.id,
      action: intent.action,
      expiresAt: intent.expiresAt ?? new Date(Date.now() + 60_000).toISOString(),
    }
  }

  /**
   * Mock provider: produce a deterministic quote from a capability. Real
   * adapters reach out to the agent runtime to get a real signed quote.
   */
  mockQuoteFromCapability(req: QuoteRequest, card: AgentCard): QuoteResponse {
    const cap = card.capabilities.find((c) => c.id === req.capabilityId)
    if (!cap) throw new Error(`capability ${req.capabilityId} not found on agent ${req.agentId}`)
    const pricing = { ...cap.pricing, rail: cap.allowedRails[0] ?? 'hedera-hbar' } as const
    const actionHash = canonicalHash(req.action)
    const expiresAt = new Date(Date.now() + 60_000).toISOString()
    const quoteId = newQuoteId()
    const unsigned = {
      quoteId,
      quoteRequestId: req.quoteRequestId,
      intentId: req.intentId,
      correlationId: req.correlationId,
      agentId: req.agentId,
      capabilityId: req.capabilityId,
      pricing,
      actionHash,
      policyRequirements: {},
      paymentRequirement: {
        rail: pricing.rail,
        asset:
          pricing.kind === 'fixed-hbar'
            ? ({ kind: 'hbar' as const })
            : ({ kind: 'hbar' as const }),
        amount: pricing.kind === 'fixed-hbar' ? pricing.amountTinybar : '0',
        recipient: `mock:${req.agentId}`,
        expiresAt,
        actionHash,
        quoteHash: '',
        correlationId: req.correlationId,
      },
      expiresAt,
    }
    return {
      ...unsigned,
      signature: canonicalHash({ agentId: req.agentId, unsigned }),
    }
  }
}
