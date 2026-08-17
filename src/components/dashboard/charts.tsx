"use client";

import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function NodesByTypeChart({ data }: { data: Array<{ name: string; value: number }> }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid stroke="rgba(148,163,184,.12)" />
        <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
        <YAxis stroke="#94a3b8" allowDecimals={false} />
        <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(148,163,184,.2)" }} />
        <Bar dataKey="value" fill="#38bdf8" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CasesByStatusChart({ data }: { data: Array<{ name: string; value: number }> }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={52} outerRadius={92} paddingAngle={4}>
          {["#22c55e", "#f59e0b", "#64748b", "#38bdf8"].map((color) => <Cell key={color} fill={color} />)}
        </Pie>
        <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(148,163,184,.2)" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
