import { OcrVinResponse } from "@/types/ocr";
import {
  VehicleLineOfBusinessesResponse,
  VinSearchResponse
} from "@/types/search";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:3001";

export async function extractVinFromImage(file: File): Promise<OcrVinResponse> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_BASE_URL}/ocr/vin`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return (await response.json()) as OcrVinResponse;
}

export async function searchVehiclesByVin(vin: string): Promise<VinSearchResponse> {
  const response = await fetch(`${API_BASE_URL}/vin/${encodeURIComponent(vin)}`);

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return (await response.json()) as VinSearchResponse;
}

export async function getVehicleLineOfBusinesses(
  vehicleId: number
): Promise<VehicleLineOfBusinessesResponse> {
  const response = await fetch(
    `${API_BASE_URL}/vehicles/${vehicleId}/line-of-businesses`
  );

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return (await response.json()) as VehicleLineOfBusinessesResponse;
}

async function readApiError(response: Response): Promise<string> {
  const fallback = `Request failed with status ${response.status}.`;
  const responseText = await response.text().catch(() => "");

  if (!responseText) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(responseText) as {
      message?: unknown;
      detail?: unknown;
      error?: unknown;
    };

    if (typeof parsed.message === "string") {
      return parsed.message;
    }

    if (Array.isArray(parsed.message)) {
      return parsed.message.join(" ");
    }

    if (typeof parsed.detail === "string") {
      return parsed.detail;
    }

    if (typeof parsed.error === "string") {
      return parsed.error;
    }
  } catch {
    return responseText;
  }

  return fallback;
}
