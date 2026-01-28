"""
Visual Diagnosis ML Model
Analyzes skin, eyes, tongue, and nails for disease detection
"""

import os
import numpy as np
from PIL import Image
from typing import Dict, List, Optional
import json

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
    print(f"Warning: PyTorch not available ({type(e).__name__}). Using rule-based analysis.")
    print(f"Error details: {str(e)}")
    print("To fix: Install Visual C++ Redistributables or reinstall PyTorch")


class VisualDiagnosisModel:
    """Visual diagnosis model for skin, eyes, tongue, and nails"""
    
    def __init__(self):
        self.model_loaded = False
        self.skin_model = None
        self.device = None
        self.skin_label_mapping = {}
        self.condition_database = self._load_condition_database()
        
        # Try to load ML models if available
        if ML_AVAILABLE:
            try:
                self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
                self._load_models()
            except Exception as e:
                print(f"Could not load ML models: {e}. Using rule-based mode.")
                self.model_loaded = False
                self.skin_model = None
    
    def _load_condition_database(self) -> Dict:
        """Load condition database for different diagnosis types"""
        return {
            "skin": {
                "acne": {
                    "name": "Acne",
                    "severity": "moderate",
                    "description": "Inflammation of skin with pimples, blackheads, or whiteheads"
                },
                "dryness": {
                    "name": "Dry Skin",
                    "severity": "mild",
                    "description": "Lack of moisture in the skin"
                },
                "eczema": {
                    "name": "Eczema",
                    "severity": "moderate",
                    "description": "Inflammatory skin condition with itching and redness"
                },
                "psoriasis": {
                    "name": "Psoriasis",
                    "severity": "moderate",
                    "description": "Chronic skin condition with red, scaly patches"
                },
                "hyperpigmentation": {
                    "name": "Hyperpigmentation",
                    "severity": "mild",
                    "description": "Darkening of skin areas"
                }
            },
            "eye": {
                "conjunctivitis": {
                    "name": "Conjunctivitis",
                    "severity": "moderate",
                    "description": "Inflammation of the conjunctiva (pink eye)"
                },
                "dry_eyes": {
                    "name": "Dry Eyes",
                    "severity": "mild",
                    "description": "Insufficient tear production"
                },
                "jaundice": {
                    "name": "Jaundice",
                    "severity": "severe",
                    "description": "Yellowing of eyes indicating liver issues"
                },
                "redness": {
                    "name": "Eye Redness",
                    "severity": "mild",
                    "description": "General redness or irritation"
                }
            },
            "tongue": {
                "white_coating": {
                    "name": "White Coating",
                    "severity": "mild",
                    "description": "White coating on tongue (Ama/toxins)"
                },
                "yellow_coating": {
                    "name": "Yellow Coating",
                    "severity": "moderate",
                    "description": "Yellow coating indicating Pitta imbalance"
                },
                "geographic_tongue": {
                    "name": "Geographic Tongue",
                    "severity": "mild",
                    "description": "Map-like patterns on tongue"
                },
                "cracks": {
                    "name": "Tongue Cracks",
                    "severity": "moderate",
                    "description": "Cracks indicating Vata imbalance"
                }
            },
            "nail": {
                "brittle_nails": {
                    "name": "Brittle Nails",
                    "severity": "mild",
                    "description": "Weak, easily breakable nails"
                },
                "discoloration": {
                    "name": "Nail Discoloration",
                    "severity": "moderate",
                    "description": "Unusual nail color changes"
                },
                "ridges": {
                    "name": "Nail Ridges",
                    "severity": "mild",
                    "description": "Vertical or horizontal ridges"
                },
                "fungal_infection": {
                    "name": "Fungal Infection",
                    "severity": "moderate",
                    "description": "Fungal growth on nails"
                }
            }
        }
    
    def _load_models(self):
        """Load trained diagnosis models"""
        # Load skin model
        skin_model_path = 'models/skin_model_best.pth'
        skin_labels_path = 'models/skin_labels.json'
        
        if os.path.exists(skin_model_path):
            try:
                # Load label mapping
                if os.path.exists(skin_labels_path):
                    with open(skin_labels_path, 'r') as f:
                        self.skin_label_mapping = json.load(f)
                
                # Load model
                checkpoint = torch.load(skin_model_path, map_location=self.device)
                
                # Create model architecture
                num_classes = len(self.skin_label_mapping) if self.skin_label_mapping else checkpoint.get('num_classes', 10)
                self.skin_model = models.resnet18(weights=None)
                num_features = self.skin_model.fc.in_features
                self.skin_model.fc = torch.nn.Linear(num_features, num_classes)
                
                # Load weights
                if 'model_state_dict' in checkpoint:
                    self.skin_model.load_state_dict(checkpoint['model_state_dict'])
                else:
                    self.skin_model.load_state_dict(checkpoint)
                
                self.skin_model.to(self.device)
                self.skin_model.eval()
                self.model_loaded = True
                
                print(f"✓ Loaded skin condition classification model with {num_classes} classes")
            except Exception as e:
                print(f"Error loading skin model: {e}. Using rule-based mode.")
                self.model_loaded = False
        else:
            print(f"Trained skin model not found at {skin_model_path}.")
            print("Run train_skin_model.py to train a model first.")
            print("Using rule-based analysis as fallback.")
    
    def is_loaded(self) -> bool:
        """Check if models are loaded"""
        return True  # Rule-based analysis is always available
    
    async def analyze(self, image: Image.Image, diagnosis_type: str) -> Dict:
        """
        Analyze image for conditions
        
        Args:
            image: PIL Image
            diagnosis_type: "skin", "eye", "tongue", or "nail"
        
        Returns:
            {
                "conditions": List[Dict],
                "confidence": float,
                "analysis_type": str
            }
        """
        try:
            # Preprocess image
            processed_image = self._preprocess_image(image)
            
            # Analyze based on type
            if diagnosis_type == "skin":
                conditions = await self._analyze_skin(processed_image)
            elif diagnosis_type == "eye":
                conditions = await self._analyze_eye(processed_image)
            elif diagnosis_type == "tongue":
                conditions = await self._analyze_tongue(processed_image)
            elif diagnosis_type == "nail":
                conditions = await self._analyze_nail(processed_image)
            else:
                conditions = []
            
            return {
                "conditions": conditions,
                "confidence": self._calculate_confidence(conditions),
                "analysis_type": diagnosis_type,
                "method": "ml" if ML_AVAILABLE and self.model_loaded else "rule_based"
            }
        
        except Exception as e:
            return {
                "conditions": [],
                "confidence": 0.0,
                "analysis_type": diagnosis_type,
                "error": str(e)
            }
    
    def _preprocess_image(self, image: Image.Image) -> np.ndarray:
        """Preprocess image for analysis"""
        # Resize to standard size
        target_size = (224, 224)
        image = image.resize(target_size, Image.Resampling.LANCZOS)
        
        # Convert to numpy array
        img_array = np.array(image)
        
        return img_array
    
    async def _analyze_skin(self, image: np.ndarray) -> List[Dict]:
        """Analyze skin conditions using trained ML model"""
        conditions = []
        
        # Use trained ML model if available
        if ML_AVAILABLE and self.model_loaded and self.skin_model is not None:
            try:
                # Convert numpy array to PIL Image
                pil_image = Image.fromarray(image.astype('uint8'))
                ml_result = await self._ml_predict_skin(pil_image)
                
                if ml_result:
                    condition_name = ml_result['name']
                    confidence = ml_result['confidence']
                    
                    # Get condition details from database
                    condition_details = self.condition_database.get('skin', {}).get(
                        condition_name.lower().replace(' ', '_'), {}
                    )
                    
                    conditions.append({
                        "name": condition_name,
                        "severity": condition_details.get('severity', 'mild'),
                        "confidence": confidence,
                        "description": condition_details.get('description', f'{condition_name} detected')
                    })
                    
                    return conditions
            except Exception as e:
                print(f"ML prediction error: {e}, falling back to rule-based")
        
        # Fallback to rule-based analysis
        red_channel = image[:, :, 0]
        if np.mean(red_channel) > 150:
            conditions.append({
                "name": "Skin Inflammation",
                "severity": "moderate",
                "confidence": 0.7,
                "description": "Redness detected indicating possible inflammation"
            })
        
        gray = np.mean(image, axis=2)
        if np.std(gray) > 30:
            conditions.append({
                "name": "Hyperpigmentation",
                "severity": "mild",
                "confidence": 0.6,
                "description": "Uneven skin tone detected"
            })
        
        if not conditions:
            conditions.append({
                "name": "Normal Skin",
                "severity": "none",
                "confidence": 0.5,
                "description": "No obvious abnormalities detected"
            })
        
        return conditions
    
    async def _ml_predict_skin(self, image: Image.Image) -> Optional[Dict]:
        """Use trained ML model to predict skin condition"""
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
                outputs = self.skin_model(img_tensor)
                probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
                confidence, predicted_idx = torch.max(probabilities, 0)
                
                confidence = confidence.item()
                predicted_idx = predicted_idx.item()
                
                # Get condition name from label mapping
                if self.skin_label_mapping and str(predicted_idx) in self.skin_label_mapping:
                    condition_name = self.skin_label_mapping[str(predicted_idx)]
                elif predicted_idx < len(self.skin_label_mapping):
                    condition_name = list(self.skin_label_mapping.values())[predicted_idx]
                else:
                    condition_name = "Unknown Condition"
                
                return {
                    "name": condition_name,
                    "confidence": confidence
                }
        except Exception as e:
            print(f"ML prediction error: {e}")
            return None
    
    async def _analyze_eye(self, image: np.ndarray) -> List[Dict]:
        """Analyze eye conditions"""
        conditions = []
        
        # Rule-based analysis
        # Check for yellowing (jaundice)
        yellow_intensity = np.mean(image[:, :, 1]) - np.mean(image[:, :, 0])
        if yellow_intensity > 20:
            conditions.append({
                "name": "Possible Jaundice",
                "severity": "severe",
                "confidence": 0.6,
                "description": "Yellowing detected - consult doctor immediately"
            })
        
        # Check for redness
        red_channel = image[:, :, 0]
        if np.mean(red_channel) > 140:
            conditions.append({
                "name": "Eye Redness",
                "severity": "mild",
                "confidence": 0.7,
                "description": "Redness detected indicating irritation"
            })
        
        if not conditions:
            conditions.append({
                "name": "Normal Eyes",
                "severity": "none",
                "confidence": 0.5,
                "description": "No obvious abnormalities detected"
            })
        
        return conditions
    
    async def _analyze_tongue(self, image: np.ndarray) -> List[Dict]:
        """Analyze tongue conditions"""
        conditions = []
        
        # Rule-based analysis
        # Check for white coating
        gray = np.mean(image, axis=2)
        if np.mean(gray) > 200:
            conditions.append({
                "name": "White Coating",
                "severity": "mild",
                "confidence": 0.7,
                "description": "White coating detected (Ama/toxins in Ayurveda)"
            })
        
        # Check for yellow coating
        yellow_channel = image[:, :, 1]
        if np.mean(yellow_channel) > np.mean(image[:, :, 0]) + 10:
            conditions.append({
                "name": "Yellow Coating",
                "severity": "moderate",
                "confidence": 0.6,
                "description": "Yellow coating indicating Pitta imbalance"
            })
        
        if not conditions:
            conditions.append({
                "name": "Normal Tongue",
                "severity": "none",
                "confidence": 0.5,
                "description": "No obvious abnormalities detected"
            })
        
        return conditions
    
    async def _analyze_nail(self, image: np.ndarray) -> List[Dict]:
        """Analyze nail conditions"""
        conditions = []
        
        # Rule-based analysis
        # Check for discoloration
        color_variance = np.std(image, axis=2)
        if np.mean(color_variance) > 25:
            conditions.append({
                "name": "Nail Discoloration",
                "severity": "moderate",
                "confidence": 0.6,
                "description": "Unusual color variations detected"
            })
        
        # Check for texture (ridges)
        gray = np.mean(image, axis=2)
        if np.std(gray) > 20:
            conditions.append({
                "name": "Nail Texture Changes",
                "severity": "mild",
                "confidence": 0.5,
                "description": "Possible ridges or texture changes"
            })
        
        if not conditions:
            conditions.append({
                "name": "Normal Nails",
                "severity": "none",
                "confidence": 0.5,
                "description": "No obvious abnormalities detected"
            })
        
        return conditions
    
    def _calculate_confidence(self, conditions: List[Dict]) -> float:
        """Calculate overall confidence score"""
        if not conditions:
            return 0.0
        
        confidences = [c.get('confidence', 0.5) for c in conditions]
        return sum(confidences) / len(confidences)
