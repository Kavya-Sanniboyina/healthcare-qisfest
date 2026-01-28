"""
Medicine Scanner ML Model
Identifies medicines from package images using trained CNN model and OCR
"""

import os
import numpy as np
from PIL import Image
import pytesseract
from typing import Dict, Optional, List
import re
import json
import shutil

# If Tesseract is installed but not on PATH, set it explicitly via env.
# Example: TESSERACT_CMD=C:/Program Files/Tesseract-OCR/tesseract.exe
_tesseract_cmd = os.environ.get("TESSERACT_CMD")
if _tesseract_cmd:
    try:
        pytesseract.pytesseract.tesseract_cmd = _tesseract_cmd
    except Exception:
        pass

# Try to import ML libraries
ML_AVAILABLE = False
try:
    import torch
    import torchvision.transforms as transforms
    from torchvision import models
    # Test if torch actually works (DLL loading issue on Windows)
    _ = torch.device('cpu')
    ML_AVAILABLE = True
except (ImportError, OSError, RuntimeError) as e:
    ML_AVAILABLE = False
    print(f"Warning: PyTorch not available ({type(e).__name__}). Using OCR-only mode.")
    print(f"Error details: {str(e)}")
    print("To fix: Install Visual C++ Redistributables or reinstall PyTorch")


