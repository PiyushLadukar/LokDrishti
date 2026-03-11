
import Link from "next/link";
import Chakra from "@/components/chakra";
import CheckYourMP from "@/components/checkyourmp";
import FeatureCardsHome from "@/components/featurecardshome";

export default async function Home() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#FAFAF7", color: "#0A1628" }}>

      {/* ══════════════════════════════
          HERO
      ══════════════════════════════ */}
      <section style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        padding: "100px 80px 60px",
        background: "#FAFAF7",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", zIndex: 10, background: "linear-gradient(90deg,#FF6B00 33%,#FAFAF7 33%,#FAFAF7 66%,#138808 66%)" }} />
        <div style={{ position: "absolute", left: "-20px", top: "50%", transform: "translateY(-52%)", fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(200px, 28vw, 420px)", fontWeight: 900, lineHeight: 0.85, letterSpacing: "-8px", color: "transparent", WebkitTextStroke: "1.5px rgba(10,22,40,0.04)", userSelect: "none", pointerEvents: "none", zIndex: 0, whiteSpace: "nowrap" }}>LOK</div>
        <div style={{ position: "absolute", inset: 0, zIndex: 0, backgroundImage: "radial-gradient(circle, #0A162806 1px, transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "36px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "white", border: "1px solid #E2D9CE", borderRadius: "100px", padding: "5px 14px", boxShadow: "0 2px 8px rgba(10,22,40,0.06)" }}>
              <span style={{ fontSize: "11px", color: "#6B7A8D", fontWeight: 600, letterSpacing: "0.06em" }}>No bias · No politics · Just data</span>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "#FF6B0012", border: "1px solid #FF6B0035", borderRadius: "100px", padding: "5px 14px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#FF6B00", animation: "pulse 2s ease-in-out infinite", boxShadow: "0 0 8px rgba(255,107,0,0.7)" }} />
              <span style={{ fontSize: "11px", color: "#FF6B00", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Live · 18th Lok Sabha</span>
            </div>
          </div>

          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(52px, 5.5vw, 88px)", lineHeight: 0.95, fontWeight: 700, marginBottom: "28px", color: "#0A1628", letterSpacing: "-2.5px" }}>
            <span style={{ display: "block" }}>Every Vote.</span>
            <span style={{ display: "block" }}>Every <em style={{ color: "#FF6B00" }}>Question.</em></span>
            <span style={{ display: "block" }}>Every MP.</span>
          </h1>

          <div style={{ width: "48px", height: "3px", background: "#FF6B00", borderRadius: "2px", marginBottom: "24px" }} />

          <p style={{ fontSize: "16px", color: "#5A6475", lineHeight: 1.8, maxWidth: "420px", marginBottom: "40px" }}>
            Real parliamentary performance of all <strong style={{ color: "#0A1628" }}>543 MPs</strong> in India's 18th Lok Sabha — built on open data from PRS Legislative Research.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
            <Link href="/ranking" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 30px", background: "#FF6B00", color: "white", borderRadius: "100px", textDecoration: "none", fontWeight: 700, fontSize: "14px", boxShadow: "0 4px 28px rgba(255,107,0,0.38)" }}>
              Explore Rankings
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M8 3l5 5-5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
            <Link href="/analytics" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 28px", background: "white", color: "#0A1628", border: "1.5px solid #D4CAC0", borderRadius: "100px", textDecoration: "none", fontWeight: 600, fontSize: "14px", boxShadow: "0 2px 8px rgba(10,22,40,0.06)" }}>
              View Analytics
            </Link>
          </div>

          <div style={{ display: "flex", gap: "0", marginTop: "52px", paddingTop: "32px", borderTop: "1px solid #E2D9CE" }}>
            {[{ n: "543", label: "MPs Tracked" }, { n: "28", label: "States & UTs" }, { n: "40+", label: "Parties" }].map((s, i) => (
              <div key={s.label} style={{ paddingRight: "36px", marginRight: "36px", borderRight: i < 2 ? "1px solid #E2D9CE" : "none" }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "40px", fontWeight: 700, color: "#0A1628", lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: "11px", color: "#8A9AB0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "4px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ width: "clamp(380px, 44vw, 540px)", aspectRatio: "1/1", flexShrink: 0 }}>
            <Chakra />
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div style={{ background: "#0A1628", padding: "11px 0", overflow: "hidden", whiteSpace: "nowrap" }}>
        <div style={{ display: "inline-block", animation: "ticker 40s linear infinite", fontSize: "11px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} style={{ marginRight: "48px" }}>
              543 MPs Analysed <span style={{ color: "#FF6B00", margin: "0 16px" }}>·</span> 18th Lok Sabha <span style={{ color: "#FF6B00", margin: "0 16px" }}>·</span> Attendance · Debates · Questions <span style={{ color: "#FF6B00", margin: "0 16px" }}>·</span> No Bias. Just Data. <span style={{ color: "#FF6B00", margin: "0 16px" }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* DATA ALERT */}
      <div style={{ background: "#FFFBF5", borderBottom: "1px solid #FDDCAA", padding: "14px 80px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#DC2626", animation: "blink 1.5s ease-in-out infinite", boxShadow: "0 0 6px rgba(220,38,38,0.5)" }} />
              <span style={{ fontSize: "10px", fontWeight: 800, color: "#DC2626", letterSpacing: "0.12em", textTransform: "uppercase" }}>Data Alert</span>
            </div>
            <div style={{ width: "1px", height: "16px", background: "#E2D9CE" }} />
            <span style={{ fontSize: "14px", color: "#0A1628", fontWeight: 500 }}>A significant number of MPs have{" "}<strong style={{ color: "#DC2626" }}>never asked a single question</strong>{" "}in Parliament this session.</span>
          </div>
          <Link href="/ranking" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 700, color: "#DC2626", textDecoration: "none", padding: "6px 14px", border: "1.5px solid #DC2626", borderRadius: "100px" }}>
            See Silent MPs
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="#DC2626" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>
      </div>

      {/* ══════════════════════════════
          FACTS — full-width color blocks
      ══════════════════════════════ */}
      <section style={{ background: "#FAFAF7" }}>
        <div style={{ padding: "60px 80px 0", maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "40px" }}>
            <div style={{ width: "24px", height: "2px", background: "#FF6B00", borderRadius: "1px" }} />
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#FF6B00", textTransform: "uppercase", letterSpacing: "0.18em" }}>Just the Facts — No Opinion, Only Data</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr 0.9fr" }}>
          {/* Dark navy */}
          <div style={{ background: "#0A1628", padding: "56px 52px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: "-10px", bottom: "-20px", fontFamily: "'Cormorant Garamond', serif", fontSize: "180px", fontWeight: 900, color: "rgba(255,255,255,0.025)", lineHeight: 1, userSelect: "none" }}>01</div>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "20px" }}>Attendance Crisis</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "84px", fontWeight: 700, color: "#FF6B00", lineHeight: 0.88, marginBottom: "24px", letterSpacing: "-3px" }}>1 in 5</div>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>MPs attended less than <strong style={{ color: "white" }}>50% of sessions</strong></p>
          </div>
          {/* Saffron */}
          <div style={{ background: "#FF6B00", padding: "56px 44px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: "-10px", bottom: "-20px", fontFamily: "'Cormorant Garamond', serif", fontSize: "180px", fontWeight: 900, color: "rgba(255,255,255,0.07)", lineHeight: 1, userSelect: "none" }}>02</div>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "20px" }}>Question Gap</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "84px", fontWeight: 700, color: "white", lineHeight: 0.88, marginBottom: "24px", letterSpacing: "-3px" }}>Top 10</div>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>MPs asked more than the <strong style={{ color: "white" }}>bottom 200</strong> combined</p>
          </div>
          {/* Light cream */}
          <div style={{ background: "#F3EFE8", padding: "56px 44px", borderLeft: "1px solid #E2D9CE", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: "-10px", bottom: "-20px", fontFamily: "'Cormorant Garamond', serif", fontSize: "180px", fontWeight: 900, color: "rgba(10,22,40,0.035)", lineHeight: 1, userSelect: "none" }}>03</div>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "#8A9AB0", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "20px" }}>State Divide</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "84px", fontWeight: 700, color: "#0057A8", lineHeight: 0.88, marginBottom: "24px", letterSpacing: "-3px" }}>28</div>
            <p style={{ fontSize: "15px", color: "#5A6475", lineHeight: 1.7 }}>States show <strong style={{ color: "#0A1628" }}>dramatically different</strong> engagement</p>
          </div>
          {/* Green */}
          <div style={{ background: "#138808", padding: "56px 36px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: "-10px", bottom: "-20px", fontFamily: "'Cormorant Garamond', serif", fontSize: "180px", fontWeight: 900, color: "rgba(255,255,255,0.05)", lineHeight: 1, userSelect: "none" }}>04</div>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "20px" }}>Transparency</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "64px", fontWeight: 700, color: "white", lineHeight: 0.88, marginBottom: "24px", letterSpacing: "-2px" }}>Open<br/>Data</div>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)", lineHeight: 1.7 }}>PRS Legislative Research — <strong style={{ color: "white" }}>zero spin</strong></p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          CHECK YOUR MP
      ══════════════════════════════ */}
      <section style={{ padding: "100px 80px", background: "#0F1923", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,107,0,0.04) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%, -50%)", width: "800px", height: "400px", background: "radial-gradient(ellipse, rgba(255,107,0,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: "24px", top: "50%", transform: "translateY(-50%) rotate(-90deg)", fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.1)", letterSpacing: "0.3em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Civic Intelligence Engine</div>

        <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "20px", background: "rgba(255,107,0,0.1)", border: "1px solid rgba(255,107,0,0.2)", borderRadius: "100px", padding: "6px 16px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#FF6B00", animation: "pulse 2s ease-in-out infinite" }} />
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#FF6B00", textTransform: "uppercase", letterSpacing: "0.15em" }}>Check Your MP</span>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(40px, 5vw, 68px)", fontWeight: 700, color: "white", letterSpacing: "-1.5px", marginBottom: "16px", lineHeight: 1.0 }}>
              How does <em style={{ color: "#FF6B00" }}>your MP</em> perform?
            </h2>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", maxWidth: "420px", margin: "0 auto", lineHeight: 1.75 }}>
              Type any MP's name. Get instant attendance, debate record, questions raised, and a performance grade.
            </p>
          </div>
          <CheckYourMP />
        </div>
      </section>

      {/* ══════════════════════════════
          FEATURE CARDS
      ══════════════════════════════ */}
      <section style={{ padding: "100px 80px", background: "#FAFAF7", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "4px", background: "linear-gradient(180deg, transparent, #FF6B00 30%, #FF6B00 70%, transparent)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
            <div style={{ width: "24px", height: "2px", background: "#FF6B00", borderRadius: "1px" }} />
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#FF6B00", textTransform: "uppercase", letterSpacing: "0.18em" }}>Explore the Platform</span>
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(34px, 3.8vw, 56px)", fontWeight: 700, color: "#0A1628", marginBottom: "56px", letterSpacing: "-0.5px", lineHeight: 1.05 }}>
            Everything you need to hold Parliament <em style={{ color: "#FF6B00" }}>accountable</em>
          </h2>
          <FeatureCardsHome />
        </div>
      </section>

      {/* ══════════════════════════════
          METRICS — dark two-column
      ══════════════════════════════ */}
      <section style={{ padding: "100px 0 100px 80px", background: "#0A1628", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1280px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "80px", alignItems: "start" }}>
            <div style={{ paddingTop: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
                <div style={{ width: "24px", height: "2px", background: "#f68c41", borderRadius: "1px" }} />
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#df6f25d2", textTransform: "uppercase", letterSpacing: "0.18em" }}>Zero Opinion</span>
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 4vw, 58px)", fontWeight: 700, color: "white", letterSpacing: "-1px", lineHeight: 1.0, marginBottom: "28px" }}>
                What LokDrishti<br />actually <em style={{ color: "#f6812d" }}>measures</em>
              </h2>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)", lineHeight: 1.8, marginBottom: "40px", maxWidth: "280px" }}>
                11 objective metrics. No editorial spin. No political bias. Pure parliamentary data.
              </p>
              <Link href="/analytics" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 26px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "100px", textDecoration: "none", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>
                View All Analytics
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 2l5 5-5 5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </div>

            <div>
              {[
                { num: "01", name: "LCI Score",           desc: "Composite civic performance index",             color: "#FF6B00" },
                { num: "02", name: "Attendance Rate",      desc: "Sessions attended vs total sittings",          color: "#60A5FA" },
                { num: "03", name: "Debate Participation", desc: "Debates initiated or participated in",          color: "#34D399" },
                { num: "04", name: "Questions Raised",     desc: "Starred, unstarred & supplementary",           color: "#FF6B00" },
                { num: "05", name: "State Strength Index", desc: "Weighted state-level aggregate performance",    color: "#60A5FA" },
                { num: "06", name: "Silent MP Detector",   desc: "Zero-engagement critical accountability flag",  color: "#F87171" },
              ].map((m, i) => (
                <div key={m.num} style={{ display: "flex", alignItems: "center", gap: "20px", padding: "20px 32px 20px 0", borderBottom: i < 5 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "13px", fontWeight: 700, color: m.color, opacity: 0.7, minWidth: "28px", letterSpacing: "0.05em" }}>{m.num}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "15px", fontWeight: 700, color: "white", marginBottom: "3px" }}>{m.name}</div>
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{m.desc}</div>
                  </div>
                  <div style={{ width: "28px", height: "2px", background: m.color, opacity: 0.4, borderRadius: "1px", flexShrink: 0 }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          CTA — saffron gradient
      ══════════════════════════════ */}
      <section style={{ padding: "130px 80px", background: "linear-gradient(135deg, #f1893f 0%, #E05500 100%)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(140px, 20vw, 260px)", fontWeight: 900, lineHeight: 1, color: "transparent", WebkitTextStroke: "2px rgba(255,255,255,0.08)", whiteSpace: "nowrap", userSelect: "none", pointerEvents: "none" }}>INDIA</div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
            <div style={{ width: "20px", height: "1px", background: "rgba(255, 255, 255, 0.65)" }} />
            <span style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255, 255, 255, 0.76)", textTransform: "uppercase", letterSpacing: "0.2em" }}>Your Democracy. Your Data. Your Right.</span>
            <div style={{ width: "20px", height: "1px", background: "rgba(255, 255, 255, 0.69)" }} />
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(52px, 7vw, 96px)", fontWeight: 700, color: "white", lineHeight: 0.92, letterSpacing: "-3px", marginBottom: "28px" }}>
            Hold Parliament<br /><span style={{ color: "#0A1628" }}>Accountable.</span>
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.65)", maxWidth: "360px", margin: "0 auto 48px", lineHeight: 1.8 }}>
            No noise. No opinion. Just the data your representatives don't want you to see.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/ranking" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "15px 36px", background: "#0A1628", color: "white", borderRadius: "100px", textDecoration: "none", fontWeight: 700, fontSize: "14px", boxShadow: "0 4px 24px rgba(10,22,40,0.4)" }}>
              Explore Rankings
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M8 3l5 5-5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
            <Link href="/analytics" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "15px 36px", background: "rgba(255,255,255,0.15)", color: "white", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: "100px", textDecoration: "none", fontWeight: 600, fontSize: "14px" }}>
              View Analytics
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}