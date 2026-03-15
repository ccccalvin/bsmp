import {
  UserPreferences,
  Product,
  Compromise,
  Cuisine,
} from "./types";
import { generateMealPlan } from "./planner";
import { recipes } from "@/data/recipes";
import { products as allProducts } from "@/data/productsFromIngredients";
import { CUISINE_LABELS } from "@/data/constants";

/**
 * Runs a simulated meal plan from the current wizard preferences
 * and detects compromises the user would face at this budget.
 */
export function analyzeWizardCompromises(
  prefs: UserPreferences
): Compromise[] {
  const plan = generateMealPlan(prefs, recipes, allProducts);
  const compromises: Compromise[] = [];

  // 1. Over budget
  if (plan.over_budget) {
    const overage = plan.total_shopping_cost - plan.budget;
    compromises.push({
      category: "over_budget",
      severity: "critical",
      message: `Estimated plan costs $${overage.toFixed(2)} over your $${plan.budget.toFixed(0)} budget.`,
    });
  }

  // 2. Cuisine mismatch
  if (prefs.cuisines.length > 0) {
    const planCuisines = new Set(plan.slots.map((s) => s.recipe.cuisine));
    const missing = prefs.cuisines.filter((c) => !planCuisines.has(c));
    for (const cuisine of missing) {
      compromises.push({
        category: "cuisine_mismatch",
        severity: "warning",
        message: `No ${CUISINE_LABELS[cuisine as Cuisine] ?? cuisine} meals — too expensive at this budget.`,
      });
    }
  }

  // 3. Meal repetition (3+ times)
  const recipeCounts = new Map<string, { name: string; count: number }>();
  for (const slot of plan.slots) {
    const entry = recipeCounts.get(slot.recipe.id);
    if (entry) {
      entry.count++;
    } else {
      recipeCounts.set(slot.recipe.id, { name: slot.recipe.name, count: 1 });
    }
  }
  for (const [, { name, count }] of recipeCounts) {
    if (count >= 3) {
      compromises.push({
        category: "meal_repetition",
        severity: "warning",
        message: `"${name}" would appear ${count} times.`,
      });
    }
  }

  // 4. Low meal diversity
  if (plan.slots.length > 3) {
    const uniqueCount = recipeCounts.size;
    const ratio = uniqueCount / plan.slots.length;
    if (ratio < 0.6) {
      compromises.push({
        category: "low_meal_diversity",
        severity: "warning",
        message: `Only ${uniqueCount} unique meals across ${plan.slots.length} slots.`,
      });
    }
  }

  // 5. Low protein variety
  const proteinProductIds = new Set(
    allProducts
      .filter((p: Product) => p.category === "protein")
      .map((p: Product) => p.id)
  );
  const usedProteins = new Set<string>();
  for (const slot of plan.slots) {
    for (const ing of slot.recipe.ingredients) {
      if (proteinProductIds.has(ing.product_id)) {
        usedProteins.add(ing.product_id);
      }
    }
  }
  if (usedProteins.size < 3 && plan.slots.length > 3) {
    const proteinNames = [...usedProteins].map((id) =>
      id.replace(/_/g, " ")
    );
    compromises.push({
      category: "low_protein_variety",
      severity: "info",
      message: `Only ${usedProteins.size} protein source${usedProteins.size === 1 ? "" : "s"} (${proteinNames.join(", ")}).`,
    });
  }

  return compromises;
}
