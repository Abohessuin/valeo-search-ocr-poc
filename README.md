# VIN Camera Search POC

Lightweight proof of concept for capturing or uploading a VIN image, extracting the VIN with OCR, confirming or correcting it, and searching local vehicle/product data.

This repository is split into two separate projects:

```text
search-ocr-poc/
  frontend/   # Next.js + TypeScript + MUI
  backend/    # NestJS + TypeScript
```

## Frontend

The frontend will use Next.js App Router, TypeScript, MUI, and Montserrat.

```bash
cd frontend
npm install
npm run dev
```

Default URL:

```text
http://localhost:3000
```

## Backend

The backend will use NestJS with a dedicated OCR module and local JSON VIN lookup data.

```bash
cd backend
npm install
npm run start:dev
```

Default URL:

```text
http://localhost:3001
```

## Configuration

Copy each example env file before running locally:

```bash
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
```

Feature implementation will be added task by task.

## Current Backend Endpoints

VIN lookup returns vehicle options, similar to the first real application call:

```text
GET http://localhost:3001/vin/VF1RFD00067891234
```

Selecting one vehicle then loads line-of-business and product-group data:

```text
GET http://localhost:3001/vehicles/100001/line-of-businesses
```

OCR extracts raw text from an uploaded image, then NestJS extracts VIN candidates:

```text
POST http://localhost:3001/ocr/vin
multipart field: image
```

## OCR Providers

The backend supports two real OCR providers. VIN extraction always happens in NestJS, not inside the OCR provider.

Local default:

```env
OCR_PROVIDER=paddle
PADDLE_OCR_URL=http://localhost:8000
PADDLE_OCR_TIMEOUT_MS=15000
```

Run PaddleOCR locally:

```bash
cd paddle-ocr-service
python -m venv .venv
.venv\Scripts\activate
python -m pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

Production/cloud option:

```env
OCR_PROVIDER=google
GOOGLE_CLOUD_PROJECT=your-google-cloud-project-id
GOOGLE_OCR_TIMEOUT_MS=15000
```

Google Cloud Vision uses Application Default Credentials. Do not embed or commit credentials. Configure ADC locally or in the deployment environment before using `OCR_PROVIDER=google`.
