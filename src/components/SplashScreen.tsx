import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingParticles from './FloatingParticles';
import SanskritMantras from './SanskritMantras';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [phase, setPhase] = useState<'intro' | 'message' | 'ready'>('intro');

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('message'), 1500);
    const timer2 = setTimeout(() => setPhase('ready'), 3500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-gradient-hero"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated Background Layers */}
        <div className="absolute inset-0 lotus-pattern opacity-30" />
        <div className="absolute inset-0 leaf-pattern" />

        {/* Floating Particles */}
        <FloatingParticles />

        {/* Sanskrit Mantras */}
        <SanskritMantras />

        {/* Central Glow */}
        <motion.div
          className="absolute w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(45 90% 55% / 0.3) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Main Content Container */}
        <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center">
          {/* Sacred Symbol / Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="mb-8"
          >
            <div className="relative">
              {/* Outer Ring */}
              <motion.div
                className="w-32 h-32 rounded-full border-2 border-sacred-gold/50"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              />

              {/* Inner Lotus Symbol */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="text-6xl"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  🪷
                </motion.div>
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-full animate-pulse-glow" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-display text-4xl md:text-5xl text-warm-white mb-4 tracking-wide sacred-text-glow"
          >
            धन्वंतरि
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="font-sacred text-xl md:text-2xl text-saffron-light mb-8 italic"
          >
            Visual Health Guidance System
          </motion.p>

          {/* Message Phase */}
          <AnimatePresence mode="wait">
            {phase === 'message' && (
              <motion.div
                key="message"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="glass-card px-8 py-4 mb-8"
              >
                <p className="text-warm-white/90 font-medium text-sm md:text-base tracking-widest">
                  NO CHEMICALS • NO INORGANIC PRODUCTS • PURE NATURE HEALING
                </p>
              </motion.div>
            )}

            {phase === 'ready' && (
              <motion.button
                key="cta"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={onComplete}
                className="btn-sacred group"
              >
                <span className="relative z-10 flex items-center gap-3 text-primary-foreground font-semibold">
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ✨
                  </motion.span>
                  Touch to Begin Natural Healing Journey
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                  >
                    🌿
                  </motion.span>
                </span>

                {/* Shimmer Effect */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  }}
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Loading Indicator */}
          {phase === 'intro' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2 mt-8"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-sacred-gold"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          )}
        </div>

        {/* Bottom Decoration */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{
            background: 'linear-gradient(to top, hsl(var(--herbal-dark)) 0%, transparent 100%)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;
