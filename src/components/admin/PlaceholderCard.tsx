import type { ReactNode } from "react";

interface PlaceholderCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function PlaceholderCard({ icon, title, description }: PlaceholderCardProps) {
  return (
    <div
      style={{
        padding: "2rem",
        background: "var(--panel)",
        border: "1px dashed var(--line2)",
        borderRadius: "12px",
        opacity: 0.6,
        cursor: "not-allowed",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.8rem" }}>
        <div style={{ color: "var(--muted)" }}>{icon}</div>
        <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>{title}</h3>
        <span
          style={{
            fontSize: "0.6rem",
            padding: "0.2rem 0.5rem",
            background: "var(--lift)",
            borderRadius: "4px",
            color: "var(--muted)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontWeight: 700,
          }}
        >
          Coming Soon
        </span>
      </div>
      <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>{description}</p>
    </div>
  );
}
