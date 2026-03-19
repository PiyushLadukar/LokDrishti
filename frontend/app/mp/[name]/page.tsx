"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getNationalRankings } from "@/lib/api";

/* ─── Data helpers ─────────────────────────────────────────── */
const getLCI        = (mp: any) => mp.LCI_score  ?? 0;
const getAttendance = (mp: any) => mp.attendance ?? 0;
const getQuestions  = (mp: any) => mp.questions  ?? 0;
const getDebates    = (mp: any) => mp.debates    ?? 0;
const isSilent      = (mp: any) => mp.silent_flag === 1;

function getGrade(lci: number) {
  if (lci >= 0.75) return { g:"A", label:"Exceptional",   color:"#00C896", glow:"rgba(0,200,150,0.3)",   ring:"#00C896" };
  if (lci >= 0.5)  return { g:"B", label:"Good",          color:"#FF6B00", glow:"rgba(255,107,0,0.3)",   ring:"#FF6B00" };
  if (lci >= 0.25) return { g:"C", label:"Average",       color:"#F59E0B", glow:"rgba(245,158,11,0.3)",  ring:"#F59E0B" };
  if (lci >= 0.1)  return { g:"D", label:"Below Average", color:"#EF4444", glow:"rgba(239,68,68,0.3)",   ring:"#EF4444" };
  return                   { g:"F", label:"Poor",          color:"#991B1B", glow:"rgba(153,27,27,0.3)",   ring:"#991B1B" };
}

/* ─── Animated Counter ─────────────────────────────────────── */
function Counter({ to, decimals=0, suffix="" }: { to:number; decimals?:number; suffix?:string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const step = 16;
    const inc = to / (duration / step);
    const timer = setInterval(() => {
      start += inc;
      if (start >= to) { setVal(to); clearInterval(timer); }
      else setVal(start);
    }, step);
    return () => clearInterval(timer);
  }, [to]);
  return <>{val.toFixed(decimals)}{suffix}</>;
}

