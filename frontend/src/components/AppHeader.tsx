import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined";
import { Box, Container, Stack, Typography } from "@mui/material";

export function AppHeader() {
  return (
    <Box
      component="header"
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper"
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{ minHeight: 64 }}
        >
          <DirectionsCarFilledOutlinedIcon color="primary" />
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" component="p" sx={{ fontWeight: 800 }}>
              VIN Camera Search
            </Typography>
            <Typography variant="body2" color="text.secondary">
              OCR proof of concept
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
