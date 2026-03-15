import {
  Recipe,
  Product,
  UserPreferences,
  ScoreWeights,
  ScoredRecipe,
  DietaryRestriction,
} from "./types";
import { calcRecipeCost } from "./cost";
import { DEFAULT_WEIGHTS, CALORIE_TARGETS } from "@/data/constants";

export function filterRecipes(
  recipes: Recipe[],
  prefs: UserPreferences
): Recipe[] {
  return recipes.filter((r) => {
    // Hard filter: vegetarian
    if (
      prefs.dietary_restrictions.includes("vegetarian") &&
      !r.tags.includes("vegetarian")
    ) {
      return false;
    }

    // Hard filter: no dairy
    if (
      prefs.dietary_restrictions.includes("no_dairy") &&
      !r.tags.includes("no_dairy") &&
      r.ingredients.some((i) =>
        ["milk", "cheese", "butter", "greek_yogurt"].includes(i.product_id)
      )
    ) {
      return false;
    }

    // Hard filter: difficulty
    if (prefs.max_difficulty === "very_easy" && r.difficulty !== "very_easy") {
      return false;
    }

    return true;
  });
}

export function scoreRecipe(
  recipe: Recipe,
  cost: { per_serving: number },
  prefs: UserPreferences,
  weights: ScoreWeights,
  maxCostPerServing: number
): ScoredRecipe {
  // 1. Affordability (0-1, higher = cheaper)
  const affordability =
    maxCostPerServing > 0
      ? 1 - cost.per_serving / maxCostPerServing
      : 1;

  // 2. Nutrition match (0-1)
  const target = CALORIE_TARGETS[prefs.calorie_preference];
  const cal = recipe.calories_per_serving;
  let calorieScore: number;
  if (cal >= target.min && cal <= target.max) {
    calorieScore = 1.0;
  } else {
    const distance = Math.min(
      Math.abs(cal - target.min),
      Math.abs(cal - target.max)
    );
    calorieScore = Math.max(0, 1 - distance / 300);
  }

  let proteinScore = 0.5;
  if (prefs.dietary_restrictions.includes("high_protein" as DietaryRestriction)) {
    proteinScore = Math.min(1.0, recipe.protein_per_serving / 40);
  }

  const nutritionScore = calorieScore * 0.6 + proteinScore * 0.4;

  // 3. Cuisine match (0-1, soft preference)
  let cuisineScore: number;
  if (prefs.cuisines.length === 0) {
    cuisineScore = 0.5;
  } else if (prefs.cuisines.includes(recipe.cuisine)) {
    cuisineScore = 1.0;
  } else {
    cuisineScore = 0.2;
  }

  // 4. Ease (0-1)
  const diffScore = recipe.difficulty === "very_easy" ? 1.0 : 0.5;
  let timeScore: number;
  if (recipe.cook_time_min <= prefs.max_cook_time_min) {
    timeScore = 1 - recipe.cook_time_min / (prefs.max_cook_time_min * 2);
  } else {
    timeScore = Math.max(
      0,
      0.3 - (recipe.cook_time_min - prefs.max_cook_time_min) / 60
    );
  }
  const easeScore = diffScore * 0.5 + timeScore * 0.5;

  // Weighted total
  const totalScore =
    weights.affordability * affordability +
    weights.nutrition * nutritionScore +
    weights.cuisine * cuisineScore +
    weights.ease * easeScore;

  const recipeCost = calcRecipeCost(recipe, []);

  return {
    recipe,
    cost: { ...recipeCost, per_serving: cost.per_serving },
    total_score: totalScore,
    affordability_score: affordability,
    nutrition_score: nutritionScore,
    cuisine_score: cuisineScore,
    ease_score: easeScore,
  };
}

export function scoreAllRecipes(
  recipes: Recipe[],
  prefs: UserPreferences,
  products: Product[]
): ScoredRecipe[] {
  const eligible = filterRecipes(recipes, prefs);
  const recipesToScore = eligible.length > 0 ? eligible : recipes;

  const costsMap = recipesToScore.map((r) => ({
    recipe: r,
    cost: calcRecipeCost(r, products),
  }));

  const maxCost = Math.max(...costsMap.map((c) => c.cost.per_serving), 1);

  const scored = costsMap.map(({ recipe, cost }) =>
    scoreRecipe(recipe, cost, prefs, DEFAULT_WEIGHTS, maxCost)
  );

  // Patch the full cost object back (scoreRecipe doesn't have access to products)
  for (let i = 0; i < scored.length; i++) {
    scored[i].cost = costsMap[i].cost;
  }

  scored.sort((a, b) => b.total_score - a.total_score);
  return scored;
}
