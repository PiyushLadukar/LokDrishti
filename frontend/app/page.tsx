import Link from "next/link";
import { getNationalRankings } from "@/lib/api";
import MpCard from "@/components/Mpcard";
import StatCard from "@/components/statecard";
import { MP } from "@/types";

export default async function Home() {
  let top10: MP[] = [];
  try {
    const data = await getNationalRankings(10);
    top10 = data.data || [];
  } catch {
    top10 = [];
  }

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>

      {/* ── HERO ──────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(160deg, var(--navy) 0%, var(--navy-mid) 60%, var(--navy-light) 100%)",
        minHeight: "88vh",
        display: "flex", alignItems: "center",
        position: "relative", overflow: "hidden",
      }}>
        {/* Watermark Chakra */}
        <div style={{
          position: "absolute", right: "-80px", top: "50%",
          transform: "translateY(-50%)",
          width: "560px", height: "560px",
          opacity: 0.06,
          animation: "chakra-spin 60s linear infinite",
        }}>
          <svg viewBox="0 0 200 200" fill="none" width="100%" height="100%">
            <circle cx="100" cy="100" r="90" stroke="white" strokeWidth="4"/>
            <circle cx="100" cy="100" r="18" fill="white"/>
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = (i * 360) / 24;
              const rad = (angle * Math.PI) / 180;
              const x1 = 100 + 18 * Math.cos(rad);
              const y1 = 100 + 18 * Math.sin(rad);
              const x2 = 100 + 72 * Math.cos(rad);
              const y2 = 100 + 72 * Math.sin(rad);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="3"/>;
            })}
          </svg>
        </div>

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          {/* Tag */}
          <div className="animate-fade-up" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(255,107,0,0.15)",
            border: "1px solid rgba(255,107,0,0.3)",
            borderRadius: "100px",
            padding: "6px 16px",
            marginBottom: "28px",
          }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--saffron)" }}/>
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>
              18th Lok Sabha · 544 MPs Analysed
            </span>
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-up delay-100"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(40px, 6vw, 72px)",
              color: "white",
              lineHeight: 1.1,
              maxWidth: "720px",
              marginBottom: "24px",
              opacity: 0,
            }}
          >
            नागरिकों की{" "}
            <span style={{ color: "var(--saffron)" }}>दृष्टि</span>
            <br />
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.65em", fontWeight: 300 }}>
              Civic Intelligence for India
            </span>
          </h1>

          <p
            className="animate-fade-up delay-200"
            style={{
              fontSize: "18px", color: "rgba(255,255,255,0.65)",
              maxWidth: "520px", lineHeight: 1.7, marginBottom: "40px", opacity: 0,
            }}
          >
            LokDrishti is a data-driven performance engine for India's Members of Parliament.
            Track attendance, debates, questions, and civic engagement — all in one place.
          </p>

          {/* CTAs */}
          <div
            className="animate-fade-up delay-300"
            style={{ display: "flex", gap: "16px", flexWrap: "wrap", opacity: 0 }}
          >
            <Link href="/rankings" style={{
              padding: "14px 28px",
              background: "var(--saffron)",
              color: "white",
              borderRadius: "var(--radius-sm)",
              textDecoration: "none",
              fontWeight: 700, fontSize: "15px",
              boxShadow: "var(--shadow-saffron)",
            }}>
              Explore Rankings →
            </Link>
            <Link href="/analytics" style={{
              padding: "14px 28px",
              background: "rgba(255,255,255,0.08)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "var(--radius-sm)",
              textDecoration: "none",
              fontWeight: 500, fontSize: "15px",
            }}>
              View Analytics
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ──────────────────────────────── */}
      <section style={{ background: "var(--cream-dark)", borderBottom: "1px solid var(--border)" }}>
        <div className="container" style={{
          display: "flex", gap: "16px", flexWrap: "wrap",
          justifyContent: "center", padding: "40px 24px",
        }}>
          <StatCard value="544"  label="MPs Tracked"      accent delay={0}   />
          <StatCard value="28"   label="States & UTs"     delay={100} />
          <StatCard value="40+"  label="Political Parties" delay={200} />
          <StatCard value="11"   label="Metrics Computed" delay={300} />
        </div>
      </section>

      {/* ── TOP 10 ──────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
            <div>
              <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--saffron)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>
                National Rankings
              </p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "36px", color: "var(--navy)" }}>
                Top 10 Performers
              </h2>
            </div>
            <Link href="/rankings" style={{
              color: "var(--saffron)", fontWeight: 600, fontSize: "14px",
              textDecoration: "none", display: "flex", alignItems: "center", gap: "4px",
            }}>
              View all 544 →
            </Link>
          </div>

          {top10.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "60px",
              color: "var(--text-muted)", fontSize: "15px",
              background: "white", borderRadius: "var(--radius-md)", border: "1px solid var(--border)",
            }}>
              ⚠ Could not load data. Make sure your Flask API is running at{" "}
              <code style={{ color: "var(--saffron)" }}>http://127.0.0.1:5000</code>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "12px" }}>
              {top10.map((mp, i) => (
                <MpCard key={mp.name} mp={mp} rank={i + 1} delay={i * 60} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────── */}
      <section className="section" style={{ background: "var(--navy)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--saffron)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>
              The Intelligence Layer
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "36px", color: "white" }}>
              How LCI Score Works
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
            {[
              { icon: "📋", title: "Attendance", weight: "40%", desc: "Parliamentary session attendance as a percentage of total sittings" },
              { icon: "🎙", title: "Debates",    weight: "30%", desc: "Number of debates participated in during the session" },
              { icon: "❓", title: "Questions",  weight: "30%", desc: "Number of questions raised on the floor of the house" },
            ].map((item, i) => (
              <div key={i} className="animate-fade-up" style={{
                animationDelay: `${i * 100}ms`, opacity: 0,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "var(--radius-md)", padding: "28px",
              }}>
                <div style={{ fontSize: "32px", marginBottom: "12px" }}>{item.icon}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ color: "white", fontWeight: 600, fontSize: "16px" }}>{item.title}</span>
                  <span style={{ color: "var(--saffron)", fontWeight: 700, fontSize: "18px" }}>{item.weight}</span>
                </div>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "14px", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}