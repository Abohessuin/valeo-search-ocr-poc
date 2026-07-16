import { BadRequestException } from "@nestjs/common";

const VIN_PATTERN = /^[A-HJ-NPR-Z0-9]{17}$/;

export function normalizeVin(value: string): string {
  return value.replace(/[\s-]/g, "").toUpperCase();
}

export function assertValidVin(value: string): string {
  const normalizedVin = normalizeVin(value);

  if (!isValidVin(normalizedVin)) {
    throw new BadRequestException(
      "VIN must be 17 characters and cannot contain I, O, or Q."
    );
  }

  return normalizedVin;
}

export function isValidVin(value: string): boolean {
  return VIN_PATTERN.test(normalizeVin(value));
}
