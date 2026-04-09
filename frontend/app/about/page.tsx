"use client";
import { useState, useEffect, useRef, JSX } from "react";
import Link from "next/link";

/* ── Scroll reveal ─────────────────────────────────────────── */
function Reveal({ children, delay = 0, from = "bottom" }: {
  children: React.ReactNode; delay?: number; from?: "bottom" | "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obs.disconnect(); }
    }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const transform = vis ? "translate(0,0)" :
    from === "left" ? "translateX(-32px)" :
    from === "right" ? "translateX(32px)" : "translateY(28px)";
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0, transform,
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
    }}>{children}</div>
  );
}

/* ── SVG icons ─────────────────────────────────────────────── */
function Icon({ id, size = 20, color = "currentColor" }: { id: string; size?: number; color?: string }) {
  const s: React.CSSProperties = { width: size, height: size, display: "block", flexShrink: 0 };
  const p = { stroke: color, strokeWidth: "1.8", strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  const icons: Record<string, JSX.Element> = {
    eye:      <svg style={s} viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" {...p}/><circle cx="12" cy="12" r="3" {...p}/></svg>,
    shield:   <svg style={s} viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" {...p}/></svg>,
    data:     <svg style={s} viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3" {...p}/><path d="M21 12c0 1.66-4.03 3-9 3S3 13.66 3 12" {...p}/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" {...p}/></svg>,
    globe:    <svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" {...p}/><line x1="2" y1="12" x2="22" y2="12" {...p}/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" {...p}/></svg>,
    heart:    <svg style={s} viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" {...p}/></svg>,
    target:   <svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" {...p}/><circle cx="12" cy="12" r="6" {...p}/><circle cx="12" cy="12" r="2" {...p}/></svg>,
    book:     <svg style={s} viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" {...p}/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" {...p}/></svg>,
    arrow:    <svg style={s} viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" {...p}/></svg>,
    github:   <svg style={s} viewBox="0 0 24 24" fill={color} stroke="none"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>,
    star:     <svg style={s} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" {...p}/></svg>,
    check:    <svg style={s} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" {...p}/></svg>,
    users:    <svg style={s} viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" {...p}/><circle cx="9" cy="7" r="4" {...p}/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" {...p}/></svg>,
    chart:    <svg style={s} viewBox="0 0 24 24"><rect x="3" y="12" width="4" height="9" {...p}/><rect x="10" y="7" width="4" height="14" {...p}/><rect x="17" y="3" width="4" height="18" {...p}/><line x1="2" y1="21" x2="22" y2="21" {...p}/></svg>,
    lightning:<svg style={s} viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" {...p}/></svg>,
    lock:     <svg style={s} viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" {...p}/><path d="M7 11V7a5 5 0 0 1 10 0v4" {...p}/></svg>,
    scale:    <svg style={s} viewBox="0 0 24 24"><path d="M12 3v18M5 6l-2 6h4L5 6zM19 6l-2 6h4L19 6z" {...p}/><path d="M3 18h6M15 18h6M8 21h8" {...p}/></svg>,
  };
  return icons[id] ?? <svg style={s} viewBox="0 0 24 24"/>;
}

/* ── Parliament dome illustration ──────────────────────────── */
function ParliamentIllustration() {
  return (
    <svg viewBox="0 0 800 420" style={{ width: "100%", maxWidth: 700, opacity: 1 }}>
      {/* Sky */}
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0A1628"/>
          <stop offset="100%" stopColor="#1E3A8A"/>
        </linearGradient>
        <linearGradient id="buildingGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E293B"/>
          <stop offset="100%" stopColor="#0F172A"/>
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect width="800" height="420" fill="url(#skyGrad)" rx="20"/>

      {/* Stars */}
      {[30,80,150,220,320,450,560,650,720,760,50,180,380,500,680].map((x,i)=>(
        <circle key={i} cx={x} cy={20+(i%4)*18} r="1.2" fill="white" opacity={0.4+(i%3)*0.2}/>
      ))}

      {/* Main dome */}
      <path d="M180 280 Q400 80 620 280" fill="url(#buildingGrad)" stroke="#334155" strokeWidth="2"/>

      {/* Dome ribs */}
      {[220,270,320,370,400,430,480,530,580].map((x,i)=>{
        const t = (x-180)/(620-180);
        const y = 280 - Math.sin(t*Math.PI)*200 + 10;
        return <line key={i} x1={x} y1={y} x2={x} y2="280" stroke="#1E3A8A" strokeWidth="1" opacity="0.5"/>;
      })}

      {/* Wings */}
      <rect x="80" y="260" width="120" height="120" fill="url(#buildingGrad)" stroke="#334155" strokeWidth="1.5" rx="2"/>
      <rect x="600" y="260" width="120" height="120" fill="url(#buildingGrad)" stroke="#334155" strokeWidth="1.5" rx="2"/>

      {/* Wing windows */}
      {[0,1,2].map(i=>(
        <rect key={i} x={94+(i*36)} y="278" width="22" height="32" rx="11" fill="#1E3A8A" stroke="#3B82F6" strokeWidth="1" opacity="0.7"/>
      ))}
      {[0,1,2].map(i=>(
        <rect key={i} x={614+(i*36)} y="278" width="22" height="32" rx="11" fill="#1E3A8A" stroke="#3B82F6" strokeWidth="1" opacity="0.7"/>
      ))}

      {/* Columns */}
      {[200,235,270,305,340,375,410,445,480,515,550,585].map((x,i)=>(
        <rect key={i} x={x-3} y="230" width="6" height="52" fill="#334155" rx="1"/>
      ))}

      {/* Base */}
      <rect x="100" y="278" width="600" height="14" fill="#1E293B" stroke="#334155" strokeWidth="1"/>
      <rect x="78"  y="290" width="644" height="10" fill="#0F172A" stroke="#334155" strokeWidth="1"/>
      <rect x="56"  y="298" width="688" height="82" fill="url(#buildingGrad)" stroke="#334155" strokeWidth="1"/>

      {/* Ground floor doors */}
      {[140,270,365,400,435,530,660].map((x,i)=>(
        <rect key={i} x={x-14} y="320" width="28" height="60" rx="14" fill="#1E3A8A" stroke="#3B82F6" strokeWidth="0.8" opacity="0.8"/>
      ))}

      {/* Flagpole */}
      <line x1="400" y1="82" x2="400" y2="148" stroke="white" strokeWidth="3" filter="url(#glow)"/>

      {/* Ashoka Chakra */}
      <circle cx="400" cy="75" r="20" fill="none" stroke="#FF6B00" strokeWidth="2.5" filter="url(#glow)"/>
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg,i)=>{
        const r = deg*Math.PI/180;
        return <line key={i} x1="400" y1="75" x2={400+17*Math.cos(r)} y2={75+17*Math.sin(r)} stroke="#FF6B00" strokeWidth="1.2" opacity="0.8"/>;
      })}
      <circle cx="400" cy="75" r="4" fill="#FF6B00" filter="url(#glow)"/>

      {/* Tricolor flag */}
      <rect x="403" y="84"  width="48" height="16" fill="#FF6B00" rx="1"/>
      <rect x="403" y="100" width="48" height="16" fill="white"   rx="1"/>
      <rect x="403" y="116" width="48" height="16" fill="#138808" rx="1"/>

      {/* Lamp posts */}
      {[130,670].map((x,i)=>(
        <g key={i}>
          <line x1={x} y1="298" x2={x} y2="340" stroke="#475569" strokeWidth="3"/>
          <circle cx={x} cy="294" r="6" fill="#FBBF24" opacity="0.9" filter="url(#glow)"/>
          <circle cx={x} cy="294" r="12" fill="rgba(251,191,36,0.15)"/>
        </g>
      ))}

      {/* Seats (MP dots) */}
      {Array.from({length:30}).map((_,i)=>(
        <circle key={i} cx={156+(i%10)*49} cy={316+(Math.floor(i/10)*16)} r="4"
          fill={i<5?"#34D399":i<15?"#60A5FA":i<25?"#FBBF24":"#F87171"} opacity="0.7"/>
      ))}

      {/* Ground */}
      <rect x="0" y="378" width="800" height="42" fill="#0A1628" rx="0"/>
      <line x1="0" y1="378" x2="800" y2="378" stroke="#1E3A8A" strokeWidth="1.5"/>

      {/* LokDrishti label */}
      <text x="400" y="404" textAnchor="middle" fontSize="13" fontWeight="700"
        fill="rgba(255,255,255,0.35)" fontFamily="'DM Sans',sans-serif" letterSpacing="4">
        PARLIAMENT OF INDIA · 18TH LOK SABHA
      </text>
    </svg>
  );
}

