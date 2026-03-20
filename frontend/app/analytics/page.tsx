"use client";
import React from "react";
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
//theme
const T = {
  bg:      "#F7F4EF",
  bgCard:  "#FFFFFF",
  bgDeep:  "#EDE8E0",
  text:    "#1A1A2E",
  textSub: "#6B7280",
  border:  "#E0D8CE",
  orange:  "#FF6B00",
  blue:    "#2563EB",
  red:     "#DC2626",
  green:   "#059669",
  teal:    "#0891B2",
};

/* ── SVG ICON LIBRARY ─────────────────────────────────────── */
function Icon({ name, size = 20, color = "currentColor" }: { name: string; size?: number; color?: string }) {
  const s = { width: size, height: size, display: "block", flexShrink: 0 };
  const icons: Record<string, React.ReactNode> = {
    map: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
        <line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
      </svg>
    ),
    building: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 22V9l9-6 9 6v13H3z"/>
        <path d="M9 22V12h6v10"/>
        <path d="M12 3v3M7 10h2M15 10h2M7 14h2M15 14h2"/>
      </svg>
    ),
    scale: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v18M5 6l-2 6h4L5 6zM19 6l-2 6h4L19 6z"/>
        <path d="M3 18h6M15 18h6M8 21h8"/>
      </svg>
    ),
    barchart: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="12" width="4" height="9"/><rect x="10" y="7" width="4" height="14"/>
        <rect x="17" y="3" width="4" height="18"/>
        <line x1="2" y1="21" x2="22" y2="21"/>
      </svg>
    ),
    trophy: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 21h8M12 17v4M17 3H7v8a5 5 0 0010 0V3z"/>
        <path d="M7 4H4a1 1 0 00-1 1v3a4 4 0 004 4M17 4h3a1 1 0 011 1v3a4 4 0 01-4 4"/>
      </svg>
    ),
    warning: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    pin: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    activity: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    rocket: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/>
        <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/>
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
      </svg>
    ),
    trending_down: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
        <polyline points="17 18 23 18 23 12"/>
      </svg>
    ),
    ruler: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 20l18-18M7 20l-4-4M20 7l-4-4"/>
        <path d="M7.5 14.5l1.5-1.5M11 11l1.5-1.5M14.5 7.5l1.5-1.5"/>
      </svg>
    ),
    chat: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
    trending_up: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
        <polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
    info: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>
    ),
    wifi_off: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="1" y1="1" x2="23" y2="23"/>
        <path d="M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-2.39M10.71 5.05A16 16 0 0122.56 9M1.42 9a15.91 15.91 0 014.7-2.88"/>
        <path d="M8.53 16.11a6 6 0 016.95 0M12 20h.01"/>
      </svg>
    ),
    check: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
    share: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
      </svg>
    ),
    medal_gold:   (
      <svg style={s} viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="14" r="7" fill="#FEF3C7" stroke="#F59E0B"/>
        <text x="12" y="18" textAnchor="middle" fontSize="9" fontWeight="700" fill="#D97706">1</text>
        <path d="M8 4l-2-2H6v2l2 2M16 4l2-2h0v2l-2 2" stroke="#F59E0B"/>
        <path d="M9 6l3 1 3-1" stroke="#F59E0B"/>
      </svg>
    ),
    medal_silver: (
      <svg style={s} viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="14" r="7" fill="#F1F5F9" stroke="#94A3B8"/>
        <text x="12" y="18" textAnchor="middle" fontSize="9" fontWeight="700" fill="#64748B">2</text>
        <path d="M8 4l-2-2H6v2l2 2M16 4l2-2h0v2l-2 2" stroke="#94A3B8"/>
        <path d="M9 6l3 1 3-1" stroke="#94A3B8"/>
      </svg>
    ),
    medal_bronze: (
      <svg style={s} viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="14" r="7" fill="#FEF0E6" stroke="#CD7F32"/>
        <text x="12" y="18" textAnchor="middle" fontSize="9" fontWeight="700" fill="#CD7F32">3</text>
        <path d="M8 4l-2-2H6v2l2 2M16 4l2-2h0v2l-2 2" stroke="#CD7F32"/>
        <path d="M9 6l3 1 3-1" stroke="#CD7F32"/>
      </svg>
    ),
  };
  return icons[name] ?? <svg style={s} viewBox="0 0 24 24"/>;
}

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
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obs.disconnect(); }
    }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.65s ease ${delay}ms, transform 0.65s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
    }}>{children}</div>
  );
}

