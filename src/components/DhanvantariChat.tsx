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
  X
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
      });
      
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
    <div className="min-h-screen bg-gradient-nature flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 glass-card border-b border-border/50"
      >
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
          {/* Top Navigation Row */}
          <div className="flex items-center justify-between gap-4 md:gap-6 mb-3 md:mb-4">
            <div className="flex items-center gap-3 md:gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-full hover:bg-muted transition-colors shrink-0"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </button>
              
              <div className="flex items-center gap-2 md:gap-3">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-saffron to-sacred-gold flex items-center justify-center"
                >
                  <span className="text-lg">🪷</span>
                </motion.div>
                <div>
                  <h1 className="font-display text-lg text-foreground">Dhanvantari AI</h1>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-herbal animate-pulse" />
                    Online • Natural Healing Guide
                  </p>
                </div>
              </div>
            </div>

            {/* Language Selector - Simple Select */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-4 md:px-6 py-2.5 md:py-3 rounded-lg glass-card border-2 border-primary bg-gradient-to-r from-saffron/10 to-sacred-gold/10 font-semibold text-sm md:text-base text-foreground cursor-pointer hover:border-primary transition-all shadow-md"
              style={{ appearance: 'none' }}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Mobile Language Selector */}
          <div className="md:hidden flex items-center gap-3 px-3 py-2.5 bg-muted/30 rounded-lg border border-border/50 mt-2">
            <Globe className="w-4 h-4 text-primary flex-shrink-0" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="flex-1 bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 md:py-8">
        <div className="container mx-auto max-w-3xl space-y-4 md:space-y-6">
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[75%] ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-saffron to-sacred-gold text-herbal-dark rounded-2xl rounded-br-md'
                      : 'glass-card rounded-2xl rounded-bl-md'
                  } px-4 md:px-5 py-3 md:py-4 shadow-lg`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2 md:mb-3">
                      <Sparkles className="w-4 h-4 text-sacred-gold" />
                      <span className="text-xs font-medium text-primary">Dhanvantari</span>
                    </div>
                  )}
                  <div className={`text-sm leading-relaxed whitespace-pre-wrap ${
                    message.role === 'user' ? '' : 'text-foreground'
                  }`}>
                    {message.content}
                  </div>
                  
                  {message.role === 'assistant' && !message.id.startsWith('streaming-') && (
                    <button 
                      onClick={() => handleSpeak(message.id, message.content)}
                      className="mt-3 md:mt-4 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      {speakingMessageId === message.id ? (
                        <>
                          <VolumeX className="w-3 h-3" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3" />
                          Listen
                        </>
                      )}
                    </button>
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
              <div className="glass-card rounded-2xl rounded-bl-md px-4 md:px-5 py-3 md:py-4 flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
                <span className="text-sm text-muted-foreground">Consulting ancient wisdom...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 md:px-6 pb-4 md:pb-6"
        >
          <div className="container mx-auto max-w-3xl">
            <p className="text-xs text-muted-foreground mb-3 md:mb-4 px-2">Suggested queries:</p>
            <div className="flex flex-wrap gap-2 md:gap-3 px-2">
              {suggestions.map((suggestion) => (
                <motion.button
                  key={suggestion}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSend(suggestion)}
                  disabled={isLoading}
                  className="glass-card px-4 md:px-5 py-2 md:py-2.5 rounded-full text-sm hover:border-primary/50 transition-colors disabled:opacity-50"
                >
                  {suggestion}
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
        className="sticky bottom-0 glass-card border-t border-border/50 px-4 md:px-6 py-3 md:py-4"
      >
        <div className="container mx-auto max-w-3xl">
          <div className="flex items-center gap-3 md:gap-4">
            <VoiceInputButton onResult={handleVoiceResult} />
            
            <button 
              onClick={() => openCameraForScan()}
              className="p-2.5 md:p-3 rounded-full glass-card hover:border-primary/50 transition-colors shrink-0"
              title="Scan text from camera"
            >
              <Camera className="w-5 h-5 text-foreground" />
            </button>
            
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Describe your symptoms or ask about remedies..."
                className="input-sacred pr-12"
                disabled={isLoading}
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="p-2.5 md:p-3 rounded-full bg-gradient-to-br from-saffron to-sacred-gold text-herbal-dark disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shrink-0"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center mt-3 md:mt-4">
            🔒 Your conversation is private • Supports 12+ Indian languages • Not a substitute for medical advice
          </p>
        </div>
      </motion.div>

      {/* Camera Scanner Modal */}
      <AnimatePresence>
        {isCameraOpen && (
          <>
            {/* Backdrop */}
            <div
              onClick={closeCameraForScan}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 40,
                backgroundColor: 'rgba(0,0,0,0.7)',
                overflowY: 'auto'
              }}
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                position: 'fixed',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                maxWidth: '500px',
                zIndex: 50,
                backgroundColor: 'white',
                borderRadius: '20px 20px 0 0',
                padding: '24px 20px',
                boxShadow: '0 -5px 40px rgba(0, 0, 0, 0.3)',
                maxHeight: '90vh',
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexShrink: 0, marginTop: '-4px' }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '18px', margin: 0 }}>📷 Scan Text</h3>
                <button
                  onClick={closeCameraForScan}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '50%',
                    border: 'none',
                    background: 'rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    fontSize: '24px',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Video Feed */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{
                  width: '100%',
                  borderRadius: '12px',
                  marginBottom: '20px',
                  backgroundColor: 'black',
                  height: '240px',
                  objectFit: 'cover',
                  display: 'block',
                  flexShrink: 0
                }}
              />

              {/* Canvas (hidden) */}
              <canvas ref={canvasRef} style={{ display: 'none' }} />

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
                <button
                  onClick={captureAndExtractText}
                  disabled={isScanning}
                  style={{
                    flex: 1,
                    padding: '14px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, rgb(255, 185, 67), rgb(255, 213, 79))',
                    color: 'rgb(78, 34, 0)',
                    cursor: isScanning ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    fontSize: '15px',
                    opacity: isScanning ? 0.6 : 1,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isScanning ? '🔄 Scanning...' : '📸 Scan Text'}
                </button>
                <button
                  onClick={closeCameraForScan}
                  style={{
                    flex: 1,
                    padding: '14px 16px',
                    borderRadius: '8px',
                    border: '2px solid rgb(220, 220, 220)',
                    background: 'white',
                    color: 'black',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '15px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  ✕ Close
                </button>
              </div>

              <p style={{ fontSize: '12px', color: '#666', marginTop: '16px', textAlign: 'center', marginBottom: 0, paddingBottom: '4px', flexShrink: 0 }}>
                ✅ OCR enabled with Tesseract.js • Supports English & Hindi • Works offline
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DhanvantariChat;
