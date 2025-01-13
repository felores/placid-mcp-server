# Placid MCP Server

An MCP server implementation for integrating with Placid.app's API. This server provides tools for listing templates and generating creatives through the Model Context Protocol.

## Features

- List available Placid templates with filtering options
- Generate creatives using templates and dynamic content
- Secure API token management
- Error handling and validation
- Type-safe implementation

## Installation Options

### Option 1: NPX Installation (Recommended)

The quickest way to get started is using npx:

```bash
npx @felores/placid-mcp-server
```

Then add the server configuration to your Claude Desktop or Cline settings:

```json
{
  "mcpServers": {
    "placid": {
      "command": "npx",
      "args": ["@felores/placid-mcp-server"],
      "env": {
        "PLACID_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

### Option 2: Manual Installation

1. Clone the repository:
```bash
git clone https://github.com/felores/placid-mcp-server.git
cd placid-mcp-server
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Add the server configuration to your Claude Desktop or Cline settings:
```json
{
  "mcpServers": {
    "placid": {
      "command": "node",
      "args": ["path/to/placid-mcp-server/build/index.js"],
      "env": {
        "PLACID_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

Replace `path/to/placid-mcp-server` with the absolute path to your cloned repository.

## Getting Your Placid API Token

1. Log in to your [Placid.app](https://placid.app/) account
2. Go to Settings > API
3. Click on "Create API Token"
4. Give your token a name (e.g., "MCP Server")
5. Copy the generated token
6. Add the token to your Claude Desktop or Cline configuration as shown in the installation steps above

## Development

```bash
# Run in development mode with hot reload
npm run dev

# Run tests
npm test
```

## Tools

### placid_list_templates
Lists available templates with optional filtering. Each template includes its title, ID, preview image URL, available layers, and tags.

### placid_generate_creative
Generate creatives using templates and provided assets.

## Documentation

For more detailed information about the Placid API, visit the [Placid API Documentation](https://placid.app/docs/api/).

## License

MIT