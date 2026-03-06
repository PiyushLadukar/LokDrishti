"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getMPByName } from "@/lib/api";
import { MP } from "@/types";

function MetricBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: "13px", fontWeight: 700, color }}>{value}</span>
      </div>
      <div style={{ height: "8px", background: "var(--cream-dark)", borderRadius: "4px", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: "4px", transition: "width 0.8s ease" }}/>
      </div>
    </div>
  );
}

export default function MPProfile() {
  const params = useParams();
  const name = decodeURIComponent(params.name as string);
  const [mp, setMp] = useState<MP | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMPByName(name)
      .then((res) => { setMp(res.data); setLoading(false); })
      .catch(() => { setError("MP not found."); setLoading(false); });
  }, [name]);

  if (loading) return (
    <div style={{ textAlign: "center", padding: "120px", fontFamily: "var(--font-body)" }}>
      <div style={{
        width: "48px", height: "48px", border: "3px solid var(--saffron)",
        borderTopColor: "transparent", borderRadius: "50%",
        animation: "chakra-spin 0.8s linear infinite",
        margin: "0 auto 16px",
      }}/>
      <p style={{ color: "var(--text-muted)" }}>Loading profile...</p>
    </div>
  );

  if (error || !mp) return (
    <div style={{ textAlign: "center", padding: "120px", fontFamily: "var(--font-body)" }}>
      <p style={{ color: "var(--danger)", fontSize: "18px", marginBottom: "16px" }}>⚠ {error || "MP not found"}</p>
      <Link href="/ranking" style={{ color: "var(--saffron)", fontWeight: 600 }}>← Back to Rankings</Link>
    </div>
  );

  const lciColor = mp.LCI_score >= 0.6 ? "var(--success)" : mp.LCI_score >= 0.3 ? "var(--saffron)" : "var(--danger)";
  const initials = mp.name.split(" ").map((w) => w[0]).slice(0, 2).join("");

  return (
    <div style={{ fontFamily: "var(--font-body)", minHeight: "100vh" }}>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)", padding: "56px 0 48px" }}>
        <div className="container">
          <Link href="/ranking" style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", textDecoration: "none", display: "inline-block", marginBottom: "24px" }}>
            ← Back to Rankings
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
            {/* Avatar */}
            <div style={{
              width: "80px", height: "80px", borderRadius: "50%",
              background: "linear-gradient(135deg, var(--saffron), var(--chakra-blue))",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: 700, fontSize: "28px", flexShrink: 0,
            }}>
              {initials}
            </div>
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "36px", color: "white", marginBottom: "6px" }}>
                {mp.name}
              </h1>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "15px" }}>
                {mp.party} · {mp.constituency} · {mp.state}
              </p>
            </div>
            {/* LCI badge */}
            <div style={{ marginLeft: "auto", textAlign: "center" }}>
              <div style={{ fontSize: "48px", fontWeight: 700, color: lciColor, lineHeight: 1 }}>
                {mp.LCI_score.toFixed(3)}
              </div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "4px" }}>
                LCI Score
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="container section-sm">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: "16px", marginBottom: "40px" }}>
          {[
            { label: "National Rank",  value: `#${mp.national_rank}` },
            { label: "State Rank",     value: `#${mp.state_rank}` },
            { label: "Party Rank",     value: `#${mp.party_rank}` },
            { label: "Percentile",     value: `${mp.percentile?.toFixed(1)}%` },
            { label: "Attendance",     value: `${mp.attendance}%` },
            { label: "Engagement",     value: mp.engagement_index },
          ].map((s, i) => (
            <div key={i} style={{
              background: "white", border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)", padding: "20px", textAlign: "center",
              boxShadow: "var(--shadow-sm)",
            }}>
              <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--navy)", marginBottom: "6px" }}>{s.value}</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Metric bars */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          <div style={{ background: "white", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", padding: "28px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--navy)", marginBottom: "24px" }}>
              Parliamentary Activity
            </h3>
            <MetricBar label="Attendance (%)" value={mp.attendance}       max={100}  color="var(--chakra-blue)" />
            <MetricBar label="Debates"         value={mp.debates}         max={500}  color="var(--saffron)" />
            <MetricBar label="Questions"       value={mp.questions}       max={1000} color="var(--success)" />
            <MetricBar label="Engagement Index" value={mp.engagement_index} max={1500} color="var(--navy-light)" />
          </div>

          <div style={{ background: "white", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", padding: "28px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--navy)", marginBottom: "24px" }}>
              Ranking Summary
            </h3>
            {[
              { label: "National Rank", value: mp.national_rank, max: 544 },
              { label: "State Rank",    value: mp.state_rank,    max: 80  },
              { label: "Party Rank",    value: mp.party_rank,    max: 240 },
            ].map((r) => (
              <MetricBar
                key={r.label}
                label={r.label}
                value={r.max - r.value + 1}
                max={r.max}
                color={r.value <= 10 ? "var(--saffron)" : "var(--chakra-blue)"}
              />
            ))}

            {/* Silent flag */}
            <div style={{
              marginTop: "20px", padding: "12px 16px",
              borderRadius: "var(--radius-sm)",
              background: mp.silent_flag ? "rgba(220,38,38,0.08)" : "rgba(22,163,74,0.08)",
              border: `1px solid ${mp.silent_flag ? "rgba(220,38,38,0.2)" : "rgba(22,163,74,0.2)"}`,
              display: "flex", alignItems: "center", gap: "8px",
            }}>
              <span style={{ fontSize: "16px" }}>{mp.silent_flag ? "🔴" : "🟢"}</span>
              <span style={{ fontSize: "13px", fontWeight: 600, color: mp.silent_flag ? "var(--danger)" : "var(--success)" }}>
                {mp.silent_flag ? "Silent MP — Low engagement detected" : "Active MP — Good engagement"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}