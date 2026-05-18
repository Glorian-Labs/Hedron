/**
 * Broker — coordinates a single commerce flow lifecycle.
 *
 * This is the v0.2 mock implementation that exercises the full state machine
 * against in-memory adapters. Real rails plug in via the same interfaces.
 */

import { ApprovalRequiredError, PolicyDeniedError } from '../errors'
import { policy, evaluate as evaluatePolicy } from '../policy'
import type { PolicyDecisionEvent, RuleSet } from '../policy'
import { canonicalHash } from '../utils/canonical'
import { newFlowId, newPaymentId, newReceiptId } from '../utils/ids'
import { buildEvent, type HcsEmitter } from '../hcs'
import { verifyReceipt, type VerificationResult } from '../receipts'
import type { PaymentAdapter } from '../settlement'
import type {
  IntentRequest,
  PolicyContext,
  QuoteResponse,
  VerifiableReceipt,
} from '../types'

export interface BrokerDeps {
  emitter: HcsEmitter
  paymentAdapter: PaymentAdapter
  rules: RuleSet
  operatorId: string
  topicId: string
}

export interface RunFlowInput {
  intent: IntentRequest
  quote: QuoteResponse
  /** Function that returns an approval signal when policy requires it. */
  approver?: () => Promise<{ approvalId: string; approverId: string }>
  /** Provider agent execution function. Returns the canonical result. */
  execute: (input: unknown) => Promise<unknown>
  /** Optional pre-stamped now() for deterministic testing. */
  now?: () => Date
}

export interface RunFlowOutput {
  flowId: string
  receipt: VerifiableReceipt
  verification: VerificationResult
}

export class Broker {
  constructor(private readonly deps: BrokerDeps) {}

