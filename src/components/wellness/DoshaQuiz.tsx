import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';

interface DoshaResult {
  vata: number;
  pitta: number;
  kapha: number;
  primary: 'vata' | 'pitta' | 'kapha';
  secondary: 'vata' | 'pitta' | 'kapha' | null;
}

const QUESTIONS = [
  {
    id: 1,
    question: 'What is your body frame like?',
    questionHi: 'आपके शरीर की बनावट कैसी है?',
    options: [
      { text: 'Thin, light, hard to gain weight', dosha: 'vata' },
      { text: 'Medium build, muscular', dosha: 'pitta' },
      { text: 'Large frame, gains weight easily', dosha: 'kapha' },
    ],
  },
  {
    id: 2,
    question: 'How is your skin type?',
    questionHi: 'आपकी त्वचा कैसी है?',
    options: [
      { text: 'Dry, rough, cool to touch', dosha: 'vata' },
      { text: 'Warm, oily, prone to redness', dosha: 'pitta' },
      { text: 'Thick, smooth, cool and moist', dosha: 'kapha' },
    ],
  },
  {
    id: 3,
    question: 'How would you describe your appetite?',
    questionHi: 'आपकी भूख कैसी है?',
    options: [
      { text: 'Variable, sometimes forget to eat', dosha: 'vata' },
      { text: 'Strong, irritable if I miss meals', dosha: 'pitta' },
      { text: 'Steady, can skip meals easily', dosha: 'kapha' },
    ],
  },
  {
    id: 4,
    question: 'How do you handle stress?',
    questionHi: 'आप तनाव को कैसे संभालते हैं?',
    options: [
      { text: 'Anxious, worried, restless', dosha: 'vata' },
      { text: 'Angry, irritable, impatient', dosha: 'pitta' },
      { text: 'Calm initially, then withdrawn', dosha: 'kapha' },
    ],
  },
  {
    id: 5,
    question: 'How is your sleep pattern?',
    questionHi: 'आपकी नींद कैसी है?',
    options: [
      { text: 'Light, interrupted, hard to fall asleep', dosha: 'vata' },
      { text: 'Moderate, wake up easily if disturbed', dosha: 'pitta' },
      { text: 'Deep, heavy, hard to wake up', dosha: 'kapha' },
    ],
  },
  {
    id: 6,
    question: 'What is your preferred climate?',
    questionHi: 'आपको कौन सा मौसम पसंद है?',
    options: [
      { text: 'Warm, humid weather', dosha: 'vata' },
      { text: 'Cool, well-ventilated', dosha: 'pitta' },
      { text: 'Warm and dry', dosha: 'kapha' },
    ],
  },
  {
    id: 7,
    question: 'How would you describe your memory?',
    questionHi: 'आपकी याददाश्त कैसी है?',
    options: [
      { text: 'Quick to learn, quick to forget', dosha: 'vata' },
      { text: 'Sharp, focused, good recall', dosha: 'pitta' },
      { text: 'Slow to learn, never forgets', dosha: 'kapha' },
    ],
  },
  {
    id: 8,
    question: 'How do you make decisions?',
    questionHi: 'आप निर्णय कैसे लेते हैं?',
    options: [
      { text: 'Quickly but may change mind', dosha: 'vata' },
      { text: 'Logical, analytical approach', dosha: 'pitta' },
      { text: 'Slowly, after much thought', dosha: 'kapha' },
    ],
  },
];

interface DoshaQuizProps {
  onComplete: (result: DoshaResult) => void;
}

const DoshaQuiz = ({ onComplete }: DoshaQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 'vata' | 'pitta' | 'kapha'>>({});

  const handleAnswer = (dosha: 'vata' | 'pitta' | 'kapha') => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: dosha }));
  };

  const nextQuestion = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateResult();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateResult = () => {
    const scores = { vata: 0, pitta: 0, kapha: 0 };
    
    Object.values(answers).forEach(dosha => {
      scores[dosha]++;
    });

    const total = QUESTIONS.length;
    const result: DoshaResult = {
      vata: Math.round((scores.vata / total) * 100),
      pitta: Math.round((scores.pitta / total) * 100),
      kapha: Math.round((scores.kapha / total) * 100),
      primary: 'vata',
      secondary: null,
    };

    // Determine primary and secondary doshas
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]) as ['vata' | 'pitta' | 'kapha', number][];
    result.primary = sorted[0][0];
    
    if (sorted[1][1] > 0 && sorted[1][1] >= sorted[0][1] * 0.5) {
      result.secondary = sorted[1][0];
    }

    onComplete(result);
  };

  const question = QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Question {currentQuestion + 1} of {QUESTIONS.length}</span>
          <span className="text-primary font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-saffron to-sacred-gold"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <div>
            <h3 className="font-display text-xl text-foreground mb-1">
              {question.question}
            </h3>
            <p className="text-sm text-muted-foreground font-sacred italic">
              {question.questionHi}
            </p>
          </div>

          <div className="space-y-3">
            {question.options.map((option, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleAnswer(option.dosha as 'vata' | 'pitta' | 'kapha')}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  answers[currentQuestion] === option.dosha
                    ? 'bg-gradient-to-r from-saffron/20 to-sacred-gold/20 border-2 border-saffron'
                    : 'glass-card hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    answers[currentQuestion] === option.dosha
                      ? 'border-saffron bg-saffron'
                      : 'border-muted-foreground'
                  }`}>
                    {answers[currentQuestion] === option.dosha && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="text-foreground">{option.text}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-4">
        <button
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
          className="flex-1 py-3 rounded-xl glass-card hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>
        <button
          onClick={nextQuestion}
          disabled={!answers[currentQuestion]}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-saffron to-sacred-gold text-herbal-dark font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {currentQuestion === QUESTIONS.length - 1 ? 'See Results' : 'Next'}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default DoshaQuiz;
