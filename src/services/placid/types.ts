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

export interface ImageGenerationRequest {
  template_uuid: string;
  layers: Record<string, PlacidLayerContent>;
  webhook_success?: string;
  create_now?: boolean;
  passthrough?: string | Record<string, unknown>;
}

export interface ImageGenerationResponse {
  id: number;
  status: 'queued' | 'finished' | 'error';
  image_url: string | null;
  polling_url: string | null;
}

export interface VideoClipRequest {
  template_uuid: string;
  audio?: string;
  audio_duration?: string;
  audio_trim_start?: string;
  audio_trim_end?: string;
  layers: Record<string, PlacidLayerContent>;
}

export interface VideoGenerationRequest {
  clips: VideoClipRequest[];
  webhook_success?: string;
  create_now?: boolean;
  passthrough?: string | Record<string, unknown>;
}

export interface VideoGenerationResponse {
  id: number;
  status: 'queued' | 'finished' | 'error';
  video_url: string | null;
  polling_url: string | null;
}

export interface PlacidError {
  code: number;
  message: string;
  status?: number;
}
