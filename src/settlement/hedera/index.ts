/**
 * Native Hedera HBAR / HTS settlement — interface skeleton.
 *
 * v0.2 Tier 1 M4 target: implement against @hashgraph/sdk (or @hiero-ledger/sdk
 * once Hedron core migrates). The skeleton documents the contract; the
 * MockPaymentAdapter in `../index.ts` is used for tests until then.
 */

import type { PaymentAdapter, PaymentRail } from '../types'

export interface HederaSettlementOptions {
  network: 'testnet' | 'mainnet'
  operatorId: string
  operatorKeyRef: string
  defaultRecipient: string
}

export interface HederaSettlementAdapter extends PaymentAdapter {
  readonly rail: Extract<PaymentRail, 'hedera-hbar' | 'hedera-hts'>
}

export const HEDERA_RAIL_HBAR: PaymentRail = 'hedera-hbar'
export const HEDERA_RAIL_HTS: PaymentRail = 'hedera-hts'
