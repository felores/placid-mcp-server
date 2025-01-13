# Placid MCP Server Implementation Guide

## Overview
This guide outlines the implementation of an MCP server that integrates with Placid.app's API to enable template listing and creative generation through an MCP interface.

## Server Configuration

### Basic Setup
- Server Name: "placid-server"
- Version: "1.0.0"
- Capabilities: tools only
- Required Environment Variables:
  * PLACID_API_TOKEN: Your Placid API token

### Constants
```
PLACID_API_BASE = "https://api.placid.app/api/rest"
```

## Tools Implementation

### 1. placid_list_templates

#### Purpose
Retrieve and filter available templates from Placid API.

#### Input Schema
```json
{
  "type": "object",
  "properties": {
    "collection_id": {
      "type": "string",
      "description": "Optional: Filter templates by collection ID"
    },
    "custom_data": {
      "type": "string",
      "description": "Optional: Filter by custom reference data"
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Optional: Filter templates by tags"
    }
  }
}
```

#### Process Flow
1. Authenticate request with Placid API token
2. Construct API request with optional filters
3. Fetch templates from Placid API
4. Transform response into user-friendly format
5. Return formatted template list

#### Output Format
```json
{
  "templates": [
    {
      "uuid": "template-uuid",
      "title": "Template Title",
      "thumbnail": "https://thumbnail-url.jpg",
      "layers": [
        {
          "name": "headline",
          "type": "text"
        },
        {
          "name": "media",
          "type": "picture"
        },
        {
          "name": "logo",
          "type": "picture"
        }
      ],
      "tags": ["tag1", "tag2"],
      "custom_data": "optional-reference-data"
    }
  ]
}
```

### 2. placid_generate_creative

#### Purpose
Generate a creative using a selected template and provided assets.

#### Input Schema
```json
{
  "type": "object",
  "required": ["template_id", "layers"],
  "properties": {
    "template_id": {
      "type": "string",
      "description": "UUID of the template to use"
    },
    "layers": {
      "type": "object",
      "description": "Key-value pairs for dynamic content. Keys must match template layer names.",
      "additionalProperties": {
        "oneOf": [
          {
            "type": "object",
            "properties": {
              "text": {
                "type": "string",
                "description": "Content for text layers"
              }
            },
            "required": ["text"]
          },
          {
            "type": "object",
            "properties": {
              "image": {
                "type": "string",
                "format": "uri",
                "description": "URL for image/video layers"
              }
            },
            "required": ["image"]
          }
        ]
      }
    },
    "modifications": {
      "type": "object",
      "properties": {
        "width": {
          "type": "number",
          "description": "Optional: Output width"
        },
        "height": {
          "type": "number",
          "description": "Optional: Output height"
        },
        "filename": {
          "type": "string",
          "description": "Optional: Custom filename"
        }
      }
    }
  }
}
```

#### Process Flow
1. Validate input parameters
2. Verify template exists
3. Validate layer types match template requirements
4. Submit generation request to Placid API
5. Poll for completion if needed
6. Return final creative URL

#### Output Format
```json
{
  "status": "finished",
  "image_url": "https://placid.app/u/generated-image.jpg",
  "credits_used": 1
}
```

## Error Handling

### Common Error Scenarios
1. Authentication Errors
   - Invalid API token
   - Token expired
   - Missing token

2. Template Errors
   - Template not found
   - Template access denied
   - Invalid template ID format

3. Layer Errors
   - Missing required layers
   - Invalid layer types
   - Invalid media URLs
   - Unsupported file formats

4. API Errors
   - Rate limit exceeded
   - Service unavailable
   - Network timeout
   - Generation failed

### Error Response Format
```json
{
  "isError": true,
  "content": [
    {
      "type": "text",
      "text": "Detailed error message"
    }
  ]
}
```

## Security Considerations

### Input Validation
- Validate all template IDs
- Sanitize text inputs
- Verify media URLs
- Check file formats
- Validate dimensions

### API Security
- Secure token storage
- Token rotation support
- Rate limiting
- Request timeout handling

### Error Security
- Sanitize error messages
- Hide internal details
- Log security events

## Performance Optimization

### Caching Strategy
- Cache template list (5 minute TTL)
- Cache template details
- Cache validation results

### Connection Management
- Connection pooling
- Request queuing
- Timeout handling

### Resource Management
- Clean up temporary files
- Monitor memory usage
- Track API usage

## Testing Guidelines

### Unit Tests
- Test input validation
- Test error handling
- Test response formatting
- Test security checks

### Integration Tests
- Test API connectivity
- Test template listing
- Test creative generation
- Test error scenarios

### Load Tests
- Test concurrent requests
- Test rate limiting
- Test timeout handling

## Deployment Checklist

### Environment Setup
1. Configure API token
2. Set up error logging
3. Configure rate limits
4. Set up monitoring

### Validation Steps
1. Verify API connectivity
2. Test template access
3. Validate creative generation
4. Check error handling

### Monitoring Setup
1. Track API usage
2. Monitor error rates
3. Track response times
4. Set up alerts

## Maintenance Guidelines

### Regular Tasks
1. Monitor credit usage
2. Check error rates
3. Update documentation
4. Clean up temporary files

### Troubleshooting
1. Check API token validity
2. Verify template access
3. Check rate limits
4. Monitor generation errors

---

**Note**: This guide assumes familiarity with the MCP protocol and Placid API. Refer to the respective documentation for detailed information about specific features and endpoints.