/* ─── Radar Chart ──────────────────────────────────────────── */
function RadarChart({ mp, avgAtt, avgQ, avgDeb }: any) {
  const lci  = getLCI(mp);
  const att  = getAttendance(mp);
  const q    = getQuestions(mp);
  const deb  = getDebates(mp);
  const eng  = mp.engagement_index ?? 0;

  const maxQ = 350, maxDeb = 250, maxEng = 600;

  const metrics = [
    { label:"Attendance",  mp: att,       avg: avgAtt,      max: 1     },
    { label:"Questions",   mp: q/maxQ,    avg: avgQ/maxQ,   max: 1     },
    { label:"Debates",     mp: deb/maxDeb,avg: avgDeb/maxDeb,max: 1    },
    { label:"LCI Score",   mp: lci,       avg: 0.12,        max: 1     },
    { label:"Engagement",  mp: eng/maxEng,avg: 0.25,        max: 1     },
  ];

  const cx = 160, cy = 160, r = 110;
  const n = metrics.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  function polar(val: number, i: number) {
    const angle = startAngle + i * angleStep;
    return [cx + val * r * Math.cos(angle), cy + val * r * Math.sin(angle)];
  }

  const mpPoints    = metrics.map((m, i) => polar(Math.min(m.mp, 1), i));
  const avgPoints   = metrics.map((m, i) => polar(Math.min(m.avg, 1), i));
  const gridLevels  = [0.25, 0.5, 0.75, 1.0];

  const toPath = (pts: number[][]) => pts.map((p,i) => `${i===0?"M":"L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ") + "Z";

  return (
    <svg viewBox="0 0 320 320" style={{ width:"100%", maxWidth:"320px" }}>
      <defs>
        <radialGradient id="mpGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#FF6B00" stopOpacity="0.05"/>
        </radialGradient>
      </defs>
      {gridLevels.map(level => (
        <polygon key={level}
          points={metrics.map((_,i) => polar(level,i).join(",")).join(" ")}
          fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
      ))}
      {metrics.map((_,i) => {
        const [x,y] = polar(1,i);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>;
      })}
      <path d={toPath(avgPoints)} fill="rgba(96,165,250,0.08)" stroke="rgba(96,165,250,0.3)" strokeWidth="1.5" strokeDasharray="4,3"/>
      <path d={toPath(mpPoints)} fill="url(#mpGrad)" stroke="#FF6B00" strokeWidth="2"/>
      {mpPoints.map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="#FF6B00" stroke="#0A1628" strokeWidth="2"/>
      ))}
      {metrics.map((m,i) => {
        const [x,y] = polar(1.22, i);
        return (
          <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
            fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="'DM Sans',sans-serif">
            {m.label}
          </text>
        );
      })}
    </svg>
  );
}

/* ─── Animated Bar ─────────────────────────────────────────── */
function AnimBar({ value, max, color, delay=0 }: { value:number; max:number; color:string; delay?:number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(Math.min((value/(max||1))*100, 100)), delay + 100);
    return () => clearTimeout(t);
  }, [value, max, delay]);
  return (
    <div style={{ height:"6px", background:"rgba(255,255,255,0.06)", borderRadius:"3px", overflow:"hidden" }}>
      <div style={{ height:"100%", width:`${width}%`, background:color, borderRadius:"3px",
        transition:"width 1s cubic-bezier(0.4,0,0.2,1)", boxShadow:`0 0 8px ${color}60` }}/>
    </div>
  );
}

/* ─── MP Photo ─────────────────────────────────────────────── */
// ✅ FIX: Routes Wikipedia URLs through /api/proxy-image so the server fetches
// them with Referer: https://en.wikipedia.org/ — bypassing Wikipedia's hotlink block.
function MPPhoto({ name, photoUrl, size=120, glowColor }: { name:string; photoUrl?:string; size?:number; glowColor:string }) {
  const [err, setErr] = useState(false);
  const [hov, setHov] = useState(false);
  const initials = (name||"?").split(" ").map((w:string)=>w[0]).slice(0,2).join("").toUpperCase();

  // If it's a Wikipedia URL, proxy it through our Next.js server route.
  // If it's already a local /mp_photos/... path, use it directly.
  const proxiedSrc = photoUrl
    ? photoUrl.startsWith("http")
      ? `/api/proxy-image?url=${encodeURIComponent(photoUrl)}`
      : photoUrl
    : null;

  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ position:"relative", width:size, height:size, flexShrink:0,
        transition:"transform 0.3s ease", transform:hov?"scale(1.05)":"scale(1)" }}>
      {/* Animated glow ring */}
      <div style={{ position:"absolute", inset:"-6px", borderRadius:"50%",
        background:`conic-gradient(${glowColor}, transparent, ${glowColor})`,
        opacity: hov ? 1 : 0.6,
        animation:"spin 3s linear infinite",
        transition:"opacity 0.3s" }}/>
      <div style={{ position:"absolute", inset:"-3px", borderRadius:"50%", background:"#0A1628" }}/>
      {/* Photo */}
      <div style={{ position:"relative", width:size, height:size, borderRadius:"50%", overflow:"hidden",
        border:`2px solid ${glowColor}40`, boxShadow:`0 0 ${hov?40:20}px ${glowColor}60`,
        transition:"box-shadow 0.3s" }}>
        {proxiedSrc && !err ? (
          <img
            src={proxiedSrc}
            alt={name}
            onError={()=>setErr(true)}
            style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top center" }}
          />
        ) : (
          <div style={{ width:"100%", height:"100%", background:`linear-gradient(135deg,${glowColor}30,${glowColor}10)`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontFamily:"'Cormorant Garamond',serif", fontSize:size*0.32, fontWeight:700, color:glowColor }}>
            {initials}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main Page ────────────────────────────────────────────── */
export default function MPProfilePage() {
  const params = useParams();
  const name   = decodeURIComponent((params?.name as string) ?? "");
  const [mp,      setMp]      = useState<any>(null);
  const [photo,   setPhoto]   = useState<string|null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);
  const [avgAtt,  setAvgAtt]  = useState(0.76);
  const [avgQ,    setAvgQ]    = useState(78);
  const [avgDeb,  setAvgDeb]  = useState(15);
  const [visible, setVisible] = useState(false);
  const [criminal, setCriminal] = useState<any>(null);


  useEffect(() => {
    if (!name) return;
    (async () => {
      try {
        const first = await getNationalRankings(undefined, 1, 100);
        const total = first.total || 544;
        let all = [...(first.data||[])];
        for (let p=2; p<=Math.ceil(total/100); p++) {
          const r = await getNationalRankings(undefined, p, 100);
          all = [...all, ...(r.data||[])];
        }
        const found = all.find((m:any) => m.name === name);
        if (found) setMp(found); else setError(true);
        if (all.length) {
          setAvgAtt(all.reduce((s:number,m:any)=>s+(m.attendance??0),0)/all.length);
          setAvgQ(all.reduce((s:number,m:any)=>s+(m.questions??0),0)/all.length);
          setAvgDeb(all.reduce((s:number,m:any)=>s+(m.debates??0),0)/all.length);
        }
      } catch { setError(true); }
      setLoading(false);
      setTimeout(() => setVisible(true), 100);
    })();

  if (!name) return;

  // ✅ Track MP profile views for user dashboard
  const prev = parseInt(localStorage.getItem("ld_mps_viewed") || "0");
  localStorage.setItem("ld_mps_viewed", String(prev + 1));
      
    fetch("/mp_photos.json").then(r=>r.json()).then(d=>setPhoto(d[name]||null)).catch(()=>{});
    fetch(`http://127.0.0.1:5000/api/mps/${encodeURIComponent(name)}/criminal`)
     .then(r => r.json())
     .then(d => setCriminal(d.criminal_record))
     .catch(()=>{});




  }, [name]);

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#0A1628", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:"16px" }}>
      <div style={{ width:"40px", height:"40px", border:"3px solid rgba(255,107,0,0.2)", borderTop:"3px solid #FF6B00", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>
      <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.3)", fontFamily:"'DM Sans',sans-serif" }}>Loading profile…</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (error || !mp) return (
    <div style={{ minHeight:"100vh", background:"#0A1628", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:"12px", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.4)" }}>MP not found.</div>
      <Link href="/mp" style={{ fontSize:"12px", color:"#FF6B00", textDecoration:"none", fontWeight:700 }}>← Back to All MPs</Link>
    </div>
  );

  const lci    = getLCI(mp);
  const att    = getAttendance(mp);
  const attPct = att * 100;
  const q      = getQuestions(mp);
  const deb    = getDebates(mp);
  const eng    = mp.engagement_index ?? 0;
  const silent = isSilent(mp);
  const grade  = getGrade(lci);
  const attColor = attPct>=75?"#00C896":attPct>=50?"#F59E0B":"#EF4444";
  const initials = name.split(" ").map((w:string)=>w[0]).slice(0,2).join("").toUpperCase();

  const diffAtt  = ((attPct - avgAtt*100) / (avgAtt*100||1)*100);
  const diffQ    = ((q - avgQ) / (avgQ||1)*100);
  const diffDeb  = ((deb - avgDeb) / (avgDeb||1)*100);
  const diffLCI  = ((lci - 0.12) / 0.12*100);

  const fade = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(20px)",
    transitionProperty: "opacity, transform",
    transitionDuration: "0.6s",
    transitionTimingFunction: "ease",
    transitionDelay: `${delay}ms`,
  });

  return (
    <div style={{ minHeight:"100vh", fontFamily:"'DM Sans',sans-serif", background:`
radial-gradient(circle at 20% 10%, rgba(255,107,0,0.15), transparent 40%),
radial-gradient(circle at 80% 80%, rgba(96,165,250,0.12), transparent 40%),
linear-gradient(180deg,#020617,#030712)
` }}>

      {/* ══ CINEMATIC HERO ══ */}
      <div style={{ background:"linear-gradient(160deg, #0A1628 0%, #0F1E3A 50%, #0A1628 100%)", position:"relative",paddingTop:"80px", overflow:"hidden", paddingBottom:"0" }}>
        <div style={{ position:"absolute", inset:0,
          backgroundImage:"radial-gradient(rgba(255,107,0,0.08) 1px, transparent 1px)",
          backgroundSize:"28px 28px", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", left:"60px", top:"50%", transform:"translateY(-50%)",
          width:"300px", height:"300px",
          background:`radial-gradient(circle, ${grade.glow} 0%, transparent 70%)`,
          pointerEvents:"none" }}/>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:"3px",
          background:"linear-gradient(90deg,#FF6B00 33%,#FAFAF7 33%,#FAFAF7 66%,#138808 66%)" }}/>
        <div style={{ position:"absolute", right:"-20px", top:"50%", transform:"translateY(-50%)",
          fontFamily:"'Cormorant Garamond',serif", fontSize:"220px", fontWeight:900,
          color:"transparent", WebkitTextStroke:"1px rgba(255,255,255,0.03)",
          userSelect:"none", pointerEvents:"none", letterSpacing:"-8px" }}>{initials}</div>

        <div style={{ maxWidth:"1280px", margin:"0 auto", padding:"80px 48px 60px" }}>
          <Link href="/mp" style={{ display:"inline-flex", alignItems:"center", gap:"6px",
            fontSize:"11px", fontWeight:700, color:"rgba(255,255,255,0.25)", textDecoration:"none",
            marginBottom:"32px", textTransform:"uppercase", letterSpacing:"0.15em",
            ...fade(0) }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            All MPs
          </Link>

          <div style={{ display:"flex", gap:"40px", alignItems:"center", flexWrap:"wrap", ...fade(100) }}>
            {/* ✅ Photo now uses proxy */}
            <MPPhoto name={name} photoUrl={photo??undefined} size={120} glowColor={grade.ring}/>

            <div style={{ flex:1, minWidth:"280px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"12px", flexWrap:"wrap", marginBottom:"10px" }}>
                <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(32px,4.5vw,56px)",
                  fontWeight:700, color:"white", letterSpacing:"-1px", lineHeight:1, margin:0 }}>
                  {mp.name}
                </h1>
                <div style={{ padding:"5px 14px", background:`${grade.color}15`,
                  border:`1px solid ${grade.color}40`, borderRadius:"100px",
                  fontSize:"12px", fontWeight:800, color:grade.color }}>
                  Grade {grade.g} — {grade.label}
                </div>
                {silent && (
                  <div style={{ padding:"5px 12px", background:"rgba(239,68,68,0.1)",
                    border:"1px solid rgba(239,68,68,0.3)", borderRadius:"100px",
                    fontSize:"11px", fontWeight:800, color:"#EF4444" }}>⚠ SILENT MP</div>
                )}
              </div>

              <div style={{ display:"flex", gap:"6px", alignItems:"center", flexWrap:"wrap", marginBottom:"24px" }}>
                {[mp.constituency, mp.state, mp.party].filter(Boolean).map((v,i) => (
                  <span key={i} style={{ fontSize:"13px", color:"rgba(255,255,255,0.4)", fontWeight:500 }}>
                    {i>0 && <span style={{ marginRight:"6px", color:"rgba(255,255,255,0.15)" }}>•</span>}
                    {v}
                  </span>
                ))}
              </div>

              <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                {[
                  { icon:"🏆", l:"National Rank", v:`#${Math.round(mp.national_rank??0)}`, c:"#FF6B00" },
                  { icon:"📍", l:"State Rank",    v:`#${Math.round(mp.state_rank??0)}`,    c:"#60A5FA" },
                  { icon:"🏛", l:"Party Rank",    v:`#${Math.round(mp.party_rank??0)}`,    c:"#34D399" },
                  { icon:"📊", l:"Percentile",    v:`${(mp.percentile??0).toFixed(1)}th`,  c:"#A78BFA" },
                ].map((pill,i) => (
                  <div key={i} style={{ padding:"8px 16px",
                    background:"rgba(255,255,255,0.04)",
                    border:`1px solid rgba(255,255,255,0.08)`,
                    borderRadius:"100px", display:"flex", gap:"8px", alignItems:"center",
                    backdropFilter:"blur(10px)",
                    ...fade(200 + i*80) }}>
                    <span style={{ fontSize:"12px" }}>{pill.icon}</span>
                    <span style={{ fontSize:"9px", color:"rgba(255,255,255,0.3)", fontWeight:700,
                      textTransform:"uppercase", letterSpacing:"0.1em" }}>{pill.l}</span>
                    <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"18px",
                      fontWeight:700, color:pill.c }}>{pill.v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ textAlign:"center", ...fade(300) }}>
              <div style={{ width:"120px", height:"120px", borderRadius:"24px",
                background:`linear-gradient(135deg, ${grade.color}15, ${grade.color}05)`,
                border:`2px solid ${grade.color}30`,
                display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                boxShadow:`0 0 40px ${grade.glow}`,
                position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", inset:0, background:`radial-gradient(circle at 30% 30%, ${grade.color}10, transparent)` }}/>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"64px", fontWeight:900,
                  color:grade.color, lineHeight:1 }}>{grade.g}</div>
                <div style={{ fontSize:"10px", fontWeight:700, color:`${grade.color}aa`,
                  textTransform:"uppercase", letterSpacing:"0.1em" }}>{grade.label}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ height:"1px", background:"linear-gradient(90deg, transparent, rgba(255,107,0,0.3), transparent)" }}/>
      </div>

      {/* ══ BODY ══ */}
      <div style={{ maxWidth:"1280px", margin:"0 auto", padding:"40px 48px 80px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:"24px", alignItems:"start" }}>

          {/* ── LEFT COLUMN ── */}
          <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>

            {/* 4 Metric Cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"14px", ...fade(400) }}>
              {[
                { icon:"📊", l:"LCI Score",  v:lci,    fmt:(x:number)=>x.toFixed(4), c:grade.color, sub:"Lok Sabha Civic Index",    max:1,   pct:lci*100 },
                { icon:"📅", l:"Attendance", v:attPct, fmt:(x:number)=>x.toFixed(1)+"%", c:attColor, sub:"Sessions attended",       max:100, pct:attPct  },
                { icon:"💬", l:"Questions",  v:q,      fmt:(x:number)=>String(Math.round(x)), c:"#60A5FA", sub:"Questions raised",  max:350, pct:(q/350)*100 },
                { icon:"🎤", l:"Debates",    v:deb,    fmt:(x:number)=>String(Math.round(x)), c:"#A78BFA", sub:"Debates participated",max:250, pct:(deb/250)*100 },
              ].map((card,i) => (
                <div key={i} style={{ background:"rgba(15,23,42,0.65)", borderRadius:"16px",
                  padding:"22px 24px", border:`1px solid rgba(255,255,255,0.06)`,
                  borderTop:`3px solid ${card.c}`,
                  boxShadow:"0 12px 40px rgba(0,0,0,0.55)",
                  ...fade(400 + i*60) }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"12px" }}>
                    <div>
                      <div style={{ fontSize:"10px", fontWeight:700, color:"rgba(255,255,255,0.3)",
                        textTransform:"uppercase", letterSpacing:"0.14em", marginBottom:"4px" }}>
                        {card.icon} {card.l}
                      </div>
                      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"36px",
                        fontWeight:700, color:"white", lineHeight:1 }}>
                        <Counter to={card.v} decimals={card.l==="LCI Score"?4:card.l==="Attendance"?1:0}
                          suffix={card.l==="Attendance"?"%":""} />
                      </div>
                    </div>
                    <div style={{ fontSize:"28px", opacity:0.4 }}>{card.icon}</div>
                  </div>
                  <AnimBar value={card.pct} max={100} color={card.c} delay={400+i*100}/>
                  <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.25)", marginTop:"8px" }}>{card.sub}</div>
                </div>
              ))}
            </div>

            {/* Performance vs National Average */}
            <div style={{ background : `
radial-gradient(circle at 20% 10%, rgba(255,107,0,0.15), transparent 40%),
radial-gradient(circle at 80% 80%, rgba(96,165,250,0.12), transparent 40%),
linear-gradient(180deg,#020617,#030712)
`, borderRadius:"20px", padding:"28px 32px",
              border:"1px solid rgba(255,255,255,0.06)", ...fade(600) }}>
              <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"24px" }}>
                <div style={{ width:"18px", height:"2px", background:"#FF6B00", borderRadius:"1px" }}/>
                <h2 style={{ fontSize:"12px", fontWeight:700, color:"rgba(255,255,255,0.5)",
                  textTransform:"uppercase", letterSpacing:"0.15em", margin:0 }}>
                  Performance vs National Average
                </h2>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr auto auto auto", gap:"0", marginBottom:"20px" }}>
                {["Metric","MP Value","Nat. Avg","Diff"].map(h => (
                  <div key={h} style={{ fontSize:"9px", fontWeight:700, color:"rgba(255,255,255,0.2)",
                    textTransform:"uppercase", letterSpacing:"0.1em", padding:"0 0 12px 0",
                    borderBottom:"1px solid rgba(255,255,255,0.05)" }}>{h}</div>
                ))}
                {[
                  { l:"Attendance",  mpV:`${attPct.toFixed(1)}%`,  avg:`${(avgAtt*100).toFixed(1)}%`, diff:diffAtt,  color:attColor },
                  { l:"Questions",   mpV:String(q),                 avg:avgQ.toFixed(0),               diff:diffQ,    color:"#60A5FA" },
                  { l:"Debates",     mpV:String(deb),               avg:avgDeb.toFixed(0),             diff:diffDeb,  color:"#A78BFA" },
                  { l:"LCI Score",   mpV:lci.toFixed(4),            avg:"0.1202",                      diff:diffLCI,  color:grade.color },
                ].map((row,i) => (
                  <React.Fragment key={i}>
                    <div style={{ padding:"14px 0", borderBottom:"1px solid rgba(255,255,255,0.04)",
                      fontSize:"13px", color:"rgba(255,255,255,0.6)", fontWeight:500 }}>{row.l}</div>
                    <div style={{ padding:"14px 12px", borderBottom:"1px solid rgba(255,255,255,0.04)",
                      fontSize:"14px", fontWeight:700, color:"white", fontFamily:"'Cormorant Garamond',serif" }}>{row.mpV}</div>
                    <div style={{ padding:"14px 12px", borderBottom:"1px solid rgba(255,255,255,0.04)",
                      fontSize:"13px", color:"rgba(255,255,255,0.3)" }}>{row.avg}</div>
                    <div style={{ padding:"14px 0", borderBottom:"1px solid rgba(255,255,255,0.04)",
                      fontSize:"13px", fontWeight:800,
                      color:row.diff>=0?"#00C896":"#EF4444" }}>
                      {row.diff>=0?"+":""}{row.diff.toFixed(0)}%
                    </div>
                  </React.Fragment>
                ))}
              </div>

              <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                {[
                  { l:"Attendance",  val:attPct, max:100,  avg:avgAtt*100, c:attColor  },
                  { l:"Questions",   val:q,      max:350,  avg:avgQ,       c:"#60A5FA" },
                  { l:"Debates",     val:deb,    max:250,  avg:avgDeb,     c:"#A78BFA" },
                  { l:"LCI Score",   val:lci,    max:1,    avg:0.12,       c:grade.color },
                ].map((bar,i) => {
                  const avgPct = Math.min((bar.avg/(bar.max||1))*100, 100);
                  return (
                    <div key={i}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px" }}>
                        <span style={{ fontSize:"11px", color:"rgba(255,255,255,0.35)", fontWeight:600 }}>{bar.l}</span>
                        <span style={{ fontSize:"12px", fontWeight:700, color:bar.c, fontFamily:"'Cormorant Garamond',serif" }}>
                          {bar.l==="LCI Score"?bar.val.toFixed(4):bar.l==="Attendance"?`${bar.val.toFixed(1)}%`:Math.round(bar.val)}
                        </span>
                      </div>
                      <div style={{ position:"relative", height:"6px", background:"rgba(255,255,255,0.05)", borderRadius:"3px" }}>
                        <AnimBar value={bar.val} max={bar.max} color={bar.c} delay={700+i*100}/>
                        <div style={{ position:"absolute", top:"-4px", left:`${avgPct}%`, width:"2px", height:"14px",
                          background:"rgba(255,255,255,0.2)", borderRadius:"1px", transform:"translateX(-50%)" }}/>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"10px", marginTop:"20px" }}>
                {[
                  { l:"Attendance", diff:diffAtt  },
                  { l:"Questions",  diff:diffQ    },
                  { l:"Debates",    diff:diffDeb  },
                ].map((c,i) => (
                  <div key={i} style={{ padding:"14px", borderRadius:"12px",
                    background:c.diff>=0?"rgba(0,200,150,0.06)":"rgba(239,68,68,0.06)",
                    border:`1px solid ${c.diff>=0?"rgba(0,200,150,0.15)":"rgba(239,68,68,0.15)"}` }}>
                    <div style={{ fontSize:"9px", fontWeight:700, color:"rgba(255,255,255,0.3)",
                      textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"4px" }}>{c.l}</div>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"24px", fontWeight:700,
                      color:c.diff>=0?"#00C896":"#EF4444" }}>
                      {c.diff>=0?"+":""}{c.diff.toFixed(0)}%
                    </div>
                    <div style={{ fontSize:"9px", color:"rgba(255,255,255,0.2)", marginTop:"2px" }}>
                      {c.diff>=0?"above":"below"} avg
                    </div>
                  </div>
                ))}
              </div>
            </div>










            {/* ═══ CRIMINAL INTELLIGENCE ═══ */}

