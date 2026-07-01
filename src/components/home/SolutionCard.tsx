"use client";

import type { ReactNode } from "react";

interface SolutionCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function SolutionCard({ icon, title, description }: SolutionCardProps) {
  return (
    <div
      className="group"
      style={{
        padding: "2rem",
        background: "var(--panel)",
        border: "1px solid var(--line)",
        borderRadius: "16px",
        transition: "border-color 0.3s, transform 0.3s",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--lime)";
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--line)";
        e.currentTarget.style.transform = "none";
      }}
    >
      <div
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "12px",
          background: "var(--lime-dim)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--lime)",
          marginBottom: "1.2rem",
        }}
      >
        {icon}
      </div>
      <h3 style={{ fontSize: "1.15rem", fontWeight: 600, marginBottom: "0.6rem" }}>
        {title}
      </h3>
      <p style={{ color: "var(--dim)", fontSize: "0.9rem", lineHeight: 1.6 }}>
        {description}
      </p>
    </div>
  );
}
