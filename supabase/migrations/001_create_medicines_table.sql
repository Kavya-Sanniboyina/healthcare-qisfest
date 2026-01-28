-- Medicine Intelligence Database Schema for Supabase
-- This SQL script creates the medicines table with Ayurvedic remedy data

-- Create medicines table
CREATE TABLE IF NOT EXISTS medicines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  english_name VARCHAR(255) NOT NULL UNIQUE,
  generic_name VARCHAR(255),
  category VARCHAR(100),
  composition TEXT,
  uses TEXT[] DEFAULT '{}',
  causes TEXT[] DEFAULT '{}',
  warnings TEXT[] DEFAULT '{}',
  home_remedies TEXT[] DEFAULT '{}',
  
  -- Ayurvedic Alternatives
  ayurvedic_internal TEXT[] DEFAULT '{}',
  ayurvedic_external TEXT[] DEFAULT '{}',
  ayurvedic_lifestyle TEXT[] DEFAULT '{}',
  ayurvedic_herbs TEXT[] DEFAULT '{}',
  
  has_ayurvedic_remedy BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_medicines_english_name 
ON medicines(english_name);

CREATE INDEX IF NOT EXISTS idx_medicines_generic_name 
ON medicines(generic_name);

CREATE INDEX IF NOT EXISTS idx_medicines_has_remedy 
ON medicines(has_ayurvedic_remedy);

