import { canonicalize, canonicalHash, sha256Hex } from '../utils/canonical'
import type { HcsAuditEvent, HedronEventType } from '../types'

/**
 * Mock HCS emitter. Real implementation uses @hashgraph/sdk / @hiero-ledger/sdk.
 * The mock keeps the in-memory chain so the verifier path can be tested locally.
 */
export interface HcsEmitter {
  emit(event: HcsAuditEvent): Promise<{ sequenceNumber: number }>
  readByCorrelation(correlationId: string): Promise<HcsAuditEvent[]>
  readSequenceRange(start: number, end: number): Promise<HcsAuditEvent[]>
}

export class MockHcsEmitter implements HcsEmitter {
  private readonly chain: HcsAuditEvent[] = []
  private readonly perFlowPrevHash = new Map<string, string>()

  async emit(eventInit: HcsAuditEvent): Promise<{ sequenceNumber: number }> {
    const flowPrev = this.perFlowPrevHash.get(eventInit.flowId)
    const event: HcsAuditEvent = {
      ...eventInit,
      ...(flowPrev !== undefined ? { prevEventHash: flowPrev } : {}),
    }
    // Compute the chain hash over the event *without* its signature field.
    const { signature: _sig, ...unsigned } = event as HcsAuditEvent & { signature: string }
    const hash = sha256Hex(canonicalize(unsigned))
    this.perFlowPrevHash.set(event.flowId, hash)
    this.chain.push(event)
    return { sequenceNumber: this.chain.length }
  }

  async readByCorrelation(correlationId: string): Promise<HcsAuditEvent[]> {
    return this.chain.filter((e) => e.correlationId === correlationId)
  }

  async readSequenceRange(start: number, end: number): Promise<HcsAuditEvent[]> {
    return this.chain.slice(start - 1, end)
  }
}

/**
 * Build a signed-ish audit event with the prevEventHash filled in by the
 * emitter. The "signature" in mock mode is a hash of the operator id + event.
 */
export function buildEvent<T>(opts: {
  type: HedronEventType
  correlationId: string
  flowId: string
  payload: T
  agentId?: string
  capabilityId?: string
  quoteId?: string
  paymentId?: string
  operatorId: string
}): HcsAuditEvent<T> {
  const timestamp = new Date().toISOString()
  const unsigned = {
    schemaVersion: '1' as const,
    eventType: opts.type,
    correlationId: opts.correlationId,
    flowId: opts.flowId,
    ...(opts.agentId !== undefined ? { agentId: opts.agentId } : {}),
    ...(opts.capabilityId !== undefined ? { capabilityId: opts.capabilityId } : {}),
    ...(opts.quoteId !== undefined ? { quoteId: opts.quoteId } : {}),
    ...(opts.paymentId !== undefined ? { paymentId: opts.paymentId } : {}),
    timestamp,
    payload: opts.payload,
  }
  const signature = canonicalHash({ operatorId: opts.operatorId, event: unsigned })
  return { ...unsigned, signature } as HcsAuditEvent<T>
}
