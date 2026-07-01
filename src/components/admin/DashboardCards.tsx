import { MessageSquare, Clock, CheckCircle2, Inbox } from "lucide-react";

interface Counts {
  total: number;
  new: number;
  inProgress: number;
  resolved: number;
}

interface DashboardCardsProps {
  counts: Counts | null;
  loading: boolean;
}

const cards = [
  { key: "total" as const, label: "Total Contacts", icon: <Inbox size={22} />, color: "var(--indigo)" },
  { key: "new" as const, label: "New", icon: <MessageSquare size={22} />, color: "#3b82f6" },
  { key: "inProgress" as const, label: "In Progress", icon: <Clock size={22} />, color: "#eab308" },
  { key: "resolved" as const, label: "Resolved", icon: <CheckCircle2 size={22} />, color: "#22c55e" },
];

export function DashboardCards({ counts, loading }: DashboardCardsProps) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
      {cards.map((card) => (
        <div
          key={card.key}
          style={{
            padding: "1.5rem",
            background: "var(--panel)",
            border: "1px solid var(--line)",
            borderRadius: "12px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "3px",
              height: "100%",
              background: card.color,
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
                {card.label}
              </p>
              <p style={{ fontSize: "2rem", fontWeight: 800 }}>
                {loading ? (
                  <span style={{ width: "40px", height: "28px", background: "var(--lift)", borderRadius: "6px", display: "inline-block" }} />
                ) : (
                  counts?.[card.key] ?? 0
                )}
              </p>
            </div>
            <div style={{ color: card.color, opacity: 0.6 }}>{card.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
