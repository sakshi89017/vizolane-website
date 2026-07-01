"use client";

import { useEffect, useRef } from "react";

const stats = [
  { target: 33, suffix: "%", label: "Faster Commutes" },
  { target: 20, suffix: "%", label: "Fuel Saved" },
  { target: 100, suffix: "%", label: "Automated" },
];

export function StatsCounter() {
  const countersRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    countersRef.current.forEach((el, i) => {
      if (!el) return;
      const target = stats[i].target;
      const suffix = stats[i].suffix;
      let current = 0;
      const step = target / 60;
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        el.textContent = `${Math.round(current)}${suffix}`;
      }, 25);
    });
  }, []);

  return (
    <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
      {stats.map((stat, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column" }}>
          <span
            ref={(el) => { countersRef.current[i] = el; }}
            style={{
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              fontWeight: 800,
              background: "var(--grad)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            0{stat.suffix}
          </span>
          <span style={{ fontSize: "0.75rem", color: "var(--dim)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
