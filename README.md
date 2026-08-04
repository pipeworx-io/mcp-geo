# mcp-geo

Geo MCP — geographic utilities from free public APIs

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `geocode` | Convert an address or place name to up to 5 matching coordinates via OpenStreetMap Nominatim. Returns latitude, longitude, display_name, and place type for each result. |
| `reverse_geocode` | Convert coordinates to a physical address. Returns street address, city, country, and postal code. Use to identify locations from lat/lng pairs. |
| `get_country` | Get country information by name or ISO code (e.g., 'US', 'FR'). Returns capital, population, currency, languages, and neighboring countries. Use for regional context or facts. |
| `get_timezone` | Look up the IANA timezone name, current local time, and UTC offset (hours) for a given latitude and longitude via TimeAPI.io. Requires coordinates — does not accept city names. |
| `get_sunrise_sunset` | Fetch sunrise, sunset, solar noon, civil twilight begin/end, and day length (seconds) for a given latitude/longitude on an optional YYYY-MM-DD date (defaults to today) via the Sunrise-Sunset API. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "geo": {
      "url": "https://gateway.pipeworx.io/geo/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Geo data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
