'use client';

import { useState } from 'react';
import Layout from '../../components/Layout';

export default function BackgroundRemover() {
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = () => setOriginalPreview(reader.result as string);
    reader.onerror = () => setError('Failed to read file');
    reader.readAsDataURL(selectedFile);
  };

  const handleRemoveBackground = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('image_file', file);
      formData.append('size', 'auto');
      const response = await fetch('/api/removebg', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setResultUrl(url);
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      setError('Background removal failed. Check API key or file.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Background Remover</h1>
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
          onClick={handleRemoveBackground}
          disabled={isProcessing || !file}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md disabled:opacity-50"
        >
          {isProcessing ? 'Removing...' : 'Remove Background'}
        </button>
        {resultUrl && (
          <div>
            <h3 className="text-lg font-semibold">Result</h3>
            <img src={resultUrl} alt="Background Removed" className="max-w-xs mt-2 rounded-md" />
            <a
              href={resultUrl}
              download="background-removed.png"
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