import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Pill, 
  Eye, 
  User, 
  Heart, 
  Leaf,
  Sparkles,
  Camera,
  ChevronRight
} from 'lucide-react';
import FeatureCard from './FeatureCard';

const features = [
  {
    id: 'dhanvantari',
    title: 'Dhanvantari AI',
    subtitle: 'Sacred Health Guide',
    description: 'Multimodal AI assistant for natural healing guidance',
    icon: MessageCircle,
    gradient: 'from-saffron to-sacred-gold',
    path: '/chat',
  },
  {
    id: 'scanner',
    title: 'Medicine Scanner',
    subtitle: 'Camera AI',
    description: 'Scan medicine packages to get usage & causes',
    icon: Camera,
    gradient: 'from-saffron-light to-saffron',
    path: '/converter',
  },
  {
    id: 'diagnosis',
    title: 'Visual Diagnosis',
    subtitle: 'AI Analysis',
    description: 'On-device analysis for skin, eyes, tongue & more',
    icon: Eye,
    gradient: 'from-lotus to-lotus-light',
    path: '/diagnosis',
  },
  {
    id: 'transformation',
    title: 'Shuddhi Programs',
    subtitle: 'Personal Wellness',
    description: '30/90-day transformation with dosha analysis',
    icon: User,
    gradient: 'from-earth to-saffron-dark',
    path: '/wellness',
  },
  {
    id: 'women',
    title: 'Devi Arogya',
    subtitle: "Women's Wellness",
    description: 'Complete menstrual, PCOS & pregnancy support',
    icon: Heart,
    gradient: 'from-lotus to-saffron-light',
    path: '/women',
  },
  {
    id: 'herbs',
    title: 'Herb Garden',
    subtitle: '3D Experience',
    description: 'Interactive herb exploration with AR identification',
    icon: Leaf,
    gradient: 'from-herbal-dark to-herbal',
    path: '/herbs',
  },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-nature leaf-pattern">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 glass-card border-b border-border/50"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-3xl"
            >
              🪷
            </motion.div>
            <div>
              <h1 className="font-display text-xl text-foreground">धन्वंतरि</h1>
              <p className="text-xs text-muted-foreground">Pure Nature Healing</p>
            </div>
          </div>
          
          <button className="btn-glass flex items-center gap-2 text-sm">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Profile</span>
          </button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-6"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <Sparkles className="w-4 h-4 text-sacred-gold" />
            <span className="text-sm font-medium text-foreground">
              100% Natural • Offline-First • Privacy-Protected
            </span>
          </motion.div>
          
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Your Journey to
            <span className="block mt-2 bg-gradient-to-r from-saffron via-sacred-gold to-herbal bg-clip-text text-transparent">
              Holistic Wellness
            </span>
          </h2>
          
          <p className="font-sacred text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto italic">
            "आरोग्यं परमं भाग्यं" — Health is the greatest blessing
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>
      </section>

      {/* Quick Access Bar */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="container mx-auto px-4 pb-8"
      >
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg text-foreground">Quick Start</h3>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { emoji: '🍵', label: 'Home Remedies' },
              { emoji: '🧘', label: 'Pranayama' },
              { emoji: '🌿', label: 'Herbs Guide' },
              { emoji: '📊', label: 'Dosha Quiz' },
            ].map((item, i) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="glass-card-hover p-4 rounded-xl flex flex-col items-center gap-2 text-center"
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-sm font-medium text-foreground">{item.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center">
        <p className="text-sm text-muted-foreground">
          ⚠️ For educational purposes only. Not a substitute for professional medical advice.
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
