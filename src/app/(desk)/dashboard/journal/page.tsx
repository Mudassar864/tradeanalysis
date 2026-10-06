import { clearSampleJournal, loadSampleJournal } from "@/app/actions/trades";
import { JournalList } from "@/components/journal-list";
import { Button } from "@/components/ui/button";
import { requireSession } from "@/lib/session";
import { listTrades } from "@/lib/trades";

export const metadata = { title: "Journal" };

export default async function JournalPage() {
  const session = await requireSession();
  const trades = await listTrades(session.user.id);
  const hasSample = trades.some((trade) => trade.source === "sample");

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-primary">Journal</p>
          <h1 className="mt-2 text-3xl tracking-tight">Trades</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {trades.length === 0 ? "Records you add on the calendar show up here." : `${trades.length} on the desk`}
          </p>
        </div>
        <a href="/api/trades/export" className="inline-flex h-10 items-center rounded-full border border-border px-4 text-sm">
          Export CSV
        </a>
      </header>

      <JournalList trades={trades} />

      {trades.length === 0 ? (
        <form action={loadSampleJournal}>
          <Button type="submit" variant="outline">
            Load sample journal
          </Button>
        </form>
      ) : null}
      {hasSample ? (
        <form action={clearSampleJournal}>
          <Button type="submit" variant="ghost" size="sm">
            Remove sample trades
          </Button>
        </form>
      ) : null}
    </div>
  );
}
