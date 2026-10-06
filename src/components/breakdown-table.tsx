import { formatFactor, formatMoney, formatPercent, pnlClass } from "@/lib/format";
import type { GroupRow } from "@/lib/pnl";

export function BreakdownTable({ title, rows }: { title: string; rows: GroupRow[] }) {
  const visible = rows.some((row) => row.count > 0);
  return (
    <section className="rounded-2xl border border-border bg-card">
      <h2 className="border-b border-border px-4 py-3 text-sm">{title}</h2>
      {!visible ? (
        <p className="px-4 py-8 text-sm text-muted-foreground">No closed trades in this cut yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-3 py-2 font-medium">Trades</th>
                <th className="px-3 py-2 font-medium">Win rate</th>
                <th className="px-3 py-2 font-medium">Factor</th>
                <th className="px-4 py-2 text-right font-medium">Net</th>
              </tr>
            </thead>
            <tbody>
              {rows
                .filter((row) => row.count > 0)
                .map((row) => (
                  <tr key={row.name} className="border-t border-border/80">
                    <td className="px-4 py-2.5">{row.name}</td>
                    <td className="px-3 py-2.5 font-mono tabular-nums">{row.count}</td>
                    <td className="px-3 py-2.5 font-mono tabular-nums">{formatPercent(row.winRate)}</td>
                    <td className="px-3 py-2.5 font-mono tabular-nums">{formatFactor(row.profitFactor, row.unboundedFactor)}</td>
                    <td className={`px-4 py-2.5 text-right font-mono tabular-nums ${pnlClass(row.net)}`}>{formatMoney(row.net)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
