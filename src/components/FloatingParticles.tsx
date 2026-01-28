import { motion } from 'framer-motion';
import { useMemo } from 'react';

const FloatingParticles = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 15 + Math.random() * 10,
      size: 4 + Math.random() * 8,
      type: Math.random() > 0.5 ? 'leaf' : 'glow',
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            width: particle.size,
            height: particle.size,
          }}
          initial={{ y: '100vh', opacity: 0, rotate: 0 }}
          animate={{
            y: '-100vh',
            opacity: [0, 1, 1, 0],
            rotate: 720,
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'linear',
          }}
        >
          {particle.type === 'leaf' ? (
            <span className="text-herbal-light/60 text-lg">🍃</span>
          ) : (
            <div
              className="w-full h-full rounded-full"
              style={{
                background: 'radial-gradient(circle, hsl(45 90% 55% / 0.6) 0%, transparent 70%)',
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingParticles;
