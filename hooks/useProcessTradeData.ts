import { useState } from 'react';
import Papa from 'papaparse';
import { createBrowserClient } from '@supabase/ssr';
import { processTradeData, AnalysisResult } from '../lib/engine';

export const useProcessTradeData = () => {
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Create the Supabase client for browser-side database access
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    
    try {
      // 1. Get current logged-in user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert("Please log in to process trade data.");
        setIsProcessing(false);
        return;
      }

      // 2. Fetch the user's stored annual weight from their profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('ytd_weight')
        .eq('id', user.id)
        .single();

      const previousYtd = profile?.ytd_weight || 0;

      // 3. Parse the CSV file
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          // 4. Run the updated engine using the fetched previous weight
          const analysis = processTradeData(results.data, previousYtd);
          
          // 5. Update the database with the new annual cumulative total
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ ytd_weight: analysis.ytdTotalTonnes })
            .eq('id', user.id);

          if (updateError) {
            console.error("Database update error:", updateError);
          }

          // 6. Update the UI state with the results
          setData(analysis);
          setIsProcessing(false);
        },
        error: (error) => {
          console.error("CSV Parsing error:", error);
          setIsProcessing(false);
        }
      });
    } catch (err) {
      console.error("Unexpected error:", err);
      setIsProcessing(false);
    }
  };

  return { data, isProcessing, handleFileUpload };
};