-- Insert sample medicine data
INSERT INTO medicines (
  english_name, generic_name, category, composition, uses, causes, warnings,
  home_remedies, ayurvedic_internal, ayurvedic_external, ayurvedic_lifestyle,
  ayurvedic_herbs, has_ayurvedic_remedy
) VALUES
(
  'Paracetamol (Crocin/Dolo)',
  'Acetaminophen',
  'Antipyretic',
  'Paracetamol 500mg',
  ARRAY['Fever relief', 'Pain management', 'Headache', 'Cold symptoms'],
  ARRAY['Fever/High temperature (Jwar)', 'Headache and body aches', 'Common cold symptoms', 'Post-vaccine fever'],
  ARRAY['Do not exceed 4g per day', 'Avoid with liver conditions', 'Not safe with alcohol', 'Consult doctor if fever persists > 3 days'],
  ARRAY['Turmeric milk with honey', 'Tulsi leaves with ginger', 'Coriander water', 'Neem leaves decoction'],
  ARRAY['Turmeric milk (Haldi doodh) - 1 cup for fever', 'Mahasudarshan Churna - 1/2 teaspoon with water', 'Sudarshan Ghanvati - 2 tablets twice daily'],
  ARRAY['Cold compress on forehead with rose water', 'Tulsi leaves on tongue', 'Sandalwood paste on chest'],
  ARRAY['Rest in cool, dark room for 7-8 hours', 'Stay hydrated with warm water & honey', 'Light food like khichdi'],
  ARRAY['Neem - detoxifying', 'Tulsi - immune booster', 'Turmeric - anti-inflammatory', 'Coriander - cooling'],
  true
),
(
  'Aspirin (Disprin/Ecosprin)',
  'Acetylsalicylic acid',
  'NSAID/Antiplatelet',
  'Aspirin 75-500mg',
  ARRAY['Heart health', 'Blood clot prevention', 'Pain relief', 'Anti-inflammatory'],
  ARRAY['Heart health maintenance', 'Blood clot prevention', 'Migraine'],
  ARRAY['Do not stop without doctor consultation', 'Avoid mixing with other blood thinners', 'Risk of GI bleeding'],
  ARRAY['Turmeric + Black Pepper + Milk', 'Garlic + Honey mixture', 'Ginger tea with honey'],
  ARRAY['Turmeric with Black Pepper - 1/4 teaspoon thrice daily', 'Arjuna Churna - 1 teaspoon twice daily', 'Guggulu preparations'],
  ARRAY['Ginger-turmeric paste on affected areas', 'Warm sesame oil massage', 'Lemon and salt compress'],
  ARRAY['Daily 30-45 minute brisk walking', 'Yoga: Shavasana, Ujjayi Pranayama', 'Mediterranean diet', 'Avoid excess salt and sugar'],
  ARRAY['Turmeric - anti-inflammatory', 'Ginger - blood circulation', 'Arjuna - cardiac tonic', 'Garlic - heart health'],
  true
),
(
  'Omeprazole (Omez/Ocid)',
  'Omeprazole',
  'Proton Pump Inhibitor',
  'Omeprazole 20-40mg',
  ARRAY['Acidity relief', 'GERD treatment', 'Ulcer prevention', 'Gastritis'],
  ARRAY['Acidity & GERD', 'Acid reflux & heartburn', 'Peptic ulcer', 'Indigestion'],
  ARRAY['Long-term use affects B12 absorption', 'May cause magnesium deficiency', 'Consult doctor before stopping'],
  ARRAY['Buttermilk with black salt', 'Banana + Jaggery', 'Milk with honey', 'Fennel seeds water'],
  ARRAY['Mulethi powder - 1/2 teaspoon twice daily', 'Shatavari Churna - 1 teaspoon with milk', 'Amalaki powder - 1 teaspoon daily'],
  ARRAY['Castor oil massage on abdomen', 'Sesame oil warm massage', 'Aloe Vera gel consumption'],
  ARRAY['Eat smaller meals 4-5 times daily', 'Avoid spicy and fried foods', 'Sleep on left side after meals'],
  ARRAY['Licorice - mucous protection', 'Amla - antacid', 'Shatavari - digestive support', 'Fennel - digestion'],
  true
),
(
  'Metformin (Glycomet/Glucophage)',
  'Metformin',
  'Antidiabetic',
  'Metformin 500-1000mg',
  ARRAY['Type 2 Diabetes', 'Blood sugar regulation', 'PCOS management', 'Metabolic syndrome'],
  ARRAY['Type 2 Diabetes', 'Insulin resistance', 'Pre-diabetes', 'PCOS'],
  ARRAY['Allergic reactions possible', 'May cause diarrhea', 'Complete full course', 'Take probiotics if diarrhea occurs'],
  ARRAY['Bitter melon juice - 30ml daily', 'Fenugreek seeds powder', 'Cinnamon water', 'Turmeric with honey'],
  ARRAY['Bitter Melon juice - 30ml daily', 'Fenugreek seeds powder - 1 teaspoon', 'Gurmar leaves', 'Ashwagandha - 1 teaspoon twice daily'],
  ARRAY['Mustard oil massage', 'Dry brushing for lymphatic support', 'Neem oil application'],
  ARRAY['Daily 45-60 minute exercise', 'Yoga: Surya Namaskar, Bhujangasana', 'Low glycemic diet', 'Regular meal timings'],
  ARRAY['Bitter Melon - blood sugar', 'Fenugreek - insulin production', 'Cinnamon - glucose metabolism', 'Ashwagandha - hormones'],
  true
),
(
  'Ibuprofen (Brufen/Combiflam)',
  'Ibuprofen',
  'NSAID',
  'Ibuprofen 200-400mg',
  ARRAY['Joint pain relief', 'Arthritis', 'Menstrual cramps', 'Fever', 'Headache'],
  ARRAY['Joint pain & arthritis', 'Muscle aches', 'Menstrual cramps', 'Inflammation'],
  ARRAY['May cause GI bleeding', 'Risk of kidney damage', 'Avoid with other NSAIDs'],
  ARRAY['Turmeric + Ginger + Milk', 'Warm sesame oil massage', 'Ginger compress on joints'],
  ARRAY['Turmeric + Ginger + Black Pepper - 1/4 tsp thrice daily', 'Guggulu + Ashwagandha', 'Brahmi Vati'],
  ARRAY['Warm sesame oil massage on joints', 'Ginger-turmeric paste compress', 'Neem oil massage'],
  ARRAY['Daily 30-minute gentle yoga', 'Heat therapy on joints', 'Anti-inflammatory diet'],
  ARRAY['Turmeric - anti-inflammatory', 'Ginger - pain relief', 'Ashwagandha - joint support', 'Guggulu - mobility'],
  true
),
(
  'Amoxicillin (Amoxcillin/Moxillin)',
  'Amoxicillin',
  'Antibiotic',
  'Amoxicillin 250-500mg',
  ARRAY['Bacterial infections', 'Respiratory tract infection', 'Ear infection', 'Throat infection'],
  ARRAY['Bacterial infections', 'Respiratory tract infection', 'Ear infection', 'Skin infections'],
  ARRAY['Allergic reactions possible', 'Avoid if penicillin allergy', 'May cause diarrhea', 'Complete full course'],
  ARRAY['Turmeric milk with honey', 'Neem leaves decoction', 'Garlic + Honey', 'Ginger-turmeric tea'],
  ARRAY['Turmeric milk with honey - 2-3 times daily', 'Neem leaves decoction', 'Giloy juice for immunity'],
  ARRAY['Neem oil on affected areas', 'Turmeric paste on skin infections', 'Aloe Vera gel'],
  ARRAY['Rest and adequate sleep', 'Eat immune-boosting foods', 'Avoid cold and raw foods'],
  ARRAY['Neem - antibiotic', 'Turmeric - antimicrobial', 'Giloy - immunity', 'Garlic - infection fighter'],
  true
)
ON CONFLICT (english_name) DO NOTHING;

-- Create view for easier queries
CREATE OR REPLACE VIEW medicines_with_ayurveda AS
SELECT 
  id,
  english_name,
  generic_name,
  category,
  composition,
  uses,
  causes,
  warnings,
  home_remedies,
  json_build_object(
    'internal', ayurvedic_internal,
    'external', ayurvedic_external,
    'lifestyle', ayurvedic_lifestyle,
    'herbs', ayurvedic_herbs
  ) as ayurvedic_alternatives,
  has_ayurvedic_remedy,
  created_at
FROM medicines;

-- Enable RLS (Row Level Security)
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access to medicines"
ON medicines FOR SELECT
USING (true);

-- Grant permissions
GRANT SELECT ON medicines TO anon;
GRANT SELECT ON medicines_with_ayurveda TO anon;
