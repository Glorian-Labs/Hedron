# Hedron

**Hedron by Glorian Labs**

Hedron is a Hedera-native agentic commerce SDK for autonomous negotiation, payment and settlement, and verifiable receipts. It provides a programmable Router/Broker foundation for multi-agent systems that need trusted coordination, policy-aware execution, and auditable outcomes on-chain.

## Recognition

“We’re honored that Hedron — an autonomous agent ecosystem built on the Hedera Hashgraph stack — was recognized as a Top 3 winner in the AI & DePIN track at the Hedera Africa Hackathon. This grant accelerates our mission to power the emerging agent economy, enabling autonomous agents to coordinate, negotiate, establish trust, transact, and build real economic value on-chain.”

## Roadmap / Next Steps

### Step 1 (Months 1-6) - Activation (M1-M6)

- Ship a production-grade agentic commerce loop on Hedera mainnet
- Deploy Router/Broker baseline on mainnet with reliable request routing
- Add HCS audit trail foundations for verifiable negotiation and execution history
- Deliver payments and settlement module with idempotent receipts
- Establish baseline policy module for approval, limits, and compliance constraints
- Release initial UI v1 surfaces for operators and developers
- Stand up CI/CD, baseline observability, and secure release hygiene
- Implement security basics: key handling hardening, access controls, and dependency checks

### Step 2 (Months 6-9) - Milestone (M6-M9)

- Router/Broker v2 with resilience, retries, and improved orchestration controls
- Audit Trail v1 with stronger traceability and operational views
- Payments v2 for expanded settlement reliability and reconciliation
- Integrations v1 with AI Agent Kit + MCP + Skills
- UI v1 maturation for production workflows
- Run and document 2 production pilots
- Expand governance and policy capabilities for enterprise readiness

### Step 3 (Months 9-18) - Scale (M9-M18)

- Scale ecosystem participation with partner and agent network growth
- Add registry + governance hooks for extensibility and lifecycle controls
- Mature platform operations: SLOs, incident response, and reliability automation
- Harden security and compliance posture for broader production adoption

## Quickstart

```bash
git clone https://github.com/glorianlabs/hedron.git
cd hedron
npm install
cp env.example .env
npm run build
```

Run the orchestrator demo:

```bash
npm run demo
```

## Repo Structure

```text
hedron/
├── src/                     # SDK source (agents, protocols, services, facilitator)
├── contracts/               # Solidity contracts
├── scripts/                 # Deployment and operational scripts
├── tests/                   # Unit, integration, and e2e tests
├── demo/                    # Runnable demos
├── docs/                    # Product and technical documentation
│   └── HACKATHON_ARCHIVE.md # Archived hackathon context for reference
├── SDK_README.md            # SDK-focused usage
└── README.md                # Project overview and roadmap
```

## Documentation

- Core index: `docs/INDEX.md`
- SDK guide: `SDK_README.md`
- API reference: `docs/API_REFERENCE.md`
- Usage guide: `docs/USAGE_GUIDE.md`
- Hackathon historical context: `docs/HACKATHON_ARCHIVE.md`

## Contributing

See `CONTRIBUTING.md` for development flow, branch/PR conventions, and review expectations.

## Security

See `SECURITY.md` to report vulnerabilities and follow responsible disclosure.

## License

MIT License. See `LICENSE`.

---

Built with Hedera-native primitives for the agent economy by **Glorian Labs LTD**.
