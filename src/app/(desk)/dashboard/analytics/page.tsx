import Link from "next/link";
import { BreakdownTable } from "@/components/breakdown-table";
import { DailyChart } from "@/components/charts";
import { formatFactor, formatMoney, formatPercent, pnlClass } from "@/lib/format";
import { groupFills, summarize, toFill, weekdayRows } from "@/lib/pnl";
import { requireSession } from "@/lib/session";
import { listTrades } from "@/lib/trades";
import { cn } from "@/lib/utils";

export const metadata = { title: "Analytics" };

export default async function AnalyticsPage() {
  const session = await requireSession();
  const trades = await listTrades(session.user.id);

  const fills = trades.flatMap((trade) => {
    const fill = toFill(trade);
    return fill ? [fill] : [];
  });
  const summary = summarize(fills);
  const weekdays = weekdayRows(fills);

  if (fills.length === 0) {
    return (
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-primary">Analytics</p>
        <h1 className="mt-2 text-3xl tracking-tight">Nothing closed yet</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          Log a trade from the calendar. Pick the day, the pair, and whether it was a profit or a loss.
        </p>
        <Link href="/dashboard/journal" className="mt-5 inline-flex rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">
          Go to journal
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-primary">Analytics</p>
        <h1 className="mt-2 text-3xl tracking-tight">Where the P&L came from</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {summary.count} trades. Weekday totals use the date you picked on the calendar.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Average win" value={formatMoney(summary.avgWin)} tone={pnlClass(summary.avgWin)} />
        <Stat label="Average loss" value={formatMoney(summary.avgLoss)} tone={pnlClass(summary.avgLoss)} />
        <Stat label="Payoff" value={summary.payoff == null ? "—" : summary.payoff.toFixed(2)} detail="Avg win ÷ avg loss" />
        <Stat label="Profit factor" value={formatFactor(summary.profitFactor, summary.unboundedFactor)} />
        <Stat label="Best" value={summary.best ? `${summary.best.symbol} ${formatMoney(summary.best.netPnl)}` : "—"} tone="text-profit" />
        <Stat label="Worst" value={summary.worst ? `${summary.worst.symbol} ${formatMoney(summary.worst.netPnl)}` : "—"} tone="text-loss" />
        <Stat label="Win rate" value={formatPercent(summary.winRate)} detail={`${summary.scratches} scratches`} />
        <Stat label="Net" value={formatMoney(summary.net)} tone={pnlClass(summary.net)} />
      </section>

      <section className="rounded-2xl border border-border bg-card p-4">
        <h2 className="px-1 text-sm">Weekday net</h2>
        <DailyChart points={weekdays.map((day) => ({ label: day.name.slice(0, 3), net: day.net }))} />
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <BreakdownTable title="By pair" rows={groupFills(fills, (fill) => fill.symbol)} />
        <BreakdownTable title="By side" rows={groupFills(fills, (fill) => (fill.side === "buy" ? "Buy" : "Sell"))} />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: string;
  detail?: string;
  tone?: string;
}) {
  return (
    <article className="rounded-2xl border border-border bg-card px-4 py-3">
      <h2 className="text-xs uppercase tracking-wide text-muted-foreground">{label}</h2>
      <p className={cn("mt-2 font-mono text-lg tabular-nums", tone)}>{value}</p>
      {detail ? <p className="mt-1 text-xs text-muted-foreground">{detail}</p> : null}
    </article>
  );
}
