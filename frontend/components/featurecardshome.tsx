"use client";
import Link from "next/link";
import { useState } from "react";

const cards = [
  {
    num: "01", icon: "🏆",
    title: "MP Rankings",
    sub: "National · State · Party",
    desc: "Every MP ranked by real performance — filter by state, party, or percentile. Updated from live PRS data.",
    href: "/rankings",
    color: "#FF6B00",
  },
  {
    num: "02", icon: "📊",
    title: "Civic Analytics",
    sub: "Indexes · Inequality · Imbalance",
    desc: "State Strength Index, Party Dominance, Inequality — 6 advanced analytics that reveal the full picture.",
    href: "/analytics",
    color: "#0057A8",
  },
  {
    num: "03", icon: "👤",
    title: "MP Profiles",
    sub: "Attendance · Debates · Questions",
    desc: "Deep profile for every MP — activity bars, rank badges, engagement score, and silent MP detection.",
    href: "/rankings",
    color: "#138808",
  },
];

export default function FeatureCardsHome() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
      {cards.map((card) => (
        <Link key={card.num} href={card.href} style={{ textDecoration: "none" }}>
          <div
            onMouseEnter={() => setHovered(card.num)}
            onMouseLeave={() => setHovered(null)}
            style={{
              padding: "32px 28px",
              background: "white",
              borderRadius: "12px",
              border: "1.5px solid #E2D9CE",
              borderLeft: `4px solid ${card.color}`,
              height: "100%",
              display: "flex", flexDirection: "column",
              transition: "all 0.2s",
              boxShadow: hovered === card.num
                ? "0 12px 32px rgba(10,22,40,0.10)"
                : "0 2px 8px rgba(10,22,40,0.04)",
              transform: hovered === card.num ? "translateY(-4px)" : "translateY(0)",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "16px" }}>{card.icon}</div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: card.color, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "8px" }}>{card.num}</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "26px", fontWeight: 700, color: "#0A1628", marginBottom: "4px" }}>{card.title}</h3>
            <p style={{ fontSize: "11px", color: "#8A9AB0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "14px" }}>{card.sub}</p>
            <div style={{ width: hovered === card.num ? "48px" : "24px", height: "2px", background: card.color, marginBottom: "14px", transition: "width 0.3s" }} />
            <p style={{ fontSize: "14px", color: "#6B7A8D", lineHeight: 1.7, flex: 1 }}>{card.desc}</p>
            <div style={{ marginTop: "20px", fontSize: "12px", fontWeight: 700, color: card.color, textTransform: "uppercase", letterSpacing: "0.1em", opacity: hovered === card.num ? 1 : 0.5, transition: "opacity 0.2s" }}>
              Explore →
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}