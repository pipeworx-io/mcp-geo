# mcp-geo

Geo MCP — geographic utilities from free public APIs

Part of the [Pipeworx](https://pipeworx.io) open MCP gateway.

## Tools

| Tool | Description |
|------|-------------|
| `geocode` | Convert an address or place name to latitude/longitude coordinates |
| `reverse_geocode` | Convert latitude/longitude coordinates to an address |
| `get_country` | Get detailed information about a country by name or ISO code |
| `get_timezone` | Get the current timezone and local time for a location |
| `get_sunrise_sunset` | Get sunrise and sunset times for a location |

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "geo": {
      "url": "https://gateway.pipeworx.io/geo/mcp"
    }
  }
}
```

Or use the CLI:

```bash
npx pipeworx use geo
```

## License

MIT
