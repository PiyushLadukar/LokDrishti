"use client";
import Link from "next/link";
import { useState } from "react";

const features = [
  {
    number: "01",
    title: "MP Rankings",
    subtitle: "National · State · Party",
    desc: "Every MP ranked by parliamentary performance. Filter by state, party, or percentile. Paginated across all 544 members.",
    href: "/rankings",
    accent: "#FF6B00",
  },
  {
    number: "02",
    title: "Civic Analytics",
    subtitle: "Indexes · Inequality · Imbalance",
    desc: "Deep-dive analytics beyond rankings — State Strength Index, Party Dominance, Performance Inequality, and Representation Imbalance.",
    href: "/analytics",
    accent: "#4A90D9",
  },
  {
    number: "03",
    title: "MP Profiles",
    subtitle: "Activity · Rank · Engagement",
    desc: "Full breakdown for every MP — attendance bar, debate count, questions raised, percentile rank, and silent MP flag.",
    href: "/rankings",
    accent: "#4CAF50",
  },
];

export default function FeatureCards() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px" }}>
      {features.map((f, i) => (
        <Link key={i} href={f.href} style={{ textDecoration: "none" }}>
          <div
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              padding: "48px 40px",
              background: hovered === i ? "#161616" : "#111111",
              border: `1px solid ${hovered === i ? f.accent + "40" : "rgba(255,255,255,0.05)"}`,
              borderRadius: "2px",
              cursor: "pointer",
              transition: "all 0.25s",
              position: "relative",
              overflow: "hidden",
              minHeight: "320px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Top accent line */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0,
              height: "2px",
              background: hovered === i ? f.accent : "transparent",
              transition: "background 0.25s",
            }} />

            {/* Ghost number */}
            <div style={{
              position: "absolute", right: "-10px", bottom: "-20px",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "120px", fontWeight: 900,
              color: "transparent",
              WebkitTextStroke: `1px ${f.accent}15`,
              lineHeight: 1,
              pointerEvents: "none",
              transition: "all 0.3s",
              transform: hovered === i ? "translateY(-8px)" : "translateY(0)",
            }}>
              {f.number}
            </div>

            {/* Number label */}
            <span style={{
              fontSize: "11px", fontWeight: 700,
              color: f.accent, textTransform: "uppercase",
              letterSpacing: "0.2em", marginBottom: "24px",
            }}>
              {f.number}
            </span>

            {/* Title */}
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "34px", fontWeight: 700,
              color: "white", lineHeight: 1.1,
              marginBottom: "8px",
              letterSpacing: "-0.5px",
            }}>
              {f.title}
            </h3>

            {/* Subtitle */}
            <p style={{
              fontSize: "11px", fontWeight: 600,
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase", letterSpacing: "0.15em",
              marginBottom: "20px",
            }}>
              {f.subtitle}
            </p>

            {/* Divider */}
            <div style={{
              width: "32px", height: "1px",
              background: f.accent,
              marginBottom: "20px",
              transition: "width 0.3s",
              ...(hovered === i ? { width: "64px" } : {}),
            }} />

            {/* Description */}
            <p style={{
              fontSize: "14px",
              color: "rgba(255,255,255,0.45)",
              lineHeight: 1.7,
              flex: 1,
            }}>
              {f.desc}
            </p>

            {/* CTA */}
            <div style={{
              marginTop: "32px",
              fontSize: "12px", fontWeight: 700,
              color: f.accent,
              textTransform: "uppercase", letterSpacing: "0.15em",
              display: "flex", alignItems: "center", gap: "8px",
              opacity: hovered === i ? 1 : 0.5,
              transition: "opacity 0.25s",
            }}>
              Explore <span>→</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}