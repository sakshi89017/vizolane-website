import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div style={{ position: "relative" }}>
      <Search
        size={16}
        style={{
          position: "absolute",
          left: "0.75rem",
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--muted)",
        }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name, email, or reference ID..."
        style={{
          padding: "0.6rem 0.75rem 0.6rem 2.3rem",
          width: "320px",
          maxWidth: "100%",
          background: "var(--panel)",
          border: "1px solid var(--line)",
          borderRadius: "8px",
          color: "var(--text)",
          fontSize: "0.82rem",
          outline: "none",
          transition: "border-color 0.3s",
        }}
      />
    </div>
  );
}
