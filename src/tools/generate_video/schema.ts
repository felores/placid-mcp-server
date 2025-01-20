export const generateVideoSchema = {
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
                description: "URL for image layers"
              }
            },
            required: ["image"]
          },
          {
            type: "object",
            properties: {
              video: {
                type: "string",
                format: "uri",
                description: "URL for video layers (.mp4)"
              }
            },
            required: ["video"]
          }
        ]
      }
    },
    audio: {
      type: "string",
      description: "URL of mp3 audio file for this video"
    },
    audio_duration: {
      type: "string",
      description: "Set to 'auto' to trim audio to video length"
    },
    audio_trim_start: {
      type: "string",
      description: "Timestamp of the trim start point (e.g. '00:00:45' or '00:00:45.25')"
    },
    audio_trim_end: {
      type: "string",
      description: "Timestamp of the trim end point (e.g. '00:00:55' or '00:00:55.25')"
    }
  }
} as const;

export const generateVideoResponse = {
  type: "object",
  properties: {
    status: {
      type: "string",
      enum: ["finished"]
    },
    video_url: {
      type: "string",
      format: "uri"
    },
    credits_used: {
      type: "number"
    }
  },
  required: ["status", "video_url"]
} as const;
