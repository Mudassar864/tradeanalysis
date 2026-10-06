import { ObjectId, type Filter } from "mongodb";
import { tradeResult } from "@/lib/pnl";
import { getDb } from "@/lib/mongodb";
import type { Side, TradeSource, TradeView } from "@/lib/types";

type StoredSide = Side | "long" | "short";

type TradeDoc = {
  _id: ObjectId;
  userId: string;
  symbol: string;
  side: StoredSide;
  asset?: string;
  status?: "open" | "closed";
  quantity: number;
  pointValue?: number;
  entryPrice?: number;
  exitPrice?: number | null;
  stopPrice?: number | null;
  fees?: number;
  strategy?: string;
  notes?: string;
  pnl?: number | null;
  tradedOn?: string;
  entryAt: Date;
  exitAt?: Date | null;
  source: TradeSource;
  createdAt: Date;
  updatedAt: Date;
};

export type TradeWrite = {
  symbol: string;
  side: Side;
  pnl: number;
  tradedOn: string;
};

let indexesReady = false;

async function collection() {
  const db = getDb();
  const trades = db.collection<TradeDoc>("trades");
  if (!indexesReady) {
    await trades.createIndexes([
      { key: { userId: 1, entryAt: -1 } },
      { key: { userId: 1, status: 1 } },
    ]);
    indexesReady = true;
  }
  return trades;
}

function normalizeSide(side: StoredSide): Side {
  return side === "sell" || side === "short" ? "sell" : "buy";
}

function toView(doc: TradeDoc): TradeView {
  const tradedOn = doc.tradedOn ?? doc.entryAt.toISOString().slice(0, 10);
  const result = tradeResult({
    side: doc.side,
    status: doc.status ?? "closed",
    quantity: doc.quantity,
    pointValue: doc.pointValue ?? 1,
    entryPrice: doc.entryPrice ?? 0,
    exitPrice: doc.exitPrice ?? null,
    stopPrice: doc.stopPrice ?? null,
    fees: doc.fees ?? 0,
    pnl: doc.pnl,
  });

  return {
    id: doc._id.toHexString(),
    symbol: doc.symbol,
    side: normalizeSide(doc.side),
    lots: doc.quantity,
    tradedOn,
    entryAt: doc.entryAt.toISOString(),
    source: doc.source,
    fees: doc.fees ?? 0,
    strategy: doc.strategy ?? "",
    asset: doc.asset ?? "forex",
    status: doc.status ?? "closed",
    ...result,
  };
}

export async function listTrades(userId: string) {
  const trades = await collection();
  const docs = await trades.find({ userId }).sort({ entryAt: -1 }).toArray();
  return docs
    .map(toView)
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === "open" ? -1 : 1;
      return b.entryAt.localeCompare(a.entryAt);
    });
}

export async function saveTrade(userId: string, input: TradeWrite & { id?: string }) {
  const trades = await collection();
  const now = new Date();

  const entryAt = new Date(`${input.tradedOn}T12:00:00.000Z`);
  const fields = {
    symbol: input.symbol,
    side: input.side,
    quantity: 1,
    pnl: input.pnl,
    tradedOn: input.tradedOn,
    entryAt,
    exitAt: entryAt,
    status: "closed" as const,
    asset: "forex",
    pointValue: 1,
    entryPrice: 0,
    exitPrice: null,
    stopPrice: null,
    fees: 0,
    strategy: "",
    notes: "",
    source: "manual" as const,
    updatedAt: now,
  };

  if (input.id) {
    if (!ObjectId.isValid(input.id)) {
      throw new Error("That trade could not be found.");
    }
    const _id = new ObjectId(input.id);
    const existing = await trades.findOne({ _id, userId });
    if (!existing) throw new Error("That trade could not be found.");
    await trades.updateOne({ _id, userId }, { $set: fields });
    return;
  }

  await trades.insertOne({
    _id: new ObjectId(),
    userId,
    ...fields,
    createdAt: now,
  });
}

export async function deleteTrade(userId: string, id: string) {
  if (!ObjectId.isValid(id)) return;
  const trades = await collection();
  await trades.deleteOne({ _id: new ObjectId(id), userId });
}

export async function replaceSampleJournal(
  userId: string,
  samples: Array<Omit<TradeDoc, "_id" | "userId" | "createdAt" | "updatedAt">>,
) {
  const trades = await collection();
  const filter: Filter<TradeDoc> = { userId, source: "sample" };
  await trades.deleteMany(filter);
  if (samples.length === 0) return;
  const now = new Date();
  await trades.insertMany(
    samples.map((sample) => ({
      _id: new ObjectId(),
      userId,
      ...sample,
      createdAt: now,
      updatedAt: now,
    })),
  );
}

export function filterTrades(trades: TradeView[], filters: { q?: string; side?: string }) {
  const query = filters.q?.trim().toLowerCase() ?? "";
  const side = filters.side === "long" ? "buy" : filters.side === "short" ? "sell" : filters.side;
  return trades.filter((trade) => {
    if ((side === "buy" || side === "sell") && trade.side !== side) return false;
    if (!query) return true;
    return trade.symbol.toLowerCase().includes(query);
  });
}
