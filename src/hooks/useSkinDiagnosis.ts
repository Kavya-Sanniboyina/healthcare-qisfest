import { useState, useRef, useCallback } from 'react';
import { analyzeDiagnosis, DiagnosisType, VisualDiagnosisResponse } from '@/services/backendApi';

export interface SkinCondition {
  condition: string;
  severity: 'none' | 'mild' | 'moderate' | 'severe';
  confidence: number;
  causes: string[];
  ayurvedicRemedies: {
    internal: string[];
    external: string[];
    lifestyle: string[];
    herbs: string[];
  };
  warnings: string[];
  acneSpecific?: {
    type: 'comedonal' | 'inflammatory' | 'nodular' | 'cystic';
    doshas: string[];
    dohaBalance: string;
  };
}

interface SkinAnalysisResult {
  conditions: SkinCondition[];
  overallAssessment: string;
  confidence: number;
  recommendations: string[];
  doshaType?: 'Vata' | 'Pitta' | 'Kapha' | 'Mixed';
  analysisDetails?: {
    dominantColors: string[];
    skinTone: string;
    texture: string;
    inflammation: number;
  };
  backend?: Pick<VisualDiagnosisResponse, 'analysis_type' | 'method'>;
}

interface UseSkinDiagnosisReturn {
  isAnalyzing: boolean;
  isCameraOpen: boolean;
  result: SkinAnalysisResult | null;
  error: string | null;
  diagnosisType: DiagnosisType;
  setDiagnosisType: (t: DiagnosisType) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  openCamera: () => Promise<void>;
  closeCamera: () => void;
  captureAndAnalyze: () => Promise<void>;
  uploadAndAnalyze: (file: File) => Promise<void>;
}

export const useSkinDiagnosis = (): UseSkinDiagnosisReturn => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [result, setResult] = useState<SkinAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [diagnosisType, setDiagnosisType] = useState<DiagnosisType>('skin');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const openCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };
      }
      setIsCameraOpen(true);
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions.');
      console.error('Camera error:', err);
    }
  }, []);

  const closeCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  }, []);

  const mapBackendToSkinResult = (backend: VisualDiagnosisResponse): SkinAnalysisResult => {
    const remedies = backend.ayurvedic_remedies || [];
    const recommendations = backend.recommendations || [];

    const mappedConditions: SkinCondition[] = (backend.conditions || []).map((c) => ({
      condition: c.name,
      severity: c.severity,
      confidence: c.confidence ?? backend.confidence ?? 0.5,
      causes: c.description ? [c.description] : [],
      ayurvedicRemedies: {
        // Backend gives a flat remedy list; present it in the "internal" section to keep UI intact.
        internal: remedies.map((r) => `${r.name} — ${r.usage}${r.preparation ? ` (Prep: ${r.preparation})` : ''}`),
        external: [],
        lifestyle: recommendations,
        herbs: remedies.map((r) => r.name),
      },
      warnings: [],
    }));

    const overallAssessment =
      mappedConditions.length > 0
        ? `Detected: ${mappedConditions.map((c) => c.condition).join(', ')}`
        : 'No obvious abnormalities detected.';

    return {
      conditions: mappedConditions,
      overallAssessment,
      confidence: backend.confidence ?? 0.5,
      recommendations,
      backend: { analysis_type: backend.analysis_type, method: backend.method },
    };
  };

  const analyzeSkinImage = useCallback(async (imageData: Blob | string) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      if (typeof imageData === 'string') {
        throw new Error('Base64 analysis is not used here. Please upload/capture an image file.');
      }

      const file = imageData instanceof File ? imageData : new File([imageData], 'diagnosis.jpg', { type: 'image/jpeg' });
      const backend = await analyzeDiagnosis(file, diagnosisType);
      setResult(mapBackendToSkinResult(backend));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze image. Please try again with better lighting.');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [diagnosisType]);

  const captureAndAnalyze = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      setIsAnalyzing(true);
      setError(null);
      
      const context = canvasRef.current.getContext('2d');
      if (!context) throw new Error('Canvas context failed');

      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;

      context.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      // Convert to blob and analyze
      canvasRef.current.toBlob(async (blob) => {
        if (blob) {
          await analyzeSkinImage(blob);
          // Close camera after analysis starts
          closeCamera();
        }
      }, 'image/jpeg', 0.95);
    } catch (err) {
      setError('Failed to capture image. Please try again.');
      setIsAnalyzing(false);
      console.error('Capture error:', err);
    }
  }, [analyzeSkinImage, closeCamera]);

  const uploadAndAnalyze = useCallback(async (file: File) => {
    try {
      setError(null);
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }
      await analyzeSkinImage(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    }
  }, [analyzeSkinImage]);

  return {
    isAnalyzing,
    isCameraOpen,
    result,
    error,
    diagnosisType,
    setDiagnosisType,
    videoRef,
    canvasRef,
    openCamera,
    closeCamera,
    captureAndAnalyze,
    uploadAndAnalyze,
  };
};

export default useSkinDiagnosis;
