import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Activity,
  Calendar,
  Target,
  Flame,
  Droplets,
  Wind,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DoshaQuiz from './wellness/DoshaQuiz';
import BMICalculator from './wellness/BMICalculator';
import DietChart from './wellness/DietChart';
import ProgressTracker from './wellness/ProgressTracker';

interface DoshaResult {
  vata: number;
  pitta: number;
  kapha: number;
  primary: 'vata' | 'pitta' | 'kapha';
  secondary: 'vata' | 'pitta' | 'kapha' | null;
}

const doshaTypes = [
  {
    name: 'Vata',
    icon: Wind,
    color: 'from-blue-400 to-purple-400',
    element: 'Air + Space',
    traits: 'Creative, Quick, Adaptable'
  },
  {
    name: 'Pitta',
    icon: Flame,
    color: 'from-orange-400 to-red-400',
    element: 'Fire + Water',
    traits: 'Focused, Determined, Intense'
  },
  {
    name: 'Kapha',
    icon: Droplets,
    color: 'from-green-400 to-teal-400',
    element: 'Earth + Water',
    traits: 'Calm, Steady, Nurturing'
  },
];

type ViewMode = 'home' | 'quiz' | 'bmi' | 'diet' | 'progress';

const WellnessPortal = () => {
  const navigate = useNavigate();
  const [programDuration, setProgramDuration] = useState<30 | 90>(30);
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [doshaResult, setDoshaResult] = useState<DoshaResult | null>(null);
  const [programStarted, setProgramStarted] = useState(false);

  const handleDoshaComplete = (result: DoshaResult) => {
    setDoshaResult(result);
    setViewMode('home');
  };

  const handleStartProgram = () => {
    if (!doshaResult) {
      setViewMode('quiz');
    } else {
      setProgramStarted(true);
      setViewMode('progress');
    }
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'quiz':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-6 rounded-2xl"
          >
            <button
              onClick={() => setViewMode('home')}
              className="flex items-center gap-2 text-sm text-muted-foreground mb-6 hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h2 className="font-display text-2xl text-foreground mb-6 text-center">
              Discover Your Dosha
            </h2>
            <DoshaQuiz onComplete={handleDoshaComplete} />
          </motion.div>
        );

      case 'bmi':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-6 rounded-2xl"
          >
            <button
              onClick={() => setViewMode('home')}
              className="flex items-center gap-2 text-sm text-muted-foreground mb-6 hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h2 className="font-display text-2xl text-foreground mb-6 text-center">
              BMI Calculator
            </h2>
            <BMICalculator />
          </motion.div>
        );

      case 'diet':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-6 rounded-2xl"
          >
            <button
              onClick={() => setViewMode('home')}
              className="flex items-center gap-2 text-sm text-muted-foreground mb-6 hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <DietChart dosha={doshaResult?.primary || 'vata'} />
          </motion.div>
        );

      case 'progress':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <button
              onClick={() => setViewMode('home')}
              className="flex items-center gap-2 text-sm text-muted-foreground mb-6 hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Overview
            </button>
            <ProgressTracker programDays={programDuration} />
          </motion.div>
        );

      default:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Hero Card */}
            <div className="glass-card p-8 rounded-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-saffron/20 to-herbal/20" />
              <div className="relative z-10 max-w-2xl">
                <h2 className="font-display text-3xl text-foreground mb-2">
                  Begin Your Transformation
                </h2>
                <p className="text-muted-foreground mb-8 font-sacred italic text-lg">
                  "शुद्धि" — Purification of body, mind, and spirit
                </p>

                {/* Duration Toggle */}
                <div className="flex gap-4 mb-8 max-w-md">
                  {[30, 90].map((days) => (
                    <button
                      key={days}
                      onClick={() => setProgramDuration(days as 30 | 90)}
                      className={`flex-1 py-3 rounded-xl font-medium transition-all ${programDuration === days
                        ? 'bg-gradient-to-r from-saffron to-sacred-gold text-herbal-dark shadow-lg'
                        : 'glass-card text-foreground'
                        }`}
                    >
                      {days}-Day Program
                    </button>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStartProgram}
                  className="px-8 py-3 btn-sacred text-lg"
                >
                  {doshaResult ? 'Continue Program' : 'Start Free Assessment'}
                </motion.button>
              </div>
            </div>

            {/* Dosha Result - Full Width if present */}
            {doshaResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-8 rounded-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-2xl text-foreground flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-sacred-gold" />
                    Your Dosha Profile
                  </h3>
                  <button
                    onClick={() => setViewMode('quiz')}
                    className="text-primary hover:underline"
                  >
                    Retake Quiz
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {(['vata', 'pitta', 'kapha'] as const).map((dosha) => {
                    const type = doshaTypes.find(d => d.name.toLowerCase() === dosha)!;
                    const isPrimary = doshaResult.primary === dosha;
                    const isSecondary = doshaResult.secondary === dosha;

                    return (
                      <div
                        key={dosha}
                        className={`p-6 rounded-2xl text-center ${isPrimary
                          ? 'bg-gradient-to-br from-saffron/20 to-sacred-gold/20 border-2 border-saffron'
                          : isSecondary
                            ? 'bg-muted/50 border border-primary/30'
                            : 'bg-muted/30'
                          }`}
                      >
                        <type.icon className={`w-8 h-8 mx-auto mb-3 ${isPrimary ? 'text-saffron' : 'text-muted-foreground'}`} />
                        <p className="font-display text-2xl text-foreground">{doshaResult[dosha]}%</p>
                        <p className="text-sm text-muted-foreground capitalize mb-2">{dosha}</p>
                        {isPrimary && (
                          <span className="text-xs bg-saffron/10 text-saffron font-bold px-3 py-1 rounded-full uppercase tracking-wider">Primary</span>
                        )}
                        {isSecondary && (
                          <span className="text-xs bg-primary/10 text-primary font-bold px-3 py-1 rounded-full uppercase tracking-wider">Secondary</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setViewMode('diet')}
                    className="py-3 px-6 rounded-xl glass-card hover:border-primary/50 transition-colors flex items-center gap-2"
                  >
                    View Your Personalized Diet Chart
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Action Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setViewMode('quiz')}
                className="glass-card-hover p-6 rounded-2xl text-left flex flex-col items-start h-full"
              >
                <div className="p-3 bg-primary/10 rounded-xl mb-4 text-primary">
                  <Wind className="w-6 h-6" />
                </div>
                <h4 className="font-display text-lg text-foreground mb-1">Dosha Quiz</h4>
                <p className="text-sm text-muted-foreground mt-auto">Discover your constitution</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setViewMode('bmi')}
                className="glass-card-hover p-6 rounded-2xl text-left flex flex-col items-start h-full"
              >
                <div className="p-3 bg-herbal/10 rounded-xl mb-4 text-herbal">
                  <Activity className="w-6 h-6" />
                </div>
                <h4 className="font-display text-lg text-foreground mb-1">BMI Calculator</h4>
                <p className="text-sm text-muted-foreground mt-auto">Check your body metrics</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => doshaResult ? setViewMode('diet') : setViewMode('quiz')}
                className="glass-card-hover p-6 rounded-2xl text-left flex flex-col items-start h-full"
              >
                <div className="p-3 bg-saffron/10 rounded-xl mb-4 text-saffron">
                  <Calendar className="w-6 h-6" />
                </div>
                <h4 className="font-display text-lg text-foreground mb-1">Diet Chart</h4>
                <p className="text-sm text-muted-foreground mt-auto">
                  {doshaResult ? 'View your plan' : 'Complete quiz first'}
                </p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setViewMode('progress')}
                className="glass-card-hover p-6 rounded-2xl text-left flex flex-col items-start h-full"
              >
                <div className="p-3 bg-lotus/10 rounded-xl mb-4 text-lotus">
                  <Target className="w-6 h-6" />
                </div>
                <h4 className="font-display text-lg text-foreground mb-1">Progress</h4>
                <p className="text-sm text-muted-foreground mt-auto">Track your journey</p>
              </motion.button>
            </div>

            {/* Dosha Discovery Info (Show if no result) */}
            {!doshaResult && (
              <div className="space-y-4">
                <h3 className="font-display text-xl text-foreground">Discover Your Dosha</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {doshaTypes.map((dosha, i) => (
                    <motion.div
                      key={dosha.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="glass-card-hover p-6 rounded-2xl text-center"
                    >
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${dosha.color} flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                        <dosha.icon className="w-10 h-10 text-white" />
                      </div>
                      <h4 className="font-display text-2xl text-foreground mb-2">{dosha.name}</h4>
                      <p className="text-sm font-medium text-primary mb-3">{dosha.element}</p>
                      <p className="text-muted-foreground leading-relaxed">{dosha.traits}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        );
    }
  };

  return (
    <div className="w-full space-y-6">
      {viewMode === 'home' && (
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="font-display text-3xl text-foreground">Shuddhi Programs</h1>
            <p className="text-muted-foreground">Personal Transformation Portal</p>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>
    </div>
  );
};

// ... Update renderContent 'home' case to use full width grids
/* 
    Updated Home View Structure:
    - Hero Card (unchanged but wider)
    - Action Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
    - Dosha Discovery: grid-cols-3
    - Program Features: grid-cols-4
*/

export default WellnessPortal;
