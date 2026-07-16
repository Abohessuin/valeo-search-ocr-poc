export type OcrProviderName = "paddle" | "google";

export interface OcrVinResponse {
  rawText: string;
  extractedVin: string | null;
  isValid: boolean;
  candidates: string[];
  provider: OcrProviderName;
}
