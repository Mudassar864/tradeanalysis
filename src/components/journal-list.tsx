"use client";

import { useState } from "react";
import { DeleteTradeButton } from "@/components/delete-trade-button";
import { TradePopup } from "@/components/trade-popup";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { formatMoney, pnlClass } from "@/lib/format";
import { formatTradeDate, type Side, type TradeView } from "@/lib/types";
import { cn } from "@/lib/utils";

export function JournalList({ trades }: { trades: TradeView[] }) {
  const [query, setQuery] = useState("");
  const [side, setSide] = useState<"all" | Side>("all");
  const [editing, setEditing] = useState<TradeView | null>(null);

  const visible = trades.filter((trade) => {
    if (side !== "all" && trade.side !== side) return false;
    if (!query.trim()) return true;
    return trade.symbol.toLowerCase().includes(query.trim().toLowerCase());
  });

  return (
    <div className="space-y-3">
      <div className="grid gap-2 md:grid-cols-[1fr_160px]">
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter by pair" aria-label="Filter by pair" />
        <select
          value={side}
          onChange={(event) => setSide(event.target.value as "all" | Side)}
          aria-label="Side"
          className="h-10 rounded-xl border border-border bg-background px-3 text-sm"
        >
          <option value="all">Buy and sell</option>
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {visible.length === 0 ? (
          <p className="px-4 py-10 text-sm text-muted-foreground">
            {trades.length === 0 ? "No trades yet. Add one from the overview calendar." : "No trades match this filter."}
          </p>
        ) : (
          <ul>
            {visible.map((trade) => (
              <li key={trade.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 px-4 py-3 last:border-0">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{trade.symbol}</span>
                    <Badge tone={trade.side === "buy" ? "long" : "short"}>{trade.side}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{formatTradeDate(trade.tradedOn)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("font-mono text-sm tabular-nums", pnlClass(trade.netPnl))}>{formatMoney(trade.netPnl)}</span>
                  <Button variant="ghost" size="sm" onClick={() => setEditing(trade)}>
                    Update
                  </Button>
                  <DeleteTradeButton id={trade.id} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {editing ? (
        <TradePopup open date={editing.tradedOn} trade={editing} onClose={() => setEditing(null)} />
      ) : null}
    </div>
  );
}
