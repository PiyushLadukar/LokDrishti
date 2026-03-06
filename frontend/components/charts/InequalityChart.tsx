"use client";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, ReferenceLine, Cell,
} from "recharts";

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const val: number = d.performance_std;
  const risk = val >= 0.3 ? "HIGH" : val >= 0.15 ? "MED" : "LOW";
  const riskColor = val >= 0.3 ? "#F87171" : val >= 0.15 ? "#FBBF24" : "#34D399";
  return (
    <div style={{
      background: "#0A1628", borderRadius: "12px", padding: "14px 18px",
      border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 12px 40px rgba(0,0,0,0.5)", minWidth: "190px",
    }}>
      <div style={{ fontSize: "14px", fontWeight: 700, color: "white", marginBottom: "10px", borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: "8px" }}>{d.state}</div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>Std Deviation</span>
        <span style={{ fontSize: "13px", fontWeight: 700, color: "#F87171" }}>{val.toFixed(4)}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>Inequality Risk</span>
        <span style={{ fontSize: "12px", fontWeight: 800, color: riskColor, background: `${riskColor}18`, padding: "1px 8px", borderRadius: "4px" }}>{risk}</span>
      </div>
    </div>
  );
}

export default function InequalityChart({ data }: { data: any[] }) {
  const sorted = [...data].sort((a, b) => b.performance_std - a.performance_std);
  const top15 = sorted.slice(0, 15);
  const avg = data.reduce((s, d) => s + d.performance_std, 0) / data.length;
  const max = sorted[0]?.performance_std || 1;

  const getColor = (val: number) => {
    const r = val / max;
    if (r >= 0.75) return "#EF4444";
    if (r >= 0.5)  return "#F87171";
    if (r >= 0.3)  return "#FBBF24";
    return "#34D399";
  };

  return (
    <div style={{ background: "white", borderRadius: "20px", border: "1px solid #E2D9CE", overflow: "hidden", boxShadow: "0 4px 24px rgba(10,22,40,0.07)" }}>
      <div style={{ padding: "22px 28px 18px", borderBottom: "1px solid #F0E8DF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0A1628", marginBottom: "3px" }}>Performance Inequality Index</h3>
          <p style={{ fontSize: "11px", color: "#8A9AB0" }}>Higher = more inequality between MPs in that state</p>
        </div>
        <div style={{ display: "flex", gap: "14px" }}>
          {[{ c: "#EF4444", l: "High risk" }, { c: "#FBBF24", l: "Med" }, { c: "#34D399", l: "Balanced" }].map(x => (
            <div key={x.l} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div style={{ width: "9px", height: "9px", borderRadius: "2px", background: x.c }} />
              <span style={{ fontSize: "11px", color: "#8A9AB0" }}>{x.l}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "20px 28px 24px", height: "360px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={top15} margin={{ top: 10, right: 10, bottom: 52, left: 0 }} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="2 4" stroke="#F0E8DF" vertical={false} />
            <XAxis dataKey="state" tick={{ fontSize: 10, fill: "#9AA4B2", fontFamily: "'DM Sans'" }} angle={-32} textAnchor="end" interval={0} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#9AA4B2" }} axisLine={false} tickLine={false} tickFormatter={v => v.toFixed(2)} width={40} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(239,68,68,0.04)", radius: 4 }} />
            <ReferenceLine y={avg} stroke="#FBBF24" strokeDasharray="5 3" strokeWidth={1.5}
              label={{ value: `Avg ${avg.toFixed(3)}`, position: "insideTopRight", fill: "#FBBF24", fontSize: 10, fontWeight: 700, dx: -4 }} />
            <Bar dataKey="performance_std" radius={[6, 6, 0, 0]} maxBarSize={36}>
              {top15.map(entry => <Cell key={entry.state} fill={getColor(entry.performance_std)} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ padding: "12px 28px", background: "#FAFAF7", borderTop: "1px solid #F0E8DF", display: "flex", gap: "28px" }}>
        <span style={{ fontSize: "11px", color: "#8A9AB0" }}>Avg spread <strong style={{ color: "#FBBF24" }}>{avg.toFixed(4)}</strong></span>
        <span style={{ fontSize: "11px", color: "#8A9AB0" }}>Most unequal <strong style={{ color: "#EF4444" }}>{sorted[0]?.state}</strong></span>
        <span style={{ fontSize: "11px", color: "#8A9AB0" }}>Most equal <strong style={{ color: "#34D399" }}>{sorted[sorted.length - 1]?.state}</strong></span>
      </div>
    </div>
  );
}