import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Leaf,
  Search,
  Camera,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const herbs = [
  { name: 'Tulsi', sanskrit: 'तुलसी', benefit: 'Immunity & Respiratory', emoji: '🌿' },
  { name: 'Ashwagandha', sanskrit: 'अश्वगंधा', benefit: 'Stress & Vitality', emoji: '🌱' },
  { name: 'Turmeric', sanskrit: 'हरिद्रा', benefit: 'Anti-inflammatory', emoji: '🧡' },
  { name: 'Brahmi', sanskrit: 'ब्राह्मी', benefit: 'Memory & Focus', emoji: '🧠' },
  { name: 'Neem', sanskrit: 'निम्ब', benefit: 'Skin & Detox', emoji: '🍃' },
  { name: 'Amla', sanskrit: 'आमलकी', benefit: 'Vitamin C & Hair', emoji: '🫒' },
];

const HerbGarden = () => {
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
            <h1 className="font-display text-lg text-foreground">Herb Garden</h1>
            <p className="text-xs text-muted-foreground">Interactive 3D Exploration</p>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {/* 3D Garden Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl mb-8 overflow-hidden"
        >
          <div className="h-64 bg-gradient-to-br from-herbal-dark to-herbal relative flex items-center justify-center">
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                y: [0, -10, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-8xl"
            >
              🌿
            </motion.div>
            <div className="absolute bottom-4 left-4 right-4 glass-card p-3 rounded-xl">
              <p className="text-sm text-center text-warm-white">
                🔮 3D Interactive Garden • Tap herbs to explore
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search & AR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-4 mb-8"
        >
          <div className="flex-1 glass-card rounded-xl flex items-center gap-3 px-4">
            <Search className="w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search herbs..."
              className="flex-1 py-3 bg-transparent border-none outline-none text-foreground"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-card p-3 rounded-xl flex items-center gap-2"
          >
            <Camera className="w-5 h-5 text-herbal" />
            <span className="text-sm font-medium text-foreground hidden sm:inline">AR Identify</span>
          </motion.button>
        </motion.div>

        {/* Herb Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-display text-lg text-foreground mb-4">Sacred Herbs</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {herbs.map((herb, i) => (
              <motion.button
                key={herb.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="glass-card-hover p-4 rounded-2xl text-left group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{herb.emoji}</span>
                  <Info className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h4 className="font-medium text-foreground">{herb.name}</h4>
                <p className="text-xs text-herbal font-sacred">{herb.sanskrit}</p>
                <p className="text-xs text-muted-foreground mt-1">{herb.benefit}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Coming Soon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 glass-card p-6 rounded-2xl text-center"
        >
          <Leaf className="w-8 h-8 text-herbal mx-auto mb-3" />
          <h4 className="font-display text-lg text-foreground mb-2">Coming Soon</h4>
          <p className="text-sm text-muted-foreground">
            Full 3D garden with Three.js visualization, AR herb identification, 
            and interactive growing guides.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default HerbGarden;
