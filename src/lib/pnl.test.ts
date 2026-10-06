import assert from "node:assert/strict";
import test from "node:test";
import { summarize, tradeResult } from "./pnl.ts";

test("long and short net of fees", () => {
  const long = tradeResult({
    side: "long",
    status: "closed",
    quantity: 80,
    pointValue: 1,
    entryPrice: 228.4,
    exitPrice: 231.15,
    stopPrice: 226.1,
    fees: 1.05,
  });
  assert.equal(long.grossPnl, 220);
  assert.equal(long.netPnl, 218.95);

  const short = tradeResult({
    side: "short",
    status: "closed",
    quantity: 1,
    pointValue: 20,
    entryPrice: 18640,
    exitPrice: 18710,
    stopPrice: 18670,
    fees: 4.5,
  });
  assert.equal(short.netPnl, -1404.5);
  assert.equal(short.rMultiple, -1404.5 / (30 * 20));
});

test("a logged profit or loss is used as entered", () => {
  const win = tradeResult({
    side: "buy",
    status: "closed",
    quantity: 0.2,
    pointValue: 1,
    entryPrice: 0,
    exitPrice: null,
    stopPrice: null,
    fees: 0,
    pnl: 150,
  });
  assert.equal(win.netPnl, 150);

  const loss = tradeResult({
    side: "sell",
    status: "closed",
    quantity: 0.5,
    pointValue: 1,
    entryPrice: 0,
    exitPrice: null,
    stopPrice: null,
    fees: 0,
    pnl: -40,
  });
  assert.equal(loss.netPnl, -40);
});

test("open trades have no realized P&L", () => {
  const open = tradeResult({
    side: "long",
    status: "open",
    quantity: 10,
    pointValue: 1,
    entryPrice: 100,
    exitPrice: null,
    stopPrice: 95,
    fees: 0,
  });
  assert.equal(open.netPnl, null);
  assert.equal(open.rMultiple, null);
});

test("drawdown is the peak-to-trough drop", () => {
  const summary = summarize([
    fill("A", 100, "2026-01-01T00:00:00.000Z"),
    fill("B", -40, "2026-01-02T00:00:00.000Z"),
    fill("C", 10, "2026-01-03T00:00:00.000Z"),
    fill("D", -90, "2026-01-04T00:00:00.000Z"),
  ]);
  assert.equal(summary.net, -20);
  assert.equal(summary.maxDrawdown, 120);
  assert.equal(summary.wins, 2);
  assert.equal(summary.winRate, 0.5);
  assert.equal(summary.profitFactor, 110 / 130);
  assert.equal(summary.streak?.kind, "loss");
  assert.equal(summary.streak?.count, 1);
});

function fill(symbol: string, net: number, exitAt: string) {
  return {
    symbol,
    side: "long" as const,
    strategy: "Test",
    asset: "equity",
    entryAt: "2026-01-01T00:00:00.000Z",
    exitAt,
    grossPnl: net,
    netPnl: net,
    fees: 0,
    rMultiple: null,
  };
}
