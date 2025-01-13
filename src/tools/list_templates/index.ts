import { PlacidClient } from "../../services/placid/client.js";
import { Config } from "../../config/config.js";
import { TOOLS } from "../../config/constants.js";
import type { PlacidTemplate } from "../../services/placid/types.js";

export interface ListTemplatesArgs {
  collection_id?: string;
  custom_data?: string;
  tags?: string[];
}

export async function handleListTemplates(
  args: ListTemplatesArgs,
  config: Config
): Promise<{ content: { type: "text"; text: string }[] }> {
  try {
    const client = new PlacidClient(config.placidApiToken);
    const response = await client.listTemplates({
      collection_id: args.collection_id,
      custom_data: args.custom_data,
    });

    // Filter by tags if provided
    let templates = response.data;
    if (args.tags && args.tags.length > 0) {
      templates = templates.filter(template =>
        args.tags!.some(tag => template.tags.includes(tag))
      );
    }

    const formattedTemplates = formatTemplatesResponse(templates);
    return {
      content: [{
        type: "text",
        text: formattedTemplates,
      }],
    };
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: `Error listing templates: ${error instanceof Error ? error.message : "Unknown error"}`,
      }],
    };
  }
}

function formatTemplatesResponse(templates: PlacidTemplate[]): string {
  if (templates.length === 0) {
    return "No templates found matching the criteria.";
  }

  return templates.map(template => `
Template: ${template.title}
ID: ${template.uuid}
${template.thumbnail ? `Preview: ${template.thumbnail}` : "No preview available"}

Available Layers:
${template.layers.map(layer => `- ${layer.name} (${layer.type})`).join("\n")}

Tags: ${template.tags.join(", ") || "None"}
${template.custom_data ? `Custom Data: ${template.custom_data}` : ""}
---
  `).join("\n").trim();
}