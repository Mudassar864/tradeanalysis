"use client";

import { useMemo, useState } from "react";
import { TradePopup } from "@/components/trade-popup";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/format";
import { dateKey, formatTradeDate, type TradeView } from "@/lib/types";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function MonthBoard({ trades }: { trades: TradeView[] }) {
  const today = dateKey(new Date());
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [selected, setSelected] = useState<string | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);

  const byDay = useMemo(() => {
    const map = new Map<string, TradeView[]>();
    for (const trade of trades) {
      map.set(trade.tradedOn, [...(map.get(trade.tradedOn) ?? []), trade]);
    }
    return map;
  }, [trades]);

  const cells = useMemo(() => buildMonth(cursor.year, cursor.month), [cursor]);
  const monthLabel = new Date(cursor.year, cursor.month, 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
  function shiftMonth(delta: number) {
    setCursor((current) => {
      const next = new Date(current.year, current.month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
    setSelected(null);
    setPopupOpen(false);
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg">{monthLabel}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => shiftMonth(-1)} aria-label="Previous month">
            Prev
          </Button>
          <Button variant="outline" size="sm" onClick={() => shiftMonth(1)} aria-label="Next month">
            Next
          </Button>
        </div>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">Click a date, then add the trade for that day.</p>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs uppercase tracking-wide text-muted-foreground">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1" role="grid" aria-label={monthLabel}>
        {cells.map((day, index) => {
          if (!day) return <div key={`empty-${index}`} />;
          const future = day > today;
          const isSelected = day === selected;
          const dayTrades = byDay.get(day) ?? [];
          const profit = dayTrades.reduce((sum, trade) => sum + ((trade.netPnl ?? 0) > 0 ? (trade.netPnl ?? 0) : 0), 0);
          const loss = dayTrades.reduce((sum, trade) => sum + ((trade.netPnl ?? 0) < 0 ? (trade.netPnl ?? 0) : 0), 0);
          return (
            <button
              key={day}
              type="button"
              role="gridcell"
              disabled={future}
              aria-current={day === today ? "date" : undefined}
              aria-selected={isSelected}
              onClick={() => {
                setSelected(day);
                setPopupOpen(false);
              }}
              className={cn(
                "flex min-h-20 flex-col items-start rounded-xl border px-2 py-1.5 text-left text-sm disabled:cursor-not-allowed disabled:opacity-35",
                isSelected ? "border-primary bg-primary/10" : "border-transparent bg-background hover:border-border",
                day === today && !isSelected && "border-border",
              )}
            >
              <span>{Number(day.slice(-2))}</span>
              {profit > 0 ? (
                <span className="mt-auto font-mono text-[11px] tabular-nums text-profit">{formatMoney(profit)}</span>
              ) : null}
              {loss < 0 ? (
                <span className="font-mono text-[11px] tabular-nums text-loss">{formatMoney(loss)}</span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex min-h-10 items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{selected ? formatTradeDate(selected) : "No date selected."}</p>
        {selected ? (
          <Button onClick={() => setPopupOpen(true)}>Add trade</Button>
        ) : null}
      </div>

      {selected ? (
        <TradePopup open={popupOpen} date={selected} onClose={() => setPopupOpen(false)} />
      ) : null}
    </section>
  );
}

function buildMonth(year: number, month: number) {
  const firstWeekday = new Date(year, month, 1).getDay();
  const pad = (firstWeekday + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const cells: Array<string | null> = Array.from({ length: pad }, () => null);
  for (let day = 1; day <= days; day += 1) {
    cells.push(dateKey(new Date(year, month, day)));
  }
  return cells;
}
