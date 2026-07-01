"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { ContactSuccess } from "./ContactSuccess";
import { Send } from "lucide-react";

interface FieldError {
  fullName?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export function ContactForm() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FieldError>({});
  const [loading, setLoading] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  function validate(): boolean {
    const e: FieldError = {};
    if (!form.fullName || form.fullName.trim().length < 2)
      e.fullName = "Name is required (at least 2 characters)";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "A valid email address is required";
    if (!form.subject || form.subject.trim().length < 2)
      e.subject = "Subject is required";
    if (!form.message || form.message.trim().length < 5)
      e.message = "Message is required (at least 5 characters)";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setServerError(
          data.error || data.errors?.join(", ") || "Submission failed. Please try again."
        );
        return;
      }

      setReferenceId(data.referenceId);
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setForm({ fullName: "", email: "", phone: "", subject: "", message: "" });
    setReferenceId(null);
    setErrors({});
    setServerError(null);
  }

  if (referenceId) {
    return <ContactSuccess referenceId={referenceId} onReset={handleReset} />;
  }

  const inputStyle = {
    width: "100%",
    padding: "0.85rem 1rem",
    background: "var(--panel)",
    border: "1px solid var(--line)",
    borderRadius: "8px",
    color: "var(--text)",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.3s",
    fontFamily: "inherit",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.8rem",
    fontWeight: 600 as const,
    color: "var(--dim)",
    marginBottom: "0.4rem",
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        padding: "2.5rem",
        background: "var(--panel)",
        border: "1px solid var(--line)",
        borderRadius: "16px",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem" }}>
        <div>
          <label style={labelStyle}>Full Name *</label>
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            placeholder="John Doe"
            style={{ ...inputStyle, borderColor: errors.fullName ? "var(--rose)" : "var(--line)" }}
          />
          {errors.fullName && (
            <p style={{ color: "var(--rose)", fontSize: "0.75rem", marginTop: "0.3rem" }}>{errors.fullName}</p>
          )}
        </div>

        <div>
          <label style={labelStyle}>Email Address *</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="john@example.com"
            style={{ ...inputStyle, borderColor: errors.email ? "var(--rose)" : "var(--line)" }}
          />
          {errors.email && (
            <p style={{ color: "var(--rose)", fontSize: "0.75rem", marginTop: "0.3rem" }}>{errors.email}</p>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem", marginTop: "1.2rem" }}>
        <div>
          <label style={labelStyle}>Phone (Optional)</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+91 98765 43210"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Subject *</label>
          <input
            type="text"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            placeholder="Project Inquiry"
            style={{ ...inputStyle, borderColor: errors.subject ? "var(--rose)" : "var(--line)" }}
          />
          {errors.subject && (
            <p style={{ color: "var(--rose)", fontSize: "0.75rem", marginTop: "0.3rem" }}>{errors.subject}</p>
          )}
        </div>
      </div>

      <div style={{ marginTop: "1.2rem" }}>
        <label style={labelStyle}>Message *</label>
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Tell us about your project or how we can help..."
          rows={5}
          style={{
            ...inputStyle,
            resize: "vertical",
            borderColor: errors.message ? "var(--rose)" : "var(--line)",
          }}
        />
        {errors.message && (
          <p style={{ color: "var(--rose)", fontSize: "0.75rem", marginTop: "0.3rem" }}>{errors.message}</p>
        )}
      </div>

      {serverError && (
        <div
          style={{
            marginTop: "1rem",
            padding: "0.8rem 1rem",
            background: "var(--rose-dim)",
            border: "1px solid rgba(241,92,117,0.3)",
            borderRadius: "8px",
            color: "var(--rose)",
            fontSize: "0.85rem",
          }}
        >
          {serverError}
        </div>
      )}

      <Button
        type="submit"
        loading={loading}
        className="w-full mt-6"
        size="lg"
      >
        <Send size={16} />
        Send Message
      </Button>
    </form>
  );
}
