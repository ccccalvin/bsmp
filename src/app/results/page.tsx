"use client";

import { useSearchParams } from "next/navigation";
import { useState, useMemo, Suspense } from "react";
import { UserPreferences, MealSlot } from "@/lib/types";
import { useMealPlan } from "@/hooks/useMealPlan";
import CalendarGrid from "@/components/results/CalendarGrid";
import CostToggle from "@/components/results/CostToggle";
import BudgetWarning from "@/components/results/BudgetWarning";
import MealDetailModal from "@/components/results/MealDetailModal";
import ShoppingSidebar from "@/components/results/ShoppingSidebar";
import Link from "next/link";

function ResultsContent() {
  const searchParams = useSearchParams();
  const prefsParam = searchParams.get("prefs");

  const prefs = useMemo<UserPreferences>(() => {
    if (!prefsParam) {
      return {
        budget_weekly: 50,
        num_days: 5,
        calorie_preference: "balanced",
        dietary_restrictions: [],
        cuisines: [],
        max_difficulty: "medium",
        max_cook_time_min: 30,
      };
    }
    try {
      return JSON.parse(atob(prefsParam));
    } catch {
      return {
        budget_weekly: 50,
        num_days: 5,
        calorie_preference: "balanced",
        dietary_restrictions: [],
        cuisines: [],
        max_difficulty: "medium",
        max_cook_time_min: 30,
      };
    }
  }, [prefsParam]);

  const { plan, shoppingList, costMode, setCostMode, swapMeal, regenerate } =
    useMealPlan(prefs);

  const [selectedSlot, setSelectedSlot] = useState<MealSlot | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const displayTotal =
    costMode === "shopping_total"
      ? plan.total_shopping_cost
      : plan.total_per_serving_cost;

  return (
    <main className="min-h-screen pb-12">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link href="/" className="text-xl font-bold">
              BudgetBite
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <CostToggle mode={costMode} onChange={setCostMode} />
            <div className="text-right">
              <div className="text-sm text-muted">
                {costMode === "shopping_total"
                  ? "Shopping Total"
                  : "Per Serving Total"}
              </div>
              <div className="text-2xl font-bold text-primary">
                ${displayTotal.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-6 space-y-4">
        {/* Budget warning */}
        {plan.over_budget && (
          <BudgetWarning total={plan.total_shopping_cost} budget={plan.budget} />
        )}

        {/* Plan warning */}
        {plan.warning && (
          <div className="bg-warning-bg border border-warning rounded-lg px-4 py-3 text-sm">
            {plan.warning}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Your {prefs.num_days}-day meal plan
          </h2>
          <div className="flex gap-2">
            <button
              onClick={regenerate}
              className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-secondary transition-colors"
            >
              Regenerate
            </button>
            <Link
              href="/wizard"
              className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-secondary transition-colors"
            >
              Edit Preferences
            </Link>
          </div>
        </div>

        {/* Calendar grid */}
        <CalendarGrid
          slots={plan.slots}
          numDays={prefs.num_days}
          costMode={costMode}
          onSwap={swapMeal}
          onMealClick={setSelectedSlot}
        />
      </div>

      {/* Modal */}
      {selectedSlot && (
        <MealDetailModal
          slot={selectedSlot}
          onClose={() => setSelectedSlot(null)}
        />
      )}

      {/* Shopping sidebar */}
      <ShoppingSidebar
        shoppingList={shoppingList}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-muted">Generating your meal plan...</div>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
