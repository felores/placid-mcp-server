# Placid MCP Server

An MCP server implementation for integrating with Placid.app's API. This server provides tools for listing templates and generating creatives through the Model Context Protocol.

## Features

- List available Placid templates with filtering options
- Generate creatives using templates and dynamic content
- Secure API token management
- Error handling and validation
- Type-safe implementation

## Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start the server
npm start
```

## Configuration

Copy `.env.example` to `.env` and configure your environment variables:

```bash
cp .env.example .env
```

Required environment variables:
- `PLACID_API_TOKEN`: Your Placid API token

## Development

```bash
# Run in development mode with hot reload
npm run dev

# Run tests
npm test
```

## Tools

### placid_list_templates
Lists available templates with optional filtering.

### placid_generate_creative
Generate creatives using templates and provided assets.

## Documentation

See the `/docs` directory for detailed documentation:
- [Setup Instructions](docs/SETUP.md)
- [API Documentation](docs/API.md)
- [Development Guidelines](docs/DEVELOPMENT.md)