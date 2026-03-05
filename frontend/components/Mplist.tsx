"use client";
import Link from "next/link";
import { MP } from "@/types";

function LCIBadge({ score }: { score: number }) {
  const color = score >= 0.6 ? "#16A34A" : score >= 0.3 ? "#FF6B00" : "#DC2626";
  const label = score >= 0.6 ? "High" : score >= 0.3 ? "Mid" : "Low";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "4px",
      padding: "2px 8px", borderRadius: "100px",
      background: `${color}15`, border: `1px solid ${color}30`,
      fontSize: "11px", fontWeight: 700, color,
    }}>
      {label}
    </span>
  );
}

export default function MPList({ mps }: { mps: MP[] }) {
  if (mps.length === 0) {
    return (
      <div style={{
        textAlign: "center", padding: "80px 40px",
        background: "white", borderRadius: "16px",
        border: "1px dashed #E8DDD0",
      }}>
        <div style={{ fontSize: "40px", marginBottom: "16px" }}>⚠</div>
        <p style={{ color: "#8A9AB0", fontSize: "15px", marginBottom: "8px" }}>
          Could not connect to API
        </p>
        <code style={{ color: "#FF6B00", fontSize: "13px" }}>
          Make sure Flask is running at http://127.0.0.1:5000
        </code>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: "10px" }}>
      {mps.map((mp, i) => {
        const initials = mp.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("");
        return (
          <Link key={mp.name} href={`/mp/${encodeURIComponent(mp.name)}`} style={{ textDecoration: "none" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "48px 52px 1fr auto auto",
                alignItems: "center",
                gap: "16px",
                padding: "16px 20px",
                background: "white",
                borderRadius: "12px",
                border: "1px solid #F0E8DF",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#FF6B00";
                (e.currentTarget as HTMLElement).style.transform = "translateX(4px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(255,107,0,0.12)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#F0E8DF";
                (e.currentTarget as HTMLElement).style.transform = "translateX(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              {/* Rank */}
              <div style={{
                width: "40px", height: "40px", borderRadius: "10px",
                background: i < 3 ? "#FF6B00" : "#F5EDE0",
                color: i < 3 ? "white" : "#8A9AB0",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 800, fontSize: "15px",
              }}>
                {i + 1}
              </div>

              {/* Avatar */}
              <div style={{
                width: "44px", height: "44px", borderRadius: "50%",
                background: "linear-gradient(135deg, #FF6B00, #0057A8)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontWeight: 700, fontSize: "14px",
              }}>
                {initials}
              </div>

              {/* Name + party */}
              <div>
                <div style={{ fontWeight: 700, fontSize: "15px", color: "#0A1628" }}>{mp.name}</div>
                <div style={{ fontSize: "12px", color: "#8A9AB0", marginTop: "2px" }}>
                  {mp.party} · {mp.state}
                </div>
              </div>

              {/* Attendance */}
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#0A1628" }}>{mp.attendance}%</div>
                <div style={{ fontSize: "11px", color: "#8A9AB0" }}>Attendance</div>
              </div>

              {/* LCI */}
              <div style={{ textAlign: "right", minWidth: "80px" }}>
                <div style={{ fontSize: "22px", fontWeight: 800, color: "#FF6B00" }}>
                  {mp.LCI_score.toFixed(3)}
                </div>
                <LCIBadge score={mp.LCI_score} />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}