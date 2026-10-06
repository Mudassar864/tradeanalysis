export const PAIR_SUGGESTIONS = [
  "EURUSD",
  "GBPUSD",
  "USDJPY",
  "USDCHF",
  "AUDUSD",
  "USDCAD",
  "NZDUSD",
  "EURGBP",
  "EURJPY",
  "GBPJPY",
  "AUDJPY",
  "EURAUD",
  "EURCAD",
  "EURCHF",
  "GBPAUD",
  "GBPCAD",
  "GBPCHF",
  "CADJPY",
  "CHFJPY",
  "NZDJPY",
  "AUDCAD",
  "AUDNZD",
  "XAUUSD",
  "XAGUSD",
  "US30",
  "NAS100",
  "SPX500",
  "GER40",
  "UK100",
  "USOIL",
  "BTCUSD",
  "ETHUSD",
] as const;

export function filterPairs(query: string) {
  const needle = query.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!needle) return PAIR_SUGGESTIONS.slice(0, 8);
  return PAIR_SUGGESTIONS.filter((pair) => pair.includes(needle)).slice(0, 8);
}
