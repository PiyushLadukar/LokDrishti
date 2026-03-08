"use client";
import Link from "next/link";
import { useState } from "react";

const cards = [
  {
    num: "01",
    title: "MP Rankings",
    sub: "National · State · Party",
    desc: "Every MP ranked by real performance — filter by state, party, or percentile across all 543 members.",
    href: "/ranking",
    color: "#FF6B00",
    darkBg: "#1A0F00",
  },
  {
    num: "02",
    title: "Civic Analytics",
    sub: "Indexes · Inequality · Imbalance",
    desc: "State Strength Index, Party Dominance, Inequality Index — 6 advanced analytics that reveal the full picture.",
    href: "/analytics",
    color: "#60A5FA",
    darkBg: "#00102A",
  },
  {
    num: "03",
    title: "MP Profiles",
    sub: "Attendance · Debates · Questions",
    desc: "Deep profile for every MP — activity bars, rank badges, performance grade, and silent MP detection.",
    href: "/ranking",
    color: "#34D399",
    darkBg: "#001A0E",
  },
];

export default function FeatureCardsHome() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
      {cards.map((card) => {
        const isHovered = hovered === card.num;
        return (
          <Link key={card.num} href={card.href} style={{ textDecoration: "none" }}>
            <div
              onMouseEnter={() => setHovered(card.num)}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding: "40px 36px",
                background: isHovered ? card.darkBg : "#0A1628",
                borderRadius: "16px",
                border: `1px solid ${isHovered ? card.color + "40" : "rgba(255,255,255,0.06)"}`,
                height: "100%", minHeight: "320px",
                display: "flex", flexDirection: "column",
                transition: "all 0.28s ease",
                boxShadow: isHovered
                  ? `0 20px 60px rgba(10,22,40,0.4), 0 0 0 1px ${card.color}30, inset 0 1px 0 ${card.color}20`
                  : "0 4px 16px rgba(10,22,40,0.2)",
                transform: isHovered ? "translateY(-8px)" : "translateY(0)",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Glow spot */}
              {isHovered && (
                <div style={{
                  position: "absolute", top: "-40px", right: "-40px",
                  width: "200px", height: "200px", borderRadius: "50%",
                  background: `radial-gradient(circle, ${card.color}18 0%, transparent 70%)`,
                  pointerEvents: "none",
                }} />
              )}

              {/* Top accent line */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: "2px",
                background: isHovered ? card.color : "transparent",
                borderRadius: "16px 16px 0 0",
                transition: "background 0.28s",
              }} />

              {/* Big ghost number */}
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "88px", fontWeight: 900,
                color: card.color,
                opacity: isHovered ? 0.12 : 0.06,
                lineHeight: 1, marginBottom: "4px",
                transition: "opacity 0.28s",
                userSelect: "none",
                letterSpacing: "-3px",
              }}>
                {card.num}
              </div>

              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "30px", fontWeight: 700,
                color: "white", lineHeight: 1.05,
                marginBottom: "8px", letterSpacing: "-0.5px",
              }}>
                {card.title}
              </h3>

              <p style={{
                fontSize: "11px", fontWeight: 600,
                color: card.color,
                textTransform: "uppercase", letterSpacing: "0.14em",
                marginBottom: "18px", opacity: 0.8,
              }}>
                {card.sub}
              </p>

              <div style={{
                height: "1.5px",
                background: card.color,
                width: isHovered ? "52px" : "24px",
                transition: "width 0.3s ease",
                marginBottom: "18px",
                borderRadius: "1px",
                opacity: 0.6,
              }} />

              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.75, flex: 1 }}>
                {card.desc}
              </p>

              <div style={{
                marginTop: "28px",
                display: "flex", alignItems: "center", gap: "8px",
                color: card.color,
                fontSize: "12px", fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.14em",
                opacity: isHovered ? 1 : 0.45,
                transition: "opacity 0.28s",
              }}>
                Explore
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M7 2l5 5-5 5" stroke={card.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}