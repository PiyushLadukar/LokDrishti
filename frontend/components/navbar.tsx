"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
const pathname = usePathname();

return (
<nav
style={{
position: "fixed",
top: 0,
left: 0,
right: 0,
zIndex: 100,
background: "rgba(250,250,247,0.96)",
backdropFilter: "blur(20px)",
borderBottom: "1px solid #E2D9CE",
fontFamily: "'DM Sans', sans-serif",
boxShadow: "0 1px 0 #E2D9CE, 0 4px 24px rgba(10,22,40,0.04)",
}}
>
{/* Tricolor top line */}
<div
style={{
position: "absolute",
top: 0,
left: 0,
right: 0,
height: "2px",
background:
"linear-gradient(90deg,#FF6B00 33.3%,#FAFAF7 33.3%,#FAFAF7 66.6%,#138808 66.6%)",
}}
/>

```
  <div
    style={{
      maxWidth: "1280px",
      margin: "0 auto",
      padding: "0 48px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: "62px",
    }}
  >
    {/* Logo */}
    <Link
      href="/"
      style={{
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <Image
        src="/lokdrishti-logo.png"
        alt="LokDrishti"
        width={38}
        height={32}
        priority
      />

      <span
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "22px",
          fontWeight: 900,
          color: "#0A1628",
          letterSpacing: "-0.5px",
        }}
      >
        Lok
      </span>

      <span
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "22px",
          fontWeight: 900,
          color: "#FF6B00",
          letterSpacing: "-0.5px",
        }}
      >
        Drishti
      </span>

      <span
        style={{
          marginLeft: "8px",
          fontSize: "10px",
          fontWeight: 600,
          color: "#8A9AB0",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          borderLeft: "1px solid #E2D9CE",
          paddingLeft: "8px",
        }}
      >
        Civic Intelligence
      </span>
    </Link>

    {/* Navigation */}
    <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
      {[
        { href: "/ranking", label: "Rankings" },
        { href: "/analytics", label: "Analytics" },
      ].map((link) => (
        <Link
          key={link.href}
          href={link.href}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: 500,
            color: pathname?.startsWith(link.href)
              ? "#FF6B00"
              : "#4A5568",
            background: pathname?.startsWith(link.href)
              ? "#FFF0E5"
              : "transparent",
            transition: "all 0.2s ease",
            letterSpacing: "0.01em",
          }}
        >
          {link.label}
        </Link>
      ))}

      {/* Explore Button */}
      <Link
        href="/ranking"
        style={{
          marginLeft: "16px",
          padding: "10px 24px",
          background: "#FF6B00",
          color: "white",
          borderRadius: "100px",
          textDecoration: "none",
          fontSize: "13px",
          fontWeight: 700,
          letterSpacing: "0.04em",
          boxShadow: "0 2px 16px rgba(255,107,0,0.28)",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          transition: "all 0.2s",
        }}
      >
        Explore
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M2 7h10M7 2l5 5-5 5"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </div>
  </div>
</nav>


);
}
