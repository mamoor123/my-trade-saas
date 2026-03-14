"use client";

import React, { useState, useEffect } from 'react';
import { useProcessTradeData } from '@/hooks/useProcessTradeData';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { DossierDocument } from '@/components/pdf/DossierDocument';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import { 
  Upload, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  BarChart3, 
  Lock, 
  ArrowRight 
} from 'lucide-react';

export default function Dashboard() {
  const { data, isProcessing, handleFileUpload } = useProcessTradeData();
  const [userTier, setUserTier] = useState<string>('free');
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Check the user's subscription tier on page load
  useEffect(() => {
    async function fetchUserTier() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_tier')
          .eq('id', user.id)
          .single();
        
        if (profile?.subscription_tier) {
          setUserTier(profile.subscription_tier);
        }
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
            <p className="text-gray-600">Analyze your trade data against the 50-tonne CBAM threshold.</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Current Plan</span>
            <p className="text-sm font-bold text-blue-600 capitalize">{userTier} Tier</p>
          </div>
        </header>

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-sm p-10 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center mb-8 transition-colors hover:border-blue-300">
          <div className="bg-blue-50 p-4 rounded-full mb-4">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
          <label className="cursor-pointer bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-md active:scale-95">
            {isProcessing ? "Processing Data..." : "Upload Trade CSV"}
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              disabled={isProcessing}
            />
          </label>
          <p className="mt-4 text-sm text-gray-500 font-medium">Standard UTF-8 .csv files supported</p>
        </div>

        {/* Annual Progress Tracker */}
        {data && (
          <div className="mb-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-800">Annual Cumulative Tonnage</h3>
              </div>
              <span className="text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full">
                {data.ytdTotalTonnes.toFixed(2)} / 50.00 T
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner">
              <div 
                className={`h-full transition-all duration-1000 ease-out ${
                  data.isOverThreshold ? 'bg-red-500' : 'bg-blue-600'
                }`}
                style={{ width: `${Math.min((data.ytdTotalTonnes / 50) * 100, 100)}%` }}
              />
            </div>
            
            <p className="mt-3 text-sm text-gray-500">
              {data.isOverThreshold 
                ? "You have exceeded the 50-tonne annual limit. Definitive CBAM reporting required."
                : `You can import ${(50 - data.ytdTotalTonnes).toFixed(2)} more tonnes this year within the simplified threshold.`}
            </p>
          </div>
        )}

        {/* Results Section */}
        {data && (
          <div className="space-y-6 animate-in fade-in duration-700">
            <div className={`p-8 rounded-2xl border-2 ${data.isOverThreshold ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
              <div className="flex items-center gap-3 mb-6">
                {data.isOverThreshold ? <AlertTriangle className="text-red-600 w-7 h-7" /> : <CheckCircle className="text-green-600 w-7 h-7" />}
                <h2 className="text-2xl font-bold text-gray-900">Compliance Analysis</h2>
              </div>
              <p className="text-gray-800 text-lg mb-8 font-medium leading-relaxed">{data.summaryInstruction}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                  <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">Current Upload</span>
                  <p className="text-2xl font-black text-gray-900">{data.totalWeightTonnes.toFixed(2)} T</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                  <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">Annual Total</span>
                  <p className="text-2xl font-black text-gray-900">{data.ytdTotalTonnes.toFixed(2)} T</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                  <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">Total Value</span>
                  <p className="text-2xl font-black text-gray-900">€{data.totalValue.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Feature Access Section: Free vs Paid */}
            <div className="flex justify-center pt-4">
              {userTier === 'free' ? (
                <Link 
                  href="/pricing" 
                  className="flex items-center gap-3 bg-orange-500 text-white px-10 py-4 rounded-2xl font-bold hover:bg-orange-600 transition shadow-lg group"
                >
                  <Lock size={20} />
                  Upgrade to Download Customs Dossier
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <PDFDownloadLink
                  document={<DossierDocument data={data} />}
                  fileName={`Customs_Dossier_${new Date().toISOString().split('T')[0]}.pdf`}
                  className="flex items-center gap-2 bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-black transition shadow-lg active:scale-95"
                >
                  {({ loading }) => (
                    <>
                      {loading ? 'Generating PDF...' : <><Download size={20} /> Download Official Dossier</>}
                    </>
                  )}
                </PDFDownloadLink>
              )}
            </div>
            
            {userTier === 'free' && (
              <p className="text-center text-xs text-gray-400 italic">
                The Free Tier allows analysis but requires a Standard or Pro plan to export official documentation.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
