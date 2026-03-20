"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { getNationalRankings } from "@/lib/api";

/* ─── Inline SVG Icons — zero external deps ───────────────── */
const IC = {
  calendar: (c="#64748B",s=16) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>),
  msg:      (c="#64748B",s=16) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>),
  mic:      (c="#64748B",s=16) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>),
  bar:      (c="#64748B",s=16) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>),
  star:     (c="#64748B",s=16) => (<svg width={s} height={s} viewBox="0 0 24 24" fill={c} stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>),
  trend:    (c="#64748B",s=16) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>),
  warn:     (c="#64748B",s=16) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>),
  mute:     (c="#64748B",s=16) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>),
  search:   (c="#64748B",s=16) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>),
  pin:      (c="#64748B",s=16) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>),
  x:        (c="#64748B",s=16) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
  check:    (c="#64748B",s=16) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>),
  plus:     (c="#64748B",s=16) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>),
  zap:      (c="#64748B",s=16) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>),
  chevL:    (c="#64748B",s=16) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>),
  chevR:    (c="#64748B",s=16) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>),
  award:    (c="#64748B",s=16) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>),
  shield:   (c="#64748B",s=16) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>),
  info:     (c="#64748B",s=16) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8" strokeWidth="2.5"/></svg>),
  users:    (c="#64748B",s=16) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>),
  arrow:    (c="#64748B",s=16) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>),
  sliders:  (c="#64748B",s=16) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>),
  eye:      (c="#64748B",s=16) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>),
  build:    (c="#64748B",s=16) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>),
  file:     (c="#64748B",s=16) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>),
  activity: (c="#64748B",s=16) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>),
} as const;

type ICKey = keyof typeof IC;

/* ─── Data helpers ─────────────────────────────────────────── */
const getLCI        = (m: any) => m.LCI_score  ?? 0;
const getAttendance = (m: any) => m.attendance ?? 0;
const getQuestions  = (m: any) => m.questions  ?? 0;
const getDebates    = (m: any) => m.debates    ?? 0;
const isSilent      = (m: any) => m.silent_flag === 1;

function grade(lci: number) {
  if (lci >= 0.75) return { g:"A", label:"Excellent",  color:"#14532D", bg:"#F0FDF4", border:"#86EFAC", accent:"#16A34A" };
  if (lci >= 0.5)  return { g:"B", label:"Good",       color:"#1E3A8A", bg:"#EFF6FF", border:"#93C5FD", accent:"#2563EB" };
  if (lci >= 0.25) return { g:"C", label:"Average",    color:"#78350F", bg:"#FFFBEB", border:"#FCD34D", accent:"#D97706" };
  if (lci >= 0.1)  return { g:"D", label:"Below Avg",  color:"#7C2D12", bg:"#FFF7ED", border:"#FDBA74", accent:"#EA580C" };
  return               { g:"F", label:"Poor",       color:"#7F1D1D", bg:"#FEF2F2", border:"#FCA5A5", accent:"#DC2626" };
}

function insights(mp: any, avgAtt: number, avgQ: number, avgDeb: number) {
  const tips: { iconKey: ICKey; text: string; type: "good"|"warn"|"info" }[] = [];
  const att = getAttendance(mp); const q = getQuestions(mp); const deb = getDebates(mp);
  if (att >= 0.95)                tips.push({ iconKey:"star",  text:"Top Attender",    type:"good" });
  if (q > avgQ * 2)               tips.push({ iconKey:"msg",   text:"Top 10% Speaker", type:"good" });
  if (deb > avgDeb * 2)           tips.push({ iconKey:"mic",   text:"Active Debater",  type:"good" });
  if (att < 0.5)                  tips.push({ iconKey:"warn",  text:"Low Attendance",  type:"warn" });
  if (isSilent(mp))               tips.push({ iconKey:"mute",  text:"Never Spoke",     type:"warn" });
  if (att >= avgAtt && q >= avgQ) tips.push({ iconKey:"trend", text:"Above Average",   type:"info" });
  return tips.slice(0, 2);
}

/* ─── Animated Counter ─────────────────────────────────────── */
function AnimCounter({ target, suffix="" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) return;
    let cur = 0;
    const step = Math.ceil(target / 55);
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      setVal(cur);
      if (cur >= target) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [target]);
  return <>{val.toLocaleString()}{suffix}</>;
}

/* ─── Parliament Background ────────────────────────────────── */
function ParliamentBg() {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", overflow:"hidden" }}>
      {/* Ashoka Chakra top-right */}
      <svg width="460" height="460" viewBox="0 0 460 460"
        style={{ position:"absolute", top:-90, right:-90, opacity:0.032 }}>
        <circle cx="230" cy="230" r="210" fill="none" stroke="#1E3A8A" strokeWidth="7"/>
        <circle cx="230" cy="230" r="32"  fill="none" stroke="#1E3A8A" strokeWidth="6"/>
        {Array.from({length:24},(_,i) => {
          const a=(i/24)*Math.PI*2;
          return <line key={i} x1={230+42*Math.cos(a)} y1={230+42*Math.sin(a)} x2={230+205*Math.cos(a)} y2={230+205*Math.sin(a)} stroke="#1E3A8A" strokeWidth="3.5" strokeLinecap="round"/>;
        })}
        {Array.from({length:24},(_,i) => {
          const a=(i/24)*Math.PI*2+Math.PI/24;
          return <line key={`s${i}`} x1={230+55*Math.cos(a)} y1={230+55*Math.sin(a)} x2={230+188*Math.cos(a)} y2={230+188*Math.sin(a)} stroke="#1E3A8A" strokeWidth="1.5" opacity="0.55"/>;
        })}
      </svg>

      {/* Ashoka Chakra bottom-left */}
      <svg width="300" height="300" viewBox="0 0 300 300"
        style={{ position:"absolute", bottom:-55, left:-55, opacity:0.022 }}>
        <circle cx="150" cy="150" r="138" fill="none" stroke="#92400E" strokeWidth="6"/>
        <circle cx="150" cy="150" r="22"  fill="none" stroke="#92400E" strokeWidth="5"/>
        {Array.from({length:24},(_,i) => {
          const a=(i/24)*Math.PI*2;
          return <line key={i} x1={150+30*Math.cos(a)} y1={150+30*Math.sin(a)} x2={150+133*Math.cos(a)} y2={150+133*Math.sin(a)} stroke="#92400E" strokeWidth="2.5" strokeLinecap="round"/>;
        })}
      </svg>

      {/* Parliament columns left */}
      <svg width="72" height="520" viewBox="0 0 72 520" style={{ position:"absolute", top:"18%", left:0, opacity:0.038 }}>
        {[9,27,45,63].map(x => (<g key={x}><rect x={x-5} y="18" width="10" height="490" rx="5" fill="#1E3A8A"/><ellipse cx={x} cy="18" rx="9" ry="5" fill="#1E3A8A"/><rect x={x-13} y="500" width="26" height="14" rx="3" fill="#1E3A8A"/></g>))}
        <rect x="0" y="6" width="72" height="10" rx="2" fill="#1E3A8A"/>
      </svg>

      {/* Parliament columns right */}
      <svg width="72" height="520" viewBox="0 0 72 520" style={{ position:"absolute", top:"18%", right:0, opacity:0.038 }}>
        {[9,27,45,63].map(x => (<g key={x}><rect x={x-5} y="18" width="10" height="490" rx="5" fill="#1E3A8A"/><ellipse cx={x} cy="18" rx="9" ry="5" fill="#1E3A8A"/><rect x={x-13} y="500" width="26" height="14" rx="3" fill="#1E3A8A"/></g>))}
        <rect x="0" y="6" width="72" height="10" rx="2" fill="#1E3A8A"/>
      </svg>

      {/* Scale of justice */}
      <svg width="100" height="100" viewBox="0 0 100 100" style={{ position:"absolute", top:"42%", left:"1.5%", opacity:0.035 }}>
        <line x1="50" y1="8"  x2="50" y2="88"  stroke="#1E3A8A" strokeWidth="3"/>
        <line x1="16" y1="26" x2="84" y2="26"  stroke="#1E3A8A" strokeWidth="3"/>
        <line x1="16" y1="26" x2="8"  y2="46"  stroke="#1E3A8A" strokeWidth="2"/>
        <line x1="84" y1="26" x2="92" y2="46"  stroke="#1E3A8A" strokeWidth="2"/>
        <ellipse cx="8"  cy="46" rx="10" ry="5" fill="none" stroke="#1E3A8A" strokeWidth="2"/>
        <ellipse cx="92" cy="46" rx="10" ry="5" fill="none" stroke="#1E3A8A" strokeWidth="2"/>
        <line x1="34" y1="88" x2="66" y2="88"  stroke="#1E3A8A" strokeWidth="3"/>
      </svg>

      {/* Tricolor top stripe */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"3px",
        background:"linear-gradient(90deg,#FF9933 33.3%,white 33.3% 66.6%,#138808 66.6%)", opacity:0.45 }}/>
      {/* Dot grid */}
      <div style={{ position:"absolute", inset:0,
        backgroundImage:"radial-gradient(circle,#1E3A8A07 1px,transparent 1px)", backgroundSize:"38px 38px" }}/>
      {/* Diagonal hatch corner */}
      <svg width="240" height="240" viewBox="0 0 240 240" style={{ position:"absolute", top:90, right:52, opacity:0.025 }}>
        {Array.from({length:10},(_,i) => <line key={i} x1={i*26} y1="0" x2="0" y2={i*26} stroke="#1E3A8A" strokeWidth="1"/>)}
      </svg>
    </div>
  );
}

