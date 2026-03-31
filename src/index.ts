/**
 * Geo MCP — geographic utilities from free public APIs
 *
 * Tools:
 * - geocode: address -> coordinates (Nominatim)
 * - reverse_geocode: coordinates -> address (Nominatim)
 * - get_country: country info (REST Countries)
 * - get_timezone: timezone for coordinates (WorldTime API)
 * - get_sunrise_sunset: sun times for coordinates (Sunrise-Sunset API)
 */

interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

const tools: McpToolExport['tools'] = [
  {
    name: 'geocode',
    description: 'Convert an address or place name to latitude/longitude coordinates',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Address or place name to geocode' },
      },
      required: ['query'],
    },
  },
  {
    name: 'reverse_geocode',
    description: 'Convert latitude/longitude coordinates to an address',
    inputSchema: {
      type: 'object',
      properties: {
        latitude: { type: 'number', description: 'Latitude' },
        longitude: { type: 'number', description: 'Longitude' },
      },
      required: ['latitude', 'longitude'],
    },
  },
  {
    name: 'get_country',
    description: 'Get detailed information about a country by name or ISO code',
    inputSchema: {
      type: 'object',
      properties: {
        code_or_name: {
          type: 'string',
          description: 'Country name or ISO 3166-1 alpha-2/alpha-3 code',
        },
      },
      required: ['code_or_name'],
    },
  },
  {
    name: 'get_timezone',
    description: 'Get the current timezone and local time for a location',
    inputSchema: {
      type: 'object',
      properties: {
        latitude: { type: 'number', description: 'Latitude' },
        longitude: { type: 'number', description: 'Longitude' },
      },
      required: ['latitude', 'longitude'],
    },
  },
  {
    name: 'get_sunrise_sunset',
    description: 'Get sunrise and sunset times for a location',
    inputSchema: {
      type: 'object',
      properties: {
        latitude: { type: 'number', description: 'Latitude' },
        longitude: { type: 'number', description: 'Longitude' },
        date: { type: 'string', description: 'Date in YYYY-MM-DD format (default: today)' },
      },
      required: ['latitude', 'longitude'],
    },
  },
];

const NOMINATIM_HEADERS = {
  'User-Agent': 'Pipeworx/0.1 (MCP gateway)',
};

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'geocode': {
      const params = new URLSearchParams({
        q: args.query as string,
        format: 'json',
        limit: '5',
        addressdetails: '1',
      });
      const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
        headers: NOMINATIM_HEADERS,
      });
      if (!res.ok) throw new Error(`Nominatim error: ${res.status}`);
      const data = (await res.json()) as {
        lat: string;
        lon: string;
        display_name: string;
        type: string;
      }[];
      return {
        results: data.map((r) => ({
          latitude: parseFloat(r.lat),
          longitude: parseFloat(r.lon),
          display_name: r.display_name,
          type: r.type,
        })),
      };
    }

    case 'reverse_geocode': {
      const params = new URLSearchParams({
        lat: String(args.latitude),
        lon: String(args.longitude),
        format: 'json',
        addressdetails: '1',
      });
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?${params}`, {
        headers: NOMINATIM_HEADERS,
      });
      if (!res.ok) throw new Error(`Nominatim error: ${res.status}`);
      const data = (await res.json()) as {
        display_name: string;
        address: Record<string, string>;
      };
      return {
        display_name: data.display_name,
        address: data.address,
      };
    }

    case 'get_country': {
      const query = args.code_or_name as string;
      // Try code first (2 or 3 chars), then name
      const isCode = query.length <= 3 && /^[A-Za-z]+$/.test(query);
      const endpoint = isCode
        ? `https://restcountries.com/v3.1/alpha/${encodeURIComponent(query)}`
        : `https://restcountries.com/v3.1/name/${encodeURIComponent(query)}`;
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`REST Countries error: ${res.status}`);
      const data = (await res.json()) as {
        name: { common: string; official: string };
        capital?: string[];
        population: number;
        area: number;
        region: string;
        subregion?: string;
        languages?: Record<string, string>;
        currencies?: Record<string, { name: string; symbol: string }>;
        timezones: string[];
        flags: { png: string };
        cca2: string;
        cca3: string;
      }[];
      const c = data[0];
      return {
        name: c.name.common,
        official_name: c.name.official,
        codes: { alpha2: c.cca2, alpha3: c.cca3 },
        capital: c.capital?.[0] ?? 'N/A',
        population: c.population,
        area_km2: c.area,
        region: c.region,
        subregion: c.subregion ?? '',
        languages: c.languages ? Object.values(c.languages) : [],
        currencies: c.currencies
          ? Object.values(c.currencies).map((cur) => `${cur.name} (${cur.symbol})`)
          : [],
        timezones: c.timezones,
      };
    }

    case 'get_timezone': {
      // Use TimeAPI.io for timezone lookup by coordinates
      const res = await fetch(
        `https://timeapi.io/api/timezone/coordinate?latitude=${args.latitude}&longitude=${args.longitude}`,
      );
      if (!res.ok) throw new Error(`TimeAPI error: ${res.status}`);
      const data = (await res.json()) as {
        timeZone: string;
        currentLocalTime: string;
        currentUtcOffset: { hours: number; minutes: number };
      };
      return {
        timezone: data.timeZone,
        local_time: data.currentLocalTime,
        utc_offset_hours: data.currentUtcOffset.hours + data.currentUtcOffset.minutes / 60,
      };
    }

    case 'get_sunrise_sunset': {
      const date = (args.date as string) || 'today';
      const params = new URLSearchParams({
        lat: String(args.latitude),
        lng: String(args.longitude),
        date,
        formatted: '0',
      });
      const res = await fetch(`https://api.sunrise-sunset.org/json?${params}`);
      if (!res.ok) throw new Error(`Sunrise-Sunset API error: ${res.status}`);
      const data = (await res.json()) as {
        results: {
          sunrise: string;
          sunset: string;
          solar_noon: string;
          day_length: number;
          civil_twilight_begin: string;
          civil_twilight_end: string;
        };
        status: string;
      };
      if (data.status !== 'OK') throw new Error(`Sunrise-Sunset: ${data.status}`);
      const r = data.results;
      return {
        sunrise: r.sunrise,
        sunset: r.sunset,
        solar_noon: r.solar_noon,
        day_length_seconds: r.day_length,
        civil_twilight_begin: r.civil_twilight_begin,
        civil_twilight_end: r.civil_twilight_end,
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies McpToolExport;
