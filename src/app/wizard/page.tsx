"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPreferences, CaloriePreference, Cuisine, Difficulty, DietaryRestriction } from "@/lib/types";
import StepBudget from "@/components/wizard/StepBudget";
import StepDiet from "@/components/wizard/StepDiet";
import StepPreferences from "@/components/wizard/StepPreferences";

const STEPS = ["Budget", "Diet", "Preferences"];

const DEFAULT_PREFS: UserPreferences = {
  budget_weekly: 50,
  num_days: 5,
  calorie_preference: "balanced",
  dietary_restrictions: [],
  cuisines: [],
  max_difficulty: "medium",
  max_cook_time_min: 30,
};

export default function WizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [prefs, setPrefs] = useState<UserPreferences>(DEFAULT_PREFS);

  const updatePrefs = (partial: Partial<UserPreferences>) => {
    setPrefs((prev) => ({ ...prev, ...partial }));
  };

  const handleGenerate = () => {
    const encoded = btoa(JSON.stringify(prefs));
    router.push(`/results?prefs=${encoded}`);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-2">Plan your meals</h1>
        <p className="text-muted text-center mb-8 text-sm">
          Step {step + 1} of {STEPS.length}: {STEPS[step]}
        </p>

        {/* Step indicator */}
        <div className="flex gap-2 mb-8 justify-center">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i <= step ? "bg-primary w-12" : "bg-border w-8"
              }`}
            />
          ))}
        </div>

        {/* Step content */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          {step === 0 && (
            <StepBudget
              budget={prefs.budget_weekly}
              days={prefs.num_days}
              onBudgetChange={(v) => updatePrefs({ budget_weekly: v })}
              onDaysChange={(v) => updatePrefs({ num_days: v })}
            />
          )}
          {step === 1 && (
            <StepDiet
              calorie={prefs.calorie_preference}
              restrictions={prefs.dietary_restrictions}
              onCalorieChange={(v: CaloriePreference) =>
                updatePrefs({ calorie_preference: v })
              }
              onRestrictionsChange={(v: DietaryRestriction[]) =>
                updatePrefs({ dietary_restrictions: v })
              }
            />
          )}
          {step === 2 && (
            <StepPreferences
              cuisines={prefs.cuisines}
              difficulty={prefs.max_difficulty}
              cookTime={prefs.max_cook_time_min}
              onCuisinesChange={(v: Cuisine[]) => updatePrefs({ cuisines: v })}
              onDifficultyChange={(v: Difficulty) =>
                updatePrefs({ max_difficulty: v })
              }
              onCookTimeChange={(v: number) =>
                updatePrefs({ max_cook_time_min: v })
              }
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="px-6 py-2 rounded-lg border border-border text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-secondary transition-colors"
          >
            Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="px-6 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              className="px-6 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              Generate Meal Plan
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
