import Link from "next/link";
import FeatureCards from "@/components/featurecards";
import MetricList from "@/components/metriclist";
import Chakra from "@/components/chakra";

export default async function Home() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#FAFAF7", color: "#0A1628" }}>

      {/* HERO */}
      <section style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        padding: "100px 80px 60px",
        gap: "60px",
        background: "#FAFAF7",
      }}>

        {/* Tricolor top line */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "linear-gradient(90deg,#FF6B00 33%,#FFFFFF 33%,#FFFFFF 66%,#138808 66%)"
        }} />

        {/* Background grid */}
        <div style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          backgroundImage: "radial-gradient(circle,#0A162808 1px,transparent 1px)",
          backgroundSize: "32px 32px"
        }} />

        {/* LEFT TEXT */}
        <div style={{ position: "relative", zIndex: 2 }}>

          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "#FF6B0010",
            border: "1px solid #FF6B0030",
            borderRadius: "100px",
            padding: "6px 16px",
            marginBottom: "32px"
          }}>
            <div style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#FF6B00"
            }} />
            <span style={{
              fontSize: "12px",
              color: "#FF6B00",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase"
            }}>
              Civic Intelligence · 18th Lok Sabha
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(48px,5.5vw,82px)",
            lineHeight: 1,
            fontWeight: 700,
            marginBottom: "28px"
          }}>
            <span style={{ display: "block" }}>Every Vote.</span>
            <span style={{ display: "block" }}>
              Every <span style={{ color: "#FF6B00", fontStyle: "italic" }}>Question.</span>
            </span>
            <span style={{ display: "block" }}>Every MP.</span>
          </h1>

          <div style={{
            width: "60px",
            height: "2px",
            background: "linear-gradient(90deg,#FF6B00,#FF6B0040)",
            marginBottom: "24px"
          }} />

          <p style={{
            fontSize: "17px",
            color: "#4A5568",
            lineHeight: 1.75,
            maxWidth: "460px",
            marginBottom: "44px"
          }}>
            LokDrishti tracks the real parliamentary performance of all
            <b> 543 MPs </b> in India's 18th Lok Sabha using open legislative data.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link href="/rankings" style={{
              padding: "14px 28px",
              background: "#FF6B00",
              color: "white",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "14px"
            }}>
              Explore Rankings →
            </Link>

            <Link href="/analytics" style={{
              padding: "14px 28px",
              background: "white",
              color: "#0A1628",
              border: "1.5px solid #E2D9CE",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: 600
            }}>
              View Analytics
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display: "flex",
            gap: "40px",
            marginTop: "52px",
            paddingTop: "32px",
            borderTop: "1px solid #E2D9CE"
          }}>
            {[
              { n: "543", label: "MPs" },
              { n: "28", label: "States" },
              { n: "40+", label: "Parties" }
            ].map((s) => (
              <div key={s.label}>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "36px",
                  fontWeight: 700
                }}>
                  {s.n}
                </div>
                <div style={{
                  fontSize: "11px",
                  color: "#8A9AB0",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em"
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT SIDE — CHAKRA */}
        <div style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <Chakra />
        </div>

      </section>

      {/* TICKER */}
      <div style={{
        background: "#0A1628",
        padding: "11px 0",
        overflow: "hidden",
        whiteSpace: "nowrap"
      }}>
        <div style={{
          display: "inline-block",
          animation: "ticker 35s linear infinite",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.5)"
        }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} style={{ marginRight: "64px" }}>
              543 MPs Analysed · 18th Lok Sabha · Attendance · Debates · Questions · Civic Data for Every Indian ·
            </span>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section style={{ padding: "100px 80px", background: "#FAFAF7" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <FeatureCards />
        </div>
      </section>

      {/* METRICS */}
      <section style={{
        padding: "100px 80px",
        background: "#F3EFE8",
        borderTop: "1px solid #E2D9CE",
        borderBottom: "1px solid #E2D9CE"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <MetricList />
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: "120px 80px",
        background: "#0A1628",
        textAlign: "center"
      }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "60px",
          color: "white"
        }}>
          Hold Parliament <span style={{ color: "#FF6B00" }}>Accountable</span>
        </h2>

        <Link href="/rankings" style={{
          padding: "16px 40px",
          background: "#FF6B00",
          color: "white",
          borderRadius: "6px",
          textDecoration: "none",
          fontWeight: 700,
          display: "inline-block",
          marginTop: "40px"
        }}>
          Start Exploring →
        </Link>
      </section>

    </div>
  );
}