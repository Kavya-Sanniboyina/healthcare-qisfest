import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, AlertTriangle, CheckCircle, Leaf, X, Loader2 } from 'lucide-react';
import { scanMedicine, type MedicineScanResponse } from '@/services/backendApi';
import './MedicineScanner.css';

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
    <div className="medicine-scanner-container">
      {/* Animated Background */}
      <div className="scanner-background">
        <div className="scan-pattern-1"></div>
        <div className="scan-pattern-2"></div>
        <div className="scanner-glow-1"></div>
        <div className="scanner-glow-2"></div>
      </div>

      {/* Main Content */}
      <div className="scanner-content">
        {/* Header */}
        <div className="scanner-header">
          <div className="scanner-header-icon">📸</div>
          <h1>Medicine Scanner</h1>
          <p>Scan medicine package to get usage & causes</p>
        </div>

        {/* Tabs */}
        <div className="scanner-tabs">
          <button
            className={`scanner-tab ${activeTab === 'camera' ? 'active' : ''}`}
            onClick={() => setActiveTab('camera')}
          >
            <Camera size={20} />
            <span>Camera Scan</span>
          </button>
          <button
            className={`scanner-tab ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            <Upload size={20} />
            <span>Upload Image</span>
          </button>
        </div>

        {/* Camera Tab */}
        {activeTab === 'camera' && (
          <div className="scanner-camera-section">
            {cameraError ? (
              <div className="camera-error">
                <AlertTriangle size={32} />
                <p>{cameraError}</p>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="camera-preview"
                />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                <div className="camera-overlay">
                  <div className="scan-frame"></div>
                </div>
                <button
                  className="scan-button"
                  onClick={captureAndScan}
                  disabled={isScanning}
                >
                  {isScanning ? (
                    <>
                      <Loader2 size={24} className="spin" />
                      <span>Scanning...</span>
                    </>
                  ) : (
                    <>
                      <Camera size={24} />
                      <span>Capture & Scan</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        )}

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="scanner-upload-section">
            <div
              className="upload-area"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={48} />
              <p>Click to upload or drag and drop</p>
              <p className="upload-hint">PNG, JPG up to 10MB</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            {isScanning && (
              <div className="upload-loading">
                <Loader2 size={32} className="spin" />
                <p>Processing image...</p>
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {scanResult && (
          <div className="scanner-results">
            <div className="results-header">
              <h2>Scan Results</h2>
              <button className="close-btn" onClick={clearResult}>
                <X size={20} />
              </button>
            </div>

            {/* Extracted Text */}
            <div className="extracted-text-section">
              <p className="extracted-label">Medicine Name Detected:</p>
              <p className="extracted-value">{scanResult.response.medicine_name || 'Unknown'}</p>
              <div className="confidence-bar">
                <div
                  className="confidence-fill"
                  style={{ width: `${Math.round((scanResult.response.confidence || 0) * 100)}%` }}
                ></div>
              </div>
              <p className="confidence-text">
                Confidence: {Math.round((scanResult.response.confidence || 0) * 100)}%
              </p>
            </div>

            {/* Medicine Info */}
            {scanResult.response.medicine_name && scanResult.response.medicine_name !== 'Unknown' ? (
              <div className="medicine-info-card">
                <div className="info-header">
                  <CheckCircle size={24} className="success-icon" />
                  <h3>{scanResult.response.medicine_name}</h3>
                </div>

                {/* Category */}
                <div className="info-row">
                  <span className="info-label">Category:</span>
                  <span className="info-value">{scanResult.response.category || 'Unknown'}</span>
                </div>

                {/* Common Uses / Causes */}
                <div className="info-row">
                  <span className="info-label">Causes / Uses:</span>
                  <span className="info-value">{scanResult.response.uses || 'Unknown'}</span>
                </div>

                {/* Ayurvedic Remedies */}
                {scanResult.response.ayurvedic_remedies && scanResult.response.ayurvedic_remedies.length > 0 && (
                  <div className="usage-section">
                    <h4>Ayurvedic Remedies / Natural Alternatives:</h4>
                    <ul className="usage-list">
                      {scanResult.response.ayurvedic_remedies.slice(0, 5).map((alt, idx) => (
                        <li key={idx}>
                          <strong>{alt.name}:</strong> {alt.usage}
                          {alt.benefits ? <span> — {alt.benefits}</span> : null}
                          {alt.preparation ? <div><em>Prep:</em> {alt.preparation}</div> : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Disclaimer */}
                <div className="disclaimer-box">
                  <AlertTriangle size={18} />
                  <p>
                    Educational use only. This does not replace professional medical/Ayurvedic advice.
                    If symptoms are severe or persistent, consult a qualified practitioner.
                  </p>
                </div>
                {scanResult.response.error && (
                  <div className="disclaimer-box">
                    <AlertTriangle size={18} />
                    <p>{scanResult.response.error}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="no-match-card">
                <AlertTriangle size={32} />
                <h3>Medicine Not Found</h3>
                <p>Could not confidently identify this medicine from the image.</p>
                <p className="hint">Try scanning a clearer image of the medicine package.</p>
              </div>
            )}
          </div>
        )}

        {/* Welcome Section */}
        {!scanResult && (
          <div className="scanner-welcome">
            <div className="welcome-box">
              <Leaf size={40} />
              <h3>How It Works</h3>
              <ol className="steps-list">
                <li>Take a clear photo of the medicine package or label</li>
                <li>The camera will extract the medicine name using OCR</li>
                <li>We'll show you the usage, causes, and warnings</li>
                <li>Get instant information about any medicine</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineScanner;
