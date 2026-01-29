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
    <div className="w-full space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-foreground">Herb Garden</h1>
          <p className="text-muted-foreground">Interactive 3D Exploration & AR Identification</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* 3D Garden Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl mb-8 overflow-hidden"
        >
          <div className="h-[400px] bg-gradient-to-br from-herbal-dark to-herbal relative flex items-center justify-center">
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                y: [0, -10, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-9xl filter drop-shadow-2xl"
            >
              🌿
            </motion.div>
            <div className="absolute bottom-8 left-0 right-0 flex justify-center">
              <div className="glass-card px-6 py-3 rounded-full flex items-center gap-3">
                <span className="animate-pulse bg-green-500 w-2 h-2 rounded-full"></span>
                <p className="text-sm font-medium text-warm-white">
                  3D Interactive Garden Active
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search & AR - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-6 mb-8"
        >
          <div className="flex-1 glass-card rounded-2xl flex items-center gap-4 px-6 py-2">
            <Search className="w-6 h-6 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search medicinal herbs..."
              className="flex-1 py-4 bg-transparent border-none outline-none text-foreground text-lg placeholder:text-muted-foreground/50"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-card p-4 rounded-2xl flex items-center justify-center gap-3 min-w-[200px] hover:bg-herbal/10 transition-colors"
          >
            <Camera className="w-6 h-6 text-herbal" />
            <span className="font-bold text-foreground">AR Identify</span>
          </motion.button>
        </motion.div>

        {/* Herb Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-xl text-foreground">Sacred Herbs Library</h3>
            <button className="text-primary hover:underline">View All</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {herbs.map((herb, i) => (
              <motion.button
                key={herb.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="glass-card-hover p-6 rounded-2xl text-left group h-full flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{herb.emoji}</span>
                  <Info className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h4 className="font-bold text-lg text-foreground mb-1">{herb.name}</h4>
                <p className="text-xs text-herbal font-sacred mb-2 bg-herbal/10 self-start px-2 py-1 rounded">{herb.sanskrit}</p>
                <p className="text-sm text-muted-foreground mt-auto line-clamp-2">{herb.benefit}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HerbGarden;
