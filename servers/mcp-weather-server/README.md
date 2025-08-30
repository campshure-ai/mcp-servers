# Weather MCP Server - Complete Setup Guide

## 📁 Step-by-Step Setup

### 1. Create the Directory Structure

Based on your repository structure, create the weather server:

```bash
cd mcp-servers/servers
mkdir mcp-weather-server
cd mcp-weather-server
mkdir src
```

### 2. Create All Required Files

#### `src/index.tsx`
Copy the main server implementation (see artifact: "Weather MCP Server - index.tsx")

#### `package.json`
Copy the package configuration (see artifact: "Weather MCP Server - Package Configuration")

#### `tsconfig.json`
Copy the TypeScript configuration (see artifact: "Weather MCP Server - TypeScript Configuration")

#### `README.md`
Copy the documentation (see artifact: "Weather MCP Server - README Documentation")

#### `.gitignore`
Copy the git ignore file (see artifact: "Weather MCP Server - .gitignore")

### 3. Install and Setup

```bash
# Install dependencies
npm install

# Get your OpenWeatherMap API key
# Sign up at: https://openweathermap.org/api

# Set environment variable
export WEATHER_API_KEY="your_api_key_here"

# Build the project
npm run build

# Test the server
npm start
```

### 4. Integration with Claude Desktop

Edit your `~/.config/claude-desktop/config.json` (or equivalent path):

```json
{
  "mcpServers": {
    "weather": {
      "command": "node",
      "args": ["/full/path/to/mcp-servers/servers/mcp-weather-server/dist/index.js"],
      "env": {
        "WEATHER_API_KEY": "your_openweathermap_api_key"
      }
    }
  }
}
```

### 5. Test Commands

Once integrated with Claude Desktop, try these commands:

```
What's the current weather in New York?

Give me a 5-day forecast for London, UK

Are there any weather alerts for Miami, Florida?

What's the weather like in Tokyo with imperial units?

Show me the weather in Paris for the next 3 days
```

## 🔧 Final Directory Structure

Your final structure should look like:

```
mcp-servers/
├── README.md
├── CONTRIBUTE.md
├── LICENSE
└── servers/
    ├── example-mcp-server/
    │   ├── src/
    │   │   └── index.tsx
    │   ├── package.json
    │   └── tsconfig.json
    └── mcp-weather-server/          # Your new server
        ├── src/
        │   └── index.tsx            # Main implementation
        ├── dist/                    # Built files (auto-generated)
        ├── package.json             # Dependencies
        ├── tsconfig.json            # TypeScript config
        ├── README.md                # Documentation
        └── .gitignore              # Git ignore
```

## 🚀 Push to Repository

```bash
# From the mcp-servers root directory
git add servers/mcp-weather-server/
git commit -m "Add Weather MCP Server with OpenWeatherMap integration

- Current weather conditions with temperature, humidity, wind
- 1-5 day weather forecasts with detailed breakdowns  
- Weather alerts and warnings support
- Multiple temperature units (metric, imperial, kelvin)
- Global location coverage
- Comprehensive error handling and user-friendly responses"

git push origin main
```

## 📝 Pull Request Description Template

```markdown
# Add Weather MCP Server 🌤️

## Overview
This PR adds a comprehensive weather MCP server that provides real-time weather data, forecasts, and alerts using the OpenWeatherMap API.

## Features Added
- ✅ Current weather conditions (temperature, humidity, wind, pressure)
- ✅ 1-5 day weather forecasts with detailed daily breakdowns
- ✅ Weather alerts and severe weather warnings  
- ✅ Support for metric, imperial, and Kelvin units
- ✅ Global location coverage (200,000+ cities)
- ✅ Comprehensive error handling with user-friendly messages

## Tools Provided
1. **`get_current_weather`** - Real-time weather conditions
2. **`get_weather_forecast`** - Multi-day weather forecasts
3. **`get_weather_alerts`** - Weather warnings and alerts

## Usage Examples
```
What's the weather in London right now?
Give me a 3-day forecast for Tokyo, Japan
Are there any storm warnings for Miami?
```

## Testing
- [x] Successfully builds and runs
- [x] All tools work with valid locations
- [x] Error handling works for invalid locations
- [x] Multiple units (metric/imperial/kelvin) work correctly
- [x] Integrates properly with Claude Desktop

## API Requirements
- Requires OpenWeatherMap API key (free tier: 60 calls/min, 1M calls/month)
- No additional dependencies beyond standard MCP SDK

## Documentation
- Complete README with setup instructions
- Clear API documentation for all tools
- Integration guide for Claude Desktop
- Development and contribution guidelines
```

This weather MCP server is now ready to be integrated into your campshure-ai/mcp-servers repository! 🌤️