  async runFlow(input: RunFlowInput): Promise<RunFlowOutput> {
    const flowId = newFlowId()
    const { intent, quote } = input
    const correlationId = intent.correlationId
    const operatorId = this.deps.operatorId

    // 1) INTENT_CREATED
    const seqStart = (
      await this.deps.emitter.emit(
        buildEvent({
          type: 'INTENT_CREATED',
          correlationId,
          flowId,
          operatorId,
          payload: { intent: { intentId: intent.intentId, capabilityFilter: intent.capabilityFilter } },
        }),
      )
    ).sequenceNumber

    // 2) AGENTS_DISCOVERED (single-agent path in mock)
    await this.deps.emitter.emit(
      buildEvent({
        type: 'AGENTS_DISCOVERED',
        correlationId,
        flowId,
        operatorId,
        payload: { candidates: [quote.agentId] },
      }),
    )

    // 3) QUOTE_REQUESTED + 4) QUOTE_RECEIVED
    await this.deps.emitter.emit(
      buildEvent({
        type: 'QUOTE_REQUESTED',
        correlationId,
        flowId,
        agentId: quote.agentId,
        capabilityId: quote.capabilityId,
        operatorId,
        payload: { quoteRequestId: quote.quoteRequestId },
      }),
    )
    await this.deps.emitter.emit(
      buildEvent({
        type: 'QUOTE_RECEIVED',
        correlationId,
        flowId,
        quoteId: quote.quoteId,
        capabilityId: quote.capabilityId,
        agentId: quote.agentId,
        operatorId,
        payload: { actionHash: quote.actionHash, pricing: quote.pricing },
      }),
    )

    // 5) POLICY_EVALUATED
    const ctx: PolicyContext = {
      timestamp: (input.now ?? (() => new Date()))().toISOString(),
      correlationId,
      intent,
      quote,
      agent: { id: quote.agentId },
      caller: intent.caller,
      spendWindow: { dailySpentHbar: '0', since: new Date(0).toISOString() },
    }
    const policyEvent: PolicyDecisionEvent = evaluatePolicy(this.deps.rules, ctx)
    const policyDecisionHash = canonicalHash({
      policyId: policyEvent.policyId,
      inputHash: policyEvent.inputHash,
      decision: policyEvent.decision,
    })
    await this.deps.emitter.emit(
      buildEvent({
        type: 'POLICY_EVALUATED',
        correlationId,
        flowId,
        operatorId,
        payload: { ...policyEvent, policyDecisionHash },
      }),
    )

    if (policyEvent.decision.kind === 'deny') {
      return this.terminateFailure(
        flowId,
        intent,
        quote,
        correlationId,
        seqStart,
        policyDecisionHash,
        'mock-no-settlement',
        new PolicyDeniedError(policyEvent.decision.reason, correlationId).message,
      )
    }

    if (policyEvent.decision.kind === 'requireApproval') {
      await this.deps.emitter.emit(
        buildEvent({
          type: 'APPROVAL_REQUIRED',
          correlationId,
          flowId,
          operatorId,
          payload: { approverScope: policyEvent.decision.approverScope },
        }),
      )
      if (!input.approver) {
        throw new ApprovalRequiredError(policyEvent.decision.approverScope, correlationId)
      }
      const approval = await input.approver()
      await this.deps.emitter.emit(
        buildEvent({
          type: 'APPROVAL_GRANTED',
          correlationId,
          flowId,
          operatorId,
          payload: approval,
        }),
      )
    }

    // 7) PAYMENT_REQUIRED
    const requirement = await this.deps.paymentAdapter.createPaymentRequirement({
      quote,
      correlationId,
    })
    await this.deps.emitter.emit(
      buildEvent({
        type: 'PAYMENT_REQUIRED',
        correlationId,
        flowId,
        operatorId,
        payload: { requirement },
      }),
    )

    // Build a mock signed payload (in real adapters this is supplied by the payer).
    const paymentId = newPaymentId()
    const idempotencyKey = canonicalHash({ correlationId, quoteId: quote.quoteId })
    const settlement = await this.deps.paymentAdapter.settlePayment({
      requirement,
      payload: {
        rail: quote.pricing.rail,
        quoteId: quote.quoteId,
        paymentId,
        signedPayload: canonicalHash({ paymentId, quoteId: quote.quoteId }),
      },
      idempotencyKey,
    })

    // 8) PAYMENT_VERIFIED
    await this.deps.emitter.emit(
      buildEvent({
        type: 'PAYMENT_VERIFIED',
        correlationId,
        flowId,
        paymentId: settlement.paymentId,
        operatorId,
        payload: {
          settlementId: settlement.settlementId,
          settlementHash: settlement.settlementHash,
          rail: settlement.rail,
        },
      }),
    )

    // 9) EXECUTION_STARTED
    const executionId = `exec_${paymentId.slice(4)}`
    await this.deps.emitter.emit(
      buildEvent({
        type: 'EXECUTION_STARTED',
        correlationId,
        flowId,
        operatorId,
        payload: { executionId },
      }),
    )

    let resultHash: string
    let terminalType: 'EXECUTION_COMPLETED' | 'EXECUTION_FAILED' = 'EXECUTION_COMPLETED'
    let failureReason: string | undefined
    try {
      const result = await input.execute(intent.action)
      resultHash = canonicalHash({ result })
    } catch (err) {
      terminalType = 'EXECUTION_FAILED'
      failureReason = err instanceof Error ? err.message : String(err)
      resultHash = canonicalHash({ failure: failureReason })
    }

    // 10) EXECUTION_COMPLETED | EXECUTION_FAILED
    await this.deps.emitter.emit(
      buildEvent({
        type: terminalType,
        correlationId,
        flowId,
        operatorId,
        payload: terminalType === 'EXECUTION_COMPLETED'
          ? { executionId, resultHash }
          : { executionId, resultHash, failureReason },
      }),
    )

    // 11) RECEIPT_ISSUED
    const recipient = (() => {
      if ('recipient' in requirement) return requirement.recipient
      return `agent:${quote.agentId}`
    })()
    const receiptId = newReceiptId()
    const issuedAt = new Date().toISOString()
    const seqEnd = (
      await this.deps.emitter.emit(
        buildEvent({
          type: 'RECEIPT_ISSUED',
          correlationId,
          flowId,
          operatorId,
          payload: {
            receiptId,
            resultHash,
            policyDecisionHash,
            settlementHash: settlement.settlementHash,
          },
        }),
      )
    ).sequenceNumber

    const unsignedReceipt = {
      receiptId,
      schemaVersion: '1' as const,
      flowId,
      intentId: intent.intentId,
      correlationId,
      quoteId: quote.quoteId,
      paymentId: settlement.paymentId,
      executionId,
      hcsTopicId: this.deps.topicId,
      hcsSequenceStart: seqStart,
      hcsSequenceEnd: seqEnd,
      resultHash,
      policyDecisionHash,
      settlementHash: settlement.settlementHash,
      rail: quote.pricing.rail,
      asset: requirement.asset,
      amount: requirement.amount,
      recipient,
      status: terminalType === 'EXECUTION_COMPLETED' ? ('completed' as const) : ('failed' as const),
      ...(failureReason !== undefined ? { failureReason } : {}),
      issuedAt,
      verification: {
        method: 'hcs-mirror' as const,
        mirrorHints: [],
        chainAlgorithm: 'sha-256-prevhash' as const,
      },
    }
    const signature = canonicalHash(unsignedReceipt)
    const receipt: VerifiableReceipt = { ...unsignedReceipt, signature }

    const verification = await verifyReceipt(receipt, this.deps.emitter)
    return { flowId, receipt, verification }
  }

