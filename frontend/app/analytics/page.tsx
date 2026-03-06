"use client";
import { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, ReferenceLine, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, Area, AreaChart,
} from "recharts";
import {
  getStateStrength, getPartyDominance,
  getInequality, getImbalance,
} from "@/lib/api";

type Tab = "state" | "party" | "inequality" | "imbalance";

/* ─── Animated counter ──────────────────────────────── */
function Counter({ to, dec = 0, dur = 1600 }: { to: number; dec?: number; dur?: number }) {
  const [v, setV] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current || !to) return;
    ref.current = true;
    let cur = 0;
    const step = to / (dur / 14);
    const t = setInterval(() => {
      cur += step;
      if (cur >= to) { setV(to); clearInterval(t); } else setV(cur);
    }, 14);
    return () => clearInterval(t);
  }, [to]);
  return <>{v.toFixed(dec)}</>;
}

/* ─── Custom tooltip ────────────────────────────────── */
function DarkTooltip({ active, payload, labelKey, valueKey, color }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  const val = d?.[valueKey] ?? 0;
  const grade = val >= 0.6 ? "A" : val >= 0.4 ? "B" : val >= 0.25 ? "C" : "D";
  const gc = val >= 0.6 ? "#34D399" : val >= 0.4 ? "#FF6B00" : val >= 0.25 ? "#FBBF24" : "#F87171";
  return (
    <div style={{ background: "rgba(6,14,26,0.97)", borderRadius: "10px", padding: "12px 16px", border: `1px solid ${color}30`, backdropFilter: "blur(8px)", minWidth: "160px" }}>
      <div style={{ fontSize: "13px", fontWeight: 700, color: "white", marginBottom: "8px", borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: "7px" }}>{d?.[labelKey]}</div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", marginBottom: "4px" }}>
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>Score</span>
        <span style={{ fontSize: "12px", fontWeight: 700, color }}>{val.toFixed(4)}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>Grade</span>
        <span style={{ fontSize: "12px", fontWeight: 800, color: gc, background: `${gc}18`, padding: "1px 7px", borderRadius: "4px" }}>{grade}</span>
      </div>
    </div>
  );
}

/* ─── Scrolling ticker ──────────────────────────────── */
function Ticker({ items, color }: { items: { label: string; val: string }[]; color: string }) {
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: "hidden", whiteSpace: "nowrap", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "10px 0", background: "rgba(255,255,255,0.02)" }}>
      <div style={{ display: "inline-block", animation: "scrollTicker 30s linear infinite" }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ marginRight: "40px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em" }}>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>{item.label}</span>
            <span style={{ color, marginLeft: "8px", fontFamily: "'Cormorant Garamond',serif", fontSize: "13px", fontWeight: 700 }}>{item.val}</span>
            <span style={{ color: "rgba(255,255,255,0.12)", marginLeft: "40px" }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Floating stat card (overlaid on chart area) ───── */
function StatFloat({ label, value, color, sub, style: s }: { label: string; value: string; color: string; sub?: string; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: "rgba(6,14,26,0.88)", backdropFilter: "blur(12px)",
      borderRadius: "12px", padding: "14px 18px",
      border: `1px solid ${color}25`,
      borderLeft: `3px solid ${color}`,
      minWidth: "130px", ...s,
    }}>
      <div style={{ fontSize: "9px", fontWeight: 800, color: color, textTransform: "uppercase", letterSpacing: "0.16em", marginBottom: "5px" }}>{label}</div>
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "22px", fontWeight: 700, color: "white", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", marginTop: "3px" }}>{sub}</div>}
    </div>
  );
}

