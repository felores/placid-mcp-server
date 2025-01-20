import { PlacidClient } from "../../services/placid/client.js";
import { Config } from "../../config/config.js";
import type { PlacidLayerContent } from "../../services/placid/types.js";

export interface GenerateVideoArgs {
  template_id: string;
  layers: Record<string, PlacidLayerContent>;
  audio?: string;
  audio_duration?: string;
  audio_trim_start?: string;
  audio_trim_end?: string;
}

export async function handleGenerateVideo(
  args: GenerateVideoArgs,
  config: Config
): Promise<{ content: { type: "text"; text: string }[] }> {
  try {
    const client = new PlacidClient(config.placidApiToken);

    // Format the request with a single clip
    const request = {
      clips: [{
        template_uuid: args.template_id,
        layers: args.layers,
        audio: args.audio,
        audio_duration: args.audio_duration,
        audio_trim_start: args.audio_trim_start,
        audio_trim_end: args.audio_trim_end
      }],
      create_now: true // Request immediate creation
    };

    // Start generation
    const response = await client.generateVideo(request);

    // If creation is not immediate, poll for completion
    if (response.status === "queued") {
      let attempts = 0;
      const maxAttempts = 30; // More attempts for video due to longer processing time
      const delayMs = 2000; // Longer delay for video processing

      while (attempts < maxAttempts) {
        const status = await client.getVideoStatus(response.id);
        
        if (status.status === "finished") {
          return {
            content: [{
              type: "text",
              text: `Video generated successfully!\nURL: ${status.video_url}`,
            }],
          };
        }
        
        if (status.status === "error") {
          throw new Error("Video generation failed");
        }

        await new Promise(resolve => setTimeout(resolve, delayMs));
        attempts++;
      }

      return {
        content: [{
          type: "text",
          text: `Video generation is taking longer than expected.\nJob ID: ${response.id}\nYou can check the status in your Placid dashboard.`,
        }],
      };
    }

    // Immediate completion
    if (response.status === "finished" && response.video_url) {
      return {
        content: [{
          type: "text",
          text: `Video generated successfully!\nURL: ${response.video_url}`,
        }],
      };
    }

    throw new Error("Video generation failed");
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: `Error generating video: ${error instanceof Error ? error.message : "Unknown error"}`,
      }],
    };
  }
}
