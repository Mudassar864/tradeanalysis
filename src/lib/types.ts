export const SIDES = ["buy", "sell"] as const;
export const OUTCOMES = ["profit", "loss"] as const;

export type Side = (typeof SIDES)[number];
export type Outcome = (typeof OUTCOMES)[number];
export type TradeSource = "manual" | "sample";

export type TradeView = {
  id: string;
  symbol: string;
  side: Side;
  lots: number;
  tradedOn: string;
  entryAt: string;
  source: TradeSource;
  netPnl: number | null;
  grossPnl: number | null;
  fees: number;
  strategy: string;
  asset: string;
  status: "open" | "closed";
};

export type SessionUser = {
  name: string;
  email: string;
};

export function dateKey(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function formatTradeDate(tradedOn: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${tradedOn}T12:00:00.000Z`));
}
