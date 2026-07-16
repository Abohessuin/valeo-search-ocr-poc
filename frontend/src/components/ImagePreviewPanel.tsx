import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { Box, Chip, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { SelectedImage } from "@/types/image";

interface ImagePreviewPanelProps {
  selectedImage: SelectedImage | null;
  maxImageSizeMb: number;
  onClear: () => void;
}

export function ImagePreviewPanel({
  selectedImage,
  maxImageSizeMb,
  onClear
}: ImagePreviewPanelProps) {
  if (!selectedImage) {
    return (
      <Box
        sx={{
          minHeight: { xs: 280, md: 360 },
          border: "1px dashed",
          borderColor: "divider",
          borderRadius: 1,
          display: "grid",
          placeItems: "center",
          bgcolor: "#FAFBFC",
          px: 2
        }}
      >
        <Stack alignItems="center" spacing={1.25} sx={{ textAlign: "center" }}>
          <ImageOutlinedIcon color="disabled" sx={{ fontSize: 44 }} />
          <Typography sx={{ fontWeight: 700 }}>No image selected</Typography>
          <Typography variant="body2" color="text.secondary">
            JPEG, PNG, or WebP up to {maxImageSizeMb} MB.
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Stack spacing={1.5}>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: { xs: "4 / 3", md: "16 / 10" },
          overflow: "hidden",
          borderRadius: 1,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "#111820"
        }}
      >
        <Box
          component="img"
          src={selectedImage.previewUrl}
          alt="Selected VIN image preview"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block"
          }}
        />
      </Box>

      <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
        <Chip
          size="small"
          color={selectedImage.source === "camera" ? "primary" : "default"}
          label={selectedImage.source === "camera" ? "Camera" : "Upload"}
        />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography noWrap sx={{ fontWeight: 700 }}>
            {selectedImage.file.name || "Captured image"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {(selectedImage.file.size / 1024 / 1024).toFixed(2)} MB
          </Typography>
        </Box>
        <Tooltip title="Remove image">
          <IconButton aria-label="Remove selected image" onClick={onClear}>
            <DeleteOutlineOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
}
