import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, AlertTriangle, CheckCircle, Leaf, X, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { scanMedicine, type MedicineScanResponse } from '@/services/backendApi';

interface ScanResult {
  response: MedicineScanResponse;
}

async function dataUrlToFile(dataUrl: string, filename: string): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const type = blob.type || 'image/png';
  return new File([blob], filename, { type });
}

const MedicineScanner = () => {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('camera');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera
  useEffect(() => {
    if (activeTab === 'camera') {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [activeTab]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (error) {
      setCameraError('Camera access denied. Please enable camera permissions.');
      console.error('Camera error:', error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Capture photo and process
  const captureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsScanning(true);
    try {
      const context = canvasRef.current.getContext('2d');
      if (!context) return;

      // Draw video frame to canvas
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);

      // Convert canvas to image
      const imageData = canvasRef.current.toDataURL('image/png');
      const file = await dataUrlToFile(imageData, 'medicine-capture.png');
      await processMedicineImage(file);
    } catch (error) {
      console.error('Scan error:', error);
      setScanResult({
        response: {
          medicine_name: null,
          confidence: 0,
          error: 'Error processing image',
        },
      });
    } finally {
      setIsScanning(false);
    }
  };

  // Process image via backend API
  const processMedicineImage = async (file: File) => {
    try {
      setIsScanning(true);
      const response = await scanMedicine(file);
      setScanResult({
        response,
      });
    } catch (error) {
      console.error('Medicine scan error:', error);
      setScanResult({
        response: {
          medicine_name: null,
          confidence: 0,
          error: error instanceof Error ? error.message : 'Could not scan medicine',
        },
      });
    }
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    await processMedicineImage(file);
  };

  const clearResult = () => {
    setScanResult(null);
  };

  return (
    <div className="w-full space-y-8 flex-1 min-h-0 overflow-y-auto pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-foreground">Medicine Scanner</h1>
          <p className="text-muted-foreground">Identify medicines and find Ayurvedic alternatives</p>
        </div>
        <div className="glass-card p-1 rounded-xl flex gap-1">
          <button
            onClick={() => setActiveTab('camera')}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'camera'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-secondary/50'
              }`}
          >
            <Camera size={18} />
            <span className="hidden sm:inline">Camera</span>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'upload'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-secondary/50'
              }`}
          >
            <Upload size={18} />
            <span className="hidden sm:inline">Upload</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start h-full">
        {/* Input Section - Left Column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="xl:col-span-5 glass-card p-6 rounded-3xl border border-border/50 relative overflow-hidden min-h-[500px] flex flex-col"
        >
          <div className="flex-1 flex flex-col bg-black/5 rounded-2xl overflow-hidden relative border border-border/10">
            <AnimatePresence mode="wait">
              {activeTab === 'camera' ? (
                <motion.div
                  key="camera"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col relative"
                >
                  {cameraError ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6 text-destructive">
                      <AlertTriangle size={48} className="mb-4 opacity-80" />
                      <p className="max-w-xs">{cameraError}</p>
                    </div>
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover absolute inset-0"
                      />
                      <canvas ref={canvasRef} style={{ display: 'none' }} />
                      {/* Elegant Scanning Overlay */}
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-8 border-2 border-primary/40 rounded-xl">
                          <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                          <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
                        </div>
                        {isScanning && (
                          <motion.div
                            className="absolute left-8 right-8 h-0.5 bg-primary/80 blur-sm top-1/2"
                            animate={{ top: ['10%', '90%', '10%'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          />
                        )}
                      </div>
                    </>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center p-8 bg-secondary/5"
                >
                  <div
                    className="w-full h-full border-2 border-dashed border-border hover:border-primary/50 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-background/50 group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-20 h-20 rounded-full bg-secondary/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Upload size={32} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <p className="font-display text-lg mb-2">Click or Drag Image</p>
                    <p className="text-sm text-muted-foreground">Supported formats: JPG, PNG</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Bar Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              {activeTab === 'camera' && (
                <button
                  onClick={captureAndScan}
                  disabled={isScanning || !!cameraError}
                  className="btn-sacred w-full py-4 text-lg font-bold shadow-xl"
                >
                  {isScanning ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="animate-spin" /> Analyzing...
                    </div>
                  ) : 'Capture & Identify'}
                </button>
              )}
              {activeTab === 'upload' && isScanning && (
                <div className="w-full py-4 bg-background/80 backdrop-blur rounded-xl flex items-center justify-center gap-3 font-medium text-foreground">
                  <Loader2 className="animate-spin text-primary" /> Processing upload...
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Results Section - Right Column */}
        <div className="xl:col-span-7 h-full">
          <AnimatePresence mode="wait">
            {!scanResult ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card p-12 rounded-3xl flex flex-col items-center justify-center text-center h-full min-h-[500px] border border-dashed border-border/60 bg-secondary/5"
              >
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 to-sacred-gold/10 flex items-center justify-center mb-8 animate-pulse-slow">
                  <Sparkles className="w-12 h-12 text-primary/50" />
                </div>
                <h3 className="font-display text-3xl text-foreground mb-4">Start Your Analysis</h3>
                <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                  Point your camera at any medicine strip, bottle, or prescription to instantly identify it and discover safe Ayurvedic alternatives.
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Main Result Card */}
                <div className="glass-card p-8 rounded-3xl border-l-[6px] border-primary relative overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Leaf className="w-32 h-32 text-primary rotate-12" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">Detected Medicine</span>
                        <h2 className="font-display text-4xl text-foreground flex items-center gap-3">
                          {scanResult.response.medicine_name || 'Unknown'}
                          {scanResult.response.confidence > 0.7 && <CheckCircle className="w-8 h-8 text-green-500" />}
                        </h2>
                        <p className="text-lg text-muted-foreground mt-1">{scanResult.response.category || 'Category Unidentified'}</p>
                      </div>
                      <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl ${scanResult.response.confidence > 0.8 ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                        <span className="text-xl font-bold">{Math.round((scanResult.response.confidence || 0) * 100)}%</span>
                        <span className="text-[10px] uppercase font-bold">Match</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-background/50 rounded-xl border border-border/50">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1 block">Primary Usage</span>
                        <p className="font-medium text-foreground">{scanResult.response.uses || 'Information not available'}</p>
                      </div>
                      <div className="p-4 bg-background/50 rounded-xl border border-border/50">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1 block">Safety Profile</span>
                        <p className="font-medium text-foreground">Consult physician before use</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alternatives List */}
                <div className="glass-card p-8 rounded-3xl">
                  <h3 className="font-display text-2xl text-foreground mb-6 flex items-center gap-3">
                    <Leaf className="w-6 h-6 text-herbal" />
                    Natural Ayurvedic Alternatives
                  </h3>

                  {scanResult.response.ayurvedic_remedies && scanResult.response.ayurvedic_remedies.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {scanResult.response.ayurvedic_remedies.map((alt, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="p-5 rounded-2xl bg-gradient-to-r from-herbal/5 to-transparent border border-herbal/10 hover:border-herbal/30 transition-all flex gap-4 group"
                        >
                          <div className="w-12 h-12 rounded-xl bg-herbal/10 flex items-center justify-center text-xl shadow-sm text-herbal font-display font-medium group-hover:bg-herbal group-hover:text-white transition-colors shrink-0">
                            {i + 1}
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-foreground mb-1">{alt.name}</h4>
                            <p className="text-muted-foreground">{alt.usage}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-secondary/20 rounded-2xl">
                      <p className="text-muted-foreground">No specific alternatives found in database for this item.</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={clearResult}
                  className="w-full py-4 rounded-xl border-2 border-dashed border-border text-muted-foreground font-medium hover:border-primary hover:text-primary transition-all uppercase tracking-widest text-sm"
                >
                  Scan Another Medicine
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default MedicineScanner;
