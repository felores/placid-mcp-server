export const generateCreativeSchema = {
  type: "object",
  required: ["template_id", "layers"],
  properties: {
    template_id: {
      type: "string",
      description: "UUID of the template to use"
    },
    layers: {
      type: "object",
      description: "Key-value pairs for dynamic content. Keys must match template layer names.",
      additionalProperties: {
        oneOf: [
          {
            type: "object",
            properties: {
              text: {
                type: "string",
                description: "Content for text layers"
              }
            },
            required: ["text"]
          },
          {
            type: "object",
            properties: {
              image: {
                type: "string",
                format: "uri",
                description: "URL for image/video layers"
              }
            },
            required: ["image"]
          }
        ]
      }
    },
    modifications: {
      type: "object",
      properties: {
        width: {
          type: "number",
          description: "Optional: Output width"
        },
        height: {
          type: "number",
          description: "Optional: Output height"
        },
        filename: {
          type: "string",
          description: "Optional: Custom filename"
        }
      }
    }
  }
} as const;

export const generateCreativeResponse = {
  type: "object",
  properties: {
    status: {
      type: "string",
      enum: ["finished"]
    },
    image_url: {
      type: "string",
      format: "uri"
    },
    credits_used: {
      type: "number"
    }
  },
  required: ["status", "image_url"]
} as const;