"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  Users,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { href: "/admin", icon: <LayoutDashboard size={18} />, label: "Dashboard", exact: true },
  { href: "/admin/contacts", icon: <MessageSquare size={18} />, label: "Contacts" },
  { href: "#", icon: <BarChart3 size={18} />, label: "Analytics", disabled: true },
  { href: "#", icon: <Users size={18} />, label: "Users", disabled: true },
  { href: "#", icon: <Settings size={18} />, label: "Settings", disabled: true },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState(false);
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("vizolane_admin_key");
    if (stored) {
      setAuthenticated(true);
    }
    setChecking(false);
  }, []);

  function handleLogin() {
    if (!key.trim()) {
      setError("Please enter the admin key");
      return;
    }
    localStorage.setItem("vizolane_admin_key", key.trim());
    setAuthenticated(true);
    setError("");
  }

  function handleLogout() {
    localStorage.removeItem("vizolane_admin_key");
    setAuthenticated(false);
    setKey("");
  }

  if (checking) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <div className="inline-block w-8 h-8 border-2 border-[var(--lime)] border-t-transparent rounded-full" style={{ animation: "spin 0.6s linear infinite" }} />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", padding: "2rem" }}>
        <div style={{ width: "100%", maxWidth: "400px", padding: "2.5rem", background: "var(--panel)", border: "1px solid var(--line)", borderRadius: "16px" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem", textAlign: "center" }}>
            Admin Dashboard
          </h1>
          <p style={{ color: "var(--dim)", fontSize: "0.85rem", textAlign: "center", marginBottom: "2rem" }}>
            Enter your admin key to access the dashboard
          </p>

          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Admin API Key"
            style={{
              width: "100%",
              padding: "0.85rem 1rem",
              background: "var(--lift)",
              border: `1px solid ${error ? "var(--rose)" : "var(--line)"}`,
              borderRadius: "8px",
              color: "var(--text)",
              fontSize: "0.9rem",
              outline: "none",
              marginBottom: "0.5rem",
            }}
          />
          {error && (
            <p style={{ color: "var(--rose)", fontSize: "0.75rem", marginBottom: "0.5rem" }}>{error}</p>
          )}

          <button
            onClick={handleLogin}
            className="btn btn-g"
            style={{ width: "100%", justifyContent: "center", marginTop: "1rem" }}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      {/* ── Sidebar ────────────────────────── */}
      <aside
        style={{
          width: "260px",
          background: "var(--panel)",
          borderRight: "1px solid var(--line)",
          padding: "1.5rem 0",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        <div style={{ padding: "0 1.5rem", marginBottom: "2rem" }}>
          <Link href="/" style={{ display: "block" }}>
            <span style={{ fontSize: "1rem", fontWeight: 700, letterSpacing: "0.04em" }}>VIZOLANE</span>
            <span style={{ display: "block", fontSize: "0.5rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--lime)", marginTop: "2px" }}>
              Admin Dashboard
            </span>
          </Link>
        </div>

        <nav style={{ flex: 1 }}>
          {navItems.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href) && item.href !== "/admin";

            return (
              <Link
                key={item.label}
                href={item.disabled ? "#" : item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.7rem 1.5rem",
                  fontSize: "0.85rem",
                  fontWeight: active ? 600 : 400,
                  color: item.disabled ? "var(--muted)" : active ? "var(--text)" : "var(--dim)",
                  background: active ? "var(--lime-dim)" : "transparent",
                  borderLeft: active ? "3px solid var(--lime)" : "3px solid transparent",
                  transition: "0.2s",
                  opacity: item.disabled ? 0.5 : 1,
                  cursor: item.disabled ? "not-allowed" : "pointer",
                }}
              >
                {item.icon}
                {item.label}
                {item.disabled && (
                  <span style={{ marginLeft: "auto", fontSize: "0.6rem", background: "var(--lift)", padding: "0.15rem 0.4rem", borderRadius: "4px", color: "var(--muted)" }}>
                    Soon
                  </span>
                )}
                {active && <ChevronRight size={14} style={{ marginLeft: "auto", color: "var(--lime)" }} />}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "0 1.5rem" }}>
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.7rem 0",
              fontSize: "0.82rem",
              color: "var(--dim)",
              background: "none",
              border: "none",
              cursor: "pointer",
              width: "100%",
              transition: "0.2s",
            }}
            className="hover:text-[var(--rose)]"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ──────────────────── */}
      <main style={{ flex: 1, marginLeft: "260px", padding: "2rem" }}>
        {children}
      </main>
    </div>
  );
}
