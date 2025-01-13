# Placid.app MCP Server
[![smithery badge](https://smithery.ai/badge/@felores/placid-mcp-server)](https://smithery.ai/server/@felores/placid-mcp-server)

An MCP server implementation for integrating with Placid.app's API. This server provides tools for listing templates and generating creatives through the Model Context Protocol.

<a href="https://glama.ai/mcp/servers/xeklsydon0">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/xeklsydon0/badge" />
</a>

## Features

- List available Placid templates with filtering options
- Generate creatives using templates and dynamic content
- Secure API token management
- Error handling and validation
- Type-safe implementation

## Installation Options

### Installing via Smithery

To install @felores/placid-mcp-server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@felores/placid-mcp-server):

```bash
npx -y @smithery/cli install @felores/placid-mcp-server --client claude
```

### NPX Installation

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

### Manual Installation

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
Lists available Placid templates with filtering options. Each template includes its title, ID, preview image URL, available layers, and tags.

#### Parameters
- `collection_id` (optional): Filter templates by collection ID
- `custom_data` (optional): Filter by custom reference data
- `tags` (optional): Array of tags to filter templates by

#### Response
Returns an array of templates, each containing:
- `uuid`: Unique identifier for the template
- `title`: Template name
- `thumbnail`: Preview image URL (if available)
- `layers`: Array of available layers with their names and types
- `tags`: Array of template tags

### placid_generate_creative
Generate creatives by combining Placid templates with dynamic content like text and images.

#### Parameters
- `template_id` (required): UUID of the template to use
- `layers` (required): Object containing dynamic content for template layers
  - For text layers: `{ "layerName": { "text": "Your content" } }`
  - For image layers: `{ "layerName": { "image": "https://image-url.com" } }`
- `modifications` (optional): Customize the output
  - `width`: Output width in pixels
  - `height`: Output height in pixels  
  - `filename`: Custom filename for the generated creative

#### Response
Returns an object containing:
- `status`: "finished" when complete
- `image_url`: URL to download the generated creative
- `credits_used`: Number of Placid credits consumed

#### Example Usage for LLM models
```json
{
  "template_id": "template-uuid",
  "layers": {
    "headline": { "text": "Welcome to My App" },
    "background": { "image": "https://example.com/bg.jpg" }
  },
  "modifications": {
    "width": 1200,
    "height": 630
  }
}
```

## Documentation

For more detailed information about the Placid API, visit the [Placid API Documentation](https://placid.app/docs/api/).

## License

MIT
