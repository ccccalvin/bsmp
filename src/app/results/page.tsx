"use client";

import { useSearchParams } from "next/navigation";
import { useState, useMemo, useEffect, Suspense, Fragment, useCallback } from "react";
import { UserPreferences, MealType } from "@/lib/types";
import { MEAL_TYPE_LABELS } from "@/data/constants";
import Link from "next/link";

type IngredientCost = {
  ingredientName: string;
  quantity: string;
  unitsToBuy: number;
  unitPrice: number;
  itemCost: number;
  unit: string;
  imageUrl: string | null;
};

type WeeklyMeal = {
  id: string;
  day: number;
  dayLabel: string;
  mealType: MealType;
  recipeName: string;
  description: string;
  servings: number;
  macrosPerServing: {
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
  };
  steps: string[];
  ingredients: IngredientCost[];
  mealCost: number;
};

type WeeklyResult = {
  request: string;
  summary: {
    budget: number;
    numDays: number;
    totalMeals: number;
    budgetExceeded: boolean;
    totalPrice: number;
    pricePerServing: number;
  };
  meals: WeeklyMeal[];
  costs: {
    totalPrice: number;
    pricePerServing: number;
    shoppingItems: IngredientCost[];
  };
};

const DEFAULT_PREFS: UserPreferences = {
  budget_weekly: 50,
  num_days: 5,
  calorie_preference: "balanced",
  dietary_restrictions: [],
  cuisines: [],
  max_difficulty: "medium",
  max_cook_time_min: 30,
};