  private async terminateFailure(
    flowId: string,
    intent: IntentRequest,
    quote: QuoteResponse,
    correlationId: string,
    seqStart: number,
    policyDecisionHash: string,
    settlementHashPlaceholder: string,
    failureReason: string,
  ): Promise<RunFlowOutput> {
    const receiptId = newReceiptId()
    await this.deps.emitter.emit(
      buildEvent({
        type: 'EXECUTION_FAILED',
        correlationId,
        flowId,
        operatorId: this.deps.operatorId,
        payload: { failureReason, resultHash: canonicalHash({ failureReason }) },
      }),
    )
    const seqEnd = (
      await this.deps.emitter.emit(
        buildEvent({
          type: 'RECEIPT_ISSUED',
          correlationId,
          flowId,
          operatorId: this.deps.operatorId,
          payload: {
            receiptId,
            resultHash: canonicalHash({ failureReason }),
            policyDecisionHash,
            settlementHash: settlementHashPlaceholder,
          },
        }),
      )
    ).sequenceNumber
    const unsignedReceipt = {
      receiptId,
      schemaVersion: '1' as const,
      flowId,
      intentId: intent.intentId,
      correlationId,
      quoteId: quote.quoteId,
      paymentId: 'pay_unsettled',
      executionId: 'exec_aborted',
      hcsTopicId: this.deps.topicId,
      hcsSequenceStart: seqStart,
      hcsSequenceEnd: seqEnd,
      resultHash: canonicalHash({ failureReason }),
      policyDecisionHash,
      settlementHash: settlementHashPlaceholder,
      rail: quote.pricing.rail,
      asset: { kind: 'hbar' as const },
      amount: '0',
      recipient: 'no-recipient',
      status: 'failed' as const,
      failureReason,
      issuedAt: new Date().toISOString(),
      verification: {
        method: 'hcs-mirror' as const,
        mirrorHints: [],
        chainAlgorithm: 'sha-256-prevhash' as const,
      },
    }
    const signature = canonicalHash(unsignedReceipt)
    const receipt: VerifiableReceipt = { ...unsignedReceipt, signature }
    const verification = await verifyReceipt(receipt, this.deps.emitter)
    return { flowId, receipt, verification }
  }
}

export { policy }
