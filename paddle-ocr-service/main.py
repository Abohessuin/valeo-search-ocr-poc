from io import BytesIO
from typing import Any

import numpy as np
from fastapi import FastAPI, File, HTTPException, UploadFile
from paddleocr import PaddleOCR
from PIL import Image, UnidentifiedImageError

app = FastAPI(title="VIN PaddleOCR Service")

ALLOWED_IMAGE_MIME_TYPES = {"image/jpeg", "image/png", "image/webp",'image/jpg'}
MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024


@app.on_event("startup")
def load_model() -> None:
    app.state.ocr = PaddleOCR(use_angle_cls=True, lang="en")


@app.post("/ocr")
async def extract_text(image: UploadFile = File(...)) -> dict[str, str]:
    print(f"Received image: {image.filename}, content type: {image.content_type}")
    if image.content_type not in ALLOWED_IMAGE_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Only JPEG, PNG, JPG,  and WebP images are supported.",
        )

    content = await image.read()

    if len(content) > MAX_IMAGE_SIZE_BYTES:
        raise HTTPException(status_code=400, detail="Image size must be 5 MB or smaller.")

    try:
        pil_image = Image.open(BytesIO(content)).convert("RGB")
    except UnidentifiedImageError as exc:
        raise HTTPException(status_code=400, detail="Uploaded file is not a valid image.") from exc

    ocr_result = app.state.ocr.ocr(np.array(pil_image), cls=True)

    return {"rawText": "\n".join(extract_lines(ocr_result))}


def extract_lines(ocr_result: Any) -> list[str]:
    lines: list[str] = []

    for page in ocr_result or []:
        for line in page or []:
            text = extract_line_text(line)

            if text:
                lines.append(text)

    return lines


def extract_line_text(line: Any) -> str | None:
    if not isinstance(line, (list, tuple)) or len(line) < 2:
        return None

    metadata = line[1]

    if isinstance(metadata, (list, tuple)) and metadata:
        text = metadata[0]

        if isinstance(text, str):
            return text

    return None
