import type { Contact, ContactStatus } from "@/types/contact";
import { Badge } from "@/components/ui/Badge";
import { Eye, Trash2 } from "lucide-react";

interface ContactTableProps {
  contacts: Contact[];
  loading: boolean;
  onView: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
  onStatusChange: (contact: Contact, status: ContactStatus) => void;
}

export function ContactTable({
  contacts,
  loading,
  onView,
  onDelete,
  onStatusChange,
}: ContactTableProps) {
  if (loading) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "var(--muted)" }}>
        <div
          className="inline-block w-6 h-6 border-2 border-[var(--lime)] border-t-transparent rounded-full"
          style={{ animation: "spin 0.6s linear infinite" }}
        />
        <p style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>Loading contacts...</p>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "var(--muted)", background: "var(--panel)", borderRadius: "12px", border: "1px solid var(--line)" }}>
        <p style={{ fontSize: "0.9rem" }}>No contacts found</p>
      </div>
    );
  }

  const cellStyle = {
    padding: "0.75rem 1rem",
    fontSize: "0.82rem",
    borderBottom: "1px solid var(--line)",
  };

  const headerStyle = {
    ...cellStyle,
    fontSize: "0.68rem",
    fontWeight: 700 as const,
    color: "var(--muted)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
  };

  return (
    <div style={{ overflow: "auto", background: "var(--panel)", borderRadius: "12px", border: "1px solid var(--line)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={headerStyle}>Reference ID</th>
            <th style={headerStyle}>Name</th>
            <th style={headerStyle}>Email</th>
            <th style={headerStyle}>Subject</th>
            <th style={headerStyle}>Status</th>
            <th style={headerStyle}>Date</th>
            <th style={{ ...headerStyle, textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((c) => (
            <tr key={c.referenceId} style={{ transition: "background 0.2s" }} className="hover:bg-white/[0.02]">
              <td style={{ ...cellStyle, fontWeight: 600, color: "var(--lime)", fontFamily: "monospace", fontSize: "0.78rem" }}>
                {c.referenceId}
              </td>
              <td style={cellStyle}>{c.fullName}</td>
              <td style={{ ...cellStyle, color: "var(--dim)" }}>{c.email}</td>
              <td style={{ ...cellStyle, maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {c.subject}
              </td>
              <td style={cellStyle}>
                <select
                  value={c.status}
                  onChange={(e) => onStatusChange(c, e.target.value as ContactStatus)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "inherit",
                    cursor: "pointer",
                    fontSize: "0.78rem",
                    outline: "none",
                  }}
                >
                  <option value="New" style={{ background: "var(--panel)" }}>🔵 New</option>
                  <option value="In Progress" style={{ background: "var(--panel)" }}>🟡 In Progress</option>
                  <option value="Resolved" style={{ background: "var(--panel)" }}>🟢 Resolved</option>
                </select>
              </td>
              <td style={{ ...cellStyle, color: "var(--muted)", fontSize: "0.78rem" }}>
                {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
              </td>
              <td style={{ ...cellStyle, textAlign: "right" }}>
                <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => onView(c)}
                    style={{ background: "var(--lift)", border: "1px solid var(--line)", borderRadius: "6px", padding: "0.4rem", cursor: "pointer", color: "var(--dim)", transition: "0.2s" }}
                    title="View details"
                    className="hover:text-[var(--lime)] hover:border-[var(--lime)]"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(c)}
                    style={{ background: "var(--lift)", border: "1px solid var(--line)", borderRadius: "6px", padding: "0.4rem", cursor: "pointer", color: "var(--dim)", transition: "0.2s" }}
                    title="Delete"
                    className="hover:text-[var(--rose)] hover:border-[var(--rose)]"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
