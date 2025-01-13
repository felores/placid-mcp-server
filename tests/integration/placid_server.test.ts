import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { TOOL_DEFINITIONS } from "../../src/tools/index.js";
import { Config } from "../../src/config/config.js";
import { TOOLS } from "../../src/config/constants.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

describe("Placid MCP Server Integration", () => {
  let server: Server;
  const mockConfig: Config = {
    placidApiToken: process.env.PLACID_API_TOKEN || "test-token",
    apiBaseUrl: "https://api.placid.app/api/rest",
  };

  beforeAll(async () => {
    server = new Server(
      {
        name: "placid-server-test",
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

    // Register tool execution handler
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case TOOLS.LIST_TEMPLATES:
          return handleListTemplates(request.params.arguments || {}, mockConfig);
        case TOOLS.GENERATE_CREATIVE:
          return handleGenerateCreative(request.params.arguments, mockConfig);
        default:
          throw new Error(`Unknown tool: ${request.params.name}`);
      }
    });

    // Connect transport
    const transport = new StdioServerTransport();
    await server.connect(transport);
  });

  afterAll(async () => {
    await server.close();
  });

  describe("Tool: placid_list_templates", () => {
    it("should list available templates", async () => {
      const response = await server.handleRequest({
        jsonrpc: "2.0",
        id: "1",
        method: "tools/call",
        params: {
          name: TOOLS.LIST_TEMPLATES,
          arguments: {},
        },
      });

      expect(response.error).toBeUndefined();
      expect(response.result).toBeDefined();
      expect(response.result.content).toHaveLength(1);
      expect(response.result.content[0].type).toBe("text");
    });

    it("should handle filtering by collection", async () => {
      const response = await server.handleRequest({
        jsonrpc: "2.0",
        id: "2",
        method: "tools/call",
        params: {
          name: TOOLS.LIST_TEMPLATES,
          arguments: {
            collection_id: "test-collection",
          },
        },
      });

      expect(response.error).toBeUndefined();
      expect(response.result).toBeDefined();
      expect(response.result.content[0].type).toBe("text");
    });

    it("should handle filtering by tags", async () => {
      const response = await server.handleRequest({
        jsonrpc: "2.0",
        id: "3",
        method: "tools/call",
        params: {
          name: TOOLS.LIST_TEMPLATES,
          arguments: {
            tags: ["test-tag"],
          },
        },
      });

      expect(response.error).toBeUndefined();
      expect(response.result).toBeDefined();
      expect(response.result.content[0].type).toBe("text");
    });
  });

  describe("Tool: placid_generate_creative", () => {
    it("should generate a creative", async () => {
      const response = await server.handleRequest({
        jsonrpc: "2.0",
        id: "4",
        method: "tools/call",
        params: {
          name: TOOLS.GENERATE_CREATIVE,
          arguments: {
            template_id: "test-template",
            layers: {
              title: { text: "Integration Test" },
              image: { image: "https://example.com/test.jpg" },
            },
          },
        },
      });

      expect(response.error).toBeUndefined();
      expect(response.result).toBeDefined();
      expect(response.result.content[0].type).toBe("text");
      expect(response.result.content[0].text).toContain("generated successfully");
    });

    it("should validate layer content", async () => {
      const response = await server.handleRequest({
        jsonrpc: "2.0",
        id: "5",
        method: "tools/call",
        params: {
          name: TOOLS.GENERATE_CREATIVE,
          arguments: {
            template_id: "test-template",
            layers: {
              title: { image: "invalid-layer-type" }, // Should be text
            },
          },
        },
      });

      expect(response.error).toBeDefined();
      expect(response.error.message).toContain("validation");
    });

    it("should handle modifications", async () => {
      const response = await server.handleRequest({
        jsonrpc: "2.0",
        id: "6",
        method: "tools/call",
        params: {
          name: TOOLS.GENERATE_CREATIVE,
          arguments: {
            template_id: "test-template",
            layers: {
              title: { text: "Modified Test" },
            },
            modifications: {
              width: 800,
              height: 600,
              filename: "test-output.jpg",
            },
          },
        },
      });

      expect(response.error).toBeUndefined();
      expect(response.result).toBeDefined();
      expect(response.result.content[0].text).toContain("generated successfully");
    });
  });

  describe("Error Handling", () => {
    it("should handle unknown tools", async () => {
      const response = await server.handleRequest({
        jsonrpc: "2.0",
        id: "7",
        method: "tools/call",
        params: {
          name: "unknown_tool",
          arguments: {},
        },
      });

      expect(response.error).toBeDefined();
      expect(response.error.message).toContain("Unknown tool");
    });

    it("should handle API errors", async () => {
      // Use invalid token to force API error
      mockConfig.placidApiToken = "invalid-token";

      const response = await server.handleRequest({
        jsonrpc: "2.0",
        id: "8",
        method: "tools/call",
        params: {
          name: TOOLS.LIST_TEMPLATES,
          arguments: {},
        },
      });

      expect(response.result.content[0].text).toContain("Error");
      
      // Restore valid token
      mockConfig.placidApiToken = process.env.PLACID_API_TOKEN || "test-token";
    });
  });
});