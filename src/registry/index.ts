import type {
  AgentCapability,
  AgentCard,
  AgentIdentity,
  PaymentRail,
} from '../types'

/**
 * In-memory agent registry. Replace with HCS-10 / ERC-8004 discovery later.
 */
export class AgentRegistry {
  private readonly cards = new Map<string, AgentCard>()

  register(card: AgentCard): void {
    this.cards.set(card.identity.id, card)
  }

  unregister(agentId: string): void {
    this.cards.delete(agentId)
  }

  get(agentId: string): AgentCard | undefined {
    return this.cards.get(agentId)
  }

  list(): AgentCard[] {
    return Array.from(this.cards.values())
  }

  findCapabilities(filter: {
    name?: string
    tags?: string[]
    rails?: PaymentRail[]
  }): AgentCapability[] {
    const out: AgentCapability[] = []
    for (const card of this.cards.values()) {
      for (const cap of card.capabilities) {
        if (filter.name && cap.name !== filter.name) continue
        if (filter.tags?.length) {
          const hasAll = filter.tags.every((t) => cap.tags.includes(t))
          if (!hasAll) continue
        }
        if (filter.rails?.length) {
          const railOk = cap.allowedRails.some((r) => filter.rails!.includes(r))
          if (!railOk) continue
        }
        out.push(cap)
      }
    }
    return out
  }

  identity(agentId: string): AgentIdentity | undefined {
    return this.cards.get(agentId)?.identity
  }
}
