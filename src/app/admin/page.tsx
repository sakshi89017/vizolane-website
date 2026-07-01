"use client";

import { useEffect, useState } from "react";
import { DashboardCards } from "@/components/admin/DashboardCards";
import { PlaceholderCard } from "@/components/admin/PlaceholderCard";
import { BarChart3, Users, Settings } from "lucide-react";

interface Counts {
  total: number;
  new: number;
  inProgress: number;
  resolved: number;
}

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const key = localStorage.getItem("vizolane_admin_key") || "";
        const res = await fetch("/api/admin/stats", {
          headers: { "x-admin-key": key },
        });
        const data = await res.json();
        if (data.success) setCounts(data.data);
      } catch (err) {
        console.error("Failed to fetch counts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCounts();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 700 }}>Dashboard</h1>
        <p style={{ color: "var(--dim)", fontSize: "0.9rem" }}>
          Overview of contact submissions and platform activity
        </p>
      </div>

      {/* ── KPI Cards ──────────────────────── */}
      <DashboardCards counts={counts} loading={loading} />

      {/* ── Future Modules ─────────────────── */}
      <div style={{ marginTop: "2rem" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "1rem", color: "var(--dim)" }}>
          Coming Soon
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
          <PlaceholderCard
            icon={<BarChart3 size={24} />}
            title="Analytics"
            description="Traffic analytics, conversion metrics, and submission trends over time."
          />
          <PlaceholderCard
            icon={<Users size={24} />}
            title="User Management"
            description="Team member accounts, role-based access control, and activity logs."
          />
          <PlaceholderCard
            icon={<Settings size={24} />}
            title="Settings"
            description="Platform configuration, notification preferences, and integration settings."
          />
        </div>
      </div>
    </div>
  );
}
