import type { Side } from "@/lib/types";

type TradeStatus = "open" | "closed";

export type PnlInput = {
  side: Side | "long" | "short";
  status: TradeStatus;
  quantity: number;
  pointValue: number;
  entryPrice: number;
  exitPrice: number | null;
  stopPrice: number | null;
  fees: number;
  pnl?: number | null;
  entryAt?: string;
  exitAt?: string | null;
};

export type PnlResult = {
  grossPnl: number | null;
  netPnl: number | null;
  rMultiple: number | null;
};

export function tradeResult(trade: PnlInput): PnlResult {
  if (typeof trade.pnl === "number" && Number.isFinite(trade.pnl)) {
    return { grossPnl: trade.pnl, netPnl: trade.pnl, rMultiple: null };
  }

  if (trade.status !== "closed" || trade.exitPrice == null) {
    return { grossPnl: null, netPnl: null, rMultiple: null };
  }

  const direction = trade.side === "sell" || trade.side === "short" ? -1 : 1;
  const grossPnl =
    direction *
    (trade.exitPrice - trade.entryPrice) *
    trade.quantity *
    trade.pointValue;
  const netPnl = grossPnl - trade.fees;

  let rMultiple: number | null = null;
  if (trade.stopPrice != null) {
    const risk =
      Math.abs(trade.entryPrice - trade.stopPrice) *
      trade.quantity *
      trade.pointValue;
    if (risk > 0) rMultiple = netPnl / risk;
  }

  return { grossPnl, netPnl, rMultiple };
}

export type ClosedFill = {
  symbol: string;
  side: Side;
  strategy: string;
  asset: string;
  entryAt: string;
  exitAt: string;
  grossPnl: number;
  netPnl: number;
  fees: number;
  rMultiple: number | null;
};

export type Summary = {
  count: number;
  wins: number;
  losses: number;
  scratches: number;
  net: number;
  fees: number;
  grossProfit: number;
  grossLoss: number;
  winRate: number | null;
  profitFactor: number | null;
  unboundedFactor: boolean;
  expectancy: number | null;
  avgWin: number | null;
  avgLoss: number | null;
  payoff: number | null;
  maxDrawdown: number;
  avgHoldHours: number | null;
  streak: { kind: "win" | "loss" | "flat"; count: number } | null;
  best: ClosedFill | null;
  worst: ClosedFill | null;
  curve: { label: string; equity: number }[];
};

const EMPTY: Summary = {
  count: 0,
  wins: 0,
  losses: 0,
  scratches: 0,
  net: 0,
  fees: 0,
  grossProfit: 0,
  grossLoss: 0,
  winRate: null,
  profitFactor: null,
  unboundedFactor: false,
  expectancy: null,
  avgWin: null,
  avgLoss: null,
  payoff: null,
  maxDrawdown: 0,
  avgHoldHours: null,
  streak: null,
  best: null,
  worst: null,
  curve: [],
};

