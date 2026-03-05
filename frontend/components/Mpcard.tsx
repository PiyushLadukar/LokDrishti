"use client";
import Link from "next/link";
import { MP } from "@/types";

interface MpCardProps {
  mp: MP;
  rank?: number;
  delay?: number;
}

function getLCIColor(score: number) {
  if (score >= 0.6) return "var(--success)";
  if (score >= 0.3) return "var(--saffron)";
  return "var(--danger)";
}

function getLCILabel(score: number) {
  if (score >= 0.6) return "High";
  if (score >= 0.3) return "Mid";
  return "Low";
}

export default function MpCard({ mp, rank, delay = 0 }: MpCardProps) {
  const lciColor = getLCIColor(mp.LCI_score);
  const initials = mp.name.split(" ").map((w) => w[0]).slice(0, 2).join("");

  return (
    <Link
      href={`/mp/${encodeURIComponent(mp.name)}`}
      style={{ textDecoration: "none" }}
    >
      <div
        className="animate-fade-up"
        style={{
          animationDelay: `${delay}ms`,
          opacity: 0,
          background: "white",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border)",
          padding: "20px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          cursor: "pointer",
          transition: "all 0.2s",
          boxShadow: "var(--shadow-sm)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-md)";
          (e.currentTarget as HTMLDivElement).style.borderColor = "var(--saffron)";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-sm)";
          (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        }}
      >
        {/* Rank badge */}
        {rank && (
          <div style={{
            minWidth: "36px",
            height: "36px",
            borderRadius: "50%",
            background: rank <= 3 ? "var(--saffron)" : "var(--cream-dark)",
            color: rank <= 3 ? "white" : "var(--text-muted)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: "13px", flexShrink: 0,
          }}>
            #{rank}
          </div>
        )}

        {/* Avatar */}
        <div style={{
          width: "44px", height: "44px", borderRadius: "50%",
          background: `linear-gradient(135deg, var(--saffron), var(--chakra-blue))`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontWeight: 700, fontSize: "15px", flexShrink: 0,
        }}>
          {initials}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontWeight: 600, fontSize: "15px",
            color: "var(--navy)", marginBottom: "3px",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {mp.name}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            {mp.party} · {mp.state}
          </div>
        </div>

        {/* LCI Score */}
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{
            fontSize: "20px", fontWeight: 700,
            color: lciColor, lineHeight: 1,
          }}>
            {mp.LCI_score.toFixed(3)}
          </div>
          <div style={{
            fontSize: "11px", fontWeight: 600,
            color: lciColor, textTransform: "uppercase", letterSpacing: "0.05em",
          }}>
            {getLCILabel(mp.LCI_score)}
          </div>
        </div>
      </div>
    </Link>
  );
}