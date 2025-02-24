'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';

export default function Compressor() {
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [compressedPreview, setCompressedPreview] = useState<string | null>(null);
  const [quality, setQuality] = useState(75);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setOriginalPreview(reader.result as string);
    reader.onerror = () => setError('Failed to read file');
    reader.readAsDataURL(file);
  };

  const handleCompress = async () => {
    if (!originalPreview) return;
    setIsProcessing(true);
    setError(null);
    try {
      const img = new Image();
      img.src = originalPreview;
      await img.decode();
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not supported');
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', quality / 100);
      setCompressedPreview(dataUrl);
    } catch (err) {
      setError('Compression failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">JPG Compressor</h1>
      <div className="space-y-4 max-w-lg">
        <input
          type="file"
          accept="image/jpeg"
          onChange={handleFileChange}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
        />
        <div>
          <label className="block mb-1">Quality ({quality}%)</label>
          <input
            type="range"
            min="1"
            max="100"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {originalPreview && (
          <div>
            <h3 className="text-lg font-semibold">Original</h3>
            <img src={originalPreview} alt="Original" className="max-w-xs mt-2 rounded-md" />
          </div>
        )}
        <button
          onClick={handleCompress}
          disabled={isProcessing || !originalPreview}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md disabled:opacity-50"
        >
          {isProcessing ? 'Compressing...' : 'Compress'}
        </button>
        {compressedPreview && (
          <div>
            <h3 className="text-lg font-semibold">Compressed</h3>
            <img src={compressedPreview} alt="Compressed" className="max-w-xs mt-2 rounded-md" />
            <a
              href={compressedPreview}
              download="compressed.jpg"
              className="block mt-2 w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md text-center"
            >
              Download
            </a>
          </div>
        )}
      </div>
    </Layout>
  );
}