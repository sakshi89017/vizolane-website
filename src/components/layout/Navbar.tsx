"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#vision", label: "Vision" },
  { href: "#founders", label: "Team" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "var(--nav)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          background: scrolled ? "rgba(5,7,20,.97)" : "rgba(5,7,20,.8)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${scrolled ? "var(--line2)" : "var(--line)"}`,
          transition: "0.3s",
        }}
      >
        <nav
          style={{
            width: "100%",
            maxWidth: "var(--w)",
            margin: "0 auto",
            padding: "0 clamp(16px, 4vw, 40px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "2rem",
          }}
        >
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
              <span style={{ fontSize: "1.1rem", fontWeight: 700, letterSpacing: "0.04em", color: "#fff" }}>
                VIZOLANE
              </span>
              <span style={{ fontSize: "0.52rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--lime)", marginTop: "2px" }}>
                Technologies LLP
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 500,
                  color: "var(--dim)",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  transition: "0.25s",
                }}
                className="hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/contact"
              style={{
                padding: "0.6rem 1.5rem",
                background: "var(--lime)",
                color: "#050714",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                borderRadius: "4px",
                transition: "0.3s",
              }}
              className="hover:opacity-85"
            >
              Contact
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "none", color: "var(--text)", cursor: "pointer", padding: "6px" }}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 998,
            background: "#050714",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
          }}
        >
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              position: "absolute",
              top: "1.4rem",
              right: "1.4rem",
              background: "none",
              border: "1.5px solid var(--line2)",
              width: "40px",
              height: "40px",
              color: "var(--text)",
              fontSize: "1.1rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text)", transition: "0.25s" }}
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="btn btn-g"
            style={{ marginTop: "1rem" }}
          >
            Contact Us
          </Link>
        </div>
      )}
    </>
  );
}
