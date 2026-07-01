import type { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: ReactNode;
}

const variantStyles: Record<string, string> = {
  primary: "bg-[var(--lime)] text-[#050714] shadow-[0_0_24px_var(--lime-glow)] hover:shadow-[0_0_40px_var(--lime-glow)] hover:-translate-y-0.5",
  outline: "bg-transparent text-[var(--text)] border border-[var(--line2)] hover:border-[var(--lime)] hover:text-[var(--lime)]",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "bg-transparent text-[var(--dim)] hover:text-[var(--text)] hover:bg-white/5",
};

const sizeStyles: Record<string, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-8 py-3.5 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-semibold uppercase tracking-wide rounded-md transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" style={{ animation: "spin 0.6s linear infinite" }} />
      )}
      {children}
    </button>
  );
}
