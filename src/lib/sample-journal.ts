import type { Side } from "@/lib/types";

type Seed = {
  symbol: string;
  side: Side;
  lots: number;
  pnl: number;
  daysAgo: number;
};

const SEEDS: Seed[] = [
  { symbol: "EURUSD", side: "buy", lots: 0.5, pnl: 186, daysAgo: 0 },
  { symbol: "XAUUSD", side: "sell", lots: 0.2, pnl: -94, daysAgo: 0 },
  { symbol: "GBPUSD", side: "buy", lots: 0.4, pnl: 167, daysAgo: 1 },
  { symbol: "USDJPY", side: "sell", lots: 0.3, pnl: -72, daysAgo: 2 },
  { symbol: "NAS100", side: "buy", lots: 1, pnl: 420, daysAgo: 3 },
  { symbol: "EURJPY", side: "buy", lots: 0.4, pnl: -110, daysAgo: 4 },
  { symbol: "GBPJPY", side: "sell", lots: 0.25, pnl: 205, daysAgo: 6 },
  { symbol: "USDCAD", side: "buy", lots: 0.5, pnl: 64, daysAgo: 8 },
  { symbol: "XAUUSD", side: "buy", lots: 0.15, pnl: -180, daysAgo: 10 },
  { symbol: "BTCUSD", side: "buy", lots: 0.1, pnl: 310, daysAgo: 12 },
  { symbol: "EURUSD", side: "sell", lots: 0.6, pnl: -48, daysAgo: 15 },
  { symbol: "AUDUSD", side: "buy", lots: 0.5, pnl: 91, daysAgo: 18 },
];

export function buildSampleTrades(now = new Date()) {
  return SEEDS.map((seed) => {
    const entryAt = new Date(now);
    entryAt.setUTCDate(entryAt.getUTCDate() - seed.daysAgo);
    entryAt.setUTCHours(12, 0, 0, 0);
    const tradedOn = entryAt.toISOString().slice(0, 10);

    return {
      symbol: seed.symbol,
      side: seed.side,
      asset: "forex",
      status: "closed" as const,
      quantity: seed.lots,
      pointValue: 1,
      entryPrice: 0,
      exitPrice: null,
      stopPrice: null,
      fees: 0,
      strategy: "",
      notes: "",
      pnl: seed.pnl,
      tradedOn,
      entryAt,
      exitAt: entryAt,
      source: "sample" as const,
    };
  });
}