/* ── Animated stat ──────────────────────────────────────────── */
function AnimStat({ to, label, color }: { to: number; label: string; color: string }) {
  const [v, setV] = useState(0);
  const done = useRef(false);
  const ref  = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        let cur = 0; const step = to / (1200 / 14);
        const t = setInterval(() => {
          cur += step;
          if (cur >= to) { setV(to); clearInterval(t); } else setV(Math.floor(cur));
        }, 14);
      }
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 56, fontWeight: 700,
        color, lineHeight: 1, marginBottom: 6 }}>{v}+</div>
      <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 600,
        textTransform: "uppercase", letterSpacing: "0.14em" }}>{label}</div>
    </div>
  );
}

/* ── Value card ─────────────────────────────────────────────── */
function ValueCard({ icon, title, desc, color, bg, delay }: any) {
  const [hov, setHov] = useState(false);
  return (
    <Reveal delay={delay}>
      <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{ background: "white", borderRadius: 20, padding: "28px 24px",
          border: `1.5px solid ${hov ? color + "40" : "#E5DDD5"}`,
          borderTop: `4px solid ${color}`,
          boxShadow: hov ? `0 16px 48px rgba(0,0,0,0.08), 0 0 0 1px ${color}15` : "0 2px 12px rgba(0,0,0,0.05)",
          transform: hov ? "translateY(-5px)" : "translateY(0)",
          transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)", cursor: "default" }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: bg,
          border: `1px solid ${color}20`, display: "flex", alignItems: "center",
          justifyContent: "center", marginBottom: 18,
          boxShadow: hov ? `0 0 20px ${color}30` : "none", transition: "box-shadow 0.3s" }}>
          <Icon id={icon} size={24} color={color}/>
        </div>
        <div style={{ fontSize: 17, fontWeight: 800, color: "#1A1A2E", marginBottom: 10,
          fontFamily: "'Cormorant Garamond',serif" }}>{title}</div>
        <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.75 }}>{desc}</div>
      </div>
    </Reveal>
  );
}

