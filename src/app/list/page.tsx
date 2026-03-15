"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState, Suspense } from "react";

interface ListItem {
  name: string;
  detail: string;
  store: string;
}

function ListContent() {
  const searchParams = useSearchParams();
  const items = useMemo(() => {
    try {
      const data = searchParams.get("items");
      if (!data) return null;
      return JSON.parse(atob(data)) as ListItem[];
    } catch {
      return null;
    }
  }, [searchParams]);

  const [checked, setChecked] = useState<Set<number>>(new Set());

  function toggle(index: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  if (!items) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-muted">No shopping list found.</p>
      </div>
    );
  }

  // Group items by store
  const grouped = items.reduce(
    (acc, item) => {
      if (!acc[item.store]) acc[item.store] = [];
      acc[item.store].push(item);
      return acc;
    },
    {} as Record<string, ListItem[]>
  );

  let globalIndex = 0;

  return (
    <div className="min-h-screen bg-background p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-1">Shopping List</h1>
      <p className="text-sm text-muted mb-4">BudgetBite Meal Planner</p>

      {Object.entries(grouped).map(([store, storeItems]) => (
        <div key={store} className="mb-5">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-2">
            {store}
          </h2>
          <div className="space-y-1">
            {storeItems.map((item) => {
              const idx = globalIndex++;
              return (
                <button
                  key={idx}
                  onClick={() => toggle(idx)}
                  className="flex items-start gap-3 w-full text-left py-2 px-1 rounded-lg active:bg-secondary transition-colors"
                >
                  <div
                    className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                      checked.has(idx)
                        ? "bg-primary border-primary"
                        : "border-border"
                    }`}
                  >
                    {checked.has(idx) && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div
                      className={`font-medium text-sm ${checked.has(idx) ? "line-through text-muted" : ""}`}
                    >
                      {item.name}
                    </div>
                    <div className="text-xs text-muted">{item.detail}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ListPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted">Loading...</p>
        </div>
      }
    >
      <ListContent />
    </Suspense>
  );
}
