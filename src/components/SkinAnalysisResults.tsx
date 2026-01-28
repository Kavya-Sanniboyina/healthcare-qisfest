import { motion } from 'framer-motion';
import { X, AlertTriangle, Leaf, Heart, Droplets, Wind } from 'lucide-react';
import { SkinCondition } from '../hooks/useSkinDiagnosis';

interface SkinAnalysisResultsProps {
  conditions: SkinCondition[];
  onClose: () => void;
}

const SkinAnalysisResults = ({ conditions, onClose }: SkinAnalysisResultsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl text-foreground">Skin Analysis Results</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-muted rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Results for each condition */}
      <div className="space-y-6">
        {conditions.map((condition, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-6 rounded-2xl border border-herbal/30"
          >
            {/* Condition Title */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-display text-xl text-foreground">{condition.condition}</h3>
                <div className="flex items-center gap-3 mt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      condition.severity === 'severe'
                        ? 'bg-destructive/20 text-destructive'
                        : condition.severity === 'moderate'
                          ? 'bg-yellow-500/20 text-yellow-700'
                          : 'bg-green-500/20 text-green-700'
                    }`}
                  >
                    {condition.severity.charAt(0).toUpperCase() + condition.severity.slice(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Confidence: {(condition.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Causes */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.1 + 0.1 }}
              className="mb-6"
            >
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-herbal" />
                Root Causes
              </h4>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                {condition.causes.map((cause, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-herbal mt-1">•</span>
                    <span className="text-sm text-muted-foreground">{cause}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Ayurvedic Remedies */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.1 + 0.2 }}
              className="mb-6"
            >
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Leaf className="w-4 h-4 text-herbal" />
                Ayurvedic Treatment Plan
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Internal Remedies */}
                <div className="bg-gradient-to-br from-herbal/10 to-herbal/5 rounded-xl p-4">
                  <h5 className="font-semibold text-foreground mb-3 text-sm">Internal Remedies</h5>
                  <ul className="space-y-2">
                    {condition.ayurvedicRemedies.internal.map((remedy, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="text-herbal mt-0.5">→</span>
                        <span>{remedy}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* External Remedies */}
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl p-4">
                  <h5 className="font-semibold text-foreground mb-3 text-sm">External Treatments</h5>
                  <ul className="space-y-2">
                    {condition.ayurvedicRemedies.external.map((remedy, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">→</span>
                        <span>{remedy}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Lifestyle Changes */}
                <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 rounded-xl p-4">
                  <h5 className="font-semibold text-foreground mb-3 text-sm">Lifestyle Changes</h5>
                  <ul className="space-y-2">
                    {condition.ayurvedicRemedies.lifestyle.map((change, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="text-amber-600 mt-0.5">→</span>
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Healing Herbs */}
                <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl p-4">
                  <h5 className="font-semibold text-foreground mb-3 text-sm">Healing Herbs</h5>
                  <ul className="space-y-2">
                    {condition.ayurvedicRemedies.herbs.map((herb, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>{herb}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Warnings */}
            {condition.warnings.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.1 + 0.3 }}
                className="bg-destructive/10 border border-destructive/30 rounded-lg p-4"
              >
                <h5 className="font-semibold text-destructive mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Important Precautions
                </h5>
                <ul className="space-y-1">
                  {condition.warnings.map((warning, i) => (
                    <li key={i} className="text-xs text-destructive/80">
                      • {warning}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Acne Specific Info */}
            {condition.acneSpecific && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.1 + 0.4 }}
                className="mt-4 bg-purple-500/10 border border-purple-500/30 rounded-lg p-4"
              >
                <h5 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-purple-600" />
                  Dosha Analysis
                </h5>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Acne Type</p>
                    <p className="text-sm text-foreground capitalize">
                      {condition.acneSpecific.type} Acne
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Primary Doshas</p>
                    <p className="text-sm text-foreground">{condition.acneSpecific.doshas.join(', ')}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      Balancing Strategy
                    </p>
                    <p className="text-sm text-foreground">{condition.acneSpecific.dohaBalance}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* General Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6 rounded-2xl border border-herbal/30 mt-6"
      >
        <h3 className="font-display text-lg text-foreground mb-4">General Wellness Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Droplets className="w-5 h-5 text-herbal flex-shrink-0 mt-1" />
            <div>
              <p className="font-medium text-foreground text-sm">Hydration</p>
              <p className="text-xs text-muted-foreground">Drink 3-4 liters of warm water daily</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Wind className="w-5 h-5 text-herbal flex-shrink-0 mt-1" />
            <div>
              <p className="font-medium text-foreground text-sm">Stress Management</p>
              <p className="text-xs text-muted-foreground">Practice meditation and pranayama daily</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Heart className="w-5 h-5 text-herbal flex-shrink-0 mt-1" />
            <div>
              <p className="font-medium text-foreground text-sm">Sleep Quality</p>
              <p className="text-xs text-muted-foreground">Sleep 7-8 hours between 10 PM - 6 AM</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Leaf className="w-5 h-5 text-herbal flex-shrink-0 mt-1" />
            <div>
              <p className="font-medium text-foreground text-sm">Nutrition</p>
              <p className="text-xs text-muted-foreground">Avoid processed foods and excess sugar</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
      >
        <p className="text-xs text-destructive/80">
          ⚠️ <strong>Disclaimer:</strong> This analysis is for educational purposes only. It does not
          replace professional medical or Ayurvedic consultation. For severe conditions, consult a
          qualified Ayurvedic Vaidya or medical doctor immediately.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default SkinAnalysisResults;
