"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/",          label: "Home" },
  { href: "/rankings",  label: "Rankings" },
  { href: "/analytics", label: "Analytics" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(255,248,240,0.92)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)",
      fontFamily: "var(--font-body)",
    }}>
      <div className="container" style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between", height: "64px",
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Ashoka Chakra SVG */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="15" stroke="#0057A8" strokeWidth="2"/>
            <circle cx="16" cy="16" r="4" fill="#0057A8"/>
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = (i * 360) / 24;
              const rad = (angle * Math.PI) / 180;
              const x1 = 16 + 4 * Math.cos(rad);
              const y1 = 16 + 4 * Math.sin(rad);
              const x2 = 16 + 12 * Math.cos(rad);
              const y2 = 16 + 12 * Math.sin(rad);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0057A8" strokeWidth="1.2"/>;
            })}
          </svg>
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: "22px",
            color: "var(--navy)",
            letterSpacing: "-0.3px",
          }}>
            लोक<span style={{ color: "var(--saffron)" }}>दृष्टि</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: "8px 16px",
                borderRadius: "var(--radius-sm)",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 500,
                color: pathname === link.href ? "var(--saffron)" : "var(--text-secondary)",
                background: pathname === link.href ? "var(--saffron-pale)" : "transparent",
                transition: "all 0.2s",
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/rankings"
            style={{
              marginLeft: "8px",
              padding: "8px 20px",
              borderRadius: "var(--radius-sm)",
              background: "var(--saffron)",
              color: "white",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 600,
              boxShadow: "var(--shadow-saffron)",
              transition: "all 0.2s",
            }}
          >
            Explore MPs →
          </Link>
        </div>
      </div>
    </nav>
  );
}