"use client";
import Link from "next/link";
import { useState } from "react";

const features = [
  {
    number: "01",
    title: "MP Rankings",
    subtitle: "National · State · Party",
    desc: "Every MP ranked by parliamentary performance. Filter by state, party, or percentile across all 544 members.",
    href: "/rankings",
    accent: "#FF6B00",
  },
  {
    number: "02",
    title: "Civic Analytics",
    subtitle: "Indexes · Inequality · Imbalance",
    desc: "State Strength Index, Party Dominance, Performance Inequality — deep analytics beyond simple rankings.",
    href: "/analytics",
    accent: "#0057A8",
  },
  {
    number: "03",
    title: "MP Profiles",
    subtitle: "Activity · Rank · Engagement",
    desc: "Full breakdown per MP — attendance, debates, questions, percentile rank, and silent MP detection.",
    href: "/rankings",
    accent: "#138808",
  },
];

export default function FeatureCards() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
      {features.map((f, i) => (
        <Link key={i} href={f.href} style={{ textDecoration: "none" }}>
          <div
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              padding: "36px 32px",
              background: hovered === i ? "white" : "#F3EFE8",
              border: `1.5px solid ${hovered === i ? f.accent + "50" : "#E2D9CE"}`,
              borderRadius: "12px",
              cursor: "pointer",
              transition: "all 0.25s",
              position: "relative",
              overflow: "hidden",
              minHeight: "280px",
              display: "flex",
              flexDirection: "column",
              boxShadow: hovered === i ? "0 8px 32px rgba(10,22,40,0.10)" : "none",
            }}
          >
            {/* Top accent */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "3px",
              background: hovered === i ? f.accent : "transparent",
              transition: "background 0.25s",
            }} />

            {/* Ghost number */}
            <div style={{
              position: "absolute", right: "-8px", bottom: "-16px",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "100px", fontWeight: 900,
              color: f.accent, opacity: hovered === i ? 0.06 : 0.04,
              lineHeight: 1, pointerEvents: "none",
              transition: "opacity 0.25s",
            }}>
              {f.number}
            </div>

            <span style={{
              fontSize: "11px", fontWeight: 700,
              color: f.accent, textTransform: "uppercase",
              letterSpacing: "0.2em", marginBottom: "20px",
            }}>
              {f.number}
            </span>

            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "30px", fontWeight: 700,
              color: "#0A1628", lineHeight: 1.1,
              marginBottom: "6px", letterSpacing: "-0.3px",
            }}>
              {f.title}
            </h3>

            <p style={{
              fontSize: "11px", fontWeight: 600,
              color: "#8A9AB0", textTransform: "uppercase",
              letterSpacing: "0.12em", marginBottom: "16px",
            }}>
              {f.subtitle}
            </p>

            <div style={{
              width: hovered === i ? "48px" : "24px",
              height: "1.5px", background: f.accent,
              marginBottom: "16px", transition: "width 0.3s",
            }} />

            <p style={{ fontSize: "14px", color: "#6B7A8D", lineHeight: 1.7, flex: 1 }}>
              {f.desc}
            </p>

            <div style={{
              marginTop: "24px", fontSize: "12px", fontWeight: 700,
              color: f.accent, textTransform: "uppercase", letterSpacing: "0.12em",
              opacity: hovered === i ? 1 : 0.5, transition: "opacity 0.25s",
            }}>
              Explore →
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}