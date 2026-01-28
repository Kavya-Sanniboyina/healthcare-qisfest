// Comprehensive Medicine Database with Safety Levels and Ayurvedic Alternatives
export interface MedicineEntry {
  id: string;
  englishName: string;
  aliases: string[];
  category: string;
  commonUses: string;
  severity: 'mild' | 'moderate' | 'severe';
  ayurvedicAlternatives?: {
    name: string;
    benefit: string;
    usage: string;
  }[];
  warnings: string[];
  disclaimer?: string;
}

export const medicineDatabase: MedicineEntry[] = [
  // PAIN RELIEF
  {
    id: 'paracetamol',
    englishName: 'Paracetamol / Acetaminophen',
    aliases: ['crocin', 'tylenol', 'paracetamol', 'acetaminophen'],
    category: 'Pain Relief / Fever Reducer',
    commonUses: 'Commonly used for mild to moderate headache, body pain, or fever.',
    severity: 'mild',
    ayurvedicAlternatives: [
      {
        name: 'Ginger Tea',
        benefit: 'Reduces fever and body ache naturally',
        usage: '1 cup twice daily, add honey and tulsi'
      },
      {
        name: 'Tulsi + Honey',
        benefit: 'Boosts immunity and reduces fever',
        usage: '5-7 leaves with 1 teaspoon raw honey, 2-3 times daily'
      },
      {
        name: 'Turmeric Milk (Golden Milk)',
        benefit: 'Anti-inflammatory, reduces pain',
        usage: '1 glass warm milk with 1/4 teaspoon turmeric, once daily'
      },
      {
        name: 'Cumin Water',
        benefit: 'Helps with headache and body pain',
        usage: '1 glass water with 1/2 teaspoon roasted cumin, 2-3 times daily'
      }
    ],
    warnings: ['Do not use for severe pain', 'Consult doctor if fever persists beyond 3 days']
  },

  {
    id: 'ibuprofen',
    englishName: 'Ibuprofen / Brufen / Combiflam',
    aliases: ['ibuprofen', 'brufen', 'combiflam', 'aspirin'],
    category: 'Pain Relief / Anti-inflammatory',
    commonUses: 'Used for moderate pain, joint pain, or inflammation.',
    severity: 'moderate',
    ayurvedicAlternatives: [
      {
        name: 'Ginger + Turmeric Paste',
        benefit: 'Powerful anti-inflammatory',
        usage: 'Mix equal parts ginger-turmeric powder with honey, 1 teaspoon daily'
      },
      {
        name: 'Ashwagandha (Withania)',
        benefit: 'Reduces inflammation and stress-related pain',
        usage: '500mg powder twice daily with warm milk'
      },
      {
        name: 'Neem Oil Massage',
        benefit: 'Topical relief for joint and muscle pain',
        usage: 'Warm neem oil massage on affected area, 1-2 times daily'
      }
    ],
    warnings: ['Not for severe arthritis', 'Avoid if stomach issues present', 'Consult for prolonged pain']
  },

  // FEVER & COLD
  {
    id: 'cough-syrup',
    englishName: 'Cough Syrup / Dextromethorphan',
    aliases: ['cough syrup', 'dextromethorphan', 'mucinex', 'robitussin'],
    category: 'Cold & Cough',
    commonUses: 'Used for mild to moderate dry cough or respiratory congestion.',
    severity: 'mild',
    ayurvedicAlternatives: [
      {
        name: 'Honey + Ginger',
        benefit: 'Natural cough suppressant and soothes throat',
        usage: '1 teaspoon raw honey with ginger juice, 3-4 times daily'
      },
      {
        name: 'Tulsi Tea',
        benefit: 'Clears chest congestion and boosts immunity',
        usage: '5-7 fresh tulsi leaves in hot water, 2-3 cups daily'
      },
      {
        name: 'Licorice (Mulethi) Powder',
        benefit: 'Soothes throat and reduces cough',
        usage: '1/4 teaspoon with honey, 2-3 times daily'
      }
    ],
    warnings: ['If cough persists beyond 2 weeks, seek medical advice', 'Not for asthma or respiratory disorders']
  },

  // ALLERGIES
  {
    id: 'cetirizine',
    englishName: 'Cetirizine / Allegra / Histamine Blocker',
    aliases: ['cetirizine', 'allegra', 'allergy medicine', 'antihistamine'],
    category: 'Anti-allergic',
    commonUses: 'Used for mild seasonal allergies, itching, or allergic reactions.',
    severity: 'mild',
    ayurvedicAlternatives: [
      {
        name: 'Neem Leaves',
        benefit: 'Natural anti-allergenic properties',
        usage: '5-7 neem leaves boiled in water, drink warm, once daily'
      },
      {
        name: 'Turmeric Water',
        benefit: 'Reduces allergy-related inflammation',
        usage: '1/4 teaspoon turmeric in warm water, twice daily'
      },
      {
        name: 'Mint (Pudina) Tea',
        benefit: 'Cooling and antihistamine',
        usage: '10-15 fresh mint leaves in hot water, 2-3 cups daily'
      }
    ],
    warnings: ['If allergic swelling occurs, seek emergency care', 'Not suitable for severe allergic reactions']
  },

  // DIGESTION
  {
    id: 'omeprazole',
    englishName: 'Omeprazole / Acid Reflux Medicine',
    aliases: ['omeprazole', 'prilosec', 'antacid', 'acid reflux', 'gastro medicine'],
    category: 'Digestion Aid',
    commonUses: 'Used for mild acidity, heartburn, or occasional stomach upset.',
    severity: 'mild',
    ayurvedicAlternatives: [
      {
        name: 'Cumin + Coriander Water',
        benefit: 'Balances stomach acid naturally',
        usage: 'Mix equal parts cumin & coriander seeds in water, sip warm'
      },
      {
        name: 'Fennel (Saunf) Seeds',
        benefit: 'Reduces bloating and acidity',
        usage: '1/2 teaspoon fennel seeds chewed after meals'
      },
      {
        name: 'Aloe Vera Juice',
        benefit: 'Soothes stomach lining',
        usage: '30ml pure aloe juice, once daily in morning (consult first)'
      }
    ],
    warnings: ['If stomach pain is severe, consult doctor', 'Not for chronic acid reflux']
  },

  // ANTIBIOTICS - SEVERE (Safety Block)
  {
    id: 'antibiotic-amoxicillin',
    englishName: 'Amoxicillin / Antibiotic',
    aliases: ['amoxicillin', 'antibiotic', 'ampicillin', 'infection medicine'],
    category: 'Antibiotic - Requires Medical Supervision',
    commonUses: 'Prescribed for bacterial infections.',
    severity: 'severe',
    warnings: [
      'CRITICAL: This is a prescription antibiotic',
      'Do NOT use without doctor\'s guidance',
      'Improper use leads to antibiotic resistance'
    ],
    disclaimer: '⚠️ CRITICAL SAFETY NOTICE\n\nYour condition appears to require prescribed antibiotic treatment.\n\nAyurvedic alternatives are NOT recommended at this stage.\n\nPlease:\n✓ Follow your doctor\'s prescription\n✓ Complete the full course\n✓ Consult a healthcare professional'
  },

  // SKIN OINTMENTS - MILD
  {
    id: 'savlon',
    englishName: 'Savlon / Antiseptic Ointment',
    aliases: ['savlon', 'betadine', 'antiseptic', 'wound cream'],
    category: 'Skin Ointment / Antiseptic',
    commonUses: 'Used for minor cuts, scrapes, or small wounds.',
    severity: 'mild',
    ayurvedicAlternatives: [
      {
        name: 'Neem Oil',
        benefit: 'Natural antiseptic and healing',
        usage: 'Apply directly on clean wound, 2-3 times daily'
      },
      {
        name: 'Turmeric Paste',
        benefit: 'Antiseptic and reduces infection risk',
        usage: 'Mix turmeric with coconut oil, apply thin layer on wound'
      },
      {
        name: 'Honey (Raw)',
        benefit: 'Natural antibiotic with healing properties',
        usage: 'Apply directly on clean wound, cover with sterile cloth'
      }
    ],
    warnings: ['Not for deep wounds or burns', 'If infection develops, seek medical care']
  },

  // DIABETES MEDICATION - SEVERE (Safety Block)
  {
    id: 'metformin',
    englishName: 'Metformin / Diabetes Medicine',
    aliases: ['metformin', 'diabetes', 'blood sugar', 'glucophage'],
    category: 'Chronic Disease Medicine - Requires Medical Supervision',
    commonUses: 'Prescribed for managing blood sugar levels.',
    severity: 'severe',
    warnings: [
      'CRITICAL: This is a prescribed chronic disease medicine',
      'Must be taken under doctor\'s guidance',
      'Never stop without medical consultation'
    ],
    disclaimer: '⚠️ CRITICAL SAFETY NOTICE\n\nYour condition requires proper medical management.\n\nAyurvedic alternatives are NOT recommended as a replacement.\n\nPlease:\n✓ Continue your prescribed medication\n✓ Consult your endocrinologist\n✓ Maintain regular check-ups\n\nAyurvedic practices can COMPLEMENT (not replace) your treatment with doctor\'s approval.'
  }
];

export function getMedicineData(medicineName: string): MedicineEntry | null {
  const normalizedName = medicineName.toLowerCase().trim();
  
  return medicineDatabase.find(medicine => 
    medicine.englishName.toLowerCase().includes(normalizedName) ||
    medicine.aliases.some(alias => alias.includes(normalizedName))
  ) || null;
}

export function getMedicinesByCategory(category: string): MedicineEntry[] {
  return medicineDatabase.filter(medicine => 
    medicine.category.toLowerCase().includes(category.toLowerCase())
  );
}
