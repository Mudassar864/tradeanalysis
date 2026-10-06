"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatMoney } from "@/lib/format";

const tooltipStyle = {
  background: "#12151c",
  border: "1px solid rgba(236, 231, 220, 0.12)",
  borderRadius: 12,
  color: "#ece7dc",
};

export function EquityChart({ points }: { points: { label: string; equity: number }[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e4c27a" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#e4c27a" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(236,231,220,0.08)" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: "#9b9588", fontSize: 12 }} axisLine={false} tickLine={false} minTickGap={24} />
          <YAxis
            tick={{ fill: "#9b9588", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={72}
            tickFormatter={(value: number) => formatMoney(value)}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value) => [formatMoney(Number(value)), "Net P&L"]}
          />
          <Area type="monotone" dataKey="equity" stroke="#e4c27a" fill="url(#equityFill)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DailyChart({ points }: { points: { label: string; net: number }[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={points} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(236,231,220,0.08)" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: "#9b9588", fontSize: 12 }} axisLine={false} tickLine={false} minTickGap={20} />
          <YAxis
            tick={{ fill: "#9b9588", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={72}
            tickFormatter={(value: number) => formatMoney(value)}
          />
          <Tooltip contentStyle={tooltipStyle} formatter={(value) => [formatMoney(Number(value)), "Day"]} />
          <Bar dataKey="net" radius={[4, 4, 0, 0]}>
            {points.map((point) => (
              <Cell key={point.label} fill={point.net >= 0 ? "#7dcaa0" : "#e38b7b"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
