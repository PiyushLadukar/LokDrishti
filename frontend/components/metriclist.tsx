"use client";

const metrics = [
  { num: "01", name: "LCI Score",               desc: "Composite civic performance index" },
  { num: "02", name: "State Strength Index",     desc: "Weighted state-level performance" },
  { num: "03", name: "Party Dominance Index",    desc: "Concentration of party performance" },
  { num: "04", name: "Inequality Index",         desc: "Spread of MP performance per state" },
  { num: "05", name: "Representation Imbalance", desc: "Over/under-performing states" },
  { num: "06", name: "Silent MP Detector",       desc: "MPs with critically low engagement" },
];

export default function MetricList() {
  return (
    <div style={{
      background: "white",
      borderRadius: "12px",
      border: "1px solid #E2D9CE",
      overflow: "hidden",
      boxShadow: "0 2px 16px rgba(10,22,40,0.06)",
    }}>
      {metrics.map((m, i) => (
        <div
          key={m.num}
          style={{
            display: "flex", alignItems: "center", gap: "16px",
            padding: "16px 20px",
            borderBottom: i < metrics.length - 1 ? "1px solid #F0E8DF" : "none",
            transition: "background 0.15s", cursor: "default",
          }}
          onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "#FFF8F2"}
          onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = "white"}
        >
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "13px", color: "#FF6B00",
            fontWeight: 700, minWidth: "22px", opacity: 0.7,
          }}>
            {m.num}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#0A1628", marginBottom: "2px" }}>{m.name}</div>
            <div style={{ fontSize: "12px", color: "#8A9AB0" }}>{m.desc}</div>
          </div>
          <span style={{ color: "#D4C9B8", fontSize: "16px" }}>→</span>
        </div>
      ))}
    </div>
  );
}