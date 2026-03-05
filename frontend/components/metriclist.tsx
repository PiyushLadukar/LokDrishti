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
    <div style={{ display: "grid", gap: "2px" }}>
      {metrics.map((m) => (
        <div
          key={m.num}
          style={{
            display: "flex", alignItems: "center", gap: "20px",
            padding: "18px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            transition: "background 0.15s",
            cursor: "default",
          }}
          onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "rgba(255,107,0,0.05)"}
          onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = "transparent"}
        >
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "13px", color: "#FF6B00",
            fontWeight: 700, minWidth: "24px", opacity: 0.6,
          }}>
            {m.num}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "white", marginBottom: "2px" }}>{m.name}</div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>{m.desc}</div>
          </div>
          <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "18px" }}>→</span>
        </div>
      ))}
    </div>
  );
}