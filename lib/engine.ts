// 1. Clean and Parse the data
  const processedRows: TradeRow[] = rawData.map((row) => ({
    date: row.Date || row.date || "",
    // Updated to look for weight_kg as well
    weight: parseFloat(row.weight_kg || row.Weight || row.weight || "0"),
    value: parseFloat(row.value_eur || row.Value || row.value || "0"),
    origin: row.Origin || row.origin || "Unknown",
    commodityCode: row.CommodityCode || row.commodity_code || "N/A",
  }));
