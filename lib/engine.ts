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
  isOverThreshold: boolean;
  requiresY238: boolean;
  totalValue: number;
  summaryInstruction: string;
}

export const processTradeData = (rawData: any[]): AnalysisResult => {
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
  const totalWeightTonnes = totalWeightKgs / 1000;
  const totalValue = processedRows.reduce((sum, row) => sum + row.value, 0);

  // The specific threshold for your tool
  const THRESHOLD = 50; 
  const isOverThreshold = totalWeightTonnes >= THRESHOLD;

  // 3. Determine if TARIC Code Y238 is required
  const requiresY238 = isOverThreshold;

  // 4. Generate the Summary Instruction for the UI
  const summaryInstruction = isOverThreshold
    ? "ACTION REQUIRED: Total weight exceeds 50 tonnes. Customs Dossier must include TARIC Y238 verification."
    : "COMPLIANCE OK: Total weight is within standard limits.";

  return {
    totalWeightKgs,
    totalWeightTonnes,
    isOverThreshold,
    requiresY238,
    totalValue,
    summaryInstruction,
  };
};