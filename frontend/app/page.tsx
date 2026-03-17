"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

/* ── Dynamic imports so client page can use these components ── */
const Chakra          = dynamic(() => import("@/components/chakra"),         { ssr: false });
const CheckYourMP     = dynamic(() => import("@/components/checkyourmp"),    { ssr: false });
const FeatureCardsHome= dynamic(() => import("@/components/featurecardshome"),{ ssr: false });

/* ══════════════════════════════════════════════════════════
   CURSOR GLOW
══════════════════════════════════════════════════════════ */
function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current)
        ref.current.style.transform = `translate(${e.clientX-200}px,${e.clientY-200}px)`;
    };
    window.addEventListener("mousemove", h, { passive: true });
    return () => window.removeEventListener("mousemove", h);
  }, []);
  return (
    <div ref={ref} style={{
      position:"fixed",top:0,left:0,width:400,height:400,
      borderRadius:"50%",pointerEvents:"none",zIndex:9998,
      background:"radial-gradient(circle,rgba(255,107,0,0.07) 0%,transparent 65%)",
      transition:"transform 0.13s ease",willChange:"transform",
    }}/>
  );
}

/* ══════════════════════════════════════════════════════════
   MAGNETIC BUTTON
══════════════════════════════════════════════════════════ */
function MagBtn({ href, primary, children }: { href:string; primary?:boolean; children:React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const move = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX-r.left-r.width/2)*0.28}px,${(e.clientY-r.top-r.height/2)*0.28}px)`;
  };
  const leave = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <Link ref={ref} href={href}
      onMouseMove={move} onMouseLeave={leave}
      className={primary ? "mag-p" : "mag-s"}
      style={{ transition:"transform 0.3s cubic-bezier(0.4,0,0.2,1),box-shadow 0.2s,background 0.2s,color 0.2s,border-color 0.2s", willChange:"transform" }}>
      {children}
    </Link>
  );
}

/* ══════════════════════════════════════════════════════════
   COUNT-UP STAT
══════════════════════════════════════════════════════════ */
function CountUp({ to, suffix="" }: { to:number; suffix?:string }) {
  const [val, setVal] = useState(0);
  const ref  = useRef<HTMLDivElement>(null);
  const done = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        let v = 0; const inc = to / (900/16);
        const t = setInterval(() => {
          v += inc; if (v >= to) { setVal(to); clearInterval(t); } else setVal(Math.floor(v));
        }, 16);
      }
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return (
    <div ref={ref} style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:40, fontWeight:700, color:"#0A1628", lineHeight:1 }}>
      {val}{suffix}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════════════════ */
function Reveal({ children, delay=0, fromLeft=false }: { children:React.ReactNode; delay?:number; fromLeft?:boolean }) {
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
      opacity: vis?1:0,
      transform: vis?"translate(0,0)": fromLeft?"translateX(-28px)":"translateY(32px)",
      transition:`opacity 0.72s ease ${delay}ms,transform 0.72s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   METRIC ROW
══════════════════════════════════════════════════════════ */
function MetricRow({ num, name, desc, color, last }: { num:string; name:string; desc:string; color:string; last?:boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ display:"flex", alignItems:"center", gap:20, padding:"20px 16px 20px 8px",
        borderRadius:10, borderBottom:last?"none":"1px solid rgba(255,255,255,0.06)",
        background:hov?"rgba(255,255,255,0.035)":"transparent",
        transform:hov?"translateX(8px)":"translateX(0)",
        transition:"all 0.25s cubic-bezier(0.4,0,0.2,1)", cursor:"default" }}>
      {/* SVG ring */}
      <div style={{ position:"relative", width:44, height:44, flexShrink:0 }}>
        <svg width="44" height="44" viewBox="0 0 44 44" style={{ position:"absolute", inset:0 }}>
          <circle cx="22" cy="22" r="18" fill="none" stroke={`${color}20`} strokeWidth="1.5"/>
          <circle cx="22" cy="22" r="18" fill="none" stroke={color} strokeWidth="1.5"
            strokeDasharray={`${hov?75:22} 113`} strokeLinecap="round"
            style={{ transformOrigin:"center", transform:"rotate(-90deg)", transition:"stroke-dasharray 0.45s ease" }}/>
        </svg>
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center",
          fontFamily:"'Cormorant Garamond',serif", fontSize:12, fontWeight:700, color }}>{num}</div>
      </div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:15, fontWeight:700, color:hov?color:"white", transition:"color 0.25s", marginBottom:3 }}>{name}</div>
        <div style={{ fontSize:12, color:"rgba(255,255,255,0.35)" }}>{desc}</div>
      </div>
      <div style={{ height:2, background:color, borderRadius:1, flexShrink:0,
        width:hov?40:24, opacity:hov?1:0.35, boxShadow:hov?`0 0 8px ${color}`:"none",
        transition:"all 0.3s ease" }}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MADE BY PIYUSH
