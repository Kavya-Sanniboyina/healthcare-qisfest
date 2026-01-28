import { useState } from 'react';
import { motion } from 'framer-motion';
import { Scale, Ruler, Calculator } from 'lucide-react';

interface BMIResult {
  bmi: number;
  category: string;
  ayurvedicAdvice: string;
  color: string;
}

interface BMICalculatorProps {
  onResult?: (result: BMIResult) => void;
}

const BMICalculator = ({ onResult }: BMICalculatorProps) => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [result, setResult] = useState<BMIResult | null>(null);

  const calculateBMI = () => {
    const heightM = parseFloat(height) / 100;
    const weightKg = parseFloat(weight);
    
    if (!heightM || !weightKg || heightM <= 0 || weightKg <= 0) return;
    
    const bmi = weightKg / (heightM * heightM);
    
    let category: string;
    let ayurvedicAdvice: string;
    let color: string;
    
    if (bmi < 18.5) {
      category = 'Underweight';
      color = 'text-blue-500';
      ayurvedicAdvice = 'Focus on Vata-pacifying diet with warm, nourishing foods. Include ghee, milk, almonds, and dates. Practice gentle yoga and avoid fasting.';
    } else if (bmi < 25) {
      category = 'Normal Weight';
      color = 'text-herbal';
      ayurvedicAdvice = 'Maintain balance with seasonal eating (Ritucharya). Practice regular Pranayama and moderate exercise. Follow your dosha-specific diet.';
    } else if (bmi < 30) {
      category = 'Overweight';
      color = 'text-saffron';
      ayurvedicAdvice = 'Follow Kapha-pacifying diet with light, warm, spicy foods. Reduce sweet and oily items. Practice Surya Namaskar and brisk walking.';
    } else {
      category = 'Obese';
      color = 'text-destructive';
      ayurvedicAdvice = 'Consider Panchakarma detox therapy. Strict Kapha-reducing diet with fasting days. Practice vigorous yoga and consult an Ayurvedic physician.';
    }

    const bmiResult: BMIResult = {
      bmi: Math.round(bmi * 10) / 10,
      category,
      ayurvedicAdvice,
      color,
    };
    
    setResult(bmiResult);
    onResult?.(bmiResult);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Height */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Ruler className="w-4 h-4 text-primary" />
            Height (cm)
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="170"
            className="input-sacred"
          />
        </div>

        {/* Weight */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Scale className="w-4 h-4 text-primary" />
            Weight (kg)
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="70"
            className="input-sacred"
          />
        </div>

        {/* Age */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            🎂 Age (years)
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="30"
            className="input-sacred"
          />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={calculateBMI}
        disabled={!height || !weight}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-saffron to-sacred-gold text-herbal-dark font-medium flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Calculator className="w-5 h-5" />
        Calculate BMI
      </motion.button>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 rounded-2xl space-y-4"
        >
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Your BMI</p>
            <p className={`text-5xl font-display ${result.color}`}>{result.bmi}</p>
            <p className={`text-lg font-medium ${result.color}`}>{result.category}</p>
          </div>

          {/* BMI Scale */}
          <div className="relative h-4 rounded-full bg-gradient-to-r from-blue-400 via-herbal via-50% via-saffron to-destructive overflow-hidden">
            <motion.div
              initial={{ left: 0 }}
              animate={{ left: `${Math.min(Math.max((result.bmi - 15) / 25 * 100, 0), 100)}%` }}
              className="absolute top-0 w-1 h-full bg-white shadow-lg"
              style={{ transform: 'translateX(-50%)' }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>15</span>
            <span>18.5</span>
            <span>25</span>
            <span>30</span>
            <span>40</span>
          </div>

          {/* Ayurvedic Advice */}
          <div className="p-4 rounded-xl bg-herbal/10 border border-herbal/20">
            <p className="text-sm font-medium text-herbal mb-2 flex items-center gap-2">
              🌿 Ayurvedic Recommendation
            </p>
            <p className="text-sm text-foreground">{result.ayurvedicAdvice}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BMICalculator;
