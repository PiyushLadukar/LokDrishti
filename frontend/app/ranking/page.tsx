"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { getNationalRankings } from "@/lib/api";

type SortKey = "attendance" | "lci" | "questions" | "debates";

function normalizeMP(mp: any) {
  const attRaw = mp.attendance_pct ?? mp.attendance_percentage ?? mp.attendance ?? 0;
  return {
    ...mp,
    att:   Number(attRaw) <= 1 ? Number(attRaw) * 100 : Number(attRaw),
    lci:   Number(mp.LCI_score ?? mp.lci_score ?? mp.lci ?? 0),
    q:     Number(mp.questions ?? mp.questions_raised ?? mp.total_questions ?? 0),
    deb:   Number(mp.debates ?? mp.debates_participated ?? 0),
    name:  mp.name ?? "Unknown",
    state: mp.state ?? "",
    party: mp.party ?? "",
  };
}

function getGrade(lci: number) {
  if (lci >= 0.75) return { g:"A+", color:"#00C853", bg:"rgba(0,200,83,0.1)", glow:"#00C853" };
  if (lci >= 0.6)  return { g:"A",  color:"#00BFA5", bg:"rgba(0,191,165,0.1)", glow:"#00BFA5" };
  if (lci >= 0.5)  return { g:"B+", color:"#FF6B00", bg:"rgba(255,107,0,0.1)", glow:"#FF6B00" };
  if (lci >= 0.4)  return { g:"B",  color:"#FFB300", bg:"rgba(255,179,0,0.1)",  glow:"#FFB300" };
  if (lci >= 0.25) return { g:"C",  color:"#FF7043", bg:"rgba(255,112,67,0.1)", glow:"#FF7043" };
  if (lci >= 0.1)  return { g:"D",  color:"#EF5350", bg:"rgba(239,83,80,0.1)",  glow:"#EF5350" };
  return               { g:"F",  color:"#B71C1C", bg:"rgba(183,28,28,0.1)",  glow:"#B71C1C" };
}

// ─── Animated number counter ──────────────────────────────────────────────
function CountUp({ to, duration=1200 }: { to: number; duration?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now()-start)/duration, 1);
      const ease = 1 - Math.pow(1-p, 3);
      setVal(Math.round(to * ease));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [to, duration]);
  return <>{val.toLocaleString()}</>;
}

// ─── Animated bar ─────────────────────────────────────────────────────────
function Bar({ val, max, color, delay=0 }: { val:number; max:number; color:string; delay?:number }) {
  const [w, setW] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setTimeout(() => setW(Math.min((val/Math.max(max,1))*100, 100)), delay);
    }, { threshold:0.05 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [val, max, delay]);
  return (
    <div ref={ref} style={{ width:80, height:3, background:"rgba(255,255,255,0.06)", borderRadius:2, overflow:"visible", position:"relative" }}>
      <div style={{ height:"100%", width:`${w}%`, background:`linear-gradient(90deg, ${color}88, ${color})`,
        borderRadius:2, transition:`width 1.1s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        boxShadow: w > 0 ? `0 0 8px ${color}60, 0 0 20px ${color}20` : "none",
        position:"relative" }}>
        {w > 0 && <div style={{ position:"absolute", right:0, top:"50%", transform:"translate(50%,-50%)",
          width:5, height:5, borderRadius:"50%", background:color, boxShadow:`0 0 6px ${color}` }}/>}
      </div>
    </div>
  );
}

// ─── Particle field background ───────────────────────────────────────────
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let W = canvas.offsetWidth, H = canvas.offsetHeight;
    canvas.width = W; canvas.height = H;
    const pts = Array.from({ length: 80 }, () => ({
      x: Math.random()*W, y: Math.random()*H,
      vx: (Math.random()-.5)*0.15, vy: (Math.random()-.5)*0.15,
      r: Math.random()*1.2+0.3, a: Math.random()
    }));
    let raf: number;
    const draw = () => {
      ctx.clearRect(0,0,W,H);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,107,0,${p.a*0.4})`;
        ctx.fill();
      });
      pts.forEach((a,i) => pts.slice(i+1).forEach(b => {
        const d = Math.hypot(a.x-b.x, a.y-b.y);
        if (d < 100) {
          ctx.beginPath();
          ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
          ctx.strokeStyle = `rgba(255,107,0,${(1-d/100)*0.06})`;
          ctx.lineWidth = 0.5; ctx.stroke();
        }
      }));
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }}/>;
}

