"use client";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, ReferenceLine, Cell,
} from "recharts";

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const val: number = d.state_strength_index;
  const grade = val >= 0.6 ? "A" : val >= 0.4 ? "B" : val >= 0.25 ? "C" : "D";
  const gradeColor = val >= 0.6 ? "#34D399" : val >= 0.4 ? "#FF6B00" : val >= 0.25 ? "#FBBF24" : "#F87171";
  return (
    <div style={{
      background: "#0A1628", borderRadius: "12px", padding: "14px 18px",
      border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 12px 40px rgba(0,0,0,0.5)", minWidth: "190px",
    }}>
      <div style={{ fontSize: "14px", fontWeight: 700, color: "white", marginBottom: "10px", borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: "8px" }}>{d.state}</div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>SSI Score</span>
        <span style={{ fontSize: "13px", fontWeight: 700, color: "#FF6B00" }}>{val.toFixed(4)}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>Performance Grade</span>
        <span style={{ fontSize: "13px", fontWeight: 800, color: gradeColor, background: `${gradeColor}18`, padding: "1px 8px", borderRadius: "4px" }}>{grade}</span>
      </div>
    </div>
  );
}

export default function StateStrengthChart({ data }: { data: any[] }) {
  const sorted = [...data].sort((a, b) => b.state_strength_index - a.state_strength_index);
  const top15 = sorted.slice(0, 15);
  const avg = data.reduce((s, d) => s + d.state_strength_index, 0) / data.length;
  const max = sorted[0]?.state_strength_index || 1;

  const getColor = (val: number) => {
    const r = val / max;
    if (r >= 0.75) return "#34D399";
    if (r >= 0.5)  return "#FF6B00";
    if (r >= 0.3)  return "#FBBF24";
    return "#F87171";
  };

  return (
    <div style={{ background: "white", borderRadius: "20px", border: "1px solid #E2D9CE", overflow: "hidden", boxShadow: "0 4px 24px rgba(10,22,40,0.07)" }}>
      <div style={{ padding: "22px 28px 18px", borderBottom: "1px solid #F0E8DF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0A1628", marginBottom: "3px" }}>State Strength Index</h3>
          <p style={{ fontSize: "11px", color: "#8A9AB0" }}>Top 15 of {data.length} states · sorted by composite score</p>
        </div>
        <div style={{ display: "flex", gap: "14px" }}>
          {[{ c: "#34D399", l: "High" }, { c: "#FF6B00", l: "Mid" }, { c: "#FBBF24", l: "Low" }, { c: "#F87171", l: "Poor" }].map(x => (
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
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,107,0,0.04)", radius: 4 }} />
            <ReferenceLine y={avg} stroke="#FF6B00" strokeDasharray="5 3" strokeWidth={1.5}
              label={{ value: `Avg ${avg.toFixed(3)}`, position: "insideTopRight", fill: "#FF6B00", fontSize: 10, fontWeight: 700, dx: -4 }} />
            <Bar dataKey="state_strength_index" radius={[6, 6, 0, 0]} maxBarSize={36}>
              {top15.map(entry => <Cell key={entry.state} fill={getColor(entry.state_strength_index)} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ padding: "12px 28px", background: "#FAFAF7", borderTop: "1px solid #F0E8DF", display: "flex", gap: "28px" }}>
        <span style={{ fontSize: "11px", color: "#8A9AB0" }}>National avg <strong style={{ color: "#FF6B00" }}>{avg.toFixed(4)}</strong></span>
        <span style={{ fontSize: "11px", color: "#8A9AB0" }}>Leader <strong style={{ color: "#34D399" }}>{sorted[0]?.state}</strong></span>
        <span style={{ fontSize: "11px", color: "#8A9AB0" }}>Laggard <strong style={{ color: "#F87171" }}>{sorted[sorted.length - 1]?.state}</strong></span>
      </div>
    </div>
  );
}