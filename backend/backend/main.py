"""
FastAPI Backend Server for Aura Vitality Guide
Handles ML-based medicine scanning and visual diagnosis
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from typing import Optional
import base64
import io
from PIL import Image
import numpy as np

# Import ML models with error handling
try:
    from ml_models.medicine_scanner import MedicineScannerModel
except Exception as e:
    print(f"Warning: Could not import MedicineScannerModel: {e}")
    MedicineScannerModel = None

try:
    from ml_models.visual_diagnosis import VisualDiagnosisModel
except Exception as e:
    print(f"Warning: Could not import VisualDiagnosisModel: {e}")
    VisualDiagnosisModel = None

from services.ayurvedic_remedies import AyurvedicRemedyService

app = FastAPI(title="Aura Vitality Guide Backend", version="1.0.0")

# CORS Configuration - Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    # Dev-friendly: allow any localhost/lan origin (Vite can run on IPv6 [::1])
    # If you deploy to production, lock this down to your domain.
    allow_origin_regex=r"^https?://(\[::1\]|localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ML Models (with error handling)
if MedicineScannerModel:
    try:
        medicine_scanner = MedicineScannerModel()
    except Exception as e:
        print(f"Warning: Could not initialize MedicineScannerModel: {e}")
        print("Server will continue but medicine scanning may be limited.")
        medicine_scanner = None
else:
    print("MedicineScannerModel not available. Using fallback methods.")
    medicine_scanner = None

if VisualDiagnosisModel:
    try:
        visual_diagnosis = VisualDiagnosisModel()
    except Exception as e:
        print(f"Warning: Could not initialize VisualDiagnosisModel: {e}")
        print("Server will continue but visual diagnosis may be limited.")
        visual_diagnosis = None
else:
    print("VisualDiagnosisModel not available. Using fallback methods.")
    visual_diagnosis = None

remedy_service = AyurvedicRemedyService()


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Aura Vitality Guide Backend",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "models": {
            "medicine_scanner": medicine_scanner.is_loaded() if medicine_scanner else False,
            "visual_diagnosis": visual_diagnosis.is_loaded() if visual_diagnosis else False
        }
    }


@app.post("/api/v1/medicine/scan")
async def scan_medicine(file: UploadFile = File(...)):
    """
    Medicine Scanner Endpoint
    Accepts medicine package image and returns:
    - Identified medicine name
    - Usage & causes
    - Ayurvedic alternatives/remedies
    """
    if not medicine_scanner:
        raise HTTPException(
            status_code=503,
            detail="Medicine scanner model not available. Please check backend logs."
        )
    if hasattr(medicine_scanner, "is_loaded") and not medicine_scanner.is_loaded():
        raise HTTPException(
            status_code=503,
            detail=(
                "Medicine scanning is not available because neither OCR (Tesseract) nor an ML model is configured. "
                "Install Tesseract and set TESSERACT_CMD in backend .env, or train the medicine model."
            ),
        )
    
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read image
        image_bytes = await file.read()
        
        if len(image_bytes) == 0:
            raise HTTPException(status_code=400, detail="Empty image file")
        
        try:
            image = Image.open(io.BytesIO(image_bytes))
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid image format: {str(e)}")
        
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Validate image size
        if image.size[0] < 50 or image.size[1] < 50:
            raise HTTPException(status_code=400, detail="Image too small. Please upload a larger image.")
        
        print(f"Processing medicine image: {image.size[0]}x{image.size[1]}, mode: {image.mode}")
        
        # Process with ML model
        result = await medicine_scanner.identify_medicine(image)
        
        print(f"Medicine identification result: {result.get('medicine_name')}, confidence: {result.get('confidence')}")
        
        # Get ayurvedic remedies
        if result.get('medicine_name') and result.get('medicine_name') != 'Unknown':
            remedies = remedy_service.get_medicine_remedies(
                result['medicine_name'],
                result.get('category', 'general')
            )
            result['ayurvedic_remedies'] = remedies
            print(f"Found {len(remedies)} ayurvedic remedies")
        
        return JSONResponse(content=result)
    
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"Error processing medicine image: {error_trace}")
        raise HTTPException(status_code=500, detail=f"Error processing medicine image: {str(e)}")


@app.post("/api/v1/diagnosis/analyze")
async def analyze_visual_diagnosis(
    file: UploadFile = File(...),
    diagnosis_type: str = "skin"
):
    """
    Visual Diagnosis Endpoint
    Accepts images of skin, eyes, tongue, or nails and returns:
    - Detected conditions/diseases
    - Ayurvedic remedies and natural treatments
    - Recommendations
    """
    if not visual_diagnosis:
        raise HTTPException(
            status_code=503,
            detail="Visual diagnosis model not available. Please check backend logs."
        )
    
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Validate diagnosis type
        valid_types = ["skin", "eye", "tongue", "nail"]
        if diagnosis_type not in valid_types:
            raise HTTPException(
                status_code=400,
                detail=f"diagnosis_type must be one of: {', '.join(valid_types)}"
            )
        
        # Read image
        image_bytes = await file.read()
        
        if len(image_bytes) == 0:
            raise HTTPException(status_code=400, detail="Empty image file")
        
        try:
            image = Image.open(io.BytesIO(image_bytes))
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid image format: {str(e)}")
        
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Validate image size
        if image.size[0] < 50 or image.size[1] < 50:
            raise HTTPException(status_code=400, detail="Image too small. Please upload a larger image.")
        
        print(f"Processing {diagnosis_type} diagnosis image: {image.size[0]}x{image.size[1]}")
        
        # Process with ML model
        result = await visual_diagnosis.analyze(image, diagnosis_type)
        
        print(f"Diagnosis result: {len(result.get('conditions', []))} conditions detected")
        
        # Get ayurvedic remedies for detected conditions
        if result.get('conditions'):
            remedies = []
            for condition in result['conditions']:
                condition_remedies = remedy_service.get_condition_remedies(
                    condition['name'],
                    diagnosis_type
                )
                remedies.extend(condition_remedies)
            
            result['ayurvedic_remedies'] = remedies
            result['recommendations'] = remedy_service.get_recommendations(
                result['conditions'],
                diagnosis_type
            )
            print(f"Found {len(remedies)} ayurvedic remedies")
        
        return JSONResponse(content=result)
    
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"Error processing diagnosis image: {error_trace}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing diagnosis image: {str(e)}"
        )


@app.post("/api/v1/diagnosis/analyze-base64")
async def analyze_visual_diagnosis_base64(
    image_data: dict,
    diagnosis_type: str = "skin"
):
    """
    Visual Diagnosis Endpoint (Base64)
    Accepts base64 encoded image for easier frontend integration
    """
    if not visual_diagnosis:
        raise HTTPException(
            status_code=503,
            detail="Visual diagnosis model not available. Please check backend logs."
        )
    
    try:
        # Extract base64 data
        base64_str = image_data.get('image')
        if not base64_str:
            raise HTTPException(status_code=400, detail="image field required in base64 format")
        
        # Remove data URL prefix if present
        if ',' in base64_str:
            base64_str = base64_str.split(',')[1]
        
        # Decode base64
        image_bytes = base64.b64decode(base64_str)
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Validate diagnosis type
        valid_types = ["skin", "eye", "tongue", "nail"]
        if diagnosis_type not in valid_types:
            raise HTTPException(
                status_code=400,
                detail=f"diagnosis_type must be one of: {', '.join(valid_types)}"
            )
        
        # Process with ML model
        result = await visual_diagnosis.analyze(image, diagnosis_type)
        
        # Get ayurvedic remedies
        if result.get('conditions'):
            remedies = []
            for condition in result['conditions']:
                condition_remedies = remedy_service.get_condition_remedies(
                    condition['name'],
                    diagnosis_type
                )
                remedies.extend(condition_remedies)
            
            result['ayurvedic_remedies'] = remedies
            result['recommendations'] = remedy_service.get_recommendations(
                result['conditions'],
                diagnosis_type
            )
        
        return JSONResponse(content=result)
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing diagnosis image: {str(e)}"
        )


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
