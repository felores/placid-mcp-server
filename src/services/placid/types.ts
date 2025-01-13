export interface PlacidTemplate {
  uuid: string;
  title: string;
  thumbnail: string | null;
  tags: string[];
  custom_data?: string;
  layers: PlacidLayer[];
}

export interface PlacidLayer {
  name: string;
  type: 'text' | 'picture' | 'browserframe' | 'barcode' | 'rating' | 'shape' | 'subtitle';
}

export interface PlacidLayerContent {
  text?: string;
  image?: string;
  image_viewport?: string;
  video?: string;
}

export interface CreativeGenerationRequest {
  template_uuid: string;
  layers: Record<string, PlacidLayerContent>;
  webhook_success?: string;
  create_now?: boolean;
  passthrough?: string | Record<string, unknown>;
  modifications?: {
    width?: number;
    height?: number;
    filename?: string;
  };
}

export interface CreativeGenerationResponse {
  id: number;
  status: 'queued' | 'finished' | 'error';
  image_url: string | null;
  polling_url: string | null;
}

export interface PlacidError {
  code: number;
  message: string;
  status?: number;
}