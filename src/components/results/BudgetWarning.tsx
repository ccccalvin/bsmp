"use client";

interface BudgetWarningProps {
  total: number;
  budget: number;
}

export default function BudgetWarning({ total, budget }: BudgetWarningProps) {
  const overage = total - budget;

  return (
    <div className="bg-warning-bg border border-warning rounded-lg px-4 py-3 text-sm">
      <span className="font-medium">Budget exceeded</span> — estimated cost is{" "}
      <strong>${total.toFixed(2)}</strong>, which is{" "}
      <strong>${overage.toFixed(2)}</strong> over your ${budget.toFixed(0)}{" "}
      budget. Try increasing your budget or relaxing dietary filters.
    </div>
  );
}