/* ─── Main page ─────────────────────────────────────── */
export default function AnalyticsPage() {
  const [tab, setTab] = useState<Tab>("state");
  const [cache, setCache] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"chart" | "radar" | "table">("chart");
  const [copied, setCopied] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  useEffect(() => { if (!cache[tab]) load(tab); }, [tab]);

  async function load(t: Tab) {
    setLoading(true);
    try {
      const fns: Record<Tab, () => Promise<any>> = {
        state: getStateStrength, party: getPartyDominance,
        inequality: getInequality, imbalance: getImbalance,
      };
      const res = await fns[t]();
      setCache(p => ({ ...p, [t]: res }));
    } catch { /* noop */ }
    setLoading(false);
  }

  const data = cache[tab];

  const tabs: { key: Tab; label: string; short: string; color: string; icon: string; desc: string }[] = [
    { key: "state",      label: "State Strength",   short: "STATE",   color: "#FF6B00", icon: "▲", desc: "Composite state-level parliamentary output" },
    { key: "party",      label: "Party Dominance",  short: "PARTY",   color: "#60A5FA", icon: "◈", desc: "Inter-party performance divergence" },
    { key: "inequality", label: "Inequality Index", short: "INEQUAL", color: "#F87171", icon: "⚡", desc: "MP performance spread within states" },
    { key: "imbalance",  label: "Representation",   short: "IMBAL",   color: "#34D399", icon: "◉", desc: "Over / underperformance vs seat share" },
  ];
  const active = tabs.find(t => t.key === tab)!;

  /* ── Derived data ── */
  const getRows = (): { key: string; val: number }[] => {
    if (!data?.data) return [];
    if (tab === "state")      return data.data.map((d:any) => ({ key: d.state, val: d.state_strength_index }));
    if (tab === "party")      return data.data.map((d:any) => ({ key: d.party, val: d.party_dominance_index }));
    if (tab === "inequality") return data.data.map((d:any) => ({ key: d.state, val: d.performance_std }));
    return data.data.map((d:any) => ({ key: d.state, val: d.imbalance_score }));
  };
  const rows = getRows().sort((a,b) => b.val - a.val);
  const top15 = rows.slice(0, 15);
  const avg = rows.length ? rows.reduce((s,r) => s + r.val, 0) / rows.length : 0;
  const maxVal = rows[0]?.val || 1;

  /* Color per bar */
  const barColor = (val: number) => {
    const r = val / maxVal;
    if (r >= 0.75) return active.color;
    if (r >= 0.5)  return active.color + "BB";
    if (r >= 0.3)  return active.color + "77";
    return active.color + "44";
  };

  /* Ticker items */
  const tickerItems = rows.slice(0, 20).map(r => ({ label: r.key, val: r.val.toFixed(3) }));

  /* Radar data (top 6) */
  const radarData = top15.slice(0, 6).map(r => ({ subject: r.key.length > 8 ? r.key.slice(0,8)+"…" : r.key, value: r.val, fullMark: maxVal }));

  /* Summary stats */
  const leader  = rows[0];
  const laggard = rows[rows.length - 1];

  /* Insight */
  const insight = (() => {
    if (!leader) return "";
    if (tab === "state") return `${leader.key} leads at ${(leader.val / avg).toFixed(1)}× national average`;
    if (tab === "party") return `${leader.key} dominates with ${((leader.val - laggard.val) / laggard.val * 100).toFixed(0)}% gap`;
    if (tab === "inequality") return `${leader.key} has the most unequal MP distribution`;
    return `${data?.most_overperforming_state} exceeds expectations vs seat share`;
  })();

  const share = () => {
    navigator.clipboard.writeText(`LokDrishti · ${active.label}\n18th Lok Sabha · PRS Legislative Research`).catch(()=>{});
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  /* ── Render chart ── */
  const renderChart = () => (
    <div style={{ position: "relative" }}>
      {/* Floating stat overlays */}
      <div style={{ position: "absolute", top: "16px", right: "16px", display: "flex", flexDirection: "column", gap: "8px", zIndex: 10 }}>
        {leader && <StatFloat label="Leader" value={leader.key} color={active.color} sub={leader.val.toFixed(4)} />}
        {laggard && <StatFloat label="Laggard" value={laggard.key} color="#F87171" sub={laggard.val.toFixed(4)} />}
        <StatFloat label="Nat'l Avg" value={avg.toFixed(3)} color="#8A9AB0" sub={`${rows.length} entries`} />
      </div>

      <div style={{ height: "400px", paddingRight: "170px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={top15.map(r => ({ ...r, [tab]: r.val }))} margin={{ top: 12, right: 8, bottom: 52, left: 0 }} barCategoryGap="28%">
            <defs>
              <linearGradient id={`grad_${tab}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={active.color} stopOpacity={1} />
                <stop offset="100%" stopColor={active.color} stopOpacity={0.5} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="1 4" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="key" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans'" }} angle={-30} textAnchor="end" interval={0} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.25)" }} axisLine={false} tickLine={false} tickFormatter={v => v.toFixed(2)} width={36} />
            <Tooltip content={<DarkTooltip labelKey="key" valueKey={tab} color={active.color} />} cursor={{ fill: "rgba(255,255,255,0.03)", radius: 4 }} />
            <ReferenceLine y={avg} stroke="rgba(255,255,255,0.2)" strokeDasharray="4 4" strokeWidth={1.5}
              label={{ value: `avg`, position: "insideTopLeft", fill: "rgba(255,255,255,0.25)", fontSize: 9 }} />
            <Bar dataKey={tab} radius={[5,5,0,0]} maxBarSize={32}
              onMouseEnter={(d:any) => setHoveredBar(d.key)}
              onMouseLeave={() => setHoveredBar(null)}>
              {top15.map(r => (
                <Cell key={r.key}
                  fill={hoveredBar === r.key ? active.color : `url(#grad_${tab})`}
                  opacity={hoveredBar && hoveredBar !== r.key ? 0.4 : 1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  /* ── Render radar ── */
  const renderRadar = () => (
    <div style={{ height: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={radarData} margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
          <PolarGrid stroke="rgba(255,255,255,0.08)" />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans'" }} />
          <PolarRadiusAxis tick={false} axisLine={false} />
          <Radar name="Score" dataKey="value" stroke={active.color} fill={active.color} fillOpacity={0.15} strokeWidth={2} />
          <Tooltip content={<DarkTooltip labelKey="subject" valueKey="value" color={active.color} />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );

  /* ── Render table ── */
  const renderTable = () => (
    <div style={{ maxHeight: "460px", overflowY: "auto" }}>
      {rows.map((r, i) => {
        const pct = Math.abs(r.val) / maxVal * 100;
        const gc = pct >= 75 ? "#34D399" : pct >= 50 ? "#FF6B00" : pct >= 30 ? "#FBBF24" : "#F87171";
        const grade = pct >= 75 ? "A" : pct >= 50 ? "B" : pct >= 30 ? "C" : "D";
        return (
          <div key={r.key} style={{
            display: "grid", gridTemplateColumns: "36px 1fr 120px 64px 32px",
            alignItems: "center", gap: "12px",
            padding: "12px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
            background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
          }}>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "16px", fontWeight: 700, color: i < 3 ? ["#FFD700","#C0C0C0","#CD7F32"][i] : "rgba(255,255,255,0.15)" }}>{i+1}</span>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{r.key}</span>
            <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${gc},${gc}aa)`, borderRadius: "2px" }} />
            </div>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "15px", fontWeight: 700, color: active.color, textAlign: "right" }}>{r.val.toFixed(4)}</span>
            <span style={{ fontSize: "11px", fontWeight: 800, color: gc, background: `${gc}15`, borderRadius: "5px", padding: "2px 6px", textAlign: "center" }}>{grade}</span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", background: "#060E1A", color: "white" }}>

      {/* ══ TOP NAVIGATION RAIL ══════════════════════════ */}
      <div style={{ background: "#060E1A", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 48px", position: "sticky", top: "62px", zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "stretch", gap: "0", maxWidth: "1280px", margin: "0 auto" }}>
          {tabs.map(t => {
            const on = tab === t.key;
            return (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                display: "flex", flexDirection: "column", alignItems: "flex-start",
                padding: "16px 24px", border: "none", cursor: "pointer",
                background: "transparent",
                borderBottom: on ? `2px solid ${t.color}` : "2px solid transparent",
                transition: "all 0.18s",
                fontFamily: "'DM Sans',sans-serif",
                minWidth: "160px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "3px" }}>
                  <span style={{ fontSize: "14px", color: on ? t.color : "rgba(255,255,255,0.2)", transition: "color 0.18s" }}>{t.icon}</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: on ? "white" : "rgba(255,255,255,0.35)", transition: "color 0.18s" }}>{t.label}</span>
                </div>
                <span style={{ fontSize: "10px", color: on ? t.color : "rgba(255,255,255,0.18)", transition: "color 0.18s" }}>{t.desc}</span>
              </button>
            );
          })}

          {/* Right controls */}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px" }}>
            {/* View mode */}
            <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: "8px", padding: "3px", border: "1px solid rgba(255,255,255,0.07)" }}>
              {(["chart","radar","table"] as const).map(v => (
                <button key={v} onClick={() => setViewMode(v)} style={{
                  padding: "5px 12px", borderRadius: "6px", border: "none", cursor: "pointer",
                  background: viewMode===v ? "rgba(255,255,255,0.1)" : "transparent",
                  color: viewMode===v ? "white" : "rgba(255,255,255,0.3)",
                  fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
                  fontFamily: "'DM Sans',sans-serif",
                }}>{v}</button>
              ))}
            </div>
            <button onClick={share} style={{ padding: "8px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", cursor: "pointer", fontSize: "10px", fontWeight: 700, color: copied ? "#34D399" : "rgba(255,255,255,0.4)", fontFamily: "'DM Sans',sans-serif" }}>
              {copied ? "✓" : "↗"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px 60px" }}>

        {/* ══ PAGE HEADER ════════════════════════════════ */}
        <div style={{ padding: "40px 0 32px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: "32px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <div style={{ width: "14px", height: "2px", background: active.color, borderRadius: "1px" }} />
              <span style={{ fontSize: "10px", fontWeight: 800, color: active.color, textTransform: "uppercase", letterSpacing: "0.2em" }}>18th Lok Sabha · PRS Legislative Research</span>
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(32px,3.5vw,52px)", fontWeight: 700, color: "white", letterSpacing: "-1px", lineHeight: 1.0, marginBottom: "8px" }}>
              {active.label}
            </h1>
            {data && !loading && insight && (
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.38)", display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ color: active.color }}>↑</span> {insight}
              </p>
            )}
          </div>

          {/* Summary numbers — inline, horizontal */}
          {data && !loading && (
            <div style={{ display: "flex", gap: "32px", alignItems: "flex-end" }}>
              {(tab === "state" ? [
                { l: "States", v: String(data.total_states), color: "rgba(255,255,255,0.7)", isN: true },
                { l: "Leader", v: data.strongest_state, color: "#34D399" },
                { l: "Laggard", v: data.weakest_state, color: "#F87171" },
              ] : tab === "party" ? [
                { l: "Parties", v: String(data.total_parties), color: "rgba(255,255,255,0.7)", isN: true },
                { l: "Dominant", v: data.dominant_party, color: "#34D399" },
                { l: "Weakest", v: data.weakest_party, color: "#F87171" },
              ] : tab === "inequality" ? [
                { l: "Most Unequal", v: data.most_unequal_state, color: "#F87171" },
                { l: "Most Balanced", v: data.most_balanced_state, color: "#34D399" },
              ] : [
                { l: "Avg LCI", v: data.national_avg_lci?.toFixed(4), color: "#60A5FA" },
                { l: "Over", v: data.most_overperforming_state, color: "#34D399" },
                { l: "Under", v: data.most_underperforming_state, color: "#F87171" },
              ]).map((c: any) => (
                <div key={c.l} style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "4px" }}>{c.l}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "22px", fontWeight: 700, color: c.color, lineHeight: 1 }}>
                    {c.isN ? <Counter to={Number(c.v)} /> : c.v}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ══ LOADING ════════════════════════════════════ */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "100px 0", gap: "16px" }}>
            <div style={{ width: "36px", height: "36px", border: `3px solid ${active.color}20`, borderTop: `3px solid ${active.color}`, borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>Connecting to data…</span>
          </div>
        )}

        {/* ══ CONTENT ════════════════════════════════════ */}
        {data && !loading && (
          <>
            {/* Scrolling ticker */}
            {tickerItems.length > 0 && <Ticker items={tickerItems} color={active.color} />}

            {/* Main chart card */}
            <div style={{
              marginTop: "20px",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "20px",
              border: "1px solid rgba(255,255,255,0.07)",
              overflow: "hidden",
              boxShadow: `0 0 80px ${active.color}08`,
            }}>
              {/* Chart header strip */}
              <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.02)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: active.color, boxShadow: `0 0 8px ${active.color}` }} />
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>
                    {viewMode === "chart" ? `Top ${top15.length} of ${rows.length}` : viewMode === "radar" ? `Top 6 Radar View` : `All ${rows.length} entries`}
                  </span>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>·</span>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>{active.desc}</span>
                </div>
                <div style={{ display: "flex", gap: "16px" }}>
                  {[{ c: active.color, l: "High" }, { c: active.color+"88", l: "Mid" }, { c: active.color+"44", l: "Low" }].map(x => (
                    <div key={x.l} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: x.c }} />
                      <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>{x.l}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: "20px 20px 8px" }}>
                {viewMode === "chart" && renderChart()}
                {viewMode === "radar" && renderRadar()}
                {viewMode === "table" && renderTable()}
              </div>

              {/* Bottom strip */}
              <div style={{ padding: "12px 24px", borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", gap: "24px", background: "rgba(0,0,0,0.2)" }}>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>Avg <strong style={{ color: active.color }}>{avg.toFixed(4)}</strong></span>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>Peak <strong style={{ color: "#34D399" }}>{leader?.val.toFixed(4)}</strong></span>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>Floor <strong style={{ color: "#F87171" }}>{laggard?.val.toFixed(4)}</strong></span>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>Gap <strong style={{ color: "rgba(255,255,255,0.5)" }}>{((leader?.val ?? 0) - (laggard?.val ?? 0)).toFixed(4)}</strong></span>
              </div>
            </div>

            {/* ══ BOTTOM GRID: Leaderboard + Worst 5 ══ */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "16px" }}>

              {/* Top 5 leaderboard */}
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: active.color }} />
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.14em" }}>Top 5 Performers</span>
                </div>
                {rows.slice(0, 5).map((r, i) => (
                  <div key={r.key} style={{ padding: "13px 20px", borderBottom: "1px solid rgba(255,255,255,0.03)", display: "flex", alignItems: "center", gap: "14px" }}>
                    <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "20px", fontWeight: 700, color: i < 3 ? ["#FFD700","#C0C0C0","#CD7F32"][i] : "rgba(255,255,255,0.15)", minWidth: "24px" }}>{i+1}</span>
                    <span style={{ flex: 1, fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>{r.key}</span>
                    <div style={{ width: "60px", height: "3px", background: "rgba(255,255,255,0.05)", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(r.val/maxVal)*100}%`, background: active.color, borderRadius: "2px" }} />
                    </div>
                    <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "15px", fontWeight: 700, color: active.color, minWidth: "52px", textAlign: "right" }}>{r.val.toFixed(3)}</span>
                  </div>
                ))}
              </div>

              {/* Bottom 5 */}
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#F87171", animation: "blink 1.5s ease-in-out infinite" }} />
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.14em" }}>Needs Attention</span>
                </div>
                {rows.slice(-5).reverse().map((r, i) => (
                  <div key={r.key} style={{ padding: "13px 20px", borderBottom: "1px solid rgba(255,255,255,0.03)", display: "flex", alignItems: "center", gap: "14px" }}>
                    <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "20px", fontWeight: 700, color: "rgba(248,113,113,0.3)", minWidth: "24px" }}>{rows.length - i}</span>
                    <span style={{ flex: 1, fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.55)" }}>{r.key}</span>
                    <div style={{ width: "60px", height: "3px", background: "rgba(255,255,255,0.05)", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(r.val/maxVal)*100}%`, background: "#F87171", borderRadius: "2px" }} />
                    </div>
                    <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "15px", fontWeight: 700, color: "#F87171", minWidth: "52px", textAlign: "right" }}>{r.val.toFixed(3)}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {!loading && !data && (
          <div style={{ textAlign: "center", padding: "100px 0" }}>
            <div style={{ fontSize: "40px", opacity: 0.1, marginBottom: "16px" }}>◎</div>
            <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.3)", marginBottom: "6px" }}>Cannot connect to Flask API</div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.15)" }}>Make sure Flask is running on port 5000</div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin         { to { transform: rotate(360deg); } }
        @keyframes blink        { 0%,100%{opacity:1} 50%{opacity:0.2} }
        @keyframes scrollTicker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
      `}</style>
    </div>
  );
}