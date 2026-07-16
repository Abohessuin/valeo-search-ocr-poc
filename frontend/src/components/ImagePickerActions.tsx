import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { Button, Stack } from "@mui/material";
import { ChangeEvent, useRef } from "react";
import { SelectedImage } from "@/types/image";

interface ImagePickerActionsProps {
  onImageSelected: (file: File, source: SelectedImage["source"]) => void;
}

export function ImagePickerActions({ onImageSelected }: ImagePickerActionsProps) {
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  function handleChange(
    event: ChangeEvent<HTMLInputElement>,
    source: SelectedImage["source"]
  ) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (file) {
      onImageSelected(file, source);
    }
  }

  return (
    <>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} useFlexGap>
        <Button
          fullWidth
          size="large"
          variant="contained"
          startIcon={<CameraAltOutlinedIcon />}
          onClick={() => cameraInputRef.current?.click()}
        >
          Use Camera
        </Button>
        <Button
          fullWidth
          size="large"
          variant="outlined"
          startIcon={<CloudUploadOutlinedIcon />}
          onClick={() => uploadInputRef.current?.click()}
        >
          Upload Image
        </Button>
      </Stack>

      <input
        ref={cameraInputRef}
        hidden
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(event) => handleChange(event, "camera")}
      />
      <input
        ref={uploadInputRef}
        hidden
        type="file"
        accept="image/*"
        onChange={(event) => handleChange(event, "upload")}
      />
    </>
  );
}
