"use client";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, ReferenceLine, Cell,
} from "recharts";

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const val: number = d.imbalance_score;
  const dir = val >= 0 ? "Overperforming" : "Underperforming";
  const dirColor = val >= 0 ? "#34D399" : "#F87171";
  return (
    <div style={{
      background: "#0A1628", borderRadius: "12px", padding: "14px 18px",
      border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 12px 40px rgba(0,0,0,0.5)", minWidth: "190px",
    }}>
      <div style={{ fontSize: "14px", fontWeight: 700, color: "white", marginBottom: "10px", borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: "8px" }}>{d.state}</div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>Imbalance Score</span>
        <span style={{ fontSize: "13px", fontWeight: 700, color: dirColor }}>{val.toFixed(4)}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>Status</span>
        <span style={{ fontSize: "12px", fontWeight: 700, color: dirColor }}>{dir}</span>
      </div>
    </div>
  );
}

export default function ImbalanceChart({ data }: { data: any[] }) {
  const sorted = [...data].sort((a, b) => b.imbalance_score - a.imbalance_score);
  const top15 = sorted.slice(0, 15);

  const getColor = (val: number) => {
    if (val >= 0.1)  return "#22C55E";
    if (val >= 0)    return "#86EFAC";
    if (val >= -0.1) return "#FCA5A5";
    return "#EF4444";
  };

  return (
    <div style={{ background: "white", borderRadius: "20px", border: "1px solid #E2D9CE", overflow: "hidden", boxShadow: "0 4px 24px rgba(10,22,40,0.07)" }}>
      <div style={{ padding: "22px 28px 18px", borderBottom: "1px solid #F0E8DF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0A1628", marginBottom: "3px" }}>Representation Imbalance</h3>
          <p style={{ fontSize: "11px", color: "#8A9AB0" }}>Above zero = overperforming vs seat share expectation</p>
        </div>
        <div style={{ display: "flex", gap: "14px" }}>
          {[{ c: "#22C55E", l: "Over" }, { c: "#EF4444", l: "Under" }].map(x => (
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
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(34,197,94,0.04)", radius: 4 }} />
            <ReferenceLine y={0} stroke="#8A9AB0" strokeWidth={1.5} />
            <Bar dataKey="imbalance_score" radius={[6, 6, 0, 0]} maxBarSize={36}>
              {top15.map(entry => <Cell key={entry.state} fill={getColor(entry.imbalance_score)} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ padding: "12px 28px", background: "#FAFAF7", borderTop: "1px solid #F0E8DF", display: "flex", gap: "28px" }}>
        <span style={{ fontSize: "11px", color: "#8A9AB0" }}>Most over <strong style={{ color: "#22C55E" }}>{sorted[0]?.state}</strong></span>
        <span style={{ fontSize: "11px", color: "#8A9AB0" }}>Most under <strong style={{ color: "#EF4444" }}>{sorted[sorted.length - 1]?.state}</strong></span>
      </div>
    </div>
  );
}