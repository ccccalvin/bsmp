"use client";

interface StepBudgetProps {
  budget: number;
  days: number;
  onBudgetChange: (v: number) => void;
  onDaysChange: (v: number) => void;
}

const DAY_OPTIONS = [1, 2, 3, 4, 5, 6, 7];

export default function StepBudget({
  budget,
  days,
  onBudgetChange,
  onDaysChange,
}: StepBudgetProps) {
  return (
    <div className="space-y-6">
      {/* Budget */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Weekly budget
        </label>
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold text-primary">${budget}</span>
          <input
            type="range"
            min={10}
            max={150}
            step={5}
            value={budget}
            onChange={(e) => onBudgetChange(Number(e.target.value))}
            className="flex-1 accent-primary"
          />
        </div>
        <div className="flex justify-between text-xs text-muted mt-1">
          <span>$10</span>
          <span>$150</span>
        </div>
      </div>

      {/* Number of days */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Number of days
        </label>
        <div className="flex gap-2">
          {DAY_OPTIONS.map((d) => (
            <button
              key={d}
              onClick={() => onDaysChange(d)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                days === d
                  ? "bg-primary text-white"
                  : "bg-secondary border border-border hover:bg-primary-light"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-secondary rounded-lg p-3 text-sm text-muted">
        That&apos;s about <strong className="text-foreground">${(budget / days / 3).toFixed(2)}</strong> per meal
        ({days * 3} meals total)
      </div>
    </div>
  );
}
