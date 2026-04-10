"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────────────────────────
   SVG ICONS
───────────────────────────────────────────────────────────── */
function Icon({ id, size = 20, color = "currentColor" }: { id: string; size?: number; color?: string }) {
  const s = { width: size, height: size, display: "block", flexShrink: 0 };
  const p = { stroke: color, strokeWidth: "1.8", strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  const icons: Record<string, React.ReactNode> = {
    eye:      <svg style={s} viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" {...p}/><circle cx="12" cy="12" r="3" {...p}/></svg>,
    scale:    <svg style={s} viewBox="0 0 24 24"><path d="M12 3v18M5 6l-2 6h4L5 6zM19 6l-2 6h4L19 6z" {...p}/><path d="M3 18h6M15 18h6M8 21h8" {...p}/></svg>,
    lock:     <svg style={s} viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" {...p}/><path d="M7 11V7a5 5 0 0 1 10 0v4" {...p}/></svg>,
    heart:    <svg style={s} viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" {...p}/></svg>,
    arrow:    <svg style={s} viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" {...p}/></svg>,
    github:   <svg style={s} viewBox="0 0 24 24" fill={color} stroke="none"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>,
    linkedin: <svg style={s} viewBox="0 0 24 24" fill={color} stroke="none"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
    book:     <svg style={s} viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" {...p}/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" {...p}/></svg>,
    globe:    <svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" {...p}/><line x1="2" y1="12" x2="22" y2="12" {...p}/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" {...p}/></svg>,
    chart:    <svg style={s} viewBox="0 0 24 24"><rect x="3" y="12" width="4" height="9" {...p}/><rect x="10" y="7" width="4" height="14" {...p}/><rect x="17" y="3" width="4" height="18" {...p}/><line x1="2" y1="21" x2="22" y2="21" {...p}/></svg>,
    check:    <svg style={s} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" {...p}/></svg>,
    users:    <svg style={s} viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" {...p}/><circle cx="9" cy="7" r="4" {...p}/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" {...p}/></svg>,
    map:      <svg style={s} viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" {...p}/><circle cx="12" cy="10" r="3" {...p}/></svg>,
    star:     <svg style={s} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" {...p}/></svg>,
    zap:      <svg style={s} viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" {...p}/></svg>,
    flag:     <svg style={s} viewBox="0 0 24 24"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" {...p}/><line x1="4" y1="22" x2="4" y2="15" {...p}/></svg>,
    code:     <svg style={s} viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6" {...p}/><polyline points="8 6 2 12 8 18" {...p}/></svg>,
  };
  return (icons[id] ?? <svg style={s} viewBox="0 0 24 24" />) as React.ReactElement;
}

/* ─────────────────────────────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, from = "bottom" }: { children: React.ReactNode; delay?: number; from?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obs.disconnect(); }
    }, { threshold: 0.06 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const xform = vis ? "translate(0,0)"
    : from === "left"  ? "translateX(-40px)"
    : from === "right" ? "translateX(40px)"
    : "translateY(32px)";
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: xform, transition: `opacity 0.75s ease ${delay}ms, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms` }}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   COUNTER STAT
───────────────────────────────────────────────────────────── */
function CountStat({ to, label, color, icon }: { to: number; label: string; color: string; icon: string }) {
  const [v, setV] = useState(0);
  const done = useRef(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        let cur = 0; const step = to / (1400 / 16);
        const t = setInterval(() => {
          cur += step;
          if (cur >= to) { setV(to); clearInterval(t); } else setV(Math.floor(cur));
        }, 16);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return (
    <div ref={ref} style={{ textAlign: "center", padding: "36px 20px", borderRadius: 24, background: "white", border: `1.5px solid ${color}22`, boxShadow: `0 4px 24px ${color}0D, 0 1px 4px rgba(0,0,0,0.04)`, position: "relative", overflow: "hidden", transition: "transform 0.3s" }}
      onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-6px)")}
      onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}>
      <div style={{ position: "absolute", top: -30, left: "50%", transform: "translateX(-50%)", width: 120, height: 120, borderRadius: "50%", background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ width: 48, height: 48, borderRadius: 14, background: `${color}12`, border: `1px solid ${color}20`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
        <Icon id={icon} size={22} color={color} />
      </div>
      <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 56, fontWeight: 700, color, lineHeight: 1, marginBottom: 8 }}>{v}+</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#9A8F83", textTransform: "uppercase", letterSpacing: "0.18em" }}>{label}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   3D TILT CARD
───────────────────────────────────────────────────────────── */
function TiltCard({ children, intensity = 18 }: { children: React.ReactNode; intensity?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setTilt({ rx: (y - 0.5) * -intensity, ry: (x - 0.5) * intensity, gx: Math.round(x * 100), gy: Math.round(y * 100) });
    });
  }, [intensity]);
  const onMouseLeave = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 50 });
  }, []);
  return (
    <div ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}
      style={{
        transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${tilt.rx !== 0 || tilt.ry !== 0 ? 1.04 : 1})`,
        transition: tilt.rx === 0 && tilt.ry === 0 ? "transform 0.7s cubic-bezier(0.23,1,0.32,1)" : "transform 0.08s linear",
        transformStyle: "preserve-3d", cursor: "default", position: "relative",
      }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 28, pointerEvents: "none", zIndex: 10, background: `radial-gradient(ellipse at ${tilt.gx}% ${tilt.gy}%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 55%, transparent 75%)`, mixBlendMode: "overlay", transition: tilt.rx === 0 ? "background 0.7s" : "background 0.06s" }} />
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TIMELINE STEP
───────────────────────────────────────────────────────────── */
function TimelineStep({ step, title, desc, color, delay, isLast }: { step: number; title: string; desc: string; color: string; delay: number; isLast: boolean }) {
  return (
    <Reveal delay={delay} from="left">
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: `${color}12`, border: `2.5px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 700, color, boxShadow: `0 0 0 6px ${color}0A` }}>{step}</div>
          {!isLast && <div style={{ width: 2, flexGrow: 1, background: `linear-gradient(to bottom, ${color}40, transparent)`, margin: "8px 0" }} />}
        </div>
        <div style={{ paddingBottom: isLast ? 0 : 32 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontWeight: 700, color: "#1A1A2E", marginBottom: 6 }}>{title}</div>
          <div style={{ fontSize: 13, color: "#8A8078", lineHeight: 1.8 }}>{desc}</div>
        </div>
      </div>
    </Reveal>
  );
}

