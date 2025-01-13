import { PLACID_API_BASE, USER_AGENT } from "../../config/constants.js";
import type {
  PlacidTemplate,
  CreativeGenerationRequest,
  CreativeGenerationResponse,
  PlacidError,
} from "./types.js";

export class PlacidClient {
  private readonly apiToken: string;
  private readonly baseUrl: string;

  constructor(apiToken: string, baseUrl: string = PLACID_API_BASE) {
    this.apiToken = apiToken;
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      Authorization: `Bearer ${this.apiToken}`,
      "User-Agent": USER_AGENT,
      "Content-Type": "application/json",
      ...options.headers,
    };

    try {
      const response = await fetch(url, { ...options, headers });
      
      if (!response.ok) {
        const error = await response.json() as PlacidError;
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return response.json() as Promise<T>;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred");
    }
  }

  async listTemplates(options?: {
    collection_id?: string;
    custom_data?: string;
  }): Promise<{ data: PlacidTemplate[] }> {
    const queryParams = new URLSearchParams();
    if (options?.collection_id) {
      queryParams.append("collection_id", options.collection_id);
    }
    
    const endpoint = `/templates${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    return this.request<{ data: PlacidTemplate[] }>(endpoint);
  }

  async generateCreative(
    request: CreativeGenerationRequest
  ): Promise<CreativeGenerationResponse> {
    return this.request<CreativeGenerationResponse>("/images", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async getCreativeStatus(id: number): Promise<CreativeGenerationResponse> {
    return this.request<CreativeGenerationResponse>(`/images/${id}`);
  }
}