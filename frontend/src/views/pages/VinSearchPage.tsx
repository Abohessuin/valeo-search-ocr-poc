"use client";

import FindInPageOutlinedIcon from "@mui/icons-material/FindInPageOutlined";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Stack,
  Typography
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { DemoFlowCard } from "@/components/DemoFlowCard";
import { ImagePickerActions } from "@/components/ImagePickerActions";
import { ImagePreviewPanel } from "@/components/ImagePreviewPanel";
import { InlineError } from "@/components/InlineError";
import { OcrResultPanel } from "@/components/OcrResultPanel";
import { VehicleResultsPanel } from "@/components/VehicleResultsPanel";
import { SelectedImage } from "@/types/image";
import { OcrVinResponse } from "@/types/ocr";
import {
  extractVinFromImage,
  getVehicleLineOfBusinesses,
  searchVehiclesByVin
} from "@/utils/api";
import {
  VehicleLineOfBusinessesResponse,
  VehicleSummary,
  VinSearchResponse
} from "@/types/search";
import { normalizeVinInput, validateVin } from "@/utils/vin";

const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

export default function VinSearchPage() {
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<OcrVinResponse | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [vinValue, setVinValue] = useState("");
  const [confirmedVin, setConfirmedVin] = useState<string | null>(null);
  const [vinSearchResult, setVinSearchResult] =
    useState<VinSearchResponse | null>(null);
  const [isSearchingVin, setIsSearchingVin] = useState(false);
  const [vinSearchError, setVinSearchError] = useState<string | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [vehicleData, setVehicleData] =
    useState<VehicleLineOfBusinessesResponse | null>(null);
  const [isLoadingVehicleData, setIsLoadingVehicleData] = useState(false);
  const [vehicleDataError, setVehicleDataError] = useState<string | null>(null);

  const vinValidation = useMemo(() => validateVin(vinValue), [vinValue]);
  const activeStep = confirmedVin ? 4 : ocrResult ? 3 : selectedImage ? 2 : 1;

  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage.previewUrl);
      }
    };
  }, [selectedImage]);

  function handleImageSelected(file: File, source: SelectedImage["source"]) {
    if (!file.type.startsWith("image/")) {
      setImageError("Choose an image file.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setImageError(`Image size must be ${MAX_IMAGE_SIZE_MB} MB or smaller.`);
      return;
    }

    setSelectedImage((currentImage) => {
      if (currentImage) {
        URL.revokeObjectURL(currentImage.previewUrl);
      }

      return {
        file,
        source,
        previewUrl: URL.createObjectURL(file)
      };
    });
    setImageError(null);
    setOcrError(null);
    setOcrResult(null);
    setVinValue("");
    resetSearchState();
  }

  function clearImage() {
    setSelectedImage((currentImage) => {
      if (currentImage) {
        URL.revokeObjectURL(currentImage.previewUrl);
      }

      return null;
    });
    setImageError(null);
    setOcrError(null);
    setOcrResult(null);
    setVinValue("");
    resetSearchState();
  }

  async function handleExtractVin() {
    if (!selectedImage) {
      return;
    }

    setIsExtracting(true);
    setOcrError(null);
    resetSearchState();

    try {
      const result = await extractVinFromImage(selectedImage.file);
      setOcrResult(result);
      setVinValue(normalizeVinInput(result.extractedVin ?? result.candidates[0] ?? ""));
    } catch (error) {
      setOcrResult(null);
      setVinValue("");
      setOcrError(
        error instanceof Error
          ? error.message
          : "OCR request failed. Make sure the backend and OCR service are running."
      );
    } finally {
      setIsExtracting(false);
    }
  }

  function handleVinChange(value: string) {
    setVinValue(normalizeVinInput(value));
    resetSearchState();
  }

  async function confirmVin() {
    if (!vinValidation.isValid) {
      return;
    }

    const normalizedVin = normalizeVinInput(vinValue);

    setConfirmedVin(normalizedVin);
    setVinSearchResult(null);
    setSelectedVehicleId(null);
    setVehicleData(null);
    setVinSearchError(null);
    setVehicleDataError(null);
    setIsSearchingVin(true);

    try {
      const result = await searchVehiclesByVin(normalizedVin);
      setVinSearchResult(result);
    } catch (error) {
      setVinSearchResult(null);
      setVinSearchError(
        error instanceof Error
          ? error.message
          : "Vehicle search failed. Make sure the backend is running."
      );
    } finally {
      setIsSearchingVin(false);
    }
  }

  async function selectVehicle(vehicle: VehicleSummary) {
    setSelectedVehicleId(vehicle.id);
    setVehicleData(null);
    setVehicleDataError(null);
    setIsLoadingVehicleData(true);

    try {
      const result = await getVehicleLineOfBusinesses(vehicle.id);
      setVehicleData(result);
    } catch (error) {
      setVehicleDataError(
        error instanceof Error
          ? error.message
          : "Product data failed to load. Make sure the backend is running."
      );
    } finally {
      setIsLoadingVehicleData(false);
    }
  }

  function resetSearchState() {
    setConfirmedVin(null);
    setVinSearchResult(null);
    setVinSearchError(null);
    setSelectedVehicleId(null);
    setVehicleData(null);
    setVehicleDataError(null);
    setIsSearchingVin(false);
    setIsLoadingVehicleData(false);
  }

  return (
    <Box component="main" sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppHeader />

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 360px" },
            gap: { xs: 2, md: 3 },
            alignItems: "start"
          }}
        >
          <Stack spacing={2}>
            <Box>
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ fontWeight: 800 }}
              >
                VIN OCR
              </Typography>
              <Typography variant="h1" sx={{ fontSize: { xs: 32, md: 46 } }}>
                Capture or upload a VIN image
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ mt: 1, maxWidth: 680, lineHeight: 1.7 }}
              >
                Select a clear image of the VIN plate, windshield label, or
                registration document.
              </Typography>
            </Box>

            <Card variant="outlined">
              <CardContent>
                <Stack spacing={2.5}>
                  <ImagePickerActions onImageSelected={handleImageSelected} />

                  {imageError ? <InlineError message={imageError} /> : null}

                  <ImagePreviewPanel
                    selectedImage={selectedImage}
                    maxImageSizeMb={MAX_IMAGE_SIZE_MB}
                    onClear={clearImage}
                  />

                  <Button
                    size="large"
                    variant="contained"
                    startIcon={
                      isExtracting ? (
                        <CircularProgress color="inherit" size={18} />
                      ) : (
                        <FindInPageOutlinedIcon />
                      )
                    }
                    disabled={!selectedImage || isExtracting}
                    onClick={handleExtractVin}
                  >
                    {isExtracting ? "Extracting VIN" : "Extract VIN"}
                  </Button>

                  {ocrError ? <InlineError message={ocrError} /> : null}

                  {ocrResult ? (
                    <OcrResultPanel
                      ocrResult={ocrResult}
                      vinValue={vinValue}
                      vinValidation={vinValidation}
                      confirmedVin={confirmedVin}
                      isSearchingVin={isSearchingVin}
                      onVinChange={handleVinChange}
                      onConfirmVin={confirmVin}
                    />
                  ) : null}

                  {vinSearchError ? <InlineError message={vinSearchError} /> : null}

                  <VehicleResultsPanel
                    vinSearchResult={vinSearchResult}
                    selectedVehicleId={selectedVehicleId}
                    vehicleData={vehicleData}
                    isLoadingVehicleData={isLoadingVehicleData}
                    vehicleDataError={vehicleDataError}
                    onVehicleSelect={selectVehicle}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Stack>

          <DemoFlowCard activeStep={activeStep} />
        </Box>
      </Container>
    </Box>
  );
}
