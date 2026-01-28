import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Loader2, AlertTriangle, Leaf } from 'lucide-react';
import { useMedicineScanner } from '@/hooks/useMedicineScanner';

interface MedicineScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MedicineScannerModal = ({ isOpen, onClose }: MedicineScannerModalProps) => {
  const {
    isScanning,
    isCameraOpen,
    result,
    error,
    videoRef,
    canvasRef,
    openCamera,
    closeCamera,
    captureAndScan,
  } = useMedicineScanner();

  useEffect(() => {
    if (isOpen && !isCameraOpen) {
      openCamera();
    }
    
    return () => {
      if (!isOpen) {
        closeCamera();
      }
    };
  }, [isOpen, isCameraOpen, openCamera, closeCamera]);

  const handleClose = () => {
    closeCamera();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-background rounded-2xl w-full max-w-lg max-h-[calc(90vh-40px)] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
              <div>
                <h2 className="font-display text-lg text-foreground">Medicine Scanner</h2>
                <p className="text-xs text-muted-foreground">Point camera at medicine packaging</p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 overflow-y-auto flex-1 min-h-0">
              {/* Camera View */}
              {!result && (
                <div className="relative aspect-[4/3] bg-black rounded-xl overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {/* Scanning Overlay */}
                  {isScanning && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center">
                        <Loader2 className="w-12 h-12 text-saffron animate-spin mx-auto mb-2" />
                        <p className="text-white text-sm">Analyzing medicine...</p>
                      </div>
                    </div>
                  )}

                  {/* Scan Frame */}
                  {!isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3/4 h-1/2 border-2 border-saffron rounded-lg border-dashed" />
                    </div>
                  )}
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {/* Result */}
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Medicine Info */}
                  <div className="glass-card p-4 rounded-xl">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-display text-lg text-foreground">
                          {result.medicine_name || 'Unknown'}
                        </h3>
                        <p className="text-sm text-muted-foreground">{result.extracted_text || ''}</p>
                      </div>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {Math.round((result.confidence || 0) * 100)}% match
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">Category:</span> {result.category || 'Unknown'}</p>
                      <p><span className="text-muted-foreground">Uses:</span> {result.uses || 'Unknown'}</p>
                    </div>
                  </div>

                  {/* Warnings */}
                  {result.warnings.length > 0 && (
                    <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                      <h4 className="font-medium text-destructive mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Important Warnings
                      </h4>
                      <ul className="space-y-1">
                        {result.warnings.map((warning, i) => (
                          <li key={i} className="text-sm text-foreground flex items-start gap-2">
                            <span className="text-destructive">•</span>
                            {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Ayurvedic Remedies */}
                  {result.ayurvedic_remedies && result.ayurvedic_remedies.length > 0 && (
                    <>
                      <h4 className="font-display text-lg text-foreground flex items-center gap-2">
                        <Leaf className="w-5 h-5 text-herbal" />
                        Ayurvedic Remedies / Natural Alternatives
                      </h4>
                      <div className="glass-card p-4 rounded-xl">
                        <ul className="space-y-3">
                          {result.ayurvedic_remedies.slice(0, 6).map((r, i) => (
                            <li key={i} className="text-sm text-muted-foreground">
                              <div className="font-medium text-foreground">{r.name}</div>
                              <div>{r.usage}</div>
                              {r.benefits ? <div className="text-xs">{r.benefits}</div> : null}
                              {r.preparation ? <div className="text-xs">Prep: {r.preparation}</div> : null}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}

                  {/* Scan Another */}
                  <button
                    onClick={() => {
                      closeCamera();
                      setTimeout(openCamera, 100);
                    }}
                    className="w-full py-3 rounded-xl glass-card hover:border-primary/50 transition-colors text-foreground font-medium"
                  >
                    Scan Another Medicine
                  </button>
                </motion.div>
              )}
            </div>

            {/* Fixed Scan Button */}
            {!result && !isScanning && (
              <div className="border-t border-border p-4 bg-background flex-shrink-0">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={captureAndScan}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-saffron to-sacred-gold text-herbal-dark font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
                >
                  <Camera className="w-5 h-5" />
                  Scan Medicine
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MedicineScannerModal;
