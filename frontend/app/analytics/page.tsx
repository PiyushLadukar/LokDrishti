"use client";
import { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, ReferenceLine, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area,
} from "recharts";
import {
  getStateStrength, getPartyDominance,
  getInequality, getImbalance,
} from "@/lib/api";

type Tab = "state" | "party" | "inequality" | "imbalance";

/* ── THEME ────────────────────────────────────────────────── */
const T = {
  bg:       "#F8F5F0",
  bgCard:   "#FFFFFF",
  bgDeep:   "#F2EDE6",
  text:     "#1A1A2E",
  textSub:  "#6B7280",
  border:   "#E5DDD5",
  orange:   "#FF6B00",
  blue:     "#2563EB",
  red:      "#DC2626",
  green:    "#059669",
  teal:     "#0891B2",
};

/* ── ANIMATED COUNTER ─────────────────────────────────────── */
function Counter({ to, dec = 0 }: { to: number; dec?: number }) {
  const [v, setV] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    if (done.current || !to) return;
    done.current = true;
    let cur = 0; const step = to / (1200 / 14);
    const t = setInterval(() => {
      cur += step;
      if (cur >= to) { setV(to); clearInterval(t); } else setV(cur);
    }, 14);
    return () => clearInterval(t);
  }, [to]);
  return <>{v.toFixed(dec)}</>;
}

/* ── SCROLL REVEAL ────────────────────────────────────────── */
function Reveal({ children, delay = 0, up = true }: { children: React.ReactNode; delay?: number; up?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translate(0,0)" : up ? "translateY(28px)" : "translateX(-20px)",
      transition: `opacity 0.65s ease ${delay}ms, transform 0.65s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
    }}>{children}</div>
  );
}

/* ── CUSTOM TOOLTIP ───────────────────────────────────────── */
function LightTooltip({ active, payload, labelKey, valueKey, color }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  const val = d?.[valueKey] ?? 0;
  const pct = Math.round(val * 100);
  const grade = pct >= 60 ? "A — Excellent" : pct >= 40 ? "B — Good" : pct >= 25 ? "C — Average" : "D — Below Avg";
  const gc    = pct >= 60 ? T.green : pct >= 40 ? T.orange : pct >= 25 ? "#D97706" : T.red;
  return (
    <div style={{ background: "white", borderRadius: 14, padding: "14px 18px",
      border: `1px solid ${color}30`,
      boxShadow: "0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.08)",
      minWidth: 200 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 10,
        borderBottom: `1px solid ${T.border}`, paddingBottom: 8,
        fontFamily: "'DM Sans',sans-serif" }}>{d?.[labelKey]}</div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: T.textSub }}>Performance Score</span>
        <span style={{ fontSize: 13, fontWeight: 800, color, fontFamily: "'Cormorant Garamond',serif" }}>{val.toFixed(4)}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
        <span style={{ fontSize: 12, color: T.textSub }}>Rating</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: gc,
          background: `${gc}15`, padding: "2px 10px", borderRadius: 20 }}>{grade}</span>
      </div>
    </div>
  );
}

/* ── PULSE DOT ────────────────────────────────────────────── */
function PulseDot({ color }: { color: string }) {
  return (
    <div style={{ position: "relative", width: 10, height: 10, flexShrink: 0 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%",
        background: color, animation: "pingOut 2s ease-out infinite", opacity: 0.35 }}/>
      <div style={{ position: "absolute", inset: 2, borderRadius: "50%", background: color }}/>
    </div>
  );
}

/* ── ANIMATED BAR ROW ─────────────────────────────────────── */
function BarRow({ rank, name, val, max, color, i }: any) {
  const [hov, setHov] = useState(false);
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setTimeout(() => setWidth((val / max) * 100), i * 50 + 100);
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [val, max, i]);

  const medals = ["🥇", "🥈", "🥉"];
  const pct = Math.round((val / max) * 100);
  const grade = pct >= 75 ? "A" : pct >= 50 ? "B" : pct >= 30 ? "C" : "D";
  const gradeColor = pct >= 75 ? T.green : pct >= 50 ? T.orange : pct >= 30 ? "#D97706" : T.red;

  return (
    <div ref={ref}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 14, padding: "12px 16px",
        borderRadius: 12, cursor: "default",
        background: hov ? `${color}08` : "transparent",
        border: `1px solid ${hov ? color + "30" : "transparent"}`,
        transform: hov ? "translateX(4px)" : "translateX(0)",
        transition: "all 0.22s cubic-bezier(0.4,0,0.2,1)",
      }}>
      {/* Rank */}
      <div style={{ width: 28, textAlign: "center", flexShrink: 0 }}>
        {rank <= 3
          ? <span style={{ fontSize: 18 }}>{medals[rank - 1]}</span>
          : <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15,
              fontWeight: 700, color: "#CBD5E1" }}>{rank}</span>}
      </div>
      {/* Name + bar */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600,
          color: hov ? color : T.text, transition: "color 0.2s",
          marginBottom: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {name}
        </div>
        <div style={{ height: 6, background: T.bgDeep, borderRadius: 3, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${width}%`,
            background: rank <= 3
              ? `linear-gradient(90deg,${color},${color}cc)`
              : `linear-gradient(90deg,${color}80,${color}50)`,
            borderRadius: 3,
            boxShadow: rank <= 3 ? `0 0 8px ${color}50` : "none",
            transition: "width 1.1s cubic-bezier(0.4,0,0.2,1)",
          }}/>
        </div>
      </div>
      {/* Score */}
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16,
          fontWeight: 700, color: hov ? color : T.text, transition: "color 0.2s" }}>
          {val.toFixed(3)}
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, color: gradeColor,
          background: `${gradeColor}15`, padding: "1px 7px",
          borderRadius: 10, display: "inline-block", marginTop: 2 }}>{grade}</div>
      </div>
    </div>
  );
}

