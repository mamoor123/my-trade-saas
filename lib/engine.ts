/**
 * 50-Tonne Engine: Core Trade Calculation Logic
 * This handles the threshold checks and formatting for the Customs Dossier.
 */

export interface TradeRow {
  date: string;
  weight: number; // in Kilograms
  value: number;
  origin: string;
  commodityCode: string;
}

export interface AnalysisResult {
  totalWeightKgs: number;
  totalWeightTonnes: number;
  ytdTotalTonnes: number; // NEW: Tracks the annual cumulative total
  isOverThreshold: boolean;
  requiresY238: boolean;
  totalValue: number;
  summaryInstruction: string;
}

/**
 * Processes trade data and calculates both per-upload and annual cumulative totals.
 * @param rawData - The raw rows from the parsed CSV file.
 * @param previousYtdWeight - The existing annual total fetched from the database.
 */
export const processTradeData = (rawData: any[], previousYtdWeight: number = 0): AnalysisResult => {
  // 1. Clean and Parse the data
  const processedRows: TradeRow[] = rawData.map((row) => ({
    date: row.Date || row.date || "",
    weight: parseFloat(row.Weight || row.weight || "0"),
    value: parseFloat(row.Value || row.value || "0"),
    origin: row.Origin || row.origin || "Unknown",
    commodityCode: row.CommodityCode || row.commodity_code || "N/A",
  }));

  // 2. Run the "50-Tonne Engine" Logic
  const totalWeightKgs = processedRows.reduce((sum, row) => sum + row.weight, 0);
  const currentUploadTonnes = totalWeightKgs / 1000;
  const totalValue = processedRows.reduce((sum, row) => sum + row.value, 0);

  // NEW LOGIC: Annual Total = Stored Weight + Current Upload
  const ytdTotalTonnes = previousYtdWeight + currentUploadTonnes;

  // The specific threshold for your tool
  const THRESHOLD = 50; 
  const isOverThreshold = ytdTotalTonnes >= THRESHOLD;

  // 3. Determine if TARIC Code Y238 is required based on cumulative YTD total
  const requiresY238 = isOverThreshold;

  // 4. Generate the Summary Instruction for the UI (Updated for YTD)
  const summaryInstruction = isOverThreshold
    ? `ACTION REQUIRED: Annual total (${ytdTotalTonnes.toFixed(2)}T) exceeds 50 tonnes. Customs Dossier must include TARIC Y238 verification.`
    : `COMPLIANCE OK: Annual total (${ytdTotalTonnes.toFixed(2)}T) is within standard limits.`;

  return {
    totalWeightKgs,
    totalWeightTonnes: currentUploadTonnes,
    ytdTotalTonnes, // Return the new cumulative total
    isOverThreshold,
    requiresY238,
    totalValue,
    summaryInstruction,
  };
};
