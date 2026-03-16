// 1. Clean and Parse the data
  const processedRows: TradeRow[] = rawData.map((row) => ({
    date: row.date || row.Date || "",
    // This line now looks for 'weight_kg' as well as 'weight' or 'Weight'
    weight: parseFloat(row.weight_kg || row.Weight || row.weight || "0"),
    // This line now looks for 'value_eur' as well as 'Value' or 'value'
    value: parseFloat(row.value_eur || row.Value || row.value || "0"),
    origin: row.origin || row.Origin || "Unknown",
    commodityCode: row.commodity_code || row.CommodityCode || row.commodityCode || "N/A",
  }));