══════════════════════════════════════════════════════════ */
function MadeBy() {
  const [hov, setHov] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      background: "#060D1A",
      padding: "56px 24px 48px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 0,
      position: "relative",
      overflow: "hidden",
      borderTop: "1px solid rgba(255,255,255,0.05)",
    }}>

      {/* Subtle ambient glow behind the card */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: 500, height: 200,
        background: "radial-gradient(ellipse, rgba(255,107,0,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
        opacity: visible ? 1 : 0,
        transition: "opacity 1s ease 0.3s",
      }}/>

      {/* Label above */}
      <div style={{
        fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.2)",
        letterSpacing: "0.28em", textTransform: "uppercase",
        marginBottom: 20,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
      }}>
        Designed &amp; Built by
      </div>

      {/* Main card */}
      <a
        href="https://github.com/PiyushLadukar"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          padding: "16px 28px 16px 16px",
          borderRadius: 100,
          textDecoration: "none",
          background: hov
            ? "rgba(255,107,0,0.1)"
            : "rgba(255,255,255,0.04)",
          border: `1px solid ${hov ? "rgba(255,107,0,0.4)" : "rgba(255,255,255,0.08)"}`,
          boxShadow: hov
            ? "0 0 40px rgba(255,107,0,0.2), 0 8px 32px rgba(0,0,0,0.4)"
            : "0 4px 24px rgba(0,0,0,0.3)",
          transform: hov ? "scale(1.04) translateY(-2px)" : "scale(1) translateY(0)",
          transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
          opacity: visible ? 1 : 0,
          transitionDelay: visible ? "0.25s" : "0s",
          backdropFilter: "blur(12px)",
          cursor: "pointer",
          position: "relative",
        }}
      >
        {/* Avatar with spinning ring */}
        <div style={{ position: "relative", width: 44, height: 44, flexShrink: 0 }}>
          {/* Spinning conic ring */}
          <div style={{
            position: "absolute", inset: -3, borderRadius: "50%",
            background: "conic-gradient(#FF6B00, #FFB347, #FF6B00, transparent, #FF6B00)",
            animation: hov ? "spin360 1.5s linear infinite" : "spin360 4s linear infinite",
            transition: "animation-duration 0.3s",
          }}/>
          {/* White gap ring */}
          <div style={{
            position: "absolute", inset: -1, borderRadius: "50%",
            background: "#060D1A",
          }}/>
          {/* Avatar image */}
          <img
            src="https://github.com/PiyushLadukar.png"
            alt="Piyush Ladukar"
            width={44}
            height={44}
            style={{
              position: "relative",
              width: 44, height: 44,
              borderRadius: "50%",
              objectFit: "cover",
              display: "block",
              filter: hov ? "brightness(1.1)" : "brightness(1)",
              transition: "filter 0.3s",
            }}
            onError={(e) => {
              // Fallback to initials if image fails
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          {/* Fallback initials (hidden if image loads) */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            background: "linear-gradient(135deg,#FF6B00,#FF8C00)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 16, fontWeight: 700, color: "white",
            zIndex: -1,
          }}>PL</div>
        </div>

        {/* Text */}
        <div>
          <div style={{
            fontSize: 15, fontWeight: 700,
            color: hov ? "#FF6B00" : "rgba(255,255,255,0.85)",
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "-0.2px",
            transition: "color 0.3s",
            lineHeight: 1.2,
          }}>
            Piyush Ladukar
          </div>
          <div style={{
            fontSize: 11, color: "rgba(255,255,255,0.3)",
            fontFamily: "'DM Sans', sans-serif",
            marginTop: 3, display: "flex", alignItems: "center", gap: 5,
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"
              style={{ color: hov ? "#FF6B00" : "rgba(255,255,255,0.3)", transition: "color 0.3s" }}>
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            github.com/PiyushLadukar
          </div>
        </div>

        {/* Arrow */}
        <div style={{
          marginLeft: 8,
          opacity: hov ? 1 : 0.3,
          transform: hov ? "translateX(0)" : "translateX(-4px)",
          transition: "all 0.3s",
          color: "#FF6B00",
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </a>

      {/* Bottom tagline */}
      <div style={{
        marginTop: 20, fontSize: 10, color: "rgba(255,255,255,0.15)",
        fontFamily: "'DM Sans', sans-serif",
        letterSpacing: "0.12em",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.7s ease 0.5s, transform 0.7s ease 0.5s",
        textAlign: "center",
      }}>
        Built with ❤️ for civic transparency · LokDrishti © {new Date().getFullYear()}
      </div>

      <style>{`
        @keyframes spin360 { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PARALLAX HOOKS (scroll)
══════════════════════════════════════════════════════════ */
function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const h = () => setY(window.scrollY);
    window.addEventListener("scroll", h, { passive:true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return y;
}

/* ══════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════ */
export default function Home() {
  const scrollY = useScrollY();

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:"#FAFAF7", color:"#0A1628", overflowX:"hidden" }}>
      <CursorGlow/>

      <style>{`
        @keyframes pulse    {0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(0.8)}}
        @keyframes blink    {0%,100%{opacity:1}50%{opacity:0.25}}
        @keyframes ticker   {from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes fadeUp   {from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes lineGrow {from{width:0}to{width:48px}}
        @keyframes glowQ    {0%,100%{text-shadow:0 0 16px rgba(255,107,0,0.15)}50%{text-shadow:0 0 40px rgba(255,107,0,0.65),0 0 70px rgba(255,107,0,0.2)}}
        @keyframes floatY   {0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes scanline {0%{top:-80px}100%{top:110%}}
        @keyframes gradShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes orbitSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}

        /* Magnetic buttons */
        .mag-p{display:inline-flex;align-items:center;gap:8px;padding:14px 30px;background:#FF6B00;color:white;border-radius:100px;text-decoration:none;font-weight:700;font-size:14px;box-shadow:0 4px 28px rgba(255,107,0,0.38);}
        .mag-p:hover{box-shadow:0 8px 40px rgba(255,107,0,0.6)!important;background:#E86000!important;}
        .mag-p svg{transition:transform 0.3s;}
        .mag-p:hover svg{transform:translateX(4px);}

        .mag-s{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;background:white;color:#0A1628;border:1.5px solid #D4CAC0;border-radius:100px;text-decoration:none;font-weight:600;font-size:14px;box-shadow:0 2px 8px rgba(10,22,40,0.06);}
        .mag-s:hover{border-color:#FF6B00!important;color:#FF6B00!important;box-shadow:0 4px 20px rgba(255,107,0,0.18)!important;}

        /* Fact card hover */
        .fc{position:relative;overflow:hidden;transition:transform 0.35s cubic-bezier(0.4,0,0.2,1),box-shadow 0.35s;}
        .fc::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.07),transparent 60%);opacity:0;transition:opacity 0.3s;pointer-events:none;}
        .fc:hover{transform:translateY(-6px) scale(1.01);box-shadow:0 28px 60px rgba(0,0,0,0.25);}
        .fc:hover::after{opacity:1;}

        /* Scanline */
        .sl{position:absolute;left:0;right:0;height:80px;background:linear-gradient(180deg,transparent,rgba(255,255,255,0.012),transparent);animation:scanline 8s linear infinite;pointer-events:none;z-index:0;}

        /* CTA + utility */
        .silent{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:700;color:#DC2626;text-decoration:none;padding:6px 14px;border:1.5px solid #DC2626;border-radius:100px;transition:all 0.2s;}
        .silent:hover{background:#DC2626;color:white;}
        .abtn{display:inline-flex;align-items:center;gap:8px;padding:12px 26px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:100px;text-decoration:none;font-size:13px;font-weight:600;color:rgba(255,255,255,0.7);transition:all 0.2s;}
        .abtn:hover{background:rgba(255,255,255,0.12);color:white;transform:translateY(-1px);}
        .abtn svg{transition:transform 0.3s;}
        .abtn:hover svg{transform:translateX(4px);}
        .cdark{display:inline-flex;align-items:center;gap:8px;padding:15px 36px;background:#0A1628;color:white;border-radius:100px;text-decoration:none;font-weight:700;font-size:14px;box-shadow:0 4px 24px rgba(10,22,40,0.4);transition:all 0.22s;}
        .cdark:hover{background:#1a2a42;transform:translateY(-2px);box-shadow:0 10px 36px rgba(10,22,40,0.55);}
        .cdark svg{transition:transform 0.3s;}
        .cdark:hover svg{transform:translateX(4px);}
        .cghost{display:inline-flex;align-items:center;gap:8px;padding:15px 36px;background:rgba(255,255,255,0.15);color:white;border:1.5px solid rgba(255,255,255,0.3);border-radius:100px;text-decoration:none;font-weight:600;font-size:14px;transition:all 0.2s;}
        .cghost:hover{background:rgba(255,255,255,0.25);transform:translateY(-1px);}

        *,*::before,*::after{box-sizing:border-box;}
        ::selection{background:rgba(255,107,0,0.2);}
      `}</style>

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section style={{ minHeight:"100vh", display:"grid", gridTemplateColumns:"1fr 1fr",
        alignItems:"center", position:"relative", overflow:"hidden",
        padding:"100px 80px 60px", background:"#FAFAF7" }}>

        {/* Tricolor */}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:3, zIndex:10,
          background:"linear-gradient(90deg,#FF6B00 33%,#FAFAF7 33%,#FAFAF7 66%,#138808 66%)" }}/>

        {/* Parallax LOK watermark */}
        <div style={{ position:"absolute", left:-20, top:"50%",
          transform:`translateY(calc(-52% + ${scrollY*0.14}px))`,
          fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(200px,28vw,420px)",
          fontWeight:900, lineHeight:0.85, letterSpacing:-8,
          color:"transparent", WebkitTextStroke:"1.5px rgba(10,22,40,0.04)",
          userSelect:"none", pointerEvents:"none", zIndex:0, whiteSpace:"nowrap",
          willChange:"transform" }}>LOK</div>

        {/* Dot grid */}
        <div style={{ position:"absolute", inset:0, zIndex:0,
          backgroundImage:"radial-gradient(circle,rgba(10,22,40,0.04) 1px,transparent 1px)",
          backgroundSize:"24px 24px", pointerEvents:"none" }}/>

        {/* Orange orb float */}
        <div style={{ position:"absolute", right:"8%", bottom:"12%", width:320, height:320,
          borderRadius:"50%", pointerEvents:"none", zIndex:0,
          background:"radial-gradient(circle,rgba(255,107,0,0.08) 0%,transparent 70%)",
          animation:"floatY 6s ease-in-out infinite" }}/>

        {/* LEFT */}
        <div style={{ position:"relative", zIndex:2 }}>
          {/* Badges */}
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap",
            marginBottom:36, animation:"fadeUp 0.55s ease both" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:"white",
              border:"1px solid #E2D9CE", borderRadius:"100px", padding:"5px 14px",
              boxShadow:"0 2px 8px rgba(10,22,40,0.06)" }}>
              <span style={{ fontSize:11, color:"#6B7A8D", fontWeight:600, letterSpacing:"0.06em" }}>
                No bias · No politics · Just data
              </span>
            </div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:7,
              background:"#FF6B0012", border:"1px solid #FF6B0035", borderRadius:"100px", padding:"5px 14px" }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:"#FF6B00",
                animation:"pulse 2s ease-in-out infinite", boxShadow:"0 0 8px rgba(255,107,0,0.7)" }}/>
              <span style={{ fontSize:11, color:"#FF6B00", fontWeight:700,
                letterSpacing:"0.1em", textTransform:"uppercase" }}>Live · 18th Lok Sabha</span>
            </div>
          </div>

          {/* Headline — staggered */}
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(52px,5.5vw,88px)",
            lineHeight:0.95, fontWeight:700, marginBottom:28, color:"#0A1628", letterSpacing:"-2.5px" }}>
            <span style={{ display:"block", animation:"fadeUp 0.7s 0.10s cubic-bezier(0.4,0,0.2,1) both" }}>
              Every Vote.
            </span>
            <span style={{ display:"block", animation:"fadeUp 0.7s 0.22s cubic-bezier(0.4,0,0.2,1) both" }}>
              Every <em style={{ color:"#FF6B00", fontStyle:"italic",
                animation:"glowQ 3.5s ease-in-out infinite" }}>Question.</em>
            </span>
            <span style={{ display:"block", animation:"fadeUp 0.7s 0.34s cubic-bezier(0.4,0,0.2,1) both" }}>
              Every MP.
            </span>
          </h1>

          {/* Accent line draws itself */}
          <div style={{ height:3, background:"#FF6B00", borderRadius:2, marginBottom:24,
            animation:"lineGrow 0.8s 0.5s ease both", width:48, transformOrigin:"left" }}/>

          <p style={{ fontSize:16, color:"#5A6475", lineHeight:1.8, maxWidth:420,
            marginBottom:40, animation:"fadeUp 0.7s 0.42s ease both" }}>
            Real parliamentary performance of all{" "}
            <strong style={{ color:"#0A1628" }}>543 MPs</strong> in India's 18th Lok Sabha —
            built on open data from PRS Legislative Research.
          </p>

          {/* Magnetic buttons */}
          <div style={{ display:"flex", gap:12, flexWrap:"wrap", alignItems:"center",
            animation:"fadeUp 0.7s 0.54s ease both" }}>
            <MagBtn href="/ranking" primary>
              Explore Rankings
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M8 3l5 5-5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </MagBtn>
            <MagBtn href="/analytics">View Analytics</MagBtn>
          </div>

          {/* Animated CountUp stats */}
          <div style={{ display:"flex", gap:0, marginTop:52, paddingTop:32,
            borderTop:"1px solid #E2D9CE", animation:"fadeUp 0.7s 0.66s ease both" }}>
            {[{n:543,l:"MPs Tracked",s:""},{n:28,l:"States & UTs",s:""},{n:40,l:"Parties",s:"+"}].map((s,i)=>(
              <div key={s.l} style={{ paddingRight:36, marginRight:36,
                borderRight:i<2?"1px solid #E2D9CE":"none" }}>
                <CountUp to={s.n} suffix={s.s}/>
                <div style={{ fontSize:11, color:"#8A9AB0", fontWeight:600,
                  textTransform:"uppercase", letterSpacing:"0.1em", marginTop:4 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Chakra parallax */}
        <div style={{ position:"relative", zIndex:2, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%",
            background:"radial-gradient(circle,rgba(37,99,235,0.07) 0%,transparent 70%)",
            pointerEvents:"none", animation:"floatY 8s ease-in-out infinite reverse" }}/>
          <div style={{ width:"clamp(380px,44vw,540px)", aspectRatio:"1/1", flexShrink:0,
            animation:"fadeUp 0.8s 0.3s ease both",
            transform:`translateY(${scrollY*-0.05}px)`,
            transition:"transform 0.1s linear", willChange:"transform" }}>
            <Chakra/>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div style={{ background:"#0A1628", padding:"11px 0", overflow:"hidden", whiteSpace:"nowrap" }}>
        <div style={{ display:"inline-block", animation:"ticker 40s linear infinite",
          fontSize:11, fontWeight:600, letterSpacing:"0.16em",
          textTransform:"uppercase", color:"rgba(255,255,255,0.35)" }}>
          {Array.from({length:8}).map((_,i)=>(
            <span key={i} style={{ marginRight:48 }}>
              543 MPs Analysed <span style={{ color:"#FF6B00",margin:"0 16px" }}>·</span>
              18th Lok Sabha <span style={{ color:"#FF6B00",margin:"0 16px" }}>·</span>
              Attendance · Debates · Questions <span style={{ color:"#FF6B00",margin:"0 16px" }}>·</span>
              No Bias. Just Data. <span style={{ color:"#FF6B00",margin:"0 16px" }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* DATA ALERT */}
      <div style={{ background:"#FFFBF5", borderBottom:"1px solid #FDDCAA", padding:"14px 80px" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", display:"flex",
          alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:"#DC2626",
                animation:"blink 1.5s ease-in-out infinite", boxShadow:"0 0 6px rgba(220,38,38,0.5)" }}/>
              <span style={{ fontSize:10, fontWeight:800, color:"#DC2626",
                letterSpacing:"0.12em", textTransform:"uppercase" }}>Data Alert</span>
            </div>
            <div style={{ width:1, height:16, background:"#E2D9CE" }}/>
            <span style={{ fontSize:14, color:"#0A1628", fontWeight:500 }}>
              A significant number of MPs have{" "}
              <strong style={{ color:"#DC2626" }}>never asked a single question</strong>{" "}
              in Parliament this session.
            </span>
          </div>
          <Link href="/ranking" className="silent">
            See Silent MPs
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* ══ FACTS ══════════════════════════════════════════════ */}
      <section style={{ background:"#FAFAF7" }}>
        <Reveal>
          <div style={{ padding:"72px 80px 0", maxWidth:1280, margin:"0 auto" }}>
            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:48 }}>
              <div style={{ width:24, height:2, background:"#FF6B00", borderRadius:1 }}/>
              <span style={{ fontSize:11, fontWeight:700, color:"#FF6B00",
                textTransform:"uppercase", letterSpacing:"0.18em" }}>
                Just the Facts — No Opinion, Only Data
              </span>
            </div>
          </div>
        </Reveal>
        <div style={{ display:"grid", gridTemplateColumns:"1.3fr 1fr 1fr 0.9fr" }}>
          {[
            { bg:"#0A1628", n:"01", accC:"#FF6B00",               labelC:"rgba(255,255,255,0.3)", label:"Attendance Crisis", stat:"1 in 5",    statC:"#FF6B00", body:"MPs attended less than",    bold:"50% of sessions",        boldC:"white",   textC:"rgba(255,255,255,0.55)", numC:"rgba(255,255,255,0.05)", bl:false },
            { bg:"#FF6B00", n:"02", accC:"rgba(255,255,255,0.4)",  labelC:"rgba(255,255,255,0.55)",label:"Question Gap",      stat:"Top 10",    statC:"white",   body:"MPs asked more than the",  bold:"bottom 200",             boldC:"white",   textC:"rgba(255,255,255,0.8)",  numC:"rgba(255,255,255,0.07)", bl:true },
            { bg:"#F3EFE8", n:"03", accC:"#0057A8",                labelC:"#8A9AB0",               label:"State Divide",      stat:"28",        statC:"#0057A8", body:"States show",              bold:"dramatically different",  boldC:"#0A1628", textC:"#5A6475",               numC:"rgba(10,22,40,0.035)",   bl:true },
            { bg:"#138808", n:"04", accC:"rgba(255,255,255,0.35)", labelC:"rgba(255,255,255,0.45)",label:"Transparency",      stat:"Open\nData",statC:"white",   body:"PRS Legislative Research —",bold:"zero spin",             boldC:"white",   textC:"rgba(255,255,255,0.75)",numC:"rgba(255,255,255,0.05)", bl:true, sm:true },
          ].map((f,i)=>(
            <Reveal key={f.n} delay={i*80}>
              <div className="fc" style={{ background:f.bg, padding:"60px 44px", height:"100%",
                borderLeft:f.bl?"1px solid rgba(255,255,255,0.04)":"none" }}>
                <div style={{ position:"absolute", right:-10, bottom:-20,
                  fontFamily:"'Cormorant Garamond',serif", fontSize:180, fontWeight:900,
                  color:f.numC, lineHeight:1, userSelect:"none" }}>{f.n}</div>
                <div style={{ width:32, height:3, background:f.accC, borderRadius:2, marginBottom:20 }}/>
                <div style={{ fontSize:10, fontWeight:700, color:f.labelC,
                  textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:20 }}>{f.label}</div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif",
                  fontSize:f.sm?64:84, fontWeight:700, color:f.statC,
                  lineHeight:0.88, marginBottom:24, letterSpacing:-3, whiteSpace:"pre-line" }}>{f.stat}</div>
                <p style={{ fontSize:15, color:f.textC, lineHeight:1.7 }}>
                  {f.body}{" "}<strong style={{ color:f.boldC }}>{f.bold}</strong>
                  {f.n==="03"?" engagement":""}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ CHECK YOUR MP ════════════════════════════════════ */}
      <section style={{ padding:"100px 80px", background:"#0F1923", position:"relative", overflow:"hidden" }}>
        <div className="sl"/>
        <div style={{ position:"absolute", inset:0,
          backgroundImage:"radial-gradient(circle,rgba(255,107,0,0.04) 1px,transparent 1px)",
          backgroundSize:"28px 28px", pointerEvents:"none", zIndex:0 }}/>
        <div style={{ position:"absolute", top:"30%", left:"50%", transform:"translate(-50%,-50%)",
          width:800, height:400,
          background:"radial-gradient(ellipse,rgba(255,107,0,0.07) 0%,transparent 70%)",
          pointerEvents:"none", animation:"floatY 8s ease-in-out infinite" }}/>
        <div style={{ position:"absolute", left:24, top:"50%", transform:"translateY(-50%) rotate(-90deg)",
          fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.1)",
          letterSpacing:"0.3em", textTransform:"uppercase", whiteSpace:"nowrap" }}>
          Civic Intelligence Engine
        </div>
        <div style={{ maxWidth:900, margin:"0 auto", position:"relative", zIndex:1 }}>
          <Reveal>
            <div style={{ textAlign:"center", marginBottom:56 }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:10, marginBottom:20,
                background:"rgba(255,107,0,0.1)", border:"1px solid rgba(255,107,0,0.2)",
                borderRadius:"100px", padding:"6px 16px" }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:"#FF6B00",
                  animation:"pulse 2s ease-in-out infinite" }}/>
                <span style={{ fontSize:11, fontWeight:700, color:"#FF6B00",
                  textTransform:"uppercase", letterSpacing:"0.15em" }}>Check Your MP</span>
              </div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif",
                fontSize:"clamp(40px,5vw,68px)", fontWeight:700, color:"white",
                letterSpacing:"-1.5px", marginBottom:16, lineHeight:1.0 }}>
                How does <em style={{ color:"#FF6B00" }}>your MP</em> perform?
              </h2>
              <p style={{ fontSize:15, color:"rgba(255,255,255,0.4)", maxWidth:420,
                margin:"0 auto", lineHeight:1.75 }}>
                Type any MP's name. Get instant attendance, debate record, questions raised, and a performance grade.
              </p>
            </div>
          </Reveal>
          <Reveal delay={160}><CheckYourMP/></Reveal>
        </div>
      </section>

      {/* ══ FEATURE CARDS ════════════════════════════════════ */}
      <section style={{ padding:"100px 80px", background:"#FAFAF7", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:4,
          background:"linear-gradient(180deg,transparent,#FF6B00 30%,#FF6B00 70%,transparent)",
          pointerEvents:"none" }}/>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <Reveal>
            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14 }}>
              <div style={{ width:24, height:2, background:"#FF6B00", borderRadius:1 }}/>
              <span style={{ fontSize:11, fontWeight:700, color:"#FF6B00",
                textTransform:"uppercase", letterSpacing:"0.18em" }}>Explore the Platform</span>
            </div>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif",
              fontSize:"clamp(34px,3.8vw,56px)", fontWeight:700, color:"#0A1628",
              marginBottom:56, letterSpacing:"-0.5px", lineHeight:1.05 }}>
              Everything you need to hold Parliament{" "}
              <em style={{ color:"#FF6B00" }}>accountable</em>
            </h2>
          </Reveal>
          <Reveal delay={100}><FeatureCardsHome/></Reveal>
        </div>
      </section>

      {/* ══ METRICS ══════════════════════════════════════════ */}
      <section style={{ padding:"100px 80px", background:"#0A1628", position:"relative", overflow:"hidden" }}>
        <div className="sl"/>
        <div style={{ position:"absolute", inset:0,
          backgroundImage:"radial-gradient(circle,rgba(255,255,255,0.02) 1px,transparent 1px)",
          backgroundSize:"24px 24px", pointerEvents:"none", zIndex:0 }}/>
        {/* Orbit rings */}
        <div style={{ position:"absolute", right:-80, top:"50%", transform:"translateY(-50%)",
          width:560, height:560, pointerEvents:"none", zIndex:0 }}>
          {[560,440,320,200].map((sz,i)=>(
            <div key={i} style={{ position:"absolute", top:"50%", left:"50%",
              width:sz, height:sz, transform:"translate(-50%,-50%)", borderRadius:"50%",
              border:`1px solid rgba(255,107,0,${0.04+i*0.02})`,
              animation:`orbitSpin ${18+i*7}s linear infinite ${i%2?"reverse":""}` }}/>
          ))}
          <div style={{ position:"absolute", top:"50%", left:"50%",
            transform:"translate(-50%,-50%)", width:8, height:8,
            borderRadius:"50%", background:"#FF6B00",
            boxShadow:"0 0 20px rgba(255,107,0,0.8)" }}/>
        </div>

        <div style={{ maxWidth:1280, margin:"0 auto", position:"relative", zIndex:1 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1.45fr", gap:80, alignItems:"center" }}>
            <Reveal fromLeft>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
                  <div style={{ width:24, height:2, background:"#FF6B00", borderRadius:1 }}/>
                  <span style={{ fontSize:11, fontWeight:700, color:"rgba(255,107,0,0.7)",
                    textTransform:"uppercase", letterSpacing:"0.18em" }}>Zero Opinion</span>
                </div>
                <h2 style={{ fontFamily:"'Cormorant Garamond',serif",
                  fontSize:"clamp(36px,4vw,58px)", fontWeight:700, color:"white",
                  letterSpacing:"-1px", lineHeight:1.0, marginBottom:28 }}>
                  What LokDrishti<br/>actually{" "}
                  <em style={{ color:"#FF6B00" }}>measures</em>
                </h2>
                <p style={{ fontSize:14, color:"rgba(255,255,255,0.35)", lineHeight:1.8,
                  marginBottom:40, maxWidth:280 }}>
                  11 objective metrics. No editorial spin. No political bias. Pure parliamentary data.
                </p>
                <Link href="/analytics" className="abtn">
                  View All Analytics
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M7 2l5 5-5 5" stroke="rgba(255,255,255,0.7)"
                      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <div style={{ display:"flex", gap:10, marginTop:32, flexWrap:"wrap" }}>
                  {[{n:"11",l:"Metrics"},{n:"0",l:"Bias"},{n:"544",l:"MPs"}].map((p,i)=>(
                    <Reveal key={i} delay={i*70}>
                      <div style={{ padding:"8px 16px", borderRadius:"100px",
                        background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)" }}>
                        <span style={{ fontFamily:"'Cormorant Garamond',serif",
                          fontSize:20, fontWeight:700, color:"#FF6B00" }}>{p.n} </span>
                        <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)",
                          fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em" }}>{p.l}</span>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </Reveal>

            <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
              {[
                {num:"01",name:"LCI Score",          desc:"Composite civic performance index",           color:"#FF6B00"},
                {num:"02",name:"Attendance Rate",     desc:"Sessions attended vs total sittings",        color:"#60A5FA"},
                {num:"03",name:"Debate Participation",desc:"Debates initiated or participated in",        color:"#34D399"},
                {num:"04",name:"Questions Raised",    desc:"Starred, unstarred & supplementary",         color:"#FF6B00"},
                {num:"05",name:"State Strength Index",desc:"Weighted state-level aggregate performance",  color:"#60A5FA"},
                {num:"06",name:"Silent MP Detector",  desc:"Zero-engagement critical accountability flag",color:"#F87171"},
              ].map((m,i)=>(
                <Reveal key={m.num} delay={i*55}>
                  <MetricRow {...m} last={i===5}/>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA ══════════════════════════════════════════════ */}
      <section style={{ padding:"130px 80px", textAlign:"center",
        position:"relative", overflow:"hidden",
        background:"linear-gradient(270deg,#E05500,#FF8C00,#f1893f,#E05500)",
        backgroundSize:"400% 400%", animation:"gradShift 9s ease infinite" }}>
        <div style={{ position:"absolute", inset:0,
          backgroundImage:"radial-gradient(circle,rgba(255,255,255,0.06) 1px,transparent 1px)",
          backgroundSize:"28px 28px", pointerEvents:"none", zIndex:0 }}/>
        <div style={{ position:"absolute", top:"50%", left:"50%",
          transform:"translate(-50%,-50%)",
          fontFamily:"'Cormorant Garamond',serif",
          fontSize:"clamp(140px,20vw,260px)", fontWeight:900, lineHeight:1,
          color:"transparent", WebkitTextStroke:"2px rgba(255,255,255,0.08)",
          whiteSpace:"nowrap", userSelect:"none", pointerEvents:"none", zIndex:0 }}>INDIA</div>

        <div style={{ position:"relative", zIndex:1 }}>
          <Reveal>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
              gap:10, marginBottom:20 }}>
              <div style={{ width:20, height:1, background:"rgba(255,255,255,0.65)" }}/>
              <span style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.76)",
                textTransform:"uppercase", letterSpacing:"0.2em" }}>
                Your Democracy. Your Data. Your Right.
              </span>
              <div style={{ width:20, height:1, background:"rgba(255,255,255,0.65)" }}/>
            </div>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif",
              fontSize:"clamp(52px,7vw,96px)", fontWeight:700, color:"white",
              lineHeight:0.92, letterSpacing:"-3px", marginBottom:28 }}>
              Hold Parliament<br/><span style={{ color:"#0A1628" }}>Accountable.</span>
            </h2>
            <p style={{ fontSize:15, color:"rgba(255,255,255,0.65)",
              maxWidth:360, margin:"0 auto 48px", lineHeight:1.8 }}>
              No noise. No opinion. Just the data your representatives don't want you to see.
            </p>
            <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
              <Link href="/ranking" className="cdark">
                Explore Rankings
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M8 3l5 5-5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="/analytics" className="cghost">View Analytics</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ MADE BY ══════════════════════════════════════════ */}
      <MadeBy />
    </div>
  );
}