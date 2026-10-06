"use client";

import { useMemo, useState } from "react";
import { TradePopup } from "@/components/trade-popup";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/format";
import { dateKey, type TradeView } from "@/lib/types";
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
          const net = profit + loss;
          return (
            <div
              key={day}
              role="gridcell"
              aria-selected={isSelected}
              aria-current={day === today ? "date" : undefined}
              className={cn(
                "flex min-h-20 flex-col rounded-xl border px-1.5 py-1.5 text-sm",
                net > 0 && "border-profit bg-profit text-[#14261c]",
                net < 0 && "border-loss bg-loss text-[#2a1210]",
                net === 0 && (isSelected ? "border-primary bg-primary/10" : "border-transparent bg-background hover:border-border"),
                net === 0 && day === today && !isSelected && "border-border",
                isSelected && net !== 0 && "ring-2 ring-primary ring-offset-2 ring-offset-card",
                future && "opacity-35",
              )}
            >
              <button
                type="button"
                disabled={future}
                onClick={() => {
                  setSelected(day);
                  setPopupOpen(false);
                }}
                className="flex flex-1 flex-col items-start text-left disabled:cursor-not-allowed"
              >
                <span>{Number(day.slice(-2))}</span>
                {profit > 0 ? (
                  <span className="mt-auto font-mono text-[11px] tabular-nums">{formatMoney(profit)}</span>
                ) : null}
                {loss < 0 ? (
                  <span className="font-mono text-[11px] tabular-nums">{formatMoney(loss)}</span>
                ) : null}
              </button>
              {isSelected ? (
                <button
                  type="button"
                  onClick={() => setPopupOpen(true)}
                  aria-label="Add trade"
                  className="mt-1 w-full rounded-full bg-primary px-1 py-1 text-[10px] font-medium leading-none text-primary-foreground"
                >
                  Add
                </button>
              ) : null}
            </div>
          );
        })}
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
