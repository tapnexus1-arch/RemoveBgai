# RemoveBG AI – Free Open-Source AI Background Remover

RemoveBG AI is a production-ready, free online AI background removal platform built for self-hosting and monetized with **Google AdSense**.

It uses **100% open-source neural vision models** with **zero external background removal APIs** (no remove.bg, no Adobe, no Clipdrop, no Cloudinary, no paid SaaS dependencies).

---

## Key Features

* **Real Open-Source AI Engine**: Powered by deep salient object segmentation models (`RMBG-1.4`, `U2-Net`, `BiRefNet`) running locally via WebAssembly/WebGPU in the browser or on a self-hosted Python FastAPI backend.
* **Privacy-First Architecture**: 0 permanent storage. Images are processed directly on user hardware or on self-hosted instances with automatic temporary file purging (`IMAGE_RETENTION_SECONDS=300`).
* **Interactive Studio**:
  * Before / After comparison slider & side-by-side mode.
  * Pan and zoom controls (Fit, Zoom In, Zoom Out, Reset).
  * High-performance HTML5 Canvas Alpha Mask Editor with Eraser, Restore brush, adjustable radius, and Undo/Redo history.
  * Custom background backdrops: Pure White, Studio Black, Custom Hex Color Picker, Curated Gradients, and Custom Background Photo upload with scaling.
  * Non-destructive adjustments: Brightness, Contrast, Saturation, Blur, Sharpness.
* **Batch Processing Queue**: Drag and drop dozens of images, process with concurrency throttling, and export all cutouts as a bundled ZIP file (assembled 100% locally with JSZip).
* **Policy-Compliant Google AdSense Monetization**: Clean, non-intrusive `GoogleAd` placements across 6 strategic zones, strictly adhering to Google Publisher Policies (no accidental clicks, no deceptive button overlays).
* **SEO Optimized**: Pre-configured JSON-LD structured data, OpenGraph cards, Twitter cards, and 5 comprehensive educational articles.
* **Secure Admin Dashboard**: PIN-protected console monitoring total processed jobs, inference latency, hardware acceleration, and automatic purge schedules.
* **Responsive Dark / Light / System Mode**: Seamless theming with localStorage persistence.

---

## 1. System Requirements

* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher
* **Python** (optional for server-side backend): v3.10 or higher
* **Docker & Docker Compose** (for containerized deployment)
* **Memory**: Minimum 4 GB RAM (8 GB+ recommended for heavy 4K batches)
* **GPU** (optional): NVIDIA GPU with CUDA 11.8+ / 12+ for ultra-fast server inference

---

## 2. Quick Start (Local Development)

### Running the Frontend (Client-Side AI Model)

```bash
# 1. Clone repository
git clone https://github.com/yourusername/removebg-ai.git
cd removebg-ai

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The web application will open at `http://localhost:3000`. By default, it runs the open-source AI segmentation model directly in the browser via WebAssembly and WebGPU without needing any Python server!

---

### Running the Self-Hosted Python FastAPI Backend

If you prefer processing on your private backend server:

```bash
# 1. Navigate to backend
cd backend

# 2. Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install requirements
pip install -r requirements.txt

# 4. Start FastAPI server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Interactive OpenAPI documentation is immediately available at `http://localhost:8000/docs`.

---

## 3. Docker Deployment

### One-Command Deployment

```bash
docker compose up -d --build
```

This starts:
1. `removebg_frontend`: Nginx serving the compiled SPA on port `80`.
2. `removebg_backend`: Python FastAPI service on port `8000`.
3. Auto-cleaning volume for temporary scratch storage.

### Enabling NVIDIA GPU in Docker

If deploying on an NVIDIA GPU server (AWS EC2 G4dn/G5, RunPod, Lambda Labs, Hetzner GPU):

1. Install NVIDIA Container Toolkit:
```bash
sudo apt-get install -y nvidia-container-toolkit
sudo systemctl restart docker
```

2. In `docker-compose.yml`, uncomment the GPU reservation block under `backend`:
```yaml
deploy:
  resources:
    reservations:
      devices:
        - driver: nvidia
          count: 1
          capabilities: [gpu]
```

