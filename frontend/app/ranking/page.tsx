"use client";
import { useState, useEffect, useRef } from "react";
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
  if (lci >= 0.75) return { g:"A", color:"#059669", bg:"#D1FAE5" };
  if (lci >= 0.5)  return { g:"B", color:"#FF6B00", bg:"#FEF3C7" };
  if (lci >= 0.25) return { g:"C", color:"#D97706", bg:"#FEF9C3" };
  if (lci >= 0.1)  return { g:"D", color:"#DC2626", bg:"#FEE2E2" };
  return               { g:"F", color:"#7F1D1D", bg:"#FCA5A5" };
}

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
    user:      <svg style={s} viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...p}/><circle cx="12" cy="7" r="4" {...p}/></svg>,
    map:       <svg style={s} viewBox="0 0 24 24"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" {...p}/><line x1="8" y1="2" x2="8" y2="18" {...p}/><line x1="16" y1="6" x2="16" y2="22" {...p}/></svg>,
    flag:      <svg style={s} viewBox="0 0 24 24"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" {...p}/><line x1="4" y1="22" x2="4" y2="15" {...p}/></svg>,
    close:     <svg style={s} viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" {...p}/></svg>,
    refresh:   <svg style={s} viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10" {...p}/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" {...p}/></svg>,
  };
  return map[id] ?? <svg style={s} viewBox="0 0 24 24"/>;
}

function Bar({ val, max, color, delay=0 }: { val:number; max:number; color:string; delay?:number }) {
  const [w, setW] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setTimeout(() => setW(Math.min((val/Math.max(max,1))*100,100)), delay);
    }, { threshold:0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [val, max, delay]);
  return (
    <div ref={ref} style={{ width:72, height:4, background:"#F0E8DF", borderRadius:2, overflow:"hidden" }}>
      <div style={{ height:"100%", width:`${w}%`, background:color, borderRadius:2,
        transition:"width 0.9s cubic-bezier(0.4,0,0.2,1)",
        boxShadow:w>60?`0 0 6px ${color}80`:"none" }}/>
    </div>
  );
}

function DomeBg() {
  return (
    <svg style={{ position:"absolute",right:0,top:0,height:"100%",opacity:0.09,pointerEvents:"none" }}
      viewBox="0 0 600 300" preserveAspectRatio="xMaxYMid meet">
      <path d="M80 210 Q300 30 520 210" fill="none" stroke="white" strokeWidth="2"/>
      {[120,155,190,225,260,295,330,365,400,435,470].map((x,i)=>(
        <rect key={i} x={x-1.5} y="170" width="3" height="42" fill="white" opacity="0.7"/>
      ))}
      <rect x="78" y="208" width="444" height="7" fill="white"/>
      <rect x="58" y="215" width="484" height="5" fill="white"/>
      <ellipse cx="300" cy="208" rx="222" ry="20" fill="none" stroke="white" strokeWidth="1"/>
      <line x1="300" y1="32" x2="300" y2="76" stroke="white" strokeWidth="2.5"/>
      <circle cx="300" cy="28" r="13" fill="none" stroke="white" strokeWidth="1.5"/>
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg,i)=>{
        const r=deg*Math.PI/180;
        return <line key={i} x1="300" y1="28" x2={300+11*Math.cos(r)} y2={28+11*Math.sin(r)} stroke="white" strokeWidth="0.8"/>;
      })}
      {Array.from({length:24}).map((_,i)=>(
        <circle key={i} cx={130+(i%8)*37} cy={238+(Math.floor(i/8)*13)} r="2.5" fill="white" opacity="0.35"/>
      ))}
    </svg>
  );
}

