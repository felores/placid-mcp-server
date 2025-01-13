import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "./config/config.js";
import { TOOL_DEFINITIONS } from "./tools/index.js";

async function main() {
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
