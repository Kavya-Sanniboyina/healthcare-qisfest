import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Camera,
  Upload,
  AlertTriangle,
  Shield,
  Loader,
  StopCircle,
  RotateCcw,
  CheckCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSkinDiagnosis } from '../hooks/useSkinDiagnosis';
import type { DiagnosisType } from '@/services/backendApi';
import SkinAnalysisResults from './SkinAnalysisResults';

const analysisTypes = [
  { id: 'skin', icon: '👋', label: 'Skin Analysis', desc: 'Acne, dryness, irritation' },
  { id: 'medicine', icon: '💊', label: 'Medicine Scanner', desc: 'Medicine name detection' },
  { id: 'eye', icon: '👁️', label: 'Eye Analysis', desc: 'Redness, yellowing, strain' },
  { id: 'tongue', icon: '👅', label: 'Tongue Analysis', desc: 'Coating, color, texture' },
  { id: 'nail', icon: '💅', label: 'Nail Analysis', desc: 'Discoloration, ridges, shape' },
];

const VisualDiagnosis = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const {
    isAnalyzing,
    isCameraOpen,
    result,
    error,
    setDiagnosisType,
    videoRef,
    canvasRef,
    openCamera,
    closeCamera,
    captureAndAnalyze,
    uploadAndAnalyze,
  } = useSkinDiagnosis();

  useEffect(() => {
    return () => {
      if (isCameraOpen) {
        closeCamera();
      }
    };
  }, []);

  const handleCameraClick = async () => {
    if (selectedType && ['skin', 'eye', 'tongue', 'nail'].includes(selectedType)) {
      setDiagnosisType(selectedType as DiagnosisType);
    }
    if (!isCameraOpen) {
      await openCamera();
    } else {
      await captureAndAnalyze();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (selectedType && ['skin', 'eye', 'tongue', 'nail'].includes(selectedType)) {
        setDiagnosisType(selectedType as DiagnosisType);
      }
      await uploadAndAnalyze(file);
    }
  };

  const handleBackFromResults = () => {
    closeCamera();
    setSelectedType(null);
  };

  // Show results view (for all diagnosis types)
  if (result && selectedType && ['skin', 'eye', 'tongue', 'nail'].includes(selectedType)) {
    return (
      <div className="min-h-screen bg-gradient-nature">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-40 glass-card border-b border-border/50"
        >
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">
            <button
              onClick={() => handleBackFromResults()}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h1 className="font-display text-lg text-foreground">
                {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Analysis Results
              </h1>
              <p className="text-xs text-muted-foreground">Ayurvedic Treatment Recommendations</p>
            </div>
          </div>
        </motion.header>

        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <SkinAnalysisResults
            conditions={result.conditions}
            onClose={handleBackFromResults}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-nature">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 glass-card border-b border-border/50"
      >
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>

          <div>
            <h1 className="font-display text-lg text-foreground">Visual Diagnosis Engine</h1>
            <p className="text-xs text-muted-foreground">AI-powered Ayurvedic analysis</p>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Privacy Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 rounded-2xl mb-8 flex items-center gap-3 border border-herbal/30"
        >
          <Shield className="w-8 h-8 text-herbal" />
          <div>
            <h4 className="font-medium text-foreground">Private processing</h4>
            <p className="text-sm text-muted-foreground">
              Analysis runs via your configured backend. Do not upload sensitive images.
            </p>
          </div>
        </motion.div>

        {/* Analysis Types Grid */}
        {!selectedType && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h3 className="font-display text-lg text-foreground mb-4">Select Analysis Type</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {analysisTypes.map((type, i) => (
                <motion.button
                  key={type.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedType(type.id)}
                  className="glass-card-hover p-5 rounded-2xl text-left transition-all hover:border-herbal/50"
                >
                  <span className="text-3xl mb-3 block">{type.icon}</span>
                  <h4 className="font-medium text-foreground mb-1">{type.label}</h4>
                  <p className="text-xs text-muted-foreground">{type.desc}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Camera & Upload Section */}
        <AnimatePresence>
          {selectedType === 'skin' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg text-foreground">Skin Analysis</h3>
                {isCameraOpen && (
                  <button
                    onClick={() => {
                      closeCamera();
                      setSelectedType(null);
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Close Camera
                  </button>
                )}
              </div>

              <div className="glass-card p-8 rounded-2xl">
                <div className="flex flex-col items-center gap-6">
                  {/* Video or Camera Placeholder */}
                  <div className="w-full max-w-md aspect-square rounded-2xl border-2 border-herbal/30 overflow-hidden bg-black relative">
                    {isCameraOpen ? (
                      <>
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full h-full object-cover"
                        />
                        <canvas ref={canvasRef} className="hidden" />
                        {isAnalyzing && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="text-center">
                              <Loader className="w-8 h-8 text-herbal animate-spin mx-auto mb-2" />
                              <p className="text-xs text-white">Analyzing...</p>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center flex-col gap-3">
                        <Camera className="w-16 h-16 text-herbal/50" />
                        <p className="text-sm text-muted-foreground">Ready to capture</p>
                      </div>
                    )}
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full bg-destructive/10 border border-destructive/30 rounded-lg p-3"
                    >
                      <p className="text-sm text-destructive">{error}</p>
                    </motion.div>
                  )}

                  {/* Controls */}
                  <div className="flex flex-col w-full gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCameraClick}
                      disabled={isAnalyzing}
                      className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                        isAnalyzing
                          ? 'bg-muted text-muted-foreground cursor-not-allowed'
                          : isCameraOpen
                            ? 'bg-herbal text-white hover:bg-herbal/90'
                            : 'btn-sacred'
                      }`}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Analyzing...
                        </>
                      ) : isCameraOpen ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Capture & Analyze
                        </>
                      ) : (
                        <>
                          <Camera className="w-5 h-5" />
                          Open Camera
                        </>
                      )}
                    </motion.button>

                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isAnalyzing}
                        className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isAnalyzing}
                        className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                          isAnalyzing
                            ? 'bg-muted text-muted-foreground cursor-not-allowed'
                            : 'btn-glass'
                        }`}
                      >
                        <Upload className="w-5 h-5" />
                        Upload Image
                      </motion.button>
                    </div>

                    {isCameraOpen && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          closeCamera();
                          setSelectedType(null);
                        }}
                        disabled={isAnalyzing}
                        className="w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 bg-muted text-muted-foreground hover:bg-muted/80 transition-all disabled:cursor-not-allowed"
                      >
                        <StopCircle className="w-5 h-5" />
                        Close Camera
                      </motion.button>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    📸 Position your skin clearly in good lighting for accurate analysis
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Supported types (eye/tongue/nail use same flow as skin) */}
        {selectedType && selectedType !== 'skin' && ['eye', 'tongue', 'nail'].includes(selectedType) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 rounded-2xl text-center mb-8"
          >
            <h3 className="font-display text-lg text-foreground mb-2">
              {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Analysis
            </h3>
            <p className="text-muted-foreground mb-6">
              Capture or upload an image for analysis and Ayurvedic remedy suggestions.
            </p>
            {/* Reuse the skin capture/upload UI */}
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-2"
              >
                <div className="glass-card p-8 rounded-2xl">
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-full max-w-md aspect-square rounded-2xl border-2 border-herbal/30 overflow-hidden bg-black relative">
                      {isCameraOpen ? (
                        <>
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                          />
                          <canvas ref={canvasRef} className="hidden" />
                          {isAnalyzing && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <div className="text-center">
                                <Loader className="w-8 h-8 text-herbal animate-spin mx-auto mb-2" />
                                <p className="text-xs text-white">Analyzing...</p>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center flex-col gap-3">
                          <Camera className="w-16 h-16 text-herbal/50" />
                          <p className="text-sm text-muted-foreground">Ready to capture</p>
                        </div>
                      )}
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full bg-destructive/10 border border-destructive/30 rounded-lg p-3"
                      >
                        <p className="text-sm text-destructive">{error}</p>
                      </motion.div>
                    )}

                    <div className="flex flex-col w-full gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCameraClick}
                        disabled={isAnalyzing}
                        className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                          isAnalyzing
                            ? 'bg-muted text-muted-foreground cursor-not-allowed'
                            : isCameraOpen
                              ? 'bg-herbal text-white hover:bg-herbal/90'
                              : 'btn-sacred'
                        }`}
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader className="w-5 h-5 animate-spin" />
                            Analyzing...
                          </>
                        ) : isCameraOpen ? (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            Capture & Analyze
                          </>
                        ) : (
                          <>
                            <Camera className="w-5 h-5" />
                            Open Camera
                          </>
                        )}
                      </motion.button>

                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={isAnalyzing}
                          className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={isAnalyzing}
                          className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                            isAnalyzing
                              ? 'bg-muted text-muted-foreground cursor-not-allowed'
                              : 'btn-glass'
                          }`}
                        >
                          <Upload className="w-5 h-5" />
                          Upload Image
                        </motion.button>
                      </div>

                      {isCameraOpen && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            closeCamera();
                            setSelectedType(null);
                          }}
                          disabled={isAnalyzing}
                          className="w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 bg-muted text-muted-foreground hover:bg-muted/80 transition-all disabled:cursor-not-allowed"
                        >
                          <StopCircle className="w-5 h-5" />
                          Close Camera
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {/* Medicine goes to dedicated screen */}
        {selectedType === 'medicine' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 rounded-2xl text-center mb-8"
          >
            <h3 className="font-display text-lg text-foreground mb-2">Medicine Scanner</h3>
            <p className="text-muted-foreground mb-6">
              Use the Medicine Scanner screen for package detection and Ayurvedic alternatives.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/converter')}
              className="btn-sacred mx-auto flex items-center gap-2"
            >
              Go to Medicine Scanner
            </motion.button>
          </motion.div>
        )}

        {/* What We Analyze */}
        {!selectedType && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 rounded-2xl mb-8"
          >
            <h3 className="font-display text-lg text-foreground mb-4">Skin Analysis Identifies</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                'Acne & Breakouts',
                'Dryness & Texture',
                'Oiliness Issues',
                'Inflammation',
                'Pigmentation',
                'Premature Aging',
              ].map((item, i) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-herbal" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Disclaimer */}
        {!selectedType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20"
          >
            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground mb-1">Important Disclaimer</h4>
              <p className="text-sm text-muted-foreground">
                This tool provides general wellness observations with Ayurvedic remedies only. It
                does NOT diagnose conditions. For any concerning symptoms, consult a qualified
                Ayurvedic Vaidya or medical doctor immediately.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VisualDiagnosis;