/* ── TOOLTIP ──────────────────────────────────────────────── */
function LightTooltip({ active, payload, labelKey, valueKey, color }: any) {
  if (!active || !payload?.length) return null;
  const d   = payload[0]?.payload;
  const val = d?.[valueKey] ?? 0;
  const pct = Math.round(val * 100);
  const grade = pct >= 60 ? "A — Excellent" : pct >= 40 ? "B — Good" : pct >= 25 ? "C — Average" : "D — Below Avg";
  const gc    = pct >= 60 ? T.green : pct >= 40 ? T.orange : pct >= 25 ? "#D97706" : T.red;
  return (
    <div style={{ background: "white", borderRadius: 14, padding: "14px 18px",
      border: `1px solid ${color}25`,
      boxShadow: "0 20px 60px rgba(0,0,0,0.12)", minWidth: 210 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 10,
        borderBottom: `1px solid ${T.border}`, paddingBottom: 8 }}>{d?.[labelKey]}</div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: T.textSub }}>Score</span>
        <span style={{ fontSize: 14, fontWeight: 800, color,
          fontFamily: "'Cormorant Garamond',serif" }}>{val.toFixed(4)}</span>
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
  //
  const pct = Math.round((val / max) * 100);
  const grade = pct >= 75 ? "A" : pct >= 50 ? "B" : pct >= 30 ? "C" : "D";
  const gc    = pct >= 75 ? T.green : pct >= 50 ? T.orange : pct >= 30 ? "#D97706" : T.red;
  const medalIcon = rank === 1 ? "medal_gold" : rank === 2 ? "medal_silver" : rank === 3 ? "medal_bronze" : null;

  return (
    <div ref={ref}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 14, padding: "12px 16px",
        borderRadius: 12, cursor: "default",
        background: hov ? `${color}08` : "transparent",
        border: `1px solid ${hov ? color + "25" : "transparent"}`,
        transform: hov ? "translateX(4px)" : "translateX(0)",
        transition: "all 0.22s cubic-bezier(0.4,0,0.2,1)",
      }}>
      <div style={{ width: 30, display: "flex", justifyContent: "center", flexShrink: 0 }}>
        {medalIcon
          ? <Icon name={medalIcon} size={28}/>
          : <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15,
              fontWeight:700, color:"#CBD5E1" }}>{rank}</span>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600,
          color: hov ? color : T.text, transition: "color 0.2s",
          marginBottom: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {name}
        </div>
        <div style={{ height: 6, background: T.bgDeep, borderRadius: 3, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${width}%`,
            background: rank <= 3 ? `linear-gradient(90deg,${color},${color}cc)` : `linear-gradient(90deg,${color}70,${color}40)`,
            borderRadius: 3, boxShadow: rank <= 3 ? `0 0 8px ${color}50` : "none",
            transition: "width 1.1s cubic-bezier(0.4,0,0.2,1)",
          }}/>
        </div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:700,
          color: hov ? color : T.text, transition:"color 0.2s" }}>{val.toFixed(3)}</div>
        <div style={{ fontSize:10, fontWeight:700, color:gc,
          background:`${gc}15`, padding:"1px 7px", borderRadius:10,
          display:"inline-block", marginTop:2 }}>{grade}</div>
      </div>
    </div>
  );
}

/* ── BIG STAT CARD ────────────────────────────────────────── */
function BigStat({ label, icon, value, sub, color, delay = 0 }: any) {
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
        borderRadius: 20, padding: "22px 20px",
        borderTop: `3px solid ${color}`,
        borderLeft: `1px solid ${T.border}`,
        borderRight: `1px solid ${T.border}`,
        borderBottom: `1px solid ${T.border}`,
        boxShadow: hov ? `0 16px 50px rgba(0,0,0,0.1),0 0 0 1px ${color}15` : "0 2px 16px rgba(0,0,0,0.06)",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        transition: `all 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.6s ease ${delay}ms`,
        opacity: vis ? 1 : 0,
        cursor: "default",
      }}>
      {/* Icon circle */}
      <div style={{ width: 44, height: 44, borderRadius: 12,
        background: `${color}12`, border: `1px solid ${color}20`,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 14, transition:"all 0.3s",
        boxShadow: hov ? `0 0 20px ${color}25` : "none" }}>
        <Icon name={icon} size={22} color={color}/>
      </div>
      <div style={{ fontSize: 10, fontWeight: 800, color: hov ? color : T.textSub,
        textTransform: "uppercase", letterSpacing: "0.18em", marginBottom: 6,
        transition:"color 0.2s" }}>{label}</div>
      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, fontWeight:700,
        color:T.text, lineHeight:1.1, marginBottom:4 }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:T.textSub, marginTop:6, lineHeight:1.5 }}>{sub}</div>}
    </div>
  );
}

/* ── TICKER ───────────────────────────────────────────────── */
function Ticker({ items, color }: { items: { label: string; val: string }[]; color: string }) {
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow:"hidden", whiteSpace:"nowrap",
      background:`${color}08`, borderTop:`1px solid ${color}18`,
      borderBottom:`1px solid ${color}18`, padding:"10px 0" }}>
      <div style={{ display:"inline-block", animation:"scrollTicker 30s linear infinite" }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ marginRight:48, fontSize:12, fontWeight:600 }}>
            <span style={{ color:T.textSub }}>{item.label}</span>
            <span style={{ color, marginLeft:8, fontFamily:"'Cormorant Garamond',serif",
              fontSize:15, fontWeight:700 }}>{item.val}</span>
            <span style={{ color:T.border, marginLeft:48 }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── PARLIAMENT ILLUSTRATION (SVG BG) ────────────────────── */
function ParliamentBg() {
  return (
    <svg style={{ position:"absolute", right:0, top:0, height:"100%", opacity:0.12, pointerEvents:"none" }}
      viewBox="0 0 600 300" preserveAspectRatio="xMaxYMid meet">
      {/* Parliament dome */}
      <ellipse cx="300" cy="200" rx="220" ry="30" fill="none" stroke="white" strokeWidth="1"/>
      <path d="M80 200 Q300 20 520 200" fill="none" stroke="white" strokeWidth="1.5"/>
      {/* Columns */}
      {[120,160,200,240,280,320,360,400,440,480].map((x,i) => (
        <rect key={i} x={x-2} y="160" width="4" height="40" fill="white" opacity="0.6"/>
      ))}
      {/* Base */}
      <rect x="80" y="198" width="440" height="8" fill="white"/>
      <rect x="60" y="206" width="480" height="6" fill="white"/>
      {/* Flag pole */}
      <line x1="300" y1="22" x2="300" y2="80" stroke="white" strokeWidth="2"/>
      {/* Chakra circle */}
      <circle cx="300" cy="22" r="12" fill="none" stroke="white" strokeWidth="1.5"/>
      {[0,45,90,135,180,225,270,315].map((deg,i) => {
        const r = deg * Math.PI / 180;
        return <line key={i} x1="300" y1="22"
          x2={300+10*Math.cos(r)} y2={22+10*Math.sin(r)}
          stroke="white" strokeWidth="0.8"/>;
      })}
      {/* Stars / seats */}
      {Array.from({length:30}).map((_,i) => (
        <circle key={i} cx={120+(i%10)*28} cy={230+Math.floor(i/10)*12} r="2"
          fill="white" opacity={0.4+0.3*(i%2)}/>
      ))}
    </svg>
  );
}

/* ── INDIA MAP DOTS PATTERN ───────────────────────────────── */
function DotGrid() {
  return (
    <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }}
      preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="12" cy="12" r="1.2" fill="rgba(255,107,0,0.18)"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)"/>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════ */
export default function AnalyticsPage() {
  const [tab, setTab]           = useState<Tab>("state");
  const [cache, setCache]       = useState<Record<string, any>>({});
  const [loading, setLoading]   = useState(true);
  const [viewMode, setViewMode] = useState<"chart" | "radar" | "table">("chart");
  const [copied, setCopied]     = useState(false);
  const [hovBar, setHovBar]     = useState<string | null>(null);
  const [vis, setVis]           = useState(false);

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
        state: getStateStrength, party: getPartyDominance,
        inequality: getInequality, imbalance: getImbalance,
      };
      const result = await fns[t]();
      setCache(p => ({ ...p, [t]: result }));
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  const tabs: { key: Tab; label: string; icon: string; color: string; desc: string; explain: string }[] = [
    { key:"state",      label:"State Report Card",       icon:"map",      color:T.orange, desc:"How well each state performs",     explain:"Which state sends the most active MPs to Parliament?" },
    { key:"party",      label:"Party Performance",       icon:"building", color:T.blue,   desc:"Which party works harder",         explain:"Do your party's MPs ask questions and attend sessions?" },
    { key:"inequality", label:"Inequality Inside States",icon:"scale",    color:T.red,    desc:"Are MPs equal within a state?",    explain:"In some states, one MP does all the work while others sleep." },
    { key:"imbalance",  label:"Fair Representation",     icon:"barchart", color:T.teal,   desc:"Performance vs seats won",         explain:"Do states perform proportionally to how many MPs they elect?" },
  ];
  const active = tabs.find(t => t.key === tab)!;

  const getRows = () => {
    const d = cache[tab]?.data;
    if (!d) return [];
    if (tab==="state")      return d.map((x:any) => ({ key:x.state, val:x.state_strength_index }));
    if (tab==="party")      return d.map((x:any) => ({ key:x.party, val:x.party_dominance_index }));
    if (tab==="inequality") return d.map((x:any) => ({ key:x.state, val:x.performance_std }));
    return                       d.map((x:any) => ({ key:x.state, val:x.imbalance_score }));
  };

  type Row = {
  key: string;
  val: number;
};

const data   = cache[tab];


const rows: Row[] = getRows().sort((a: Row, b: Row) => b.val - a.val);

const top15  = rows.slice(0, 15);

const avg    = rows.length
  ? rows.reduce((s, r) => s + r.val, 0) / rows.length
  : 0;

const maxVal = rows[0]?.val || 1;

const leader = rows[0];
const laggard = rows[rows.length - 1];

const ticker = rows.slice(0, 20).map(r => ({
  label: r.key,
  val: r.val.toFixed(3)
}));

const radarD = top15.slice(0, 6).map(r => ({
  subject: r.key.length > 8 ? r.key.slice(0, 7) + "…" : r.key,
  value: r.val,
  fullMark: maxVal
}));

  const insight = (() => {
    if (!leader) return "";
    if (tab==="state")      return `${leader.key} sends the most active MPs — ${(leader.val/avg).toFixed(1)}× better than average`;
    if (tab==="party")      return `${leader.key} leads with the most parliamentary participation`;
    if (tab==="inequality") return `Inside ${leader.key}, MPs vary widely in their performance`;
    return `${data?.most_overperforming_state??"—"} performs above its seat share`;
  })();

  const share = () => {
    navigator.clipboard.writeText('https://lokdrishti.online/').catch(()=>{});
    setCopied(true); setTimeout(()=>setCopied(false),2000);
  };
//
  const ctxCards = data && !loading ? (
    tab==="state" ? [
      { label:"Best State",     icon:"trophy",       value:data.strongest_state,        sub:"Most active MPs",       color:T.green  },
      { label:"Needs Work",     icon:"warning",      value:data.weakest_state,           sub:"Least active MPs",      color:T.red    },
      { label:"States Tracked", icon:"pin",          value:String(data.total_states),    sub:"Across India",          color:T.orange },
      { label:"Avg Score",      icon:"activity",     value:avg.toFixed(3),               sub:"National benchmark",    color:T.blue   },
    ] : tab==="party" ? [
      { label:"Top Party",      icon:"trophy",       value:data.dominant_party,          sub:"Most productive",       color:T.green  },
      { label:"Lagging",        icon:"warning",      value:data.weakest_party,           sub:"Low participation",     color:T.red    },
      { label:"Parties",        icon:"building",     value:String(data.total_parties),   sub:"Analysed",              color:T.orange },
      { label:"Avg Score",      icon:"activity",     value:avg.toFixed(3),               sub:"Across parties",        color:T.blue   },
    ] : tab==="inequality" ? [
      { label:"Most Unequal",   icon:"trending_down",value:data.most_unequal_state,      sub:"MPs vary widely",       color:T.red    },
      { label:"Most Equal",     icon:"check",        value:data.most_balanced_state,      sub:"All MPs work equally",  color:T.green  },
      { label:"Avg Gap",        icon:"ruler",        value:avg.toFixed(4),               sub:"Inequality score",      color:T.orange },
    ] : [
      { label:"Over-achiever",  icon:"rocket",       value:data.most_overperforming_state,   sub:"More than their share", color:T.green  },
      { label:"Under-deliver",  icon:"trending_down",value:data.most_underperforming_state,  sub:"Less than their share", color:T.red    },
      { label:"Avg LCI",        icon:"activity",     value:data.national_avg_lci?.toFixed(4)||"—", sub:"Baseline score", color:T.blue },
    ]
  ) : [];

  /* ── Chart renderers ── */
  const renderChart = () => (
    <div style={{ height:400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={top15.map(r=>({...r,[tab]:r.val}))}
          margin={{ top:12, right:16, bottom:60, left:0 }} barCategoryGap="32%">
          <defs>
            <linearGradient id={`g_${tab}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={active.color} stopOpacity={1}/>
              <stop offset="100%" stopColor={active.color} stopOpacity={0.35}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 6" stroke={T.border} vertical={false}/>
          <XAxis dataKey="key" tick={{ fontSize:11, fill:T.textSub, fontFamily:"'DM Sans'" }}
            angle={-35} textAnchor="end" interval={0} axisLine={false} tickLine={false}/>
          <YAxis tick={{ fontSize:11, fill:T.textSub }}
            axisLine={false} tickLine={false} tickFormatter={v=>v.toFixed(2)} width={40}/>
          <Tooltip content={<LightTooltip labelKey="key" valueKey={tab} color={active.color}/>}
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

  const renderRadar = () => (
    <div style={{ height:400 }}>
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
//
  const renderTable = () => (
    <div style={{ maxHeight:480, overflowY:"auto" }}>
      {/* Header */}
      <div style={{ display:"grid", gridTemplateColumns:"44px 1fr 120px 80px 120px",
        gap:12, padding:"8px 20px 10px",
        borderBottom:`2px solid ${T.border}`,
        background:T.bgDeep }}>
        {["#","Name","Progress","Score","Rating"].map(h=>(
          <span key={h} style={{ fontSize:9.5, fontWeight:800, color:T.textSub,
            textTransform:"uppercase", letterSpacing:"0.14em" }}>{h}</span>
        ))}
      </div>
      {rows.map((r,i) => {
        const pct  = Math.round((r.val/maxVal)*100);
        const gc   = pct>=75?T.green:pct>=50?T.orange:pct>=30?"#D97706":T.red;
        const grade = pct>=75?"A · Excellent":pct>=50?"B · Good":pct>=30?"C · Average":"D · Below Avg";
        return (
          <div key={r.key} style={{
            display:"grid", gridTemplateColumns:"44px 1fr 120px 80px 120px",
            alignItems:"center", gap:12, padding:"11px 20px",
            borderBottom:`1px solid ${T.border}`,
            background:i%2===0?"white":T.bgDeep,
          }}>
            <div style={{ display:"flex", justifyContent:"center" }}>
              {i<3
                ? <Icon name={["medal_gold","medal_silver","medal_bronze"][i]} size={26}/>
                : <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15,
                    fontWeight:700, color:"#CBD5E1" }}>{i+1}</span>}
            </div>
            <span style={{ fontSize:13, fontWeight:600, color:T.text }}>{r.key}</span>
            <div style={{ height:6, background:T.bgDeep, borderRadius:3, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${pct}%`, background:gc, borderRadius:3 }}/>
            </div>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16,
              fontWeight:700, color:active.color }}>{r.val.toFixed(4)}</span>
            <span style={{ fontSize:10.5, fontWeight:700, color:gc,
              background:`${gc}15`, padding:"3px 8px", borderRadius:20 }}>{grade}</span>
          </div>
        );
      })}
    </div>
  );

  const fadeIn = (d: number): React.CSSProperties => ({
    opacity: vis ? 1 : 0,
    transform: vis ? "translateY(0)" : "translateY(18px)",
    transition: `opacity 0.65s ease ${d}ms, transform 0.65s cubic-bezier(0.4,0,0.2,1) ${d}ms`,
  });

  return (
    <div style={{ minHeight:"100vh", fontFamily:"'DM Sans',sans-serif",
      background:T.bg, color:T.text, overflowX:"hidden" }}>

      <style>{`
        @keyframes spin         { to{transform:rotate(360deg)} }
        @keyframes pingOut      { 0%{transform:scale(1);opacity:0.6}100%{transform:scale(2.8);opacity:0} }
        @keyframes scrollTicker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes shimmerScan  { 0%{left:-60%}100%{left:120%} }
        @keyframes floatUp      { 0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)} }
        @keyframes gradShift    { 0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%} }
        *,*::before,*::after{box-sizing:border-box;}
        ::selection{background:rgba(255,107,0,0.2);}
        ::-webkit-scrollbar{width:5px;}
        ::-webkit-scrollbar-track{background:#EDE8E0;}
        ::-webkit-scrollbar-thumb{background:#D4CAC0;border-radius:3px;}
        .tab-pill{transition:all 0.2s cubic-bezier(0.4,0,0.2,1);}
        .tab-pill:hover .tab-lbl{color:#1A1A2E !important;}
      `}</style>

      {/* ── HERO HEADER ─────────────────────────────────────── */}
      <div style={{ background:"linear-gradient(135deg,#0A1628 0%,#1E293B 60%,#0F172A 100%)",
        position:"relative", overflow:"hidden" }}>

        {/* Dot grid texture */}
        <DotGrid/>

        {/* Parliament SVG illustration */}
        <ParliamentBg/>

        {/* Tricolor stripe */}
        <div style={{ height:3, background:"linear-gradient(90deg,#FF6B00 33%,rgba(255,255,255,0.15) 33%,rgba(255,255,255,0.15) 66%,#138808 66%)" }}/>

        {/* Floating orange orb */}
        <div style={{ position:"absolute", left:"-3%", top:"50%", transform:"translateY(-50%)",
          width:400, height:400, borderRadius:"50%",
          background:"radial-gradient(circle,rgba(255,107,0,0.18) 0%,transparent 70%)",
          animation:"floatUp 7s ease-in-out infinite", pointerEvents:"none" }}/>

        <div style={{ maxWidth:1280, margin:"0 auto", padding:"36px 48px 44px",
          position:"relative", zIndex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16, ...fadeIn(0) }}>
            <div style={{ width:3, height:16, background:"#FF6B00", borderRadius:2 }}/>
            <span style={{ fontSize:10, fontWeight:800, color:"rgba(255,255,255,0.45)",
              textTransform:"uppercase", letterSpacing:"0.22em" }}>
              18th Lok Sabha · Parliament of India · Open Data
            </span>
          </div>

          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"flex-end", flexWrap:"wrap", gap:24, ...fadeIn(60) }}>
            <div>
              <h1 style={{ fontFamily:"'Cormorant Garamond',serif",
                fontSize:"clamp(36px,4.5vw,64px)", fontWeight:700,
                color:"white", letterSpacing:"-2px", lineHeight:1, marginBottom:12 }}>
                Parliamentary{" "}
                <em style={{ color:"#FF6B00" }}>Analytics</em>
              </h1>
              <p style={{ fontSize:15, color:"rgba(255,255,255,0.45)", maxWidth:500, lineHeight:1.75 }}>
                Raw data from PRS Legislative Research. See exactly how your state, party, and
                representative performs in Parliament — no spin, no opinion.
              </p>
            </div>

            {/* Stats cluster */}
            <div style={{ display:"flex", gap:24, ...fadeIn(120) }}>
              {[
                { n:"543", l:"MPs Tracked"  },
                { n:"28",  l:"States & UTs" },
                { n:"18th",l:"Lok Sabha"    },
              ].map(s=>(
                <div key={s.l} style={{ textAlign:"center" }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:32,
                    fontWeight:700, color:"white", lineHeight:1 }}>{s.n}</div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", fontWeight:600,
                    textTransform:"uppercase", letterSpacing:"0.12em", marginTop:3 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── TAB RAIL ────────────────────────────────────────── */}
      <div style={{ background:"white", borderBottom:`1px solid ${T.border}`,
        position:"sticky", top:62, zIndex:50,
        boxShadow:"0 2px 20px rgba(0,0,0,0.07)" }}>
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
                  position:"relative", minWidth:190 }}>
                {on && (
                  <div style={{ position:"absolute", bottom:0, left:0, right:0, height:3,
                    overflow:"hidden", borderRadius:"3px 3px 0 0" }}>
                    <div style={{ position:"absolute", top:0, bottom:0, width:"50%",
                      background:`linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)`,
                      animation:"shimmerScan 1.8s ease-in-out infinite" }}/>
                  </div>
                )}
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                  <div style={{ width:28, height:28, borderRadius:8,
                    background: on ? `${t.color}15` : T.bgDeep,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    border: on ? `1px solid ${t.color}25` : `1px solid ${T.border}`,
                    transition:"all 0.2s" }}>
                    <Icon name={t.icon} size={15} color={on ? t.color : T.textSub}/>
                  </div>
                  <span className="tab-lbl" style={{ fontSize:13, fontWeight:700,
                    color:on ? T.text : T.textSub, transition:"color 0.2s" }}>{t.label}</span>
                </div>
                <span style={{ fontSize:10.5, color:on ? t.color : "#CBD5E1",
                  fontWeight:600, transition:"color 0.2s", paddingLeft:36 }}>{t.desc}</span>
              </button>
            );
          })}

          {/* Controls */}
          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ display:"flex", background:T.bgDeep, borderRadius:10,
              padding:3, border:`1px solid ${T.border}` }}>
              {(["chart","radar","table"] as const).map(v=>(
                <button key={v} onClick={()=>setViewMode(v)}
                  style={{ padding:"6px 14px", borderRadius:8, border:"none", cursor:"pointer",
                    background:viewMode===v?"white":"transparent",
                    color:viewMode===v?active.color:T.textSub,
                    fontSize:10.5, fontWeight:700, letterSpacing:"0.1em",
                    fontFamily:"'DM Sans',sans-serif",
                    boxShadow:viewMode===v?"0 2px 8px rgba(0,0,0,0.1)":"none",
                    transition:"all 0.18s", display:"flex", alignItems:"center", gap:5 }}>
                  <Icon name={v==="chart"?"barchart":v==="radar"?"activity":"map"} size={12}
                    color={viewMode===v?active.color:T.textSub}/>
                  {v==="chart"?"Chart":v==="radar"?"Radar":"Table"}
                </button>
              ))}
            </div>
            <button onClick={share}
              style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px",
                background:copied?`${T.green}10`:T.bgDeep,
                borderLeft:`1px solid ${T.border}`, borderRight:`1px solid ${T.border}`,
                borderTop:`1px solid ${T.border}`, borderBottom:`1px solid ${T.border}`,
                borderRadius:10, cursor:"pointer", fontSize:11, fontWeight:700,
                color:copied?T.green:T.textSub, fontFamily:"'DM Sans',sans-serif",
                transition:"all 0.2s" }}>
              <Icon name={copied?"check":"share"} size={13} color={copied?T.green:T.textSub}/>
              {copied?"Copied!":"Share"}
            </button>
          </div>
        </div>
      </div>

      {/* ── BODY ────────────────────────────────────────────── */}
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 48px 80px" }}>

        {/* Section header */}
        <div style={{ padding:"36px 0 28px", borderBottom:`1px solid ${T.border}`,
          marginBottom:28, ...fadeIn(80) }}>
          <div style={{ display:"flex", alignItems:"flex-start",
            justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                <div style={{ width:48, height:48, borderRadius:14,
                  background:`${active.color}12`, border:`1px solid ${active.color}25`,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name={active.icon} size={24} color={active.color}/>
                </div>
                <h2 style={{ fontFamily:"'Cormorant Garamond',serif",
                  fontSize:"clamp(24px,3vw,40px)", fontWeight:700,
                  color:T.text, letterSpacing:"-0.5px", margin:0 }}>
                  {active.label}
                </h2>
              </div>
              {/* Plain English box */}
              <div style={{ display:"flex", alignItems:"flex-start", gap:10,
                padding:"12px 16px", borderRadius:12,
                background:`${active.color}08`, border:`1px solid ${active.color}18`,
                maxWidth:580, marginBottom:12 }}>
                <Icon name="chat" size={16} color={active.color}/>
                <div>
                  <span style={{ fontSize:11, fontWeight:800, color:active.color,
                    textTransform:"uppercase", letterSpacing:"0.12em" }}>In plain English: </span>
                  <span style={{ fontSize:13, color:T.text, lineHeight:1.6 }}>
                    {active.explain}
                  </span>
                </div>
              </div>
              {data && !loading && insight && (
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <PulseDot color={active.color}/>
                  <span style={{ fontSize:13, color:T.textSub, fontStyle:"italic" }}>
                    {insight}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loading */}
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
                borderBottom:`2px solid ${active.color}60`,
                animation:"spin 1.3s linear infinite reverse" }}/>
            </div>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:14, fontWeight:600, color:T.text, marginBottom:4 }}>
                Fetching parliamentary data…
              </div>
              <div style={{ fontSize:12, color:T.textSub }}>18th Lok Sabha · PRS Research</div>
            </div>
          </div>
        )}

        {data && !loading && (
          <>
            {/* Stat cards */}
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
            <Reveal delay={160}><Ticker items={ticker} color={active.color}/></Reveal>

            {/* Main chart card */}
            <Reveal delay={220}>
              <div style={{ marginTop:20, borderRadius:22, background:"white",
                borderTop:`3px solid ${active.color}`,
                borderLeft:`1px solid ${T.border}`,
                borderRight:`1px solid ${T.border}`,
                borderBottom:`1px solid ${T.border}`,
                boxShadow:"0 4px 32px rgba(0,0,0,0.07)", overflow:"hidden" }}>

                <div style={{ padding:"16px 24px", borderBottom:`1px solid ${T.border}`,
                  display:"flex", justifyContent:"space-between", alignItems:"center",
                  background:T.bgDeep }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <PulseDot color={active.color}/>
                    <span style={{ fontSize:13, fontWeight:700, color:T.text }}>
                      {viewMode==="chart"?`Top ${top15.length} of ${rows.length}`:
                       viewMode==="radar"?"Top 6 — Radar Comparison":
                       `All ${rows.length} entries`}
                    </span>
                    <span style={{ fontSize:11, color:T.textSub }}>· {active.desc}</span>
                  </div>
                  {/* Legend */}
                  <div style={{ display:"flex", gap:12 }}>
                    {[
                      {c:T.green, l:"Excellent (A)"},
                      {c:T.orange,l:"Good (B)"     },
                      {c:T.red,   l:"Below Avg (D)"},
                    ].map(x=>(
                      <div key={x.l} style={{ display:"flex", alignItems:"center", gap:5 }}>
                        <div style={{ width:8, height:8, borderRadius:2, background:x.c }}/>
                        <span style={{ fontSize:10, color:T.textSub, fontWeight:600 }}>{x.l}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ padding:"20px 20px 8px" }}>
                  {viewMode==="chart" && renderChart()}
                  {viewMode==="radar" && renderRadar()}
                  {viewMode==="table" && renderTable()}
                </div>

                <div style={{ padding:"12px 24px", borderTop:`1px solid ${T.border}`,
                  background:T.bgDeep, display:"flex", gap:28, flexWrap:"wrap" }}>
                  {[
                    { l:"National Average", v:avg.toFixed(4),                                c:active.color },
                    { l:"Top Score",        v:leader?.val.toFixed(4),                        c:T.green      },
                    { l:"Lowest Score",     v:laggard?.val.toFixed(4),                       c:T.red        },
                    { l:"Total Range",      v:((leader?.val??0)-(laggard?.val??0)).toFixed(4),c:T.textSub   },
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

            {/* Top 5 / Bottom 5 */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginTop:16 }}>
              <Reveal delay={280}>
                <div style={{ borderRadius:20, background:"white",
                  borderTop:`3px solid ${active.color}`,
                  borderLeft:`1px solid ${T.border}`, borderRight:`1px solid ${T.border}`,
                  borderBottom:`1px solid ${T.border}`,
                  boxShadow:"0 2px 16px rgba(0,0,0,0.05)", overflow:"hidden" }}>
                  <div style={{ padding:"16px 20px", borderBottom:`1px solid ${T.border}`,
                    display:"flex", alignItems:"center", gap:10, background:T.bgDeep }}>
                    <Icon name="trophy" size={18} color={active.color}/>
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
                  borderTop:`3px solid ${T.red}`,
                  borderLeft:`1px solid ${T.border}`, borderRight:`1px solid ${T.border}`,
                  borderBottom:`1px solid ${T.border}`,
                  boxShadow:"0 2px 16px rgba(0,0,0,0.05)", overflow:"hidden" }}>
                  <div style={{ padding:"16px 20px", borderBottom:`1px solid ${T.border}`,
                    display:"flex", alignItems:"center", gap:10, background:"#FEF2F2" }}>
                    <Icon name="warning" size={18} color={T.red}/>
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

            {/* Distribution curve */}
            <Reveal delay={400}>
              <div style={{ marginTop:16, borderRadius:20, background:"white",
                border:`1px solid ${T.border}`,
                boxShadow:"0 2px 16px rgba(0,0,0,0.05)", overflow:"hidden" }}>
                <div style={{ padding:"16px 24px", borderBottom:`1px solid ${T.border}`,
                  display:"flex", alignItems:"center", gap:10, background:T.bgDeep }}>
                  <Icon name="trending_up" size={18} color={active.color}/>
                  <span style={{ fontSize:12, fontWeight:800, color:T.textSub,
                    textTransform:"uppercase", letterSpacing:"0.14em" }}>
                    Full Distribution — All {rows.length} Entries
                  </span>
                  <span style={{ fontSize:11, color:T.textSub, marginLeft:4 }}>
                    · Dashed line = national average
                  </span>
                </div>
                <div style={{ padding:"16px 20px 8px", height:140 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={rows.map((r,i)=>({i,val:r.val,name:r.key}))}
                      margin={{ top:4, right:4, bottom:0, left:0 }}>
                      <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%"   stopColor={active.color} stopOpacity={0.25}/>
                          <stop offset="100%" stopColor={active.color} stopOpacity={0.02}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="2 6" stroke={T.border} vertical={false}/>
                      <Area dataKey="val" stroke={active.color} strokeWidth={2}
                        fill="url(#areaGrad)" dot={false}/>
                      <ReferenceLine y={avg} stroke={active.color}
                        strokeDasharray="5 5" strokeWidth={1.5}/>
                      <Tooltip content={({ active:a, payload:p }) => {
                        if (!a||!p?.length) return null;
                        const d = p[0].payload;
                        return (
                          <div style={{ background:"white", borderRadius:10, padding:"8px 12px",
                            border:`1px solid ${T.border}`,
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
                  fontSize:11, color:T.textSub, borderTop:`1px solid ${T.border}` }}>
                  Hover over the curve to see individual scores for each entry
                </div>
              </div>
            </Reveal>

            {/* Data source */}
            <Reveal delay={460}>
              <div style={{ marginTop:20, padding:"16px 24px", borderRadius:14,
                background:`${T.orange}06`, border:`1px solid ${T.orange}18`,
                display:"flex", alignItems:"flex-start", gap:14 }}>
                <Icon name="info" size={20} color={T.orange}/>
                <div>
                  <div style={{ fontSize:12, fontWeight:700, color:T.orange, marginBottom:4 }}>
                    About this data
                  </div>
                  <div style={{ fontSize:12, color:T.textSub, lineHeight:1.7 }}>
                    All scores are based on <strong style={{ color:T.text }}>attendance</strong>,{" "}
                    <strong style={{ color:T.text }}>questions raised</strong>, and{" "}
                    <strong style={{ color:T.text }}>debate participation</strong> by Members of Parliament
                    in the 18th Lok Sabha.
                    Source: <strong style={{ color:T.text }}>PRS Legislative Research</strong> · Zero editorial bias.
                  </div>
                </div>
              </div>
            </Reveal>
          </>
        )}

        {/* Error */}
        {!loading && !data && (
          <div style={{ textAlign:"center", padding:"100px 0" }}>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:16, opacity:0.3 }}>
              <Icon name="wifi_off" size={52} color={T.text}/>
            </div>
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