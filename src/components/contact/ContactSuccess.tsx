import { CheckCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ContactSuccessProps {
  referenceId: string;
  onReset: () => void;
}

export function ContactSuccess({ referenceId, onReset }: ContactSuccessProps) {
  return (
    <div
      style={{
        padding: "3rem 2.5rem",
        background: "var(--panel)",
        border: "1px solid var(--line)",
        borderRadius: "16px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          background: "rgba(61,203,125,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1.5rem",
          color: "#3dcb7d",
        }}
      >
        <CheckCircle size={36} />
      </div>

      <h2 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        Message Sent Successfully!
      </h2>

      <p style={{ color: "var(--dim)", marginBottom: "1.5rem" }}>
        Thank you for reaching out. Our team will review your message and get
        back to you within 24 hours.
      </p>

      <div
        style={{
          padding: "1rem 1.5rem",
          background: "var(--lift)",
          borderRadius: "10px",
          border: "1px solid var(--line)",
          display: "inline-block",
          marginBottom: "2rem",
        }}
      >
        <span style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.12em", display: "block", marginBottom: "0.3rem" }}>
          Reference ID
        </span>
        <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--lime)", letterSpacing: "0.04em" }}>
          {referenceId}
        </span>
      </div>

      <div>
        <Button variant="outline" onClick={onReset}>
          <RotateCcw size={16} />
          Submit Another Inquiry
        </Button>
      </div>
    </div>
  );
}
