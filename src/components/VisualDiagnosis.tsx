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
  Sparkles
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
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleBackFromResults()}
            className="p-2 rounded-full hover:bg-secondary/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display text-2xl text-foreground">
              {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Analysis Results
            </h1>
            <p className="text-sm text-muted-foreground">Ayurvedic Treatment Recommendations</p>
          </div>
        </div>
        <SkinAnalysisResults
          conditions={result.conditions}
          onClose={handleBackFromResults}
        />
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 flex-1 min-h-0 overflow-y-auto pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-foreground">Visual Diagnosis Engine</h1>
          <p className="text-muted-foreground">AI-powered Ayurvedic analysis for Skin, Eyes, Tongue & Nails</p>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {/* Analysis Category Selector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {analysisTypes.map((type, i) => (
            <motion.button
              key={type.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedType(type.id)}
              className={`
                    relative p-4 rounded-2xl text-left transition-all border
                    ${selectedType === type.id
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20'
                  : 'glass-card hover:bg-white/50 border-transparent hover:border-primary/20'
                }
                  `}
            >
              <span className="text-3xl mb-3 block filter drop-shadow-sm">{type.icon}</span>
              <h4 className={`font-bold mb-1 ${selectedType === type.id ? 'text-primary-foreground' : 'text-foreground'}`}>
                {type.label}
              </h4>
              <p className={`text-xs ${selectedType === type.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                {type.desc}
              </p>

              {selectedType === type.id && (
                <motion.div
                  layoutId="active-ring"
                  className="absolute inset-0 border-2 border-primary rounded-2xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          {!selectedType ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Welcome / Info Card */}
              <div className="lg:col-span-2 glass-card p-8 rounded-3xl relative overflow-hidden min-h-[400px] flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                <div className="relative z-10">
                  <h2 className="font-display text-3xl mb-4">Holistic Visual Assessment</h2>
                  <p className="text-lg text-muted-foreground mb-8 max-w-xl">
                    Our advanced AI analyzes physical markers from your skin, eyes, tongue, and nails to determine your Dosha imbalance (Vikriti) and suggest personalized Ayurvedic remedies.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/30 text-sm font-medium">
                      <Shield className="w-4 h-4 text-herbal" />
                      <span>Private & Secure</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/30 text-sm font-medium">
                      <Sparkles className="w-4 h-4 text-sacred-gold" />
                      <span>AI Diagnostics</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats / Info */}
              <div className="glass-card p-8 rounded-3xl flex flex-col gap-6">
                <h3 className="font-bold text-lg border-b border-border/50 pb-4">What We Analyze</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Skin Texture & Acne', icon: '🧖‍♀️' },
                    { label: 'Tongue Coating', icon: '👅' },
                    { label: 'Eye Redness/Clarity', icon: '👁️' },
                    { label: 'Nail Ridges & Shape', icon: '💅' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <span className="text-xl bg-secondary/20 p-2 rounded-lg">{item.icon}</span>
                      <span className="font-medium text-foreground">{item.label}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto p-4 bg-destructive/5 rounded-xl border border-destructive/10">
                  <div className="flex gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      <strong>Disclaimer:</strong> This tool is for wellness purposes only and does not provide medical diagnosis.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="active-stage"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              {/* Dynamic Stage based on Type */}
              {selectedType === 'medicine' ? (
                <div className="glass-card p-12 rounded-3xl text-center flex flex-col items-center justify-center min-h-[400px]">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <span className="text-5xl">💊</span>
                  </div>
                  <h2 className="font-display text-3xl mb-4">Switching to Medicine Scanner</h2>
                  <p className="text-muted-foreground mb-8 max-w-md">
                    For detailed medicine packaging analysis, please use our dedicated scanner module.
                  </p>
                  <button
                    onClick={() => navigate('/converter')}
                    className="btn-sacred px-8 py-3 text-lg flex items-center gap-2"
                  >
                    Launch Medicine Scanner <ArrowLeft className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Camera Feed / Input Area */}
                  <div className="glass-card p-6 md:p-8 rounded-3xl min-h-[500px] flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-display text-2xl">
                        {analysisTypes.find(t => t.id === selectedType)?.label}
                      </h3>
                      {isCameraOpen && (
                        <button
                          onClick={() => { closeCamera(); setSelectedType(null); }}
                          className="p-2 hover:bg-secondary/50 rounded-full transition-colors"
                        >
                          <StopCircle className="w-6 h-6 text-destructive" />
                        </button>
                      )}
                    </div>

                    <div className="flex-1 rounded-2xl overflow-hidden bg-black/95 relative border border-border/10 shadow-inner group">
                      {isCameraOpen ? (
                        <>
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                          />
                          <canvas ref={canvasRef} className="hidden" />
                          {/* Face/Target Overlay Guideline */}
                          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-50">
                            <div className="w-64 h-80 border-2 border-dashed border-white/50 rounded-[40%]"></div>
                          </div>

                          {isAnalyzing && (
                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm z-20">
                              <Loader className="w-12 h-12 text-herbal animate-spin mb-4" />
                              <p className="text-lg font-medium text-white tracking-wide">Analyzing Biomarkers...</p>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-gray-900 to-black">
                          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <Camera className="w-10 h-10 text-white/50" />
                          </div>
                          <h4 className="text-white font-medium text-lg mb-2">Ready to Capture</h4>
                          <p className="text-white/40 text-sm max-w-xs">
                            Ensure good lighting and position your {selectedType} clearly within the frame.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Controls Toolbar */}
                    <div className="mt-6 flex flex-col gap-3">
                      <button
                        onClick={handleCameraClick}
                        disabled={isAnalyzing}
                        className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg ${isCameraOpen
                          ? 'bg-white text-black hover:bg-gray-100'
                          : 'btn-sacred'
                          }`}
                      >
                        {isAnalyzing ? (
                          'Processing...'
                        ) : isCameraOpen ? (
                          <><div className="w-6 h-6 rounded-full border-4 border-current"></div> Capture Photo</>
                        ) : (
                          <><Camera className="w-6 h-6" /> Open Camera</>
                        )}
                      </button>

                      <div className="flex gap-3">
                        <div className="relative flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            disabled={isAnalyzing}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          <button className="w-full py-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 font-medium text-sm flex items-center justify-center gap-2 transition-colors">
                            <Upload className="w-4 h-4" /> Upload Image
                          </button>
                        </div>
                        <button
                          onClick={() => { closeCamera(); setSelectedType(null); }}
                          className="px-6 py-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 font-medium text-sm transition-colors text-muted-foreground hover:text-foreground"
                        >
                          Back
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Instructions / Context Column */}
                  <div className="flex flex-col gap-6">
                    <div className="glass-card p-8 rounded-3xl flex-1">
                      <h3 className="font-bold text-xl mb-6">How to take a good photo</h3>
                      <ul className="space-y-4">
                        {[
                          'Find a well-lit area, preferably natural light.',
                          'Ensure the area is clean and free of excessive makeup.',
                          'Center the area within the guide frame.',
                          'Keep the camera steady to avoid blur.',
                          'Avoid strong shadows or glare.'
                        ].map((step, i) => (
                          <li key={i} className="flex gap-4 items-start">
                            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <span className="text-muted-foreground">{step}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/10">
                        <div className="flex items-start gap-3">
                          <Shield className="w-5 h-5 text-herbal shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-bold text-sm text-foreground">Privacy First</h4>
                            <p className="text-xs text-muted-foreground">
                              Your health data is processed locally where possible and transmitted securely.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VisualDiagnosis;
