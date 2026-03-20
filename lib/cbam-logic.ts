// lib/cbam-logic.ts
export const CBAM_THRESHOLD_KG = 50000; // 50 Tonnes
export type CBAMSector = 'Iron & Steel' | 'Aluminium' | 'Cement' | 'Fertilizer' | 'Hydrogen' | 'Electricity';
export interface TradeRecord {
  netMassKg: number;
  sector: CBAMSector;
}
export function calculateExemptionStatus(records: TradeRecord[]) {
  // Hydrogen and Electricity are NEVER exempt
  const hasAlwaysSubjectGoods = records.some(r => r.sector === 'Hydrogen' || r.sector === 'Electricity');
  
  // Total mass for the other sectors
  const totalMass = records
    .filter(r => !['Hydrogen', 'Electricity'].includes(r.sector))
    .reduce((sum, r) => sum + r.netMassKg, 0);

  const isExempt = !hasAlwaysSubjectGoods && totalMass <= CBAM_THRESHOLD_KG;

  return {
    totalMassKg: totalMass,
    isExempt,
    threshold: CBAM_THRESHOLD_KG,
    percentage: Math.min((totalMass / CBAM_THRESHOLD_KG) * 100, 100),
    needsAuthorization: !isExempt
  };
}
