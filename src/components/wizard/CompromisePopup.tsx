"use client";

import { Compromise } from "@/lib/types";
import { useEffect, useRef } from "react";

interface CompromisePopupProps {
  compromises: Compromise[];
  onClose: () => void;
}

function SeverityIcon({ severity }: { severity: Compromise["severity"] }) {
  if (severity === "critical") {
    return (
      <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 shrink-0 mt-1" />
    );
  }
  if (severity === "warning") {
    return (
      <svg className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 8a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
    );
  }
  return (
    <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-400 shrink-0 mt-1" />
  );
}

export default function CompromisePopup({
  compromises,
  onClose,
}: CompromisePopupProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-lg z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <h3 className="font-semibold text-sm">Budget Trade-offs</h3>
        <button
          onClick={onClose}
          className="text-muted hover:text-foreground transition-colors text-lg leading-none"
          aria-label="Close"
        >
          &times;
        </button>
      </div>

      {/* Compromise list */}
      <ul className="px-4 pb-2 space-y-2">
        {compromises.map((c, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <SeverityIcon severity={c.severity} />
            <span>{c.message}</span>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-border text-xs text-muted">
        Increase your budget or relax filters to improve your plan.
      </div>
    </div>
  );
}
