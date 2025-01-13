export interface Config {
  placidApiToken: string;
  apiBaseUrl: string;
}

export function loadConfig(): Config {
  const placidApiToken = process.env.PLACID_API_TOKEN;
  if (!placidApiToken) {
    throw new Error("PLACID_API_TOKEN environment variable is required");
  }

  return {
    placidApiToken,
    apiBaseUrl: "https://api.placid.app/api/rest",
  };
}