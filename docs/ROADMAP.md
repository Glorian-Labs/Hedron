# Hedron Roadmap & Real-World Adoption

This roadmap reflects the latest official grant execution plan for Hedron, aligned to the Router/Broker vision and the 18-month delivery window.

## Step 1 - Activation (Months 1-6, M1-M6)

Goal: ship a production-grade agentic commerce loop on Hedera mainnet with clear proof and developer adoption.

- Deploy Router/Broker baseline on mainnet (production hosting + monitoring)
- Deliver one end-to-end flow: discover -> quote -> approve/pay -> execute -> receipt
- Ship Web UI v1 for agent discovery, pricing, approval/payment, and receipt verification
- Stand up HCS audit trail as first-class proof with typed events and correlation IDs
- Deliver settlement module with idempotent receipts, replay protection, and safe retries
- Implement policy module foundations: approvals, allowlists, spending limits
- Establish CI/CD discipline (lint, unit/integration tests, changelog, reproducible releases)
- Enforce secure protocol messaging (signed messages, replay rejection, key-handling guidance)

## Step 2 - Milestone (Months 6-9, M6-M9)

Goal: deliver a grant-grade Agentic Commerce Platform on Hedera with hardened reliability, integrations, and verifiable execution trails.

- Router/Broker v2: higher throughput, queueing, idempotency, multi-tenant support, rate limits
- Audit Trail v1: explorer-verifiable workflow trails for proposal/payment/receipt lifecycle
- Payments v2: stablecoin rails where applicable, receipt upgrades, refund/dispute hooks
- Integrations v1: AI Agent Kit plugin + MCP tools + Skills commerce actions
- UI v1 maturation for production workflows
- Operate 2 production pilots with published runbooks and measured SLOs
- Introduce governance and registry foundations for verified listings and policy evolution

Definition of done highlights:

- p95 latency/error rate tracked, SLOs defined and met in pilots
- Pilot workflows produce verifiable HCS trails + payment receipts
- Integrations ship as versioned packages with docs/examples

## Step 3 - Scale (Months 9-18, M9-M18)

Goal: ecosystem growth, stronger trust infrastructure, and mature hosted operations.

- Trusted registry + governance hooks for capabilities, pricing, and policies
- Marketplace-grade trust primitives (verified listings, reputation signals, dispute traceability)
- Multi-environment operations maturity (staging/prod parity, reliability reports, cost controls)
- Scalability program (queueing, concurrency controls, load testing, capacity planning)
- Partnership expansion and production integrations through AI Studio surfaces
- Ongoing developer marketing cadence (case studies, tutorials, integration content)
- Compliance readiness for hosted mainnet services (privacy, acceptable use, incident response)

## Build Priorities Snapshot

The immediate implementation priorities remain:

1. Router/Broker mainnet deployment
2. HCS audit trail for every step
3. Payments with idempotent receipts
4. Policy module (approvals, allowlists, limits)
5. Integrations (AI Agent Kit + MCP + Skills)