/* ─── Progress Bar ─────────────────────────────────────────── */
function Bar({ value, max, avg, color }: { value:number; max:number; avg:number; color:string }) {
  const pct    = Math.min((value/(max||1))*100, 100);
  const avgPct = Math.min((avg  /(max||1))*100, 100);
  return (
    <div style={{ position:"relative", height:"8px", background:"#F1F5F9", borderRadius:"4px", flex:1 }}>
      <div style={{ position:"absolute", top:0, left:0, height:"100%", width:`${pct}%`,
        background:color, borderRadius:"4px",
        transition:"width 0.85s cubic-bezier(0.34,1.56,0.64,1)", boxShadow:`0 0 8px ${color}50` }}/>
      <div style={{ position:"absolute", top:"-5px", left:`${avgPct}%`, width:"2px", height:"18px",
        background:"#94A3B8", borderRadius:"1px", transform:"translateX(-50%)" }}/>
    </div>
  );
}

/* ─── Photo ────────────────────────────────────────────────── */
function Photo({ name, url, size=68 }: { name:string; url?:string; size?:number }) {
  const [err, setErr] = useState(false);
  const words = (name||"?").trim().split(/\s+/);
  const ini   = words.length>=2 ? (words[0][0]+words[words.length-1][0]).toUpperCase() : words[0].slice(0,2).toUpperCase();
  const hues  = [220,160,30,270,190,350];
  const hue   = hues[ini.charCodeAt(0) % hues.length];
  const ring: React.CSSProperties = { width:size, height:size, borderRadius:"50%", flexShrink:0,
    border:"3px solid white", boxShadow:`0 0 0 3px #DBEAFE,0 4px 16px rgba(30,58,138,0.15)` };
  if (url && !err) return (
    <div style={{ ...ring, overflow:"hidden" }}>
      <img src={`/api/proxy-image?url=${encodeURIComponent(url)}`} alt={name} onError={()=>setErr(true)}
        style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top" }}/>
    </div>
  );
  return (
    <div style={{ ...ring, background:`linear-gradient(135deg,hsl(${hue},65%,88%),hsl(${hue},55%,78%))`,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:"'Playfair Display',Georgia,serif", fontSize:size*0.34, fontWeight:800, color:`hsl(${hue},45%,30%)` }}>
      {ini}
    </div>
  );
}

