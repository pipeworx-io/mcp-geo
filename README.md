# mcp-geo

Geo MCP — geographic utilities from free public APIs

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1679+ live data sources.

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

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/geo/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1679+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## No MCP client? Call it over HTTP

```bash
curl -X POST https://gateway.pipeworx.io/v1/tools/geo_geocode \
  -H 'Content-Type: application/json' \
  -d '{"query":"1600 Pennsylvania Avenue, Washington DC"}'
```

No account needed for the first calls. Inspect any tool: `GET https://gateway.pipeworx.io/v1/tools/geo_geocode`. Find one: `POST https://gateway.pipeworx.io/v1/tools/search_packs` with `{"query":"..."}`.

## Standalone (no gateway account)

This package also runs as a local stdio MCP server — no Pipeworx account, no
gateway round-trip:

```json
{
  "mcpServers": {
    "geo": {
      "command": "npx",
      "args": ["-y", "@pipeworx/mcp-geo"]
    }
  }
}
```

Or run it directly to confirm it starts:

```bash
npx -y @pipeworx/mcp-geo
```

It speaks MCP over stdin/stdout and answers `initialize`/`tools/list`/`tools/call`
for **only** this pack's tools — none of the shared meta-tools the gateway
connection above adds. Same source, same tools, no ask_pipeworx routing.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Geo data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
