"""
Ayurvedic Remedy Service
Provides natural remedies and treatments based on conditions
"""

from typing import Dict, List, Optional


class AyurvedicRemedyService:
    """Service for providing Ayurvedic remedies and recommendations"""
    
    def __init__(self):
        self.remedy_database = self._load_remedy_database()
        self.medicine_remedies = self._load_medicine_remedies()
    
    def _load_remedy_database(self) -> Dict:
        """Load Ayurvedic remedy database"""
        return {
            "skin": {
                "acne": [
                    {
                        "name": "Neem (Azadirachta indica)",
                        "usage": "Apply neem paste or use neem-based face wash daily",
                        "benefits": "Antibacterial, anti-inflammatory properties",
                        "preparation": "Mix neem powder with water to make paste"
                    },
                    {
                        "name": "Turmeric (Curcuma longa)",
                        "usage": "Apply turmeric paste with honey, leave for 15 minutes",
                        "benefits": "Reduces inflammation and prevents bacterial growth",
                        "preparation": "Mix 1 tsp turmeric with 1 tsp honey"
                    },
                    {
                        "name": "Aloe Vera",
                        "usage": "Apply fresh aloe vera gel directly on affected areas",
                        "benefits": "Soothes inflammation and promotes healing",
                        "preparation": "Extract gel from fresh aloe vera leaf"
                    }
                ],
                "dryness": [
                    {
                        "name": "Coconut Oil",
                        "usage": "Apply warm coconut oil before bath and at night",
                        "benefits": "Deep moisturization, maintains skin barrier",
                        "preparation": "Warm pure coconut oil slightly"
                    },
                    {
                        "name": "Ghee (Clarified Butter)",
                        "usage": "Massage with ghee, especially in winter",
                        "benefits": "Nourishes skin deeply, Vata balancing",
                        "preparation": "Use pure, organic ghee"
                    },
                    {
                        "name": "Sesame Oil",
                        "usage": "Apply sesame oil during Abhyanga (oil massage)",
                        "benefits": "Vata pacifying, deeply moisturizing",
                        "preparation": "Warm sesame oil before application"
                    }
                ],
                "eczema": [
                    {
                        "name": "Chandan (Sandalwood)",
                        "usage": "Apply sandalwood paste on affected areas",
                        "benefits": "Cooling, anti-inflammatory",
                        "preparation": "Mix sandalwood powder with rose water"
                    },
                    {
                        "name": "Manjistha (Rubia cordifolia)",
                        "usage": "Take internally and apply externally",
                        "benefits": "Blood purifier, reduces inflammation",
                        "preparation": "Decoction: 1 tsp in 2 cups water, boil"
                    }
                ],
                "hyperpigmentation": [
                    {
                        "name": "Kumkumadi Oil",
                        "usage": "Apply at night, massage gently",
                        "benefits": "Reduces dark spots, evens skin tone",
                        "preparation": "Ready-made oil available"
                    },
                    {
                        "name": "Lemon and Honey",
                        "usage": "Apply mixture, leave for 10 minutes, wash",
                        "benefits": "Natural bleaching, vitamin C",
                        "preparation": "Mix lemon juice with honey (1:1)"
                    }
                ]
            },
            "eye": {
                "conjunctivitis": [
                    {
                        "name": "Triphala Eye Wash",
                        "usage": "Wash eyes with Triphala decoction 2-3 times daily",
                        "benefits": "Antibacterial, anti-inflammatory",
                        "preparation": "1 tsp Triphala in 1 cup water, strain after cooling"
                    },
                    {
                        "name": "Rose Water",
                        "usage": "Apply 2-3 drops in each eye",
                        "benefits": "Cooling, soothing, reduces redness",
                        "preparation": "Use pure, organic rose water"
                    }
                ],
                "dry_eyes": [
                    {
                        "name": "Ghee (Nasya)",
                        "usage": "2 drops of ghee in each nostril (Nasya therapy)",
                        "benefits": "Lubricates eyes, Vata balancing",
                        "preparation": "Use medicated ghee or plain ghee"
                    },
                    {
                        "name": "Aloe Vera Eye Drops",
                        "usage": "Diluted aloe vera gel as eye drops",
                        "benefits": "Moisturizing, anti-inflammatory",
                        "preparation": "Dilute fresh aloe gel with distilled water (1:3)"
                    }
                ],
                "jaundice": [
                    {
                        "name": "Punarnava (Boerhavia diffusa)",
                        "usage": "Take decoction 2-3 times daily",
                        "benefits": "Liver support, diuretic",
                        "preparation": "1 tsp powder in 2 cups water, boil"
                    },
                    {
                        "name": "Bhumi Amla (Phyllanthus niruri)",
                        "usage": "Take fresh juice or powder",
                        "benefits": "Liver detoxification, hepatoprotective",
                        "preparation": "Fresh juice: 10-20ml, or 1-2g powder"
                    }
                ]
            },
            "tongue": {
                "white_coating": [
                    {
                        "name": "Tongue Scraping (Jihwa Prakshalana)",
                        "usage": "Scrape tongue daily with copper scraper",
                        "benefits": "Removes Ama (toxins), improves digestion",
                        "preparation": "Use copper tongue scraper, scrape 7-14 times"
                    },
                    {
                        "name": "Triphala",
                        "usage": "Take Triphala powder with warm water at night",
                        "benefits": "Detoxifies, improves digestion",
                        "preparation": "1 tsp Triphala in warm water"
                    }
                ],
                "yellow_coating": [
                    {
                        "name": "Amla (Indian Gooseberry)",
                        "usage": "Take Amla juice or powder",
                        "benefits": "Pitta pacifying, cooling",
                        "preparation": "Fresh juice: 20ml, or 1 tsp powder"
                    },
                    {
                        "name": "Coriander Water",
                        "usage": "Drink coriander seed water throughout day",
                        "benefits": "Cooling, Pitta balancing",
                        "preparation": "Soak 1 tsp coriander seeds overnight, drink water"
                    }
                ]
            },
            "nail": {
                "brittle_nails": [
                    {
                        "name": "Sesame Oil Massage",
                        "usage": "Massage nails and cuticles with warm sesame oil",
                        "benefits": "Strengthens nails, Vata balancing",
                        "preparation": "Warm pure sesame oil"
                    },
                    {
                        "name": "Amla and Bhringraj",
                        "usage": "Take internally and apply oil",
                        "benefits": "Nourishes hair and nails",
                        "preparation": "Amla powder: 1 tsp, Bhringraj oil: apply externally"
                    }
                ],
                "fungal_infection": [
                    {
                        "name": "Neem Oil",
                        "usage": "Apply neem oil on affected nails",
                        "benefits": "Antifungal, antibacterial",
                        "preparation": "Apply pure neem oil 2-3 times daily"
                    },
                    {
                        "name": "Turmeric Paste",
                        "usage": "Apply turmeric paste on nails",
                        "benefits": "Antifungal, anti-inflammatory",
                        "preparation": "Mix turmeric powder with water or coconut oil"
                    }
                ]
            }
        }
    
    def _load_medicine_remedies(self) -> Dict:
        """Load Ayurvedic alternatives for common medicines"""
        return {
            "paracetamol": [
                {
                    "name": "Guduchi (Tinospora cordifolia)",
                    "usage": "Take 1-2g powder with warm water for fever",
                    "benefits": "Natural antipyretic, immune booster",
                    "preparation": "1-2g powder in warm water, 2-3 times daily"
                },
                {
                    "name": "Tulsi (Holy Basil)",
                    "usage": "Drink Tulsi tea for fever and pain",
                    "benefits": "Antipyretic, analgesic properties",
                    "preparation": "Boil 10-15 leaves in 2 cups water, strain"
                }
            ],
            "ibuprofen": [
                {
                    "name": "Shallaki (Boswellia serrata)",
                    "usage": "Take 500mg-1g powder for inflammation",
                    "benefits": "Natural anti-inflammatory, pain relief",
                    "preparation": "500mg-1g powder with warm water, 2 times daily"
                },
                {
                    "name": "Turmeric and Ginger",
                    "usage": "Take turmeric-ginger decoction",
                    "benefits": "Anti-inflammatory, pain relief",
                    "preparation": "1 tsp each in 2 cups water, boil, add honey"
                }
            ],
            "amoxicillin": [
                {
                    "name": "Neem and Turmeric",
                    "usage": "Take neem-turmeric combination",
                    "benefits": "Natural antibacterial, immune support",
                    "preparation": "Neem powder 500mg + Turmeric 500mg, 2 times daily"
                },
                {
                    "name": "Garlic",
                    "usage": "Consume raw garlic or garlic supplements",
                    "benefits": "Natural antibiotic, antimicrobial",
                    "preparation": "2-3 cloves raw garlic daily, or supplements"
                }
            ]
        }
    
    def get_condition_remedies(
        self,
        condition_name: str,
        diagnosis_type: str
    ) -> List[Dict]:
        """Get Ayurvedic remedies for a specific condition"""
        remedies = []
        
        condition_lower = condition_name.lower()
        type_remedies = self.remedy_database.get(diagnosis_type, {})
        
        # Try exact match first
        for condition_key, condition_remedies in type_remedies.items():
            if condition_key.lower() in condition_lower or condition_lower in condition_key.lower():
                remedies.extend(condition_remedies)
        
        # If no match, return general remedies for the type
        if not remedies and diagnosis_type in self.remedy_database:
            # Return first condition's remedies as general guidance
            first_condition = list(type_remedies.values())[0] if type_remedies else []
            remedies.extend(first_condition[:2])  # Limit to 2 general remedies
        
        return remedies
    
    def get_medicine_remedies(
        self,
        medicine_name: str,
        category: str = "general"
    ) -> List[Dict]:
        """Get Ayurvedic alternatives for a medicine"""
        medicine_lower = medicine_name.lower()
        
        # Try exact match
        if medicine_lower in self.medicine_remedies:
            return self.medicine_remedies[medicine_lower]
        
        # Try partial match
        for med_key, remedies in self.medicine_remedies.items():
            if med_key in medicine_lower or medicine_lower in med_key:
                return remedies
        
        # Return general immune boosters if no match
        return [
            {
                "name": "Tulsi (Holy Basil)",
                "usage": "Daily consumption for overall health",
                "benefits": "Immune booster, adaptogen",
                "preparation": "Tea or fresh leaves"
            },
            {
                "name": "Ashwagandha",
                "usage": "Take 500mg-1g powder with warm milk",
                "benefits": "Stress relief, immune support",
                "preparation": "500mg-1g powder in warm milk at night"
            }
        ]
    
    def get_recommendations(
        self,
        conditions: List[Dict],
        diagnosis_type: str
    ) -> List[str]:
        """Get general recommendations based on conditions"""
        recommendations = []
        
        if not conditions:
            return ["No specific recommendations. Maintain healthy lifestyle."]
        
        # General recommendations based on type
        if diagnosis_type == "skin":
            recommendations.extend([
                "Maintain proper hydration - drink 8-10 glasses of water daily",
                "Follow a Pitta-pacifying diet (cooling foods, avoid spicy)",
                "Practice daily Abhyanga (oil massage) with suitable oils",
                "Avoid excessive sun exposure, use natural sun protection"
            ])
        elif diagnosis_type == "eye":
            recommendations.extend([
                "Practice Trataka (gazing meditation) for eye health",
                "Reduce screen time, take regular breaks",
                "Apply cool compress with rose water",
                "Ensure adequate sleep (7-8 hours)"
            ])
        elif diagnosis_type == "tongue":
            recommendations.extend([
                "Practice daily tongue scraping (Jihwa Prakshalana)",
                "Improve digestion with proper meal timing",
                "Avoid incompatible food combinations",
                "Consider Panchakarma for deep detoxification"
            ])
        elif diagnosis_type == "nail":
            recommendations.extend([
                "Maintain proper nail hygiene",
                "Include calcium and protein in diet",
                "Massage nails with warm oil regularly",
                "Avoid harsh chemicals and excessive water exposure"
            ])
        
        # Add severity-based recommendations
        severe_conditions = [c for c in conditions if c.get('severity') == 'severe']
        if severe_conditions:
            recommendations.insert(0, "⚠️ IMPORTANT: Consult a qualified Ayurvedic Vaidya or medical doctor immediately for severe conditions.")
        
        return recommendations
