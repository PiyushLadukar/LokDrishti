"use client";
import { useState, useEffect } from "react";
import { getNationalRankings, getStateLeaderboard, getPartyLeaderboard } from "@/lib/api";
import MpCard from "@/components/Mpcard";
import { MP } from "@/types";

type Tab = "national" | "state" | "party";

export default function RankingsPage() {
  const [tab, setTab] = useState<Tab>("national");
  const [mps, setMps] = useState<MP[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [partyFilter, setPartyFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadData();
  }, [tab, page, stateFilter, partyFilter]);

  async function loadData() {
    setLoading(true);
    try {
      if (tab === "national") {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("page_size", "20");
        if (stateFilter) params.set("state", stateFilter);
        if (partyFilter) params.set("party", partyFilter);
        const data = await getNationalRankings(undefined, page, 20);
        setMps(data.data || []);
        setTotalPages(data.total_pages || 1);
      } else if (tab === "state") {
        const data = await getStateLeaderboard();
        setLeaderboard(data.data || []);
      } else if (tab === "party") {
        const data = await getPartyLeaderboard();
        setLeaderboard(data.data || []);
      }
    } catch {
      setMps([]); setLeaderboard([]);
    }
    setLoading(false);
  }

  const filtered = mps.filter((mp) =>
    mp.name.toLowerCase().includes(search.toLowerCase())
  );

  const tabStyle = (t: Tab) => ({
    padding: "10px 20px",
    borderRadius: "var(--radius-sm)",
    border: "none",
    cursor: "pointer",
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    fontWeight: 600,
    background: tab === t ? "var(--saffron)" : "white",
    color: tab === t ? "white" : "var(--text-secondary)",
    boxShadow: tab === t ? "var(--shadow-saffron)" : "var(--shadow-sm)",
    transition: "all 0.2s",
  });

  return (
    <div style={{ fontFamily: "var(--font-body)", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ background: "var(--navy)", padding: "56px 0 40px" }}>
        <div className="container">
          <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--saffron)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>
            LokDrishti
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "44px", color: "white", marginBottom: "12px" }}>
            MP Rankings
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "16px" }}>
            Ranked by LokDrishti Civic Index (LCI) — a composite of attendance, debates & questions.
          </p>
        </div>
      </div>

      <div className="container section-sm">

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "28px", flexWrap: "wrap" }}>
          <button style={tabStyle("national")} onClick={() => { setTab("national"); setPage(1); }}>🏆 National</button>
          <button style={tabStyle("state")}    onClick={() => { setTab("state"); setPage(1); }}>🗺 By State</button>
          <button style={tabStyle("party")}    onClick={() => { setTab("party"); setPage(1); }}>🏛 By Party</button>
        </div>

        {/* Filters (national only) */}
        {tab === "national" && (
          <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
            <input
              placeholder="Search MP by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1, minWidth: "200px",
                padding: "10px 16px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)",
                fontFamily: "var(--font-body)", fontSize: "14px",
                background: "white", outline: "none",
                color: "var(--text-primary)",
              }}
            />
            <input
              placeholder="Filter by state..."
              value={stateFilter}
              onChange={(e) => { setStateFilter(e.target.value); setPage(1); }}
              style={{
                width: "180px", padding: "10px 16px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)",
                fontFamily: "var(--font-body)", fontSize: "14px",
                background: "white", outline: "none",
                color: "var(--text-primary)",
              }}
            />
            <input
              placeholder="Filter by party..."
              value={partyFilter}
              onChange={(e) => { setPartyFilter(e.target.value); setPage(1); }}
              style={{
                width: "200px", padding: "10px 16px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)",
                fontFamily: "var(--font-body)", fontSize: "14px",
                background: "white", outline: "none",
                color: "var(--text-primary)",
              }}
            />
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px", color: "var(--text-muted)" }}>
            <div style={{
              width: "40px", height: "40px", border: "3px solid var(--saffron)",
              borderTopColor: "transparent", borderRadius: "50%",
              animation: "chakra-spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }}/>
            Loading rankings...
          </div>
        ) : tab === "national" ? (
          <>
            <div style={{ display: "grid", gap: "10px" }}>
              {filtered.map((mp, i) => (
                <MpCard key={mp.name} mp={mp} rank={mp.national_rank} delay={i * 40} />
              ))}
            </div>
            {/* Pagination */}
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "32px" }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  padding: "8px 16px", border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)", cursor: page === 1 ? "not-allowed" : "pointer",
                  background: "white", color: "var(--text-secondary)", fontFamily: "var(--font-body)",
                  opacity: page === 1 ? 0.4 : 1,
                }}
              >← Prev</button>
              <span style={{ padding: "8px 16px", color: "var(--text-muted)", fontSize: "14px" }}>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{
                  padding: "8px 16px", border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)", cursor: page === totalPages ? "not-allowed" : "pointer",
                  background: "white", color: "var(--text-secondary)", fontFamily: "var(--font-body)",
                  opacity: page === totalPages ? 0.4 : 1,
                }}
              >Next →</button>
            </div>
          </>
        ) : (
          /* Leaderboard table */
          <div style={{ background: "white", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-body)" }}>
              <thead>
                <tr style={{ background: "var(--navy)" }}>
                  <th style={{ padding: "14px 20px", textAlign: "left", color: "rgba(255,255,255,0.6)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>#</th>
                  <th style={{ padding: "14px 20px", textAlign: "left", color: "rgba(255,255,255,0.6)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    {tab === "state" ? "State" : "Party"}
                  </th>
                  <th style={{ padding: "14px 20px", textAlign: "left", color: "rgba(255,255,255,0.6)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Top MP</th>
                  <th style={{ padding: "14px 20px", textAlign: "right", color: "rgba(255,255,255,0.6)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>LCI</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--saffron-pale)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                  >
                    <td style={{ padding: "14px 20px", fontWeight: 700, color: i < 3 ? "var(--saffron)" : "var(--text-muted)", fontSize: "15px" }}>
                      {i + 1}
                    </td>
                    <td style={{ padding: "14px 20px", fontWeight: 600, color: "var(--navy)", fontSize: "14px" }}>
                      {tab === "state" ? row.state : row.party}
                    </td>
                    <td style={{ padding: "14px 20px", color: "var(--text-secondary)", fontSize: "14px" }}>{row.name}</td>
                    <td style={{ padding: "14px 20px", textAlign: "right", fontWeight: 700, color: "var(--saffron)", fontSize: "15px" }}>
                      {row.LCI_score?.toFixed(3)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}