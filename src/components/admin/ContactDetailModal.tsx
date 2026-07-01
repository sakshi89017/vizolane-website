import type { Contact } from "@/types/contact";
import { Badge } from "@/components/ui/Badge";
import { X, Mail, Phone, Calendar, Tag } from "lucide-react";

interface ContactDetailModalProps {
  contact: Contact;
  onClose: () => void;
}

export function ContactDetailModal({ contact, onClose }: ContactDetailModalProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "560px",
          background: "var(--panel)",
          border: "1px solid var(--line)",
          borderRadius: "16px",
          padding: "2rem",
          position: "relative",
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "var(--lift)",
            border: "1px solid var(--line)",
            borderRadius: "8px",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "var(--dim)",
            transition: "0.2s",
          }}
          className="hover:text-[var(--text)]"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div style={{ marginBottom: "1.5rem" }}>
          <span style={{ fontFamily: "monospace", fontSize: "0.78rem", color: "var(--lime)" }}>
            {contact.referenceId}
          </span>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginTop: "0.3rem" }}>
            {contact.fullName}
          </h2>
          <Badge status={contact.status} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "var(--dim)", fontSize: "0.85rem" }}>
            <Mail size={15} />
            <a href={`mailto:${contact.email}`} style={{ color: "var(--lime)" }}>{contact.email}</a>
          </div>
          {contact.phone && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "var(--dim)", fontSize: "0.85rem" }}>
              <Phone size={15} />
              {contact.phone}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "var(--dim)", fontSize: "0.85rem" }}>
            <Tag size={15} />
            {contact.subject}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "var(--dim)", fontSize: "0.85rem" }}>
            <Calendar size={15} />
            {new Date(contact.createdAt).toLocaleString("en-IN", {
              dateStyle: "long",
              timeStyle: "short",
            })}
          </div>
        </div>

        <div>
          <label style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "0.4rem" }}>
            Message
          </label>
          <div
            style={{
              padding: "1rem",
              background: "var(--lift)",
              borderRadius: "10px",
              border: "1px solid var(--line)",
              fontSize: "0.88rem",
              lineHeight: 1.7,
              color: "var(--dim)",
              whiteSpace: "pre-wrap",
            }}
          >
            {contact.message}
          </div>
        </div>
      </div>
    </div>
  );
}
