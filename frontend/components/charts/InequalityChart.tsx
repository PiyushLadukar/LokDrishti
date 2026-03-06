"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function InequalityChart({ data }: { data: any[] }) {

  const chartData = data.slice(0, 15);

  return (
    <div
      style={{
        width: "100%",
        height: "460px",
        background: "white",
        borderRadius: "14px",
        border: "1px solid #eee",
        padding: "28px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
        marginTop: "20px"
      }}
    >
      <h3
        style={{
          fontSize: "18px",
          fontWeight: 700,
          marginBottom: "20px",
          color: "#0f172a"
        }}
      >
        Performance Inequality Index
      </h3>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={chartData}>

          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

          <XAxis
            dataKey="state"
            tick={{ fontSize: 12 }}
            angle={-25}
            textAnchor="end"
            interval={0}
          />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="performance_std"
            fill="#ef4444"
            radius={[6,6,0,0]}
          />

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}