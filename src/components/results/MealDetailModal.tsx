"use client";

import { MealSlot } from "@/lib/types";
import { CUISINE_LABELS, DIFFICULTY_LABELS } from "@/data/constants";

interface MealDetailModalProps {
  slot: MealSlot;
  onClose: () => void;
}

export default function MealDetailModal({
  slot,
  onClose,
}: MealDetailModalProps) {
  const recipe = slot.recipe;
  const totalCals =
    recipe.calories_per_serving;
  const totalProtein = recipe.protein_per_serving;
  const totalCarbs = recipe.carbs_per_serving;
  const totalFat = recipe.fat_per_serving;
  const macroTotal = totalProtein + totalCarbs + totalFat;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">{recipe.name}</h2>
              <div className="flex gap-2 mt-2 text-xs">
                <span className="bg-primary-light text-primary-dark px-2 py-1 rounded-full font-medium">
                  {CUISINE_LABELS[recipe.cuisine]}
                </span>
                <span className="bg-secondary text-muted px-2 py-1 rounded-full">
                  {DIFFICULTY_LABELS[recipe.difficulty]}
                </span>
                <span className="bg-secondary text-muted px-2 py-1 rounded-full">
                  {recipe.cook_time_min} min
                </span>
                <span className="bg-secondary text-muted px-2 py-1 rounded-full">
                  {recipe.servings} servings
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-muted hover:text-foreground text-xl leading-none p-1"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Macros */}
        <div className="p-6 border-b border-border">
          <h3 className="text-sm font-medium mb-3">Nutrition per serving</h3>
          <div className="grid grid-cols-4 gap-3 text-center text-sm">
            <div>
              <div className="text-lg font-bold">{totalCals}</div>
              <div className="text-xs text-muted">Calories</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">{totalProtein}g</div>
              <div className="text-xs text-muted">Protein</div>
            </div>
            <div>
              <div className="text-lg font-bold text-amber-600">{totalCarbs}g</div>
              <div className="text-xs text-muted">Carbs</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-500">{totalFat}g</div>
              <div className="text-xs text-muted">Fat</div>
            </div>
          </div>
          {/* Macro bar */}
          {macroTotal > 0 && (
            <div className="flex h-2 rounded-full overflow-hidden mt-3">
              <div
                className="bg-blue-500"
                style={{ width: `${(totalProtein / macroTotal) * 100}%` }}
              />
              <div
                className="bg-amber-500"
                style={{ width: `${(totalCarbs / macroTotal) * 100}%` }}
              />
              <div
                className="bg-red-400"
                style={{ width: `${(totalFat / macroTotal) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Ingredients */}
        <div className="p-6 border-b border-border">
          <h3 className="text-sm font-medium mb-3">Ingredients</h3>
          <ul className="space-y-1.5">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="flex justify-between text-sm">
                <span>{ing.name}</span>
                <span className="text-muted">{ing.quantity_g}g</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="p-6">
          <h3 className="text-sm font-medium mb-3">Instructions</h3>
          <ol className="space-y-2">
            {recipe.instructions.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm">
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
