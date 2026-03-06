import Link from "next/link";
import Chakra from "@/components/chakra";
import CheckYourMP from "@/components/checkyourmp";
import FeatureCardsHome from "@/components/featurecardshome";

export default async function Home() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#FAFAF7", color: "#0A1628" }}>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        padding: "100px 80px 60px",
        gap: "40px",
        background: "#FAFAF7",
      }}>
        {/* Tricolor top line */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "3px",
          background: "linear-gradient(90deg,#FF6B00 33%,#FFFFFF 33%,#FFFFFF 66%,#138808 66%)",
        }} />

        {/* Dot grid bg */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: "radial-gradient(circle,#0A162808 1px,transparent 1px)",
          backgroundSize: "32px 32px",
        }} />

        {/* LEFT */}
        <div style={{ position: "relative", zIndex: 2 }}>

          {/* "No bias" pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "#0A162808", border: "1px solid #0A162818",
            borderRadius: "100px", padding: "5px 14px", marginBottom: "16px",
          }}>
            <span style={{ fontSize: "11px", color: "#6B7A8D", fontWeight: 600, letterSpacing: "0.08em" }}>
              📊 No bias. No politics. Just parliamentary data.
            </span>
          </div>

          {/* Civic pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "#FF6B0010", border: "1px solid #FF6B0030",
            borderRadius: "100px", padding: "6px 16px", marginBottom: "28px",
            marginLeft: "8px",
          }}>
            <div style={{
              width: "7px", height: "7px", borderRadius: "50%",
              background: "#FF6B00", animation: "pulse 2s ease-in-out infinite",
            }} />
            <span style={{ fontSize: "12px", color: "#FF6B00", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Civic Intelligence · 18th Lok Sabha
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(44px, 5vw, 78px)",
            lineHeight: 1.0, fontWeight: 700, marginBottom: "24px", color: "#0A1628",
          }}>
            <span style={{ display: "block" }}>Every Vote.</span>
            <span style={{ display: "block" }}>
              Every <span style={{ color: "#FF6B00", fontStyle: "italic" }}>Question.</span>
            </span>
            <span style={{ display: "block" }}>Every MP.</span>
          </h1>

          <div style={{
            width: "60px", height: "2px",
            background: "linear-gradient(90deg,#FF6B00,#FF6B0040)",
            marginBottom: "22px",
          }} />

          <p style={{ fontSize: "16px", color: "#4A5568", lineHeight: 1.75, maxWidth: "440px", marginBottom: "36px" }}>
            LokDrishti tracks the real parliamentary performance of all{" "}
            <strong>543 MPs</strong> in India's 18th Lok Sabha — built on
            open data from PRS Legislative Research.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link href="/rankings" style={{
              padding: "13px 26px", background: "#FF6B00", color: "white",
              borderRadius: "6px", textDecoration: "none", fontWeight: 700, fontSize: "14px",
              boxShadow: "0 4px 20px rgba(255,107,0,0.3)",
            }}>Explore Rankings →</Link>
            <Link href="/analytics" style={{
              padding: "13px 26px", background: "white", color: "#0A1628",
              border: "1.5px solid #E2D9CE", borderRadius: "6px",
              textDecoration: "none", fontWeight: 600, fontSize: "14px",
            }}>View Analytics</Link>
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: "36px", marginTop: "44px", paddingTop: "28px", borderTop: "1px solid #E2D9CE" }}>
            {[
              { n: "543", label: "MPs" },
              { n: "28",  label: "States" },
              { n: "40+", label: "Parties" },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "34px", fontWeight: 700, color: "#0A1628", lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: "11px", color: "#8A9AB0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "3px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Chakra */}
        <div style={{
          position: "relative", zIndex: 2,
          display: "flex", alignItems: "center", justifyContent: "center",
          maxWidth: "100%", overflow: "hidden",
        }}>
          <div style={{ width: "min(520px, 100%)", aspectRatio: "1" }}>
            <Chakra />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TICKER
      ══════════════════════════════════════ */}
      <div style={{ background: "#0A1628", padding: "10px 0", overflow: "hidden", whiteSpace: "nowrap" }}>
        <div style={{
          display: "inline-block", animation: "ticker 35s linear infinite",
          fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em",
          textTransform: "uppercase", color: "rgba(255,255,255,0.45)",
        }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} style={{ marginRight: "48px" }}>
              543 MPs Analysed
              <span style={{ color: "#FF6B00", margin: "0 12px" }}>·</span>
              18th Lok Sabha
              <span style={{ color: "#FF6B00", margin: "0 12px" }}>·</span>
              Attendance · Debates · Questions
              <span style={{ color: "#FF6B00", margin: "0 12px" }}>·</span>
              No Bias. Just Data.
              <span style={{ color: "#FF6B00", margin: "0 12px" }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          BREAKING ALERT
      ══════════════════════════════════════ */}
      <div style={{
        background: "#FFF7ED", borderBottom: "1px solid #FED7AA",
        borderTop: "1px solid #FED7AA", padding: "18px 80px",
      }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto", display: "flex",
          alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              background: "#DC2626", color: "white", fontSize: "10px", fontWeight: 800,
              padding: "3px 8px", borderRadius: "4px", letterSpacing: "0.1em",
              animation: "blink 2s ease-in-out infinite",
            }}>DATA ALERT</div>
            <span style={{ fontSize: "14px", color: "#0A1628", fontWeight: 600 }}>
              A significant number of MPs have{" "}
              <strong style={{ color: "#DC2626" }}>never asked a single question</strong>{" "}
              in Parliament this session.
            </span>
          </div>
          <Link href="/rankings?silent=true" style={{
            fontSize: "13px", fontWeight: 700, color: "#DC2626",
            textDecoration: "none", whiteSpace: "nowrap", borderBottom: "1px solid #DC2626",
          }}>See Silent MPs →</Link>
        </div>
      </div>

      {/* ══════════════════════════════════════
          JUST THE FACTS
      ══════════════════════════════════════ */}
      <section style={{ padding: "72px 80px", background: "#FAFAF7" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "40px" }}>
            <div style={{ width: "28px", height: "2px", background: "#FF6B00" }} />
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#FF6B00", textTransform: "uppercase", letterSpacing: "0.18em" }}>
              Just the Facts — No Opinion, Only Data
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            {[
              { stat: "1 in 5",    desc: "MPs attended less than 50% of parliamentary sessions",                    color: "#DC2626", icon: "📉" },
              { stat: "Top 10",    desc: "MPs asked more questions than the bottom 200 combined",                   color: "#FF6B00", icon: "❓" },
              { stat: "28 States", desc: "Show dramatically different levels of parliamentary engagement",          color: "#0057A8", icon: "🗺"  },
              { stat: "Open Data", desc: "All metrics sourced from PRS Legislative Research — publicly available", color: "#138808", icon: "📂" },
            ].map((fact, i) => (
              <div key={i} style={{
                background: "white", borderRadius: "12px", padding: "24px 20px",
                border: "1px solid #E2D9CE", borderTop: `3px solid ${fact.color}`,
                boxShadow: "0 2px 12px rgba(10,22,40,0.05)",
              }}>
                <div style={{ fontSize: "28px", marginBottom: "12px" }}>{fact.icon}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "30px", fontWeight: 700, color: fact.color, lineHeight: 1, marginBottom: "10px" }}>{fact.stat}</div>
                <p style={{ fontSize: "13px", color: "#6B7A8D", lineHeight: 1.6 }}>{fact.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CHECK YOUR MP
      ══════════════════════════════════════ */}
      <section style={{
        padding: "80px 80px", background: "#F3EFE8",
        borderTop: "1px solid #E2D9CE", borderBottom: "1px solid #E2D9CE",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", marginBottom: "16px" }}>
              <div style={{ width: "28px", height: "2px", background: "#FF6B00" }} />
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#FF6B00", textTransform: "uppercase", letterSpacing: "0.18em" }}>Check Your MP</span>
              <div style={{ width: "28px", height: "2px", background: "#FF6B00" }} />
            </div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(32px, 3.5vw, 50px)", fontWeight: 700,
              color: "#0A1628", letterSpacing: "-0.5px", marginBottom: "12px",
            }}>
              How does <span style={{ color: "#FF6B00", fontStyle: "italic" }}>your MP</span> perform?
            </h2>
            <p style={{ fontSize: "15px", color: "#6B7A8D", maxWidth: "480px", margin: "0 auto", lineHeight: 1.7 }}>
              Type any MP's name and instantly see their attendance, debate record,
              questions raised, and a performance grade.
            </p>
          </div>
          <CheckYourMP />
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURE CARDS — client component
          ✅ No onMouseEnter/onMouseLeave here
      ══════════════════════════════════════ */}
      <section style={{ padding: "88px 80px", background: "#FAFAF7" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
            <div style={{ width: "28px", height: "2px", background: "#FF6B00" }} />
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#FF6B00", textTransform: "uppercase", letterSpacing: "0.18em" }}>
              Explore the Platform
            </span>
          </div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(30px, 3vw, 46px)", fontWeight: 700,
            color: "#0A1628", marginBottom: "48px", letterSpacing: "-0.3px",
          }}>
            Everything you need to hold Parliament{" "}
            <span style={{ color: "#FF6B00", fontStyle: "italic" }}>accountable</span>
          </h2>
          <FeatureCardsHome />
        </div>
      </section>

      {/* ══════════════════════════════════════
          METRIC GRID
      ══════════════════════════════════════ */}
      <section style={{ padding: "88px 80px", background: "#F3EFE8", borderTop: "1px solid #E2D9CE" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
            <div style={{ width: "28px", height: "2px", background: "#FF6B00" }} />
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#FF6B00", textTransform: "uppercase", letterSpacing: "0.18em" }}>
              11 Metrics. Zero Opinion.
            </span>
          </div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(30px, 3vw, 46px)", fontWeight: 700,
            color: "#0A1628", marginBottom: "48px",
          }}>
            What LokDrishti actually{" "}
            <span style={{ color: "#FF6B00", fontStyle: "italic" }}>measures</span>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {[
              { num: "01", name: "LCI Score",            icon: "⚡", desc: "Composite civic performance index",    color: "#FF6B00" },
              { num: "02", name: "Attendance Rate",       icon: "📋", desc: "Sessions attended vs total sittings", color: "#0057A8" },
              { num: "03", name: "Debate Participation",  icon: "🎙", desc: "Number of debates on the floor",      color: "#138808" },
              { num: "04", name: "Questions Raised",      icon: "❓", desc: "Starred, unstarred & supplementary",  color: "#FF6B00" },
              { num: "05", name: "State Strength Index",  icon: "🗺", desc: "Weighted state-level performance",    color: "#0057A8" },
              { num: "06", name: "Silent MP Detector",    icon: "🔇", desc: "Zero engagement flag",               color: "#DC2626" },
            ].map((m) => (
              <div key={m.num} style={{
                background: "white", borderRadius: "10px", padding: "20px",
                border: "1px solid #E2D9CE", display: "flex", alignItems: "flex-start", gap: "14px",
                boxShadow: "0 1px 6px rgba(10,22,40,0.04)",
              }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "8px",
                  background: `${m.color}12`, border: `1px solid ${m.color}25`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "18px", flexShrink: 0,
                }}>{m.icon}</div>
                <div>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: m.color, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "4px" }}>{m.num}</div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#0A1628", marginBottom: "4px" }}>{m.name}</div>
                  <div style={{ fontSize: "12px", color: "#8A9AB0", lineHeight: 1.5 }}>{m.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA
      ══════════════════════════════════════ */}
      <section style={{
        padding: "100px 80px", background: "#0A1628",
        textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,107,0,0.07) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }} />
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "500px", height: "250px",
          background: "radial-gradient(ellipse, rgba(255,107,0,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#FF6B00", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "18px" }}>
            Your Democracy. Your Data. Your Right.
          </p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 700,
            color: "white", lineHeight: 1.05, letterSpacing: "-1px", marginBottom: "20px",
          }}>
            Hold Parliament<br />
            <span style={{ color: "#FF6B00", fontStyle: "italic" }}>Accountable.</span>
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", maxWidth: "400px", margin: "0 auto 36px", lineHeight: 1.7 }}>
            No noise. No opinion. Just the data your representatives don't want you to see.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/rankings" style={{
              padding: "14px 32px", background: "#FF6B00", color: "white",
              borderRadius: "6px", textDecoration: "none", fontWeight: 700, fontSize: "14px",
              boxShadow: "0 0 32px rgba(255,107,0,0.35)",
            }}>Explore Rankings →</Link>
            <Link href="/analytics" style={{
              padding: "14px 32px", background: "transparent", color: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(255,255,255,0.15)", borderRadius: "6px",
              textDecoration: "none", fontWeight: 600, fontSize: "14px",
            }}>View Analytics</Link>
          </div>
        </div>
      </section>

    </div>
  );
}