/* ─────────────────────────────────────────────────────────────
   HERO DATA VISUAL — replaces parliament illustration
───────────────────────────────────────────────────────────── */
function HeroDataVisual() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setTick(t => t + 1), 1800);
    return () => clearInterval(i);
  }, []);

  const bars = [
    { mp: "MP #001", score: 0.91, party: "INC", color: "#34D399" },
    { mp: "MP #047", score: 0.87, party: "BJP", color: "#60A5FA" },
    { mp: "MP #112", score: 0.82, party: "AAP", color: "#A78BFA" },
    { mp: "MP #203", score: 0.74, party: "TMC", color: "#FBBF24" },
    { mp: "MP #318", score: 0.61, party: "SP",  color: "#F87171" },
    { mp: "MP #421", score: 0.43, party: "BSP", color: "#FB923C" },
  ];

  const floatStyle = (i: number): React.CSSProperties => ({
    animation: `floatY ${3.5 + i * 0.6}s ease-in-out ${i * 0.4}s infinite`,
  });

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 540 }}>
      {/* Main card */}
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: "28px 28px 24px", backdropFilter: "blur(12px)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,#FF6B00,#FFB347,transparent)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,107,0,0.8)", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 4 }}>Live Performance Index</div>
            <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 18, fontWeight: 700, color: "white" }}>18th Lok Sabha · 543 MPs</div>
          </div>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#34D399", boxShadow: "0 0 10px #34D399", animation: "pulseRing 2s ease-in-out infinite" }} />
        </div>
        {bars.map((b, i) => (
          <div key={b.mp} style={{ marginBottom: 10, ...floatStyle(i), animationDuration: `${4 + i * 0.5}s` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: b.color, fontFamily: "monospace" }}>{b.mp}</span>
                <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4, background: `${b.color}18`, color: b.color, fontWeight: 700 }}>{b.party}</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 800, color: b.color, fontFamily: "'Cormorant Garamond',Georgia,serif" }}>{b.score.toFixed(2)}</span>
            </div>
            <div style={{ height: 5, borderRadius: 3, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${b.score * 100}%`, background: `linear-gradient(90deg,${b.color}80,${b.color})`, borderRadius: 3, transition: "width 1.2s cubic-bezier(0.16,1,0.3,1)" }} />
            </div>
          </div>
        ))}
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between" }}>
          {["A Grade: 31%","B Grade: 28%","C/D/F: 41%"].map((l, i) => (
            <div key={i} style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em" }}>{l}</div>
          ))}
        </div>
      </div>

      {/* Floating mini-cards */}
      <div style={{ position: "absolute", top: -24, right: -20, background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: 14, padding: "10px 14px", backdropFilter: "blur(8px)", animation: "floatY 4s ease-in-out infinite", zIndex: 5 }}>
        <div style={{ fontSize: 9, fontWeight: 800, color: "#34D399", letterSpacing: "0.15em", textTransform: "uppercase" }}>Attendance</div>
        <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 26, fontWeight: 700, color: "#34D399", lineHeight: 1 }}>87<span style={{ fontSize: 13 }}>%</span></div>
      </div>
      <div style={{ position: "absolute", bottom: -20, left: -16, background: "rgba(96,165,250,0.12)", border: "1px solid rgba(96,165,250,0.3)", borderRadius: 14, padding: "10px 14px", backdropFilter: "blur(8px)", animation: "floatY 5s ease-in-out 1.2s infinite", zIndex: 5 }}>
        <div style={{ fontSize: 9, fontWeight: 800, color: "#60A5FA", letterSpacing: "0.15em", textTransform: "uppercase" }}>Questions</div>
        <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 26, fontWeight: 700, color: "#60A5FA", lineHeight: 1 }}>{tick % 2 === 0 ? "342" : "347"}</div>
      </div>
      <div style={{ position: "absolute", top: "45%", right: -28, background: "rgba(255,107,0,0.12)", border: "1px solid rgba(255,107,0,0.3)", borderRadius: 14, padding: "10px 14px", backdropFilter: "blur(8px)", animation: "floatY 3.8s ease-in-out 0.6s infinite", zIndex: 5 }}>
        <div style={{ fontSize: 9, fontWeight: 800, color: "#FF6B00", letterSpacing: "0.15em", textTransform: "uppercase" }}>LCI Avg</div>
        <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 26, fontWeight: 700, color: "#FF6B00", lineHeight: 1 }}>0.62</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   REVEAL VALUE CARD — flip card style
───────────────────────────────────────────────────────────── */
function RevealValueCard({ icon, title, desc, color, bg, delay, number }: {
  icon: string; title: string; desc: string; color: string; bg: string; delay: number; number: string;
}) {
  const [flipped, setFlipped] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <Reveal delay={delay}>
      <div
        onMouseEnter={() => { setFlipped(true); setHovered(true); }}
        onMouseLeave={() => { setFlipped(false); setHovered(false); }}
        style={{ perspective: "1000px", height: 280, cursor: "pointer" }}
      >
        <div style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.65s cubic-bezier(0.23,1,0.32,1)",
        }}>

          {/* FRONT */}
          <div style={{
            position: "absolute", inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            background: "white",
            borderRadius: 24,
            padding: "32px 28px",
            border: `1.5px solid ${color}20`,
            borderTop: `4px solid ${color}`,
            boxShadow: hovered ? `0 24px 60px ${color}20` : "0 2px 12px rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "hidden",
          }}>
            {/* Big ghost number */}
            <div style={{
              position: "absolute",
              bottom: -10,
              right: 16,
              fontFamily: "'Cormorant Garamond',Georgia,serif",
              fontSize: 100,
              fontWeight: 900,
              color: `${color}08`,
              lineHeight: 1,
              userSelect: "none",
              pointerEvents: "none",
            }}>{number}</div>

            <div>
              <div style={{
                width: 58, height: 58, borderRadius: 18,
                background: bg,
                border: `1.5px solid ${color}25`,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 20,
                boxShadow: `0 4px 16px ${color}20`,
              }}>
                <Icon id={icon} size={26} color={color} />
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, fontWeight: 700, color: "#1A1A2E", marginBottom: 10, lineHeight: 1.2 }}>{title}</div>
              <div style={{ fontSize: 13, color: "#9A8F83", lineHeight: 1.75 }}>{desc.slice(0, 60)}...</div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color, marginTop: 8 }}>
              <span>Reveal</span>
              <Icon id="arrow" size={12} color={color} />
            </div>
          </div>

          {/* BACK */}
          <div style={{
            position: "absolute", inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: `linear-gradient(135deg, ${color}F0 0%, ${color}CC 100%)`,
            borderRadius: 24,
            padding: "32px 28px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            overflow: "hidden",
          }}>
            {/* decorative circles */}
            <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -20, left: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />

            <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 56, fontWeight: 900, color: "rgba(255,255,255,0.15)", lineHeight: 1, marginBottom: 16, position: "relative" }}>{number}</div>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 700, color: "white", marginBottom: 14, position: "relative" }}>{title}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.8, position: "relative" }}>{desc}</div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ─────────────────────────────────────────────────────────────
   CRAZY ANIMATED BADGE — for builder section
───────────────────────────────────────────────────────────── */
function CrazyBadge({ label, color, bg, border, href, animStyle, icon }: {
  label: string; color: string; bg: string; border: string;
  href?: string; animStyle: React.CSSProperties; icon?: string;
}) {
  const content = (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 7,
      background: bg,
      border: `1.5px solid ${border}`,
      borderRadius: 100,
      padding: "9px 20px",
      fontSize: 11,
      fontWeight: 800,
      color,
      letterSpacing: "0.12em",
      textTransform: "uppercase" as const,
      boxShadow: `0 8px 28px ${border}40, 0 2px 8px rgba(0,0,0,0.08)`,
      cursor: href ? "pointer" : "default",
      textDecoration: "none",
      whiteSpace: "nowrap" as const,
      backdropFilter: "blur(8px)",
      transition: "transform 0.2s, box-shadow 0.2s",
      ...animStyle,
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = `${animStyle.transform ?? ""} scale(1.12)`;
        (e.currentTarget as HTMLElement).style.boxShadow = `0 14px 40px ${border}60, 0 4px 16px rgba(0,0,0,0.12)`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = animStyle.transform ?? "";
        (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 28px ${border}40, 0 2px 8px rgba(0,0,0,0.08)`;
      }}
    >
      {icon && <Icon id={icon} size={13} color={color} />}
      {label}
    </div>
  );

  if (href) {
    return <a href={href} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block" }}>{content}</a>;
  }
  return <div style={{ display: "inline-block" }}>{content}</div>;
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
export default function AboutPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  const fi = (d: number): React.CSSProperties => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.8s ease ${d}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${d}ms`,
  });

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif", background: "#F7F2EA", color: "#1A1A2E", overflowX: "hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes floatY     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes gradShift  { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes blink      { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulseRing  { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.18);opacity:0.2} }
        @keyframes spinSlow   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes orbitA     { from{transform:rotate(0deg) translateX(58px) rotate(0deg)} to{transform:rotate(360deg) translateX(58px) rotate(-360deg)} }
        @keyframes orbitB     { from{transform:rotate(180deg) translateX(58px) rotate(-180deg)} to{transform:rotate(540deg) translateX(58px) rotate(-540deg)} }
        @keyframes orbitC     { from{transform:rotate(90deg) translateX(78px) rotate(-90deg)} to{transform:rotate(450deg) translateX(78px) rotate(-450deg)} }
        @keyframes badgeDrift0 { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-14px) rotate(-3deg)} }
        @keyframes badgeDrift1 { 0%,100%{transform:translateY(0) rotate(2.5deg)} 50%{transform:translateY(-18px) rotate(2.5deg)} }
        @keyframes badgeDrift2 { 0%,100%{transform:translateY(0) rotate(-1.5deg)} 50%{transform:translateY(-10px) rotate(-1.5deg)} }
        @keyframes badgeDrift3 { 0%,100%{transform:translateY(0) rotate(3.5deg)} 50%{transform:translateY(-16px) rotate(3.5deg)} }
        @keyframes shimmerX   { from{transform:translateX(-100%)} to{transform:translateX(300%)} }
        @keyframes cardReveal { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        *,*::before,*::after  { box-sizing:border-box; }
        ::selection           { background:rgba(255,107,0,0.18); }
        ::-webkit-scrollbar   { width:5px; }
        ::-webkit-scrollbar-track { background:#EDE8E0; }
        ::-webkit-scrollbar-thumb { background:#C8B99A; border-radius:3px; }
        .section-divider { height:1px; background:linear-gradient(90deg,transparent,#DDD4C7 20%,#DDD4C7 80%,transparent); }
      `}</style>

      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <div style={{ background: "linear-gradient(150deg,#080f1e 0%,#0A1628 50%,#111827 100%)", position: "relative", overflow: "hidden", minHeight: "90vh", display: "flex", alignItems: "center" }}>

        {/* tricolor stripe */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg,#FF6B00 33%,rgba(255,255,255,0.15) 33%,rgba(255,255,255,0.15) 66%,#138808 66%)" }} />

        {/* dot texture */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize: "24px 24px" }} />

        {/* glow orbs */}
        <div style={{ position: "absolute", left: "-4%", top: "30%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,107,0,0.08) 0%,transparent 70%)", animation: "floatY 9s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: "5%", bottom: "10%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,147,255,0.06) 0%,transparent 70%)", animation: "floatY 11s ease-in-out 2s infinite", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "88px 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", position: "relative", zIndex: 1, width: "100%" }}>

          {/* ── left copy ── */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22, ...fi(0) }}>
              <div style={{ width: 3, height: 20, background: "#FF6B00", borderRadius: 2 }} />
              <span style={{ fontSize: 10, fontWeight: 800, color: "#FF6B00", textTransform: "uppercase", letterSpacing: "0.28em" }}>About LokDrishti</span>
            </div>

            <h1 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(44px,5.5vw,76px)",
              fontWeight: 700, color: "white",
              lineHeight: 0.92, letterSpacing: "-2.5px", marginBottom: 26,
              ...fi(80)
            }}>
              Democracy<br />
              needs a<br />
              <em style={{ color: "#FF6B00", fontStyle: "normal", position: "relative", display: "inline-block" }}>
                Witness.
                <span style={{ display: "inline-block", width: 3, height: "0.85em", background: "#FF6B00", marginLeft: 4, verticalAlign: "middle", animation: "blink 1s step-end infinite" }} />
              </em>
            </h1>

            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.9, maxWidth: 480, marginBottom: 36, ...fi(160) }}>
              LokDrishti <span style={{ color: "rgba(255,255,255,0.25)" }}>(लोकदृष्टि)</span> means{" "}
              <em style={{ color: "rgba(255,255,255,0.75)", fontStyle: "normal" }}>"the people's gaze"</em>.
              Every Indian citizen deserves to see exactly how their elected representatives perform —
              no spin, no bias, just raw parliamentary data.
            </p>

            {/* Scroll hint */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, ...fi(280) }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", border: "1.5px solid rgba(255,107,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", animation: "floatY 2.5s ease-in-out infinite" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Scroll to explore</span>
            </div>
          </div>

          {/* ── right: live data visual ── */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", ...fi(120) }}>
            <HeroDataVisual />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          WHAT IS IT
      ══════════════════════════════════════════════════════ */}
      <section style={{ background: "white", padding: "88px 48px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 28, height: 2.5, background: "#FF6B00", borderRadius: 2 }} />
              <span style={{ fontSize: 10, fontWeight: 800, color: "#FF6B00", textTransform: "uppercase", letterSpacing: "0.24em" }}>What is LokDrishti</span>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
            <Reveal from="left">
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(32px,3.8vw,54px)", fontWeight: 700, color: "#1A1A2E", letterSpacing: "-1px", lineHeight: 1.04, marginBottom: 26 }}>
                A civic intelligence engine for India's Parliament.
              </h2>
              <p style={{ fontSize: 15, color: "#7A7068", lineHeight: 1.88, marginBottom: 18 }}>
                LokDrishti aggregates official parliamentary data from{" "}
                <strong style={{ color: "#1A1A2E", fontWeight: 700 }}>PRS Legislative Research</strong> and
                Lok Sabha records to compute objective performance scores for all 543 MPs of the 18th Lok Sabha.
              </p>
              <p style={{ fontSize: 15, color: "#7A7068", lineHeight: 1.88 }}>
                We measure what MPs actually <em style={{ color: "#1A1A2E" }}>do</em> — not what they say.
                Attendance, questions raised, debate participation, and their combined{" "}
                <strong style={{ color: "#FF6B00" }}>Lok Sabha Civic Index (LCI)</strong> score give
                citizens a fair, unbiased picture of parliamentary performance.
              </p>
            </Reveal>
            <Reveal from="right" delay={80}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[
                  { icon: "check", label: "Attendance", desc: "Were they present?",         color: "#059669", bg: "#D1FAE5" },
                  { icon: "star",  label: "Questions",  desc: "Holding govt accountable?",   color: "#2563EB", bg: "#DBEAFE" },
                  { icon: "users", label: "Debates",    desc: "Did they participate?",        color: "#7C3AED", bg: "#EDE9FE" },
                  { icon: "chart", label: "LCI Score",  desc: "Combined civic index",         color: "#FF6B00", bg: "#FEF3C7" },
                ].map(m => (
                  <div key={m.label} style={{ background: "#F9F6F0", borderRadius: 18, padding: 22, border: `1.5px solid ${m.color}18`, borderTop: `3px solid ${m.color}`, transition: "transform 0.3s" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-4px)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "none")}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: m.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                      <Icon id={m.icon} size={20} color={m.color} />
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#1A1A2E", marginBottom: 4, fontFamily: "'Cormorant Garamond',Georgia,serif" }}>{m.label}</div>
                    <div style={{ fontSize: 11, color: "#9A8F83" }}>{m.desc}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ══════════════════════════════════════════════════════
          STATS
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: "88px 48px", background: "#F7F2EA", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "clamp(100px,16vw,220px)", fontWeight: 900, color: "transparent", WebkitTextStroke: "1.5px rgba(255,107,0,0.06)", whiteSpace: "nowrap", userSelect: "none", pointerEvents: "none", zIndex: 0 }}>
          लोकदृष्टि
        </div>
        <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: "#FF6B00", textTransform: "uppercase", letterSpacing: "0.24em", marginBottom: 14 }}>By the Numbers</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(28px,3.2vw,48px)", fontWeight: 700, color: "#1A1A2E", letterSpacing: "-0.5px" }}>Accountability at scale</h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 22 }}>
            {[
              { to: 543, label: "MPs Tracked",       color: "#FF6B00", icon: "users" },
              { to: 28,  label: "States & UTs",      color: "#2563EB", icon: "map"   },
              { to: 40,  label: "Political Parties", color: "#7C3AED", icon: "zap"   },
              { to: 11,  label: "Metrics Computed",  color: "#059669", icon: "chart" },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 80}>
                <CountStat {...s} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ══════════════════════════════════════════════════════
          VALUES — REVEAL FLIP CARDS
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: "88px 48px", background: "white" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 28, height: 2.5, background: "#FF6B00", borderRadius: 2 }} />
                <span style={{ fontSize: 10, fontWeight: 800, color: "#FF6B00", textTransform: "uppercase", letterSpacing: "0.24em" }}>Our Principles</span>
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(30px,3.5vw,50px)", fontWeight: 700, color: "#1A1A2E", letterSpacing: "-0.5px", lineHeight: 1.04 }}>
                Built on four unbreakable values
              </h2>
              <p style={{ fontSize: 14, color: "#9A8F83", marginTop: 10 }}>Hover each card to reveal the full principle.</p>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, marginTop: 40 }}>
            {[
              { icon: "eye",   title: "Radical Transparency", number: "01", desc: "Every metric is public, every formula is open-source. No black boxes, no hidden editorial decisions — just raw parliamentary data that any citizen can verify.", color: "#FF6B00", bg: "#FEF3C7", delay: 0   },
              { icon: "scale", title: "Zero Political Bias",  number: "02", desc: "We measure attendance, questions, and debates — actions that exist in the official record. No opinion is ever injected into the scoring algorithm.", color: "#2563EB", bg: "#DBEAFE", delay: 80  },
              { icon: "lock",  title: "Data Integrity",       number: "03", desc: "All data comes directly from PRS Legislative Research and official Lok Sabha records. We never modify, selectively present, or editorialize it.", color: "#7C3AED", bg: "#EDE9FE", delay: 160 },
              { icon: "heart", title: "Citizen First",        number: "04", desc: "Every design decision is made for ordinary citizens — not policy experts. Plain language, clear A–F grades, and zero jargon so anyone can judge their MP.", color: "#059669", bg: "#D1FAE5", delay: 240 },
            ].map(v => <RevealValueCard key={v.title} {...v} />)}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ══════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: "88px 48px", background: "#F7F2EA" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 88 }}>
          <div>
            <Reveal>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 28, height: 2.5, background: "#FF6B00", borderRadius: 2 }} />
                <span style={{ fontSize: 10, fontWeight: 800, color: "#FF6B00", textTransform: "uppercase", letterSpacing: "0.24em" }}>How It Works</span>
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(28px,3.2vw,48px)", fontWeight: 700, color: "#1A1A2E", letterSpacing: "-0.5px", marginBottom: 44 }}>
                From raw Parliament records to your screen
              </h2>
            </Reveal>
            {[
              { step: 1, title: "Data Collection",   desc: "PRS Legislative Research collects official attendance, questions, and debate records from the Lok Sabha Secretariat after every session.", color: "#FF6B00" },
              { step: 2, title: "Normalisation",      desc: "Each metric is normalised to a 0–1 scale relative to all 543 MPs, so scores are comparable across sessions and constituencies.", color: "#2563EB" },
              { step: 3, title: "LCI Computation",   desc: "The Lok Sabha Civic Index (LCI) is a weighted composite of the three metrics. The formula is open-source and publicly documented.", color: "#7C3AED" },
              { step: 4, title: "Citizen Dashboard", desc: "Scores are rendered in plain English with A–F grades so any citizen — regardless of background — can instantly judge their MP.", color: "#059669" },
            ].map((t, i) => (
              <TimelineStep key={t.step} {...t} delay={i * 80} isLast={i === 3} />
            ))}
          </div>

          <Reveal from="right" delay={120}>
            <div style={{ background: "#0A1628", borderRadius: 28, padding: "40px 36px", position: "sticky", top: 100, boxShadow: "0 32px 80px rgba(10,22,40,0.3), 0 0 0 1px rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px,transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none" }} />
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#FF6B00,#60A5FA,#A78BFA)" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,107,0,0.8)", textTransform: "uppercase", letterSpacing: "0.24em", marginBottom: 22 }}>LCI Formula</div>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24, color: "white", marginBottom: 30, lineHeight: 1.55 }}>
                  LCI = <em style={{ color: "#FF6B00", fontStyle: "normal" }}>α</em>·Attendance +{" "}
                  <em style={{ color: "#60A5FA", fontStyle: "normal" }}>β</em>·Questions +{" "}
                  <em style={{ color: "#A78BFA", fontStyle: "normal" }}>γ</em>·Debates
                </div>
                {[
                  { v: "α", label: "Attendance weight", val: "40%", color: "#FF6B00", desc: "Showing up is the baseline" },
                  { v: "β", label: "Questions weight",  val: "35%", color: "#60A5FA", desc: "Holding govt accountable"  },
                  { v: "γ", label: "Debates weight",    val: "25%", color: "#A78BFA", desc: "Participating in discourse" },
                ].map(f => (
                  <div key={f.v} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ width: 46, height: 46, borderRadius: 13, background: `${f.color}15`, border: `1.5px solid ${f.color}35`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 22, fontWeight: 700, color: f.color, flexShrink: 0 }}>{f.v}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 2 }}>{f.label}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{f.desc}</div>
                    </div>
                    <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 24, fontWeight: 700, color: f.color }}>{f.val}</div>
                  </div>
                ))}
                <div style={{ marginTop: 24, padding: "14px 16px", borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.75 }}>
                    Scores range from <strong style={{ color: "white" }}>0.0 to 1.0</strong>.
                    Grade A = 0.75+, B = 0.50–0.74, C = 0.25–0.49, D = 0.10–0.24, F = below 0.10.
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="section-divider" />

      {/* ══════════════════════════════════════════════════════
          MEET THE BUILDER
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: "88px 48px", background: "white", position: "relative", overflow: "hidden" }}>

        {/* Crazy floating badges — positioned absolutely */}
        <CrazyBadge label="Civic Tech" color="#CC5500" bg="#FEF3C7" border="#FF6B00"
          animStyle={{ position: "absolute" as unknown as undefined, top: 60, right: 100, animation: "badgeDrift0 4.2s ease-in-out infinite" } as React.CSSProperties}
          icon="zap"
        />
        <CrazyBadge label="Open Source" color="#1D4ED8" bg="rgba(219,234,254,0.95)" border="#2563EB"
          href="https://github.com/PiyushLadukar"
          animStyle={{ position: "absolute" as unknown as undefined, top: 130, right: 300, animation: "badgeDrift1 5.1s ease-in-out 0.6s infinite" } as React.CSSProperties}
          icon="code"
        />
        <CrazyBadge label="Made in India" color="#047857" bg="rgba(209,250,229,0.95)" border="#059669"
          animStyle={{ position: "absolute" as unknown as undefined, bottom: 120, left: 60, animation: "badgeDrift2 4.6s ease-in-out 1.1s infinite" } as React.CSSProperties}
          icon="flag"
        />
        <CrazyBadge label="Democracy" color="#6D28D9" bg="rgba(237,233,254,0.95)" border="#7C3AED"
          animStyle={{ position: "absolute" as unknown as undefined, top: 80, left: 140, animation: "badgeDrift3 3.9s ease-in-out 0.3s infinite" } as React.CSSProperties}
          icon="scale"
        />

        <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Reveal>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 56 }}>
              <div style={{ width: 28, height: 2.5, background: "#FF6B00", borderRadius: 2 }} />
              <span style={{ fontSize: 10, fontWeight: 800, color: "#FF6B00", textTransform: "uppercase", letterSpacing: "0.24em" }}>The Builder</span>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 88, alignItems: "center" }}>
            {/* left copy */}
            <Reveal from="left">
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(34px,4vw,56px)", fontWeight: 700, color: "#1A1A2E", letterSpacing: "-1px", lineHeight: 1.02, marginBottom: 22 }}>
                Built by one person,<br />
                <em style={{ color: "#FF6B00", fontStyle: "normal" }}>for 1.4 billion.</em>
              </h2>
              <p style={{ fontSize: 15, color: "#7A7068", lineHeight: 1.88, marginBottom: 18 }}>
                LokDrishti was designed and built by{" "}
                <strong style={{ color: "#1A1A2E" }}>Piyush Ladukar</strong>, a developer from
                India who believes every citizen deserves accessible, unbiased information
                about how their democracy functions.
              </p>
              <p style={{ fontSize: 15, color: "#7A7068", lineHeight: 1.88, marginBottom: 36 }}>
                The entire platform — data pipeline, backend Flask API, and Next.js frontend —
                is the work of a single developer committed to civic transparency.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a href="https://github.com/PiyushLadukar" target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 26px", background: "#0A1628", color: "white", borderRadius: 100, textDecoration: "none", fontWeight: 700, fontSize: 14, transition: "all 0.25s", boxShadow: "0 4px 20px rgba(10,22,40,0.18)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(10,22,40,0.28)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(10,22,40,0.18)"; }}>
                  <Icon id="github" size={18} color="white" />
                  GitHub
                  <Icon id="arrow" size={14} color="rgba(255,255,255,0.5)" />
                </a>
                <a href="https://www.linkedin.com/in/piyush-ladukar/" target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 26px", background: "#0A66C2", color: "white", borderRadius: 100, textDecoration: "none", fontWeight: 700, fontSize: 14, transition: "all 0.25s", boxShadow: "0 4px 20px rgba(10,102,194,0.25)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(10,102,194,0.4)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(10,102,194,0.25)"; }}>
                  <Icon id="linkedin" size={18} color="white" />
                  LinkedIn
                  <Icon id="arrow" size={14} color="rgba(255,255,255,0.5)" />
                </a>
              </div>
            </Reveal>

            {/* right — CRAZY 3D TILT CARD */}
            <Reveal from="right" delay={80}>
              <TiltCard intensity={20}>
                <div style={{
                  background: "linear-gradient(140deg,#0A1628 0%,#13243F 50%,#0F1E38 100%)",
                  borderRadius: 28,
                  padding: "40px 36px",
                  boxShadow: "0 40px 100px rgba(10,22,40,0.35), 0 0 0 1px rgba(255,255,255,0.06)",
                  position: "relative",
                  overflow: "hidden",
                }}>
                  <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px,transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none" }} />
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#FF6B00,#FFB347,#FF6B00)", backgroundSize: "200%", animation: "gradShift 3s ease infinite" }} />

                  <div style={{ position: "relative", zIndex: 1 }}>
                    {/* Avatar with orbiting dots */}
                    <div style={{ position: "relative", width: 110, height: 110, margin: "0 auto 24px" }}>
                      {/* outer pulse ring */}
                      <div style={{ position: "absolute", inset: -12, borderRadius: "50%", border: "1.5px solid rgba(255,107,0,0.2)", animation: "pulseRing 2.5s ease-in-out infinite" }} />
                      {/* spinning ring */}
                      <div style={{ position: "absolute", inset: -6, borderRadius: "50%", background: "conic-gradient(#FF6B00 0deg,#FFB347 90deg,rgba(255,255,255,0.05) 180deg,#FF6B00 360deg)", animation: "spinSlow 4s linear infinite" }} />
                      {/* orbiting dots */}
                      <div style={{ position: "absolute", inset: -20, borderRadius: "50%" }}>
                        <div style={{ position: "absolute", width: 8, height: 8, borderRadius: "50%", background: "#FF6B00", top: "50%", left: "50%", marginTop: -4, marginLeft: -4, animation: "orbitA 3s linear infinite", boxShadow: "0 0 8px #FF6B00" }} />
                        <div style={{ position: "absolute", width: 6, height: 6, borderRadius: "50%", background: "#60A5FA", top: "50%", left: "50%", marginTop: -3, marginLeft: -3, animation: "orbitB 3s linear infinite", boxShadow: "0 0 6px #60A5FA" }} />
                        <div style={{ position: "absolute", width: 5, height: 5, borderRadius: "50%", background: "#A78BFA", top: "50%", left: "50%", marginTop: -2.5, marginLeft: -2.5, animation: "orbitC 5s linear infinite", boxShadow: "0 0 5px #A78BFA" }} />
                      </div>
                      <div style={{ position: "absolute", inset: -2, borderRadius: "50%", background: "#0A1628" }} />
                      <img
                        src="https://github.com/PiyushLadukar.png"
                        alt="Piyush Ladukar"
                        style={{ position: "relative", width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", display: "block" }}
                        onError={e => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                          const next = (e.currentTarget as HTMLImageElement).nextSibling as HTMLElement;
                          if (next) next.style.display = "flex";
                        }}
                      />
                      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#FF6B00", display: "none", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 32, fontWeight: 700, color: "white" }}>PL</div>
                    </div>

                    <div style={{ textAlign: "center", marginBottom: 24 }}>
                      <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 700, color: "white", marginBottom: 4 }}>Piyush Ladukar</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Developer · Designer · Civic Tech</div>
                    </div>

                    {/* Social links */}
                    <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 24 }}>
                      <a href="https://github.com/PiyushLadukar" target="_blank" rel="noopener noreferrer"
                        style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 18px", background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 100, textDecoration: "none", fontSize: 12, fontWeight: 600, transition: "all 0.2s" }}
                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.14)")}
                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)")}>
                        <Icon id="github" size={14} color="rgba(255,255,255,0.75)" /> GitHub
                      </a>
                      <a href="https://www.linkedin.com/in/piyush-ladukar/" target="_blank" rel="noopener noreferrer"
                        style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 18px", background: "rgba(10,102,194,0.2)", color: "#60A5FA", border: "1px solid rgba(10,102,194,0.35)", borderRadius: 100, textDecoration: "none", fontSize: 12, fontWeight: 600, transition: "all 0.2s" }}
                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(10,102,194,0.35)")}
                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "rgba(10,102,194,0.2)")}>
                        <Icon id="linkedin" size={14} color="#60A5FA" /> LinkedIn
                      </a>
                    </div>

                    {/* Tech tags with staggered float */}
                    <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 26 }}>
                      {["Next.js", "Flask", "Python", "TypeScript", "Open Data"].map((tag, i) => (
                        <span key={tag} style={{ padding: "5px 14px", borderRadius: 100, background: "rgba(255,107,0,0.1)", border: "1px solid rgba(255,107,0,0.22)", fontSize: 11, color: "#FF9040", fontWeight: 600, animation: `badgeDrift${i % 4} ${3.5 + i * 0.4}s ease-in-out ${i * 0.25}s infinite`, display: "inline-block" }}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "16px 18px", borderLeft: "3px solid #FF6B00" }}>
                      <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 15, fontStyle: "italic", color: "rgba(255,255,255,0.7)", lineHeight: 1.75, marginBottom: 8 }}>
                        "A democracy works best when its citizens are informed. LokDrishti is my contribution to making that happen."
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#FF6B00", letterSpacing: "0.05em" }}>— Piyush Ladukar</div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ══════════════════════════════════════════════════════
          DATA SOURCES — only 2 cards (no Wikipedia)
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: "88px 48px", background: "#F7F2EA" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: "#FF6B00", textTransform: "uppercase", letterSpacing: "0.24em", marginBottom: 14 }}>Data Sources</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(28px,3.2vw,48px)", fontWeight: 700, color: "#1A1A2E", letterSpacing: "-0.5px" }}>We cite everything.</h2>
              <p style={{ fontSize: 15, color: "#7A7068", marginTop: 12, maxWidth: 500, margin: "12px auto 0" }}>
                Every number on LokDrishti traces back to a verifiable official source.
              </p>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 28, maxWidth: 860, margin: "0 auto" }}>
            {[
              { icon: "book",  title: "PRS Legislative Research",  desc: "India's most trusted non-partisan legislative research body. Their MP performance data is the backbone of LokDrishti.", link: "https://prsindia.org", color: "#FF6B00", delay: 0  },
              { icon: "globe", title: "Lok Sabha Official Records", desc: "Direct data from India's official parliamentary records — attendance registers, starred/unstarred questions, and debate transcripts.", link: "https://sansad.in", color: "#2563EB", delay: 80 },
            ].map(s => (
              <Reveal key={s.title} delay={s.delay}>
                <div style={{ background: "white", borderRadius: 22, padding: 32, border: `1.5px solid #E8E2D9`, borderTop: `4px solid ${s.color}`, boxShadow: "0 2px 14px rgba(0,0,0,0.04)", transition: "all 0.3s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-5px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 48px ${s.color}14`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 14px rgba(0,0,0,0.04)"; }}>
                  <div style={{ width: 50, height: 50, borderRadius: 14, background: `${s.color}12`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                    <Icon id={s.icon} size={22} color={s.color} />
                  </div>
                  <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, fontWeight: 700, color: "#1A1A2E", marginBottom: 10 }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: "#8A8078", lineHeight: 1.8, marginBottom: 20 }}>{s.desc}</div>
                  <a href={s.link} target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: s.color, textDecoration: "none", transition: "gap 0.2s" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.gap = "10px")}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.gap = "6px")}>
                    Visit Source <Icon id="arrow" size={12} color={s.color} />
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CTA — no scan line, no "no login" badge, no LinkedIn
      ══════════════════════════════════════════════════════ */}
      <section style={{
        padding: "110px 48px",
        background: "linear-gradient(270deg,#C94D00,#FF6B00,#FF9A3C,#E05500,#C94D00)",
        backgroundSize: "400% 400%",
        animation: "gradShift 7s ease infinite",
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1px,transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "clamp(100px,18vw,240px)", fontWeight: 900, color: "transparent", WebkitTextStroke: "2px rgba(255,255,255,0.08)", whiteSpace: "nowrap", userSelect: "none", pointerEvents: "none" }}>
          INDIA
        </div>
        {/* circle accents */}
        <div style={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.08)", pointerEvents: "none" }} />

        <Reveal>
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(42px,6vw,80px)", fontWeight: 700, color: "white", letterSpacing: "-2.5px", lineHeight: 0.92, marginBottom: 26 }}>
              Your democracy.<br />
              <span style={{ color: "rgba(255,255,255,0.45)", fontStyle: "italic" }}>Your data. Your right.</span>
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.72)", maxWidth: 440, margin: "0 auto 44px", lineHeight: 1.82 }}>
              Check how your MP is performing right now.
              Transparent, free, and built for 1.4 billion citizens.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/ranking" style={{
                display: "inline-flex", alignItems: "center", gap: 9,
                padding: "17px 38px", background: "#0A1628", color: "white",
                borderRadius: 100, textDecoration: "none", fontWeight: 700, fontSize: 15,
                boxShadow: "0 6px 28px rgba(10,22,40,0.4)", transition: "all 0.25s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 36px rgba(10,22,40,0.55)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 28px rgba(10,22,40,0.4)"; }}>
                Explore All 543 MPs <Icon id="arrow" size={17} color="white" />
              </Link>
              <Link href="/analytics" style={{
                display: "inline-flex", alignItems: "center", gap: 9,
                padding: "17px 38px", background: "rgba(255,255,255,0.15)",
                color: "white", border: "1.5px solid rgba(255,255,255,0.3)",
                borderRadius: 100, textDecoration: "none", fontWeight: 600, fontSize: 15, transition: "all 0.25s",
              }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.26)")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.15)")}>
                View Analytics
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

    </div>
  );
}