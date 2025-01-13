import { TOOLS } from "../config/constants.js";
import { handleListTemplates } from "./list_templates/index.js";
import { handleGenerateCreative } from "./generate_creative/index.js";
import { listTemplatesSchema } from "./list_templates/schema.js";
import { generateCreativeSchema } from "./generate_creative/schema.js";

export const TOOL_DEFINITIONS = [
  {
    name: TOOLS.LIST_TEMPLATES,
    description: "Get a list of available Placid templates with optional filtering",
    inputSchema: listTemplatesSchema,
    handler: handleListTemplates,
  },
  {
    name: TOOLS.GENERATE_CREATIVE,
    description: "Generate a creative using a template and provided assets",
    inputSchema: generateCreativeSchema,
    handler: handleGenerateCreative,
  },
] as const;

export * from "./list_templates/index.js";
export * from "./generate_creative/index.js";