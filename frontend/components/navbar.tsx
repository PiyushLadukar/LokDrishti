"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(250,250,247,0.92)",
      backdropFilter: "blur(16px)",
      borderBottom: "1px solid #E2D9CE",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Tricolor line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "2px",
        background: "linear-gradient(90deg, #FF6B00 33%, white 33%, white 66%, #138808 66%)",
      }} />

      <div style={{
        maxWidth: "1400px", margin: "0 auto", padding: "0 80px",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", height: "64px",
      }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "30px", height: "30px",
            border: "2px solid #FF6B00", borderRadius: "6px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ width: "9px", height: "9px", background: "#FF6B00", borderRadius: "2px" }} />
          </div>
          <span style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "20px", fontWeight: 700,
            color: "#0A1628", letterSpacing: "-0.3px",
          }}>
            Lok<span style={{ color: "#FF6B00" }}>Drishti</span>
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {[
            { href: "/rankings",  label: "Rankings" },
            { href: "/analytics", label: "Analytics" },
          ].map((link) => (
            <Link key={link.href} href={link.href} style={{
              padding: "8px 18px", borderRadius: "6px",
              textDecoration: "none", fontSize: "14px", fontWeight: 500,
              color: pathname === link.href ? "#FF6B00" : "#4A5568",
              background: pathname === link.href ? "#FFF0E5" : "transparent",
              transition: "all 0.15s",
            }}>
              {link.label}
            </Link>
          ))}
          <Link href="/rankings" style={{
            marginLeft: "12px", padding: "9px 22px",
            borderRadius: "6px", background: "#FF6B00",
            color: "white", textDecoration: "none",
            fontSize: "13px", fontWeight: 700,
            letterSpacing: "0.04em",
            boxShadow: "0 2px 12px rgba(255,107,0,0.25)",
          }}>
            Explore →
          </Link>
        </div>
      </div>
    </nav>
  );
}