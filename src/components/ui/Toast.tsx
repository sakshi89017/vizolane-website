"use client";

import { useEffect, useState, type ReactNode } from "react";
import { CheckCircle, XCircle, AlertTriangle, X } from "lucide-react";

type ToastType = "success" | "error" | "warning";

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
  duration?: number;
}

const iconMap: Record<ToastType, ReactNode> = {
  success: <CheckCircle size={18} />,
  error: <XCircle size={18} />,
  warning: <AlertTriangle size={18} />,
};

const colorMap: Record<ToastType, string> = {
  success: "border-green-500/30 bg-green-500/10 text-green-400",
  error: "border-red-500/30 bg-red-500/10 text-red-400",
  warning: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
};

export function Toast({ type, message, onClose, duration = 5000 }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-[10000] flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-md transition-all duration-300 ${colorMap[type]} ${
        visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
      }`}
      style={{ maxWidth: "420px" }}
    >
      {iconMap[type]}
      <span className="text-sm font-medium flex-1">{message}</span>
      <button onClick={onClose} className="hover:opacity-70 transition-opacity cursor-pointer">
        <X size={16} />
      </button>
    </div>
  );
}
