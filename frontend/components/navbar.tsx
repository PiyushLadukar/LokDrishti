"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(13,13,13,0.85)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{
        maxWidth: "1400px", margin: "0 auto", padding: "0 80px",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", height: "64px",
      }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Logo mark — simple L geometric */}
          <div style={{
            width: "32px", height: "32px",
            border: "2px solid #FF6B00",
            borderRadius: "4px",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
          }}>
            <div style={{
              width: "10px", height: "10px",
              background: "#FF6B00",
              borderRadius: "2px",
            }} />
          </div>
          <div>
            <span style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "20px", fontWeight: 700,
              color: "white", letterSpacing: "-0.3px",
            }}>
              Lok<span style={{ color: "#FF6B00" }}>Drishti</span>
            </span>
          </div>
        </Link>

        {/* Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          {[
            { href: "/rankings",  label: "Rankings" },
            { href: "/analytics", label: "Analytics" },
          ].map((link) => (
            <Link key={link.href} href={link.href} style={{
              padding: "8px 18px",
              borderRadius: "4px",
              textDecoration: "none",
              fontSize: "13px", fontWeight: 500,
              letterSpacing: "0.02em",
              color: pathname === link.href ? "white" : "rgba(255,255,255,0.45)",
              background: pathname === link.href ? "rgba(255,255,255,0.08)" : "transparent",
              transition: "all 0.15s",
            }}>
              {link.label}
            </Link>
          ))}
          <Link href="/rankings" style={{
            marginLeft: "16px",
            padding: "9px 22px",
            borderRadius: "4px",
            background: "#FF6B00",
            color: "white",
            textDecoration: "none",
            fontSize: "13px", fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            boxShadow: "0 0 20px rgba(255,107,0,0.3)",
          }}>
            Explore →
          </Link>
        </div>
      </div>
    </nav>
  );
}