class MedicineScannerModel:
    """Medicine identification model using trained CNN and OCR"""
    
    def __init__(self):
        self.model_loaded = False
        self.model = None
        self.device = None
        self.label_mapping = {}
        self.medicine_database = self._load_medicine_database()
        self.ocr_available = self._check_ocr_available()
        self.last_ocr_error: Optional[str] = None
        
        # Try to load ML model if available
        if ML_AVAILABLE:
            try:
                self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
                self._load_model()
            except Exception as e:
                print(f"Could not load ML model: {e}. Using OCR-only mode.")
                self.model_loaded = False
                self.model = None

    def _check_ocr_available(self) -> bool:
        """Check whether Tesseract OCR is available on this machine."""
        # 1) If user configured a direct path, it must exist
        cmd = getattr(pytesseract.pytesseract, "tesseract_cmd", None)
        if cmd and isinstance(cmd, str) and cmd.strip():
            if os.path.exists(cmd):
                return True
            print(f"Warning: TESSERACT_CMD is set but does not exist: {cmd}")
            return False

        # 2) Otherwise, require it on PATH
        if shutil.which("tesseract") is None:
            print("Warning: Tesseract not found on PATH.")
            print("Fix: Install Tesseract OR set TESSERACT_CMD to the full path of tesseract.exe.")
            return False

        # 3) Final sanity check: can we call it?
        try:
            _ = pytesseract.get_tesseract_version()
            return True
        except Exception as e:
            print("Warning: Tesseract detected but not callable by pytesseract.")
            print(f"Details: {e}")
            return False
    
    def _load_medicine_database(self) -> Dict:
        """Load medicine database for matching"""
        # This would typically load from a database or JSON file
        # For now, return a sample database
        return {
            "paracetamol": {
                "name": "Paracetamol",
                "category": "Pain Reliever",
                "uses": "Fever, pain relief",
                "common_names": ["paracetamol", "acetaminophen", "tylenol"]
            },
            "ibuprofen": {
                "name": "Ibuprofen",
                "category": "NSAID",
                "uses": "Inflammation, pain, fever",
                "common_names": ["ibuprofen", "advil", "motrin"]
            },
            "amoxicillin": {
                "name": "Amoxicillin",
                "category": "Antibiotic",
                "uses": "Bacterial infections",
                "common_names": ["amoxicillin", "amoxil"]
            },
            # Add more medicines as needed
        }
    
    def _load_model(self):
        """Load trained medicine recognition model"""
        model_path = 'models/medicine_model_best.pth'
        labels_path = 'models/medicine_labels.json'
        
        if not os.path.exists(model_path):
            print(f"Trained model not found at {model_path}. Using OCR-only mode.")
            print("Run train_medicine_model.py to train a model first.")
            return
        
        try:
            # Load label mapping
            if os.path.exists(labels_path):
                with open(labels_path, 'r') as f:
                    self.label_mapping = json.load(f)
            
            # Load model
            checkpoint = torch.load(model_path, map_location=self.device)
            
            # Create model architecture
            num_classes = len(self.label_mapping) if self.label_mapping else checkpoint.get('num_classes', 10)
            self.model = models.resnet18(weights=None)
            num_features = self.model.fc.in_features
            self.model.fc = torch.nn.Linear(num_features, num_classes)
            
            # Load weights
            if 'model_state_dict' in checkpoint:
                self.model.load_state_dict(checkpoint['model_state_dict'])
            else:
                self.model.load_state_dict(checkpoint)
            
            self.model.to(self.device)
            self.model.eval()
            self.model_loaded = True
            
            print(f"✓ Loaded medicine classification model with {num_classes} classes")
        except Exception as e:
            print(f"Error loading model: {e}. Using OCR-only mode.")
            self.model_loaded = False
    
    def is_loaded(self) -> bool:
        """Check if model is loaded"""
        return bool(self.model_loaded) or bool(self.ocr_available)
    
    async def identify_medicine(self, image: Image.Image) -> Dict:
        """
        Identify medicine from image using trained CNN model
        
        Returns:
            {
                "medicine_name": str,
                "confidence": float,
                "category": str,
                "uses": str,
                "extracted_text": str
            }
        """
        try:
            medicine_name = "Unknown"
            confidence = 0.0
            method = "ocr"
            ocr_error = None
            
            # Step 1: Use trained ML model if available (primary method)
            if ML_AVAILABLE and self.model_loaded and self.model is not None:
                ml_result = await self._ml_predict(image)
                if ml_result:
                    medicine_name = ml_result['name']
                    confidence = ml_result['confidence']
                    method = "ml"
            
            # Step 2: Fallback to OCR if ML didn't work or for text extraction
            extracted_text = ""
            if self.ocr_available:
                extracted_text = self._extract_text(image)
            else:
                ocr_error = (
                    "Tesseract OCR is not installed/configured on the backend. "
                    "Install Tesseract and set TESSERACT_CMD if needed."
                )
            if self.ocr_available and (not extracted_text) and (not ocr_error):
                ocr_error = self.last_ocr_error or "OCR failed to extract any text from the image."
            
            # If ML model didn't provide good result, try OCR matching
            if confidence < 0.5 or medicine_name == "Unknown":
                medicine_info = self._match_medicine(extracted_text)
                if medicine_info.get('confidence', 0) > confidence:
                    medicine_name = medicine_info.get('name', 'Unknown')
                    confidence = medicine_info.get('confidence', 0.0)
                    method = "ocr" if method != "ml" else "ml+ocr"
            
            # Get medicine details from database
            medicine_details = self._get_medicine_details(medicine_name)
            
            return {
                "medicine_name": medicine_name,
                "confidence": confidence,
                "category": medicine_details.get('category', 'Unknown'),
                "uses": medicine_details.get('uses', 'Unknown'),
                "extracted_text": extracted_text,
                "method": method,
                "error": ocr_error
            }
        
        except Exception as e:
            return {
                "medicine_name": None,
                "confidence": 0.0,
                "category": "Unknown",
                "uses": "Could not identify",
                "extracted_text": "",
                "error": str(e)
            }
    
    def _extract_text(self, image: Image.Image) -> str:
        """Extract text from medicine package using OCR"""
        try:
            self.last_ocr_error = None
            # Preprocess image for better OCR
            # Resize if too large (but keep aspect ratio)
            max_size = 2000
            if max(image.size) > max_size:
                ratio = max_size / max(image.size)
                new_size = (int(image.size[0] * ratio), int(image.size[1] * ratio))
                image = image.resize(new_size, Image.Resampling.LANCZOS)
            
            # Enhance image for better OCR
            # Convert to grayscale
            if image.mode != 'L':
                gray_image = image.convert('L')
            else:
                gray_image = image
            
            # Extract text using Tesseract with better config
            config = '--oem 3 --psm 6'  # OCR Engine Mode 3, Page Segmentation Mode 6
            text = pytesseract.image_to_string(gray_image, lang='eng', config=config)
            
            # Clean up text
            text = re.sub(r'\s+', ' ', text).strip()
            
            print(f"OCR extracted text: {text[:100]}...")  # Log first 100 chars
            
            return text
        
        except Exception as e:
            self.last_ocr_error = str(e)
            print(f"OCR Error: {e}")
            # Try without config if config fails
            try:
                text = pytesseract.image_to_string(image, lang='eng')
                return re.sub(r'\s+', ' ', text).strip()
            except:
                return ""
    
    def _match_medicine(self, text: str) -> Dict:
        """Match extracted text to medicine database"""
        text_lower = text.lower()
        best_match = None
        best_confidence = 0.0
        
        for medicine_id, medicine_data in self.medicine_database.items():
            # Check if any common name appears in text
            for name in medicine_data.get('common_names', []):
                if name.lower() in text_lower:
                    # Calculate confidence based on match quality
                    confidence = min(0.9, len(name) / len(text_lower) * 2)
                    if confidence > best_confidence:
                        best_confidence = confidence
                        best_match = {
                            'name': medicine_data['name'],
                            'category': medicine_data['category'],
                            'uses': medicine_data['uses'],
                            'confidence': confidence
                        }
        
        # If no match found, try to extract medicine name from text
        if not best_match:
            # Look for common medicine name patterns
            words = text.split()
            if words:
                potential_name = words[0] if len(words[0]) > 3 else ' '.join(words[:2])
                best_match = {
                    'name': potential_name,
                    'category': 'Unknown',
                    'uses': 'Unknown',
                    'confidence': 0.3
                }
        
        return best_match or {
            'name': 'Unknown Medicine',
            'category': 'Unknown',
            'uses': 'Could not identify',
            'confidence': 0.0
        }
    
    async def _ml_predict(self, image: Image.Image) -> Optional[Dict]:
        """Use trained ML model to predict medicine"""
        try:
            # Preprocess image
            transform = transforms.Compose([
                transforms.Resize((224, 224)),
                transforms.ToTensor(),
                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
            ])
            
            # Convert PIL to tensor
            img_tensor = transform(image).unsqueeze(0).to(self.device)
            
            # Predict
            with torch.no_grad():
                outputs = self.model(img_tensor)
                probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
                confidence, predicted_idx = torch.max(probabilities, 0)
                
                confidence = confidence.item()
                predicted_idx = predicted_idx.item()
                
                # Get medicine name from label mapping
                if self.label_mapping and str(predicted_idx) in self.label_mapping:
                    medicine_name = self.label_mapping[str(predicted_idx)]
                elif predicted_idx < len(self.label_mapping):
                    medicine_name = list(self.label_mapping.values())[predicted_idx]
                else:
                    medicine_name = "Unknown"
                
                return {
                    "name": medicine_name,
                    "confidence": confidence
                }
        except Exception as e:
            print(f"ML prediction error: {e}")
            return None
    
    def _get_medicine_details(self, medicine_name: str) -> Dict:
        """Get medicine details from database"""
        medicine_lower = medicine_name.lower()
        
        # Search in database
        for med_id, med_data in self.medicine_database.items():
            if medicine_lower in med_id.lower() or any(
                medicine_lower in name.lower() for name in med_data.get('common_names', [])
            ):
                return {
                    "category": med_data.get('category', 'Unknown'),
                    "uses": med_data.get('uses', 'Unknown')
                }
        
        return {"category": "Unknown", "uses": "Unknown"}
