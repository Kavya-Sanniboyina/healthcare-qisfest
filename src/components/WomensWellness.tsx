import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Heart,
  Calendar,
  Moon,
  Flower2,
  Baby,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const features = [
  { 
    id: 'cycle', 
    icon: Calendar, 
    label: 'Cycle Tracking', 
    desc: 'Period prediction & symptom logging',
    color: 'from-pink-400 to-rose-400'
  },
  { 
    id: 'pcos', 
    icon: Flower2, 
    label: 'PCOS/PCOD Support', 
    desc: 'Natural management protocols',
    color: 'from-purple-400 to-pink-400'
  },
  { 
    id: 'pregnancy', 
    icon: Baby, 
    label: 'Pregnancy Care', 
    desc: 'Trimester-wise Ayurvedic guidance',
    color: 'from-amber-400 to-orange-400'
  },
  { 
    id: 'menopause', 
    icon: Moon, 
    label: 'Menopause Guide', 
    desc: 'Natural transition support',
    color: 'from-indigo-400 to-purple-400'
  },
];

const WomensWellness = () => {
  const navigate = useNavigate();

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
            onClick={() => navigate('/')}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          
          <div>
            <h1 className="font-display text-lg text-foreground">Devi Arogya</h1>
            <p className="text-xs text-muted-foreground">देवी आरोग्य — Women's Wellness Suite</p>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 rounded-2xl mb-8 text-center overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-lotus/20 to-saffron-light/20" />
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="relative z-10 text-5xl mb-4"
          >
            🌸
          </motion.div>
          <h2 className="font-display text-2xl text-foreground mb-2 relative z-10">
            Embrace Your Sacred Cycle
          </h2>
          <p className="text-muted-foreground font-sacred italic relative z-10">
            Ayurvedic wisdom for every phase of womanhood
          </p>
        </motion.div>

        {/* Privacy Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-2 mb-8 text-herbal"
        >
          <Shield className="w-4 h-4" />
          <span className="text-sm font-medium">All data stored locally & encrypted</span>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          {features.map((feature, i) => (
            <motion.button
              key={feature.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-card-hover p-5 rounded-2xl text-left"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-medium text-foreground mb-1">{feature.label}</h4>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </motion.button>
          ))}
        </motion.div>

        {/* Today's Insight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 rounded-2xl"
        >
          <h3 className="font-display text-lg text-foreground mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-lotus" />
            Daily Wellness Tip
          </h3>
          <p className="text-foreground leading-relaxed">
            🌿 <strong>Morning Ritual:</strong> Start your day with warm water infused with 
            soaked raisins and a pinch of saffron. This traditional remedy supports hormonal 
            balance and improves blood quality.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Recommended for: </span>
            <span className="text-xs bg-lotus/20 text-lotus px-2 py-1 rounded-full">Follicular Phase</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WomensWellness;
