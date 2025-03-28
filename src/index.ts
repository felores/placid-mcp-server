import { config } from "dotenv";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";

// Load environment variables from .env file
config();
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "./config/config.js";
import { TOOL_DEFINITIONS } from "./tools/index.js";

// Ensure proper environment setup
function ensureEnvironment() {
  // Ensure PATH is available
  if (!process.env.PATH) {
    // Provide sensible defaults for PATH on different platforms
    if (process.platform === 'win32') {
      process.env.PATH = [
        process.env.SystemRoot + '\\System32',
        process.env.SystemRoot,
        process.env.SystemRoot + '\\System32\\Wbem',
        'C:\\Program Files\\nodejs'
      ].join(';');
    } else {
      process.env.PATH = '/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin';
    }
  }

  // Set UTF-8 encoding for stdio
  if (process.stdout.isTTY) {
    process.stdout.setDefaultEncoding('utf8');
  }
  if (process.stderr.isTTY) {
    process.stderr.setDefaultEncoding('utf8');
  }
}

async function main() {
  // Ensure environment is properly set up
  ensureEnvironment();
  
  const config = loadConfig();
  
  const server = new Server(
    {
      name: "placid-server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Register tools
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOL_DEFINITIONS,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const tool = TOOL_DEFINITIONS.find((t) => t.name === request.params.name);
    if (!tool) {
      throw new Error(`Tool not found: ${request.params.name}`);
    }
    
    // Cast arguments to any since each tool handler will validate its own args
    return tool.handler(request.params.arguments as any, config);
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Placid MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
