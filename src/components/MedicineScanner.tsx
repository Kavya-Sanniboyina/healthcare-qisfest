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
    <div className="max-w-4xl mx-auto space-y-6 h-[calc(100vh-9rem)] overflow-y-auto pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-foreground">Medicine Scanner</h1>
          <p className="text-sm text-muted-foreground">Identify medicines and find Ayurvedic alternatives</p>
        </div>
        <div className="bg-secondary/30 p-1 rounded-lg flex gap-1">
          <button
            onClick={() => setActiveTab('camera')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'camera'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-secondary/50'
              }`}
          >
            <div className="flex items-center gap-2">
              <Camera size={16} /> Camera
            </div>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'upload'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-secondary/50'
              }`}
          >
            <div className="flex items-center gap-2">
              <Upload size={16} /> Upload
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6 rounded-2xl border border-border/50 relative overflow-hidden min-h-[400px]"
        >
          <AnimatePresence mode="wait">
            {activeTab === 'camera' ? (
              <motion.div
                key="camera"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col"
              >
                {cameraError ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6 text-red-500">
                    <AlertTriangle size={48} className="mb-4" />
                    <p>{cameraError}</p>
                  </div>
                ) : (
                  <div className="relative flex-1 bg-black rounded-xl overflow-hidden mb-4 group">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover absolute inset-0"
                    />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    {/* Scanning Overlay */}
                    <div className="absolute inset-0 border-2 border-primary/30 m-8 rounded-lg pointer-events-none">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary"></div>
                      {isScanning && (
                        <motion.div
                          className="absolute left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(34,197,94,0.8)]"
                          animate={{ top: ['0%', '100%', '0%'] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                      )}
                    </div>
                  </div>
                )}

                <button
                  onClick={captureAndScan}
                  disabled={isScanning || !!cameraError}
                  className="btn-sacred w-full py-3 flex items-center justify-center gap-2"
                >
                  {isScanning ? <Loader2 className="animate-spin" /> : <Camera />}
                  {isScanning ? 'Analyzing...' : 'Capture & Identify'}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center"
              >
                <div
                  className="w-full h-64 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/20 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={48} className="text-muted-foreground mb-4" />
                  <p className="font-medium">Click or Drag & Drop Image</p>
                  <p className="text-xs text-muted-foreground mt-2">Support JPG, PNG</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                {isScanning && (
                  <div className="mt-4 flex items-center gap-2 text-primary">
                    <Loader2 className="animate-spin" /> Processing image...
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Section */}
        <div className="space-y-6">
          {!scanResult ? (
            <div className="glass-card p-8 rounded-2xl flex flex-col items-center justify-center text-center h-full min-h-[400px] opacity-70">
              <Sparkles className="w-16 h-16 text-primary/30 mb-4" />
              <h3 className="text-xl font-bold mb-2">Ready to Scan</h3>
              <p className="text-muted-foreground max-w-xs">
                Point your camera at any medicine strip or bottle to instantly get details and Ayurvedic alternatives.
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Status Card */}
              <div className="glass-card p-6 rounded-2xl border-l-4 border-primary">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      {scanResult.response.medicine_name || 'Unknown Medicine'}
                      {scanResult.response.confidence > 0.7 && <CheckCircle className="w-5 h-5 text-green-500" />}
                    </h2>
                    <p className="text-sm text-muted-foreground">{scanResult.response.category || 'Category Unknown'}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${scanResult.response.confidence > 0.8 ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                      }`}>
                      {Math.round((scanResult.response.confidence || 0) * 100)}% Match
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-3 bg-secondary/20 rounded-lg">
                    <span className="text-xs text-muted-foreground block mb-1">Uses</span>
                    <p className="text-sm font-medium">{scanResult.response.uses || 'N/A'}</p>
                  </div>
                  {/* Add more fields if available */}
                </div>
              </div>

              {/* Ayurvedic Alternatives */}
              <div className="glass-card p-6 rounded-2xl bg-gradient-to-br from-herbal/10 to-transparent">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-herbal" />
                  Natural Alternatives
                </h3>

                {scanResult.response.ayurvedic_remedies && scanResult.response.ayurvedic_remedies.length > 0 ? (
                  <div className="space-y-4">
                    {scanResult.response.ayurvedic_remedies.slice(0, 3).map((alt, i) => (
                      <div key={i} className="flex gap-3 pb-3 border-b border-border/50 last:border-0">
                        <div className="w-8 h-8 rounded-full bg-herbal/20 flex items-center justify-center text-herbal font-bold shrink-0">
                          {i + 1}
                        </div>
                        <div>
                          <h4 className="font-bold">{alt.name}</h4>
                          <p className="text-sm text-muted-foreground">{alt.usage}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No specific alternatives found.</p>
                )}
              </div>

              <button
                onClick={clearResult}
                className="w-full py-3 text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Scan Another Medicine
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicineScanner;
