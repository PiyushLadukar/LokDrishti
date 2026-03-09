"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { MP } from "@/types";

interface Props {
  mp: MP;
  rank: number;
  delay?: number;
}

function getGrade(lci: number) {
  if (lci >= 0.75) return { g: "A", color: "#166534", bg: "#DCFCE7", border: "#86EFAC" };
  if (lci >= 0.5)  return { g: "B", color: "#1E40AF", bg: "#DBEAFE", border: "#93C5FD" };
  if (lci >= 0.25) return { g: "C", color: "#92400E", bg: "#FEF3C7", border: "#FCD34D" };
  if (lci >= 0.1)  return { g: "D", color: "#C2410C", bg: "#FFEDD5", border: "#FCA5A5" };
  return               { g: "F", color: "#991B1B", bg: "#FEE2E2", border: "#FCA5A5" };
}

// Shared cache — mp_photos.json is fetched only ONCE for the whole page
let photoCache: Record<string, string> | null = null;
let cachePromise: Promise<Record<string, string>> | null = null;

function getPhotos(): Promise<Record<string, string>> {
  if (photoCache) return Promise.resolve(photoCache);
  if (!cachePromise) {
    cachePromise = fetch("/mp_photos.json")
      .then(r => r.json())
      .then(d => { photoCache = d; return d; })
      .catch(() => { photoCache = {}; return {}; });
  }
  return cachePromise;
}

function MPPhoto({ name, size = 46 }: { name: string; size?: number }) {
  const [src, setSrc] = useState<string | null>(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    getPhotos().then(d => {
      const url = d[name];
      if (!url) return;
      // After running fetch_photos_easy.py: url = "/mp_photos/Name.jpg" → use directly
      // Before running it: url = "https://..." → proxy through Next.js server
      setSrc(url.startsWith("/") ? url : `/api/proxy-image?url=${encodeURIComponent(url)}`);
    });
  }, [name]);

  const initials = name.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();
  const hues = [220, 160, 30, 270, 190, 350];
  const hue  = hues[name.charCodeAt(0) % hues.length];

  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      overflow: "hidden", flexShrink: 0,
      border: "2px solid #E2E8F0",
    }}>
      {src && !err ? (
        <img
          src={src}
          alt={name}
          onError={() => setErr(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
        />
      ) : (
        <div style={{
          width: "100%", height: "100%",
          background: `hsl(${hue},55%,90%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: size * 0.36, fontWeight: 700,
          color: `hsl(${hue},45%,32%)`,
          fontFamily: "Georgia, serif",
        }}>
          {initials}
        </div>
      )}
    </div>
  );
}

export default function MpCard({ mp, rank }: Props) {
  const grade  = getGrade(mp.LCI_score);
  const attPct = typeof mp.attendance === "number"
    ? mp.attendance > 1 ? mp.attendance : mp.attendance * 100
    : 0;
  const attColor = attPct >= 75 ? "#16A34A" : attPct >= 50 ? "#D97706" : "#DC2626";

  return (
    <Link
      href={`/mp/${encodeURIComponent(mp.name)}`}
      style={{
        display: "flex", alignItems: "center", gap: "14px",
        padding: "14px 18px",
        background: "white", borderRadius: "14px",
        border: "1.5px solid #E2E8F0", textDecoration: "none",
        transition: "box-shadow 0.15s, transform 0.15s",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = "0 8px 24px rgba(30,58,138,0.10)";
        el.style.transform = "translateY(-2px)";
        el.style.borderColor = "#BFDBFE";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = "none";
        el.style.transform = "none";
        el.style.borderColor = "#E2E8F0";
      }}
    >
      {/* Rank */}
      <div style={{
        fontWeight: 800, fontSize: "14px",
        color: "var(--saffron, #FF6B00)",
        width: "30px", flexShrink: 0, textAlign: "center",
      }}>
        #{rank}
      </div>

      {/* Photo */}
      <MPPhoto name={mp.name} size={46} />

      {/* Name + party */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontWeight: 700, fontSize: "15px", color: "var(--navy, #0F172A)",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {mp.name}
        </div>
        <div style={{
          fontSize: "12px", color: "#64748B", marginTop: "2px",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {mp.party} · {mp.constituency}, {mp.state}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: "16px", flexShrink: 0 }}>
        {[
          { label: "Q",   value: mp.questions,          color: "#1E40AF" },
          { label: "D",   value: mp.debates,             color: "#7C3AED" },
          { label: "Att", value: `${attPct.toFixed(0)}%`, color: attColor },
        ].map(s => (
          <div key={s.label} style={{ textAlign: "center" }}>
            <div style={{ fontWeight: 700, fontSize: "13px", color: s.color }}>{s.value}</div>
            <div style={{ fontSize: "9px", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Grade badge */}
      <div style={{
        width: 36, height: 36, borderRadius: "9px", flexShrink: 0,
        background: grade.bg, border: `2px solid ${grade.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "Georgia, serif", fontSize: "17px",
        fontWeight: 800, color: grade.color,
      }}>
        {grade.g}
      </div>
    </Link>
  );
}