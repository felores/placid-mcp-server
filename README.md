# Placid.app MCP Server
[![smithery badge](https://smithery.ai/badge/@felores/placid-mcp-server)](https://smithery.ai/server/@felores/placid-mcp-server)

An MCP server implementation for integrating with Placid.app's API. This server provides tools for listing templates and generating images and videos through the Model Context Protocol.

<a href="https://glama.ai/mcp/servers/xeklsydon0">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/xeklsydon0/badge" />
</a>

## Features

- List available Placid templates with filtering options
- Generate images and videos using templates and dynamic content
- Secure API token management
- Error handling and validation
- Type-safe implementation

## Requirements: Node.js

1. Install Node.js (version 18 or higher) and npm from [nodejs.org](https://nodejs.org/)
2. Verify installation:
   ```bash
   node --version
   npm --version
   ```

## Installation

### Quick Start (Recommended)

The easiest way to get started is using Smithery, which will automatically configure everything for you:

```bash
npx -y @smithery/cli install @felores/placid-mcp-server --client claude
```

### Manual Configuration

If you prefer to configure manually, add this to your Claude Desktop or Cline settings:

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

## Getting Your Placid API Token

1. Log in to your [Placid.app](https://placid.app/) account
2. Go to Settings > API
3. Click on "Create API Token"
4. Give your token a name (e.g., "MCP Server")
5. Copy the generated token
6. Add the token to your configuration as shown above

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

### placid_generate_video
Generate videos by combining Placid templates with dynamic content like videos, images, and text. For longer videos (>60 seconds processing time), you'll receive a job ID to check status in your Placid dashboard.

#### Parameters
- `template_id` (required): UUID of the template to use
- `layers` (required): Object containing dynamic content for template layers
  - For video layers: `{ "layerName": { "video": "https://video-url.com" } }`
  - For image layers: `{ "layerName": { "image": "https://image-url.com" } }`
  - For text layers: `{ "layerName": { "text": "Your content" } }`
- `audio` (optional): URL to an mp3 audio file
- `audio_duration` (optional): Set to 'auto' to trim audio to video length
- `audio_trim_start` (optional): Timestamp of trim start point (e.g. '00:00:45' or '00:00:45.25')
- `audio_trim_end` (optional): Timestamp of trim end point (e.g. '00:00:55' or '00:00:55.25')

#### Response
Returns an object containing:
- `status`: Current status ("finished", "queued", or "error")
- `video_url`: URL to download the generated video (when status is "finished")
- `job_id`: ID for checking status in Placid dashboard (for longer videos)

#### Example Usage for LLM models
```json
{
  "template_id": "template-uuid",
  "layers": {
    "MEDIA": { "video": "https://example.com/video.mp4" },
    "PHOTO": { "image": "https://example.com/photo.jpg" },
    "LOGO": { "image": "https://example.com/logo.png" },
    "HEADLINE": { "text": "My Video Title" }
  },
  "audio": "https://example.com/background.mp3",
  "audio_duration": "auto"
}
```

### placid_generate_image
Generate static images by combining Placid templates with dynamic content like text and images.

#### Parameters
- `template_id` (required): UUID of the template to use
- `layers` (required): Object containing dynamic content for template layers
  - For text layers: `{ "layerName": { "text": "Your content" } }`
  - For image layers: `{ "layerName": { "image": "https://image-url.com" } }`

#### Response
Returns an object containing:
- `status`: "finished" when complete
- `image_url`: URL to download the generated image

#### Example Usage for LLM models
```json
{
  "template_id": "template-uuid",
  "layers": {
    "headline": { "text": "Welcome to My App" },
    "background": { "image": "https://example.com/bg.jpg" }
  }
}
```

## Documentation

For more detailed information about the Placid API, visit the [Placid API Documentation](https://placid.app/docs/api/).

## License

MIT
