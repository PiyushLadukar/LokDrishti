"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getNationalRankings, getSilentMPs } from "@/lib/api";

type SortKey = "attendance" | "lci" | "questions" | "debates";

const GRADE_COLOR: Record<string, string> = {
  A: "#34D399", B: "#FF6B00", C: "#FBBF24", D: "#F87171", "?": "#8A9AB0",
};

function getGrade(lci: number): string {
  if (lci >= 0.75) return "A";
  if (lci >= 0.5)  return "B";
  if (lci >= 0.25) return "C";
  return "D";
}

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ width: "80px", height: "5px", background: "#F0E8DF", borderRadius: "3px", overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "3px", transition: "width 0.5s ease" }} />
    </div>
  );
}

export default function RankingPage() {
  const [mps, setMps] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>("attendance");
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("All");
  const [partyFilter, setPartyFilter] = useState("All");
  const [silentOnly, setSilentOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(true);
  const PER_PAGE = 25;

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await getNationalRankings(undefined, 1, 543);
      const list = res.rankings || res.data || res || [];
      setMps(list);
    } catch {
      setError(true);
    }
    setLoading(false);
  }

  // Sort & filter
  useEffect(() => {
    let list = [...mps];

    if (silentOnly) {
      list = list.filter(mp => (mp.questions_raised ?? 0) === 0 && (mp.debates ?? 0) === 0);
    }
    if (stateFilter !== "All") list = list.filter(mp => mp.state === stateFilter);
    if (partyFilter !== "All") list = list.filter(mp => mp.party === partyFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(mp => mp.name?.toLowerCase().includes(q) || mp.state?.toLowerCase().includes(q) || mp.party?.toLowerCase().includes(q));
    }

    list.sort((a, b) => {
      if (sortBy === "attendance") return (b.attendance_pct ?? 0) - (a.attendance_pct ?? 0);
      if (sortBy === "lci")        return (b.lci_score ?? 0) - (a.lci_score ?? 0);
      if (sortBy === "questions")  return (b.questions_raised ?? 0) - (a.questions_raised ?? 0);
      if (sortBy === "debates")    return (b.debates ?? 0) - (a.debates ?? 0);
      return 0;
    });

    setFiltered(list);
    setPage(1);
  }, [mps, sortBy, search, stateFilter, partyFilter, silentOnly]);

  const states = ["All", ...Array.from(new Set(mps.map(m => m.state).filter(Boolean))).sort()];
  const parties = ["All", ...Array.from(new Set(mps.map(m => m.party).filter(Boolean))).sort()];

  const maxAtt   = Math.max(...mps.map(m => m.attendance_pct ?? 0), 100);
  const maxQ     = Math.max(...mps.map(m => m.questions_raised ?? 0), 1);
  const maxDeb   = Math.max(...mps.map(m => m.debates ?? 0), 1);
  const maxLCI   = Math.max(...mps.map(m => m.lci_score ?? 0), 1);

  const pageData = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const sortOptions: { key: SortKey; label: string; color: string }[] = [
    { key: "attendance", label: "Attendance",  color: "#FF6B00" },
    { key: "lci",        label: "LCI Score",   color: "#60A5FA" },
    { key: "questions",  label: "Questions",   color: "#34D399" },
    { key: "debates",    label: "Debates",     color: "#A78BFA" },
  ];

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", background: "#F3EFE8" }}>

      {/* ══════════ HERO HEADER ══════════ */}
      <div style={{ background: "#0A1628", padding: "52px 64px 0", position: "relative", overflow: "hidden" }}>
        {/* Dot pattern */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,107,0,0.03) 1px, transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none" }} />
        {/* Saffron left bar */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "4px", background: "linear-gradient(180deg,transparent,#FF6B00 30%,#FF6B00 70%,transparent)" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <div style={{ width: "16px", height: "2px", background: "#FF6B00", borderRadius: "1px" }} />
                <span style={{ fontSize: "10px", fontWeight: 800, color: "#FF6B00", textTransform: "uppercase", letterSpacing: "0.2em" }}>LokDrishti · National Rankings</span>
              </div>
              <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(36px,4vw,60px)", fontWeight: 700, color: "white", letterSpacing: "-1.5px", lineHeight: 1.0, marginBottom: "12px" }}>
                All 543 MPs.<br />
                <span style={{ color: "#FF6B00", fontStyle: "italic" }}>Ranked. Graded. Exposed.</span>
              </h1>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.38)", maxWidth: "420px", lineHeight: 1.7 }}>
                Every member of the 18th Lok Sabha ranked by attendance, questions raised, debate participation, and LCI Score — no politics, just data.
              </p>
            </div>

            {/* Quick stats */}
            <div style={{ display: "flex", gap: "0", paddingBottom: "4px" }}>
              {[
                { n: "543", l: "MPs" },
                { n: String(mps.filter(m => (m.questions_raised ?? 0) === 0 && (m.debates ?? 0) === 0).length || "—"), l: "Silent" },
                { n: String(mps.filter(m => (m.attendance_pct ?? 0) < 50).length || "—"), l: "<50% Attend" },
              ].map((s, i) => (
                <div key={s.l} style={{ paddingRight: i < 2 ? "28px" : 0, marginRight: i < 2 ? "28px" : 0, borderRight: i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "36px", fontWeight: 700, color: "white", lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "3px" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sort tabs — bottom of hero */}
          <div style={{ display: "flex", gap: "4px", marginTop: "36px" }}>
            {sortOptions.map(opt => {
              const on = sortBy === opt.key;
              return (
                <button key={opt.key} onClick={() => setSortBy(opt.key)} style={{
                  padding: "10px 20px",
                  background: on ? opt.color : "rgba(255,255,255,0.04)",
                  border: on ? "none" : "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "100px 100px 0 0",
                  cursor: "pointer", color: on ? "white" : "rgba(255,255,255,0.38)",
                  fontSize: "12px", fontWeight: 700, fontFamily: "'DM Sans',sans-serif",
                  transition: "all 0.18s",
                }}>
                  Sort: {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══════════ BODY ══════════ */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 64px 60px", display: "flex", gap: "24px", alignItems: "flex-start" }}>

        {/* ── FILTER SIDEBAR ── */}
        <aside style={{
          width: showFilters ? "220px" : "48px",
          flexShrink: 0, transition: "width 0.25s ease",
          paddingTop: "28px", overflow: "hidden",
        }}>
          <button onClick={() => setShowFilters(p => !p)} style={{
            width: "100%", display: "flex", alignItems: "center", gap: "8px",
            padding: "10px 12px", background: "white", border: "1px solid #E2D9CE",
            borderRadius: "10px", cursor: "pointer", marginBottom: "12px",
            fontSize: "11px", fontWeight: 700, color: "#0A1628", fontFamily: "'DM Sans',sans-serif",
            whiteSpace: "nowrap",
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 3h12M3 7h8M5 11h4" stroke="#0A1628" strokeWidth="1.6" strokeLinecap="round"/></svg>
            {showFilters && "Filters"}
          </button>

          {showFilters && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

              {/* Search */}
              <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E2D9CE", padding: "14px 16px" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, color: "#8A9AB0", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "8px" }}>Search</div>
                <input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Name, state, party…"
                  style={{ width: "100%", border: "1px solid #E2D9CE", borderRadius: "8px", padding: "8px 10px", fontSize: "12px", color: "#0A1628", fontFamily: "'DM Sans',sans-serif", outline: "none", boxSizing: "border-box", background: "#FAFAF7" }}
                />
              </div>

              {/* State */}
              <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E2D9CE", padding: "14px 16px" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, color: "#8A9AB0", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "8px" }}>State</div>
                <select value={stateFilter} onChange={e => setStateFilter(e.target.value)} style={{ width: "100%", border: "1px solid #E2D9CE", borderRadius: "8px", padding: "8px 10px", fontSize: "12px", color: "#0A1628", fontFamily: "'DM Sans',sans-serif", outline: "none", background: "#FAFAF7", cursor: "pointer" }}>
                  {states.slice(0, 40).map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              {/* Party */}
              <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E2D9CE", padding: "14px 16px" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, color: "#8A9AB0", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "8px" }}>Party</div>
                <select value={partyFilter} onChange={e => setPartyFilter(e.target.value)} style={{ width: "100%", border: "1px solid #E2D9CE", borderRadius: "8px", padding: "8px 10px", fontSize: "12px", color: "#0A1628", fontFamily: "'DM Sans',sans-serif", outline: "none", background: "#FAFAF7", cursor: "pointer" }}>
                  {parties.slice(0, 50).map(p => <option key={p}>{p}</option>)}
                </select>
              </div>

              {/* Silent MPs toggle */}
              <button onClick={() => setSilentOnly(p => !p)} style={{
                padding: "12px 16px", borderRadius: "12px", cursor: "pointer", textAlign: "left",
                background: silentOnly ? "#FEF2F2" : "white",
                border: silentOnly ? "1.5px solid #F87171" : "1px solid #E2D9CE",
                fontFamily: "'DM Sans',sans-serif",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: silentOnly ? "#F87171" : "#D4CAC0", transition: "background 0.2s", ...(silentOnly ? { animation: "blink 1.5s ease-in-out infinite" } : {}) }} />
                  <span style={{ fontSize: "12px", fontWeight: 700, color: silentOnly ? "#DC2626" : "#0A1628" }}>Silent MPs Only</span>
                </div>
                <div style={{ fontSize: "10px", color: "#8A9AB0", marginTop: "3px", marginLeft: "15px" }}>0 questions + 0 debates</div>
              </button>

              {/* Result count */}
              <div style={{ padding: "10px 14px", borderRadius: "10px", background: "#0A1628", textAlign: "center" }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "28px", fontWeight: 700, color: "#FF6B00", lineHeight: 1 }}>{filtered.length}</div>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "2px" }}>MPs shown</div>
              </div>
            </div>
          )}
        </aside>

        {/* ── MP TABLE ── */}
        <div style={{ flex: 1, paddingTop: "28px", minWidth: 0 }}>

          {loading && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 0", gap: "14px" }}>
              <div style={{ width: "32px", height: "32px", border: "3px solid rgba(255,107,0,0.15)", borderTop: "3px solid #FF6B00", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
              <span style={{ fontSize: "12px", color: "#8A9AB0" }}>Loading 543 MPs…</span>
            </div>
          )}

          {error && (
            <div style={{ textAlign: "center", padding: "60px", color: "#8A9AB0", fontSize: "13px" }}>
              Could not connect. Make sure Flask is running.
            </div>
          )}

          {!loading && !error && (
            <div style={{ background: "white", borderRadius: "20px", border: "1px solid #E2D9CE", overflow: "hidden", boxShadow: "0 4px 24px rgba(10,22,40,0.06)" }}>

              {/* Table header */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "48px 1fr 100px 100px 100px 100px 56px",
                gap: "0", padding: "12px 20px",
                background: "#0A1628",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}>
                {["#", "MP / State / Party", "Attendance", "Questions", "Debates", "LCI Score", "Grade"].map((h, i) => (
                  <div key={h} style={{ fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.14em", textAlign: i > 1 ? "center" : "left" }}>{h}</div>
                ))}
              </div>

              {/* MP rows */}
              {pageData.map((mp, i) => {
                const rank = (page - 1) * PER_PAGE + i + 1;
                const lci  = mp.lci_score ?? 0;
                const att  = mp.attendance_pct ?? 0;
                const q    = mp.questions_raised ?? 0;
                const deb  = mp.debates ?? 0;
                const grade = getGrade(lci);
                const gc    = GRADE_COLOR[grade];
                const isSilent = q === 0 && deb === 0;
                const isTop3 = rank <= 3;
                const medalColor = rank === 1 ? "#FFD700" : rank === 2 ? "#C0C0C0" : "#CD7F32";

                return (
                  <div key={mp.name || i} style={{
                    display: "grid",
                    gridTemplateColumns: "48px 1fr 100px 100px 100px 100px 56px",
                    gap: "0", padding: "14px 20px",
                    borderBottom: "1px solid #F8F4EF",
                    background: isTop3 ? "#FFFBF5" : isSilent ? "#FFF5F5" : "white",
                    alignItems: "center",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#F8F4EF")}
                  onMouseLeave={e => (e.currentTarget.style.background = isTop3 ? "#FFFBF5" : isSilent ? "#FFF5F5" : "white")}
                  >
                    {/* Rank */}
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "18px", fontWeight: 700, color: isTop3 ? medalColor : "#D4CAC0", lineHeight: 1 }}>
                      {String(rank).padStart(2, "0")}
                    </div>

                    {/* Name + meta */}
                    <div style={{ minWidth: 0, paddingRight: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "14px", fontWeight: 700, color: "#0A1628", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "200px" }}>{mp.name}</span>
                        {isSilent && (
                          <span style={{ fontSize: "9px", fontWeight: 800, color: "#DC2626", background: "#FEE2E2", borderRadius: "4px", padding: "2px 6px", letterSpacing: "0.08em", flexShrink: 0 }}>SILENT</span>
                        )}
                      </div>
                      <div style={{ fontSize: "11px", color: "#8A9AB0", marginTop: "2px" }}>
                        {mp.state && <span>{mp.state}</span>}
                        {mp.state && mp.party && <span style={{ margin: "0 5px", opacity: 0.4 }}>·</span>}
                        {mp.party && <span>{mp.party}</span>}
                      </div>
                    </div>

                    {/* Attendance */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: att >= 75 ? "#34D399" : att >= 50 ? "#FF6B00" : "#F87171" }}>{att.toFixed(1)}%</span>
                      <MiniBar value={att} max={100} color={att >= 75 ? "#34D399" : att >= 50 ? "#FF6B00" : "#F87171"} />
                    </div>

                    {/* Questions */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "#34D399" }}>{q}</span>
                      <MiniBar value={q} max={maxQ} color="#34D399" />
                    </div>

                    {/* Debates */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "#A78BFA" }}>{deb}</span>
                      <MiniBar value={deb} max={maxDeb} color="#A78BFA" />
                    </div>

                    {/* LCI */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "#60A5FA" }}>{lci.toFixed(3)}</span>
                      <MiniBar value={lci} max={maxLCI} color="#60A5FA" />
                    </div>

                    {/* Grade */}
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <div style={{
                        width: "32px", height: "32px", borderRadius: "8px",
                        background: `${gc}18`, border: `1.5px solid ${gc}40`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "13px", fontWeight: 800, color: gc,
                      }}>
                        {grade}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{
                  padding: "16px 20px", display: "flex", alignItems: "center",
                  justifyContent: "space-between", background: "#FAFAF7", borderTop: "1px solid #F0E8DF",
                }}>
                  <span style={{ fontSize: "12px", color: "#8A9AB0" }}>
                    Showing {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE, filtered.length)} of {filtered.length}
                  </span>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} style={{ padding: "7px 14px", borderRadius: "8px", border: "1px solid #E2D9CE", background: "white", cursor: page===1 ? "not-allowed" : "pointer", fontSize: "12px", color: page===1 ? "#C4B8A8" : "#0A1628", fontFamily: "'DM Sans',sans-serif" }}>← Prev</button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                      const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + idx;
                      return (
                        <button key={p} onClick={() => setPage(p)} style={{ width: "34px", height: "34px", borderRadius: "8px", border: "1px solid #E2D9CE", background: p===page ? "#0A1628" : "white", cursor: "pointer", fontSize: "12px", fontWeight: p===page ? 700 : 400, color: p===page ? "white" : "#0A1628", fontFamily: "'DM Sans',sans-serif" }}>{p}</button>
                      );
                    })}
                    <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages} style={{ padding: "7px 14px", borderRadius: "8px", border: "1px solid #E2D9CE", background: "white", cursor: page===totalPages ? "not-allowed" : "pointer", fontSize: "12px", color: page===totalPages ? "#C4B8A8" : "#0A1628", fontFamily: "'DM Sans',sans-serif" }}>Next →</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
      `}</style>
    </div>
  );
}