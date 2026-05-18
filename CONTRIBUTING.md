# Contributing to Hedron

Thanks for considering a contribution. Hedron is a small, opinionated runtime. We optimize for reviewability and provable behavior.

## Quick rules

- **Small commits.** One logical change per commit, with a one-line subject + a body that explains *why*.
- **No secrets, ever.** `.env` is gitignored. CI runs `gitleaks` and will fail your PR.
- **No generated artifacts in Git.** `dist/`, `artifacts/`, `cache/`, `typechain*`, `coverage/` are gitignored.
- **Mock-first.** Default tests must pass with no real credentials. Real-credential tests are opt-in via `RUN_*_INTEGRATION=true` env flags.
- **Docs match code.** If you change the runtime contract, update `docs/` in the same PR.

## Local setup

```bash
git clone https://github.com/Glorian-Labs/Hedron.git
cd Hedron
npm install
cp .env.example .env
npm run typecheck
npm run lint
npm run test
```

## Branching

- `main` — stable, public-facing.
- `develop` — integration. PRs target `develop`, then `develop` → `main` at release.
- `chore/…`, `feat/…`, `fix/…`, `docs/…` — feature branches.
- `archive/…` — preserved snapshots. Do not delete locally.

## Commit messages

Use conventional commits:

```
feat(router): add capability filtering by rail
fix(broker): bind quoteId to settlement intent
docs(receipts): clarify prevhash encoding
chore(repo): bump hedera-agent-kit to v4-beta
test(policy): cover approval-threshold path
```

## Pre-push hook (recommended)

Drop into `.git/hooks/pre-push` and `chmod +x`:

```bash
#!/usr/bin/env bash
set -euo pipefail
echo "→ gitleaks"
npx --yes gitleaks@latest detect --source . --no-git --redact
echo "→ typecheck"
npm run typecheck
echo "→ lint"
npm run lint
echo "→ unit tests"
npm run test
```

## Adapter contributions

Adapter contributions (Daydreams, HAK plugin, MCP, additional payment rails) must include:

1. A manifest (`AdapterManifest`) describing the adapter id, version, supported capabilities, and supported rails.
2. An interface conformance test (uses the mock broker).
3. An end-to-end mock test (`npm run test:unit` must exercise it).
4. A doc page under `docs/`.

A new rail must implement every `PaymentAdapter` method and pass `tests/unit/settlement/{replay,quote-swap,mismatch,idempotency,expiry,policy-deny}.test.ts`.

## What we will NOT merge

- Marketing copy in technical docs.
- Mainnet claims without verifiable proof.
- New top-level dependencies without justification.
- Code that introduces a third way to express the same concept (Router, Broker, and adapters are the surfaces; new files go inside one of them).
- PRs that delete or modify `docs/HCS_RECEIPTS.md`'s schema without a versioned migration.

## Code style

- TypeScript strict mode, no `any`. Use the types in `src/types/`.
- No default exports.
- Prefer pure functions; side effects live behind interface boundaries.
- File names: kebab-case for modules, PascalCase for class files.

## Reporting bugs

GitHub Issues for non-security bugs. Security: see [`SECURITY.md`](SECURITY.md).

## Code of conduct

Be precise, be honest, be kind. Disagree by improving the artifact, not the author.
