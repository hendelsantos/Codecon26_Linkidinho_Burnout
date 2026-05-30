"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";

const data = [
  { day: "Seg", score: 38 },
  { day: "Ter", score: 44 },
  { day: "Qua", score: 63 },
  { day: "Qui", score: 58 },
  { day: "Sex", score: 79 },
  { day: "Hoje", score: 92 },
];

export function BurnoutChart() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="mt-5 h-56 w-full rounded-[20px] bg-white/4" />;
  }

  return (
    <div className="mt-5 h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="burnoutGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8257FF" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#FF6B2C" stopOpacity={0.12} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "#9f96a9", fontSize: 12 }} />
          <Tooltip
            cursor={{ stroke: "rgba(255,255,255,0.14)", strokeDasharray: "4 4" }}
            contentStyle={{
              background: "#0b1120",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              color: "#fff",
            }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#FF6B2C"
            strokeWidth={3}
            fill="url(#burnoutGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}