const MEAL_TYPES: MealType[] = ["breakfast", "lunch", "dinner"];
const LOADING_STEPS = [
  "Matching recipes to your goals",
  "Pricing ingredients across stores",
  "Balancing nutrition and variety",
  "Finalizing your weekly plan",
];
const MIN_LOADING_MS = 2200;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseCsvList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function AIMealDetailModal({
  meal,
  onClose,
}: {
  meal: WeeklyMeal;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-border flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">{meal.recipeName}</h2>
            <p className="text-muted text-sm mt-1">{meal.description}</p>
            <div className="flex gap-2 mt-3 text-xs">
              <span className="bg-primary-light text-primary-dark px-2 py-1 rounded-full font-medium">
                {meal.dayLabel}
              </span>
              <span className="bg-secondary text-muted px-2 py-1 rounded-full">
                {MEAL_TYPE_LABELS[meal.mealType]}
              </span>
              <span className="bg-secondary text-muted px-2 py-1 rounded-full">
                {meal.servings} servings
              </span>
              <span className="bg-secondary text-muted px-2 py-1 rounded-full">
                ${meal.mealCost.toFixed(2)} est.
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-3 text-xs">
              <div className="bg-secondary px-2 py-1 rounded-md text-center">
                <div className="font-semibold">{meal.macrosPerServing.calories}</div>
                <div className="text-muted">kcal</div>
              </div>
              <div className="bg-secondary px-2 py-1 rounded-md text-center">
                <div className="font-semibold">{meal.macrosPerServing.protein_g}g</div>
                <div className="text-muted">Protein</div>
              </div>
              <div className="bg-secondary px-2 py-1 rounded-md text-center">
                <div className="font-semibold">{meal.macrosPerServing.carbs_g}g</div>
                <div className="text-muted">Carbs</div>
              </div>
              <div className="bg-secondary px-2 py-1 rounded-md text-center">
                <div className="font-semibold">{meal.macrosPerServing.fat_g}g</div>
                <div className="text-muted">Fat</div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground text-xl leading-none p-1"
          >
            &times;
          </button>
        </div>

        <div className="p-6 border-b border-border">
          <h3 className="text-sm font-medium mb-3">Ingredients to buy</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {meal.ingredients.map((ing) => (
              <div
                key={`${ing.ingredientName}-${ing.quantity}`}
                className="border border-border rounded-xl p-3 flex gap-3"
              >
                {ing.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={ing.imageUrl}
                    alt={ing.ingredientName}
                    className="w-20 h-20 rounded-lg object-cover bg-secondary"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-secondary" />
                )}
                <div className="min-w-0">
                  <p className="font-medium text-sm leading-snug">{ing.ingredientName}</p>
                  <p className="text-xs text-muted mt-1">{ing.quantity}</p>
                  <p className="text-xs text-muted">${ing.unitPrice.toFixed(2)} / {ing.unit}</p>
                  <p className="text-sm font-semibold mt-1">${ing.itemCost.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-sm font-medium mb-3">Instructions</h3>
          <ol className="space-y-2">
            {meal.steps.map((step, i) => (
              <li key={`${meal.id}-${i}`} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-medium">
                  {i + 1}
                </span>
                <span className="text-muted">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function MealPlanLoadingScreen({
  progress,
  activeStep,
}: {
  progress: number;
  activeStep: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
            Building Your Plan
          </p>
          <h3 className="text-xl md:text-2xl font-bold mt-1">Cooking up your week</h3>
          <p className="text-sm text-muted mt-1">
            We are generating a personalized plan, pricing ingredients, and balancing variety.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted">Estimated completion</p>
          <p className="text-2xl font-bold text-primary">{Math.round(progress)}%</p>
        </div>
      </div>

      <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        {LOADING_STEPS.map((step, idx) => {
          const isComplete = idx < activeStep;
          const isActive = idx === activeStep;
          return (
            <div
              key={step}
              className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                isComplete
                  ? "border-primary/20 bg-primary-light text-primary-dark"
                  : isActive
                    ? "border-primary/40 bg-secondary"
                    : "border-border bg-card text-muted"
              }`}
            >
              <span className={isActive ? "inline-flex animate-pulse" : "inline-flex"}>{step}</span>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={`stat-skel-${i}`} className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="h-3 w-20 bg-secondary rounded animate-pulse" />
            <div className="h-7 w-24 bg-secondary rounded animate-pulse" />
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="h-5 w-48 bg-secondary rounded animate-pulse" />
        <div className="grid gap-3 min-w-[700px] overflow-x-auto">
          <div className="grid gap-3" style={{ gridTemplateColumns: "90px repeat(5, 1fr)" }}>
            <div className="h-6" />
            {Array.from({ length: 5 }, (_, i) => (
              <div key={`day-head-${i}`} className="h-6 bg-secondary rounded animate-pulse" />
            ))}
            {Array.from({ length: 3 }, (_, row) => (
              <Fragment key={`row-${row}`}>
                <div className="h-20 bg-secondary rounded animate-pulse" />
                {Array.from({ length: 5 }, (_, col) => (
                  <div
                    key={`slot-${row}-${col}`}
                    className="h-20 rounded-xl border border-border bg-secondary/60 animate-pulse"
                  />
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const prefsParam = searchParams.get("prefs");

  const prefs = useMemo<UserPreferences>(() => {
    if (!prefsParam) return DEFAULT_PREFS;
    try {
      return JSON.parse(atob(prefsParam));
    } catch {
      return DEFAULT_PREFS;
    }
  }, [prefsParam]);

  const [result, setResult] = useState<WeeklyResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<WeeklyMeal | null>(null);
  const [budgetInput, setBudgetInput] = useState<number>(prefs.budget_weekly);
  const [requestNotes, setRequestNotes] = useState<string>("");
  const [includeIngredientsInput, setIncludeIngredientsInput] = useState<string>("");
  const [excludeIngredientsInput, setExcludeIngredientsInput] = useState<string>("");
  const [loadingProgress, setLoadingProgress] = useState(8);
  const [activeLoadingStep, setActiveLoadingStep] = useState(0);

  useEffect(() => {
    setBudgetInput(prefs.budget_weekly);
  }, [prefs.budget_weekly]);

  const runWorkflow = useCallback(async () => {
    const startTime = Date.now();

    setLoading(true);
    setError(null);
    setLoadingProgress(8);
    setActiveLoadingStep(0);

    try {
      const includeIngredients = parseCsvList(includeIngredientsInput);
      const excludeIngredients = parseCsvList(excludeIngredientsInput);

      const requestSections = [
        "Build the best weekly meal plan for me based on my preferences.",
        requestNotes.trim(),
        includeIngredients.length > 0
          ? `Prioritize these ingredients: ${includeIngredients.join(", ")}`
          : "",
        excludeIngredients.length > 0
          ? `Avoid these ingredients: ${excludeIngredients.join(", ")}`
          : "",
      ].filter(Boolean);

      const response = await fetch("/api/ai-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request: requestSections.join("\n"),
          budget: budgetInput,
          numDays: prefs.num_days,
          caloriePreference: prefs.calorie_preference,
          dietaryRestrictions: prefs.dietary_restrictions,
          cuisines: prefs.cuisines,
          preferences: prefs.dietary_restrictions,
          maxDifficulty: prefs.max_difficulty,
          maxCookTimeMin: prefs.max_cook_time_min,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        const firstDetail = Array.isArray(payload?.details)
          ? payload.details[0]
          : null;
        const detailMessage = firstDetail
          ? `${firstDetail.path?.join(".") || "payload"}: ${firstDetail.message}`
          : null;
        throw new Error(detailMessage || payload?.error || "Failed to generate meal plan");
      }

      setResult(payload as WeeklyResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setResult(null);
    } finally {
      const elapsed = Date.now() - startTime;
      if (elapsed < MIN_LOADING_MS) {
        await sleep(MIN_LOADING_MS - elapsed);
      }

      setLoadingProgress(100);
      setActiveLoadingStep(LOADING_STEPS.length - 1);
      setLoading(false);
    }
  }, [
    budgetInput,
    requestNotes,
    includeIngredientsInput,
    excludeIngredientsInput,
    prefs,
  ]);

  useEffect(() => {
    if (!loading) return;

    const startedAt = Date.now();
    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const nextProgress = Math.min(92, 8 + elapsed / 38);
      setLoadingProgress(nextProgress);

      if (nextProgress >= 75) {
        setActiveLoadingStep(3);
      } else if (nextProgress >= 52) {
        setActiveLoadingStep(2);
      } else if (nextProgress >= 28) {
        setActiveLoadingStep(1);
      } else {
        setActiveLoadingStep(0);
      }
    }, 120);

    return () => {
      clearInterval(intervalId);
    };
  }, [loading]);

  useEffect(() => {
    runWorkflow().catch(() => {
      // error state is already handled in runWorkflow
    });
  }, [runWorkflow]);

  const mealsByKey = useMemo(() => {
    const map = new Map<string, WeeklyMeal>();
    for (const meal of result?.meals ?? []) {
      map.set(`${meal.day}-${meal.mealType}`, meal);
    }
    return map;
  }, [result]);

  const dayLabels = Array.from(
    new Set((result?.meals ?? []).sort((a, b) => a.day - b.day).map((m) => m.dayLabel))
  ).slice(0, prefs.num_days);

  const dayCostBreakdown = useMemo(() => {
    const totals = new Map<number, number>();
    for (const meal of result?.meals ?? []) {
      totals.set(meal.day, (totals.get(meal.day) ?? 0) + meal.mealCost);
    }
    return Array.from({ length: prefs.num_days }, (_, day) => ({
      day,
      dayLabel: dayLabels[day] ?? `Day ${day + 1}`,
      cost: Number((totals.get(day) ?? 0).toFixed(2)),
    }));
  }, [result, prefs.num_days, dayLabels]);

  const mealTypeCostBreakdown = useMemo(() => {
    return MEAL_TYPES.map((mealType) => {
      const total = (result?.meals ?? [])
        .filter((meal) => meal.mealType === mealType)
        .reduce((sum, meal) => sum + meal.mealCost, 0);

      return {
        mealType,
        label: MEAL_TYPE_LABELS[mealType],
        total: Number(total.toFixed(2)),
      };
    });
  }, [result]);

  const topCostItems = useMemo(() => {
    return [...(result?.costs.shoppingItems ?? [])]
      .sort((a, b) => b.itemCost - a.itemCost)
      .slice(0, 6);
  }, [result]);

  return (
    <main className="min-h-screen pb-12">
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link href="/" className="text-xl font-bold">
              BudgetBite
            </Link>
          </div>
          {result && (
            <div className="text-right">
              <div className="text-sm text-muted">Shopping Total</div>
              <div className="text-2xl font-bold text-primary">
                ${result.summary.totalPrice.toFixed(2)}
              </div>
              <div className="text-xs text-muted">
                ${result.summary.pricePerServing.toFixed(2)} per serving
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-6 space-y-4">
        {result?.summary.budgetExceeded && (
          <div className="bg-warning-bg border border-warning rounded-lg px-4 py-3 text-sm">
            The generated AI plan is over budget by ${
              (result.summary.totalPrice - result.summary.budget).toFixed(2)
            }. Try adjusting preferences or increasing budget.
          </div>
        )}

        {loading && <MealPlanLoadingScreen progress={loadingProgress} activeStep={activeLoadingStep} />}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-danger">
            {error}
          </div>
        )}

        {result && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Your {prefs.num_days}-day Meal Viewer
              </h2>
              <div className="flex gap-2">
                <Link
                  href={`/wizard?from=results&prefs=${prefsParam ?? ""}`}
                  className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-secondary transition-colors"
                >
                  Edit Preferences
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs text-muted">Weekly Total</p>
                <p className="text-2xl font-bold">${result.summary.totalPrice.toFixed(2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs text-muted">Price Per Serving</p>
                <p className="text-2xl font-bold">${result.summary.pricePerServing.toFixed(2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs text-muted">Budget</p>
                <p className="text-2xl font-bold">${result.summary.budget.toFixed(2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs text-muted">Difference</p>
                <p className={`text-2xl font-bold ${result.summary.budgetExceeded ? "text-danger" : "text-primary"}`}>
                  {result.summary.budgetExceeded ? "-" : "+"}
                  ${Math.abs(result.summary.budget - result.summary.totalPrice).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div
                className="grid gap-3 min-w-[700px]"
                style={{ gridTemplateColumns: `90px repeat(${prefs.num_days}, 1fr)` }}
              >
                <div />
                {dayLabels.map((label, i) => (
                  <div key={i} className="text-center text-sm font-semibold py-2 text-muted">
                    {label}
                  </div>
                ))}

                {MEAL_TYPES.map((mealType) => (
                  <Fragment key={`row-${mealType}`}>
                    <div className="flex items-center text-sm font-medium text-muted">
                      {MEAL_TYPE_LABELS[mealType]}
                    </div>
                    {Array.from({ length: prefs.num_days }, (_, day) => {
                      const meal = mealsByKey.get(`${day}-${mealType}`);

                      if (!meal) {
                        return (
                          <div
                            key={`${day}-${mealType}`}
                            className="border border-dashed border-border rounded-xl p-3 flex items-center justify-center text-xs text-muted"
                          >
                            No meal
                          </div>
                        );
                      }

                      return (
                        <button
                          key={meal.id}
                          onClick={() => setSelectedMeal(meal)}
                          className="text-left border border-border rounded-xl p-3 bg-card hover:border-primary hover:shadow-sm transition-all"
                        >
                          <p className="font-semibold text-sm leading-snug line-clamp-2">
                            {meal.recipeName}
                          </p>
                          <p className="text-xs text-muted mt-1 line-clamp-2">
                            {meal.description}
                          </p>
                          <p className="text-xs text-primary font-medium mt-2">
                            ${meal.mealCost.toFixed(2)} est.
                          </p>
                        </button>
                      );
                    })}
                  </Fragment>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold mb-3">What to buy this week</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="py-2 pr-3">Ingredient</th>
                      <th className="py-2 pr-3">Quantity</th>
                      <th className="py-2 pr-3">Unit price</th>
                      <th className="py-2 pr-3">Item cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.costs.shoppingItems.map((item) => (
                      <tr
                        key={`${item.ingredientName}-${item.quantity}`}
                        className="border-b border-border/60"
                      >
                        <td className="py-2 pr-3">{item.ingredientName}</td>
                        <td className="py-2 pr-3">{item.quantity}</td>
                        <td className="py-2 pr-3">${item.unitPrice.toFixed(2)}</td>
                        <td className="py-2 pr-3 font-semibold">${item.itemCost.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-semibold mb-3">Cost by day</h3>
                <div className="space-y-2">
                  {dayCostBreakdown.map((entry) => (
                    <div key={entry.day} className="flex items-center justify-between text-sm">
                      <span>{entry.dayLabel}</span>
                      <span className="font-semibold">${entry.cost.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-semibold mb-3">Cost by meal type</h3>
                <div className="space-y-2">
                  {mealTypeCostBreakdown.map((entry) => (
                    <div key={entry.mealType} className="flex items-center justify-between text-sm">
                      <span>{entry.label}</span>
                      <span className="font-semibold">${entry.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold mb-3">Most expensive items</h3>
              <div className="grid gap-2 md:grid-cols-2">
                {topCostItems.map((item) => (
                  <div
                    key={`top-${item.ingredientName}-${item.quantity}`}
                    className="flex items-center justify-between text-sm border border-border rounded-lg px-3 py-2"
                  >
                    <span className="truncate pr-3">{item.ingredientName}</span>
                    <span className="font-semibold">${item.itemCost.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <h3 className="font-semibold">Plan Controls</h3>
              <p className="text-sm text-muted">
                Change budget, ask for different style/taste, and include or avoid ingredients, then regenerate.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm">
                  <span className="block mb-1 font-medium">Budget (AUD)</span>
                  <input
                    type="number"
                    min={1}
                    step="0.5"
                    value={budgetInput}
                    onChange={(e) => setBudgetInput(Number(e.target.value))}
                    className="w-full rounded-lg border border-border px-3 py-2"
                  />
                </label>
                <label className="text-sm">
                  <span className="block mb-1 font-medium">Include ingredients (comma-separated)</span>
                  <input
                    value={includeIngredientsInput}
                    onChange={(e) => setIncludeIngredientsInput(e.target.value)}
                    placeholder="e.g. chicken, spinach, rice"
                    className="w-full rounded-lg border border-border px-3 py-2"
                  />
                </label>
                <label className="text-sm md:col-span-2">
                  <span className="block mb-1 font-medium">Avoid ingredients (comma-separated)</span>
                  <input
                    value={excludeIngredientsInput}
                    onChange={(e) => setExcludeIngredientsInput(e.target.value)}
                    placeholder="e.g. dairy, peanuts"
                    className="w-full rounded-lg border border-border px-3 py-2"
                  />
                </label>
                <label className="text-sm md:col-span-2">
                  <span className="block mb-1 font-medium">Recipe notes</span>
                  <textarea
                    value={requestNotes}
                    onChange={(e) => setRequestNotes(e.target.value)}
                    rows={3}
                    placeholder="e.g. Make dinners quick and higher protein, keep lunches cold-friendly"
                    className="w-full rounded-lg border border-border px-3 py-2"
                  />
                </label>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setBudgetInput(prefs.budget_weekly);
                    setRequestNotes("");
                    setIncludeIngredientsInput("");
                    setExcludeIngredientsInput("");
                  }}
                  className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-secondary transition-colors"
                >
                  Reset Controls
                </button>
                <button
                  onClick={() => {
                    runWorkflow().catch(() => {
                      // handled in runWorkflow
                    });
                  }}
                  className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Regenerate Plan
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {selectedMeal && (
        <AIMealDetailModal meal={selectedMeal} onClose={() => setSelectedMeal(null)} />
      )}
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen px-4 py-6 max-w-6xl mx-auto">
          <MealPlanLoadingScreen progress={24} activeStep={1} />
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