export default function RankingPage() {
  const [raw,         setRaw]         = useState<any[]>([]);
  const [filtered,    setFiltered]    = useState<any[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(false);
  const [sortBy,      setSortBy]      = useState<SortKey>("lci");
  const [search,      setSearch]      = useState("");
  const [stateFilter, setStateFilter] = useState("All");
  const [partyFilter, setPartyFilter] = useState("All");
  const [silentOnly,  setSilentOnly]  = useState(false);
  const [page,        setPage]        = useState(1);
  const [sideOpen,    setSideOpen]    = useState(true);
  const [vis,         setVis]         = useState(false);
  const PER_PAGE = 25;

  useEffect(() => { setTimeout(()=>setVis(true),80); load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await getNationalRankings(undefined, 1, 543);
      const list: any[] = res.rankings ?? res.data ?? res ?? [];
      setRaw(list.map(normalizeMP));
    } catch { setError(true); }
    setLoading(false);
  }

  useEffect(() => {
    let list = [...raw];
    if (silentOnly) list = list.filter(m=>m.q===0&&m.deb===0);
    if (stateFilter!=="All") list = list.filter(m=>m.state===stateFilter);
    if (partyFilter!=="All") list = list.filter(m=>m.party===partyFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(m=>m.name?.toLowerCase().includes(q)||m.state?.toLowerCase().includes(q)||m.party?.toLowerCase().includes(q));
    }
    list.sort((a,b)=>{
      if (sortBy==="attendance") return b.att-a.att;
      if (sortBy==="lci")        return b.lci-a.lci;
      if (sortBy==="questions")  return b.q-a.q;
      if (sortBy==="debates")    return b.deb-a.deb;
      return 0;
    });
    setFiltered(list); setPage(1);
  }, [raw,sortBy,search,stateFilter,partyFilter,silentOnly]);

  const states  = ["All",...Array.from(new Set(raw.map(m=>m.state).filter(Boolean))).sort() as string[]];
  const parties = ["All",...Array.from(new Set(raw.map(m=>m.party).filter(Boolean))).sort() as string[]];
  const maxQ   = Math.max(...raw.map(m=>m.q),1);
  const maxDeb = Math.max(...raw.map(m=>m.deb),1);
  const maxLCI = Math.max(...raw.map(m=>m.lci),1);
  const silentCount = raw.filter(m=>m.q===0&&m.deb===0).length;
  const lowAtt      = raw.filter(m=>m.att<50).length;
  const pageData    = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);
  const totalPages  = Math.ceil(filtered.length/PER_PAGE);

  const fadeIn=(d:number):React.CSSProperties=>({
    opacity:vis?1:0, transform:vis?"translateY(0)":"translateY(16px)",
    transition:`opacity 0.6s ease ${d}ms,transform 0.6s cubic-bezier(0.4,0,0.2,1) ${d}ms`,
  });
  const sel:React.CSSProperties={
    width:"100%",border:"1px solid #E0D8CE",borderRadius:10,padding:"9px 12px",
    fontSize:12,color:"#1A1A2E",fontFamily:"'DM Sans',sans-serif",outline:"none",
    background:"#FAFAF7",cursor:"pointer",appearance:"none" as any,
  };
  const sortTabs:[SortKey,string,string,string][]=[
    ["lci","LCI Score","lci","#2563EB"],
    ["attendance","Attendance","attend","#FF6B00"],
    ["questions","Questions","question","#059669"],
    ["debates","Debates","debate","#7C3AED"],
  ];

  return (
    <div style={{minHeight:"100vh",fontFamily:"'DM Sans',sans-serif",background:"#F4EFE8",color:"#1A1A2E"}}>
      <style>{`
        @keyframes spin    {to{transform:rotate(360deg)}}
        @keyframes blink   {0%,100%{opacity:1}50%{opacity:0.25}}
        @keyframes floatUp {0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes shimmer {0%{left:-60%}100%{left:120%}}
        @keyframes fadeUp  {from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        *,*::before,*::after{box-sizing:border-box;}
        ::selection{background:rgba(255,107,0,0.2);}
        ::-webkit-scrollbar{width:5px;}
        ::-webkit-scrollbar-track{background:#EDE8E0;}
        ::-webkit-scrollbar-thumb{background:#D4CAC0;border-radius:3px;}
        .mp-row{transition:background 0.15s,transform 0.15s;}
        .mp-row:hover{background:#FFF8F2!important;transform:translateX(2px);}
        .sort-tab{transition:all 0.2s cubic-bezier(0.4,0,0.2,1);}
        .sort-tab:hover{transform:translateY(-1px);}
        .page-btn{transition:all 0.15s;}
        .page-btn:hover:not(:disabled){border-color:#FF6B00!important;color:#FF6B00!important;}
        .name-link{transition:color 0.15s;}
        .name-link:hover{color:#FF6B00!important;}
      `}</style>

      {/* HERO */}
      <div style={{background:"linear-gradient(135deg,#0A1628 0%,#1E293B 55%,#0F172A 100%)",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,pointerEvents:"none",backgroundImage:"radial-gradient(rgba(255,107,0,0.06) 1px,transparent 1px)",backgroundSize:"20px 20px"}}/>
        <DomeBg/>
        <div style={{height:3,background:"linear-gradient(90deg,#FF6B00 33%,rgba(255,255,255,0.1) 33%,rgba(255,255,255,0.1) 66%,#138808 66%)"}}/>
        <div style={{position:"absolute",left:0,top:0,bottom:0,width:4,background:"linear-gradient(180deg,transparent,#FF6B00 20%,#FF6B00 80%,transparent)"}}/>
        <div style={{position:"absolute",left:"-2%",top:"50%",transform:"translateY(-50%)",width:320,height:320,borderRadius:"50%",pointerEvents:"none",background:"radial-gradient(circle,rgba(255,107,0,0.14) 0%,transparent 70%)",animation:"floatUp 7s ease-in-out infinite"}}/>

        <div style={{maxWidth:1280,margin:"0 auto",padding:"40px 64px 0",position:"relative",zIndex:1}}>
          <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",flexWrap:"wrap",gap:24}}>
            <div style={{...fadeIn(0)}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                <div style={{width:3,height:16,background:"#FF6B00",borderRadius:2}}/>
                <span style={{fontSize:9.5,fontWeight:800,color:"#FF6B00",textTransform:"uppercase",letterSpacing:"0.24em"}}>LokDrishti · National Rankings</span>
              </div>
              <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(36px,4.5vw,66px)",fontWeight:700,color:"white",letterSpacing:"-2px",lineHeight:0.95,marginBottom:16}}>
                All 543 MPs.<br/><em style={{color:"#FF6B00"}}>Ranked. Graded. Exposed.</em>
              </h1>
              <p style={{fontSize:13,color:"rgba(255,255,255,0.38)",maxWidth:440,lineHeight:1.75}}>
                Every member of the 18th Lok Sabha ranked by attendance, questions raised, debate participation, and LCI Score — no politics, just data.
              </p>
            </div>
            {!loading&&(
              <div style={{display:"flex",gap:0,...fadeIn(120)}}>
                {[{n:"543",l:"MPs Tracked",c:"white"},{n:String(silentCount),l:"Silent MPs",c:"#F87171"},{n:String(lowAtt),l:"<50% Attend",c:"#FBBF24"}].map((s,i)=>(
                  <div key={s.l} style={{paddingRight:i<2?32:0,marginRight:i<2?32:0,borderRight:i<2?"1px solid rgba(255,255,255,0.08)":"none"}}>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:40,fontWeight:700,color:s.c,lineHeight:1}}>{s.n}</div>
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.28)",textTransform:"uppercase",letterSpacing:"0.12em",marginTop:3}}>{s.l}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sort tabs */}
          <div style={{display:"flex",gap:6,marginTop:32}}>
            {sortTabs.map(([key,label,icon,color])=>{
              const on=sortBy===key;
              return (
                <button key={key} onClick={()=>setSortBy(key)} className="sort-tab"
                  style={{display:"flex",alignItems:"center",gap:7,padding:"10px 20px",
                    background:on?color:"rgba(255,255,255,0.05)",
                    border:on?"none":"1px solid rgba(255,255,255,0.08)",
                    borderRadius:"10px 10px 0 0",cursor:"pointer",
                    color:on?"white":"rgba(255,255,255,0.4)",
                    fontSize:12,fontWeight:700,fontFamily:"'DM Sans',sans-serif",
                    position:"relative",overflow:"hidden"}}>
                  {on&&<div style={{position:"absolute",bottom:0,left:0,right:0,height:2,overflow:"hidden"}}>
                    <div style={{position:"absolute",top:0,bottom:0,width:"50%",background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)",animation:"shimmer 1.8s ease-in-out infinite"}}/>
                  </div>}
                  <Icon id={icon} size={13} color={on?"white":"rgba(255,255,255,0.35)"}/>
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* BODY */}
      <div style={{maxWidth:1280,margin:"0 auto",padding:"28px 64px 60px",display:"flex",gap:20,alignItems:"flex-start"}}>

        {/* SIDEBAR */}
        <aside style={{width:sideOpen?212:52,flexShrink:0,transition:"width 0.25s ease",overflow:"hidden"}}>
          <button onClick={()=>setSideOpen(p=>!p)}
            style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"10px 12px",
              background:"white",border:"1px solid #E0D8CE",borderRadius:12,cursor:"pointer",
              marginBottom:12,fontSize:11,fontWeight:700,color:"#1A1A2E",fontFamily:"'DM Sans',sans-serif",
              whiteSpace:"nowrap",boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}>
            <Icon id="filter" size={15} color="#FF6B00"/>
            {sideOpen&&<><span>Filters</span><div style={{marginLeft:"auto"}}><Icon id="chevleft" size={13} color="#8A9AB0"/></div></>}
          </button>

          {sideOpen&&(
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {/* Search */}
              <div style={{background:"white",borderRadius:14,border:"1px solid #E0D8CE",padding:"13px 13px",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
                <div style={{fontSize:9,fontWeight:800,color:"#8A9AB0",textTransform:"uppercase",letterSpacing:"0.18em",marginBottom:8,display:"flex",alignItems:"center",gap:5}}>
                  <Icon id="search" size={11} color="#8A9AB0"/>SEARCH
                </div>
                <div style={{position:"relative"}}>
                  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Name, state, party…"
                    style={{width:"100%",border:"1px solid #E0D8CE",borderRadius:9,padding:"8px 10px 8px 28px",fontSize:12,color:"#1A1A2E",fontFamily:"'DM Sans',sans-serif",outline:"none",background:"#FAFAF7"}}/>
                  <div style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)"}}>
                    <Icon id="search" size={12} color="#C4B8A8"/>
                  </div>
                  {search&&<button onClick={()=>setSearch("")} style={{position:"absolute",right:7,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",padding:0}}>
                    <Icon id="close" size={11} color="#8A9AB0"/>
                  </button>}
                </div>
              </div>
              {/* State */}
              <div style={{background:"white",borderRadius:14,border:"1px solid #E0D8CE",padding:"13px 13px",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
                <div style={{fontSize:9,fontWeight:800,color:"#8A9AB0",textTransform:"uppercase",letterSpacing:"0.18em",marginBottom:8,display:"flex",alignItems:"center",gap:5}}>
                  <Icon id="map" size={11} color="#8A9AB0"/>STATE
                </div>
                <div style={{position:"relative"}}>
                  <select value={stateFilter} onChange={e=>setStateFilter(e.target.value)} style={sel}>
                    {states.slice(0,50).map(s=><option key={s}>{s}</option>)}
                  </select>
                  <div style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}>
                    <Icon id="chevdown" size={12} color="#8A9AB0"/>
                  </div>
                </div>
              </div>
              {/* Party */}
              <div style={{background:"white",borderRadius:14,border:"1px solid #E0D8CE",padding:"13px 13px",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
                <div style={{fontSize:9,fontWeight:800,color:"#8A9AB0",textTransform:"uppercase",letterSpacing:"0.18em",marginBottom:8,display:"flex",alignItems:"center",gap:5}}>
                  <Icon id="flag" size={11} color="#8A9AB0"/>PARTY
                </div>
                <div style={{position:"relative"}}>
                  <select value={partyFilter} onChange={e=>setPartyFilter(e.target.value)} style={sel}>
                    {parties.slice(0,60).map(p=><option key={p}>{p}</option>)}
                  </select>
                  <div style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}>
                    <Icon id="chevdown" size={12} color="#8A9AB0"/>
                  </div>
                </div>
              </div>
              {/* Silent toggle */}
              <button onClick={()=>setSilentOnly(p=>!p)}
                style={{padding:"12px 13px",borderRadius:14,cursor:"pointer",textAlign:"left",
                  background:silentOnly?"#FEF2F2":"white",
                  border:silentOnly?"1.5px solid #FCA5A5":"1px solid #E0D8CE",
                  fontFamily:"'DM Sans',sans-serif",boxShadow:"0 2px 8px rgba(0,0,0,0.04)",transition:"all 0.2s"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                  <Icon id="silent" size={13} color={silentOnly?"#DC2626":"#8A9AB0"}/>
                  <span style={{fontSize:12,fontWeight:700,color:silentOnly?"#DC2626":"#1A1A2E"}}>Silent MPs</span>
                  {silentOnly&&<div style={{marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:"#DC2626",animation:"blink 1.5s ease-in-out infinite"}}/>}
                </div>
                <div style={{fontSize:10,color:"#8A9AB0",paddingLeft:21}}>0 questions · 0 debates</div>
              </button>
              {/* Reset */}
              {(search||stateFilter!=="All"||partyFilter!=="All"||silentOnly)&&(
                <button onClick={()=>{setSearch("");setStateFilter("All");setPartyFilter("All");setSilentOnly(false);}}
                  style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"9px",borderRadius:10,cursor:"pointer",background:"#FFF4EC",border:"1px solid #FFD4B2",fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,color:"#FF6B00",transition:"all 0.2s"}}>
                  <Icon id="refresh" size={12} color="#FF6B00"/>Reset filters
                </button>
              )}
              {/* Count */}
              <div style={{padding:"14px",borderRadius:14,background:"#0A1628",textAlign:"center",boxShadow:"0 4px 16px rgba(10,22,40,0.2)"}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:34,fontWeight:700,color:"#FF6B00",lineHeight:1}}>{filtered.length}</div>
                <div style={{fontSize:9.5,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:"0.14em",marginTop:3}}>MPs shown</div>
              </div>
            </div>
          )}
        </aside>

        {/* TABLE */}
        <div style={{flex:1,minWidth:0}}>
          {loading&&(
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"80px 0",gap:16}}>
              <div style={{position:"relative",width:44,height:44}}>
                <div style={{position:"absolute",inset:0,borderRadius:"50%",border:"3px solid rgba(255,107,0,0.12)",borderTop:"3px solid #FF6B00",animation:"spin 0.8s linear infinite"}}/>
                <div style={{position:"absolute",inset:8,borderRadius:"50%",border:"2px solid rgba(255,107,0,0.06)",borderBottom:"2px solid rgba(255,107,0,0.4)",animation:"spin 1.2s linear infinite reverse"}}/>
              </div>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:14,fontWeight:600,color:"#1A1A2E",marginBottom:3}}>Loading 543 MPs…</div>
                <div style={{fontSize:11,color:"#8A9AB0"}}>18th Lok Sabha · PRS Research</div>
              </div>
            </div>
          )}
          {error&&(
            <div style={{textAlign:"center",padding:"60px",background:"white",borderRadius:20,border:"1px solid #E0D8CE"}}>
              <div style={{display:"flex",justifyContent:"center",marginBottom:12,opacity:0.25}}>
                <Icon id="refresh" size={40} color="#1A1A2E"/>
              </div>
              <div style={{fontSize:14,fontWeight:600,color:"#1A1A2E",marginBottom:6}}>Loading data from LokDrishti servers...</div>
              <div style={{fontSize:12,color:"#8A9AB0"}}>Loading data from LokDrishti servers...</div>
            </div>
          )}
          {!loading&&!error&&(
            <div style={{background:"white",borderRadius:20,border:"1px solid #E0D8CE",overflow:"hidden",boxShadow:"0 4px 32px rgba(10,22,40,0.07)"}}>
              {/* Header */}
              <div style={{display:"grid",gridTemplateColumns:"52px 1fr 108px 108px 90px 90px 52px",padding:"13px 20px",background:"linear-gradient(135deg,#0A1628,#1E293B)",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
                {[["#",""],["MP","user"],["Attend","attend"],["Questions","question"],["Debates","debate"],["LCI Score","lci"],["Grade","grade"]].map(([l,ic],i)=>(
                  <div key={l} style={{display:"flex",alignItems:"center",gap:5,justifyContent:i>1?"center":"flex-start"}}>
                    {ic&&<Icon id={ic} size={11} color="rgba(255,255,255,0.3)"/>}
                    <span style={{fontSize:9,fontWeight:800,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:"0.14em"}}>{l}</span>
                  </div>
                ))}
              </div>
              {/* Rows */}
              {pageData.map((mp,i)=>{
                const rank=(page-1)*PER_PAGE+i+1;
                const grade=getGrade(mp.lci);
                const isSilent=mp.q===0&&mp.deb===0;
                const attC=mp.att>=75?"#059669":mp.att>=50?"#FF6B00":"#DC2626";
                const mc=rank===1?"#F59E0B":rank===2?"#94A3B8":rank===3?"#CD7F32":"#E0D8CE";
                return (
                  <div key={mp.name+i} className="mp-row"
                    style={{display:"grid",gridTemplateColumns:"52px 1fr 108px 108px 90px 90px 52px",padding:"13px 20px",borderBottom:"1px solid #F5EFE8",background:isSilent?"#FFF5F5":"white",alignItems:"center",animation:`fadeUp 0.5s ${(i%PER_PAGE)*16}ms ease both`}}>
                    <div>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:700,color:mc,lineHeight:1,textShadow:rank<=3?`0 0 12px ${mc}60`:"none"}}>
                        {String(rank).padStart(2,"0")}
                      </div>
                      {rank<=3&&<div style={{width:20,height:2,background:mc,borderRadius:1,marginTop:3,boxShadow:`0 0 6px ${mc}`}}/>}
                    </div>
                    <div style={{minWidth:0,paddingRight:12}}>
                      <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}>
                        <Link href={`/mp/${encodeURIComponent(mp.name)}`} className="name-link"
                          style={{fontSize:14,fontWeight:700,color:"#1A1A2E",textDecoration:"none",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:200}}>
                          {mp.name}
                        </Link>
                        {isSilent&&<span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:8.5,fontWeight:800,color:"#DC2626",background:"#FEE2E2",borderRadius:4,padding:"2px 6px",letterSpacing:"0.1em",flexShrink:0}}>
                          <Icon id="silent" size={9} color="#DC2626"/>SILENT
                        </span>}
                      </div>
                      <div style={{fontSize:11,color:"#8A9AB0",marginTop:3,display:"flex",alignItems:"center",gap:4}}>
                        {mp.state&&<span style={{display:"flex",alignItems:"center",gap:3}}><Icon id="map" size={9} color="#C4B8A8"/>{mp.state}</span>}
                        {mp.state&&mp.party&&<span style={{opacity:0.3}}>·</span>}
                        {mp.party&&<span style={{display:"flex",alignItems:"center",gap:3}}><Icon id="flag" size={9} color="#C4B8A8"/>{mp.party}</span>}
                      </div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                      <span style={{fontSize:13,fontWeight:700,color:attC,fontFamily:"'Cormorant Garamond',serif"}}>{mp.att.toFixed(1)}%</span>
                      <Bar val={mp.att} max={100} color={attC} delay={i*16}/>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                      <span style={{fontSize:13,fontWeight:700,color:"#059669",fontFamily:"'Cormorant Garamond',serif"}}>{mp.q}</span>
                      <Bar val={mp.q} max={maxQ} color="#059669" delay={i*16+40}/>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                      <span style={{fontSize:13,fontWeight:700,color:"#7C3AED",fontFamily:"'Cormorant Garamond',serif"}}>{mp.deb}</span>
                      <Bar val={mp.deb} max={maxDeb} color="#7C3AED" delay={i*16+80}/>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                      <span style={{fontSize:13,fontWeight:700,color:"#2563EB",fontFamily:"'Cormorant Garamond',serif"}}>{mp.lci.toFixed(3)}</span>
                      <Bar val={mp.lci} max={maxLCI} color="#2563EB" delay={i*16+120}/>
                    </div>
                    <div style={{display:"flex",justifyContent:"center"}}>
                      <div style={{width:34,height:34,borderRadius:9,background:grade.bg,border:`1.5px solid ${grade.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:grade.color,boxShadow:`0 2px 8px ${grade.color}20`}}>
                        {grade.g}
                      </div>
                    </div>
                  </div>
                );
              })}
              {pageData.length===0&&!loading&&(
                <div style={{textAlign:"center",padding:"60px 0"}}>
                  <div style={{display:"flex",justifyContent:"center",marginBottom:12,opacity:0.2}}><Icon id="search" size={40} color="#1A1A2E"/></div>
                  <div style={{fontSize:14,fontWeight:600,color:"#8A9AB0"}}>No MPs match your filters</div>
                </div>
              )}
              {/* Pagination */}
              {totalPages>1&&(
                <div style={{padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#FAFAF7",borderTop:"1px solid #F0E8DF"}}>
                  <span style={{fontSize:12,color:"#8A9AB0"}}>
                    Showing {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE,filtered.length)} of {filtered.length}
                  </span>
                  <div style={{display:"flex",gap:6}}>
                    <button className="page-btn" onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
                      style={{display:"flex",alignItems:"center",gap:4,padding:"7px 14px",borderRadius:9,border:"1px solid #E0D8CE",background:"white",cursor:page===1?"not-allowed":"pointer",fontSize:12,color:page===1?"#C4B8A8":"#1A1A2E",fontFamily:"'DM Sans',sans-serif"}}>
                      <Icon id="chevleft" size={12} color={page===1?"#C4B8A8":"#1A1A2E"}/>Prev
                    </button>
                    {Array.from({length:Math.min(5,totalPages)},(_,idx)=>{
                      const p=Math.max(1,Math.min(page-2,totalPages-4))+idx;
                      return <button key={p} onClick={()=>setPage(p)} style={{width:34,height:34,borderRadius:9,border:`1px solid ${p===page?"#FF6B00":"#E0D8CE"}`,background:p===page?"#FF6B00":"white",cursor:"pointer",fontSize:12,fontWeight:p===page?700:400,color:p===page?"white":"#1A1A2E",fontFamily:"'DM Sans',sans-serif",transition:"all 0.15s"}}>{p}</button>;
                    })}
                    <button className="page-btn" onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
                      style={{display:"flex",alignItems:"center",gap:4,padding:"7px 14px",borderRadius:9,border:"1px solid #E0D8CE",background:"white",cursor:page===totalPages?"not-allowed":"pointer",fontSize:12,color:page===totalPages?"#C4B8A8":"#1A1A2E",fontFamily:"'DM Sans',sans-serif"}}>
                      Next<Icon id="chevright" size={12} color={page===totalPages?"#C4B8A8":"#1A1A2E"}/>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}