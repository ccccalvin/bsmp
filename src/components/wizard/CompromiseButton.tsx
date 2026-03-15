"use client";

import { useState } from "react";
import { Compromise } from "@/lib/types";
import CompromisePopup from "./CompromisePopup";

interface CompromiseButtonProps {
  compromises: Compromise[];
}

export default function CompromiseButton({ compromises }: CompromiseButtonProps) {
  const [open, setOpen] = useState(false);

  if (compromises.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center justify-center w-9 h-9 rounded-lg border border-warning bg-warning-bg hover:bg-amber-100 transition-colors"
        aria-label={`${compromises.length} budget trade-off${compromises.length === 1 ? "" : "s"}`}
      >
        {/* Warning triangle icon */}
        <svg
          className="w-5 h-5 text-warning"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 8a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>

        {/* Count badge */}
        {compromises.length > 1 && (
          <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full">
            {compromises.length}
          </span>
        )}
      </button>

      {open && (
        <CompromisePopup
          compromises={compromises}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