// ─── Icons ────────────────────────────────────────────────────────────────
function Icon({ id, size=16, color="currentColor" }: { id:string; size?:number; color?:string }) {
  const s: React.CSSProperties = { width:size, height:size, display:"block", flexShrink:0 };
  const p = { stroke:color, strokeWidth:"1.8", strokeLinecap:"round" as const, strokeLinejoin:"round" as const, fill:"none" };
  const map: Record<string, React.ReactNode> = {
    filter:    <svg style={s} viewBox="0 0 24 24"><path d="M4 6h16M7 12h10M10 18h4" {...p}/></svg>,
    search:    <svg style={s} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" {...p}/><path d="m21 21-4.35-4.35" {...p}/></svg>,
    chevdown:  <svg style={s} viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" {...p}/></svg>,
    chevleft:  <svg style={s} viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" {...p}/></svg>,
    chevright: <svg style={s} viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" {...p}/></svg>,
    attend:    <svg style={s} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" {...p}/><path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4" {...p}/></svg>,
    question:  <svg style={s} viewBox="0 0 24 24"><path d="M9 9a3 3 0 0 1 6 0c0 2-3 3-3 3" {...p}/><circle cx="12" cy="17" r="1" fill={color}/></svg>,
    debate:    <svg style={s} viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...p}/></svg>,
    lci:       <svg style={s} viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" {...p}/></svg>,
    grade:     <svg style={s} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" {...p}/></svg>,
    silent:    <svg style={s} viewBox="0 0 24 24"><line x1="1" y1="1" x2="23" y2="23" {...p}/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23M12 19v3M8 23h8" {...p}/></svg>,
    map:       <svg style={s} viewBox="0 0 24 24"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" {...p}/><line x1="8" y1="2" x2="8" y2="18" {...p}/><line x1="16" y1="6" x2="16" y2="22" {...p}/></svg>,
    flag:      <svg style={s} viewBox="0 0 24 24"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" {...p}/><line x1="4" y1="22" x2="4" y2="15" {...p}/></svg>,
    close:     <svg style={s} viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" {...p}/></svg>,
    refresh:   <svg style={s} viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10" {...p}/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" {...p}/></svg>,
    star:      <svg style={s} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" {...p} fill={color} stroke="none"/></svg>,
    zap:       <svg style={s} viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" {...p}/></svg>,
  };
  return map[id] ?? <svg style={s} viewBox="0 0 24 24"/>;
}

// ─── Rank medal ───────────────────────────────────────────────────────────
function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
      <div style={{ fontSize:9, color:"#F59E0B", letterSpacing:"0.08em", fontWeight:800 }}>🥇</div>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:900, color:"#F59E0B",
        textShadow:"0 0 20px #F59E0B80, 0 0 40px #F59E0B40", lineHeight:1 }}>1</div>
    </div>
  );
  if (rank === 2) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
      <div style={{ fontSize:9 }}>🥈</div>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:900, color:"#94A3B8",
        textShadow:"0 0 16px #94A3B860", lineHeight:1 }}>2</div>
    </div>
  );
  if (rank === 3) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
      <div style={{ fontSize:9 }}>🥉</div>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:900, color:"#CD7F32",
        textShadow:"0 0 16px #CD7F3260", lineHeight:1 }}>3</div>
    </div>
  );
  return (
    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:700,
      color:"rgba(255,255,255,0.18)", lineHeight:1, textAlign:"center" }}>
      {rank}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────
