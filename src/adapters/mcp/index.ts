/**
 * MCP adapter placeholder.
 *
 * v0.2: not implemented. The HAK v4 ecosystem already ships
 *   @hashgraph/hedera-agent-kit-mcp; Hedron's own MCP surface lands in v0.3
 *   and likely shells out to that package rather than re-implementing.
 *
 * This file exists to keep the import surface stable.
 */

import type { AdapterManifest } from '../../types'

export const mcpManifest: AdapterManifest = {
  id: 'hedron/mcp',
  kind: 'agent-runtime',
  version: '0.2.0-alpha.0-planning',
  description: 'Planned MCP server exposing Hedron commerce tools (v0.3)',
}
