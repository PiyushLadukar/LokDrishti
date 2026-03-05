interface StatCardProps {
  value: string | number;
  label: string;
  accent?: boolean;
  delay?: number;
}

export default function StatCard({ value, label, accent = false, delay = 0 }: StatCardProps) {
  return (
    <div
      className="animate-fade-up"
      style={{
        animationDelay: `${delay}ms`,
        opacity: 0,
        background: accent ? "var(--saffron)" : "white",
        borderRadius: "var(--radius-md)",
        padding: "28px 24px",
        border: accent ? "none" : "1px solid var(--border)",
        boxShadow: accent ? "var(--shadow-saffron)" : "var(--shadow-sm)",
        textAlign: "center",
        minWidth: "140px",
      }}
    >
      <div style={{
        fontFamily: "var(--font-display)",
        fontSize: "42px",
        fontWeight: 400,
        color: accent ? "white" : "var(--navy)",
        lineHeight: 1,
        marginBottom: "8px",
      }}>
        {value}
      </div>
      <div style={{
        fontSize: "13px",
        fontWeight: 500,
        color: accent ? "rgba(255,255,255,0.85)" : "var(--text-muted)",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
      }}>
        {label}
      </div>
    </div>
  );
}