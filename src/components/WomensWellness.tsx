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
    <div className="w-full space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-foreground">Devi Arogya</h1>
          <p className="text-muted-foreground">देवी आरोग्य — Women's Wellness Suite</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-10 rounded-3xl text-center overflow-hidden relative flex flex-col items-center justify-center min-h-[300px]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-lotus/20 to-saffron-light/20" />
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="relative z-10 text-6xl mb-6"
          >
            🌸
          </motion.div>
          <h2 className="font-display text-4xl text-foreground mb-4 relative z-10">
            Embrace Your Sacred Cycle
          </h2>
          <p className="text-muted-foreground font-sacred italic text-xl relative z-10 max-w-2xl">
            Ayurvedic wisdom for every phase of womanhood
          </p>
        </motion.div>

        {/* Features Grid */}
        <div>
          <h3 className="font-display text-xl text-foreground mb-6">Wellness Modules</h3>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, i) => (
              <motion.button
                key={feature.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="glass-card-hover p-6 rounded-2xl text-left h-full flex flex-col"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-display text-lg text-foreground mb-2">{feature.label}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Privacy Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-2 text-herbal py-6 bg-herbal/5 rounded-2xl"
        >
          <Shield className="w-5 h-5" />
          <span className="text-base font-medium">All sensitive health data is stored locally & encrypted</span>
        </motion.div>
      </div>
    </div>
  );
};

export default WomensWellness;
