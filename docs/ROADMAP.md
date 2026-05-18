# Roadmap

Versioned milestones. Each milestone has a tag and a definition of done. Until a tag exists in `git tag`, the milestone is in progress.

## v0.2.0-alpha.0 — cleanup + skeleton (current)

- Public repo is clean and review-friendly (no generated artifacts, no hackathon clutter, no leaked secrets).
- Type surface (`src/types/`), errors (`src/errors/`), and config loader (`src/config/`) landed.
- Router/Broker skeleton with mocked rails passes unit tests.
- Policy engine: pure evaluator + auditable decision events.
- HCS receipt schema v1 + verifier.
- Adapter interfaces defined for Daydreams, HAK v4, PayAI/x402.
- Hardhat compile + unit tests green; CI runs typecheck / lint / unit / contract / gitleaks.

## v0.2.0-beta.0 — testnet end-to-end

- Real HCS audit emission on testnet.
- HBAR + HTS settlement adapters wired to the broker.
- HAK v4 plugin runs end-to-end against a mock provider agent.
- Receipt verifier reads from a public Hedera mirror.

## v0.2.0 — mainnet pilot

- Mainnet HBAR + HTS rails, operator-gated.
- Hedera x402 facilitator either embedded (Hedron-hosted) or delegated to the x402-foundation reference, behind config.
- Daydreams adapter sandbox integration test.
- Production hosting: Router HTTP service deployed with monitoring, observability, on-call playbook.
- p95 latency target documented and met for the canonical commerce loop.

## v0.3.0 — adapter expansion

- MCP server exposing the Hedron tool surface.
- PayAI rail in production (Base + Solana).
- ERC-8004 identity verification for cross-chain agent flows.
- HCS-10 OpenConvAI discovery wired into the registry.

## v0.4.0 — governance + trust

- Policy registry on HCS (policies are published, not just executed).
- Trust / reputation primitives on Hedera (separate from the TrustScore Oracle project).
- Operator-key rotation events on a dedicated HCS topic.

## v0.5.0 — verifiable compute

- Optional verifiable-compute adapter (TEE attestation, ZK proof attachment).
- Receipts include attestation references when adapter is enabled.

## Beyond

- AI Agent Kit-style trusted-registry contributions.
- Public agent marketplace UI as a separate project consuming Hedron.

Each milestone has a tag and a definition of done. Until a tag exists in `git tag`, the milestone is in progress.
