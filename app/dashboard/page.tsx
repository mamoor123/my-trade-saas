"use client";

import React from 'react';
import { useProcessTradeData } from '@/hooks/useProcessTradeData';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { DossierDocument } from '@/components/pdf/DossierDocument';
import { Upload, FileText, Download, CheckCircle, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const { data, isProcessing, handleFileUpload } = useProcessTradeData();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Trade Compliance Dashboard</h1>
          <p className="text-gray-600">Upload your CSV to run the 50-Tonne Engine analysis.</p>
        </header>

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center mb-8">
          <Upload className="w-12 h-12 text-blue-500 mb-4" />
          <label className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
            {isProcessing ? "Processing..." : "Select Trade CSV"}
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              disabled={isProcessing}
            />
          </label>
          <p className="mt-2 text-sm text-gray-500">Only .csv files are supported</p>
        </div>

        {/* Results Section */}
        {data && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className={`p-6 rounded-xl border ${data.isOverThreshold ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
              <div className="flex items-center gap-3 mb-4">
                {data.isOverThreshold ? <AlertTriangle className="text-red-600" /> : <CheckCircle className="text-green-600" />}
                <h2 className="text-xl font-bold text-gray-900">Analysis Result</h2>
              </div>
              <p className="text-gray-800 text-lg mb-4">{data.summaryInstruction}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-sm text-gray-500">Total Weight</span>
                  <p className="text-2xl font-bold">{data.totalWeightTonnes.toFixed(2)} T</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-sm text-gray-500">Total Value</span>
                  <p className="text-2xl font-bold">€{data.totalValue.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* PDF Download Button */}
            <div className="flex justify-center">
              <PDFDownloadLink
                document={<DossierDocument data={data} />}
                fileName={`Customs_Dossier_${new Date().toISOString().split('T')[0]}.pdf`}
                className="flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition shadow-lg"
              >
                {({ loading }) => (
                  <>
                    {loading ? 'Preparing Dossier...' : <><Download size={20} /> Download Customs Dossier</>}
                  </>
                )}
              </PDFDownloadLink>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}