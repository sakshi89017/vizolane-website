import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StatsCounter } from "@/components/home/StatsCounter";
import { SolutionCard } from "@/components/home/SolutionCard";
import { FounderCard } from "@/components/home/FounderCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import {
  TrafficCone,
  CreditCard,
  Bus,
  Globe,
  Zap,
  Shield,
  BarChart3,
  Users,
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      <div id="spb" />
      <Navbar />

      {/* ── HERO ────────────────────────────────── */}
      <section className="hero" id="home" aria-label="Hero">
        <div className="hero-visual">
          <picture>
            <source media="(max-width:768px)" srcSet="/images/hero-mobile.jpeg" />
            <Image
              src="/images/hero-bg.jpeg"
              alt="Traffic Management System"
              fill
              priority
              className="object-cover object-center"
            />
          </picture>
        </div>
        <div className="hbg" aria-hidden="true" />

        <div className="hover">
          <div className="hbadge" style={{ animationName: "fu", animationDuration: "0.8s", animationDelay: "0.2s", animationFillMode: "forwards" }}>
            <span className="hdot" />
            Smart Traffic Solutions • Intelligent Transportation
          </div>

          <h1 style={{ fontSize: "clamp(2.4rem, 6vw, 4.2rem)", fontWeight: 800, margin: "1.2rem 0", lineHeight: 1.05 }}>
            The Future of
            <br />
            <span className="gt">Urban Mobility</span>
          </h1>

          <p style={{ fontSize: "1.05rem", color: "var(--dim)", maxWidth: "540px", margin: "0 0 2rem" }}>
            Delivering smart traffic control, emergency corridor management,
            adaptive signaling, and intelligent transportation solutions for
            modern cities.
          </p>

          <StatsCounter />

          <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
            <a href="#vision" className="btn btn-g">Explore Our Vision</a>
            <Link href="/contact" className="btn btn-o">Get In Touch</Link>
          </div>
        </div>
      </section>

      {/* ── VISION ──────────────────────────────── */}
      <section id="vision" style={{ padding: "6rem 0" }}>
        <div className="wrap">
          <ScrollReveal>
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <div className="lbl">Smarter Traffic. Faster Response.</div>
              <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, margin: "1rem 0" }}>
                AI-driven grid optimization and{" "}
                <span className="gt">automated emergency routing.</span>
              </h2>
              <p style={{ color: "var(--dim)", maxWidth: "600px", margin: "0 auto" }}>
                See the real difference intelligent infrastructure makes — for
                every driver, every day.
              </p>
            </div>
          </ScrollReveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            <ScrollReveal delay={0.1}>
              <SolutionCard
                icon={<TrafficCone size={28} />}
                title="Intelligent Traffic Management"
                description="AI signal optimization, real-time congestion monitoring, and adaptive intersection control systems."
              />
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <SolutionCard
                icon={<CreditCard size={28} />}
                title="Smart Tolling Solutions"
                description="Automatic vehicle identification, barrierless electronic tolling, and real-time revenue analytics."
              />
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <SolutionCard
                icon={<Bus size={28} />}
                title="AI Urban Transportation"
                description="Transit analytics, route optimization, predictive scheduling, and multimodal integration."
              />
            </ScrollReveal>
            <ScrollReveal delay={0.4}>
              <SolutionCard
                icon={<Globe size={28} />}
                title="Digital Transformation"
                description="Enterprise web development, data analytics platforms, and end-to-end digital solutions."
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── WHY VIZOLANE ────────────────────────── */}
      <section style={{ padding: "5rem 0", background: "var(--bg2)" }}>
        <div className="wrap">
          <ScrollReveal>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div className="lbl">Why Vizolane</div>
              <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 700, margin: "1rem 0" }}>
                Built for the <span className="gt">cities of tomorrow</span>
              </h2>
            </div>
          </ScrollReveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
            {[
              { icon: <Zap size={24} />, title: "Real-Time Processing", desc: "Sub-second decision making across thousands of intersections." },
              { icon: <Shield size={24} />, title: "Enterprise Security", desc: "Bank-grade encryption and compliance-ready infrastructure." },
              { icon: <BarChart3 size={24} />, title: "Data Analytics", desc: "Actionable insights from millions of daily traffic data points." },
              { icon: <Users size={24} />, title: "24/7 Support", desc: "Dedicated engineering team for deployment and maintenance." },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div style={{
                  padding: "2rem",
                  background: "var(--panel)",
                  border: "1px solid var(--line)",
                  borderRadius: "12px",
                  transition: "border-color 0.3s, transform 0.3s",
                }}>
                  <div style={{ color: "var(--lime)", marginBottom: "1rem" }}>{item.icon}</div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.5rem" }}>{item.title}</h3>
                  <p style={{ color: "var(--dim)", fontSize: "0.9rem" }}>{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOUNDERS ────────────────────────────── */}
      <section id="founders" style={{ padding: "6rem 0" }}>
        <div className="wrap">
          <ScrollReveal>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div className="lbl">Leadership</div>
              <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 700, margin: "1rem 0" }}>
                Meet Our <span className="gt">Founders</span>
              </h2>
            </div>
          </ScrollReveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", maxWidth: "800px", margin: "0 auto" }}>
            <ScrollReveal delay={0.1}>
              <FounderCard
                name="Rasheswar Sharma"
                role="Co-Founder & Web Developer"
                image="/images/founder-rasheswar.png"
                skills={["Full-Stack Web Development", "UI/UX Design", "Data Analytics", "Digital Solutions"]}
              />
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <FounderCard
                name="Vithika"
                role="Co-Founder"
                image="/images/vithika.jpg"
                skills={["Strategic Planning", "Business Development", "Innovation Leadership"]}
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────── */}
      <section style={{ padding: "5rem 0", background: "var(--bg2)" }}>
        <div className="wrap" style={{ textAlign: "center" }}>
          <ScrollReveal>
            <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 700, marginBottom: "1rem" }}>
              Ready to build <span className="gt">smarter cities</span>?
            </h2>
            <p style={{ color: "var(--dim)", maxWidth: "500px", margin: "0 auto 2rem" }}>
              Let&apos;s discuss how Vizolane can transform your urban infrastructure with AI-powered solutions.
            </p>
            <Link href="/contact" className="btn btn-g">
              Contact Us
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