export function summarize(fills: ClosedFill[]): Summary {
  if (fills.length === 0) return EMPTY;

  const sorted = [...fills].sort((a, b) => a.exitAt.localeCompare(b.exitAt));
  const wins = sorted.filter((fill) => fill.netPnl > 0);
  const losses = sorted.filter((fill) => fill.netPnl < 0);
  const scratches = sorted.filter((fill) => fill.netPnl === 0);
  const net = sorted.reduce((sum, fill) => sum + fill.netPnl, 0);
  const fees = sorted.reduce((sum, fill) => sum + fill.fees, 0);
  const grossProfit = wins.reduce((sum, fill) => sum + fill.netPnl, 0);
  const grossLoss = losses.reduce((sum, fill) => sum + fill.netPnl, 0);
  const avgWin = wins.length ? grossProfit / wins.length : null;
  const avgLoss = losses.length ? grossLoss / losses.length : null;

  let equity = 0;
  let peak = 0;
  let maxDrawdown = 0;
  const curve = [{ label: "Start", equity: 0 }];
  for (const fill of sorted) {
    equity += fill.netPnl;
    peak = Math.max(peak, equity);
    maxDrawdown = Math.max(maxDrawdown, peak - equity);
    curve.push({
      label: new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }).format(new Date(fill.exitAt)),
      equity,
    });
  }

  let streak: Summary["streak"] = null;
  for (let index = sorted.length - 1; index >= 0; index -= 1) {
    const kind =
      sorted[index].netPnl > 0 ? "win" : sorted[index].netPnl < 0 ? "loss" : "flat";
    if (!streak) streak = { kind, count: 1 };
    else if (streak.kind === kind) streak = { kind, count: streak.count + 1 };
    else break;
  }

  const holdHours = sorted.reduce((sum, fill) => {
    const hours =
      (new Date(fill.exitAt).getTime() - new Date(fill.entryAt).getTime()) / 36e5;
    return sum + Math.max(0, hours);
  }, 0);

  return {
    count: sorted.length,
    wins: wins.length,
    losses: losses.length,
    scratches: scratches.length,
    net,
    fees,
    grossProfit,
    grossLoss,
    winRate: wins.length / sorted.length,
    profitFactor: grossLoss === 0 ? null : grossProfit / Math.abs(grossLoss),
    unboundedFactor: grossLoss === 0 && grossProfit > 0,
    expectancy: net / sorted.length,
    avgWin,
    avgLoss,
    payoff: avgWin != null && avgLoss != null && avgLoss !== 0 ? avgWin / Math.abs(avgLoss) : null,
    maxDrawdown,
    avgHoldHours: holdHours / sorted.length,
    streak,
    best: sorted.reduce((best, fill) => (fill.netPnl > best.netPnl ? fill : best)),
    worst: sorted.reduce((worst, fill) => (fill.netPnl < worst.netPnl ? fill : worst)),
    curve,
  };
}

export type GroupRow = {
  name: string;
  count: number;
  net: number;
  winRate: number | null;
  profitFactor: number | null;
  unboundedFactor: boolean;
};

export function groupFills(fills: ClosedFill[], key: (fill: ClosedFill) => string): GroupRow[] {
  const groups = new Map<string, ClosedFill[]>();
  for (const fill of fills) {
    const name = key(fill).trim() || "Unspecified";
    groups.set(name, [...(groups.get(name) ?? []), fill]);
  }

  return [...groups.entries()]
    .map(([name, rows]) => {
      const summary = summarize(rows);
      return {
        name,
        count: summary.count,
        net: summary.net,
        winRate: summary.winRate,
        profitFactor: summary.profitFactor,
        unboundedFactor: summary.unboundedFactor,
      };
    })
    .sort((a, b) => b.net - a.net);
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function weekdayRows(fills: ClosedFill[]): GroupRow[] {
  return WEEKDAYS.map((name, index) => {
    const rows = fills.filter((fill) => new Date(fill.exitAt).getUTCDay() === index);
    const summary = summarize(rows);
    return {
      name,
      count: summary.count,
      net: summary.net,
      winRate: summary.winRate,
      profitFactor: summary.profitFactor,
      unboundedFactor: summary.unboundedFactor,
    };
  });
}

export function dailyBars(fills: ClosedFill[]) {
  const totals = new Map<string, number>();
  for (const fill of fills) {
    const day = fill.exitAt.slice(0, 10);
    totals.set(day, (totals.get(day) ?? 0) + fill.netPnl);
  }

  return [...totals.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-40)
    .map(([day, net]) => ({
      label: new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }).format(new Date(`${day}T00:00:00.000Z`)),
      net,
    }));
}

export function toFill(trade: {
  symbol: string;
  side: Side;
  strategy: string;
  asset: string;
  entryAt: string;
  exitAt?: string | null;
  status: TradeStatus;
  grossPnl: number | null;
  netPnl: number | null;
  fees: number;
  rMultiple?: number | null;
}): ClosedFill | null {
  if (trade.status !== "closed" || trade.grossPnl == null || trade.netPnl == null) {
    return null;
  }
  return {
    symbol: trade.symbol,
    side: trade.side,
    strategy: trade.strategy,
    asset: trade.asset,
    entryAt: trade.entryAt,
    exitAt: trade.exitAt ?? trade.entryAt,
    grossPnl: trade.grossPnl,
    netPnl: trade.netPnl,
    fees: trade.fees,
    rMultiple: trade.rMultiple ?? null,
  };
}
