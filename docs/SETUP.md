# Setup Instructions

## Prerequisites

- Node.js 16 or higher
- npm 7 or higher
- A Placid.app API token

## Installation Steps

1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Configure environment
   ```bash
   cp .env.example .env
   # Edit .env with your Placid API token
   ```
4. Build the project
   ```bash
   npm run build
   ```
5. Start the server
   ```bash
   npm start
   ```

## Configuration Options

### Environment Variables

- `PLACID_API_TOKEN`: Your Placid API token (required)
- `NODE_ENV`: Environment setting (development/production)
- `PORT`: Server port (for HTTP transport)

### Development Setup

For development:
```bash
npm run dev
```

This will start the server with hot reload enabled.

## Testing

Run the test suite:
```bash
npm test
```

Run with coverage:
```bash
npm run test:coverage
```

## Deployment

1. Build the project
   ```bash
   npm run build
   ```
2. Ensure environment variables are set
3. Start the server
   ```bash
   npm start
   ```

## Troubleshooting

Common issues and solutions:

1. API Token Issues
   - Verify token is correctly set in .env
   - Check token permissions in Placid dashboard

2. Build Issues
   - Clear build directory: `rm -rf build`
   - Delete node_modules: `rm -rf node_modules`
   - Reinstall dependencies: `npm install`

3. Runtime Issues
   - Check logs for errors
   - Verify API connectivity
   - Check rate limits