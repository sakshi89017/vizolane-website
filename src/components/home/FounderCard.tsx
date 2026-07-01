import Image from "next/image";

interface FounderCardProps {
  name: string;
  role: string;
  image: string;
  skills: string[];
}

export function FounderCard({ name, role, image, skills }: FounderCardProps) {
  return (
    <div
      style={{
        padding: "2rem",
        background: "var(--panel)",
        border: "1px solid var(--line)",
        borderRadius: "16px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          overflow: "hidden",
          margin: "0 auto 1.2rem",
          border: "2px solid var(--lime)",
          position: "relative",
        }}
      >
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          sizes="100px"
        />
      </div>

      <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>{name}</h3>
      <p style={{ color: "var(--lime)", fontSize: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1rem" }}>
        {role}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
        {skills.map((skill) => (
          <span
            key={skill}
            style={{
              fontSize: "0.72rem",
              padding: "0.3rem 0.8rem",
              background: "var(--lift)",
              border: "1px solid var(--line)",
              borderRadius: "999px",
              color: "var(--dim)",
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
