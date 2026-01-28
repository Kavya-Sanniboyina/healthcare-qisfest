# Aura Vitality Guide - Backend Server

Backend API server with ML models for medicine scanning and visual diagnosis.

## Features

1. **Medicine Scanner API** - Identifies medicines from package images and suggests Ayurvedic alternatives
2. **Visual Diagnosis API** - Analyzes skin, eyes, tongue, and nails for conditions and provides Ayurvedic remedies

## Setup

### Prerequisites

- Python 3.8 or higher
- Tesseract OCR installed on your system
  - Windows: Download from [GitHub](https://github.com/UB-Mannheim/tesseract/wiki)
  - macOS: `brew install tesseract`
  - Linux: `sudo apt-get install tesseract-ocr`

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure Tesseract path (if needed):
   - Windows: Set `TESSERACT_CMD` in `.env` file
   - Or add Tesseract to your system PATH

5. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

### Running the Server

#### Development Mode
```bash
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The server will start at `http://localhost:8000`

#### Production Mode
```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000
```

## API Endpoints

### Health Check
- `GET /` - Basic health check
- `GET /health` - Detailed health check with model status

### Medicine Scanner
- `POST /api/v1/medicine/scan`
  - **Body**: Form data with `file` (image file)
  - **Response**: Medicine identification with Ayurvedic alternatives

### Visual Diagnosis
- `POST /api/v1/diagnosis/analyze`
  - **Body**: Form data with `file` (image file) and `diagnosis_type` (skin/eye/tongue/nail)
  - **Response**: Condition analysis with Ayurvedic remedies

- `POST /api/v1/diagnosis/analyze-base64`
  - **Body**: JSON with `image` (base64 string) and `diagnosis_type`
  - **Response**: Same as above, but accepts base64 encoded images

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Integration with Frontend

The frontend should be configured to call the backend API. Update your `.env` file in the root directory:

```env
VITE_BACKEND_URL=http://localhost:8000
```

## ML Models

Currently, the system uses:
- **OCR (Tesseract)** for medicine text extraction
- **Rule-based analysis** for visual diagnosis

To enhance with ML models:
1. Train or download pre-trained models
2. Place them in the `models/` directory
3. Update the model loading code in `ml_models/` files
4. Uncomment PyTorch dependencies in `requirements.txt`

## Development

### Project Structure
```
backend/
├── main.py                 # FastAPI application
├── ml_models/
│   ├── medicine_scanner.py # Medicine identification model
│   └── visual_diagnosis.py # Visual diagnosis model
├── services/
│   └── ayurvedic_remedies.py # Remedy database and service
├── requirements.txt        # Python dependencies
└── README.md              # This file
```

## Troubleshooting

### Tesseract Not Found
- Ensure Tesseract is installed and in your PATH
- Or set `TESSERACT_CMD` environment variable

### Port Already in Use
- Change the port in `main.py` or use `--port` flag with uvicorn

### CORS Issues
- Update `allow_origins` in `main.py` to include your frontend URL

## License

Same as main project.
