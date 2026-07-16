import { isValidVin, normalizeVin } from "../common/vin";

const POSSIBLE_VIN_PATTERN = /[A-Z0-9]{17}/g;
const OCR_CHARACTER_FIXES: Record<string, string> = {
  I: "1",
  O: "0",
  Q: "0"
};

export function extractVinCandidates(rawText: string): string[] {
  const candidates = new Set<string>();
  const uppercaseText = rawText.toUpperCase();

  collectCandidates(uppercaseText.replace(/[^A-Z0-9]+/g, " "), candidates);
  collectCandidates(uppercaseText.replace(/[^A-Z0-9]+/g, ""), candidates);

  return [...candidates];
}

function collectCandidates(source: string, candidates: Set<string>): void {
  for (const match of source.matchAll(POSSIBLE_VIN_PATTERN)) {
    const candidate = normalizeOcrVinCandidate(match[0]);

    if (isValidVin(candidate)) {
      candidates.add(candidate);
    }
  }
}

function normalizeOcrVinCandidate(value: string): string {
  return normalizeVin(value).replace(/[IOQ]/g, (character) => {
    return OCR_CHARACTER_FIXES[character] ?? character;
  });
}
