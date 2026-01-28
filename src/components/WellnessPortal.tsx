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
            className="space-y-6"
          >
            {/* Hero Card */}
            <div className="glass-card p-6 rounded-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-saffron/20 to-herbal/20" />
              <div className="relative z-10">
                <h2 className="font-display text-2xl text-foreground mb-2">
                  Begin Your Transformation
                </h2>
                <p className="text-muted-foreground mb-6 font-sacred italic">
                  "शुद्धि" — Purification of body, mind, and spirit
                </p>
                
                {/* Duration Toggle */}
                <div className="flex gap-4 mb-6">
                  {[30, 90].map((days) => (
                    <button
                      key={days}
                      onClick={() => setProgramDuration(days as 30 | 90)}
                      className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                        programDuration === days
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
                  className="w-full btn-sacred"
                >
                  {doshaResult ? 'Continue Program' : 'Start Free Assessment'}
                </motion.button>
              </div>
            </div>

            {/* Dosha Result */}
            {doshaResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-6 rounded-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-lg text-foreground flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-sacred-gold" />
                    Your Dosha Profile
                  </h3>
                  <button
                    onClick={() => setViewMode('quiz')}
                    className="text-sm text-primary hover:underline"
                  >
                    Retake Quiz
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {(['vata', 'pitta', 'kapha'] as const).map((dosha) => {
                    const type = doshaTypes.find(d => d.name.toLowerCase() === dosha)!;
                    const isPrimary = doshaResult.primary === dosha;
                    const isSecondary = doshaResult.secondary === dosha;
                    
                    return (
                      <div
                        key={dosha}
                        className={`p-4 rounded-xl text-center ${
                          isPrimary
                            ? 'bg-gradient-to-br from-saffron/20 to-sacred-gold/20 border-2 border-saffron'
                            : isSecondary
                            ? 'bg-muted/50 border border-primary/30'
                            : 'bg-muted/30'
                        }`}
                      >
                        <type.icon className={`w-6 h-6 mx-auto mb-2 ${isPrimary ? 'text-saffron' : 'text-muted-foreground'}`} />
                        <p className="font-display text-xl text-foreground">{doshaResult[dosha]}%</p>
                        <p className="text-xs text-muted-foreground capitalize">{dosha}</p>
                        {isPrimary && (
                          <span className="text-xs text-saffron font-medium">Primary</span>
                        )}
                        {isSecondary && (
                          <span className="text-xs text-primary font-medium">Secondary</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => setViewMode('diet')}
                  className="w-full py-3 rounded-xl glass-card hover:border-primary/50 transition-colors flex items-center justify-center gap-2"
                >
                  View Your Personalized Diet Chart
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* Action Cards */}
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setViewMode('quiz')}
                className="glass-card-hover p-5 rounded-2xl text-left"
              >
                <Wind className="w-8 h-8 text-primary mb-3" />
                <h4 className="font-display text-foreground mb-1">Dosha Quiz</h4>
                <p className="text-xs text-muted-foreground">Discover your constitution</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setViewMode('bmi')}
                className="glass-card-hover p-5 rounded-2xl text-left"
              >
                <Activity className="w-8 h-8 text-herbal mb-3" />
                <h4 className="font-display text-foreground mb-1">BMI Calculator</h4>
                <p className="text-xs text-muted-foreground">Check your body metrics</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => doshaResult ? setViewMode('diet') : setViewMode('quiz')}
                className="glass-card-hover p-5 rounded-2xl text-left"
              >
                <Calendar className="w-8 h-8 text-saffron mb-3" />
                <h4 className="font-display text-foreground mb-1">Diet Chart</h4>
                <p className="text-xs text-muted-foreground">
                  {doshaResult ? 'View your plan' : 'Complete quiz first'}
                </p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setViewMode('progress')}
                className="glass-card-hover p-5 rounded-2xl text-left"
              >
                <Target className="w-8 h-8 text-lotus mb-3" />
                <h4 className="font-display text-foreground mb-1">Progress</h4>
                <p className="text-xs text-muted-foreground">Track your journey</p>
              </motion.button>
            </div>

            {/* Dosha Discovery (if no result) */}
            {!doshaResult && (
              <div>
                <h3 className="font-display text-lg text-foreground mb-4">Discover Your Dosha</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {doshaTypes.map((dosha, i) => (
                    <motion.div
                      key={dosha.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="glass-card-hover p-5 rounded-2xl text-center"
                    >
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${dosha.color} flex items-center justify-center mx-auto mb-4`}>
                        <dosha.icon className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="font-display text-xl text-foreground mb-1">{dosha.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{dosha.element}</p>
                      <p className="text-sm text-foreground">{dosha.traits}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Program Features */}
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="font-display text-lg text-foreground mb-4">What's Included</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Activity, label: 'BMI & Body Analysis' },
                  { icon: Calendar, label: 'Daily Schedule' },
                  { icon: Target, label: 'Goal Tracking' },
                  { icon: User, label: 'Progress Photos' },
                ].map((feature) => (
                  <div key={feature.label} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                    <feature.icon className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-foreground">{feature.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: '10K+', label: 'Transformations' },
                { value: '4.9★', label: 'User Rating' },
                { value: '100%', label: 'Natural' },
              ].map((stat) => (
                <div key={stat.label} className="glass-card p-4 rounded-xl text-center">
                  <p className="font-display text-2xl text-primary">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-nature">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 glass-card border-b border-border/50"
      >
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => viewMode === 'home' ? navigate('/') : setViewMode('home')}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          
          <div>
            <h1 className="font-display text-lg text-foreground">Shuddhi Programs</h1>
            <p className="text-xs text-muted-foreground">Personal Transformation Portal</p>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WellnessPortal;
