import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OcrImageInput, OcrProvider, OcrProviderResult } from "./ocr.types";

interface PaddleOcrResponse {
  rawText?: unknown;
}

@Injectable()
export class PaddleOcrProvider implements OcrProvider {
  private readonly serviceUrl: string;
  private readonly timeoutMs: number;

  constructor(private readonly configService: ConfigService) {
    const baseUrl =
      this.configService.get<string>("PADDLE_OCR_URL") ??
      "http://localhost:8000";

    this.serviceUrl = new URL("/ocr", baseUrl).toString();
    this.timeoutMs = Number(
      this.configService.get<string>("PADDLE_OCR_TIMEOUT_MS") ?? 15000,
    );
  }

  async extractText(imageInput: OcrImageInput): Promise<OcrProviderResult> {
    const formData = new FormData();
    formData.append(
      "image",
      new Blob([new Uint8Array(imageInput.buffer)], {
        type: imageInput.mimetype,
      }),
      "vin-image",
    );

    let response: Response;

    try {
      response = await fetch(this.serviceUrl, {
        method: "POST",
        body: formData,
        signal: AbortSignal.timeout(this.timeoutMs),
      });
    } catch (error) {
      throw new ServiceUnavailableException(
        `PaddleOCR service is unavailable at ${this.serviceUrl}. Start the local FastAPI service and try again.`,
      );
    }

    if (!response.ok) {
      const details = await response.text().catch(() => "");
      throw new ServiceUnavailableException(
        `PaddleOCR service returned ${response.status}. ${details}`.trim(),
      );
    }

    const payload = (await response
      .json()
      .catch(() => null)) as PaddleOcrResponse | null;

    if (!payload || typeof payload.rawText !== "string") {
      throw new ServiceUnavailableException(
        "PaddleOCR service returned an invalid response.",
      );
    }

    return {
      rawText: payload.rawText,
      provider: "paddle",
    };
  }
}
