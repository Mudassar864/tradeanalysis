import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/tradeanalysis";

const globalForMongo = globalThis as typeof globalThis & {
  __tradebookMongo?: MongoClient;
};

function createClient() {
  return new MongoClient(uri, {
    serverSelectionTimeoutMS: 4000,
  });
}

export const mongoClient = globalForMongo.__tradebookMongo ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForMongo.__tradebookMongo = mongoClient;
}

export function getDb(): Db {
  const name = process.env.MONGODB_DB;
  return name ? mongoClient.db(name) : mongoClient.db();
}

export function mongoUsesTransactions() {
  return uri.startsWith("mongodb+srv://") || process.env.MONGODB_TRANSACTIONS === "true";
}
