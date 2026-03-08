"use client";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, ReferenceLine, Cell,
} from "recharts";

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const val: number = d.party_dominance_index;
  return (
    <div style={{
      background: "#0A1628", borderRadius: "12px", padding: "14px 18px",
      border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 12px 40px rgba(0,0,0,0.5)", minWidth: "190px",
    }}>
      <div style={{ fontSize: "14px", fontWeight: 700, color: "white", marginBottom: "10px", borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: "8px" }}>{d.party}</div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>Dominance Index</span>
        <span style={{ fontSize: "13px", fontWeight: 700, color: "#60A5FA" }}>{val.toFixed(4)}</span>
      </div>
      {d.mp_count && (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>MP Count</span>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "white" }}>{d.mp_count}</span>
        </div>
      )}
    </div>
  );
}

export default function PartyDominanceChart({ data }: { data: any[] }) {
  const sorted = [...data].sort((a, b) => b.party_dominance_index - a.party_dominance_index);
  const top12 = sorted.slice(0, 12);
  const avg = data.reduce((s, d) => s + d.party_dominance_index, 0) / data.length;
  const max = sorted[0]?.party_dominance_index || 1;

  const getColor = (val: number) => {
    const r = val / max;
    if (r >= 0.75) return "#3B82F6";
    if (r >= 0.5)  return "#60A5FA";
    if (r >= 0.3)  return "#93C5FD";
    return "#BFDBFE";
  };

  return (
    <div style={{ background: "white", borderRadius: "20px", border: "1px solid #E2D9CE", overflow: "hidden", boxShadow: "0 4px 24px rgba(10,22,40,0.07)" }}>
      <div style={{ padding: "22px 28px 18px", borderBottom: "1px solid #F0E8DF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0A1628", marginBottom: "3px" }}>Party Dominance Index</h3>
          <p style={{ fontSize: "11px", color: "#8A9AB0" }}>Top 12 parties · sorted by composite dominance score</p>
        </div>
        <div style={{ display: "flex", gap: "14px" }}>
          {[{ c: "#3B82F6", l: "Strong" }, { c: "#93C5FD", l: "Mid" }, { c: "#BFDBFE", l: "Weak" }].map(x => (
            <div key={x.l} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div style={{ width: "9px", height: "9px", borderRadius: "2px", background: x.c }} />
              <span style={{ fontSize: "11px", color: "#8A9AB0" }}>{x.l}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "20px 28px 24px", height: "360px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={top12} margin={{ top: 10, right: 10, bottom: 52, left: 0 }} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="2 4" stroke="#F0E8DF" vertical={false} />
            <XAxis dataKey="party" tick={{ fontSize: 10, fill: "#9AA4B2", fontFamily: "'DM Sans'" }} angle={-32} textAnchor="end" interval={0} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#9AA4B2" }} axisLine={false} tickLine={false} tickFormatter={v => v.toFixed(2)} width={40} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(96,165,250,0.04)", radius: 4 }} />
            <ReferenceLine y={avg} stroke="#60A5FA" strokeDasharray="5 3" strokeWidth={1.5}
              label={{ value: `Avg ${avg.toFixed(3)}`, position: "insideTopRight", fill: "#60A5FA", fontSize: 10, fontWeight: 700, dx: -4 }} />
            <Bar dataKey="party_dominance_index" radius={[6, 6, 0, 0]} maxBarSize={36}>
              {top12.map(entry => <Cell key={entry.party} fill={getColor(entry.party_dominance_index)} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ padding: "12px 28px", background: "#FAFAF7", borderTop: "1px solid #F0E8DF", display: "flex", gap: "28px" }}>
        <span style={{ fontSize: "11px", color: "#8A9AB0" }}>National avg <strong style={{ color: "#60A5FA" }}>{avg.toFixed(4)}</strong></span>
        <span style={{ fontSize: "11px", color: "#8A9AB0" }}>Leader <strong style={{ color: "#3B82F6" }}>{sorted[0]?.party}</strong></span>
        <span style={{ fontSize: "11px", color: "#8A9AB0" }}>Weakest <strong style={{ color: "#BFDBFE" }}>{sorted[sorted.length - 1]?.party}</strong></span>
      </div>
    </div>
  );
}