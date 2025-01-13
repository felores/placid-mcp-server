import { PlacidClient } from "../../services/placid/client.js";
import { Config } from "../../config/config.js";
import { TOOLS } from "../../config/constants.js";
import type { PlacidLayerContent } from "../../services/placid/types.js";

export interface GenerateCreativeArgs {
  template_id: string;
  layers: Record<string, PlacidLayerContent>;
  modifications?: {
    width?: number;
    height?: number;
    filename?: string;
  };
}

export async function handleGenerateCreative(
  args: GenerateCreativeArgs,
  config: Config
): Promise<{ content: { type: "text"; text: string }[] }> {
  try {
    const client = new PlacidClient(config.placidApiToken);

    // Start generation
    const response = await client.generateCreative({
      template_uuid: args.template_id,
      layers: args.layers,
      create_now: true, // Request immediate creation
      modifications: args.modifications
    });

    // If creation is not immediate, poll for completion
    if (response.status === "queued") {
      let attempts = 0;
      const maxAttempts = 10;
      const delayMs = 1000;

      while (attempts < maxAttempts) {
        const status = await client.getCreativeStatus(response.id);
        
        if (status.status === "finished") {
          return {
            content: [{
              type: "text",
              text: `Creative generated successfully!\nURL: ${status.image_url}`,
            }],
          };
        }
        
        if (status.status === "error") {
          throw new Error("Creative generation failed");
        }

        await new Promise(resolve => setTimeout(resolve, delayMs));
        attempts++;
      }

      throw new Error("Timed out waiting for creative generation");
    }

    // Immediate completion
    if (response.status === "finished" && response.image_url) {
      return {
        content: [{
          type: "text",
          text: `Creative generated successfully!\nURL: ${response.image_url}`,
        }],
      };
    }

    throw new Error("Creative generation failed");
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: `Error generating creative: ${error instanceof Error ? error.message : "Unknown error"}`,
      }],
    };
  }
}