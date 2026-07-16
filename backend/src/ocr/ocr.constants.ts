export const OCR_PROVIDER = Symbol("OCR_PROVIDER");

export const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
]);

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
