import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box, Card, CardContent, Divider, Stack, Typography } from "@mui/material";

interface DemoFlowCardProps {
  activeStep: number;
}

const steps = [
  "Capture or upload VIN image",
  "OCR extracts raw text",
  "Confirm or correct VIN",
  "Search local vehicle data"
];

export function DemoFlowCard({ activeStep }: DemoFlowCardProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <InfoOutlinedIcon color="primary" fontSize="small" />
            <Typography variant="h3" sx={{ fontSize: 18 }}>
              Demo Flow
            </Typography>
          </Stack>
          <Divider />
          <Stack spacing={1.25}>
            {steps.map((step, index) => (
              <FlowStep
                key={step}
                label={`${index + 1}`}
                text={step}
                active={activeStep === index + 1}
                complete={activeStep > index + 1}
              />
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

interface FlowStepProps {
  label: string;
  text: string;
  active: boolean;
  complete: boolean;
}

function FlowStep({ label, text, active, complete }: FlowStepProps) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.25}>
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          bgcolor: active || complete ? "primary.main" : "#E8ECF1",
          color: active || complete ? "primary.contrastText" : "text.secondary",
          fontSize: 13,
          fontWeight: 800,
          flex: "0 0 auto"
        }}
      >
        {label}
      </Box>
      <Typography
        variant="body2"
        color={active || complete ? "text.primary" : "text.secondary"}
      >
        {text}
      </Typography>
    </Stack>
  );
}
