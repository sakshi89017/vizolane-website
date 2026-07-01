import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | Vizolane Technologies LLP",
  description:
    "Get in touch with Vizolane Technologies. We'd love to hear about your smart city and digital transformation needs.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main
        style={{
          minHeight: "100vh",
          paddingTop: "calc(var(--nav) + 4rem)",
          paddingBottom: "4rem",
        }}
      >
        <div className="wrap" style={{ maxWidth: "720px" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="lbl">Contact Us</div>
            <h1
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                fontWeight: 700,
                margin: "1rem 0",
              }}
            >
              Let&apos;s Build Something{" "}
              <span className="gt">Extraordinary</span>
            </h1>
            <p style={{ color: "var(--dim)", maxWidth: "500px", margin: "0 auto" }}>
              Have a project in mind? Fill out the form below and our team will
              get back to you within 24 hours.
            </p>
          </div>

          <ContactForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
