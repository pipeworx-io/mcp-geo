# @pipeworx/mcp-geo

MCP server for geography data — geocoding, elevation, and earthquake monitoring.

## Tools

| Tool | Description |
|------|-------------|
| `geocode` | Convert an address or place name to latitude/longitude coordinates |
| `reverse_geocode` | Convert coordinates to an address |
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

Or run via CLI:

```bash
npx pipeworx use geo
```

## License

MIT
