"use client";

import { useState, useEffect } from "react";

import StateStrengthChart from "@/components/charts/StateStrengthChart";
import PartyDominanceChart from "@/components/charts/PartyDominanceChart";
import InequalityChart from "@/components/charts/InequalityChart";
import ImbalanceChart from "@/components/charts/ImbalanceChart";

import {
  getStateStrength,
  getPartyDominance,
  getInequality,
  getImbalance,
} from "@/lib/api";

type Tab = "state" | "party" | "inequality" | "imbalance";

export default function AnalyticsPage() {
  const [tab, setTab] = useState<Tab>("state");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [tab]);

  async function loadData() {
    setLoading(true);

    try {
      let res;

      if (tab === "state") res = await getStateStrength();
      else if (tab === "party") res = await getPartyDominance();
      else if (tab === "inequality") res = await getInequality();
      else res = await getImbalance();

      setData(res);
    } catch {
      setData(null);
    }

    setLoading(false);
  }

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "state", label: "State Strength", icon: "🗺" },
    { key: "party", label: "Party Dominance", icon: "🏛" },
    { key: "inequality", label: "Inequality Index", icon: "⚖" },
    { key: "imbalance", label: "Representation", icon: "📊" },
  ];

  const tabStyle = (t: Tab) => ({
    padding: "10px 18px",
    borderRadius: "999px",
    border: "1px solid #eee",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    background: tab === t ? "#ff7a00" : "white",
    color: tab === t ? "white" : "#334155",
    transition: "all 0.2s",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>

      {/* HEADER */}
      <div style={{ background: "#0f172a", padding: "60px 0" }}>
        <div style={{ maxWidth: "1100px", margin: "auto", padding: "0 20px" }}>
          <p style={{ color: "#fb923c", fontWeight: 600, fontSize: "12px" }}>
            LOKDRISHTI ANALYTICS
          </p>

          <h1
            style={{
              color: "white",
              fontSize: "44px",
              fontWeight: 800,
              marginTop: "8px",
            }}
          >
            Civic Intelligence Indexes
          </h1>

          <p style={{ color: "#94a3b8", marginTop: "8px" }}>
            Advanced analytics on parliamentary performance across states and parties.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "auto", padding: "40px 20px" }}>

        {/* TABS */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            marginBottom: "30px",
          }}
        >
          {tabs.map((t) => (
            <button key={t.key} style={tabStyle(t.key)} onClick={() => setTab(t.key)}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* SUMMARY CARDS */}
        {data && !loading && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            {tab === "state" && (
              <>
                <Card title="Total States" value={data.total_states} />
                <Card title="Strongest State" value={data.strongest_state} highlight />
                <Card title="Weakest State" value={data.weakest_state} />
              </>
            )}

            {tab === "party" && (
              <>
                <Card title="Total Parties" value={data.total_parties} />
                <Card title="Dominant Party" value={data.dominant_party} highlight />
                <Card title="Weakest Party" value={data.weakest_party} />
              </>
            )}

            {tab === "inequality" && (
              <>
                <Card title="Most Unequal" value={data.most_unequal_state} highlight />
                <Card title="Most Balanced" value={data.most_balanced_state} />
              </>
            )}

            {tab === "imbalance" && (
              <>
                <Card title="National Avg LCI" value={data.national_avg_lci?.toFixed(4)} />
                <Card title="Overperforming" value={data.most_overperforming_state} highlight />
                <Card title="Underperforming" value={data.most_underperforming_state} />
              </>
            )}
          </div>
        )}

        {/* CHARTS */}

        {tab === "state" && data?.data && (
          <StateStrengthChart data={data.data} />
        )}

        {tab === "party" && data?.data && (
          <PartyDominanceChart data={data.data} />
        )}

        {tab === "inequality" && data?.data && (
          <InequalityChart data={data.data} />
        )}

        {tab === "imbalance" && data?.data && (
          <ImbalanceChart data={data.data} />
        )}

        {loading && (
          <div style={{ textAlign: "center", padding: "60px" }}>
            Loading analytics...
          </div>
        )}
      </div>
    </div>
  );
}

function Card({
  title,
  value,
  highlight = false,
}: {
  title: string;
  value: any;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        background: highlight ? "#ff7a00" : "white",
        padding: "22px",
        borderRadius: "12px",
        border: "1px solid #eee",
        boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          fontWeight: 600,
          color: highlight ? "rgba(255,255,255,0.8)" : "#64748b",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "22px",
          fontWeight: 700,
          marginTop: "6px",
          color: highlight ? "white" : "#0f172a",
        }}
      >
        {value}
      </div>
    </div>
  );
}