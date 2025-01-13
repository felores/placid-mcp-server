# Development Guide

## Setup Development Environment

1. Install dependencies:
```bash
npm install
```

2. Create your .env file:
```bash
cp .env.example .env
# Edit .env with your Placid API token
```

3. Start in development mode:
```bash
npm run dev
```

## Project Structure

- `src/`: Source code
  - `config/`: Configuration and constants
  - `core/`: Core server functionality
  - `services/`: External service integrations
  - `tools/`: MCP tool implementations
  - `utils/`: Shared utilities

## Development Workflow

1. **Making Changes**
   - Create feature branch
   - Make changes
   - Run tests: `npm test`
   - Build: `npm run build`
   - Test manually with MCP Inspector

2. **Testing**
   - Unit tests: `npm run test:unit`
   - Integration tests: `npm run test:integration`
   - Coverage: `npm run test:coverage`

3. **Debugging**
   - Use MCP Inspector
   - Check server logs
   - Monitor API responses

## Testing with MCP Inspector

1. Install MCP Inspector:
```bash
npm install -g @modelcontextprotocol/inspector
```

2. Run your server with Inspector:
```bash
npx mcp-inspector node build/index.js
```

3. Test tools:
   - List templates
   - Generate creatives
   - Check error handling

## API Integration

### Placid API
- Base URL: https://api.placid.app/api/rest
- Endpoints used:
  - GET /templates
  - POST /images
  - GET /images/{id}

### Rate Limits
- Monitor API usage
- Implement backoff strategy
- Handle rate limit errors

## Error Handling

1. **Input Validation**
   - Schema validation
   - Layer type checking
   - URL validation

2. **API Errors**
   - Authentication errors
   - Rate limits
   - Network issues

3. **Generation Errors**
   - Invalid templates
   - Missing layers
   - Processing failures

## Best Practices

1. **Code Style**
   - Follow TypeScript best practices
   - Use consistent formatting
   - Add JSDoc comments

2. **Testing**
   - Write tests first
   - Mock external services
   - Test edge cases

3. **Error Handling**
   - Use custom error classes
   - Provide clear messages
   - Log appropriately

4. **Security**
   - Validate all inputs
   - Secure API tokens
   - Monitor usage

## Deployment

1. **Build**
```bash
npm run build
```

2. **Configure**
- Set environment variables
- Configure logging
- Set up monitoring

3. **Test**
- Verify configuration
- Check connections
- Monitor errors

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## Release Process

1. Update version
2. Run tests
3. Build release
4. Update documentation
5. Create release notes
6. Tag release
7. Publish