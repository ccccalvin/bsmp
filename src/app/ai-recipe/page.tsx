"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

type WorkflowResult = {
  request: string;
  budget: number;
  budgetExceeded: boolean;
  recipe: {
    name: string;
    description: string;
    servings: number;
    steps: string[];
  };
  costs: {
    totalPrice: number;
    pricePerServing: number;
    shoppingItems: Array<{
      ingredientName: string;
      quantity: string;
      unitsToBuy: number;
      unitPrice: number;
      itemCost: number;
      unit: string;
      imageUrl: string | null;
    }>;
  };
};

const CUISINES = ["asian", "western", "indian", "mediterranean"];
const PREFERENCES = ["high_protein", "vegetarian", "no_dairy", "cheap"];

export default function AiRecipePage() {
  const [request, setRequest] = useState(
    "I want a quick high-protein dinner that feels fresh and not too heavy."
  );
  const [budget, setBudget] = useState(35);
  const [cuisines, setCuisines] = useState<string[]>(["asian"]);
  const [preferences, setPreferences] = useState<string[]>(["high_protein"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<WorkflowResult | null>(null);

  const toggleArrayValue = (
    value: string,
    values: string[],
    setValues: (next: string[]) => void
  ) => {
    setValues(
      values.includes(value)
        ? values.filter((v) => v !== value)
        : [...values, value]
    );
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request, budget, cuisines, preferences }),
      });

      const payload = await response.json();

      if (!response.ok) {
        const firstDetail = Array.isArray(payload?.details)
          ? payload.details[0]
          : null;
        const detailMessage = firstDetail
          ? `${firstDetail.path?.join(".") || "payload"}: ${firstDetail.message}`
          : null;
        throw new Error(detailMessage || payload?.error || "Workflow request failed");
      }

      setResult(payload as WorkflowResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-[420px_1fr]">
        <section className="bg-card border border-border rounded-2xl p-6 shadow-sm h-fit">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h1 className="text-2xl font-bold">AI Recipe Workflow</h1>
            <Link
              href="/"
              className="text-sm underline underline-offset-4 hover:text-primary"
            >
              Home
            </Link>
          </div>

          <p className="text-sm text-muted mb-6">
            Your prompt and preferences are sent through two agents: ingredient
            selection from ingredients.json, then recipe generation with pricing.
          </p>

          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">Meal request</label>
              <textarea
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                rows={5}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Budget (AUD)</label>
              <input
                type="number"
                min={1}
                step="0.5"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              />
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Cuisine preference</p>
              <div className="flex flex-wrap gap-2">
                {CUISINES.map((cuisine) => (
                  <button
                    type="button"
                    key={cuisine}
                    onClick={() => toggleArrayValue(cuisine, cuisines, setCuisines)}
                    className={`px-3 py-1.5 rounded-full text-sm border ${
                      cuisines.includes(cuisine)
                        ? "bg-primary text-white border-primary"
                        : "border-border hover:bg-secondary"
                    }`}
                  >
                    {cuisine}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Meal preferences</p>
              <div className="flex flex-wrap gap-2">
                {PREFERENCES.map((preference) => (
                  <button
                    type="button"
                    key={preference}
                    onClick={() =>
                      toggleArrayValue(preference, preferences, setPreferences)
                    }
                    className={`px-3 py-1.5 rounded-full text-sm border ${
                      preferences.includes(preference)
                        ? "bg-primary text-white border-primary"
                        : "border-border hover:bg-secondary"
                    }`}
                  >
                    {preference}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Generating..." : "Run workflow"}
            </button>
          </form>

          {error && (
            <p className="mt-4 text-sm text-danger bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </section>

        <section className="space-y-4">
          {!result && (
            <div className="rounded-2xl border border-border bg-card p-6 text-muted">
              Run the workflow to see a generated recipe and cost breakdown.
            </div>
          )}

          {result && (
            <>
              <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
                <h2 className="text-2xl font-bold">{result.recipe.name}</h2>
                <p className="text-muted">{result.recipe.description}</p>
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="px-3 py-1 rounded-full bg-secondary border border-border">
                    Servings: {result.recipe.servings}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-secondary border border-border">
                    Total: ${result.costs.totalPrice.toFixed(2)}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-secondary border border-border">
                    Per serving: ${result.costs.pricePerServing.toFixed(2)}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full border ${
                      result.budgetExceeded
                        ? "bg-red-50 text-danger border-red-200"
                        : "bg-green-50 text-green-700 border-green-200"
                    }`}
                  >
                    Budget {result.budgetExceeded ? "exceeded" : "ok"}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-semibold mb-3">Cooking steps</h3>
                <ol className="space-y-2 text-sm list-decimal pl-5">
                  {result.recipe.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-semibold mb-3">Shopping costs</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="py-2 pr-3">Ingredient</th>
                        <th className="py-2 pr-3">Qty</th>
                        <th className="py-2 pr-3">Unit price</th>
                        <th className="py-2 pr-3">Item cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.costs.shoppingItems.map((item) => (
                        <tr key={`${item.ingredientName}-${item.quantity}`} className="border-b border-border/60">
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
            </>
          )}
        </section>
      </div>
    </main>
  );
}
