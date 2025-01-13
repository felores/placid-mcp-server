import { ValidationError } from "./errors.js";
import { PlacidLayerContent } from "../services/placid/types.js";

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validateLayers(
  layers: Record<string, PlacidLayerContent>,
  templateLayers: Array<{ name: string; type: string }>
): void {
  // Check for required layers
  for (const templateLayer of templateLayers) {
    const layerContent = layers[templateLayer.name];
    if (!layerContent) {
      throw new ValidationError(`Missing required layer: ${templateLayer.name}`);
    }

    // Validate layer content based on type
    switch (templateLayer.type) {
      case "text":
        if (!("text" in layerContent)) {
          throw new ValidationError(
            `Layer ${templateLayer.name} requires text content`
          );
        }
        break;

      case "picture":
        if (!("image" in layerContent)) {
          throw new ValidationError(
            `Layer ${templateLayer.name} requires image content`
          );
        }
        if (!validateUrl(layerContent.image!)) {
          throw new ValidationError(
            `Invalid URL for image in layer ${templateLayer.name}`
          );
        }
        break;

      default:
        throw new ValidationError(
          `Unsupported layer type: ${templateLayer.type}`
        );
    }
  }
}

export function validateModifications(modifications?: {
  width?: number;
  height?: number;
  filename?: string;
}): void {
  if (!modifications) return;

  if (modifications.width && modifications.width <= 0) {
    throw new ValidationError("Width must be a positive number");
  }

  if (modifications.height && modifications.height <= 0) {
    throw new ValidationError("Height must be a positive number");
  }

  if (modifications.filename && !/^[\w\-. ]+$/.test(modifications.filename)) {
    throw new ValidationError(
      "Filename contains invalid characters"
    );
  }
}