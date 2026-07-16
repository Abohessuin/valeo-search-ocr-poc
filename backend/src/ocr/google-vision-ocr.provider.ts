import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OcrImageInput, OcrProvider, OcrProviderResult } from "./ocr.types";

interface GoogleTextDetectionResult {
  fullTextAnnotation?: {
    text?: string | null;
  } | null;
  textAnnotations?: Array<{
    description?: string | null;
  }> | null;
}

interface GoogleVisionClient {
  textDetection(request: {
    image: { content: Buffer };
  }): Promise<[GoogleTextDetectionResult]>;
}

interface GoogleVisionModule {
  ImageAnnotatorClient: new () => GoogleVisionClient;
}

@Injectable()
export class GoogleVisionOcrProvider implements OcrProvider {
  private client: GoogleVisionClient | null = null;
  private readonly timeoutMs: number;

  constructor(private readonly configService: ConfigService) {
    this.timeoutMs = Number(
      this.configService.get<string>("GOOGLE_OCR_TIMEOUT_MS") ?? 15000,
    );
  }

  async extractText(imageInput: OcrImageInput): Promise<OcrProviderResult> {
    const client = await this.getClient();

    try {
      const [result] = await withTimeout(
        client.textDetection({
          image: {
            content: imageInput.buffer,
          },
        }),
        this.timeoutMs,
      );

      return {
        rawText:
          result.fullTextAnnotation?.text ??
          result.textAnnotations?.[0]?.description ??
          "",
        provider: "google",
      };
    } catch (error) {
      throw new ServiceUnavailableException(
        "Google Cloud Vision OCR is unavailable. Check Application Default Credentials and Cloud Vision access.",
      );
    }
  }

  private async getClient(): Promise<GoogleVisionClient> {
    if (this.client) {
      return this.client;
    }

    try {
      const moduleName = "@google-cloud/vision";
      const visionModule = (await import(moduleName)) as GoogleVisionModule;
      this.client = new visionModule.ImageAnnotatorClient();
      return this.client;
    } catch (error) {
      throw new ServiceUnavailableException(
        "The @google-cloud/vision package is not installed. Run npm install in the backend project before using OCR_PROVIDER=google.",
      );
    }
  }
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
): Promise<T> {
  let timeout: NodeJS.Timeout | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => {
      reject(new Error(`OCR request timed out after ${timeoutMs}ms.`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeout) {
      clearTimeout(timeout);
    }
  }
}
