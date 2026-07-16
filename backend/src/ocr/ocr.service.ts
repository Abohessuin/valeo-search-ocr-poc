import { Inject, Injectable } from "@nestjs/common";
import { isValidVin } from "../common/vin";
import { OCR_PROVIDER } from "./ocr.constants";
import { extractVinCandidates } from "./vin-extractor";
import { OcrImageInput, OcrProvider, VinOcrResponse } from "./ocr.types";

@Injectable()
export class OcrService {
  constructor(
    @Inject(OCR_PROVIDER)
    private readonly ocrProvider: OcrProvider,
  ) {}

  async extractVin(input: OcrImageInput): Promise<VinOcrResponse> {
    const ocrResult = await this.ocrProvider.extractText(input);
    const candidates = extractVinCandidates(ocrResult.rawText);
    const extractedVin = candidates[0] ?? null;

    return {
      rawText: ocrResult.rawText,
      extractedVin,
      isValid: extractedVin ? isValidVin(extractedVin) : false,
      candidates,
      provider: ocrResult.provider,
    };
  }
}
