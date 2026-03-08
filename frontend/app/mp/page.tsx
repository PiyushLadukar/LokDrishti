"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { getNationalRankings } from "@/lib/api";

/* ─── helpers ─────────────────────────────────────────────── */
const getLCI        = (m: any) => m.LCI_score  ?? 0;
const getAttendance = (m: any) => m.attendance ?? 0;
const getQuestions  = (m: any) => m.questions  ?? 0;
const getDebates    = (m: any) => m.debates    ?? 0;
const isSilent      = (m: any) => m.silent_flag === 1;

function grade(lci: number) {
  if (lci >= 0.75) return { g:"A", label:"Excellent",   color:"#166534", bg:"#DCFCE7", border:"#86EFAC" };
  if (lci >= 0.5)  return { g:"B", label:"Good",        color:"#1E40AF", bg:"#DBEAFE", border:"#93C5FD" };
  if (lci >= 0.25) return { g:"C", label:"Average",     color:"#92400E", bg:"#FEF3C7", border:"#FCD34D" };
  if (lci >= 0.1)  return { g:"D", label:"Below Avg",   color:"#C2410C", bg:"#FFEDD5", border:"#FCA5A5" };
  return              { g:"F", label:"Poor",         color:"#991B1B", bg:"#FEE2E2", border:"#FCA5A5" };
}

function insights(mp: any, avgAtt: number, avgQ: number, avgDeb: number) {
  const tips: { icon: string; text: string; type: "good"|"warn"|"info" }[] = [];
  const att = getAttendance(mp); const q = getQuestions(mp); const deb = getDebates(mp);
  if (att >= 0.95)         tips.push({ icon:"⭐", text:"Top Attender",       type:"good" });
  if (q > avgQ * 2)        tips.push({ icon:"💬", text:"Top 10% Speaker",    type:"good" });
  if (deb > avgDeb * 2)    tips.push({ icon:"🎤", text:"Active Debater",     type:"good" });
  if (att < 0.5)           tips.push({ icon:"⚠️", text:"Low Attendance",     type:"warn" });
  if (isSilent(mp))        tips.push({ icon:"🔇", text:"Never Spoke",        type:"warn" });
  if (att >= avgAtt && q >= avgQ) tips.push({ icon:"📊", text:"Above Average",   type:"info" });
  return tips.slice(0, 2);
}

/* ─── Photo ────────────────────────────────────────────────── */
function Photo({ name, url, size=48 }: { name:string; url?:string; size?:number }) {
  const [err, setErr] = useState(false);
  const words = (name||"?").trim().split(/\s+/);
  const ini   = words.length>=2 ? (words[0][0]+words[words.length-1][0]).toUpperCase() : words[0].slice(0,2).toUpperCase();
  const hues  = [220,160,30,270,190,350];
  const hue   = hues[ini.charCodeAt(0) % hues.length];
  if (url && !err) return (
    <div style={{ width:size, height:size, borderRadius:"50%", overflow:"hidden", flexShrink:0, border:"2px solid #E2E8F0" }}>
      <img src={`/api/proxy-image?url=${encodeURIComponent(url)}`} alt={name} onError={()=>setErr(true)} style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top" }}/>
    </div>
  );
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", flexShrink:0, background:`hsl(${hue},60%,92%)`, border:`2px solid hsl(${hue},40%,80%)`,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:"'Crimson Pro',Georgia,serif", fontSize:size*0.37, fontWeight:700, color:`hsl(${hue},50%,35%)` }}>
      {ini}
    </div>
  );
}

/* ─── Progress bar ─────────────────────────────────────────── */
function Bar({ value, max, avg, color }: { value:number; max:number; avg:number; color:string }) {
  const pct    = Math.min((value/(max||1))*100, 100);
  const avgPct = Math.min((avg  /(max||1))*100, 100);
  return (
    <div style={{ position:"relative", height:"6px", background:"#F1F5F9", borderRadius:"3px", flex:1 }}>
      <div style={{ position:"absolute", top:0, left:0, height:"100%", width:`${pct}%`, background:color, borderRadius:"3px", transition:"width 0.6s ease" }}/>
      <div style={{ position:"absolute", top:"-4px", left:`${avgPct}%`, width:"2px", height:"14px", background:"#94A3B8", borderRadius:"1px", transform:"translateX(-50%)" }}/>
    </div>
  );
}

