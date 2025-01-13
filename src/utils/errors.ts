export class PlacidMcpError extends Error {
  constructor(message: string, public code?: number) {
    super(message);
    this.name = "PlacidMcpError";
  }
}

export class ValidationError extends PlacidMcpError {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class ApiError extends PlacidMcpError {
  constructor(message: string, code?: number) {
    super(message, code);
    this.name = "ApiError";
  }
}

export function formatError(error: unknown): { type: "text"; text: string } {
  if (error instanceof PlacidMcpError) {
    return {
      type: "text",
      text: `${error.name}: ${error.message}`,
    };
  }

  if (error instanceof Error) {
    return {
      type: "text",
      text: `Error: ${error.message}`,
    };
  }

  return {
    type: "text",
    text: "An unknown error occurred",
  };
}

export function createErrorResponse(error: unknown) {
  return {
    isError: true,
    content: [formatError(error)],
  };
}