import { useState } from 'react';
import Papa from 'papaparse';
import { processTradeData, AnalysisResult } from '../lib/engine';

export const useProcessTradeData = () => {
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (file: File) => {
    setIsProcessing(true);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // This calls your 50-Tonne Engine!
        const analysis = processTradeData(results.data);
        setData(analysis);
        setIsProcessing(false);
      },
      error: (error) => {
        console.error("Parsing error:", error);
        setIsProcessing(false);
      }
    });
  };

  return { data, isProcessing, handleFileUpload };
};