/* ─── MP Card ──────────────────────────────────────────────── */
function MPCard({ mp, maxQ, maxDeb, avgAtt, avgQ, avgDeb, photos, onCompare, compareList }:any) {
  const [hov, setHov] = useState(false);
  const lci    = getLCI(mp);
  const att    = getAttendance(mp);
  const q      = getQuestions(mp);
  const deb    = getDebates(mp);
  const g      = grade(lci);
  const attPct = att * 100;
  const attC   = attPct>=75?"#16A34A":attPct>=50?"#D97706":"#DC2626";
  const chips  = insights(mp, avgAtt, avgQ, avgDeb);
  const inCompare = compareList.includes(mp.name);

  return (
    <div style={{ position:"relative" }}>
      {/* Compare toggle */}
      <button onClick={()=>onCompare(mp.name)} style={{
        position:"absolute", top:10, right:10, zIndex:2,
        width:22, height:22, borderRadius:"50%", border:`2px solid ${inCompare?"#1E3A8A":"#CBD5E1"}`,
        background:inCompare?"#1E3A8A":"white", cursor:"pointer",
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:"10px", color:inCompare?"white":"#94A3B8", transition:"all 0.15s",
      }} title="Add to compare">
        {inCompare ? "✓" : "+"}
      </button>

      <Link href={`/mp/${encodeURIComponent(mp.name)}`} style={{ textDecoration:"none" }}>
        <article onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{
          background:"white", borderRadius:"16px",
          border:`1.5px solid ${hov?"#BFDBFE":"#E2E8F0"}`,
          padding:"20px", cursor:"pointer",
          transition:"all 0.2s ease",
          boxShadow: hov?"0 12px 36px rgba(30,58,138,0.1)":"0 1px 4px rgba(0,0,0,0.05)",
          transform: hov?"translateY(-4px)":"none",
          display:"flex", flexDirection:"column", gap:"14px",
        }}>

          {/* Header */}
          <div style={{ display:"flex", gap:"12px", alignItems:"flex-start" }}>
            <Photo name={mp.name} url={photos[mp.name]} size={52}/>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:"14px", fontWeight:700, color:"#0F172A", lineHeight:1.2,
                overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{mp.name}</div>
              <div style={{ fontSize:"11px", color:"#64748B", marginTop:"3px",
                overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {mp.constituency}
              </div>
              <div style={{ display:"flex", gap:"4px", marginTop:"5px", flexWrap:"wrap" }}>
                {mp.state && (
                  <span style={{ fontSize:"9px", background:"#EFF6FF", color:"#1E40AF", borderRadius:"4px",
                    padding:"2px 7px", fontWeight:700, border:"1px solid #BFDBFE" }}>{mp.state}</span>
                )}
                {mp.party && (
                  <span style={{ fontSize:"9px", background:"#F8FAFC", color:"#475569", borderRadius:"4px",
                    padding:"2px 7px", fontWeight:600, border:"1px solid #E2E8F0",
                    maxWidth:"130px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{mp.party}</span>
                )}
              </div>
            </div>
            {/* Grade badge */}
            <div style={{ width:36, height:36, borderRadius:"10px", flexShrink:0,
              background:g.bg, border:`2px solid ${g.border}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontFamily:"'Crimson Pro',Georgia,serif", fontSize:"18px", fontWeight:800, color:g.color }}>
              {g.g}
            </div>
          </div>

          {/* Insight chips */}
          {chips.length > 0 && (
            <div style={{ display:"flex", gap:"4px", flexWrap:"wrap" }}>
              {chips.map((c,i) => (
                <span key={i} style={{
                  fontSize:"9px", fontWeight:700, borderRadius:"100px", padding:"2px 8px",
                  background: c.type==="good"?"#DCFCE7":c.type==="warn"?"#FEF3C7":"#EFF6FF",
                  color:       c.type==="good"?"#166534":c.type==="warn"?"#92400E":"#1E40AF",
                  border:`1px solid ${c.type==="good"?"#86EFAC":c.type==="warn"?"#FCD34D":"#BFDBFE"}`,
                }}>{c.icon} {c.text}</span>
              ))}
            </div>
          )}

          <div style={{ height:"1px", background:"#F1F5F9" }}/>

          {/* Attendance */}
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px" }}>
              <span style={{ fontSize:"11px", color:"#64748B", fontWeight:600 }}>📅 Attendance</span>
              <span style={{ fontSize:"13px", fontWeight:800, color:attC }}>{attPct.toFixed(0)}%</span>
            </div>
            <Bar value={att} max={1} avg={avgAtt} color={attC}/>
          </div>

          {/* Questions */}
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px" }}>
              <span style={{ fontSize:"11px", color:"#64748B", fontWeight:600 }}>💬 Questions Asked</span>
              <span style={{ fontSize:"13px", fontWeight:800, color:"#1E40AF" }}>{q}</span>
            </div>
            <Bar value={q} max={maxQ} avg={avgQ} color="#3B82F6"/>
          </div>

          {/* Debates */}
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px" }}>
              <span style={{ fontSize:"11px", color:"#64748B", fontWeight:600 }}>🎤 Debate Participations</span>
              <span style={{ fontSize:"13px", fontWeight:800, color:"#7C3AED" }}>{deb}</span>
            </div>
            <Bar value={deb} max={maxDeb} avg={avgDeb} color="#8B5CF6"/>
          </div>

          <div style={{ height:"1px", background:"#F1F5F9" }}/>

          {/* Footer */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ display:"flex", gap:"16px" }}>
              <div>
                <div style={{ fontSize:"9px", color:"#94A3B8", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em" }}>Performance Score</div>
                <div style={{ fontSize:"15px", fontWeight:700, color:g.color, fontFamily:"'Crimson Pro',Georgia,serif" }}>{lci.toFixed(3)}</div>
              </div>
              {mp.national_rank && (
                <div>
                  <div style={{ fontSize:"9px", color:"#94A3B8", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em" }}>National Rank</div>
                  <div style={{ fontSize:"15px", fontWeight:700, color:"#334155", fontFamily:"'Crimson Pro',Georgia,serif" }}>#{Math.round(mp.national_rank)}</div>
                </div>
              )}
            </div>
            <div style={{ padding:"6px 14px", background:hov?"#1E3A8A":"#EFF6FF", color:hov?"white":"#1E3A8A",
              borderRadius:"100px", fontSize:"11px", fontWeight:700, border:"1.5px solid #BFDBFE", transition:"all 0.2s" }}>
              View Profile →
            </div>
          </div>
        </article>
      </Link>
    </div>
  );
}

/* ─── Compare Modal ────────────────────────────────────────── */
function CompareModal({ list, mps, onClose }: { list:string[]; mps:any[]; onClose:()=>void }) {
  const a = mps.find(m=>m.name===list[0]);
  const b = mps.find(m=>m.name===list[1]);
  if (!a||!b) return null;
  const rows = [
    { label:"Attendance",        va:`${(getAttendance(a)*100).toFixed(0)}%`, vb:`${(getAttendance(b)*100).toFixed(0)}%`, na:getAttendance(a), nb:getAttendance(b) },
    { label:"Questions Asked",   va:String(getQuestions(a)),  vb:String(getQuestions(b)),  na:getQuestions(a),  nb:getQuestions(b)  },
    { label:"Debates",           va:String(getDebates(a)),    vb:String(getDebates(b)),    na:getDebates(a),    nb:getDebates(b)    },
    { label:"LCI Score",         va:getLCI(a).toFixed(4),     vb:getLCI(b).toFixed(4),     na:getLCI(a),        nb:getLCI(b)        },
    { label:"National Rank",     va:`#${Math.round(a.national_rank??0)}`, vb:`#${Math.round(b.national_rank??0)}`, na:-(a.national_rank??999), nb:-(b.national_rank??999) },
    { label:"Grade",             va:grade(getLCI(a)).g,       vb:grade(getLCI(b)).g,       na:getLCI(a),        nb:getLCI(b)        },
  ];
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.7)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(4px)" }}
      onClick={onClose}>
      <div style={{ background:"white", borderRadius:"20px", padding:"32px", width:"min(680px,95vw)", maxHeight:"90vh", overflowY:"auto" }}
        onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px" }}>
          <h2 style={{ fontSize:"20px", fontWeight:800, color:"#0F172A", fontFamily:"'Crimson Pro',Georgia,serif" }}>MP Comparison</h2>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:"20px", cursor:"pointer", color:"#94A3B8" }}>✕</button>
        </div>
        {/* Names */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 48px 1fr", gap:"12px", alignItems:"center", marginBottom:"28px" }}>
          {[a,b].map((mp,i) => (
            <div key={i} style={{ textAlign:i===0?"left":"right" }}>
              <div style={{ fontSize:"16px", fontWeight:800, color:"#0F172A" }}>{mp.name}</div>
              <div style={{ fontSize:"11px", color:"#64748B" }}>{mp.party}</div>
              <div style={{ display:"inline-block", padding:"3px 10px", background:grade(getLCI(mp)).bg, color:grade(getLCI(mp)).color,
                borderRadius:"6px", fontSize:"14px", fontWeight:800, marginTop:"6px", fontFamily:"'Crimson Pro',serif" }}>
                Grade {grade(getLCI(mp)).g}
              </div>
            </div>
          ))}
          <div style={{ textAlign:"center", fontSize:"18px", color:"#94A3B8", fontWeight:700 }}>vs</div>
        </div>
        {/* Rows */}
        {rows.map(r => {
          const aWins = r.na >= r.nb;
          return (
            <div key={r.label} style={{ display:"grid", gridTemplateColumns:"1fr 120px 1fr", gap:"8px", alignItems:"center", padding:"10px 0", borderBottom:"1px solid #F1F5F9" }}>
              <div style={{ fontSize:"13px", fontWeight:800, color:aWins?"#16A34A":"#64748B",
                padding:"6px 12px", background:aWins?"#F0FDF4":"transparent", borderRadius:"8px", textAlign:"center" }}>{r.va}</div>
              <div style={{ fontSize:"10px", color:"#94A3B8", fontWeight:700, textAlign:"center", textTransform:"uppercase", letterSpacing:"0.1em" }}>{r.label}</div>
              <div style={{ fontSize:"13px", fontWeight:800, color:!aWins?"#16A34A":"#64748B",
                padding:"6px 12px", background:!aWins?"#F0FDF4":"transparent", borderRadius:"8px", textAlign:"center" }}>{r.vb}</div>
            </div>
          );
        })}
        <p style={{ fontSize:"10px", color:"#94A3B8", marginTop:"16px", textAlign:"center" }}>Green = better performer on that metric</p>
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
    setRes(mps.filter(m => m.constituency?.toLowerCase().includes(sq) || m.name?.toLowerCase().includes(sq)).slice(0,4));
  }, [q, mps]);
  return (
    <div style={{ background:"white", borderRadius:"16px", padding:"24px", border:"1.5px solid #E2E8F0", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
      <div style={{ fontSize:"13px", fontWeight:800, color:"#0F172A", marginBottom:"4px" }}>🗺 Find Your Constituency</div>
      <div style={{ fontSize:"11px", color:"#64748B", marginBottom:"14px" }}>Enter your area or MP name to find your representative</div>
      <div style={{ position:"relative" }}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="e.g. Nagpur, Lucknow, Rahul Gandhi…"
          style={{ width:"100%", padding:"10px 14px", border:"1.5px solid #E2E8F0", borderRadius:"10px", fontSize:"13px",
            fontFamily:"'DM Sans',sans-serif", outline:"none", boxSizing:"border-box" as any, color:"#0F172A" }}/>
      </div>
      {res.length > 0 && (
        <div style={{ marginTop:"10px", display:"flex", flexDirection:"column", gap:"8px" }}>
          {res.map(mp => {
            const g = grade(getLCI(mp));
            return (
              <Link key={mp.name} href={`/mp/${encodeURIComponent(mp.name)}`} style={{ textDecoration:"none" }}>
                <div style={{ display:"flex", gap:"12px", alignItems:"center", padding:"10px 12px", background:"#F8FAFC",
                  borderRadius:"10px", border:"1px solid #E2E8F0", cursor:"pointer" }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:"13px", fontWeight:700, color:"#0F172A" }}>{mp.name}</div>
                    <div style={{ fontSize:"10px", color:"#64748B" }}>{mp.constituency} · {mp.party}</div>
                    <div style={{ display:"flex", gap:"10px", marginTop:"4px" }}>
                      <span style={{ fontSize:"10px", color:"#16A34A", fontWeight:700 }}>📅 {(getAttendance(mp)*100).toFixed(0)}%</span>
                      <span style={{ fontSize:"10px", color:"#1E40AF", fontWeight:700 }}>💬 {getQuestions(mp)} Qs</span>
                      <span style={{ fontSize:"10px", color:"#7C3AED", fontWeight:700 }}>🎤 {getDebates(mp)} Debs</span>
                    </div>
                  </div>
                  <div style={{ width:32, height:32, borderRadius:"8px", background:g.bg, border:`1.5px solid ${g.border}`,
                    display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Crimson Pro',serif",
                    fontSize:"16px", fontWeight:800, color:g.color }}>{g.g}</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Understand Parliament ────────────────────────────────── */
function UnderstandSection() {
  const items = [
    { icon:"📅", title:"What is Attendance?", desc:"The percentage of Parliament sessions an MP physically attended. Higher attendance means the MP is present to vote, debate and represent their constituency.", color:"#DCFCE7", border:"#86EFAC", tc:"#166534" },
    { icon:"💬", title:"What are Questions?", desc:"MPs can submit written or oral questions to hold the government accountable. More questions = more active oversight of government actions.", color:"#DBEAFE", border:"#93C5FD", tc:"#1E40AF" },
    { icon:"🎤", title:"What are Debates?", desc:"MPs participate in discussions on bills, budgets and national issues. Debate participation reflects how actively an MP voices opinions in Parliament.", color:"#F3E8FF", border:"#C4B5FD", tc:"#5B21B6" },
    { icon:"📊", title:"What is LCI Score?", desc:"The Lok Sabha Civic Index combines attendance, questions and debates into one score (0–1). It's a neutral, data-driven measure of parliamentary activity.", color:"#FEF3C7", border:"#FCD34D", tc:"#92400E" },
  ];
  return (
    <div style={{ background:"#F8FAFC", borderRadius:"20px", padding:"32px", border:"1px solid #E2E8F0", marginTop:"48px" }}>
      <div style={{ textAlign:"center", marginBottom:"28px" }}>
        <div style={{ fontSize:"11px", fontWeight:800, color:"#1E3A8A", textTransform:"uppercase", letterSpacing:"0.18em", marginBottom:"8px" }}>Understand Parliament</div>
        <div style={{ fontFamily:"'Crimson Pro',Georgia,serif", fontSize:"26px", fontWeight:700, color:"#0F172A" }}>What do these metrics mean?</div>
        <div style={{ fontSize:"13px", color:"#64748B", marginTop:"6px" }}>Plain English explanations for every data point</div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:"14px" }}>
        {items.map(it => (
          <div key={it.title} style={{ background:"white", borderRadius:"14px", padding:"20px", border:`1.5px solid ${it.border}` }}>
            <div style={{ fontSize:"24px", marginBottom:"8px" }}>{it.icon}</div>
            <div style={{ fontSize:"13px", fontWeight:800, color:it.tc, marginBottom:"8px" }}>{it.title}</div>
            <div style={{ fontSize:"12px", color:"#475569", lineHeight:1.7 }}>{it.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Page ────────────────────────────────────────────── */
export default function MPsPage() {
  const [mps,       setMps]       = useState<any[]>([]);
  const [photos,    setPhotos]    = useState<Record<string,string>>({});
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [stateF,    setStateF]    = useState("All");
  const [partyF,    setPartyF]    = useState("All");
  const [gradeF,    setGradeF]    = useState("All");
  const [attMin,    setAttMin]    = useState(0);
  const [silentF,   setSilentF]   = useState(false);
  const [sortBy,    setSortBy]    = useState<"rank"|"attendance"|"questions"|"debates"|"lci">("rank");
  const [page,      setPage]      = useState(1);
  const [showPanel, setShowPanel] = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [recentSearch, setRecentSearch] = useState<string[]>([]);
  const PER = 24;

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
  const photosN = Object.keys(photos).length;
  const silentCount = mps.filter(m=>isSilent(m)).length;
  const lowAttCount = mps.filter(m=>getAttendance(m)<0.5).length;

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
    setCompareList(prev => {
      if (prev.includes(name)) return prev.filter(n=>n!==name);
      if (prev.length>=2) return [prev[1], name];
      return [...prev, name];
    });
  }

  function handleSearch(val:string) {
    setSearch(val);
    setPage(1);
    if (val.trim() && !recentSearch.includes(val.trim())) {
      setRecentSearch(prev=>[val.trim(),...prev].slice(0,5));
    }
  }

  const inp: any = { padding:"10px 14px", border:"1.5px solid #E2E8F0", borderRadius:"10px",
    fontSize:"12px", color:"#0F172A", fontFamily:"'DM Sans',sans-serif", outline:"none", background:"white", cursor:"pointer" };

  return (
    <div style={{ minHeight:"100vh", fontFamily:"'DM Sans',sans-serif", background:"#F8FAFC" }}>

      {/* ══ HERO ══ */}
      <div style={{ background:"linear-gradient(135deg, #0F172A 0%, #1E3A8A 60%, #1E40AF 100%)", position:"relative", overflow:"hidden" }}>
        {/* Dot grid */}
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(255,255,255,0.06) 1px,transparent 1px)", backgroundSize:"24px 24px", pointerEvents:"none" }}/>
        {/* Bottom fade */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"60px", background:"linear-gradient(transparent,rgba(15,23,42,0.3))", pointerEvents:"none" }}/>

        <div style={{ maxWidth:"1280px", margin:"0 auto", padding:"56px 40px 48px", position:"relative", zIndex:1 }}>
          {/* Eyebrow */}
          <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"20px" }}>
            <div style={{ width:"20px", height:"2px", background:"#F59E0B", borderRadius:"1px" }}/>
            <span style={{ fontSize:"10px", fontWeight:800, color:"#F59E0B", textTransform:"uppercase", letterSpacing:"0.24em" }}>
              18th Lok Sabha  ·  MP Directory
            </span>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:"48px", alignItems:"start", flexWrap:"wrap" }}>
            <div>
              <h1 style={{ fontFamily:"'Crimson Pro',Georgia,serif", fontSize:"clamp(36px,5.5vw,68px)", fontWeight:700,
                color:"white", lineHeight:1.05, letterSpacing:"-1.5px", marginBottom:"16px" }}>
                Explore Your<br/>
                <span style={{ color:"#F59E0B" }}>Members of Parliament</span>
              </h1>
              <p style={{ fontSize:"14px", color:"rgba(255,255,255,0.55)", lineHeight:1.9, maxWidth:"520px", marginBottom:"28px" }}>
                Track attendance, questions asked, debates participated, and overall performance of all <strong style={{ color:"white" }}>544 MPs</strong> of the 18th Lok Sabha. Understand how they work, speak, and represent you.
              </p>
              {photosN > 0 && (
                <div style={{ display:"inline-flex", alignItems:"center", gap:"6px", padding:"5px 14px",
                  background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.2)", borderRadius:"100px" }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:"#22C55E" }}/>
                  <span style={{ fontSize:"10px", color:"#22C55E", fontWeight:700 }}>{photosN} MP photos loaded from Wikipedia</span>
                </div>
              )}
            </div>

            {/* Stat cards */}
            {!loading && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", minWidth:"280px" }}>
                {[
                  { n:String(mps.length),          label:"Members in Parliament",   color:"#60A5FA", bg:"rgba(96,165,250,0.1)"  },
                  { n:`${(avgAtt*100).toFixed(0)}%`, label:"Average Attendance",   color:"#34D399", bg:"rgba(52,211,153,0.1)"  },
                  { n:String(silentCount),           label:"Low Participation MPs", color:"#F87171", bg:"rgba(248,113,113,0.1)" },
                  { n:avgQ.toFixed(0),               label:"Avg Questions Asked",  color:"#FBBF24", bg:"rgba(251,191,36,0.1)"  },
                ].map(s=>(
                  <div key={s.label} style={{ padding:"16px", borderRadius:"14px", background:s.bg,
                    border:`1px solid ${s.color}25`, backdropFilter:"blur(8px)" }}>
                    <div style={{ fontFamily:"'Crimson Pro',Georgia,serif", fontSize:"30px", fontWeight:700, color:s.color, lineHeight:1 }}>{s.n}</div>
                    <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.45)", marginTop:"5px", lineHeight:1.4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══ STICKY CONTROLS ══ */}
      <div style={{ background:"white", borderBottom:"1px solid #E2E8F0", position:"sticky", top:"62px", zIndex:40, boxShadow:"0 1px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth:"1280px", margin:"0 auto", padding:"0 40px" }}>

          {/* Sort tabs */}
          <div style={{ display:"flex", gap:"0", borderBottom:"1px solid #F1F5F9" }}>
            {(["rank","attendance","lci","questions","debates"] as const).map(key=>{
              const labels:Record<string,string>={rank:"By Rank",attendance:"Attendance",lci:"LCI Score",questions:"Questions",debates:"Debates"};
              const on = sortBy===key;
              return (
                <button key={key} onClick={()=>{setSortBy(key);setPage(1);}} style={{
                  padding:"12px 18px", background:"none", border:"none",
                  borderBottom: on?"2px solid #1E3A8A":"2px solid transparent",
                  cursor:"pointer", fontSize:"12px", fontWeight:on?700:500,
                  color: on?"#1E3A8A":"#64748B", fontFamily:"'DM Sans',sans-serif",
                  transition:"all 0.15s", marginBottom:"-1px",
                }}>{labels[key]}</button>
              );
            })}
            {/* Compare button */}
            {compareList.length>0 && (
              <button onClick={()=>compareList.length===2&&setShowCompare(true)} style={{
                marginLeft:"auto", padding:"8px 16px", background:compareList.length===2?"#1E3A8A":"#EFF6FF",
                border:"none", borderRadius:"8px", cursor:compareList.length===2?"pointer":"default",
                fontSize:"11px", fontWeight:700, color:compareList.length===2?"white":"#1E40AF",
                fontFamily:"'DM Sans',sans-serif", alignSelf:"center",
              }}>
                {compareList.length===2 ? "⚡ Compare Now" : `Select ${2-compareList.length} more to compare`}
              </button>
            )}
          </div>

          {/* Search + Filters */}
          <div style={{ display:"flex", gap:"8px", padding:"10px 0", flexWrap:"wrap", alignItems:"center" }}>
            <div style={{ position:"relative", flex:"1 1 220px" }}>
              <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:"14px" }}>🔍</span>
              <input value={search} onChange={e=>handleSearch(e.target.value)}
                placeholder="Search your MP — name, constituency, state, party…"
                style={{ ...inp, paddingLeft:"36px", width:"100%", boxSizing:"border-box" as any }}/>
              {/* Recent searches */}
              {recentSearch.length>0 && !search && (
                <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, right:0, background:"white",
                  border:"1px solid #E2E8F0", borderRadius:"10px", padding:"8px", zIndex:50, boxShadow:"0 8px 24px rgba(0,0,0,0.1)" }}>
                  <div style={{ fontSize:"9px", color:"#94A3B8", fontWeight:700, marginBottom:"6px", paddingLeft:"4px", textTransform:"uppercase", letterSpacing:"0.1em" }}>Recent Searches</div>
                  {recentSearch.map(s=>(
                    <div key={s} onClick={()=>handleSearch(s)} style={{ padding:"6px 8px", fontSize:"12px", color:"#334155", cursor:"pointer", borderRadius:"6px" }}
                      onMouseEnter={e=>(e.currentTarget.style.background="#F8FAFC")}
                      onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                      🕐 {s}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <select value={stateF} onChange={e=>{setStateF(e.target.value);setPage(1);}} style={inp}>
              {states.slice(0,40).map(s=><option key={s}>{s}</option>)}
            </select>
            <select value={partyF} onChange={e=>{setPartyF(e.target.value);setPage(1);}} style={inp}>
              {parties.slice(0,50).map(p=><option key={p}>{p}</option>)}
            </select>
            <select value={gradeF} onChange={e=>{setGradeF(e.target.value);setPage(1);}} style={inp}>
              {["All","A","B","C","D","F"].map(g=><option key={g} value={g}>{g==="All"?"All Grades":`Grade ${g}`}</option>)}
            </select>

            {/* Attendance range */}
            <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
              <span style={{ fontSize:"10px", color:"#64748B", fontWeight:600, whiteSpace:"nowrap" }}>Att ≥</span>
              <select value={attMin} onChange={e=>{setAttMin(Number(e.target.value));setPage(1);}} style={inp}>
                {[0,50,60,70,80,90,95].map(v=><option key={v} value={v}>{v===0?"Any":`${v}%`}</option>)}
              </select>
            </div>

            {/* Filters toggle */}
            <button onClick={()=>setShowPanel(p=>!p)} style={{ ...inp, background:showPanel?"#EFF6FF":"white",
              border:showPanel?"1.5px solid #BFDBFE":"1.5px solid #E2E8F0", color:showPanel?"#1E40AF":"#64748B",
              fontWeight:700, display:"flex", alignItems:"center", gap:"5px" }}>
              ⚙ Filters {(silentF)?<span style={{ background:"#1E3A8A", color:"white", borderRadius:"100px", padding:"0 5px", fontSize:"9px" }}>1</span>:null}
            </button>

            <button onClick={()=>{setSilentF(p=>!p);setPage(1);}} style={{ ...inp, cursor:"pointer",
              background:silentF?"#FEF2F2":"white", border:silentF?"1.5px solid #FCA5A5":"1.5px solid #E2E8F0",
              color:silentF?"#DC2626":"#64748B", fontWeight:700, display:"flex", alignItems:"center", gap:"5px" }}>
              <span style={{ width:5, height:5, borderRadius:"50%", background:silentF?"#DC2626":"#D1D5DB",
                ...(silentF?{animation:"blink 1.2s infinite"}:{}) }}/>
              Silent MPs
            </button>

            <span style={{ marginLeft:"auto", fontSize:"11px", color:"#94A3B8", fontWeight:600, whiteSpace:"nowrap" }}>
              {filtered.length} / {mps.length} MPs
            </span>
          </div>

          {/* Extended filter panel */}
          {showPanel && (
            <div style={{ padding:"14px 0 18px", borderTop:"1px solid #F1F5F9", display:"flex", gap:"12px", flexWrap:"wrap", alignItems:"center" }}>
              <span style={{ fontSize:"10px", color:"#94A3B8", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em" }}>Quick Filters</span>
              {[
                { label:"🏆 Top Performers", fn:()=>{setGradeF("A");setSortBy("lci");setPage(1);} },
                { label:"⚠ Low Performers",  fn:()=>{setGradeF("F");setSortBy("lci");setPage(1);} },
                { label:"📅 Best Attendance", fn:()=>{setSortBy("attendance");setAttMin(90);setPage(1);} },
                { label:"💬 Most Questions",  fn:()=>{setSortBy("questions");setPage(1);} },
                { label:"🔇 Silent MPs",      fn:()=>{setSilentF(true);setPage(1);} },
                { label:"🔄 Reset All",       fn:()=>{setGradeF("All");setAttMin(0);setSilentF(false);setSortBy("rank");setSearch("");setPage(1);} },
              ].map(btn=>(
                <button key={btn.label} onClick={btn.fn} style={{ padding:"7px 14px", borderRadius:"100px",
                  border:"1.5px solid #E2E8F0", background:"white", cursor:"pointer", fontSize:"11px",
                  fontWeight:600, color:"#334155", fontFamily:"'DM Sans',sans-serif",
                  transition:"all 0.15s" }}>{btn.label}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ══ BODY ══ */}
      <div style={{ maxWidth:"1280px", margin:"0 auto", padding:"32px 40px 64px" }}>

        {/* Nat avg strip */}
        {!loading && (
          <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", marginBottom:"24px" }}>
            {[
              { label:"Avg Attendance", v:`${(avgAtt*100).toFixed(1)}%`, c:"#16A34A", bg:"#DCFCE7" },
              { label:"Avg Questions",  v:avgQ.toFixed(1),                c:"#1E40AF", bg:"#DBEAFE" },
              { label:"Avg Debates",    v:avgDeb.toFixed(1),              c:"#7C3AED", bg:"#F3E8FF" },
              { label:"Avg LCI",        v:avgLCI.toFixed(4),              c:"#D97706", bg:"#FEF3C7" },
            ].map(s=>(
              <div key={s.label} style={{ display:"flex", alignItems:"center", gap:"7px", padding:"5px 12px",
                background:s.bg, borderRadius:"100px" }}>
                <span style={{ fontSize:"10px", color:s.c, fontWeight:600 }}>{s.label}</span>
                <span style={{ fontSize:"13px", fontWeight:800, color:s.c, fontFamily:"'Crimson Pro',Georgia,serif" }}>{s.v}</span>
              </div>
            ))}
            <div style={{ display:"flex", alignItems:"center", gap:"6px", padding:"5px 12px", background:"#F8FAFC",
              border:"1px solid #E2E8F0", borderRadius:"100px" }}>
              <div style={{ width:"10px", height:"2px", background:"#94A3B8", borderRadius:"1px" }}/>
              <span style={{ fontSize:"9px", color:"#94A3B8", fontWeight:600 }}>bar marker = national average</span>
            </div>
          </div>
        )}

        {loading && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"100px 0", gap:"16px" }}>
            <div style={{ width:32, height:32, border:"3px solid #DBEAFE", borderTop:"3px solid #1E3A8A", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>
            <span style={{ fontSize:"13px", color:"#64748B" }}>Loading 544 MPs…</span>
          </div>
        )}

        {!loading && (
          <>
            {/* Two-column layout: cards + sidebar */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:"24px", alignItems:"start" }}>

              {/* Cards grid */}
              <div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:"14px" }}>
                  {pageData.map(mp=>(
                    <MPCard key={mp.name} mp={mp} maxQ={maxQ} maxDeb={maxDeb}
                      avgAtt={avgAtt} avgQ={avgQ} avgDeb={avgDeb} photos={photos}
                      onCompare={handleCompare} compareList={compareList}/>
                  ))}
                </div>
                {filtered.length===0 && (
                  <div style={{ textAlign:"center", padding:"80px", color:"#94A3B8" }}>
                    <div style={{ fontSize:"32px", opacity:0.3, marginBottom:"12px" }}>◎</div>
                    No MPs match your filters.
                    <div style={{ marginTop:"12px" }}><button onClick={()=>{setGradeF("All");setAttMin(0);setSilentF(false);setSearch("");setPage(1);}} style={{ fontSize:"12px", color:"#1E40AF", background:"none", border:"none", cursor:"pointer", fontWeight:700 }}>Clear all filters</button></div>
                  </div>
                )}
                {totalPages>1 && (
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:"36px", paddingTop:"20px", borderTop:"1px solid #E2E8F0" }}>
                    <span style={{ fontSize:"12px", color:"#94A3B8" }}>{(page-1)*PER+1}–{Math.min(page*PER,filtered.length)} of {filtered.length}</span>
                    <div style={{ display:"flex", gap:"4px" }}>
                      <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
                        style={{ padding:"7px 14px", borderRadius:"8px", border:"1.5px solid #E2E8F0", background:"white", cursor:page===1?"not-allowed":"pointer", fontSize:"12px", color:page===1?"#CBD5E1":"#334155", fontFamily:"'DM Sans',sans-serif" }}>←</button>
                      {Array.from({length:Math.min(7,totalPages)},(_,i)=>{
                        const p=Math.max(1,Math.min(page-3,totalPages-6))+i;
                        return <button key={p} onClick={()=>setPage(p)} style={{ width:34,height:34,borderRadius:"8px",border:"1.5px solid #E2E8F0",background:p===page?"#1E3A8A":"white",cursor:"pointer",fontSize:"12px",fontWeight:p===page?700:400,color:p===page?"white":"#334155",fontFamily:"'DM Sans',sans-serif" }}>{p}</button>;
                      })}
                      <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
                        style={{ padding:"7px 14px", borderRadius:"8px", border:"1.5px solid #E2E8F0", background:"white", cursor:page===totalPages?"not-allowed":"pointer", fontSize:"12px", color:page===totalPages?"#CBD5E1":"#334155", fontFamily:"'DM Sans',sans-serif" }}>→</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right sidebar */}
              <div style={{ display:"flex", flexDirection:"column", gap:"16px", position:"sticky", top:"180px" }}>
                {/* Constituency finder */}
                <ConstituencyFinder mps={mps}/>

                {/* Compare hint */}
                <div style={{ background:"white", borderRadius:"16px", padding:"20px", border:"1.5px solid #E2E8F0" }}>
                  <div style={{ fontSize:"13px", fontWeight:800, color:"#0F172A", marginBottom:"6px" }}>⚡ Compare MPs</div>
                  <div style={{ fontSize:"11px", color:"#64748B", lineHeight:1.7, marginBottom:"12px" }}>
                    Click the <strong>+</strong> button on any two cards to compare them side by side.
                  </div>
                  {compareList.length>0 && (
                    <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
                      {compareList.map(name=>(
                        <div key={name} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                          padding:"6px 10px", background:"#EFF6FF", borderRadius:"8px" }}>
                          <span style={{ fontSize:"11px", fontWeight:700, color:"#1E40AF" }}>{name.split(" ").slice(0,2).join(" ")}</span>
                          <button onClick={()=>setCompareList(p=>p.filter(n=>n!==name))} style={{ background:"none", border:"none", fontSize:"12px", cursor:"pointer", color:"#94A3B8" }}>✕</button>
                        </div>
                      ))}
                      {compareList.length===2 && (
                        <button onClick={()=>setShowCompare(true)} style={{ padding:"9px", background:"#1E3A8A", border:"none", borderRadius:"8px",
                          color:"white", fontSize:"12px", fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
                          Compare Now →
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Data source */}
                <div style={{ padding:"16px", background:"#FFFBEB", borderRadius:"14px", border:"1px solid #FDE68A" }}>
                  <div style={{ fontSize:"10px", fontWeight:800, color:"#D97706", textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:"6px" }}>Data Sources</div>
                  <div style={{ fontSize:"11px", color:"#78350F", lineHeight:1.7 }}>
                    PRS Legislative Research · Lok Sabha Official Records<br/>
                    <span style={{ color:"#D97706", fontWeight:700 }}>Zero editorial bias. Data only.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Understand Parliament section */}
            <UnderstandSection/>
          </>
        )}
      </div>

      {/* Compare modal */}
      {showCompare && compareList.length===2 && (
        <CompareModal list={compareList} mps={mps} onClose={()=>setShowCompare(false)}/>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;0,700;1,400;1,700&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}