{criminal && (
<div style={{
background:"linear-gradient(135deg,#0F1A2E,#1a1220)",
borderRadius:"20px",
padding:"28px",
border:"1px solid rgba(239,68,68,0.3)",
boxShadow:"0 0 40px rgba(239,68,68,0.15)"
}}>

<div style={{
fontSize:"11px",
fontWeight:800,
color:"#EF4444",
letterSpacing:"0.15em",
textTransform:"uppercase",
marginBottom:"20px"
}}>
⚖ Criminal Records
</div>


{/* Top Metrics */}

<div style={{
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:"14px",
marginBottom:"20px"
}}>

{[
{label:"Total Cases",value:criminal.total_cases,color:"#EF4444"},
{label:"Serious Cases",value:criminal.serious_cases,color:"#FF6B00"},
{label:"Pending Cases",value:criminal.pending_cases?.length || 0,color:"#F59E0B"}
].map((m,i)=>(
<div key={i} style={{
padding:"16px",
borderRadius:"12px",
background:"rgba(239,68,68,0.05)",
border:"1px solid rgba(239,68,68,0.2)"
}}>
<div style={{
fontSize:"10px",
color:"rgba(255,255,255,0.4)",
textTransform:"uppercase"
}}>
{m.label}
</div>

<div style={{
fontFamily:"Cormorant Garamond",
fontSize:"36px",
fontWeight:700,
color:m.color
}}>
{m.value}
</div>

</div>
))}

</div>


{/* IPC SUMMARY */}

{criminal.ipc_summary?.length>0 && (

<div style={{marginBottom:"20px"}}>

<div style={{
fontSize:"10px",
color:"rgba(255,255,255,0.4)",
letterSpacing:"0.1em",
textTransform:"uppercase",
marginBottom:"10px"
}}>
IPC Sections
</div>

<div style={{
display:"flex",
flexWrap:"wrap",
gap:"8px"
}}>

{criminal.ipc_summary.slice(0,10).map((ipc:any,i:number)=>(
<div key={i} style={{
padding:"6px 12px",
borderRadius:"100px",
background:"rgba(255,255,255,0.04)",
border:"1px solid rgba(255,255,255,0.08)",
fontSize:"11px",
color:"rgba(255,255,255,0.7)"
}}>
IPC {ipc.ipc_section} • {ipc.count}
</div>
))}

</div>

</div>
)}


{/* Pending Cases */}

{criminal.pending_cases?.length>0 && (

<div>

<div style={{
fontSize:"10px",
color:"rgba(255,255,255,0.4)",
letterSpacing:"0.1em",
textTransform:"uppercase",
marginBottom:"10px"
}}>
Pending Cases
</div>

<div style={{
display:"flex",
flexDirection:"column",
gap:"10px"
}}>

{criminal.pending_cases.slice(0,3).map((c:any,i:number)=>(
<div key={i} style={{
padding:"12px",
borderRadius:"10px",
background:"rgba(255,255,255,0.03)",
border:"1px solid rgba(255,255,255,0.06)"
}}>

<div style={{
fontSize:"12px",
fontWeight:700,
color:"white"
}}>
Case {c.serial}
</div>

<div style={{
fontSize:"11px",
color:"rgba(255,255,255,0.5)"
}}>
{c.fir_no || c.case_no}
</div>

<div style={{
fontSize:"11px",
color:"#F59E0B"
}}>
IPC: {c.ipc_sections}
</div>

</div>
))}

</div>

</div>
)}


{/* Source */}

{criminal.source_url && (
<a
href={criminal.source_url}
target="_blank"
style={{
display:"inline-block",
marginTop:"18px",
fontSize:"12px",
fontWeight:700,
color:"#FF6B00",
textDecoration:"none"
}}
>
View Full Affidavit →
</a>
)}

</div>
)}


            {/* Data Insight */}
            <div style={{ background:"linear-gradient(135deg, #0F1A2E, #151F35)",
              borderRadius:"16px", padding:"24px 28px",
              border:"1px solid rgba(255,107,0,0.15)",
              borderLeft:"4px solid #FF6B00",
              ...fade(800) }}>
              <div style={{ fontSize:"10px", fontWeight:800, color:"#FF6B00",
                textTransform:"uppercase", letterSpacing:"0.14em", marginBottom:"10px" }}>
                💡 Data Insight
              </div>
              <p style={{ fontSize:"14px", color:"rgba(255,255,255,0.6)", lineHeight:1.8, margin:0 }}>
                {silent
                  ? `${mp.name} has recorded zero questions and zero debate participations — placing them among the least active MPs in the 18th Lok Sabha. This raises serious accountability concerns.`
                  : `${mp.name} ${diffQ>0?`asks ${diffQ.toFixed(0)}% more questions`:`asks fewer questions`} than the national average${diffDeb>50?` and participates in debates ${diffDeb.toFixed(0)}% more frequently than peers`:""}.${lci>0.5?" Their LCI score places them in the top tier of parliamentary performers.":lci<0.2?" Their overall performance score is below the national average.":""}`
                }
              </p>
            </div>

            {silent && (
              <div style={{ background:"rgba(239,68,68,0.06)", borderRadius:"16px", padding:"22px 26px",
                border:"1.5px solid rgba(239,68,68,0.2)", borderLeft:"5px solid #EF4444", ...fade(900) }}>
                <div style={{ fontSize:"11px", fontWeight:800, color:"#EF4444",
                  textTransform:"uppercase", letterSpacing:"0.14em", marginBottom:"8px" }}>⚠ Silent MP Flagged</div>
                <p style={{ fontSize:"14px", color:"rgba(239,68,68,0.7)", lineHeight:1.7, margin:0 }}>
                  This MP has recorded <strong style={{color:"#EF4444"}}>zero questions</strong> and <strong style={{color:"#EF4444"}}>zero debate participations</strong> in the 18th Lok Sabha.
                </p>
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>

            <div style={{ background:"#0F1A2E", borderRadius:"20px", padding:"24px",
              border:"1px solid rgba(255,255,255,0.06)", ...fade(500) }}>
              <div style={{ fontSize:"10px", fontWeight:700, color:"rgba(255,255,255,0.3)",
                textTransform:"uppercase", letterSpacing:"0.14em", marginBottom:"16px" }}>
                Performance Overview
              </div>
              <div style={{ display:"flex", justifyContent:"center" }}>
                <RadarChart mp={mp} avgAtt={avgAtt} avgQ={avgQ} avgDeb={avgDeb}/>
              </div>
              <div style={{ display:"flex", gap:"16px", justifyContent:"center", marginTop:"8px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"5px" }}>
                  <div style={{ width:"10px", height:"2px", background:"#FF6B00" }}/>
                  <span style={{ fontSize:"10px", color:"rgba(255,255,255,0.3)" }}>This MP</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:"5px" }}>
                  <div style={{ width:"10px", height:"2px", background:"rgba(96,165,250,0.5)", borderTop:"1px dashed rgba(96,165,250,0.5)" }}/>
                  <span style={{ fontSize:"10px", color:"rgba(255,255,255,0.3)" }}>National Avg</span>
                </div>
              </div>
            </div>

            <div style={{ background:"rgba(255,255,255,0.02)", backdropFilter:"blur(20px)",
              borderRadius:"18px", padding:"22px 24px",
              border:"1px solid rgba(255,255,255,0.06)",
              boxShadow:"0 8px 32px rgba(0,0,0,0.3)",
              ...fade(600) }}>
              <div style={{ fontSize:"10px", fontWeight:700, color:"rgba(255,255,255,0.25)",
                textTransform:"uppercase", letterSpacing:"0.14em", marginBottom:"16px" }}>Rankings</div>
              {[
                { l:"National Rank", v:`#${Math.round(mp.national_rank??0)}`, c:"#FF6B00" },
                { l:"State Rank",    v:`#${Math.round(mp.state_rank??0)}`,    c:"#60A5FA" },
                { l:"Party Rank",    v:`#${Math.round(mp.party_rank??0)}`,    c:"#34D399" },
                { l:"Percentile",    v:`${(mp.percentile??0).toFixed(1)}th`,  c:"#A78BFA" },
              ].map((r,i,arr) => (
                <div key={r.l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                  padding:"12px 0", borderBottom:i<arr.length-1?"1px solid rgba(255,255,255,0.04)":"none" }}>
                  <span style={{ fontSize:"12px", color:"rgba(255,255,255,0.35)", fontWeight:500 }}>{r.l}</span>
                  <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"22px",
                    fontWeight:700, color:r.c }}>{r.v}</span>
                </div>
              ))}
            </div>

            <div style={{ background:"#0F1A2E", borderRadius:"16px", padding:"20px 22px",
              border:"1px solid rgba(255,255,255,0.06)", ...fade(700) }}>
              <div style={{ fontSize:"10px", fontWeight:700, color:"rgba(255,255,255,0.25)",
                textTransform:"uppercase", letterSpacing:"0.14em", marginBottom:"14px" }}>Details</div>
              {[
                { icon:"◉", l:"Constituency", v:mp.constituency },
                { icon:"▲", l:"State",        v:mp.state        },
                { icon:"◈", l:"Party",        v:mp.party        },
                { icon:"◆", l:"Session",      v:"18th Lok Sabha"},
                { icon:"⚡", l:"Engagement",  v:eng?String(eng):null },
              ].filter(x=>x.v).map((x,i,arr) => (
                <div key={x.l} style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start",
                  padding:"10px 0", borderBottom:i<arr.length-1?"1px solid rgba(255,255,255,0.04)":"none", gap:"12px" }}>
                  <div style={{ display:"flex", gap:"7px", alignItems:"center" }}>
                    <span style={{ fontSize:"10px", color:"rgba(255,255,255,0.15)" }}>{x.icon}</span>
                    <span style={{ fontSize:"11px", color:"rgba(255,255,255,0.3)", fontWeight:600 }}>{x.l}</span>
                  </div>
                  <span style={{ fontSize:"12px", color:"rgba(255,255,255,0.65)", fontWeight:600, textAlign:"right" }}>{x.v}</span>
                </div>
              ))}
            </div>

            <div style={{ padding:"14px 16px", background:"rgba(245,158,11,0.05)",
              borderRadius:"12px", border:"1px solid rgba(245,158,11,0.15)", ...fade(800) }}>
              <div style={{ fontSize:"9px", fontWeight:800, color:"rgba(245,158,11,0.6)",
                textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:"5px" }}>Data Source</div>
              <p style={{ fontSize:"11px", color:"rgba(255,255,255,0.25)", lineHeight:1.6, margin:0 }}>
                PRS Legislative Research · Lok Sabha Official Records · Zero editorial bias.
              </p>
            </div>

            <Link href="/mp" style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"6px",
              padding:"13px", background:"rgba(255,107,0,0.1)", borderRadius:"12px", textDecoration:"none",
              fontSize:"12px", fontWeight:700, color:"#FF6B00",
              border:"1px solid rgba(255,107,0,0.2)",
              transition:"all 0.2s", ...fade(900) }}>
              ← Back to All MPs
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;0,900;1,400&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        *, *::before, *::after { box-sizing: border-box; }
      `}</style>
    </div>
  );
}