# Tradebook

A private trade-analysis desk. You sign in, record trades, and read the statistics that come from that journal: net P&L, win rate, profit factor, expectancy, drawdown, and breakdowns by symbol, strategy, side, and asset.

Accounts, sessions, and trades are stored in MongoDB. Authentication is [Better Auth](https://better-auth.com) with email and password. Passwords are hashed by the auth library. Each desk can only read and change its own trades.

## What you need

- Node.js 22+
- MongoDB running locally, or a MongoDB Atlas connection string

## Setup

```bash
npm install
cp .env.example .env.local
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Set `BETTER_AUTH_SECRET` to a long random value. For Atlas, set `MONGODB_URI` to the `mongodb+srv://` string. The database name defaults to `tradeanalysis`.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), create an account, then add a trade or load the sample journal.

## Desk

- **Overview** — a month calendar. Click a day, then enter the pair, buy or sell, and the profit or loss. Pair names are searchable.
- **Journal** — the list of those records, where you can update or delete them
- **Analytics** — payoff and P&L by pair, side, and weekday

Each trade stores the result you enter. Profit is a gain and loss is a loss. The calendar totals those amounts for the day.

Sample trades are labeled and can be removed without touching trades you entered yourself.

## Scripts

- `npm run dev` — local app
- `npm run build` — production build
- `npm test` — P&L and drawdown checks
