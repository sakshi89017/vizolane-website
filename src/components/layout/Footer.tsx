import Link from "next/link";

export function Footer() {
  return (
    <footer
      style={{
        padding: "3rem 0",
        borderTop: "1px solid var(--line)",
        background: "var(--bg)",
      }}
    >
      <div className="wrap">
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1.5rem" }}>
          <div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.3rem" }}>
              VIZOLANE
            </div>
            <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
              AI-Powered Smart City Infrastructure
            </p>
          </div>

          <div style={{ display: "flex", gap: "2rem" }}>
            <a href="#vision" style={{ color: "var(--dim)", fontSize: "0.82rem" }} className="hover:text-white">
              Solutions
            </a>
            <a href="#founders" style={{ color: "var(--dim)", fontSize: "0.82rem" }} className="hover:text-white">
              Team
            </a>
            <Link href="/contact" style={{ color: "var(--dim)", fontSize: "0.82rem" }} className="hover:text-white">
              Contact
            </Link>
          </div>
        </div>

        <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--line)", textAlign: "center" }}>
          <p style={{ color: "var(--muted)", fontSize: "0.75rem" }}>
            © {new Date().getFullYear()} Vizolane Technologies LLP. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
