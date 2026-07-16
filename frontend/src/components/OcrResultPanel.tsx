import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { OcrVinResponse } from "@/types/ocr";
import { VinValidationResult } from "@/types/vin";

interface OcrResultPanelProps {
  ocrResult: OcrVinResponse;
  vinValue: string;
  vinValidation: VinValidationResult;
  confirmedVin: string | null;
  isSearchingVin: boolean;
  onVinChange: (value: string) => void;
  onConfirmVin: () => void;
}

export function OcrResultPanel({
  ocrResult,
  vinValue,
  vinValidation,
  confirmedVin,
  isSearchingVin,
  onVinChange,
  onConfirmVin
}: OcrResultPanelProps) {
  return (
    <Stack spacing={2}>
      <Alert severity={ocrResult.extractedVin ? "success" : "warning"}>
        {ocrResult.extractedVin
          ? `OCR found a VIN using ${ocrResult.provider}.`
          : `OCR finished using ${ocrResult.provider}, but no valid VIN was found.`}
      </Alert>

      <TextField
        label="Confirm VIN"
        value={vinValue}
        onChange={(event) => onVinChange(event.target.value)}
        fullWidth
        inputProps={{ maxLength: 17 }}
        error={Boolean(vinValue) && !vinValidation.isValid}
        helperText={vinValidation.message}
      />

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
        <Button
          variant="contained"
          startIcon={
            isSearchingVin ? (
              <CircularProgress color="inherit" size={18} />
            ) : (
              <CheckCircleOutlineOutlinedIcon />
            )
          }
          disabled={!vinValidation.isValid || isSearchingVin}
          onClick={onConfirmVin}
        >
          {isSearchingVin ? "Searching Vehicles" : "Confirm & Search"}
        </Button>
        {confirmedVin ? (
          <Chip color="success" label={`Confirmed: ${confirmedVin}`} />
        ) : null}
      </Stack>

      {ocrResult.candidates.length > 0 ? (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {ocrResult.candidates.map((candidate) => (
            <Chip
              key={candidate}
              label={candidate}
              onClick={() => onVinChange(candidate)}
              variant={candidate === vinValue ? "filled" : "outlined"}
              color={candidate === vinValue ? "primary" : "default"}
            />
          ))}
        </Stack>
      ) : null}

      <Accordion variant="outlined" disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 700 }}>Raw OCR Text</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            component="pre"
            sx={{
              m: 0,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontFamily: "monospace",
              fontSize: 13,
              color: "text.secondary"
            }}
          >
            {ocrResult.rawText || "No raw text returned."}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
}
