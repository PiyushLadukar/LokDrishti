"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getNationalRankings } from "@/lib/api";

const getLCI        = (mp: any): number  => mp.LCI_score  ?? 0;
const getAttendance = (mp: any): number  => mp.attendance ?? 0;
const getQuestions  = (mp: any): number  => mp.questions  ?? 0;
const getDebates    = (mp: any): number  => mp.debates    ?? 0;
const isSilent      = (mp: any): boolean => mp.silent_flag === 1;

function getGrade(lci: number) {
  if (lci >= 0.75) return { g: "A", label: "Exceptional",   color: "#138808", light: "#EDFBEE", dark: "#166534" };
  if (lci >= 0.5)  return { g: "B", label: "Good",          color: "#FF6B00", light: "#FFF4EC", dark: "#9A3412" };
  if (lci >= 0.25) return { g: "C", label: "Below Average", color: "#D97706", light: "#FFFBEB", dark: "#92400E" };
  return              { g: "D", label: "Poor",           color: "#DC2626", light: "#FFF5F5", dark: "#991B1B" };
}

function MPPhoto({ name, photoUrl, size = 80 }: { name: string; photoUrl?: string; size?: number }) {
  const [err, setErr] = useState(false);
  const initials = (name || "?").split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();
  const colors = ["#0057A8","#138808","#FF6B00","#7C3AED","#0891B2","#DC2626"];
  const color  = colors[initials.charCodeAt(0) % colors.length];
  if (photoUrl && !err) {
    return (
      <div style={{ width: size, height: size, borderRadius: "18px", overflow: "hidden", border: "3px solid rgba(255,255,255,0.15)", flexShrink: 0 }}>
        <img src={photoUrl} alt={name} onError={() => setErr(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
      </div>
    );
  }
  return (
    <div style={{ width: size, height: size, borderRadius: "18px", flexShrink: 0,
      background: `${color}25`, border: `3px solid ${color}40`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Cormorant Garamond',serif", fontSize: size * 0.35,
      fontWeight: 700, color }}>
      {initials}
    </div>
  );
}

function StatBar({ label, value, max, color, display, note }: {
  label: string; value: number; max: number; color: string; display: string; note?: string;
}) {
  const pct = Math.min((value / (max || 1)) * 100, 100);
  return (
    <div style={{ marginBottom: "18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "6px" }}>
        <div>
          <span style={{ fontSize: "12px", color: "#6B7280", fontWeight: 600 }}>{label}</span>
          {note && <span style={{ fontSize: "10px", color: "#9CA3AF", marginLeft: "6px" }}>{note}</span>}
        </div>
        <span style={{ fontSize: "16px", fontWeight: 800, color, fontFamily: "'Cormorant Garamond',serif" }}>{display}</span>
      </div>
      <div style={{ height: "8px", background: "#F3EFE8", borderRadius: "4px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${color}bb,${color})`,
          borderRadius: "4px", transition: "width 1s ease" }} />
      </div>
    </div>
  );
}

export default function MPProfilePage() {
  const params = useParams();
  const name   = decodeURIComponent((params?.name as string) ?? "");
  const [mp, setMp]         = useState<any>(null);
  const [photo, setPhoto]   = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(false);
  const [avgAtt, setAvgAtt] = useState(0);
  const [avgQ,   setAvgQ]   = useState(0);
  const [avgDeb, setAvgDeb] = useState(0);

  useEffect(() => {
    if (!name) return;
    (async () => {
      try {
        // Fetch all MPs and find by name — getMPByName might not return full data
        const first = await getNationalRankings(undefined, 1, 100);
        const total = first.total || 544;
        const pages = Math.ceil(total / 100);
        let all = [...(first.data || [])];
        for (let p = 2; p <= pages; p++) {
          const r = await getNationalRankings(undefined, p, 100);
          all = [...all, ...(r.data || [])];
        }
        const found = all.find((m: any) => m.name === name);
        if (found) setMp(found);
        else setError(true);

        // Compute averages
        setAvgAtt(all.reduce((s: number, m: any) => s + getAttendance(m), 0) / all.length);
        setAvgQ(all.reduce((s: number, m: any) => s + getQuestions(m), 0) / all.length);
        setAvgDeb(all.reduce((s: number, m: any) => s + getDebates(m), 0) / all.length);
      } catch { setError(true); }
      setLoading(false);
    })();
    // Load photo
    fetch("/mp_photos.json").then(r => r.json()).then(d => setPhoto(d[name] || null)).catch(() => {});
  }, [name]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#F7F4EF", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "14px", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ width: "32px", height: "32px", border: "3px solid rgba(255,107,0,0.15)", borderTop: "3px solid #FF6B00", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
      <div style={{ fontSize: "12px", color: "#9CA3AF" }}>Loading MP profile…</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (error || !mp) return (
    <div style={{ minHeight: "100vh", background: "#F7F4EF", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "12px", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ fontSize: "13px", color: "#9CA3AF" }}>MP not found. Flask may not be running.</div>
      <Link href="/mp" style={{ fontSize: "12px", color: "#FF6B00", textDecoration: "none", fontWeight: 700 }}>← Back to All MPs</Link>
    </div>
  );

  const lci    = getLCI(mp);
  const att    = getAttendance(mp);
  const attPct = att * 100;
  const q      = getQuestions(mp);
  const deb    = getDebates(mp);
  const silent = isSilent(mp);
  const grade  = getGrade(lci);
  const attColor = attPct >= 75 ? "#138808" : attPct >= 50 ? "#FF6B00" : "#DC2626";
  const initials = name.split(" ").map((w:string) => w[0]).slice(0,2).join("").toUpperCase();

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", background: "#F7F4EF" }}>

      {/* ══ HERO ══ */}
      <div style={{ background: "#0A1628", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,107,0,0.06) 1px, transparent 1px)", backgroundSize: "22px 22px", pointerEvents: "none" }} />
        {/* Grade color left bar */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "5px", background: `linear-gradient(180deg,transparent,${grade.color},transparent)` }} />
        {/* Ghost initials */}
        <div style={{ position: "absolute", right: "40px", top: "50%", transform: "translateY(-50%)", fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(100px,14vw,180px)", fontWeight: 900, color: "transparent", WebkitTextStroke: "1px rgba(255,255,255,0.04)", userSelect: "none", letterSpacing: "-4px", pointerEvents: "none" }}>{initials}</div>

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "36px 40px 40px", position: "relative", zIndex: 1 }}>
          <Link href="/mp" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.3)", textDecoration: "none", marginBottom: "24px", textTransform: "uppercase", letterSpacing: "0.12em" }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            All MPs
          </Link>

          <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>
            <MPPhoto name={name} photoUrl={photo ?? undefined} size={88} />
            <div style={{ flex: 1 }}>
              {/* Name + badges */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "8px" }}>
                <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(28px,4vw,52px)", fontWeight: 700, color: "white", letterSpacing: "-0.5px", lineHeight: 1 }}>
                  {mp.name}
                </h1>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  <span style={{ padding: "4px 12px", background: `${grade.color}25`, border: `1px solid ${grade.color}40`, borderRadius: "100px", fontSize: "12px", fontWeight: 800, color: grade.color }}>
                    Grade {grade.g} — {grade.label}
                  </span>
                  {silent && <span style={{ padding: "4px 10px", background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: "100px", fontSize: "10px", fontWeight: 800, color: "#DC2626" }}>SILENT MP</span>}
                </div>
              </div>

              {/* Meta */}
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "20px" }}>
                {[
                  { icon: "◉", v: mp.constituency },
                  { icon: "▲", v: mp.state },
                  { icon: "◈", v: mp.party },
                ].filter(x => x.v).map(x => (
                  <div key={x.v} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)" }}>{x.icon}</span>
                    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>{x.v}</span>
                  </div>
                ))}
              </div>

              {/* Rank pills */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {[
                  { l: "National Rank", v: `#${Math.round(mp.national_rank ?? 0)}`, c: "#FF6B00" },
                  { l: "State Rank",    v: `#${Math.round(mp.state_rank ?? 0)}`,    c: "#60A5FA" },
                  { l: "Party Rank",    v: `#${Math.round(mp.party_rank ?? 0)}`,    c: "#34D399" },
                  { l: "Percentile",    v: `${(mp.percentile ?? 0).toFixed(1)}th`,  c: "#A78BFA" },
                ].map(pill => (
                  <div key={pill.l} style={{ padding: "6px 14px", background: "rgba(255,255,255,0.05)", border: `1px solid ${pill.c}20`, borderRadius: "100px", display: "flex", gap: "7px", alignItems: "center" }}>
                    <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>{pill.l}</span>
                    <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "17px", fontWeight: 700, color: pill.c }}>{pill.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ BODY ══ */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 40px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px", alignItems: "start" }}>

          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* 4 stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {[
                { l: "LCI Score",  v: lci.toFixed(4),          c: grade.color, sub: "Lok Sabha Civic Index", big: true },
                { l: "Attendance", v: `${attPct.toFixed(1)}%`, c: attColor,   sub: "Sessions attended" },
                { l: "Questions",  v: String(q),                c: "#0057A8",  sub: "Total questions raised" },
                { l: "Debates",    v: String(deb),              c: "#7C3AED",  sub: "Debates participated" },
              ].map(card => (
                <div key={card.l} style={{ background: "white", borderRadius: "16px", padding: "20px 22px",
                  border: "1.5px solid #EDE8E0", borderTop: `4px solid ${card.c}`,
                  boxShadow: "0 1px 4px rgba(10,22,40,0.05)" }}>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: card.c, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "6px" }}>{card.l}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: card.big ? "36px" : "32px", fontWeight: 700, color: "#111827", lineHeight: 1 }}>{card.v}</div>
                  <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "4px" }}>{card.sub}</div>
                </div>
              ))}
            </div>

            {/* Performance bars vs averages */}
            <div style={{ background: "white", borderRadius: "16px", padding: "26px 28px", border: "1.5px solid #EDE8E0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "22px" }}>
                <div style={{ width: "16px", height: "2px", background: "#FF6B00", borderRadius: "1px" }} />
                <h2 style={{ fontSize: "13px", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.12em" }}>Performance vs National Average</h2>
              </div>

              <StatBar label="Attendance Rate"   value={att}  max={1}   color={attColor}  display={`${attPct.toFixed(1)}%`}  note={`avg ${(avgAtt*100).toFixed(1)}%`} />
              <StatBar label="Questions Raised"  value={q}    max={300} color="#0057A8"   display={String(q)}                 note={`avg ${avgQ.toFixed(0)}`} />
              <StatBar label="Debates"           value={deb}  max={200} color="#7C3AED"   display={String(deb)}               note={`avg ${avgDeb.toFixed(0)}`} />
              <StatBar label="LCI Score"         value={lci}  max={1}   color={grade.color} display={lci.toFixed(4)}          note="out of 1.0" />
              {mp.engagement_index != null && (
                <StatBar label="Engagement Index" value={mp.engagement_index} max={600} color="#FF6B00" display={String(mp.engagement_index)} />
              )}

              {/* Comparison callouts */}
              <div style={{ display: "flex", gap: "10px", marginTop: "20px", paddingTop: "18px", borderTop: "1px solid #F3EFE8", flexWrap: "wrap" }}>
                {[
                  { label: "Attendance", mp: attPct, avg: avgAtt*100, fmt: (v: number) => `${v.toFixed(0)}%` },
                  { label: "Questions",  mp: q,      avg: avgQ,       fmt: (v: number) => String(Math.round(v)) },
                  { label: "Debates",    mp: deb,    avg: avgDeb,     fmt: (v: number) => String(Math.round(v)) },
                ].map(c => {
                  const diff = ((c.mp - c.avg) / (c.avg || 1)) * 100;
                  const up   = c.mp >= c.avg;
                  return (
                    <div key={c.label} style={{ flex: 1, minWidth: "90px", padding: "10px 12px", borderRadius: "10px",
                      background: up ? "#F0FBF0" : "#FFF5F5", border: `1px solid ${up ? "#BBF7D0" : "#FECACA"}` }}>
                      <div style={{ fontSize: "9px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "3px" }}>{c.label}</div>
                      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "18px", fontWeight: 700, color: up ? "#138808" : "#DC2626", lineHeight: 1 }}>
                        {up ? "+" : ""}{diff.toFixed(0)}%
                      </div>
                      <div style={{ fontSize: "9px", color: "#9CA3AF", marginTop: "2px" }}>{up ? "above" : "below"} avg</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Silent MP warning */}
            {silent && (
              <div style={{ background: "#FFF5F5", borderRadius: "16px", padding: "22px 26px", border: "1.5px solid #FECACA", borderLeft: "5px solid #DC2626" }}>
                <div style={{ fontSize: "11px", fontWeight: 800, color: "#DC2626", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: "8px" }}>⚠ Silent MP Flagged</div>
                <p style={{ fontSize: "14px", color: "#7F1D1D", lineHeight: 1.7 }}>
                  This MP has recorded <strong>zero questions</strong> and <strong>zero debate participations</strong> in the 18th Lok Sabha. This is a serious accountability concern.
                </p>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

            {/* Big grade card */}
            <div style={{ background: grade.light, borderRadius: "18px", padding: "28px", border: `1.5px solid ${grade.color}25`, borderTop: `5px solid ${grade.color}`, textAlign: "center" }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "88px", fontWeight: 900, color: grade.color, lineHeight: 1, marginBottom: "6px" }}>{grade.g}</div>
              <div style={{ fontSize: "15px", fontWeight: 700, color: grade.color, marginBottom: "6px" }}>{grade.label}</div>
              <div style={{ fontSize: "12px", color: "#6B7280", lineHeight: 1.6 }}>
                LCI Score: <strong style={{ color: "#111827" }}>{lci.toFixed(4)}</strong>
              </div>
            </div>

            {/* Rankings */}
            <div style={{ background: "white", borderRadius: "14px", padding: "20px 22px", border: "1.5px solid #EDE8E0" }}>
              <div style={{ fontSize: "10px", fontWeight: 800, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: "14px" }}>Rankings</div>
              {[
                { l: "National Rank",  v: `#${Math.round(mp.national_rank ?? 0)}`,  c: "#FF6B00" },
                { l: "State Rank",     v: `#${Math.round(mp.state_rank ?? 0)}`,     c: "#0057A8" },
                { l: "Party Rank",     v: `#${Math.round(mp.party_rank ?? 0)}`,     c: "#138808" },
                { l: "Percentile",     v: `${(mp.percentile ?? 0).toFixed(1)}th`,   c: "#7C3AED" },
              ].map((r, i, arr) => (
                <div key={r.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "11px 0", borderBottom: i < arr.length-1 ? "1px solid #F3EFE8" : "none" }}>
                  <span style={{ fontSize: "12px", color: "#6B7280", fontWeight: 500 }}>{r.l}</span>
                  <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "22px", fontWeight: 700, color: r.c }}>{r.v}</span>
                </div>
              ))}
            </div>

            {/* Details */}
            <div style={{ background: "white", borderRadius: "14px", padding: "20px 22px", border: "1.5px solid #EDE8E0" }}>
              <div style={{ fontSize: "10px", fontWeight: 800, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: "14px" }}>Details</div>
              {[
                { l: "Constituency", v: mp.constituency },
                { l: "State",        v: mp.state },
                { l: "Party",        v: mp.party },
                { l: "Session",      v: "18th Lok Sabha" },
                { l: "Engagement",   v: mp.engagement_index != null ? String(mp.engagement_index) : null },
              ].filter(x => x.v).map((x, i, arr) => (
                <div key={x.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                  padding: "10px 0", borderBottom: i < arr.length-1 ? "1px solid #F3EFE8" : "none", gap: "12px" }}>
                  <span style={{ fontSize: "11px", color: "#9CA3AF", fontWeight: 600, flexShrink: 0 }}>{x.l}</span>
                  <span style={{ fontSize: "12px", color: "#111827", fontWeight: 600, textAlign: "right" }}>{x.v}</span>
                </div>
              ))}
            </div>

            {/* Source note */}
            <div style={{ padding: "14px 16px", background: "#FFFBF5", borderRadius: "12px", border: "1px solid #FDE68A" }}>
              <div style={{ fontSize: "9px", fontWeight: 800, color: "#D97706", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "5px" }}>Data Source</div>
              <p style={{ fontSize: "11px", color: "#92400E", lineHeight: 1.6 }}>PRS Legislative Research · Lok Sabha official records · Zero editorial bias.</p>
            </div>

            {/* Back button */}
            <Link href="/mp" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
              padding: "12px", background: "#0A1628", borderRadius: "12px", textDecoration: "none",
              fontSize: "12px", fontWeight: 700, color: "white", transition: "opacity 0.2s" }}>
              ← Back to All MPs
            </Link>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}