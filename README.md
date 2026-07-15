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
