"use client";
import { useState, useEffect } from "react";
import { getStateStrength, getPartyDominance, getInequality, getImbalance } from "@/lib/api";

type Tab = "state" | "party" | "inequality" | "imbalance";

export default function AnalyticsPage() {
  const [tab, setTab] = useState<Tab>("state");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, [tab]);

  async function loadData() {
    setLoading(true);
    try {
      if (tab === "state")      setData(await getStateStrength());
      else if (tab === "party") setData(await getPartyDominance());
      else if (tab === "inequality") setData(await getInequality());
      else if (tab === "imbalance")  setData(await getImbalance());
    } catch { setData(null); }
    setLoading(false);
  }

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "state",      label: "State Strength",     icon: "🗺" },
    { key: "party",      label: "Party Dominance",    icon: "🏛" },
    { key: "inequality", label: "Inequality Index",   icon: "⚖" },
    { key: "imbalance",  label: "Representation",     icon: "📊" },
  ];

  const tabStyle = (t: Tab) => ({
    padding: "10px 18px",
    borderRadius: "var(--radius-sm)",
    border: "none",
    cursor: "pointer",
    fontFamily: "var(--font-body)",
    fontSize: "13px", fontWeight: 600,
    background: tab === t ? "var(--saffron)" : "white",
    color: tab === t ? "white" : "var(--text-secondary)",
    boxShadow: tab === t ? "var(--shadow-saffron)" : "var(--shadow-sm)",
    transition: "all 0.2s",
    display: "flex", alignItems: "center", gap: "6px",
  });

  const maxVal = data?.data?.length
    ? Math.max(...data.data.map((r: any) =>
        r.state_strength_index ?? r.party_dominance_index ?? r.performance_std ?? Math.abs(r.imbalance_score) ?? 0
      ))
    : 1;

  function getRowValue(row: any) {
    return row.state_strength_index ?? row.party_dominance_index ?? row.performance_std ?? row.imbalance_score ?? 0;
  }

  function getRowLabel(row: any) {
    return row.state ?? row.party ?? "";
  }

  return (
    <div style={{ fontFamily: "var(--font-body)", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ background: "var(--navy)", padding: "56px 0 40px" }}>
        <div className="container">
          <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--saffron)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>
            LokDrishti Analytics
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "44px", color: "white", marginBottom: "12px" }}>
            Civic Intelligence Indexes
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "16px" }}>
            Advanced analytics on parliamentary performance across states and parties.
          </p>
        </div>
      </div>

      <div className="container section-sm">

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "36px", flexWrap: "wrap" }}>
          {tabs.map((t) => (
            <button key={t.key} style={tabStyle(t.key)} onClick={() => setTab(t.key)}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* Summary cards */}
        {data && !loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: "16px", marginBottom: "36px" }}>
            {tab === "state" && <>
              <SummaryCard label="Total States" value={data.total_states} />
              <SummaryCard label="Strongest State" value={data.strongest_state} accent />
              <SummaryCard label="Weakest State" value={data.weakest_state} />
            </>}
            {tab === "party" && <>
              <SummaryCard label="Total Parties" value={data.total_parties} />
              <SummaryCard label="Dominant Party" value={data.dominant_party} accent />
              <SummaryCard label="Weakest Party" value={data.weakest_party} />
            </>}
            {tab === "inequality" && <>
              <SummaryCard label="Most Unequal" value={data.most_unequal_state} accent />
              <SummaryCard label="Most Balanced" value={data.most_balanced_state} />
            </>}
            {tab === "imbalance" && <>
              <SummaryCard label="National Avg LCI" value={data.national_avg_lci?.toFixed(4)} />
              <SummaryCard label="Overperforming" value={data.most_overperforming_state} accent />
              <SummaryCard label="Underperforming" value={data.most_underperforming_state} />
            </>}
          </div>
        )}

        {/* Bar chart table */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px", color: "var(--text-muted)" }}>
            <div style={{
              width: "40px", height: "40px", border: "3px solid var(--saffron)",
              borderTopColor: "transparent", borderRadius: "50%",
              animation: "chakra-spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }}/>
            Loading analytics...
          </div>
        ) : data?.data?.length ? (
          <div style={{ background: "white", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", overflow: "hidden" }}>
            {data.data.map((row: any, i: number) => {
              const val = getRowValue(row);
              const pct = (Math.abs(val) / maxVal) * 100;
              const isNeg = val < 0;
              return (
                <div
                  key={i}
                  style={{
                    display: "flex", alignItems: "center", gap: "16px",
                    padding: "14px 20px",
                    borderBottom: i < data.data.length - 1 ? "1px solid var(--border)" : "none",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--saffron-pale)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                >
                  {/* Rank */}
                  <span style={{ minWidth: "28px", fontSize: "13px", fontWeight: 700, color: i < 3 ? "var(--saffron)" : "var(--text-muted)" }}>
                    {i + 1}
                  </span>
                  {/* Label */}
                  <span style={{ minWidth: "180px", fontSize: "14px", fontWeight: 600, color: "var(--navy)" }}>
                    {getRowLabel(row)}
                  </span>
                  {/* Bar */}
                  <div style={{ flex: 1, height: "8px", background: "var(--cream-dark)", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{
                      width: `${pct}%`, height: "100%",
                      background: isNeg
                        ? "var(--danger)"
                        : i < 3 ? "var(--saffron)" : "var(--chakra-blue)",
                      borderRadius: "4px",
                      transition: "width 0.6s ease",
                    }}/>
                  </div>
                  {/* Value */}
                  <span style={{
                    minWidth: "80px", textAlign: "right",
                    fontSize: "14px", fontWeight: 700,
                    color: isNeg ? "var(--danger)" : "var(--saffron)",
                  }}>
                    {typeof val === "number" ? val.toFixed(4) : val}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "60px", color: "var(--text-muted)" }}>No data available.</div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ label, value, accent = false }: { label: string; value: any; accent?: boolean }) {
  return (
    <div style={{
      background: accent ? "var(--saffron)" : "white",
      border: accent ? "none" : "1px solid var(--border)",
      borderRadius: "var(--radius-md)",
      padding: "20px",
      boxShadow: accent ? "var(--shadow-saffron)" : "var(--shadow-sm)",
    }}>
      <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: accent ? "rgba(255,255,255,0.75)" : "var(--text-muted)", marginBottom: "6px" }}>
        {label}
      </div>
      <div style={{ fontSize: "20px", fontWeight: 700, color: accent ? "white" : "var(--navy)" }}>
        {value}
      </div>
    </div>
  );
}