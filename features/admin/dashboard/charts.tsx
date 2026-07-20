"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type ChartsProps = {
  data: Array<{
    month: string;
    completed: number;
    pending: number;
  }>;
};

export function DashboardCharts({ data }: ChartsProps) {
  return (
    <div className="h-72 w-full rounded-3xl border bg-card p-4 shadow-[0_10px_24px_rgba(0,0,0,0.05)]">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="completed" fill="var(--brand)" radius={[6, 6, 0, 0]} />
          <Bar dataKey="pending" fill="#E53935" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