3. Set `DEVICE=cuda` in `.env`.

4. Rebuild:
```bash
docker compose up -d --build
```

---

## 4. Google AdSense Integration & Monetization

RemoveBG AI is configured for official Google AdSense monetization.

### Step 1: Add Your Publisher ID
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Add your publisher ID:
```env
NEXT_PUBLIC_ADSENSE_CLIENT_ID="ca-pub-1234567890123456"
VITE_ADSENSE_CLIENT_ID="ca-pub-1234567890123456"
```

### Step 2: Configure Ad Units (Optional)
Specify dedicated Ad Unit slot IDs for each responsive location:
```env
VITE_ADSENSE_SLOT_HEADER_BANNER="1234567890"
VITE_ADSENSE_SLOT_BELOW_HERO="2345678901"
VITE_ADSENSE_SLOT_BETWEEN_SECTIONS="3456789012"
VITE_ADSENSE_SLOT_SIDEBAR="4567890123"
VITE_ADSENSE_SLOT_BELOW_EDITOR="5678901234"
VITE_ADSENSE_SLOT_BEFORE_FOOTER="6789012345"
```

### AdSense Policy Compliance Checklist
- [x] No fake advertisement graphics or simulated banners.
- [x] Ads are not placed directly over or adjacent to buttons.
- [x] Layout remains responsive and stable when ad blockers are active.
- [x] No deceptive "Download" buttons disguised as ads.
- [x] High-value educational guides and original content provide genuine publisher utility.

---

## 5. Environment Variables Reference

| Variable | Default | Description |
| :--- | :--- | :--- |
| `VITE_APP_URL` | `http://localhost:3000` | Canonical site URL for SEO cards |
| `VITE_ADSENSE_CLIENT_ID` | `""` | Google AdSense publisher client ID (`ca-pub-...`) |
| `VITE_BACKEND_URL` | `http://localhost:8000` | URL of self-hosted FastAPI instance |
| `VITE_PREFER_BACKEND` | `false` | When `true`, delegates inference to Python server |
| `DEVICE` | `cpu` | Hardware compute target: `cpu` or `cuda` |
| `MAX_FILE_SIZE` | `26214400` | Maximum upload limit in bytes (25 MB) |
| `IMAGE_RETENTION_SECONDS` | `300` | Retention duration before temp files are purged |
| `ADMIN_SECRET` | `admin123` | Password credential for `/admin` telemetry console |

---

## 6. Privacy & Auto-Deletion Implementation

We uphold a strict privacy-first standard:
1. **Zero Permanent Databases**: No database table stores uploaded user images.
2. **Scratch Storage TTL**: On the backend, files written to `TEMP_DIR` are tagged with filesystem timestamps. An asynchronous background daemon scans every 60 seconds and permanently removes any scratch file older than `IMAGE_RETENTION_SECONDS`.
3. **Zero Pixel Telemetry**: Analytics events record only timestamps and button interactions. No image matrices, face features, or binary blobs are transmitted.

---

## 7. Third-Party Licenses

* **RemoveBG AI Application Code**: MIT License.
* **@imgly/background-removal**: AGPL-3.0 / Commercial (Permitted for free open web deployment).
* **rembg**: MIT License (Daniel Gatis).
* **U-2-Net Weights**: Apache 2.0 (Xuebin Qin et al.).
* **RMBG-1.4 Weights**: BRIA AI Open Weight License.
* **Lucide React**: ISC License.
* **Plus Jakarta Sans**: SIL Open Font License 1.1.
* **Syne**: SIL Open Font License 1.1.

---

## 8. Troubleshooting

**Q: The AI model runs slowly on the first image.**  
A: The first execution fetches the model weights (approx. 35 MB) and caches them in your browser IndexedDB or RAM. Subsequent executions run in sub-second times.

**Q: Memory limit error during 4K batch processing.**  
A: The batch processor includes a concurrency throttle (max 2 parallel tasks). For batches exceeding 50 images, recommend using the Python server with `DEVICE=cuda`.
