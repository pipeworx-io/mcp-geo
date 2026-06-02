# mcp-geo

Geo MCP — geographic utilities from free public APIs

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 673+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `geocode` | Convert an address or place name to coordinates. Returns latitude, longitude, and formatted address. Use when you need map positions or spatial analysis. |
| `reverse_geocode` | Convert coordinates to a physical address. Returns street address, city, country, and postal code. Use to identify locations from lat/lng pairs. |
| `get_country` | Get country information by name or ISO code (e.g., \'US\', \'FR\'). Returns capital, population, currency, languages, and neighboring countries. Use for regional context or facts. |
| `get_timezone` | Get timezone and current local time for coordinates or city name. Returns timezone name, UTC offset, and current time. Use for scheduling across time zones. |
| `get_sunrise_sunset` | Get sunrise/sunset times for a location by coordinates or city name. Returns exact times, daylight duration, and twilight times. Use for activity planning or astronomical data. |

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

Or connect to the full Pipeworx gateway for access to all 673+ data sources:

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

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
