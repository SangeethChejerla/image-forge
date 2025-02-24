'use client';

import { useState, useRef } from 'react';
import Layout from '../../components/Layout';

export default function WatermarkRemover() {
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [resultPreview, setResultPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setOriginalPreview(reader.result as string);
    reader.onerror = () => setError('Failed to read file');
    reader.readAsDataURL(file);
  };

  const handleRemove = async () => {
    if (!originalPreview || !canvasRef.current) return;
    setIsProcessing(true);
    setError(null);
    try {
      const img = new Image();
      img.src = originalPreview;
      await img.decode();
      const canvas = canvasRef.current;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not supported');
      ctx.drawImage(img, 0, 0);
      // Simulate watermark removal with a blur over a fixed area (top center)
      ctx.filter = 'blur(10px)';
      ctx.fillRect(img.width / 4, 0, img.width / 2, 100);
      ctx.filter = 'none';
      const dataUrl = canvas.toDataURL('image/png');
      setResultPreview(dataUrl);
    } catch (err) {
      setError('Watermark removal failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Watermark Remover</h1>
      <div className="space-y-4 max-w-lg">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
        />
        {error && <p className="text-red-500">{error}</p>}
        {originalPreview && (
          <div>
            <h3 className="text-lg font-semibold">Original</h3>
            <img src={originalPreview} alt="Original" className="max-w-xs mt-2 rounded-md" />
          </div>
        )}
        <button
          onClick={handleRemove}
          disabled={isProcessing || !originalPreview}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md disabled:opacity-50"
        >
          {isProcessing ? 'Removing...' : 'Remove Watermark'}
        </button>
        <canvas ref={canvasRef} className="hidden" />
        {resultPreview && (
          <div>
            <h3 className="text-lg font-semibold">Result</h3>
            <img src={resultPreview} alt="Result" className="max-w-xs mt-2 rounded-md" />
            <a
              href={resultPreview}
              download="watermark-removed.png"
              className="block mt-2 w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md text-center"
            >
              Download
            </a>
          </div>
        )}
      </div>
      <p className="text-sm text-gray-400 mt-4">
        Note: This is a basic implementation that blurs the top center area. Advanced watermark removal requires AI tools.
      </p>
    </Layout>
  );
}