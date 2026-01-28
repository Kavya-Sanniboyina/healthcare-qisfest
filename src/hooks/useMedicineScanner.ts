import { useState, useRef, useCallback } from 'react';
import { scanMedicine, type MedicineScanResponse } from '@/services/backendApi';

export type MedicineResult = MedicineScanResponse;

interface UseMedicineScannerReturn {
  isScanning: boolean;
  isCameraOpen: boolean;
  result: MedicineResult | null;
  error: string | null;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  openCamera: () => Promise<void>;
  closeCamera: () => void;
  captureAndScan: () => Promise<void>;
  uploadAndAnalyze: (file: File) => Promise<void>;
}

export const useMedicineScanner = (): UseMedicineScannerReturn => {
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [result, setResult] = useState<MedicineResult | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const analyzeMedicine = useCallback(async (file: File) => {
    setIsScanning(true);
    setError(null);
    try {
      const res = await scanMedicine(file);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsScanning(false);
    }
  }, []);

  const captureAndScan = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
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

      canvasRef.current.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'medicine-capture.jpg', { type: 'image/jpeg' });
          analyzeMedicine(file);
        }
      }, 'image/jpeg', 0.95);
    } catch (err) {
      setError('Failed to capture image. Please try again.');
      console.error('Capture error:', err);
    }
  }, [analyzeMedicine]);

  const uploadAndAnalyze = useCallback(
    async (file: File) => {
      try {
        setError(null);
        if (!file.type.startsWith('image/')) {
          throw new Error('Please upload an image file');
        }
        await analyzeMedicine(file);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
      }
    },
    [analyzeMedicine]
  );

  return {
    isScanning,
    isCameraOpen,
    result,
    error,
    videoRef,
    canvasRef,
    openCamera,
    closeCamera,
    captureAndScan,
    uploadAndAnalyze,
  };
};

export default useMedicineScanner;
