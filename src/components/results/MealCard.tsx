"use client";

import { MealSlot, CostDisplayMode } from "@/lib/types";

interface MealCardProps {
  slot: MealSlot;
  costMode: CostDisplayMode;
  onSwap: () => void;
  onClick: () => void;
}

export default function MealCard({
  slot,
  costMode,
  onSwap,
  onClick,
}: MealCardProps) {
  const displayCost =
    costMode === "per_serving" ? slot.cost_per_serving : slot.shopping_cost;

  return (
    <div
      className="group bg-card border border-border rounded-xl p-3 cursor-pointer hover:border-primary hover:shadow-sm transition-all relative"
      onClick={onClick}
    >
      {/* Swap button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSwap();
        }}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-secondary border border-border rounded-md px-2 py-1 text-xs text-muted hover:text-foreground hover:bg-primary-light"
        title="Swap meal"
      >
        &#x21c4;
      </button>

      <h4 className="text-sm font-medium leading-tight mb-2 pr-8">
        {slot.recipe.name}
      </h4>

      <div className="flex flex-wrap gap-1.5 text-xs">
        <span className="bg-primary-light text-primary-dark px-2 py-0.5 rounded-full font-medium">
          ${displayCost.toFixed(2)}
        </span>
        <span className="bg-secondary text-muted px-2 py-0.5 rounded-full">
          {slot.recipe.calories_per_serving} cal
        </span>
        <span className="bg-secondary text-muted px-2 py-0.5 rounded-full">
          {slot.recipe.protein_per_serving}g protein
        </span>
      </div>
    </div>
  );
}
