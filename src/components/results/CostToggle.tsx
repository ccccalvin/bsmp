"use client";

import { CostDisplayMode } from "@/lib/types";

interface CostToggleProps {
  mode: CostDisplayMode;
  onChange: (mode: CostDisplayMode) => void;
}

export default function CostToggle({ mode, onChange }: CostToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-border overflow-hidden text-sm">
      <button
        onClick={() => onChange("shopping_total")}
        className={`px-4 py-2 font-medium transition-colors ${
          mode === "shopping_total"
            ? "bg-primary text-white"
            : "bg-card hover:bg-secondary"
        }`}
      >
        Shopping Total
      </button>
      <button
        onClick={() => onChange("per_serving")}
        className={`px-4 py-2 font-medium transition-colors ${
          mode === "per_serving"
            ? "bg-primary text-white"
            : "bg-card hover:bg-secondary"
        }`}
      >
        Per Serving
      </button>
    </div>
  );
}
