"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <style>{`
        @keyframes dropdown-in {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .dd-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 16px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          text-decoration: none;
          color: #0A1628;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          transition: background 0.15s;
        }
        .dd-item:hover { background: #F8F5F0; }
        .dd-item.red { color: #DC2626; }
        .dd-item.red:hover { background: #FEF2F2; }
        .user-pill {
          display: flex; align-items: center; gap: 8px;
          padding: 5px 12px 5px 5px;
          border-radius: 100px;
          border: 1.5px solid #E2D9CE;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .user-pill:hover { border-color: #FF6B00; box-shadow: 0 2px 12px rgba(255,107,0,0.12); }
      `}</style>

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(250,250,247,0.96)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid #E2D9CE",
        fontFamily: "'DM Sans', sans-serif",
        boxShadow: "0 1px 0 #E2D9CE, 0 4px 24px rgba(10,22,40,0.04)",
      }}>

        {/* Tricolor top line */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "3px",
          background: "linear-gradient(90deg,#FF6B00 33.3%,#FAFAF7 33.3%,#FAFAF7 66.6%,#138808 66.6%)",
        }}/>

        <div style={{
          maxWidth: "1280px", margin: "0 auto", padding: "0 48px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: "62px",
        }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
            <Image src="/lokdrishti-logo.png" alt="LokDrishti" width={38} height={32} priority/>
            <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "22px", fontWeight: 900, color: "#0A1628", letterSpacing: "-0.5px" }}>Lok</span>
            <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "22px", fontWeight: 900, color: "#FF6B00", letterSpacing: "-0.5px" }}>Drishti</span>
            <span style={{ marginLeft: "8px", fontSize: "10px", fontWeight: 600,
              color: "#8A9AB0", letterSpacing: "0.12em", textTransform: "uppercase",
              borderLeft: "1px solid #E2D9CE", paddingLeft: "8px" }}>
              Civic Intelligence
            </span>
          </Link>

          {/* Navigation */}
          <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            {[
              { href: "/ranking",   label: "Rankings"  },
              { href: "/analytics", label: "Analytics" },
              { href: "/about", label: "About" },
            ].map((link) => (
              <Link key={link.href} href={link.href} style={{
                padding: "8px 16px", borderRadius: "6px", textDecoration: "none",
                fontSize: "17px", fontWeight: 500, letterSpacing: "0.01em",
                color: pathname?.startsWith(link.href) ? "#FF6B00" : "#4A5568",
                background: pathname?.startsWith(link.href) ? "#FFF0E5" : "transparent",
                transition: "all 0.2s ease",
              }}>{link.label}</Link>
            ))}

            {/* Explore */}
            <Link href="/mp" style={{
              marginLeft: "16px", padding: "10px 24px",
              background: "#FF6B00", color: "white", borderRadius: "100px",
              textDecoration: "none", fontSize: "17px", fontWeight: 700,
              letterSpacing: "0.04em", boxShadow: "0 2px 16px rgba(255,107,0,0.28)",
              display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s",
            }}>
              Explore
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M7 2l5 5-5 5" stroke="white" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>

            {/* ── Auth ── */}
            {!session ? (
              <button onClick={() => signIn("google")} style={{
                marginLeft: "8px", padding: "9px 18px", borderRadius: "100px",
                border: "1.5px solid #E2D9CE", background: "white",
                fontSize: "17px", fontWeight: 600, color: "#0A1628",
                cursor: "pointer", display: "flex", alignItems: "center",
                gap: "8px", transition: "all 0.2s",
              }}>
                <svg width="16" height="16" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.6-8 19.6-20 0-1.3-.1-2.7-.4-4z"/>
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
                  <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.2 0-9.6-3-11.3-7.3l-6.5 5C9.7 39.6 16.3 44 24 44z"/>
                  <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.6 5.8l6.2 5.2C40.8 35.4 44 30.1 44 24c0-1.3-.1-2.7-.4-4z"/>
                </svg>
                Sign in
              </button>
            ) : (
              /* ── User dropdown ── */
              <div ref={dropdownRef} style={{ position: "relative", marginLeft: "8px" }}>
                <button className="user-pill" onClick={() => setDropdownOpen(o => !o)}>
                  {/* Avatar */}
                  {session.user?.image ? (
                    <img src={session.user.image} alt={session.user.name || ""}
                      style={{ width: 28, height: 28, borderRadius: "50%",
                        border: "2px solid #E2D9CE", flexShrink: 0 }}/>
                  ) : (
                    <div style={{ width: 28, height: 28, borderRadius: "50%",
                      background: "#FF6B00", display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: "11px", fontWeight: 700,
                      color: "white", flexShrink: 0 }}>
                      {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                  )}
                  {/* First name */}
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "#0A1628" }}>
                    {session.user?.name?.split(" ")[0]}
                  </span>
                  {/* Chevron */}
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none"
                    style={{ transition: "transform 0.2s",
                      transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                    <path d="M2 4l4 4 4-4" stroke="#9CA3AF" strokeWidth="1.8"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 10px)", right: 0,
                    minWidth: "200px", background: "white",
                    border: "1px solid #E8DED0", borderRadius: "14px",
                    boxShadow: "0 8px 32px rgba(10,22,40,0.13)",
                    overflow: "hidden", zIndex: 200,
                    animation: "dropdown-in 0.18s cubic-bezier(0.4,0,0.2,1) both",
                  }}>
                    {/* User info */}
                    <div style={{ padding: "12px 16px 10px",
                      borderBottom: "1px solid #F0EAE0" }}>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#0A1628" }}>
                        {session.user?.name}
                      </div>
                      <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "2px" }}>
                        {session.user?.email}
                      </div>
                    </div>

                    {/* My Profile */}
                    <Link href="/profile" className="dd-item"
                      onClick={() => setDropdownOpen(false)}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="8" r="4" stroke="#6B7280" strokeWidth="1.8"/>
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#6B7280"
                          strokeWidth="1.8" strokeLinecap="round"/>
                      </svg>
                      My Profile
                    </Link>

                    <div style={{ height: "1px", background: "#F0EAE0" }}/>

                    {/* Sign out */}
                    <button className="dd-item red"
                      onClick={() => { signOut(); setDropdownOpen(false); }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"
                          stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round"/>
                        <path d="M16 17l5-5-5-5M21 12H9" stroke="#DC2626"
                          strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}