import { Box, Typography } from "@mui/material";

interface InlineErrorProps {
  message: string;
}

export function InlineError({ message }: InlineErrorProps) {
  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "error.light",
        bgcolor: "#FEF2F2",
        color: "error.dark",
        borderRadius: 1,
        px: 1.5,
        py: 1
      }}
    >
      <Typography variant="body2">{message}</Typography>
    </Box>
  );
}
