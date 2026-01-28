import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Globe, X } from 'lucide-react';
import { useVoiceInput, INDIAN_LANGUAGES, LanguageCode } from '@/hooks/useVoiceInput';

interface VoiceInputButtonProps {
  onResult: (transcript: string) => void;
  className?: string;
}

const VoiceInputButton = ({ onResult, className = '' }: VoiceInputButtonProps) => {
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    isListening,
    isSupported,
    transcript,
    selectedLanguage,
    setSelectedLanguage,
    toggleListening,
  } = useVoiceInput({
    onResult: (text) => {
      onResult(text);
      setError(null);
    },
    onError: (err) => {
      setError(err);
      setTimeout(() => setError(null), 3000);
    },
  });

  const currentLang = INDIAN_LANGUAGES.find(l => l.code === selectedLanguage);

  if (!isSupported) {
    return (
      <button
        className={`p-3 rounded-full glass-card opacity-50 cursor-not-allowed ${className}`}
        title="Voice input not supported in this browser"
      >
        <MicOff className="w-5 h-5 text-muted-foreground" />
      </button>
    );
  }

  return (
    <div className="relative">
      {/* Main Button */}
      <div className="flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleListening}
          className={`p-3 rounded-full transition-all ${
            isListening
              ? 'bg-destructive text-white animate-pulse'
              : 'glass-card hover:border-primary/50'
          } ${className}`}
        >
          <Mic className="w-5 h-5" />
        </motion.button>
        
        {/* Language Selector Toggle */}
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value as LanguageCode)}
          className="px-4 py-2.5 rounded-lg glass-card border-2 border-primary bg-gradient-to-r from-saffron/10 to-sacred-gold/10 font-semibold text-sm text-foreground cursor-pointer hover:border-primary transition-all shadow-md"
          style={{ appearance: 'none' }}
        >
          {INDIAN_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.nativeName}
            </option>
          ))}
        </select>
      </div>

      {/* Listening Indicator */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-0 mb-2 glass-card p-3 rounded-xl min-w-[200px]"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [8, 16, 8] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                    className="w-1 bg-destructive rounded-full"
                  />
                ))}
              </div>
              <span className="text-sm text-foreground">Listening in {currentLang?.name}...</span>
            </div>
            {transcript && (
              <p className="text-sm text-muted-foreground italic">"{transcript}"</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-0 mb-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceInputButton;
