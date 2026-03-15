"use client";

import { Cuisine, Difficulty } from "@/lib/types";
import { CUISINE_LABELS, DIFFICULTY_LABELS } from "@/data/constants";

interface StepPreferencesProps {
  cuisines: Cuisine[];
  difficulty: Difficulty;
  cookTime: number;
  onCuisinesChange: (v: Cuisine[]) => void;
  onDifficultyChange: (v: Difficulty) => void;
  onCookTimeChange: (v: number) => void;
}

const CUISINE_OPTIONS = Object.entries(CUISINE_LABELS) as [Cuisine, string][];
const DIFFICULTY_OPTIONS = Object.entries(DIFFICULTY_LABELS) as [Difficulty, string][];

export default function StepPreferences({
  cuisines,
  difficulty,
  cookTime,
  onCuisinesChange,
  onDifficultyChange,
  onCookTimeChange,
}: StepPreferencesProps) {
  const toggleCuisine = (c: Cuisine) => {
    if (cuisines.includes(c)) {
      onCuisinesChange(cuisines.filter((x) => x !== c));
    } else {
      onCuisinesChange([...cuisines, c]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cuisine */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Cuisine preference <span className="text-muted font-normal">(pick any)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {CUISINE_OPTIONS.map(([value, label]) => (
            <button
              key={value}
              onClick={() => toggleCuisine(value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                cuisines.includes(value)
                  ? "bg-primary text-white"
                  : "bg-secondary border border-border hover:bg-primary-light"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {cuisines.length === 0 && (
          <p className="text-xs text-muted mt-1">No preference — all cuisines included</p>
        )}
      </div>

      {/* Difficulty */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Cooking difficulty
        </label>
        <div className="grid grid-cols-2 gap-3">
          {DIFFICULTY_OPTIONS.map(([value, label]) => (
            <button
              key={value}
              onClick={() => onDifficultyChange(value)}
              className={`p-3 rounded-xl border text-center text-sm font-medium transition-colors ${
                difficulty === value
                  ? "border-primary bg-primary-light"
                  : "border-border hover:bg-secondary"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Cook time */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Max cooking time
        </label>
        <div className="flex items-center gap-4">
          <span className="text-lg font-bold text-primary">{cookTime} min</span>
          <input
            type="range"
            min={10}
            max={60}
            step={5}
            value={cookTime}
            onChange={(e) => onCookTimeChange(Number(e.target.value))}
            className="flex-1 accent-primary"
          />
        </div>
        <div className="flex justify-between text-xs text-muted mt-1">
          <span>10 min</span>
          <span>60 min</span>
        </div>
      </div>
    </div>
  );
}