/* ─── MP Card ──────────────────────────────────────────────── */
function MPCard({ mp, maxQ, maxDeb, avgAtt, avgQ, avgDeb, photos, onCompare, compareList, animIdx }:any) {
  const [hov, setHov] = useState(false);
  const lci   = getLCI(mp);
  const att   = getAttendance(mp);
  const q     = getQuestions(mp);
  const deb   = getDebates(mp);
  const g     = grade(lci);
  const attPct = att * 100;
  const attC   = attPct>=75?"#16A34A":attPct>=50?"#D97706":"#DC2626";
  const chips  = insights(mp, avgAtt, avgQ, avgDeb);
  const inCmp  = compareList.includes(mp.name);

  return (
    <div style={{ opacity:0, animation:`cardIn 0.5s cubic-bezier(0.34,1.22,0.64,1) ${animIdx*0.07}s forwards` }}>
      <div style={{ position:"relative" }}>
        <button onClick={e=>{e.preventDefault();onCompare(mp.name);}} style={{
          position:"absolute", top:14, right:14, zIndex:10,
          width:32, height:32, borderRadius:"50%",
          border:`2px solid ${inCmp?"#1E3A8A":"#CBD5E1"}`,
          background:inCmp?"#1E3A8A":"white", cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:inCmp?"0 2px 8px rgba(30,58,138,0.3)":"0 1px 4px rgba(0,0,0,0.07)",
          transition:"all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
          transform:inCmp?"scale(1.15)":"scale(1)" }}>
          {inCmp ? IC.check("white",15) : IC.plus("#94A3B8",15)}
        </button>

        <Link href={`/mp/${encodeURIComponent(mp.name)}`} style={{ textDecoration:"none" }}>
          <article onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{
            background:"white", borderRadius:"22px",
            border:`1.5px solid ${hov?"#93C5FD":"#E8EDF5"}`,
            padding:"28px 28px 24px", cursor:"pointer",
            transition:"all 0.3s cubic-bezier(0.34,1.1,0.64,1)",
            boxShadow:hov?"0 20px 60px rgba(30,58,138,0.13),0 4px 16px rgba(30,58,138,0.07)":"0 2px 10px rgba(0,0,0,0.05)",
            transform:hov?"translateY(-7px) scale(1.01)":"none",
            display:"flex", flexDirection:"column", gap:"18px",
            position:"relative", overflow:"hidden" }}>

            {/* Grade top bar */}
            <div style={{ position:"absolute", top:0, left:0, right:0, height:"4px",
              borderRadius:"22px 22px 0 0", background:`linear-gradient(90deg,${g.accent},${g.accent}66)` }}/>
            {/* Hover shimmer */}
            <div style={{ position:"absolute", inset:0, borderRadius:"22px", pointerEvents:"none",
              background:hov?"linear-gradient(135deg,rgba(239,246,255,0.55) 0%,transparent 55%)":"transparent",
              transition:"all 0.3s" }}/>

            {/* Header */}
            <div style={{ display:"flex", gap:"16px", alignItems:"flex-start", paddingTop:"6px" }}>
              <Photo name={mp.name} url={photos[mp.name]} size={68}/>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:"17px", fontWeight:800, color:"#0F172A", lineHeight:1.2,
                  fontFamily:"'Playfair Display',Georgia,serif",
                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{mp.name}</div>
                <div style={{ display:"flex", alignItems:"center", gap:"4px", marginTop:"4px" }}>
                  {IC.pin("#94A3B8",11)}
                  <span style={{ fontSize:"12px", color:"#64748B", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {mp.constituency}
                  </span>
                </div>
                <div style={{ display:"flex", gap:"5px", marginTop:"7px", flexWrap:"wrap" }}>
                  {mp.state && <span style={{ fontSize:"10px", background:"#EFF6FF", color:"#1E40AF", borderRadius:"6px", padding:"3px 9px", fontWeight:700, border:"1px solid #BFDBFE" }}>{mp.state}</span>}
                  {mp.party && <span style={{ fontSize:"10px", background:"#F8FAFC", color:"#475569", borderRadius:"6px", padding:"3px 9px", fontWeight:600, border:"1px solid #E2E8F0", maxWidth:"140px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{mp.party}</span>}
                </div>
              </div>
              {/* Grade badge */}
              <div style={{ width:50, height:50, borderRadius:"14px", flexShrink:0, background:g.bg, border:`2.5px solid ${g.border}`,
                display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                boxShadow:`0 4px 14px ${g.accent}25`,
                transition:"all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                transform:hov?"scale(1.12) rotate(-4deg)":"scale(1) rotate(0deg)" }}>
                <span style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"22px", fontWeight:900, color:g.color, lineHeight:1 }}>{g.g}</span>
                <span style={{ fontSize:"8px", fontWeight:800, color:g.accent, letterSpacing:"0.04em", textTransform:"uppercase" }}>{g.label}</span>
              </div>
            </div>

            {/* Chips */}
            {chips.length > 0 && (
              <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
                {chips.map((c,i) => (
                  <span key={i} style={{ fontSize:"10px", fontWeight:700, borderRadius:"100px", padding:"4px 10px",
                    display:"flex", alignItems:"center", gap:"4px",
                    background:c.type==="good"?"#F0FDF4":c.type==="warn"?"#FFFBEB":"#EFF6FF",
                    color:c.type==="good"?"#16A34A":c.type==="warn"?"#D97706":"#2563EB",
                    border:`1px solid ${c.type==="good"?"#86EFAC":c.type==="warn"?"#FCD34D":"#93C5FD"}` }}>
                    {IC[c.iconKey](c.type==="good"?"#16A34A":c.type==="warn"?"#D97706":"#2563EB", 10)}
                    {c.text}
                  </span>
                ))}
              </div>
            )}

            <div style={{ height:"1px", background:"linear-gradient(90deg,transparent,#E2E8F0,transparent)" }}/>

            {/* Stats rows */}
            <div style={{ display:"flex", flexDirection:"column", gap:"15px" }}>
              {([
                { label:"Attendance", val:attPct.toFixed(0)+"%", barV:att,  barMax:1,      barAvg:avgAtt, color:attC,     ik:"calendar" as ICKey, ibg:"#F0FDF4" },
                { label:"Questions",  val:String(q),             barV:q,    barMax:maxQ,   barAvg:avgQ,   color:"#3B82F6",ik:"msg"      as ICKey, ibg:"#EFF6FF" },
                { label:"Debates",    val:String(deb),           barV:deb,  barMax:maxDeb, barAvg:avgDeb, color:"#8B5CF6",ik:"mic"      as ICKey, ibg:"#F5F3FF" },
              ] as const).map(row => (
                <div key={row.label}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"7px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"7px" }}>
                      <div style={{ width:27, height:27, borderRadius:"8px", background:row.ibg,
                        display:"flex", alignItems:"center", justifyContent:"center" }}>
                        {IC[row.ik](row.color, 14)}
                      </div>
                      <span style={{ fontSize:"12px", color:"#475569", fontWeight:600 }}>{row.label}</span>
                    </div>
                    <span style={{ fontSize:"16px", fontWeight:800, color:row.color, fontFamily:"'Playfair Display',Georgia,serif" }}>{row.val}</span>
                  </div>
                  <Bar value={row.barV} max={row.barMax} avg={row.barAvg} color={row.color}/>
                </div>
              ))}
            </div>

            <div style={{ height:"1px", background:"linear-gradient(90deg,transparent,#E2E8F0,transparent)" }}/>

            {/* Footer */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"flex", gap:"22px" }}>
                <div>
                  <div style={{ fontSize:"9px", color:"#94A3B8", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:"2px" }}>LCI Score</div>
                  <div style={{ fontSize:"19px", fontWeight:800, color:g.color, fontFamily:"'Playfair Display',Georgia,serif" }}>{lci.toFixed(3)}</div>
                </div>
                {mp.national_rank && (
                  <div>
                    <div style={{ fontSize:"9px", color:"#94A3B8", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:"2px" }}>Nat. Rank</div>
                    <div style={{ fontSize:"19px", fontWeight:800, color:"#334155", fontFamily:"'Playfair Display',Georgia,serif" }}>#{Math.round(mp.national_rank)}</div>
                  </div>
                )}
              </div>
              <div style={{ padding:"9px 18px", borderRadius:"100px", fontSize:"12px", fontWeight:700,
                border:"1.5px solid #BFDBFE", transition:"all 0.25s cubic-bezier(0.34,1.2,0.64,1)",
                background:hov?"#1E3A8A":"#EFF6FF", color:hov?"white":"#1E40AF",
                display:"flex", alignItems:"center", gap:"5px", transform:hov?"scale(1.06)":"scale(1)" }}>
                Profile {IC.arrow(hov?"white":"#1E40AF", 13)}
              </div>
            </div>
          </article>
        </Link>
      </div>
    </div>
  );
}

/* ─── Compare Modal ────────────────────────────────────────── */
function CompareModal({ list, mps, onClose }: { list:string[]; mps:any[]; onClose:()=>void }) {
  const a = mps.find(m=>m.name===list[0]);
  const b = mps.find(m=>m.name===list[1]);
  if (!a||!b) return null;
  const rows: { label:string; ik:ICKey; va:string; vb:string; na:number; nb:number }[] = [
    { label:"Attendance", ik:"calendar", va:`${(getAttendance(a)*100).toFixed(0)}%`, vb:`${(getAttendance(b)*100).toFixed(0)}%`, na:getAttendance(a),        nb:getAttendance(b)        },
    { label:"Questions",  ik:"msg",      va:String(getQuestions(a)),                 vb:String(getQuestions(b)),                 na:getQuestions(a),         nb:getQuestions(b)         },
    { label:"Debates",    ik:"mic",      va:String(getDebates(a)),                   vb:String(getDebates(b)),                   na:getDebates(a),           nb:getDebates(b)           },
    { label:"LCI Score",  ik:"bar",      va:getLCI(a).toFixed(4),                    vb:getLCI(b).toFixed(4),                    na:getLCI(a),               nb:getLCI(b)               },
    { label:"Nat. Rank",  ik:"award",    va:`#${Math.round(a.national_rank??0)}`,    vb:`#${Math.round(b.national_rank??0)}`,    na:-(a.national_rank??999), nb:-(b.national_rank??999) },
    { label:"Grade",      ik:"star",     va:grade(getLCI(a)).g,                      vb:grade(getLCI(b)).g,                      na:getLCI(a),               nb:getLCI(b)               },
  ];
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.75)", zIndex:100,
      display:"flex", alignItems:"center", justifyContent:"center",
      backdropFilter:"blur(8px)", animation:"fadeIn 0.2s ease" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"white", borderRadius:"24px", padding:"36px",
        width:"min(700px,95vw)", maxHeight:"90vh", overflowY:"auto",
        animation:"slideUp 0.3s cubic-bezier(0.34,1.2,0.64,1)", boxShadow:"0 40px 100px rgba(15,23,42,0.25)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"28px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            <div style={{ width:38, height:38, borderRadius:"12px", background:"#FFFBEB",
              display:"flex", alignItems:"center", justifyContent:"center" }}>{IC.zap("#D97706",18)}</div>
            <h2 style={{ fontSize:"22px", fontWeight:800, color:"#0F172A", fontFamily:"'Playfair Display',Georgia,serif", margin:0 }}>Head-to-Head</h2>
          </div>
          <button onClick={onClose} style={{ width:36, height:36, borderRadius:"50%", border:"1px solid #E2E8F0",
            background:"#F8FAFC", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            {IC.x("#64748B",16)}
          </button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 60px 1fr", gap:"16px", alignItems:"center", marginBottom:"30px" }}>
          {[a,b].map((mp,i) => (
            <div key={i} style={{ textAlign:i===0?"left":"right" }}>
              <div style={{ fontSize:"18px", fontWeight:800, color:"#0F172A", fontFamily:"'Playfair Display',Georgia,serif" }}>{mp.name}</div>
              <div style={{ fontSize:"12px", color:"#64748B", marginTop:"2px" }}>{mp.party}</div>
              <div style={{ display:"inline-flex", alignItems:"center", gap:"6px", padding:"4px 14px",
                background:grade(getLCI(mp)).bg, border:`1.5px solid ${grade(getLCI(mp)).border}`,
                borderRadius:"8px", marginTop:"8px" }}>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"18px", fontWeight:800, color:grade(getLCI(mp)).color }}>{grade(getLCI(mp)).g}</span>
                <span style={{ fontSize:"10px", fontWeight:700, color:grade(getLCI(mp)).accent }}>{grade(getLCI(mp)).label}</span>
              </div>
            </div>
          ))}
          <div style={{ textAlign:"center", fontSize:"15px", fontWeight:800, color:"#CBD5E1" }}>vs</div>
        </div>
        {rows.map(r => {
          const aWins = r.na >= r.nb;
          return (
            <div key={r.label} style={{ display:"grid", gridTemplateColumns:"1fr 110px 1fr", gap:"10px",
              alignItems:"center", padding:"11px 0", borderBottom:"1px solid #F8FAFC" }}>
              <div style={{ fontSize:"14px", fontWeight:800, padding:"8px 16px", borderRadius:"10px", textAlign:"center",
                color:aWins?"#16A34A":"#475569", background:aWins?"#F0FDF4":"#F8FAFC",
                border:aWins?"1px solid #86EFAC":"1px solid transparent" }}>{r.va}</div>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"4px" }}>
                {IC[r.ik]("#94A3B8",14)}
                <span style={{ fontSize:"9px", color:"#94A3B8", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", textAlign:"center" }}>{r.label}</span>
              </div>
              <div style={{ fontSize:"14px", fontWeight:800, padding:"8px 16px", borderRadius:"10px", textAlign:"center",
                color:!aWins?"#16A34A":"#475569", background:!aWins?"#F0FDF4":"#F8FAFC",
                border:!aWins?"1px solid #86EFAC":"1px solid transparent" }}>{r.vb}</div>
            </div>
          );
        })}
        <p style={{ fontSize:"11px", color:"#CBD5E1", marginTop:"18px", textAlign:"center",
          display:"flex", alignItems:"center", justifyContent:"center", gap:"6px" }}>
          {IC.shield("#CBD5E1",11)} Green = better performer on that metric
        </p>
      </div>
    </div>
  );
}

/* ─── Constituency Finder ──────────────────────────────────── */
function ConstituencyFinder({ mps }: { mps:any[] }) {
  const [q, setQ]     = useState("");
  const [res, setRes] = useState<any[]>([]);
  useEffect(() => {
    if (!q.trim()) { setRes([]); return; }
    const sq = q.toLowerCase();
    setRes(mps.filter(m => m.constituency?.toLowerCase().includes(sq)||m.name?.toLowerCase().includes(sq)).slice(0,4));
  }, [q, mps]);
  return (
    <div style={{ background:"white", borderRadius:"20px", padding:"24px", border:"1.5px solid #E2E8F0", boxShadow:"0 4px 20px rgba(0,0,0,0.05)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"6px" }}>
        <div style={{ width:32, height:32, borderRadius:"10px", background:"#EFF6FF", display:"flex", alignItems:"center", justifyContent:"center" }}>
          {IC.pin("#1E40AF",16)}
        </div>
        <span style={{ fontSize:"14px", fontWeight:800, color:"#0F172A" }}>Find Your Constituency</span>
      </div>
      <div style={{ fontSize:"12px", color:"#64748B", marginBottom:"14px", paddingLeft:"40px" }}>Search by area or MP name</div>
      <div style={{ position:"relative" }}>
        <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }}>{IC.search("#94A3B8",15)}</div>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="e.g. Nagpur, Lucknow…"
          style={{ width:"100%", padding:"11px 14px 11px 38px", border:"1.5px solid #E2E8F0", borderRadius:"12px",
            fontSize:"13px", fontFamily:"'DM Sans',sans-serif", outline:"none", boxSizing:"border-box" as any,
            color:"#0F172A", transition:"border-color 0.2s", background:"#F8FAFC" }}
          onFocus={e=>e.currentTarget.style.borderColor="#93C5FD"}
          onBlur={e=>e.currentTarget.style.borderColor="#E2E8F0"}/>
      </div>
      {res.length > 0 && (
        <div style={{ marginTop:"10px", display:"flex", flexDirection:"column", gap:"8px" }}>
          {res.map(mp => {
            const g = grade(getLCI(mp));
            return (
              <Link key={mp.name} href={`/mp/${encodeURIComponent(mp.name)}`} style={{ textDecoration:"none" }}>
                <div style={{ display:"flex", gap:"12px", alignItems:"center", padding:"12px",
                  background:"#F8FAFC", borderRadius:"12px", border:"1px solid #E2E8F0",
                  cursor:"pointer", transition:"all 0.2s" }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.background="#EFF6FF";(e.currentTarget as HTMLDivElement).style.borderColor="#BFDBFE";}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.background="#F8FAFC";(e.currentTarget as HTMLDivElement).style.borderColor="#E2E8F0";}}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:"13px", fontWeight:700, color:"#0F172A" }}>{mp.name}</div>
                    <div style={{ fontSize:"11px", color:"#64748B", marginTop:"2px" }}>{mp.constituency} · {mp.party}</div>
                    <div style={{ display:"flex", gap:"12px", marginTop:"5px" }}>
                      {([["calendar","#16A34A",`${(getAttendance(mp)*100).toFixed(0)}%`],["msg","#1E40AF",String(getQuestions(mp))],["mic","#7C3AED",String(getDebates(mp))]] as [ICKey,string,string][]).map(([ik,c,v])=>(
                        <span key={ik} style={{ fontSize:"10px", color:c, fontWeight:700, display:"flex", alignItems:"center", gap:"3px" }}>
                          {IC[ik](c,9)} {v}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ width:36, height:36, borderRadius:"10px", background:g.bg, border:`1.5px solid ${g.border}`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontFamily:"'Playfair Display',serif", fontSize:"18px", fontWeight:800, color:g.color }}>{g.g}</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Understand Section ───────────────────────────────────── */
function UnderstandSection() {
  const items: { ik:ICKey; title:string; bg:string; border:string; tc:string; ic:string; desc:string }[] = [
    { ik:"calendar", title:"What is Attendance?", bg:"#F0FDF4", border:"#86EFAC", tc:"#166534", ic:"#16A34A", desc:"The % of Parliament sessions an MP physically attended. Higher = more votes cast, more debates joined, more representation." },
    { ik:"msg",      title:"What are Questions?", bg:"#EFF6FF", border:"#93C5FD", tc:"#1E40AF", ic:"#2563EB", desc:"MPs submit written or oral questions to hold the government accountable. More questions = more active oversight." },
    { ik:"mic",      title:"What are Debates?",   bg:"#F5F3FF", border:"#C4B5FD", tc:"#5B21B6", ic:"#7C3AED", desc:"MPs discuss bills, budgets and national issues. Debate participation shows how actively an MP voices opinions." },
    { ik:"bar",      title:"What is LCI Score?",  bg:"#FFFBEB", border:"#FCD34D", tc:"#78350F", ic:"#D97706", desc:"The Lok Sabha Civic Index combines attendance, questions and debates into one score (0–1). Neutral, data-driven." },
  ];
  return (
    <div style={{ background:"white", borderRadius:"24px", padding:"44px", border:"1.5px solid #E2E8F0",
      marginTop:"64px", boxShadow:"0 4px 24px rgba(0,0,0,0.04)", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:-50, right:-50, width:220, height:220, borderRadius:"50%",
        background:"linear-gradient(135deg,#EFF6FF,#F5F3FF)", opacity:0.55, pointerEvents:"none" }}/>
      <div style={{ textAlign:"center", marginBottom:"36px" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:"7px", padding:"5px 16px",
          background:"#EFF6FF", borderRadius:"100px", marginBottom:"14px" }}>
          {IC.info("#1E40AF",12)}
          <span style={{ fontSize:"10px", fontWeight:800, color:"#1E40AF", textTransform:"uppercase", letterSpacing:"0.18em" }}>Understand Parliament</span>
        </div>
        <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"30px", fontWeight:800, color:"#0F172A" }}>What do these metrics mean?</div>
        <div style={{ fontSize:"14px", color:"#64748B", marginTop:"8px" }}>Plain English explanations for every data point</div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:"16px" }}>
        {items.map(it => (
          <div key={it.title} style={{ background:it.bg, borderRadius:"16px", padding:"24px",
            border:`1.5px solid ${it.border}`, transition:"transform 0.2s" }}
            onMouseEnter={e=>(e.currentTarget.style.transform="translateY(-4px)")}
            onMouseLeave={e=>(e.currentTarget.style.transform="none")}>
            <div style={{ width:42, height:42, borderRadius:"12px", background:"white",
              display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"14px",
              boxShadow:`0 2px 8px ${it.ic}20` }}>
              {IC[it.ik](it.ic,20)}
            </div>
            <div style={{ fontSize:"14px", fontWeight:800, color:it.tc, marginBottom:"10px" }}>{it.title}</div>
            <div style={{ fontSize:"13px", color:"#475569", lineHeight:1.75 }}>{it.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Page ────────────────────────────────────────────── */
export default function MPsPage() {
  const [mps,          setMps]          = useState<any[]>([]);
  const [photos,       setPhotos]       = useState<Record<string,string>>({});
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [stateF,       setStateF]       = useState("All");
  const [partyF,       setPartyF]       = useState("All");
  const [gradeF,       setGradeF]       = useState("All");
  const [attMin,       setAttMin]       = useState(0);
  const [silentF,      setSilentF]      = useState(false);
  const [sortBy,       setSortBy]       = useState<"rank"|"attendance"|"questions"|"debates"|"lci">("rank");
  const [page,         setPage]         = useState(1);
  const [showPanel,    setShowPanel]    = useState(false);
  const [compareList,  setCompareList]  = useState<string[]>([]);
  const [showCompare,  setShowCompare]  = useState(false);
  const [recentSearch, setRecentSearch] = useState<string[]>([]);
  const [showRecent,   setShowRecent]   = useState(false);
  const PER = 9;

  useEffect(() => {
    (async () => {
      try {
        const first = await getNationalRankings(undefined, 1, 100);
        const total = first.total || 544;
        let all = [...(first.data||[])];
        for (let p=2; p<=Math.ceil(total/100); p++) {
          const r = await getNationalRankings(undefined, p, 100);
          all = [...all, ...(r.data||[])];
        }
        setMps(all);
      } catch {}
      setLoading(false);
    })();
    fetch("/mp_photos.json").then(r=>r.json()).then(setPhotos).catch(()=>{});
  }, []);

  const avgAtt = useMemo(()=>mps.length?mps.reduce((s,m)=>s+getAttendance(m),0)/mps.length:0,[mps]);
  const avgQ   = useMemo(()=>mps.length?mps.reduce((s,m)=>s+getQuestions(m), 0)/mps.length:0,[mps]);
  const avgDeb = useMemo(()=>mps.length?mps.reduce((s,m)=>s+getDebates(m),   0)/mps.length:0,[mps]);
  const avgLCI = useMemo(()=>mps.length?mps.reduce((s,m)=>s+getLCI(m),       0)/mps.length:0,[mps]);
  const maxQ   = useMemo(()=>Math.max(...mps.map(m=>getQuestions(m)),1),[mps]);
  const maxDeb = useMemo(()=>Math.max(...mps.map(m=>getDebates(m)),1),[mps]);
  const states  = useMemo(()=>["All",...Array.from(new Set(mps.map(m=>m.state).filter(Boolean))).sort()],[mps]);
  const parties = useMemo(()=>["All",...Array.from(new Set(mps.map(m=>m.party).filter(Boolean))).sort()],[mps]);
  const photosN    = Object.keys(photos).length;
  const silentCount = mps.filter(m=>isSilent(m)).length;

  const filtered = useMemo(() => {
    let list = [...mps];
    if (silentF) list = list.filter(m=>isSilent(m));
    if (stateF!=="All") list = list.filter(m=>m.state===stateF);
    if (partyF!=="All") list = list.filter(m=>m.party===partyF);
    if (gradeF!=="All") list = list.filter(m=>grade(getLCI(m)).g===gradeF);
    if (attMin>0) list = list.filter(m=>getAttendance(m)*100>=attMin);
    if (search.trim()) {
      const q=search.toLowerCase();
      list=list.filter(m=>m.name?.toLowerCase().includes(q)||m.state?.toLowerCase().includes(q)||m.party?.toLowerCase().includes(q)||m.constituency?.toLowerCase().includes(q));
    }
    list.sort((a,b)=>{
      if(sortBy==="rank")       return (a.national_rank??999)-(b.national_rank??999);
      if(sortBy==="attendance") return getAttendance(b)-getAttendance(a);
      if(sortBy==="questions")  return getQuestions(b)-getQuestions(a);
      if(sortBy==="debates")    return getDebates(b)-getDebates(a);
      if(sortBy==="lci")        return getLCI(b)-getLCI(a);
      return 0;
    });
    return list;
  },[mps,silentF,stateF,partyF,gradeF,attMin,search,sortBy]);

  const totalPages = Math.ceil(filtered.length/PER);
  const pageData   = filtered.slice((page-1)*PER, page*PER);

  function handleCompare(name:string) {
    setCompareList(prev=>{
      if(prev.includes(name)) return prev.filter(n=>n!==name);
      if(prev.length>=2) return [prev[1],name];
      return [...prev,name];
    });
  }
  function handleSearch(val:string) {
    setSearch(val); setPage(1);
    if(val.trim()&&!recentSearch.includes(val.trim()))
      setRecentSearch(prev=>[val.trim(),...prev].slice(0,5));
  }

  const selSt: React.CSSProperties = {
    padding:"10px 32px 10px 12px", border:"1.5px solid #E2E8F0", borderRadius:"10px",
    fontSize:"12px", color:"#334155", fontFamily:"'DM Sans',sans-serif",
    outline:"none", background:"white", cursor:"pointer", fontWeight:500,
    appearance:"none", WebkitAppearance:"none" as any,
    backgroundImage:`url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%2394A3B8' stroke-width='1.5' stroke-linecap='round' fill='none'/%3E%3C/svg%3E")`,
    backgroundRepeat:"no-repeat", backgroundPosition:"right 10px center", minWidth:"110px",
  };

  const SORT_TABS = [
    {key:"rank"       as const, label:"By Rank",    ik:"award"    as ICKey},
    {key:"attendance" as const, label:"Attendance", ik:"calendar" as ICKey},
    {key:"lci"        as const, label:"LCI Score",  ik:"bar"      as ICKey},
    {key:"questions"  as const, label:"Questions",  ik:"msg"      as ICKey},
    {key:"debates"    as const, label:"Debates",    ik:"mic"      as ICKey},
  ];
  const QUICK = [
    {label:"Top Performers",  ik:"star"     as ICKey, fn:()=>{setGradeF("A");setSortBy("lci");setPage(1);}       },
    {label:"Low Performers",  ik:"warn"     as ICKey, fn:()=>{setGradeF("F");setSortBy("lci");setPage(1);}       },
    {label:"Best Attendance", ik:"calendar" as ICKey, fn:()=>{setSortBy("attendance");setAttMin(90);setPage(1);}},
    {label:"Most Questions",  ik:"msg"      as ICKey, fn:()=>{setSortBy("questions");setPage(1);}                },
    {label:"Silent MPs",      ik:"mute"     as ICKey, fn:()=>{setSilentF(true);setPage(1);}                      },
    {label:"Reset All",       ik:"x"        as ICKey, fn:()=>{setGradeF("All");setAttMin(0);setSilentF(false);setSortBy("rank");setSearch("");setPage(1);}},
  ];

  return (
    <div style={{ minHeight:"100vh", fontFamily:"'DM Sans',sans-serif", background:"#EEF3FF", position:"relative" }}>
      <ParliamentBg/>

      {/* ══ HERO ══ */}
      <div style={{ background:"linear-gradient(150deg,#060D1F 0%,#0F1F4A 45%,#1E3A8A 80%,#1D4ED8 100%)", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-20%", left:"-5%", width:"580px", height:"580px", borderRadius:"50%",
          background:"radial-gradient(circle,rgba(37,99,235,0.17) 0%,transparent 70%)",
          animation:"orb1 8s ease-in-out infinite alternate", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:"-30%", right:"-10%", width:"480px", height:"480px", borderRadius:"50%",
          background:"radial-gradient(circle,rgba(124,58,237,0.11) 0%,transparent 70%)",
          animation:"orb2 10s ease-in-out infinite alternate", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", inset:0,
          backgroundImage:"radial-gradient(rgba(255,255,255,0.07) 1px,transparent 1px)",
          backgroundSize:"30px 30px", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"4px",
          background:"linear-gradient(90deg,#FF9933 33.3%,white 33.3% 66.6%,#138808 66.6%)", opacity:0.8 }}/>

        <div style={{ maxWidth:"1400px", margin:"0 auto", padding:"64px 48px 56px", position:"relative", zIndex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"24px", animation:"fadeDown 0.6s ease both" }}>
            <div style={{ display:"flex", gap:"3px" }}>
              {(["#FF9933","white","#138808"] as const).map(c=>(
                <div key={c} style={{ width:"20px", height:"3px", background:c, borderRadius:"2px" }}/>
              ))}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"7px", padding:"4px 14px",
              border:"1px solid rgba(255,255,255,0.14)", borderRadius:"100px",
              backdropFilter:"blur(8px)", background:"rgba(255,255,255,0.05)" }}>
              {IC.build("rgba(255,255,255,0.55)",12)}
              <span style={{ fontSize:"10px", fontWeight:800, color:"rgba(255,255,255,0.55)", textTransform:"uppercase", letterSpacing:"0.22em" }}>
                18th Lok Sabha · MP Directory
              </span>
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:"60px", alignItems:"start" }}>
            <div style={{ animation:"fadeDown 0.7s ease 0.1s both" }}>
              <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(40px,5.2vw,74px)",
                fontWeight:900, color:"white", lineHeight:1.0, letterSpacing:"-2px", marginBottom:"20px" }}>
                Explore Your<br/>
                <span style={{ color:"#F59E0B", position:"relative" }}>
                  Members of Parliament
                  <span style={{ position:"absolute", bottom:"-4px", left:0, right:0, height:"3px",
                    background:"linear-gradient(90deg,#F59E0B,transparent)", borderRadius:"2px" }}/>
                </span>
              </h1>
              <p style={{ fontSize:"15px", color:"rgba(255,255,255,0.48)", lineHeight:2.0, maxWidth:"540px", marginBottom:"32px" }}>
                Track attendance, questions asked, debates participated and overall civic performance of all{" "}
                <strong style={{ color:"white", fontWeight:700 }}>544 MPs</strong> of the 18th Lok Sabha. Data-driven. Zero bias.
              </p>
              <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
                {photosN > 0 && (
                  <div style={{ display:"inline-flex", alignItems:"center", gap:"6px", padding:"6px 16px",
                    background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.2)", borderRadius:"100px" }}>
                    <div style={{ width:7, height:7, borderRadius:"50%", background:"#22C55E", animation:"pulse 2s ease infinite" }}/>
                    <span style={{ fontSize:"10px", color:"#22C55E", fontWeight:700 }}>{photosN} photos loaded</span>
                  </div>
                )}
                <div style={{ display:"inline-flex", alignItems:"center", gap:"6px", padding:"6px 16px",
                  background:"rgba(251,191,36,0.08)", border:"1px solid rgba(251,191,36,0.2)", borderRadius:"100px" }}>
                  {IC.file("#F59E0B",11)}
                  <span style={{ fontSize:"10px", color:"#F59E0B", fontWeight:700 }}>PRS Legislative Research Data</span>
                </div>
              </div>
            </div>

            {!loading && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", minWidth:"300px", animation:"fadeDown 0.7s ease 0.2s both" }}>
                {([
                  { n:mps.length,             suf:"",  label:"Members of Parliament",  ik:"users"    as ICKey, c:"#60A5FA", bg:"rgba(96,165,250,0.08)"  },
                  { n:Math.round(avgAtt*100), suf:"%", label:"Average Attendance",     ik:"calendar" as ICKey, c:"#34D399", bg:"rgba(52,211,153,0.08)"  },
                  { n:silentCount,            suf:"",  label:"Low Participation MPs",  ik:"mute"     as ICKey, c:"#F87171", bg:"rgba(248,113,113,0.08)" },
                  { n:Math.round(avgQ),       suf:"",  label:"Avg Questions Asked",    ik:"msg"      as ICKey, c:"#FBBF24", bg:"rgba(251,191,36,0.08)"  },
                ] as const).map(s=>(
                  <div key={s.label} style={{ padding:"20px", borderRadius:"18px", background:s.bg,
                    border:`1px solid ${s.c}22`, backdropFilter:"blur(12px)", transition:"transform 0.2s" }}
                    onMouseEnter={e=>(e.currentTarget.style.transform="scale(1.04)")}
                    onMouseLeave={e=>(e.currentTarget.style.transform="scale(1)")}>
                    <div style={{ marginBottom:"8px" }}>{IC[s.ik](s.c,16)}</div>
                    <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"34px", fontWeight:900, color:s.c, lineHeight:1 }}>
                      <AnimCounter target={s.n} suffix={s.suf}/>
                    </div>
                    <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.38)", marginTop:"5px", lineHeight:1.5 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══ STICKY CONTROLS ══ */}
      <div style={{ background:"white", borderBottom:"1px solid #E2E8F0", position:"sticky", top:"62px", zIndex:40, boxShadow:"0 4px 24px rgba(30,58,138,0.07)" }}>
        <div style={{ maxWidth:"1400px", margin:"0 auto", padding:"0 48px" }}>
          {/* Sort tabs */}
          <div style={{ display:"flex", gap:0, borderBottom:"1px solid #F1F5F9", overflowX:"auto" }}>
            {SORT_TABS.map(({key,label,ik})=>{
              const on = sortBy===key;
              return (
                <button key={key} onClick={()=>{setSortBy(key);setPage(1);}} style={{
                  padding:"14px 20px", background:"none", border:"none",
                  borderBottom:on?"3px solid #1E3A8A":"3px solid transparent",
                  cursor:"pointer", fontSize:"12px", fontWeight:on?700:500,
                  color:on?"#1E3A8A":"#64748B", fontFamily:"'DM Sans',sans-serif",
                  transition:"all 0.2s", marginBottom:"-1px", whiteSpace:"nowrap",
                  display:"flex", alignItems:"center", gap:"6px" }}>
                  {IC[ik](on?"#1E3A8A":"#94A3B8",13)} {label}
                </button>
              );
            })}
            {compareList.length > 0 && (
              <button onClick={()=>compareList.length===2&&setShowCompare(true)} style={{
                marginLeft:"auto", padding:"8px 20px", alignSelf:"center",
                background:compareList.length===2?"#1E3A8A":"#EFF6FF", border:"none", borderRadius:"10px",
                cursor:compareList.length===2?"pointer":"default", fontSize:"11px", fontWeight:700,
                color:compareList.length===2?"white":"#1E40AF", fontFamily:"'DM Sans',sans-serif",
                display:"flex", alignItems:"center", gap:"6px" }}>
                {IC.zap(compareList.length===2?"white":"#1E40AF",13)}
                {compareList.length===2 ? "Compare Now" : `Select ${2-compareList.length} more`}
              </button>
            )}
          </div>

          {/* Search + filters */}
          <div style={{ display:"flex", gap:"8px", padding:"12px 0", flexWrap:"wrap", alignItems:"center" }}>
            <div style={{ position:"relative", flex:"1 1 260px" }}>
              <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }}>{IC.search("#94A3B8",15)}</div>
              <input value={search} onChange={e=>handleSearch(e.target.value)}
                onFocus={()=>setShowRecent(true)} onBlur={()=>setTimeout(()=>setShowRecent(false),150)}
                placeholder="Search MP — name, constituency, state, party…"
                style={{ width:"100%", padding:"10px 36px 10px 38px", border:"1.5px solid #E2E8F0",
                  borderRadius:"12px", fontSize:"13px", fontFamily:"'DM Sans',sans-serif",
                  outline:"none", boxSizing:"border-box" as any, color:"#0F172A", background:"#F8FAFC" }}
                onKeyDown={e=>e.key==="Escape"&&setSearch("")}/>
              {search && (
                <button onClick={()=>{setSearch("");setPage(1);}} style={{ position:"absolute", right:10,
                  top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", padding:2 }}>
                  {IC.x("#94A3B8",14)}
                </button>
              )}
              {showRecent && recentSearch.length>0 && !search && (
                <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, right:0, background:"white",
                  border:"1px solid #E2E8F0", borderRadius:"12px", padding:"8px", zIndex:50, boxShadow:"0 12px 32px rgba(0,0,0,0.1)" }}>
                  <div style={{ fontSize:"9px", color:"#94A3B8", fontWeight:700, paddingLeft:"8px", marginBottom:"6px",
                    textTransform:"uppercase", letterSpacing:"0.1em" }}>Recent</div>
                  {recentSearch.map(s=>(
                    <div key={s} onClick={()=>handleSearch(s)} style={{ padding:"7px 10px", fontSize:"12px",
                      color:"#334155", cursor:"pointer", borderRadius:"8px", display:"flex", alignItems:"center", gap:"8px" }}
                      onMouseEnter={e=>(e.currentTarget.style.background="#F8FAFC")}
                      onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                      {IC.search("#CBD5E1",11)} {s}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <select value={stateF} onChange={e=>{setStateF(e.target.value);setPage(1);}} style={selSt}>
              {states.slice(0,40).map(s=><option key={s}>{s}</option>)}
            </select>
            <select value={partyF} onChange={e=>{setPartyF(e.target.value);setPage(1);}} style={selSt}>
              {parties.slice(0,50).map(p=><option key={p}>{p}</option>)}
            </select>
            <select value={gradeF} onChange={e=>{setGradeF(e.target.value);setPage(1);}} style={selSt}>
              {["All","A","B","C","D","F"].map(g=><option key={g} value={g}>{g==="All"?"All Grades":`Grade ${g}`}</option>)}
            </select>
            <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
              <span style={{ fontSize:"11px", color:"#64748B", fontWeight:600, whiteSpace:"nowrap" }}>Att ≥</span>
              <select value={attMin} onChange={e=>{setAttMin(Number(e.target.value));setPage(1);}} style={{...selSt,minWidth:"80px"}}>
                {[0,50,60,70,80,90,95].map(v=><option key={v} value={v}>{v===0?"Any":`${v}%`}</option>)}
              </select>
            </div>
            <button onClick={()=>setShowPanel(p=>!p)} style={{ padding:"10px 16px", borderRadius:"10px",
              border:`1.5px solid ${showPanel?"#BFDBFE":"#E2E8F0"}`,
              background:showPanel?"#EFF6FF":"white", cursor:"pointer", fontSize:"12px", fontWeight:700,
              color:showPanel?"#1E40AF":"#64748B", fontFamily:"'DM Sans',sans-serif",
              display:"flex", alignItems:"center", gap:"6px", transition:"all 0.2s" }}>
              {IC.sliders(showPanel?"#1E40AF":"#64748B",13)} Filters
              {silentF && <span style={{ width:6, height:6, borderRadius:"50%", background:"#DC2626" }}/>}
            </button>
            <button onClick={()=>{setSilentF(p=>!p);setPage(1);}} style={{ padding:"10px 16px", borderRadius:"10px",
              border:`1.5px solid ${silentF?"#FCA5A5":"#E2E8F0"}`,
              background:silentF?"#FEF2F2":"white", cursor:"pointer", fontSize:"12px", fontWeight:700,
              color:silentF?"#DC2626":"#64748B", fontFamily:"'DM Sans',sans-serif",
              display:"flex", alignItems:"center", gap:"6px", transition:"all 0.2s" }}>
              {IC.mute(silentF?"#DC2626":"#64748B",13)} Silent MPs
            </button>
            <div style={{ marginLeft:"auto", padding:"8px 14px", background:"#F8FAFC",
              borderRadius:"10px", border:"1px solid #E2E8F0", fontSize:"11px", color:"#64748B",
              fontWeight:700, whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:"5px" }}>
              {IC.eye("#94A3B8",12)} {filtered.length} / {mps.length} MPs
            </div>
          </div>

          {showPanel && (
            <div style={{ padding:"14px 0 18px", borderTop:"1px solid #F1F5F9",
              display:"flex", gap:"10px", flexWrap:"wrap", alignItems:"center", animation:"fadeIn 0.2s ease" }}>
              <span style={{ fontSize:"10px", color:"#94A3B8", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em" }}>Quick Filters</span>
              {QUICK.map(btn=>(
                <button key={btn.label} onClick={btn.fn} style={{ padding:"7px 16px", borderRadius:"100px",
                  border:"1.5px solid #E2E8F0", background:"white", cursor:"pointer", fontSize:"11px", fontWeight:600,
                  color:"#334155", fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", gap:"5px", transition:"all 0.2s" }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor="#BFDBFE";(e.currentTarget as HTMLButtonElement).style.background="#EFF6FF";(e.currentTarget as HTMLButtonElement).style.color="#1E40AF";}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor="#E2E8F0";(e.currentTarget as HTMLButtonElement).style.background="white";(e.currentTarget as HTMLButtonElement).style.color="#334155";}}>
                  {IC[btn.ik]("#94A3B8",11)} {btn.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ══ BODY ══ */}
      <div style={{ maxWidth:"1400px", margin:"0 auto", padding:"36px 48px 80px", position:"relative", zIndex:1 }}>

        {!loading && (
          <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"28px" }}>
            {([
              { label:"Avg Attendance", v:`${(avgAtt*100).toFixed(1)}%`, ik:"calendar" as ICKey, c:"#16A34A", bg:"#F0FDF4", b:"#86EFAC" },
              { label:"Avg Questions",  v:avgQ.toFixed(1),               ik:"msg"      as ICKey, c:"#1E40AF", bg:"#EFF6FF", b:"#93C5FD" },
              { label:"Avg Debates",    v:avgDeb.toFixed(1),             ik:"mic"      as ICKey, c:"#7C3AED", bg:"#F5F3FF", b:"#C4B5FD" },
              { label:"Avg LCI",        v:avgLCI.toFixed(4),             ik:"bar"      as ICKey, c:"#D97706", bg:"#FFFBEB", b:"#FCD34D" },
            ] as const).map(s=>(
              <div key={s.label} style={{ display:"flex", alignItems:"center", gap:"8px", padding:"8px 16px",
                background:s.bg, borderRadius:"12px", border:`1px solid ${s.b}` }}>
                {IC[s.ik](s.c,13)}
                <span style={{ fontSize:"11px", color:s.c, fontWeight:600 }}>{s.label}</span>
                <span style={{ fontSize:"15px", fontWeight:800, color:s.c, fontFamily:"'Playfair Display',Georgia,serif" }}>{s.v}</span>
              </div>
            ))}
            <div style={{ display:"flex", alignItems:"center", gap:"6px", padding:"8px 14px",
              background:"white", border:"1px solid #E2E8F0", borderRadius:"12px" }}>
              <div style={{ width:10, height:2, background:"#94A3B8", borderRadius:1 }}/>
              <span style={{ fontSize:"10px", color:"#94A3B8", fontWeight:600 }}>bar marker = national average</span>
            </div>
          </div>
        )}

        {loading && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"120px 0", gap:"20px" }}>
            <div style={{ position:"relative", width:60, height:60 }}>
              <div style={{ position:"absolute", inset:0, border:"3px solid #DBEAFE", borderRadius:"50%" }}/>
              <div style={{ position:"absolute", inset:0, border:"3px solid transparent", borderTop:"3px solid #1E3A8A", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>
              <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)" }}>{IC.build("#1E3A8A",22)}</div>
            </div>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:"15px", fontWeight:600, color:"#334155" }}>Loading 544 MPs…</div>
              <div style={{ fontSize:"12px", color:"#94A3B8", marginTop:"4px" }}>Fetching parliamentary records</div>
            </div>
          </div>
        )}

        {!loading && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:"28px", alignItems:"start" }}>
            {/* Cards 3×3 */}
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"20px" }}>
                {pageData.map((mp,i)=>(
                  <MPCard key={mp.name} mp={mp} maxQ={maxQ} maxDeb={maxDeb}
                    avgAtt={avgAtt} avgQ={avgQ} avgDeb={avgDeb} photos={photos}
                    onCompare={handleCompare} compareList={compareList} animIdx={i}/>
                ))}
              </div>

              {filtered.length===0 && (
                <div style={{ textAlign:"center", padding:"100px 40px", background:"white", borderRadius:"24px", border:"1.5px dashed #CBD5E1" }}>
                  <div style={{ width:64, height:64, borderRadius:"50%", background:"#F1F5F9",
                    display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
                    {IC.search("#CBD5E1",28)}
                  </div>
                  <div style={{ fontSize:"16px", fontWeight:700, color:"#475569", marginBottom:"8px" }}>No MPs found</div>
                  <div style={{ fontSize:"13px", color:"#94A3B8", marginBottom:"20px" }}>Try adjusting your filters</div>
                  <button onClick={()=>{setGradeF("All");setAttMin(0);setSilentF(false);setSearch("");setPage(1);}}
                    style={{ padding:"10px 24px", background:"#1E3A8A", border:"none", borderRadius:"100px",
                      color:"white", fontSize:"13px", fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
                      display:"inline-flex", alignItems:"center", gap:"6px" }}>
                    {IC.x("white",14)} Clear Filters
                  </button>
                </div>
              )}

              {totalPages > 1 && (
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:"40px", paddingTop:"24px", borderTop:"1px solid #E2E8F0" }}>
                  <span style={{ fontSize:"12px", color:"#94A3B8", fontWeight:500 }}>
                    Showing {(page-1)*PER+1}–{Math.min(page*PER,filtered.length)} of {filtered.length} MPs
                  </span>
                  <div style={{ display:"flex", gap:"6px", alignItems:"center" }}>
                    <button onClick={()=>{setPage(p=>Math.max(1,p-1));window.scrollTo({top:300,behavior:"smooth"});}}
                      disabled={page===1} style={{ width:38, height:38, borderRadius:"10px",
                        border:"1.5px solid #E2E8F0", background:"white", cursor:page===1?"not-allowed":"pointer",
                        display:"flex", alignItems:"center", justifyContent:"center", opacity:page===1?0.4:1 }}>
                      {IC.chevL("#334155",16)}
                    </button>
                    {Array.from({length:Math.min(7,totalPages)},(_,i)=>{
                      const p=Math.max(1,Math.min(page-3,totalPages-6))+i;
                      return (
                        <button key={p} onClick={()=>{setPage(p);window.scrollTo({top:300,behavior:"smooth"});}}
                          style={{ width:38, height:38, borderRadius:"10px",
                            border:`1.5px solid ${p===page?"#1E3A8A":"#E2E8F0"}`,
                            background:p===page?"#1E3A8A":"white", cursor:"pointer",
                            fontSize:"13px", fontWeight:p===page?700:400,
                            color:p===page?"white":"#334155", fontFamily:"'DM Sans',sans-serif",
                            transition:"all 0.2s", transform:p===page?"scale(1.1)":"scale(1)" }}>
                          {p}
                        </button>
                      );
                    })}
                    <button onClick={()=>{setPage(p=>Math.min(totalPages,p+1));window.scrollTo({top:300,behavior:"smooth"});}}
                      disabled={page===totalPages} style={{ width:38, height:38, borderRadius:"10px",
                        border:"1.5px solid #E2E8F0", background:"white", cursor:page===totalPages?"not-allowed":"pointer",
                        display:"flex", alignItems:"center", justifyContent:"center", opacity:page===totalPages?0.4:1 }}>
                      {IC.chevR("#334155",16)}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div style={{ display:"flex", flexDirection:"column", gap:"20px", position:"sticky", top:"180px" }}>
              <ConstituencyFinder mps={mps}/>

              {/* Compare widget */}
              <div style={{ background:"white", borderRadius:"20px", padding:"24px", border:"1.5px solid #E2E8F0", boxShadow:"0 4px 20px rgba(0,0,0,0.05)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"12px" }}>
                  <div style={{ width:32, height:32, borderRadius:"10px", background:"#FFFBEB", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {IC.zap("#D97706",16)}
                  </div>
                  <span style={{ fontSize:"14px", fontWeight:800, color:"#0F172A" }}>Compare MPs</span>
                </div>
                <div style={{ fontSize:"12px", color:"#64748B", lineHeight:1.7, marginBottom:"14px" }}>
                  Tap <strong style={{ color:"#1E40AF" }}>+</strong> on any two cards to compare head-to-head.
                </div>
                {compareList.length > 0 && (
                  <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                    {compareList.map(name=>(
                      <div key={name} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                        padding:"8px 12px", background:"#EFF6FF", borderRadius:"10px", border:"1px solid #BFDBFE" }}>
                        <span style={{ fontSize:"12px", fontWeight:700, color:"#1E40AF", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:"180px" }}>{name}</span>
                        <button onClick={()=>setCompareList(p=>p.filter(n=>n!==name))} style={{ background:"none", border:"none", cursor:"pointer", padding:2, flexShrink:0 }}>
                          {IC.x("#94A3B8",13)}
                        </button>
                      </div>
                    ))}
                    {compareList.length===2 && (
                      <button onClick={()=>setShowCompare(true)} style={{ padding:"11px", background:"#1E3A8A",
                        border:"none", borderRadius:"12px", color:"white", fontSize:"13px", fontWeight:700,
                        cursor:"pointer", fontFamily:"'DM Sans',sans-serif", marginTop:"4px",
                        display:"flex", alignItems:"center", justifyContent:"center", gap:"6px" }}
                        onMouseEnter={e=>(e.currentTarget.style.background="#1E40AF")}
                        onMouseLeave={e=>(e.currentTarget.style.background="#1E3A8A")}>
                        {IC.zap("white",14)} Compare Now
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Grade legend */}
              <div style={{ background:"white", borderRadius:"20px", padding:"24px", border:"1.5px solid #E2E8F0", boxShadow:"0 4px 20px rgba(0,0,0,0.05)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"16px" }}>
                  <div style={{ width:32, height:32, borderRadius:"10px", background:"#F0FDF4", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {IC.award("#16A34A",16)}
                  </div>
                  <span style={{ fontSize:"14px", fontWeight:800, color:"#0F172A" }}>Grade Scale</span>
                </div>
                {(["A","B","C","D","F"] as const).map(g=>{
                  const gi = grade(g==="A"?0.8:g==="B"?0.6:g==="C"?0.35:g==="D"?0.15:0.05);
                  const cnt = mps.filter(m=>grade(getLCI(m)).g===g).length;
                  return (
                    <div key={g} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"8px 0", borderBottom:"1px solid #F8FAFC" }}>
                      <div style={{ width:32, height:32, borderRadius:"8px", background:gi.bg, border:`1.5px solid ${gi.border}`,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontFamily:"'Playfair Display',serif", fontSize:"16px", fontWeight:800, color:gi.color }}>{g}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:"12px", fontWeight:700, color:"#334155" }}>{gi.label}</div>
                        <div style={{ fontSize:"10px", color:"#94A3B8" }}>{g==="A"?"LCI ≥ 0.75":g==="B"?"0.50–0.75":g==="C"?"0.25–0.50":g==="D"?"0.10–0.25":"< 0.10"}</div>
                      </div>
                      <span style={{ fontSize:"13px", fontWeight:700, color:gi.accent }}>{cnt}</span>
                    </div>
                  );
                })}
              </div>

              {/* Data source */}
              <div style={{ padding:"20px", background:"#FFFBEB", borderRadius:"20px", border:"1.5px solid #FDE68A" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"7px", marginBottom:"10px" }}>
                  {IC.shield("#D97706",14)}
                  <span style={{ fontSize:"10px", fontWeight:800, color:"#D97706", textTransform:"uppercase", letterSpacing:"0.14em" }}>Data Sources</span>
                </div>
                <div style={{ fontSize:"12px", color:"#78350F", lineHeight:1.8 }}>
                  PRS Legislative Research<br/>Lok Sabha Official Records<br/>
                  <span style={{ color:"#D97706", fontWeight:700, fontSize:"11px" }}>Zero editorial bias. Data only.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && <UnderstandSection/>}
      </div>

      {showCompare && compareList.length===2 && (
        <CompareModal list={compareList} mps={mps} onClose={()=>setShowCompare(false)}/>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes spin     { to { transform:rotate(360deg); } }
        @keyframes pulse    { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:.7} }
        @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes slideUp  { from{transform:translateY(24px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes fadeDown { from{transform:translateY(-14px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes cardIn   { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes orb1     { from{transform:translate(0,0) scale(1)} to{transform:translate(40px,30px) scale(1.1)} }
        @keyframes orb2     { from{transform:translate(0,0) scale(1)} to{transform:translate(-30px,-20px) scale(1.08)} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:6px; height:6px; }
        ::-webkit-scrollbar-track { background:#F1F5F9; }
        ::-webkit-scrollbar-thumb { background:#CBD5E1; border-radius:3px; }
        ::-webkit-scrollbar-thumb:hover { background:#94A3B8; }
      `}</style>
    </div>
  );
}