export default function RankingPage() {
  const [raw,         setRaw]         = useState<any[]>([]);
  const [filtered,    setFiltered]    = useState<any[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [loadPct,     setLoadPct]     = useState(0);
  const [error,       setError]       = useState(false);
  const [sortBy,      setSortBy]      = useState<SortKey>("lci");
  const [search,      setSearch]      = useState("");
  const [stateFilter, setStateFilter] = useState("All");
  const [partyFilter, setPartyFilter] = useState("All");
  const [silentOnly,  setSilentOnly]  = useState(false);
  const [page,        setPage]        = useState(1);
  const [sideOpen,    setSideOpen]    = useState(true);
  const [heroVis,     setHeroVis]     = useState(false);
  const [hovRow,      setHovRow]      = useState<number|null>(null);
  const PER_PAGE = 25;

  useEffect(() => { setTimeout(() => setHeroVis(true), 100); load(); }, []);

  // ── Fetch ALL 543 MPs ──
  async function load() {
    setLoading(true); setError(false); setLoadPct(0);
    try {
      // Simulate progress while fetching
      const progInt = setInterval(() => setLoadPct(p => Math.min(p + Math.random()*8, 88)), 120);
      const res = await getNationalRankings(undefined, 1, 543);
      clearInterval(progInt);
      setLoadPct(100);
      // Support all possible response shapes
      let list: any[] = [];
      if (Array.isArray(res))             list = res;
      else if (Array.isArray(res?.rankings)) list = res.rankings;
      else if (Array.isArray(res?.data))    list = res.data;
      else if (Array.isArray(res?.results)) list = res.results;
      else if (Array.isArray(res?.mps))     list = res.mps;
      setRaw(list.map(normalizeMP));
    } catch { setError(true); }
    setTimeout(() => setLoading(false), 300);
  }

  useEffect(() => {
    let list = [...raw];
    if (silentOnly)         list = list.filter(m => m.q === 0 && m.deb === 0);
    if (stateFilter !== "All") list = list.filter(m => m.state === stateFilter);
    if (partyFilter !== "All") list = list.filter(m => m.party === partyFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(m =>
        m.name?.toLowerCase().includes(q) ||
        m.state?.toLowerCase().includes(q) ||
        m.party?.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      if (sortBy === "attendance") return b.att - a.att;
      if (sortBy === "lci")        return b.lci - a.lci;
      if (sortBy === "questions")  return b.q - a.q;
      if (sortBy === "debates")    return b.deb - a.deb;
      return 0;
    });
    setFiltered(list); setPage(1);
  }, [raw, sortBy, search, stateFilter, partyFilter, silentOnly]);

  const states  = ["All", ...Array.from(new Set(raw.map(m=>m.state).filter(Boolean))).sort() as string[]];
  const parties = ["All", ...Array.from(new Set(raw.map(m=>m.party).filter(Boolean))).sort() as string[]];
  const maxQ    = Math.max(...raw.map(m => m.q), 1);
  const maxDeb  = Math.max(...raw.map(m => m.deb), 1);
  const maxLCI  = Math.max(...raw.map(m => m.lci), 1);
  const silentCount = raw.filter(m => m.q === 0 && m.deb === 0).length;
  const lowAtt      = raw.filter(m => m.att < 50).length;
  const pageData    = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);
  const totalPages  = Math.ceil(filtered.length / PER_PAGE);

  const sortTabs: [SortKey, string, string, string, string][] = [
    ["lci",        "LCI Score",  "lci",      "#2563EB", "linear-gradient(135deg,#1D4ED8,#3B82F6)"],
    ["attendance", "Attendance", "attend",   "#FF6B00", "linear-gradient(135deg,#EA580C,#F97316)"],
    ["questions",  "Questions",  "question", "#059669", "linear-gradient(135deg,#047857,#10B981)"],
    ["debates",    "Debates",    "debate",   "#7C3AED", "linear-gradient(135deg,#6D28D9,#8B5CF6)"],
  ];

  const selStyle: React.CSSProperties = {
    width:"100%", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"9px 32px 9px 12px",
    fontSize:12, color:"rgba(255,255,255,0.85)", fontFamily:"'DM Sans',sans-serif", outline:"none",
    background:"rgba(255,255,255,0.04)", cursor:"pointer", appearance:"none" as any,
    transition:"all 0.2s",
  };

  // ── Page number list ──
  const pageNums = () => {
    const total = totalPages;
    const cur   = page;
    if (total <= 7) return Array.from({length:total}, (_,i) => i+1);
    if (cur <= 4) return [1,2,3,4,5,"…",total];
    if (cur >= total-3) return [1,"…",total-4,total-3,total-2,total-1,total];
    return [1,"…",cur-1,cur,cur+1,"…",total];
  };

  return (
    <div style={{ minHeight:"100vh", fontFamily:"'DM Sans',sans-serif",
      background:"#050C1A", color:"rgba(255,255,255,0.85)" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        *,*::before,*::after { box-sizing:border-box; }
        ::selection { background:rgba(255,107,0,0.3); }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(255,107,0,0.3); border-radius:2px; }

        @keyframes spin    { to { transform:rotate(360deg) } }
        @keyframes blink   { 0%,100%{opacity:1} 50%{opacity:0.2} }
        @keyframes pulse   { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
        @keyframes scanline{ 0%{top:-20%} 100%{top:120%} }
        @keyframes glow    { 0%,100%{box-shadow:0 0 20px rgba(255,107,0,0.3)} 50%{box-shadow:0 0 40px rgba(255,107,0,0.6)} }
        @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }

        .mp-row { transition: background 0.2s, transform 0.25s cubic-bezier(0.34,1.56,0.64,1); }
        .mp-row:hover { transform:translateX(3px) !important; }
        .sort-tab { transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1) !important; }
        .sort-tab:hover { transform: translateY(-2px) scale(1.02) !important; }
        .filter-card { transition: border-color 0.2s, box-shadow 0.2s; }
        .filter-card:focus-within { border-color:rgba(255,107,0,0.4) !important; box-shadow:0 0 0 3px rgba(255,107,0,0.1) !important; }
        input:focus { box-shadow: 0 0 0 2px rgba(255,107,0,0.3) !important; border-color:rgba(255,107,0,0.5) !important; }
        .pg-btn { transition:all 0.15s cubic-bezier(0.34,1.56,0.64,1); }
        .pg-btn:hover:not(:disabled) { transform:scale(1.08); }
        .name-link { transition:color 0.15s; }
        .name-link:hover { color:#FF6B00 !important; }
        .grade-badge { transition:transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s; }
        .grade-badge:hover { transform:scale(1.15) rotate(-3deg); }
        .stat-card { transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s; }
        .stat-card:hover { transform:translateY(-4px); }
      `}</style>

      {/* ─── HERO ─────────────────────────────────────────── */}
      <div style={{ position:"relative", overflow:"hidden",
        background:"linear-gradient(160deg,#050C1A 0%,#0A1628 50%,#050C1A 100%)", minHeight:340 }}>

        {/* Particle canvas */}
        <ParticleField/>

        {/* Noise overlay */}
        <div style={{ position:"absolute", inset:0, pointerEvents:"none", opacity:0.025,
          backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize:"200px 200px" }}/>

        {/* Accent stripe */}
        <div style={{ height:3, background:"linear-gradient(90deg,transparent,#FF6B00 20%,#FF6B00 50%,#138808 80%,transparent)",
          boxShadow:"0 0 20px rgba(255,107,0,0.6)" }}/>

        {/* Scanline effect */}
        <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden" }}>
          <div style={{ position:"absolute", left:0, right:0, height:"1px",
            background:"linear-gradient(90deg,transparent,rgba(255,107,0,0.08),transparent)",
            animation:"scanline 8s linear infinite" }}/>
        </div>

        {/* Dome SVG watermark */}
        <svg style={{ position:"absolute", right:-20, top:0, height:"100%", opacity:0.04, pointerEvents:"none" }}
          viewBox="0 0 600 340" preserveAspectRatio="xMaxYMid meet">
          <path d="M80 240 Q300 40 520 240" fill="none" stroke="white" strokeWidth="2"/>
          {[120,155,190,225,260,295,330,365,400,435,470].map((x,i)=>(
            <rect key={i} x={x-1.5} y="195" width="3" height="47" fill="white"/>
          ))}
          <rect x="78" y="238" width="444" height="8" fill="white"/>
          <rect x="58" y="246" width="484" height="5" fill="white"/>
        </svg>

        {/* Glowing orbs */}
        <div style={{ position:"absolute", left:"-5%", top:"50%", width:400, height:400, borderRadius:"50%",
          background:"radial-gradient(circle,rgba(255,107,0,0.08) 0%,transparent 70%)",
          transform:"translateY(-50%)", animation:"float 8s ease-in-out infinite", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", right:"10%", bottom:"-30%", width:300, height:300, borderRadius:"50%",
          background:"radial-gradient(circle,rgba(37,99,235,0.06) 0%,transparent 70%)", pointerEvents:"none" }}/>

        <div style={{ maxWidth:1360, margin:"0 auto", padding:"44px 64px 0", position:"relative", zIndex:1 }}>
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:24 }}>

            {/* Title block */}
            <div style={{ opacity:heroVis?1:0, transform:heroVis?"none":"translateY(20px)",
              transition:"opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                <div style={{ width:28, height:2, background:"linear-gradient(90deg,#FF6B00,transparent)" }}/>
                <span style={{ fontSize:9, fontWeight:800, color:"#FF6B00", textTransform:"uppercase",
                  letterSpacing:"0.3em", fontFamily:"'DM Mono',monospace" }}>LokDrishti · National Rankings · 18th Lok Sabha</span>
                <div style={{ width:28, height:2, background:"linear-gradient(270deg,#FF6B00,transparent)" }}/>
              </div>
              <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(38px,5vw,72px)",
                fontWeight:900, color:"white", letterSpacing:"-2px", lineHeight:0.92, marginBottom:20 }}>
                All 543 MPs.
                <br/>
                <em style={{ color:"#FF6B00",
                  textShadow:"0 0 40px rgba(255,107,0,0.5), 0 0 80px rgba(255,107,0,0.2)" }}>
                  Ranked. Graded.
                </em>
                <br/>
                <span style={{ color:"rgba(255,255,255,0.45)", fontSize:"0.7em", fontWeight:400 }}>
                  Exposed.
                </span>
              </h1>
              <p style={{ fontSize:12, color:"rgba(255,255,255,0.3)", maxWidth:400, lineHeight:1.9,
                letterSpacing:"0.02em", fontFamily:"'DM Mono',monospace" }}>
                Every member ranked by attendance, questions raised, debate participation & LCI score. No politics — just data.
              </p>
            </div>

            {/* Stat cards */}
            {!loading && (
              <div style={{ display:"flex", gap:16,
                opacity:heroVis?1:0, transform:heroVis?"none":"translateY(20px)",
                transition:"opacity 0.7s ease 0.15s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s" }}>
                {[
                  { n:543,   l:"MPs Tracked",  c:"#FF6B00", border:"rgba(255,107,0,0.2)" },
                  { n:silentCount, l:"Silent MPs", c:"#EF4444", border:"rgba(239,68,68,0.2)" },
                  { n:lowAtt, l:"<50% Attend", c:"#F59E0B",  border:"rgba(245,158,11,0.2)" },
                ].map((s,i) => (
                  <div key={s.l} className="stat-card"
                    style={{ padding:"20px 24px", borderRadius:16,
                      background:"rgba(255,255,255,0.03)",
                      border:`1px solid ${s.border}`,
                      backdropFilter:"blur(10px)",
                      boxShadow:`0 0 30px ${s.border}, inset 0 1px 0 rgba(255,255,255,0.05)`,
                      transition:"all 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:42, fontWeight:900,
                      color:s.c, lineHeight:1, textShadow:`0 0 30px ${s.c}60` }}>
                      <CountUp to={s.n} duration={1000+i*200}/>
                    </div>
                    <div style={{ fontSize:9.5, color:"rgba(255,255,255,0.25)", textTransform:"uppercase",
                      letterSpacing:"0.18em", marginTop:6, fontFamily:"'DM Mono',monospace" }}>{s.l}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ─── Sort tabs ── */}
          <div style={{ display:"flex", gap:6, marginTop:36,
            opacity:heroVis?1:0, transition:"opacity 0.7s ease 0.25s" }}>
            {sortTabs.map(([key,label,icon,color,grad]) => {
              const on = sortBy === key;
              return (
                <button key={key} onClick={() => setSortBy(key)} className="sort-tab"
                  style={{ display:"flex", alignItems:"center", gap:8, padding:"11px 22px",
                    background: on ? grad : "rgba(255,255,255,0.03)",
                    border: on ? "none" : "1px solid rgba(255,255,255,0.07)",
                    borderRadius:"12px 12px 0 0", cursor:"pointer",
                    color: on ? "white" : "rgba(255,255,255,0.3)",
                    fontSize:12, fontWeight:700, fontFamily:"'DM Sans',sans-serif",
                    position:"relative", overflow:"hidden",
                    boxShadow: on ? `0 -4px 24px ${color}40` : "none" }}>
                  {on && (
                    <div style={{ position:"absolute", inset:0, overflow:"hidden" }}>
                      <div style={{ position:"absolute", top:0, bottom:0, width:"40%",
                        background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)",
                        animation:"shimmer 2.4s ease-in-out infinite" }}/>
                    </div>
                  )}
                  <Icon id={icon} size={13} color={on ? "white" : "rgba(255,255,255,0.3)"}/>
                  <span style={{ position:"relative" }}>{label}</span>
                  {on && <div style={{ width:5, height:5, borderRadius:"50%", background:"white",
                    boxShadow:"0 0 8px white", marginLeft:2, animation:"blink 2s ease infinite" }}/>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── BODY ─────────────────────────────────────────── */}
      <div style={{ maxWidth:1360, margin:"0 auto", padding:"28px 64px 80px",
        display:"flex", gap:22, alignItems:"flex-start" }}>

        {/* ─── SIDEBAR ── */}
        <aside style={{ width:sideOpen?220:52, flexShrink:0, transition:"width 0.3s cubic-bezier(0.16,1,0.3,1)", overflow:"hidden" }}>

          {/* Toggle button */}
          <button onClick={() => setSideOpen(p => !p)}
            style={{ width:"100%", display:"flex", alignItems:"center", gap:8, padding:"11px 13px",
              background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
              borderRadius:13, cursor:"pointer", marginBottom:12,
              fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.6)",
              fontFamily:"'DM Sans',sans-serif", whiteSpace:"nowrap",
              transition:"background 0.2s, border-color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,107,0,0.08)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}>
            <Icon id="filter" size={15} color="#FF6B00"/>
            {sideOpen && (<><span>Filters</span><div style={{ marginLeft:"auto" }}><Icon id="chevleft" size={13} color="rgba(255,255,255,0.3)"/></div></>)}
          </button>

          {sideOpen && (
            <div style={{ display:"flex", flexDirection:"column", gap:10, animation:"slideUp 0.4s ease" }}>

              {/* Search */}
              <div className="filter-card" style={{ background:"rgba(255,255,255,0.03)", borderRadius:14,
                border:"1px solid rgba(255,255,255,0.07)", padding:"14px" }}>
                <div style={{ fontSize:9, fontWeight:800, color:"rgba(255,107,0,0.7)", textTransform:"uppercase",
                  letterSpacing:"0.2em", marginBottom:9, display:"flex", alignItems:"center", gap:5,
                  fontFamily:"'DM Mono',monospace" }}>
                  <Icon id="search" size={10} color="rgba(255,107,0,0.7)"/>SEARCH
                </div>
                <div style={{ position:"relative" }}>
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Name, state, party…"
                    style={{ width:"100%", border:"1px solid rgba(255,255,255,0.1)", borderRadius:9,
                      padding:"8px 10px 8px 30px", fontSize:12, color:"rgba(255,255,255,0.85)",
                      fontFamily:"'DM Sans',sans-serif", outline:"none",
                      background:"rgba(255,255,255,0.04)", transition:"all 0.2s" }}/>
                  <div style={{ position:"absolute", left:9, top:"50%", transform:"translateY(-50%)" }}>
                    <Icon id="search" size={12} color="rgba(255,255,255,0.2)"/>
                  </div>
                  {search && (
                    <button onClick={() => setSearch("")}
                      style={{ position:"absolute", right:7, top:"50%", transform:"translateY(-50%)",
                        background:"none", border:"none", cursor:"pointer", padding:0, opacity:0.5 }}>
                      <Icon id="close" size={11} color="rgba(255,255,255,0.6)"/>
                    </button>
                  )}
                </div>
              </div>

              {/* State */}
              <div className="filter-card" style={{ background:"rgba(255,255,255,0.03)", borderRadius:14,
                border:"1px solid rgba(255,255,255,0.07)", padding:"14px" }}>
                <div style={{ fontSize:9, fontWeight:800, color:"rgba(255,107,0,0.7)", textTransform:"uppercase",
                  letterSpacing:"0.2em", marginBottom:9, display:"flex", alignItems:"center", gap:5,
                  fontFamily:"'DM Mono',monospace" }}>
                  <Icon id="map" size={10} color="rgba(255,107,0,0.7)"/>STATE
                </div>
                <div style={{ position:"relative" }}>
                  <select value={stateFilter} onChange={e => setStateFilter(e.target.value)} style={selStyle}>
                    {states.map(s => <option key={s} style={{ background:"#0A1628" }}>{s}</option>)}
                  </select>
                  <div style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
                    <Icon id="chevdown" size={12} color="rgba(255,255,255,0.3)"/>
                  </div>
                </div>
              </div>

              {/* Party */}
              <div className="filter-card" style={{ background:"rgba(255,255,255,0.03)", borderRadius:14,
                border:"1px solid rgba(255,255,255,0.07)", padding:"14px" }}>
                <div style={{ fontSize:9, fontWeight:800, color:"rgba(255,107,0,0.7)", textTransform:"uppercase",
                  letterSpacing:"0.2em", marginBottom:9, display:"flex", alignItems:"center", gap:5,
                  fontFamily:"'DM Mono',monospace" }}>
                  <Icon id="flag" size={10} color="rgba(255,107,0,0.7)"/>PARTY
                </div>
                <div style={{ position:"relative" }}>
                  <select value={partyFilter} onChange={e => setPartyFilter(e.target.value)} style={selStyle}>
                    {parties.map(p => <option key={p} style={{ background:"#0A1628" }}>{p}</option>)}
                  </select>
                  <div style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
                    <Icon id="chevdown" size={12} color="rgba(255,255,255,0.3)"/>
                  </div>
                </div>
              </div>

              {/* Silent toggle */}
              <button onClick={() => setSilentOnly(p => !p)}
                style={{ padding:"13px 14px", borderRadius:14, cursor:"pointer", textAlign:"left",
                  background: silentOnly ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.03)",
                  border: silentOnly ? "1.5px solid rgba(239,68,68,0.4)" : "1px solid rgba(255,255,255,0.07)",
                  fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s",
                  boxShadow: silentOnly ? "0 0 20px rgba(239,68,68,0.15)" : "none" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                  <Icon id="silent" size={13} color={silentOnly ? "#EF4444" : "rgba(255,255,255,0.3)"}/>
                  <span style={{ fontSize:12, fontWeight:700, color:silentOnly ? "#EF4444" : "rgba(255,255,255,0.6)" }}>
                    Silent MPs
                  </span>
                  {silentOnly && <div style={{ marginLeft:"auto", width:6, height:6, borderRadius:"50%",
                    background:"#EF4444", animation:"blink 1.5s ease-in-out infinite",
                    boxShadow:"0 0 8px #EF4444" }}/>}
                </div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.25)", paddingLeft:21,
                  fontFamily:"'DM Mono',monospace" }}>0 questions · 0 debates</div>
              </button>

              {/* Reset */}
              {(search || stateFilter !== "All" || partyFilter !== "All" || silentOnly) && (
                <button onClick={() => { setSearch(""); setStateFilter("All"); setPartyFilter("All"); setSilentOnly(false); }}
                  style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"10px",
                    borderRadius:10, cursor:"pointer", background:"rgba(255,107,0,0.08)",
                    border:"1px solid rgba(255,107,0,0.25)", fontFamily:"'DM Sans',sans-serif",
                    fontSize:11, fontWeight:700, color:"#FF6B00", transition:"all 0.2s",
                    animation:"pulse 2s ease infinite" }}>
                  <Icon id="refresh" size={12} color="#FF6B00"/>Reset filters
                </button>
              )}

              {/* MP count */}
              <div style={{ padding:"18px", borderRadius:16,
                background:"linear-gradient(135deg,rgba(255,107,0,0.12),rgba(255,107,0,0.04))",
                border:"1px solid rgba(255,107,0,0.2)", textAlign:"center",
                boxShadow:"0 0 30px rgba(255,107,0,0.1)" }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:38, fontWeight:900,
                  color:"#FF6B00", lineHeight:1, textShadow:"0 0 20px rgba(255,107,0,0.5)" }}>
                  {filtered.length}
                </div>
                <div style={{ fontSize:9, color:"rgba(255,255,255,0.25)", textTransform:"uppercase",
                  letterSpacing:"0.18em", marginTop:6, fontFamily:"'DM Mono',monospace" }}>MPs shown</div>
              </div>
            </div>
          )}
        </aside>

        {/* ─── TABLE ── */}
        <div style={{ flex:1, minWidth:0 }}>

          {/* Loading state */}
          {loading && (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"100px 0", gap:24 }}>
              <div style={{ position:"relative", width:60, height:60 }}>
                <div style={{ position:"absolute", inset:0, borderRadius:"50%",
                  border:"2px solid rgba(255,107,0,0.1)", borderTop:"2px solid #FF6B00",
                  animation:"spin 0.9s linear infinite" }}/>
                <div style={{ position:"absolute", inset:8, borderRadius:"50%",
                  border:"2px solid rgba(37,99,235,0.1)", borderBottom:"2px solid #3B82F6",
                  animation:"spin 1.4s linear infinite reverse" }}/>
                <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center",
                  justifyContent:"center" }}>
                  <Icon id="lci" size={18} color="rgba(255,255,255,0.3)"/>
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ width:280 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <span style={{ fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.7)" }}>Loading 543 MPs…</span>
                  <span style={{ fontSize:12, color:"#FF6B00", fontFamily:"'DM Mono',monospace" }}>{Math.round(loadPct)}%</span>
                </div>
                <div style={{ height:3, background:"rgba(255,255,255,0.06)", borderRadius:2 }}>
                  <div style={{ height:"100%", width:`${loadPct}%`, borderRadius:2,
                    background:"linear-gradient(90deg,#2563EB,#FF6B00)",
                    boxShadow:"0 0 12px rgba(255,107,0,0.6)",
                    transition:"width 0.3s ease" }}/>
                </div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.2)", marginTop:8,
                  fontFamily:"'DM Mono',monospace", textAlign:"center" }}>
                  18th Lok Sabha · PRS Legislative Research
                </div>
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div style={{ textAlign:"center", padding:"60px", borderRadius:20,
              background:"rgba(239,68,68,0.05)", border:"1px solid rgba(239,68,68,0.2)" }}>
              <div style={{ fontSize:14, fontWeight:600, color:"rgba(255,255,255,0.5)", marginBottom:16 }}>
                Failed to load MP data
              </div>
              <button onClick={load} style={{ padding:"10px 24px", borderRadius:10, cursor:"pointer",
                background:"rgba(255,107,0,0.1)", border:"1px solid rgba(255,107,0,0.3)",
                color:"#FF6B00", fontWeight:700, fontFamily:"'DM Sans',sans-serif", fontSize:13 }}>
                Retry
              </button>
            </div>
          )}

          {/* Table */}
          {!loading && !error && (
            <div style={{ borderRadius:20, border:"1px solid rgba(255,255,255,0.07)",
              overflow:"hidden", boxShadow:"0 20px 60px rgba(0,0,0,0.4)" }}>

              {/* Column header */}
              <div style={{ display:"grid",
                gridTemplateColumns:"60px 1fr 110px 110px 90px 100px 56px",
                padding:"14px 22px",
                background:"linear-gradient(135deg,rgba(10,22,40,0.98),rgba(5,12,26,0.98))",
                borderBottom:"1px solid rgba(255,255,255,0.06)",
                backdropFilter:"blur(10px)" }}>
                {[
                  ["#", ""],
                  ["MP", "user"],
                  ["Attendance", "attend"],
                  ["Questions", "question"],
                  ["Debates", "debate"],
                  ["LCI Score", "lci"],
                  ["Grade", "grade"],
                ].map(([l, ic], i) => (
                  <div key={l} style={{ display:"flex", alignItems:"center", gap:5,
                    justifyContent: i > 1 ? "center" : "flex-start" }}>
                    {ic && <Icon id={ic} size={10} color="rgba(255,107,0,0.5)"/>}
                    <span style={{ fontSize:8.5, fontWeight:800, color:"rgba(255,255,255,0.2)",
                      textTransform:"uppercase", letterSpacing:"0.18em",
                      fontFamily:"'DM Mono',monospace" }}>{l}</span>
                  </div>
                ))}
              </div>

              {/* Rows */}
              {pageData.map((mp, i) => {
                const rank    = (page-1)*PER_PAGE + i + 1;
                const grade   = getGrade(mp.lci);
                const isSil   = mp.q === 0 && mp.deb === 0;
                const attC    = mp.att >= 75 ? "#00C853" : mp.att >= 50 ? "#FF6B00" : "#EF4444";
                const isHov   = hovRow === rank;
                const rowBg   = rank <= 3
                  ? `rgba(${rank===1?"245,158,11":rank===2?"148,163,184":"205,127,50"},0.04)`
                  : isSil ? "rgba(239,68,68,0.03)" : "transparent";

                return (
                  <div key={mp.name+i} className="mp-row"
                    onMouseEnter={() => setHovRow(rank)}
                    onMouseLeave={() => setHovRow(null)}
                    style={{ display:"grid",
                      gridTemplateColumns:"60px 1fr 110px 110px 90px 100px 56px",
                      padding:"14px 22px",
                      borderBottom:"1px solid rgba(255,255,255,0.04)",
                      background: isHov
                        ? "rgba(255,107,0,0.06)"
                        : rowBg,
                      alignItems:"center",
                      animation:`slideUp 0.5s ${(i % PER_PAGE) * 18}ms ease both`,
                      position:"relative" }}>

                    {/* Hover accent line */}
                    {isHov && <div style={{ position:"absolute", left:0, top:0, bottom:0, width:2,
                      background:"linear-gradient(180deg,transparent,#FF6B00,transparent)" }}/>}

                    {/* Rank */}
                    <div style={{ display:"flex", justifyContent:"flex-start" }}>
                      <RankBadge rank={rank}/>
                    </div>

                    {/* Name + state + party */}
                    <div style={{ minWidth:0, paddingRight:12 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:7, flexWrap:"wrap" }}>
                        <Link href={`/mp/${encodeURIComponent(mp.name)}`} className="name-link"
                          style={{ fontSize:13.5, fontWeight:700, color:"rgba(255,255,255,0.9)",
                            textDecoration:"none", whiteSpace:"nowrap", overflow:"hidden",
                            textOverflow:"ellipsis", maxWidth:200 }}>
                          {mp.name}
                        </Link>
                        {isSil && (
                          <span style={{ display:"inline-flex", alignItems:"center", gap:3,
                            fontSize:8, fontWeight:800, color:"#EF4444",
                            background:"rgba(239,68,68,0.1)", borderRadius:4,
                            padding:"2px 6px", letterSpacing:"0.1em", flexShrink:0,
                            border:"1px solid rgba(239,68,68,0.2)" }}>
                            <Icon id="silent" size={8} color="#EF4444"/>SILENT
                          </span>
                        )}
                        {rank <= 3 && (
                          <Icon id="star" size={10}
                            color={rank===1?"#F59E0B":rank===2?"#94A3B8":"#CD7F32"}/>
                        )}
                      </div>
                      <div style={{ fontSize:10.5, color:"rgba(255,255,255,0.2)", marginTop:4,
                        display:"flex", alignItems:"center", gap:4, fontFamily:"'DM Mono',monospace" }}>
                        {mp.state && (
                          <span style={{ display:"flex", alignItems:"center", gap:3 }}>
                            <Icon id="map" size={8} color="rgba(255,255,255,0.15)"/>{mp.state}
                          </span>
                        )}
                        {mp.state && mp.party && <span style={{ opacity:0.2 }}>·</span>}
                        {mp.party && (
                          <span style={{ display:"flex", alignItems:"center", gap:3 }}>
                            <Icon id="flag" size={8} color="rgba(255,255,255,0.15)"/>{mp.party}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Attendance */}
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:14, fontWeight:700, color:attC,
                        fontFamily:"'Playfair Display',serif",
                        textShadow:`0 0 12px ${attC}60` }}>
                        {mp.att.toFixed(1)}%
                      </span>
                      <Bar val={mp.att} max={100} color={attC} delay={i*20}/>
                    </div>

                    {/* Questions */}
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:14, fontWeight:700, color:"#10B981",
                        fontFamily:"'Playfair Display',serif",
                        textShadow:"0 0 12px rgba(16,185,129,0.5)" }}>
                        {mp.q}
                      </span>
                      <Bar val={mp.q} max={maxQ} color="#10B981" delay={i*20+30}/>
                    </div>

                    {/* Debates */}
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:14, fontWeight:700, color:"#8B5CF6",
                        fontFamily:"'Playfair Display',serif",
                        textShadow:"0 0 12px rgba(139,92,246,0.5)" }}>
                        {mp.deb}
                      </span>
                      <Bar val={mp.deb} max={maxDeb} color="#8B5CF6" delay={i*20+60}/>
                    </div>

                    {/* LCI */}
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:14, fontWeight:700, color:"#3B82F6",
                        fontFamily:"'Playfair Display',serif",
                        textShadow:"0 0 12px rgba(59,130,246,0.5)" }}>
                        {mp.lci.toFixed(3)}
                      </span>
                      <Bar val={mp.lci} max={maxLCI} color="#3B82F6" delay={i*20+90}/>
                    </div>

                    {/* Grade badge */}
                    <div style={{ display:"flex", justifyContent:"center" }}>
                      <div className="grade-badge"
                        style={{ width:36, height:36, borderRadius:10,
                          background:grade.bg, border:`1px solid ${grade.color}40`,
                          display:"flex", alignItems:"center", justifyContent:"center",
                          fontSize:11, fontWeight:900, color:grade.color,
                          fontFamily:"'DM Mono',monospace",
                          boxShadow:`0 0 16px ${grade.color}30, inset 0 1px 0 ${grade.color}20` }}>
                        {grade.g}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Empty state */}
              {pageData.length === 0 && !loading && (
                <div style={{ textAlign:"center", padding:"80px 0" }}>
                  <div style={{ fontSize:32, marginBottom:12, opacity:0.2 }}>🔍</div>
                  <div style={{ fontSize:14, fontWeight:600, color:"rgba(255,255,255,0.2)" }}>
                    No MPs match your filters
                  </div>
                </div>
              )}

              {/* ─── PAGINATION ── */}
              {totalPages > 1 && (
                <div style={{ padding:"18px 22px", display:"flex", alignItems:"center",
                  justifyContent:"space-between", flexWrap:"wrap", gap:12,
                  background:"rgba(5,12,26,0.6)", borderTop:"1px solid rgba(255,255,255,0.05)",
                  backdropFilter:"blur(10px)" }}>
                  <span style={{ fontSize:11, color:"rgba(255,255,255,0.2)", fontFamily:"'DM Mono',monospace" }}>
                    {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE, filtered.length)} of {filtered.length} MPs
                  </span>
                  <div style={{ display:"flex", gap:5, alignItems:"center", flexWrap:"wrap" }}>
                    {/* Prev */}
                    <button className="pg-btn" onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
                      style={{ display:"flex", alignItems:"center", gap:4, padding:"7px 14px",
                        borderRadius:9, border:"1px solid rgba(255,255,255,0.08)",
                        background:"rgba(255,255,255,0.03)", cursor:page===1?"not-allowed":"pointer",
                        fontSize:11, fontWeight:700, color:page===1?"rgba(255,255,255,0.15)":"rgba(255,255,255,0.6)",
                        fontFamily:"'DM Sans',sans-serif", opacity:page===1?0.4:1 }}>
                      <Icon id="chevleft" size={11} color="currentColor"/>Prev
                    </button>

                    {/* Page numbers */}
                    {pageNums().map((p, idx) => (
                      typeof p === "number" ? (
                        <button key={idx} className="pg-btn" onClick={() => setPage(p)}
                          style={{ width:32, height:32, borderRadius:8,
                            border:`1px solid ${p===page ? "#FF6B00" : "rgba(255,255,255,0.08)"}`,
                            background: p===page
                              ? "linear-gradient(135deg,#EA580C,#FF6B00)"
                              : "rgba(255,255,255,0.03)",
                            cursor:"pointer", fontSize:11, fontWeight:p===page?700:400,
                            color: p===page ? "white" : "rgba(255,255,255,0.4)",
                            fontFamily:"'DM Mono',monospace",
                            boxShadow: p===page ? "0 0 16px rgba(255,107,0,0.4)" : "none" }}>
                          {p}
                        </button>
                      ) : (
                        <span key={idx} style={{ color:"rgba(255,255,255,0.2)", fontSize:11, padding:"0 2px",
                          fontFamily:"'DM Mono',monospace" }}>…</span>
                      )
                    ))}

                    {/* Next */}
                    <button className="pg-btn" onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
                      style={{ display:"flex", alignItems:"center", gap:4, padding:"7px 14px",
                        borderRadius:9, border:"1px solid rgba(255,255,255,0.08)",
                        background:"rgba(255,255,255,0.03)", cursor:page===totalPages?"not-allowed":"pointer",
                        fontSize:11, fontWeight:700, color:page===totalPages?"rgba(255,255,255,0.15)":"rgba(255,255,255,0.6)",
                        fontFamily:"'DM Sans',sans-serif", opacity:page===totalPages?0.4:1 }}>
                      Next<Icon id="chevright" size={11} color="currentColor"/>
                    </button>
                  </div>
                  <span style={{ fontSize:10, color:"rgba(255,255,255,0.12)", fontFamily:"'DM Mono',monospace" }}>
                    Page {page} / {totalPages}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}