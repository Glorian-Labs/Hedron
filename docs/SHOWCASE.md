# Hedron Showcase: Hackathon Submission, Demos & Examples

This page centralizes hackathon submission context, demo coverage, and the demo feature matrix. Mainline README stays product-focused and links here.

## Hackathon Submission

Hedron hackathon-specific materials are maintained in a dedicated branch:

- `hackathon/hedera-africa`

See also:

- `docs/HACKATHON_ARCHIVE.md`
- `docs/grants/README.md` (latest Tier submission references)

## Demo & Examples

Hedron includes 8 production demos that cover autonomous negotiation, settlement, and verification paths.

### Quick Commands

```bash
npm run demo
npm run demo:nft-royalty 150
npm run demo:hbar-x402 100
npm run demo:invoice-llm 800
npm run demo:negotiation
npm run demo:supply-chain-fraud
npm run demo:invoice 600
npm run demo:rwa-invoice 600
```

### HCS-10 Features Used Across Demos

- Connection management
- Transaction approval for high-value flows
- Fee-based agent connection options
- Enhanced on-chain auditability

## Demo Feature Matrix

| Demo | HCS-10 Connections | HCS-10 Approval | Network | Asset | Command |
|------|-------------------|-----------------|---------|-------|---------|
| Orchestrator | Yes | Yes (HBAR) | Hedera | HBAR | `npm run demo` |
| NFT Royalty | Yes (fee config) | No | Base | USDC | `npm run demo:nft-royalty 150` |
| HBAR Direct | No | Yes (>=50 HBAR) | Hedera | HBAR | `npm run demo:hbar-x402 100` |
| Intelligent Invoice | No | Yes (>= $500) | Hedera | HBAR | `npm run demo:invoice-llm 800` |
| Supply Chain Negotiation | No | Yes | Hedera | HBAR | `npm run demo:negotiation` |
| Supply Chain Fraud | No | Yes | Hedera | HBAR | `npm run demo:supply-chain-fraud` |
| Invoice Automation | Yes | Yes (>= $500) | Hedera/Base | HBAR/USDC | `npm run demo:invoice 600` |
| RWA Invoice | No | Yes (>= $500) | Hedera/Base | HBAR/USDC | `npm run demo:rwa-invoice 600` |

## Notes

- Main branch keeps long-term product and OSS orientation.
- Submission/deck/timeline materials remain isolated in `hackathon/hedera-africa`.
- "Built For" context belongs to the hackathon archive surface, not the main README.
