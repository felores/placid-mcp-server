export const listTemplatesSchema = {
  type: "object",
  properties: {
    collection_id: {
      type: "string",
      description: "Optional: Filter templates by collection ID"
    },
    custom_data: {
      type: "string",
      description: "Optional: Filter by custom reference data"
    },
    tags: {
      type: "array",
      items: {
        type: "string"
      },
      description: "Optional: Filter templates by tags"
    }
  }
} as const;

export const listTemplatesResponse = {
  type: "object",
  properties: {
    templates: {
      type: "array",
      items: {
        type: "object",
        properties: {
          uuid: { type: "string" },
          title: { type: "string" },
          thumbnail: { type: "string", nullable: true },
          layers: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                type: { type: "string" }
              },
              required: ["name", "type"]
            }
          },
          tags: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: ["uuid", "title", "layers"]
      }
    }
  },
  required: ["templates"]
} as const;