import { motion } from 'framer-motion';
import { ChevronRight, LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Feature {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  path: string;
}

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

const FeatureCard = ({ feature, index }: FeatureCardProps) => {
  const navigate = useNavigate();
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8 }}
      onClick={() => navigate(feature.path)}
      className="glass-card-hover group cursor-pointer overflow-hidden"
    >
      {/* Gradient Header */}
      <div className={`h-2 bg-gradient-to-r ${feature.gradient}`} />
      
      <div className="p-6">
        {/* Icon */}
        <motion.div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
        >
          <Icon className="w-7 h-7 text-white" />
        </motion.div>

        {/* Content */}
        <div className="mb-4">
          <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">
            {feature.subtitle}
          </p>
          <h3 className="font-display text-xl text-foreground mb-2">
            {feature.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {feature.description}
          </p>
        </div>

        {/* Action */}
        <div className="flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all">
          <span>Explore</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5`} />
      </div>
    </motion.div>
  );
};

export default FeatureCard;
