'use client';

import { useState } from 'react';
import Layout from '../../components/Layout';

export default function Converter() {
  const [conversionType, setConversionType] = useState<'webp-to-png' | 'png-to-jpg'>('webp-to-png');
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [convertedPreview, setConvertedPreview] = useState<string | null>(null);
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

  const handleConvert = async () => {
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
      const outputType = conversionType === 'webp-to-png' ? 'image/png' : 'image/jpeg';
      const dataUrl = canvas.toDataURL(outputType);
      setConvertedPreview(dataUrl);
    } catch (err) {
      setError('Conversion failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Image Converter</h1>
      <div className="space-y-4 max-w-lg">
        <select
          value={conversionType}
          onChange={(e) => setConversionType(e.target.value as 'webp-to-png' | 'png-to-jpg')}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
        >
          <option value="webp-to-png">WebP to PNG</option>
          <option value="png-to-jpg">PNG to JPG</option>
        </select>
        <input
          type="file"
          accept={conversionType === 'webp-to-png' ? 'image/webp' : 'image/png'}
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
          onClick={handleConvert}
          disabled={isProcessing || !originalPreview}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md disabled:opacity-50"
        >
          {isProcessing ? 'Converting...' : 'Convert'}
        </button>
        {convertedPreview && (
          <div>
            <h3 className="text-lg font-semibold">Converted</h3>
            <img src={convertedPreview} alt="Converted" className="max-w-xs mt-2 rounded-md" />
            <a
              href={convertedPreview}
              download={`converted.${conversionType === 'webp-to-png' ? 'png' : 'jpg'}`}
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