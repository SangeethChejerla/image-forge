'use client';

import { useState } from 'react';
import Layout from '../../components/Layout';

export default function TextOverlay() {
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [resultPreview, setResultPreview] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
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

  const handleApplyText = async () => {
    if (!originalPreview || !name || !dob) return;
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
      ctx.font = '30px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'left';
      ctx.fillText(name, 20, img.height - 20);
      ctx.textAlign = 'right';
      ctx.fillText(dob, img.width - 20, img.height - 20);
      const dataUrl = canvas.toDataURL('image/png');
      setResultPreview(dataUrl);
    } catch (err) {
      setError('Failed to apply text');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Text Overlay</h1>
      <div className="space-y-4 max-w-lg">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
        />
        <input
          type="text"
          placeholder="Date of Birth"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
        />
        {error && <p className="text-red-500">{error}</p>}
        {originalPreview && !resultPreview && (
          <div>
            <h3 className="text-lg font-semibold">Original</h3>
            <img src={originalPreview} alt="Original" className="max-w-xs mt-2 rounded-md" />
          </div>
        )}
        <button
          onClick={handleApplyText}
          disabled={isProcessing || !originalPreview || !name || !dob}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md disabled:opacity-50"
        >
          {isProcessing ? 'Applying...' : 'Apply Text'}
        </button>
        {resultPreview && (
          <div>
            <h3 className="text-lg font-semibold">Result</h3>
            <img src={resultPreview} alt="Result" className="max-w-xs mt-2 rounded-md" />
            <a
              href={resultPreview}
              download="text-overlay.png"
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