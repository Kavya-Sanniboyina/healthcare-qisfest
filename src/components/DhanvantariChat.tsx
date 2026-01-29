import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Send,
  Camera,
  Sparkles,
  Volume2,
  Loader2,
  VolumeX,
  Globe,
  X,
  Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDhanvantariChat } from '@/hooks/useDhanvantariChat';
import VoiceInputButton from './VoiceInputButton';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
  { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
];

const suggestions = [
  '🤒 I have a headache',
  '😴 Can\'t sleep well',
  '🍵 Home remedy for cold',
  '🧘 Breathing exercises',
  '🌿 Herbs for immunity',
];

const DhanvantariChat = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const { messages, isLoading, sendMessage } = useDhanvantariChat(selectedLanguage);
  const [input, setInput] = useState('');
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text: string = input) => {
    if (!text.trim() || isLoading) return;
    sendMessage(text);
    setInput('');
  };

  const handleVoiceResult = (transcript: string) => {
    setInput(transcript);
    // Auto-send after voice input
    setTimeout(() => {
      if (transcript.trim()) {
        sendMessage(transcript);
        setInput('');
      }
    }, 500);
  };

  // Open camera for text scanning
  const openCameraForScan = async () => {
    try {
      setIsCameraOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      setIsCameraOpen(false);
    }
  };

  // Close camera
  const closeCameraForScan = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  // Capture frame and extract text using OCR
  const captureAndExtractText = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsScanning(true);
    try {
      const context = canvasRef.current.getContext('2d');
      if (!context) return;

      // Draw video frame to canvas with higher resolution
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);

      // Get image data and apply preprocessing
      const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
      const data = imageData.data;

      // Enhance image: increase contrast and brightness for better OCR
      for (let i = 0; i < data.length; i += 4) {
        // Apply contrast and brightness adjustment
        const brightness = 1.15; // Increase brightness
        const contrast = 1.4;    // Increase contrast

        let r = data[i] * contrast * brightness;
        let g = data[i + 1] * contrast * brightness;
        let b = data[i + 2] * contrast * brightness;

        // Clamp values
        data[i] = Math.min(255, Math.max(0, r));
        data[i + 1] = Math.min(255, Math.max(0, g));
        data[i + 2] = Math.min(255, Math.max(0, b));
      }

      context.putImageData(imageData, 0, 0);

      // Convert to high-quality image
      const enhancedImage = canvasRef.current.toDataURL('image/png', 1.0);

      // Dynamically import Tesseract with TypeScript suppression
      // @ts-ignore - tesseract.js is installed but TypeScript can't resolve it
      const TesseractModule = await import('tesseract.js');
      const Tesseract = TesseractModule.default || TesseractModule;

      // Use Tesseract.js for OCR with enhanced settings
      const result = await Tesseract.recognize(enhancedImage, 'eng+hin', {
        logger: (m: any) => console.log('OCR Progress:', Math.round(m.progress * 100) + '%'),
        tessedit_pageseg_mode: Tesseract.PSM.AUTO,
      } as any);

      let extractedText = result.data.text.trim();

      // Clean up extracted text
      if (extractedText) {
        // Remove extra whitespace and newlines
        extractedText = extractedText.replace(/\s+/g, ' ').trim();

        // Get confidence score
        const confidence = result.data.confidence;

        setInput(`📸 Scanned text (${Math.round(confidence)}% confidence):\n\n${extractedText}`);
        closeCameraForScan();
      } else {
        alert('No text detected. Try:\n• Better lighting\n• Clearer camera focus\n• Larger text\n• Steady positioning');
      }
    } catch (error) {
      console.error('Text extraction error:', error);
      alert('OCR error. Please ensure Tesseract.js is loaded and try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleSpeak = (messageId: string, content: string) => {
    if (speakingMessageId === messageId) {
      // Stop speaking
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    // Start speaking
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(content);
    utterance.lang = 'en-IN';
    utterance.rate = 0.9;

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(messageId);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col h-full relative">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat z-0" />

      {/* Top Bar with Language Selector */}
      <div className="flex items-center justify-between gap-4 py-4 border-b border-border/50 bg-background/95 backdrop-blur-md z-10 px-6 lg:px-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-saffron to-sacred-gold flex items-center justify-center shadow-lg shadow-saffron/20">
            <span className="text-2xl">🪷</span>
          </div>
          <div>
            <h1 className="font-display text-2xl text-foreground">Dhanvantari AI</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-herbal opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-herbal"></span>
                </span>
                Online
              </span>
              <span className="text-border">•</span>
              <span>Natural Healing Guide</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/30 text-xs text-muted-foreground border border-border/50">
            <Globe className="w-3.5 h-3.5" />
            <span>Ayurvedic Multilingual Model</span>
          </div>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-4 py-2 rounded-xl glass-card border-border/50 bg-secondary/30 text-sm font-medium cursor-pointer hover:bg-secondary/50 transition-colors focus:ring-2 focus:ring-primary/20 outline-none"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-10 py-6 scroll-smooth z-0">
        <div className="container mx-auto max-w-5xl space-y-8">
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'} max-w-[90%] md:max-w-[80%]`}>
                  {/* Avatar/Sender Name logic could go here */}

                  <div
                    className={`
                        relative px-6 py-4 shadow-sm
                        ${message.role === 'user'
                        ? 'bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl rounded-tr-sm'
                        : 'glass-card bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl rounded-tl-sm text-foreground'
                      }
                    `}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-3 border-b border-border/10 pb-2">
                        <Sparkles className="w-4 h-4 text-sacred-gold" />
                        <span className="text-xs font-bold uppercase tracking-wider opacity-70">Dhanvantari Wisdom</span>
                      </div>
                    )}

                    <div className={`text-base leading-relaxed whitespace-pre-wrap ${message.role === 'user' ? 'font-medium' : ''}`}>
                      {message.content}
                    </div>
                  </div>

                  {/* Message Actions */}
                  {message.role === 'assistant' && !message.id.startsWith('streaming-') && (
                    <div className="flex items-center gap-2 mt-2 ml-1">
                      <button
                        onClick={() => handleSpeak(message.id, message.content)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/30 hover:bg-secondary/50 text-xs font-medium text-muted-foreground transition-colors"
                      >
                        {speakingMessageId === message.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5" />
                            Stop
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            Listen
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="glass-card rounded-2xl rounded-tl-sm px-6 py-4 flex items-center gap-3">
                <div className="relative">
                  <span className="absolute inset-0 rounded-full animate-ping bg-primary/20"></span>
                  <Loader2 className="w-5 h-5 text-primary animate-spin relative z-10" />
                </div>
                <span className="text-sm font-medium text-muted-foreground animate-pulse">Consulting ancient texts...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Suggestions Overlay */}
      {messages.length <= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 lg:px-10 pb-6"
        >
          <div className="container mx-auto max-w-5xl">
            <p className="text-xs font-medium text-muted-foreground mb-4 uppercase tracking-wider pl-1">Suggested Healing Queries</p>
            <div className="flex flex-wrap gap-3">
              {suggestions.map((suggestion) => (
                <motion.button
                  key={suggestion}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSend(suggestion)}
                  disabled={isLoading}
                  className="glass-card px-5 py-3 rounded-xl text-sm font-medium hover:border-primary/50 hover:bg-primary/5 transition-all disabled:opacity-50 text-left flex items-center gap-2"
                >
                  <span className="text-lg opacity-80">{suggestion.split(' ')[0]}</span>
                  <span>{suggestion.substring(suggestion.indexOf(' '))}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Input Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card border-t border-border/50 px-6 lg:px-10 py-5 z-20"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="relative flex items-center gap-3 bg-secondary/20 p-2 rounded-2xl border border-secondary/30 focus-within:border-primary/50 focus-within:bg-background/50 transition-all shadow-inner">
            <VoiceInputButton onResult={handleVoiceResult} />

            <button
              onClick={() => openCameraForScan()}
              className="p-3 rounded-xl hover:bg-secondary/40 text-muted-foreground hover:text-foreground transition-colors shrink-0"
              title="Scan medical report or text"
            >
              <Camera className="w-5 h-5" />
            </button>
            <div className="w-px h-8 bg-border/50 mx-1" />

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Dhanvantari about symptoms, remedies, or lifestyle..."
              className="flex-1 bg-transparent border-none outline-none text-base text-foreground placeholder:text-muted-foreground/60 min-w-0"
              disabled={isLoading}
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="p-3 rounded-xl bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-primary/25 transition-all shrink-0"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
          <div className="flex justify-center mt-3 gap-6 text-[10px] text-muted-foreground font-medium uppercase tracking-widest opacity-60">
            <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Private & Secure</span>
            <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI + Ayurveda</span>
          </div>
        </div>
      </motion.div>

      {/* Camera Modal (Unchanged functionality, updated styling) */}
      <AnimatePresence>
        {isCameraOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCameraForScan}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-background w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <h3 className="font-display text-xl font-bold">Smart Text Scanner</h3>
                  <button onClick={closeCameraForScan} className="p-2 hover:bg-secondary rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 flex-1 overflow-y-auto">
                  <div className="relative rounded-2xl overflow-hidden bg-black aspect-video mb-6 shadow-lg border border-border/50">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    {/* Scanning Overlay Line */}
                    {isScanning && (
                      <div className="absolute top-0 left-0 w-full h-1 bg-sacred-gold shadow-[0_0_15px_rgba(255,215,0,0.8)] animate-[scan_2s_ease-in-out_infinite]" />
                    )}
                  </div>
                  <canvas ref={canvasRef} className="hidden" />

                  <div className="flex gap-4">
                    <button
                      onClick={captureAndExtractText}
                      disabled={isScanning}
                      className={`flex-1 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isScanning
                        ? 'bg-secondary text-muted-foreground'
                        : 'btn-sacred'
                        }`}
                    >
                      {isScanning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
                      {isScanning ? 'Processing...' : 'Capture & Scan'}
                    </button>
                    <button
                      onClick={closeCameraForScan}
                      className="px-6 py-3.5 rounded-xl border border-border font-medium hover:bg-secondary/50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="mt-4 p-3 bg-secondary/20 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                      <Sparkles className="w-3 h-3 text-sacred-gold" />
                      <span>Powered by Tesseract OCR • Supports English & Hindi</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DhanvantariChat;
