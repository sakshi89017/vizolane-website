"use client";

import { useEffect, useState, useCallback } from "react";
import type { Contact, ContactStatus } from "@/types/contact";
import type { PaginatedResponse } from "@/types/api";
import { ContactTable } from "@/components/admin/ContactTable";
import { SearchBar } from "@/components/admin/SearchBar";
import { ContactDetailModal } from "@/components/admin/ContactDetailModal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Toast } from "@/components/ui/Toast";

export default function ContactsPage() {
  const [data, setData] = useState<PaginatedResponse<Contact> | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const key = localStorage.getItem("vizolane_admin_key") || "";
      const params = new URLSearchParams();
      if (statusFilter !== "All") params.set("status", statusFilter);
      if (search) params.set("search", search);
      params.set("page", String(page));
      params.set("limit", "15");

      const res = await fetch(`/api/admin/submissions?${params}`, {
        headers: { "x-admin-key": key },
      });
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else if (res.status === 401) {
        localStorage.removeItem("vizolane_admin_key");
        setToast({ type: "error", message: "Invalid admin key. Please sign in again." });
        window.location.href = "/admin";
      } else if (res.status === 403) {
        setToast({ type: "error", message: "Access denied. CORS error — check your domain config." });
      } else {
        setToast({ type: "error", message: json.error || "Failed to load contacts." });
      }
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
      setToast({ type: "error", message: "Network error. Check your connection." });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, page]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  async function handleStatusChange(contact: Contact, newStatus: ContactStatus) {
    try {
      const key = localStorage.getItem("vizolane_admin_key") || "";
      const res = await fetch(`/api/admin/submissions/${contact.referenceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-key": key },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setToast({ type: "success", message: `Status updated to "${newStatus}"` });
        fetchContacts();
      } else {
        setToast({ type: "error", message: json.error || "Failed to update" });
      }
    } catch {
      setToast({ type: "error", message: "Network error" });
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      const key = localStorage.getItem("vizolane_admin_key") || "";
      const res = await fetch(`/api/admin/submissions/${deleteTarget.referenceId}`, {
        method: "DELETE",
        headers: { "x-admin-key": key },
      });
      const json = await res.json();
      if (json.success) {
        setToast({ type: "success", message: "Contact deleted" });
        setDeleteTarget(null);
        fetchContacts();
      } else {
        setToast({ type: "error", message: json.error || "Failed to delete" });
      }
    } catch {
      setToast({ type: "error", message: "Network error" });
    }
  }

  const statuses = ["All", "New", "In Progress", "Resolved"];

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 700 }}>Contact Submissions</h1>
        <p style={{ color: "var(--dim)", fontSize: "0.9rem" }}>
          Manage and respond to contact form submissions
        </p>
      </div>

      {/* ── Filters ────────────────────────── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              style={{
                padding: "0.45rem 1rem",
                fontSize: "0.78rem",
                fontWeight: 600,
                borderRadius: "6px",
                border: "1px solid",
                borderColor: statusFilter === s ? "var(--lime)" : "var(--line)",
                background: statusFilter === s ? "var(--lime-dim)" : "transparent",
                color: statusFilter === s ? "var(--lime)" : "var(--dim)",
                cursor: "pointer",
                transition: "0.2s",
              }}
            >
              {s}
            </button>
          ))}
        </div>

        <div style={{ marginLeft: "auto" }}>
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} />
        </div>
      </div>

      {/* ── Table ──────────────────────────── */}
      <ContactTable
        contacts={data?.items || []}
        loading={loading}
        onView={setSelectedContact}
        onDelete={setDeleteTarget}
        onStatusChange={handleStatusChange}
      />

      {/* ── Pagination ─────────────────────── */}
      {data && data.totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1.5rem" }}>
          {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                border: "1px solid",
                borderColor: page === p ? "var(--lime)" : "var(--line)",
                background: page === p ? "var(--lime-dim)" : "transparent",
                color: page === p ? "var(--lime)" : "var(--dim)",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "0.2s",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* ── Modals ─────────────────────────── */}
      {selectedContact && (
        <ContactDetailModal
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Contact"
          message={`Are you sure you want to permanently delete "${deleteTarget.fullName}" (${deleteTarget.referenceId})? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
