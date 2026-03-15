"use client";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  // Editable extra info — stored in localStorage
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    phone:    "",
    city:     "",
    state:    "",
    bio:      "",
  });

  // Load saved data on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("ld_profile_extra") || "{}");
      setForm(f => ({ ...f, ...saved }));
    } catch {}
  }, []);

  function handleSave() {
    localStorage.setItem("ld_profile_extra", JSON.stringify(form));
    setEditing(false);
  }

  function handleCancel() {
    try {
      const saved = JSON.parse(localStorage.getItem("ld_profile_extra") || "{}");
      setForm(f => ({ ...f, ...saved }));
    } catch {}
    setEditing(false);
  }

  if (status === "loading") return (
    <div style={{ minHeight: "100vh", background: "#0B1220",
      display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%",
        border: "2.5px solid rgba(255,107,44,0.15)",
        borderTop: "2.5px solid #FF6B2C",
        animation: "spin 0.8s linear infinite" }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!session) return null;

  const user = session.user;
  const initials = user?.name?.split(" ").map(w => w[0]).slice(0,2).join("").toUpperCase() ?? "U";
  const firstName = user?.name?.split(" ")[0] ?? "User";

  const inp: React.CSSProperties = {
    width: "100%", padding: "10px 14px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px", color: "white",
    fontSize: "14px", fontFamily: "'DM Sans',sans-serif",
    outline: "none",
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#0B1220,#0F1B35,#132347)",
      fontFamily: "'DM Sans',sans-serif", color: "white" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.25); }
        textarea { resize: vertical; }
      `}</style>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "100px 24px 80px" }}>

        {/* Back */}
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px",
          fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.2)",
          textDecoration: "none", marginBottom: "32px",
          textTransform: "uppercase", letterSpacing: "0.18em" }}>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Home
        </Link>

        {/* ── Profile Card ── */}
        <div style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px",
          overflow: "hidden", marginBottom: "16px" }}>

          {/* Top stripe */}
          <div style={{ height: 3, background: "linear-gradient(90deg,#FF6B2C,#4F8CFF,#2DD4BF)" }}/>

          <div style={{ padding: "28px" }}>
            {/* Avatar + name row */}
            <div style={{ display: "flex", alignItems: "center", gap: "18px", marginBottom: "24px" }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", overflow: "hidden",
                  border: "2px solid rgba(255,107,44,0.3)" }}>
                  {user?.image ? (
                    <img src={user.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                  ) : (
                    <div style={{ width: "100%", height: "100%",
                      background: "linear-gradient(135deg,#FF6B2C,#4F8CFF)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 24, fontWeight: 700 }}>{initials}</div>
                  )}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "22px", fontWeight: 700, lineHeight: 1.2 }}>{user?.name}</div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>{user?.email}</div>
                <span style={{ display: "inline-block", marginTop: "7px", padding: "2px 10px",
                  borderRadius: "100px", fontSize: "10px", fontWeight: 700,
                  background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.25)",
                  color: "#2DD4BF" }}>Citizen</span>
              </div>
            </div>

            {/* Google info rows */}
            {[
              { l: "Connected via", v: "Google" },
              { l: "Last login",    v: "Today"  },
            ].map((row, i, arr) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>{row.l}</span>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.65)" }}>{row.v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Additional Info Card ── */}
        <div style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px",
          padding: "24px", marginBottom: "16px" }}>

          <div style={{ display: "flex", justifyContent: "space-between",
            alignItems: "center", marginBottom: "20px" }}>
            <span style={{ fontSize: "10px", fontWeight: 800, color: "#4F8CFF",
              textTransform: "uppercase", letterSpacing: "0.18em" }}>Additional Info</span>
            {!editing && (
              <button onClick={() => setEditing(true)}
                style={{ display: "flex", alignItems: "center", gap: "6px",
                  padding: "6px 14px", borderRadius: "8px",
                  border: "1px solid rgba(79,140,255,0.3)",
                  background: "rgba(79,140,255,0.08)",
                  color: "#4F8CFF", fontSize: "12px", fontWeight: 700,
                  cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                    stroke="#4F8CFF" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                    stroke="#4F8CFF" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Edit
              </button>
            )}
          </div>

          {editing ? (
            /* Edit form */
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "10px", fontWeight: 700,
                    color: "rgba(255,255,255,0.3)", textTransform: "uppercase",
                    letterSpacing: "0.14em", display: "block", marginBottom: "6px" }}>Phone</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+91 98765 43210" style={inp}/>
                </div>
                <div>
                  <label style={{ fontSize: "10px", fontWeight: 700,
                    color: "rgba(255,255,255,0.3)", textTransform: "uppercase",
                    letterSpacing: "0.14em", display: "block", marginBottom: "6px" }}>City</label>
                  <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    placeholder="Nagpur" style={inp}/>
                </div>
              </div>
              <div>
                <label style={{ fontSize: "10px", fontWeight: 700,
                  color: "rgba(255,255,255,0.3)", textTransform: "uppercase",
                  letterSpacing: "0.14em", display: "block", marginBottom: "6px" }}>State</label>
                <input value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                  placeholder="Maharashtra" style={inp}/>
              </div>
              <div>
                <label style={{ fontSize: "10px", fontWeight: 700,
                  color: "rgba(255,255,255,0.3)", textTransform: "uppercase",
                  letterSpacing: "0.14em", display: "block", marginBottom: "6px" }}>Bio</label>
                <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  placeholder="Tell us about yourself..." rows={3}
                  style={{ ...inp, lineHeight: 1.6 }}/>
              </div>
              {/* Save / Cancel */}
              <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                <button onClick={handleSave}
                  style={{ padding: "10px 24px", borderRadius: "10px", border: "none",
                    background: "#FF6B2C", color: "white", fontSize: "13px", fontWeight: 700,
                    cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                  Save Changes
                </button>
                <button onClick={handleCancel}
                  style={{ padding: "10px 20px", borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.1)", background: "none",
                    color: "rgba(255,255,255,0.4)", fontSize: "13px", fontWeight: 600,
                    cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* Display mode */
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {[
                { l: "Phone",  v: form.phone || "—" },
                { l: "City",   v: form.city  || "—" },
                { l: "State",  v: form.state || "—" },
                { l: "Bio",    v: form.bio   || "—" },
              ].map((row, i, arr) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between",
                  alignItems: "flex-start", gap: "16px",
                  padding: "12px 0",
                  borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)",
                    flexShrink: 0 }}>{row.l}</span>
                  <span style={{ fontSize: "13px", fontWeight: 500,
                    color: row.v === "—" ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.65)",
                    textAlign: "right", lineHeight: 1.5 }}>{row.v}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Sign Out ── */}
        <button onClick={() => signOut({ callbackUrl: "/" })}
          style={{ display: "flex", alignItems: "center", gap: "8px",
            padding: "11px 20px", borderRadius: "12px",
            border: "1px solid rgba(255,77,109,0.25)",
            background: "rgba(255,77,109,0.06)",
            color: "#FF4D6D", fontSize: "13px", fontWeight: 700,
            cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
            transition: "all 0.2s" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="#FF4D6D" strokeWidth="2" strokeLinecap="round"/>
            <path d="M16 17l5-5-5-5M21 12H9" stroke="#FF4D6D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Sign out
        </button>

      </div>
    </div>
  );
}