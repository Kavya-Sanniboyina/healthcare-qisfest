import { motion } from 'framer-motion';
import { useMemo } from 'react';

const mantras = [
  'ॐ धन्वंतराय नमः',
  'आरोग्यं परमं भाग्यं',
  'सर्वे भवन्तु सुखिनः',
  'ॐ शान्तिः शान्तिः शान्तिः',
  'आयुर्वेद',
  'प्रकृति',
  'स्वास्थ्य',
  'जीवन',
];

const SanskritMantras = () => {
  const floatingMantras = useMemo(() => {
    return mantras.map((text, i) => ({
      id: i,
      text,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      delay: i * 0.5,
      duration: 20 + Math.random() * 10,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {floatingMantras.map((mantra) => (
        <motion.div
          key={mantra.id}
          className="absolute font-sacred text-lg md:text-xl text-sacred-gold/20"
          style={{
            left: `${mantra.x}%`,
            top: `${mantra.y}%`,
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.3, 0.3, 0],
            y: [0, -50, -100],
            x: [0, Math.sin(mantra.id) * 30],
          }}
          transition={{
            duration: mantra.duration,
            repeat: Infinity,
            delay: mantra.delay,
            ease: 'easeInOut',
          }}
        >
          {mantra.text}
        </motion.div>
      ))}
    </div>
  );
};

export default SanskritMantras;
