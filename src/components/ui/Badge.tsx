import type { ContactStatus } from "@/types/contact";

const statusConfig: Record<ContactStatus, { bg: string; text: string }> = {
  New: { bg: "bg-blue-500/15", text: "text-blue-400" },
  "In Progress": { bg: "bg-yellow-500/15", text: "text-yellow-400" },
  Resolved: { bg: "bg-green-500/15", text: "text-green-400" },
};

export function Badge({ status }: { status: ContactStatus }) {
  const config = statusConfig[status] || statusConfig.New;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
      {status}
    </span>
  );
}
