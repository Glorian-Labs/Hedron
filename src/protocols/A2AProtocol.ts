/**
 * Google A2A (Agent-to-Agent) Protocol Implementation
 * 
 * This module implements the Google A2A protocol for agent communication
 * on Hedera Network. A2A enables agents to:
 * - Discover each other
 * - Exchange structured messages
 * - Negotiate payment terms
 * - Execute autonomous operations
 * 
 * @see https://google.github.io/adk-docs/a2a/intro/
 */

import { HCS10Client } from '@hashgraphonline/standards-agent-kit'
import chalk from 'chalk'

/**
 * A2A Message Format as per Google A2A Standard
 */
export interface A2AMessage {
  version: "1.0"
  sender: {
    agentId: string
    capabilities: string[]
    network: "hedera-testnet"
  }
  receiver: {
    agentId: string
  }
  messageType: "request" | "response" | "notification"
  payload: any
  timestamp: number
  nonce: string
  signature?: string
}

/**
 * A2A Protocol Implementation
 */
export class A2AProtocol {
  private hcsClient: HCS10Client
  private agentId: string
  private capabilities: string[]
  private nonceGenerator: number = 0

  constructor(hcsClient: HCS10Client, agentId: string, capabilities: string[]) {
    this.hcsClient = hcsClient
    this.agentId = agentId
    this.capabilities = capabilities
  }

  /**
   * Create an A2A message following the Google A2A protocol
   */
  createMessage(
    receiverAgentId: string,
    messageType: "request" | "response" | "notification",
    payload: any
  ): A2AMessage {
    return {
      version: "1.0",
      sender: {
        agentId: this.agentId,
        capabilities: this.capabilities,
        network: "hedera-testnet"
      },
      receiver: {
        agentId: receiverAgentId
      },
      messageType,
      payload,
      timestamp: Date.now(),
      nonce: this.generateNonce()
    }
  }

  /**
   * Parse and validate an incoming A2A message
   */
  parseMessage(messageContent: string): A2AMessage | null {
    try {
      const message = JSON.parse(messageContent) as A2AMessage

      // Validate message structure
      if (!message.version || message.version !== "1.0") {
        console.error(chalk.red("❌ Invalid A2A message version"))
        return null
      }

      if (!message.sender || !message.receiver) {
        console.error(chalk.red("❌ Missing sender or receiver in A2A message"))
        return null
      }

      if (!message.messageType) {
        console.error(chalk.red("❌ Missing messageType in A2A message"))
        return null
      }

      console.log(chalk.blue(`✅ Valid A2A ${message.messageType} from ${message.sender.agentId} to ${message.receiver.agentId}`))
      
      return message
    } catch (error) {
      console.error(chalk.red(`❌ Failed to parse A2A message: ${(error as Error).message}`))
      return null
    }
  }

  /**
   * Send an A2A message via HCS topic
   */
  async sendMessage(topicId: string, receiverAgentId: string, messageType: "request" | "response" | "notification", payload: any): Promise<void> {
    const message = this.createMessage(receiverAgentId, messageType, payload)
    
    console.log(chalk.yellow(`📤 Sending A2A ${messageType} to ${receiverAgentId}`))
    
    await this.hcsClient.sendMessage(topicId, JSON.stringify(message))
    
    console.log(chalk.green(`✅ A2A message sent successfully`))
  }

  /**
   * Broadcast an A2A message to multiple agents
   */
  async broadcastMessage(topicId: string, messageType: "request" | "response" | "notification", payload: any): Promise<void> {
    const message = {
      ...this.createMessage("broadcast", messageType, payload),
      receiver: { agentId: "broadcast" }
    }
    
    console.log(chalk.yellow(`📡 Broadcasting A2A ${messageType} to all agents`))
    
    await this.hcsClient.sendMessage(topicId, JSON.stringify(message))
    
    console.log(chalk.green(`✅ A2A broadcast successful`))
  }

  /**
   * Generate a unique nonce for message identification
   */
  private generateNonce(): string {
    this.nonceGenerator++
    return `${Date.now()}-${this.nonceGenerator}-${Math.random().toString(36).substring(7)}`
  }
}

/**
 * A2A Handshake - Initialize agent discovery and communication
 */
export interface A2AHandshake {
  handshakeType: "init" | "response"
  agentId: string
  capabilities: string[]
  supportedProtocols: string[]
  timestamp: number
}

export class A2AHandshakeProtocol {
  private a2a: A2AProtocol

  constructor(a2a: A2AProtocol) {
    this.a2a = a2a
  }

  /**
   * Initiate handshake with another agent
   */
  async initiateHandshake(topicId: string, targetAgentId: string, capabilities: string[], supportedProtocols: string[]): Promise<void> {
    const handshake: A2AHandshake = {
      handshakeType: "init",
      agentId: this.a2a['agentId'],
      capabilities,
      supportedProtocols,
      timestamp: Date.now()
    }

    await this.a2a.sendMessage(topicId, targetAgentId, "request", {
      type: "handshake",
      data: handshake
    })

    console.log(chalk.blue(`🤝 Handshake initiated with ${targetAgentId}`))
  }
}

