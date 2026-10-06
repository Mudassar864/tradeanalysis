import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { getDb, mongoClient, mongoUsesTransactions } from "@/lib/mongodb";

const secret = process.env.BETTER_AUTH_SECRET;

if (!secret && process.env.NODE_ENV === "production") {
  throw new Error("BETTER_AUTH_SECRET is required in production.");
}

export const auth = betterAuth({
  appName: "Tradebook",
  baseURL: process.env.BETTER_AUTH_URL,
  secret,
  database: mongodbAdapter(getDb(), {
    client: mongoClient,
    transaction: mongoUsesTransactions(),
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 14,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  rateLimit: {
    enabled: true,
    storage: "database",
    window: 60,
    max: 30,
  },
  plugins: [nextCookies()],
});