/* ── Timeline item ──────────────────────────────────────────── */
function TimelineItem({ step, title, desc, color, delay }: any) {
  return (
    <Reveal delay={delay} from="left">
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%",
            background: `${color}15`, border: `2px solid ${color}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, color }}>
            {step}
          </div>
          {step < 4 && <div style={{ width: 2, height: 40, background: `${color}20`, marginTop: 6 }}/>}
        </div>
        <div style={{ paddingBottom: 28 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#1A1A2E", marginBottom: 6,
            fontFamily: "'Cormorant Garamond',serif" }}>{title}</div>
          <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.75 }}>{desc}</div>
        </div>
      </div>
    </Reveal>
  );
}

/* ══ PAGE ════════════════════════════════════════════════════ */
export default function AboutPage() {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 80); }, []);

  const fadeIn = (d: number): React.CSSProperties => ({
    opacity: vis ? 1 : 0,
    transform: vis ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 0.7s ease ${d}ms, transform 0.7s cubic-bezier(0.4,0,0.2,1) ${d}ms`,
  });

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'DM Sans',sans-serif",
      background: "#F7F4EF", color: "#1A1A2E", overflowX: "hidden" }}>

      <style>{`
        @keyframes floatUp    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes spinSlow   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes shimmer    { 0%{left:-60%} 100%{left:120%} }
        @keyframes gradShift  { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        *,*::before,*::after  { box-sizing:border-box; }
        ::selection           { background:rgba(255,107,0,0.2); }
        ::-webkit-scrollbar   { width:5px; }
        ::-webkit-scrollbar-track { background:#EDE8E0; }
        ::-webkit-scrollbar-thumb { background:#D4CAC0; border-radius:3px; }
      `}</style>

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <div style={{ background: "linear-gradient(150deg,#0A1628 0%,#0F172A 45%,#1E293B 100%)",
        position: "relative", overflow: "hidden", paddingBottom: 0 }}>

        {/* Tricolor */}
        <div style={{ height: 3, background: "linear-gradient(90deg,#FF6B00 33%,rgba(255,255,255,0.12) 33%,rgba(255,255,255,0.12) 66%,#138808 66%)" }}/>

        {/* Dot texture */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px,transparent 1px)",
          backgroundSize: "22px 22px" }}/>

        {/* Orange glow orb */}
        <div style={{ position: "absolute", left: "5%", top: "40%", width: 400, height: 400,
          borderRadius: "50%", pointerEvents: "none",
          background: "radial-gradient(circle,rgba(255,107,0,0.12) 0%,transparent 70%)",
          animation: "floatUp 8s ease-in-out infinite" }}/>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 64px 0",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60,
          alignItems: "center", position: "relative", zIndex: 1 }}>

          {/* Left copy */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, ...fadeIn(0) }}>
              <div style={{ width: 3, height: 18, background: "#FF6B00", borderRadius: 2 }}/>
              <span style={{ fontSize: 10, fontWeight: 800, color: "#FF6B00",
                textTransform: "uppercase", letterSpacing: "0.26em" }}>About LokDrishti</span>
            </div>

            <h1 style={{ fontFamily: "'Cormorant Garamond',serif",
              fontSize: "clamp(42px,5vw,72px)", fontWeight: 700, color: "white",
              lineHeight: 0.95, letterSpacing: "-2.5px", marginBottom: 24, ...fadeIn(80) }}>
              Democracy<br/>
              needs a<br/>
              <em style={{ color: "#FF6B00" }}>Witness.</em>
            </h1>

            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.85,
              maxWidth: 480, marginBottom: 36, ...fadeIn(160) }}>
              LokDrishti (लोकदृष्टि) means <em style={{ color: "rgba(255,255,255,0.7)" }}>
              "the people's gaze"</em>. We built this platform so every Indian citizen can
              see exactly how their elected representatives perform in Parliament —
              no spin, no bias, just raw data.
            </p>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", ...fadeIn(240) }}>
              <Link href="/ranking" style={{ display: "inline-flex", alignItems: "center", gap: 8,
                padding: "14px 28px", background: "#FF6B00", color: "white", borderRadius: 100,
                textDecoration: "none", fontWeight: 700, fontSize: 14,
                boxShadow: "0 4px 24px rgba(255,107,0,0.4)", transition: "all 0.2s" }}
                onMouseEnter={e=>(e.currentTarget.style.transform="translateY(-2px)")}
                onMouseLeave={e=>(e.currentTarget.style.transform="none")}>
                Explore Rankings
                <Icon id="arrow" size={16} color="white"/>
              </Link>
              <a href="https://github.com/PiyushLadukar" target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "14px 28px", background: "rgba(255,255,255,0.07)",
                  color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 100, textDecoration: "none", fontWeight: 600, fontSize: 14,
                  transition: "all 0.2s" }}
                onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.14)")}
                onMouseLeave={e=>(e.currentTarget.style.background="rgba(255,255,255,0.07)")}>
                <Icon id="github" size={16} color="rgba(255,255,255,0.8)"/>
                View on GitHub
              </a>
            </div>
          </div>

          {/* Right — Parliament illustration */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", ...fadeIn(120) }}>
            <ParliamentIllustration/>
          </div>
        </div>
      </div>

      {/* ══ WHAT IS IT ════════════════════════════════════════ */}
      <section style={{ background: "white", padding: "80px 64px",
        borderBottom: "1px solid #E5DDD5" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 24, height: 2, background: "#FF6B00", borderRadius: 1 }}/>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#FF6B00",
                textTransform: "uppercase", letterSpacing: "0.2em" }}>What is LokDrishti</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
              <div>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif",
                  fontSize: "clamp(32px,3.5vw,52px)", fontWeight: 700, color: "#1A1A2E",
                  letterSpacing: "-1px", lineHeight: 1.05, marginBottom: 24 }}>
                  A civic intelligence engine for India's Parliament.
                </h2>
                <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.85, marginBottom: 20 }}>
                  LokDrishti aggregates official parliamentary data from{" "}
                  <strong style={{ color: "#1A1A2E" }}>PRS Legislative Research</strong> and
                  Lok Sabha records to compute objective performance scores for all 543 MPs of
                  the 18th Lok Sabha.
                </p>
                <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.85 }}>
                  We measure what MPs actually <em>do</em> — not what they say. Attendance,
                  questions raised, debate participation, and their combined{" "}
                  <strong style={{ color: "#1A1A2E" }}>Lok Sabha Civic Index (LCI)</strong> score
                  give citizens a fair, unbiased picture of parliamentary performance.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { icon: "attend", label: "Attendance",     desc: "Were they present?",              color: "#059669", bg: "#D1FAE5" },
                  { icon: "q",      label: "Questions",      desc: "Did they hold govt accountable?", color: "#2563EB", bg: "#DBEAFE" },
                  { icon: "debate", label: "Debates",        desc: "Did they participate?",           color: "#7C3AED", bg: "#EDE9FE" },
                  { icon: "chart",  label: "LCI Score",      desc: "Combined civic index",            color: "#FF6B00", bg: "#FEF3C7" },
                ].map(m=>(
                  <div key={m.label} style={{ background: "#F8FAFC", borderRadius: 16,
                    padding: "20px", border: `1.5px solid ${m.color}20`,
                    borderTop: `3px solid ${m.color}` }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: m.bg,
                      display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                      <Icon id={m.icon} size={20} color={m.color}/>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#1A1A2E", marginBottom: 4 }}>{m.label}</div>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>{m.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ STATS ═════════════════════════════════════════════ */}
      <section style={{ padding: "80px 64px", background: "#F7F4EF",
        borderBottom: "1px solid #E5DDD5" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#FF6B00",
                textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 12 }}>By the Numbers</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif",
                fontSize: "clamp(28px,3vw,46px)", fontWeight: 700, color: "#1A1A2E",
                letterSpacing: "-0.5px" }}>Accountability at scale</h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 40 }}>
            {[
              { to: 543, label: "MPs Tracked",       color: "#FF6B00" },
              { to: 28,  label: "States & UTs",      color: "#2563EB" },
              { to: 40,  label: "Political Parties",  color: "#7C3AED" },
              { to: 11,  label: "Metrics Computed",   color: "#059669" },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 80}>
                <AnimStat to={s.to} label={s.label} color={s.color}/>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ VALUES ════════════════════════════════════════════ */}
      <section style={{ padding: "80px 64px", background: "white",
        borderBottom: "1px solid #E5DDD5" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 52 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 24, height: 2, background: "#FF6B00", borderRadius: 1 }}/>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#FF6B00",
                  textTransform: "uppercase", letterSpacing: "0.2em" }}>Our Principles</span>
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif",
                fontSize: "clamp(30px,3.2vw,48px)", fontWeight: 700, color: "#1A1A2E",
                letterSpacing: "-0.5px", lineHeight: 1.05 }}>
                Built on four unbreakable values
              </h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
            {[
              { icon:"eye",    title:"Radical Transparency", desc:"Every metric is public, every formula is open. No black boxes, no hidden editorial decisions — just raw parliamentary data.", color:"#FF6B00", bg:"#FEF3C7", delay:0   },
              { icon:"scale",  title:"Zero Political Bias",  desc:"We measure attendance, questions, and debates — actions that exist in the official record. No opinion is ever injected.", color:"#2563EB", bg:"#DBEAFE", delay:80  },
              { icon:"lock",   title:"Data Integrity",       desc:"All data comes directly from PRS Legislative Research and official Lok Sabha records. We never modify or selectively present it.", color:"#7C3AED", bg:"#EDE9FE", delay:160 },
              { icon:"heart",  title:"Citizen First",        desc:"Every design decision is made for ordinary citizens — not policy experts. Plain English, clear grades, and no jargon.", color:"#059669", bg:"#D1FAE5", delay:240 },
            ].map(v=>(
              <ValueCard key={v.title} {...v}/>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══════════════════════════════════════ */}
      <section style={{ padding: "80px 64px", background: "#F7F4EF",
        borderBottom: "1px solid #E5DDD5" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80 }}>
          <div>
            <Reveal>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 24, height: 2, background: "#FF6B00", borderRadius: 1 }}/>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#FF6B00",
                  textTransform: "uppercase", letterSpacing: "0.2em" }}>How It Works</span>
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif",
                fontSize: "clamp(28px,3vw,46px)", fontWeight: 700, color: "#1A1A2E",
                letterSpacing: "-0.5px", marginBottom: 40 }}>
                From raw Parliament records to your screen
              </h2>
            </Reveal>
            {[
              { step:1, title:"Data Collection",    desc:"PRS Legislative Research collects official attendance, questions, and debate records from the Lok Sabha Secretariat after every session.", color:"#FF6B00", delay:0   },
              { step:2, title:"Normalisation",       desc:"Each metric is normalised to a 0–1 scale relative to all 543 MPs, so scores are comparable across different sessions and constituencies.", color:"#2563EB", delay:80  },
              { step:3, title:"LCI Computation",    desc:"The Lok Sabha Civic Index (LCI) is a weighted composite of the three metrics. The formula is open-source and publicly documented.", color:"#7C3AED", delay:160 },
              { step:4, title:"Citizen Dashboard",  desc:"Scores are rendered in plain English with A–F grades so any citizen — regardless of background — can instantly judge their MP.", color:"#059669", delay:240 },
            ].map(t=>(
              <TimelineItem key={t.step} {...t}/>
            ))}
          </div>

          {/* LCI formula card */}
          <Reveal from="right" delay={120}>
            <div style={{ background: "#0A1628", borderRadius: 24, padding: "36px",
              position: "sticky", top: 100,
              boxShadow: "0 24px 80px rgba(10,22,40,0.25)" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,107,0,0.8)",
                textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 20 }}>LCI Formula</div>

              {/* Formula display */}
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22,
                color: "white", marginBottom: 28, lineHeight: 1.6 }}>
                LCI = <em style={{ color: "#FF6B00" }}>α</em>·Attendance +{" "}
                <em style={{ color: "#60A5FA" }}>β</em>·Questions +{" "}
                <em style={{ color: "#A78BFA" }}>γ</em>·Debates
              </div>

              {[
                { var:"α", label:"Attendance weight",  val:"40%", color:"#FF6B00", desc:"Showing up is the baseline" },
                { var:"β", label:"Questions weight",   val:"35%", color:"#60A5FA", desc:"Holding govt accountable" },
                { var:"γ", label:"Debates weight",     val:"25%", color:"#A78BFA", desc:"Participating in discourse" },
              ].map(f=>(
                <div key={f.var} style={{ display: "flex", alignItems: "center", gap: 16,
                  padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12,
                    background: `${f.color}15`, border: `1.5px solid ${f.color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Cormorant Garamond',serif", fontSize: 20,
                    fontWeight: 700, color: f.color, flexShrink: 0 }}>{f.var}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 2 }}>{f.label}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{f.desc}</div>
                  </div>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22,
                    fontWeight: 700, color: f.color }}>{f.val}</div>
                </div>
              ))}

              <div style={{ marginTop: 24, padding: "14px 16px", borderRadius: 12,
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}>
                  Scores range from <strong style={{ color: "white" }}>0.0 to 1.0</strong>.
                  Grade A = 0.75+, B = 0.50–0.74, C = 0.25–0.49, D = 0.10–0.24, F = below 0.10.
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ MEET THE BUILDER ══════════════════════════════════ */}
      <section style={{ padding: "80px 64px", background: "white",
        borderBottom: "1px solid #E5DDD5" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 52 }}>
              <div style={{ width: 24, height: 2, background: "#FF6B00", borderRadius: 1 }}/>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#FF6B00",
                textTransform: "uppercase", letterSpacing: "0.2em" }}>The Builder</span>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <Reveal from="left">
              <div>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif",
                  fontSize: "clamp(32px,3.5vw,52px)", fontWeight: 700, color: "#1A1A2E",
                  letterSpacing: "-1px", lineHeight: 1.05, marginBottom: 20 }}>
                  Built by one person,<br/>
                  <em style={{ color: "#FF6B00" }}>for 1.4 billion.</em>
                </h2>
                <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.85, marginBottom: 20 }}>
                  LokDrishti was designed and built by{" "}
                  <strong style={{ color: "#1A1A2E" }}>Piyush Ladukar</strong>, a developer from
                  India who believes every citizen deserves accessible, unbiased information
                  about how their democracy functions.
                </p>
                <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.85, marginBottom: 32 }}>
                  The entire platform — data pipeline, backend Flask API, and Next.js frontend —
                  is the work of a single developer committed to civic transparency.
                </p>
                <a href="https://github.com/PiyushLadukar" target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 10,
                    padding: "14px 28px", background: "#0A1628", color: "white",
                    borderRadius: 100, textDecoration: "none", fontWeight: 700, fontSize: 14,
                    transition: "all 0.2s", boxShadow: "0 4px 20px rgba(10,22,40,0.2)" }}
                  onMouseEnter={e=>(e.currentTarget.style.transform="translateY(-2px)")}
                  onMouseLeave={e=>(e.currentTarget.style.transform="none")}>
                  <Icon id="github" size={18} color="white"/>
                  @PiyushLadukar on GitHub
                  <Icon id="arrow" size={14} color="rgba(255,255,255,0.6)"/>
                </a>
              </div>
            </Reveal>

            <Reveal from="right" delay={80}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* GitHub avatar card */}
                <div style={{ background: "linear-gradient(135deg,#0A1628,#1E293B)",
                  borderRadius: 24, padding: "32px", textAlign: "center",
                  boxShadow: "0 20px 60px rgba(10,22,40,0.2)", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px,transparent 1px)", backgroundSize: "18px 18px" }}/>

                  {/* Spinning ring */}
                  <div style={{ position: "relative", width: 100, height: 100, margin: "0 auto 20px" }}>
                    <div style={{ position: "absolute", inset: -4, borderRadius: "50%",
                      background: "conic-gradient(#FF6B00,#FFB347,#FF6B00,transparent,#FF6B00)",
                      animation: "spinSlow 4s linear infinite" }}/>
                    <div style={{ position: "absolute", inset: -2, borderRadius: "50%", background: "#0A1628" }}/>
                    <img src="https://github.com/PiyushLadukar.png" alt="Piyush Ladukar"
                      style={{ position: "relative", width: "100%", height: "100%",
                        borderRadius: "50%", objectFit: "cover", display: "block" }}
                      onError={e=>(e.currentTarget.style.display="none")}/>
                  </div>

                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26,
                    fontWeight: 700, color: "white", marginBottom: 4 }}>Piyush Ladukar</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>
                    Developer · Designer · Civic Tech Builder
                  </div>
                  <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                    {["Next.js","Flask","Python","TypeScript","Open Data"].map(tag=>(
                      <span key={tag} style={{ padding: "4px 12px", borderRadius: 100,
                        background: "rgba(255,107,0,0.1)", border: "1px solid rgba(255,107,0,0.2)",
                        fontSize: 11, color: "#FF6B00", fontWeight: 600 }}>{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Quote */}
                <div style={{ background: "#F7F4EF", borderRadius: 16, padding: "22px 24px",
                  borderLeft: "4px solid #FF6B00" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18,
                    fontStyle: "italic", color: "#1A1A2E", lineHeight: 1.7, marginBottom: 10 }}>
                    "A democracy works best when its citizens are informed. LokDrishti is my contribution to making that happen."
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#FF6B00" }}>— Piyush Ladukar</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ DATA SOURCES ══════════════════════════════════════ */}
      <section style={{ padding: "80px 64px", background: "#F7F4EF",
        borderBottom: "1px solid #E5DDD5" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#FF6B00",
                textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 12 }}>Data Sources</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif",
                fontSize: "clamp(28px,3vw,46px)", fontWeight: 700, color: "#1A1A2E",
                letterSpacing: "-0.5px" }}>We cite everything.</h2>
              <p style={{ fontSize: 15, color: "#6B7280", marginTop: 12, maxWidth: 540, margin: "12px auto 0" }}>
                Every number on LokDrishti traces back to a verifiable official source.
              </p>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {[
              { icon:"book",   title:"PRS Legislative Research", desc:"India's most trusted non-partisan legislative research body. Their MP performance data is the backbone of LokDrishti.", link:"https://prsindia.org", color:"#FF6B00", delay:0   },
              { icon:"globe",  title:"Lok Sabha Official Records",desc:"Direct data from India's official parliamentary records — attendance registers, starred/unstarred questions, and debate transcripts.", link:"https://sansad.in", color:"#2563EB", delay:80  },
              { icon:"data",   title:"Wikipedia / Commons",      desc:"MP photographs sourced from Wikipedia and Wikimedia Commons under CC-BY-SA licences.", link:"https://commons.wikimedia.org", color:"#7C3AED", delay:160 },
            ].map(s=>(
              <Reveal key={s.title} delay={s.delay}>
                <div style={{ background: "white", borderRadius: 20, padding: "28px",
                  border: `1.5px solid #E5DDD5`, borderTop: `4px solid ${s.color}`,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12,
                    background: `${s.color}12`, display: "flex", alignItems: "center",
                    justifyContent: "center", marginBottom: 18 }}>
                    <Icon id={s.icon} size={22} color={s.color}/>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#1A1A2E",
                    fontFamily: "'Cormorant Garamond',serif", marginBottom: 10 }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.75, marginBottom: 18 }}>{s.desc}</div>
                  <a href={s.link} target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12,
                      fontWeight: 700, color: s.color, textDecoration: "none" }}>
                    Visit Source <Icon id="arrow" size={12} color={s.color}/>
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ═══════════════════════════════════════════════ */}
      <section style={{ padding: "100px 64px",
        background: "linear-gradient(270deg,#E05500,#FF8C00,#f1893f,#E05500)",
        backgroundSize: "400% 400%", animation: "gradShift 8s ease infinite",
        position: "relative", overflow: "hidden", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px,transparent 1px)",
          backgroundSize: "26px 26px" }}/>
        <div style={{ position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: "clamp(120px,18vw,240px)", fontWeight: 900,
          color: "transparent", WebkitTextStroke: "2px rgba(255,255,255,0.07)",
          whiteSpace: "nowrap", userSelect: "none", pointerEvents: "none" }}>INDIA</div>

        <Reveal>
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif",
              fontSize: "clamp(40px,5.5vw,72px)", fontWeight: 700, color: "white",
              letterSpacing: "-2px", lineHeight: 0.95, marginBottom: 24 }}>
              Your democracy.<br/>
              <span style={{ color: "#0A1628" }}>Your data. Your right.</span>
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", maxWidth: 440,
              margin: "0 auto 40px", lineHeight: 1.8 }}>
              Check how your MP is performing right now. No login required.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/ranking" style={{ display: "inline-flex", alignItems: "center", gap: 8,
                padding: "16px 36px", background: "#0A1628", color: "white", borderRadius: 100,
                textDecoration: "none", fontWeight: 700, fontSize: 14,
                boxShadow: "0 4px 24px rgba(10,22,40,0.35)", transition: "all 0.2s" }}
                onMouseEnter={e=>(e.currentTarget.style.transform="translateY(-2px)")}
                onMouseLeave={e=>(e.currentTarget.style.transform="none")}>
                Explore All 543 MPs
                <Icon id="arrow" size={16} color="white"/>
              </Link>
              <Link href="/analytics" style={{ display: "inline-flex", alignItems: "center", gap: 8,
                padding: "16px 36px", background: "rgba(255,255,255,0.18)",
                color: "white", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 100,
                textDecoration: "none", fontWeight: 600, fontSize: 14, transition: "all 0.2s" }}
                onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.28)")}
                onMouseLeave={e=>(e.currentTarget.style.background="rgba(255,255,255,0.18)")}>
                View Analytics
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}