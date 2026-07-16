export type OcrProviderName = "paddle" | "google";

export interface OcrProviderResult {
  rawText: string;
  provider: OcrProviderName;
}

export interface OcrProvider {
  extractText(imageInput: OcrImageInput): Promise<OcrProviderResult>;
}

export interface VinOcrResponse {
  rawText: string;
  extractedVin: string | null;
  isValid: boolean;
  candidates: string[];
  provider: OcrProviderName;
}

export interface OcrImageInput {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
}
