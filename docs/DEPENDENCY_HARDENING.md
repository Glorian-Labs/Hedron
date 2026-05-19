# Dependency Hardening

Snapshot of the dependency-vulnerability picture for Hedron v0.2.0-alpha.0 and the planned reduction path. Aligned with the **Hedera Agent Kit v4** modular release.

## Current state (May 2026, post-cleanup)

`npm audit --omit=dev` against the post-cleanup `package.json`:

| Severity | Count |
| --- | --- |
| Critical | 2 |
| High | 38 |
| Moderate | 45 |
| Low | 19 |
| **Total** | **104** |

Every advisory is **transitive**. No Hedron direct dependency has an active CVE today.

## Root causes

Three legacy entry points pull in nearly every advisory:

1. **`hedera-agent-kit@3.4.0`** — drags in old `protobufjs`, `socket.io`, `engine.io`, `parseuri`, `parsejson`, `@tootallnate/once`. Accounts for the criticals and most highs.
2. **`@hashgraphonline/standards-agent-kit@0.2.164`** — transitively pulls in `hedera-agent-kit@2.x`, an IPFS stack, and additional LangChain modules. Source of most moderates (`langsmith`, `@langchain/community`, `vite`, `esbuild`, `file-type`).
3. **`hardhat@3.0.9`** — `tar` advisory chain plus `bn.js`, `elliptic`, `ws`, `cookie`, `qs`, `ms`, `debug`. Dev-only; not in published bundle.

## Migration plan (tied to Tier 1 milestones)

### M2 — Trim runtime deps to what the v0.2 core actually uses

- Hedron's **v0.2 core** (`router/`, `broker/`, `policy/`, `receipts/`, `settlement/`, `hcs/`, `registry/`) does not import `hedera-agent-kit` or `@hashgraphonline/standards-agent-kit`. Confirmed by `grep -r hedera-agent-kit src/router src/broker src/policy src/receipts src/settlement src/hcs src/registry`.
- The HAK plugin lives in `src/adapters/hedera-agent-kit/` and will depend on **`@hashgraph/hedera-agent-kit@^4`** (peer) when implemented, with `@hiero-ledger/sdk` as a peer dependency.
- Legacy v0.1 modules (`src/agents/`, `src/protocols/`, `src/services/`, `src/facilitator/`, `src/modes/`) keep `hedera-agent-kit@3` until they are lifted into the v0.2 layout. They are exported under namespaced re-exports (`legacyAgents`, `legacyProtocols`, …) so they do not pollute the v0.2 public surface.

### M2 — Reduce `standards-agent-kit` surface

- Move HCS-10 connection management, transaction approval, and fee config into Hedron's own `src/protocols/hcs10/` using `@hashgraph/sdk` directly.
- Re-pin `@hashgraphonline/standards-agent-kit` only if a remaining feature genuinely requires it.

### M3 — `@hashgraph/sdk` v2 → `@hiero-ledger/sdk` (≥ 2.80)

- HAK v4 ships `@hiero-ledger/sdk` as a peer dep across all packages; the old `@hashgraph/sdk` namespace is being sunset.
- Migrate Hedron's HCS layer once the rest of the v0.2 surface is stable.

### M3 — Resolve the Hardhat path

Two viable options:

- **Pin `hardhat@^2`.** Keeps the supply-chain example contracts compiling without touching the package's CJS layout. Kills the entire `tar` advisory chain. Recommended for Tier 1.
- **Migrate the package to ESM.** Required only when we genuinely need a hardhat v3 feature (which we don't, at M1).

### CI gate change (after M2)

Today `dependency-audit` is warn-only. After M2 lands, flip to:

```yaml
- name: npm audit
  run: |
    npm audit --omit=dev --audit-level=critical
```

so a single critical fails CI. We'll graduate to `--audit-level=high` once the standards-agent-kit reduction work is done.

## Direct Hedron dependencies (today)

Clean today (no open advisory):
- `@hashgraph/sdk` (target: replace with `@hiero-ledger/sdk` in M3)
- `axios`, `ethers`, `dotenv`, `chalk`
- `@langchain/core`, `@langchain/openai`, `@langchain/ollama`
- `a2a-x402`

Each release will refresh this list and re-emit the audit table here.

## Why not "fix everything now"

`npm audit fix --force` would replace `hedera-agent-kit@3` with a newer major and break every file in `src/agents/`, `src/protocols/`, `src/services/`, `src/facilitator/`, `src/modes/`. That is the **M2** change, not the **M1** change. M1 is "clean repo + skeleton + green CI"; M2 is "lift legacy v0.1 modules into v0.2 layout", which is when the runtime dependency surface naturally shrinks.

Reporting open advisories transparently is the right behavior for v0.2.0-alpha.0; closing them by overhauling the legacy modules is the explicit work of M2 and M8.

## Sources

- Hedera Agent Kit v4 release: https://hedera.com/blog/hedera-agent-kit-v4-policies-modular-packages-and-plugin-updates/
- Hedera x402 Hedera-exact reference: https://github.com/x402-foundation/x402/blob/main/typescript/packages/mechanisms/hedera/README.md
