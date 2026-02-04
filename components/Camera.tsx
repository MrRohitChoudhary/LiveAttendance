
import React, { useRef, useState, useCallback } from 'react';
import { Camera as CameraIcon, RotateCw, X } from 'lucide-react';

interface CameraProps {
  onCapture: (base64: string) => void;
  onClose: () => void;
}

const Camera: React.FC<CameraProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: false 
      });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    } catch (err) {
      setError("Unable to access camera. Please check permissions.");
    }
  }, []);

  React.useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(dataUrl);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="p-4 flex justify-between items-center text-white">
        <h3 className="font-bold">Capture Proof</h3>
        <button onClick={onClose} className="p-2 bg-white/10 rounded-full">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-slate-900">
        {error ? (
          <div className="text-white text-center p-6">
            <p className="mb-4">{error}</p>
            <button onClick={startCamera} className="bg-indigo-600 px-4 py-2 rounded-lg">Retry</button>
          </div>
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="p-8 bg-black/80 flex justify-center items-center">
        {!error && (
          <button 
            onClick={captureImage}
            className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
          >
            <div className="w-16 h-16 bg-white rounded-full"></div>
          </button>
        )}
      </div>
    </div>
  );
};

export default Camera;
