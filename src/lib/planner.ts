import {
  UserPreferences,
  Recipe,
  Product,
  MealPlan,
  MealSlot,
  MealType,
  ScoredRecipe,
} from "./types";
import { scoreAllRecipes } from "./scoring";
import { buildShoppingList } from "./shopping";
import { DAY_LABELS } from "@/data/constants";

const MEAL_TYPES: MealType[] = ["breakfast", "lunch", "dinner"];

export function generateMealPlan(
  prefs: UserPreferences,
  recipes: Recipe[],
  products: Product[]
): MealPlan {
  const scored = scoreAllRecipes(recipes, prefs, products);

  // Separate by meal type
  const pools: Record<MealType, ScoredRecipe[]> = {
    breakfast: scored.filter((s) =>
      s.recipe.meal_types.includes("breakfast")
    ),
    lunch: scored.filter((s) => s.recipe.meal_types.includes("lunch")),
    dinner: scored.filter((s) => s.recipe.meal_types.includes("dinner")),
  };

  const slots: MealSlot[] = [];
  let warning: string | undefined;

  // Check if any pool is empty
  for (const mt of MEAL_TYPES) {
    if (pools[mt].length === 0) {
      warning =
        "Limited recipes match your filters. Some meals may not be available.";
    }
  }

  for (let day = 0; day < prefs.num_days; day++) {
    for (const mealType of MEAL_TYPES) {
      const pool = pools[mealType];
      if (pool.length === 0) continue;

      // Find best candidate with variety check
      let chosen: ScoredRecipe | null = null;
      for (const candidate of pool) {
        // Check variety: avoid same recipe in the same meal slot on the previous day
        const prevDaySameSlot = slots.find(
          (s) => s.day === day - 1 && s.meal_type === mealType
        );
        if (
          prevDaySameSlot &&
          prevDaySameSlot.recipe.id === candidate.recipe.id &&
          pool.length > 1
        ) {
          continue;
        }
        chosen = candidate;
        break;
      }

      // Fallback: just pick the best one
      if (!chosen) {
        chosen = pool[0];
      }

      slots.push({
        day,
        day_label: DAY_LABELS[day],
        meal_type: mealType,
        recipe: chosen.recipe,
        cost_per_serving: chosen.cost.per_serving,
        shopping_cost: chosen.cost.shopping_total / chosen.recipe.servings,
      });
    }
  }

  // Compute real shopping list for accurate totals
  const shoppingList = buildShoppingList(slots, products);

  const totalPerServing = slots.reduce((sum, s) => sum + s.cost_per_serving, 0);

  return {
    slots,
    total_shopping_cost: shoppingList.total,
    total_per_serving_cost: totalPerServing,
    budget: prefs.budget_weekly,
    over_budget: shoppingList.total > prefs.budget_weekly,
    warning,
  };
}

export function swapMealInPlan(
  plan: MealPlan,
  day: number,
  mealType: MealType,
  scoredRecipes: ScoredRecipe[],
  products: Product[]
): MealPlan {
  const currentSlot = plan.slots.find(
    (s) => s.day === day && s.meal_type === mealType
  );
  if (!currentSlot) return plan;

  // Get recipes in the plan for this meal type
  const usedRecipeIds = new Set(
    plan.slots
      .filter((s) => s.meal_type === mealType)
      .map((s) => s.recipe.id)
  );

  // Find pool for this meal type
  const pool = scoredRecipes.filter((s) =>
    s.recipe.meal_types.includes(mealType)
  );

  // Find next best recipe not currently used
  let replacement = pool.find((s) => !usedRecipeIds.has(s.recipe.id));

  // If all are used, pick the next one that isn't the current one
  if (!replacement) {
    replacement = pool.find((s) => s.recipe.id !== currentSlot.recipe.id);
  }

  if (!replacement) return plan;

  const newSlots = plan.slots.map((s) => {
    if (s.day === day && s.meal_type === mealType) {
      return {
        ...s,
        recipe: replacement!.recipe,
        cost_per_serving: replacement!.cost.per_serving,
        shopping_cost:
          replacement!.cost.shopping_total / replacement!.recipe.servings,
      };
    }
    return s;
  });

  const shoppingList = buildShoppingList(newSlots, products);
  const totalPerServing = newSlots.reduce(
    (sum, s) => sum + s.cost_per_serving,
    0
  );

  return {
    slots: newSlots,
    total_shopping_cost: shoppingList.total,
    total_per_serving_cost: totalPerServing,
    budget: plan.budget,
    over_budget: shoppingList.total > plan.budget,
    warning: plan.warning,
  };
}
