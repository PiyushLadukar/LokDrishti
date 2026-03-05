import Link from "next/link";
import HeroCanvas from "@/components/herocanvas";
import FeatureCards from "@/components/featurecards";
import MetricList from "@/components/metriclist";

function AshokaChakraBG() {
  return (
    <div style={{
      position: "absolute", right: "-100px", top: "50%",
      transform: "translateY(-50%)",
      opacity: 0.05,
      animation: "chakra-spin 80s linear infinite",
      pointerEvents: "none",
    }}>
      <svg width="600" height="600" viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="96" stroke="white" strokeWidth="5" />
        <circle cx="100" cy="100" r="16" fill="white" />
        {Array.from({ length: 24 }).map((_, i) => {
          const rad = (i * 360 / 24) * Math.PI / 180;
          return (
            <line key={i}
              x1={100 + 16 * Math.cos(rad)} y1={100 + 16 * Math.sin(rad)}
              x2={100 + 70 * Math.cos(rad)} y2={100 + 70 * Math.sin(rad)}
              stroke="white" strokeWidth="2"
            />
          );
        })}
      </svg>
    </div>
  );
}

export default async function Home() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#0D0D0D", color: "white" }}>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section style={{
        minHeight: "100vh",
        display: "flex", flexDirection: "column", justifyContent: "center",
        position: "relative", overflow: "hidden",
        padding: "120px 80px 80px",
      }}>
        <HeroCanvas />

        {/* Vertical side label */}
        <div style={{
          position: "absolute", left: "32px", top: "50%",
          transform: "translateY(-50%) rotate(-90deg)",
          fontSize: "11px", fontWeight: 600,
          letterSpacing: "0.25em", color: "rgba(255,255,255,0.2)",
          textTransform: "uppercase", whiteSpace: "nowrap",
        }}>
          18th Lok Sabha · 2024–2029
        </div>

        {/* Content */}
        <div style={{ position: "relative", zIndex: 2, maxWidth: "900px" }}>

          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "36px" }}>
            <div style={{
              width: "8px", height: "8px", borderRadius: "50%",
              background: "#FF6B00",
              boxShadow: "0 0 12px rgba(255,107,0,0.8)",
              animation: "pulse 2s ease-in-out infinite",
            }} />
            <span style={{
              fontSize: "12px", fontWeight: 600,
              color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase", letterSpacing: "0.15em",
            }}>
              Civic Intelligence Engine
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(56px, 8vw, 110px)",
            lineHeight: 0.95, letterSpacing: "-2px",
            fontWeight: 700, marginBottom: "0", color: "white",
          }}>
            <span style={{ display: "block" }}>Every Vote.</span>
            <span style={{ display: "block" }}>
              Every{" "}
              <span style={{ color: "transparent", WebkitTextStroke: "2px #FF6B00", fontStyle: "italic" }}>
                Question.
              </span>
            </span>
            <span style={{ display: "block" }}>Every MP.</span>
          </h1>

          <div style={{
            width: "80px", height: "2px",
            background: "linear-gradient(90deg, #FF6B00, transparent)",
            margin: "40px 0",
          }} />

          <p style={{
            fontSize: "18px", color: "rgba(255,255,255,0.5)",
            lineHeight: 1.7, maxWidth: "520px", marginBottom: "48px",
          }}>
            LokDrishti tracks the real parliamentary performance of all 544 MPs
            in India's 18th Lok Sabha — built on open legislative data.
          </p>

          <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
            <Link href="/rankings" style={{
              padding: "14px 32px", background: "#FF6B00", color: "white",
              borderRadius: "4px", textDecoration: "none",
              fontWeight: 700, fontSize: "14px",
              letterSpacing: "0.05em", textTransform: "uppercase",
              boxShadow: "0 0 32px rgba(255,107,0,0.4)",
            }}>
              Explore Rankings
            </Link>
            <Link href="/analytics" style={{
              padding: "14px 32px", background: "transparent",
              color: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "4px", textDecoration: "none",
              fontWeight: 500, fontSize: "14px",
              letterSpacing: "0.05em", textTransform: "uppercase",
            }}>
              View Analytics
            </Link>
          </div>
        </div>

        {/* Bottom stats bar */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          display: "flex", borderTop: "1px solid rgba(255,255,255,0.06)", zIndex: 2,
        }}>
          {[
            { n: "544", label: "Members of Parliament" },
            { n: "28",  label: "States & Union Territories" },
            { n: "40+", label: "Political Parties" },
            { n: "11",  label: "Performance Metrics" },
          ].map((s, i) => (
            <div key={i} style={{
              flex: 1, padding: "24px 32px",
              borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "44px", fontWeight: 700,
                color: "white", lineHeight: 1, marginBottom: "4px",
              }}>
                {s.n}
              </div>
              <div style={{
                fontSize: "11px", color: "rgba(255,255,255,0.35)",
                fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em",
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          TICKER
      ══════════════════════════════════════ */}
      <div style={{
        background: "#FF6B00", padding: "12px 0",
        overflow: "hidden", whiteSpace: "nowrap",
      }}>
        <div style={{
          display: "inline-block",
          animation: "ticker 30s linear infinite",
          fontSize: "12px", fontWeight: 700,
          letterSpacing: "0.15em", textTransform: "uppercase", color: "white",
        }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} style={{ marginRight: "64px" }}>
              544 MPs Analysed &nbsp;·&nbsp; 18th Lok Sabha &nbsp;·&nbsp;
              Attendance · Debates · Questions &nbsp;·&nbsp;
              Civic Data for Every Indian &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          FEATURE CARDS
      ══════════════════════════════════════ */}
      <section style={{ padding: "120px 80px", background: "#0D0D0D" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "64px" }}>
            <div style={{ width: "40px", height: "1px", background: "#FF6B00" }} />
            <span style={{
              fontSize: "11px", fontWeight: 700,
              color: "#FF6B00", textTransform: "uppercase", letterSpacing: "0.2em",
            }}>
              What LokDrishti Measures
            </span>
          </div>
          <FeatureCards />
        </div>
      </section>

      {/* ══════════════════════════════════════
          METRICS SECTION
      ══════════════════════════════════════ */}
      <section style={{
        padding: "120px 80px", background: "#111111",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        position: "relative", overflow: "hidden",
      }}>
        <AshokaChakraBG />

        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: "80px", alignItems: "center",
          }}>
            {/* Left */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                <div style={{ width: "40px", height: "1px", background: "#FF6B00" }} />
                <span style={{
                  fontSize: "11px", fontWeight: 700,
                  color: "#FF6B00", textTransform: "uppercase", letterSpacing: "0.2em",
                }}>
                  The Metrics
                </span>
              </div>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(40px, 4vw, 64px)",
                fontWeight: 700, color: "white",
                lineHeight: 1.05, letterSpacing: "-1px", marginBottom: "24px",
              }}>
                Performance measured.<br />
                <span style={{ color: "#FF6B00", fontStyle: "italic" }}>
                  Inequality detected.
                </span>
              </h2>
              <p style={{
                fontSize: "16px", color: "rgba(255,255,255,0.45)",
                lineHeight: 1.8, marginBottom: "40px", maxWidth: "420px",
              }}>
                Beyond simple rankings — LokDrishti computes State Strength,
                Party Dominance, and a Representation Imbalance Detector
                to reveal patterns invisible in raw data.
              </p>
              <Link href="/analytics" style={{
                display: "inline-flex", alignItems: "center", gap: "10px",
                color: "#FF6B00", fontWeight: 600, fontSize: "14px",
                textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.1em",
              }}>
                Explore Analytics <span style={{ fontSize: "18px" }}>→</span>
              </Link>
            </div>

            {/* Right — client component handles hover */}
            <MetricList />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA
      ══════════════════════════════════════ */}
      <section style={{
        padding: "140px 80px", background: "#0D0D0D",
        textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        {/* Ghost INDIA text */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(100px, 20vw, 260px)",
          fontWeight: 900, color: "transparent",
          WebkitTextStroke: "1px rgba(255,255,255,0.03)",
          whiteSpace: "nowrap", pointerEvents: "none",
          userSelect: "none", lineHeight: 1,
        }}>
          INDIA
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{
            fontSize: "12px", fontWeight: 700, color: "#FF6B00",
            textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "24px",
          }}>
            Your Democracy. Your Data.
          </p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(40px, 6vw, 80px)",
            fontWeight: 700, color: "white",
            lineHeight: 1.0, letterSpacing: "-1.5px", marginBottom: "32px",
          }}>
            Hold Parliament<br />
            <span style={{ color: "#FF6B00", fontStyle: "italic" }}>Accountable.</span>
          </h2>
          <p style={{
            fontSize: "17px", color: "rgba(255,255,255,0.4)",
            maxWidth: "480px", margin: "0 auto 48px", lineHeight: 1.7,
          }}>
            Every citizen deserves to know how their representative performs.
            No noise. Just data.
          </p>
          <Link href="/rankings" style={{
            padding: "16px 48px", background: "#FF6B00", color: "white",
            borderRadius: "4px", textDecoration: "none",
            fontWeight: 700, fontSize: "14px",
            letterSpacing: "0.1em", textTransform: "uppercase",
            boxShadow: "0 0 48px rgba(255,107,0,0.4)",
          }}>
            Start Exploring →
          </Link>
        </div>
      </section>

    </div>
  );
}