/* ── BIG STAT CARD ────────────────────────────────────────── */
function BigStat({ label, emoji, value, sub, color, delay = 0 }: any) {
  const [hov, setHov] = useState(false);
  const [vis, setVis] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? `linear-gradient(135deg,white,${color}06)` : "white",
        borderRadius: 20, padding: "24px 22px",
        borderTop: `4px solid ${color}`,
        borderLeft: "1px solid #E5DDD5",
        borderRight: "1px solid #E5DDD5",
        borderBottom: "1px solid #E5DDD5",
        boxShadow: hov
          ? `0 20px 60px rgba(0,0,0,0.1), 0 0 0 1px ${color}20`
          : "0 2px 16px rgba(0,0,0,0.06)",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        opacity: vis ? 1 : 0,
        transitionDelay: `${delay}ms`,
        cursor: "default",
      }}>
      <div style={{ fontSize: 28, marginBottom: 10 }}>{emoji}</div>
      <div style={{ fontSize: 10, fontWeight: 800, color: color,
        textTransform: "uppercase", letterSpacing: "0.18em", marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28,
        fontWeight: 700, color: T.text, lineHeight: 1.1, marginBottom: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: T.textSub, marginTop: 6, lineHeight: 1.5 }}>{sub}</div>}
    </div>
  );
}

/* ── TICKER ───────────────────────────────────────────────── */
function Ticker({ items, color }: { items: { label: string; val: string }[]; color: string }) {
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: "hidden", whiteSpace: "nowrap",
      background: color + "08",
      borderTop: `1px solid ${color}20`,
      borderBottom: `1px solid ${color}20`,
      padding: "10px 0" }}>
      <div style={{ display: "inline-block", animation: "scrollTicker 30s linear infinite" }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ marginRight: 48, fontSize: 12, fontWeight: 600 }}>
            <span style={{ color: T.textSub }}>{item.label}</span>
            <span style={{ color, marginLeft: 8,
              fontFamily: "'Cormorant Garamond',serif", fontSize: 15, fontWeight: 700 }}>
              {item.val}
            </span>
            <span style={{ color: T.border, marginLeft: 48 }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── EXPLAINER CHIP ───────────────────────────────────────── */
function Chip({ text, color }: { text: string; color: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6,
      padding: "5px 12px", borderRadius: 100,
      background: `${color}12`, border: `1px solid ${color}25`,
      fontSize: 12, fontWeight: 600, color, whiteSpace: "nowrap" }}>
      {text}
    </span>
  );
}

