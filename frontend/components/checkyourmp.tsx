"use client";
import { useState } from "react";
import Link from "next/link";

interface MP {
  name: string;
  party: string;
  state: string;
  constituency: string;
  attendance: number;
  debates: number;
  questions: number;
  LCI_score: number;
  national_rank: number;
  percentile: number;
  silent_flag: boolean | number;
}

function ScoreBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ height: "6px", background: "#F0E8DF", borderRadius: "3px", overflow: "hidden" }}>
      <div style={{
        width: `${pct}%`, height: "100%",
        background: color, borderRadius: "3px",
        transition: "width 0.8s ease",
      }} />
    </div>
  );
}

export default function CheckYourMP() {
  const [query, setQuery] = useState("");
  const [mp, setMp] = useState<MP | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setMp(null);
    setSearched(true);
    try {
      const res = await fetch(
        `http://127.0.0.1:5000/api/mps/${encodeURIComponent(query.trim())}`
      );
      const data = await res.json();
      if (data.data) setMp(data.data);
      else setError("MP not found. Try a different spelling.");
    } catch {
      setError("Could not connect. Make sure Flask is running.");
    }
    setLoading(false);
  }

  const lciColor = mp
    ? mp.LCI_score >= 0.6 ? "#16A34A" : mp.LCI_score >= 0.3 ? "#FF6B00" : "#DC2626"
    : "#FF6B00";

  const grade = mp
    ? mp.LCI_score >= 0.6 ? "A" : mp.LCI_score >= 0.4 ? "B" : mp.LCI_score >= 0.25 ? "C" : "D"
    : "";

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>

      {/* Search box */}
      <div style={{
        display: "flex", gap: "0",
        background: "white",
        border: "2px solid #E2D9CE",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 24px rgba(10,22,40,0.08)",
        transition: "border-color 0.2s",
      }}
        onFocus={() => {}}
      >
        <div style={{
          padding: "0 20px",
          display: "flex", alignItems: "center",
          color: "#8A9AB0", fontSize: "20px",
          borderRight: "1px solid #F0E8DF",
        }}>
          🔍
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Type your MP's name... e.g. Rahul Gandhi"
          style={{
            flex: 1, padding: "18px 20px",
            border: "none", outline: "none",
            fontSize: "16px", fontFamily: "'DM Sans', sans-serif",
            color: "#0A1628", background: "transparent",
          }}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          style={{
            padding: "18px 28px",
            background: "#FF6B00", color: "white",
            border: "none", cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 700, fontSize: "14px",
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.04em",
            opacity: loading ? 0.7 : 1,
            transition: "opacity 0.2s",
            whiteSpace: "nowrap",
          }}
        >
          {loading ? "Searching..." : "Check MP →"}
        </button>
      </div>

      {/* Hint text */}
      <p style={{
        fontSize: "12px", color: "#8A9AB0", textAlign: "center",
        marginTop: "10px", letterSpacing: "0.02em",
      }}>
        Search any of the 543 MPs in the 18th Lok Sabha
      </p>

      {/* Error */}
      {error && (
        <div style={{
          marginTop: "20px", padding: "16px 20px",
          background: "#FEF2F2", border: "1px solid #FECACA",
          borderRadius: "10px", color: "#DC2626",
          fontSize: "14px", textAlign: "center",
        }}>
          ⚠ {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div style={{
          marginTop: "24px", padding: "28px",
          background: "white", borderRadius: "16px",
          border: "1px solid #E2D9CE",
          animation: "pulse 1.5s ease-in-out infinite",
        }}>
          <div style={{ height: "20px", background: "#F0E8DF", borderRadius: "4px", marginBottom: "12px", width: "60%" }} />
          <div style={{ height: "14px", background: "#F0E8DF", borderRadius: "4px", marginBottom: "8px", width: "40%" }} />
          <div style={{ height: "14px", background: "#F0E8DF", borderRadius: "4px", width: "80%" }} />
        </div>
      )}

      {/* Result card */}
      {mp && !loading && (
        <div style={{
          marginTop: "24px",
          background: "white",
          borderRadius: "16px",
          border: "1px solid #E2D9CE",
          overflow: "hidden",
          boxShadow: "0 8px 40px rgba(10,22,40,0.10)",
          animation: "slideInUp 0.4s ease forwards",
        }}>
          {/* Card header */}
          <div style={{
            background: "#0A1628", padding: "20px 24px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "white", marginBottom: "4px" }}>
                {mp.name}
              </div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
                {mp.party} · {mp.constituency} · {mp.state}
              </div>
            </div>
            {/* Grade badge */}
            <div style={{
              width: "56px", height: "56px", borderRadius: "12px",
              background: lciColor, display: "flex",
              flexDirection: "column", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "white", lineHeight: 1 }}>{grade}</div>
              <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.8)", fontWeight: 600, letterSpacing: "0.05em" }}>GRADE</div>
            </div>
          </div>

          {/* Metrics */}
          <div style={{ padding: "20px 24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "20px" }}>
              {[
                { label: "Attendance", value: `${mp.attendance}%`, sub: "of sessions" },
                { label: "National Rank", value: `#${mp.national_rank}`, sub: "out of 543" },
                { label: "Percentile", value: `${mp.percentile?.toFixed(1)}%`, sub: "better than peers" },
              ].map((stat) => (
                <div key={stat.label} style={{
                  background: "#FAFAF7", borderRadius: "10px",
                  padding: "14px 16px", textAlign: "center",
                  border: "1px solid #F0E8DF",
                }}>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "#0A1628" }}>{stat.value}</div>
                  <div style={{ fontSize: "11px", color: "#8A9AB0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "2px" }}>{stat.label}</div>
                  <div style={{ fontSize: "11px", color: "#B0BFCC", marginTop: "2px" }}>{stat.sub}</div>
                </div>
              ))}
            </div>

            {/* Activity bars */}
            <div style={{ display: "grid", gap: "12px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#4A5568" }}>Attendance</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#0A1628" }}>{mp.attendance}%</span>
                </div>
                <ScoreBar value={mp.attendance} max={100} color="#FF6B00" />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#4A5568" }}>Debates</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#0A1628" }}>{mp.debates}</span>
                </div>
                <ScoreBar value={mp.debates} max={500} color="#0057A8" />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#4A5568" }}>Questions</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#0A1628" }}>{mp.questions}</span>
                </div>
                <ScoreBar value={mp.questions} max={1000} color="#138808" />
              </div>
            </div>

            {/* Silent MP warning */}
            {mp.silent_flag ? (
              <div style={{
                marginTop: "16px", padding: "12px 16px",
                background: "#FEF2F2", border: "1px solid #FECACA",
                borderRadius: "8px", fontSize: "13px",
                color: "#DC2626", fontWeight: 600,
                display: "flex", alignItems: "center", gap: "8px",
              }}>
                🔴 This MP has been flagged as a Silent MP — critically low parliamentary engagement.
              </div>
            ) : (
              <div style={{
                marginTop: "16px", padding: "12px 16px",
                background: "#F0FDF4", border: "1px solid #BBF7D0",
                borderRadius: "8px", fontSize: "13px",
                color: "#16A34A", fontWeight: 600,
                display: "flex", alignItems: "center", gap: "8px",
              }}>
                🟢 Active MP — participating in parliamentary proceedings.
              </div>
            )}

            {/* Full profile link */}
            <Link href={`/mp/${encodeURIComponent(mp.name)}`} style={{
              display: "flex", justifyContent: "center", alignItems: "center",
              marginTop: "16px", padding: "12px",
              background: "#0A1628", color: "white",
              borderRadius: "8px", textDecoration: "none",
              fontWeight: 600, fontSize: "14px", gap: "8px",
            }}>
              View Full Profile →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}