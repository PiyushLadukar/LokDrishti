"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { getNationalRankings } from "@/lib/api";

const getLCI        = (mp: any): number  => mp.LCI_score  ?? 0;
const getAttendance = (mp: any): number  => mp.attendance ?? 0;
const getQuestions  = (mp: any): number  => mp.questions  ?? 0;
const getDebates    = (mp: any): number  => mp.debates    ?? 0;
const isSilent      = (mp: any): boolean => mp.silent_flag === 1;

function getGrade(lci: number) {
  if (lci >= 0.75) return { g: "A", color: "#166534", bg: "#F0FDF4", dot: "#22C55E" };
  if (lci >= 0.5)  return { g: "B", color: "#9A3412", bg: "#FFF7ED", dot: "#F97316" };
  if (lci >= 0.25) return { g: "C", color: "#854D0E", bg: "#FEFCE8", dot: "#EAB308" };
  return              { g: "D", color: "#991B1B", bg: "#FEF2F2", dot: "#EF4444" };
}

function Photo({ name, url, size = 44 }: { name: string; url?: string; size?: number }) {
  const [err, setErr] = useState(false);
  const words   = (name || "?").trim().split(/\s+/);
  const initials = words.length >= 2
    ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
    : words[0].slice(0, 2).toUpperCase();
  const hues = [220, 160, 30, 270, 190, 0];
  const hue  = hues[initials.charCodeAt(0) % hues.length];
  if (url && !err) {
    return (
      <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "2px solid #EDE8E0" }}>
        <img src={url} alt={name} onError={() => setErr(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
      </div>
    );
  }
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: `hsl(${hue},55%,92%)`, border: `2px solid hsl(${hue},40%,82%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Cormorant Garamond',serif", fontSize: size * 0.38,
      fontWeight: 700, color: `hsl(${hue},50%,35%)` }}>
      {initials}
    </div>
  );
}

function ThinBar({ value, max, avg, color }: { value: number; max: number; avg: number; color: string }) {
  const pct    = Math.min((value / (max || 1)) * 100, 100);
  const avgPct = Math.min((avg   / (max || 1)) * 100, 100);
  return (
    <div style={{ position: "relative", height: "3px", background: "#EDE8E0", borderRadius: "2px", flex: 1 }}>
      <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: `${pct}%`, background: color, borderRadius: "2px" }} />
      <div style={{ position: "absolute", top: "-4px", left: `${avgPct}%`, width: "1.5px", height: "11px",
        background: "#6B7280", borderRadius: "1px", transform: "translateX(-50%)" }} />
    </div>
  );
}

function MPCard({ mp, maxQ, maxDeb, avgAtt, avgQ, avgDeb, photos }: any) {
  const [hov, setHov] = useState(false);
  const lci    = getLCI(mp);
  const att    = getAttendance(mp);
  const q      = getQuestions(mp);
  const deb    = getDebates(mp);
  const silent = isSilent(mp);
  const grade  = getGrade(lci);
  const attPct = att * 100;
  const attC   = attPct >= 75 ? "#16A34A" : attPct >= 50 ? "#EA580C" : "#DC2626";

  return (
    <Link href={`/mp/${encodeURIComponent(mp.name)}`} style={{ textDecoration: "none" }}>
      <article onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
        background: hov ? "white" : "#FDFCFA",
        borderRadius: "14px",
        border: `1px solid ${hov ? "#D6CFCA" : "#EDE8E0"}`,
        padding: "16px",
        cursor: "pointer",
        transition: "all 0.18s ease",
        boxShadow: hov ? "0 8px 28px rgba(10,22,40,0.09)" : "0 1px 3px rgba(10,22,40,0.04)",
        transform: hov ? "translateY(-3px)" : "none",
        display: "flex", flexDirection: "column", gap: "12px",
      }}>
        {/* Photo + Name + Grade */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Photo name={mp.name} url={photos[mp.name]} size={44} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#1C1917", lineHeight: 1.25,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{mp.name}</div>
            <div style={{ fontSize: "10px", color: "#A8A29E", marginTop: "2px",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {[mp.constituency, mp.state].filter(Boolean).join(" · ")}
            </div>
          </div>
          <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
            background: grade.bg, border: `1.5px solid ${grade.dot}50`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Cormorant Garamond',serif", fontSize: "15px", fontWeight: 800, color: grade.color }}>
            {grade.g}
          </div>
        </div>

        {/* Party + flags */}
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {mp.party && (
            <span style={{ fontSize: "9px", color: "#78716C", background: "#F5F0EB", borderRadius: "4px",
              padding: "2px 7px", fontWeight: 600, maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {mp.party}
            </span>
          )}
          {silent && <span style={{ fontSize: "8px", fontWeight: 800, color: "#991B1B", background: "#FEE2E2", borderRadius: "4px", padding: "2px 5px" }}>SILENT</span>}
          {attPct < 50 && !silent && <span style={{ fontSize: "8px", fontWeight: 800, color: "#854D0E", background: "#FEF3C7", borderRadius: "4px", padding: "2px 5px" }}>LOW ATT</span>}
          {q > avgQ * 2 && <span style={{ fontSize: "8px", fontWeight: 800, color: "#1E40AF", background: "#EFF6FF", borderRadius: "4px", padding: "2px 5px" }}>TOP Q</span>}
          {deb > avgDeb * 2 && <span style={{ fontSize: "8px", fontWeight: 800, color: "#5B21B6", background: "#F5F3FF", borderRadius: "4px", padding: "2px 5px" }}>TOP DEB</span>}
        </div>

        <div style={{ height: "1px", background: "#F0EBE3" }} />

        {/* Stat bars */}
        <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
          {[
            { label: "Att",  value: att,  avg: avgAtt,  max: 1,    color: attC,     fmt: (v: number) => `${(v*100).toFixed(0)}%` },
            { label: "Qs",   value: q,    avg: avgQ,    max: maxQ, color: "#2563EB", fmt: (v: number) => String(Math.round(v)) },
            { label: "Deb",  value: deb,  avg: avgDeb,  max: maxDeb, color: "#7C3AED", fmt: (v: number) => String(Math.round(v)) },
          ].map(s => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "9px", color: "#A8A29E", fontWeight: 600, width: "28px",
                textTransform: "uppercase", letterSpacing: "0.05em", flexShrink: 0 }}>{s.label}</span>
              <ThinBar value={s.value} max={s.max} avg={s.avg} color={s.color} />
              <span style={{ fontSize: "11px", fontWeight: 700, color: s.color,
                width: "34px", textAlign: "right", flexShrink: 0 }}>{s.fmt(s.value)}</span>
            </div>
          ))}
        </div>

        {/* LCI + Rank footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
          paddingTop: "8px", borderTop: "1px solid #F0EBE3" }}>
          <div style={{ display: "flex", gap: "14px" }}>
            <div>
              <div style={{ fontSize: "8px", color: "#C4B8A8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>LCI</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "17px", fontWeight: 700, color: grade.color, lineHeight: 1 }}>{lci.toFixed(3)}</div>
            </div>
            {mp.national_rank && (
              <div>
                <div style={{ fontSize: "8px", color: "#C4B8A8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Rank</div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "17px", fontWeight: 700, color: "#44403C", lineHeight: 1 }}>#{Math.round(mp.national_rank)}</div>
              </div>
            )}
          </div>
          <div style={{ fontSize: "10px", color: "#C4B8A8", opacity: hov ? 1 : 0, transition: "opacity 0.2s" }}>
            View →
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function MPsPage() {
  const [mps, setMps]         = useState<any[]>([]);
  const [photos, setPhotos]   = useState<Record<string,string>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [stateF, setStateF]   = useState("All");
  const [partyF, setPartyF]   = useState("All");
  const [gradeF, setGradeF]   = useState("All");
  const [silentF, setSilentF] = useState(false);
  const [sortBy, setSortBy]   = useState<"rank"|"attendance"|"questions"|"debates"|"lci">("rank");
  const [page, setPage]       = useState(1);
  const PER = 24;

  useEffect(() => {
    (async () => {
      try {
        const first = await getNationalRankings(undefined, 1, 100);
        const total = first.total || 544;
        const pages = Math.ceil(total / 100);
        let all = [...(first.data || [])];
        for (let p = 2; p <= pages; p++) {
          const r = await getNationalRankings(undefined, p, 100);
          all = [...all, ...(r.data || [])];
        }
        setMps(all);
      } catch {}
      setLoading(false);
    })();
    fetch("/mp_photos.json").then(r => r.json()).then(setPhotos).catch(() => {});
  }, []);

  const avgAtt = useMemo(() => mps.length ? mps.reduce((s,m) => s+getAttendance(m),0)/mps.length : 0, [mps]);
  const avgQ   = useMemo(() => mps.length ? mps.reduce((s,m) => s+getQuestions(m), 0)/mps.length : 0, [mps]);
  const avgDeb = useMemo(() => mps.length ? mps.reduce((s,m) => s+getDebates(m),   0)/mps.length : 0, [mps]);
  const avgLCI = useMemo(() => mps.length ? mps.reduce((s,m) => s+getLCI(m),       0)/mps.length : 0, [mps]);
  const maxQ   = useMemo(() => Math.max(...mps.map(m=>getQuestions(m)), 1), [mps]);
  const maxDeb = useMemo(() => Math.max(...mps.map(m=>getDebates(m)),   1), [mps]);
  const states  = useMemo(() => ["All",...Array.from(new Set(mps.map(m=>m.state).filter(Boolean))).sort()], [mps]);
  const parties = useMemo(() => ["All",...Array.from(new Set(mps.map(m=>m.party).filter(Boolean))).sort()], [mps]);
  const photosN = Object.keys(photos).length;

  const filtered = useMemo(() => {
    let list = [...mps];
    if (silentF) list = list.filter(m => isSilent(m));
    if (stateF !== "All") list = list.filter(m => m.state === stateF);
    if (partyF !== "All") list = list.filter(m => m.party === partyF);
    if (gradeF !== "All") list = list.filter(m => getGrade(getLCI(m)).g === gradeF);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(m => m.name?.toLowerCase().includes(q) || m.state?.toLowerCase().includes(q)
        || m.party?.toLowerCase().includes(q) || m.constituency?.toLowerCase().includes(q));
    }
    list.sort((a,b) => {
      if (sortBy==="rank")       return (a.national_rank??999)-(b.national_rank??999);
      if (sortBy==="attendance") return getAttendance(b)-getAttendance(a);
      if (sortBy==="questions")  return getQuestions(b)-getQuestions(a);
      if (sortBy==="debates")    return getDebates(b)-getDebates(a);
      if (sortBy==="lci")        return getLCI(b)-getLCI(a);
      return 0;
    });
    return list;
  }, [mps, silentF, stateF, partyF, gradeF, search, sortBy]);

  const totalPages = Math.ceil(filtered.length / PER);
  const pageData   = filtered.slice((page-1)*PER, page*PER);

  const sel: any = { padding: "8px 12px", border: "1px solid #E7E2DA", borderRadius: "8px",
    fontSize: "12px", color: "#1C1917", fontFamily: "'DM Sans',sans-serif", outline: "none", background: "white", cursor: "pointer" };

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", background: "#F7F3EE" }}>

      {/* ══ HERO ══ */}
      <div style={{ background: "#1C1917" }}>
        <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "52px 40px 0", position: "relative", overflow: "hidden" }}>
          {/* Subtle dot texture */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none" }} />
          {/* Ghost word */}
          <div style={{ position: "absolute", right: 0, bottom: 0, fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(60px,10vw,140px)", fontWeight: 600, color: "transparent", WebkitTextStroke: "1px rgba(255,255,255,0.05)", userSelect: "none", lineHeight: 0.85, letterSpacing: "-3px", pointerEvents: "none" }}>PARLIAMENT</div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
              <div style={{ width: "20px", height: "1px", background: "#D97706" }} />
              <span style={{ fontSize: "10px", fontWeight: 700, color: "#D97706", textTransform: "uppercase", letterSpacing: "0.22em" }}>18th Lok Sabha · MP Directory</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "32px" }}>
              <div>
                <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(40px,6vw,72px)", fontWeight: 600, color: "#FAF8F5", lineHeight: 1.0, letterSpacing: "-2px", marginBottom: "14px" }}>
                  544 Members.<br/>
                  <em style={{ color: "#D97706", fontStyle: "italic" }}>One Parliament.</em>
                </h1>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.32)", lineHeight: 1.8, maxWidth: "460px" }}>
                  Every member of the 18th Lok Sabha. Attendance, questions, debates and LCI score — each bar benchmarked against the national average.
                </p>
                {photosN > 0 && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "14px",
                    padding: "4px 12px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)",
                    borderRadius: "100px" }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22C55E", display: "inline-block" }} />
                    <span style={{ fontSize: "10px", color: "#22C55E", fontWeight: 600 }}>{photosN} photos loaded from Wikipedia</span>
                  </div>
                )}
              </div>

              {!loading && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingBottom: "4px" }}>
                  {[
                    { n: String(mps.length),                         l: "Total MPs",      c: "#FAF8F5" },
                    { n: String(mps.filter(m=>isSilent(m)).length),  l: "Silent MPs",     c: "#EF4444" },
                    { n: `${(avgAtt*100).toFixed(0)}%`,              l: "Avg Attendance", c: "#22C55E" },
                    { n: avgQ.toFixed(0),                            l: "Avg Questions",  c: "#60A5FA" },
                  ].map(s => (
                    <div key={s.l} style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                      <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "24px", fontWeight: 700, color: s.c, lineHeight: 1, minWidth: "52px" }}>{s.n}</span>
                      <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.12em" }}>{s.l}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sort tabs */}
            <div style={{ display: "flex", gap: "2px", marginTop: "40px" }}>
              {(["rank","attendance","lci","questions","debates"] as const).map(key => {
                const labels: Record<string,string> = { rank:"By Rank", attendance:"Attendance", lci:"LCI Score", questions:"Questions", debates:"Debates" };
                const on = sortBy === key;
                return (
                  <button key={key} onClick={() => { setSortBy(key); setPage(1); }} style={{
                    padding: "9px 20px", background: on ? "#F7F3EE" : "transparent",
                    border: "none", borderRadius: "8px 8px 0 0", cursor: "pointer",
                    color: on ? "#1C1917" : "rgba(255,255,255,0.3)",
                    fontSize: "12px", fontWeight: on ? 700 : 500, fontFamily: "'DM Sans',sans-serif",
                    transition: "all 0.15s",
                  }}>{labels[key]}</button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ══ STICKY CONTROLS ══ */}
      <div style={{ background: "white", borderBottom: "1px solid #EDE8E0", position: "sticky", top: "62px", zIndex: 40 }}>
        <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "0 40px" }}>
          {/* Averages strip */}
          {!loading && (
            <div style={{ display: "flex", gap: "20px", padding: "8px 0", borderBottom: "1px solid #F5F0EB", flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: "9px", fontWeight: 700, color: "#C4B8A8", textTransform: "uppercase", letterSpacing: "0.16em" }}>Nat. Avg</span>
              {[
                { l: "Attendance", v: `${(avgAtt*100).toFixed(1)}%`, c: "#16A34A" },
                { l: "Questions",  v: avgQ.toFixed(1),                c: "#2563EB" },
                { l: "Debates",    v: avgDeb.toFixed(1),              c: "#7C3AED" },
                { l: "LCI Score",  v: avgLCI.toFixed(4),              c: "#D97706" },
              ].map(s => (
                <div key={s.l} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <span style={{ fontSize: "9px", color: "#A8A29E" }}>{s.l}</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: s.c, fontFamily: "'Cormorant Garamond',serif" }}>{s.v}</span>
                </div>
              ))}
              <span style={{ fontSize: "9px", color: "#C4B8A8", marginLeft: "auto" }}>bar marker = national average</span>
            </div>
          )}
          {/* Filters */}
          <div style={{ display: "flex", gap: "8px", padding: "10px 0", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ position: "relative", flex: "1 1 180px" }}>
              <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", opacity: 0.3 }} width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="5" cy="5" r="4" stroke="#374151" strokeWidth="1.4"/>
                <path d="M8.5 8.5l2 2" stroke="#374151" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search name, constituency, state, party…"
                style={{ ...sel, paddingLeft: "28px", width: "100%", boxSizing: "border-box" as any }} />
            </div>
            <select value={stateF} onChange={e => { setStateF(e.target.value); setPage(1); }} style={sel}>{states.slice(0,40).map(s=><option key={s}>{s}</option>)}</select>
            <select value={partyF} onChange={e => { setPartyF(e.target.value); setPage(1); }} style={sel}>{parties.slice(0,50).map(p=><option key={p}>{p}</option>)}</select>
            <select value={gradeF} onChange={e => { setGradeF(e.target.value); setPage(1); }} style={sel}>
              {["All","A","B","C","D"].map(g=><option key={g} value={g}>{g==="All"?"All Grades":`Grade ${g}`}</option>)}
            </select>
            <button onClick={() => { setSilentF(p=>!p); setPage(1); }} style={{
              ...sel, background: silentF?"#FEF2F2":"white",
              border: silentF?"1px solid #FCA5A5":"1px solid #E7E2DA",
              color: silentF?"#DC2626":"#78716C",
              display: "flex", alignItems: "center", gap: "5px",
            }}>
              <span style={{ width:5, height:5, borderRadius:"50%", background: silentF?"#DC2626":"#D6D3D1",
                ...(silentF?{animation:"blink 1.2s infinite"}:{}) }} />
              Silent MPs
            </button>
            <span style={{ marginLeft:"auto", fontSize:"11px", color:"#A8A29E", fontWeight:600, whiteSpace:"nowrap" }}>
              {filtered.length} / {mps.length}
            </span>
          </div>
        </div>
      </div>

      {/* ══ GRID ══ */}
      <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "24px 40px 64px" }}>
        {loading && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"100px 0", gap:"14px" }}>
            <div style={{ width:28, height:28, border:"2.5px solid #F0EBE3", borderTop:"2.5px solid #D97706", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
            <span style={{ fontSize:"12px", color:"#A8A29E" }}>Loading 544 MPs…</span>
          </div>
        )}
        {!loading && (
          <>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(238px, 1fr))", gap:"10px" }}>
              {pageData.map(mp => (
                <MPCard key={mp.name} mp={mp} maxQ={maxQ} maxDeb={maxDeb}
                  avgAtt={avgAtt} avgQ={avgQ} avgDeb={avgDeb} photos={photos} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div style={{ textAlign:"center", padding:"80px", color:"#A8A29E" }}>
                <div style={{ fontSize:"28px", opacity:0.2, marginBottom:"10px" }}>◎</div>
                No MPs match your filters.
              </div>
            )}
            {totalPages > 1 && (
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:"40px", paddingTop:"24px", borderTop:"1px solid #EDE8E0" }}>
                <span style={{ fontSize:"12px", color:"#A8A29E" }}>{(page-1)*PER+1}–{Math.min(page*PER,filtered.length)} of {filtered.length}</span>
                <div style={{ display:"flex", gap:"4px" }}>
                  <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
                    style={{ padding:"7px 14px", borderRadius:"8px", border:"1px solid #E7E2DA", background:"white", cursor:page===1?"not-allowed":"pointer", fontSize:"12px", color:page===1?"#D6D3D1":"#44403C", fontFamily:"'DM Sans',sans-serif" }}>←</button>
                  {Array.from({length:Math.min(7,totalPages)},(_,i)=>{
                    const p=Math.max(1,Math.min(page-3,totalPages-6))+i;
                    return <button key={p} onClick={()=>setPage(p)} style={{ width:34,height:34,borderRadius:"8px",border:"1px solid #E7E2DA",background:p===page?"#1C1917":"white",cursor:"pointer",fontSize:"12px",fontWeight:p===page?700:400,color:p===page?"white":"#44403C",fontFamily:"'DM Sans',sans-serif" }}>{p}</button>;
                  })}
                  <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
                    style={{ padding:"7px 14px", borderRadius:"8px", border:"1px solid #E7E2DA", background:"white", cursor:page===totalPages?"not-allowed":"pointer", fontSize:"12px", color:page===totalPages?"#D6D3D1":"#44403C", fontFamily:"'DM Sans',sans-serif" }}>→</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}`}</style>
    </div>
  );
}