"use client";

import { CaloriePreference, DietaryRestriction } from "@/lib/types";

interface StepDietProps {
  calorie: CaloriePreference;
  restrictions: DietaryRestriction[];
  onCalorieChange: (v: CaloriePreference) => void;
  onRestrictionsChange: (v: DietaryRestriction[]) => void;
}

const CALORIE_OPTIONS: { value: CaloriePreference; label: string; desc: string }[] = [
  { value: "low", label: "Low Calorie", desc: "300-500 cal/meal" },
  { value: "balanced", label: "Balanced", desc: "450-650 cal/meal" },
  { value: "high", label: "High Calorie", desc: "600-900 cal/meal" },
];

const RESTRICTION_OPTIONS: { value: DietaryRestriction; label: string }[] = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "halal", label: "Halal" },
  { value: "no_dairy", label: "No Dairy" },
  { value: "high_protein", label: "High Protein" },
];

export default function StepDiet({
  calorie,
  restrictions,
  onCalorieChange,
  onRestrictionsChange,
}: StepDietProps) {
  const toggleRestriction = (r: DietaryRestriction) => {
    if (restrictions.includes(r)) {
      onRestrictionsChange(restrictions.filter((x) => x !== r));
    } else {
      onRestrictionsChange([...restrictions, r]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Calorie preference */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Calorie preference
        </label>
        <div className="grid grid-cols-3 gap-3">
          {CALORIE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onCalorieChange(opt.value)}
              className={`p-3 rounded-xl border text-center transition-colors ${
                calorie === opt.value
                  ? "border-primary bg-primary-light"
                  : "border-border hover:bg-secondary"
              }`}
            >
              <div className="text-sm font-medium">{opt.label}</div>
              <div className="text-xs text-muted mt-1">{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Dietary restrictions */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Dietary preferences <span className="text-muted font-normal">(optional)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {RESTRICTION_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => toggleRestriction(opt.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                restrictions.includes(opt.value)
                  ? "bg-primary text-white"
                  : "bg-secondary border border-border hover:bg-primary-light"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