/* ══ MAIN PAGE ══════════════════════════════════════════════ */
export default function AnalyticsPage() {
  const [tab, setTab]         = useState<Tab>("state");
  const [cache, setCache]     = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"chart" | "radar" | "table">("chart");
  const [copied, setCopied]   = useState(false);
  const [hovBar, setHovBar]   = useState<string | null>(null);
  const [vis, setVis]         = useState(false);

  useEffect(() => {
    setTimeout(() => setVis(true), 80);
    const prev = parseInt(localStorage.getItem("ld_analytics") || "0");
    localStorage.setItem("ld_analytics", String(prev + 1));
  }, []);

  useEffect(() => { if (!cache[tab]) load(tab); }, [tab]);

  async function load(t: Tab) {
    setLoading(true);
    try {
      const fns: Record<Tab, () => Promise<any>> = {
        state:      getStateStrength,
        party:      getPartyDominance,
        inequality: getInequality,
        imbalance:  getImbalance,
      };
      const result = await fns[t]();
      setCache(p => ({ ...p, [t]: result }));
    } catch (e) {
      console.error("Analytics load error:", e);
    }
    setLoading(false);
  }

  const tabs: { key: Tab; label: string; emoji: string; color: string; desc: string; explain: string }[] = [
    { key: "state",      label: "State Report Card",    emoji: "🗺️", color: T.orange, desc: "How well each state performs",        explain: "Which state sends the most active MPs to Parliament?" },
    { key: "party",      label: "Party Performance",    emoji: "🏛️", color: T.blue,   desc: "Which party works harder",            explain: "Do your party's MPs ask questions and attend sessions?" },
    { key: "inequality", label: "Inequality Inside States", emoji:"⚖️",color:T.red,   desc: "Are MPs equal within a state?",       explain: "In some states, one MP does all the work while others sleep." },
    { key: "imbalance",  label: "Fair Representation",  emoji: "📊", color: T.teal,   desc: "Performance vs seats won",            explain: "Do states perform proportionally to how many MPs they elect?" },
  ];
  const active = tabs.find(t => t.key === tab)!;

  const getRows = () => {
    const d = cache[tab]?.data;
    if (!d) return [];
    if (tab === "state")      return d.map((x:any) => ({ key: x.state, val: x.state_strength_index }));
    if (tab === "party")      return d.map((x:any) => ({ key: x.party, val: x.party_dominance_index }));
    if (tab === "inequality") return d.map((x:any) => ({ key: x.state, val: x.performance_std }));
    return                         d.map((x:any) => ({ key: x.state, val: x.imbalance_score }));
  };

  const data    = cache[tab];
  const rows    = getRows().sort((a,b) => b.val - a.val);
  const top15   = rows.slice(0, 15);
  const avg     = rows.length ? rows.reduce((s,r) => s + r.val, 0) / rows.length : 0;
  const maxVal  = rows[0]?.val || 1;
  const leader  = rows[0];
  const laggard = rows[rows.length - 1];
  const ticker  = rows.slice(0, 20).map(r => ({ label: r.key, val: r.val.toFixed(3) }));
  const radarD  = top15.slice(0,6).map(r => ({ subject: r.key.length > 8 ? r.key.slice(0,7)+"…" : r.key, value: r.val, fullMark: maxVal }));

  const insight = (() => {
    if (!leader) return "";
    if (tab === "state")      return `${leader.key} sends the most active MPs — ${(leader.val/avg).toFixed(1)}× better than average`;
    if (tab === "party")      return `${leader.key} leads with the most parliamentary participation`;
    if (tab === "inequality") return `Inside ${leader.key}, MPs vary widely — one active, rest missing`;
    return `${data?.most_overperforming_state ?? "—"} punches above its weight vs seats`;
  })();

  const share = () => {
    navigator.clipboard.writeText(`LokDrishti · ${active.label}\n18th Lok Sabha · PRS Legislative Research`).catch(()=>{});
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  /* Context cards */
  const ctxCards = data && !loading ? (
    tab === "state" ? [
      { label:"Best State", emoji:"🏆", value:data.strongest_state, sub:"Most active MPs",  color:T.green },
      { label:"Needs Work", emoji:"⚠️", value:data.weakest_state,   sub:"Least active MPs", color:T.red   },
      { label:"States Tracked",emoji:"📍",value:String(data.total_states), sub:"Across India",color:T.orange},
      { label:"Avg Score",  emoji:"📊", value:avg.toFixed(3), sub:"National benchmark",   color:T.blue  },
    ] : tab === "party" ? [
      { label:"Top Party",  emoji:"🏆", value:data.dominant_party,   sub:"Most productive", color:T.green },
      { label:"Lagging",    emoji:"⚠️", value:data.weakest_party,    sub:"Low participation",color:T.red  },
      { label:"Parties",    emoji:"🏛️", value:String(data.total_parties), sub:"Analysed",   color:T.orange},
      { label:"Avg Score",  emoji:"📊", value:avg.toFixed(3),         sub:"Across parties",  color:T.blue  },
    ] : tab === "inequality" ? [
      { label:"Most Unequal",emoji:"😟", value:data.most_unequal_state,  sub:"MPs vary widely",    color:T.red    },
      { label:"Most Equal",  emoji:"✅", value:data.most_balanced_state,  sub:"All MPs work equally",color:T.green },
      { label:"Avg Gap",     emoji:"📏", value:avg.toFixed(4), sub:"Inequality score", color:T.orange },
    ] : [
      { label:"Over-achiever",emoji:"🚀",value:data.most_overperforming_state,sub:"More than their share",color:T.green},
      { label:"Under-deliver",emoji:"📉",value:data.most_underperforming_state,sub:"Less than their share",color:T.red },
      { label:"Avg LCI",     emoji:"📊", value:data.national_avg_lci?.toFixed(4)||"—",sub:"Baseline score",color:T.blue},
    ]
  ) : [];

  /* ── CHART ── */
  const renderChart = () => (
    <div style={{ height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={top15.map(r => ({...r,[tab]:r.val}))}
          margin={{ top:12, right:16, bottom:60, left:0 }} barCategoryGap="32%">
          <defs>
            <linearGradient id={`g_${tab}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={active.color} stopOpacity={1}/>
              <stop offset="100%" stopColor={active.color} stopOpacity={0.4}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 6" stroke={T.border} vertical={false}/>
          <XAxis dataKey="key"
            tick={{ fontSize:11, fill:T.textSub, fontFamily:"'DM Sans'" }}
            angle={-35} textAnchor="end" interval={0}
            axisLine={false} tickLine={false}/>
          <YAxis tick={{ fontSize:11, fill:T.textSub }}
            axisLine={false} tickLine={false}
            tickFormatter={v=>v.toFixed(2)} width={40}/>
          <Tooltip
            content={<LightTooltip labelKey="key" valueKey={tab} color={active.color}/>}
            cursor={{ fill:`${active.color}06`, radius:6 }}/>
          <ReferenceLine y={avg} stroke={active.color} strokeDasharray="6 4" strokeWidth={1.5}
            label={{ value:"National Avg", position:"insideTopLeft",
              fill:active.color, fontSize:10, fontWeight:700 }}/>
          <Bar dataKey={tab} radius={[8,8,0,0]} maxBarSize={38}
            onMouseEnter={(d:any)=>setHovBar(d.key)}
            onMouseLeave={()=>setHovBar(null)}>
            {top15.map(r=>(
              <Cell key={r.key}
                fill={hovBar===r.key ? active.color : `url(#g_${tab})`}
                opacity={hovBar && hovBar!==r.key ? 0.35 : 1}
                style={{ filter:hovBar===r.key?`drop-shadow(0 4px 12px ${active.color}50)`:"none" }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  /* ── RADAR ── */
  const renderRadar = () => (
    <div style={{ height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={radarD} margin={{ top:24, right:52, bottom:24, left:52 }}>
          <PolarGrid stroke={T.border}/>
          <PolarAngleAxis dataKey="subject"
            tick={{ fontSize:12, fill:T.textSub, fontFamily:"'DM Sans'" }}/>
          <PolarRadiusAxis tick={false} axisLine={false}/>
          <Radar dataKey="value" stroke={active.color}
            fill={active.color} fillOpacity={0.18} strokeWidth={2.5}/>
          <Tooltip content={<LightTooltip labelKey="subject" valueKey="value" color={active.color}/>}/>
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );

  /* ── TABLE ── */
  const renderTable = () => (
    <div style={{ maxHeight:480, overflowY:"auto" }}>
      {rows.map((r, i) => {
        const pct = Math.round((r.val/maxVal)*100);
        const gc  = pct>=75?T.green:pct>=50?T.orange:pct>=30?"#D97706":T.red;
        const grade = pct>=75?"A":pct>=50?"B":pct>=30?"C":"D";
        const explain = pct>=75?"Excellent":pct>=50?"Good":pct>=30?"Average":"Needs Attention";
        return (
          <div key={r.key} style={{
            display:"grid", gridTemplateColumns:"44px 1fr 120px 64px 110px",
            alignItems:"center", gap:12, padding:"12px 20px",
            borderBottom:`1px solid ${T.border}`,
            background:i%2===0?"white":`${T.bgDeep}`,
          }}>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontWeight:700,
              color:i<3?["#F59E0B","#94A3B8","#CD7F32"][i]:"#CBD5E1" }}>{i+1}</span>
            <span style={{ fontSize:13, fontWeight:600, color:T.text }}>{r.key}</span>
            <div style={{ height:6, background:T.bgDeep, borderRadius:3, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${pct}%`, background:gc, borderRadius:3 }}/>
            </div>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16,
              fontWeight:700, color:active.color, textAlign:"right" }}>{r.val.toFixed(4)}</span>
            <span style={{ fontSize:11, fontWeight:700, color:gc,
              background:`${gc}15`, padding:"3px 10px", borderRadius:20,
              textAlign:"center" }}>{grade} · {explain}</span>
          </div>
        );
      })}
    </div>
  );

  const fadeIn = (d: number): React.CSSProperties => ({
    opacity: vis ? 1 : 0,
    transform: vis ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 0.65s ease ${d}ms, transform 0.65s cubic-bezier(0.4,0,0.2,1) ${d}ms`,
  });

  return (
    <div style={{ minHeight:"100vh", fontFamily:"'DM Sans',sans-serif",
      background:T.bg, color:T.text, overflowX:"hidden" }}>

      <style>{`
        @keyframes spin         { to{transform:rotate(360deg)} }
        @keyframes pingOut      { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(2.8);opacity:0} }
        @keyframes scrollTicker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes blink        { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes floatUp      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes shimmerScan  { 0%{left:-60%} 100%{left:120%} }
        @keyframes gradShift    { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }

        *,*::before,*::after { box-sizing:border-box; }
        ::selection { background: rgba(255,107,0,0.2); }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:#F0EAE0; }
        ::-webkit-scrollbar-thumb { background:#D4CAC0; border-radius:3px; }

        .tab-pill { transition: all 0.2s cubic-bezier(0.4,0,0.2,1); }
        .tab-pill:hover { transform: translateY(-1px); }
        .view-pill { transition: all 0.18s; }
        .view-pill:hover { transform: scale(1.02); }
      `}</style>

      {/* ── TOP HERO HEADER ── */}
      <div style={{
        background:"linear-gradient(135deg,#0A1628 0%,#1E293B 60%,#0F172A 100%)",
        padding:"0 0 0 0", position:"relative", overflow:"hidden",
      }}>
        {/* Tricolor top stripe */}
        <div style={{ height:3, background:"linear-gradient(90deg,#FF6B00 33%,white 33%,white 66%,#138808 66%)" }}/>

        {/* Dot grid */}
        <div style={{ position:"absolute", inset:0, pointerEvents:"none",
          backgroundImage:"radial-gradient(rgba(255,255,255,0.04) 1px,transparent 1px)",
          backgroundSize:"24px 24px" }}/>

        {/* Orange glow */}
        <div style={{ position:"absolute", left:"-5%", top:"50%", transform:"translateY(-50%)",
          width:500, height:500, borderRadius:"50%",
          background:"radial-gradient(circle,rgba(255,107,0,0.15) 0%,transparent 70%)",
          animation:"floatUp 7s ease-in-out infinite", pointerEvents:"none" }}/>

        <div style={{ maxWidth:1280, margin:"0 auto", padding:"36px 48px 44px", position:"relative", zIndex:1 }}>
          {/* Eyebrow */}
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16, ...fadeIn(0) }}>
            <div style={{ width:3, height:16, background:"#FF6B00", borderRadius:2 }}/>
            <span style={{ fontSize:10, fontWeight:800, color:"rgba(255,255,255,0.5)",
              textTransform:"uppercase", letterSpacing:"0.22em" }}>
              18th Lok Sabha · Parliament of India · Open Data
            </span>
          </div>

          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"flex-end", flexWrap:"wrap", gap:24 }}>
            <div style={{ ...fadeIn(60) }}>
              <h1 style={{ fontFamily:"'Cormorant Garamond',serif",
                fontSize:"clamp(36px,4.5vw,64px)", fontWeight:700,
                color:"white", letterSpacing:"-2px", lineHeight:1, marginBottom:12 }}>
                Parliamentary{" "}
                <em style={{ color:"#FF6B00" }}>Analytics</em>
              </h1>
              <p style={{ fontSize:15, color:"rgba(255,255,255,0.45)",
                maxWidth:520, lineHeight:1.75 }}>
                Raw data from PRS Legislative Research. See exactly how your state, party, and
                representative performs in Parliament — no spin, no opinion.
              </p>
            </div>
            {/* Live badge */}
            <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 20px",
              background:"rgba(255,255,255,0.06)", borderRadius:100,
              border:"1px solid rgba(255,255,255,0.12)", ...fadeIn(120) }}>
              <PulseDot color="#22C55E"/>
              <span style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.7)" }}>
                Live · 18th Lok Sabha
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── TAB RAIL ── */}
      <div style={{ background:"white", borderBottom:`1px solid ${T.border}`,
        position:"sticky", top:62, zIndex:50,
        boxShadow:"0 2px 16px rgba(0,0,0,0.06)", ...fadeIn(0) }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 48px",
          display:"flex", alignItems:"stretch" }}>
          {tabs.map(t => {
            const on = tab===t.key;
            return (
              <button key={t.key} onClick={()=>setTab(t.key)}
                className="tab-pill"
                style={{ display:"flex", flexDirection:"column", alignItems:"flex-start",
                  padding:"14px 22px", border:"none", cursor:"pointer", background:"transparent",
                  borderBottom:`3px solid ${on ? t.color : "transparent"}`,
                  position:"relative", minWidth:185 }}>
                {/* Animated underline fill */}
                {on && <div style={{ position:"absolute", bottom:0, left:0, right:0, height:3,
                  background:`linear-gradient(90deg,${t.color},${t.color}60)`,
                  borderRadius:"3px 3px 0 0",
                  overflow:"hidden" }}>
                  <div style={{ position:"absolute", top:0, bottom:0, width:"50%",
                    background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)",
                    animation:"shimmerScan 1.8s ease-in-out infinite" }}/>
                </div>}
                <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:3 }}>
                  <span style={{ fontSize:16 }}>{t.emoji}</span>
                  <span style={{ fontSize:13, fontWeight:700,
                    color: on ? T.text : T.textSub }}>{t.label}</span>
                </div>
                <span style={{ fontSize:10.5, color: on ? t.color : "#CBD5E1",
                  fontWeight:600, transition:"color 0.2s" }}>{t.desc}</span>
              </button>
            );
          })}
          {/* Right controls */}
          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ display:"flex", background:T.bgDeep, borderRadius:10,
              padding:3, border:`1px solid ${T.border}` }}>
              {(["chart","radar","table"] as const).map(v=>(
                <button key={v} className="view-pill" onClick={()=>setViewMode(v)}
                  style={{ padding:"6px 14px", borderRadius:8, border:"none", cursor:"pointer",
                    background:viewMode===v?"white":"transparent",
                    color:viewMode===v?active.color:T.textSub,
                    fontSize:10.5, fontWeight:700, textTransform:"uppercase",
                    letterSpacing:"0.1em", fontFamily:"'DM Sans',sans-serif",
                    boxShadow:viewMode===v?"0 2px 8px rgba(0,0,0,0.1)":"none",
                    transition:"all 0.18s" }}>
                  {v==="chart"?"📊 Chart":v==="radar"?"🕸 Radar":"📋 Table"}
                </button>
              ))}
            </div>
            <button onClick={share} style={{ padding:"8px 16px",
              background:copied?`${T.green}12`:`${T.orange}10`,
              borderLeft:`1px solid ${T.border}`, borderRight:`1px solid ${T.border}`,
              borderTop:`1px solid ${T.border}`, borderBottom:`1px solid ${T.border}`,
              borderRadius:10, cursor:"pointer", fontSize:11, fontWeight:700,
              color:copied?T.green:T.orange, fontFamily:"'DM Sans',sans-serif",
              transition:"all 0.2s" }}>
              {copied?"✓ Copied":"↗ Share"}
            </button>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 48px 80px" }}>

        {/* ── SECTION HEADER ── */}
        <div style={{ padding:"40px 0 28px", borderBottom:`1px solid ${T.border}`,
          marginBottom:28, ...fadeIn(80) }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"flex-end", flexWrap:"wrap", gap:16 }}>
            <div>
              {/* Big question this section answers */}
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                <span style={{ fontSize:28 }}>{active.emoji}</span>
                <h2 style={{ fontFamily:"'Cormorant Garamond',serif",
                  fontSize:"clamp(24px,3vw,40px)", fontWeight:700,
                  color:T.text, letterSpacing:"-0.5px", margin:0 }}>
                  {active.label}
                </h2>
              </div>
              {/* Plain English explainer */}
              <div style={{ display:"flex", alignItems:"center", gap:10,
                padding:"10px 16px", borderRadius:12,
                background:`${active.color}08`,
                border:`1px solid ${active.color}20`,
                marginBottom:12, maxWidth:600 }}>
                <span style={{ fontSize:16 }}>💬</span>
                <span style={{ fontSize:13, color:T.text, lineHeight:1.6 }}>
                  <strong>In plain English:</strong> {active.explain}
                </span>
              </div>
              {/* Insight chip */}
              {data && !loading && insight && (
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <PulseDot color={active.color}/>
                  <span style={{ fontSize:13, color:T.textSub, fontStyle:"italic" }}>{insight}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── LOADING ── */}
        {loading && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center",
            padding:"100px 0", gap:20 }}>
            <div style={{ position:"relative", width:56, height:56 }}>
              <div style={{ position:"absolute", inset:0, borderRadius:"50%",
                border:`3px solid ${active.color}20`,
                borderTop:`3px solid ${active.color}`,
                animation:"spin 0.85s linear infinite" }}/>
              <div style={{ position:"absolute", inset:10, borderRadius:"50%",
                border:`2px solid ${T.border}`,
                borderBottom:`2px solid ${active.color}80`,
                animation:"spin 1.3s linear infinite reverse" }}/>
            </div>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:14, fontWeight:600, color:T.text, marginBottom:4 }}>
                Fetching parliamentary data…
              </div>
              <div style={{ fontSize:12, color:T.textSub }}>
                18th Lok Sabha · PRS Legislative Research
              </div>
            </div>
          </div>
        )}

        {/* ── CONTENT ── */}
        {data && !loading && (
          <>
            {/* Context cards */}
            {ctxCards.length > 0 && (
              <div style={{ display:"grid",
                gridTemplateColumns:`repeat(${ctxCards.length},1fr)`,
                gap:14, marginBottom:24 }}>
                {(ctxCards as any[]).map((c,i)=>(
                  <Reveal key={c.label} delay={i*70}>
                    <BigStat {...c} delay={i*70}/>
                  </Reveal>
                ))}
              </div>
            )}

            {/* Ticker */}
            <Reveal delay={160}>
              <Ticker items={ticker} color={active.color}/>
            </Reveal>

            {/* ── MAIN CHART CARD ── */}
            <Reveal delay={220}>
              <div style={{ marginTop:20, borderRadius:22, background:"white",
                borderLeft:`1px solid ${T.border}`,
                borderRight:`1px solid ${T.border}`,
                borderBottom:`1px solid ${T.border}`,
                borderTop:`3px solid ${active.color}`,
                boxShadow:"0 4px 32px rgba(0,0,0,0.07)",
                overflow:"hidden" }}>

                {/* Chart header */}
                <div style={{ padding:"16px 24px",
                  borderBottom:`1px solid ${T.border}`,
                  display:"flex", justifyContent:"space-between", alignItems:"center",
                  background:T.bgDeep }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <PulseDot color={active.color}/>
                    <span style={{ fontSize:13, fontWeight:700, color:T.text }}>
                      {viewMode==="chart"?`Top ${top15.length} of ${rows.length} — ${active.label}`:
                       viewMode==="radar"?"Top 6 — Radar Comparison":
                       `All ${rows.length} entries — Full List`}
                    </span>
                  </div>
                  <div style={{ display:"flex", gap:10 }}>
                    {[
                      { c:active.color,     l:"High performer"  },
                      { c:active.color+"80",l:"Average"         },
                      { c:active.color+"40",l:"Below average"   },
                    ].map(x=>(
                      <Chip key={x.l} text={x.l} color={active.color}/>
                    ))}
                  </div>
                </div>

                <div style={{ padding:"20px 20px 8px" }}>
                  {viewMode==="chart" && renderChart()}
                  {viewMode==="radar" && renderRadar()}
                  {viewMode==="table" && renderTable()}
                </div>

                {/* Bottom stats bar */}
                <div style={{ padding:"12px 24px",
                  borderTop:`1px solid ${T.border}`,
                  background:T.bgDeep,
                  display:"flex", gap:28, flexWrap:"wrap" }}>
                  {[
                    { l:"National Average", v:avg.toFixed(4),                          c:active.color },
                    { l:"Top Score",        v:leader?.val.toFixed(4),                  c:T.green      },
                    { l:"Lowest Score",     v:laggard?.val.toFixed(4),                 c:T.red        },
                    { l:"Total Range",      v:((leader?.val??0)-(laggard?.val??0)).toFixed(4), c:T.textSub },
                  ].map(s=>(
                    <div key={s.l} style={{ display:"flex", flexDirection:"column", gap:2 }}>
                      <span style={{ fontSize:9.5, fontWeight:700, color:T.textSub,
                        textTransform:"uppercase", letterSpacing:"0.12em" }}>{s.l}</span>
                      <span style={{ fontFamily:"'Cormorant Garamond',serif",
                        fontSize:18, fontWeight:700, color:s.c }}>{s.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* ── TOP 5 / BOTTOM 5 ── */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
              gap:16, marginTop:16 }}>

              <Reveal delay={280}>
                <div style={{ borderRadius:20, background:"white",
                  border:`1px solid ${T.border}`,
                  borderTop:`3px solid ${active.color}`,
                  boxShadow:"0 2px 16px rgba(0,0,0,0.05)", overflow:"hidden" }}>
                  <div style={{ padding:"16px 20px", borderBottom:`1px solid ${T.border}`,
                    display:"flex", alignItems:"center", gap:8, background:T.bgDeep }}>
                    <span style={{ fontSize:16 }}>🏆</span>
                    <span style={{ fontSize:12, fontWeight:800, color:T.textSub,
                      textTransform:"uppercase", letterSpacing:"0.14em" }}>Top 5 Performers</span>
                  </div>
                  <div style={{ padding:"8px 8px" }}>
                    {rows.slice(0,5).map((r,i)=>(
                      <BarRow key={r.key} rank={i+1} name={r.key} val={r.val}
                        max={maxVal} color={active.color} i={i}/>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={340}>
                <div style={{ borderRadius:20, background:"white",
                  border:`1px solid ${T.border}`,
                  borderTop:`3px solid ${T.red}`,
                  boxShadow:"0 2px 16px rgba(0,0,0,0.05)", overflow:"hidden" }}>
                  <div style={{ padding:"16px 20px", borderBottom:`1px solid ${T.border}`,
                    display:"flex", alignItems:"center", gap:8, background:`${T.red}06` }}>
                    <span style={{ fontSize:16 }}>⚠️</span>
                    <span style={{ fontSize:12, fontWeight:800, color:T.textSub,
                      textTransform:"uppercase", letterSpacing:"0.14em" }}>Needs Most Improvement</span>
                  </div>
                  <div style={{ padding:"8px 8px" }}>
                    {rows.slice(-5).reverse().map((r,i)=>(
                      <BarRow key={r.key} rank={rows.length-i} name={r.key} val={r.val}
                        max={maxVal} color={T.red} i={i}/>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>

            {/* ── FULL DISTRIBUTION ── */}
            <Reveal delay={400}>
              <div style={{ marginTop:16, borderRadius:20, background:"white",
                border:`1px solid ${T.border}`,
                boxShadow:"0 2px 16px rgba(0,0,0,0.05)", overflow:"hidden" }}>
                <div style={{ padding:"16px 24px", borderBottom:`1px solid ${T.border}`,
                  display:"flex", alignItems:"center", gap:10, background:T.bgDeep }}>
                  <span style={{ fontSize:16 }}>📈</span>
                  <span style={{ fontSize:12, fontWeight:800, color:T.textSub,
                    textTransform:"uppercase", letterSpacing:"0.14em" }}>
                    Full Distribution — All {rows.length} Entries
                  </span>
                  <span style={{ fontSize:11, color:T.textSub, marginLeft:4 }}>
                    · Area above the dashed line = better than national average
                  </span>
                </div>
                <div style={{ padding:"16px 20px 8px", height:140 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={rows.map((r,i)=>({i,val:r.val,name:r.key}))}
                      margin={{ top:4, right:4, bottom:0, left:0 }}>
                      <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%"   stopColor={active.color} stopOpacity={0.3}/>
                          <stop offset="100%" stopColor={active.color} stopOpacity={0.02}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="2 6" stroke={T.border} vertical={false}/>
                      <Area dataKey="val" stroke={active.color} strokeWidth={2}
                        fill="url(#areaGrad)" dot={false}/>
                      <ReferenceLine y={avg} stroke={active.color}
                        strokeDasharray="5 5" strokeWidth={1.5}/>
                      <Tooltip
                        content={({ active:a, payload:p }) => {
                          if (!a||!p?.length) return null;
                          const d = p[0].payload;
                          return (
                            <div style={{ background:"white", borderRadius:10,
                              padding:"8px 12px", border:`1px solid ${T.border}`,
                              boxShadow:"0 8px 24px rgba(0,0,0,0.1)", fontSize:12 }}>
                              <div style={{ fontWeight:700, color:T.text }}>{d.name}</div>
                              <div style={{ color:active.color, fontFamily:"'Cormorant Garamond',serif",
                                fontSize:15, fontWeight:700 }}>{d.val.toFixed(4)}</div>
                            </div>
                          );
                        }}/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ padding:"10px 24px 14px",
                  fontSize:11, color:T.textSub,
                  borderTop:`1px solid ${T.border}` }}>
                  📌 Hover over the curve to see individual scores
                </div>
              </div>
            </Reveal>

            {/* ── DATA SOURCE NOTE ── */}
            <Reveal delay={460}>
              <div style={{ marginTop:20, padding:"16px 24px", borderRadius:14,
                background:`${T.orange}06`,
                border:`1px solid ${T.orange}20`,
                display:"flex", alignItems:"center", gap:14 }}>
                <span style={{ fontSize:24 }}>ℹ️</span>
                <div>
                  <div style={{ fontSize:12, fontWeight:700, color:T.orange, marginBottom:3 }}>
                    About this data
                  </div>
                  <div style={{ fontSize:12, color:T.textSub, lineHeight:1.6 }}>
                    All scores are based on attendance, questions raised, and debate participation
                    by Members of Parliament in the 18th Lok Sabha.
                    Source: <strong style={{ color:T.text }}>PRS Legislative Research</strong> · Zero editorial bias.
                  </div>
                </div>
              </div>
            </Reveal>
          </>
        )}

        {/* ── ERROR ── */}
        {!loading && !data && (
          <div style={{ textAlign:"center", padding:"100px 0" }}>
            <div style={{ fontSize:48, marginBottom:16 }}>📡</div>
            <div style={{ fontSize:16, fontWeight:600, color:T.text, marginBottom:8 }}>
              Cannot reach the data server
            </div>
            <div style={{ fontSize:13, color:T.textSub }}>
              Make sure Flask is running on port 5000
            </div>
          </div>
        )}
      </div>
    </div>
  );
}