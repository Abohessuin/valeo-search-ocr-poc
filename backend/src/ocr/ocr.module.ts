import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GoogleVisionOcrProvider } from "./google-vision-ocr.provider";
import { OcrController } from "./ocr.controller";
import { OCR_PROVIDER } from "./ocr.constants";
import { OcrService } from "./ocr.service";
import { OcrProvider } from "./ocr.types";
import { PaddleOcrProvider } from "./paddle-ocr.provider";

@Module({
  controllers: [OcrController],
  providers: [
    OcrService,
    PaddleOcrProvider,
    GoogleVisionOcrProvider,
    {
      provide: OCR_PROVIDER,
      useFactory: (
        configService: ConfigService,
        paddleOcrProvider: PaddleOcrProvider,
        googleVisionOcrProvider: GoogleVisionOcrProvider
      ): OcrProvider => {
        const provider = (
          configService.get<string>("OCR_PROVIDER") ?? "paddle"
        ).toLowerCase();

        if (provider === "google") {
          return googleVisionOcrProvider;
        }

        if (provider === "paddle") {
          return paddleOcrProvider;
        }

        throw new Error(
          `Unsupported OCR_PROVIDER "${provider}". Use "paddle" or "google".`
        );
      },
      inject: [ConfigService, PaddleOcrProvider, GoogleVisionOcrProvider]
    }
  ]
})
export class OcrModule {}
