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
      {/* Tricolor line */}
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
            }}
          >
            Drishti
          </span>
        </Link>

        {/* Navigation */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/ranking">Rankings</Link>
          <Link href="/analytics">Analytics</Link>

          {/* Explore Button */}
          <Link
            href="/ranking"
            style={{
              marginLeft: "12px",
              padding: "10px 22px",
              background: "#FF6B00",
              color: "white",
              borderRadius: "100px",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 700,
              boxShadow: "0 2px 16px rgba(255,107,0,0.28)",
            }}
          >
            Explore
          </Link>

          {/* Google Login */}
          {!session ? (
            <button
              onClick={() => signIn("google")}
              style={{
                padding: "10px 18px",
                borderRadius: "100px",
                border: "1px solid #E2D9CE",
                background: "white",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Sign in
            </button>
          ) : (
            <button
              onClick={() => signOut()}
              style={{
                padding: "10px 18px",
                borderRadius: "100px",
                border: "1px solid #E2D9CE",
                background: "white",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}