"use client";
import Link from "next/link";
import { MP } from "@/types";

interface Props {
  mp: MP;
  rank: number;
  delay?: number;
}

export default function MpCard({ mp, rank }: Props) {
  const lciColor =
    mp.LCI_score >= 0.6
      ? "#16A34A"
      : mp.LCI_score >= 0.3
      ? "#FF6B00"
      : "#DC2626";

  return (
    <Link
      href={`/mp/${encodeURIComponent(mp.name)}`}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px",
        background: "white",
        borderRadius: "12px",
        border: "1px solid var(--border)",
        textDecoration: "none",
        transition: "transform 0.15s, box-shadow 0.15s",
      }}
    >
      {/* Rank */}
      <div
        style={{
          fontWeight: 800,
          fontSize: "18px",
          color: "var(--saffron)",
          width: "40px",
        }}
      >
        #{rank}
      </div>

      {/* MP info */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: "16px",
            color: "var(--navy)",
          }}
        >
          {mp.name}
        </div>

        <div
          style={{
            fontSize: "13px",
            color: "var(--text-muted)",
          }}
        >
          {mp.party} · {mp.constituency}, {mp.state}
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          fontSize: "13px",
          color: "var(--text-secondary)",
        }}
      >
        <span>Q: {mp.questions}</span>
        <span>D: {mp.debates}</span>
        <span>A: {mp.attendance}%</span>
      </div>

      {/* Score */}
      <div
        style={{
          marginLeft: "20px",
          fontWeight: 700,
          color: lciColor,
        }}
      >
        {mp.LCI_score.toFixed(2)}
      </div>
    </Link>
  );
}