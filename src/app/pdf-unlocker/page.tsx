'use client';

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import Layout from '@/components/Layout';

export default function PdfUnlocker() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [unlockedPdfUrl, setUnlockedPdfUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPdfFile(file);
  };

  const handleUnlock = async () => {
    if (!pdfFile) return;
    setIsProcessing(true);
    setError(null);
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      pdfDoc.setTitle(pdfDoc.getTitle()); 
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setUnlockedPdfUrl(url);
    } catch (err) {
      setError('Failed to unlock PDF (encrypted PDFs require a password)');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">PDF Unlocker</h1>
      <div className="space-y-4 max-w-lg">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          onClick={handleUnlock}
          disabled={isProcessing || !pdfFile}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md disabled:opacity-50"
        >
          {isProcessing ? 'Unlocking...' : 'Unlock PDF'}
        </button>
        {unlockedPdfUrl && (
          <div>
            <a
              href={unlockedPdfUrl}
              download="unlocked.pdf"
              className="block w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md text-center"
            >
              Download Unlocked PDF
            </a>
          </div>
        )}
      </div>
    </Layout>
  );
}