import { VinValidationResult } from "@/types/vin";

const VIN_PATTERN = /^[A-HJ-NPR-Z0-9]{17}$/;

export function normalizeVinInput(value: string): string {
  return value.replace(/[\s-]/g, "").toUpperCase();
}

export function validateVin(value: string): VinValidationResult {
  const normalizedVin = normalizeVinInput(value);

  if (!normalizedVin) {
    return {
      isValid: false,
      message: "Enter a VIN."
    };
  }

  if (normalizedVin.length !== 17) {
    return {
      isValid: false,
      message: "VIN must be exactly 17 characters."
    };
  }

  if (!VIN_PATTERN.test(normalizedVin)) {
    return {
      isValid: false,
      message: "VIN can use letters and numbers, but not I, O, or Q."
    };
  }

  return {
    isValid: true,
    message: "VIN format looks valid."
  };
}
