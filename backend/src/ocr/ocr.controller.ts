import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_SIZE_BYTES,
} from "./ocr.constants";
import { OcrService } from "./ocr.service";
import { OcrImageInput, VinOcrResponse } from "./ocr.types";

type FileFilterCallback = (error: Error | null, acceptFile: boolean) => void;

@Controller("ocr")
export class OcrController {
  constructor(private readonly ocrService: OcrService) {}

  @Post("vin")
  @UseInterceptors(
    FileInterceptor("image", {
      limits: {
        fileSize: MAX_IMAGE_SIZE_BYTES,
      },
      fileFilter: (
        _request: unknown,
        file: OcrImageInput,
        callback: FileFilterCallback,
      ) => {
        if (!ALLOWED_IMAGE_MIME_TYPES.has(file.mimetype)) {
          callback(
            new BadRequestException(
              "Only JPEG, PNG, JPG, and WebP images are supported.",
            ),
            false,
          );
          return;
        }

        callback(null, true);
      },
    }),
  )
  extractVin(
    @UploadedFile() image: OcrImageInput | undefined,
  ): Promise<VinOcrResponse> {
    if (!image) {
      throw new BadRequestException(
        "Upload an image using the multipart field named image.",
      );
    }

    if (!ALLOWED_IMAGE_MIME_TYPES.has(image.mimetype)) {
      throw new BadRequestException(
        "Only JPEG, JPG , PNG, and WebP images are supported.",
      );
    }

    if (image.size > MAX_IMAGE_SIZE_BYTES) {
      throw new BadRequestException("Image size must be 5 MB or smaller.");
    }

    return this.ocrService.extractVin(image);
  }
}
