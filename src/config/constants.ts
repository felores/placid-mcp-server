export const PLACID_API_BASE = "https://api.placid.app/api/rest";
export const USER_AGENT = "placid-mcp-server/1.0.0";

// Tool names
export const TOOLS = {
  LIST_TEMPLATES: "placid_list_templates",
  GENERATE_IMAGE: "placid_generate_image",
  GENERATE_VIDEO: "placid_generate_video",
} as const;

// Error messages
export const ERRORS = {
  INVALID_TOKEN: "Invalid or missing Placid API token",
  TEMPLATE_NOT_FOUND: "Template not found",
  INVALID_LAYER: "Invalid layer configuration",
  API_ERROR: "Placid API error",
} as const;
