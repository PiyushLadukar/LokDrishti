"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

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
                color: pathname?.startsWith(link.href) ? "#FF6B00" : "#4A5568",
                background: pathname?.startsWith(link.href) ? "#FFF0E5" : "transparent",
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

          {/* Sign in / User */}
          {!session ? (
            <button
              onClick={() => signIn("google")}
              style={{
                marginLeft: "8px",
                padding: "9px 18px",
                borderRadius: "100px",
                border: "1.5px solid #E2D9CE",
                background: "white",
                fontSize: "13px",
                fontWeight: 600,
                color: "#0A1628",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s",
              }}
            >
              {/* Google G icon */}
              <svg width="16" height="16" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.6-8 19.6-20 0-1.3-.1-2.7-.4-4z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.2 0-9.6-3-11.3-7.3l-6.5 5C9.7 39.6 16.3 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.6 5.8l6.2 5.2C40.8 35.4 44 30.1 44 24c0-1.3-.1-2.7-.4-4z"/>
              </svg>
              Sign in
            </button>
          ) : (
            <div style={{ marginLeft: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name || ""}
                  style={{ width: 30, height: 30, borderRadius: "50%", border: "2px solid #E2D9CE" }}
                />
              )}
              <button
                onClick={() => signOut()}
                style={{
                  padding: "9px 16px",
                  borderRadius: "100px",
                  border: "1.5px solid #E2D9CE",
                  background: "white",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#DC2626",
                  cursor: "pointer",
                }}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}