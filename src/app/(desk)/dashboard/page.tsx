import { MonthBoard } from "@/components/month-board";
import { requireSession } from "@/lib/session";
import { listTrades } from "@/lib/trades";

export const metadata = { title: "Overview" };

export default async function OverviewPage() {
  const session = await requireSession();
  const trades = await listTrades(session.user.id);

  return (
    <div className="space-y-4">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-primary">Overview</p>
        <h1 className="mt-2 text-3xl tracking-tight">Calendar</h1>
      </header>
      <MonthBoard trades={trades} />
    </div>
  );
}
