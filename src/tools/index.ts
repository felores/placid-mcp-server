import { TOOLS } from "../config/constants.js";
import { handleListTemplates } from "./list_templates/index.js";
import { handleGenerateImage } from "./generate_image/index.js";
import { handleGenerateVideo } from "./generate_video/index.js";
import { listTemplatesSchema } from "./list_templates/schema.js";
import { generateImageSchema } from "./generate_image/schema.js";
import { generateVideoSchema } from "./generate_video/schema.js";

export const TOOL_DEFINITIONS = [
  {
    name: TOOLS.LIST_TEMPLATES,
    description: "Get a list of available Placid templates with optional filtering. Each template includes its title, ID, preview image URL, available layers, and tags.",
    inputSchema: listTemplatesSchema,
    handler: handleListTemplates,
  },
  {
    name: TOOLS.GENERATE_IMAGE,
    description: "Generate an image using a template and provided assets",
    inputSchema: generateImageSchema,
    handler: handleGenerateImage,
  },
  {
    name: TOOLS.GENERATE_VIDEO,
    description: "Generate a video using one or more templates and provided assets. Every 10 seconds of video uses 10 credits.",
    inputSchema: generateVideoSchema,
    handler: handleGenerateVideo,
  },
] as const;

export * from "./list_templates/index.js";
export * from "./generate_image/index.js";
export * from "./generate_video/index.js";
