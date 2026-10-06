import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { listTrades } from "@/lib/trades";

function cell(value: string | number | null) {
  const raw = value == null ? "" : String(value);
  const guarded = /^[=+\-@]/.test(raw) ? `'${raw}` : raw;
  return `"${guarded.replaceAll('"', '""')}"`;
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const trades = await listTrades(session.user.id);
  const header = ["pair", "side", "result", "date"];

  const lines = trades.map((trade) =>
    [trade.symbol, trade.side, trade.netPnl, trade.tradedOn]
      .map((value) => cell(value))
      .join(","),
  );

  const body = [header.join(","), ...lines].join("\n");
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="tradebook-journal.csv"',
      "Cache-Control": "no-store",
    },
  });
}
