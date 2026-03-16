"use client";

import React, { useState, useEffect } from 'react';
import { useProcessTradeData } from '@/hooks/useProcessTradeData';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { DossierDocument } from '@/components/pdf/DossierDocument';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import { Upload, Download, CheckCircle, AlertTriangle, BarChart3, Lock, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const { data, isProcessing, handleFileUpload } = useProcessTradeData();
  const [userTier, setUserTier] = useState<string>('free');
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  useEffect(() => {
    async function fetchUserTier() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('subscription_tier').eq('id', user.id).single();
        if (profile?.subscription_tier) setUserTier(profile.subscription_tier);
      }
    }
    fetchUserTier();
  }, [supabase]);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trade Compliance Dashboard</h1>
            <p className="text-gray-600">Analyze your trade data against the 50-tonne annual limit.</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Current Plan</span>
            <p className="text-sm font-bold text-blue-600 capitalize">{userTier} Tier</p>
          </div>
        </header>

        <div className="bg-white rounded-2xl shadow-sm p-10 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center mb-8">
          <Upload className="w-8 h-8 text-blue-600 mb-4" />
          <label className="cursor-pointer bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
            {isProcessing ? "Processing..." : "Upload Trade CSV"}
            <input type="file" accept=".csv" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} disabled={isProcessing} />
          </label>
        </div>

        {data && (
          <div className="space-y-6">
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2"><BarChart3 className="w-5 h-5 text-blue-600" /><h3 className="font-bold">Annual Cumulative Tonnage</h3></div>
                <span className="text-sm font-bold bg-gray-100 px-3 py-1 rounded-full">{data.ytdTotalTonnes.toFixed(2)} / 50.00 T</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden"><div className={`h-full ${data.isOverThreshold ? 'bg-red-500' : 'bg-blue-600'}`} style={{ width: `${Math.min((data.ytdTotalTonnes / 50) * 100, 100)}%` }} /></div>
            </div>

            <div className={`p-8 rounded-2xl border-2 ${data.isOverThreshold ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
              <div className="flex items-center gap-3 mb-4">{data.isOverThreshold ? <AlertTriangle className="text-red-600" /> : <CheckCircle className="text-green-600" />}<h2 className="text-2xl font-bold">Compliance Analysis</h2></div>
              <p className="mb-6">{data.summaryInstruction}</p>
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-xl"><span>Current Upload</span><p className="text-xl font-bold">{data.totalWeightTonnes.toFixed(2)} T</p></div>
                <div className="bg-white p-4 rounded-xl"><span>Annual Total</span><p className="text-xl font-bold">{data.ytdTotalTonnes.toFixed(2)} T</p></div>
                <div className="bg-white p-4 rounded-xl"><span>Total Value</span><p className="text-xl font-bold">€{data.totalValue.toLocaleString()}</p></div>
              </div>
            </div>

            <div className="flex justify-center">
              {userTier === 'free' ? (
                <Link href="/pricing" className="flex items-center gap-2 bg-orange-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-600 transition"><Lock size={18} />Upgrade to Download Dossier</Link>
              ) : (
                <PDFDownloadLink document={<DossierDocument data={data} />} fileName="Trade_Dossier.pdf" className="bg-gray-900 text-white px-8 py-4 rounded-xl font-bold"><Download size={18} /> Download Official Dossier</PDFDownloadLink>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
